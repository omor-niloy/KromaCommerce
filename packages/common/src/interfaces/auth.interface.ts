/**
 * Supported user roles for Role-Based Access Control (RBAC).
 */
export type UserRole = 'CUSTOMER' | 'ADMIN';

/**
 * Decoded JWT access token payload structure.
 */
export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * Authentication tokens pair issued to client.
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Public user representation stripped of security hashes.
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
