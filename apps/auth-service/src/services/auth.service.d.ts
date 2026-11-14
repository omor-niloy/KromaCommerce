import { BaseService, PasswordHasher, JwtTokenManager, RegisterInput, LoginInput, AuthTokens, UserProfile } from '@ecommerce/common';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IAuthService, AuthResult } from './auth.service.interface';
/**
 * Authentication business logic service managing user registration, credential checks, and token lifecycle.
 */
export declare class AuthService extends BaseService implements IAuthService {
    private readonly userRepo;
    private readonly passwordHasher;
    private readonly tokenManager;
    constructor(userRepo: IUserRepository, passwordHasher?: PasswordHasher, tokenManager?: JwtTokenManager);
    register(input: RegisterInput): Promise<AuthResult>;
    login(input: LoginInput): Promise<AuthResult>;
    refreshTokens(refreshToken: string): Promise<AuthTokens>;
    logout(userId: string): Promise<void>;
    getUserProfile(userId: string): Promise<UserProfile>;
    private mapToProfile;
}
//# sourceMappingURL=auth.service.d.ts.map