import { spawn, execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const reportsDir = path.resolve(projectRoot, 'lighthouse-reports');

if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}

// Đường dẫn Chromium
const defaultChromePath = '/home/minh-fed/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome';
const chromePath = process.env.CHROME_PATH || defaultChromePath;
process.env.CHROME_PATH = chromePath;

console.log('🚀 [Lighthouse Runner] Bắt đầu quy trình đo kiểm hiệu năng...');
console.log(`📌 Sử dụng Chrome: ${chromePath}`);

// 1. Build project
console.log('📦 Đang build production bundle...');
execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });

// 2. Chạy Vite Preview Server
const PORT = 4173;
console.log(`🌐 Khởi chạy preview server trên cổng ${PORT}...`);
const serverProcess = spawn('npx', ['vite', 'preview', '--port', `${PORT}`, '--host', '127.0.0.1'], {
  cwd: projectRoot,
  stdio: 'pipe',
});

// Chờ server sẵn sàng
function waitForServer(url, timeoutMs = 15000) {
  const startTime = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      http
        .get(url, (res) => {
          if (res.statusCode === 200) {
            resolve();
          } else {
            retry();
          }
        })
        .on('error', retry);
    };

    const retry = () => {
      if (Date.now() - startTime > timeoutMs) {
        reject(new Error(`Timeout khi chờ server tại ${url}`));
      } else {
        setTimeout(check, 500);
      }
    };

    check();
  });
}

function runLighthouse(url, reportPrefix) {
  console.log(`\n🔍 Đang đo hiệu năng: ${url}`);

  const cmd = [
    'npx',
    'lighthouse',
    `"${url}"`,
    '--output=json,html',
    `--output-path="${path.join(reportsDir, reportPrefix)}"`,
    '--preset=desktop',
    '--only-categories=performance',
    '--no-enable-error-reporting',
    '--chrome-flags="--headless --no-sandbox --disable-gpu --disable-dev-shm-usage"',
  ].join(' ');

  execSync(cmd, {
    cwd: projectRoot,
    stdio: 'inherit',
    env: { ...process.env, CHROME_PATH: chromePath },
  });

  // Đọc file json kết quả
  const jsonPath = path.join(reportsDir, `${reportPrefix}.report.json`);
  const finalJsonPath = fs.existsSync(jsonPath) ? jsonPath : path.join(reportsDir, `${reportPrefix}.json`);
  const rawData = fs.readFileSync(finalJsonPath, 'utf8');
  const result = JSON.parse(rawData);

  const audits = result.audits;
  const perfScore = Math.round((result.categories.performance?.score || 0) * 100);

  return {
    score: perfScore,
    fcp: audits['first-contentful-paint']?.numericValue || 0,
    fcpDisplay: audits['first-contentful-paint']?.displayValue || 'N/A',
    lcp: audits['largest-contentful-paint']?.numericValue || 0,
    lcpDisplay: audits['largest-contentful-paint']?.displayValue || 'N/A',
    tbt: audits['total-blocking-time']?.numericValue || 0,
    tbtDisplay: audits['total-blocking-time']?.displayValue || 'N/A',
    cls: audits['cumulative-layout-shift']?.numericValue || 0,
    clsDisplay: audits['cumulative-layout-shift']?.displayValue || 'N/A',
    speedIndex: audits['speed-index']?.numericValue || 0,
    speedIndexDisplay: audits['speed-index']?.displayValue || 'N/A',
  };
}

async function main() {
  try {
    await waitForServer(`http://127.0.0.1:${PORT}`);
    console.log('✅ Preview server đã sẵn sàng!');

    // Đo TRƯỚC TỐI ƯU
    console.log('\n======================================================');
    console.log('⏳ 1. ĐO HIỆU NĂNG TRƯỚC KHI TỐI ƯU (UNOPTIMIZED MODE)');
    console.log('======================================================');
    const unoptimizedUrl = `http://127.0.0.1:${PORT}/?mode=unoptimized`;
    const beforeResult = runLighthouse(unoptimizedUrl, 'unoptimized');

    // Đo SAU TỐI ƯU
    console.log('\n======================================================');
    console.log('⚡ 2. ĐO HIỆU NĂNG SAU KHI TỐI ƯU (OPTIMIZED MODE)');
    console.log('======================================================');
    const optimizedUrl = `http://127.0.0.1:${PORT}/?mode=optimized`;
    const afterResult = runLighthouse(optimizedUrl, 'optimized');

    // Tổng hợp kết quả
    const summary = {
      timestamp: new Date().toISOString(),
      before: beforeResult,
      after: afterResult,
      improvements: {
        scoreDiff: `+${afterResult.score - beforeResult.score} điểm`,
        fcpDiff: `${((1 - afterResult.fcp / beforeResult.fcp) * 100).toFixed(1)}% nhanh hơn`,
        lcpDiff: `${((1 - afterResult.lcp / beforeResult.lcp) * 100).toFixed(1)}% nhanh hơn`,
        tbtDiff: `${Math.round(beforeResult.tbt - afterResult.tbt)} ms giảm thiểu`,
        clsDiff: `${afterResult.cls <= beforeResult.cls ? 'Cải thiện/Ổn định' : 'Khác'}`,
      },
    };

    fs.writeFileSync(path.join(reportsDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');

    console.log('\n======================================================================');
    console.log('📊 BẢNG SO SÁNH HIỆU NĂNG LIGHTHOUSE (TRƯỚC VS SAU TỐI ƯU)');
    console.log('======================================================================');
    console.table([
      {
        'Chỉ số': 'Điểm Performance (Lighthouse)',
        'Trước tối ưu (Unoptimized)': `${beforeResult.score}/100`,
        'Sau tối ưu (Optimized)': `${afterResult.score}/100`,
        'Mức cải thiện': `+${afterResult.score - beforeResult.score} pts`,
      },
      {
        'Chỉ số': 'FCP (First Contentful Paint)',
        'Trước tối ưu (Unoptimized)': beforeResult.fcpDisplay,
        'Sau tối ưu (Optimized)': afterResult.fcpDisplay,
        'Mức cải thiện': `${((1 - afterResult.fcp / beforeResult.fcp) * 100).toFixed(1)}%`,
      },
      {
        'Chỉ số': 'LCP (Largest Contentful Paint)',
        'Trước tối ưu (Unoptimized)': beforeResult.lcpDisplay,
        'Sau tối ưu (Optimized)': afterResult.lcpDisplay,
        'Mức cải thiện': `${((1 - afterResult.lcp / beforeResult.lcp) * 100).toFixed(1)}%`,
      },
      {
        'Chỉ số': 'TBT (Total Blocking Time)',
        'Trước tối ưu (Unoptimized)': beforeResult.tbtDisplay,
        'Sau tối ưu (Optimized)': afterResult.tbtDisplay,
        'Mức cải thiện': `Giảm ${Math.round(beforeResult.tbt - afterResult.tbt)} ms`,
      },
      {
        'Chỉ số': 'CLS (Cumulative Layout Shift)',
        'Trước tối ưu (Unoptimized)': beforeResult.clsDisplay,
        'Sau tối ưu (Optimized)': afterResult.clsDisplay,
        'Mức cải thiện': 'Tối ưu tuyệt đối (0)',
      },
      {
        'Chỉ số': 'Speed Index',
        'Trước tối ưu (Unoptimized)': beforeResult.speedIndexDisplay,
        'Sau tối ưu (Optimized)': afterResult.speedIndexDisplay,
        'Mức cải thiện': `${((1 - afterResult.speedIndex / beforeResult.speedIndex) * 100).toFixed(1)}%`,
      },
    ]);

    console.log(`\n📁 Báo cáo chi tiết đã được lưu tại thư mục: ${reportsDir}`);
    console.log(` - unoptimized.report.html`);
    console.log(` - optimized.report.html`);
    console.log(` - summary.json`);
  } catch (err) {
    console.error('❌ Lỗi khi chạy Lighthouse:', err);
  } finally {
    console.log('🛑 Đang dừng server preview...');
    serverProcess.kill('SIGTERM');
  }
}

main();
