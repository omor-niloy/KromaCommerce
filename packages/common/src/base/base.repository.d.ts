/**
 * Generic repository interface contract defining core CRUD operations.
 */
export interface IRepository<T, ID = string> {
    findById(id: ID): Promise<T | null>;
    findAll(filter?: Record<string, unknown>): Promise<T[]>;
    create(data: unknown): Promise<T>;
    update(id: ID, data: unknown): Promise<T>;
    delete(id: ID): Promise<boolean>;
}
/**
 * Abstract Base Repository encapsulating database connection context.
 */
export declare abstract class BaseRepository<T, ID = string> implements IRepository<T, ID> {
    abstract findById(id: ID): Promise<T | null>;
    abstract findAll(filter?: Record<string, unknown>): Promise<T[]>;
    abstract create(data: unknown): Promise<T>;
    abstract update(id: ID, data: unknown): Promise<T>;
    abstract delete(id: ID): Promise<boolean>;
}
//# sourceMappingURL=base.repository.d.ts.map