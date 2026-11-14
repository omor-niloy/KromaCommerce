"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const common_1 = require("@ecommerce/common");
/**
 * Prisma implementation of User Repository.
 */
class UserRepository extends common_1.BaseRepository {
    db;
    constructor(db) {
        super();
        this.db = db;
    }
    async findById(id) {
        return this.db.user.findUnique({
            where: { id }
        });
    }
    async findByEmail(email) {
        return this.db.user.findUnique({
            where: { email: email.toLowerCase().trim() }
        });
    }
    async findAll() {
        return this.db.user.findMany();
    }
    async create(data) {
        return this.db.user.create({
            data: {
                email: data.email.toLowerCase().trim(),
                name: data.name.trim(),
                passwordHash: data.passwordHash,
                role: data.role || 'CUSTOMER'
            }
        });
    }
    async update(id, data) {
        return this.db.user.update({
            where: { id },
            data
        });
    }
    async updateRefreshTokenHash(userId, hash) {
        return this.db.user.update({
            where: { id: userId },
            data: { refreshTokenHash: hash }
        });
    }
    async delete(id) {
        await this.db.user.delete({
            where: { id }
        });
        return true;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map