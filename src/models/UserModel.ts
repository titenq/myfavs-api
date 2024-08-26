import { pbkdf2Sync, randomBytes } from 'node:crypto';

import mongoose from '../db';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  picture: {
    type: String
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { collection: 'users' });

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = randomBytes(16).toString('hex');
  const hash = pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString('hex');

  this.password = `${salt}:${hash}`;
  
  next();
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
