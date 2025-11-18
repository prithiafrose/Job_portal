import sequelize from './config/db.js';

async function addPostedByColumn() {
  try {
    // Add the posted_by column to the jobs table
    await sequelize.query(`
      ALTER TABLE jobs 
      ADD COLUMN posted_by INT,
      ADD FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL
    `);
    console.log('✅ Added posted_by column to jobs table');
    
    // Check the updated structure
    const [results] = await sequelize.query("DESCRIBE jobs");
    console.log('Updated jobs table structure:');
    console.table(results);
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error.message);
    await sequelize.close();
  }
}

addPostedByColumn();