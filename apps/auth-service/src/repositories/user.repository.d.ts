import { PrismaClient, User } from '@ecommerce/database';
import { BaseRepository } from '@ecommerce/common';
import { IUserRepository, CreateUserData } from './user.repository.interface';
/**
 * Prisma implementation of User Repository.
 */
export declare class UserRepository extends BaseRepository<User> implements IUserRepository {
    private readonly db;
    constructor(db: PrismaClient);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(data: CreateUserData): Promise<User>;
    update(id: string, data: Partial<User>): Promise<User>;
    updateRefreshTokenHash(userId: string, hash: string | null): Promise<User>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=user.repository.d.ts.map