import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import AgentsPage from '@/pages/AgentsPage';
import PerformancePage from '@/pages/PerformancePage';
import TracingPage from '@/pages/TracingPage';
import AuditLogsPage from '@/pages/AuditLogsPage';

export default function App() {
  return (
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
  );
} 