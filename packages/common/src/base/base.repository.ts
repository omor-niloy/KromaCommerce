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
export abstract class BaseRepository<T, ID = string> implements IRepository<T, ID> {
  public abstract findById(id: ID): Promise<T | null>;
  public abstract findAll(filter?: Record<string, unknown>): Promise<T[]>;
  public abstract create(data: unknown): Promise<T>;
  public abstract update(id: ID, data: unknown): Promise<T>;
  public abstract delete(id: ID): Promise<boolean>;
}
