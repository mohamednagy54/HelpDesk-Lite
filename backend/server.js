require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'HelpDesk Lite API is running', data: null });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
