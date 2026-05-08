const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const performanceRoutes = require('./src/routes/performanceRoutes');
const userRoutes = require('./src/routes/userRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorMiddleware');

const app = express();

// Security & Rate Limiting Middleware
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit each IP to 20 requests per `window` for auth
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes' }
});

// Apply rate limiting
app.use('/api/', apiLimiter);
app.use('/api/auth/', authLimiter);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/users', userRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('StudyHub NG API is running...');
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
