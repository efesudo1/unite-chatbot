const express = require('express');
const router = express.Router();
const chatbotService = require('../services/chatbotService');
const ChatMessage = require('../models/ChatMessage');

// POST /api/chatbot/message - Send a message to the chatbot
router.post('/message', async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || !sessionId) {
            return res.status(400).json({ error: 'Mesaj ve session ID gerekli' });
        }

        // Process the message
        const response = await chatbotService.processMessage(message, sessionId);

        // Save to database
        const chatMessage = new ChatMessage({
            sessionId,
            userMessage: message,
            botResponse: response.answer,
            intent: response.intent,
            confidence: response.confidence,
            relatedEntities: response.relatedEntities
        });

        await chatMessage.save();

        res.json({
            answer: response.answer,
            intent: response.intent,
            confidence: response.confidence,
            suggestions: response.suggestions
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Mesaj işlenirken hata oluştu' });
    }
});

// GET /api/chatbot/history/:sessionId - Get chat history
router.get('/history/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const limit = parseInt(req.query.limit) || 50;

        const messages = await ChatMessage
            .find({ sessionId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('userMessage botResponse createdAt');

        res.json(messages.reverse());

    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ error: 'Geçmiş yüklenirken hata oluştu' });
    }
});

// POST /api/chatbot/feedback - Mark message as helpful/not helpful
router.post('/feedback', async (req, res) => {
    try {
        const { messageId, helpful } = req.body;

        await ChatMessage.findByIdAndUpdate(messageId, { helpful });

        res.json({ message: 'Geri bildirim kaydedildi' });

    } catch (error) {
        console.error('Feedback error:', error);
        res.status(500).json({ error: 'Geri bildirim kaydedilemedi' });
    }
});

module.exports = router;
