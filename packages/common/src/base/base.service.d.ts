/**
 * Abstract Base Service providing common business logic utilities.
 */
export declare abstract class BaseService {
    /**
     * Helper to ensure an entity exists or throws an error.
     */
    protected ensureExists<T>(item: T | null | undefined, errorMessage?: string): T;
}
//# sourceMappingURL=base.service.d.ts.map