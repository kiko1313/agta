import { connectDB } from '../src/lib/mongodb';
import Content from '../src/models/Content';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function checkDatabase() {
    try {
        console.log('🔍 Connecting to database...');
        await connectDB();

        // Get all content
        const videos = await Content.find({ type: 'video' }).lean();
        const photos = await Content.find({ type: 'photo' }).lean();
        const programs = await Content.find({ type: 'program' }).lean();

        console.log('\n📊 Database Contents:');
        console.log(`Videos: ${videos.length}`);
        console.log(`Photos: ${photos.length}`);
        console.log(`Programs: ${programs.length}`);

        // Show video details
        if (videos.length > 0) {
            console.log('\n🎥 Videos:');
            videos.forEach((v, i) => {
                console.log(`${i + 1}. ${v.title}`);
                console.log(`   URL: ${v.url}`);
                console.log(`   Thumbnail: ${v.thumbnailUrl || 'MISSING'}`);
                console.log(`   Created: ${v.createdAt}`);
            });
        }

        // Delete broken demo videos
        const brokenVideos = videos.filter(v =>
            v.url.includes('youtube.com/watch?v=') &&
            (v.url.includes('LXb3EKWsInQ') || v.url.includes('jfKfPfyJRdk'))
        );

        if (brokenVideos.length > 0) {
            console.log(`\n🗑️  Found ${brokenVideos.length} broken demo videos. Deleting...`);
            const ids = brokenVideos.map(v => v._id);
            const result = await Content.deleteMany({ _id: { $in: ids } });
            console.log(`✅ Deleted ${result.deletedCount} broken videos`);
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkDatabase();
