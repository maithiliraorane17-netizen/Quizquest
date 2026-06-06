import express from 'express';
import Result from '../models/Result.js';
import { protect } from '../midddleware/auth.js';

const router = express.Router();


// @route GET /api/results - Get user results
router.get('/', protect, async (req, res) => {
    try {
        const results = await Result.find({ user: req.user._id })
          .populate('quiz', 'title category icon color')
          .sort({ completedAt: -1 });
        res.json({ success: true, results });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// @route GET /api/results/:id - Get single result
router.get('/:id', protect, async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
        .populate('quiz', 'title category icon color');

        if (!result) return res.status(404).json({ success: false, message: 'Result not found' });
        if (result.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


export default router;