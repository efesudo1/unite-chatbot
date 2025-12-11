/**
 * NLP Helper utilities for chatbot
 */

// Common Turkish stop words
const STOP_WORDS = new Set([
    've', 'veya', 'bir', 'bu', 'şu', 'o', 'mi', 'mı', 'mu', 'mü',
    'ile', 'için', 'ne', 'nedir', 'nasıl', 'hakkında', 'gibi', 'kadar',
    'daha', 'en', 'çok', 'az', 'var', 'yok', 'da', 'de', 'ta', 'te'
]);

class NLPHelper {
    /**
     * Extract keywords from a message
     * @param {string} message - User message
     * @returns {Array<string>} - Array of keywords
     */
    extractKeywords(message) {
        // Convert to lowercase and remove punctuation
        const cleaned = message.toLowerCase()
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, ' ')
            .trim();

        // Split into words
        const words = cleaned.split(/\s+/);

        // Filter out stop words and short words
        const keywords = words.filter(word =>
            word.length > 2 && !STOP_WORDS.has(word)
        );

        return [...new Set(keywords)]; // Remove duplicates
    }

    /**
     * Check if message contains any of the given terms
     * @param {string} message - User message
     * @param {Array<string>} terms - Terms to check
     * @returns {boolean}
     */
    containsAny(message, terms) {
        const lowerMessage = message.toLowerCase();
        return terms.some(term => lowerMessage.includes(term.toLowerCase()));
    }

    /**
     * Check if message contains all of the given terms
     * @param {string} message - User message
     * @param {Array<string>} terms - Terms to check
     * @returns {boolean}
     */
    containsAll(message, terms) {
        const lowerMessage = message.toLowerCase();
        return terms.every(term => lowerMessage.includes(term.toLowerCase()));
    }

    /**
     * Calculate similarity between two strings (simple Jaccard similarity)
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {number} - Similarity score between 0 and 1
     */
    calculateSimilarity(str1, str2) {
        const words1 = new Set(this.extractKeywords(str1));
        const words2 = new Set(this.extractKeywords(str2));

        if (words1.size === 0 && words2.size === 0) return 1;
        if (words1.size === 0 || words2.size === 0) return 0;

        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);

        return intersection.size / union.size;
    }

    /**
     * Extract course codes from message (e.g., BIL211, CSE101)
     * @param {string} message - User message
     * @returns {Array<string>} - Array of course codes
     */
    extractCourseCodes(message) {
        const pattern = /\b[A-Z]{2,4}\s?\d{3}\b/gi;
        const matches = message.match(pattern);
        return matches ? matches.map(m => m.replace(/\s/g, '').toUpperCase()) : [];
    }

    /**
     * Normalize Turkish characters for better matching
     * @param {string} text - Text to normalize
     * @returns {string} - Normalized text
     */
    normalizeTurkish(text) {
        const charMap = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        };

        return text.split('').map(char => charMap[char] || char).join('');
    }

    /**
     * Extract named entities (simple pattern matching)
     * @param {string} message - User message
     * @returns {Object} - Object with detected entities
     */
    extractEntities(message) {
        return {
            courseCodes: this.extractCourseCodes(message),
            hasQuestion: /\?|ne|nedir|nasıl|kim|nerede|ne zaman/i.test(message),
            isGreeting: /merhaba|selam|günaydın|iyi günler|hey/i.test(message),
            isThanks: /teşekkür|sağol|eyvallah|thanks/i.test(message)
        };
    }
}

module.exports = new NLPHelper();
