/**
 * Abstract Base Service providing common business logic utilities.
 */
export abstract class BaseService {
  /**
   * Helper to ensure an entity exists or throws an error.
   */
  protected ensureExists<T>(
    item: T | null | undefined,
    errorMessage = 'Requested resource was not found'
  ): T {
    if (item === null || item === undefined) {
      throw new Error(errorMessage);
    }
    return item;
  }
}
