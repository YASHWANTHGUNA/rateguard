import React from 'react'
import axios from 'axios'   // ✅ ADD THIS
import Dashboard from './Dashboard'
import BlockedList from './BlockedList'
import RequestChart from './RequestChart'
import RequestGraph from './RequestGraph'
import ApiKeyPanel from './ApiKeyPanel'
import AlgorithmComparison from './AlgorithmComparison'

function Home() {

  // ✅ MOVE FUNCTION HERE
  const exportLogs = async () => {
    const res = await axios.get('http://localhost:3000/api/logs')

    const csv = [
      'IP Address,Time,Status',
      ...res.data.map(log =>
        `${log.ip},${new Date(log.timestamp).toLocaleTimeString()},${log.status}`
      )
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'rateguard-logs.csv'
    a.click()
  }

  return (
    <div style={{ padding: '20px' }}>

      <h1>🛡️ RateGuard Dashboard</h1>

      <Dashboard />
      <RequestGraph />
      <RequestChart />

      {/* ✅ BUTTON GOES HERE */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button onClick={exportLogs}>
          📥 Export Logs CSV
        </button>
      </div>

      <BlockedList />
      <ApiKeyPanel />
      <AlgorithmComparison />

    </div>
  )
}

export default Home
