import React, { useState, useEffect } from 'react'
import axios from 'axios'

function ApiKeyPanel() {
  const [tier, setTier]       = useState('free')
  const [keys, setKeys]       = useState([])
  const [newKey, setNewKey]   = useState(null)
  const [loading, setLoading] = useState(false)

  const tierLimits = {
    free    : '10 requests/min',
    pro     : '50 requests/min',
    premium : '200 requests/min'
  }

  const tierColors = {
    free    : '#52b788',
    pro     : '#2196F3',
    premium : '#FFD700'
  }

  const generateKey = async () => {
    setLoading(true)
    try {
      const res = await axios.post(
        'http://localhost:3000/api/generate-key',
        { tier }
      )
      setNewKey(res.data)
      fetchKeys()
    } catch(err) {
      console.log(err)
    }
    setLoading(false)
  }

  const fetchKeys = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/keys')
      setKeys(res.data)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => { fetchKeys() }, [])

  return (
    <div style={{ marginTop: '30px' }}>
      <h2 style={{ textAlign: 'center' }}>🔑 API Key Manager</h2>

      {/* Tier Selector */}
      <div style={{
        display        : 'flex',
        justifyContent : 'center',
        gap            : '15px',
        marginBottom   : '20px'
      }}>
        {['free', 'pro', 'premium'].map(t => (
          <button
            key={t}
            onClick={() => setTier(t)}
            style={{
              padding      : '10px 25px',
              background   : tier === t ? tierColors[t] : '#333',
              color        : tier === t ? 'black' : 'white',
              border       : `2px solid ${tierColors[t]}`,
              borderRadius : '8px',
              cursor       : 'pointer',
              fontWeight   : 'bold',
              textTransform: 'capitalize'
            }}
          >
            {t.toUpperCase()}<br/>
            <small>{tierLimits[t]}</small>
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={generateKey}
          disabled={loading}
          style={{
            padding      : '12px 30px',
            background   : '#2d6a4f',
            color        : 'white',
            border       : 'none',
            borderRadius : '8px',
            fontSize     : '16px',
            cursor       : 'pointer'
          }}
        >
          {loading ? 'Generating...' : '⚡ Generate API Key'}
        </button>
      </div>

      {/* New Key Display */}
      {newKey && (
        <div style={{
          padding      : '15px',
          background   : '#1a1a2e',
          border       : '1px solid #52b788',
          borderRadius : '10px',
          marginBottom : '20px',
          textAlign    : 'center'
        }}>
          <p style={{ color: '#52b788' }}>✅ New API Key Generated!</p>
          <code style={{ 
            color      : 'white',
            fontSize   : '14px',
            wordBreak  : 'break-all'
          }}>
            {newKey.apiKey}
          </code>
          <p style={{ color: '#aaa' }}>
            Tier: {newKey.tier} | Limit: {newKey.limit}
          </p>
        </div>
      )}

      {/* Keys Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#2d6a4f', color: 'white' }}>
            <th style={{ padding: '10px' }}>API Key</th>
            <th style={{ padding: '10px' }}>Tier</th>
            <th style={{ padding: '10px' }}>Limit</th>
          </tr>
        </thead>
        <tbody>
          {keys.map((k, i) => (
            <tr key={i} style={{
              borderBottom : '1px solid #333',
              textAlign    : 'center'
            }}>
              <td style={{ 
                padding  : '10px',
                color    : '#aaa',
                fontSize : '12px'
              }}>
                {k.key.substring(0, 8)}...
              </td>
              <td style={{ 
                padding : '10px',
                color   : tierColors[k.tier],
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}>
                {k.tier}
              </td>
              <td style={{ padding: '10px', color: 'white' }}>
                {k.limit} req/min
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ApiKeyPanel