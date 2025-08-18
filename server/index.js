const express = require('express');
const cors = require('cors');
require('dotenv').config({path: './server/.env'});
const { sequelize } = require('./models');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const docsRoutes = require('./routes/docs');
const notificationsRoutes = require('./routes/notifications');
const productRoutes = require('./routes/products');
const applicationRoutes = require('./routes/applications');
const applicationFiles = require('./routes/applicationFiles');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging middleware
app.use(cookieParser()); // Middleware to parse cookies
app.use('/api/auth', authRoutes);
app.use('/api/docs', docsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/config', productRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/applications/:applicationId/files', applicationFiles);

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
