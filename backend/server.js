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
    
    // Allow localhost on any port (development)
    if (/^http:\/\/localhost:\d{2,5}$/.test(origin)) return callback(null, true);
    if (/^http:\/\/127\.0\.0\.1:\d{2,5}$/.test(origin)) return callback(null, true);
    
    // Allow local network access (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
    if (/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:\d{2,5}$/.test(origin)) return callback(null, true);
    if (/^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{2,5}$/.test(origin)) return callback(null, true);
    if (/^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d{1,3}\.\d{1,3}:\d{2,5}$/.test(origin)) return callback(null, true);
    
    console.log('CORS blocked origin:', origin);
    return callback(new Error('CORS not allowed: ' + origin));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Mount routers
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teams', require('./routes/teams'));  // Project management (legacy endpoint)
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/performance', require('./routes/performance'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/chat', require('./routes/chat'));

// Error handling middleware (should be last)
app.use(errorHandler); // FIXED USAGE

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Local access: http://localhost:${PORT}`);
  console.log(`Network access: http://[YOUR_LOCAL_IP]:${PORT}`);
});