const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
    constructor() {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('⚠️  GEMINI_API_KEY environment variable is not set. AI features will be limited.');
            this.genAI = null;
            this.model = null;
            return;
        }

        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });

        // System context for the chatbot
        this.systemContext = `Sen Dokuz Eylül Üniversitesi Bilgisayar Mühendisliği bölümü için geliştirilmiş UNİTE chatbot asistanısın.

Görevlerin:
- Öğrencilere dersler, hocalar, etkinlikler ve kampüs hakkında bilgi vermek
- Profesyonel, dostane ve yardımsever bir dille iletişim kurmak
- Türkçe olarak doğal ve akıcı yanıtlar vermek
- Sadece verilen bağlam (context) bilgilerini kullanarak yanıt vermek
- Bilmediğin konularda dürüst olmak

Yanıt Kuralları:
1. Kısa ve öz yanıtlar ver (maksimum 3-4 paragraf)
2. Markdown formatı kullan (**, -, #)
3. Emoji ile yanıtları zenginleştir ama aşırıya kaçma
4. Bağlamda bulunamayan bilgileri uydurmak yerine "Bu konuda bilgim yok" de
5. Her zaman Türkçe yanıt ver`;
    }

    /**
     * Check if Gemini AI is available
     */
    isAvailable() {
        return this.model !== null;
    }

    /**
     * Generate an enhanced response using Gemini AI with context from database
     * @param {string} userMessage - User's question
     * @param {Object} context - Context data from database
     * @returns {Promise<Object>} - Generated response
     */
    async generateEnhancedResponse(userMessage, context) {
        if (!this.isAvailable()) {
            return {
                success: false,
                message: 'Gemini AI is not available. Please set GEMINI_API_KEY.',
                fallback: true
            };
        }

        try {
            // Build context string from database results
            const contextString = this.buildContextString(context);

            // Create the prompt
            const prompt = `${this.systemContext}

BAĞLAM BİLGİLERİ:
${contextString}

KULLANICI SORUSU:
${userMessage}

Yukarıdaki bağlam bilgilerini kullanarak kullanıcı sorusuna doğal, yardımsever ve Türkçe bir yanıt ver. Eğer bağlamda yeterli bilgi yoksa, bunu kibarca belirt ve alternatif sorular öner.`;

            // Generate response
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            return {
                success: true,
                message: text,
                fallback: false
            };

        } catch (error) {
            console.error('Gemini AI Error:', error);
            return {
                success: false,
                message: error.message,
                fallback: true
            };
        }
    }

    /**
     * Build context string from database results
     * @param {Object} context - Context object containing database results
     * @returns {string} - Formatted context string
     */
    buildContextString(context) {
        let contextParts = [];

        // Add knowledge base results
        if (context.knowledgeBase && context.knowledgeBase.length > 0) {
            contextParts.push('📚 BİLGİ BANKASI:');
            context.knowledgeBase.forEach((kb, index) => {
                contextParts.push(`\n${index + 1}. Soru: ${kb.question}`);
                contextParts.push(`   Cevap: ${kb.answer}`);
                if (kb.keywords && kb.keywords.length > 0) {
                    contextParts.push(`   Anahtar Kelimeler: ${kb.keywords.join(', ')}`);
                }
            });
            contextParts.push('');
        }

        // Add course information
        if (context.courses && context.courses.length > 0) {
            contextParts.push('📖 DERSLER:');
            context.courses.forEach((course, index) => {
                contextParts.push(`\n${index + 1}. ${course.name} (${course.code})`);
                contextParts.push(`   - Kredi: ${course.credits}`);
                contextParts.push(`   - Dönem: ${course.semester}. yarıyıl`);
                contextParts.push(`   - Zorluk: ${course.difficulty}`);
                contextParts.push(`   - Açıklama: ${course.description}`);

                if (course.professors && course.professors.length > 0) {
                    contextParts.push(`   - Hocalar: ${course.professors.map(p => p.title + ' ' + p.name).join(', ')}`);
                }

                if (course.studentComments && course.studentComments.length > 0) {
                    const avgRating = (course.studentComments.reduce((sum, c) => sum + c.rating, 0) / course.studentComments.length).toFixed(1);
                    contextParts.push(`   - Öğrenci Puanı: ${avgRating}/5`);
                    contextParts.push(`   - Örnek Yorum: "${course.studentComments[0].comment}"`);
                }
            });
            contextParts.push('');
        }

        // Add professor information
        if (context.professors && context.professors.length > 0) {
            contextParts.push('👨‍🏫 HOCALAR:');
            context.professors.forEach((prof, index) => {
                contextParts.push(`\n${index + 1}. ${prof.title} ${prof.name}`);
                contextParts.push(`   - Bölüm: ${prof.department}`);
                contextParts.push(`   - E-posta: ${prof.email}`);

                if (prof.officeLocation) {
                    contextParts.push(`   - Ofis: ${prof.officeLocation}`);
                }
                if (prof.officeHours) {
                    contextParts.push(`   - Ofis Saatleri: ${prof.officeHours}`);
                }
                if (prof.researchAreas && prof.researchAreas.length > 0) {
                    contextParts.push(`   - Araştırma Alanları: ${prof.researchAreas.join(', ')}`);
                }

                if (prof.studentReviews && prof.studentReviews.length > 0) {
                    const avgRating = (prof.studentReviews.reduce((sum, r) => sum + r.rating, 0) / prof.studentReviews.length).toFixed(1);
                    contextParts.push(`   - Öğrenci Puanı: ${avgRating}/5`);
                }
            });
            contextParts.push('');
        }

        // Add activity information
        if (context.activities && context.activities.length > 0) {
            contextParts.push('🎉 ETKİNLİKLER:');
            context.activities.forEach((activity, index) => {
                contextParts.push(`\n${index + 1}. ${activity.title}`);
                contextParts.push(`   - Kategori: ${activity.category}`);
                contextParts.push(`   - Tarih: ${new Date(activity.date).toLocaleDateString('tr-TR')}`);
                contextParts.push(`   - Saat: ${activity.time}`);
                contextParts.push(`   - Konum: ${activity.location?.name || 'Belirtilmemiş'}`);
                contextParts.push(`   - Organizatör: ${activity.organizer}`);
                contextParts.push(`   - Açıklama: ${activity.description}`);

                if (activity.capacity) {
                    const available = activity.capacity - (activity.registeredStudents?.length || 0);
                    contextParts.push(`   - Kontenjan: ${available}/${activity.capacity}`);
                }
            });
            contextParts.push('');
        }

        // If no context provided
        if (contextParts.length === 0) {
            return 'Veritabanında ilgili bilgi bulunamadı. Genel bilgilerinle yanıt ver.';
        }

        return contextParts.join('\n');
    }

    /**
     * Generate smart suggestions based on user message and context
     * @param {string} userMessage - User's message
     * @param {Object} context - Context from database
     * @returns {Promise<Array<string>>} - Array of suggestions
     */
    async generateSuggestions(userMessage, context) {
        if (!this.isAvailable()) {
            // Fallback suggestions
            return [
                'Dersler hakkında bilgi ver',
                'Yaklaşan etkinlikler neler?',
                'Hocalar hakkında bilgi'
            ];
        }

        try {
            const prompt = `Kullanıcının sorusu: "${userMessage}"

Yukarıdaki soruyla ilgili 3 takip sorusu öner. Her soru tek satır olmalı, Türkçe ve doğal olmalı.
Sadece soruları ver, numaralandırma veya açıklama ekleme.`;

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse suggestions
            const suggestions = text
                .split('\n')
                .filter(line => line.trim().length > 0)
                .slice(0, 3);

            return suggestions.length > 0 ? suggestions : [
                'Daha fazla bilgi ver',
                'Başka neler var?',
                'İlgili konular'
            ];

        } catch (error) {
            console.error('Suggestion generation error:', error);
            return [
                'Daha fazla bilgi',
                'Benzer konular',
                'İlgili sorular'
            ];
        }
    }
}

module.exports = new GeminiService();
