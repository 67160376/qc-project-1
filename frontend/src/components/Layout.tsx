import React from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function Layout() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.removeItem('qc_token')
    navigate('/login')
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-lg font-semibold">QC System</h1>
          <nav className="space-x-4">
            <Link to="/dashboard" className="text-sm text-gray-700">Dashboard</Link>
            <Link to="/products" className="text-sm text-gray-700">Products</Link>
            <Link to="/inspections" className="text-sm text-gray-700">Inspections</Link>
            <Link to="/ncrs" className="text-sm text-gray-700">NCRs</Link>
            <Link to="/alerts" className="text-sm text-gray-700">Alerts</Link>
            <button onClick={logout} className="ml-4 text-sm text-red-600">Logout</button>
          </nav>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}
