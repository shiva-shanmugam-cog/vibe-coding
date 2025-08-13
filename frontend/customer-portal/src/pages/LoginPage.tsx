import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';

export default function LoginPage() {
	const { login } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [name, setName] = useState('');

	const oidcConfigured = !!import.meta.env.VITE_OIDC_AUTHORITY;

	const onDemoLogin = () => {
		// store demo customer role
		sessionStorage.setItem('demoRoles', JSON.stringify(['ROLE_CUSTOMER']));
		navigate((location.state as any)?.from?.pathname || '/');
	};

	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="bg-white shadow rounded p-6 w-full max-w-md">
				<h1 className="text-xl font-semibold mb-4">Customer Login</h1>
				{oidcConfigured ? (
					<button className="w-full bg-blue-600 text-white py-2 rounded" onClick={login}>Sign in</button>
				) : (
					<>
						<div className="space-y-3">
							<input className="w-full border rounded px-3 py-2" placeholder="Full name" value={name} onChange={e => setName(e.target.value)} />
							<input className="w-full border rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
						</div>
						<button className="mt-4 w-full bg-blue-600 text-white py-2 rounded" onClick={onDemoLogin}>Continue</button>
					</>
				)}
			</div>
		</div>
	);
} 