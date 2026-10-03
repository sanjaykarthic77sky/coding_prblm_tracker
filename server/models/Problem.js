const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a problem title'],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, 'Please select a platform'],
      enum: {
        values: ['LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks', 'Other'],
        message: '{VALUE} is not a supported platform',
      },
    },
    difficulty: {
      type: String,
      required: [true, 'Please select a difficulty level'],
      enum: {
        values: ['Easy', 'Medium', 'Hard'],
        message: '{VALUE} is not a valid difficulty',
      },
    },
    topic: {
      type: String,
      required: [true, 'Please provide or select a topic'],
      trim: true,
    },
    status: {
      type: String,
      required: [true, 'Please specify problem status'],
      enum: {
        values: ['Solved', 'Unsolved'],
        message: '{VALUE} is not a valid status',
      },
      default: 'Unsolved',
    },
    link: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Problem = mongoose.model('Problem', problemSchema);

module.exports = Problem;
