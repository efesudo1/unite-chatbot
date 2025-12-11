# Gemini API Key Kurulumu

## 🔑 .env Dosyasına API Key Ekleme

API key'inizi `.env` dosyasına eklemek için:

### Windows (Notepad):

```bash
notepad .env
```

### Eklenecek satır:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Tam .env dosyası örneği:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://KULLANICI_ADI:SIFRENIZ@cluster0.xxxxx.mongodb.net/unite?retryWrites=true&w=majority

# Gemini AI API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## ✅ Doğrulama

API key'in çalışıp çalışmadığını test etmek için sunucuyu başlatın:

```bash
npm start
```

Console'da şu mesajı görmemelisiniz:
```
⚠️  GEMINI_API_KEY environment variable is not set.
```

## 🚀 Kullanım

Chatbot otomatik olarak Gemini AI kullanacak:

1. Kullanıcı bir soru sorar
2. Veritabanından ilgili bilgiler toplanır
3. Gemini AI bu bilgilerle doğal bir yanıt üretir
4. Yanıt kullanıcıya gönderilir

## 🔐 Güvenlik

⚠️ **ÖNEMLİ:** `.env` dosyası `.gitignore` içinde olduğundan GitHub'a yüklenmez. 
Bu sayede API key'iniz gizli kalır.

Railway deployment için:
- Railway Dashboard → Variables → `GEMINI_API_KEY` ekleyin
