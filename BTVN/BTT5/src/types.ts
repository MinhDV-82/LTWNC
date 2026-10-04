export interface Product {
  id: number;
  sku: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  tags: string[];
  description: string;
  updatedAt: string;
}

export type SortOption =
  | 'id-asc'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'stock-asc'
  | 'stock-desc'
  | 'name-asc';

export type StockFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minRating: number;
  stockFilter: StockFilter;
  sortBy: SortOption;
}

export interface InventoryStats {
  totalCount: number;
  totalStockUnits: number;
  totalValueVND: number;
  avgPriceVND: number;
  avgRating: number;
  lowStockCount: number;
  outOfStockCount: number;
  categoryCounts: Record<string, number>;
}
