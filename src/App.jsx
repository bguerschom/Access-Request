import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import RequestViewer from './components/RequestViewer'
import AuthGuard from './components/AuthGuard'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A2647]">
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={
            <AuthGuard>
              <RequestViewer />
            </AuthGuard>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
