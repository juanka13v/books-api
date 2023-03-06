const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    qualification: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'required some text'],
    }
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;