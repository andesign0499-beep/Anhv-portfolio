    // 6. ANTIGRAVITY-STYLE OFFLINE AI COMPOSER ENGINE & STANDALONE HTML EXPORT
    // =========================================================================
    const slashMenu = document.getElementById('slashMenu');

    const AI_COMPOSER_CORE_CSS = `
      .ai-ui-shell {
        display: flex;
        flex-direction: column;
        gap: 16px;
        color: var(--text-primary, #111827);
        font-family: var(--ds-font-sans, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
      }
      .ai-ui-layout {
        display: grid;
        grid-template-columns: 228px minmax(0, 1fr);
        gap: 16px;
        align-items: start;
      }
      .ai-ui-main {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 0;
      }
      .ai-ui-navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:16px;
        padding: 12px 18px;
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(15,23,42,0.05));
        flex-wrap: wrap;
      }
      .ai-ui-brand {
        display: inline-flex;
        align-items: center;
        gap:8px;
        font-weight: 700;
        color: var(--text-primary, #111827);
      }
      .ai-ui-nav-links {
        display: flex;
        align-items: center;
        gap: 4px;
        flex-wrap: wrap;
      }
      .ai-ui-nav-link {
        padding:8px 12px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-secondary, #4b5563);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }
      .ai-ui-nav-link:hover {
        background: var(--bg-subtle, #f1f5f9);
        color: var(--text-primary, #111827);
      }
      .ai-ui-nav-link.active {
        background: var(--brand-soft, var(--ds-brand-50, #eff6ff));
        color: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        font-weight: 600;
      }
      .ai-ui-nav-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .ai-ui-sidebar {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        padding:16px 12px;
        display: flex;
        flex-direction: column;
        gap:16px;
        box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(15,23,42,0.05));
      }
      .ai-ui-side-list {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .ai-ui-side-item {
        width: 100%;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        padding: 8px 10px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--text-secondary, #4b5563);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
      }
      .ai-ui-side-item:hover {
        background: var(--bg-subtle, #f1f5f9);
      }
      .ai-ui-side-item.active {
        background: var(--brand-soft, var(--ds-brand-50, #eff6ff));
        color: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        font-weight: 600;
      }
      .ai-ui-side-user {
        margin-top: 4px;
        padding-top: 12px;
        border-top: 1px solid var(--border-default, #e5e7eb);
        display: flex;
        align-items: center;
        gap:8px;
      }
      .ai-ui-avatar {
        width: 32px;
        height: 32px;
        border-radius: 999px;
        background: var(--brand-soft, #eff6ff);
        color: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        border: 1px solid var(--brand-border, #bfdbfe);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        flex-shrink: 0;
      }
      .ai-ui-sec-head {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        padding:16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:16px;
        flex-wrap: wrap;
        box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(15,23,42,0.05));
      }
      .ai-ui-sec-title {
        font-size: var(--ds-text-lg-size, 18px);
        line-height: 1.35;
        font-weight: 700;
        margin: 4px 0 4px;
        color: var(--text-primary, #111827);
      }
      .ai-ui-sec-sub {
        font-size: 13px;
        color: var(--text-muted, #6b7280);
      }
      .ai-ui-alert {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 10px;
        background: var(--brand-soft, var(--ds-brand-50, #eff6ff));
        border: 1px solid var(--brand-border, var(--ds-brand-200, #bfdbfe));
        color: var(--text-primary, #111827);
        font-size: 13px;
      }
      .ai-ui-kpi-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(165px, 1fr));
        gap: 12px;
      }
      .ai-ui-kpi-card .ds-badge { white-space: nowrap; flex-shrink: 0; }
      .ai-ui-kpi-card {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        padding: 16px;
        box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(15,23,42,0.05));
      }
      .ai-ui-kpi-label {
        font-size: 12px;
        color: var(--text-muted, #6b7280);
        font-weight: 500;
      }
      .ai-ui-kpi-val {
        font-size: 22px;
        font-weight: 700;
        margin: 6px 0 8px;
        color: var(--text-primary, #111827);
        letter-spacing: -0.02em;
      }
      .ai-ui-progress-track {
        width: 100%;
        height: 6px;
        background: var(--bg-subtle, #f1f5f9);
        border-radius: 999px;
        overflow: hidden;
        margin-top: 10px;
      }
      .ai-ui-progress-fill {
        height: 100%;
        border-radius: 999px;
        background: var(--brand-primary, var(--ds-brand-1000, #2563eb));
      }
      .ai-ui-card {
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        overflow: hidden;
        box-shadow: var(--ds-shadow-xs, 0 1px 2px rgba(15,23,42,0.05));
      }
      .ai-ui-card-head {
        padding:16px 18px;
        border-bottom: 1px solid var(--border-default, #e5e7eb);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:8px;
        flex-wrap: wrap;
      }
      .ai-ui-card-body {
        padding:16px;
      }
      .ai-ui-chart-bars {
        display: grid;
        grid-template-columns: repeat(7, minmax(0, 1fr));
        gap:8px;
        align-items: end;
        height: 150px;
        padding-top: 16px;
      }
      .ai-ui-bar-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap:8px;
        height: 100%;
        justify-content: flex-end;
      }
      .ai-ui-bar-stick {
        width: 100%;
        max-width: 34px;
        border-radius: 6px 6px 2px 2px;
        background: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        opacity: 0.9;
        transition: opacity 0.15s;
      }
      .ai-ui-bar-stick:hover { opacity: 1; }
      .ai-ui-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        padding: 12px 16px;
      }
      .ai-ui-pills {
        display: flex;
        align-items: center;
        gap:8px;
        flex-wrap: wrap;
      }
      .ai-ui-pill {
        padding:8px 12px;
        border-radius: 999px;
        border: 1px solid var(--border-default, #e5e7eb);
        background: var(--bg-surface, #ffffff);
        color: var(--text-secondary, #4b5563);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s;
      }
      .ai-ui-pill:hover {
        border-color: var(--brand-border, #bfdbfe);
        color: var(--text-primary, #111827);
      }
      .ai-ui-pill.active {
        background: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        color: #ffffff;
        border-color: var(--brand-primary, var(--ds-brand-1000, #2563eb));
      }
      .ai-ui-table-wrap {
        width: 100%;
        overflow-x: auto;
      }
      .ai-ui-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
        font-size: 13px;
      }
      .ai-ui-table th {
        padding: 11px 16px;
        background: var(--bg-app, #f8fafc);
        border-bottom: 1px solid var(--border-default, #e5e7eb);
        font-size: 11.5px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        color: var(--text-muted, #6b7280);
      }
      .ai-ui-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--bg-subtle, #f1f5f9);
        vertical-align: middle;
      }
      .ai-ui-table tr:last-child td {
        border-bottom: none;
      }
      .ai-ui-toggle {
        width: 38px;
        height: 22px;
        border-radius: 999px;
        border: none;
        background: var(--border-strong, #d1d5db);
        position: relative;
        cursor: pointer;
        transition: background 0.18s;
        flex-shrink: 0;
      }
      .ai-ui-toggle::after {
        content: "";
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        transition: transform 0.18s;
      }
      .ai-ui-toggle.on {
        background: var(--brand-primary, var(--ds-brand-1000, #2563eb));
      }
      .ai-ui-toggle.on::after {
        transform: translateX(16px);
      }
      .ai-ui-btn-group {
        display: inline-flex;
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: 8px;
        overflow: hidden;
        background: var(--bg-surface, #ffffff);
      }
      .ai-ui-btn-group button {
        padding:8px 14px;
        border: none;
        border-right: 1px solid var(--border-default, #e5e7eb);
        background: transparent;
        color: var(--text-secondary, #4b5563);
        font-size: 12.5px;
        font-weight: 500;
        cursor: pointer;
      }
      .ai-ui-btn-group button:last-child { border-right: none; }
      .ai-ui-btn-group button.active {
        background: var(--brand-soft, #eff6ff);
        color: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        font-weight: 600;
      }
      .ai-ui-setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:16px;
        padding: 12px 0;
        border-bottom: 1px solid var(--bg-subtle, #f1f5f9);
      }
      .ai-ui-setting-row:last-child { border-bottom: none; }
      .ai-ui-pagination {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px 16px;
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        flex-wrap: wrap;
        font-size: 12.5px;
      }
      .ai-ui-page-btn {
        min-width: 30px;
        height: 30px;
        padding: 0 9px;
        border-radius: 7px;
        border: 1px solid var(--border-default, #e5e7eb);
        background: var(--bg-surface, #ffffff);
        color: var(--text-secondary, #4b5563);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
      }
      .ai-ui-page-btn.active {
        background: var(--brand-primary, var(--ds-brand-1000, #2563eb));
        color: #ffffff;
        border-color: var(--brand-primary, var(--ds-brand-1000, #2563eb));
      }
      .ai-ui-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap:16px;
      }
      .ai-ui-modal-backdrop {
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.5);
        z-index: 9999;
        align-items: center;
        justify-content: center;
        padding: 16px;
      }
      .ai-ui-modal-backdrop.open { display: flex; }
      .ai-ui-modal-box {
        width: 100%;
        max-width: 440px;
        background: var(--bg-surface, #ffffff);
        border: 1px solid var(--border-default, #e5e7eb);
        border-radius: var(--radius-lg, 12px);
        box-shadow: var(--ds-shadow-2xl, 0 20px 40px rgba(15,23,42,0.18));
        overflow: hidden;
      }
      @media (max-width: 1023px) {
        .ai-ui-layout { grid-template-columns: 1fr; }
        .ai-ui-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 600px) {
        .ai-ui-kpi-grid { grid-template-columns: 1fr; }
        .ai-ui-form-grid { grid-template-columns: 1fr; }
      }
      .canvas-frame.tablet .ai-ui-layout { grid-template-columns: 1fr; }
      .canvas-frame.tablet .ai-ui-kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .canvas-frame.mobile .ai-ui-layout { grid-template-columns: 1fr; }
      .canvas-frame.mobile .ai-ui-kpi-grid { grid-template-columns: 1fr; }
      .canvas-frame.mobile .ai-ui-form-grid { grid-template-columns: 1fr; }
    `;

    const AI_STANDALONE_BASE_CSS = `
      :root {
        --bg-app: #f8fafc;
        --bg-surface: #ffffff;
        --bg-subtle: #f1f5f9;
        --border-default: #e5e7eb;
        --border-strong: #d1d5db;
        --text-primary: #111827;
        --text-secondary: #4b5563;
        --text-muted: #6b7280;
        --brand-primary: var(--ds-brand-1000, #2563eb);
        --brand-primary-hover: var(--ds-brand-1100, var(--ds-brand-800, #1d4ed8));
        --brand-soft: var(--ds-brand-50, #eff6ff);
        --brand-border: var(--ds-brand-200, #bfdbfe);
        --radius-sm: 6px;
        --radius-md: 8px;
        --radius-lg: 12px;
        --shadow-xs: var(--ds-shadow-xs, 0 1px 2px rgba(15,23,42,0.05));
        --shadow-sm: var(--ds-shadow-sm, 0 1px 3px rgba(15,23,42,0.08));
        --shadow-md: var(--ds-shadow-md, 0 4px 12px rgba(15,23,42,0.08));
      }
      [data-theme="dark"] {
        --bg-app: var(--ds-grey-25, #0b1120);
        --bg-surface: var(--ds-grey-50, #111827);
        --bg-subtle: var(--ds-grey-100, #1e293b);
        --border-default: var(--ds-grey-200, #334155);
        --border-strong: var(--ds-grey-300, #475569);
        --text-primary: var(--ds-grey-1000, #f8fafc);
        --text-secondary: var(--ds-grey-700, #cbd5e1);
        --text-muted: var(--ds-grey-500, #94a3b8);
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: var(--ds-font-sans, "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif);
        background: var(--bg-app);
        color: var(--text-primary);
        font-size: 13.5px;
        line-height: 1.5;
        padding: 24px 16px 56px;
        -webkit-font-smoothing: antialiased;
      }
      .ds-standalone-wrap { max-width: 1180px; margin: 0 auto; }
      .ds-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap:8px;
        height: 36px;
        padding: 0 14px;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.15s;
      }
      .ds-btn-primary {
        background: var(--btn-primary-bg, var(--brand-gradient, var(--brand-primary, #2563eb)));
        color: var(--btn-primary-color, #ffffff);
        box-shadow: var(--btn-primary-shadow, none);
        border: var(--btn-primary-border, 1px solid transparent);
        transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .ds-btn-primary:hover {
        background: var(--btn-primary-hover-bg, var(--brand-gradient-hover, var(--brand-primary-hover, #1d4ed8)));
        box-shadow: var(--btn-primary-hover-shadow, none);
      }
      .ds-btn-secondary {
        background: var(--bg-surface);
        color: var(--text-primary);
        border-color: var(--border-default);
      }
      .ds-btn-secondary:hover { background: var(--bg-subtle); }
      .ds-input { height:32px !important; line-height:30px !important; 
        width: 100%;
        height: 38px;
        padding: 0 12px;
        border-radius: 8px;
        border: 1px solid var(--border-default);
        background: var(--bg-surface);
        color: var(--text-primary);
        font-size: 13px;
        outline: none;
      }
      .ds-input:focus {
        border-color: var(--brand-primary);
        box-shadow: 0 0 0 3px var(--brand-soft);
      }
      .ds-badge {
        display: inline-flex;
        align-items: center;
        gap:4px;
        padding:4px 9px;
        border-radius: 999px;
        font-size: 11.5px;
        font-weight: 600;
      }
      .ds-badge-blue { background: var(--ds-brand-100, #dbeafe); color: var(--ds-brand-1000, #1d4ed8); }
      .ds-badge-green { background: var(--ds-green-100, #dcfce7); color: var(--ds-green-1000, #15803d); }
      .ds-badge-amber { background: var(--ds-amber-100, #fef3c7); color: var(--ds-amber-1000, #b45309); }
      .ds-badge-red { background: var(--ds-red-100, #fee2e2); color: var(--ds-red-1000, #b91c1c); }
      .ds-badge-grey { background: var(--ds-grey-100, #f3f4f6); color: var(--ds-grey-700, #374151); }
      .ds-link { color: var(--brand-primary); font-weight: 600; text-decoration: none; cursor: pointer; }
      .ds-link:hover { text-decoration: underline; }
      .ds-demo-topbar {
        max-width: 1180px;
        margin: 0 auto 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:8px;
        font-size: 12px;
        color: var(--text-muted);
      }
      .ds-demo-toast {
        position: fixed;
        right: 20px;
        bottom: 20px;
        padding:12px 16px;
        border-radius: 10px;
        background: #111827;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 500;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: all 0.2s;
        z-index: 99999;
      }
      .ds-demo-toast.show { opacity: 1; transform: translateY(0); }
      .code-block {
        background: #0f172a;
        color: #e2e8f0;
        padding:16px 16px;
        border-radius: 10px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        overflow-x: auto;
        line-height: 1.55;
      }
    `;

    function ensureAIComposerStylesInjected() {
      if (document.getElementById('ai-composed-ui-styles')) return;
      const style = document.createElement('style');
      style.id = 'ai-composed-ui-styles';
      style.textContent = AI_COMPOSER_CORE_CSS;
      document.head.appendChild(style);
    }
    ensureAIComposerStylesInjected();

    function getStandaloneLogoMarkup(variantId = 'logo-horizontal', heightPx = 28) {
      const items = (typeof logosState !== 'undefined' && Array.isArray(logosState.items)) ? logosState.items : [];
      const item = items.find(i => i.id === variantId) || items[0];
      const brandLabel = escapeHTML((typeof logosState !== 'undefined' && logosState.brandName) ? logosState.brandName : 'De Studio');
      if (!item) return `<strong style="font-size:15px;">${brandLabel}</strong>`;
      if (item.dataUrl) {
        return `<img src="${item.dataUrl}" alt="${brandLabel}" style="height:${heightPx}px; width:auto; display:block;" />`;
      }
      if (item.svg) {
        return item.svg.replace('<svg ', `<svg style="height:${heightPx}px; width:auto; display:block;" `);
      }
      return `<strong style="font-size:15px;">${brandLabel}</strong>`;
    }

    function aiBlockNavbar() {
      const logo = getStandaloneLogoMarkup('logo-horizontal', 28);
      return `
        <header class="ai-ui-navbar">
          <div class="ai-ui-brand">${logo}</div>
          <nav class="ai-ui-nav-links" data-ai-group="nav">
            <button type="button" class="ai-ui-nav-link active" data-ai-tab-item>Overview</button>
            <button type="button" class="ai-ui-nav-link" data-ai-tab-item>Projects</button>
            <button type="button" class="ai-ui-nav-link" data-ai-tab-item>Analytics</button>
            <button type="button" class="ai-ui-nav-link" data-ai-tab-item>Settings</button>
          </nav>
          <div class="ai-ui-nav-actions">
            <button type="button" class="ds-btn ds-btn-secondary" data-ai-toast="${t('Đã mở trung tâm thông báo', 'Notification center opened')}">${t('Thông báo', 'Notifications')}</button>
            <button type="button" class="ds-btn ds-btn-primary" data-ai-modal-open="aiDemoModal">${t('+ Tạo mới', '+ Create New')}</button>
          </div>
        </header>`;
    }

    function aiBlockSidebar() {
      const logo = getStandaloneLogoMarkup('logo-horizontal', 24);
      const navItems = [
        { name: 'Dashboard', badge: '' },
        { name: 'Detection', badge: 'Live' },
        { name: 'History', badge: '132' },
        { name: 'Policies', badge: '' },
        { name: 'Settings', badge: '' }
      ];
      return `
        <aside class="ai-ui-sidebar">
          <div style="padding:2px 6px 8px; border-bottom:1px solid var(--border-default);">${logo}</div>
          <div class="ai-ui-side-list" data-ai-group="sidebar">
            ${navItems.map((it, idx) => `
              <button type="button" class="ai-ui-side-item ${idx === 0 ? 'active' : ''}" data-ai-tab-item>
                <span>${it.name}</span>
                ${it.badge ? `<span class="ds-badge ds-badge-blue" style="font-size:10px; padding:1px 7px;">${it.badge}</span>` : ''}
              </button>`).join('')}
          </div>
          <div class="ai-ui-side-user">
            <span class="ai-ui-avatar">EJ</span>
            <div style="min-width:0;">
              <div style="font-size:12.5px; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Ema Jose</div>
              <div style="font-size:11px; color:var(--text-muted);">Workspace Admin</div>
            </div>
          </div>
        </aside>`;
    }

    function aiBlockSectionHeader(
      title = t('Quản lý Workspace SaaS', 'SaaS Workspace Manager'),
      subtitle = t('Theo dõi trạng thái, bộ lọc thời gian thực và hiệu năng hệ thống.', 'Monitor live status, real-time filters, and workspace telemetry.'),
      ctaLabel = t('Xuất báo cáo', 'Export report')
    ) {
      return `
        <section class="ai-ui-sec-head">
          <div>
            <span class="ds-badge ds-badge-blue">Workspace Module</span>
            <h2 class="ai-ui-sec-title">${escapeHTML(title)}</h2>
            <p class="ai-ui-sec-sub">${escapeHTML(subtitle)}</p>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap;">
            <button type="button" class="ds-btn ds-btn-secondary" data-ai-toast="${t('Đã làm mới dữ liệu', 'Data refreshed')}">${escapeHTML(ctaLabel)}</button>
            <button type="button" class="ds-btn ds-btn-primary" data-ai-modal-open="aiDemoModal">${t('+ Thêm mục mới', '+ Add New Item')}</button>
          </div>
        </section>`;
    }

    function aiBlockAlertBanner() {
      return `
        <div class="ai-ui-alert" data-ai-dismissible>
          <div><strong>${t('Hệ thống đã đồng bộ:', 'System synced:')}</strong> ${t('Toàn bộ components đang sử dụng bộ màu &amp; tokens hiện hành của De Studio 1.0.', 'All components reflect the active De Studio 1.0 palette &amp; tokens.')}</div>
          <button type="button" class="ds-btn ds-btn-secondary" style="height:28px; padding:0 10px; font-size:11.5px;" data-ai-dismiss>${t('Ẩn', 'Dismiss')}</button>
        </div>`;
    }

    function aiBlockStatsGrid() {
      const stats = [
        { label: 'Active Streams', value: '14,820', badge: '+12.4%', cls: 'ds-badge-green', pct: 78 },
        { label: 'Protected Keys', value: '3,412', badge: '+6.1%', cls: 'ds-badge-blue', pct: 64 },
        { label: 'Queue Processing', value: '48', badge: '2.4s avg', cls: 'ds-badge-amber', pct: 42 },
        { label: 'SLA Uptime', value: '99.98%', badge: 'Healthy', cls: 'ds-badge-green', pct: 96 }
      ];
      return `
        <section class="ai-ui-kpi-grid">
          ${stats.map(s => `
            <div class="ai-ui-kpi-card">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <span class="ai-ui-kpi-label">${s.label}</span>
                <span class="ds-badge ${s.cls}">${s.badge}</span>
              </div>
              <div class="ai-ui-kpi-val">${s.value}</div>
              <div class="ai-ui-progress-track"><div class="ai-ui-progress-fill" style="width:${s.pct}%;"></div></div>
            </div>`).join('')}
        </section>`;
    }

    function aiBlockChartOverview() {
      const bars = [
        { day: t('T2', 'Mon'), h: 52, val: '1.8k' },
        { day: t('T3', 'Tue'), h: 74, val: '2.4k' },
        { day: t('T4', 'Wed'), h: 63, val: '2.1k' },
        { day: t('T5', 'Thu'), h: 92, val: '3.2k' },
        { day: t('T6', 'Fri'), h: 81, val: '2.8k' },
        { day: t('T7', 'Sat'), h: 58, val: '1.9k' },
        { day: t('CN', 'Sun'), h: 86, val: '3.0k' }
      ];
      return `
        <section class="ai-ui-card">
          <div class="ai-ui-card-head">
            <div>
              <strong style="font-size:14.5px;">${t('Lưu lượng xử lý 7 ngày gần nhất', 'Processing Traffic — Last 7 Days')}</strong>
              <div style="font-size:12px; color:var(--text-muted);">${t('Cập nhật theo thời gian thực', 'Updated in real time')}</div>
            </div>
            <div class="ai-ui-btn-group" data-ai-group="chart-range">
              <button type="button" class="active" data-ai-tab-item>${t('7 ngày', '7 days')}</button>
              <button type="button" data-ai-tab-item>${t('30 ngày', '30 days')}</button>
              <button type="button" data-ai-tab-item>${t('90 ngày', '90 days')}</button>
            </div>
          </div>
          <div class="ai-ui-card-body">
            <div class="ai-ui-chart-bars">
              ${bars.map(b => `
                <div class="ai-ui-bar-col">
                  <span style="font-size:11px; color:var(--text-muted); font-weight:600;">${b.val}</span>
                  <div class="ai-ui-bar-stick" style="height:${b.h}%;"></div>
                  <span style="font-size:11.5px; font-weight:600; color:var(--text-secondary);">${b.day}</span>
                </div>`).join('')}
            </div>
          </div>
        </section>`;
    }

    function aiBlockSearchFilters() {
      const searchIcon = getFoundationIconSvg('search', 14) || '';
      return `
        <div class="ai-ui-toolbar">
          <div class="ai-ui-pills" data-ai-filter-group>
            <button type="button" class="ai-ui-pill active" data-ai-filter="all">All (5)</button>
            <button type="button" class="ai-ui-pill" data-ai-filter="active">Active</button>
            <button type="button" class="ai-ui-pill" data-ai-filter="processing">Processing</button>
            <button type="button" class="ai-ui-pill" data-ai-filter="completed">Completed</button>
            <button type="button" class="ai-ui-pill" data-ai-filter="failed">Failed</button>
          </div>
          <div style="position:relative; min-width:220px; flex:1; max-width:300px;">
            <span style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--text-muted); display:inline-flex;">${searchIcon}</span>
            <input type="text" class="ds-input" style="height:34px; padding-left:32px;" placeholder="${t('Tìm kiếm tên, ID hoặc email...', 'Search name, ID, or email...')}" data-ai-search />
          </div>
        </div>`;
    }

    function aiBlockDataTable() {
      const rows = [
        { name: 'Liam Carter', sub: 'liam.carter@destudio.io • ID #DS-1042', role: 'Workspace Admin', status: 'active', badge: 'ds-badge-green', label: 'Active', time: t('2 phút trước', '2 mins ago') },
        { name: 'Hannah Brooks', sub: 'hannah.brooks@destudio.io • ID #DS-1043', role: 'Lead Designer', status: 'processing', badge: 'ds-badge-blue', label: 'Processing', time: t('14 phút trước', '14 mins ago') },
        { name: 'Noah Bennett', sub: 'noah.bennett@destudio.io • ID #DS-1044', role: 'Security Engineer', status: 'completed', badge: 'ds-badge-green', label: 'Completed', time: t('1 giờ trước', '1 hour ago') },
        { name: 'Maya Lin', sub: 'maya.lin@destudio.io • ID #DS-1045', role: 'QA Analyst', status: 'processing', badge: 'ds-badge-amber', label: 'Queuing', time: t('3 giờ trước', '3 hours ago') },
        { name: 'Ethan Cole', sub: 'ethan.cole@destudio.io • ID #DS-1046', role: 'Partner Viewer', status: 'failed', badge: 'ds-badge-red', label: 'Failed', time: t('Hôm qua', 'Yesterday') }
      ];
      return `
        <section class="ai-ui-card">
          <div class="ai-ui-card-head">
            <strong style="font-size:14.5px;">${t('Danh sách thành viên &amp; Tác vụ', 'Team Members &amp; Tasks')}</strong>
            <span class="ds-badge ds-badge-grey" data-ai-row-count>${rows.length} ${t('bản ghi', 'items')}</span>
          </div>
          <div class="ai-ui-table-wrap">
            <table class="ai-ui-table">
              <thead>
                <tr>
                  <th style="width:36px;"><input type="checkbox" aria-label="Select all" /></th>
                  <th>${t('Tên / Tài nguyên', 'Name / Resource')}</th>
                  <th>${t('Vai trò', 'Role')}</th>
                  <th>${t('Trạng thái', 'Status')}</th>
                  <th>${t('Cập nhật', 'Updated')}</th>
                  <th style="text-align:right;">${t('Hành động', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(r => `
                  <tr class="ai-filter-row" data-status="${r.status}" data-search="${escapeHTML((r.name + ' ' + r.sub + ' ' + r.role + ' ' + r.label).toLowerCase())}">
                    <td><input type="checkbox" aria-label="Select row" /></td>
                    <td>
                      <div style="font-weight:600; color:var(--text-primary);">${escapeHTML(r.name)}</div>
                      <div style="font-size:11.5px; color:var(--text-muted);">${escapeHTML(r.sub)}</div>
                    </td>
                    <td>${escapeHTML(r.role)}</td>
                    <td><span class="ds-badge ${r.badge}">${r.label}</span></td>
                    <td style="color:var(--text-muted);">${r.time}</td>
                    <td style="text-align:right;"><a class="ds-link" data-ai-toast="${t('Đang mở chi tiết:', 'Inspecting:')} ${escapeHTML(r.name)}">${t('Chi tiết', 'Inspect')}</a></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>`;
    }

    function aiBlockHistoryList() {
      const items = [
        { title: 'Forensic Watermark Stream — Matchday 08', id: 'ID1357924680', status: 'processing', badge: 'ds-badge-blue', label: 'Processing', date: '12-11-2026 19:35' },
        { title: 'Live Sports Broadcast Package #42', id: 'ID1357924681', status: 'processing', badge: 'ds-badge-grey', label: 'Queuing...', date: '12-11-2026 19:42' },
        { title: 'VOD Series Season 03 — Master UHD', id: 'ID1357924510', status: 'completed', badge: 'ds-badge-green', label: 'Succeeded', date: '12-11-2026 16:10' },
        { title: 'Partner Syndication Feed #19', id: 'ID1357924408', status: 'failed', badge: 'ds-badge-amber', label: 'Denied', date: '12-11-2026 14:20' },
        { title: 'Audio Fingerprint Check #07', id: 'ID1357924112', status: 'failed', badge: 'ds-badge-red', label: 'Failed', date: '11-11-2026 22:05' }
      ];
      return `
        <section class="ai-ui-card">
          <div class="ai-ui-card-head">
            <strong>Media Protection — Detection History</strong>
            <span class="ds-badge ds-badge-grey" data-ai-row-count>${items.length} items</span>
          </div>
          <div class="ai-ui-table-wrap">
            <table class="ai-ui-table">
              <thead>
                <tr>
                  <th>Content Title &amp; Job ID</th>
                  <th>${t('Trạng thái', 'Status')}</th>
                  <th>Timestamp</th>
                  <th style="text-align:right;">${t('Tác vụ', 'Actions')}</th>
                </tr>
              </thead>
              <tbody>
                ${items.map(it => `
                  <tr class="ai-filter-row" data-status="${it.status}" data-search="${escapeHTML((it.title + ' ' + it.id + ' ' + it.label).toLowerCase())}">
                    <td>
                      <div style="font-weight:600;">${escapeHTML(it.title)}</div>
                      <div style="font-size:11.5px; color:var(--text-muted);">${it.id}</div>
                    </td>
                    <td><span class="ds-badge ${it.badge}">${it.label}</span></td>
                    <td style="color:var(--text-muted);">${it.date}</td>
                    <td style="text-align:right;"><a class="ds-link" data-ai-toast="Inspect ${it.id}">${t('Xem log', 'View log')}</a></td>
                  </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>`;
    }

    function aiBlockSettingsPanel() {
      return `
        <section class="ai-ui-card">
          <div class="ai-ui-card-head">
            <div>
              <strong style="font-size:14.5px;">${t('Cài đặt Hệ thống &amp; Bảo mật', 'System &amp; Security Settings')}</strong>
              <div style="font-size:12px; color:var(--text-muted);">${t('Cấu hình tùy chọn Workspace bằng Toggles, Button Group &amp; Inputs', 'Configure Workspace options with Toggles, Button Groups &amp; Inputs')}</div>
            </div>
            <div class="ai-ui-btn-group" data-ai-group="settings-tabs">
              <button type="button" class="active" data-ai-tab-item>${t('Chung', 'General')}</button>
              <button type="button" data-ai-tab-item>${t('Bảo mật', 'Security')}</button>
              <button type="button" data-ai-tab-item>${t('Thông báo', 'Alerts')}</button>
            </div>
          </div>
          <div class="ai-ui-card-body">
            <div class="ai-ui-form-grid" style="margin-bottom:16px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:6px;">${t('Tên Workspace', 'Workspace Name')}</label>
                <input class="ds-input" type="text" value="De Studio Enterprise" />
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:6px;">${t('Domain cho phép', 'Allowed Domain')}</label>
                <input class="ds-input" type="text" value="app.destudio.io" />
              </div>
            </div>
            <div class="ai-ui-setting-row">
              <div>
                <div style="font-weight:600;">${t('Xác thực 2 lớp (2FA)', 'Two-Factor Authentication (2FA)')}</div>
                <div style="font-size:12px; color:var(--text-muted);">${t('Yêu cầu mã OTP cho mọi thành viên quản trị.', 'Require OTP codes for all workspace admins.')}</div>
              </div>
              <button type="button" class="ai-ui-toggle on" aria-pressed="true" data-ai-toggle></button>
            </div>
            <div class="ai-ui-setting-row">
              <div>
                <div style="font-weight:600;">${t('Tự động đồng bộ Design Tokens', 'Auto-Sync Design Tokens')}</div>
                <div style="font-size:12px; color:var(--text-muted);">${t('Đẩy biến CSS mới mỗi khi xuất bản Color Tab.', 'Push fresh CSS tokens whenever publishing a Color Tab.')}</div>
              </div>
              <button type="button" class="ai-ui-toggle on" aria-pressed="true" data-ai-toggle></button>
            </div>
            <div class="ai-ui-setting-row">
              <div>
                <div style="font-weight:600;">${t('Cảnh báo sự cố qua Email', 'Email Incident Alerts')}</div>
                <div style="font-size:12px; color:var(--text-muted);">${t('Gửi thông báo ngay khi phát hiện lỗi xử lý stream.', 'Notify immediately upon stream processing failures.')}</div>
              </div>
              <button type="button" class="ai-ui-toggle" aria-pressed="false" data-ai-toggle></button>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px; padding-top:14px; border-top:1px solid var(--border-default);">
              <button type="button" class="ds-btn ds-btn-secondary" data-ai-toast="${t('Đã hoàn tác thay đổi', 'Changes reverted')}">${t('Hủy bỏ', 'Cancel')}</button>
              <button type="button" class="ds-btn ds-btn-primary" data-ai-toast="${t('Đã lưu cài đặt thành công!', 'Settings saved!')}">${t('Lưu cấu hình', 'Save Settings')}</button>
            </div>
          </div>
        </section>`;
    }

    function aiBlockFormCard() {
      const logo = getStandaloneLogoMarkup('logo-horizontal', 28);
      return `
        <section class="ai-ui-card" style="max-width:520px; width:100%; margin:0 auto;">
          <div class="ai-ui-card-head">
            <div>${logo}</div>
            <span class="ds-badge ds-badge-blue">Onboarding Form</span>
          </div>
          <form class="ai-ui-card-body" onsubmit="event.preventDefault(); showToast('${t('Đã gửi form tạo Workspace!', 'Workspace request submitted!')}');">
            <h3 style="font-size:17px; font-weight:700; margin-bottom:4px;">${t('Tạo tài khoản Workspace', 'Create Workspace Account')}</h3>
            <p style="font-size:12.5px; color:var(--text-muted); margin-bottom:16px;">${t('Dùng thử nền tảng De Studio Cloud hoàn toàn miễn phí trong 14 ngày.', 'Start your 14-day free trial on De Studio Cloud.')}</p>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">${t('Họ và tên *', 'Full Name *')}</label>
                <input class="ds-input" type="text" placeholder="${t('Nguyễn Văn A', 'Alex Morgan')}" required />
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">${t('Email công việc *', 'Work Email *')}</label>
                <input class="ds-input" type="email" placeholder="name@company.com" required />
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">${t('Mật khẩu *', 'Password *')}</label>
                <div style="position:relative;">
                  <input class="ds-input" type="password" value="DeStudio@2026" style="padding-right:64px;" required />
                  <button type="button" class="ds-btn ds-btn-secondary" style="position:absolute; right:4px; top:4px; height:30px; padding:0 8px; font-size:11px;" data-ai-pw-toggle>${t('Hiện', 'Show')}</button>
                </div>
              </div>
              <label style="display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text-secondary);">
                <input type="checkbox" checked />
                <span>${t('Tôi đồng ý với', 'I agree to the')} <a class="ds-link" data-ai-toast="${t('Xem điều khoản sử dụng', 'Opening Terms of Service')}">${t('Điều khoản &amp; Bảo mật', 'Terms &amp; Privacy')}</a></span>
              </label>
              <button type="submit" class="ds-btn ds-btn-primary" style="width:100%; margin-top:4px;">${t('Tạo tài khoản ngay', 'Create Account')}</button>
            </div>
          </form>
        </section>`;
    }

    function aiBlockAuthCard() {
      const logo = getStandaloneLogoMarkup('logo-horizontal', 30);
      return `
        <section class="ai-ui-card" style="max-width:430px; width:100%; margin:0 auto;">
          <form class="ai-ui-card-body" style="padding:26px;" onsubmit="event.preventDefault(); showToast('${t('Đăng nhập thành công!', 'Signed in successfully!')}');">
            <div style="display:flex; justify-content:center; margin-bottom:16px;">${logo}</div>
            <div style="text-align:center; margin-bottom:16px;">
              <h2 style="font-size:20px; font-weight:700; margin-bottom:4px;">${t('Đăng nhập hệ thống', 'Sign In to De Studio')}</h2>
              <p style="font-size:12.5px; color:var(--text-muted);">${t('Sử dụng email doanh nghiệp hoặc Google SSO để tiếp tục.', 'Use your work email or Google SSO to continue.')}</p>
            </div>
            <button type="button" class="ds-btn ds-btn-secondary" style="width:100%; margin-bottom:14px;" data-ai-toast="${t('Đang chuyển hướng Google SSO...', 'Redirecting to Google SSO...')}">
              <span style="font-weight:700;">G</span> ${t('Tiếp tục với Google', 'Continue with Google')}
            </button>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px; color:var(--text-muted); font-size:11.5px;">
              <span style="flex:1; height:1px; background:var(--border-default);"></span>
              <span>${t('hoặc dùng Email', 'or sign in with Email')}</span>
              <span style="flex:1; height:1px; background:var(--border-default);"></span>
            </div>
            <div style="display:flex; flex-direction:column; gap:12px;">
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">Email</label>
                <input class="ds-input" type="email" value="admin@destudio.io" required />
              </div>
              <div>
                <label style="display:block; font-size:12px; font-weight:600; margin-bottom:5px;">${t('Mật khẩu', 'Password')}</label>
                <div style="position:relative;">
                  <input class="ds-input" type="password" value="••••••••••" style="padding-right:64px;" required />
                  <button type="button" class="ds-btn ds-btn-secondary" style="position:absolute; right:4px; top:4px; height:30px; padding:0 8px; font-size:11px;" data-ai-pw-toggle>${t('Hiện', 'Show')}</button>
                </div>
              </div>
              <button type="submit" class="ds-btn ds-btn-primary" style="width:100%; margin-top:4px;">${t('Đăng nhập ngay', 'Sign In')}</button>
            </div>
          </form>
        </section>`;
    }

    function aiBlockModalBackdrop(openByDefault = false) {
      return `
        <div class="ai-ui-modal-backdrop ${openByDefault ? 'open' : ''}" id="aiDemoModal" data-ai-modal>
          <div class="ai-ui-modal-box">
            <div style="padding:16px 20px; border-bottom:1px solid var(--border-default); display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:15px;">${t('Xác nhận xuất bản Design System', 'Confirm Design System Publish')}</strong>
              <button type="button" class="ds-btn ds-btn-secondary" style="height:28px; padding:0 9px;" data-ai-modal-close>✕</button>
            </div>
            <div style="padding:16px 20px; font-size:13.5px; color:var(--text-secondary);">
              ${t('Phiên bản giao diện đang dùng sẽ được đóng gói cùng toàn bộ Design Tokens &amp; Logo thương hiệu. Bạn có muốn tiếp tục?', 'Your active theme snapshot will be packaged with all Design Tokens &amp; Brand Logos. Continue?')}
            </div>
            <div style="padding:12px 20px; background:var(--bg-app); border-top:1px solid var(--border-default); display:flex; justify-content:flex-end; gap:8px;">
              <button type="button" class="ds-btn ds-btn-secondary" data-ai-modal-close>${t('Để sau', 'Later')}</button>
              <button type="button" class="ds-btn ds-btn-primary" data-ai-modal-close data-ai-toast="${t('Đã xác nhận xuất bản phiên bản mới!', 'New version published!')}">${t('Xác nhận ngay', 'Publish Now')}</button>
            </div>
          </div>
        </div>`;
    }

    function aiBlockModalDialog(openByDefault = false) {
      return `
        <div class="ai-ui-card" style="padding:16px 18px; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
          <div>
            <strong style="font-size:13.5px;">${t('Modals Pop-up tương tác', 'Interactive Modal Pop-up')}</strong>
            <div style="font-size:12px; color:var(--text-muted);">${t('Bấm nút bên cạnh để mở hộp thoại xác nhận chuẩn hệ thống.', 'Click the button to trigger the system confirmation dialog.')}</div>
          </div>
          <button type="button" class="ds-btn ds-btn-primary" data-ai-modal-open="aiDemoModal">${t('Mở Modal Xác nhận', 'Open Confirmation Modal')}</button>
        </div>
        ${aiBlockModalBackdrop(openByDefault)}`;
    }

    function aiBlockPagination() {
      return `
        <div class="ai-ui-pagination">
          <div style="color:var(--text-muted);">${t('Hiển thị <strong>1–5</strong> trên tổng số <strong>60</strong> bản ghi', 'Showing <strong>1–5</strong> of <strong>60</strong> records')}</div>
          <div style="display:flex; align-items:center; gap:8px;" data-ai-group="pagination">
            <button type="button" class="ai-ui-page-btn" data-ai-toast="${t('Trang trước', 'Previous page')}">‹</button>
            <button type="button" class="ai-ui-page-btn active" data-ai-tab-item>1</button>
            <button type="button" class="ai-ui-page-btn" data-ai-tab-item>2</button>
            <button type="button" class="ai-ui-page-btn" data-ai-tab-item>3</button>
            <button type="button" class="ai-ui-page-btn" data-ai-toast="${t('Trang tiếp theo', 'Next page')}">›</button>
          </div>
        </div>`;
    }

    function initAIComposedInteractions(root) {
      var scope = root || document;
      var isEn = (document.documentElement.getAttribute('lang') || 'en') === 'en';
      function applyFilters() {
        var activePill = scope.querySelector('[data-ai-filter].active');
        var filterVal = activePill ? activePill.getAttribute('data-ai-filter') : 'all';
        var searchInput = scope.querySelector('[data-ai-search]');
        var q = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var rows = scope.querySelectorAll('.ai-filter-row');
        var visible = 0;
        rows.forEach(function(row) {
          var st = row.getAttribute('data-status') || '';
          var txt = (row.getAttribute('data-search') || row.textContent || '').toLowerCase();
          var matchStatus = (filterVal === 'all' || st === filterVal);
          var matchQuery = (!q || txt.indexOf(q) !== -1);
          var ok = matchStatus && matchQuery;
          row.style.display = ok ? '' : 'none';
          if (ok) visible++;
        });
        scope.querySelectorAll('[data-ai-row-count]').forEach(function(c) {
          c.textContent = visible + (isEn ? ' items' : ' bản ghi');
        });
      }
      scope.querySelectorAll('[data-ai-filter]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var parent = btn.closest('[data-ai-filter-group]') || scope;
          parent.querySelectorAll('[data-ai-filter]').forEach(function(b) { b.classList.remove('active'); });
          btn.classList.add('active');
          applyFilters();
        });
      });
      scope.querySelectorAll('[data-ai-search]').forEach(function(inp) {
        inp.addEventListener('input', applyFilters);
      });
      scope.querySelectorAll('[data-ai-tab-item]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var grp = btn.closest('[data-ai-group]');
          if (grp) {
            grp.querySelectorAll('[data-ai-tab-item]').forEach(function(b) { b.classList.remove('active'); });
          }
          btn.classList.add('active');
        });
      });
      scope.querySelectorAll('[data-ai-toggle]').forEach(function(tg) {
        tg.addEventListener('click', function() {
          var isOn = tg.classList.toggle('on');
          tg.setAttribute('aria-pressed', isOn ? 'true' : 'false');
          showToast(isOn ? (isEn ? 'Option enabled' : 'Đã bật tùy chọn') : (isEn ? 'Option disabled' : 'Đã tắt tùy chọn'));
        });
      });
      scope.querySelectorAll('[data-ai-pw-toggle]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var inp = btn.parentElement ? btn.parentElement.querySelector('input') : null;
          if (!inp) return;
          var toText = inp.type === 'password';
          inp.type = toText ? 'text' : 'password';
          btn.textContent = toText ? (isEn ? 'Hide' : 'Ẩn') : (isEn ? 'Show' : 'Hiện');
        });
      });
      scope.querySelectorAll('[data-ai-dismiss]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var box = btn.closest('[data-ai-dismissible]');
          if (box) box.style.display = 'none';
        });
      });
      scope.querySelectorAll('[data-ai-modal-open]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var targetId = btn.getAttribute('data-ai-modal-open');
          var modal = scope.querySelector('#' + targetId) || document.getElementById(targetId);
          if (modal) modal.classList.add('open');
        });
      });
      scope.querySelectorAll('[data-ai-modal-close]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var modal = btn.closest('[data-ai-modal]');
          if (modal) modal.classList.remove('open');
        });
      });
      scope.querySelectorAll('[data-ai-toast]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          showToast(btn.getAttribute('data-ai-toast'));
        });
      });
    }

    const AI_STANDALONE_INTERACTIVE_JS = [
      'function showToast(msg) {',
      '  var el = document.getElementById("aiDemoToast");',
      '  if (!el) return;',
      '  el.textContent = msg;',
      '  el.classList.add("show");',
      '  clearTimeout(el._t);',
      '  el._t = setTimeout(function() { el.classList.remove("show"); }, 2400);',
      '}',
      initAIComposedInteractions.toString(),
      'document.addEventListener("DOMContentLoaded", function() {',
      '  initAIComposedInteractions(document);',
      '});'
    ].join('\n');

    const aiOutputsRegistry = {};

    function resolveAIOutputPayload(msgId) {
      if (msgId && aiOutputsRegistry[msgId]) return aiOutputsRegistry[msgId];
      return {
        html: lastGeneratedAIHtml,
        title: lastGeneratedAITitle || 'De Studio AI Demo',
        prompt: lastGeneratedAIPrompt || '',
        blocks: lastGeneratedAIBlocks || []
      };
    }

    function buildStandaloneAIDemoHTML(innerHtml, title = 'De Studio AI Generated UI') {
      const appliedTab = typeof getAppliedColorTab === 'function' ? getAppliedColorTab() : null;
      const colorTokensCss = typeof buildColorCSSTokens === 'function' ? buildColorCSSTokens(appliedTab) : '';
      const typoTokensCss = typeof buildTypographyCSSTokens === 'function' ? buildTypographyCSSTokens() : '';
      const spacingTokensCss = typeof buildSpacingCSSTokens === 'function' ? buildSpacingCSSTokens() : '';
      const effectsTokensCss = typeof buildEffectsCSSTokens === 'function' ? buildEffectsCSSTokens() : '';
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const brandLabel = (typeof logosState !== 'undefined' && logosState.brandName) ? logosState.brandName : 'De Studio';
      const tabLabel = appliedTab ? getColorTabDisplayName(appliedTab) : t('De Studio Gốc', 'De Studio Default');
      const docLang = uiLang === 'en' ? 'en' : 'vi';

      return `<!DOCTYPE html>
<html lang="${docLang}"${isDark ? ' data-theme="dark"' : ''}>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHTML(title)} — ${escapeHTML(brandLabel)}</title>
  <style>
${colorTokensCss}

${typoTokensCss}

${spacingTokensCss}

${effectsTokensCss}

${AI_STANDALONE_BASE_CSS}

${AI_COMPOSER_CORE_CSS}
  </style>
</head>
<body>
  <div class="ds-demo-topbar">
    <span><strong>${escapeHTML(brandLabel)}</strong> • ${t('Demo xuất từ Offline AI • Bảng màu:', 'Generated by Offline AI • Theme:')} <strong>${escapeHTML(tabLabel)}</strong></span>
    <button type="button" class="ds-btn ds-btn-secondary" style="height:28px; padding:0 10px; font-size:11.5px;" onclick="document.documentElement.setAttribute('data-theme', document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark')">${t('Đổi Light / Dark', 'Toggle Light / Dark')}</button>
  </div>
  <main class="ds-standalone-wrap">
${innerHtml}
  </main>
  <div class="ds-demo-toast" id="aiDemoToast"></div>
  <script>
${AI_STANDALONE_INTERACTIVE_JS}
  <\/script>
</body>
</html>`;
    }

    function copyStandaloneAIDemoHTML(msgId) {
      const payload = resolveAIOutputPayload(msgId);
      if (!payload.html || !payload.html.trim()) {
        showToast(t('Chưa có UI nào được tạo để copy.', 'No generated UI yet to copy.'));
        return;
      }
      const fullHtml = buildStandaloneAIDemoHTML(payload.html, payload.title || 'De Studio AI Demo');
      copyText(fullHtml, t('Đã copy file HTML hoàn chỉnh (<!DOCTYPE html>) — dán vào file .html để mở demo!', 'Copied complete HTML file (<!DOCTYPE html>) — save as .html to run standalone!'));
    }

    function downloadStandaloneAIDemoHTML(msgId) {
      const payload = resolveAIOutputPayload(msgId);
      if (!payload.html || !payload.html.trim()) {
        showToast(t('Chưa có UI nào được tạo để tải xuống.', 'No generated UI yet to download.'));
        return;
      }
      const fullHtml = buildStandaloneAIDemoHTML(payload.html, payload.title || 'De Studio AI Demo');
      const slug = (payload.title || 'de-studio-ai-demo')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'de-studio-ai-demo';
      const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${slug}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(t(`Đã tải file demo: ${slug}.html`, `Downloaded demo file: ${slug}.html`));
    }

    function updateAIContext() {
      const page = findPageById(activePageId);
      document.getElementById('aiContextName').textContent = page.name;
      const promptsEl = document.getElementById('aiQuickPrompts');
      promptsEl.innerHTML = uiLang === 'en' ? `
        <button class="prompt-chip" onclick="runQuickPrompt('/compose header + stats + filters + table + pagination')">/compose Full SaaS</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/dashboard Workspace Analytics')">/dashboard</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/settings Workspace Settings')">/settings</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/history Media Protection')">/history</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/auth Sign In to De Studio')">/auth</button>
      ` : `
        <button class="prompt-chip" onclick="runQuickPrompt('/compose header + stats + filters + table + pagination')">/compose Full SaaS</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/dashboard Workspace Analytics')">/dashboard</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/settings Cài đặt Workspace')">/settings</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/history Media Protection')">/history</button>
        <button class="prompt-chip" onclick="runQuickPrompt('/auth Đăng nhập De Studio')">/auth</button>
      `;
    }

    function handleComposerInput(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
      const val = el.value;
      if (val.startsWith('/') && !val.includes(' ')) {
        const token = val.toLowerCase();
        let anyVisible = false;
        slashMenu.querySelectorAll('.slash-item').forEach(item => {
          const cmd = (item.getAttribute('data-cmd') || '').toLowerCase();
          const show = token === '/' || cmd.includes(token);
          item.style.display = show ? 'flex' : 'none';
          if (show) anyVisible = true;
        });
        slashMenu.classList.toggle('open', anyVisible);
      } else {
        slashMenu.classList.remove('open');
      }
    }

    function handleComposerKeydown(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        slashMenu.classList.remove('open');
        sendAIMessage();
      } else if (e.key === 'Escape') {
        slashMenu.classList.remove('open');
      }
    }

    function insertSlashCommand(cmd) {
      const input = document.getElementById('aiInput');
      input.value = cmd;
      slashMenu.classList.remove('open');
      input.focus();
    }

    function runQuickPrompt(text) {
      document.getElementById('aiInput').value = text;
      sendAIMessage();
    }

    function appendAIMessage(role, htmlContent) {
      const container = document.getElementById('aiMessages');
      const div = document.createElement('div');
      div.className = 'msg-bubble';
      div.innerHTML = htmlContent;
      container.appendChild(div);
      container.scrollTop = container.scrollHeight;
    }

    function detectAIComposerBlocks(lower) {
      const blocks = [];
      const has = (...keys) => keys.some(k => lower.includes(k));
      if (has('sidebar', 'side-bar', 'rail', 'menu trái')) blocks.push('sidebar');
      if (has('header', 'navbar', 'nav ', 'nav+', '+nav', 'topbar', 'thanh điều hướng')) blocks.push('navbar');
      if (has('alert', 'banner', 'thông báo')) blocks.push('alert');
      if (has('section', 'tiêu đề')) blocks.push('section-header');
      if (has('kpi', 'stats', 'stat', 'thống kê', 'metric')) blocks.push('stats');
      if (has('chart', 'biểu đồ', 'graph', 'analytics')) blocks.push('chart');
      if (has('filter', 'search', 'tìm kiếm', 'lọc')) blocks.push('search-filters');
      if (has('history', 'lịch sử', 'watermark')) blocks.push('history');
      else if (has('table', 'bảng', 'crud', 'danh sách', 'list', 'user', 'thành viên')) blocks.push('table');
      if (has('settings', 'cài đặt', 'toggle', 'cấu hình')) blocks.push('settings');
      if (has('form', 'đăng ký', 'registration', 'onboarding')) blocks.push('form');
      if (has('auth', 'login', 'đăng nhập', 'signin')) blocks.push('auth');
      if (has('modal', 'popup', 'dialog', 'hộp thoại')) blocks.push('modal');
      if (has('pagination', 'phân trang', 'paging')) blocks.push('pagination');
      return blocks;
    }

    function buildComposedSaaSUI(blocks, options = {}) {
      const hasSidebar = blocks.includes('sidebar');
      const renderBlock = name => {
        switch (name) {
          case 'navbar': return aiBlockNavbar();
          case 'alert': return aiBlockAlertBanner();
          case 'section-header': return aiBlockSectionHeader(options.title, options.subtitle, options.ctaLabel);
          case 'stats': return aiBlockStatsGrid();
          case 'chart': return aiBlockChartOverview();
          case 'search-filters': return aiBlockSearchFilters();
          case 'table': return aiBlockDataTable();
          case 'history': return aiBlockHistoryList();
          case 'settings': return aiBlockSettingsPanel();
          case 'form': return aiBlockFormCard();
          case 'auth': return aiBlockAuthCard();
          case 'modal': return aiBlockModalDialog(options.openModal);
          case 'pagination': return aiBlockPagination();
          default: return '';
        }
      };

      const topHtml = blocks.includes('navbar') ? renderBlock('navbar') : '';
      const mainBlocks = blocks.filter(b => b !== 'sidebar' && b !== 'navbar');
      const mainHtml = mainBlocks.map(renderBlock).join('\n');
      const needsHiddenModal = !blocks.includes('modal') && (blocks.includes('navbar') || blocks.includes('section-header'));
      const hiddenModalHtml = needsHiddenModal ? aiBlockModalBackdrop(false) : '';

      if (hasSidebar) {
        return `
          <div class="ai-ui-shell">
            ${topHtml}
            <div class="ai-ui-layout">
              ${aiBlockSidebar()}
              <div class="ai-ui-main">${mainHtml}</div>
            </div>
            ${hiddenModalHtml}
          </div>`;
      }
      return `
        <div class="ai-ui-shell">
          ${topHtml}
          <div class="ai-ui-main">${mainHtml}</div>
          ${hiddenModalHtml}
        </div>`;
    }

    function generateOfflineUIResponse(promptText, activePage) {
      const lower = promptText.toLowerCase().trim();
      const brandVal = (colorGroups.find(g => g.id === 'brand')?.rows.find(r => r.scale === '1000')?.light) || 'var(--brand-primary)';
      const space4Px = (spacingState.items.find(i => i.id === '4')?.px) || 16;
      const space6Px = (spacingState.items.find(i => i.id === '6')?.px) || 24;
      const appliedTab = typeof getAppliedColorTab === 'function' ? getAppliedColorTab() : null;
      const tabLabel = appliedTab ? getColorTabDisplayName(appliedTab) : t('De Studio Gốc', 'De Studio Default');

      let thoughtSteps = [
        t(
          `Đọc ngữ cảnh: <b>${activePage.sectionTitle} / ${activePage.name}</b> • Bảng màu đang dùng: <b>${escapeHTML(tabLabel)}</b>`,
          `Context loaded: <b>${activePage.sectionTitle} / ${activePage.name}</b> • Active palette: <b>${escapeHTML(tabLabel)}</b>`
        ),
        t(
          `Áp dụng Tokens: <code>--ds-brand-1000 (${brandVal})</code>, Font <code>${typoState.fontFamily}</code>, <code>--ds-space-4 (${space4Px}px)</code>, <code>--ds-space-6 (${space6Px}px)</code>`,
          `Applied Tokens: <code>--ds-brand-1000 (${brandVal})</code>, Font <code>${typoState.fontFamily}</code>, <code>--ds-space-4 (${space4Px}px)</code>, <code>--ds-space-6 (${space6Px}px)</code>`
        )
      ];

      let generatedHtml = '';
      let summary = '';
      let title = 'De Studio Composed UI';
      let composedLabels = [];

      const labelMap = {
        'sidebar': 'Navigation Sidebar',
        'navbar': 'Header Navigation',
        'alert': 'Alert Banner',
        'section-header': 'Section Header',
        'stats': 'KPI Cards + Progress',
        'chart': 'Analytics Bar Chart',
        'search-filters': 'Search & Filter Pills',
        'table': 'Data Table + Badges',
        'history': 'History Status List',
        'settings': 'Settings + Toggles',
        'form': 'Form + Password Toggle',
        'auth': 'Auth Login Card + SSO',
        'modal': 'Modal Pop-up',
        'pagination': 'Pagination'
      };

      if (lower.startsWith('/tokens')) {
        thoughtSteps.push(t(`Trích xuất bộ CSS tokens thực tế của trang <b>${activePage.name}</b>.`, `Extracted live CSS tokens for <b>${activePage.name}</b>.`));
        const cssSnippet = activePage.id === 'colors' ? buildColorCSSTokens()
          : activePage.id === 'typography' ? buildTypographyCSSTokens()
          : activePage.id === 'effect-styles' ? buildEffectsCSSTokens()
          : activePage.id === 'grids-spacing' ? buildSpacingCSSTokens()
          : buildColorCSSTokens();
        title = `Design Tokens — ${activePage.name}`;
        composedLabels = ['CSS Tokens', activePage.name];
        summary = t(
          `Đã xuất CSS Tokens của <b>${activePage.name}</b> và đưa lên tab <b>AI UI Output</b>.`,
          `Exported CSS Tokens for <b>${activePage.name}</b> to <b>AI UI Output</b>.`
        );
        generatedHtml = `
          <div class="ai-ui-shell">
            ${aiBlockSectionHeader(`Design Tokens: ${activePage.name}`, t(`Các biến CSS đồng bộ trực tiếp với bảng màu "${tabLabel}".`, `CSS variables synced live with "${translateTextValue(tabLabel)}".`), 'Refresh')}
            <div class="ai-ui-card">
              <div class="ai-ui-card-head"><strong>CSS Custom Properties</strong><span class="ds-badge ds-badge-blue">${escapeHTML(translateTextValue(tabLabel))}</span></div>
              <div class="ai-ui-card-body"><pre class="code-block" style="font-size:11.5px; margin:0;">${escapeHTML(cssSnippet)}</pre></div>
            </div>
          </div>`;
      } else if (lower.startsWith('/spec')) {
        thoughtSteps.push(t(`Sinh bảng đặc tả kỹ thuật (Specs) cho thành phần <b>${activePage.name}</b>.`, `Generated technical specification table for <b>${activePage.name}</b>.`));
        title = `Component Spec — ${activePage.name}`;
        composedLabels = ['Spec Sheet', 'Tokens', 'Responsive Rules'];
        summary = t(
          `Đã tạo tài liệu đặc tả component <b>${activePage.name}</b> trên tab <b>AI UI Output</b>.`,
          `Generated component spec sheet for <b>${activePage.name}</b> on <b>AI UI Output</b>.`
        );
        generatedHtml = `
          <div class="ai-ui-shell">
            ${aiBlockSectionHeader(t(`Đặc tả kỹ thuật: ${activePage.name}`, `Technical Spec: ${activePage.name}`), translateTextValue(activePage.desc || '') || t('Quy chuẩn tokens, tương tác và responsive.', 'Token, interaction, and responsive specification.'), t('Kiểm tra', 'Inspect'))}
            <div class="ai-ui-card">
              <div class="ai-ui-table-wrap">
                <table class="ai-ui-table">
                  <thead><tr><th>${t('Thuộc tính', 'Property')}</th><th>${t('Token / Giá trị chuẩn', 'Standard Token / Value')}</th><th>${t('Ghi chú áp dụng', 'Implementation Notes')}</th></tr></thead>
                  <tbody>
                    <tr><td><strong>Primary Color</strong></td><td><code>${brandVal}</code></td><td>${t(`Đồng bộ theo tab ${escapeHTML(tabLabel)}`, `Synced with ${escapeHTML(translateTextValue(tabLabel))}`)}</td></tr>
                    <tr><td><strong>Font Family</strong></td><td><code>${typoState.fontFamily}</code></td><td>${t('Chuẩn Typography De Studio 1.0', 'De Studio 1.0 Typography Standard')}</td></tr>
                    <tr><td><strong>Responsive Breakpoints</strong></td><td><code>&le;600px | 601–1023px | &ge;1024px</code></td><td>Mobile / Tablet / Desktop</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>`;
      } else {
        let blocks = [];
        let composeOpts = {};

        if (lower.startsWith('/compose')) {
          blocks = detectAIComposerBlocks(lower.replace('/compose', ''));
          if (!blocks.length) blocks = ['navbar', 'section-header', 'stats', 'search-filters', 'table', 'pagination'];
          title = 'Custom Composed SaaS Workspace';
          composeOpts = {
            title: t('Workspace SaaS — Ghép đa thành phần', 'SaaS Workspace — Multi-Component Compose'),
            subtitle: `${t('Tổ hợp:', 'Composed:')} ${blocks.map(b => labelMap[b] || b).join(' + ')}`
          };
        } else if (lower.startsWith('/dashboard')) {
          blocks = ['sidebar', 'navbar', 'section-header', 'stats', 'chart', 'table', 'pagination', 'modal'];
          title = 'SaaS Analytics Dashboard';
          composeOpts = {
            title: t('Tổng quan Workspace & Analytics', 'Workspace & Analytics Overview'),
            subtitle: t('Ghép đồng bộ Sidebar, Topbar, KPI Cards, Biểu đồ 7 ngày và Bảng hoạt động.', 'Synced Sidebar, Topbar, KPI Cards, 7-day Telemetry Chart & Activity Table.')
          };
        } else if (lower.startsWith('/crud') || lower.startsWith('/table')) {
          blocks = ['navbar', 'section-header', 'search-filters', 'table', 'pagination', 'modal'];
          title = t('Quản lý dữ liệu SaaS (CRUD)', 'SaaS Directory & CRUD Workspace');
          composeOpts = {
            title: t('Danh sách thành viên & Phân quyền', 'Team Members & Access Roles'),
            subtitle: t('Hỗ trợ lọc theo trạng thái (Filter Pills) và tìm kiếm thời gian thực.', 'Supports status Filter Pills and live search.')
          };
        } else if (lower.startsWith('/settings')) {
          blocks = ['sidebar', 'navbar', 'alert', 'settings', 'modal'];
          title = t('Trang Cài đặt Workspace', 'Workspace Settings Page');
        } else if (lower.startsWith('/history')) {
          blocks = ['sidebar', 'section-header', 'search-filters', 'history', 'pagination', 'modal'];
          title = 'Media Protection — Demo History';
          composeOpts = {
            title: 'Detection History',
            subtitle: t('Theo dõi các tiến trình Watermark & Audio Fingerprint đang xử lý và đã hoàn tất.', 'Monitor active and completed Watermark & Audio Fingerprint jobs.')
          };
        } else if (lower.startsWith('/auth') || lower.startsWith('/login')) {
          blocks = ['auth'];
          title = t('Màn hình Đăng nhập De Studio', 'De Studio Sign-In Screen');
        } else if (lower.startsWith('/form')) {
          blocks = ['form'];
          title = t('Form Tạo Workspace SaaS', 'Create SaaS Workspace Form');
        } else if (lower.startsWith('/modal')) {
          blocks = ['section-header', 'modal'];
          title = 'Interactive Modal Pop-up Demo';
          composeOpts = {
            title: 'Modals Pop-up & Action Confirmation',
            subtitle: t('Bấm "Mở Modal Xác nhận" bên dưới để kiểm tra tương tác mở/đóng Pop-up.', 'Click "Open Confirmation Modal" below to test live open/close state.'),
            openModal: true
          };
        } else {
          const detected = detectAIComposerBlocks(lower);
          blocks = detected.length >= 2
            ? detected
            : (detected.length === 1 ? ['navbar', 'section-header', ...detected, 'pagination'] : ['navbar', 'section-header', 'stats', 'search-filters', 'table', 'pagination']);
          if (!blocks.includes('modal') && (blocks.includes('navbar') || blocks.includes('section-header'))) {
            blocks.push('modal');
          }
          title = t(`UI Ghép từ "${activePage.name}"`, `Composed UI from "${activePage.name}"`);
          composeOpts = {
            title: `${activePage.name} — Composed Module`,
            subtitle: translateTextValue(activePage.desc || '') || t('Giao diện ghép trực tiếp từ bộ thành phần chuẩn De Studio 1.0.', 'Composed directly from standardized De Studio 1.0 components.')
          };
        }

        composedLabels = blocks.map(b => labelMap[b] || b);
        thoughtSteps.push(t(`Ghép ${blocks.length} thành phần hệ thống: <code>${composedLabels.join(' + ')}</code>`, `Composed ${blocks.length} system blocks: <code>${composedLabels.join(' + ')}</code>`));
        thoughtSteps.push(t('Đóng gói sẵn sàng cho tab <b>AI UI Output</b> và bộ xuất <b>HTML Demo độc lập (.html)</b>', 'Packaged for <b>AI UI Output</b> and standalone <b>HTML Demo export (.html)</b>'));
        generatedHtml = buildComposedSaaSUI(blocks, composeOpts);
        summary = t(
          `Đã ghép xong <b>${escapeHTML(title)}</b> (${composedLabels.join(', ')}) và tự động hiển thị ở tab <b>AI UI Output</b>. Bạn có thể bấm <b>Copy Full HTML Demo (.html)</b> để lưu thành file mở chạy ngay!`,
          `Composed <b>${escapeHTML(title)}</b> (${composedLabels.join(', ')}) and rendered it live in <b>AI UI Output</b>. Click <b>Copy Full HTML Demo (.html)</b> to save and run standalone!`
        );
      }

      return { thoughtSteps, summary, generatedHtml, title, blocks: composedLabels };
    }

    function sendAIMessage() {
      const input = document.getElementById('aiInput');
      const text = input.value.trim();
      if (!text) return;

      input.value = '';
      input.style.height = '44px';

      // 1. User message bubble
      appendAIMessage('user', `<div class="msg-user">${escapeHTML(text)}</div>`);

      // 2. Offline AI processing
      const activePage = findPageById(activePageId);
      const res = generateOfflineUIResponse(text, activePage);
      lastGeneratedAIHtml = res.generatedHtml;
      lastGeneratedAITitle = res.title || 'De Studio AI UI';
      lastGeneratedAIPrompt = text;
      lastGeneratedAIBlocks = res.blocks || [];

      const msgId = 'ai-msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      aiOutputsRegistry[msgId] = {
        html: lastGeneratedAIHtml,
        title: lastGeneratedAITitle,
        prompt: text,
        blocks: lastGeneratedAIBlocks
      };
      const aiBubbleHTML = `
        <div class="msg-ai" id="${msgId}">
          <details class="ai-thought" open>
            <summary>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              Offline Composer (${res.thoughtSteps.length} ${t('bước', 'steps')})
            </summary>
            <div class="ai-thought-steps">
              ${res.thoughtSteps.map(s => `<div>• ${s}</div>`).join('')}
            </div>
          </details>
          <div style="color:var(--text-primary); line-height:1.5;">${res.summary}</div>
          <div class="ai-result-actions">
            <button class="mini-btn primary" onclick="copyStandaloneAIDemoHTML('${msgId}')">📋 Copy Full HTML (.html)</button>
            <button class="mini-btn" onclick="pushAIOutputToCanvas('${msgId}')">${t('Mở AI UI Output', 'Open AI UI Output')}</button>
          </div>
        </div>
      `;

      // Automatically switch to AI UI Output tab whenever AI executes and append message synchronously (no timing desync)
      switchViewMode('ai-canvas');
      appendAIMessage('ai', aiBubbleHTML);
    }

    function pushAIOutputToCanvas(msgId) {
      if (msgId && aiOutputsRegistry[msgId]) {
        const snap = aiOutputsRegistry[msgId];
        lastGeneratedAIHtml = snap.html;
        lastGeneratedAITitle = snap.title;
        lastGeneratedAIPrompt = snap.prompt;
        lastGeneratedAIBlocks = snap.blocks;
      }
      switchViewMode('ai-canvas');
    }

    // =========================================================================