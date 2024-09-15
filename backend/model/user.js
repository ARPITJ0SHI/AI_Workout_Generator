const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isNewUser: { type: Boolean, default: true },
 
  age: { type: Number },
  gender: { type: String },
  height: { type: Number },
  weight: { type: Number },
  goal: { type: String },
  experience: { type: String },
  equipment: [{ type: String }],
  workoutType: { type: String },
  workoutFrequency: { type: String },
  healthCondition: { type: String },
  motivation: { type: String },
  reminders: { type: Boolean },
  preferredWorkoutTime: { type: String },
  createdAt: { type: Date, default: Date.now },
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;