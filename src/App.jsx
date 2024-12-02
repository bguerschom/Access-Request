import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AuthForm from './components/auth/AuthForm'
import RequestViewer from './components/request/RequestViewer'
import AuthGuard from './components/auth/AuthGuard'

function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthForm />} />
      <Route path="/" element={
        <AuthGuard>
          <RequestViewer />
        </AuthGuard>
      } />
    </Routes>
  )
}

export default App
