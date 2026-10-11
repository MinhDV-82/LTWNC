import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductItem } from './ProductItem';
import { mockProduct1 } from '../../test/mockData';
import { renderWithProviders } from '../../test/test-utils';

describe('ProductItem - Integration Component Tests (RTL)', () => {
  it('hiển thị đầy đủ thông tin sản phẩm (tên, danh mục, giá, mô tả, đánh giá)', () => {
    renderWithProviders(<ProductItem product={mockProduct1} />);

    expect(screen.getByText(mockProduct1.title)).toBeInTheDocument();
    expect(screen.getByText(mockProduct1.category)).toBeInTheDocument();
    expect(screen.getByText(`$${mockProduct1.price.toLocaleString()}`)).toBeInTheDocument();
    expect(screen.getByText(mockProduct1.description)).toBeInTheDocument();
    expect(screen.getByText(/4\.8/)).toBeInTheDocument();
    expect(screen.getByText(/\(240\)/)).toBeInTheDocument();

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', mockProduct1.image);
    expect(img).toHaveAttribute('alt', mockProduct1.title);
  });

  it('hiển thị chính xác sản phẩm không có rating', () => {
    const productWithoutRating = { ...mockProduct1, rating: undefined };
    renderWithProviders(<ProductItem product={productWithoutRating} />);

    expect(screen.queryByText(/⭐/)).not.toBeInTheDocument();
  });

  it('click nút "Thêm vào giỏ" thêm sản phẩm vào Redux store', async () => {
    const user = userEvent.setup();
    const { store } = renderWithProviders(<ProductItem product={mockProduct1} />);

    expect(store.getState().cart.items).toHaveLength(0);

    const addButton = screen.getByRole('button', { name: /Thêm vào giỏ/i });
    await user.click(addButton);

    const cartItems = store.getState().cart.items;
    expect(cartItems).toHaveLength(1);
    expect(cartItems[0].product.id).toBe(mockProduct1.id);
    expect(cartItems[0].quantity).toBe(1);
  });
});

