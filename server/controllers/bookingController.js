const Appointment = require('../models/Appointment');

const ALL_SLOTS = [
  "09:30 AM", "10:15 AM", "11:00 AM", 
  "02:00 PM", "02:45 PM", "03:30 PM"
];

// 1. Get Available Slots (Checks DB for booked times)
exports.getSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Find all upcoming appointments for this date
    const bookedAppointments = await Appointment.find({ date, status: 'upcoming' });
    const bookedTimes = bookedAppointments.map(app => app.time);

    // Generate slots dynamically
    const slots = ALL_SLOTS.map(time => ({
      time,
      status: bookedTimes.includes(time) ? 'booked' : 'available'
    }));

    res.json({ date, slots });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Book Appointment (Handles Concurrency)
exports.bookAppointment = async (req, res) => {
  try {
    const { date, time, name } = req.body;

    // Check if slot is already booked (Concurrency Check)
    const existingBooking = await Appointment.findOne({ date, time, status: 'upcoming' });
    
    if (existingBooking) {
      return res.status(409).json({ 
        error: "Slot already booked", 
        message: "Sorry, another user just booked this slot. Please choose another time." 
      });
    }

    // Save to DB
    const newAppointment = await Appointment.create({
      name: name || "User",
      date,
      time
    });

    // Small delay to simulate realistic UX loading
    setTimeout(() => {
      res.status(201).json({ message: "Booking confirmed", appointment: newAppointment });
    }, 800);

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 3. Get All Appointments
exports.getAppointments = async (req, res) => {
  try {
    const upcoming = await Appointment.find({ status: 'upcoming' }).sort({ date: 1 });
    const past = await Appointment.find({ status: 'past' }).sort({ date: -1 });
    
    res.json({ upcoming, past });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 4. Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    // We update status to cancelled instead of deleting the record entirely (Good practice)
    const appointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};