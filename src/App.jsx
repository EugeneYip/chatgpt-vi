import React, { useMemo, useState, useCallback } from "react";

/* ─────────────────────────────────────────────
   HỆ THỐNG BIỂU TƯỢNG SVG NỘI TUYẾN (không dùng lucide-react)
   viewBox 24x24, dạng nét vẽ, độ dày nét 2px
   ───────────────────────────────────────────── */
const ICON_PATHS = {
  bookOpen: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
  brain: "M9.5 2a3.5 3.5 0 0 0-3 5.1A3.5 3.5 0 0 0 5 10.5 3.5 3.5 0 0 0 6 14a3.5 3.5 0 0 0 2.8 4A3.5 3.5 0 0 0 12 21a3.5 3.5 0 0 0 3.2-3 3.5 3.5 0 0 0 2.8-4 3.5 3.5 0 0 0 1-3.5 3.5 3.5 0 0 0-1.5-3.4A3.5 3.5 0 0 0 14.5 2 3.5 3.5 0 0 0 12 3.5 3.5 3.5 0 0 0 9.5 2zM12 3.5v17.5",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
  globe: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  folderOpen: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2zM2 10h20",
  settings: "M12 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  settingsGear: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  bot: "M12 8V4H8M8 2h8M2 14a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zM9 16h.01M15 16h.01",
  penTool: "M12 19l7-7 3 3-7 7zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18z M2 2l7.586 7.586M11 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  checkCircle: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9 12l2 2 4-4",
  sparkles: "M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM19 14l.75 2.25L22 17l-2.25.75L19 20l-.75-2.25L16 17l2.25-.75z",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
  imagePlus: "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M21 15l-5-5L5 21",
  fileText: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  panelsTopLeft: "M3 3h18a0 0 0 0 1 0 0v18a0 0 0 0 1 0 0H3a0 0 0 0 1 0 0V3zM3 9h18M9 21V9",
  workflow: "M3 3h4v4H3zM17 3h4v4h-4zM10 17h4v4h-4zM5 7v3a4 4 0 0 0 4 4h2M19 7v3a4 4 0 0 1-4 4h-2",
  laptop: "M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9M2 20h20M12 16v4",
  wrench: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  compass: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36z",
  arrowRight: "M5 12h14M12 5l7 7-7 7",
  refreshCcw: "M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15",
  link2: "M9 17H7a5 5 0 0 1 0-10h2M15 7h2a5 5 0 0 1 0 10h-2M8 12h8",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  headphones: "M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z",
  table2: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  layoutGrid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  school: "M22 10v6M2 10l10-5 10 5-10 5zM6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5",
  share2: "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98",
  lightbulb: "M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z",
  chevronDown: "M6 9l6 6 6-6",
  alertTriangle: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",
  eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  layers: "M12 2l10 6.5v7L12 22 2 15.5v-7zM2 8.5l10 6.5 10-6.5M12 22V15",
  messageSquare: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  database: "M12 8c4.97 0 9-1.34 9-3s-4.03-3-9-3-9 1.34-9 3 4.03 3 9 3zM21 12c0 1.66-4.03 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5",
};

function Ico({ name, className = "", style = {} }) {
  const d = ICON_PATHS[name];
  if (!d) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d={d} />
    </svg>
  );
}

/* ─────────────────────────────────────────────
   PHÔNG CHỮ + KIỂU TOÀN CỤC
   ───────────────────────────────────────────── */
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,700;1,9..144,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
    .ff-display { font-family: 'Fraunces', Georgia, serif; }
    .ff-body { font-family: 'DM Sans', system-ui, sans-serif; }
    .ff-mono { font-family: 'JetBrains Mono', monospace; }
    * { font-family: 'DM Sans', system-ui, sans-serif; }
    .clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  `}</style>
);

/* ─────────────────────────────────────────────
   MÀU SẮC
   ───────────────────────────────────────────── */
const C = {
  cream: "#FAF8F4", creamDark: "#F0EDE6", ink: "#1A1A1A", inkLight: "#6B6B6B",
  inkMuted: "#9B9B9B", border: "#E2DFD8", borderLight: "#ECEAE4",
  greenDeep: "#0A3D2E", greenMid: "#10a37f", greenLight: "#E8F5EE", roseAccent: "#E11D48",
};

/* ─────────────────────────────────────────────
   DỮ LIỆU
   ───────────────────────────────────────────── */
const VERIFIED_DATE = "12 tháng 3, 2026";
const LEVELS = [
  { key: "all", label: "Tất cả" }, { key: "foundation", label: "Nền tảng" },
  { key: "core", label: "Cốt lõi" }, { key: "power", label: "Nâng cao" }, { key: "expert", label: "Chuyên sâu" },
];

const CORE_FEATURES = [
  { title: "Tìm kiếm", ico: "globe", color: "#0284c7", description: "Kết quả web theo thời gian thực cho thông tin hiện tại, giá cả, tin tức, luật lệ và mọi thứ có thể thay đổi.", when: "Bất kỳ nội dung nào có thể đã thay đổi kể từ mốc dữ liệu huấn luyện của mô hình." },
  { title: "Nghiên cứu chuyên sâu", ico: "search", color: "#4f46e5", description: "Nghiên cứu nhiều bước có dẫn nguồn từ web, tệp và các ứng dụng đã kết nối.", when: "Khi bạn cần một báo cáo có nguồn, chứ không chỉ là câu trả lời nhanh." },
  { title: "Dự án", ico: "folderOpen", color: "#059669", description: "Không gian làm việc lưu trữ lâu dài với tệp dùng chung, hướng dẫn tùy chỉnh và bộ nhớ hội thoại.", when: "Bất kỳ công việc nào bạn sẽ quay lại: môn học, khách hàng, startup." },
  { title: "Bộ nhớ", ico: "database", color: "#d97706", description: "Lưu các sở thích bền vững và bối cảnh lặp lại qua nhiều cuộc trò chuyện.", when: "Dành cho sở thích và thói quen, không phải để lưu tài liệu nguyên văn." },
  { title: "Hướng dẫn tùy chỉnh", ico: "settingsGear", color: "#57534e", description: "Bộ quy tắc luôn hoạt động cho giọng văn, định dạng và cấu trúc phản hồi.", when: "Khi bạn muốn mọi cuộc trò chuyện mặc định đều tuân theo quy tắc của mình." },
  { title: "Canvas", ico: "panelsTopLeft", color: "#334155", description: "Bề mặt soạn thảo trực quan cho văn bản và mã, hỗ trợ chỉnh sửa nội tuyến có mục tiêu.", when: "Khi cần chỉnh sửa lặp đi lặp lại với văn bản dài hoặc mã nguồn." },
  { title: "Tác vụ", ico: "clock", color: "#7c3aed", description: "Lên lịch đầu ra để chạy sau và gửi thông báo cho bạn.", when: "Nhắc việc, bản tin hằng ngày, tóm tắt định kỳ." },
  { title: "Ứng dụng (Kết nối)", ico: "wrench", color: "#0d9488", description: "Kết nối công cụ bên ngoài để ChatGPT có thể đọc và thao tác trên dữ liệu của bạn.", when: "Khi bối cảnh tốt nhất nằm ngoài khung chat." },
  { title: "Agent", ico: "workflow", color: "#16a34a", description: "Thực thi tự động qua trình duyệt, tệp, mã và các ứng dụng đã kết nối.", when: "Tác vụ nhiều bước trải dài qua nhiều trang và hành động." },
  { title: "GPT tùy chỉnh", ico: "bot", color: "#44403c", description: "Trợ lý tái sử dụng với hướng dẫn ổn định và tệp kiến thức.", when: "Khi một quy trình lặp lại đủ nhiều để đáng chuẩn hóa." },
  { title: "Giọng nói", ico: "mic", color: "#e11d48", description: "Tương tác bằng lời nói để suy nghĩ và khám phá thuận tiện hơn.", when: "Khi muốn nghĩ thành tiếng hoặc làm nhiều việc cùng lúc." },
  { title: "Hình ảnh", ico: "imagePlus", color: "#c026d3", description: "Tải lên để phân tích, tạo từ mô tả và chỉnh sửa trực tiếp.", when: "Khi cần hiểu hình ảnh, sáng tạo hình ảnh hoặc tinh chỉnh." },
  { title: "Tệp & Dữ liệu", ico: "fileText", color: "#0891b2", description: "Tải lên PDF, bảng tính và tài liệu để phân tích, kèm thực thi mã.", when: "Biểu đồ, tóm tắt, tính toán." },
  { title: "Mô hình", ico: "brain", color: "#65a30d", description: "Chọn chế độ tối ưu tốc độ, cân bằng hoặc thiên về suy luận sâu.", when: "Ghép đúng mức mạnh với độ phức tạp của tác vụ." },
];

const ADDITIONAL_FEATURES = [
  { title: "Chế độ học tập", ico: "school", color: "#059669", description: "Học có dẫn dắt với câu hỏi và kiểm tra mức hiểu." },
  { title: "Ghi âm", ico: "headphones", color: "#0284c7", description: "Ghi lại cuộc họp nói chuyện, sau đó tạo bản tóm tắt." },
  { title: "Trò chuyện nhóm", ico: "users", color: "#7c3aed", description: "Mời người khác tham gia một cuộc trò chuyện để cùng lập kế hoạch." },
  { title: "Liên kết chia sẻ", ico: "link2", color: "#57534e", description: "Chia sẻ một cuộc trò chuyện bằng URL." },
  { title: "Chỉnh sửa ảnh", ico: "camera", color: "#c026d3", description: "Chọn và tinh chỉnh các vùng trong ảnh đã tạo." },
  { title: "Bảng tương tác", ico: "table2", color: "#0891b2", description: "Xem trực quan dữ liệu đã tải lên trước khi phân tích." },
  { title: "Kỹ năng", ico: "share2", color: "#0d9488", description: "Quy trình tái sử dụng cho các công việc lặp lại một cách nhất quán." },
  { title: "Pulse", ico: "sparkles", color: "#4f46e5", description: "Nghiên cứu bất đồng bộ và trả về các bản tóm tắt trực quan." },
];

const TOOL_CHOOSER = [
  { goal: "Câu trả lời nhanh hoặc bản nháp", tool: "Chat thông thường", ico: "messageSquare", reason: "Ít ma sát nhất." },
  { goal: "Thông tin hiện tại", tool: "Tìm kiếm", ico: "globe", reason: "Dùng cho mọi thứ có thể đã thay đổi." },
  { goal: "Công việc đang làm với tệp", tool: "Dự án", ico: "folderOpen", reason: "Giữ nguyên ngữ cảnh qua nhiều phiên." },
  { goal: "Chỉnh sửa một tài liệu dài", tool: "Canvas", ico: "panelsTopLeft", reason: "Phù hợp hơn cho chỉnh sửa chính xác." },
  { goal: "Báo cáo tổng hợp từ nhiều nguồn", tool: "Nghiên cứu chuyên sâu", ico: "search", reason: "Tổng hợp nhiều bước kèm dẫn nguồn." },
  { goal: "Tác vụ trực tuyến phức tạp", tool: "Agent", ico: "workflow", reason: "Đi qua nhiều website và hành động." },
  { goal: "Đầu ra lặp lại theo chu kỳ", tool: "Tác vụ", ico: "clock", reason: "Chạy bất đồng bộ và báo cho bạn." },
  { goal: "Cùng một quy trình lặp lại thường xuyên", tool: "GPT hoặc Kỹ năng", ico: "bot", reason: "Biến thói quen thành hệ thống." },
];

const PROMPT_BLOCKS = [
  { label: "Mục tiêu", example: "Viết bản tóm tắt dự án dài một trang cho buổi gặp nhà đầu tư.", color: "#10a37f" },
  { label: "Bối cảnh", example: "Startup đang ở giai đoạn tiền doanh thu, Series A, thuộc lĩnh vực khí hậu.", color: "#0284c7" },
  { label: "Ràng buộc", example: "Dưới 400 từ. Không dùng biệt ngữ. Không dùng gạch đầu dòng.", color: "#7c3aed" },
  { label: "Định dạng", example: "Trình bày theo cấu trúc: Vấn đề, Giải pháp, Đà tăng trưởng, Đề nghị.", color: "#d97706" },
  { label: "Chất lượng", example: "Viết ở mức cộng sự McKinsey, không phải kiểu mẫu có sẵn.", color: "#e11d48" },
  { label: "Xác minh", example: "Đánh dấu mọi nhận định cần có nguồn.", color: "#334155" },
];

const GUIDE_SECTIONS = [
  { id:"mental-model", level:"foundation", number:"01", title:"Bắt đầu với mô hình tư duy đúng", ico:"brain", color:"#65a30d",
    summary:"Hãy xem ChatGPT là một đối tác suy luận, không phải một nhà tiên tri. Phản hồi đầu tiên là bản nháp hữu ích, không phải chân lý cuối cùng. Mọi đầu ra đều chỉ nên coi là tạm thời cho đến khi được kiểm tra lại.",
    whyItMatters:"Phần lớn sự thất vọng đến từ kỳ vọng sai lệch. Hãy mong đợi một bản nháp đầu tiên có năng lực, chứ không phải sự chắc chắn tuyệt đối.",
    beginnerMoves:["Luôn xem câu trả lời đầu tiên là bản nháp. Đọc với thái độ phản biện.","Hỏi rõ những giả định nào đã được đưa ra.","Dùng ChatGPT để tăng tốc phán đoán, không phải thay thế phán đoán."],
    advancedMoves:["Yêu cầu lập luận phản biện mạnh nhất.","Tách riêng các lượt: khám phá, khuyến nghị và rà soát rủi ro.","Dùng nó như ý kiến thứ hai cho các quyết định quan trọng."],
    commonMistakes:["Tin vào số liệu mà không kiểm chứng.","Tưởng rằng im lặng đồng nghĩa với tự tin.","Sao chép nguyên văn đầu ra."],
    promptExamples:[{prompt:"Bạn đã đưa ra những giả định nào?",why:"Làm lộ các suy luận ẩn."},{prompt:"Một chuyên gia hoài nghi sẽ phản biện điểm nào?",why:"Tự rà soát theo hướng đối lập."},{prompt:"Lập luận mạnh nhất chống lại khuyến nghị của bạn.",why:"Tránh thiên kiến xác nhận."},{prompt:"Chấm mức độ tin cậy của từng nhận định từ 1-5.",why:"Tách biệt dữ kiện với suy đoán."}],
    beforeAfter:{before:"Viết cho tôi kế hoạch kinh doanh cho một quán cà phê.",after:"Soạn kế hoạch một trang cho quán cà phê đặc sản ở trung tâm Boston. Tệp khách hàng: nghiên cứu sinh và người làm việc từ xa. Đánh dấu mọi chỗ là ước tính thay vì có nguồn.",improvement:"Bổ sung bối cảnh, đối tượng, địa điểm và quy tắc xác minh."},
    visual:"mental" },
  { id:"workspace", level:"foundation", number:"02", title:"Hiểu không gian làm việc trước khi ám ảnh chuyện prompt", ico:"laptop", color:"#059669",
    summary:"ChatGPT hiện đại là một không gian làm việc nhiều tầng. Mỗi loại việc phù hợp với một tầng khác nhau. Một prompt ổn trong đúng tầng sẽ hiệu quả hơn một prompt khéo léo nhưng đặt sai chỗ.",
    whyItMatters:"Chọn đúng không gian làm việc là quyết định có đòn bẩy lớn nhất trước cả khi bạn gõ từ đầu tiên.",
    beginnerMoves:["Chat thông thường cho nhu cầu nhanh, dùng một lần.","Dùng Dự án cho mọi thứ bạn sẽ quay lại.","Dùng Temporary Chat khi muốn bắt đầu từ trang trắng."],
    advancedMoves:["Một dự án cho mỗi môn học, khách hàng hoặc sáng kiến.","Xem Dự án như trung tâm tri thức dài hạn.","Canvas dành cho chỉnh sửa lặp lại; chat dùng cho chiến lược."],
    commonMistakes:["Mỗi lần đều mở chat mới thay vì quay lại dự án cũ.","Dùng chat cho tài liệu dài thay vì canvas.","Bỏ qua hoàn toàn tác vụ và agent."],
    promptExamples:[{prompt:"Việc này nên dùng chat, dự án hay GPT?",why:"Để mô hình chọn đúng không gian làm việc."},{prompt:"Cấu trúc dự án lý tưởng cho học kỳ của tôi.",why:"Thiết kế kiến trúc trước."},{prompt:"Tôi nên thêm những tệp và hướng dẫn nào?",why:"Tối ưu hóa bối cảnh cho dự án."}],
    beforeAfter:{before:"Tôi cứ mở chat mới rồi lại mất ngữ cảnh.",after:"Tạo một Dự án. Tải tài liệu tham chiếu lên. Thiết lập hướng dẫn. Luôn quay lại cùng một dự án.",improvement:"Biến các cuộc chat rời rạc thành một không gian làm việc bền vững."},
    visual:"layers" },
  { id:"prompting", level:"foundation", number:"03", title:"Viết prompt: rõ ràng luôn hơn khéo léo", ico:"penTool", color:"#0284c7",
    summary:"Prompt tốt là bản mô tả công việc. Câu chữ hoa mỹ là tùy chọn; ràng buộc rõ ràng thì không. Mô hình không nhìn thấy tiêu chuẩn trong đầu bạn nếu bạn không viết nó ra.",
    whyItMatters:"Prompt mơ hồ sẽ cho ra đầu ra chung chung. Phần lớn sự bực bội bắt nguồn từ đầu vào chưa đủ cụ thể.",
    beginnerMoves:["Nêu rõ đối tượng và tình huống sử dụng.","Mô tả thế nào là kết quả thành công.","Chỉ định định dạng, giọng văn, độ dài và điều cần tránh."],
    advancedMoves:["Làm dàn ý trước, duyệt xong mới viết bản hoàn chỉnh.","Tách riêng dữ kiện và diễn giải.","Đưa ra tiêu chí để tự chấm chất lượng."],
    commonMistakes:["Prompt ba chữ nhưng đòi kết quả may đo.","Nhồi quá nhiều ràng buộc cùng lúc.","Hỏi kiểu 'Bạn có thể...?' thay vì ra lệnh trực tiếp."],
    promptExamples:[{prompt:"Mục tiêu: ___. Bối cảnh: ___. Ràng buộc: ___. Cần tạo: ___.",why:"Khung xương dùng được cho hầu hết tình huống."},{prompt:"Làm dàn ý trước. Chưa viết bản nháp vội.",why:"Tránh phải viết lại do sai cấu trúc."},{prompt:"Trước khi viết, hãy cho tôi biết bạn cần biết những gì.",why:"Khiến mô hình đặt câu hỏi làm rõ."},{prompt:"Viết với vai trò [role] để giải thích cho [audience].",why:"Neo giọng điệu và độ sâu."}],
    beforeAfter:{before:"Viết thư xin việc.",after:"Thư xin việc cho vị trí Strategy Analyst tại McKinsey. Tôi là học viên cao học ngành International Management, có kinh nghiệm về SOP và CRM. Giọng điệu tự tin nhưng không kiêu. 350 từ. Không dùng câu 'I am passionate about.'",improvement:"Có vai trò, bối cảnh, giọng điệu, độ dài và ràng buộc phủ định."},
    visual:"prompt" },
  { id:"revision", level:"core", number:"04", title:"Quy trình chỉnh sửa luôn thắng nỗ lực hoàn hảo ngay một lần", ico:"refreshCcw", color:"#7c3aed",
    summary:"Cách dùng mạnh nhất là theo vòng lặp: định khung, nháp, phản biện, chỉnh sửa, đóng gói. Đa số người dùng làm lại từ đầu trong khi lẽ ra nên tinh chỉnh tiếp.",
    whyItMatters:"Làm một phát duy nhất sẽ chặn chất lượng ở lần thử đầu. Chỉnh sửa có hệ thống hầu như luôn cho kết quả tốt hơn.",
    beginnerMoves:["Sau bản nháp, hãy hỏi: 'Điểm nào còn yếu hoặc còn thiếu?'","Sửa lại với mục tiêu hẹp hơn.","Đừng làm lại từ đầu nếu hướng đi chưa thật sự sai."],
    advancedMoves:["Chia lượt cố định: cấu trúc, độ chính xác, giọng điệu, nén gọn, đóng gói.","Yêu cầu tự phê bình trước khi viết lại.","Chỉ định tỉ lệ nén nội dung."],
    commonMistakes:["Tự sửa tay thay vì để mô hình tự chẩn đoán trước.","Phản hồi mơ hồ như 'làm tốt hơn đi.'","Quá nhiều vòng sửa nhưng không có trọng tâm."],
    promptExamples:[{prompt:"Vì sao câu trả lời của bạn chưa đạt mục tiêu?",why:"Tự chẩn đoán trước khi sửa."},{prompt:"Sửa lại để lập luận sắc hơn. Giữ nguyên cấu trúc.",why:"Giới hạn phạm vi chỉnh sửa."},{prompt:"Rút gọn 35% nhưng không làm mất ý cốt lõi.",why:"Buộc phải ưu tiên nội dung."},{prompt:"Chấm theo các tiêu chí này. Chỗ nào dưới 4/5?",why:"Tự đánh giá có cấu trúc."}],
    beforeAfter:{before:"Chưa đúng. Làm lại đi.",after:"Lập luận ở phần 2 đang bị vòng lặp. Viết lại phần đó và thêm một dữ liệu từ báo cáo đã tải lên. Giữ nguyên các phần còn lại.",improvement:"Nêu rõ lỗi gì, sửa gì và giữ lại phần nào."},
    visual:"workflow" },
  { id:"writing", level:"core", number:"05", title:"Viết, viết lại và chuyển đổi nội dung", ico:"fileText", color:"#57534e",
    summary:"ChatGPT đặc biệt mạnh ở việc biến đổi văn bản: viết lại cho đối tượng khác, đổi giọng điệu, tóm tắt, sắp xếp lại. Nhiều khi nó giỏi cải thiện nội dung sẵn có hơn là viết từ con số không.",
    whyItMatters:"Phần lớn công việc viết lách chuyên nghiệp là chuyển đổi nội dung. Đây là nơi AI cho tỷ suất hiệu quả cao nhất.",
    beginnerMoves:["Dán bản gốc vào. Nói rõ phần nào giữ nguyên, phần nào thay đổi.","Chỉ định đối tượng, kênh truyền đạt và giọng điệu.","Nếu chưa chắc về tông giọng, yêu cầu nhiều phiên bản."],
    advancedMoves:["Tạo các phiên bản đối chiếu: trang trọng, ngắn gọn, thuyết phục.","Chẩn đoán ở cấp độ câu.","Chuyển phong cách nhưng vẫn giữ nguyên dữ kiện."],
    commonMistakes:["Viết mới từ đầu dù đã có ghi chú.","Chấp nhận giọng điệu đầu tiên mà không so sánh lựa chọn khác.","Không nói rõ điều gì phải được giữ lại."],
    promptExamples:[{prompt:"Viết lại theo kiểu email gửi giảng viên: tôn trọng, trực diện, không rườm rà.",why:"Chuyển đổi rất cụ thể."},{prompt:"Cho tôi 3 phiên bản: trang trọng, ngắn gọn, thuyết phục.",why:"Dễ chọn bằng cách đối chiếu."},{prompt:"Những câu nào nghe chung chung và vì sao?",why:"Chẩn đoán ở cấp độ dòng."},{prompt:"Giữ nguyên dữ kiện và cấu trúc. Chỉ đổi giọng điệu.",why:"Giới hạn phạm vi chỉnh sửa."}],
    beforeAfter:{before:"Làm email này hay hơn đi.",after:"Viết lại email này để gửi cho giám đốc chương trình. Giọng điệu tôn trọng, trực diện. Bỏ biệt ngữ. Dưới 150 từ. Giữ nguyên các mục cần hành động.",improvement:"Có đối tượng, giọng điệu, điều cần tránh, độ dài và phần phải giữ."},
    visual:"writing" },
  { id:"files-data", level:"core", number:"06", title:"Tệp, PDF, bảng tính và dữ liệu", ico:"table2", color:"#0891b2",
    summary:"ChatGPT có thể đọc tệp, tóm tắt tài liệu, chạy mã trên dữ liệu và tạo biểu đồ. Nguyên tắc quan trọng: mô tả trước, phân tích sau, kết luận cuối cùng.",
    whyItMatters:"Xem dữ liệu kỹ trước khi diễn giải là cách tránh những lỗi phổ biến nhất.",
    beginnerMoves:["Hỏi tệp chứa gì trước khi hỏi nó có ý nghĩa gì.","Yêu cầu kiểm tra trường dữ liệu trước.","Với PDF: tách riêng cấu trúc, lập luận và bằng chứng."],
    advancedMoves:["Yêu cầu ghi rõ dấu vết các giả định.","Nhắc mô hình đọc lại bảng đã trích xuất trước khi kết luận.","Dùng thực thi mã cho tập dữ liệu lớn."],
    commonMistakes:["Nhảy ngay vào 'cho tôi insight chính.'","Tin nhãn biểu đồ mà không kiểm tra.","Cho rằng PDF luôn được phân tích hoàn hảo."],
    promptExamples:[{prompt:"Mô tả: các trường, khoảng ngày, giá trị thiếu, các hướng phân tích khả thi.",why:"Kiểm tra trước khi phân tích."},{prompt:"Trích xuất lập luận chính trước khi phê bình.",why:"Hiểu trước rồi mới đánh giá."},{prompt:"Liệt kê mọi giả định đã dùng cho biểu đồ này.",why:"Có dấu vết kiểm toán."},{prompt:"Viết Python để làm sạch dữ liệu này, chạy nó và cho tôi xem kết quả.",why:"Phân tích có thể tái lập."}],
    beforeAfter:{before:"Cho tôi insight chính từ bảng tính này?",after:"Hãy kiểm tra trước: cột nào có trong bảng, kiểu dữ liệu, khoảng ngày, giá trị thiếu. Sau đó đề xuất 3 hướng phân tích theo thứ tự hữu ích. Đừng chạy cho đến khi tôi duyệt.",improvement:"Có bước kiểm tra, đề xuất và chốt duyệt trước khi phân tích."},
    visual:"data" },
  { id:"search-research", level:"core", number:"07", title:"Tìm kiếm, nghiên cứu chuyên sâu và dẫn nguồn", ico:"search", color:"#4f46e5",
    summary:"Dùng Tìm kiếm cho câu hỏi hiện tại cần nguồn. Dùng Nghiên cứu chuyên sâu cho báo cáo nhiều bước. Mọi thứ mang tính thời sự, có quy định hoặc thay đổi nhanh đều không nên dựa vào trí nhớ tĩnh.",
    whyItMatters:"Nếu không dùng tìm kiếm, ChatGPT đang trả lời từ một ảnh chụp cố định của quá khứ.",
    beginnerMoves:["Hễ có khả năng đã thay đổi thì hãy tìm kiếm.","Kiểm tra xem nguồn được dẫn có thực sự hỗ trợ nhận định cụ thể hay không.","Với việc quan trọng, ưu tiên nguồn gốc."],
    advancedMoves:["Dùng câu: 'Tách riêng dữ kiện đã xác nhận với phần suy luận của bạn.'","Chỉ định loại nguồn, khu vực và khoảng thời gian.","Giao việc Nghiên cứu chuyên sâu với phạm vi rõ ràng."],
    commonMistakes:["Tin vào kiến thức tĩnh của mô hình cho tin tức hiện tại.","Thấy có nguồn là tin ngay mà không bấm kiểm tra.","Dùng Nghiên cứu chuyên sâu cho câu hỏi thực tế đơn giản."],
    promptExamples:[{prompt:"Hãy tìm kiếm. Chỉ dùng nguồn gốc.",why:"Lấy dữ liệu trực tiếp với ràng buộc chất lượng."},{prompt:"Tách dữ kiện khỏi suy luận. Gắn nhãn từng phần.",why:"Minh bạch trạng thái tri thức."},{prompt:"Điều gì trong đây có thể lỗi thời trong 6 tháng tới?",why:"Đánh dấu điểm nhạy theo thời gian."},{prompt:"Nghiên cứu chuyên sâu: [chủ đề]. Phạm vi: [khu vực, ngày tháng].",why:"Mô tả công việc rõ ràng."}],
    beforeAfter:{before:"Tin mới nhất về quy định AI?",after:"Tìm kiếm: quy định AI ở EU và Mỹ trong 30 ngày qua. Chỉ dùng nguồn gốc. Tách rõ quy định đã ban hành và đề xuất đang chờ.",improvement:"Có phạm vi, khung thời gian, chất lượng nguồn và phân loại rõ ràng."},
    visual:"research" },
  { id:"multimodal", level:"core", number:"08", title:"Giọng nói, hình ảnh và quy trình đa phương thức", ico:"imagePlus", color:"#c026d3",
    summary:"Giọng nói, hiểu ảnh, tạo ảnh và chỉnh sửa ảnh đã là tính năng tiêu chuẩn. Điểm mấu chốt vẫn là tính cụ thể: yêu cầu hình ảnh mơ hồ thường cho ra kết quả chung chung.",
    whyItMatters:"Đa phương thức biến ChatGPT thành công cụ phân tích trực quan, xưởng hình ảnh và đối tác suy nghĩ rảnh tay.",
    beginnerMoves:["Nói thật rõ bạn muốn làm gì với ảnh đã tải lên.","Dùng giọng nói khi tốc độ quan trọng hơn độ trau chuốt.","Khi tạo ảnh, hãy chỉ định chủ thể, khung hình, cảm xúc và phong cách."],
    advancedMoves:["Kết chuỗi nhiều chế độ: phân tích, giải thích rồi tạo ghi chú.","Dùng phân tích hình ảnh để review thiết kế.","Chỉnh sửa có phạm vi: chọn vùng rồi mô tả thay đổi."],
    commonMistakes:["Tải ảnh lên mà không nói cần làm gì.","Kỳ vọng ảnh chân thực khi mô tả quá chung.","Quên rằng chế độ giọng nói vẫn dùng cùng ngữ cảnh như văn bản."],
    promptExamples:[{prompt:"Trích xuất các món trong menu và sắp xếp theo nhóm.",why:"Yêu cầu trích xuất rất cụ thể."},{prompt:"Giải thích biểu đồ này cho một lãnh đạo không chuyên kỹ thuật trong 120 từ.",why:"Phân tích kèm ràng buộc."},{prompt:"Tạo ảnh: dọc 9:16, điện ảnh, ánh sáng hoàng hôn.",why:"Mô tả theo kiểu nhiếp ảnh."},{prompt:"Đổi nền sang studio trắng. Giữ nguyên chủ thể.",why:"Chỉnh sửa có phạm vi."}],
    beforeAfter:{before:"Làm cho tôi một bức ảnh ngầu.",after:"Khung 16:9: quán cà phê hiện đại ở Tokyo lúc chạng vạng. Phong cách nhiếp ảnh kiến trúc, độ sâu trường ảnh nông. Tông ấm. Quầy gỗ, máy espresso, đèn thành phố. Không có người.",improvement:"Có tỉ lệ, chủ thể, phong cách, cảm xúc, chi tiết và phần loại trừ."},
    visual:"multimodal" },
  { id:"study-collab", level:"power", number:"09", title:"Học tập, ghi âm, nhóm, liên kết và kỹ năng", ico:"layoutGrid", color:"#0d9488",
    summary:"Đây là nhóm tính năng dành cho học tập, ghi lại nội dung nói, cộng tác, chia sẻ và chuẩn hóa quy trình.",
    whyItMatters:"Học khác với chỉ nhận câu trả lời. Cộng tác cũng khác với việc tự prompt một mình.",
    beginnerMoves:["Dùng Chế độ học tập khi muốn học thật, không chỉ lấy đáp án.","Dùng Ghi âm cho cuộc họp và bài giảng.","Dùng Liên kết chia sẻ và Trò chuyện nhóm để cộng tác gọn gàng."],
    advancedMoves:["Dùng bản tóm tắt từ ghi âm như tệp nguồn trong Dự án.","Dùng Kỹ năng cho các việc lặp lại.","Kết hợp Trò chuyện nhóm với Dự án để có ngữ cảnh chung."],
    commonMistakes:["Dùng chat thường để học khiến việc học kém hiệu quả.","Quên mất tính năng Ghi âm tồn tại.","Chụp màn hình thay vì dùng Liên kết chia sẻ."],
    promptExamples:[{prompt:"Đố tôi thay vì cho đáp án ngay.",why:"Cách tiếp cận mang tính sư phạm."},{prompt:"Từ bản ghi âm này, tạo danh sách hành động và bản nháp follow-up.",why:"Biến một đầu vào thành nhiều đầu ra."},{prompt:"Chuyển quy trình này thành một Kỹ năng.",why:"Chuẩn hóa quy trình đã ổn định."}],
    beforeAfter:{before:"Giải thích quang hợp cho tôi.",after:"Tôi đang học để thi sinh học. Đừng giải thích ngay. Hãy hỏi tôi từng câu từ cơ bản đến nâng cao để kiểm tra mức hiểu, và sửa ngắn gọn khi tôi sai.",improvement:"Biến chế độ trả lời thành chế độ học có dẫn dắt."},
    visual:"collab" },
  { id:"personalization", level:"power", number:"10", title:"Bộ nhớ, hướng dẫn, personality và temporary chat", ico:"database", color:"#d97706",
    summary:"Bộ nhớ lưu bối cảnh. Hướng dẫn đặt quy tắc. Personality chỉnh phong cách. Temporary Chat là một phòng sạch. Chúng không thể thay thế cho nhau.",
    whyItMatters:"Cá nhân hóa cấu hình sai thường làm giảm chất lượng hơn là giúp ích.",
    beginnerMoves:["Bộ nhớ: lưu sở thích rộng và ổn định.","Hướng dẫn: lưu quy tắc viết chung.","Temporary Chat: không mang theo dấu vết cũ."],
    advancedMoves:["Personality chỉ là chất liệu phong cách, không thay thế cho hướng dẫn.","Ưu tiên hướng dẫn riêng theo dự án hơn là cài đặt toàn cục.","Rà soát bộ nhớ định kỳ."],
    commonMistakes:["Nhét mọi thứ vào bộ nhớ thay vì Hướng dẫn.","Để bộ nhớ cũ tích tụ quá lâu.","Dùng personality để đổi năng lực thay vì đổi phong cách."],
    promptExamples:[{prompt:"Bạn đang nhớ gì về tôi?",why:"Kiểm tra bộ nhớ hiện tại."},{prompt:"Hãy quên sở thích về giọng điệu trang trọng.",why:"Dọn dẹp có mục tiêu."},{prompt:"Bắt đầu như trang trắng. Không dùng sở thích đã lưu.",why:"Chế độ phòng sạch."}],
    beforeAfter:{before:"Có sở thích đã lưu nhưng kết quả vẫn thiếu nhất quán.",after:"Đưa quy tắc hành vi vào Hướng dẫn. Đưa dữ kiện vào Bộ nhớ. Đưa quy tắc theo lĩnh vực vào hướng dẫn của từng dự án.",improvement:"Phân tầng đúng chức năng."},
    visual:"memory" },
  { id:"projects", level:"power", number:"11", title:"Dự án như một hệ điều hành làm việc của bạn", ico:"folderOpen", color:"#16a34a",
    summary:"Dự án biến ChatGPT thành bàn làm việc có ngữ cảnh. Một dự án được cấu hình tốt thường mạnh hơn bất kỳ cuộc chat đơn lẻ nào.",
    whyItMatters:"Với công việc kéo dài qua nhiều phiên, Dự án là công cụ tổ chức có đòn bẩy lớn nhất.",
    beginnerMoves:["Một dự án cho mỗi luồng công việc. Đặt tên thật rõ.","Chỉ tải lên những tệp liên quan.","Viết hướng dẫn riêng cho dự án."],
    advancedMoves:["Thêm bản tóm tắt hội thoại như tệp nguồn.","Dồn việc hằng tuần vào một dự án thay vì chat mới liên tục.","Tạo meta-project cho năng suất cá nhân."],
    commonMistakes:["Tạo quá nhiều dự án nhỏ lẻ.","Tải lên mọi thứ khiến ngữ cảnh bị phình to.","Không có hướng dẫn cho dự án."],
    promptExamples:[{prompt:"Cấu trúc dự án lý tưởng cho học kỳ của tôi.",why:"Thiết kế không gian làm việc trước."},{prompt:"Soạn một bản memo nhất quán với các việc trước đó.",why:"Tận dụng ngữ cảnh đã tích lũy."},{prompt:"Tóm tắt các quyết định chính từ 5 cuộc trò chuyện gần nhất.",why:"Tạo bản tóm tắt sống."}],
    beforeAfter:{before:"Tệp nằm khắp nơi, tôi cứ bị lạc.",after:"Một dự án cho mỗi lĩnh vực. Có tài liệu tham chiếu. Có hướng dẫn. Quay lại đúng dự án. Định kỳ tạo bản tóm tắt.",improvement:"Biến các cuộc trò chuyện rời rạc thành cấu trúc rõ ràng."},
    visual:"project" },
  { id:"gpts", level:"power", number:"12", title:"Khi nào nên tạo GPT, và khi nào thì chưa nên", ico:"bot", color:"#44403c",
    summary:"GPT tùy chỉnh thực sự hữu ích khi một quy trình lặp lại, có hướng dẫn ổn định và đáng để tái sử dụng. Nhưng đa số người dùng tạo quá sớm.",
    whyItMatters:"Tạo GPT quá sớm sẽ đóng cứng một quy trình còn non. Tạo đúng lúc sẽ biến quy trình đã chín thành công cụ một chạm.",
    beginnerMoves:["Lưu prompt trước, vì prompt chính là bản mẫu thử.","Lặp lại ít nhất 3 lần rồi mới chuẩn hóa.","Giữ mục đích thật hẹp. Một GPT, một việc."],
    advancedMoves:["Bốn lớp thiết kế: vai trò, hướng dẫn, tri thức, công cụ.","Viết rõ quy tắc thất bại.","Kiểm thử theo hướng phản biện."],
    commonMistakes:["Tạo GPT cho việc chỉ làm một lần.","Làm quá rộng: 'làm mọi thứ.'","Không có tệp kiến thức."],
    promptExamples:[{prompt:"Biến quy trình hiện tại của chúng ta thành blueprint cho một GPT.",why:"Rút quy tắc từ kinh nghiệm thực tế."},{prompt:"Cho tôi hướng dẫn, schema đầu vào/đầu ra và quy tắc thất bại.",why:"Đặc tả đầy đủ."},{prompt:"GPT này cần xử lý những edge case nào?",why:"Kiểm tra độ bền."}],
    beforeAfter:{before:"Tạo GPT để xử lý mọi email của tôi.",after:"Tạo GPT chuyên trả lời email cho giảng viên. Giọng điệu tôn trọng, trực diện. Dưới 150 từ. Hỏi thêm ngữ cảnh trước. Từ chối trả lời nếu chưa xác nhận. Tải lên: style guide.",improvement:"Phạm vi hẹp, có quy tắc an toàn và tài liệu tham chiếu."},
    visual:"gpt" },
  { id:"canvas", level:"power", number:"13", title:"Canvas cho chỉnh sửa văn bản và mã", ico:"panelsTopLeft", color:"#334155",
    summary:"Canvas là bề mặt làm việc trực quan nằm cạnh khung chat. Nó phù hợp với công việc dạng tài liệu cần can thiệp chính xác hơn là trò chuyện tuyến tính.",
    whyItMatters:"Với tác phẩm dài, chat thường không phải môi trường lý tưởng. Canvas biến chính tài liệu thành trung tâm của quá trình làm việc.",
    beginnerMoves:["Dùng Canvas cho đầu ra dài.","Một tệp cho một mục đích.","Chỉnh sửa có mục tiêu, đừng yêu cầu viết lại mơ hồ."],
    advancedMoves:["Dùng chat cho chiến lược, canvas cho thực thi.","Thiết kế kiến trúc trước rồi mới sửa từng phần nhỏ.","Dùng lịch sử phiên bản để so sánh."],
    commonMistakes:["Dùng chat cho tài liệu dài.","Viết lại toàn bộ chỉ vì một đoạn cần sửa.","Không dùng canvas mã khi đang debug."],
    promptExamples:[{prompt:"Mở trong canvas. Chỉ viết lại phần mở đầu.",why:"Chỉnh sửa trong phạm vi rõ ràng."},{prompt:"Tìm lỗi logic. Chỉ vá đúng các dòng đó.",why:"Sửa mã có mục tiêu."},{prompt:"Đưa mục 3 lên trước mục 2, và gộp mục 4 với 5.",why:"Tái cấu trúc tài liệu."}],
    beforeAfter:{before:"Viết lại bài luận của tôi. [2000 từ trong chat]",after:"Mở trong canvas. Chưa sửa vội. Hãy chú thích phần nào mạnh, phần nào yếu, rồi tôi sẽ chỉ định bước chỉnh tiếp theo.",improvement:"Kiểm tra trước rồi mới chỉnh sửa."},
    visual:"canvas" },
  { id:"tasks-apps-agent", level:"expert", number:"14", title:"Tác vụ, ứng dụng, pulse và agent", ico:"workflow", color:"#16a34a",
    summary:"Đây là tầng vận hành. Tác vụ chạy sau. Ứng dụng đưa dữ liệu vào. Pulse nghiên cứu bất đồng bộ. Agent tự xử lý công việc nhiều bước.",
    whyItMatters:"Phần lớn người dùng chỉ dừng ở hỏi đáp thời gian thực. Tầng này biến ChatGPT thành một hệ thống thật sự làm việc cho bạn.",
    beginnerMoves:["Tác vụ: nhắc việc, bản tin, tóm tắt định kỳ.","Ứng dụng: khi thông tin nằm trong Drive, Slack, email.","Agent: dành cho quy trình nhiều bước mà tự làm sẽ mất từ 15 phút trở lên."],
    advancedMoves:["Viết prompt cho agent như một job brief, kèm điểm dừng.","Dùng Pulse để nhận cập nhật chủ động theo chủ đề.","Kết hợp Tác vụ và Dự án để có bản tóm tắt tuần tự động."],
    commonMistakes:["Không biết Agent tồn tại.","Viết chỉ dẫn mơ hồ cho agent mà không có quy tắc dừng.","Chỉ dùng Tác vụ để nhắc việc."],
    promptExamples:[{prompt:"Tạo tác vụ hằng ngày: 8 giờ sáng gửi bản brief top 3 về [chủ đề].",why:"Bản tin chủ động."},{prompt:"Phân tích đối thủ cạnh tranh từ cả nguồn công khai lẫn nguồn đã kết nối.",why:"Kết hợp dữ liệu nội bộ và bên ngoài."},{prompt:"Agent: làm theo các bước sau. Dừng trước khi gửi đi.",why:"Tự động nhưng có checkpoint."}],
    beforeAfter:{before:"Kiểm tra 5 website và so sánh giá.",after:"Agent: vào 5 đối thủ cạnh tranh, trích xuất giá, lập bảng so sánh. Nếu cần đăng nhập thì dừng lại. Đánh dấu mọi giá có dấu hiệu lỗi thời.",improvement:"Có phạm vi, điều kiện lỗi và quy tắc dừng rõ ràng."},
    visual:"agent" },
  { id:"model-choice", level:"expert", number:"15", title:"Chọn mô hình và chọn chế độ", ico:"compass", color:"#65a30d",
    summary:"Các chế độ khác nhau sẽ đánh đổi giữa tốc độ, độ sâu suy luận và khả năng dùng công cụ. Hãy chọn mức mạnh phù hợp với từng việc.",
    whyItMatters:"Lúc nào cũng dùng chế độ mạnh nhất sẽ tốn thời gian. Không bao giờ nâng cấp thì lại thiếu chiều sâu.",
    beginnerMoves:["Để Auto cho việc thường ngày.","Nâng lên khi logic hoặc tổng hợp trở nên phức tạp.","Mạnh nhất không phải lúc nào cũng tốt nhất."],
    advancedMoves:["Dùng nhanh để nháp, dùng sâu để rà soát quan trọng.","Lưu ý giới hạn công cụ của các chế độ suy luận.","Bắt đầu nhẹ rồi nâng cấp giữa cuộc trò chuyện."],
    commonMistakes:["Dùng chế độ mạnh nhất cho mọi thứ.","Đổ lỗi cho mô hình trong khi thực ra chọn sai chế độ.","Không kiểm tra giới hạn gói đang dùng."],
    promptExamples:[{prompt:"Trả lời nhanh trước, rồi làm một lượt sâu hơn sau.",why:"Ưu tiên tốc độ rồi mới đào sâu."},{prompt:"Bài toán logic phức tạp. Hãy suy nghĩ mở rộng từng bước.",why:"Kích hoạt suy luận sâu một cách rõ ràng."},{prompt:"Việc này nên dùng chế độ nháp nhanh hay suy luận cẩn trọng?",why:"Để mô hình gợi ý chế độ phù hợp."}],
    beforeAfter:{before:"Lúc nào cũng dùng mô hình mạnh nhất.",after:"Dùng Auto cho việc nhanh. Dùng reasoning cho logic. Dùng chế độ nhanh cho brainstorming.",improvement:"Ghép đúng sức mạnh với loại tác vụ."},
    visual:"models" },
  { id:"privacy-risk", level:"expert", number:"16", title:"Quyền riêng tư, kiểm soát dữ liệu và rủi ro", ico:"shield", color:"#e11d48",
    summary:"Năng lực càng cao thì ranh giới càng phải rõ. Dữ liệu nhạy cảm cần kỷ luật khi tải lên. Với đầu ra rủi ro cao, con người vẫn phải duyệt lại.",
    whyItMatters:"Có năng lực mà không có ranh giới sẽ dễ dẫn đến lộ dữ liệu hoặc phụ thuộc quá mức.",
    beginnerMoves:["Đừng tùy tiện tải lên nội dung nhạy cảm.","Ẩn hoặc xóa định danh trước khi tải.","Dùng Temporary Chat khi muốn mức riêng tư sạch nhất có thể."],
    advancedMoves:["Đặt chính sách tải lên theo đèn giao thông: đỏ, vàng, xanh.","Việc rủi ro cao phải có chuyên gia người thật duyệt trước.","Kiểm tra dữ liệu định kỳ."],
    commonMistakes:["Tải nguyên cả cơ sở dữ liệu khi chỉ cần mẫu nhỏ.","Tưởng Temporary Chat đồng nghĩa với không có xử lý gì cả.","Xem đầu ra AI là quyết định cuối cùng trong lĩnh vực có quy định."],
    promptExamples:[{prompt:"Phần nào ở đây cần chuyên gia con người xác minh?",why:"Đánh dấu giới hạn."},{prompt:"Hãy giúp tôi ẩn thông tin định danh trước khi tải toàn bộ lên.",why:"Chuẩn bị an toàn."},{prompt:"Trong đây có dữ liệu nhận dạng cá nhân nào không? Hãy loại bỏ nó.",why:"Phát hiện PII."}],
    beforeAfter:{before:"Đây là toàn bộ danh sách khách hàng, hãy phân tích xu hướng.",after:"Hãy xóa tên, email và số điện thoại. Ẩn danh cả tên công ty. Sau đó phân tích doanh thu theo phân khúc.",improvement:"Loại bỏ định danh nhưng vẫn giữ giá trị phân tích."},
    visual:"privacy" },
];

/* ─────────────────────────────────────────────
   HÌNH MINH HỌA SVG CHO TỪNG PHẦN
   ───────────────────────────────────────────── */
function SectionVisual({ type }) {
  const s = "fill-none stroke-current";
  const cls = "h-36 w-full";
  const col = C.greenDeep;
  const tx = (x, y, label, opts = {}) => <text x={x} y={y} textAnchor="middle" fill={col} style={{ fontSize: opts.size || 10, fontWeight: opts.bold ? 600 : 400, opacity: opts.dim ? 0.4 : 1 }}>{label}</text>;
  const V = {
    mental: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}><rect x="24" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="216" y="12" width="120" height="44" rx="12" className={s} strokeWidth="2"/><rect x="120" y="110" width="120" height="44" rx="12" className={s} strokeWidth="2"/><path d="M144 34h72" className={s} strokeWidth="1.5"/><path d="M84 56l60 54M276 56l-60 54" className={s} strokeWidth="1.5"/>{tx(84,39,"Mục tiêu của bạn",{bold:true})}{tx(276,39,"Bản nháp AI",{bold:true})}{tx(180,137,"Phán đoán của bạn",{bold:true})}{tx(180,84,"kiểm tra, quyết định, hành động",{dim:true,size:9})}</svg>,
    layers: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["40","8","280","24","Chat thông thường"],["54","38","252","24","Dự án + Canvas"],["68","68","224","24","Bộ nhớ + Hướng dẫn"],["82","98","196","24","GPT + Học tập + Kỹ năng"],["96","128","168","24","Tác vụ + Ứng dụng + Agent"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(180,Number(y)+16,l,{bold:true,size:9})}</g>)}{tx(336,22,"đơn giản",{dim:true,size:8})}{tx(336,146,"mạnh hơn",{dim:true,size:8})}</svg>,
    prompt: <svg viewBox="0 0 360 170" className={cls} style={{ color: col }}>{[["18","8","Mục tiêu"],["126","8","Bối cảnh"],["234","8","Quy tắc"],["18","92","Định dạng"],["126","92","Chất lượng"],["234","92","Xác minh"]].map(([x,y,l])=><g key={l}><rect x={x} y={y} width="102" height="50" rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+51,Number(y)+30,l,{bold:true,size:11})}</g>)}</svg>,
    workflow: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["30","Khung"],["100","Nháp"],["170","Phản biện"],["240","Sửa"],["310","Hoàn tất"]].map(([x,l],i)=><g key={l}><circle cx={x} cy="60" r="22" className={s} strokeWidth="2"/>{tx(Number(x),64,l,{bold:true,size:9})}{i<4&&<path d={`M${Number(x)+22} 60h26`} className={s} strokeWidth="1.5"/>}</g>)}{tx(170,112,"mỗi lượt đều tăng độ sắc nét",{dim:true,size:9})}</svg>,
    writing: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="134" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><rect x="248" y="14" width="92" height="90" rx="10" className={s} strokeWidth="2"/><path d="M112 59h22M226 59h22" className={s} strokeWidth="1.5"/>{tx(66,38,"Nguồn",{bold:true})}{tx(180,38,"Chuyển đổi",{bold:true})}{tx(294,38,"Đầu ra",{bold:true})}</svg>,
    data: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="10" width="116" height="96" rx="10" className={s} strokeWidth="2"/><path d="M20 36h116M48 10v96M76 10v96M104 10v96M20 62h116M20 88h116" className={s} strokeWidth="1"/><rect x="186" y="18" width="24" height="70" rx="6" className={s} strokeWidth="2"/><rect x="220" y="40" width="24" height="48" rx="6" className={s} strokeWidth="2"/><rect x="254" y="28" width="24" height="60" rx="6" className={s} strokeWidth="2"/><rect x="288" y="48" width="24" height="40" rx="6" className={s} strokeWidth="2"/><path d="M182 100h136" className={s} strokeWidth="1.5"/>{tx(78,126,"1. Kiểm tra",{dim:true,size:9})}{tx(252,126,"2. Kết luận",{dim:true,size:9})}</svg>,
    research: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><circle cx="66" cy="58" r="32" className={s} strokeWidth="2"/><path d="M90 82l22 22" className={s} strokeWidth="2"/><rect x="170" y="10" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="50" width="144" height="28" rx="8" className={s} strokeWidth="2"/><rect x="170" y="90" width="144" height="28" rx="8" className={s} strokeWidth="2"/>{tx(242,29,"Nguồn gốc",{bold:true})}{tx(242,69,"Thứ cấp",{bold:true})}{tx(242,109,"Suy luận",{bold:true})}<circle cx="326" cy="24" r="4" fill="#10a37f" stroke="none"/><circle cx="326" cy="64" r="4" fill="#F59E0B" stroke="none"/><circle cx="326" cy="104" r="4" fill="#E11D48" stroke="none" opacity="0.5"/></svg>,
    multimodal: <svg viewBox="0 0 360 130" className={cls} style={{ color: col }}>{[["36","Văn bản"],["120","Hình ảnh"],["204","Giọng nói"],["288","Chỉnh sửa"]].map(([x,l])=><g key={l}><rect x={x} y="20" width="52" height="52" rx="12" className={s} strokeWidth="2"/>{tx(Number(x)+26,50,l,{bold:true,size:9})}</g>)}<path d="M88 46h32M172 46h32M256 46h32" className={s} strokeWidth="1.5"/>{tx(180,102,"kết chuỗi nhiều chế độ",{dim:true,size:9})}</svg>,
    collab: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["18","24","64","42","Ghi âm"],["100","6","120","42","Học"],["100","78","120","42","Nhóm"],["238","24","80","42","Chia sẻ"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M82 45h18M220 27h18M220 99h18" className={s} strokeWidth="1.5"/></svg>,
    memory: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["14","10","74","40","Bộ nhớ"],["100","10","120","40","Hướng dẫn"],["232","10","108","40","Phong cách"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<rect x="60" y="88" width="240" height="40" rx="12" className={s} strokeWidth="2"/>{tx(180,113,"Đầu ra nhất quán",{bold:true})}<path d="M51 50l38 38M160 50v38M286 50l-38 38" className={s} strokeWidth="1.5"/></svg>,
    project: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="28" y="4" width="304" height="132" rx="16" className={s} strokeWidth="2"/><rect x="46" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="130" y="28" width="72" height="88" rx="8" className={s} strokeWidth="2"/><rect x="214" y="28" width="100" height="40" rx="8" className={s} strokeWidth="2"/><rect x="214" y="76" width="100" height="40" rx="8" className={s} strokeWidth="2"/>{tx(82,76,"Chat",{bold:true})}{tx(166,76,"Tệp",{bold:true})}{tx(264,52,"Nguồn",{bold:true,size:9})}{tx(264,100,"Quy tắc",{bold:true,size:9})}</svg>,
    gpt: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["16","48","78","42","Vai trò"],["116","4","96","42","Tri thức"],["116","94","96","42","Công cụ"],["234","48","110","42","Quy tắc"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+26,l,{bold:true,size:10})}</g>)}<path d="M94 69h22M212 25h22M212 115h22" className={s} strokeWidth="1.5"/><path d="M164 46v48" className={s} strokeWidth="1.5"/></svg>,
    canvas: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}><rect x="20" y="4" width="320" height="132" rx="14" className={s} strokeWidth="2"/><path d="M20 32h320" className={s} strokeWidth="1.5"/><path d="M132 32v104M248 32v104" className={s} strokeWidth="1.2"/>{tx(76,22,"Dàn ý",{bold:true,size:10})}{tx(190,22,"Bản nháp",{bold:true,size:10})}{tx(290,22,"Chỉnh sửa",{bold:true,size:10})}</svg>,
    agent: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["10","48","60","40","Mục tiêu"],["90","6","64","40","Duyệt web"],["90","94","64","40","Tệp"],["174","6","64","40","Ứng dụng"],["174","94","64","40","Mã"],["258","48","80","40","Hoàn tất"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+24,l,{bold:true,size:9})}</g>)}<path d="M70 68h20M122 46v48M154 26h20M154 114h20M238 26l20 40M238 114l20-40" className={s} strokeWidth="1.5"/></svg>,
    models: <svg viewBox="0 0 360 140" className={cls} style={{ color: col }}>{[["20","48","72","40","Tự động"],["116","4","72","40","Nhanh"],["116","96","72","40","Sâu"],["268","48","72","40","Pro"]].map(([x,y,w,h,l])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="10" className={s} strokeWidth="2"/>{tx(Number(x)+Number(w)/2,Number(y)+25,l,{bold:true,size:10})}</g>)}<path d="M92 68h24M188 24h80M188 116h80" className={s} strokeWidth="1.5"/><path d="M152 44v52" className={s} strokeWidth="1.5"/></svg>,
    privacy: <svg viewBox="0 0 360 150" className={cls} style={{ color: col }}><path d="M180 8l88 32v44c0 34-26 62-88 80-62-18-88-46-88-80V40l88-32z" className={s} strokeWidth="2"/><path d="M150 82l18 18 40-42" className={s} strokeWidth="2.2"/>{tx(180,142,"năng lực luôn cần ranh giới",{dim:true,size:9})}</svg>,
  };
  return V[type] || null;
}

/* ─────────────────────────────────────────────
   CÁC THÀNH PHẦN PHỤ
   ───────────────────────────────────────────── */
function FeatureCard({ title, ico, color, description, when }) {
  return (
    <div className="rounded-2xl border bg-white p-5 transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-4 w-4" style={{ color }} /></div>
        <span className="ff-display text-[15px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
      {when && <div className="mt-3 rounded-xl px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.cream, color: C.inkLight }}><span className="font-semibold" style={{ color: C.greenDeep }}>Khi nào dùng: </span>{when}</div>}
    </div>
  );
}

function MiniFeature({ title, ico, color, description }) {
  return (
    <div className="rounded-2xl border bg-white p-4 transition-shadow hover:shadow-sm" style={{ borderColor: C.border }}>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: color + "14" }}><Ico name={ico} className="h-3.5 w-3.5" style={{ color }} /></div>
        <span className="text-[13px] font-semibold" style={{ color: C.ink }}>{title}</span>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: C.inkLight }}>{description}</p>
    </div>
  );
}

function BeforeAfterBlock({ data }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.cream }}>
      <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Trước và Sau</div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-red-400">Yếu</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.before}</div>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Mạnh</div>
          <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{data.after}</div>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed" style={{ color: C.greenDeep }}>
        <Ico name="lightbulb" className="mt-0.5 h-3.5 w-3.5 shrink-0" /><span className="font-medium">{data.improvement}</span>
      </div>
    </div>
  );
}

function PromptExample({ prompt, why }) {
  return (
    <div className="rounded-xl border bg-white px-4 py-3" style={{ borderColor: C.borderLight }}>
      <div className="ff-mono break-words text-[12px] leading-relaxed" style={{ color: C.ink }}>{prompt}</div>
      <div className="mt-1.5 text-[11px] leading-snug" style={{ color: C.inkMuted }}>{why}</div>
    </div>
  );
}

function GuideSectionCard({ section, isExpanded, onToggle }) {
  return (
    <section id={section.id} className="scroll-mt-28 overflow-hidden rounded-2xl border bg-white shadow-sm transition-shadow duration-200 hover:shadow-md" style={{ borderColor: C.border }}>
      <button onClick={onToggle} className="flex w-full items-start gap-4 p-5 text-left md:items-center md:p-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: section.color }}><Ico name={section.ico} className="h-5 w-5" /></div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>{section.number} &middot; {section.level.charAt(0).toUpperCase() + section.level.slice(1)}</div>
          <h3 className="ff-display text-[17px] font-semibold leading-snug md:text-[19px]" style={{ color: C.ink }}>{section.title}</h3>
          {!isExpanded && <p className="clamp-2 mt-1 text-[13px] leading-relaxed" style={{ color: C.inkLight }}>{section.summary}</p>}
        </div>
        <Ico name="chevronDown" className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} style={{ color: C.inkMuted }} />
      </button>
      {isExpanded && (
        <div className="border-t px-5 pb-7 pt-6 md:px-6" style={{ borderColor: C.borderLight }}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <p className="text-[14px] leading-[1.8]" style={{ color: C.ink }}>{section.summary}</p>
              <div className="rounded-xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Vì sao điều này quan trọng</div>
                <p className="mt-2 text-[13px] leading-[1.75]" style={{ color: C.ink }}>{section.whyItMatters}</p>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.greenDeep }}>Bắt đầu từ đây</div>
                <div className="space-y-2.5">{section.beginnerMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="checkCircle" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.greenMid }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Nâng cao</div>
                <div className="space-y-2.5">{section.advancedMoves.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="arrowRight" className="mt-0.5 h-4 w-4 shrink-0" style={{ color: C.inkMuted }} /><span>{m}</span></div>)}</div>
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.roseAccent }}>Lỗi thường gặp</div>
                <div className="space-y-2.5">{section.commonMistakes.map((m, i) => <div key={i} className="flex gap-2.5 text-[13px] leading-relaxed" style={{ color: C.ink }}><Ico name="alertTriangle" className="mt-0.5 h-4 w-4 shrink-0 opacity-60" style={{ color: C.roseAccent }} /><span>{m}</span></div>)}</div>
              </div>
              <BeforeAfterBlock data={section.beforeAfter} />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl border p-4" style={{ borderColor: C.borderLight, backgroundColor: C.cream }}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Mô hình trực quan</div>
                <SectionVisual type={section.visual} />
              </div>
              <div>
                <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Ví dụ prompt</div>
                <div className="space-y-2.5">{section.promptExamples.map((p, i) => <PromptExample key={i} {...p} />)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* ─────────────────────────────────────────────
   PHẦN CHÍNH
   ───────────────────────────────────────────── */
export default function ChatGPTMasterGuide() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");
  const [expanded, setExpanded] = useState(new Set(["mental-model"]));
  const toggleSection = useCallback((id) => { setExpanded(p => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); }, []);
  const expandAll = useCallback(() => setExpanded(new Set(GUIDE_SECTIONS.map(s => s.id))), []);
  const collapseAll = useCallback(() => setExpanded(new Set()), []);

  const filteredSections = useMemo(() => GUIDE_SECTIONS.filter(s => {
    if (level !== "all" && s.level !== level) return false;
    if (!query.trim()) return true;
    return [s.title, s.summary, s.whyItMatters, ...s.beginnerMoves, ...s.advancedMoves, ...s.commonMistakes, ...s.promptExamples.map(p => p.prompt), s.beforeAfter.before, s.beforeAfter.after].join(" ").toLowerCase().includes(query.toLowerCase());
  }), [level, query]);

  const sectionsByLevel = useMemo(() => {
    const g = { foundation: [], core: [], power: [], expert: [] };
    filteredSections.forEach(s => g[s.level]?.push(s));
    return g;
  }, [filteredSections]);
  const levelLabels = { foundation: "Nền tảng", core: "Kỹ năng cốt lõi", power: "Tính năng nâng cao", expert: "Chuyên sâu" };

  return (
    <div className="ff-body min-h-screen" style={{ backgroundColor: C.cream, color: C.ink }}>
      <GlobalStyles />
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* HEADER */}
        <header className="overflow-hidden rounded-3xl border" style={{ borderColor: C.borderLight, background: `linear-gradient(135deg, ${C.greenLight} 0%, ${C.cream} 40%, ${C.creamDark} 100%)` }}>
          <div className="grid gap-6 p-6 md:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-widest" style={{ borderColor: C.borderLight, color: C.greenDeep }}><Ico name="bookOpen" className="h-3.5 w-3.5" /> Tài liệu thực hành</div>
              <h1 className="ff-display text-3xl font-medium leading-tight tracking-tight md:text-[44px] md:leading-tight" style={{ color: C.ink }}>Cẩm nang toàn diện về ChatGPT</h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.8]" style={{ color: C.inkLight }}>Mỗi công cụ dùng để làm gì, khi nào nên dùng và cách để đạt kết quả tốt hơn một cách rõ rệt. Tài liệu này được viết trước hết cho người dùng phổ thông, đồng thời vẫn có các phần đi sâu cho ai cần.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="lightbulb" className="h-3 w-3" style={{ color: C.greenMid }} /> Xác minh {VERIFIED_DATE}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium shadow-sm" style={{ color: C.inkLight }}><Ico name="layers" className="h-3 w-3" style={{ color: C.greenMid }} /> 16 phần &middot; hơn 60 prompt</span>
              </div>
            </div>
            <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: C.borderLight }}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>ChatGPT hiện nay có thể làm gì</div>
              <svg viewBox="0 0 420 190" className="w-full" style={{ color: C.greenDeep }}>
                {[["16","4","120","38","Trả lời","chat, tìm kiếm"],["150","4","120","38","Tổ chức","dự án, bộ nhớ"],["284","4","120","38","Tạo ra","canvas, hình ảnh"],["16","120","120","38","Học tập","học, ghi âm"],["150","120","120","38","Chia sẻ","nhóm, liên kết"],["284","120","120","38","Thực thi","tác vụ, agent"]].map(([x,y,w,h,l,sub])=><g key={l}><rect x={x} y={y} width={w} height={h} rx="9" className="fill-none stroke-current" strokeWidth="1.6"/><text x={Number(x)+Number(w)/2} y={Number(y)+18} textAnchor="middle" fill={C.greenDeep} style={{fontSize:10,fontWeight:600}}>{l}</text><text x={Number(x)+Number(w)/2} y={Number(y)+30} textAnchor="middle" fill={C.greenDeep} style={{fontSize:7,opacity:0.4}}>{sub}</text></g>)}
                <text x="210" y="84" textAnchor="middle" fill={C.greenDeep} style={{fontSize:9,fontWeight:600,opacity:0.25}}>toàn bộ hệ sinh thái</text>
                {[[136,23,150,23],[270,23,284,23],[76,42,76,120],[210,42,210,120],[344,42,344,120]].map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.greenDeep} strokeWidth="1" opacity="0.15"/>)}
              </svg>
            </div>
          </div>
        </header>

        {/* SIX PRINCIPLES */}
        <section className="mt-8">
          <div className="mb-4 text-[11px] font-semibold uppercase tracking-widest" style={{ color: C.inkMuted }}>Sáu nguyên tắc</div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[{ico:"penTool",t:"Hỏi thật rõ",d:"Mục tiêu, bối cảnh, ràng buộc, định dạng."},{ico:"layoutGrid",t:"Chọn đúng tầng",d:"Chat, dự án, canvas, tìm kiếm, agent."},{ico:"shield",t:"Xác minh khi cần",d:"Tìm kiếm cho nội dung hiện tại hoặc rủi ro cao."},{ico:"refreshCcw",t:"Sửa tiếp, đừng làm lại",d:"Kết quả tốt thường đến ở lượt thứ hai."},{ico:"bot",t:"Chuẩn hóa thứ hiệu quả",d:"Dự án, GPT, tác vụ hoặc kỹ năng."},{ico:"eye",t:"Dùng trực quan để nghĩ nhanh hơn",d:"Bảng, sơ đồ, ảnh chụp màn hình."}].map(({ico,t,d})=>(
              <div key={t} className="flex gap-3 rounded-2xl border bg-white p-4" style={{borderColor:C.border}}>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name={ico} className="h-4 w-4"/></div>
                <div><div className="text-[13px] font-semibold" style={{color:C.ink}}>{t}</div><div className="mt-0.5 text-[12px] leading-relaxed" style={{color:C.inkLight}}>{d}</div></div>
              </div>
            ))}
          </div>
        </section>

        {/* TOOL CHOOSER */}
        <section className="mt-8 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Bảng quyết định</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Bạn nên dùng công cụ nào?</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border" style={{borderColor:C.borderLight}}>
            <table className="min-w-full text-left text-[13px]">
              <thead><tr style={{backgroundColor:C.cream}}><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Mục tiêu của bạn</th><th className="whitespace-nowrap px-4 py-3 font-semibold" style={{color:C.ink}}>Công cụ phù hợp nhất</th><th className="hidden whitespace-nowrap px-4 py-3 font-semibold sm:table-cell" style={{color:C.ink}}>Vì sao</th></tr></thead>
              <tbody>{TOOL_CHOOSER.map((r,i)=><tr key={r.goal} style={{backgroundColor:i%2===0?"#fff":C.cream}}><td className="px-4 py-3 font-medium" style={{color:C.ink}}>{r.goal}</td><td className="whitespace-nowrap px-4 py-3"><span className="inline-flex items-center gap-1.5 font-semibold" style={{color:C.greenDeep}}><Ico name={r.ico} className="h-3.5 w-3.5"/>{r.tool}</span></td><td className="hidden px-4 py-3 sm:table-cell" style={{color:C.inkLight}}>{r.reason}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        {/* PROMPT FORMULA */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Mẫu prompt</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Sáu khối giúp mọi prompt tốt hơn</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PROMPT_BLOCKS.map((b,i)=><div key={b.label} className="rounded-xl border p-4" style={{borderColor:C.borderLight,backgroundColor:C.cream}}>
              <div className="mb-1.5 flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-md text-[10px] font-bold text-white" style={{backgroundColor:b.color}}>{i+1}</span><span className="text-[13px] font-semibold" style={{color:C.ink}}>{b.label}</span></div>
              <p className="ff-mono text-[11px] leading-relaxed" style={{color:C.inkLight}}>{b.example}</p>
            </div>)}
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Lớp tính năng</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Các công cụ cốt lõi của ChatGPT</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{CORE_FEATURES.map(f=><FeatureCard key={f.title} {...f}/>)}</div>
        </section>

        {/* ADDITIONAL */}
        <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm md:p-7" style={{borderColor:C.border}}>
          <div className="mb-5">
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Hay bị bỏ sót</div>
            <h2 className="ff-display mt-1 text-[22px] font-medium tracking-tight" style={{color:C.ink}}>Những tính năng mà đa số người dùng không để ý</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{ADDITIONAL_FEATURES.map(f=><MiniFeature key={f.title} {...f}/>)}</div>
        </section>

        {/* NAVIGATOR */}
        <section className="sticky top-0 z-20 mt-8 rounded-2xl border bg-white p-4 shadow-lg md:p-5" style={{borderColor:C.border}}>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative mr-auto">
              <Ico name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{color:C.inkMuted}}/>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Tìm kiếm..." className="w-full rounded-xl border py-2 pl-10 pr-3 text-[13px] outline-none sm:w-48" style={{borderColor:C.border,backgroundColor:C.cream}}/>
            </div>
            {LEVELS.map(l=><button key={l.key} onClick={()=>setLevel(l.key)} className="rounded-lg px-3 py-2 text-[11px] font-semibold uppercase tracking-wide transition-all" style={level===l.key?{backgroundColor:C.greenDeep,color:"#fff"}:{border:`1px solid ${C.border}`,color:C.inkLight}}>{l.label}</button>)}
            <button onClick={expandAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Mở tất cả</button>
            <button onClick={collapseAll} className="rounded-lg border px-2.5 py-2 text-[11px] font-medium" style={{borderColor:C.border,color:C.inkLight}}>Thu gọn</button>
          </div>
        </section>

        {/* GUIDE SECTIONS */}
        <main className="mt-8 space-y-10">
          {Object.entries(sectionsByLevel).map(([lev, sections]) => {
            if (!sections.length) return null;
            return (<div key={lev}>
              <div className="mb-4 flex items-center gap-3"><div className="h-px flex-1" style={{backgroundColor:C.border}}/><span className="whitespace-nowrap text-[12px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>{levelLabels[lev]}</span><div className="h-px flex-1" style={{backgroundColor:C.border}}/></div>
              <div className="space-y-4">{sections.map(s=><GuideSectionCard key={s.id} section={s} isExpanded={expanded.has(s.id)} onToggle={()=>toggleSection(s.id)}/>)}</div>
            </div>);
          })}
        </main>

        {/* SCOPE + TAKEAWAY */}
        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm" style={{borderColor:C.border}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.inkMuted}}>Phạm vi</div>
            <h3 className="ff-display mt-2 text-[18px] font-medium" style={{color:C.ink}}>Tài liệu này bao quát gì</h3>
            <div className="mt-4 space-y-2 text-[13px] leading-relaxed" style={{color:C.inkLight}}>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Tập trung vào tính năng phía người dùng, không đi vào quản trị doanh nghiệp.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Ưu tiên cách dùng thực tế hơn là trivia về sản phẩm.</div>
              <div className="rounded-xl px-4 py-2.5" style={{backgroundColor:C.cream}}>Tính năng khả dụng có thể khác nhau tùy gói và nền tảng.</div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-200 p-5 shadow-sm" style={{background:`linear-gradient(135deg, ${C.greenLight}, #F0FAF5)`}}>
            <div className="text-[11px] font-semibold uppercase tracking-widest" style={{color:C.greenDeep}}>Nâng cấp lớn nhất</div>
            <div className="mt-3 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white" style={{backgroundColor:C.greenDeep}}><Ico name="sparkles" className="h-5 w-5"/></div>
              <div>
                <div className="ff-display text-[16px] font-semibold" style={{color:C.greenDeep}}>Đừng chỉ hỏi "Làm sao để viết prompt tốt hơn?"</div>
                <p className="mt-2 text-[13px] leading-[1.75] opacity-80" style={{color:C.greenDeep}}>Hãy bắt đầu hỏi "Tầng nào của ChatGPT phù hợp nhất với công việc này?" Chỉ riêng sự thay đổi đó đã cải thiện kết quả nhiều hơn hầu hết mẹo viết prompt.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-8 overflow-hidden rounded-3xl p-6 text-white shadow-lg md:p-10" style={{background:"linear-gradient(135deg, #0A2A1F, #0D3B2E 40%, #143D30)"}}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-emerald-300">Tổng kết cuối cùng</div>
              <h2 className="ff-display mt-2 text-2xl font-medium tracking-tight md:text-[28px]">Thế nào là sử dụng thành thạo</h2>
              <p className="mt-4 max-w-xl text-[14px] leading-[1.85] text-emerald-100" style={{opacity:0.8}}>Chọn đúng chế độ. Mô tả công việc thật rõ. Xác minh điều quan trọng. Chỉnh sửa một cách thông minh. Biến thứ hiệu quả thành hệ thống có thể tái sử dụng. Người dùng giỏi nhất là những người tư duy rõ ràng và biết tận dụng AI.</p>
              <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              <br />
              Hướng dẫn sử dụng ChatGPT
              <br />
              © 2026 EugeneYip.com Bảo lưu mọi quyền. 
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[13px] font-semibold">Hãy tiếp tục kiểm tra lại</div>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12px] leading-relaxed text-emerald-200" style={{opacity:0.7}}>
                {["Năng lực","Giá","Ghi chú phát hành","Dự án","FAQ Bộ nhớ","Canvas","Tác vụ","Ứng dụng","Tìm kiếm","Nghiên cứu chuyên sâu","Chế độ học tập","Ghi âm","Liên kết chia sẻ","Nhóm","Kỹ năng","Agent","Giọng nói","FAQ Hình ảnh"].map(i=><div key={i} className="flex items-center gap-1.5"><div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400" style={{opacity:0.5}}/>{i}</div>)}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
