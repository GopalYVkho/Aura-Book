const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.get('/slots', bookingController.getSlots);
router.post('/book', bookingController.bookAppointment);
router.get('/appointments', bookingController.getAppointments);
router.delete('/appointments/:id', bookingController.cancelAppointment);

module.exports = router;