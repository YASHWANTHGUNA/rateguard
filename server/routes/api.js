const express    = require('express')
const router     = express.Router()
const RequestLog = require('../models/RequestLog')
const ApiKey     = require('../models/ApiKey')
const crypto     = require('crypto')
const cleanIp = (ip) => {
  return ip.replace('::ffff:', '') === '::1' 
    ? '127.0.0.1' 
    : ip.replace('::ffff:', '')
}

// ── Stats ──
router.get('/stats', async (req, res) => {
  const total   = await RequestLog.countDocuments()
  const allowed = await RequestLog.countDocuments({ status: 'allowed' })
  const blocked = await RequestLog.countDocuments({ status: 'blocked' })
  res.json({ totalRequests: total, allowedRequests: allowed, blockedRequests: blocked })
})

// ── Blocked ──
router.get('/blocked', async (req, res) => {
  const blocked = await RequestLog
    .find({ status: 'blocked' })
    .sort({ timestamp: -1 })
    .limit(10)

  const cleanedLogs = blocked.map(log => ({
    ...log._doc,
    ip: cleanIp(log.ip)
  }))

  res.json(cleanedLogs)
})

// ── Logs ──
router.get('/logs', async (req, res) => {
  const logs = await RequestLog
    .find()
    .sort({ timestamp: -1 })  // ✅ Already correct
    .limit(100)

  const cleanedLogs = logs.map(log => ({
    ...log._doc,
    ip: cleanIp(log.ip)
  }))

  res.json(cleanedLogs)
})

// ── Generate API Key ──
router.post('/generate-key', async (req, res) => {
  const { tier } = req.body

  // Tier limits
  const tierLimits = {
    free    : 10,
    pro     : 50,
    premium : 200
  }

  if (!tierLimits[tier]) {
    return res.status(400).json({ error: 'Invalid tier!' })
  }

  const key = crypto.randomBytes(16).toString('hex')

  await ApiKey.create({
    key   : key,
    tier  : tier,
    limit : tierLimits[tier]
  })

  res.json({ 
    apiKey : key, 
    tier   : tier,
    limit  : `${tierLimits[tier]} requests/minute`
  })
})

// ── Get All API Keys ──
router.get('/keys', async (req, res) => {
  const keys = await ApiKey.find().sort({ createdAt: -1 })
  res.json(keys)
})

module.exports = router