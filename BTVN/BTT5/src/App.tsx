import React, { useState, useMemo, useCallback, useDeferredValue, useEffect, useRef, Suspense } from 'react';
import type { Product, FilterState, InventoryStats } from './types';
import { initialProductsDataset, calculateInventoryStats } from './mockData';
import { PerformanceHUD } from './components/PerformanceHUD';
import { StatsBar } from './components/StatsBar';
import { FilterToolbar } from './components/FilterToolbar';
import { ProductListUnoptimized } from './components/ProductListUnoptimized';
import { ProductListOptimized } from './components/ProductListOptimized';

// Code-splitting: Lazy load modal nặng
const LazyAnalyticsModal = React.lazy(() => import('./components/AnalyticsModal'));
const LazyProductDetailModal = React.lazy(() => import('./components/ProductDetailModal'));

import './App.css';

const DEFAULT_FILTER: FilterState = {
  search: '',
  category: 'Tất cả danh mục',
  brand: 'Tất cả thương hiệu',
  minRating: 0,
  stockFilter: 'all',
  sortBy: 'id-asc',
};

export function App() {
  const initialMode = useMemo<'unoptimized' | 'optimized'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlMode = params.get('mode');
      if (urlMode === 'unoptimized') return 'unoptimized';
      if (urlMode === 'optimized') return 'optimized';
    }
    return 'optimized';
  }, []);

  const [mode, setMode] = useState<'unoptimized' | 'optimized'>(initialMode);
  const [products, setProducts] = useState<Product[]>(initialProductsDataset);
  const [filter, setFilter] = useState<FilterState>(DEFAULT_FILTER);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  // Đo thời gian render
  const renderStartTimeRef = useRef(performance.now());
  const [lastRenderTimeMs, setLastRenderTimeMs] = useState(0);

  renderStartTimeRef.current = performance.now();

  const deferredSearch = useDeferredValue(filter.search);
  const effectiveSearch = mode === 'optimized' ? deferredSearch : filter.search;

  useEffect(() => {
    const elapsed = performance.now() - renderStartTimeRef.current;
    setLastRenderTimeMs(elapsed);
  }, [products, filter, mode, effectiveSearch]);

  const handleToggleMode = useCallback((newMode: 'unoptimized' | 'optimized') => {
    setMode(newMode);
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', url.toString());
  }, []);

  const handleFilterChange = useCallback((updated: Partial<FilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  }, []);

  const handleResetFilter = useCallback(() => {
    setFilter(DEFAULT_FILTER);
  }, []);

  const handleUpdateProduct = useCallback((updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSelectedProduct(updated);
  }, []);

  // Filter & Sort Logic
  const filterAndSortLogic = (searchStr: string) => {
    let result = products;

    if (searchStr.trim()) {
      const q = searchStr.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filter.category !== 'Tất cả danh mục') {
      result = result.filter((p) => p.category === filter.category);
    }

    if (filter.brand !== 'Tất cả thương hiệu') {
      result = result.filter((p) => p.brand === filter.brand);
    }

    if (filter.stockFilter === 'in-stock') {
      result = result.filter((p) => p.stock > 0);
    } else if (filter.stockFilter === 'low-stock') {
      result = result.filter((p) => p.stock > 0 && p.stock < 15);
    } else if (filter.stockFilter === 'out-of-stock') {
      result = result.filter((p) => p.stock === 0);
    }

    const sorted = [...result];
    switch (filter.sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'stock-desc':
        sorted.sort((a, b) => b.stock - a.stock);
        break;
      case 'stock-asc':
        sorted.sort((a, b) => a.stock - b.stock);
        break;
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'id-asc':
      default:
        sorted.sort((a, b) => a.id - b.id);
        break;
    }

    return sorted;
  };

  const memoizedFilteredProducts = useMemo(
    () => filterAndSortLogic(effectiveSearch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [products, effectiveSearch, filter.category, filter.brand, filter.stockFilter, filter.sortBy]
  );

  const memoizedStats = useMemo(
    () => calculateInventoryStats(products, false),
    [products]
  );

  const unoptimizedFilteredProducts =
    mode === 'unoptimized' ? filterAndSortLogic(filter.search) : [];
  const unoptimizedStats =
    mode === 'unoptimized' ? calculateInventoryStats(products, true) : null;

  const currentFilteredProducts =
    mode === 'optimized' ? memoizedFilteredProducts : unoptimizedFilteredProducts;
  const currentStats =
    mode === 'optimized' ? memoizedStats : (unoptimizedStats as InventoryStats);

  const handleSelectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleOpenAnalytics = useCallback(() => {
    setIsAnalyticsOpen(true);
  }, []);

  const handleCloseAnalytics = useCallback(() => {
    setIsAnalyticsOpen(false);
  }, []);

  const renderedDomCardsCount =
    mode === 'optimized' ? Math.min(20, currentFilteredProducts.length) : currentFilteredProducts.length;

  return (
    <div className="app-layout">
      <PerformanceHUD
        mode={mode}
        onToggleMode={handleToggleMode}
        renderTimeMs={lastRenderTimeMs}
        renderedDomCount={renderedDomCardsCount}
        totalCount={products.length}
      />

      <header className="app-main-header">
        <div className="header-brand-wrap">
          <div className="app-badge">LTWNC - Tuần 5</div>
          <h1>Quản Lý Hệ Thống 10.000 Sản Phẩm</h1>
          <p className="app-sub-heading">
            Dự án nghiên cứu và đo lường tối ưu hóa hiệu năng ReactJS (Virtualization • Memoization • Code Splitting)
          </p>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-quick-toggle"
            onClick={() => handleToggleMode(mode === 'optimized' ? 'unoptimized' : 'optimized')}
          >
            {mode === 'optimized' ? '🔴 Thử chế độ Chưa tối ưu' : '🟢 Bật chế độ Tối ưu ngay'}
          </button>
        </div>
      </header>

      <StatsBar
        stats={currentStats}
        filteredCount={currentFilteredProducts.length}
        onOpenAnalytics={handleOpenAnalytics}
      />

      <FilterToolbar
        filter={filter}
        onChange={handleFilterChange}
        onReset={handleResetFilter}
        isDeferredSearchActive={mode === 'optimized'}
      />

      <main className="product-display-area">
        {mode === 'unoptimized' ? (
          <ProductListUnoptimized
            products={currentFilteredProducts}
            onSelect={handleSelectProduct}
          />
        ) : (
          <ProductListOptimized
            products={currentFilteredProducts}
            onSelect={handleSelectProduct}
          />
        )}
      </main>

      {selectedProduct && (
        <Suspense fallback={<div className="modal-loading-indicator">Đang tải chi tiết...</div>}>
          <LazyProductDetailModal
            product={selectedProduct}
            onClose={handleCloseDetail}
            onUpdateProduct={handleUpdateProduct}
          />
        </Suspense>
      )}

      {isAnalyticsOpen && (
        <Suspense fallback={<div className="modal-loading-indicator">Đang tải phân tích chuyên sâu...</div>}>
          <LazyAnalyticsModal
            isOpen={isAnalyticsOpen}
            onClose={handleCloseAnalytics}
            stats={currentStats}
            products={products}
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
