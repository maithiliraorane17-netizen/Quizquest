import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    questionId: {
        type: Number,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true,
        unique: true
    },
    options: [{
        type: String,
        required: true
    }],
    answer: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    category: {
        type: String,
        enum: ['HTML', 'CSS', 'JS', 'React'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Question', questionSchema);
