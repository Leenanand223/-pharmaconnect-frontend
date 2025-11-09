const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create video session for appointment
router.post('/session', authenticateToken, (req, res) => {
  const { appointmentId } = req.body;

  if (!appointmentId) {
    return res.status(400).json({ error: 'Appointment ID required' });
  }

  const db = getDatabase();

  // Verify user has access to this appointment
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

    // Check if video session already exists
    db.get('SELECT * FROM video_sessions WHERE appointment_id = ?', [appointmentId], (err, existingSession) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingSession) {
        return res.json({
          sessionId: existingSession.id,
          roomId: existingSession.room_id,
          status: existingSession.status
        });
      }

      // Create new video session
      const roomId = uuidv4();

      db.run(
        'INSERT INTO video_sessions (appointment_id, room_id) VALUES (?, ?)',
        [appointmentId, roomId],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create video session' });
          }

          res.status(201).json({
            sessionId: this.lastID,
            roomId,
            status: 'waiting',
            appointmentId
          });
        }
      );
    });
  });
});

// Join video session
router.post('/session/:roomId/join', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const db = getDatabase();

  db.get('SELECT * FROM video_sessions WHERE room_id = ?', [roomId], (err, session) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!session) {
      return res.status(404).json({ error: 'Video session not found' });
    }

    // Verify user has access to this session's appointment
    db.get(
      'SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR pharmacist_id = ?)',
      [session.appointment_id, req.user.id, req.user.id],
      (err, appointment) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!appointment) {
          return res.status(403).json({ error: 'Access denied to this video session' });
        }

        // Update session status to active if it's the first join
        if (session.status === 'waiting') {
          db.run(
            'UPDATE video_sessions SET status = "active", started_at = CURRENT_TIMESTAMP WHERE id = ?',
            [session.id],
            (err) => {
              if (err) {
                console.error('Failed to update session status:', err);
              }
            }
          );
        }

        res.json({
          sessionId: session.id,
          roomId: session.room_id,
          status: 'active',
          appointmentId: session.appointment_id,
          userRole: req.user.role
        });
      }
    );
  });
});

// End video session
router.post('/session/:roomId/end', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const db = getDatabase();

  db.get('SELECT * FROM video_sessions WHERE room_id = ?', [roomId], (err, session) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!session) {
      return res.status(404).json({ error: 'Video session not found' });
    }

    // Verify user has access to this session
    db.get(
      'SELECT * FROM appointments WHERE id = ? AND (patient_id = ? OR pharmacist_id = ?)',
      [session.appointment_id, req.user.id, req.user.id],
      (err, appointment) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!appointment) {
          return res.status(403).json({ error: 'Access denied' });
        }

        // Update session and appointment status
        db.run(
          'UPDATE video_sessions SET status = "ended", ended_at = CURRENT_TIMESTAMP WHERE id = ?',
          [session.id],
          (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to end session' });
            }

            // Update appointment status to completed
            db.run(
              'UPDATE appointments SET status = "completed" WHERE id = ?',
              [session.appointment_id],
              (err) => {
                if (err) {
                  console.error('Failed to update appointment status:', err);
                }

                res.json({ message: 'Video session ended successfully' });
              }
            );
          }
        );
      }
    );
  });
});

// Get session info
router.get('/session/:roomId', authenticateToken, (req, res) => {
  const { roomId } = req.params;
  const db = getDatabase();

  db.get(
    `SELECT vs.*, a.date, a.time, 
            p.name as patient_name, ph.name as pharmacist_name
     FROM video_sessions vs
     JOIN appointments a ON vs.appointment_id = a.id
     JOIN users p ON a.patient_id = p.id
     JOIN users ph ON a.pharmacist_id = ph.id
     WHERE vs.room_id = ?`,
    [roomId],
    (err, session) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({ session });
    }
  );
});

module.exports = router;