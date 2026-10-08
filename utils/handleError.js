// utils/handleError.js - Helper function to handle Mongoose and server errors
module.exports = function handleError(res, err, defaultMessage = 'Internal Server Error') {
  console.error('[Error caught]:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'ValidationError',
      message: err.message,
      details: messages
    });
  }

  // Mongoose invalid ObjectId cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'CastError',
      message: `Invalid ${err.path}: ${err.value}`
    });
  }

  // Duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'DuplicateKeyError',
      message: 'Duplicate key error',
      keyValue: err.keyValue
    });
  }

  // General server error
  return res.status(500).json({
    error: 'ServerError',
    message: err.message || defaultMessage
  });
};
