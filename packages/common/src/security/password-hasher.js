"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordHasher = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
/**
 * Service class for hashing and verifying passwords securely using bcrypt.
 */
class PasswordHasher {
    saltRounds;
    constructor(saltRounds = 10) {
        this.saltRounds = saltRounds;
    }
    /**
     * Hashes a plaintext password string.
     */
    async hash(plainText) {
        return bcryptjs_1.default.hash(plainText, this.saltRounds);
    }
    /**
     * Compares a plaintext password with a hashed password string.
     */
    async compare(plainText, hash) {
        return bcryptjs_1.default.compare(plainText, hash);
    }
}
exports.PasswordHasher = PasswordHasher;
//# sourceMappingURL=password-hasher.js.map