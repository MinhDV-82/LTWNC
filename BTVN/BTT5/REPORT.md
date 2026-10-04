# BÁO CÁO TỐI ƯU HIỆU NĂNG REACTJS (BTT5 - LTWNC)

**Học phần:** Lập trình Web Nâng Cao  
**Đề tài:** Tối ưu hóa hiệu năng ứng dụng Quản lý 10.000 Sản phẩm (ReactJS Performance Optimization)  
**Công cụ kiểm thử:** Google Lighthouse (Chrome Trace Engine & Lantern Audit), Vite 8, React 19

---

## 1. Đặt vấn đề và Mục tiêu

Trong các ứng dụng web quản lý dữ liệu lớn (ERP, CRM, E-commerce Admin Dashboard), việc hiển thị danh sách lớn từ hàng nghìn đến hàng chục nghìn bản ghi thường xuyên dẫn đến các vấn đề nghiêm trọng về hiệu năng:
- **Hiện tượng giật lag (Jank/FPS drop)** khi cuộn trang hoặc gõ phím tìm kiếm.
- **Thời gian khóa luồng chính (Total Blocking Time - TBT)** tăng vọt do trình duyệt phải xử lý quá nhiều DOM node và tính toán layout/re-flow liên tục.
- **Tiêu tốn bộ nhớ RAM** của thiết bị người dùng.
- **Thời gian tải và đánh giá script (Bundle size & Script Evaluation)** ban đầu chậm chạp.

**Mục tiêu bài tập:**
1. Xây dựng trang quản trị danh mục sản phẩm gồm **10.000 sản phẩm**.
2. Thiết lập cơ chế kiểm thử thực nghiệm bằng **Lighthouse** trước và sau tối ưu.
3. Áp dụng các kỹ thuật cốt lõi: **Virtualization (Windowing)**, **Memoization (`useMemo`, `React.memo`, `useCallback`)**, **Code-splitting (`React.lazy` + `Suspense`)** và **`useDeferredValue`**.
4. Đo đạc và đối chiếu các chỉ số Core Web Vitals chuẩn mực: **FCP, LCP, TBT, CLS, Speed Index**.

---

## 2. Thiết kế Ứng dụng & Vấn đề trước tối ưu (Unoptimized State)

Ứng dụng quản lý danh mục gồm đúng **10.000 sản phẩm** phong phú (Mã SKU, Tên, Danh mục, Thương hiệu, Đơn giá, Giá gốc, Đánh giá sao, Số lượng tồn kho, Thẻ phân loại tags, Mô tả).

Người dùng có thể:
- Lọc theo từ khóa tìm kiếm (Tên, SKU, Tags).
- Lọc theo Danh mục sản phẩm (8 danh mục).
- Lọc theo Thương hiệu sản xuất (12 thương hiệu).
- Lọc theo trạng thái kho (Còn hàng, Sắp hết, Hết hàng).
- Sắp xếp (Theo giá, đánh giá, tồn kho, tên, ID).
- Mở xem biểu đồ thống kê chuyên sâu (Analytics Dashboard).
- Mở xem và cập nhật chi tiết sản phẩm (Product Detail Modal).

### Các nguyên nhân gây nghẽn hiệu năng ở phiên bản Chưa tối ưu:
1. **Bùng nổ số lượng DOM Node (DOM Explosion - Không có Virtualization)**:
   - Toàn bộ 10.000 thẻ sản phẩm được render đồng thời vào cây DOM thông qua `products.map(...)`.
   - Mỗi sản phẩm gồm nhiều phần tử con (SKU badge, title, category pill, tags, price, stock status badge, star rating, action button), tạo ra hơn **120.000 node DOM**.
   - Cây DOM quá lớn làm trình duyệt tiêu tốn hàng gigabyte RAM, quá trình tính toán Recalculate Style, Layout và Composite làm luồng chính bị nghẽn trong hơn **37 giây**.
2. **Lãng phí CPU do thiếu Memoization (`useMemo`)**:
   - Toàn bộ logic lọc 10.000 phần tử và thuật toán phân tích thống kê (tính tổng định giá kho, phân bố nhóm, giá trung bình) bị tính toán lại từ đầu trên mỗi lần render.
3. **Re-render liên tục trên mọi tương tác (Không có `React.memo` & `useCallback`)**:
   - Khi người dùng gõ dù chỉ 1 ký tự vào ô tìm kiếm, component cha re-render và tạo ra các hàm callback inline mới (`onClick={() => onSelect(product)}`).
   - Vì không bọc `React.memo`, cả **10.000 component con đều bị re-render đồng loạt**, làm input bị đứng hình (Laggy typing experience).
4. **Bundle phình to do thiếu Code-splitting**:
   - Toàn bộ module phân tích biểu đồ nâng cao (`AnalyticsModal`) và modal chi tiết được import tĩnh trực tiếp vào bundle chính, làm chậm quá trình tải về và phân tích cú pháp script.

---

## 3. Các Giải pháp Kỹ thuật Đã Áp Dụng

### 3.1. Virtualization (Windowing - Danh sách ảo hóa)
- **Cơ chế**: Thay vì gắn cả 10.000 node vào cây DOM, kỹ thuật Virtualization chỉ render các phần tử nằm trong khung nhìn hiển thị thực tế (viewport) của người dùng (chỉ khoảng **15 - 20 phần tử DOM**).
- **Triển khai**: Xây dựng Custom Hook `useVirtualizer`:
  - Lắng nghe sự kiện `scroll` và `resize` thông qua `ResizeObserver` kết hợp cùng `requestAnimationFrame`.
  - Dựa trên chiều cao dòng cố định (`itemHeight = 76px`), tính toán chính xác `startIndex` và `endIndex` kèm vùng đệm `overscan`:
    $$\text{startIndex} = \max\left(0, \left\lfloor\frac{\text{scrollTop}}{\text{itemHeight}}\right\rfloor - \text{overscan}\right)$$
    $$\text{endIndex} = \min\left(N - 1, \left\lfloor\frac{\text{scrollTop} + \text{containerHeight}}{\text{itemHeight}}\right\rfloor + \text{overscan}\right)$$
  - Tạo một thẻ container giả lập chiều cao tổng thể $\text{totalHeight} = N \times \text{itemHeight}$ để thanh cuộn trình duyệt vẫn hoạt động hoàn hảo và mượt mà theo đúng tỷ lệ 10.000 sản phẩm.
- **Kết quả**: Số lượng DOM node giảm từ hơn **120.000 nodes** xuống còn khoảng **200 nodes** (giảm hơn 99.8% gánh nặng render).

### 3.2. Memoization (`useMemo`, `React.memo`, `useCallback`)
- **`useMemo`**:
  - Đóng gói toàn bộ thuật toán lọc, tìm kiếm, phân loại và sắp xếp 10.000 sản phẩm:
    ```tsx
    const memoizedFilteredProducts = useMemo(
      () => filterAndSortLogic(effectiveSearch),
      [products, effectiveSearch, filter.category, filter.brand, filter.stockFilter, filter.sortBy]
    );
    ```
  - Đóng gói hàm tính toán thống kê số liệu kho hàng:
    ```tsx
    const memoizedStats = useMemo(
      () => calculateInventoryStats(products, false),
      [products]
    );
    ```
  - Kết quả: Khi component cha re-render vì các lý do khác (như mở modal, đếm thời gian render), các phép toán tốn kém này không bị lặp lại.
- **`React.memo`**:
  - Bọc thẻ hiển thị sản phẩm `ProductCardMemo` với hàm so sánh props tùy biến:
    ```tsx
    export const ProductCardMemo = React.memo(ProductCardRaw, (prevProps, nextProps) =>
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.price === nextProps.product.price &&
      prevProps.product.stock === nextProps.product.stock &&
      prevProps.product.rating === nextProps.product.rating &&
      prevProps.style?.top === nextProps.style?.top
    );
    ```
  - Chỉ những thẻ có vị trí hoặc thuộc tính thay đổi mới được render lại.
- **`useCallback`**:
  - Cố định địa chỉ tham chiếu của các handler truyền xuống components con (`handleSelectProduct`, `handleFilterChange`, `handleResetFilter`, `getScrollElement`), tránh làm vô hiệu hóa bộ nhớ đệm của `React.memo`.

### 3.3. Code-splitting & Dynamic Import (`React.lazy` + `Suspense`)
- Tách riêng component phân tích biểu đồ chuyên sâu `AnalyticsModal` và `ProductDetailModal` thành các chunk JavaScript độc lập:
  ```tsx
  const LazyAnalyticsModal = React.lazy(() => import('./components/AnalyticsModal'));
  const LazyProductDetailModal = React.lazy(() => import('./components/ProductDetailModal'));
  ```
- Kết quả từ Vite production build:
  - `dist/assets/index-*.js`: Chỉ chứa code cốt lõi ban đầu (~242 kB).
  - `dist/assets/AnalyticsModal-*.js`: 4.78 kB (tách riêng).
  - `dist/assets/ProductDetailModal-*.js`: 2.84 kB (tách riêng).
- Các chunk này chỉ được tải qua mạng khi người dùng thực sự bấm nút "Báo Cáo Phân Tích" hoặc xem "Chi tiết".

### 3.4. Kỹ thuật Bổ trợ: Concurrent UI với `useDeferredValue`
- Áp dụng `useDeferredValue` cho giá trị ô tìm kiếm:
  ```tsx
  const deferredSearch = useDeferredValue(filter.search);
  const effectiveSearch = mode === 'optimized' ? deferredSearch : filter.search;
  ```
- Giúp tách độ ưu tiên: việc gõ phím của người dùng được cập nhật ngay lập tức (High priority, 60 FPS), trong khi tác vụ lọc và tính toán lại danh sách được hoãn lại cho luồng ưu tiên thấp (Low priority), loại bỏ hiện tượng giật đơ bàn phím.

---

## 4. Kết Quả Đo Lường Thực Tế Bằng Lighthouse

Kiểm thử được tiến hành tự động trên bản **Production Build** (`vite preview`, port 4173) thông qua Google Lighthouse CLI (phiên bản 13.5.0) kết hợp Chrome Testing Engine (v153.0) ở chế độ Desktop.

### Bảng Đối Chiếu Chỉ Số Chi Tiết:

| Chỉ số hiệu năng (Metrics) | Trước tối ưu (Unoptimized) | Sau tối ưu (Optimized) | Mức độ cải thiện | Trạng thái |
| :--- | :---: | :---: | :---: | :---: |
| **Điểm Performance (Lighthouse)** | **60 / 100** | **100 / 100** | **+40 điểm** | 🟢 Đạt điểm tuyệt đối |
| **FCP (First Contentful Paint)** | **0.3 s** | **0.3 s** | **0.4% nhanh hơn** | 🟢 Xuất sắc (&lt; 0.9s) |
| **LCP (Largest Contentful Paint)** | **0.6 s** | **0.3 s** | **48.2% nhanh hơn** | 🟢 Xuất sắc (&lt; 1.2s) |
| **TBT (Total Blocking Time)** | **37,560 ms** | **0 ms** | **Giảm 37,562 ms (-100%)** | 🟢 Triệt tiêu hoàn toàn |
| **CLS (Cumulative Layout Shift)** | **0.000** | **0.000** | **0 (Ổn định tuyệt đối)** | 🟢 Hoàn hảo |
| **Speed Index** | **12.3 s** | **0.3 s** | **97.3% nhanh hơn** | 🟢 Tức thì |
| **Số lượng thẻ DOM hiển thị** | **10.000 thẻ** (~120.000 nodes) | **~18 thẻ** (~200 nodes) | **Giảm 99.8% DOM nodes** | 🟢 Tối ưu triệt để |
| **Trải nghiệm gõ phím tìm kiếm** | Lag, khựng đơ luồng | Mượt mà 60 FPS | Loại bỏ hoàn toàn drop FPS | 🟢 Phản hồi tức thì |

---

## 5. Phân Tích Kết Quả & Đánh Giá

1. **Về chỉ số TBT (Total Blocking Time)**:
   - Sự sụt giảm ngoạn mục từ **37,560 ms** xuống còn **0 ms** là minh chứng rõ ràng nhất cho hiệu quả của **Virtualization**. Trước khi tối ưu, trình duyệt phải khởi tạo 10.000 instance phần tử React, chuyển đổi thành 120.000 node DOM thực tế và thực hiện layout reflow, khiến CPU bị chiếm dụng hoàn toàn trong hơn 37 giây. Sau khi áp dụng Virtualization, chỉ có ~18 node DOM được gắn, CPU hoàn toàn nhàn rỗi và giải phóng luồng chính ngay lập tức.
2. **Về chỉ số LCP & Speed Index**:
   - Speed Index giảm từ **12.3 s** xuống chỉ còn **0.3 s** (nhanh gấp hơn 40 lần) bởi vì trình duyệt chỉ mất vài mili-giây để vẽ xong toàn bộ nội dung trong tầm mắt của người dùng.
3. **Về tính ổn định Layout (CLS)**:
   - Cả 2 phiên bản đều duy trì CLS ở mức 0 tuyệt đối nhờ việc gán kích thước cố định, dự trữ sẵn chiều cao danh sách cuộn ảo `totalHeight` thông qua placeholder container.
4. **Về trải nghiệm người dùng tương tác**:
   - Khi gõ tìm kiếm trên danh sách 10.000 sản phẩm, sự kết hợp giữa `useDeferredValue`, `useMemo` và `React.memo` giúp input luôn phản hồi mượt mà không có độ trễ perceptible.

---

## 6. Hướng Dẫn Chạy và Tái Hiện Kiểm Thử

### Cài đặt dependencies:
```bash
cd BTVN/BTT5
npm install
```

### Chạy môi trường phát triển:
```bash
npm run dev
```
Truy cập `http://localhost:5173`. Có thể chuyển đổi qua lại giữa 2 chế độ bằng thanh gạt trên HUD hoặc query param `?mode=unoptimized` và `?mode=optimized`.

### Chạy kiểm tra chất lượng mã nguồn:
```bash
npm run build
npm run lint
```

### Tự động chạy đo kiểm Lighthouse:
```bash
npm run lighthouse
```
Script sẽ tự động build production, khởi chạy preview server, tiến hành đo kiểm Lighthouse cho cả 2 chế độ và xuất báo cáo ra thư mục `lighthouse-reports/`:
- `unoptimized.report.html`: Báo cáo chi tiết bản trước tối ưu (60 điểm, TBT 37.5s).
- `optimized.report.html`: Báo cáo chi tiết bản sau tối ưu (100 điểm, TBT 0ms).
- `summary.json`: Dữ liệu số liệu đối chiếu định dạng JSON.
