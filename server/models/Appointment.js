// models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topic: { type: String, default: "1-on-1 Strategy Session" },
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  time: { type: String, required: true },
  status: { type: String, default: "upcoming" } // upcoming, cancelled, past
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);