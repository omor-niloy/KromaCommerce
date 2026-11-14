import {
  RegisterInput,
  LoginInput,
  AuthTokens,
  UserProfile
} from '@ecommerce/common';

export interface AuthResult {
  user: UserProfile;
  tokens: AuthTokens;
}

/**
 * Interface contract for authentication business logic.
 */
export interface IAuthService {
  register(input: RegisterInput): Promise<AuthResult>;
  login(input: LoginInput): Promise<AuthResult>;
  refreshTokens(refreshToken: string): Promise<AuthTokens>;
  logout(userId: string): Promise<void>;
  getUserProfile(userId: string): Promise<UserProfile>;
}
