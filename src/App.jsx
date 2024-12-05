import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import AuthForm from './components/auth/AuthForm';
import UploadFormPage from './pages/UploadPage';
import RequestsPage from './pages/RequestsPage';
import Layout from './components/layout/Layout';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
        <ThemeProvider>
<Routes>
  <Route path="/auth" element={<AuthForm />} />
  <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
    <Route path="upload" element={<UploadPage />} />
    <Route path="requests" element={<RequestsPage />} />
    <Route path="users" element={<UserManagement />} />
    <Route path="reports" element={<Reports />} />
    <Route index element={<Navigate to="/upload" replace />} />
  </Route>
</Routes>
              </ThemeProvider>
  );
}
export default App;
