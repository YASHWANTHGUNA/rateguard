import React, { useState, useEffect } from 'react'
import axios from 'axios'

function Dashboard() {
  const [stats, setStats] = useState({
    totalRequests : 0,
    allowedRequests : 0,
    blockedRequests : 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          'http://localhost:3000/api/stats'
        )
        setStats(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    // Fetch every 5 seconds (real time!)
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      justifyContent: 'center',
      marginTop: '20px'
    }}>

      <StatCard 
        title="Total Requests" 
        value={stats.totalRequests} 
        color="#2d6a4f"
      />
      <StatCard 
        title="Allowed" 
        value={stats.allowedRequests} 
        color="#52b788"
      />
      <StatCard 
        title="Blocked" 
        value={stats.blockedRequests} 
        color="#e63946"
      />

    </div>
  )
}

// Reusable StatCard Component (Props!) ⭐
function StatCard({ title, value, color }) {
  return (
    <div style={{
      padding     : '20px',
      borderRadius: '10px',
      background  : color,
      color       : 'white',
      minWidth    : '150px',
      textAlign   : 'center'
    }}>
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  )
}

export default Dashboard