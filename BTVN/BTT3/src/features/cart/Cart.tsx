import React from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  clearCart,
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from './cartSlice';
import { CartItem } from './CartItem';

interface CartProps {
  onContinueShopping?: () => void;
}

export const Cart: React.FC<CartProps> = ({ onContinueShopping }) => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const totalPrice = useAppSelector(selectCartTotalPrice);

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xoá toàn bộ giỏ hàng không?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    alert(`🎉 Đặt hàng thành công! Tổng giá trị đơn hàng: $${totalPrice.toLocaleString()}`);
    dispatch(clearCart());
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-card">
        <div className="empty-cart-icon">🛒</div>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p>Hãy thêm các sản phẩm công nghệ yêu thích vào giỏ hàng ngay nhé!</p>
        {onContinueShopping && (
          <button onClick={onContinueShopping} className="btn btn-primary mt-4">
            Khám phá sản phẩm
          </button>
        )}
      </div>
    );
  }

  const shippingFee = 0; // Free shipping
  const finalTotal = totalPrice + shippingFee;

  return (
    <div className="cart-container">
      <div className="cart-items-section">
        <div className="cart-header">
          <div>
            <h2>Giỏ Hàng Của Bạn</h2>
            <p className="cart-subtitle">
              Bạn có <strong>{totalCount}</strong> sản phẩm trong giỏ hàng
            </p>
          </div>
          <button onClick={handleClearCart} className="btn btn-outline-danger">
            Xoá tất cả
          </button>
        </div>

        <div className="cart-items-list">
          {cartItems.map((item) => (
            <CartItem key={item.product.id} item={item} />
          ))}
        </div>
      </div>

      <div className="cart-summary-card">
        <h3 className="summary-title">Tóm Tắt Đơn Hàng</h3>

        <div className="summary-row">
          <span>Tổng số lượng:</span>
          <span className="summary-value">{totalCount} sản phẩm</span>
        </div>

        <div className="summary-row">
          <span>Tạm tính:</span>
          <span className="summary-value">${totalPrice.toLocaleString()}</span>
        </div>

        <div className="summary-row">
          <span>Phí vận chuyển:</span>
          <span className="summary-value text-success">Miễn phí</span>
        </div>

        <div className="summary-divider"></div>

        <div className="summary-row total-row">
          <span>Tổng thanh toán:</span>
          <span className="total-price">${finalTotal.toLocaleString()}</span>
        </div>

        <button onClick={handleCheckout} className="btn btn-success btn-block btn-checkout">
          Tiến hành thanh toán
        </button>

        {onContinueShopping && (
          <button
            onClick={onContinueShopping}
            className="btn btn-outline-secondary btn-block mt-2"
          >
            ← Tiếp tục mua sắm
          </button>
        )}
      </div>
    </div>
  );
};
