const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    credits: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    semester: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    description: {
        type: String,
        required: true
    },
    topics: [{
        type: String
    }],
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    professors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Professor'
    }],
    difficulty: {
        type: String,
        enum: ['Kolay', 'Orta', 'Zor', 'Çok Zor'],
        default: 'Orta'
    },
    studentComments: [{
        comment: String,
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
