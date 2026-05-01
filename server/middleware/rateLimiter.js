require('dotenv').config()
const RequestLog = require('../models/RequestLog')
const ApiKey     = require('../models/ApiKey')

const DEFAULT_LIMIT  = parseInt(process.env.LIMIT)  || 10
const WINDOW         = parseInt(process.env.WINDOW) || 60000
const ipMap          = new Map()

const rateLimiter = async (req, res, next) => {
  const ip = req.ip.replace('::ffff:', '') === '::1'
  ? '127.0.0.1'
  : req.ip.replace('::ffff:', '')
  const now = Date.now()

  // Check API Key if provided
  let limit = DEFAULT_LIMIT
  const apiKey = req.headers['x-api-key']

  if (apiKey) {
    try {
      const keyDoc = await ApiKey.findOne({ key: apiKey })
      if (keyDoc) limit = keyDoc.limit
    } catch(err) {
      console.log('API Key Error:', err)
    }
  }

  const mapKey = apiKey || ip

  if (!ipMap.has(mapKey)) ipMap.set(mapKey, [])

  const timestamps      = ipMap.get(mapKey)
  const windowStart     = now - WINDOW
  const validTimestamps = timestamps.filter(t => t > windowStart)

  if (validTimestamps.length >= limit) {
    try {
      await RequestLog.create({ ip, timestamp: now, status: 'blocked' })
    } catch(err) {
      console.log('DB Log Error:', err)
    }

    return res.status(429).json({
      error      : 'Rate limit exceeded!',
      retryAfter : '60 seconds',
      limit      : limit
    })
  }

  try {
    await RequestLog.create({ ip, timestamp: now, status: 'allowed' })
  } catch(err) {
    console.log('DB Log Error:', err)
  }

  validTimestamps.push(now)
  ipMap.set(mapKey, validTimestamps)
  next()
}

module.exports = rateLimiter