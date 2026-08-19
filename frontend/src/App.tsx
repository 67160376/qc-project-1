import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Inspections from './pages/Inspections'
import NCRs from './pages/NCRs'
import Alerts from './pages/Alerts'

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('qc_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="inspections" element={<PrivateRoute><Inspections /></PrivateRoute>} />
        <Route path="ncrs" element={<PrivateRoute><NCRs /></PrivateRoute>} />
        <Route path="alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
      </Route>
    </Routes>
  )
}
