import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartItem } from './CartItem';
import { mockCartItem1 } from '../../test/mockData';
import { renderWithProviders } from '../../test/test-utils';

describe('CartItem - Integration Component Tests (RTL)', () => {
  it('hiển thị chi tiết mặt hàng trong giỏ, đơn giá và tổng phụ', () => {
    // mockCartItem1: product price = 1199, quantity = 2 => itemTotal = 2398
    renderWithProviders(<CartItem item={mockCartItem1} />);

    expect(screen.getByText(mockCartItem1.product.title)).toBeInTheDocument();
    expect(screen.getByText(mockCartItem1.product.category)).toBeInTheDocument();
    expect(screen.getByText('$1,199 / cái')).toBeInTheDocument();
    expect(screen.getByText('$2,398')).toBeInTheDocument();

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(2);
  });

  it('nhấn nút "+" để tăng số lượng sản phẩm trong store', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CartItem item={mockCartItem1} />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const incBtn = screen.getByRole('button', { name: /Tăng số lượng/i });
    await user.click(incBtn);

    expect(store.getState().cart.items[0].quantity).toBe(3);
  });

  it('nhấn nút "-" để giảm số lượng sản phẩm trong store', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CartItem item={mockCartItem1} />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const decBtn = screen.getByRole('button', { name: /Giảm số lượng/i });
    await user.click(decBtn);

    expect(store.getState().cart.items[0].quantity).toBe(1);
  });

  it('thay đổi giá trị trực tiếp trên input số lượng', () => {
    const { store } = renderWithProviders(<CartItem item={mockCartItem1} />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '5' } });

    expect(store.getState().cart.items[0].quantity).toBe(5);
  });

  it('nhấn nút xoá để loại bỏ sản phẩm khỏi giỏ hàng', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<CartItem item={mockCartItem1} />, {
      preloadedState: {
        cart: { items: [mockCartItem1] },
      },
    });

    const removeBtn = screen.getByTitle('Xoá sản phẩm khỏi giỏ');
    await user.click(removeBtn);

    expect(store.getState().cart.items).toHaveLength(0);
  });
});
