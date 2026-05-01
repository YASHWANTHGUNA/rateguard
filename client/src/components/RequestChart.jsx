import React, { useState, useEffect } from 'react'
import axios from 'axios'

function RequestChart() {
  const [logs, setLogs]           = useState([])
  const [blocked, setBlocked]     = useState(false)
  const [countdown, setCountdown] = useState(0)

  // ─────────────────────────────
  // Test Request Function
  // ─────────────────────────────
  const sendRequest = async () => {
    try {
      const res = await axios.get('https://rateguard-api.onrender.com')
      console.log('Allowed:', res.data)
      setBlocked(false)
    } catch (err) {
      if (err.response?.status === 429) {
        setBlocked(true)
        setCountdown(60)   // Start 60s countdown
      }
    }
  }

  // ─────────────────────────────
  // Countdown Timer Logic
  // ─────────────────────────────
  useEffect(() => {
    if (countdown <= 0) return

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          setBlocked(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [countdown])

  // ─────────────────────────────
  // Fetch Logs
  // ─────────────────────────────
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          'https://rateguard-api.onrender.com/api/logs'
        )
        setLogs(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ marginTop: '30px' }}>

      {/* ── Test Button ── */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={sendRequest}
          style={{
            padding      : '12px 30px',
            background   : blocked ? '#e63946' : '#2d6a4f',
            color        : 'white',
            border       : 'none',
            borderRadius : '8px',
            fontSize     : '16px',
            cursor       : blocked ? 'not-allowed' : 'pointer'
          }}
          disabled={blocked}
        >
          {blocked ? '❌ Blocked!' : '🚀 Send Request'}
        </button>
      </div>

      {/* ── Countdown Timer ── */}
      {blocked && (
        <div style={{
          textAlign    : 'center',
          padding      : '15px',
          background   : '#e63946',
          color        : 'white',
          borderRadius : '10px',
          marginBottom : '20px',
          fontSize     : '18px'
        }}>
          ⏱️ Rate Limited! Retry after:
          <span style={{ 
            fontSize   : '32px', 
            fontWeight : 'bold',
            display    : 'block'
          }}>
            {countdown} seconds
          </span>
        </div>
      )}

      {/* ── Request Logs Table ── */}
      <h2>📊 Recent Request Logs</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2d6a4f', color: 'white' }}>
            <th style={{ padding: '10px' }}>IP Address</th>
            <th style={{ padding: '10px' }}>Time</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index} style={{
              borderBottom : '1px solid #ccc',
              textAlign    : 'center'
            }}>
              <td style={{ padding: '10px' }}>{log.ip}</td>
              <td style={{ padding: '10px' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </td>
              <td style={{
                padding : '10px',
                color   : log.status === 'allowed'
                          ? '#52b788'
                          : '#e63946'
              }}>
                {log.status === 'allowed' 
                  ? 'Allowed ✅' 
                  : 'Blocked ❌'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RequestChart