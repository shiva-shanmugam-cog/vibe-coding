import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { PortalLayout } from '@/components/layout/PortalLayout';
import LoginPage from '@/pages/LoginPage';
import OnboardingPage from '@/pages/OnboardingPage';
import MessagesPage from '@/pages/MessagesPage';

export default function App(): JSX.Element {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route
				path="/"
				element={
					<ProtectedRoute allowRoles={["ROLE_CUSTOMER"]}>
						<PortalLayout />
					</ProtectedRoute>
				}
			>
				<Route index element={<Navigate to="onboarding" replace />} />
				<Route path="onboarding" element={<OnboardingPage />} />
				<Route path="messages" element={<MessagesPage />} />
			</Route>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	);
} 