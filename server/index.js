const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const rateLimiter = require('./middleware/rateLimiter')
const apiRoutes = require('./routes/api')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())           // Allow React to call backend!
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