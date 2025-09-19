const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler'); // FIXED IMPORT

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({
  origin: (origin, callback) => {
    const allowed = process.env.CLIENT_URL;
    if (!origin) return callback(null, true); // non-browser or same-origin
    if (allowed && origin === allowed) return callback(null, true);
    // allow any localhost port in dev
    if (/^http:\/\/localhost:\d{2,5}$/.test(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed: ' + origin));
  },
  credentials: true
}));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/chat', require('./routes/chat'));

// Error handling middleware (should be last)
app.use(errorHandler); // FIXED USAGE

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));