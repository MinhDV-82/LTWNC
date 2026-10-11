import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchProductsApi, MOCK_PRODUCTS } from './productsApi';

describe('productsApi - Unit Tests', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetchProductsApi resolve danh sách MOCK_PRODUCTS sau 700ms', async () => {
    vi.useFakeTimers();
    const fetchPromise = fetchProductsApi();

    vi.advanceTimersByTime(700);
    const result = await fetchPromise;

    expect(result).toEqual(MOCK_PRODUCTS);
    expect(result.length).toBeGreaterThan(0);
  });
});

