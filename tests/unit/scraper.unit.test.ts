import { describe, it, expect } from 'vitest';
import {
  ScrapeTargetSchema,
  TriggerSyncSchema,
  IScraperStrategy,
  ScrapedCompetitorData
} from '@ecommerce/common';
import {
  ScraperStrategyManager,
  MockCompetitorStoreScraperStrategy,
  GenericWebScraperStrategy,
  BaseScraperStrategy
} from '@ecommerce/scraper-service';

/**
 * Concrete test harness exposing protected cleanPriceString method from BaseScraperStrategy.
 */
class TestScraperStrategy extends BaseScraperStrategy {
  public supports(_url: string): boolean {
    return true;
  }

  public async scrape(_targetUrl: string): Promise<ScrapedCompetitorData> {
    return {
      competitorName: 'Test Competitor',
      competitorUrl: 'https://test.com',
      price: 100,
      currency: 'usd',
      inStock: true,
      scrapedAt: new Date()
    };
  }

  public testCleanPriceString(raw: string): number {
    return this.cleanPriceString(raw);
  }
}

/**
 * Unit test suite verifying Price Intelligence scraper strategies and numeric parsing.
 */
describe('Scraper Unit Tests', () => {
  describe('Price Cleaning & Float Parsing Logic', () => {
    const testStrategy = new TestScraperStrategy();

    it('should cleanly parse standard USD price formats', () => {
      expect(testStrategy.testCleanPriceString('$199.99')).toEqual(199.99);
      expect(testStrategy.testCleanPriceString('$0.99')).toEqual(0.99);
      expect(testStrategy.testCleanPriceString('$1,499.50')).toEqual(1499.50);
    });

    it('should parse prices with international currency symbols and prefixes', () => {
      expect(testStrategy.testCleanPriceString('€ 49.50')).toEqual(49.50);
      expect(testStrategy.testCleanPriceString('£ 79.95')).toEqual(79.95);
      expect(testStrategy.testCleanPriceString('Price: $12.34 USD')).toEqual(12.34);
    });

    it('should return 0 when string contains no numeric price data', () => {
      expect(testStrategy.testCleanPriceString('Out of Stock')).toEqual(0);
      expect(testStrategy.testCleanPriceString('')).toEqual(0);
      expect(testStrategy.testCleanPriceString('Free')).toEqual(0);
    });
  });

  describe('ScraperStrategyManager (Strategy Pattern Resolution)', () => {
    const manager = new ScraperStrategyManager();

    it('should resolve MockCompetitorStoreScraperStrategy for localhost mock routes', () => {
      const urls = [
        'http://localhost:8004/mock-competitor/products/headphones',
        'http://127.0.0.1:8004/mock-competitor/products/speaker',
        'https://internal-server.local/mock-competitor/item'
      ];

      for (const url of urls) {
        const strategy = manager.resolveStrategy(url);
        expect(strategy).toBeInstanceOf(MockCompetitorStoreScraperStrategy);
      }
    });

    it('should resolve GenericWebScraperStrategy for external merchant URLs', () => {
      const urls = [
        'https://external-merchant.com/p/audio-headphones-pro',
        'https://electro-shop.com/item/12345',
        'https://techsuperstore.org/gadgets'
      ];

      for (const url of urls) {
        const strategy = manager.resolveStrategy(url);
        expect(strategy).toBeInstanceOf(GenericWebScraperStrategy);
      }
    });

    it('should prioritize custom injected strategies when supplied to manager', () => {
      const customStrategy: IScraperStrategy = {
        supports: (url: string) => url.includes('custom-merchant.com'),
        scrape: async () => ({
          competitorName: 'Custom Merchant',
          competitorUrl: 'https://custom-merchant.com',
          price: 50,
          currency: 'usd',
          inStock: true,
          scrapedAt: new Date()
        })
      };

      const customManager = new ScraperStrategyManager([customStrategy, new GenericWebScraperStrategy()]);
      const resolved = customManager.resolveStrategy('https://custom-merchant.com/item/99');

      expect(resolved).toBe(customStrategy);
    });
  });

  describe('MockCompetitorStoreScraperStrategy Rule Matching', () => {
    const mockStrategy = new MockCompetitorStoreScraperStrategy();

    it('should support mock URLs matching target criteria', () => {
      expect(mockStrategy.supports('http://localhost:8004/mock-competitor/products/headphones')).toBe(true);
      expect(mockStrategy.supports('http://127.0.0.1:8000/mock-competitor/products/monitor')).toBe(true);
      expect(mockStrategy.supports('https://production-host.com/mock-competitor/products/smartwatch')).toBe(true);
    });

    it('should reject external third-party production store domains', () => {
      expect(mockStrategy.supports('https://amazon.com/dp/B08166SLDF')).toBe(false);
      expect(mockStrategy.supports('https://bestbuy.com/site/headphones/12345.p')).toBe(false);
      expect(mockStrategy.supports('https://walmart.com/ip/54321')).toBe(false);
    });
  });

  describe('Scraper Zod Validation Schemas', () => {
    describe('ScrapeTargetSchema', () => {
      it('should validate valid targetUrl without productId', () => {
        const payload = {
          targetUrl: 'http://localhost:8004/mock-competitor/products/headphones'
        };

        const result = ScrapeTargetSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it('should validate valid targetUrl with UUID productId', () => {
        const payload = {
          productId: '550e8400-e29b-41d4-a716-446655440000',
          targetUrl: 'http://localhost:8004/mock-competitor/products/headphones'
        };

        const result = ScrapeTargetSchema.safeParse(payload);
        expect(result.success).toBe(true);
      });

      it('should reject invalid URL string', () => {
        const payload = { targetUrl: 'invalid-url' };
        const result = ScrapeTargetSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });

      it('should reject invalid UUID productId', () => {
        const payload = {
          productId: 'not-a-uuid',
          targetUrl: 'http://localhost:8004/mock-competitor/products/headphones'
        };
        const result = ScrapeTargetSchema.safeParse(payload);
        expect(result.success).toBe(false);
      });
    });

    describe('TriggerSyncSchema', () => {
      it('should default limit to 10 when not provided', () => {
        const payload = {};
        const result = TriggerSyncSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(10);
        }
      });

      it('should accept custom positive integer limit', () => {
        const payload = { limit: 25 };
        const result = TriggerSyncSchema.safeParse(payload);
        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.limit).toBe(25);
        }
      });

      it('should reject negative or non-integer limits', () => {
        expect(TriggerSyncSchema.safeParse({ limit: -5 }).success).toBe(false);
        expect(TriggerSyncSchema.safeParse({ limit: 0 }).success).toBe(false);
        expect(TriggerSyncSchema.safeParse({ limit: 2.5 }).success).toBe(false);
      });
    });
  });
});
