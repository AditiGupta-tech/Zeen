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

// Token Verification Route
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

// Get User Profile Route
router.get('/profile', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  console.log('*** PROFILE ROUTE HIT! ***');
  try {
    if (!req.user || !req.user.id) {
      console.log('User not authenticated or ID missing:', req.user);
      return res.status(401).json({ message: 'User not authenticated or ID missing from token.' });
    }

    const user = await User.findById(req.user.id).select(
      'email relationToChild childName childDob gender condition dyslexiaTypes otherConditionText severity specifications interests learningAreas learningGoals'
    );

    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User profile not found.' });
    }

    console.log('Sending user profile:', user.email);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile in route:', error);
    res.status(500).json({ message: 'Failed to fetch user profile.', error: (error as Error).message });
  }
});

// Get Personalized Schedule Route
router.get('/schedule', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  console.log('*** SCHEDULE ROUTE HIT! ***');
  try {
    if (!req.user || !req.user.id) {
      console.log('User not authenticated or ID missing for schedule:', req.user);
      return res.status(401).json({ message: 'User not authenticated or ID missing from token.' });
    }

    const user = await User.findById(req.user.id).select(
      'severity interests learningAreas learningGoals childName childDob condition dyslexiaTypes'
    );

    if (!user) {
      console.log('User not found for schedule ID:', req.user.id);
      return res.status(404).json({ message: 'User profile not found for schedule generation.' });
    }

    let personalizedSchedule: any[] = []; 

    const baseActivities = [
      { id: 'act1', name: 'Reading Session', description: 'Practice phonics and sight words.', duration: 30, type: 'literacy' },
      { id: 'act2', name: 'Numeracy Games', description: 'Interactive math exercises.', duration: 20, type: 'numeracy' },
      { id: 'act3', name: 'Sensory Play', description: 'Activities for sensory integration.', duration: 45, type: 'sensory' },
      { id: 'act4', name: 'Creative Arts', description: 'Drawing or painting.', duration: 30, type: 'creativity' },
      { id: 'act5', name: 'Movement Break', description: 'Physical activity and gross motor skills.', duration: 15, type: 'physical' },
      { id: 'act6', name: 'Speech & Language Practice', description: 'Exercises for articulation and vocabulary.', duration: 25, type: 'speech' },
      { id: 'act7', name: 'Social Skills Game', description: 'Role-playing or group activities.', duration: 40, type: 'social' },
    ];

    const getRelevantActivities = (user: any) => {
      let activities = [...baseActivities]; 

      if (user.learningAreas && user.learningAreas.length > 0) {
        activities = activities.filter(activity =>
          user.learningAreas.some((area: string) => activity.type.toLowerCase().includes(area.toLowerCase()))
        );
      }

      if (user.interests && user.interests.includes('drawing')) {
        activities.push({ id: 'act8', name: 'Art Project: Drawing', description: 'Detailed drawing activity.', duration: 45, type: 'creativity' });
      }

      if (user.condition && user.condition.includes('ADHD')) {
        activities = activities.map(activity => ({
          ...activity,
          duration: activity.duration > 30 ? 30 : activity.duration 
        }));
      }

      return activities;
    };

    const relevantActivities = getRelevantActivities(user);

    switch (user.severity) {
      case 'Mild':
        personalizedSchedule = [
          { day: 'Monday', time: '10:00 AM', activity: relevantActivities[0] || baseActivities[0], notes: 'Focus on identified learning gaps.' },
          { day: 'Tuesday', time: '02:00 PM', activity: relevantActivities[1] || baseActivities[1], notes: 'Interactive and fun.' },
          { day: 'Wednesday', time: '11:00 AM', activity: relevantActivities[2] || baseActivities[2], notes: 'Sensory breaks as needed.' },
        ];
        break;
      case 'Moderate':
        personalizedSchedule = [
          { day: 'Monday', time: '09:30 AM', activity: relevantActivities[0] || baseActivities[0], notes: 'Structured learning session.' },
          { day: 'Monday', time: '01:30 PM', activity: relevantActivities[2] || baseActivities[2], notes: 'Hands-on exploration.' },
          { day: 'Tuesday', time: '10:30 AM', activity: relevantActivities[1] || baseActivities[1], notes: 'Problem-solving focus.' },
          { day: 'Wednesday', time: '03:00 PM', activity: relevantActivities[4] || baseActivities[4], notes: 'Outdoor and active.' },
          { day: 'Thursday', time: '11:00 AM', activity: relevantActivities[5] || baseActivities[5], notes: 'Targeted communication practice.' },
        ];
        break;
      case 'Severe':
        personalizedSchedule = [
          { day: 'Monday', time: '09:00 AM', activity: relevantActivities[0] || baseActivities[0], notes: 'Short, intensive session.' },
          { day: 'Monday', time: '10:30 AM', activity: relevantActivities[2] || baseActivities[2], notes: 'Highly guided sensory activity.' },
          { day: 'Monday', time: '02:00 PM', activity: relevantActivities[4] || baseActivities[4], notes: 'Brief structured movement.' },
          { day: 'Tuesday', time: '09:00 AM', activity: relevantActivities[1] || baseActivities[1], notes: 'Repetitive skill building.' },
          { day: 'Tuesday', time: '11:00 AM', activity: relevantActivities[5] || baseActivities[5], notes: 'Pronunciation and word recognition.' },
          { day: 'Wednesday', time: '09:00 AM', activity: relevantActivities[0] || baseActivities[0], notes: 'Review and reinforce previous lessons.' },
        ];
        break;
      default:
        personalizedSchedule = [
          { day: 'Daily', time: 'Flexible', activity: { id: 'default', name: 'General Learning & Play', description: 'Engage in varied educational activities suitable for child.', duration: 60, type: 'general' } }
        ];
        break;
    }
    
    console.log(`Generated schedule for user ${user.email} with severity ${user.severity}`);
    res.status(200).json({ message: 'Schedule fetched successfully', schedule: personalizedSchedule });

  } catch (error) {
    console.error('Error fetching schedule:', error);
    res.status(500).json({ message: 'Failed to fetch schedule.', error: (error as Error).message });
  }
});

export default router;