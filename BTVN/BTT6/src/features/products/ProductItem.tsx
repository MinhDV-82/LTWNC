import React from 'react';
import type { Product } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { addToCart } from '../cart/cartSlice';

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
        <span className="product-category">{product.category}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>
        <p className="product-desc">{product.description}</p>

        <div className="product-meta">
          <div className="product-price">
            ${product.price.toLocaleString()}
          </div>
          {product.rating && (
            <div className="product-rating">
              ⭐ {product.rating.rate} <span className="rating-count">({product.rating.count})</span>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="btn btn-primary btn-add-cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
};
