import React from 'react';
import type { FilterState, SortOption, StockFilter } from '../types';
import { CATEGORIES, BRANDS } from '../mockData';

interface FilterToolbarProps {
  filter: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  isDeferredSearchActive?: boolean;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filter,
  onChange,
  onReset,
  isDeferredSearchActive,
}) => {
  return (
    <div className="filter-toolbar-container">
      <div className="filter-field search-field">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo tên sản phẩm, mã SKU, tag..."
          value={filter.search}
          onChange={(e) => onChange({ search: e.target.value })}
        />
        {filter.search && (
          <button
            type="button"
            className="clear-search-btn"
            onClick={() => onChange({ search: '' })}
            title="Xóa tìm kiếm"
          >
            ✕
          </button>
        )}
        {isDeferredSearchActive && (
          <span className="deferred-tag" title="Sử dụng useDeferredValue để ưu tiên mượt mà input">
            ⚡ Deferred
          </span>
        )}
      </div>

      <div className="filter-field">
        <select
          className="filter-select"
          value={filter.category}
          onChange={(e) => onChange({ category: e.target.value })}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <select
          className="filter-select"
          value={filter.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
        >
          {BRANDS.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <select
          className="filter-select"
          value={filter.stockFilter}
          onChange={(e) => onChange({ stockFilter: e.target.value as StockFilter })}
        >
          <option value="all">Kho: Tất cả</option>
          <option value="in-stock">Kho: Còn hàng</option>
          <option value="low-stock">Kho: Sắp hết (&lt;15)</option>
          <option value="out-of-stock">Kho: Hết hàng</option>
        </select>
      </div>

      <div className="filter-field">
        <select
          className="filter-select"
          value={filter.sortBy}
          onChange={(e) => onChange({ sortBy: e.target.value as SortOption })}
        >
          <option value="id-asc">Sắp xếp: Mã ID tăng dần</option>
          <option value="price-asc">Sắp xếp: Giá tăng dần</option>
          <option value="price-desc">Sắp xếp: Giá giảm dần</option>
          <option value="rating-desc">Sắp xếp: Đánh giá cao nhất</option>
          <option value="stock-desc">Sắp xếp: Tồn kho nhiều nhất</option>
          <option value="stock-asc">Sắp xếp: Tồn kho ít nhất</option>
          <option value="name-asc">Sắp xếp: Tên A-Z</option>
        </select>
      </div>

      <div className="filter-action">
        <button type="button" className="btn-reset" onClick={onReset} title="Đặt lại bộ lọc">
          ↺ Đặt lại
        </button>
      </div>
    </div>
  );
};
