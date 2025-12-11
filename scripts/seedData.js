require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('../models/Course');
const Professor = require('../models/Professor');
const Student = require('../models/Student');
const Activity = require('../models/Activity');
const KnowledgeBase = require('../models/KnowledgeBase');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('✅ MongoDB bağlantısı başarılı'))
    .catch(err => {
        console.error('❌ MongoDB bağlantı hatası:', err);
        process.exit(1);
    });

async function seedDatabase() {
    try {
        console.log('\n🗑️  Mevcut veriler temizleniyor...');
        await Course.deleteMany({});
        await Professor.deleteMany({});
        await Student.deleteMany({});
        await Activity.deleteMany({});
        await KnowledgeBase.deleteMany({});

        console.log('\n👨‍🏫 Hocalar oluşturuluyor...');
        const professors = await Professor.insertMany([
            {
                name: 'Mehmet Yılmaz',
                title: 'Prof. Dr.',
                department: 'Bilgisayar Mühendisliği',
                email: 'mehmet.yilmaz@deu.edu.tr',
                officeLocation: 'Tınaztepe Yerleşkesi, Mühendislik Fakültesi, Kat 3, Oda 301',
                officeHours: 'Salı-Perşembe 14:00-16:00',
                phone: '+90 232 xxx xx xx',
                researchAreas: ['Yapay Zeka', 'Makine Öğrenmesi', 'Derin Öğrenme'],
                bio: 'Yapay zeka ve makine öğrenmesi alanlarında 20 yılı aşkın deneyime sahip.',
                studentReviews: [
                    {
                        teachingStyle: 'Uygulamalı ve anlaşılır anlatım. Öğrencilere yakın.',
                        examDifficulty: 'Orta',
                        accessibility: 5,
                        comment: 'Dersleri çok zevkli geçiyor, gerçek hayat örnekleri veriyor.',
                        rating: 5
                    },
                    {
                        teachingStyle: 'Teorik altyapısı çok güçlü.',
                        examDifficulty: 'Zor',
                        accessibility: 4,
                        comment: 'Sınavları zor ama adil puanlıyor.',
                        rating: 4
                    }
                ]
            },
            {
                name: 'Ayşe Demir',
                title: 'Doç. Dr.',
                department: 'Bilgisayar Mühendisliği',
                email: 'ayse.demir@deu.edu.tr',
                officeLocation: 'Tınaztepe Yerleşkesi, Mühendislik Fakültesi, Kat 2, Oda 205',
                officeHours: 'Pazartesi-Çarşamba 10:00-12:00',
                researchAreas: ['Veri Yapıları', 'Algoritmalar', 'Hesaplama Karmaşıklığı'],
                bio: 'Algoritmalar ve veri yapıları üzerine uzmanlaşmış.',
                studentReviews: [
                    {
                        teachingStyle: 'Detaylı ve sistematik anlatım.',
                        examDifficulty: 'Zor',
                        accessibility: 3,
                        comment: 'Konuyu çok iyi biliyor ama hızlı anlatıyor.',
                        rating: 4
                    }
                ]
            },
            {
                name: 'Can Öztürk',
                title: 'Dr. Öğr. Üyesi',
                department: 'Bilgisayar Mühendisliği',
                email: 'can.ozturk@deu.edu.tr',
                officeLocation: 'Tınaztepe Yerleşkesi, Mühendislik Fakültesi, Kat 1, Oda 108',
                officeHours: 'Çarşamba 13:00-15:00',
                researchAreas: ['Web Teknolojileri', 'Mobil Uygulama Geliştirme', 'UI/UX'],
                bio: 'Yazılım mühendisliği ve web teknolojileri üzerine çalışmaktadır.',
                studentReviews: [
                    {
                        teachingStyle: 'Proje odaklı, pratik yaklaşım.',
                        examDifficulty: 'Kolay',
                        accessibility: 5,
                        comment: 'Çok yardımsever, her zaman ulaşılabilir.',
                        rating: 5
                    }
                ]
            },
            {
                name: 'Zeynep Kaya',
                title: 'Dr. Öğr. Üyesi',
                department: 'Bilgisayar Mühendisliği',
                email: 'zeynep.kaya@deu.edu.tr',
                officeLocation: 'Tınaztepe Yerleşkesi, Mühendislik Fakültesi, Kat 2, Oda 210',
                officeHours: 'Salı 14:00-16:00',
                researchAreas: ['Veritabanı Sistemleri', 'Büyük Veri', 'NoSQL'],
                studentReviews: [
                    {
                        teachingStyle: 'Açık ve net anlatım.',
                        examDifficulty: 'Orta',
                        accessibility: 4,
                        comment: 'SQL projelerinde çok yardımcı oluyor.',
                        rating: 4
                    }
                ]
            },
            {
                name: 'Ahmet Çelik',
                title: 'Öğr. Gör.',
                department: 'Bilgisayar Mühendisliği',
                email: 'ahmet.celik@deu.edu.tr',
                officeLocation: 'Tınaztepe Yerleşkesi, Mühendislik Fakültesi, Kat 1, Oda 105',
                officeHours: 'Perşembe 10:00-12:00',
                researchAreas: ['Programlama Dilleri', 'Yazılım Geliştirme'],
                studentReviews: []
            }
        ]);

        console.log(`✅ ${professors.length} hoca eklendi`);

        console.log('\n📚 Dersler oluşturuluyor...');
        const courses = await Course.insertMany([
            {
                code: 'BIL101',
                name: 'Bilgisayar Programlamaya Giriş',
                department: 'Bilgisayar Mühendisliği',
                credits: 4,
                semester: 1,
                description: 'Programlama mantığı, algoritma geliştirme, temel veri yapıları ve C programlama dili.',
                topics: ['Değişkenler', 'Döngüler', 'Fonksiyonlar', 'Diziler', 'Pointerlar'],
                professors: [professors[4]._id],
                difficulty: 'Orta',
                studentComments: [
                    { comment: 'İlk ders olarak biraz zor ama zamanla alışıyorsunuz.', rating: 4 },
                    { comment: 'Lab dersleri çok faydalı, mutlaka katılın.', rating: 5 }
                ]
            },
            {
                code: 'BIL211',
                name: 'Veri Yapıları',
                department: 'Bilgisayar Mühendisliği',
                credits: 4,
                semester: 3,
                description: 'Temel veri yapıları, liste, yığın, kuyruk, ağaç ve çizge yapıları. Zaman ve alan karmaşıklığı analizi.',
                topics: ['Linked List', 'Stack', 'Queue', 'Tree', 'Graph', 'Hash Table'],
                professors: [professors[1]._id],
                difficulty: 'Zor',
                studentComments: [
                    { comment: 'Bölümün en önemli derslerinden biri, iyi çalışmak lazım.', rating: 4 },
                    { comment: 'Sınavlar zor ama adil.', rating: 3 }
                ]
            },
            {
                code: 'BIL221',
                name: 'Nesne Yönelimli Programlama',
                department: 'Bilgisayar Mühendisliği',
                credits: 3,
                semester: 3,
                description: 'Java dili kullanılarak nesne yönelimli programlama prensipleri.',
                topics: ['Class', 'Object', 'Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'],
                professors: [professors[4]._id],
                difficulty: 'Orta',
                studentComments: [
                    { comment: 'Java öğrenmek için harika bir ders.', rating: 5 }
                ]
            },
            {
                code: 'BIL311',
                name: 'Algoritma Analizi',
                department: 'Bilgisayar Mühendisliği',
                credits: 3,
                semester: 5,
                description: 'Algoritma tasarımı ve kompleksite analizi. Sıralama, arama, dinamik programlama.',
                topics: ['Big-O Notation', 'Sorting Algorithms', 'Dynamic Programming', 'Greedy Algorithms', 'Divide and Conquer'],
                professors: [professors[1]._id],
                difficulty: 'Çok Zor',
                studentComments: [
                    { comment: 'Çok zor ama çok öğretici bir ders.', rating: 4 }
                ]
            },
            {
                code: 'BIL321',
                name: 'Veritabanı Yönetim Sistemleri',
                department: 'Bilgisayar Mühendisliği',
                credits: 3,
                semester: 5,
                description: 'İlişkisel veritabanı tasarımı, SQL, normalizasyon, transaction yönetimi.',
                topics: ['SQL', 'Normalizasyon', 'ER Diyagramı', 'Transaction', 'Indexing'],
                professors: [professors[3]._id],
                difficulty: 'Orta',
                studentComments: [
                    { comment: 'Proje çok güzel, gerçek bir veritabanı yapıyorsunuz.', rating: 5 }
                ]
            },
            {
                code: 'BIL331',
                name: 'Web Programlama',
                department: 'Bilgisayar Mühendisliği',
                credits: 3,
                semester: 5,
                description: 'HTML, CSS, JavaScript, Node.js ile web uygulaması geliştirme.',
                topics: ['HTML5', 'CSS3', 'JavaScript', 'Node.js', 'Express', 'MongoDB'],
                professors: [professors[2]._id],
                difficulty: 'Kolay',
                studentComments: [
                    { comment: 'En sevdiğim ders, proje yapmak çok eğlenceli.', rating: 5 },
                    { comment: 'Modern teknolojiler öğretiliyor.', rating: 5 }
                ]
            },
            {
                code: 'BIL341',
                name: 'Yapay Zeka',
                department: 'Bilgisayar Mühendisliği',
                credits: 3,
                semester: 6,
                description: 'Yapay zeka temel kavramları, arama algoritmaları, makine öğrenmesi giriş.',
                topics: ['Search Algorithms', 'Machine Learning', 'Neural Networks', 'Expert Systems'],
                professors: [professors[0]._id],
                difficulty: 'Zor',
                studentComments: [
                    { comment: 'Çok ilgi çekici konular işleniyor.', rating: 5 }
                ]
            },
            {
                code: 'BIL401',
                name: 'Makine Öğrenmesi',
                department: 'Bilgisayar Mühendisliği',
                credits: 3,
                semester: 7,
                description: 'Denetimli ve denetimsiz öğrenme, derin öğrenme, Python ile uygulama.',
                topics: ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'TensorFlow', 'Keras'],
                professors: [professors[0]._id],
                difficulty: 'Çok Zor',
                studentComments: []
            }
        ]);

        console.log(`✅ ${courses.length} ders eklendi`);

        // Update professors with their courses
        await Professor.findByIdAndUpdate(professors[0]._id, {
            courses: courses.filter(c => c.professors.some(p => p.equals(professors[0]._id))).map(c => c._id)
        });
        await Professor.findByIdAndUpdate(professors[1]._id, {
            courses: courses.filter(c => c.professors.some(p => p.equals(professors[1]._id))).map(c => c._id)
        });
        await Professor.findByIdAndUpdate(professors[2]._id, {
            courses: courses.filter(c => c.professors.some(p => p.equals(professors[2]._id))).map(c => c._id)
        });
        await Professor.findByIdAndUpdate(professors[3]._id, {
            courses: courses.filter(c => c.professors.some(p => p.equals(professors[3]._id))).map(c => c._id)
        });
        await Professor.findByIdAndUpdate(professors[4]._id, {
            courses: courses.filter(c => c.professors.some(p => p.equals(professors[4]._id))).map(c => c._id)
        });

        console.log('\n👨‍🎓 Öğrenciler oluşturuluyor...');
        const students = await Student.insertMany([
            {
                studentId: '2020280001',
                name: 'Ali Veli',
                email: 'ali.veli@ogr.deu.edu.tr',
                department: 'Bilgisayar Mühendisliği',
                year: 4,
                completedCourses: [
                    { course: courses[0]._id, grade: 'AA', semester: '2020 Güz', hasNotes: true },
                    { course: courses[1]._id, grade: 'BA', semester: '2021 Güz', hasNotes: true },
                    { course: courses[2]._id, grade: 'AA', semester: '2021 Güz', hasNotes: false }
                ],
                currentCourses: [courses[6]._id, courses[7]._id],
                interests: ['Yapay Zeka', 'Makine Öğrenmesi', 'Web Geliştirme'],
                clubs: ['IEEE', 'Google DSC'],
                matchingPreferences: {
                    lookingForMentor: false,
                    willingToMentor: true,
                    studyGroups: true
                }
            },
            {
                studentId: '2021280015',
                name: 'Elif Yıldız',
                email: 'elif.yildiz@ogr.deu.edu.tr',
                department: 'Bilgisayar Mühendisliği',
                year: 3,
                completedCourses: [
                    { course: courses[0]._id, grade: 'BA', semester: '2021 Güz', hasNotes: true },
                    { course: courses[1]._id, grade: 'BB', semester: '2022 Güz', hasNotes: true }
                ],
                currentCourses: [courses[4]._id, courses[5]._id],
                interests: ['Veritabanı', 'Backend Geliştirme'],
                clubs: ['ACM'],
                matchingPreferences: {
                    lookingForMentor: true,
                    willingToMentor: false,
                    studyGroups: true
                }
            },
            {
                studentId: '2022280032',
                name: 'Murat Kara',
                email: 'murat.kara@ogr.deu.edu.tr',
                department: 'Bilgisayar Mühendisliği',
                year: 2,
                completedCourses: [
                    { course: courses[0]._id, grade: 'AA', semester: '2022 Güz', hasNotes: false }
                ],
                currentCourses: [courses[1]._id, courses[2]._id],
                interests: ['Algoritma', 'Veri Yapıları', 'Problem Solving'],
                clubs: [],
                matchingPreferences: {
                    lookingForMentor: true,
                    willingToMentor: false,
                    studyGroups: true
                }
            },
            {
                studentId: '2020280008',
                name: 'Selin Öz',
                email: 'selin.oz@ogr.deu.edu.tr',
                department: 'Bilgisayar Mühendisliği',
                year: 4,
                completedCourses: [
                    { course: courses[0]._id, grade: 'BA', semester: '2020 Güz', hasNotes: true },
                    { course: courses[4]._id, grade: 'AA', semester: '2022 Güz', hasNotes: true },
                    { course: courses[5]._id, grade: 'AA', semester: '2022 Güz', hasNotes: true }
                ],
                currentCourses: [courses[7]._id],
                interests: ['Full Stack Development', 'UI/UX'],
                clubs: ['Google DSC', 'Women in Tech'],
                matchingPreferences: {
                    lookingForMentor: false,
                    willingToMentor: true,
                    studyGroups: true
                }
            }
        ]);

        console.log(`✅ ${students.length} öğrenci eklendi`);

        console.log('\n🎉 Etkinlikler oluşturuluyor...');
        const today = new Date();
        const activities = await Activity.insertMany([
            {
                title: 'Yapay Zeka ve Makine Öğrenmesi Workshop',
                category: 'Akademik',
                description: 'Python ile makine öğrenmesi uygulamaları yapacağız. TensorFlow ve Keras kütüphanelerini öğreneceğiz.',
                organizer: 'IEEE DEU',
                location: {
                    name: 'Mühendislik Fakültesi - Konferans Salonu',
                    address: 'Tınaztepe Yerleşkesi'
                },
                date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
                time: '14:00',
                duration: '3 saat',
                capacity: 50,
                registeredStudents: [students[0]._id, students[1]._id],
                contactInfo: {
                    name: 'IEEE DEU',
                    email: 'ieee@deu.edu.tr'
                },
                benefits: [
                    'Sertifika',
                    'Pratik deneyim kazanma',
                    'Networking fırsatı'
                ],
                status: 'Yaklaşan'
            },
            {
                title: 'Hackathon 2024',
                category: 'Akademik',
                description: '24 saatlik kodlama maratonu. Takım olarak problem çözün, ödüller kazanın!',
                organizer: 'Google Developer Student Clubs DEU',
                location: {
                    name: 'Bilgisayar Mühendisliği Laboratuvarları',
                    address: 'Tınaztepe Yerleşkesi'
                },
                date: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
                time: '10:00',
                duration: '24 saat',
                capacity: 100,
                registeredStudents: [students[0]._id],
                contactInfo: {
                    name: 'GDSC DEU',
                    email: 'gdsc@deu.edu.tr'
                },
                benefits: [
                    'Ödüller',
                    'Ücretsiz yemek',
                    'Mentörlük',
                    'Networking'
                ],
                status: 'Yaklaşan'
            },
            {
                title: 'Kampüs Voleybol Turnuvası',
                category: 'Spor',
                description: 'Bölümler arası voleybol turnuvası. Takımınızı oluşturun, kayıt olun!',
                organizer: 'DEU Spor Kulübü',
                location: {
                    name: 'Kapalı Spor Salonu',
                    address: 'Merkez Kampüs'
                },
                date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
                time: '16:00',
                duration: '4 saat',
                capacity: 80,
                registeredStudents: [],
                contactInfo: {
                    email: 'spor@deu.edu.tr'
                },
                benefits: [
                    'Kupa ve madalya',
                    'Sosyalleşme'
                ],
                status: 'Yaklaşan'
            },
            {
                title: 'Kariyer Günleri 2024',
                category: 'Kariyer',
                description: 'Sektör liderleriyle tanışma, staj ve iş fırsatları. CV workshop ve teknik mülakat simülasyonları.',
                organizer: 'DEU Kariyer Merkezi',
                location: {
                    name: 'Rektörlük Konferans Salonu',
                    address: 'Merkez Kampüs'
                },
                date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
                time: '09:00',
                duration: 'Tam gün',
                capacity: 300,
                registeredStudents: [students[0]._id, students[1]._id, students[3]._id],
                contactInfo: {
                    name: 'Kariyer Merkezi',
                    email: 'kariyer@deu.edu.tr'
                },
                benefits: [
                    'İş ve staj fırsatları',
                    'Networking',
                    'CV inceleme',
                    'Mock interview'
                ],
                status: 'Yaklaşan'
            },
            {
                title: 'Açık Hava Sineması: Inception',
                category: 'Sosyal',
                description: 'Kampüste açık havada film gösterimi. Inception filmini birlikte izleyelim!',
                organizer: 'DEU Sinema Kulübü',
                location: {
                    name: 'Kampüs Yeşil Alan',
                    address: 'Tınaztepe Yerleşkesi'
                },
                date: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
                time: '20:00',
                duration: '2.5 saat',
                registeredStudents: [],
                contactInfo: {
                    email: 'sinema@deu.edu.tr'
                },
                benefits: [
                    'Ücretsiz patlamış mısır',
                    'Sosyal aktivite'
                ],
                status: 'Yaklaşan'
            },
            {
                title: 'Startup Weekend',
                category: 'Kariyer',
                description: 'Girişimcilik etkinliği. Fikirlerinizi paylaşın, takım kurun, prototipinizi geliştirin.',
                organizer: 'DEU Teknoloji Geliştirme Bölgesi',
                location: {
                    name: 'DEPARK',
                    address: 'Tınaztepe Yerleşkesi'
                },
                date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
                time: '09:00',
                duration: '3 gün',
                capacity: 60,
                registeredStudents: [students[0]._id, students[3]._id],
                contactInfo: {
                    email: 'depark@deu.edu.tr'
                },
                benefits: [
                    'Mentörlük',
                    'Networking',
                    'Yatırım fırsatı',
                    'Ödüller'
                ],
                status: 'Yaklaşan'
            }
        ]);

        console.log(`✅ ${activities.length} etkinlik eklendi`);

        console.log('\n📖 Bilgi havuzu oluşturuluyor...');
        const knowledgeBase = await KnowledgeBase.insertMany([
            {
                category: 'Dersler',
                question: 'Veri Yapıları dersi zor mu?',
                answer: 'Veri Yapıları dersi bölümün temel derslerinden biri ve evet, zorlu bir derstir. Linked list, tree, graph gibi yapıları iyi anlamak önemli. Düzenli çalışırsanız ve lab derslerine katılırsanız başarılı olabilirsiniz. Ödevleri kendiniz yapın, kopya çekmeyin.',
                keywords: ['veri yapıları', 'zor', 'ders', 'linked list', 'tree', 'graph'],
                relatedQuestions: ['Hangi kaynakları kullanmalıyım?', 'Ödevler zor mu?'],
                importance: 5
            },
            {
                category: 'Dersler',
                question: 'Makine Öğrenmesi dersini almadan önce Python bilmem gerekir mi?',
                answer: 'Evet, Makine Öğrenmesi dersi için Python bilmek şart. Ders süresince NumPy, Pandas, Scikit-learn gibi kütüphaneler kullanılıyor. Dersten önce temel Python bilgisine (döngüler, fonksiyonlar, veri yapıları) sahip olmanızı öneriyorum.',
                keywords: ['makine öğrenmesi', 'python', 'ön koşul', 'pandas', 'numpy'],
                relatedQuestions: ['Hangi Python kursunu önerirsiniz?', 'Derste hangi konular işleniyor?'],
                importance: 4
            },
            {
                category: 'Hocalar',
                question: 'Prof. Dr. Mehmet Yılmaz nasıl bir hoca?',
                answer: 'Prof. Dr. Mehmet Yılmaz çok bilgili ve anlayışlı bir hoca. Dersleri interaktif geçiyor, soru sormayı teşvik ediyor. Ofis saatlerinde öğrencilere zaman ayırıyor. Sınavları zor olabiliyor ama adil puanlıyor. Dersi almadan önce konuları önceden çalışmanızı öneririm.',
                keywords: ['mehmet yılmaz', 'hoca', 'profesör', 'yapay zeka'],
                relatedQuestions: ['Hangi dersleri veriyor?', 'Sınavları nasıl?'],
                importance: 4
            },
            {
                category: 'Sosyal',
                question: 'DEU de hangi kulüpler var?',
                answer: 'DEU de çok çeşitli kulüpler var: IEEE (teknik etkinlikler, workshop lar), Google DSC (yazılım geliştirme), ACM (algoritma yarışmaları), Sinema Kulübü, Fotoğraf Kulübü, Müzik Kulübü, Spor Kulüpleri ve daha fazlası. Kulüp tanıtım günlerine mutlaka katılın!',
                keywords: ['kulüp', 'ieee', 'google dsc', 'acm', 'sosyal'],
                relatedQuestions: ['Kulüplere nasıl katılabilirim?', 'Kulüp ücreti var mı?'],
                importance: 4
            },
            {
                category: 'Kampüs',
                question: 'Kampüste yemek nerede yenir?',
                answer: 'Tınaztepe Kampüsünde yemekhane, kafeterya ve kantinler var. Yemekhane öğrenci kartıyla uygun fiyatlı yemek sunuyor. Kafeteryada sandviç, tost gibi atıştırmalıklar bulabilirsiniz. Ayrıca kampüs çevresinde birçok restaurant ve kafe var.',
                keywords: ['yemek', 'yemekhane', 'kantin', 'kafeterya', 'kampüs'],
                relatedQuestions: ['Yemekhane saatleri nedir?', 'Öğrenci kartı nasıl yüklenir?'],
                importance: 3
            },
            {
                category: 'Bölüm Kültürü',
                question: 'Bilgisayar Mühendisliği bölümünde ders yükü nasıl?',
                answer: 'Ders yükü yoğun, özellikle 3. ve 4. sınıfta. Haftada 3-4 farklı ders projesi olabiliyor. Zaman yönetimi çok önemli. Erken başlayın, son güne bırakmayın. Çalışma grupları kurun, birbirinize yardım edin. Lab derslerine mutlaka katılın.',
                keywords: ['ders yükü', 'proje', 'zaman yönetimi', 'bölüm', 'zorluk'],
                relatedQuestions: ['Nasıl verimli çalışabilirim?', 'Hangi dönem en zor?'],
                importance: 5
            },
            {
                category: 'Sınavlar',
                question: 'Vize ve final sınavları nasıl oluyor?',
                answer: 'Vize genelde 7. hafta, final dönem sonunda yapılıyor. Çoğu ders için hem vize hem final var, bazı derslerde quiz ler de oluyor. Sınavlar genelde kapalı kitap oluyor ama bazı hocalar kağıt izin veriyor (cheat sheet). Mazeret sınavı için sağlık raporu gerekli.',
                keywords: ['vize', 'final', 'sınav', 'quiz', 'mazeret'],
                relatedQuestions: ['Sınav tarihleri ne zaman açıklanır?', 'Bütünleme sınavı var mı?'],
                importance: 4
            },
            {
                category: 'Projeler',
                question: 'Bitirme projesi nasıl seçilir?',
                answer: 'Bitirme projesi 4. sınıfta yapılıyor. Genelde 3. sınıfın ikinci döneminde danışman ve konu seçimi yapılıyor. Kendi fikrinizi önerebilir veya hocaların önerdiği konulardan birini seçebilirsiniz. Grup çalışması olabilir (2-3 kişi). Konunuzu sevdiğiniz ve öğrenmek istediğiniz bir alanda seçin.',
                keywords: ['bitirme projesi', 'graduation project', 'danışman', '4. sınıf'],
                relatedQuestions: ['Ne zaman başlamalıyım?', 'Hangi konuyu seçmeliyim?'],
                importance: 5
            },
            {
                category: 'Genel',
                question: 'Staj ne zaman yapılır?',
                answer: 'Zorunlu staj 3. sınıf yazında yapılır, minimum 30 iş günü. Bazı öğrenciler 2. sınıf yazında da gönüllü staj yapıyor. Staj yeri bulmak için Kariyer Merkezi ne başvurabilir, LinkedIn kullanabilir veya direkt firmalara başvurabilirsiniz. Erken başvurun, popüler şirketler hızlı doluyor.',
                keywords: ['staj', 'internship', 'kariyer', 'iş'],
                relatedQuestions: ['Hangi şirketlere başvurmalıyım?', 'Staj ücreti ne kadar?'],
                importance: 5
            },
            {
                category: 'Genel',
                question: 'Erasmus programına nasıl başvurulur?',
                answer: 'Erasmus başvuruları genelde 3. dönemde açılıyor. Minimum 2.50 not ortalaması gerekiyor. Dil bilgisi belgesi (TOEFL, YDS vb.) şart. Başvuru yaparken tercih sıranızı iyi belirleyin. Kabul edilirseniz 1 veya 2 dönem yurtdışında okuyabilirsiniz. Detaylar için Erasmus koordinatörü ne danışın.',
                keywords: ['erasmus', 'yurtdışı', 'değişim programı', 'başvuru'],
                relatedQuestions: ['Hangi üniversitelerle anlaşmamız var?', 'Masraflar ne kadar?'],
                importance: 4
            }
        ]);

        console.log(`✅ ${knowledgeBase.length} bilgi girişi eklendi`);

        console.log('\n🎉 Tüm veriler başarıyla eklendi!');
        console.log('\n📊 Özet:');
        console.log(`   👨‍🏫 Hocalar: ${professors.length}`);
        console.log(`   📚 Dersler: ${courses.length}`);
        console.log(`   👨‍🎓 Öğrenciler: ${students.length}`);
        console.log(`   🎉 Etkinlikler: ${activities.length}`);
        console.log(`   📖 Bilgi Girişleri: ${knowledgeBase.length}`);

        console.log('\n✅ Veritabanı hazır! Server ı başlatabilirsiniz.');

    } catch (error) {
        console.error('\n❌ Hata:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n👋 Bağlantı kapatıldı');
    }
}

seedDatabase();
