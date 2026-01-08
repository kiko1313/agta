/**
 * @jest-environment node
 */
import { GET } from '@/app/api/content/route';
import { NextRequest } from 'next/server';
import { connectDB } from "@/lib/mongodb";
import Content from '@/models/Content';

// Mock dependencies
jest.mock('@/lib/mongodb', () => ({
    connectDB: jest.fn(),
}));

jest.mock('@/models/Content', () => ({
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    lean: jest.fn().mockResolvedValue([{ title: 'Test Video', type: 'video' }]),
}));

describe('Content API GET', () => {
    it('should return 200 and data', async () => {
        const req = new NextRequest('http://localhost:3000/api/content?type=video');
        const res = await GET(req);

        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
        expect(json.data).toHaveLength(1);
    });

    it('should return 400 for invalid type', async () => {
        const req = new NextRequest('http://localhost:3000/api/content?type=invalid');
        const res = await GET(req);

        expect(res.status).toBe(400);
    });
});
