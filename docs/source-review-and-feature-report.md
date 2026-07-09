# Kruzo Service - Source Review And Feature Report

## Tóm tắt nhanh

- Project là Next.js App Router cho Kruzo Document AI: landing, demo OCR, API playground, docs, pricing, API keys placeholder.
- Frontend hiện chỉ dùng `POST /api/v1/ocr/extract-custom` qua `NEXT_PUBLIC_API_BASE_URL`.
- Endpoint standard OCR cũ đã bị loại khỏi source vì output tự do, không ổn định, không cần cho user workflow.
- API keys, auth, rate limit, advanced options vẫn là placeholder cho backend login/API key sau này.

## Tính năng hiện có

- Landing page: hero, problem, workflow, use cases, how it works, FAQ, audit CTA.
- Demo `/try`: chọn nhiều file, template extraction, custom fields/table, guided tour, processing history.
- Demo `/try`: preview kết quả, xem raw/debug, tải CSV/XLSX từ dữ liệu đã normalize.
- API playground `/try/api`: upload file, nhập `schema_sample`, validate/format JSON, gửi request thật.
- API playground: hiển thị cURL/JavaScript/Python, sample/real response, history, copy response.
- Docs `/docs`: overview, quickstart, params, response schema, error codes, examples cho endpoint duy nhất.
- API keys `/api-keys`: placeholder beta access/key management, chưa thao tác backend.
- SEO: metadata, robots, sitemap, JSON-LD, dark/light theme.

## Cấu trúc sau refactor

- OCR API nằm ở `src/features/ocr/api/*`: config, client, errors, HTTP, contract types.
- OCR preview nằm ở `src/features/ocr/preview/*`: field/table/raw-text normalizers, sample data, preview types.
- OCR export nằm ở `src/features/ocr/export/*`: CSV/XLSX builders.
- Demo Excel tách thêm hook/helper: template state, toasts, downloads, process queue.
- Docs tách shell, data, topic content, primitive UI để dễ chỉnh từng phần.
- `src/lib` hiện chỉ còn shared SEO, không còn chứa API/OCR feature code.

## Đánh giá source code

- Điểm tốt: endpoint duy nhất rõ ràng, không còn helper API dư.
- Điểm tốt: API contract đã có type cụ thể hơn thay vì `Record<string, unknown>` thuần.
- Điểm tốt: normalizer không còn là một file lớn làm mọi nhiệm vụ.
- Điểm tốt: demo upload đã bớt dồn logic vào `useUploadQueue`.
- Rủi ro còn lại: response backend vẫn cần chốt contract ổn định hơn để giảm normalize phòng thủ.
- Rủi ro còn lại: chưa có unit tests cho schema builder, normalize OCR, CSV/XLSX export, error mapping.

## Cần cải thiện UX

- Hiển thị trạng thái cấu hình backend rõ trên `/try` và `/try/api` trước khi user chọn file.
- Cho phép retry từng file failed trong Processing history.
- Có sample file/sample schema để user thử nhanh khi chưa có tài liệu thật.
- Có cancel/stop queue khi upload nhiều file.
- Làm rõ trong UI option nào chỉ future trước khi backend hỗ trợ.

## Tính năng nên thêm sau

- Login đơn giản và session user.
- Backend API key thật: list/create/revoke, quota/rate limit, audit log.
- Server-side proxy cho production để không đặt secret trong client.
- Lưu lịch sử request/extraction theo user/project nếu có auth.
- Export theo template Excel thật của khách hàng, không chỉ CSV/XLSX generic.
- Review workflow: approve field, edit value, mark confidence, export final.

## Ưu tiên đề xuất

- P1: Chốt backend contract cho `fields`, `tables`, `review`.
- P1: Thêm tests cho OCR preview normalizers.
- P2: Thêm login/session rồi nối API key/history.
- P2: Cải thiện retry/cancel/sample UX cho demo.
