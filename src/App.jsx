// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import AuthForm from './components/auth/AuthForm';
import Dashboard from './components/request/Dashboard';
import AuthGuard from './components/auth/AuthGuard';

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
    </Routes>
  );
}

export default App;
