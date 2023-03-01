const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
      avatar: {
        type: String,
      },
      comments: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Comment'
        },
      ],
    },
    { timestamps: true }
  );
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;