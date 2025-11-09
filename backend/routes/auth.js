const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, role, phone, address, license, specialization } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!['patient', 'pharmacist', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const db = getDatabase();

    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        return res.status(400).json({ error: 'User already exists' });
      }

      try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user
        db.run(
          `INSERT INTO users (email, password, name, role, phone, address, license, specialization) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [email, hashedPassword, name, role, phone, address, license, specialization],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to create user' });
            }

            // Generate JWT token
            const token = jwt.sign(
              { id: this.lastID, email, role },
              process.env.JWT_SECRET,
              { expiresIn: '24h' }
            );

            res.status(201).json({
              message: 'User created successfully',
              token,
              user: {
                id: this.lastID,
                email,
                name,
                role,
                phone,
                address,
                license,
                specialization
              }
            });
          }
        );
      } catch (error) {
        res.status(500).json({ error: 'Password hashing failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const db = getDatabase();

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      try {
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
          { id: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
            address: user.address,
            license: user.license,
            specialization: user.specialization
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Password verification failed' });
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, (req, res) => {
  const db = getDatabase();

  db.get('SELECT id, email, name, role, phone, address, license, specialization FROM users WHERE id = ?', 
    [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  });
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { name, phone, address, specialization } = req.body;
  const db = getDatabase();

  db.run(
    'UPDATE users SET name = ?, phone = ?, address = ?, specialization = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [name, phone, address, specialization, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update profile' });
      }

      res.json({ message: 'Profile updated successfully' });
    }
  );
});

module.exports = router;