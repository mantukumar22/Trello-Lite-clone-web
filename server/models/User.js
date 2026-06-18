const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: true,
      trim:     true
    },
    email: {
      type:      String,
      required:  true,
      unique:    true,
      lowercase: true,
      trim:      true
    },
    password: {
      type:      String,
      required:  true,
      minlength: 6
    },
    role: {
      type:    String,
      enum:    ['admin', 'member', 'viewer'],
      default: 'member'
    },
    // ✅ ADD THIS
    refreshToken: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (err) {
    throw new Error('Error hashing password');
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);