import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr] grid-rows-[56px_1fr]">
      <aside className="row-span-2 bg-white border-r border-gray-200">
        <div className="h-14 flex items-center px-4 font-semibold text-brand-700">Vibe Admin</div>
        <nav className="px-2 space-y-1">
          <NavLink to="/agents" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`}>Agents</NavLink>
          <NavLink to="/performance" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`}>Performance</NavLink>
          <NavLink to="/tracing" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`}>Tracing</NavLink>
          <NavLink to="/simulation" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`}>Onboarding Simulation</NavLink>
          <NavLink to="/audit" className={({isActive}) => `block px-3 py-2 rounded-md ${isActive ? 'bg-brand-50 text-brand-700' : 'text-gray-700 hover:bg-gray-50'}`}>Audit Logs</NavLink>
        </nav>
      </aside>

      <header className="col-start-2 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div />
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">{user?.profile?.name || user?.profile?.preferred_username || 'User'}</div>
          <button
            className="px-3 py-1.5 text-sm rounded-md bg-gray-100 hover:bg-gray-200"
            onClick={() => { logout(); navigate('/login'); }}
          >Logout</button>
        </div>
      </header>

      <main className="col-start-2 p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout; 