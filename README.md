# 🎓 UNİTE - Üniversite Chatbot Platformu

> TÜBİTAK 2209-A Projesi - Dokuz Eylül Üniversitesi Öğrencileri İçin Yapay Zeka Destekli Bilgi Paylaşım ve Eşleştirme Platformu

## 📖 Proje Hakkında

UNİTE, üniversite öğrencilerinin akademik ve sosyal yaşamlarını kolaylaştırmak için geliştirilmiş kapsamlı bir platformdur. Platform, yapay zeka destekli chatbot, öğrenci eşleştirme sistemi, ders ve hoca bilgileri, sosyal etkinlik yönetimi gibi özellikleri bir araya getirir.

### ✨ Özellikler

- **🤖 Yapay Zeka Chatbot**: Dersler, hocalar, kampüs ve etkinlikler hakkında sorularınıza anında yanıt
- **📚 Ders Kataloğu**: Detaylı ders bilgileri, zorluk seviyeleri, öğrenci yorumları
- **👨‍🏫 Hoca Bilgileri**: Öğretim üyelerinin iletişim bilgileri, ofis saatleri, öğrenci değerlendirmeleri
- **👥 Öğrenci Eşleştirme**: Üst-alt sınıf mentorlük sistemi, ders bazlı eşleştirme
- **🎉 Sosyal Etkinlikler**: Kampüs ve çevre etkinlikleri, kayıt sistemi
- **📖 Bilgi Havuzu**: Bölüm kültürü, sınavlar, projeler hakkında bilgiler

## 🛠️ Teknoloji Yığını

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Veritabanı
- **Mongoose** - ODM (Object Data Modeling)

### Frontend
- **HTML5/CSS3** - Yapı ve stil
- **Vanilla JavaScript** - İnteraktif özellikler
- **Google Fonts** - Modern tipografi

### Chatbot
- **NLP (Natural Language Processing)** - Türkçe anahtar kelime analizi
- **Pattern Matching** - Intent detection
- **Knowledge Base** - Bilgi havuzu eşleştirme

## 📦 Kurulum

### Gereksinimler
- Node.js (v18 veya üzeri)
- MongoDB (Atlas veya yerel kurulum)
- npm veya yarn

### Adımlar

1. **Repoyu klonlayın**
```bash
git clone <repo-url>
cd UNİte
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Çevre değişkenlerini ayarlayın**

`.env.example` dosyasını `.env` olarak kopyalayın ve MongoDB bağlantı bilgilerinizi girin:

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
# MongoDB Atlas için
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unite?retryWrites=true&w=majority

# Yerel MongoDB için
# MONGODB_URI=mongodb://localhost:27017/unite

PORT=3000
NODE_ENV=development
```

4. **MongoDB Kurulumu**

**Seçenek 1: MongoDB Atlas (Önerilen - Bulut)**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)'a ücretsiz hesap açın
- Yeni bir cluster oluşturun (Free tier yeterli)
- Database Access'ten kullanıcı oluşturun
- Network Access'ten IP adresinizi whitelist'e ekleyin
- Connection string'i kopyalayın ve `.env` dosyasına ekleyin

**Seçenek 2: Yerel MongoDB**
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) indirin ve kurun
- MongoDB servisini başlatın
- `.env` dosyasında yerel connection string kullanın

5. **Veritabanına örnek veri yükleyin**
```bash
npm run seed
```

Çıktı:
```
✅ MongoDB bağlantısı başarılı
🗑️  Mevcut veriler temizleniyor...
👨‍🏫 Hocalar oluşturuluyor...
✅ 5 hoca eklendi
📚 Dersler oluşturuluyor...
✅ 8 ders eklendi
👨‍🎓 Öğrenciler oluşturuluyor...
✅ 4 öğrenci eklendi
🎉 Etkinlikler oluşturuluyor...
✅ 6 etkinlik eklendi
📖 Bilgi havuzu oluşturuluyor...
✅ 10 bilgi girişi eklendi
```

6. **Sunucuyu başlatın**
```bash
npm start
```

Veya geliştirme modunda (auto-reload ile):
```bash
npm run dev
```

7. **Tarayıcıda açın**

http://localhost:3000 adresine gidin

## 📁 Proje Yapısı

```
UNİte/
├── config/
│   └── database.js          # MongoDB bağlantı yapılandırması
├── models/
│   ├── Course.js            # Ders modeli
│   ├── Professor.js         # Hoca modeli
│   ├── Student.js           # Öğrenci modeli
│   ├── Activity.js          # Etkinlik modeli
│   ├── ChatMessage.js       # Chat mesaj geçmişi
│   └── KnowledgeBase.js     # Bilgi havuzu modeli
├── routes/
│   ├── chatbot.js           # Chatbot API
│   ├── courses.js           # Ders API
│   ├── professors.js        # Hoca API
│   ├── students.js          # Öğrenci API
│   └── activities.js        # Etkinlik API
├── services/
│   └── chatbotService.js    # Chatbot mantığı ve NLP
├── utils/
│   └── nlpHelper.js         # NLP yardımcı fonksiyonlar
├── scripts/
│   └── seedData.js          # Örnek veri üretimi
├── public/
│   ├── css/
│   │   └── style.css        # Ana stil dosyası
│   ├── js/
│   │   └── main.js          # Yardımcı JavaScript
│   ├── index.html           # Ana sayfa
│   ├── chatbot.html         # Chatbot sayfası
│   ├── courses.html         # Dersler sayfası
│   ├── professors.html      # Hocalar sayfası
│   ├── matching.html        # Eşleştirme sayfası
│   └── activities.html      # Etkinlikler sayfası
├── server.js                # Express server
├── package.json
├── .env.example
└── README.md
```

## 🚀 Kullanım

### Chatbot Kullanımı

Chatbot sayfasına gidip şu tarz sorular sorabilirsiniz:

- "Veri Yapıları dersi hakkında bilgi ver"
- "Prof. Dr. Mehmet Yılmaz kimdir?"
- "Yaklaşan etkinlikler neler?"
- "Nasıl mentör bulabilirim?"
- "Staj ne zaman yapılır?"

### API Endpoints

#### Chatbot
```
POST /api/chatbot/message
GET  /api/chatbot/history/:sessionId
POST /api/chatbot/feedback
```

#### Dersler
```
GET  /api/courses
GET  /api/courses/:id
GET  /api/courses/search/:query
POST /api/courses/:id/comment
```

#### Hocalar
```
GET  /api/professors
GET  /api/professors/:id
GET  /api/professors/search/:query
POST /api/professors/:id/review
```

#### Öğrenciler
```
GET  /api/students
GET  /api/students/:id
POST /api/students/match
POST /api/students/:id/courses
```

#### Etkinlikler
```
GET  /api/activities
GET  /api/activities/:id
GET  /api/activities/category/:category
POST /api/activities/:id/register
```

## 🎨 Tasarım Özellikleri

- **Modern Gradient Paleti**: Vibrant renkler ve geçişler
- **Glassmorphism**: Şık cam efektleri
- **Dark Mode**: Göz yormayan koyu tema
- **Responsive Design**: Tüm ekran boyutlarında çalışır
- **Smooth Animations**: Akıcı geçişler ve hover efektleri
- **Premium Typography**: Google Fonts (Inter, Poppins)

## 📊 Veri Modelleri

### Course (Ders)
- Ders kodu, isim, açıklama
- Kredi, dönem, zorluk seviyesi
- Konular, ön koşullar
- Hoca bilgileri
- Öğrenci yorumları ve puanları

### Professor (Hoca)
- Ad, unvan, bölüm
- İletişim bilgileri
- Ofis lokasyonu ve saatleri
- Araştırma alanları
- Verdiği dersler
- Öğrenci değerlendirmeleri

### Student (Öğrenci)
- Öğrenci bilgileri
- Tamamlanan ve devam eden dersler
- İlgi alan ları ve kulüpler
- Eşleştirme tercihleri
- Eşleşme geçmişi

### Activity (Etkinlik)
- Başlık, kategori, açıklama
- Tarih, saat, konum
- Organizatör, iletişim
- Kapasite ve kayıtlılar
- Kazanımlar

### KnowledgeBase (Bilgi Havuzu)
- Kategori, soru, cevap
- Anahtar kelimeler
- İlgili sorular
- Önem derecesi

## 🤝 Katkıda Bulunma

Bu proje TÜBİTAK 2209-A kapsamında geliştirilmiştir. Katkıda bulunmak isterseniz:

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📝 Lisans

MIT License

## 👥 Proje Ekibi

- **Proje Yürütücüsü**: [Ahmet EFE]


## 📧 İletişim

Sorularınız için: [email@example.com]

---

**Not**: Bu proje eğitim amaçlıdır ve sürekli geliştirilmektedir. Geri bildirimlerinizi bekliyoruz! 🎓
