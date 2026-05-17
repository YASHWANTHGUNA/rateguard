const express    = require('express')
const router     = express.Router()
const RequestLog = require('../models/RequestLog')
const ApiKey     = require('../models/ApiKey')
const crypto     = require('crypto')

// Same IP extraction logic as rateLimiter.js — reads x-forwarded-for for real IP behind proxies
const cleanIp = (ip) => {
  if (!ip) return 'unknown'
  // Already clean (e.g. stored from x-forwarded-for)
  if (!ip.includes('::ffff:') && ip !== '::1') return ip
  return ip.replace('::ffff:', '') === '::1' ? '127.0.0.1' : ip.replace('::ffff:', '')
}

// ── Stats ──
router.get('/stats', async (req, res) => {
  try {
    const total   = await RequestLog.countDocuments()
    const allowed = await RequestLog.countDocuments({ status: 'allowed' })
    const blocked = await RequestLog.countDocuments({ status: 'blocked' })
    res.json({ totalRequests: total, allowedRequests: allowed, blockedRequests: blocked })
  } catch(err) {
    console.error('Stats error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Blocked ──
router.get('/blocked', async (req, res) => {
  try {
    const blocked = await RequestLog
      .find({ status: 'blocked' })
      .sort({ timestamp: -1 })
      .limit(10)

    const cleanedLogs = blocked.map(log => ({
      ...log._doc,
      ip: cleanIp(log.ip)
    }))

    res.json(cleanedLogs)
  } catch(err) {
    console.error('Blocked logs error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Logs ──
router.get('/logs', async (req, res) => {
  try {
    const logs = await RequestLog
      .find()
      .sort({ timestamp: -1 })
      .limit(100)

    const cleanedLogs = logs.map(log => ({
      ...log._doc,
      ip: cleanIp(log.ip)
    }))

    res.json(cleanedLogs)
  } catch(err) {
    console.error('Logs error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Generate API Key ──
router.post('/generate-key', async (req, res) => {
  try {
    const { tier } = req.body

    // Validate input exists and is a string
    if (!tier || typeof tier !== 'string') {
      return res.status(400).json({ error: 'Tier is required' })
    }

    // Sanitize — handles "FREE", " Pro ", etc.
    const cleanTier = tier.toLowerCase().trim()

    const tierLimits = {
      free    : 10,
      pro     : 50,
      premium : 200
    }

    if (!tierLimits[cleanTier]) {
      return res.status(400).json({ error: 'Invalid tier. Choose: free, pro, premium' })
    }

    const key = crypto.randomBytes(16).toString('hex')

    await ApiKey.create({
      key   : key,
      tier  : cleanTier,
      limit : tierLimits[cleanTier]
    })

    res.json({ 
      apiKey : key, 
      tier   : cleanTier,
      limit  : `${tierLimits[cleanTier]} requests/minute`
    })
  } catch(err) {
    console.error('Generate key error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

// ── Get All API Keys ──
router.get('/keys', async (req, res) => {
  try {
    const keys = await ApiKey.find().sort({ createdAt: -1 })
    res.json(keys)
  } catch(err) {
    console.error('Keys error:', err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router