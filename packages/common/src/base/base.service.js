"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
/**
 * Abstract Base Service providing common business logic utilities.
 */
class BaseService {
    /**
     * Helper to ensure an entity exists or throws an error.
     */
    ensureExists(item, errorMessage = 'Requested resource was not found') {
        if (item === null || item === undefined) {
            throw new Error(errorMessage);
        }
        return item;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map