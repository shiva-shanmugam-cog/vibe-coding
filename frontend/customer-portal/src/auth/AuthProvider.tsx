import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { User, UserManager, WebStorageStateStore } from 'oidc-client-ts';
import { setAuthUser } from '@/services/api';

export type Role = 'ROLE_CUSTOMER' | 'ROLE_AGENT' | 'ROLE_ADMIN';

interface AuthContextShape {
	isAuthenticated: boolean;
	user: User | null;
	roles: Role[];
	login: () => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

function getOidcManager(): UserManager | null {
	const authority = import.meta.env.VITE_OIDC_AUTHORITY as string | undefined;
	const client_id = import.meta.env.VITE_OIDC_CLIENT_ID as string | undefined;
	const redirect_uri = import.meta.env.VITE_OIDC_REDIRECT_URI as string | undefined;
	if (!authority || !client_id || !redirect_uri) return null;
	return new UserManager({
		authority,
		client_id,
		redirect_uri,
		response_type: 'code',
		scope: 'openid profile email',
		userStore: new WebStorageStateStore({ store: window.sessionStorage }),
		loadUserInfo: true,
	});
}

function extractRoles(user: User | null): Role[] {
	if (!user) return [];
	const token = user.id_token || user.access_token;
	try {
		const payload = JSON.parse(atob((token || '').split('.')[1] || '')) || {};
		const rolesFromRealm = payload?.realm_access?.roles || [];
		const rolesFromResource = Object.values(payload?.resource_access || {}).flatMap((r: any) => r?.roles || []);
		const all = new Set<string>([...rolesFromRealm, ...rolesFromResource]);
		return Array.from(all).filter(r => r.startsWith('ROLE_')) as Role[];
	} catch {
		return [];
	}
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const manager = useMemo(getOidcManager, []);
	const [user, setUser] = useState<User | null>(null);
	const [demoRoles, setDemoRoles] = useState<Role[]>(['ROLE_CUSTOMER']);

	useEffect(() => {
		if (!manager) {
			try {
				const raw = sessionStorage.getItem('demoRoles');
				if (raw) setDemoRoles(JSON.parse(raw));
			} catch {}
			return;
		}
		manager.getUser().then(existing => {
			if (existing && !existing.expired) setUser(existing);
			else if (window.location.search.includes('code=')) manager.signinRedirectCallback().then(u => setUser(u));
		});
	}, [manager]);

	useEffect(() => { setAuthUser(user); }, [user]);

	const roles: Role[] = manager ? extractRoles(user) : demoRoles;

	const value = useMemo<AuthContextShape>(() => ({
		isAuthenticated: manager ? !!user : demoRoles.length > 0,
		user,
		roles,
		login: () => { manager ? manager.signinRedirect() : (window.location.href = '/login'); },
		logout: () => { if (manager) manager.signoutRedirect(); setUser(null); sessionStorage.removeItem('demoRoles'); setDemoRoles([]); },
	}), [user, manager, demoRoles, roles]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used within AuthProvider');
	return ctx;
} 