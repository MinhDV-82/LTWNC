# BTT5 - Tối Ưu Hiệu Năng React (Quản lý 10.000 Sản phẩm)

Ứng dụng Quản lý Danh mục 10.000 Sản phẩm được xây dựng bằng **React 19**, **TypeScript**, và **Vite**, phục vụ nghiên cứu và thực nghiệm các kỹ thuật tối ưu hóa hiệu năng React chuyên sâu.

---

## 📌 Các Tính Năng Chính
- **Quản lý dữ liệu lớn**: Xử lý mượt mà dataset **10.000 sản phẩm** phong phú (SKU, Tên, Danh mục, Thương hiệu, Giá niêm yết, Đánh giá sao, Tồn kho, Tags).
- **Bộ lọc đa chiều**: Tìm kiếm live search theo tên/SKU/tags, lọc theo danh mục, lọc thương hiệu, lọc trạng thái kho, sắp xếp theo nhiều tiêu chí.
- **Báo cáo thống kê chuyên sâu (Analytics Dashboard)**: Phân tích định giá kho, biểu đồ phân bố danh mục và phân khúc giá.
- **Chế độ so sánh kép trực quan (A/B Testing)**: Chuyển đổi linh hoạt giữa chế độ **Chưa tối ưu (Unoptimized)** và **Đã tối ưu (Optimized)** trực tiếp trên giao diện với thanh Performance HUD hiển thị thời gian render, số lượng thẻ DOM và trạng thái các kỹ thuật.

---

## 🛠️ Các Kỹ Thuật Tối Ưu Đã Áp Dụng

1. **Virtualization (Windowing - Danh sách ảo)**:
   - Thay vì render cả 10.000 card vào DOM (tạo hơn 120.000 node DOM), tự xây dựng custom hook `useVirtualizer` chỉ render **~18 thẻ** hiển thị trên viewport.
   - Giảm hơn **99.8%** kích thước DOM tree, giải phóng hoàn toàn bộ nhớ RAM và CPU.
2. **Memoization (`useMemo`, `React.memo`, `useCallback`)**:
   - `useMemo`: Cache kết quả lọc và tính toán thống kê kho của 10.000 sản phẩm, chỉ tính lại khi bộ lọc hoặc dữ liệu thay đổi.
   - `React.memo`: Bọc `ProductCardMemo` ngăn toàn bộ danh sách re-render không cần thiết khi người dùng gõ tìm kiếm hoặc state cha cập nhật.
   - `useCallback`: Duy trì tính toàn vẹn tham chiếu cho các hàm xử lý sự kiện.
3. **Code-splitting (`React.lazy` + `Suspense`)**:
   - Tách module biểu đồ `AnalyticsModal` và modal chi tiết `ProductDetailModal` thành các chunk riêng biệt tải theo nhu cầu (`AnalyticsModal-*.js`, `ProductDetailModal-*.js`), giảm dung lượng initial bundle.
4. **Concurrent UI (`useDeferredValue`)**:
   - Ưu tiên độ mượt khi gõ phím vào ô tìm kiếm (60 FPS), hoãn việc lọc danh sách 10.000 sản phẩm sang luồng ưu tiên thấp.

---

## 📊 Kết Quả Đo Lường Bằng Lighthouse

Kiểm thử được thực hiện bằng Google Lighthouse CLI (v13.5.0) trên môi trường Production Build (`vite preview`):

| Chỉ số | Trước tối ưu (Unoptimized) | Sau tối ưu (Optimized) | Mức cải thiện |
| :--- | :---: | :---: | :---: |
| **Điểm Performance (Lighthouse)** | **60 / 100** | **100 / 100** | **+40 điểm (Tối đa)** |
| **FCP (First Contentful Paint)** | **0.3 s** | **0.3 s** | **0.4% nhanh hơn** |
| **LCP (Largest Contentful Paint)** | **0.6 s** | **0.3 s** | **48.2% nhanh hơn** |
| **TBT (Total Blocking Time)** | **37,560 ms** | **0 ms** | **Giảm 37,562 ms (-100%)** |
| **CLS (Cumulative Layout Shift)** | **0** | **0** | **0 (Ổn định tuyệt đối)** |
| **Speed Index** | **12.3 s** | **0.3 s** | **97.3% nhanh hơn** |
| **Số lượng thẻ DOM hiển thị** | 10.000 thẻ | ~18 thẻ | Giảm **>99.8%** DOM nodes |

> 📄 Xem phân tích chi tiết tại file [REPORT.md](./REPORT.md) và các file báo cáo HTML trong thư mục `lighthouse-reports/`.

---

## 🚀 Hướng Dẫn Chạy Project

### 1. Cài đặt thư viện
```bash
npm install
```

### 2. Chạy môi trường phát triển (Dev)
```bash
npm run dev
```
Mở trình duyệt tại `http://localhost:5173`. Có thể truy cập:
- `http://localhost:5173/?mode=unoptimized` để trải nghiệm bản chưa tối ưu.
- `http://localhost:5173/?mode=optimized` để trải nghiệm bản đã tối ưu.

### 3. Kiểm tra mã nguồn (Build & Lint)
```bash
npm run build
npm run lint
```

### 4. Tự động chạy đo kiểm Lighthouse
```bash
npm run lighthouse
```
Lệnh này sẽ tự động build, khởi động server preview, chạy Lighthouse trên cả 2 chế độ và xuất kết quả ra màn hình terminal cùng file HTML trong `lighthouse-reports/`.
