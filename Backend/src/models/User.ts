
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  relationToChild: string;
  childName: string;
  childDob: string; 
  condition: string[];
  dyslexiaTypes: string[];
  otherConditionText?: string;
  severity: string;
  specifications?: string;
  interests?: string[];
  learningAreas?: string[];
  learningGoals?: string;
  agreeToTerms: boolean;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Schema
const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  relationToChild: { type: String, required: true },
  childName: { type: String, required: true, trim: true },
  childDob: { type: String, required: true },
  condition: { type: [String], default: [] },
  dyslexiaTypes: { type: [String], default: [] },
  otherConditionText: { type: String, default: '' },
  severity: { type: String, required: true },
  specifications: { type: String, default: '' },
  interests: { type: [String], default: [] },
  learningAreas: { type: [String], default: [] },
  learningGoals: { type: String, default: '' },
  agreeToTerms: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now }
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  if (!this.password) return next(new Error('Password is required'));
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
