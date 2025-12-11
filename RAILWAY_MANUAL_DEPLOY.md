# Railway Otomatik Deploy İptal Rehberi

## 🛑 Otomatik Deploy'u Kapatma

Railway'de otomatik deployment'ı kapatmak için:

### Yöntem 1: Railway Dashboard (Önerilen)

1. **Railway Dashboard'a gidin:** https://railway.app
2. Projenizi açın
3. **Settings** sekmesine tıklayın
4. **Deploys** bölümünü bulun
5. **"Enable automatic deploys"** toggle'ını **KAPAT** (OFF)

✅ Artık her GitHub push'ta otomatik deploy olmayacak

---

### Yöntem 2: Manuel Deploy

Otomatik deploy kapatıldıktan sonra, deploy etmek istediğinizde:

1. Railway Dashboard → **Deployments** sekmesi
2. **"Deploy"** butonuna tıklayın
3. Deployment manuel olarak başlatılır

---

### Yöntem 3: Railway CLI ile

```bash
# Railway CLI kur
npm install -g @railway/cli

# Login
railway login

# Manuel deploy
railway up
```

---

## ⚙️ railway.json Dosyası

Bu proje klasöründe `railway.json` dosyası oluşturuldu. 

Bu dosya Railway deployment ayarlarını içerir:
- Build stratejisi: NIXPACKS
- Restart policy: ON_FAILURE (sadece hata durumunda)
- Max retries: 3

---

## 🔒 Güvenlik Notu

Railway'de environment variables'larınızın güncel olduğundan emin olun:

**Gerekli Variables:**
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=production
```

⚠️ Bu bilgiler Railway Dashboard → Variables bölümünde olmalı!

---

## 📝 Git Push Sonrası

Artık GitHub'a push yaptığınızda:

❌ **Otomatik deploy OLMAYACAK**
✅ **Manuel olarak deploy edebilirsiniz**

Bu sayede:
- Test edilmemiş kodu production'a göndermezsiniz
- Daha kontrollü deployment yaparsınız
- Railway kullanım limitlerinden tasarruf edersiniz

---

## 🚀 Deploy Kontrolü

Deploy edilmesini istediğiniz bir değişiklik yaptıysanız:

1. GitHub'a pushlayın
2. Railway Dashboard'a gidin
3. **"Deploy"** butonuna tıklayın
4. Deployment logs'u takip edin

Bu şekilde hangi değişikliklerin ne zaman deploy edileceğini siz kontrol edersiniz!
