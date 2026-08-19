import React, { useEffect, useState } from 'react'

const getApiBase = () => {
  const env = (import.meta as any).env
  const configured = env.VITE_API_BASE_URL
  if (configured) return configured
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return 'http://localhost:4000/api/v1'
  return 'http://api:4000/api/v1'
}

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('qc_token')
    fetch(`${getApiBase()}/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setSummary(d))
      .catch(e => setError(e.message || String(e)))
  }, [])

  if (error) return <div className="text-red-600">{error}</div>
  if (!summary) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Total Products</h3>
        <div className="text-2xl font-bold">{summary.total_products}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Total Inspections</h3>
        <div className="text-2xl font-bold">{summary.total_inspections}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Passed Inspections</h3>
        <div className="text-2xl font-bold">{summary.passed_inspections}</div>
      </div>
      <div className="p-4 bg-white rounded shadow">
        <h3 className="text-sm text-gray-500">Failed Inspections</h3>
        <div className="text-2xl font-bold">{summary.failed_inspections}</div>
      </div>
    </div>
  )
}
