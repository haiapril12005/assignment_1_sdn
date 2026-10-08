require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const quizRouter = require('./routes/quizRouter');
const questionRouter = require('./routes/questionRouter');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URL =
  process.env.MONGO_URL ||
  process.env.MONGODB_URL ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/SimpleQuiz';

// 1. CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 2. Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Static files for visual Web UI demo
app.use(express.static(path.join(__dirname, 'public')));

// 4. Server & Database Health Check Route
app.get('/api/status', (req, res) => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const dbState = mongoose.connection.readyState;
  res.status(200).json({
    status: 'ok',
    message: 'SimpleQuiz REST API Server is running',
    database: {
      status: states[dbState] || 'unknown',
      name: mongoose.connection.name || 'SimpleQuiz'
    }
  });
});

// 5. Mount REST API Routers
app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);
app.use('/question', questionRouter); // Hỗ trợ cả /question theo đúng yêu cầu đề bài

// 6. Handle 404 Not Found
app.use((req, res) => {
  res.status(404).json({
    error: 'NotFound',
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Global Error]:', err);
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong on the server'
  });
});

// 8. Connect to MongoDB
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log(`[MongoDB] Connected successfully to database: ${mongoose.connection.name}`);
  })
  .catch((err) => {
    console.error(`[MongoDB] Connection error:`, err.message);
  });

// 9. Start server if run directly (node app.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[HTTP Server] SimpleQuiz running at: http://localhost:${PORT}`);
  });
}

module.exports = app;
