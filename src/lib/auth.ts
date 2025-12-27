import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

interface TokenPayload {
    username: string;
    id?: string;
}

export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): TokenPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
}

export async function isAuthenticated(): Promise<boolean> {
    // Try cookie-based auth first
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('admin_token')?.value;

    if (cookieToken) {
        const decoded = verifyToken(cookieToken);
        if (decoded) return true;
    }

    // Try Bearer token from Authorization header
    const headerStore = await headers();
    const authHeader = headerStore.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        const bearerToken = authHeader.slice(7);
        const decoded = verifyToken(bearerToken);
        if (decoded) return true;
    }

    return false;
}
