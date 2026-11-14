/**
 * Service class for hashing and verifying passwords securely using bcrypt.
 */
export declare class PasswordHasher {
    private readonly saltRounds;
    constructor(saltRounds?: number);
    /**
     * Hashes a plaintext password string.
     */
    hash(plainText: string): Promise<string>;
    /**
     * Compares a plaintext password with a hashed password string.
     */
    compare(plainText: string, hash: string): Promise<boolean>;
}
//# sourceMappingURL=password-hasher.d.ts.map