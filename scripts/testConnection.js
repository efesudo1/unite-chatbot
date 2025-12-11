require('dotenv').config();
const mongoose = require('mongoose');

/**
 * MongoDB Atlas bağlantı test scripti
 * Bu script veritabanı bağlantısını test eder ve detaylı bilgi verir
 */

const testConnection = async () => {
    console.log('\n🔍 MongoDB Atlas Bağlantı Testi Başlatılıyor...\n');

    // Connection string kontrolü
    if (!process.env.MONGODB_URI) {
        console.error('❌ HATA: MONGODB_URI .env dosyasında tanımlanmamış!');
        console.log('💡 Lütfen .env dosyanızı kontrol edin:\n');
        console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unite?retryWrites=true&w=majority\n');
        process.exit(1);
    }

    // Connection string formatını gizleyerek göster
    const uri = process.env.MONGODB_URI;
    const maskedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log('📝 Connection String:', maskedUri);
    console.log('');

    try {
        // MongoDB'ye bağlan
        console.log('⏳ Bağlantı kuruluyor...');
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('\n✅ MongoDB Bağlantısı BAŞARILI!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('📊 Veritabanı Bilgileri:');
        console.log('   • Host:', conn.connection.host);
        console.log('   • Database:', conn.connection.name);
        console.log('   • Port:', conn.connection.port || 'default');
        console.log('   • Ready State:', conn.connection.readyState === 1 ? 'Connected ✓' : 'Not Connected ✗');
        console.log('═══════════════════════════════════════════════════════');

        // Mevcut koleksiyonları listele
        console.log('\n📚 Mevcut Koleksiyonlar:');
        const collections = await conn.connection.db.listCollections().toArray();

        if (collections.length === 0) {
            console.log('   ℹ️  Henüz koleksiyon yok (Veritabanı boş)');
            console.log('   💡 Veri eklemek için: npm run seed');
        } else {
            for (const collection of collections) {
                const count = await conn.connection.db.collection(collection.name).countDocuments();
                console.log(`   • ${collection.name}: ${count} doküman`);
            }
        }

        console.log('\n🎉 Test Başarıyla Tamamlandı!');
        console.log('═══════════════════════════════════════════════════════\n');

        // Bağlantıyı kapat
        await mongoose.connection.close();
        console.log('🔌 Bağlantı kapatıldı.\n');
        process.exit(0);

    } catch (error) {
        console.log('\n❌ MongoDB Bağlantı Hatası!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('Hata Mesajı:', error.message);
        console.log('\n💡 Olası Çözümler:');

        if (error.message.includes('authentication failed')) {
            console.log('   1. Kullanıcı adı ve şifreyi kontrol edin');
            console.log('   2. MongoDB Atlas\'ta kullanıcının doğru oluşturulduğunu kontrol edin');
            console.log('   3. Şifrede özel karakterler varsa URL encoding yapın');
        } else if (error.message.includes('IP') || error.message.includes('whitelist')) {
            console.log('   1. Network Access sekmesinden IP adresinizi whitelist\'e ekleyin');
            console.log('   2. Geliştirme için 0.0.0.0/0 kullanabilirsiniz');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.log('   1. Internet bağlantınızı kontrol edin');
            console.log('   2. Connection string\'in doğru olduğunu kontrol edin');
            console.log('   3. Cluster\'ın aktif olduğunu kontrol edin');
        } else {
            console.log('   1. .env dosyasındaki MONGODB_URI değişkenini kontrol edin');
            console.log('   2. MongoDB Atlas Dashboard\'dan connection string\'i yeniden alın');
            console.log('   3. Cluster\'ın "Active" durumda olduğunu kontrol edin');
        }

        console.log('\n📖 Daha fazla yardım için: docs/mongodb_atlas_setup.md');
        console.log('═══════════════════════════════════════════════════════\n');
        process.exit(1);
    }
};

// Scripti çalıştır
testConnection();
