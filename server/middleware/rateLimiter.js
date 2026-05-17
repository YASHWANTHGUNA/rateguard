require('dotenv').config()
const RequestLog = require('../models/RequestLog')
const ApiKey     = require('../models/ApiKey')

const DEFAULT_LIMIT  = parseInt(process.env.LIMIT)  || 10
const WINDOW         = parseInt(process.env.WINDOW) || 60000
const ipMap          = new Map()

// Extract real client IP — works behind Render/Nginx proxies
const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list: "clientIP, proxy1, proxy2"
    return forwarded.split(',')[0].trim()
  }
  // Fallback for local dev (strips IPv6-mapped IPv4 like ::ffff:127.0.0.1)
  return req.ip.replace('::ffff:', '') === '::1'
    ? '127.0.0.1'
    : req.ip.replace('::ffff:', '')
}

const rateLimiter = async (req, res, next) => {
  const ip  = getClientIp(req)
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

    // Standard rate limit headers — tells clients exactly when to retry
    const resetAt         = Math.ceil((validTimestamps[0] + WINDOW) / 1000)  // Unix epoch
    const retryAfterSecs  = Math.ceil((validTimestamps[0] + WINDOW - now) / 1000)

    res.set({
      'X-RateLimit-Limit'     : limit,
      'X-RateLimit-Remaining' : 0,
      'X-RateLimit-Reset'     : resetAt,
      'Retry-After'           : Math.max(0, retryAfterSecs)
    })

    return res.status(429).json({
      error      : 'Rate limit exceeded!',
      retryAfter : `${Math.max(0, retryAfterSecs)} seconds`,
      limit      : limit
    })
  }

  try {
    await RequestLog.create({ ip, timestamp: now, status: 'allowed' })
  } catch(err) {
    console.log('DB Log Error:', err)
  }

  // Inform allowed clients of their current quota status
  res.set({
    'X-RateLimit-Limit'     : limit,
    'X-RateLimit-Remaining' : Math.max(0, limit - validTimestamps.length - 1),
    'X-RateLimit-Reset'     : validTimestamps.length > 0
                                ? Math.ceil((validTimestamps[0] + WINDOW) / 1000)
                                : Math.ceil((now + WINDOW) / 1000)
  })

  validTimestamps.push(now)
  ipMap.set(mapKey, validTimestamps)
  next()
}

module.exports = rateLimiter