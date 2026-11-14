import { IScraperStrategy } from '@ecommerce/common';
/**
 * Strategy manager resolving the appropriate scraper strategy for a target URL.
 */
export declare class ScraperStrategyManager {
    private readonly strategies;
    constructor(strategies?: IScraperStrategy[]);
    /**
     * Resolves the first strategy that supports the target URL.
     */
    resolveStrategy(targetUrl: string): IScraperStrategy;
}
//# sourceMappingURL=scraper-strategy.manager.d.ts.map