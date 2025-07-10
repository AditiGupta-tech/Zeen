import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; 
import authMiddleware from '../middleware/authMiddleware'; 

const router = express.Router();
interface AuthenticatedRequest extends Request {
  user?: { id: string; email: string }; 
}

// Signup Route
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      relationToChild,
      childName,
      childDob, 
      gender, 
      condition,
      dyslexiaTypes,
      otherConditionText,
      severity,
      specifications,
      interests,
      learningAreas,
      learningGoals,
      agreeToTerms
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    if (!email || !password || !relationToChild || !childName || !childDob || !severity || agreeToTerms === undefined) {
        return res.status(400).json({ message: 'Missing required fields for signup.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      relationToChild,
      childName,
      childDob: new Date(childDob), 
      gender: gender || '', 
      condition: condition || [],
      dyslexiaTypes: dyslexiaTypes || [],
      otherConditionText: otherConditionText || '',
      severity,
      specifications: specifications || '',
      interests: interests || [],
      learningAreas: learningAreas || [],
      learningGoals: learningGoals || '',
      agreeToTerms,
    });

    await newUser.save();

    const token = jwt.sign(
      { user: { id: newUser._id.toString(), email: newUser.email } }, 
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Signup failed', error: (error as Error).message });
  }
});

// Login Route
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { user: { id: user._id.toString(), email: user.email } }, 
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    res.status(200).json({ message: 'Login successful', token, user: { email: user.email, interests: user.interests } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: (error as Error).message });
  }
});

router.get('/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    console.error('JWT_SECRET is not defined!');
    return res.status(500).send('Server error: JWT secret missing');
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    res.status(200).json({ user: decoded });
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'User not authenticated or ID missing from token.' });
    }

    const user = await User.findById(req.user.id).select(
      'email relationToChild childName childDob gender condition dyslexiaTypes otherConditionText severity specifications interests learningAreas learningGoals'
    );

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Failed to fetch user profile.', error: (error as Error).message });
  }
});

export default router;