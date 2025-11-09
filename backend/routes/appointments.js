const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all appointments for a user
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  let query, params;

  if (req.user.role === 'patient') {
    query = `
      SELECT a.*, u.name as pharmacist_name, u.specialization 
      FROM appointments a 
      JOIN users u ON a.pharmacist_id = u.id 
      WHERE a.patient_id = ? 
      ORDER BY a.date DESC, a.time DESC
    `;
    params = [req.user.id];
  } else if (req.user.role === 'pharmacist') {
    query = `
      SELECT a.*, u.name as patient_name, u.phone as patient_phone 
      FROM appointments a 
      JOIN users u ON a.patient_id = u.id 
      WHERE a.pharmacist_id = ? 
      ORDER BY a.date DESC, a.time DESC
    `;
    params = [req.user.id];
  } else {
    // Admin can see all appointments
    query = `
      SELECT a.*, 
             p.name as patient_name, p.phone as patient_phone,
             ph.name as pharmacist_name, ph.specialization 
      FROM appointments a 
      JOIN users p ON a.patient_id = p.id 
      JOIN users ph ON a.pharmacist_id = ph.id 
      ORDER BY a.date DESC, a.time DESC
    `;
    params = [];
  }

  db.all(query, params, (err, appointments) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ appointments });
  });
});

// Get available pharmacists
router.get('/pharmacists', authenticateToken, (req, res) => {
  const db = getDatabase();

  db.all(
    'SELECT id, name, specialization, phone FROM users WHERE role = "pharmacist"',
    (err, pharmacists) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ pharmacists });
    }
  );
});

// Book new appointment
router.post('/', authenticateToken, requireRole(['patient']), (req, res) => {
  const { pharmacist_id, date, time, consultation_type = 'video', notes } = req.body;

  if (!pharmacist_id || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = getDatabase();

  // Check if pharmacist exists
  db.get('SELECT id FROM users WHERE id = ? AND role = "pharmacist"', [pharmacist_id], (err, pharmacist) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!pharmacist) {
      return res.status(404).json({ error: 'Pharmacist not found' });
    }

    // Check for conflicting appointments
    db.get(
      'SELECT id FROM appointments WHERE pharmacist_id = ? AND date = ? AND time = ? AND status != "cancelled"',
      [pharmacist_id, date, time],
      (err, existing) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existing) {
          return res.status(400).json({ error: 'Time slot not available' });
        }

        // Create appointment
        db.run(
          'INSERT INTO appointments (patient_id, pharmacist_id, date, time, consultation_type, notes) VALUES (?, ?, ?, ?, ?, ?)',
          [req.user.id, pharmacist_id, date, time, consultation_type, notes],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create appointment' });
            }

            res.status(201).json({
              message: 'Appointment booked successfully',
              appointment: {
                id: this.lastID,
                patient_id: req.user.id,
                pharmacist_id,
                date,
                time,
                consultation_type,
                notes,
                status: 'scheduled'
              }
            });
          }
        );
      }
    );
  });
});

// Update appointment status
router.put('/:id/status', authenticateToken, (req, res) => {
  const { status } = req.body;
  const appointmentId = req.params.id;

  if (!['scheduled', 'in_progress', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const db = getDatabase();

  // Check if user has permission to update this appointment
  let query, params;
  if (req.user.role === 'admin') {
    query = 'SELECT * FROM appointments WHERE id = ?';
    params = [appointmentId];
  } else {
    query = 'SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR pharmacist_id = ?)';
    params = [appointmentId, req.user.id, req.user.id];
  }

  db.get(query, params, (err, appointment) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or access denied' });
    }

    db.run(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, appointmentId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update appointment' });
        }

        res.json({ message: 'Appointment status updated successfully' });
      }
    );
  });
});

// Get available time slots for a pharmacist
router.get('/pharmacists/:id/availability', authenticateToken, (req, res) => {
  const pharmacistId = req.params.id;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date parameter required' });
  }

  const db = getDatabase();

  // Get booked time slots for the date
  db.all(
    'SELECT time FROM appointments WHERE pharmacist_id = ? AND date = ? AND status != "cancelled"',
    [pharmacistId, date],
    (err, bookedSlots) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Generate available time slots (9 AM to 5 PM)
      const allSlots = [
        '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
      ];

      const bookedTimes = bookedSlots.map(slot => slot.time);
      const availableSlots = allSlots.filter(time => !bookedTimes.includes(time));

      res.json({ 
        date,
        availableSlots: availableSlots.map(time => ({ time, available: true })),
        bookedSlots: bookedTimes.map(time => ({ time, available: false }))
      });
    }
  );
});

module.exports = router;