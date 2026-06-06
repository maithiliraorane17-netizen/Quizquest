import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    quizTitle: String,
    category: String,
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    wrongAnswers: {
        type: Number,
        required: true
    },
    skippedAnswers: {
        type: Number,
        default: 0
    },
    percentage: {
        type: Number,
        required: true
    },
    timeTaken: {
        type: Number, // in seconds
        default: 0
    },
    answers: [{
        questionId: Number,
        question: String,
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean
    }],
    grade: {
        type: String,
        enum: ['A+', 'A', 'B', 'C', 'D', 'F'],
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
  }
});




export default mongoose.model('Result', resultSchema);