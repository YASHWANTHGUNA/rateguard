const mongoose = require('mongoose')

const apiKeySchema = new mongoose.Schema({
  key       : String,
  tier      : String,    // free/pro/premium
  limit     : Number,
  createdAt : { type: Date, default: Date.now }
})

module.exports = mongoose.model('ApiKey', apiKeySchema)