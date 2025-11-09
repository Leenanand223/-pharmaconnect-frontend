const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || './database.sqlite';

let db;

const initializeDatabase = () => {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log('📁 Connected to SQLite database');
      createTables().then(resolve).catch(reject);
    });
  });
};

const createTables = () => {
  return new Promise((resolve, reject) => {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('patient', 'pharmacist', 'admin')),
        phone TEXT,
        address TEXT,
        license TEXT,
        specialization TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Appointments table
      `CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        pharmacist_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
        consultation_type TEXT DEFAULT 'video',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users (id),
        FOREIGN KEY (pharmacist_id) REFERENCES users (id)
      )`,

      // Chat messages table
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointment_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments (id),
        FOREIGN KEY (sender_id) REFERENCES users (id)
      )`,

      // Prescriptions table
      `CREATE TABLE IF NOT EXISTS prescriptions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        pharmacist_id INTEGER,
        medication TEXT NOT NULL,
        dosage TEXT NOT NULL,
        instructions TEXT,
        status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'cancelled')),
        image_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES users (id),
        FOREIGN KEY (pharmacist_id) REFERENCES users (id)
      )`,

      // Video sessions table
      `CREATE TABLE IF NOT EXISTS video_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        appointment_id INTEGER NOT NULL,
        room_id TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting', 'active', 'ended')),
        started_at DATETIME,
        ended_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (appointment_id) REFERENCES appointments (id)
      )`
    ];

    let completed = 0;
    tables.forEach((sql, index) => {
      db.run(sql, (err) => {
        if (err) {
          reject(err);
          return;
        }
        completed++;
        if (completed === tables.length) {
          console.log('✅ Database tables created successfully');
          seedInitialData().then(resolve).catch(reject);
        }
      });
    });
  });
};

const seedInitialData = async () => {
  return new Promise((resolve, reject) => {
    // Check if users already exist
    db.get("SELECT COUNT(*) as count FROM users", async (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      if (row.count > 0) {
        console.log('📊 Database already has data, skipping seed');
        resolve();
        return;
      }

      try {
        // Create default users
        const hashedPassword = await bcrypt.hash('password123', 10);
        
        const users = [
          {
            email: 'john@example.com',
            password: hashedPassword,
            name: 'John Doe',
            role: 'patient',
            phone: '+1-234-567-8900',
            address: '123 Main St, City, State'
          },
          {
            email: 'sarah@example.com',
            password: hashedPassword,
            name: 'Dr. Sarah Smith',
            role: 'pharmacist',
            phone: '+1-234-567-8901',
            license: 'PH12345',
            specialization: 'Clinical Pharmacy'
          },
          {
            email: 'admin@example.com',
            password: hashedPassword,
            name: 'Admin User',
            role: 'admin',
            phone: '+1-234-567-8902'
          }
        ];

        let insertedUsers = 0;
        users.forEach((user) => {
          db.run(
            `INSERT INTO users (email, password, name, role, phone, address, license, specialization) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user.email, user.password, user.name, user.role, user.phone, user.address, user.license, user.specialization],
            function(err) {
              if (err) {
                reject(err);
                return;
              }
              insertedUsers++;
              if (insertedUsers === users.length) {
                console.log('👥 Default users created successfully');
                seedAppointments().then(resolve).catch(reject);
              }
            }
          );
        });
      } catch (error) {
        reject(error);
      }
    });
  });
};

const seedAppointments = () => {
  return new Promise((resolve, reject) => {
    const appointments = [
      {
        patient_id: 1,
        pharmacist_id: 2,
        date: '2025-11-05',
        time: '10:00 AM',
        status: 'scheduled'
      },
      {
        patient_id: 1,
        pharmacist_id: 2,
        date: '2025-11-06',
        time: '2:00 PM',
        status: 'scheduled'
      }
    ];

    let inserted = 0;
    appointments.forEach((apt) => {
      db.run(
        `INSERT INTO appointments (patient_id, pharmacist_id, date, time, status) VALUES (?, ?, ?, ?, ?)`,
        [apt.patient_id, apt.pharmacist_id, apt.date, apt.time, apt.status],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          inserted++;
          if (inserted === appointments.length) {
            console.log('📅 Sample appointments created');
            resolve();
          }
        }
      );
    });
  });
};

const getDatabase = () => {
  if (!db) {
    throw new Error('Database not initialized');
  }
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase
};