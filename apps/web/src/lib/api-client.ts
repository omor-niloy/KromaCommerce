import {
  Product,
  Category,
  User,
  Order,
  PriceComparisonSummary
} from '../types';

/**
 * Class-based API Client communicating with API Gateway.
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || (typeof window !== 'undefined' ? '' : process.env['GATEWAY_URL'] || 'http://localhost:8000');
  }

  private getAuthHeader(): Record<string, string> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        return { Authorization: `Bearer ${token}` };
      }
    }
    return {};
  }

  public async fetchProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<{ items: Product[]; total: number; totalPages: number }> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.categorySlug) searchParams.set('categorySlug', params.categorySlug);
    if (params?.minPrice !== undefined) searchParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice !== undefined) searchParams.set('maxPrice', params.maxPrice.toString());
    if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

    const res = await fetch(`${this.baseUrl}/api/v1/products?${searchParams.toString()}`, {
      cache: 'no-store'
    });
    const json = await res.json();
    return {
      items: json.data || [],
      total: json.meta?.total || 0,
      totalPages: json.meta?.totalPages || 1
    };
  }

  public async fetchProduct(idOrSlug: string): Promise<Product> {
    const res = await fetch(`${this.baseUrl}/api/v1/products/${idOrSlug}`, {
      cache: 'no-store'
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to load product');
    }
    return json.data;
  }

  public async fetchCategories(): Promise<Category[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/categories`, {
      cache: 'no-store'
    });
    const json = await res.json();
    return json.data || [];
  }

  public async login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include'
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Login failed');
    }
    return json.data;
  }

  public async register(email: string, password: string, name: string): Promise<{ user: User; accessToken: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
      credentials: 'include'
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Registration failed');
    }
    return json.data;
  }

  public async fetchMe(): Promise<User> {
    const res = await fetch(`${this.baseUrl}/api/v1/auth/me`, {
      headers: {
        ...this.getAuthHeader()
      },
      credentials: 'include'
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to fetch user');
    }
    return json.data;
  }

  public async createOrder(
    items: Array<{ productId: string; quantity: number }>,
    shippingAddress?: string
  ): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({
        items,
        currency: 'usd',
        ...(shippingAddress ? { shippingAddress } : {})
      })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Order creation failed');
    }
    return json.data;
  }

  public async createCheckoutSession(
    orderId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId: string; checkoutUrl: string }> {
    const res = await fetch(`${this.baseUrl}/api/v1/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({ orderId, successUrl, cancelUrl })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Checkout failed');
    }
    return json.data;
  }

  public async fetchOrders(): Promise<Order[]> {
    const res = await fetch(`${this.baseUrl}/api/v1/orders/my-orders`, {
      headers: {
        ...this.getAuthHeader()
      }
    });
    const json = await res.json();
    return json.data || [];
  }

  public async fetchOrderById(id: string): Promise<Order> {
    const res = await fetch(`${this.baseUrl}/api/v1/orders/${id}`, {
      headers: {
        ...this.getAuthHeader()
      }
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to fetch order details');
    }
    return json.data;
  }

  public async fetchComparison(productId: string): Promise<PriceComparisonSummary> {
    const res = await fetch(`${this.baseUrl}/api/v1/scraper/compare/${productId}`, {
      cache: 'no-store'
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Failed to fetch price comparison');
    }
    return json.data;
  }

  public async triggerPriceSync(): Promise<{ totalSynced: number }> {
    const res = await fetch(`${this.baseUrl}/api/v1/scraper/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader()
      },
      body: JSON.stringify({ limit: 10 })
    });
    const json = await res.json();
    if (!json.success) {
      throw new Error(json.error?.message || 'Price sync failed');
    }
    return json.data;
  }
}

export const apiClient = new ApiClient();
