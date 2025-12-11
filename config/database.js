const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is defined
        if (!process.env.MONGODB_URI) {
            console.error('❌ MONGODB_URI environment variable is not defined!');
            console.error('💡 Please set MONGODB_URI in Railway Variables tab');

            // In production (Railway), exit. In development, warn but continue
            if (process.env.NODE_ENV === 'production') {
                process.exit(1);
            }
            return;
        }

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout for Railway
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Bağlantısı Başarılı: ${conn.connection.host}`);
        console.log(`📊 Veritabanı: ${conn.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB Bağlantı Hatası:', error.message);

        // In production, retry once after 5 seconds before giving up
        if (process.env.NODE_ENV === 'production') {
            console.log('🔄 5 saniye sonra tekrar deneniyor...');
            setTimeout(async () => {
                try {
                    await mongoose.connect(process.env.MONGODB_URI);
                    console.log('✅ MongoDB bağlantısı ikinci denemede başarılı!');
                } catch (retryError) {
                    console.error('❌ İkinci deneme de başarısız:', retryError.message);
                    process.exit(1);
                }
            }, 5000);
        } else {
            process.exit(1);
        }
    }
};

module.exports = connectDB;
