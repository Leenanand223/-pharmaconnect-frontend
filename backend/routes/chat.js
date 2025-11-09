const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get chat messages for an appointment
router.get('/appointment/:appointmentId', authenticateToken, (req, res) => {
  const { appointmentId } = req.params;
  const db = getDatabase();

  // Verify user has access to this appointment
  db.get(
    'SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR pharmacist_id = ?)',
    [appointmentId, req.user.id, req.user.id],
    (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found or access denied' });
      }

      // Get chat messages
      db.all(
        `SELECT cm.*, u.name as sender_name, u.role as sender_role 
         FROM chat_messages cm 
         JOIN users u ON cm.sender_id = u.id 
         WHERE cm.appointment_id = ? 
         ORDER BY cm.timestamp ASC`,
        [appointmentId],
        (err, messages) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          res.json({ messages });
        }
      );
    }
  );
});

// Send a chat message
router.post('/message', authenticateToken, (req, res) => {
  const { appointmentId, message } = req.body;

  if (!appointmentId || !message) {
    return res.status(400).json({ error: 'Appointment ID and message required' });
  }

  const db = getDatabase();

  // Verify user has access to this appointment
  db.get(
    'SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR pharmacist_id = ?)',
    [appointmentId, req.user.id, req.user.id],
    (err, appointment) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!appointment) {
        return res.status(404).json({ error: 'Appointment not found or access denied' });
      }

      // Insert message
      db.run(
        'INSERT INTO chat_messages (appointment_id, sender_id, message) VALUES (?, ?, ?)',
        [appointmentId, req.user.id, message],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to send message' });
          }

          // Get the inserted message with sender info
          db.get(
            `SELECT cm.*, u.name as sender_name, u.role as sender_role 
             FROM chat_messages cm 
             JOIN users u ON cm.sender_id = u.id 
             WHERE cm.id = ?`,
            [this.lastID],
            (err, newMessage) => {
              if (err) {
                return res.status(500).json({ error: 'Database error' });
              }

              res.status(201).json({
                message: 'Message sent successfully',
                chatMessage: newMessage
              });
            }
          );
        }
      );
    }
  );
});

// Get recent conversations for a user
router.get('/conversations', authenticateToken, (req, res) => {
  const db = getDatabase();

  let query;
  if (req.user.role === 'patient') {
    query = `
      SELECT DISTINCT a.id as appointment_id, a.date, a.time, a.status,
             u.name as pharmacist_name, u.specialization,
             (SELECT message FROM chat_messages WHERE appointment_id = a.id ORDER BY timestamp DESC LIMIT 1) as last_message,
             (SELECT timestamp FROM chat_messages WHERE appointment_id = a.id ORDER BY timestamp DESC LIMIT 1) as last_message_time
      FROM appointments a
      JOIN users u ON a.pharmacist_id = u.id
      WHERE a.patient_id = ?
      ORDER BY last_message_time DESC
    `;
  } else if (req.user.role === 'pharmacist') {
    query = `
      SELECT DISTINCT a.id as appointment_id, a.date, a.time, a.status,
             u.name as patient_name, u.phone as patient_phone,
             (SELECT message FROM chat_messages WHERE appointment_id = a.id ORDER BY timestamp DESC LIMIT 1) as last_message,
             (SELECT timestamp FROM chat_messages WHERE appointment_id = a.id ORDER BY timestamp DESC LIMIT 1) as last_message_time
      FROM appointments a
      JOIN users u ON a.patient_id = u.id
      WHERE a.pharmacist_id = ?
      ORDER BY last_message_time DESC
    `;
  }

  db.all(query, [req.user.id], (err, conversations) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ conversations });
  });
});

module.exports = router;