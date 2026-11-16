function renderMerchantModalPage() {
  return `
    <div class="dmm-sheet">
      <div class="colors-topbar">
        <span class="effects-count-pill">${t('3 Kích thước Popup chuẩn: Desktop Dialog (620px) • Tablet Dialog (520px) • Mobile Fullscreen Drawer (380px)', '3 Standard Popup Sizes: Desktop Dialog (620px) • Tablet Dialog (520px) • Mobile Fullscreen Drawer (380px)')}</span>
        <div class="colors-topbar-actions">
          <a href="DeSaaS.html#merchant-modal" target="_blank" class="btn-ds primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            🚀 ${t('Mở trong DeSaaS App', 'Open in DeSaaS App')}
          </a>
          <button type="button" class="btn-ds" onclick="resetMerchantModalForm()">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
            </svg>
            ${t('Khôi phục mặc định', 'Reset Defaults')}
          </button>
          <button type="button" class="btn-ds" onclick="copySnippetToClipboard(buildMerchantModalHTMLSnippet())">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            ${t('Sao chép HTML', 'Copy HTML')}
          </button>
        </div>
      </div>

      <!-- Controls Card -->
      <div class="dmm-toolbar-card">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;">
          <div>
            <h1 style="font-size:24px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;margin:0 0 6px 0;">
              ${t('Merchant Multi-DRM Configuration — Form Popup &amp; Drawer Suite', 'Merchant Multi-DRM Configuration — Form Popup &amp; Drawer Suite')}
            </h1>
            <p style="font-size:13px;color:var(--text-secondary);max-width:880px;line-height:1.55;margin:0;">
              ${t('Cấu hình đối tác phát sóng toàn diện (Merchant ID, DRM Schemes, Browser Fingerprint, Multi-Screen Guard, Active Stream Observer, Forensic Watermark, Key Rotation &amp; License Schedule) theo chuẩn Design System, đồng bộ trực tiếp với DeSaaS.html.', 'Comprehensive Merchant Multi-DRM popup (Merchant ID, DRM Schemes, Browser Fingerprint, Multi-Screen Guard, Active Stream Observer, Forensic Watermark, Key Rotation &amp; License Schedule) synchronized with DeSaaS.html.')}
            </p>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <span class="badge-ds badge-green" style="font-size:11.5px;padding:4px 10px;">
              <span class="badge-dot"></span> 8pt / 4pt Spatial Grid &amp; WCAG AA 100%
            </span>
          </div>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:12px;border-top:1px solid #f1f5f9;">
          <div class="btn-ds-seg">
            <button type="button" class="${merchantModalState.viewMode === 'matrix' ? 'active' : ''}" onclick="setMerchantModalProp('viewMode','matrix')">
              ${t('Xem đầy đủ 3 màn hình (Desktop + Tablet + Mobile)', 'Compare All 3 Viewports (Desktop + Tablet + Mobile)')}
            </button>
            <button type="button" class="${merchantModalState.viewMode === 'interactive' ? 'active' : ''}" onclick="setMerchantModalProp('viewMode','interactive')">
              ${t('Thử nghiệm 1 màn hình', 'Single Viewport Interactive')}
            </button>
          </div>
          ${merchantModalState.viewMode === 'interactive' ? `
            <div class="btn-ds-seg">
              <button type="button" class="${merchantModalState.liveBp === 'desktop' ? 'active' : ''}" onclick="setMerchantModalProp('liveBp','desktop')">Desktop (≥1024px)</button>
              <button type="button" class="${merchantModalState.liveBp === 'tablet' ? 'active' : ''}" onclick="setMerchantModalProp('liveBp','tablet')">Tablet (601–1023px)</button>
              <button type="button" class="${merchantModalState.liveBp === 'mobile' ? 'active' : ''}" onclick="setMerchantModalProp('liveBp','mobile')">Mobile (≤600px)</button>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Preview Section -->
      ${merchantModalState.viewMode === 'matrix' ? `
        <!-- 1. DESKTOP DIALOG MODAL -->
        <div class="dmm-device-card">
          <div class="dmm-device-head">
            <div style="display:flex;align-items:center;gap:8px;">
              <strong style="font-size:14px;color:var(--text-primary);">${t('1. Desktop Dialog Modal (Kích thước lớn ≥1024px)', '1. Desktop Dialog Modal (Large Viewport ≥1024px)')}</strong>
              <span class="dmm-vp-chip">Modal 620px • 2 Cột • Backdrop mờ</span>
            </div>
          </div>
          ${renderMerchantModalViewportFrame('desktop')}
        </div>

        <!-- 2. TABLET DIALOG MODAL -->
        <div class="dmm-device-card">
          <div class="dmm-device-head">
            <div style="display:flex;align-items:center;gap:8px;">
              <strong style="font-size:14px;color:var(--text-primary);">${t('2. Tablet Dialog Modal (Kích thước trung bình 601–1023px)', '2. Tablet Dialog Modal (Tablet Viewport 601–1023px)')}</strong>
              <span class="dmm-vp-chip">Modal 520px • Tối ưu cảm ứng</span>
            </div>
          </div>
          ${renderMerchantModalViewportFrame('tablet')}
        </div>

        <!-- 3. MOBILE FULLSCREEN DRAWER -->
        <div class="dmm-device-card">
          <div class="dmm-device-head">
            <div style="display:flex;align-items:center;gap:8px;">
              <strong style="font-size:14px;color:var(--text-primary);">${t('3. Mobile Fullscreen Drawer (Màn hình điện thoại ≤600px)', '3. Mobile Fullscreen Drawer (Mobile Viewport ≤600px)')}</strong>
              <span class="dmm-vp-chip">App Bar • 1 Cột Xếp Tầng • Nút Update Dưới Cùng</span>
            </div>
          </div>
          ${renderMerchantModalViewportFrame('mobile')}
        </div>
      ` : `
        <!-- INTERACTIVE SINGLE VIEWPORT -->
        <div class="dmm-device-card">
          <div class="dmm-device-head">
            <div style="display:flex;align-items:center;gap:8px;">
              <strong style="font-size:14px;color:var(--text-primary);">
                ${merchantModalState.liveBp === 'desktop' ? t('Chế độ Desktop Modal (≥1024px)', 'Desktop Modal Mode (≥1024px)') :
                  merchantModalState.liveBp === 'tablet' ? t('Chế độ Tablet Modal (601–1023px)', 'Tablet Modal Mode (601–1023px)') :
                  t('Chế độ Mobile Fullscreen Drawer (≤600px)', 'Mobile Fullscreen Drawer Mode (≤600px)')}
              </strong>
            </div>
          </div>
          ${renderMerchantModalViewportFrame(merchantModalState.liveBp)}
        </div>
      `}
    </div>
  `;
}

function renderMerchantModalViewportFrame(viewport) {
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const isFilled = Boolean(merchantModalState.merchantId && merchantModalState.merchantName);

  if (isMobile) {
    return `
      <div class="dmm-mobile-stage">
        <div class="dmm-mobile-frame">
          <!-- MOBILE TOP APP BAR -->
          <div class="dmm-mobile-appbar">
            <button type="button" class="dmm-appbar-back" onclick="resetMerchantModalForm()" title="Back">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
            </button>
            <span class="dmm-appbar-title">Merchant Multi-DRM Config</span>
          </div>

          <!-- MOBILE FORM BODY -->
          <div class="dmm-mobile-body">
            <!-- ${t("mc.id_label")} -->
            <div class="dmm-field-group">
              <label class="dmm-label">Merchant ID <span class="dmm-req">*</span></label>
              <input type="text" class="dmm-input" placeholder="e.g. MRC-NORTHWIND-01" value="${merchantModalState.merchantId}" oninput="setMerchantModalProp('merchantId', this.value)">
            </div>

            <!-- Merchant Name -->
            <div class="dmm-field-group">
              <label class="dmm-label">Merchant Name <span class="dmm-req">*</span></label>
              <input type="text" class="dmm-input" placeholder="e.g. Northwind Media" value="${merchantModalState.merchantName}" oninput="setMerchantModalProp('merchantName', this.value)">
            </div>

            <!-- ${t("mc.scheme_label")} Grouped Card -->
            <div class="dmm-field-group">
              <label class="dmm-label">DRM Protection Scheme <span class="dmm-req">*</span></label>
              <div class="dmm-grouped-card">
                <div class="dmm-group-check-row" onclick="setMerchantModalProp('drmMulti', !merchantModalState.drmMulti)">
                  <input type="checkbox" class="dmm-check-input" ${merchantModalState.drmMulti ? 'checked' : ''} onclick="event.stopPropagation(); setMerchantModalProp('drmMulti', this.checked)">
                  <span class="dmm-check-text">Multi-DRM (Widevine / FairPlay)</span>
                </div>
                <div class="dmm-group-check-row" onclick="setMerchantModalProp('drmSigma', !merchantModalState.drmSigma)">
                  <input type="checkbox" class="dmm-check-input" ${merchantModalState.drmSigma ? 'checked' : ''} onclick="event.stopPropagation(); setMerchantModalProp('drmSigma', this.checked)">
                  <span class="dmm-check-text">PlayReady SL3000 &amp; CENC</span>
                </div>
              </div>
            </div>

            <!-- 4-Row Grouped Toggle Card -->
            <div class="dmm-grouped-card">
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('fingerprint', !merchantModalState.fingerprint)">
                <span class="dmm-toggle-label">Browser &amp; Device Fingerprint</span>
                <div class="dmm-switch ${merchantModalState.fingerprint ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('multiscreen', !merchantModalState.multiscreen)">
                <span class="dmm-toggle-label">Multi-Screen Concurrency Guard</span>
                <div class="dmm-switch ${merchantModalState.multiscreen ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('activeObserver', !merchantModalState.activeObserver)">
                <span class="dmm-toggle-label">Active Stream Telemetry Observer</span>
                <div class="dmm-switch ${merchantModalState.activeObserver ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('watermarking', !merchantModalState.watermarking)">
                <span class="dmm-toggle-label">A/B Forensic Watermarking</span>
                <div class="dmm-switch ${merchantModalState.watermarking ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- MOBILE FOOTER BUTTON -->
          <div class="dmm-mobile-foot">
            <button type="button" class="dmm-mobile-update-btn ${isFilled ? 'is-ready' : ''}" onclick="submitMerchantForm()">${t("mc.update")}</button>
          </div>
        </div>
      </div>
    `;
  }

  // Desktop / Tablet Modal
  const modalClass = isTablet ? 'dmm-modal is-tablet' : 'dmm-modal';

  return `
    <div class="dmm-stage">
      <div class="${modalClass}">
        <!-- MODAL HEADER -->
        <div class="dmm-modal-head">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div style="display:flex;align-items:center;gap:12px;">
              ${typeof findLogoItem === 'function' ? renderLogoMarkup(findLogoItem('logo-mark-color') || findLogoItem('logo-horizontal'), 'width:24px;height:24px;display:block;') : ''}
              <h2 class="dmm-modal-title">Merchant Multi-DRM Configuration</h2>
            </div>
            <button type="button" class="dmm-appbar-back" onclick="resetMerchantModalForm()" title="Close" style="width:28px;height:28px;min-height:28px;font-size:16px;">✕</button>
          </div>
        </div>

        <!-- MODAL FORM BODY -->
        <div class="dmm-modal-body">
          <!-- ROW 1: ${t("mc.id_label")} & Merchant Name -->
          <div class="dmm-form-row-2col">
            <div class="dmm-field-group">
              <label class="dmm-label">Merchant ID <span class="dmm-req">*</span></label>
              <input type="text" class="dmm-input" placeholder="e.g. MRC-NORTHWIND-01" value="${merchantModalState.merchantId}" oninput="setMerchantModalProp('merchantId', this.value)">
            </div>
            <div class="dmm-field-group">
              <label class="dmm-label">Merchant Name <span class="dmm-req">*</span></label>
              <input type="text" class="dmm-input" placeholder="e.g. Northwind Media" value="${merchantModalState.merchantName}" oninput="setMerchantModalProp('merchantName', this.value)">
            </div>
          </div>

          <!-- ROW 2: ${t("mc.scheme_label")} -->
          <div class="dmm-field-group">
            <label class="dmm-label">DRM Protection Scheme <span class="dmm-req">*</span></label>
            <div class="dmm-form-row-2col">
              <div class="dmm-check-card ${merchantModalState.drmMulti ? 'is-checked' : ''}" onclick="setMerchantModalProp('drmMulti', !merchantModalState.drmMulti)">
                <input type="checkbox" class="dmm-check-input" ${merchantModalState.drmMulti ? 'checked' : ''} onclick="event.stopPropagation(); setMerchantModalProp('drmMulti', this.checked)">
                <span class="dmm-check-text">Multi-DRM (Widevine / FairPlay)</span>
              </div>
              <div class="dmm-check-card ${merchantModalState.drmSigma ? 'is-checked' : ''}" onclick="setMerchantModalProp('drmSigma', !merchantModalState.drmSigma)">
                <input type="checkbox" class="dmm-check-input" ${merchantModalState.drmSigma ? 'checked' : ''} onclick="event.stopPropagation(); setMerchantModalProp('drmSigma', this.checked)">
                <span class="dmm-check-text">PlayReady SL3000 &amp; CENC</span>
              </div>
            </div>
          </div>

          <!-- ROW 3: Feature Toggles (2x2 cards) -->
          <div class="dmm-form-row-2col">
            <!-- Left Card: Fingerprint & Multi-screen -->
            <div class="dmm-grouped-card">
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('fingerprint', !merchantModalState.fingerprint)">
                <span class="dmm-toggle-label">Browser &amp; Device Fingerprint</span>
                <div class="dmm-switch ${merchantModalState.fingerprint ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('multiscreen', !merchantModalState.multiscreen)">
                <span class="dmm-toggle-label">Multi-Screen Concurrency Guard</span>
                <div class="dmm-switch ${merchantModalState.multiscreen ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
            </div>

            <!-- Right Card: Active Observer & Forensic Watermarking -->
            <div class="dmm-grouped-card">
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('activeObserver', !merchantModalState.activeObserver)">
                <span class="dmm-toggle-label">Active Stream Telemetry Observer</span>
                <div class="dmm-switch ${merchantModalState.activeObserver ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
              <div class="dmm-group-item" style="cursor:pointer;" onclick="setMerchantModalProp('watermarking', !merchantModalState.watermarking)">
                <span class="dmm-toggle-label">A/B Forensic Watermarking</span>
                <div class="dmm-switch ${merchantModalState.watermarking ? 'is-on' : ''}">
                  <div class="dmm-switch-thumb"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 4: Max Key Rotation & Status -->
          <div class="dmm-form-row-2col">
            <!-- Max Key Rotation -->
            <div class="dmm-field-group">
              <label class="dmm-label">Max Key Rotation (Per Broadcast) <span class="dmm-req">*</span></label>
              <div class="dmm-stepper">
                <button type="button" class="dmm-step-btn" onclick="stepMerchantKeyRotation(-1)" title="Decrease">−</button>
                <div class="dmm-step-val">${merchantModalState.maxKeyRotation}</div>
                <button type="button" class="dmm-step-btn" onclick="stepMerchantKeyRotation(1)" title="Increase">+</button>
              </div>
            </div>

            <!-- Status Segmented Control -->
            <div class="dmm-field-group">
              <label class="dmm-label">Merchant Environment Status</label>
              <div class="dmm-segment-track">
                <button type="button" class="dmm-segment-pill ${merchantModalState.status === 'Disable' ? 'is-active' : ''}" onclick="setMerchantModalProp('status', 'Disable')">Disable</button>
                <button type="button" class="dmm-segment-pill ${merchantModalState.status === 'Enable' ? 'is-active' : ''}" onclick="setMerchantModalProp('status', 'Enable')">Enable</button>
                <button type="button" class="dmm-segment-pill ${merchantModalState.status === 'POC' ? 'is-active' : ''}" onclick="setMerchantModalProp('status', 'POC')">POC</button>
              </div>
            </div>
          </div>

          <!-- ROW 5: Start & End Date Pickers -->
          <div class="dmm-form-row-2col">
            <!-- Start Date -->
            <div class="dmm-field-group">
              <label class="dmm-label">Effective Start Date <span class="dmm-req">*</span></label>
              <div class="dmm-select-wrap">
                <select class="dmm-select" onchange="setMerchantModalProp('startDate', this.value)">
                  <option value="Today - 29/08/2025" selected>Today - 29/08/2025</option>
                  <option value="Tomorrow - 30/08/2025">Tomorrow - 30/08/2025</option>
                  <option value="Next Week - 05/09/2025">Next Week - 05/09/2025</option>
                </select>
                <span class="dmm-select-arrow">⌵</span>
              </div>
            </div>

            <!-- End Date -->
            <div class="dmm-field-group">
              <label class="dmm-label">License Expiration Date <span class="dmm-req">*</span></label>
              <div class="dmm-select-wrap">
                <select class="dmm-select ${merchantModalState.endDate ? '' : 'is-placeholder'}" onchange="setMerchantModalProp('endDate', this.value)">
                  <option value="" ${merchantModalState.endDate ? '' : 'selected'} disabled>-Select expiration date</option>
                  <option value="30 Days - 29/09/2025" ${merchantModalState.endDate === '30 Days - 29/09/2025' ? 'selected' : ''}>30 Days - 29/09/2025</option>
                  <option value="90 Days - 29/11/2025" ${merchantModalState.endDate === '90 Days - 29/11/2025' ? 'selected' : ''}>90 Days - 29/11/2025</option>
                  <option value="1 Year - 29/08/2026" ${merchantModalState.endDate === '1 Year - 29/08/2026' ? 'selected' : ''}>1 Year - 29/08/2026</option>
                </select>
                <span class="dmm-select-arrow">⌵</span>
              </div>
            </div>
          </div>
        </div>

        <!-- MODAL FOOTER ACTIONS -->
        <div class="dmm-modal-foot">
          <button type="button" class="dmm-btn-cancel" onclick="resetMerchantModalForm()">${t("mc.cancel")}</button>
          <button type="button" class="dmm-btn-create ${isFilled ? 'is-ready' : ''}" onclick="submitMerchantForm()">${t("mc.create")}</button>
        </div>
      </div>
    </div>
  `;
}

function buildMerchantModalHTMLSnippet() {
  return renderMerchantModalViewportFrame('desktop');
}

function buildStandaloneMerchantModalHTML(page) {
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="utf-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>Merchant Configuration Modal — Standalone</title>\n  <style>\n' + (document.querySelector('style')?.innerHTML || '') + '\n  </style>\n</head>\n<body style="margin:0;padding:24px;background:#94a3b8;font-family:Inter,-apple-system,sans-serif;">\n' + renderMerchantModalViewportFrame('desktop') + '\n</body>\n</html>';
}


    function renderLoginDemoPage() {
      return `
        <div class="auth-sheet">
          <!-- TOPBAR -->
          <div class="colors-topbar">
            <span class="effects-count-pill">2 Auth Flows (Sign Up &amp; Google SSO Login) × 3 Breakpoints (≤600 / 601–1023 / ≥1024)</span>
            <div class="colors-actions">
              <button type="button" class="btn-ds" onclick="resetAuthDemo()">↺ Khôi phục mặc định</button>
              <button type="button" class="btn-ds ai" onclick="copyText(buildLoginDemoHTMLSnippet(), 'Đã copy HTML trang Login')">Copy HTML Code</button>
              <button type="button" class="btn-ds primary" onclick="downloadCurrentPageHTML('login-demo')">↓ ${t('Tải HTML Responsive', 'Download HTML')}</button>
            </div>
          </div>

          <!-- HERO & CONTROLS -->
          <div class="auth-toolbar-card">
            <div>
              <div class="page-category-tag" style="margin-bottom:4px;">DEMO • LOGIN &amp; SIGN UP</div>
              <h1 style="font-size:24px;font-weight:700;color:#0f172a;letter-spacing:-0.02em;">${t('Login — Đăng nhập &amp; Đăng ký SaaS (De Studio)', 'Login — SaaS Sign Up &amp; Google SSO (De Studio)')}</h1>
              <p style="font-size:13px;color:#475469;margin-top:4px;max-width:860px;line-height:1.55;">
                Tổng hợp từ các thành phần đã chuẩn hóa trong hệ thống: <strong>Logo De Studio</strong> (từ mục <em>Logos</em>), <strong>Inputs &amp; Eye Toggle</strong>, <strong>Buttons &amp; Google SSO</strong>, <strong>Language Dropdown</strong>, <strong>Pagination Dots</strong>, <strong>Glassmorphism Blur</strong> và ảnh nền từ <strong>Unsplash</strong>.
              </p>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid #f1f5f9;">
              <div class="btn-ds-seg">
                <button type="button" class="${authDemoState.viewMode === 'matrix' ? 'active' : ''}" onclick="setAuthDemoProp('viewMode','matrix')">So sánh 6 màn hình (3 Breakpoints × 2 Flows)</button>
                <button type="button" class="${authDemoState.viewMode === 'interactive' ? 'active' : ''}" onclick="setAuthDemoProp('viewMode','interactive')">Thử nghiệm Tương tác (Live)</button>
              </div>

              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="font-size:11px;font-weight:600;color:#64748b;">Ảnh nền Unsplash:</span>
                ${AUTH_UNSPLASH_BACKGROUNDS.map(bg => `
                  <button type="button" class="auth-bg-thumb ${authDemoState.bgId === bg.id ? 'is-active' : ''}" onclick="setAuthDemoProp('bgId','${bg.id}')">
                    <span class="auth-bg-dot" style="background-image:${bg.fallbackGrad}, url('${bg.url}');"></span>
                    <span>${bg.label.replace('Unsplash ', '')}</span>
                  </button>
                `).join('')}
              </div>
            </div>

            ${authDemoState.lastMessage ? `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;background:var(--ds-brand-50, #eff6ff);border:1px solid var(--ds-brand-200, #bfdbfe);color:var(--ds-brand-1000, #1d4ed8);font-size:12px;font-weight:600;">
                <span>✓ ${escapeHTML(authDemoState.lastMessage)}</span>
                <button type="button" style="border:0;background:transparent;color:var(--ds-brand-1000, #1d4ed8);font-weight:700;cursor:pointer;" onclick="setAuthDemoProp('lastMessage','')">Đóng</button>
              </div>
            ` : ''}
          </div>

          ${authDemoState.viewMode === 'matrix' ? `
            <!-- FLOW 1: CREATE NEW ACCOUNT (3 BREAKPOINTS) -->
            <div class="auth-section-card">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
                <div>
                  <span class="ds-badge ds-badge-blue">Flow 1 • Registration</span>
                  <h2 style="font-size:16px;font-weight:700;color:#101828;margin-top:6px;">Đăng ký Tài khoản mới (Create New Account)</h2>
                </div>
                <span style="font-size:11.5px;color:#667085;">Mobile (≤ 600px) → Tablet (601–1023px) → Desktop Split (≥ 1024px)</span>
              </div>

              <div class="auth-flow-grid">
                <div>
                  <div style="font-size:11px;font-weight:700;color:#475469;margin-bottom:6px;">1. Mobile (≤ 600px)</div>
                  ${renderAuthBreakpointFrame('mobile', 'signup', false)}
                </div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:#475469;margin-bottom:6px;">2. Tablet Floating Card (601px – 1023px)</div>
                  ${renderAuthBreakpointFrame('tablet', 'signup', false)}
                </div>
              </div>

              <div style="margin-top:16px;">
                <div style="font-size:11px;font-weight:700;color:#475469;margin-bottom:6px;">3. Desktop Split Showcase + Unsplash Backdrop (≥ 1024px)</div>
                ${renderAuthBreakpointFrame('desktop', 'signup', false)}
              </div>
            </div>

            <!-- FLOW 2: LOG IN / GOOGLE SSO (3 BREAKPOINTS) -->
            <div class="auth-section-card">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
                <div>
                  <span class="ds-badge ds-badge-green">Flow 2 • Quick Login &amp; Google SSO</span>
                  <h2 style="font-size:16px;font-weight:700;color:#101828;margin-top:6px;">Đăng nhập nhanh với Google &amp; Email (Log In / Sign Up)</h2>
                </div>
                <span style="font-size:11.5px;color:#667085;">Mobile (≤ 600px) → Tablet (601–1023px) → Desktop Split (≥ 1024px)</span>
              </div>

              <div class="auth-flow-grid">
                <div>
                  <div style="font-size:11px;font-weight:700;color:#475469;margin-bottom:6px;">1. Mobile (≤ 600px)</div>
                  ${renderAuthBreakpointFrame('mobile', 'login', false)}
                </div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:#475469;margin-bottom:6px;">2. Tablet Floating Card (601px – 1023px)</div>
                  ${renderAuthBreakpointFrame('tablet', 'login', false)}
                </div>
              </div>

              <div style="margin-top:16px;">
                <div style="font-size:11px;font-weight:700;color:#475469;margin-bottom:6px;">3. Desktop Split Showcase + Unsplash Backdrop (≥ 1024px)</div>
                ${renderAuthBreakpointFrame('desktop', 'login', false)}
              </div>
            </div>
          ` : `
            <!-- INTERACTIVE SANDBOX -->
            <div class="auth-section-card">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <div class="btn-ds-seg">
                    <button type="button" class="${authDemoState.liveFlow === 'login' ? 'active' : ''}" onclick="setAuthDemoProp('liveFlow','login')">Google SSO + Login</button>
                    <button type="button" class="${authDemoState.liveFlow === 'signup' ? 'active' : ''}" onclick="setAuthDemoProp('liveFlow','signup')">Create Account</button>
                  </div>
                  <div class="btn-ds-seg">
                    <button type="button" class="${authDemoState.liveBp === 'mobile' ? 'active' : ''}" onclick="setAuthDemoProp('liveBp','mobile')">Mobile (≤600)</button>
                    <button type="button" class="${authDemoState.liveBp === 'tablet' ? 'active' : ''}" onclick="setAuthDemoProp('liveBp','tablet')">Tablet (601–1023)</button>
                    <button type="button" class="${authDemoState.liveBp === 'desktop' ? 'active' : ''}" onclick="setAuthDemoProp('liveBp','desktop')">Desktop (≥1024)</button>
                  </div>
                </div>
                <button type="button" class="mini-btn" onclick="setAuthDemoProp('lang','${authDemoState.lang === 'en' ? 'vi' : 'en'}')">Ngôn ngữ: ${authDemoState.lang.toUpperCase()}</button>
              </div>

              ${renderAuthBreakpointFrame(authDemoState.liveBp, authDemoState.liveFlow, true)}
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================