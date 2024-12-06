import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthForm from './components/auth/AuthForm';
import UploadPage from './pages/UploadPage';
import RequestsPage from './pages/RequestsPage';
import Layout from './components/layout/Layout';
import AuthGuard from './components/auth/AuthGuard';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Dashboard from './pages/Dashboard';
import UserGuide from './pages/UserGuide';



function App() {
  return (
        <ThemeProvider>
<Routes>
  <Route path="/auth" element={<AuthForm />} />
  <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="upload" element={<UploadPage />} />
    <Route path="requests" element={<RequestsPage />} />
    <Route path="reports" element={<Reports />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="guide" element={<UserGuide />} />
    <Route index element={<Navigate to="/dashboard" replace />} />
  </Route>
</Routes>
              </ThemeProvider>
  );
}
export default App;
