const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimiter = require('./middleware/rateLimiter')
const apiRoutes = require('./routes/api')
require('dotenv').config()

const app = express()

// Trust Render's proxy so req.ip reflects the real user IP
// Without this, every request appears as 127.0.0.1 — breaking rate limiting!
app.set('trust proxy', 1)

app.use(helmet())         // Sets 11 security headers (XSS, clickjacking, MIME, etc.)
app.use(cors({
  origin         : process.env.CLIENT_ORIGIN || 'https://rateguard-mu.vercel.app',
  methods        : ['GET', 'POST'],
  allowedHeaders : ['Content-Type', 'x-api-key']
}))                       // Locked to Vercel frontend only
app.use(express.json())
app.use(rateLimiter)

// Routes
app.use('/api', apiRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'RateGuard Running!' })
})

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => console.log(err))

app.listen(process.env.PORT, () =>
  console.log(`Server on port ${process.env.PORT}`))