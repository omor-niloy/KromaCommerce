import { PrismaClient, User } from '@ecommerce/database';
import { BaseRepository } from '@ecommerce/common';
import { IUserRepository, CreateUserData } from './user.repository.interface';

/**
 * Prisma implementation of User Repository.
 */
export class UserRepository extends BaseRepository<User> implements IUserRepository {
  private readonly db: PrismaClient;

  constructor(db: PrismaClient) {
    super();
    this.db = db;
  }

  public async findById(id: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { id }
    });
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });
  }

  public async findAll(): Promise<User[]> {
    return this.db.user.findMany();
  }

  public async create(data: CreateUserData): Promise<User> {
    return this.db.user.create({
      data: {
        email: data.email.toLowerCase().trim(),
        name: data.name.trim(),
        passwordHash: data.passwordHash,
        role: data.role || 'CUSTOMER'
      }
    });
  }

  public async update(id: string, data: Partial<User>): Promise<User> {
    return this.db.user.update({
      where: { id },
      data
    });
  }

  public async updateRefreshTokenHash(userId: string, hash: string | null): Promise<User> {
    return this.db.user.update({
      where: { id: userId },
      data: { refreshTokenHash: hash }
    });
  }

  public async delete(id: string): Promise<boolean> {
    await this.db.user.delete({
      where: { id }
    });
    return true;
  }
}
