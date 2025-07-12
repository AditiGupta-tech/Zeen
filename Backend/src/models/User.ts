import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId; 
  email: string;
  password: string;
  relationToChild: string;
  childName: string;
  childDob: Date;
  gender?: string;
  condition: string[];
  dyslexiaTypes: string[];
  otherConditionText?: string;
  severity: string;
  specifications?: string;
  interests: string[];
  learningAreas: string[];
  learningGoals?: string;
  agreeToTerms: boolean;
  createdAt: Date;
  updatedAt: Date; 

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  relationToChild: { type: String, required: true },
  childName: { type: String, required: true, trim: true },
  childDob: { type: Date, required: true },
  gender: { type: String }, 
  condition: { type: [String], default: [] },
  dyslexiaTypes: { type: [String], default: [] },
  otherConditionText: { type: String, default: '' },
  severity: { type: String, required: true },
  specifications: { type: String, default: '' },
  interests: { type: [String], default: [] },
  learningAreas: { type: [String], default: [] },
  learningGoals: { type: String, default: '' },
  agreeToTerms: { type: Boolean, required: true },
}, {
  timestamps: true
});

UserSchema.pre<IUser>('save', async function (next) {
  if (this.isModified('email') && typeof this.email === 'string') {
    this.email = this.email.toLowerCase().trim();
  }

  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
      return false;
  }
  return bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
export default User;