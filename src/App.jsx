import { Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import UploadFormPage from './pages/UploadPage';
import RequestsPage from './pages/RequestsPage';
import Layout from './components/layout/Layout';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/" element={<AuthGuard><Layout /></AuthGuard>}>
        <Route path="upload" element={<UploadFormPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route index element={<Navigate to="/upload" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
