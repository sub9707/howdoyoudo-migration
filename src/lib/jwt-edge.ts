import * as jose from 'jose';
import { AdminSession } from '@/types/admin';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Secret을 Uint8Array로 변환
const secret = new TextEncoder().encode(JWT_SECRET);

// 토큰 검증
export async function verifyToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jose.jwtVerify(token, secret);
    
    return {
      id: payload.id as number,
      username: payload.username as string,
      name: payload.name as string,
      iat: payload.iat || 0,
      exp: payload.exp || 0,
    };
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// 토큰 디코드
export function decodeToken(token: string): AdminSession | null {
  try {
    const decoded = jose.decodeJwt(token);
    
    return {
      id: decoded.id as number,
      username: decoded.username as string,
      name: decoded.name as string,
      iat: decoded.iat || 0,
      exp: decoded.exp || 0,
    };
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}