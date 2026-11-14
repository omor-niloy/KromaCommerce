import bcrypt from 'bcryptjs';

/**
 * Service class for hashing and verifying passwords securely using bcrypt.
 */
export class PasswordHasher {
  private readonly saltRounds: number;

  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  /**
   * Hashes a plaintext password string.
   */
  public async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.saltRounds);
  }

  /**
   * Compares a plaintext password with a hashed password string.
   */
  public async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
