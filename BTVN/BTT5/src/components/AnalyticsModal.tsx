import React from 'react';
import type { InventoryStats, Product } from '../types';
import { formatVND } from '../mockData';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: InventoryStats;
  products: Product[];
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  isOpen,
  onClose,
  stats,
  products,
}) => {
  if (!isOpen) return null;

  const topCategories = Object.entries(stats.categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  const maxCatCount = Math.max(...topCategories.map((c) => c[1]), 1);

  const priceRanges = [
    { label: '< 1 triệu', count: products.filter((p) => p.price < 1000000).length },
    {
      label: '1 - 5 triệu',
      count: products.filter((p) => p.price >= 1000000 && p.price < 5000000).length,
    },
    {
      label: '5 - 15 triệu',
      count: products.filter((p) => p.price >= 5000000 && p.price < 15000000).length,
    },
    {
      label: '15 - 30 triệu',
      count: products.filter((p) => p.price >= 15000000 && p.price < 30000000).length,
    },
    { label: '> 30 triệu', count: products.filter((p) => p.price >= 30000000).length },
  ];

  const maxPriceCount = Math.max(...priceRanges.map((r) => r.count), 1);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container large-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>📊 Báo Cáo Phân Tích Chuyên Sâu Kho Hàng</h2>
            <p className="modal-subtitle">
              Module phân tích thống kê nâng cao (Được tối ưu tải theo nhu cầu bằng React.lazy)
            </p>
          </div>
          <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </div>

        <div className="modal-body">
          <div className="analytics-kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Tổng định giá kho hàng</span>
              <span className="kpi-value text-primary">{formatVND(stats.totalValueVND)}</span>
              <span className="kpi-sub">Dựa trên {stats.totalStockUnits.toLocaleString()} đơn vị</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Giá bán trung bình (AOV)</span>
              <span className="kpi-value">{formatVND(stats.avgPriceVND)}</span>
              <span className="kpi-sub">Mỗi sản phẩm</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Điểm đánh giá trung bình</span>
              <span className="kpi-value text-accent">★ {stats.avgRating.toFixed(2)} / 5.0</span>
              <span className="kpi-sub">Từ {stats.totalCount} mẫu</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Tồn kho cần cảnh báo</span>
              <span className="kpi-value text-danger">
                {stats.lowStockCount + stats.outOfStockCount} SP
              </span>
              <span className="kpi-sub">
                {stats.outOfStockCount} hết hàng, {stats.lowStockCount} sắp hết
              </span>
            </div>
          </div>

          <div className="charts-grid">
            <div className="chart-box">
              <h3>📦 Phân bố sản phẩm theo Danh mục</h3>
              <div className="bar-chart-vertical">
                {topCategories.map(([category, count]) => {
                  const pct = Math.round((count / maxCatCount) * 100);
                  return (
                    <div key={category} className="chart-bar-row">
                      <span className="bar-label">{category}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill category-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="bar-value">{count.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="chart-box">
              <h3>💰 Phân khúc giá sản phẩm</h3>
              <div className="bar-chart-vertical">
                {priceRanges.map((range) => {
                  const pct = Math.round((range.count / maxPriceCount) * 100);
                  return (
                    <div key={range.label} className="chart-bar-row">
                      <span className="bar-label">{range.label}</span>
                      <div className="bar-track">
                        <div
                          className="bar-fill price-fill"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="bar-value">{range.count.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="analytics-insights-card">
            <h4>💡 Đánh giá hiệu năng tải trang (Code Splitting):</h4>
            <p>
              Component <code>AnalyticsModal</code> chứa nhiều thuật toán thống kê và biểu đồ phức
              tạp. Bằng việc áp dụng <strong>Code-splitting (React.lazy + dynamic import)</strong>,
              toàn bộ mã nguồn của modal này chỉ được trình duyệt tải về khi người dùng thực sự bấm
              vào nút xem báo cáo, giảm đáng kể kích thước gói JS khởi đầu (Initial JS Bundle size),
              giúp giảm <strong>TBT</strong> và đẩy nhanh thời gian <strong>LCP</strong>.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Đóng báo cáo
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;
