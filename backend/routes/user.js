import express from 'express';
import User from '../models/User.js';
import Result from '../models/Result.js';
import { protect } from '../midddleware/auth.js';

const router = express.Router();

// @route GET /api/users/profile - Get user profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const results = await Result.find({ user: req.user._id })
      .sort({ completedAt: -1 })
      .limit(10);
 
    const stats = {
      totalQuizzes: user.totalQuizzesTaken,
      totalScore: user.totalScore,
      averageScore: results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
        : 0,
      bestScore: results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0,
      recentResults: results
    };
 
    res.json({ success: true, user, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
 
// @route GET /api/users/leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.find()
      .sort({ totalScore: -1 })
      .limit(10)
      .select('username totalScore totalQuizzesTaken createdAt');
    
    res.json({ success: true, leaderboard: users });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
 
export default router;
 