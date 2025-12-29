const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://vercely:Agtalist2025Strong@cluster0.3g0lmz6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function deleteAllPhotos() {
    const client = new MongoClient(MONGODB_URI);

    try {
        console.log('🔌 Connecting to MongoDB...');
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db('test'); // Default database name
        const collection = db.collection('contents');

        console.log('🔍 Checking for photos...');
        const photoCount = await collection.countDocuments({ type: 'photo' });
        console.log(`📊 Found ${photoCount} photos`);

        if (photoCount === 0) {
            console.log('ℹ️  No photos to delete!');
            return;
        }

        console.log('🗑️  Deleting all photos...');
        const result = await collection.deleteMany({ type: 'photo' });

        console.log('✅ SUCCESS! Deleted ' + result.deletedCount + ' photos');
        console.log('🎉 All photos have been removed from your website!');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.close();
        console.log('🔒 Database connection closed');
    }
}

deleteAllPhotos();
