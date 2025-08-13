import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const AgentsPage = lazy(() => import('@/pages/AgentsPage'));
const PerformancePage = lazy(() => import('@/pages/PerformancePage'));
const TracingPage = lazy(() => import('@/pages/TracingPage'));
const AuditLogsPage = lazy(() => import('@/pages/AuditLogsPage'));

export default function App() {
  return (
    <Suspense fallback={<div className="p-6">Loading…</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="agents" replace />} />
          <Route path="agents" element={<ProtectedRoute allowRoles={["ROLE_ADMIN", "ROLE_AGENT"]}><AgentsPage /></ProtectedRoute>} />
          <Route path="performance" element={<ProtectedRoute allowRoles={["ROLE_ADMIN"]}><PerformancePage /></ProtectedRoute>} />
          <Route path="tracing" element={<ProtectedRoute allowRoles={["ROLE_ADMIN", "ROLE_AGENT"]}><TracingPage /></ProtectedRoute>} />
          <Route path="audit" element={<ProtectedRoute allowRoles={["ROLE_ADMIN", "ROLE_AGENT"]}><AuditLogsPage /></ProtectedRoute>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
} 