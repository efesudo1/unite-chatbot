const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        index: true
    },
    userMessage: {
        type: String,
        required: true
    },
    botResponse: {
        type: String,
        required: true
    },
    intent: {
        type: String,
        enum: ['course_info', 'professor_info', 'activity_info', 'student_matching', 'general', 'unknown']
    },
    confidence: {
        type: Number,
        min: 0,
        max: 1
    },
    relatedEntities: {
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        professors: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Professor'
        }],
        activities: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity'
        }]
    },
    helpful: {
        type: Boolean,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
