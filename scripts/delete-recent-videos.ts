import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Note: We need to define the schema here or import it if compatible with ts-node
// Importing from src might have issues with path aliases in scripts without extra config
// So I will define a minimal schema here for safety and speed.

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not defined.');
    process.exit(1);
}

const contentSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: String,
}, { timestamps: true });

// Use existing model or compile new one
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

async function deleteAllVideos() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB.');

        // Find ALL videos
        const count = await Content.countDocuments({ type: 'video' });

        if (count === 0) {
            console.log('No videos found to delete.');
            return;
        }

        console.log(`Found ${count} videos. Deleting all of them...`);

        const result = await Content.deleteMany({ type: 'video' });

        console.log('-----------------------------------');
        console.log(`Successfully deleted ${result.deletedCount} videos.`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Deletion failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

deleteAllVideos();
