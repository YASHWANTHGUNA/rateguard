import React, { useState, useEffect } from 'react'
import axios from 'axios'

function BlockedList() {
  const [blocked, setBlocked] = useState([])

  useEffect(() => {
    const fetchBlocked = async () => {
      try {
        const res = await axios.get(
          'https://rateguard-api.onrender.com/api/blocked'
        )
        setBlocked(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    fetchBlocked()
    const interval = setInterval(fetchBlocked, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ marginTop: '30px' }}>
      <h2>❌ Blocked Requests</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#e63946', color: 'white' }}>
            <th style={{ padding: '10px' }}>IP Address</th>
            <th style={{ padding: '10px' }}>Time</th>
            <th style={{ padding: '10px' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {blocked.map((log, index) => (
            <tr key={index} style={{ 
              borderBottom: '1px solid #ccc',
              textAlign: 'center'
            }}>
              <td style={{ padding: '10px' }}>{log.ip}</td>
              <td style={{ padding: '10px' }}>
                {new Date(log.timestamp).toLocaleTimeString()}
              </td>
              <td style={{ padding: '10px', color: '#e63946' }}>
                Blocked ❌
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BlockedList