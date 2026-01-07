import { connectDB } from "../src/lib/mongodb";
import Content from "../src/models/Content";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// User provided video: https://files.catbox.moe/tz0ez6.mp4

const reels = [
    {
        type: 'video',
        title: 'Featured Reel',
        description: 'Hot trend available now.',
        url: 'https://files.catbox.moe/tz0ez6.mp4',
        category: 'Reels',
        thumbnailUrl: 'https://placehold.co/600x400/1a1a1a/FFF?text=Reel'
    }
];

async function seed() {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    try {
        for (const reel of reels) {
            const exists = await Content.findOne({ url: reel.url });
            if (exists) {
                console.log(`Skipping existing reel: ${reel.title}`);
                continue;
            }
            await Content.create(reel);
            console.log(`Created reel: ${reel.title}`);
        }
    } catch (error) {
        console.error('Error seeding reels:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
}

seed();
