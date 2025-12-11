const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    department: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    completedCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        grade: String,
        semester: String,
        hasNotes: {
            type: Boolean,
            default: false
        }
    }],
    currentCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    interests: [{
        type: String
    }],
    clubs: [{
        type: String
    }],
    matchingPreferences: {
        lookingForMentor: {
            type: Boolean,
            default: false
        },
        willingToMentor: {
            type: Boolean,
            default: false
        },
        studyGroups: {
            type: Boolean,
            default: true
        }
    },
    matches: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        reason: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
