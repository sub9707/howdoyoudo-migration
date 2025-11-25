import jwt from 'jsonwebtoken';
import { AdminSession } from '@/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 허용되는 만료 시간 
type ExpiresIn = '1h' | '24h' | '7d' | '30d';

export function generateToken(payload: { id: number; username: string; name: string }): string {

  const expiresIn: ExpiresIn = (process.env.JWT_EXPIRES_IN as ExpiresIn) || '7d';
  
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn,
  });
}

export function verifyToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSession;
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export function decodeToken(token: string): AdminSession | null {
  try {
    const decoded = jwt.decode(token) as AdminSession;
    return decoded;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}