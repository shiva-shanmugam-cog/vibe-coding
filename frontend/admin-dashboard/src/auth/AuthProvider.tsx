import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { setAuthUser } from '@/services/api';
import { env } from '@/config/env';

export type Role = 'ROLE_ADMIN' | 'ROLE_AGENT' | 'ROLE_CUSTOMER';

interface AuthContextShape {
  isAuthenticated: boolean;
  user: User | null;
  roles: Role[];
  loading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

function getOidcManager(): UserManager | null {
  const authority = (env.VITE_OIDC_AUTHORITY as string | undefined);
  const client_id = (env.VITE_OIDC_CLIENT_ID as string | undefined);
  const redirect_uri = (env.VITE_OIDC_REDIRECT_URI as string | undefined);
  const silent_redirect_uri = (env as any).VITE_OIDC_SILENT_REDIRECT_URI as string | undefined;
  if (!authority || !client_id || !redirect_uri) return null;
  return new UserManager({
    authority,
    client_id,
    redirect_uri,
    response_type: 'code',
    scope: 'openid profile email',
    userStore: new WebStorageStateStore({ store: window.sessionStorage }),
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: silent_redirect_uri || (window.location.origin + '/silent-oidc.html'),
  });
}

function toRoleName(raw: string): Role | null {
  if (!raw) return null;
  const upper = raw.toUpperCase();
  const normalized = upper.startsWith('ROLE_') ? upper : `ROLE_${upper}`;
  if (normalized === 'ROLE_ADMIN' || normalized === 'ROLE_AGENT' || normalized === 'ROLE_CUSTOMER') return normalized as Role;
  return null;
}

function extractRoles(user: User | null): Role[] {
  if (!user) return [];
  const token = user.id_token || user.access_token;
  try {
    const payload = JSON.parse(atob((token || '').split('.')[1] || '')) || {};
    const rolesFromRealm: string[] = payload?.realm_access?.roles || [];
    const rolesFromResource: string[] = Object.values(payload?.resource_access || {}).flatMap((r: any) => r?.roles || []);
    const all = new Set<string>([...rolesFromRealm, ...rolesFromResource]);
    const mapped = Array.from(all)
      .map(toRoleName)
      .filter((r): r is Role => !!r);
    return mapped;
  } catch {
    return [];
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const manager = useMemo(getOidcManager, []);
  const [user, setUser] = useState<User | null>(null);
  const [demoRoles, setDemoRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize authentication state
  useEffect(() => {
    let mounted = true;
    async function init() {
      if (!manager) {
        // Demo mode: read roles from sessionStorage
        try {
          const raw = sessionStorage.getItem('demoRoles');
          if (raw && mounted) setDemoRoles(JSON.parse(raw));
        } catch {}
        setLoading(false);
        return;
      }
      try {
        const existing = await manager.getUser();
        if (mounted) {
          if (existing && !existing.expired) {
            setUser(existing);
          } else if (window.location.search.includes('code=')) {
            const u = await manager.signinRedirectCallback();
            if (mounted) setUser(u);
          }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, [manager]);

  // Refresh user on token events
  useEffect(() => {
    if (!manager) return;
    const onUserLoaded = (u: User) => setUser(u);
    const onAccessTokenExpired = async () => {
      try { const u = await manager.signinSilent(); setUser(u); } catch { /* ignore */ }
    };
    manager.events.addUserLoaded(onUserLoaded);
    manager.events.addAccessTokenExpired(onAccessTokenExpired);
    return () => {
      manager.events.removeUserLoaded(onUserLoaded);
      manager.events.removeAccessTokenExpired(onAccessTokenExpired);
    };
  }, [manager]);

  // Keep axios token in sync
  useEffect(() => { setAuthUser(user); }, [user]);

  const roles: Role[] = manager ? extractRoles(user) : demoRoles;

  const value = useMemo<AuthContextShape>(() => ({
    isAuthenticated: manager ? !!user : demoRoles.length > 0,
    user,
    roles,
    loading,
    login: () => { manager ? manager.signinRedirect() : (window.location.href = '/login'); },
    logout: () => { if (manager) manager.signoutRedirect(); setUser(null); sessionStorage.removeItem('demoRoles'); setDemoRoles([]); },
  }), [user, manager, demoRoles, roles, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
} 