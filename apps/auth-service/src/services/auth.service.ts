import {
  BaseService,
  PasswordHasher,
  JwtTokenManager,
  RegisterInput,
  LoginInput,
  AuthTokens,
  UserProfile,
  ConflictError,
  UnauthorizedError,
  NotFoundError
} from '@ecommerce/common';
import { IUserRepository } from '../repositories/user.repository.interface';
import { IAuthService, AuthResult } from './auth.service.interface';
import { User } from '@ecommerce/database';

/**
 * Authentication business logic service managing user registration, credential checks, and token lifecycle.
 */
export class AuthService extends BaseService implements IAuthService {
  private readonly userRepo: IUserRepository;
  private readonly passwordHasher: PasswordHasher;
  private readonly tokenManager: JwtTokenManager;

  constructor(
    userRepo: IUserRepository,
    passwordHasher: PasswordHasher = new PasswordHasher(),
    tokenManager: JwtTokenManager = new JwtTokenManager()
  ) {
    super();
    this.userRepo = userRepo;
    this.passwordHasher = passwordHasher;
    this.tokenManager = tokenManager;
  }

  public async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new ConflictError('A user with this email address already exists');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);
    const user = await this.userRepo.create({
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role
    });

    const tokens = this.tokenManager.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshTokenHash = await this.passwordHasher.hash(tokens.refreshToken);
    await this.userRepo.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user: this.mapToProfile(user),
      tokens
    };
  }

  public async login(input: LoginInput): Promise<AuthResult> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const tokens = this.tokenManager.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshTokenHash = await this.passwordHasher.hash(tokens.refreshToken);
    await this.userRepo.updateRefreshTokenHash(user.id, refreshTokenHash);

    return {
      user: this.mapToProfile(user),
      tokens
    };
  }

  public async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    const payload = this.tokenManager.verifyRefreshToken(refreshToken);
    const user = await this.userRepo.findById(payload.userId);

    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedError('Session revoked or user not found');
    }

    const matches = await this.passwordHasher.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const newTokens = this.tokenManager.generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const newHash = await this.passwordHasher.hash(newTokens.refreshToken);
    await this.userRepo.updateRefreshTokenHash(user.id, newHash);

    return newTokens;
  }

  public async logout(userId: string): Promise<void> {
    await this.userRepo.updateRefreshTokenHash(userId, null);
  }

  public async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User profile not found');
    }
    return this.mapToProfile(user);
  }

  private mapToProfile(user: User): UserProfile {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
