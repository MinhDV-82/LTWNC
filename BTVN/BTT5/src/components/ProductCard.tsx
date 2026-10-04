import React from 'react';
import type { Product } from '../types';
import { formatVND } from '../mockData';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  style?: React.CSSProperties;
}

export const ProductCardRaw: React.FC<ProductCardProps> = ({ product, onSelect, style }) => {
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 15;

  return (
    <div className="product-row" style={style}>
      <div className="product-col-id">
        <span className="sku-badge">{product.sku}</span>
      </div>

      <div className="product-col-info">
        <div className="product-name-title">
          <span className="product-brand-tag">{product.brand}</span>
          <strong title={product.name}>{product.name}</strong>
        </div>
        <div className="product-meta-tags">
          <span className="category-pill">{product.category}</span>
          {product.tags.map((tag) => (
            <span key={tag} className="tag-pill">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="product-col-price">
        <div className="current-price">{formatVND(product.price)}</div>
        {product.originalPrice > product.price && (
          <div className="original-price">{formatVND(product.originalPrice)}</div>
        )}
      </div>

      <div className="product-col-stock">
        <span
          className={`stock-badge ${
            isOutOfStock ? 'out-of-stock' : isLowStock ? 'low-stock' : 'in-stock'
          }`}
        >
          {isOutOfStock
            ? 'Hết hàng'
            : isLowStock
            ? `Sắp hết (${product.stock})`
            : `Còn hàng (${product.stock})`}
        </span>
      </div>

      <div className="product-col-rating">
        <span className="star-icon">★</span>
        <span className="rating-value">{product.rating.toFixed(1)}</span>
        <span className="reviews-count">({product.reviewsCount})</span>
      </div>

      <div className="product-col-action">
        <button
          type="button"
          className="btn-view-detail"
          onClick={() => onSelect(product)}
        >
          Chi tiết
        </button>
      </div>
    </div>
  );
};

export const ProductCardMemo = React.memo(
  ProductCardRaw,
  (prevProps, nextProps) =>
    prevProps.product.id === nextProps.product.id &&
    prevProps.product.price === nextProps.product.price &&
    prevProps.product.stock === nextProps.product.stock &&
    prevProps.product.rating === nextProps.product.rating &&
    prevProps.style?.top === nextProps.style?.top
);
