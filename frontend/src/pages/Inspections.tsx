import React, { useEffect, useState } from 'react'

const getApiBase = () => {
  const env = (import.meta as any).env
  const configured = env.VITE_API_BASE_URL
  if (configured) return configured
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return 'http://localhost:4000/api/v1'
  return 'http://api:4000/api/v1'
}

export default function Inspections() {
  const [items, setItems] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('qc_token')
    fetch(`${getApiBase()}/inspections`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => setItems(d || []))
      .catch(e => setError(e.message || String(e)))
  }, [])

  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Inspections</h2>
      <div className="space-y-2">
        {items.map(i => (
          <div key={i.id} className="p-3 bg-white rounded shadow">
            <div className="font-medium">{i.inspection_type} - Lot {i.lot_number}</div>
            <div className="text-sm text-gray-600">Quantity: {i.quantity} Passed: {i.passed_quantity} Failed: {i.failed_quantity}</div>
            <div className="text-sm">Status: {i.status}</div>
          </div>
        ))}
        {items.length === 0 && <div className="text-gray-500">No inspections found</div>}
      </div>
    </div>
  )
}
