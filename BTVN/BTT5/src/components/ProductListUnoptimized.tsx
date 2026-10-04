import React from 'react';
import type { Product } from '../types';
import { ProductCardRaw } from './ProductCard';

interface ProductListUnoptimizedProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

export const ProductListUnoptimized: React.FC<ProductListUnoptimizedProps> = ({
  products,
  onSelect,
}) => {
  return (
    <div className="product-list-container unoptimized-list">
      <div className="list-notice-banner warning">
        <span className="notice-icon">⚠️</span>
        <div>
          <strong>Chế độ Chưa Tối Ưu (Unoptimized Mode)</strong>: Đang render toàn bộ{' '}
          <span className="badge-highlight">{products.length.toLocaleString('vi-VN')}</span> thẻ sản
          phẩm trực tiếp vào DOM cùng một lúc. Không sử dụng Virtualization, không sử dụng
          React.memo! Hãy thử cuộn trang hoặc gõ tìm kiếm để cảm nhận độ trễ (FPS drop).
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

      <div className="unoptimized-scroll-wrapper">
        {products.map((product) => (
          <ProductCardRaw
            key={product.id}
            product={product}
            onSelect={() => onSelect(product)}
          />
        ))}
      </div>
    </div>
  );
};
