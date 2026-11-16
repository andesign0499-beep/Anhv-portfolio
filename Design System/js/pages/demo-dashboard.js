// DEMO: SIGMA AI MULTI-DRM DASHBOARD STATE & INTERACTION LOGIC
// =========================================================================
let dashboardDemoState = {
  viewMode: 'matrix', // 'matrix' or 'interactive'
  liveBp: 'desktop',   // 'desktop', 'tablet', 'mobile'
  merchant: 'all',
  period: 'today',
  selectedBar: 3,     // Month 4 with tooltip 511
  mobileDrawerOpen: false,
  lastRefreshTime: '15:29'
};

window.setDashboardDemoProp = function(prop, val) {
  dashboardDemoState[prop] = val;
  renderCanvas();
};

window.toggleDashboardDemoBool = function(prop) {
  dashboardDemoState[prop] = !dashboardDemoState[prop];
  renderCanvas();
};

window.resetDashboardDemo = function() {
  dashboardDemoState = {
    viewMode: 'matrix',
    liveBp: 'desktop',
    merchant: 'all',
    period: 'today',
    selectedBar: 3,
    mobileDrawerOpen: false,
    lastRefreshTime: '15:29'
  };
  renderCanvas();
  showToast(t('Đã khôi phục cài đặt mặc định Dashboard', 'Reset Dashboard to defaults'));
};

function renderDashboardDemoPage() {
  return `
    <div class="dh-sheet">
      <div class="colors-topbar">
        <span class="effects-count-pill">3 Breakpoints chuẩn: Desktop (≥1024px) • Tablet Icon Rail (601–1023px) • Mobile Drawer (≤600px)</span>
        <div class="colors-actions">
          <a href="DeSaaS.html" target="_blank" class="btn-ds primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;font-weight:600;">🚀 Mở DeSaaS App</a>
          <button type="button" class="btn-ds" onclick="resetDashboardDemo()">↺ Khôi phục mặc định</button>
          <button type="button" class="btn-ds ai" onclick="copyText(buildDashboardDemoHTMLSnippet(), 'Đã copy HTML trang Dashboard')">Copy HTML Code</button>
          <button type="button" class="btn-ds" onclick="downloadCurrentPageHTML('demo-dashboard')">↓ ${t('Tải HTML Responsive', 'Download HTML')}</button>
        </div>
      </div>

      <div class="dh-toolbar-card">
        <div>
          <div class="page-category-tag" style="margin-bottom:4px;">DEMO • DASHBOARD</div>
          <h1 style="font-size:24px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;">${t('Dashboard — SaaS Telemetry &amp; Multi-DRM Analytics', 'Dashboard — SaaS Telemetry &amp; Multi-DRM Analytics')}</h1>
          <p style="font-size:13px;color:var(--text-secondary);margin-top:4px;max-width:880px;line-height:1.55;">
            ${t(
              'Trang Dashboard De Studio tích hợp đầy đủ các module: <strong>4 KPI Metrics</strong>, <strong>Monthly License Bars</strong>, <strong>License Schemes (Widevine, Fairplay, Playready, Sigma)</strong>, <strong>24h Total License Request Waves</strong>, <strong>Average Latency Splines</strong>, <strong>2 Donut Gauges</strong>, <strong>Top 10 Assets Ranking</strong> và <strong>Location Ranking</strong> kèm bản đồ Vector World Map trên 3 ngưỡng Responsive (Desktop ≥1024px, Tablet 601–1023px, Mobile ≤600px).',
              'De Studio Dashboard integrates full telemetry modules: <strong>4 KPI Metrics</strong>, <strong>Monthly License Bars</strong>, <strong>License Schemes (Widevine, Fairplay, Playready, Sigma)</strong>, <strong>24h Total License Request Waves</strong>, <strong>Average Latency Splines</strong>, <strong>2 Donut Gauges</strong>, <strong>Top 10 Assets Ranking</strong> and <strong>Location Ranking</strong> with Vector World Map across 3 Responsive Viewports (Desktop ≥1024px, Tablet 601–1023px, Mobile ≤600px).'
            )}
          </p>
        </div>

        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:12px;border-top:1px solid #f1f5f9;">
          <div class="btn-ds-seg">
            <button type="button" class="${dashboardDemoState.viewMode === 'matrix' ? 'active' : ''}" onclick="setDashboardDemoProp('viewMode','matrix')">${t('Xem đầy đủ 3 màn hình (Desktop + Tablet + Mobile)', 'Compare All 3 Viewports (Desktop + Tablet + Mobile)')}</button>
            <button type="button" class="${dashboardDemoState.viewMode === 'interactive' ? 'active' : ''}" onclick="setDashboardDemoProp('viewMode','interactive')">${t('Thử nghiệm 1 màn hình', 'Single Viewport Interactive')}</button>
          </div>
          ${dashboardDemoState.viewMode === 'interactive' ? `
            <div class="btn-ds-seg">
              <button type="button" class="${dashboardDemoState.liveBp === 'desktop' ? 'active' : ''}" onclick="setDashboardDemoProp('liveBp','desktop')">Desktop (≥1024px)</button>
              <button type="button" class="${dashboardDemoState.liveBp === 'tablet' ? 'active' : ''}" onclick="setDashboardDemoProp('liveBp','tablet')">Tablet (601–1023px)</button>
              <button type="button" class="${dashboardDemoState.liveBp === 'mobile' ? 'active' : ''}" onclick="setDashboardDemoProp('liveBp','mobile')">Mobile (≤600px)</button>
            </div>
          ` : ''}
        </div>
      </div>

      ${dashboardDemoState.viewMode === 'matrix' ? `
        <div class="dh-device-card">
          <div class="dh-device-head">
            <div>
              <span class="ds-badge ds-badge-blue">1. Desktop Layout</span>
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-top:4px;">Desktop — De Studio Media Protection Suite (≥1024px)</h3>
            </div>
            <span class="dh-bp-tag">≥1024px</span>
          </div>
          ${renderDashboardViewportFrame('desktop')}
        </div>

        <div class="dh-device-card">
          <div class="dh-device-head">
            <div>
              <span class="ds-badge ds-badge-green">2. Tablet Layout</span>
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-top:4px;">Tablet — 64px De Studio Icon Rail + Responsive Content (601–1023px)</h3>
            </div>
            <span class="dh-bp-tag">601–1023px</span>
          </div>
          ${renderDashboardViewportFrame('tablet')}
        </div>

        <div class="dh-device-card">
          <div class="dh-device-head">
            <div>
              <span class="ds-badge ds-badge-purple">3. Mobile Layout</span>
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-top:4px;">Mobile — App Bar + Hamburger Drawer + 1-Col Stack (≤600px)</h3>
            </div>
            <span class="dh-bp-tag">≤600px</span>
          </div>
          ${renderDashboardViewportFrame('mobile')}
        </div>
      ` : `
        <div class="dh-device-card">
          <div class="dh-device-head">
            <div>
              <span class="ds-badge ds-badge-blue">Interactive Viewport</span>
              <h3 style="font-size:15px;font-weight:700;color:var(--text-primary);margin-top:4px;">${dashboardDemoState.liveBp.toUpperCase()} — Live Simulation</h3>
            </div>
            <span class="dh-bp-tag">${dashboardDemoState.liveBp === 'desktop' ? '≥1024px' : dashboardDemoState.liveBp === 'tablet' ? '601–1023px' : '≤600px'}</span>
          </div>
          ${renderDashboardViewportFrame(dashboardDemoState.liveBp)}
        </div>
      `}
    </div>
  `;
}

function renderDashboardViewportFrame(viewport) {
  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';
  const isDesktop = viewport === 'desktop';
  const shellClass = isMobile ? 'dh-shell is-mobile' : isTablet ? 'dh-shell is-tablet' : 'dh-shell is-desktop';

  const horizLogo = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
  const markLogo = logosState.items.find(i => i.id === 'logo-mark-brand') || logosState.items[2] || logosState.items[0];

  const leftNavHtml = isDesktop ? `
    <aside class="dh-sidebar">
      ${renderHistoryExpandedSidebar(horizLogo, false, 'dashboard')}
    </aside>
  ` : (isTablet ? renderHistoryRailSidebar(markLogo, 'dashboard') : '');

  const mobileBarHtml = isMobile ? `
    <div class="dh-mobile-header">
      <div style="display:flex;align-items:center;gap:8px;min-width:0;">
        <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="toggleDashboardDemoBool('mobileDrawerOpen')" title="Menu">${dhSvg('menu')}</button>
        ${renderLogoMarkup(markLogo, 'width:22px;height:22px;display:block;flex-shrink:0;')}
        <span class="dh-page-title">Dashboard</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="showToast('Refreshing metrics...')" title="Refresh">↻</button>
        <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="showToast('Options')">${dhSvg('more')}</button>
      </div>
    </div>
  ` : '';

  const filterBtn = isMobile
    ? `<button type="button" class="ddb-filter-btn is-compact" title="Filter"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg></button>`
    : `<button type="button" class="ddb-filter-btn" style="white-space:nowrap;">${t("dash.filter_period")} ⌵</button>`;

  return `
    <div class="${shellClass}">
      ${leftNavHtml}
      ${isMobile && dashboardDemoState.mobileDrawerOpen ? `
        <div class="dh-mobile-drawer-overlay" onclick="if(event.target===this) toggleDashboardDemoBool('mobileDrawerOpen')">
          <aside class="dh-mobile-drawer">
            ${renderHistoryExpandedSidebar(horizLogo, true, 'dashboard')}
          </aside>
        </div>
      ` : ''}

      ${mobileBarHtml}

      <main class="dh-main" style="overflow-y:auto;max-height:860px;padding:16px;">
        ${!isMobile ? `
          <!-- Header bar (giữ nguyên tiêu đề phía trên) -->
          <div class="ddb-header-bar" style="margin-bottom:12px;">
            <div>
              <div class="ddb-dash-title" style="white-space:nowrap;">
                Dashboard
                <span class="ddb-updated-sub" style="margin-left:8px;">
                  ${t("dash.last_updated")} ${dashboardDemoState.lastRefreshTime}
                  <button type="button" onclick="setDashboardDemoProp('lastRefreshTime', new Date().toLocaleTimeString('vi-VN',{hour:'2-digit',minute:'2-digit'}))" style="width:24px;height:24px;min-height:24px;border:1px solid #d0d5dd;background:#ffffff;border-radius:4px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0;margin-left:4px;" title="Refresh now"><span style="color:#047857;font-size:12px;line-height:1;">🔄</span></button>
                </span>
              </div>
            </div>
            <div style="display:flex;align-items:center;gap:8px;">
              <button type="button" class="ddb-filter-btn" onclick="selectPage('demo-merchant-modal')">Merchant ⌵</button>
              <button type="button" class="ddb-filter-btn" onclick="showToast('Tần suất làm mới: 5 phút')">${t("dash.refresh_5m")} ⌵</button>
            </div>
          </div>
        ` : ''}

        <div class="ddb-content-scroll" style="padding:0;overflow:visible;">
          <div class="ddb-grid-2col">
            <!-- 4 KPI Metrics -->
            <div class="ddb-kpi-grid">
              <div class="ddb-kpi-cell">
                <span class="ddb-kpi-tag">${t("dash.apps")}</span>
                <div class="ddb-kpi-val-row">
                  <span class="ddb-kpi-num">860</span>
                  <svg width="60" height="26" viewBox="0 0 60 26" fill="none"><path d="M2 22 Q16 24 24 14 T38 6 T48 10 T58 4" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <div><span class="ddb-kpi-trend up">↑ 36.8% ${t("dash.vs_last_month")}</span></div>
              </div>

              <div class="ddb-kpi-cell">
                <span class="ddb-kpi-tag">${t("dash.users")}</span>
                <div class="ddb-kpi-val-row">
                  <span class="ddb-kpi-num">128</span>
                  <svg width="60" height="26" viewBox="0 0 60 26" fill="none"><path d="M2 18 Q16 20 28 12 T44 4 T58 8" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <div><span class="ddb-kpi-trend up">↑ 36.8% ${t("dash.vs_last_month")}</span></div>
              </div>

              <div class="ddb-kpi-cell">
                <span class="ddb-kpi-tag">${t("dash.protected")}</span>
                <div class="ddb-kpi-val-row">
                  <span class="ddb-kpi-num">8.432</span>
                  <svg width="60" height="26" viewBox="0 0 60 26" fill="none"><path d="M2 20 Q14 24 26 10 T42 14 T58 2" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <div><span class="ddb-kpi-trend up">↑ 36.8% ${t("dash.vs_last_month")}</span></div>
              </div>

              <div class="ddb-kpi-cell">
                <span class="ddb-kpi-tag">${t("dash.merchants")}</span>
                <div class="ddb-kpi-val-row">
                  <span class="ddb-kpi-num">32</span>
                  <svg width="60" height="26" viewBox="0 0 60 26" fill="none"><path d="M2 6 Q16 4 28 16 T42 10 T58 22" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/></svg>
                </div>
                <div><span class="ddb-kpi-trend down">↓ 36.8% ${t("dash.vs_last_month")}</span></div>
              </div>
            </div>

            <!-- Monthly License Bars -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">${t("dash.license")}</span>
                ${filterBtn}
              </div>
              <div class="ddb-bars-wrap">
                ${[
                  { m: '1', h: 30, v: 210 },
                  { m: '2', h: 48, v: 340 },
                  { m: '3', h: 72, v: 480 },
                  { m: '4', h: 96, v: 511, active: true },
                  { m: '5', h: 58, v: 390 },
                  { m: '6', h: 40, v: 280 },
                  { m: '7', h: 34, v: 240 },
                  { m: '8', h: 30, v: 210 },
                  { m: '9', h: 26, v: 180 },
                  { m: '10', h: 32, v: 220 },
                  { m: '11', h: 28, v: 195 },
                  { m: '12', h: 25, v: 170 }
                ].map((b, i) => `
                  <div class="ddb-bar-col" onclick="setDashboardDemoProp('selectedBar',${i})">
                    ${b.active ? `
                      <div style="position:relative;width:100%;display:flex;justify-content:center;">
                        <div style="position:absolute;bottom:4px;background:#0f172a;color:#ffffff;font-size:9.5px;font-weight:700;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.2);">511</div>
                      </div>
                    ` : ''}
                    <div class="ddb-bar-stick ${b.active ? 'is-active' : ''}" style="height:${b.h}px;" title="${(typeof window !== 'undefined' && window.__dsCurrentLang === 'vi') ? ('Tháng ' + b.m + ': ' + b.v + ' giấy phép') : ('Month ' + b.m + ': ' + b.v + ' licenses')}"></div>
                    <span class="ddb-bar-lbl">${b.m}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- ROW 2: License per DRM Scheme & Total License Request Waves -->
          <div class="ddb-grid-2col">
            <!-- DRM Scheme Breakdown -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">${t("dash.license_per_drm")}</span>
                ${filterBtn}
              </div>
              <div style="display:flex;align-items:center;gap:24px;padding-bottom:8px;border-bottom:1px solid #f1f5f9;">
                <div><div style="font-size:10px;color:#64748b;font-weight:600;">Users</div><div style="font-size:16px;font-weight:800;color:#0f172a;">120</div></div>
                <div><div style="font-size:10px;color:#64748b;font-weight:600;">Devices</div><div style="font-size:16px;font-weight:800;color:#0f172a;">360</div></div>
                <div><div style="font-size:10px;color:#64748b;font-weight:600;">IP Address</div><div style="font-size:16px;font-weight:800;color:#0f172a;">22</div></div>
              </div>
              <div style="display:flex;flex-direction:column;gap:12px;margin-top:4px;">
                <!-- Widevine -->
                <div class="ddb-drm-row">
                  <span class="ddb-drm-name">Widevine</span>
                  <span class="ddb-drm-total">3,000</span>
                  <div class="ddb-drm-bar-track">
                    <div class="ddb-drm-segment" style="width:94.2%;background:#86efac;color:#14532d;">2,826</div>
                  </div>
                </div>
                <!-- Fairplay -->
                <div class="ddb-drm-row">
                  <span class="ddb-drm-name">Fairplay</span>
                  <span class="ddb-drm-total">3,000</span>
                  <div class="ddb-drm-bar-track">
                    <div class="ddb-drm-segment" style="width:94.2%;background:#86efac;color:#14532d;">2,826</div>
                  </div>
                </div>
                <!-- Playready -->
                <div class="ddb-drm-row">
                  <span class="ddb-drm-name">Playready</span>
                  <span class="ddb-drm-total">3,000</span>
                  <div class="ddb-drm-bar-track" style="position:relative;">
                    <div class="ddb-drm-segment" style="width:48.3%;background:#15803d;color:#ffffff;">1,450</div>
                    <div class="ddb-drm-segment" style="width:48.3%;background:#9a3412;color:#ffffff;">1,450</div>
                    <div class="ddb-drm-segment" style="width:3.4%;background:#b91c1c;"></div>
                    <div style="position:absolute;right:0;top:-22px;background:#0f172a;color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px;">100</div>
                  </div>
                </div>
                <!-- DeStudio DRM -->
                <div class="ddb-drm-row">
                  <span class="ddb-drm-name">DeStudio DRM</span>
                  <span class="ddb-drm-total">3,000</span>
                  <div class="ddb-drm-bar-track">
                    <div class="ddb-drm-segment" style="width:33.3%;background:#86efac;color:#14532d;">1,000</div>
                    <div class="ddb-drm-segment" style="width:33.3%;background:#fdba74;color:#7c2d12;">1,000</div>
                    <div class="ddb-drm-segment" style="width:33.4%;background:#fca5a5;color:#7f1d1d;">1,000</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Total License Request Waves -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">${t("dash.total_requests")}</span>
                ${filterBtn}
              </div>
              <!-- Spline waves area -->
              <div style="position:relative;height:140px;width:100%;">
                <svg width="100%" height="100%" viewBox="0 0 400 130" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="reqGreenArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stop-color="#16a34a" stop-opacity="0.25"/>
                      <stop offset="100%" stop-color="#16a34a" stop-opacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <!-- Grid lines -->
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" stroke-width="1"/>
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" stroke-width="1"/>
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" stroke-width="1"/>
                  <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" stroke-width="1"/>

                  <!-- Green Area with 2 peaks -->
                  <path d="M0 110 Q40 110 60 70 T120 70 T160 110 T240 100 T300 40 T360 40 T400 110 L400 110 L0 110 Z" fill="url(#reqGreenArea)"/>
                  <path d="M0 110 Q40 110 60 70 T120 70 T160 110 T240 100 T300 40 T360 40 T400 110" fill="none" stroke="#16a34a" stroke-width="2.2" stroke-linecap="round"/>

                  <!-- Orange wave -->
                  <path d="M0 110 Q50 110 80 85 T130 90 T180 110 T260 105 T310 65 T370 70 T400 110" fill="none" stroke="#f97316" stroke-width="1.8" stroke-dasharray="2 2" stroke-linecap="round"/>

                  <!-- Red baseline wave -->
                  <path d="M0 110 Q70 110 100 100 T200 110 T320 95 T400 110" fill="none" stroke="#ef4444" stroke-width="1.4" stroke-linecap="round"/>
                </svg>
              </div>
              <!-- Legend & Pagination -->
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;margin-top:2px;">
                <div class="ddb-legend-row" style="justify-content:flex-start;">
                  <span style="display:inline-flex;align-items:center;gap:4px;"><span class="ddb-legend-dot" style="background:#16a34a;"></span> Succeeded ☑</span>
                  <span style="display:inline-flex;align-items:center;gap:4px;color:#475467;"><span class="ddb-legend-dot" style="background:#ea580c;"></span> Denied ☐</span>
                  <span style="display:inline-flex;align-items:center;gap:4px;color:#475467;"><span class="ddb-legend-dot" style="background:#dc2626;"></span> Failed ☐</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;color:#475467;font-size:10.5px;">
                  <span>00:00 - 12:00 / 23:59</span>
                  <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&lt;</button>
                  <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&gt;</button>
                </div>
              </div>
            </div>
          </div>

          <!-- ROW 3: Average Latency by DRM & Status Donut -->
          <div class="ddb-grid-2col">
            <!-- Average Latency Splines -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">${t("dash.average_latency")}</span>
                ${filterBtn}
              </div>
              <div style="position:relative;height:140px;width:100%;">
                <svg width="100%" height="100%" viewBox="0 0 400 130" preserveAspectRatio="none">
                  <!-- Grid lines -->
                  <line x1="0" y1="20" x2="400" y2="20" stroke="#f1f5f9" stroke-width="1"/>
                  <line x1="0" y1="50" x2="400" y2="50" stroke="#f1f5f9" stroke-width="1"/>
                  <line x1="0" y1="80" x2="400" y2="80" stroke="#f1f5f9" stroke-width="1"/>
                  <line x1="0" y1="110" x2="400" y2="110" stroke="#f1f5f9" stroke-width="1"/>

                  <!-- Blue line (Widevine) -->
                  <path d="M0 110 Q50 100 80 40 T140 100 T200 90 T260 90 T320 20 T360 40 T400 100" fill="none" stroke="#2563eb" stroke-width="2.2" stroke-linecap="round"/>
                  <!-- Purple line (Fairplay) -->
                  <path d="M0 110 Q50 95 80 50 T140 105 T200 100 T260 85 T320 50 T360 65 T400 105" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/>
                  <!-- Orange line (Playready) -->
                  <path d="M0 110 Q50 105 80 75 T140 110 T200 100 T260 90 T320 60 T360 70 T400 110" fill="none" stroke="#f97316" stroke-width="1.8" stroke-linecap="round"/>
                  <!-- Amber line (DeStudio DRM) -->
                  <path d="M0 110 Q50 105 80 85 T140 110 T200 105 T260 95 T320 70 T360 75 T400 110" fill="none" stroke="#eab308" stroke-width="1.6" stroke-linecap="round"/>
                </svg>
              </div>
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;font-size:11px;">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <button type="button" class="btn-ds ddb-eye-btn">Playready 👁</button>
                  <button type="button" class="btn-ds ddb-eye-btn is-sigma">DeStudio DRM 👁</button>
                  <button type="button" class="btn-ds ddb-eye-btn is-fairplay">Fairplay 👁</button>
                  <button type="button" class="btn-ds ddb-eye-btn is-widevine">Widevine 👁</button>
                </div>
                <div style="display:flex;align-items:center;gap:4px;color:#64748b;font-size:10.5px;">
                  <span>XX / YY</span>
                  <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&lt;</button>
                  <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&gt;</button>
                </div>
              </div>
            </div>

            <!-- Status Donut -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">LICENSE DELIVERIES ℹ️</span>
                ${filterBtn}
              </div>
              <div class="ddb-donut-wrap">
                <svg width="150" height="150" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="22"/>
                  <!-- Green (Succeeded 70%) -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#16a34a" stroke-width="22" stroke-dasharray="260 377" stroke-dashoffset="94"/>
                  <!-- Orange (Denied 20.18%) -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#ea580c" stroke-width="22" stroke-dasharray="76 377" stroke-dashoffset="-166"/>
                  <!-- Red (Failed 9.82%) -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#dc2626" stroke-width="22" stroke-dasharray="37 377" stroke-dashoffset="-242"/>
                </svg>
                <div class="ddb-donut-center">
                  <span class="ddb-donut-center-lbl">${t("dash.denied")}</span>
                  <span class="ddb-donut-center-val">526</span>
                  <span class="ddb-donut-center-sub">Rate: 20,18%</span>
                  <span class="ddb-donut-center-sub" style="font-weight:700;margin-top:2px;">Total: 2,520</span>
                </div>
              </div>
              <div class="ddb-legend-row">
                <span><span class="ddb-legend-dot" style="background:#16a34a;"></span> Succeeded</span>
                <span><span class="ddb-legend-dot" style="background:#ea580c;"></span> Denied</span>
                <span><span class="ddb-legend-dot" style="background:#dc2626;"></span> Failed</span>
              </div>
            </div>
          </div>

          <!-- ROW 4: Device Donut & Top 10 Assets -->
          <div class="ddb-grid-2col">
            <!-- Device Donut -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">LICENSE DELIVERIES ℹ️</span>
                ${filterBtn}
              </div>
              <div class="ddb-donut-wrap">
                <svg width="150" height="150" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="22"/>
                  <!-- Mobile Red ~25% -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#ef4444" stroke-width="22" stroke-dasharray="94 377" stroke-dashoffset="94"/>
                  <!-- PC Green ~30% -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#22c55e" stroke-width="22" stroke-dasharray="113 377" stroke-dashoffset="0"/>
                  <!-- Tablet Blue ~24.8% -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#3b82f6" stroke-width="22" stroke-dasharray="94 377" stroke-dashoffset="-113"/>
                  <!-- TV Purple 20.18% -->
                  <circle cx="80" cy="80" r="60" fill="none" stroke="#a855f7" stroke-width="22" stroke-dasharray="76 377" stroke-dashoffset="-207"/>
                </svg>
                <div class="ddb-donut-center">
                  <span class="ddb-donut-center-lbl">TV</span>
                  <span class="ddb-donut-center-val">526</span>
                  <span class="ddb-donut-center-sub">Rate: 20,18%</span>
                  <span class="ddb-donut-center-sub" style="font-weight:700;margin-top:2px;">Total: 2,520</span>
                </div>
              </div>
              <div class="ddb-legend-row">
                <span><span class="ddb-legend-dot" style="background:#ef4444;"></span> Mobile</span>
                <span><span class="ddb-legend-dot" style="background:#22c55e;"></span> PC</span>
                <span><span class="ddb-legend-dot" style="background:#3b82f6;"></span> Tablet</span>
                <span><span class="ddb-legend-dot" style="background:#a855f7;"></span> TV</span>
              </div>
            </div>

            <!-- Top 10 Assets -->
            <div class="ddb-widget-card">
              <div class="ddb-widget-head">
                <span class="ddb-widget-title">TOP 10 ASSETS BY LICENSE REQUEST ℹ️</span>
                ${filterBtn}
              </div>
              <div style="display:flex;flex-direction:column;gap:8px;margin-top:4px;">
                ${[
                  { id: 'c993a453-9d2d-4c17-8bbf...', val: '2K', pct: 100 },
                  { id: '953-9d2d-4c17-8bbf-d0cbc...', val: '1,800', pct: 90 },
                  { id: '453-9d2d-4c17-8bbf-d0cbc...', val: '1,790', pct: 89.5 },
                  { id: 'c993a453-9d2d-4c1...', val: '1,620', pct: 81 },
                  { id: '9d2d-4c17-8bbf...', val: '1,526', pct: 76.3 },
                  { id: 'c993a453...', val: '1,233', pct: 61.6 },
                  { id: '8bbf-c893e453...', val: '1,180', pct: 59 },
                  { id: 'c993a453-9d2d...', val: '890', pct: 44.5 },
                  { id: '9d2d-4c17-8bbf-d0cbc...', val: '720', pct: 36 },
                  { id: 'c993a453-9d2d-bbf-d0cbc...', val: '582', pct: 29.1 }
                ].map(item => `
                  <div style="display:flex;align-items:center;gap:12px;font-size:11px;">
                    <span style="font-family:monospace;width:${isMobile ? '100px' : '150px'};color:#475467;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex-shrink:0;">${item.id}</span>
                    <div style="flex:1;height:14px;background:#f8fafc;border-radius:3px;overflow:hidden;display:flex;">
                      <div style="width:${item.pct}%;height:100%;background:#ffedd5;border-radius:3px;"></div>
                    </div>
                    <span style="width:36px;font-weight:700;color:#0f172a;text-align:right;flex-shrink:0;">${item.val}</span>
                  </div>
                `).join('')}
              </div>
              <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;color:#475467;font-size:10.5px;margin-top:8px;">
                <span>Page 1 / 20</span>
                <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&lt;</button>
                <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&gt;</button>
              </div>
            </div>
          </div>

          <!-- ROW 5: Location Ranking & World Map (Full width) -->
          <div class="ddb-widget-card">
            <div class="ddb-widget-head">
              <span class="ddb-widget-title">LOCATION RANKING ℹ️</span>
              ${filterBtn}
            </div>
            <div style="display:flex;flex-direction:${isMobile ? 'column' : 'row'};gap:16px;align-items:stretch;">
              ${isMobile ? `
                <!-- Vector Map on Top on Mobile (matches media_1794542369140_b81c4604.jpg) -->
                <div style="position:relative;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;height:180px;display:flex;align-items:center;justify-content:center;">
                  <svg width="100%" height="100%" viewBox="0 0 500 250" fill="none">
                    <path d="M50 40 Q80 20 120 30 T160 50 T140 90 T100 110 T70 80 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                    <path d="M120 120 Q150 130 160 160 T140 210 T120 230 T110 170 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                    <path d="M220 30 Q260 25 280 45 T270 75 T240 75 T215 50 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                    <path d="M220 85 Q260 85 270 115 T260 175 T230 195 T210 135 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                    <path d="M280 25 Q350 20 420 40 T440 85 T380 95 T300 70 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                    <path d="M320 85 L345 90 L340 125 L325 135 L315 110 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
                    <circle cx="330" cy="110" r="3.5" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
                    <path d="M390 145 Q430 145 440 175 T410 205 T380 185 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                  </svg>
                  <div style="position:absolute;top:8px;right:8px;display:flex;flex-direction:column;gap:4px;">
                    <button type="button" class="ddb-map-zoom-btn">+</button>
                    <button type="button" class="ddb-map-zoom-btn">−</button>
                  </div>
                </div>
              ` : ''}
              <!-- Country Table -->
              <div style="display:flex;flex-direction:column;gap:4px;">
                ${[
                  { r: 1, c: 'India', v: '1,462,806', active: true },
                  { r: 2, c: 'United States', v: '1,148,834' },
                  { r: 3, c: 'Brazil', v: '623,412' },
                  { r: 4, c: 'Indonesia', v: '619,230' },
                  { r: 5, c: 'South Korea', v: '446,534' },
                  { r: 6, c: 'Russia', v: '230,282' },
                  { r: 7, c: 'Pakistan', v: '196,081' },
                  { r: 8, c: 'Turkey', v: '184,259' },
                  { r: 9, c: 'Vietnam', v: '173,247' },
                  { r: 10, c: 'Philippines', v: '170,086' }
                ].map(row => `
                  <div class="ddb-rank-row ${row.active ? 'is-top' : ''}">
                    <div class="ddb-rank-left">
                      <span class="ddb-rank-num">${row.r}</span>
                      <span class="ddb-rank-country">${row.c}</span>
                    </div>
                    <span class="ddb-rank-val">${row.v}</span>
                  </div>
                `).join('')}
              </div>

              ${!isMobile ? `
              <!-- World Vector Map (Desktop / Tablet) -->
              <div style="flex:1;position:relative;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;height:240px;display:flex;align-items:center;justify-content:center;">
                <svg width="100%" height="100%" viewBox="0 0 500 250" fill="none" style="filter:drop-shadow(0 1px 2px rgba(0,0,0,0.03));">
                  <!-- Simplified Vector Continents -->
                  <!-- North America -->
                  <path d="M50 40 Q80 20 120 30 T160 50 T140 90 T100 110 T70 80 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                  <!-- South America -->
                  <path d="M120 120 Q150 130 160 160 T140 210 T120 230 T110 170 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                  <!-- Europe -->
                  <path d="M220 30 Q260 25 280 45 T270 75 T240 75 T215 50 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                  <!-- Africa -->
                  <path d="M220 85 Q260 85 270 115 T260 175 T230 195 T210 135 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                  <!-- Asia / Russia -->
                  <path d="M280 25 Q350 20 420 40 T440 85 T380 95 T300 70 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                  <!-- India (Highlighted Orange) -->
                  <path d="M320 85 L345 90 L340 125 L325 135 L315 110 Z" fill="#ea580c" stroke="#c2410c" stroke-width="1.5"/>
                  <circle cx="330" cy="110" r="3.5" fill="#ffffff" stroke="#ea580c" stroke-width="1.5"/>
                  <!-- Australia -->
                  <path d="M390 145 Q430 145 440 175 T410 205 T380 185 Z" fill="#ffedd5" stroke="#fed7aa" stroke-width="1"/>
                </svg>

                <!-- Zoom controls -->
                <div style="position:absolute;top:8px;right:8px;display:flex;flex-direction:column;gap:4px;">
                  <button type="button" class="ddb-map-zoom-btn">+</button>
                  <button type="button" class="ddb-map-zoom-btn">−</button>
                </div>
              </div>` : ''}
            </div>
            <!-- Pagination footer -->
            <div style="display:flex;align-items:center;justify-content:flex-end;gap:8px;color:#475467;font-size:10.5px;margin-top:8px;">
              <span>1 - 10 / 99</span>
              <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&lt;</button>
              <button type="button" class="icon-btn" style="width:24px;height:24px;min-height:24px;font-size:10px;display:inline-flex;align-items:center;justify-content:center;">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildDashboardDemoHTMLSnippet() {
  return `<!-- De Studio 1.0 • Dashboard Demo (Desktop >=1024 | Tablet 601-1023 | Mobile <=600) -->
<section class="dh-shell">
  <aside class="dh-sidebar">
    <div class="dh-brand-wrap">
      <img src="./Logo/Logo_destudio_ngang.svg" alt="De Studio" style="height:19px;width:auto;" />
      <span class="dh-brand-sub">Media Protection Suite</span>
    </div>
    <nav class="dh-nav-list">
      <button class="dh-nav-item is-active">Dashboard</button>
      <button class="dh-nav-item is-muted">Reports</button>
      <button class="dh-nav-item">Detection</button>
      <button class="dh-nav-item">History</button>
    </nav>
  </aside>
  <main class="dh-main">
    <div class="ddb-header-bar">
      <h2>Dashboard</h2>
      <span>${t("dash.last_updated")} 15:29</span>
    </div>
    <!-- 4 KPI Metrics + Monthly Bars + DRM Scheme + 24h Wave + Latency + Donuts + Assets + Location Ranking -->
  </main>
</section>`;
}

function buildStandaloneDashboardDemoHTML(page) {
  return '<!DOCTYPE html>\n<html lang="vi">\n<head>\n  <meta charset="utf-8">\n  <title>De Studio Multi-DRM Dashboard</title>\n</head>\n<body>\n' + renderDashboardViewportFrame('desktop') + '\n</body>\n</html>';
}


// DEMO: MERCHANT CONFIGURATION POPUP STATE & INTERACTION LOGIC
// =========================================================================
let merchantModalState = {
  viewMode: 'matrix', // 'matrix' or 'interactive'
  liveBp: 'desktop',   // 'desktop', 'tablet', 'mobile'
  merchantId: '',
  merchantName: '',
  drmMulti: false,
  drmSigma: false,
  fingerprint: false,
  multiscreen: false,
  activeObserver: false,
  watermarking: false,
  maxKeyRotation: 0,
  status: 'POC', // 'Disable', 'Enable', 'POC'
  startDate: 'Today - 29/08/2025',
  endDate: ''
};

window.setMerchantModalProp = function(prop, val) {
  merchantModalState[prop] = val;
  renderCanvas();
};

window.stepMerchantKeyRotation = function(delta) {
  merchantModalState.maxKeyRotation = Math.max(0, (merchantModalState.maxKeyRotation || 0) + delta);
  renderCanvas();
};

window.resetMerchantModalForm = function() {
  merchantModalState = {
    viewMode: merchantModalState.viewMode,
    liveBp: merchantModalState.liveBp,
    merchantId: '',
    merchantName: '',
    drmMulti: false,
    drmSigma: false,
    fingerprint: false,
    multiscreen: false,
    activeObserver: false,
    watermarking: false,
    maxKeyRotation: 0,
    status: 'POC',
    startDate: 'Today - 29/08/2025',
    endDate: ''
  };
  renderCanvas();
  showToast(t('Đã đặt lại dữ liệu biểu mẫu Merchant', 'Reset Merchant form fields'));
};

window.submitMerchantForm = function() {
  const isFilled = merchantModalState.merchantId && merchantModalState.merchantName;
  if (!isFilled) {
    showToast(t('Vui lòng điền Merchant ID và Merchant name', 'Please fill Merchant ID and Merchant name'));
    return;
  }
  showToast(t('Đã lưu cấu hình Merchant thành công!', 'Merchant configuration saved successfully!'));
};
