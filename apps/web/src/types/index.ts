export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface CompetitorPriceRecord {
  id: string;
  competitorName: string;
  competitorUrl: string;
  price: number;
  currency: string;
  differencePercentage: number;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  inventoryCount: number;
  imageUrl: string;
  categoryId: string;
  category?: Category;
  competitorUrl?: string | null;
  competitorPriceRecords?: CompetitorPriceRecord[];
}

export interface PriceComparisonSummary {
  productId: string;
  productName: string;
  ourPrice: number;
  lowestCompetitorPrice: number | null;
  averageCompetitorPrice: number | null;
  differencePercentage: number | null;
  records: CompetitorPriceRecord[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CUSTOMER' | 'ADMIN';
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';
  paymentId?: string;
  paymentProvider: string;
  shippingAddress?: string | null;
  items: OrderItem[];
  createdAt: string;
}
