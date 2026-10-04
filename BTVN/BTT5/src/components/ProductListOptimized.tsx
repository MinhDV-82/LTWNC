import React, { useRef, useCallback } from 'react';
import type { Product } from '../types';
import { ProductCardMemo } from './ProductCard';
import { useVirtualizer } from '../hooks/useVirtualizer';

const ITEM_HEIGHT = 76;

interface ProductListOptimizedProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const ProductListOptimized: React.FC<ProductListOptimizedProps> = ({
  products,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const getScrollElement = useCallback(() => containerRef.current, []);

  const { virtualItems, totalHeight } = useVirtualizer({
    count: products.length,
    itemHeight: ITEM_HEIGHT,
    overscan: 6,
    getScrollElement,
  });

  return (
    <div className="product-list-container optimized-list">
      <div className="list-notice-banner success">
        <span className="notice-icon">⚡</span>
        <div>
          <strong>Chế độ Đã Tối Ưu (Optimized Mode)</strong>: Áp dụng{' '}
          <strong>Virtualization (Windowing)</strong> — Chỉ render khoảng{' '}
          <span className="badge-highlight">{virtualItems.length} thẻ</span> trong viewport thay vì{' '}
          {products.length.toLocaleString('vi-VN')} thẻ! Kết hợp cùng <strong>React.memo</strong> và{' '}
          <strong>useCallback</strong> để loại bỏ hoàn toàn hiện tượng lag khi gõ phím hay cuộn nhanh.
        </div>
      </div>

      <div className="product-table-header">
        <div className="col-header col-id">Mã SKU</div>
        <div className="col-header col-info">Thông tin sản phẩm</div>
        <div className="col-header col-price">Giá niêm yết</div>
        <div className="col-header col-stock">Kho hàng</div>
        <div className="col-header col-rating">Đánh giá</div>
        <div className="col-header col-action">Thao tác</div>
      </div>

      <div
        ref={containerRef}
        className="virtual-scroll-viewport"
        style={{
          height: '620px',
          overflowY: 'auto',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: `${totalHeight}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualItems.map((virtualRow) => {
            const product = products[virtualRow.index];
            if (!product) return null;

            return (
              <ProductCardMemo
                key={product.id}
                product={product}
                onSelect={onSelect}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${ITEM_HEIGHT}px`,
                  transform: `translateY(${virtualRow.offsetTop}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
