import mongoose, { Schema, Document, Model } from 'mongoose';

export type ContentType = 'video' | 'photo' | 'program' | 'link';

export interface IContent extends Document {
    type: ContentType;
    title: string;
    description?: string;
    url: string; // Source URL (video link, image link, download link)
    thumbnailUrl?: string;
    tags?: string[];
    category?: string;
    fileSize?: string; // For programs/files
    views: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const ContentSchema: Schema = new Schema({
    type: {
        type: String,
        enum: ['video', 'photo', 'program', 'link'],
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: [true, 'Please provide the content URL'],
    },
    thumbnailUrl: {
        type: String,
    },
    tags: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        default: 'General',
    },
    fileSize: {
        type: String,
    },
    views: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Index for easier searching
ContentSchema.index({ title: 'text', description: 'text', tags: 'text' });
ContentSchema.index({ type: 1 });

const Content: Model<IContent> = mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema);

export default Content;
