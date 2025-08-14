const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const docsRoutes = require('./routes/docs');
const notificationsRoutes = require('./routes/notifications');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging middleware

app.use('/api/auth', authRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/', (req, res) => {
  res.send('API Running');
});

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to sync database:', err);
});
