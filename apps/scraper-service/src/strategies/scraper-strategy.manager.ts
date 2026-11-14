import { IScraperStrategy } from '@ecommerce/common';
import { MockCompetitorStoreScraperStrategy } from './mock-store-scraper.strategy';
import { GenericWebScraperStrategy } from './generic-web-scraper.strategy';

/**
 * Strategy manager resolving the appropriate scraper strategy for a target URL.
 */
export class ScraperStrategyManager {
  private readonly strategies: IScraperStrategy[];

  constructor(strategies?: IScraperStrategy[]) {
    this.strategies = strategies || [
      new MockCompetitorStoreScraperStrategy(),
      new GenericWebScraperStrategy()
    ];
  }

  /**
   * Resolves the first strategy that supports the target URL.
   */
  public resolveStrategy(targetUrl: string): IScraperStrategy {
    for (const strategy of this.strategies) {
      if (strategy.supports(targetUrl)) {
        return strategy;
      }
    }
    return new GenericWebScraperStrategy();
  }
}
