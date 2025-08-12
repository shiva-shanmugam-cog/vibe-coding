import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import LoginPage from '@/pages/LoginPage';
import AgentsPage from '@/pages/AgentsPage';
import PerformancePage from '@/pages/PerformancePage';
import TracingPage from '@/pages/TracingPage';
import SimulationPage from '@/pages/SimulationPage';
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
        <Route path="agents" element={<AgentsPage />} />
        <Route path="performance" element={<PerformancePage />} />
        <Route path="tracing" element={<TracingPage />} />
        <Route
          path="simulation"
          element={
            <ProtectedRoute allowRoles={["ROLE_CUSTOMER", "ROLE_ADMIN", "ROLE_AGENT"]}>
              <SimulationPage />
            </ProtectedRoute>
          }
        />
        <Route path="audit" element={<AuditLogsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
} 