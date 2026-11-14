"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScraperStrategyManager = void 0;
const mock_store_scraper_strategy_1 = require("./mock-store-scraper.strategy");
const generic_web_scraper_strategy_1 = require("./generic-web-scraper.strategy");
/**
 * Strategy manager resolving the appropriate scraper strategy for a target URL.
 */
class ScraperStrategyManager {
    strategies;
    constructor(strategies) {
        this.strategies = strategies || [
            new mock_store_scraper_strategy_1.MockCompetitorStoreScraperStrategy(),
            new generic_web_scraper_strategy_1.GenericWebScraperStrategy()
        ];
    }
    /**
     * Resolves the first strategy that supports the target URL.
     */
    resolveStrategy(targetUrl) {
        for (const strategy of this.strategies) {
            if (strategy.supports(targetUrl)) {
                return strategy;
            }
        }
        return new generic_web_scraper_strategy_1.GenericWebScraperStrategy();
    }
}
exports.ScraperStrategyManager = ScraperStrategyManager;
//# sourceMappingURL=scraper-strategy.manager.js.map