import { verifyToken, signToken } from '@/lib/auth';

describe('Auth Library', () => {
    it('should sign and verify a token', () => {
        const payload = { username: 'testConfigUser', id: '123' };
        const token = signToken(payload);
        const decoded = verifyToken(token);
        expect(decoded).toBeTruthy();
        expect(decoded?.username).toBe(payload.username);
    });

    it('should return null for invalid token', () => {
        const decoded = verifyToken('invalid-token');
        expect(decoded).toBeNull();
    });

    it('should return null for empty token', () => {
        const decoded = verifyToken('');
        expect(decoded).toBeNull();
    });
});
