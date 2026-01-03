import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars from .env.local if running locally
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

async function resetAdmin() {
    if (!MONGODB_URI) {
        console.error('Error: MONGODB_URI is not defined in environment variables.');
        process.exit(1);
    }

    if (!ADMIN_PASSWORD) {
        console.error('Error: ADMIN_PASSWORD is not defined.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully.');

        // Simple Schema definition
        const adminSchema = new mongoose.Schema({
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        }, { timestamps: true });

        const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

        const result = await Admin.findOneAndUpdate(
            { username: ADMIN_USERNAME },
            { password: hashedPassword },
            { upsert: true, new: true }
        );

        console.log('-----------------------------------');
        console.log(`Admin account reset successfully!`);
        console.log(`Username: ${ADMIN_USERNAME}`);
        console.log(`Password: (Set from environment variables)`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

resetAdmin();
