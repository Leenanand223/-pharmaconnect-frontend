#!/usr/bin/env node

const { initializeDatabase } = require('../database/init');

console.log('🔄 Initializing PharmaConnect database...');

initializeDatabase()
  .then(() => {
    console.log('✅ Database initialization completed successfully!');
    console.log('📊 Default users created:');
    console.log('   Patient: john@example.com / password123');
    console.log('   Pharmacist: sarah@example.com / password123');
    console.log('   Admin: admin@example.com / password123');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  });