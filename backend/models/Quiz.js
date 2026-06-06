import mongoose from "mongoose";

const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['HTML', 'CSS', 'JS', 'React', 'Mixed'],
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'mixed'],
        required: true
    },
    icon: {
        type: String,
        default: '🧠'
    },
    color: {
        type: String,
        default: '#6366f1'
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    timeLimit: {
        type: Number, // in seconds per question
        default: 30
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    averageScore: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Quiz', quizSchema);