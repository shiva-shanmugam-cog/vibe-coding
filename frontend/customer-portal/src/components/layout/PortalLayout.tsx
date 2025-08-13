import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';

export const PortalLayout: React.FC = () => {
	const { logout } = useAuth();
	const linkClass = (isActive: boolean) => `px-3 py-1.5 rounded ${isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`;
	return (
		<div className="min-h-full grid grid-rows-[auto,1fr]">
			<header className="bg-white border-b">
				<div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
					<div className="font-semibold text-lg">Vibe Customer Portal</div>
					<div className="flex items-center gap-3">
						<NavLink className={({ isActive }: { isActive: boolean }) => linkClass(isActive)} to="/onboarding">Onboarding</NavLink>
						<NavLink className={({ isActive }: { isActive: boolean }) => linkClass(isActive)} to="/messages">Messages</NavLink>
						<button onClick={logout} className="px-3 py-1.5 rounded text-gray-700 hover:bg-gray-100">Logout</button>
					</div>
				</div>
			</header>
			<main className="max-w-6xl mx-auto w-full p-4">
				<Outlet />
			</main>
		</div>
	);
}; 