import express from 'express';
import dotenv from 'dotenv';
import sequelize from './config/database.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
app.use(express.json());

// Mount auth routes
app.use('/api/auth', authRoutes);

// Example route
app.get('/', (req, res) => {
  res.send('Server running!');
});

// Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to sync database:', err);
  });
