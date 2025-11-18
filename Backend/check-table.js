import sequelize from './config/db.js';

async function checkTableStructure() {
  try {
    const [results] = await sequelize.query("DESCRIBE jobs");
    console.log('Current jobs table structure:');
    console.table(results);
    
    // Also check if table exists at all
    const [tableExists] = await sequelize.query("SHOW TABLES LIKE 'jobs'");
    console.log('\nTable exists:', tableExists.length > 0);
    
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkTableStructure();