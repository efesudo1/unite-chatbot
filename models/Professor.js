const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        enum: ['Prof. Dr.', 'Doç. Dr.', 'Dr. Öğr. Üyesi', 'Öğr. Gör.', 'Arş. Gör.'],
        required: true
    },
    department: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true
    },
    officeLocation: {
        type: String
    },
    officeHours: {
        type: String
    },
    phone: {
        type: String
    },
    researchAreas: [{
        type: String
    }],
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    bio: {
        type: String
    },
    studentReviews: [{
        teachingStyle: String,
        examDifficulty: {
            type: String,
            enum: ['Kolay', 'Orta', 'Zor']
        },
        accessibility: Number,
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

module.exports = mongoose.model('Professor', professorSchema);
