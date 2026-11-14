# Catalog & Products Microservice (`apps/catalog-service`)

## 1. Role & Purpose
The Catalog microservice manages product listings, categories, full-text search, inventory counts, and competitor URL mappings.

## 2. Port & Configuration
- **Port:** `8002`
- **Environment Variables:**
  - `PORT`: Service port (default: 8002)
  - `DATABASE_URL`: PostgreSQL connection string

## 3. Class-Based Architecture
- **Controller:** `ProductController extends BaseController`
  - Maps REST endpoints to service invocations; dispatches `sendPaginated`, `sendSuccess`, `sendCreated`, `sendNoContent`.
- **Service:** `ProductService extends BaseService implements IProductService`
  - Enforces slug uniqueness, category validation, search filtering, and inventory updates.
- **Repository:** `ProductRepository extends BaseRepository<Product> implements IProductRepository`
  - Performs parameterized Prisma queries with pagination (`skip`/`take`), sorting, and multi-field keyword filtering.
- **Category Repository:** `CategoryRepository extends BaseRepository<Category> implements ICategoryRepository`
  - Encapsulates category CRUD operations.

## 4. Query Optimization
- Indices on `slug`, `categoryId`, and `price` ensure rapid lookups across large catalogs.
- Relations automatically include latest competitor price snapshot for dynamic price comparison badges.
