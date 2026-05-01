const mongoose = require('mongoose');

const requestLogSchema = new mongoose.Schema({
    ip        : String,
    timestamp : Number,
    status    : String    // "allowed" or "blocked"
});

module.exports = mongoose.model('RequestLog', requestLogSchema);