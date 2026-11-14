import { IRepository } from '@ecommerce/common';
import { User, UserRole } from '@ecommerce/database';

export interface CreateUserData {
  email: string;
  name: string;
  passwordHash: string;
  role?: UserRole;
}

/**
 * Interface contract for User data access operations.
 */
export interface IUserRepository extends IRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  updateRefreshTokenHash(userId: string, hash: string | null): Promise<User>;
}
