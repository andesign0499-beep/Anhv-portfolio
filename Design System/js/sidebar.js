// =========================================================================
// DE STUDIO DESIGN SYSTEM — LEFT SIDEBAR NAVIGATION CONTROLLER & DATA
// =========================================================================

    // 1. EXACT SIDEBAR DATA MODEL (Matching uploaded Figma screenshot 1:1)
    // =========================================================================
    const designSystemSections = [
      {
        id: 'foundations',
        title: 'FOUNDATIONS',
        collapsed: false,
        items: [
          { id: 'colors', name: 'Colors', hasCode: true, arrow: true, desc: 'Bộ màu trong suốt duy nhất (Light & Dark Mode) và nguyên tắc sử dụng màu chuẩn WCAG cho toàn bộ ứng dụng SaaS.' },
          { id: 'typography', name: 'Typography', hasCode: false, arrow: true, desc: 'Bộ kiểu chữ Inter chuẩn SaaS (Display 2xl → Text xxs), nguyên tắc phân cấp và tùy chỉnh kích thước trực tiếp.' },
          { id: 'icons', name: 'Icons', hasCode: false, arrow: true, desc: 'Bộ biểu tượng Feather 24×24px được lọc, đặt tên chuẩn SaaS và quản lý đầy đủ các trạng thái Component.' },
          { id: 'logos', name: 'Logos', hasCode: true, arrow: true, desc: 'Bộ nhận diện Logo De Studio (Ngang, Dọc, Icon màu/đen/trắng), quy chuẩn sử dụng, tải về SVG/PNG và thay thế bộ logo riêng.' },
          { id: 'effect-styles', name: 'Effect styles', hasCode: true, arrow: true, desc: 'Hệ thống đổ bóng Elevation (Shadow xs → 3xl) và hiệu ứng kính mờ Glassmorphism (Blurs sm → xl Light/Dark).' },
          { id: 'grids-spacing', name: 'Grids & Spacing', hasCode: true, arrow: true, desc: 'Hệ thống Khoảng cách chuẩn (1 → 64 | 4px → 256px) và Khung chứa Containers (sm → xl | 640px → 1,280px) quy đổi trên nền 16px.' }
        ]
      },
      {
        id: 'base-components',
        title: 'BASE COMPONENTS',
        collapsed: false,
        items: [
          { id: 'alert', name: 'Alert', hasCode: true, arrow: true, desc: 'Inline banners thông báo Success, Info, Warning và Error.' },
          { id: 'buttons', name: 'Buttons', hasCode: true, arrow: true, desc: 'Bộ Button chuẩn 4 biến thể × 4 trạng thái (Default/Hover/Focus/Disabled) × 5 kích thước 28/32/36/40/48px, chỉnh text & icon trái/phải trực tiếp.' },
          { id: 'button-group', name: 'Button Group', hasCode: true, arrow: true, desc: 'Nhóm nút liền kề (Text only, Icon + Text, Icon only) dùng cho thanh công cụ, mini-tab chuyển đổi và nút tách chuẩn SaaS.' },
          { id: 'badges', name: 'Badges', hasCode: true, arrow: true, desc: 'Bộ nhãn trạng thái 2 phong cách (Soft Outline & Solid Filled) × 8 nhóm màu × 5 kích thước (22, 26, 30, 32, 36px), bật/tắt icon 2 bên.' },
          { id: 'checkboxes', name: 'Checkboxes', hasCode: true, arrow: true, desc: 'Hộp kiểm Checkbox & Radio selector hỗ trợ vị trí icon Trái/Phải tiêu đề, mô tả phụ, Indeterminate và trạng thái Lỗi.' },
          { id: 'dropdowns', name: 'Dropdowns', hasCode: true, arrow: true, desc: 'Bộ Select 5 biến thể (Plain, Icon, Avatar, Status dot, Multi-Tags) × 5 trạng thái, Stepper số lượng và Account Action Menu.' },
          { id: 'filter-sort', name: 'Filter & Sort', hasCode: true, arrow: true, desc: 'Bộ lọc & Sắp xếp chuẩn SaaS: nút xóa nhanh, filter chips (Check/Checkbox/Radio), preset thời gian, bảng Report Filters và menu danh sách đa chế độ.' },
          { id: 'inputs-text-area', name: 'Inputs & Text Area', hasCode: true, arrow: true, desc: '8 biến thể ô nhập liệu & Text Area (Email, Icon, Phone, Currency, URL, Card, Textarea, Key Generator) × 3 trạng thái chuẩn.' },
          { id: 'player', name: 'Player', hasCode: true, arrow: true, desc: 'Video Player Dark Mode thích ứng 5 kích thước màn hình (XL Desktop, LG Laptop, MD Tablet, SM Portrait, XS Mobile) với thanh tua màu xanh thương hiệu.' },
          { id: 'progress-indicators', name: 'Progress indicators', hasCode: true, arrow: true, desc: 'Thanh tiến trình Linear (5 kiểu nhãn × 0–100%), Vòng tròn 360° & Bán nguyệt 180° (5 kích thước xxs–xl), đồng bộ màu từ Colors.' },
          { id: 'text-link', name: 'Text Link', hasCode: false, arrow: true, desc: 'Liên kết văn bản chuẩn SaaS: Inline, Standalone, Icon Link và các trạng thái Hover/Focus/Disabled.' },
          { id: 'toggles', name: 'Toggles', hasCode: true, arrow: true, desc: 'Công tắc Bật/Tắt (SM 36×20px & MD 44×24px) hỗ trợ vị trí Trái/Phải và 5 trạng thái (Default, Hover, Focus, Disabled, Error).' },
          { id: 'tooltips', name: 'Tooltips', hasCode: true, arrow: true, desc: 'Hộp gợi ý nổi Light & Dark (1 dòng & Kèm mô tả chi tiết) với 7 vị trí mũi tên và thử nghiệm di chuột trực tiếp.' },
          { id: 'search-filters', name: 'Search & Filters', hasCode: true, arrow: true, desc: 'Thanh Search + Filter Popover (Key type/State), Filter Chip nhỏ (Orange focus) và Multi-select Filter kèm badge đếm +N (Brand Blue).' }
        ]
      },
      {
        id: 'forms',
        title: 'FORMS',
        collapsed: false,
        items: [
          { id: 'dashboard', name: 'Dashboard', hasCode: true, arrow: true, desc: '10 module Analytics & Telemetry SaaS: Monthly Bars, Stacked Revenue, Platform Usage Breakdown, Empty State, Latency/Traffic Splines, Geo Map, Partner Correlation, Donut & TPS.' },
          { id: 'processing-upload', name: 'Processing - Upload', hasCode: true, arrow: true, desc: 'Khu vực kéo thả tệp, tiến trình tải lên và xử lý batch.' }
        ]
      },
      {
        id: 'marketing',
        title: 'MARKETING WEBSITE COMPONENTS',
        collapsed: false,
        items: [
          { id: 'header-navigation', name: 'Header navigation', hasCode: true, arrow: true, desc: '6 mẫu Page Header Navigation Responsive (Mobile 320/375/480, Tablet 768, Desktop Compact & Multi-Filter) kèm 3 trạng thái Default / Search Focus / Filter Drawer.' }
        ]
      },
      {
        id: 'application',
        title: 'APPLICATION COMPONENTS',
        collapsed: false,
        items: [
          { id: 'modals-popup', name: 'Modals Pop-up', hasCode: true, arrow: true, desc: '3 biến thể Pop-up Modal chuẩn Desktop & Mobile: Destructive/Error, Success/Share Link và Chọn thành viên nhóm.' },
          { id: 'navigation', name: 'Navigation', hasCode: true, arrow: true, desc: 'Sidebar Navigation 2 chế độ Thu gọn (64px Rail) & Mở rộng (260px) cho App Chính & Module Suite, Submenu, Disabled và Footer thông báo.' },
          { id: 'pagination', name: 'Pagination', hasCode: true, arrow: true, desc: '9 kiểu phân trang Dữ liệu/Bảng (SM/MD, Ellipsis, Page size, Go to page, Previous/Next) và Carousel Dot/Bar Indicators (Cam & Tối).' },
          { id: 'section-headers', name: 'Section headers', hasCode: true, arrow: true, desc: '6 mẫu Tiêu đề phân khu Responsive (Desktop & Mobile) kết hợp Badge đếm, Search & Filters, Button Group, Actions và Tabs.' },
          { id: 'tables', name: 'Tables', hasCode: true, arrow: true, desc: '10 biến thể Data Table SaaS (Logs, API Telemetry, Merchant Review, Moderation, Webhooks, Multi-Select, Processing) với ma trận trạng thái Default / Hover / Zebra.' }
        ]
      },
      {
        id: 'demo',
        title: 'DEMO',
        collapsed: false,
        items: [
          { id: 'login-demo', name: 'Login (SaaS)', hasCode: true, arrow: true, desc: 'Trang Đăng nhập & Đăng ký SaaS trên 3 ngưỡng Responsive. Đã có ứng dụng độc lập hoàn chỉnh tại DeSaaS.html.' },
          { id: 'demo-history', name: 'History (SaaS)', hasCode: true, arrow: true, desc: 'Trang Lịch sử Phát hiện & Xử lý Media trên 3 ngưỡng Responsive. Đã có ứng dụng độc lập hoàn chỉnh tại DeSaaS.html.' },
          { id: 'demo-dashboard', name: 'Dashboard - Home', hasCode: true, arrow: true, desc: 'Trang Dashboard De Studio Multi-DRM trên 3 ngưỡng Responsive. Đã có ứng dụng độc lập hoàn chỉnh tại DeSaaS.html.' },
          { id: 'demo-merchant-modal', name: 'Merchant Modal', hasCode: true, arrow: true, desc: 'Form Popup cấu hình Merchant (Merchant ID, DRM Schemes, Fingerprint, Observer, Key Rotation & Datepickers) trên Desktop Modal, Tablet Modal và Mobile Drawer theo chuẩn De Studio.' }
        ]
      }
    ];

    // =========================================================================

    // 4. RENDER SIDEBAR
    // =========================================================================
    function getAllPages() {
      const list = [];
      designSystemSections.forEach(sec => {
        sec.items.forEach(item => {
          list.push({ ...item, sectionId: sec.id, sectionTitle: sec.title });
        });
      });
      return list;
    }

    function findPageById(id) {
      return getAllPages().find(p => p.id === id) || getAllPages()[0];
    }
    window.getAllPages = getAllPages;
    window.findPageById = findPageById;

    function renderSidebar() {
      const nav = document.getElementById('sidebarNav');
      const query = (document.getElementById('pageSearchInput')?.value || '').trim().toLowerCase();
      let totalVisible = 0;
      let totalPages = 0;
      let totalCodeReady = 0;

      let html = '';
      designSystemSections.forEach(sec => {
        totalPages += sec.items.length;
        totalCodeReady += sec.items.filter(i => i.hasCode).length;

        const filteredItems = sec.items.filter(item => {
          const localizedTitle = typeof t === 'function' ? t(sec.id, sec.title) : sec.title;
        const localizedName = typeof t === 'function' ? t(item.id, item.name) : item.name;
        const matchesQuery = !query || localizedName.toLowerCase().includes(query) || localizedTitle.toLowerCase().includes(query);
          const matchesCode = !codeOnlyFilter || item.hasCode;
          return matchesQuery && matchesCode;
        });

        if (query && filteredItems.length === 0) return;

        totalVisible += filteredItems.length;
        const isCollapsed = !query && sec.collapsed;

        html += `
          <div class="nav-section">
            <div class="section-header" onclick="toggleSection('${sec.id}')">
              <span class="section-diamond">${SVG_DIAMOND}</span>
              <span class="section-title">${typeof t === "function" ? t(sec.id, sec.title) : sec.title}</span>
              <span class="section-count">${filteredItems.length}</span>
            </div>
            <div class="section-items ${isCollapsed ? 'collapsed' : ''}">
              ${filteredItems.map(item => `
                <div class="nav-item ${item.id === activePageId ? 'active' : ''} ${item.arrow ? '' : 'no-arrow'}"
                     onclick="selectPage('${item.id}')"
                     title="${typeof t === "function" ? t(item.id, item.name) : item.name}${item.hasCode ? (typeof t === "function" ? t(" (Code Standardized)", " (Code Standardized)") : " (Code Standardized)") : ""}">
                  <div class="nav-item-left">
                    ${item.arrow ? `<span class="nav-branch-arrow">${SVG_BRANCH_ARROW}</span>` : ''}
                    <span class="nav-label">${typeof t === "function" ? t(item.id, item.name) : item.name}</span>
                  </div>
                  <div class="nav-item-right">
                    ${item.hasCode ? `<span class="code-badge">&lt;/&gt;</span>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      });

      if (!html) {
        html = `<div style="padding:24px 12px; text-align:center; color:var(--text-muted); font-size:12px;">Không tìm thấy trang phù hợp.</div>`;
      }

      nav.innerHTML = html;
      if (uiLang === 'en' && typeof translateDOMSubtree === 'function') {
        translateDOMSubtree(nav, false);
      }
      document.getElementById('pageCountLabel').textContent = `${totalVisible} / ${totalPages} pages`;
      document.getElementById('footerStats').textContent = `${totalPages} pages • ${totalCodeReady} code-ready`;
    }

    function toggleSection(sectionId) {
      const sec = designSystemSections.find(s => s.id === sectionId);
      if (sec) {
        sec.collapsed = !sec.collapsed;
        renderSidebar();
      }
    }

    function toggleSidebarSearch() {
      const box = document.getElementById('sidebarSearchBox');
      const btn = document.getElementById('toggleSearchBtn');
      box.classList.toggle('open');
      btn.classList.toggle('active');
      if (box.classList.contains('open')) {
        setTimeout(() => document.getElementById('pageSearchInput').focus(), 50);
      } else {
        document.getElementById('pageSearchInput').value = '';
        renderSidebar();
      }
    }

    function toggleCodeOnlyFilter() {
      codeOnlyFilter = !codeOnlyFilter;
      document.getElementById('codeOnlyBtn').classList.toggle('active', codeOnlyFilter);
      renderSidebar();
    }

    function selectPage(pageId) {
      activePageId = pageId;
      if (currentViewMode === 'ai-canvas') {
        currentViewMode = 'preview';
        updateModeTabs();
      }
      renderSidebar();
      renderCanvas();
      updateAIContext();
    }

    // =========================================================================
