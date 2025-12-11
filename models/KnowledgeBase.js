const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Dersler', 'Hocalar', 'Sosyal', 'Kampüs', 'Bölüm Kültürü', 'Sınavlar', 'Projeler', 'Genel'],
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    keywords: [{
        type: String,
        lowercase: true
    }],
    relatedQuestions: [{
        type: String
    }],
    importance: {
        type: Number,
        min: 1,
        max: 5,
        default: 3
    },
    sources: [{
        type: {
            type: String,
            enum: ['Öğrenci Deneyimi', 'Resmi Döküman', 'Hoca Görüşü', 'Topluluk']
        },
        description: String
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    helpfulCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Text search index
knowledgeBaseSchema.index({ question: 'text', answer: 'text', keywords: 'text' });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
