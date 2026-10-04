import React from 'react';

interface PerformanceHUDProps {
  mode: 'unoptimized' | 'optimized';
  onToggleMode: (newMode: 'unoptimized' | 'optimized') => void;
  renderTimeMs: number;
  renderedDomCount: number;
  totalCount: number;
}

export const PerformanceHUD: React.FC<PerformanceHUDProps> = ({
  mode,
  onToggleMode,
  renderTimeMs,
  renderedDomCount,
  totalCount,
}) => {
  const isOptimized = mode === 'optimized';

  return (
    <div className={`performance-hud ${isOptimized ? 'hud-optimized' : 'hud-unoptimized'}`}>
      <div className="hud-left">
        <div className="hud-mode-pill">
          <span className="hud-pulse-dot" />
          <span className="hud-mode-title">
            {isOptimized ? 'CHẾ ĐỘ ĐÃ TỐI ƯU (OPTIMIZED)' : 'CHẾ ĐỘ CHƯA TỐI ƯU (UNOPTIMIZED)'}
          </span>
        </div>

        <div className="hud-metrics-group">
          <div className="hud-metric-item">
            <span className="metric-label">DOM Cards Rendered:</span>
            <span className={`metric-value ${isOptimized ? 'val-good' : 'val-bad'}`}>
              {renderedDomCount.toLocaleString('vi-VN')} / {totalCount.toLocaleString('vi-VN')}
            </span>
          </div>

          <div className="hud-metric-item">
            <span className="metric-label">Last Render Time:</span>
            <span className={`metric-value ${renderTimeMs < 16 ? 'val-good' : 'val-bad'}`}>
              {renderTimeMs.toFixed(1)} ms
            </span>
          </div>
        </div>
      </div>

      <div className="hud-center-features">
        <div className="feature-indicator">
          <span className={`badge-tech ${isOptimized ? 'tech-on' : 'tech-off'}`}>
            {isOptimized ? '✓' : '✗'} Virtualization
          </span>
          <span className={`badge-tech ${isOptimized ? 'tech-on' : 'tech-off'}`}>
            {isOptimized ? '✓' : '✗'} Memoization
          </span>
          <span className={`badge-tech ${isOptimized ? 'tech-on' : 'tech-off'}`}>
            {isOptimized ? '✓' : '✗'} Code-Splitting
          </span>
          <span className={`badge-tech ${isOptimized ? 'tech-on' : 'tech-off'}`}>
            {isOptimized ? '✓' : '✗'} Deferred Search
          </span>
        </div>
      </div>

      <div className="hud-right">
        <div className="mode-toggle-switch">
          <button
            type="button"
            className={`btn-mode-toggle ${!isOptimized ? 'active-unopt' : ''}`}
            onClick={() => onToggleMode('unoptimized')}
          >
            Chưa tối ưu
          </button>
          <button
            type="button"
            className={`btn-mode-toggle ${isOptimized ? 'active-opt' : ''}`}
            onClick={() => onToggleMode('optimized')}
          >
            Đã tối ưu
          </button>
        </div>
      </div>
    </div>
  );
};
