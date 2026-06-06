import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../midddleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET, {expiresIn: '7d'}); 
};

// @route POST /api/auth/register
router.post('/register', [
    body('username').trim().isLength({ min:3, max: 20 }).withMessage('Username must be 3-20 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ $or: [{email}, {username}] });
        if (existingUser) {
            const field = existingUser.email === email ? 'Email' : 'Username';
            return res.status(400).json({ success: false, message: `${field} already exists` }); 
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                totalQuizzesTaken: user.totalQuizzesTaken,
                totalScore: user.totalScore,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route POST /api/auth/login
router.post('/login', [
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { email, password } = req.body;
 
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

        const token = generateToken(user._id);

         res.json({
           success: true,
           message: 'Login successful!',
           token,
           user: {
            id: user._id,
            username: user.username,
            email: user.email,
            totalQuizzesTaken: user.totalQuizzesTaken,
            totalScore: user.totalScore,
            createdAt: user.createdAt
         }
      });
    } catch (error) {
       console.error(error);
    res.status(500).json({ success: false, message: 'Server error' }); 
    }
});

// @route GET /api/auth/me
router.get('/me', protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});
 
export default router;