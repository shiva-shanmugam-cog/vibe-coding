import { useAuth } from '@/auth/AuthProvider';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const [role, setRole] = useState('ROLE_ADMIN');

  useEffect(() => {
    if (isAuthenticated) window.location.replace('/');
  }, [isAuthenticated]);

  const hasOidc = !!import.meta.env.VITE_OIDC_AUTHORITY;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold">Vibe Admin Dashboard</h1>
        {hasOidc ? (
          <button onClick={login} className="w-full py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Login with SSO</button>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); sessionStorage.setItem('demoRoles', JSON.stringify([role])); window.location.href = '/'; }} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Demo Role</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="w-full border rounded-md px-3 py-2">
                <option>ROLE_ADMIN</option>
                <option>ROLE_AGENT</option>
                <option>ROLE_CUSTOMER</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2 rounded-md bg-brand-600 text-white hover:bg-brand-700">Enter Demo</button>
          </form>
        )}
      </div>
    </div>
  );
} 