import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User'; 
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

interface SignupRequestBody {
    email: string;
    password: string;
    relationToChild: string;
    childName: string;
    childDob: string; 
    gender?: string; 
    condition?: string[]; 
    dyslexiaTypes?: string[]; 
    otherConditionText?: string; 
    severity: string; 
    specifications?: string; 
    interests?: string[]; 
    learningAreas?: string[]; 
    learningGoals?: string; 
    agreeToTerms: boolean; 
}

interface LoginRequestBody {
    email: string;
    password: string;
}

interface JwtUserPayload {
    id: string;
    email: string;
}

interface AuthenticatedRequest extends Request {
    user?: JwtUserPayload; 
}

router.post('/signup', async (req: Request, res: Response) => {
  try {
    const {
      email: rawEmail,
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

    const email = rawEmail.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (!email || !password || !relationToChild || !childName || !childDob || !severity || agreeToTerms === undefined) {
      return res.status(400).json({ message: 'Missing required fields for signup.' });
    }

    const newUser = new User({
      email,
      password,
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


router.post('/login', async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Email and password are required.' });
        }

        const email = req.body.email.toLowerCase().trim();
        const password = req.body.password;

        console.log(`[LOGIN] Attempting login for email: ${email}`);
        
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`[LOGIN] User not found for email: ${email}`);
            
            return res.status(400).json({ message: 'Invalid credentials' }); 
        }

        console.log(`[LOGIN] User found. Hashed password from DB (first 10 chars): ${user.password.substring(0, 10)}...`);
        console.log(`[LOGIN] Calling comparePassword for email: ${email}`);
        

        const isMatch = await user.comparePassword(password);

        console.log(`[LOGIN] Password comparison result for ${email}: ${isMatch}`);
        

        if (!isMatch) {
            console.log(`[LOGIN] Password mismatch for email: ${email}`);
            
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { user: { id: user._id.toString(), email: user.email } },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { email: user.email, interests: user.interests }
        });
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
    if (!jwtSecret) return res.status(500).send('Server error: JWT secret missing');

    try {
        const decoded = jwt.verify(token, jwtSecret);
        if (typeof decoded === 'object' && decoded !== null && 'user' in decoded) {
            const userPayload = (decoded as { user: JwtUserPayload }).user; 
            if (typeof userPayload.id === 'string' && typeof userPayload.email === 'string') {
                res.status(200).json({ user: userPayload });
            } else {
                console.warn('JWT payload user object missing id or email:', decoded);
                res.status(401).json({ message: 'Invalid token payload format' });
            }
        } else {
            console.warn('JWT decoded payload is not an object or missing "user" property:', decoded);
            res.status(401).json({ message: 'Invalid token payload' });
        }
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
            console.warn(`Profile request: User not found for ID: ${req.user.id}`);
            return res.status(404).json({ message: 'User profile not found.' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Failed to fetch user profile.', error: (error as Error).message });
    }
});

export default router;