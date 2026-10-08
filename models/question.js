const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true
    },
    options: {
      type: [String],
      required: [true, 'Options array is required'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length >= 2;
        },
        message: 'Options must contain at least 2 choices'
      }
    },
    keywords: {
      type: [String],
      default: []
    },
    correctAnswerIndex: {
      type: Number,
      required: [true, 'correctAnswerIndex is required'],
      min: [0, 'correctAnswerIndex must be non-negative'],
      validate: {
        validator: function (val) {
          if (!this.options || !Array.isArray(this.options)) return true;
          return val < this.options.length;
        },
        message: 'correctAnswerIndex must be a valid index within options'
      }
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Question', questionSchema);
