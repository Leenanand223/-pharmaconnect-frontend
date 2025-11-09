const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authenticateToken, requireRole(['admin']), (req, res) => {
  const db = getDatabase();

  db.all(
    'SELECT id, email, name, role, phone, address, license, specialization, created_at FROM users ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ users });
    }
  );
});

// Get user statistics (admin only)
router.get('/stats', authenticateToken, requireRole(['admin']), (req, res) => {
  const db = getDatabase();

  const queries = [
    'SELECT COUNT(*) as total_users FROM users',
    'SELECT COUNT(*) as total_patients FROM users WHERE role = "patient"',
    'SELECT COUNT(*) as total_pharmacists FROM users WHERE role = "pharmacist"',
    'SELECT COUNT(*) as total_appointments FROM appointments',
    'SELECT COUNT(*) as active_appointments FROM appointments WHERE status = "scheduled"',
    'SELECT COUNT(*) as completed_appointments FROM appointments WHERE status = "completed"'
  ];

  const stats = {};
  let completed = 0;

  queries.forEach((query, index) => {
    db.get(query, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const key = Object.keys(result)[0];
      stats[key] = result[key];

      completed++;
      if (completed === queries.length) {
        res.json({ stats });
      }
    });
  });
});

// Get pharmacists list
router.get('/pharmacists', authenticateToken, (req, res) => {
  const db = getDatabase();

  db.all(
    'SELECT id, name, specialization, phone, license FROM users WHERE role = "pharmacist"',
    (err, pharmacists) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ pharmacists });
    }
  );
});

// Update user role (admin only)
router.put('/:id/role', authenticateToken, requireRole(['admin']), (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!['patient', 'pharmacist', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const db = getDatabase();

  db.run(
    'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [role, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update user role' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'User role updated successfully' });
    }
  );
});

// Delete user (admin only)
router.delete('/:id', authenticateToken, requireRole(['admin']), (req, res) => {
  const userId = req.params.id;

  if (userId == req.user.id) {
    return res.status(400).json({ error: 'Cannot delete your own account' });
  }

  const db = getDatabase();

  // Check if user has appointments
  db.get(
    'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ? OR pharmacist_id = ?',
    [userId, userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.count > 0) {
        return res.status(400).json({ 
          error: 'Cannot delete user with existing appointments. Cancel appointments first.' 
        });
      }

      // Delete user
      db.run('DELETE FROM users WHERE id = ?', [userId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (this.changes === 0) {
          return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
      });
    }
  );
});

// Get user profile by ID (admin or self)
router.get('/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;

  // Check if user is accessing their own profile or is admin
  if (req.user.id != userId && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const db = getDatabase();

  db.get(
    'SELECT id, email, name, role, phone, address, license, specialization, created_at FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user });
    }
  );
});

module.exports = router;