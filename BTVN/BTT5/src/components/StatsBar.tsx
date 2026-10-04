import React from 'react';
import type { InventoryStats } from '../types';
import { formatVND } from '../mockData';

interface StatsBarProps {
  stats: InventoryStats;
  filteredCount: number;
  onOpenAnalytics: () => void;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  stats,
  filteredCount,
  onOpenAnalytics,
}) => {
  return (
    <div className="stats-bar-container">
      <div className="stat-card">
        <span className="stat-label">Sản phẩm hiển thị</span>
        <div className="stat-number">
          {filteredCount.toLocaleString('vi-VN')}
          <span className="stat-sub">/ {stats.totalCount.toLocaleString('vi-VN')}</span>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Tổng định giá kho hàng</span>
        <div className="stat-number text-primary">{formatVND(stats.totalValueVND)}</div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Cảnh báo tồn kho</span>
        <div className="stat-number text-danger">
          {(stats.lowStockCount + stats.outOfStockCount).toLocaleString('vi-VN')}
          <span className="stat-sub">({stats.outOfStockCount} hết hàng)</span>
        </div>
      </div>

      <div className="stat-card">
        <span className="stat-label">Đánh giá TB</span>
        <div className="stat-number text-accent">
          ★ {stats.avgRating.toFixed(2)}
          <span className="stat-sub">/ 5.0</span>
        </div>
      </div>

      <div className="stat-action-card">
        <button
          type="button"
          className="btn-open-analytics"
          onClick={onOpenAnalytics}
          title="Mở biểu đồ phân tích chuyên sâu (Lazy Loaded)"
        >
          <span className="icon">📈</span>
          <span>Báo Cáo Phân Tích</span>
        </button>
      </div>
    </div>
  );
};
