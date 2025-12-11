const KnowledgeBase = require('../models/KnowledgeBase');
const Course = require('../models/Course');
const Professor = require('../models/Professor');
const Activity = require('../models/Activity');
const nlpHelper = require('../utils/nlpHelper');
const geminiService = require('./geminiService');

class ChatbotService {
    async processMessage(userMessage, sessionId) {
        const message = userMessage.toLowerCase().trim();

        // Extract keywords
        const keywords = nlpHelper.extractKeywords(message);

        // Determine intent
        const intent = this.detectIntent(message, keywords);

        let response = {
            answer: '',
            intent: intent,
            confidence: 0,
            suggestions: [],
            relatedEntities: {
                courses: [],
                professors: [],
                activities: []
            }
        };

        try {
            switch (intent) {
                case 'course_info':
                    response = await this.handleCourseQuery(message, keywords);
                    break;
                case 'professor_info':
                    response = await this.handleProfessorQuery(message, keywords);
                    break;
                case 'activity_info':
                    response = await this.handleActivityQuery(message, keywords);
                    break;
                case 'student_matching':
                    response = await this.handleMatchingQuery(message);
                    break;
                default:
                    response = await this.handleGeneralQuery(message, keywords);
            }
        } catch (error) {
            console.error('Chatbot processing error:', error);
            response.answer = 'Üzgünüm, sorunuzu işlerken bir hata oluştu. Lütfen farklı bir şekilde sormayı deneyin.';
            response.confidence = 0;
        }

        return response;
    }

    detectIntent(message, keywords) {
        // Course-related keywords
        if (nlpHelper.containsAny(message, ['ders', 'kurs', 'dersler', 'kredisi', 'içerik', 'konular', 'ödev', 'proje', 'sınav', 'final', 'vize'])) {
            return 'course_info';
        }

        // Professor-related keywords
        if (nlpHelper.containsAny(message, ['hoca', 'hocam', 'öğretim görevlisi', 'profesör', 'doçent', 'dr.', 'öğretmen', 'ofis', 'danışman'])) {
            return 'professor_info';
        }

        // Activity-related keywords
        if (nlpHelper.containsAny(message, ['etkinlik', 'aktivite', 'topluluk', 'kulüp', 'sosyal', 'organizasyon', 'seminer', 'konferans', 'workshop'])) {
            return 'activity_info';
        }

        // Matching-related keywords
        if (nlpHelper.containsAny(message, ['mentör', 'mentor', 'üst sınıf', 'alt sınıf', 'eşleş', 'not paylaş', 'çalışma grubu', 'arkadaş bul'])) {
            return 'student_matching';
        }

        return 'general';
    }

    async handleCourseQuery(message, keywords) {
        let courses = [];
        let answer = '';

        // Try to find specific course by code or name
        if (keywords.length > 0) {
            courses = await Course.find({
                $or: [
                    { name: { $regex: keywords.join('|'), $options: 'i' } },
                    { code: { $regex: keywords.join('|'), $options: 'i' } },
                    { topics: { $in: keywords } }
                ]
            }).populate('professors', 'name title').limit(5);
        }

        if (courses.length > 0) {
            const course = courses[0];
            answer = `**${course.name}** (${course.code}) hakkında bilgiler:\n\n`;
            answer += `📚 **Kredi:** ${course.credits}\n`;
            answer += `📅 **Dönem:** ${course.semester}. yarıyıl\n`;
            answer += `📊 **Zorluk:** ${course.difficulty}\n\n`;
            answer += `**Açıklama:** ${course.description}\n\n`;

            if (course.professors.length > 0) {
                answer += `**Verildiği Hocalar:** ${course.professors.map(p => p.title + ' ' + p.name).join(', ')}\n\n`;
            }

            if (course.studentComments.length > 0) {
                const avgRating = (course.studentComments.reduce((sum, c) => sum + c.rating, 0) / course.studentComments.length).toFixed(1);
                answer += `⭐ **Öğrenci Değerlendirmesi:** ${avgRating}/5 (${course.studentComments.length} yorum)\n\n`;
                answer += `💬 **Son Yorumlar:**\n`;
                course.studentComments.slice(-2).forEach(comment => {
                    answer += `- "${comment.comment}"\n`;
                });
            }

            return {
                answer,
                intent: 'course_info',
                confidence: 0.9,
                suggestions: ['Dersin konuları neler?', 'Hangi hoca veriyor?', 'Zorluğu nasıl?'],
                relatedEntities: { courses: courses.map(c => c._id), professors: [], activities: [] }
            };
        }

        // If no specific course found, search knowledge base
        const kbResults = await KnowledgeBase.find({
            category: 'Dersler',
            $text: { $search: message }
        }).limit(3);

        if (kbResults.length > 0) {
            answer = kbResults[0].answer;
            return {
                answer,
                intent: 'course_info',
                confidence: 0.7,
                suggestions: kbResults[0].relatedQuestions || [],
                relatedEntities: { courses: [], professors: [], activities: [] }
            };
        }

        return {
            answer: 'Üzgünüm, aradığınız dersle ilgili bilgi bulamadım. Ders adını veya kodunu daha net yazabilir misiniz? Örneğin: "Veri Yapıları dersi" veya "BIL211"',
            intent: 'course_info',
            confidence: 0.3,
            suggestions: ['Tüm dersleri göster', 'Zorluk seviyelerine göre dersler', '3. dönem dersleri neler?'],
            relatedEntities: { courses: [], professors: [], activities: [] }
        };
    }

    async handleProfessorQuery(message, keywords) {
        let professors = [];
        let answer = '';

        if (keywords.length > 0) {
            professors = await Professor.find({
                $or: [
                    { name: { $regex: keywords.join('|'), $options: 'i' } },
                    { researchAreas: { $in: keywords } }
                ]
            }).populate('courses', 'code name').limit(5);
        }

        if (professors.length > 0) {
            const prof = professors[0];
            answer = `**${prof.title} ${prof.name}** hakkında bilgiler:\n\n`;
            answer += `🏢 **Bölüm:** ${prof.department}\n`;
            answer += `📧 **E-posta:** ${prof.email}\n`;

            if (prof.officeLocation) {
                answer += `🚪 **Ofis:** ${prof.officeLocation}\n`;
            }
            if (prof.officeHours) {
                answer += `⏰ **Ofis Saatleri:** ${prof.officeHours}\n`;
            }

            if (prof.researchAreas.length > 0) {
                answer += `\n🔬 **Araştırma Alanları:** ${prof.researchAreas.join(', ')}\n`;
            }

            if (prof.courses.length > 0) {
                answer += `\n📚 **Verdiği Dersler:** ${prof.courses.map(c => c.code + ' - ' + c.name).join(', ')}\n`;
            }

            if (prof.studentReviews.length > 0) {
                const avgRating = (prof.studentReviews.reduce((sum, r) => sum + r.rating, 0) / prof.studentReviews.length).toFixed(1);
                answer += `\n⭐ **Öğrenci Değerlendirmesi:** ${avgRating}/5 (${prof.studentReviews.length} değerlendirme)\n`;

                const recentReview = prof.studentReviews[prof.studentReviews.length - 1];
                if (recentReview.comment) {
                    answer += `\n💬 **Son Yorum:** "${recentReview.comment}"\n`;
                }
            }

            return {
                answer,
                intent: 'professor_info',
                confidence: 0.9,
                suggestions: ['Hangi dersleri veriyor?', 'Ofis saatleri ne zaman?', 'Araştırma alanları neler?'],
                relatedEntities: { courses: [], professors: professors.map(p => p._id), activities: [] }
            };
        }

        const kbResults = await KnowledgeBase.find({
            category: 'Hocalar',
            $text: { $search: message }
        }).limit(3);

        if (kbResults.length > 0) {
            answer = kbResults[0].answer;
            return {
                answer,
                intent: 'professor_info',
                confidence: 0.7,
                suggestions: kbResults[0].relatedQuestions || [],
                relatedEntities: { courses: [], professors: [], activities: [] }
            };
        }

        return {
            answer: 'Üzgünüm, aradığınız hoca ile ilgili bilgi bulamadım. Hocanın ismini daha net yazabilir misiniz?',
            intent: 'professor_info',
            confidence: 0.3,
            suggestions: ['Tüm hocaları göster', 'Veri yapıları dersini kim veriyor?'],
            relatedEntities: { courses: [], professors: [], activities: [] }
        };
    }

    async handleActivityQuery(message, keywords) {
        const today = new Date();
        let activities = [];

        // Search for activities
        if (keywords.length > 0) {
            activities = await Activity.find({
                $or: [
                    { title: { $regex: keywords.join('|'), $options: 'i' } },
                    { category: { $regex: keywords.join('|'), $options: 'i' } },
                    { description: { $regex: keywords.join('|'), $options: 'i' } }
                ],
                date: { $gte: today },
                status: { $in: ['Yaklaşan', 'Devam Ediyor'] }
            }).limit(5);
        } else {
            // Show upcoming activities
            activities = await Activity.find({
                date: { $gte: today },
                status: 'Yaklaşan'
            }).sort({ date: 1 }).limit(5);
        }

        if (activities.length > 0) {
            let answer = '📅 **Yaklaşan Etkinlikler:**\n\n';

            activities.forEach((activity, index) => {
                answer += `**${index + 1}. ${activity.title}**\n`;
                answer += `🏷️ Kategori: ${activity.category}\n`;
                answer += `📆 Tarih: ${new Date(activity.date).toLocaleDateString('tr-TR')}\n`;
                answer += `⏰ Saat: ${activity.time}\n`;
                answer += `📍 Konum: ${activity.location?.name || 'Belirtilmemiş'}\n`;
                answer += `👥 Organizatör: ${activity.organizer}\n`;

                if (activity.capacity) {
                    const available = activity.capacity - activity.registeredStudents.length;
                    answer += `🎫 Kontenjan: ${available}/${activity.capacity}\n`;
                }

                answer += `\n${activity.description.substring(0, 150)}...\n\n`;
            });

            return {
                answer,
                intent: 'activity_info',
                confidence: 0.9,
                suggestions: ['Sosyal etkinlikler', 'Akademik etkinlikler', 'Bu hafta neler var?'],
                relatedEntities: { courses: [], professors: [], activities: activities.map(a => a._id) }
            };
        }

        const kbResults = await KnowledgeBase.find({
            category: 'Sosyal',
            $text: { $search: message }
        }).limit(3);

        if (kbResults.length > 0) {
            return {
                answer: kbResults[0].answer,
                intent: 'activity_info',
                confidence: 0.7,
                suggestions: kbResults[0].relatedQuestions || [],
                relatedEntities: { courses: [], professors: [], activities: [] }
            };
        }

        return {
            answer: 'Şu anda bu konuda planlı bir etkinlik yok gibi görünüyor. Tüm etkinlikleri görmek için "yaklaşan etkinlikler" diyebilirsiniz.',
            intent: 'activity_info',
            confidence: 0.5,
            suggestions: ['Yaklaşan tüm etkinlikler', 'Sosyal aktiviteler', 'Kulüpler'],
            relatedEntities: { courses: [], professors: [], activities: [] }
        };
    }

    async handleMatchingQuery(message) {
        const answer = `👥 **Öğrenci Eşleştirme Sistemi**\n\n` +
            `Üst-alt sınıf eşleştirme sistemimiz ile:\n\n` +
            `✅ Aldığınız dersleri daha önce almış üst sınıf öğrencilerle tanışabilir\n` +
            `✅ Ders notlarını paylaşabilir, deneyim aktarımı yapabilirsiniz\n` +
            `✅ Çalışma grupları oluşturabilirsiniz\n\n` +
            `Eşleştirme sistemini kullanmak için "Eşleştirme" sayfasına gidin ve profilinizi oluşturun!`;

        return {
            answer,
            intent: 'student_matching',
            confidence: 0.8,
            suggestions: ['Nasıl eşleşebilirim?', 'Mentörlük sistemi nedir?', 'Çalışma grubu bul'],
            relatedEntities: { courses: [], professors: [], activities: [] }
        };
    }

    async handleGeneralQuery(message, keywords) {
        // Search in knowledge base
        const kbResults = await KnowledgeBase.find({
            $or: [
                { $text: { $search: message } },
                { keywords: { $in: keywords } }
            ]
        }).sort({ importance: -1, viewCount: -1 }).limit(5);

        // Search for related courses
        const relatedCourses = keywords.length > 0 ? await Course.find({
            $or: [
                { name: { $regex: keywords.join('|'), $options: 'i' } },
                { topics: { $in: keywords } }
            ]
        }).populate('professors', 'name title').limit(3) : [];

        // Search for related professors
        const relatedProfessors = keywords.length > 0 ? await Professor.find({
            $or: [
                { name: { $regex: keywords.join('|'), $options: 'i' } },
                { researchAreas: { $in: keywords } }
            ]
        }).populate('courses', 'code name').limit(3) : [];

        // Build context for Gemini AI
        const context = {
            knowledgeBase: kbResults.map(kb => ({
                question: kb.question,
                answer: kb.answer,
                keywords: kb.keywords,
                category: kb.category
            })),
            courses: relatedCourses,
            professors: relatedProfessors,
            activities: []
        };

        // Try to use Gemini AI for enhanced response
        if (geminiService.isAvailable() && (kbResults.length > 0 || relatedCourses.length > 0 || relatedProfessors.length > 0)) {
            try {
                const geminiResponse = await geminiService.generateEnhancedResponse(message, context);

                if (geminiResponse.success) {
                    // Update view count for knowledge base entries
                    if (kbResults.length > 0) {
                        kbResults[0].viewCount += 1;
                        await kbResults[0].save();
                    }

                    // Generate smart suggestions
                    const suggestions = await geminiService.generateSuggestions(message, context);

                    return {
                        answer: geminiResponse.message,
                        intent: 'general',
                        confidence: 0.85,
                        suggestions: suggestions,
                        relatedEntities: {
                            courses: relatedCourses.map(c => c._id),
                            professors: relatedProfessors.map(p => p._id),
                            activities: []
                        },
                        aiEnhanced: true
                    };
                }
            } catch (error) {
                console.error('Gemini AI error in general query:', error);
                // Fall through to traditional method
            }
        }

        // Fallback: Use traditional Knowledge Base response
        if (kbResults.length > 0) {
            const kb = kbResults[0];

            // Increment view count
            kb.viewCount += 1;
            await kb.save();

            return {
                answer: kb.answer,
                intent: 'general',
                confidence: 0.75,
                suggestions: kb.relatedQuestions || ['Başka bir soru sor', 'Dersler hakkında', 'Etkinlikler hakkında'],
                relatedEntities: {
                    courses: relatedCourses.map(c => c._id),
                    professors: relatedProfessors.map(p => p._id),
                    activities: []
                },
                aiEnhanced: false
            };
        }

        // Default welcome response
        return {
            answer: `Merhaba! 👋 Ben UNİTE chatbot'u, size yardımcı olmak için buradayım.\n\n` +
                `Size şu konularda yardımcı olabilirim:\n\n` +
                `📚 **Dersler** - Ders içerikleri, zorluk seviyeleri, konular\n` +
                `👨‍🏫 **Hocalar** - Hoca bilgileri, ofis saatleri, iletişim\n` +
                `🎉 **Etkinlikler** - Sosyal aktiviteler, topluluklar, organizasyonlar\n` +
                `👥 **Eşleştirme** - Üst-alt sınıf eşleştirme, mentörlük\n` +
                `🏫 **Bölüm** - Genel bilgiler, sosyal dinamikler\n\n` +
                `Nasıl yardımcı olabilirim?`,
            intent: 'general',
            confidence: 0.5,
            suggestions: [
                'Veri Yapıları dersi hakkında bilgi ver',
                'Yaklaşan etkinlikler neler?',
                'Nasıl mentör bulabilirim?'
            ],
            relatedEntities: { courses: [], professors: [], activities: [] },
            aiEnhanced: false
        };
    }
}

module.exports = new ChatbotService();
