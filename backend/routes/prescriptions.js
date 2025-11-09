const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { getDatabase } = require('../database/init');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'prescription-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (JPEG, JPG, PNG) and PDF files are allowed'));
    }
  }
});

// Get prescriptions for a user
router.get('/', authenticateToken, (req, res) => {
  const db = getDatabase();
  let query, params;

  if (req.user.role === 'patient') {
    query = `
      SELECT p.*, u.name as pharmacist_name, u.specialization 
      FROM prescriptions p 
      LEFT JOIN users u ON p.pharmacist_id = u.id 
      WHERE p.patient_id = ? 
      ORDER BY p.created_at DESC
    `;
    params = [req.user.id];
  } else if (req.user.role === 'pharmacist') {
    query = `
      SELECT p.*, u.name as patient_name, u.phone as patient_phone 
      FROM prescriptions p 
      JOIN users u ON p.patient_id = u.id 
      WHERE p.pharmacist_id = ? OR p.pharmacist_id IS NULL
      ORDER BY p.created_at DESC
    `;
    params = [req.user.id];
  } else {
    // Admin can see all prescriptions
    query = `
      SELECT p.*, 
             pt.name as patient_name, pt.phone as patient_phone,
             ph.name as pharmacist_name, ph.specialization 
      FROM prescriptions p 
      JOIN users pt ON p.patient_id = pt.id 
      LEFT JOIN users ph ON p.pharmacist_id = ph.id 
      ORDER BY p.created_at DESC
    `;
    params = [];
  }

  db.all(query, params, (err, prescriptions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ prescriptions });
  });
});

// Create new prescription request (patient)
router.post('/request', authenticateToken, requireRole(['patient']), upload.single('prescription_image'), (req, res) => {
  const { medication, dosage, instructions } = req.body;

  if (!medication || !dosage) {
    return res.status(400).json({ error: 'Medication and dosage are required' });
  }

  const db = getDatabase();
  const imagePath = req.file ? req.file.filename : null;

  db.run(
    'INSERT INTO prescriptions (patient_id, medication, dosage, instructions, image_path) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, medication, dosage, instructions, imagePath],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to create prescription request' });
      }

      res.status(201).json({
        message: 'Prescription request created successfully',
        prescription: {
          id: this.lastID,
          patient_id: req.user.id,
          medication,
          dosage,
          instructions,
          image_path: imagePath,
          status: 'active'
        }
      });
    }
  );
});

// Update prescription (pharmacist)
router.put('/:id', authenticateToken, requireRole(['pharmacist', 'admin']), (req, res) => {
  const { medication, dosage, instructions, status } = req.body;
  const prescriptionId = req.params.id;

  const db = getDatabase();

  // Verify prescription exists
  db.get('SELECT * FROM prescriptions WHERE id = ?', [prescriptionId], (err, prescription) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // Update prescription
    db.run(
      `UPDATE prescriptions 
       SET medication = ?, dosage = ?, instructions = ?, status = ?, pharmacist_id = ? 
       WHERE id = ?`,
      [medication, dosage, instructions, status, req.user.id, prescriptionId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to update prescription' });
        }

        res.json({ message: 'Prescription updated successfully' });
      }
    );
  });
});

// Get prescription image
router.get('/:id/image', authenticateToken, (req, res) => {
  const prescriptionId = req.params.id;
  const db = getDatabase();

  // Verify user has access to this prescription
  let query, params;
  if (req.user.role === 'admin') {
    query = 'SELECT * FROM prescriptions WHERE id = ?';
    params = [prescriptionId];
  } else {
    query = 'SELECT * FROM prescriptions WHERE id = ? AND (patient_id = ? OR pharmacist_id = ?)';
    params = [prescriptionId, req.user.id, req.user.id];
  }

  db.get(query, params, (err, prescription) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found or access denied' });
    }

    if (!prescription.image_path) {
      return res.status(404).json({ error: 'No image found for this prescription' });
    }

    const imagePath = path.join(process.env.UPLOAD_DIR || './uploads', prescription.image_path);

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: 'Image file not found' });
    }

    res.sendFile(path.resolve(imagePath));
  });
});

// Delete prescription
router.delete('/:id', authenticateToken, (req, res) => {
  const prescriptionId = req.params.id;
  const db = getDatabase();

  // Verify user has permission to delete
  let query, params;
  if (req.user.role === 'admin') {
    query = 'SELECT * FROM prescriptions WHERE id = ?';
    params = [prescriptionId];
  } else if (req.user.role === 'patient') {
    query = 'SELECT * FROM prescriptions WHERE id = ? AND patient_id = ?';
    params = [prescriptionId, req.user.id];
  } else {
    return res.status(403).json({ error: 'Insufficient permissions' });
  }

  db.get(query, params, (err, prescription) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found or access denied' });
    }

    // Delete the prescription
    db.run('DELETE FROM prescriptions WHERE id = ?', [prescriptionId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete prescription' });
      }

      // Delete associated image file if exists
      if (prescription.image_path) {
        const imagePath = path.join(process.env.UPLOAD_DIR || './uploads', prescription.image_path);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      res.json({ message: 'Prescription deleted successfully' });
    });
  });
});

module.exports = router;