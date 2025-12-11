const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        enum: ['Akademik', 'Sosyal', 'Spor', 'Sanat', 'Kariyer', 'Gönüllülük', 'Diğer'],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    location: {
        name: String,
        address: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration: {
        type: String
    },
    capacity: {
        type: Number
    },
    registeredStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    contactInfo: {
        name: String,
        email: String,
        phone: String
    },
    benefits: [{
        type: String
    }],
    requirements: [{
        type: String
    }],
    imageUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['Yaklaşan', 'Devam Ediyor', 'Tamamlandı', 'İptal'],
        default: 'Yaklaşan'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Activity', activitySchema);
