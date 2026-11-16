// =========================================================================
// DE STUDIO DESIGN SYSTEM — CENTRALIZED BILINGUAL I18N DICTIONARY & ENGINE
// =========================================================================

const UI_LANG_STORAGE_KEY = 'de_studio_ui_lang_v1';

let uiLang = (() => {
  try {
    const saved = localStorage.getItem(UI_LANG_STORAGE_KEY);
    return saved === 'vi' ? 'vi' : 'en';
  } catch (e) {
    return 'en';
  }
})();

// Master bilingual dictionary: English & Vietnamese
const I18N_DICT = {
  en: {
    // Topbar & Global
    'brand.name': 'De Studio',
    'nav.design_canvas': 'Design Canvas',
    'nav.spec_tokens': 'Spec & Tokens',
    'nav.html_code': 'HTML / Code',
    'nav.ai_output': 'AI UI Output',
    'btn.copy_html': 'Copy HTML',
    'btn.ai_studio': 'AI Studio',
    'btn.download_html': 'Download HTML',
    'btn.reset_default': 'Reset to Default',
    'sidebar.pages': 'Pages',
    'sidebar.search_placeholder': 'Search page or component...',
    'sidebar.code_only': 'Code Only',
    'sidebar.stats': '32 pages • 29 code-ready',
    'status.code_ready': '</> Code Standardized',
    'status.blueprint': 'Design Blueprint',

    // Section Titles
    'foundations': 'FOUNDATIONS',
    'base-components': 'BASE COMPONENTS',
    'forms': 'FORMS',
    'marketing': 'MARKETING WEBSITE COMPONENTS',
    'application': 'APPLICATION COMPONENTS',
    'demo': 'DEMO',

    // Page Names
    'colors': 'Colors',
    'typography': 'Typography',
    'icons': 'Icons',
    'logos': 'Logos',
    'effect-styles': 'Effect styles',
    'grids-spacing': 'Grids & Spacing',
    'alert': 'Alert',
    'buttons': 'Buttons',
    'button-group': 'Button Group',
    'badges': 'Badges',
    'checkboxes': 'Checkboxes',
    'dropdowns': 'Dropdowns',
    'filter-sort': 'Filter & Sort',
    'inputs-text-area': 'Inputs & Text Area',
    'player': 'Player',
    'progress-indicators': 'Progress indicators',
    'text-link': 'Text Link',
    'toggles': 'Toggles',
    'tooltips': 'Tooltips',
    'search-filters': 'Search & Filters',
    'dashboard': 'Dashboard - Home',
    'processing-upload': 'Processing - Upload',
    'header-navigation': 'Header navigation',
    'modals-popup': 'Modals Pop-up',
    'navigation': 'Navigation',
    'pagination': 'Pagination',
    'section-headers': 'Section headers',
    'tables': 'Tables',
    'login-demo': 'Login',
    'demo-history': 'History',
    'demo-dashboard': 'Dashboard - Home',
    'demo-merchant-modal': 'Merchant Modal',

    // Telemetry Dashboard
    'dash.title': 'Dashboard',
    'dash.media_suite': 'Media Protection Suite',
    'dash.apps': 'APPS',
    'dash.users': 'USERS',
    'dash.protected': 'PROTECTED CONTENT',
    'dash.merchants': 'MERCHANTS',
    'dash.vs_last_month': 'vs last month',
    'dash.license': 'LICENSE',
    'dash.filter_period': 'Filter by period',
    'dash.refresh_5m': 'Refresh every 5 mins',
    'dash.last_updated': 'Last updated: Today 15:29',
    'dash.license_per_drm': 'LICENSE PER DRM SCHEME',
    'dash.devices': 'Devices',
    'dash.ip_address': 'IP Address',
    'dash.total_requests': 'TOTAL LICENSE REQUEST',
    'dash.average_latency': 'AVERAGE LATENCY BY DRM',
    'dash.license_deliveries': 'LICENSE DELIVERIES',
    'dash.top_assets': 'TOP 10 ASSETS BY LICENSE REQUEST',
    'dash.location_ranking': 'LOCATION RANKING',
    'dash.succeeded': 'Succeeded',
    'dash.denied': 'Denied',
    'dash.failed': 'Failed',
    'dash.rate': 'Rate',
    'dash.total': 'Total',

    // History Demo
    'hist.title': 'History',
    'hist.search': 'Search ...',
    'hist.select_merchant': 'Select merchant',
    'hist.new_detection': 'New detection',
    'hist.all': 'All',
    'hist.processing': 'Processing',
    'hist.completed': 'Completed',
    'hist.processing_queue': 'Processing ...',
    'hist.history_table': 'History',
    'hist.date': 'DATE',
    'hist.total_col': 'Total',
    'hist.queuing': 'Queuing...',

    // Merchant Modal
    'mc.title': 'Merchant configuration',
    'mc.id_label': 'Merchant ID',
    'mc.name_label': 'Merchant name',
    'mc.scheme_label': 'DRM scheme',
    'mc.rotation_label': 'Max key rotation',
    'mc.status_label': 'Status',
    'mc.status_disable': 'Disable',
    'mc.status_enable': 'Enable',
    'mc.status_poc': 'POC',
    'mc.start': 'Start',
    'mc.end': 'End',
    'mc.cancel': 'Cancel',
    'mc.create': 'Create',
    'mc.update': 'Update',

    // Guidelines
    'guide.dos': 'Best Practices',
    'guide.donts': 'Pitfalls'
  },

  vi: {
    // Topbar & Global
    'brand.name': 'Dế Studio',
    'nav.design_canvas': 'Khung Thiết Kế',
    'nav.spec_tokens': 'Thông số & Token',
    'nav.html_code': 'Mã nguồn HTML',
    'nav.ai_output': 'Kết quả AI UI',
    'btn.copy_html': 'Sao chép HTML',
    'btn.ai_studio': 'AI Studio',
    'btn.download_html': 'Tải HTML',
    'btn.reset_default': 'Khôi phục mặc định',
    'sidebar.pages': 'Trang',
    'sidebar.search_placeholder': 'Tìm trang hoặc thành phần...',
    'sidebar.code_only': 'Chỉ hiện có Code',
    'sidebar.stats': '32 trang • 29 chuẩn Code',
    'status.code_ready': '</> Chuẩn Code UI',
    'status.blueprint': 'Bản nháp Thiết kế',

    // Section Titles
    'foundations': 'NỀN TẢNG',
    'base-components': 'THÀNH PHẦN CƠ SỞ',
    'forms': 'BIỂU MẪU SAAS',
    'marketing': 'THÀNH PHẦN MARKETING',
    'application': 'THÀNH PHẦN ỨNG DỤNG',
    'demo': 'MẪU GIAO DIỆN DEMO',

    // Page Names
    'colors': 'Màu sắc (Colors)',
    'typography': 'Kiểu chữ (Typography)',
    'icons': 'Biểu tượng (Icons)',
    'logos': 'Logo thương hiệu',
    'effect-styles': 'Đổ bóng & Kính mờ',
    'grids-spacing': 'Lưới & Khoảng cách',
    'alert': 'Thông báo Alert',
    'buttons': 'Nút bấm (Buttons)',
    'button-group': 'Nhóm nút (Button Group)',
    'badges': 'Huy hiệu (Badges)',
    'checkboxes': 'Hộp kiểm & Radio',
    'dropdowns': 'Menu thả (Dropdowns)',
    'filter-sort': 'Bộ lọc & Sắp xếp',
    'inputs-text-area': 'Ô nhập & Văn bản',
    'player': 'Trình phát Video Player',
    'progress-indicators': 'Tiến trình (Progress)',
    'text-link': 'Liên kết văn bản',
    'toggles': 'Công tắc (Toggles)',
    'tooltips': 'Gợi ý nổi (Tooltips)',
    'search-filters': 'Tìm kiếm & Bộ lọc',
    'dashboard': 'Dashboard - Home (Forms)',
    'processing-upload': 'Xử lý & Tải lên',
    'header-navigation': 'Điều hướng Header',
    'modals-popup': 'Cửa sổ nổi (Modals)',
    'navigation': 'Điều hướng Sidebar & Rail',
    'pagination': 'Phân trang dữ liệu',
    'section-headers': 'Tiêu đề phân khu',
    'tables': 'Bảng dữ liệu (Tables)',
    'login-demo': 'Đăng nhập & Đăng ký',
    'demo-history': 'Lịch sử bảo vệ media',
    'demo-dashboard': 'Dashboard - Home',
    'demo-merchant-modal': 'Cấu hình Merchant Modal',

    // Telemetry Dashboard
    'dash.title': 'Bảng Điều Khiển',
    'dash.media_suite': 'Hệ sinh thái Bảo vệ Media',
    'dash.apps': 'ỨNG DỤNG',
    'dash.users': 'NGƯỜI DÙNG',
    'dash.protected': 'NỘI DUNG BẢO VỆ',
    'dash.merchants': 'ĐỐI TÁC MERCHANT',
    'dash.vs_last_month': 'so với tháng trước',
    'dash.license': 'CẤP PHÉP BẢN QUYỀN',
    'dash.filter_period': 'Lọc theo kỳ',
    'dash.refresh_5m': 'Làm mới mỗi 5 phút',
    'dash.last_updated': 'Cập nhật: Hôm nay 15:29',
    'dash.license_per_drm': 'BẢN QUYỀN THEO HỆ THỐNG DRM',
    'dash.devices': 'Thiết bị',
    'dash.ip_address': 'Địa chỉ IP',
    'dash.total_requests': 'TỔNG YÊU CẦU CẤP PHÉP',
    'dash.average_latency': 'ĐỘ TRỄ TRUNG BÌNH THEO DRM',
    'dash.license_deliveries': 'PHÂN PHỐI BẢN QUYỀN',
    'dash.top_assets': 'TOP 10 TÀI NGUYÊN ĐƯỢC YÊU CẦU',
    'dash.location_ranking': 'XẾP HẠNG THEO KHU VỰC',
    'dash.succeeded': 'Thành công',
    'dash.denied': 'Từ chối',
    'dash.failed': 'Thất bại',
    'dash.rate': 'Tỷ lệ',
    'dash.total': 'Tổng số',

    // History Demo
    'hist.title': 'Lịch sử',
    'hist.search': 'Tìm kiếm ...',
    'hist.select_merchant': 'Chọn đối tác',
    'hist.new_detection': 'Phát hiện mới',
    'hist.all': 'Tất cả',
    'hist.processing': 'Đang xử lý',
    'hist.completed': 'Đã hoàn tất',
    'hist.processing_queue': 'Hàng đợi xử lý ...',
    'hist.history_table': 'Lịch sử',
    'hist.date': 'THỜI GIAN',
    'hist.total_col': 'Tổng',
    'hist.queuing': 'Đang xếp hàng...',

    // Merchant Modal
    'mc.title': 'Cấu hình đối tác Merchant',
    'mc.id_label': 'Mã đối tác (Merchant ID)',
    'mc.name_label': 'Tên đối tác (Merchant name)',
    'mc.scheme_label': 'Hệ thống DRM',
    'mc.rotation_label': 'Số lần xoay khóa tối đa',
    'mc.status_label': 'Trạng thái',
    'mc.status_disable': 'Vô hiệu hóa',
    'mc.status_enable': 'Kích hoạt',
    'mc.status_poc': 'Thử nghiệm (POC)',
    'mc.start': 'Bắt đầu',
    'mc.end': 'Kết thúc',
    'mc.cancel': 'Hủy',
    'mc.create': 'Tạo mới',
    'mc.update': 'Cập nhật',

    // Guidelines
    'guide.dos': 'Nên làm (Best Practices)',
    'guide.donts': 'Cần tránh (Pitfalls)'
  }
};

/**
 * Universal bilingual translation helper.
 * Supports both:
 * 1. t(key, fallback): looks up key in I18N_DICT
 * 2. t(viText, enText): returns viText if vi, enText if en
 */
function t(first, second) {
  if (!first && first !== 0) return '';
  // 1. Check if first is a registered key in current language
  const currentDict = I18N_DICT[uiLang] || I18N_DICT['en'];
  if (currentDict && currentDict[first] !== undefined) {
    return currentDict[first];
  }
  // 2. Fallback to English dictionary for the key
  const enDict = I18N_DICT['en'];
  if (enDict && enDict[first] !== undefined) {
    return enDict[first];
  }
  // 3. If second is provided and first is not a dictionary key, treat as inline bilingual t(viText, enText)
  if (second !== undefined) {
    return uiLang === 'en' ? second : first;
  }
  return first;
}

function getUILanguage() {
  return uiLang;
}

function setUILanguage(lang) {
  const next = lang === 'vi' ? 'vi' : 'en';
  uiLang = next;
  try {
    localStorage.setItem(UI_LANG_STORAGE_KEY, uiLang);
  } catch (e) {}

  applyUILanguageToChrome();

  if (typeof renderSidebar === 'function') renderSidebar();
  if (typeof renderCanvas === 'function') renderCanvas();
  if (typeof updateAIContext === 'function') updateAIContext();

  const toastMsg = uiLang === 'en' ? 'Language switched to English' : 'Đã chuyển ngôn ngữ sang Tiếng Việt';
  if (typeof showToast === 'function') showToast(toastMsg);
}

function toggleUILanguage() {
  setUILanguage(uiLang === 'en' ? 'vi' : 'en');
}

function applyUILanguageToChrome() {
  const isEn = uiLang === 'en';
  document.documentElement.lang = isEn ? 'en' : 'vi';

  const pillEn = document.getElementById('langPillEn');
  const pillVi = document.getElementById('langPillVi');
  if (pillEn && pillVi) {
    pillEn.classList.toggle('active', isEn);
    pillVi.classList.toggle('active', !isEn);
  }

  // Header Nav Mode Tabs
  const tabCanvas = document.querySelector('[data-view="preview"]');
  if (tabCanvas) tabCanvas.innerHTML = tabCanvas.innerHTML.replace(/(<\/svg>).+$/, `$1 ${t('nav.design_canvas')}`);

  const tabTokens = document.querySelector('[data-view="tokens"]');
  if (tabTokens) tabTokens.innerHTML = tabTokens.innerHTML.replace(/(<\/svg>).+$/, `$1 ${t('nav.spec_tokens')}`);

  const tabCode = document.querySelector('[data-view="code"]');
  if (tabCode) tabCode.innerHTML = tabCode.innerHTML.replace(/(<\/svg>).+$/, `$1 ${t('nav.html_code')}`);

  const tabAI = document.querySelector('[data-view="ai-canvas"]');
  if (tabAI) tabAI.innerHTML = tabAI.innerHTML.replace(/(<\/svg>).+$/, `$1 ${t('nav.ai_output')}`);

  // Sidebar Controls
  const pageSearch = document.getElementById('pageSearchInput');
  if (pageSearch) pageSearch.placeholder = t('sidebar.search_placeholder');

  const codeOnlyBtn = document.getElementById('codeOnlyBtn');
  if (codeOnlyBtn) {
    codeOnlyBtn.innerHTML = `
      <span style="color: var(--code-green); font-family: var(--font-mono); font-weight: 700;">&lt;/&gt;</span>
      ${t('sidebar.code_only')}
    `;
  }
}

// Export to window / global
const _root = typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : this);
_root.I18N_DICT = I18N_DICT;
_root.t = t;
_root.uiLang = uiLang;
_root.getUILanguage = getUILanguage;
_root.setUILanguage = setUILanguage;
_root.toggleUILanguage = toggleUILanguage;
_root.applyUILanguageToChrome = applyUILanguageToChrome;
if (typeof window !== 'undefined') {
  window.I18N_DICT = I18N_DICT;
  window.t = t;
  window.uiLang = uiLang;
  window.getUILanguage = getUILanguage;
  window.setUILanguage = setUILanguage;
  window.toggleUILanguage = toggleUILanguage;
  window.applyUILanguageToChrome = applyUILanguageToChrome;
}
