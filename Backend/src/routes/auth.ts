import { Router, Request, Response } from 'express';
import User from '../models/User';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const router = Router();

// POST /api/signup
router.post(
  '/signup',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    body('relationToChild', 'Relation to child is required').notEmpty(),
    body('childName', "Child's name is required").notEmpty(),
    body('childDob', "Child's date of birth is required").notEmpty(),
    body('condition', 'Please select at least one condition').isArray({ min: 1 }),
    body('severity', 'Severity is required').notEmpty(),
    body('agreeToTerms', 'You must agree to the Terms and Privacy Policy')
      .isBoolean()
      .custom(value => value === true),
    body('otherConditionText').custom((value, { req }) => {
      if (req.body.condition?.includes('Other') && !value) {
        throw new Error("Please specify the 'Other' condition.");
      }
      return true;
    }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      relationToChild,
      childName,
      childDob,
      condition,
      dyslexiaTypes,
      otherConditionText,
      severity,
      specifications,
      interests,
      learningAreas,
      learningGoals,
      agreeToTerms,
    } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ message: 'User already exists with this email.' });
      }

      user = new User({
        email,
        password,
        relationToChild,
        childName,
        childDob,
        condition,
        dyslexiaTypes: dyslexiaTypes || [],
        otherConditionText: otherConditionText || '',
        severity,
        specifications: specifications || '',
        interests: interests || [],
        learningAreas: learningAreas || [],
        learningGoals: learningGoals || '',
        agreeToTerms,
      });

      await user.save();

      const payload = { user: { id: user.id, email: user.email } };
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error('JWT_SECRET is not defined!');
        return res.status(500).send('Server Error: JWT secret missing.');
      }

      jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.status(201).json({ message: 'User registered successfully!', token });
        }
      );

    } catch (err: any) {
      console.error(err.message);
      if (err.code === 11000) {
        return res.status(400).json({ message: 'A user with this email already exists.' });
      }
      res.status(500).send('Server Error');
    }
  }
);

// POST /api/login
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const payload = { user: { id: user.id, email: user.email } };
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        console.error("JWT_SECRET is not defined!");
        return res.status(500).send('Server Error: JWT secret missing.');
      }

      jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

    } catch (err: any) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

export default router;
