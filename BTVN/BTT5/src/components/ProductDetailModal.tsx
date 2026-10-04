import React from 'react';
import type { Product } from '../types';
import { formatVND } from '../mockData';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onUpdateProduct?: (updated: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onUpdateProduct,
}) => {
  if (!product) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container medium-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="sku-badge">{product.sku}</span>
            <h2 style={{ marginTop: '6px' }}>{product.name}</h2>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Danh mục:</span>
              <strong className="detail-value">{product.category}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Thương hiệu:</span>
              <strong className="detail-value">{product.brand}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Giá niêm yết:</span>
              <strong className="detail-value text-primary">{formatVND(product.price)}</strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Giá gốc:</span>
              <span className="detail-value original-price">{formatVND(product.originalPrice)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tồn kho hiện tại:</span>
              <strong
                className={`detail-value ${
                  product.stock === 0
                    ? 'text-danger'
                    : product.stock < 15
                    ? 'text-warning'
                    : 'text-success'
                }`}
              >
                {product.stock} đơn vị
              </strong>
            </div>
            <div className="detail-item">
              <span className="detail-label">Đánh giá khách hàng:</span>
              <strong className="detail-value text-accent">
                ★ {product.rating} ({product.reviewsCount} lượt đánh giá)
              </strong>
            </div>
          </div>

          <div className="detail-description-box">
            <h4>Mô tả sản phẩm:</h4>
            <p>{product.description}</p>
          </div>

          <div className="detail-tags-box">
            <h4>Thẻ phân loại (Tags):</h4>
            <div className="tags-flex">
              {product.tags.map((tag) => (
                <span key={tag} className="tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              if (onUpdateProduct) {
                onUpdateProduct({ ...product, stock: product.stock + 10 });
              }
              onClose();
            }}
          >
            Nhập thêm 10 sản phẩm vào kho
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
