import React from 'react';
import type { CartItem as CartItemType } from '../../types';
import { useAppDispatch } from '../../app/hooks';
import { removeFromCart, updateQuantity } from './cartSlice';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const dispatch = useAppDispatch();
  const { product, quantity } = item;

  const handleDecrease = () => {
    dispatch(
      updateQuantity({
        id: product.id,
        quantity: quantity - 1,
      })
    );
  };

  const handleIncrease = () => {
    dispatch(
      updateQuantity({
        id: product.id,
        quantity: quantity + 1,
      })
    );
  };

  const handleChangeQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      dispatch(
        updateQuantity({
          id: product.id,
          quantity: val,
        })
      );
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(product.id));
  };

  const itemTotal = product.price * quantity;

  return (
    <div className="cart-item-row">
      <img
        src={product.image}
        alt={product.title}
        className="cart-item-image"
      />

      <div className="cart-item-details">
        <h4 className="cart-item-title">{product.title}</h4>
        <span className="cart-item-category">{product.category}</span>
        <div className="cart-item-price-unit">${product.price.toLocaleString()} / cái</div>
      </div>

      <div className="cart-item-quantity-controls">
        <button
          onClick={handleDecrease}
          className="qty-btn"
          aria-label="Giảm số lượng"
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleChangeQuantity}
          className="qty-input"
        />
        <button
          onClick={handleIncrease}
          className="qty-btn"
          aria-label="Tăng số lượng"
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        ${itemTotal.toLocaleString()}
      </div>

      <button
        onClick={handleRemove}
        className="btn-remove"
        title="Xoá sản phẩm khỏi giỏ"
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
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
};
