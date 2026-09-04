const Appointment = require('../models/Appointment');

const ALL_SLOTS = [
  "09:30 AM", "10:15 AM", "11:00 AM", 
  "02:00 PM", "02:45 PM", "03:30 PM"
];

const isSlotExpired = (slotTime, requestedDateStr) => {
  if (!requestedDateStr) return false;

  const now = new Date();
  
  const [year, month, day] = requestedDateStr.split('-');
  const [time, modifier] = slotTime.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = parseInt(hours, 10) + 12;

  const slotDateTime = new Date(year, month - 1, day, hours, minutes);
  
  return slotDateTime < now;
};

// 1. Get Available Slots (Checks DB for booked times)
exports.getSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    const bookedAppointments = await Appointment.find({ date, status: 'upcoming' });
    const bookedTimes = bookedAppointments.map(app => app.time);

    const slots = ALL_SLOTS.map(time => {
      if (bookedTimes.includes(time)) {
        return { time, status: 'booked' };
      }
      
      if (isSlotExpired(time, date)) {
        return { time, status: 'expired' };
      }
      
      return { time, status: 'available' };
    });

    res.json({ date, slots });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 2. Book Appointment (Handles Concurrency)
exports.bookAppointment = async (req, res) => {
  try {
    const { date, time, name } = req.body;

    const existingBooking = await Appointment.findOne({ date, time, status: 'upcoming' });
    
    if (existingBooking) {
      return res.status(409).json({ 
        error: "Slot already booked", 
        message: "Sorry, another user just booked this slot. Please choose another time." 
      });
    }

    const newAppointment = await Appointment.create({
      name: name || "User",
      date,
      time,
      status: 'upcoming'
    });

    setTimeout(() => {
      res.status(201).json({ message: "Booking confirmed", appointment: newAppointment });
    }, 800);

  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 3. Get All Appointments (UPDATED LOGIC 🔥)
exports.getAppointments = async (req, res) => {
  try {
    const allAppointments = await Appointment.find({ status: { $ne: 'cancelled' } });

    const upcoming = [];
    const past = [];

    for (let app of allAppointments) {
      const isPast = isSlotExpired(app.time, app.date);

      if (isPast) {
        past.push(app);
        
        if (app.status === 'upcoming') {
          await Appointment.findByIdAndUpdate(app._id, { status: 'past' });
        }
      } else {
        upcoming.push(app);
      }
    }

    upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
    past.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json({ upcoming, past });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};

// 4. Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const appointment = await Appointment.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
};