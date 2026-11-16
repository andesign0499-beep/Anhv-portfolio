    // 2W. PAGE DEMO: DEMO HISTORY (DESKTOP / TABLET / MOBILE FROM TABLET)
    // =========================================================================
    const HISTORY_DEMO_PROCESSING = [
      { id: 'ID1357924680', title: 'Content title display here in 1 line', merchant: 'Northwind Media', status: 'Processing', start: '16-05-2025 07:35:00', end: '16-05-2025 07:55:00' },
      { id: 'ID1357924681', title: 'Content title display here in 1 line', merchant: 'Velo Streaming', status: 'Queuing...', start: '16-05-2025 07:35:00', end: '16-05-2025 07:55:00' }
    ];

    const HISTORY_DEMO_COMPLETED = [
      { id: 'ID1357924682', title: 'Content title display here in 1 line', merchant: 'Northwind Media', status: 'Succeeded', start: '16-05-2025 07:35:00', end: '16-05-2025 07:55:00' },
      { id: 'ID1357924683', title: 'Content title display here in 1 line', merchant: 'Velo Streaming', status: 'Denied', start: '16-05-2025 07:35:00', end: '16-05-2025 07:55:00' },
      { id: 'ID1357924684', title: 'Content title display here in 1 line', merchant: 'Atlas Broadcast', status: 'Failed', start: '16-05-2025 07:35:00', end: '16-05-2025 07:55:00' },
      { id: 'ID1357924685', title: 'Quarterfinal Live Broadcast — Feed 02', merchant: 'Northwind Media', status: 'Succeeded', start: '16-05-2025 06:15:00', end: '16-05-2025 06:42:18' },
      { id: 'ID1357924686', title: 'Syndicated Drama Episode 14 Master', merchant: 'Atlas Broadcast', status: 'Succeeded', start: '15-05-2025 22:10:05', end: '15-05-2025 22:34:50' },
      { id: 'ID1357924687', title: 'Regional Sports Highlight Clip #19', merchant: 'Velo Streaming', status: 'Denied', start: '15-05-2025 18:05:44', end: '15-05-2025 18:19:02' }
    ];

    let historyDemoState = {
      viewMode: 'matrix',     // 'matrix' | 'interactive'
      liveBp: 'desktop',      // 'desktop' | 'tablet' | 'mobile'
      filterTab: 'all',       // 'all' | 'processing' | 'completed'
      merchant: 'all',
      search: '',
      compactSearchOpen: false,
      mobileDrawerOpen: false,
      pageSize: 10,
      pageIndex: 1,
      processingExtraCount: 1,
      historyExtraCount: 129,
      customProcessing: [],
      selectedRowNote: ''
    };

    window.setHistoryDemoProp = function(key, val) {
      historyDemoState[key] = val;
      if (key === 'filterTab' || key === 'merchant' || key === 'search' || key === 'pageSize') {
        historyDemoState.pageIndex = 1;
      }
      renderCanvas();
    };

    window.toggleHistoryDemoBool = function(key) {
      historyDemoState[key] = !historyDemoState[key];
      renderCanvas();
    };

    window.addDemoHistoryDetection = function() {
      const nextNum = 1357924700 + historyDemoState.customProcessing.length;
      const merch = historyDemoState.merchant !== 'all' ? historyDemoState.merchant : 'Northwind Media';
      historyDemoState.customProcessing.unshift({
        id: `ID${nextNum}`,
        title: `New Media Detection Job #${historyDemoState.customProcessing.length + 1}`,
        merchant: merch,
        status: 'Processing',
        start: '16-05-2025 08:02:10',
        end: '16-05-2025 08:22:00'
      });
      historyDemoState.selectedRowNote = `Đã tạo job mới ID${nextNum} (${merch}) trong hàng đợi Processing.`;
      renderCanvas();
      showToast(`+ Đã thêm job Detection mới: ID${nextNum}`);
    };

    window.resetHistoryDemo = function() {
      historyDemoState = {
        viewMode: 'matrix',
        liveBp: 'desktop',
        filterTab: 'all',
        merchant: 'all',
        search: '',
        compactSearchOpen: false,
        mobileDrawerOpen: false,
        pageSize: 10,
        pageIndex: 1,
        processingExtraCount: 1,
        historyExtraCount: 129,
        customProcessing: [],
        selectedRowNote: ''
      };
      renderCanvas();
      showToast('Đã khôi phục Demo History về trạng thái mặc định');
    };

    function dhSvg(name) {
      const map = {
        dashboard: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>',
        reports: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="13" y2="17"/></svg>',
        detection: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></svg>',
        history: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>',
        docs: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/></svg>',
        help: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        drm: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2"/></svg>',
        wave: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12h2l2-5 3 10 3-8 2 6 2-3h4"/></svg>',
        lock: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
        search: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        sliders: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>',
        menu: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        gear: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.86 1 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
        extBox: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
        chevR: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
        chevD: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
        chevL: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>',
        plus: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
      };
      return map[name] || '';
    }

    function dhStatusPillHtml(status) {
      const clsMap = {
        'Processing': 'dh-st-processing',
        'Queuing...': 'dh-st-queuing',
        'Succeeded': 'dh-st-succeeded',
        'Denied': 'dh-st-denied',
        'Failed': 'dh-st-failed'
      };
      return `<span class="dh-status-pill ${clsMap[status] || 'dh-st-queuing'}">${status}</span>`;
    }

    function renderHistoryExpandedSidebar(horizLogo, showClose, activeId = 'history') {
      const isDash = activeId === 'dashboard';
      const isHist = activeId === 'history';
      const closeHandler = typeof toggleDashboardDemoBool === 'function' && typeof activePageId !== 'undefined' && activePageId === 'demo-dashboard'
        ? "toggleDashboardDemoBool('mobileDrawerOpen')"
        : "toggleHistoryDemoBool('mobileDrawerOpen')";
      return `
        <div>
          <div class="dh-brand-wrap" style="flex-direction:row;align-items:center;justify-content:space-between;">
            <div>
              ${renderLogoMarkup(horizLogo, 'height:19px;width:auto;display:block;')}
              <div class="dh-brand-sub" style="margin-top:4px;">${t("dash.media_suite")}</div>
            </div>
            ${showClose ? `<button type="button" class="dh-icon-sq" style="width:28px;height:28px;" onclick="${closeHandler}">×</button>` : ''}
          </div>
          <div class="dh-nav-list">
            <button type="button" class="dh-nav-item ${isDash ? 'is-active' : 'is-muted'}" onclick="typeof selectPage==='function'?selectPage('demo-dashboard'):showToast('Dashboard • Media Analytics')"><span class="dh-nav-item-l">${dhSvg('dashboard')}<span>Dashboard</span></span></button>
            <button type="button" class="dh-nav-item is-muted" onclick="typeof selectPage==='function'?selectPage('demo-reports'):showToast('Reports • Usage Summary')"><span class="dh-nav-item-l">${dhSvg('reports')}<span>Reports</span></span></button>
            <button type="button" class="dh-nav-item" onclick="typeof selectPage==='function'?selectPage('demo-detection'):showToast('Detection Workspace')"><span class="dh-nav-item-l">${dhSvg('detection')}<span>Detection</span></span></button>
            <button type="button" class="dh-nav-item ${isHist ? 'is-active' : ''}" onclick="typeof selectPage==='function'?selectPage('demo-history'):showToast('History')"><span class="dh-nav-item-l">${dhSvg('history')}<span>History</span></span></button>
            <button type="button" class="dh-nav-item" onclick="window.open('DeSaaS.html#docs','_blank')"><span class="dh-nav-item-l">${dhSvg('docs')}<span>Documentations</span></span>${dhSvg('chevD')}</button>
            <button type="button" class="dh-nav-item" onclick="window.open('DeSaaS.html#support','_blank')"><span class="dh-nav-item-l">${dhSvg('help')}<span>Help &amp; Support</span></span>${dhSvg('chevR')}</button>
          </div>

          <div class="dh-suite-label">Media Suite</div>
          <div class="dh-nav-list">
            <button type="button" class="dh-nav-item" onclick="window.open('DeSaaS.html#mediasas','_blank')"><span class="dh-nav-item-l">${dhSvg('drm')}<span>Media SaS</span></span></button>
            <button type="button" class="dh-nav-item" onclick="window.open('DeSaaS.html#contentid','_blank')"><span class="dh-nav-item-l">${dhSvg('wave')}<span>Content ID</span></span></button>
            <button type="button" class="dh-nav-item" onclick="window.open('DeSaaS.html#licenseguard','_blank')"><span class="dh-nav-item-l">${dhSvg('lock')}<span>License Guard</span></span></button>
          </div>
        </div>

        <div class="dh-user-card">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="dh-avatar">AM</span>
            <div style="min-width:0;">
              <div style="font-size:12px;font-weight:600;color:#101828;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Alex Morgan</div>
              <div style="font-size:10.5px;color:#667085;">Admin</div>
            </div>
          </div>
          <div style="display:inline-flex;align-items:center;gap:4px;color:#667085;">
            <span class="dh-count-badge">3</span>
            ${dhSvg('chevR')}
          </div>
        </div>
      `;
    }

    function renderHistoryRailSidebar(markLogo, activeId = 'history') {
      const isDash = activeId === 'dashboard';
      const isHist = activeId === 'history';
      return `
        <aside class="dh-rail" aria-label="Tablet Collapsed Navigation">
          <div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;">
            <div style="padding:2px 0 10px;" title="De Studio">${renderLogoMarkup(markLogo, 'width:26px;height:26px;display:block;')}</div>
            <button type="button" class="dh-rail-btn ${isDash ? 'is-active' : 'is-muted'}" title="Dashboard" onclick="typeof selectPage==='function'?selectPage('demo-dashboard'):showToast('Dashboard')">${dhSvg('dashboard')}</button>
            <button type="button" class="dh-rail-btn is-muted" title="Reports" onclick="typeof selectPage==='function'?selectPage('demo-reports'):showToast('Reports')">${dhSvg('reports')}</button>
            <button type="button" class="dh-rail-btn" title="Detection" onclick="typeof selectPage==='function'?selectPage('demo-detection'):showToast('Detection')">${dhSvg('detection')}</button>
            <button type="button" class="dh-rail-btn ${isHist ? 'is-active' : ''}" title="History" onclick="typeof selectPage==='function'?selectPage('demo-history'):showToast('History')">${dhSvg('history')}</button>
            <button type="button" class="dh-rail-btn" title="Documentations (Open in DeSaaS)" onclick="window.open('DeSaaS.html#docs','_blank')">${dhSvg('docs')}</button>
            <button type="button" class="dh-rail-btn" title="Help & Support (Open in DeSaaS)" onclick="window.open('DeSaaS.html#support','_blank')">${dhSvg('help')}</button>
            <div class="dh-rail-suite-lbl">Suite</div>
            <button type="button" class="dh-rail-btn" title="Media SaS (Open in DeSaaS)" onclick="window.open('DeSaaS.html#mediasas','_blank')">${dhSvg('drm')}</button>
            <button type="button" class="dh-rail-btn" title="Content ID (Open in DeSaaS)" onclick="window.open('DeSaaS.html#contentid','_blank')">${dhSvg('wave')}</button>
            <button type="button" class="dh-rail-btn" title="License Guard (Open in DeSaaS)" onclick="window.open('DeSaaS.html#licenseguard','_blank')">${dhSvg('lock')}</button>
          </div>
          <span class="dh-avatar" title="Alex Morgan • Admin">AM</span>
        </aside>
      `;
    }

    function renderHistoryRowsHtml(items, mode) {
      if (!items.length) {
        return `<div style="padding:20px 12px;text-align:center;font-size:12px;color:#667085;">Không có bản ghi phù hợp bộ lọc hiện tại.</div>`;
      }
      return items.map(row => {
        const noteCmd = `setHistoryDemoProp('selectedRowNote', '${escapeHTML(row.title)} (${row.id}) • ${row.merchant} • ${row.status}')`;
        if (mode === 'mobile') {
          return `
            <div class="dh-row" onclick="${noteCmd}">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
                <div class="dh-row-main">
                  <span class="dh-row-thumb">${dhSvg('extBox')}</span>
                  <div style="min-width:0;">
                    <div class="dh-row-title">${escapeHTML(row.title)}</div>
                    <div class="dh-row-id">${row.id}</div>
                  </div>
                </div>
                <span class="dh-row-chev">${dhSvg('chevR')}</span>
              </div>
              <div class="dh-mobile-meta-row">
                ${dhStatusPillHtml(row.status)}
                <div class="dh-date-col">
                  <div>${row.start}</div>
                  <div style="color:#667085;">${row.end}</div>
                </div>
              </div>
            </div>
          `;
        }
        return `
          <div class="dh-row" onclick="${noteCmd}">
            <div class="dh-row-main">
              <span class="dh-row-thumb">${dhSvg('extBox')}</span>
              <div style="min-width:0;">
                <div class="dh-row-title">${escapeHTML(row.title)}</div>
                <div class="dh-row-id">${row.id}</div>
              </div>
            </div>
            <div class="dh-status-cell">${dhStatusPillHtml(row.status)}</div>
            <div class="dh-date-col">
              <div>${row.start}</div>
              <div>${row.end}</div>
            </div>
            <span class="dh-row-chev">${dhSvg('chevR')}</span>
          </div>
        `;
      }).join('');
    }

    function renderHistoryViewportFrame(mode) {
      const horizLogo = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
      const markLogo = logosState.items.find(i => i.id === 'logo-mark-brand') || logosState.items[2] || logosState.items[0];
      const isDesktop = mode === 'desktop';
      const isTablet = mode === 'tablet';
      const isMobile = mode === 'mobile';

      const q = (historyDemoState.search || '').trim().toLowerCase();
      const filterMatch = row => {
        const mOk = historyDemoState.merchant === 'all' || row.merchant === historyDemoState.merchant;
        const qOk = !q || row.title.toLowerCase().includes(q) || row.id.toLowerCase().includes(q) || row.status.toLowerCase().includes(q);
        return mOk && qOk;
      };

      const allProcessing = [...historyDemoState.customProcessing, ...HISTORY_DEMO_PROCESSING].filter(filterMatch);
      const allCompleted = HISTORY_DEMO_COMPLETED.filter(filterMatch);
      const showProcessingSec = historyDemoState.filterTab === 'all' || historyDemoState.filterTab === 'processing';
      const showCompletedSec = historyDemoState.filterTab === 'all' || historyDemoState.filterTab === 'completed';

      const procDisplayCount = allProcessing.length + (q || historyDemoState.merchant !== 'all' ? 0 : historyDemoState.processingExtraCount);
      const histDisplayCount = allCompleted.length + (q || historyDemoState.merchant !== 'all' ? 0 : historyDemoState.historyExtraCount - 3);

      const pageItems = allCompleted.slice(0, isMobile ? 3 : 3);
      const shellCls = isDesktop ? 'dh-shell' : (isTablet ? 'dh-shell is-tablet' : 'dh-shell is-mobile');

      const leftNavHtml = isDesktop ? `
        <aside class="dh-sidebar">
          ${renderHistoryExpandedSidebar(horizLogo, false, 'history')}
        </aside>
      ` : (isTablet ? renderHistoryRailSidebar(markLogo, 'history') : '');

      const mobileBarHtml = isMobile ? `
        <div class="dh-mobile-header">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="toggleHistoryDemoBool('mobileDrawerOpen')" title="Mở Menu">${dhSvg('menu')}</button>
            ${renderLogoMarkup(markLogo, 'width:22px;height:22px;display:block;flex-shrink:0;')}
            <span class="dh-page-title">History</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;">
            <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="toggleHistoryDemoBool('compactSearchOpen')" title="Search">${dhSvg('search')}</button>
            <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="showToast('Filter Drawer')" title="Filter">${dhSvg('sliders')}</button>
            <button type="button" class="dh-cta-primary" style="height:32px;padding:0 10px;" onclick="addDemoHistoryDetection()">${dhSvg('plus')}<span>New</span></button>
          </div>
        </div>
      ` : '';

      const topbarHtml = isMobile ? `
        ${historyDemoState.compactSearchOpen ? `
          <div class="dh-search-box" style="max-width:none;width:100%;">
            ${dhSvg('search')}
            <input type="text" value="${escapeHTML(historyDemoState.search)}" placeholder="Search title or ID..." oninput="setHistoryDemoProp('search', this.value)" />
          </div>
        ` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
          <div class="dh-tabs-row">
            ${['all', 'processing', 'completed'].map(tab => {
              const lbl = tab === 'all' ? 'All' : (tab === 'processing' ? 'Processing' : 'Completed');
              return `<button type="button" class="dh-filter-pill ${historyDemoState.filterTab === tab ? 'is-active' : ''}" onclick="setHistoryDemoProp('filterTab','${tab}')">${lbl}</button>`;
            }).join('')}
          </div>
          <select class="dh-select-merchant" style="height:30px;font-size:11.5px;flex:1;min-width:130px;" onchange="setHistoryDemoProp('merchant', this.value)">
            <option value="all" ${historyDemoState.merchant === 'all' ? 'selected' : ''}>Select merchant -</option>
            <option value="Northwind Media" ${historyDemoState.merchant === 'Northwind Media' ? 'selected' : ''}>Northwind Media</option>
            <option value="Velo Streaming" ${historyDemoState.merchant === 'Velo Streaming' ? 'selected' : ''}>Velo Streaming</option>
            <option value="Atlas Broadcast" ${historyDemoState.merchant === 'Atlas Broadcast' ? 'selected' : ''}>Atlas Broadcast</option>
          </select>
        </div>
      ` : `
        <div class="dh-topbar">
          <div class="dh-topbar-left">
            <h2 class="dh-page-title">History</h2>
            ${isDesktop ? `
              <div class="dh-search-box">
                ${dhSvg('search')}
                <input type="text" value="${escapeHTML(historyDemoState.search)}" placeholder="${t('hist.search')}" oninput="setHistoryDemoProp('search', this.value)" />
              </div>
            ` : `
              <button type="button" class="dh-icon-sq" onclick="toggleHistoryDemoBool('compactSearchOpen')" title="Mở tìm kiếm">${dhSvg('search')}</button>
            `}
          </div>
          <div class="dh-topbar-right">
            <select class="dh-select-merchant" onchange="setHistoryDemoProp('merchant', this.value)">
              <option value="all" ${historyDemoState.merchant === 'all' ? 'selected' : ''}>Select merchant -</option>
              <option value="Northwind Media" ${historyDemoState.merchant === 'Northwind Media' ? 'selected' : ''}>Northwind Media</option>
              <option value="Velo Streaming" ${historyDemoState.merchant === 'Velo Streaming' ? 'selected' : ''}>Velo Streaming</option>
              <option value="Atlas Broadcast" ${historyDemoState.merchant === 'Atlas Broadcast' ? 'selected' : ''}>Atlas Broadcast</option>
            </select>
            <button type="button" class="dh-icon-sq" onclick="showToast('Đã mở bộ lọc nâng cao (Date / Status / Merchant)')" title="Advanced Filters">${dhSvg('sliders')}</button>
            <button type="button" class="dh-cta-primary" onclick="addDemoHistoryDetection()">${t("hist.new_detection")}</button>
          </div>
        </div>
        ${isTablet && historyDemoState.compactSearchOpen ? `
          <div class="dh-search-box" style="max-width:340px;">
            ${dhSvg('search')}
            <input type="text" value="${escapeHTML(historyDemoState.search)}" placeholder="Search title or ID..." oninput="setHistoryDemoProp('search', this.value)" />
          </div>
        ` : ''}
        <div class="dh-tabs-row">
          ${['all', 'processing', 'completed'].map(tab => {
            const lbl = tab === 'all' ? 'All' : (tab === 'processing' ? 'Processing' : 'Completed');
            return `<button type="button" class="dh-filter-pill ${historyDemoState.filterTab === tab ? 'is-active' : ''}" onclick="setHistoryDemoProp('filterTab','${tab}')">${lbl}</button>`;
          }).join('')}
        </div>
      `;

      const desktopColHeader = isDesktop ? `
        <div class="dh-col-head">
          <span>DATE</span>
          <span>Succeeded</span>
          <span>Denied</span>
          <span>Failed</span>
          <span>Total</span>
          <span></span>
        </div>
      ` : '';

      const totalPagesCount = 6;
      const startNum = (historyDemoState.pageIndex - 1) * historyDemoState.pageSize + 1;
      const endNum = Math.min(60, historyDemoState.pageIndex * historyDemoState.pageSize);

      return `
        <div class="${shellCls}">
          ${leftNavHtml}
          ${isMobile && historyDemoState.mobileDrawerOpen ? `
            <div class="dh-mobile-drawer-overlay" onclick="if(event.target===this) toggleHistoryDemoBool('mobileDrawerOpen')">
              <aside class="dh-mobile-drawer">
                ${renderHistoryExpandedSidebar(horizLogo, true)}
              </aside>
            </div>
          ` : ''}
          ${mobileBarHtml}
          <main class="dh-main">
            ${topbarHtml}

            ${showProcessingSec ? `
              <section>
                <div class="dh-section-head">
                  <div class="dh-section-title">${dhSvg('gear')}<span>${t("hist.processing_queue")}</span></div>
                  <span class="dh-section-count">${procDisplayCount} items</span>
                </div>
                <div class="dh-group-card">
                  ${desktopColHeader}
                  ${renderHistoryRowsHtml(allProcessing, mode)}
                </div>
              </section>
            ` : ''}

            ${showCompletedSec ? `
              <section>
                <div class="dh-section-head">
                  <div class="dh-section-title">${dhSvg('history')}<span>History</span></div>
                  <span class="dh-section-count">${histDisplayCount} items</span>
                </div>
                <div class="dh-group-card">
                  ${desktopColHeader}
                  ${renderHistoryRowsHtml(pageItems, mode)}
                </div>
              </section>
            ` : ''}

            <footer class="dh-footer">
              <div class="dh-footer-left">
                <span>Display</span>
                <select class="dh-select-merchant" style="height:28px;font-size:11.5px;padding:0 8px;" onchange="setHistoryDemoProp('pageSize', parseInt(this.value,10))">
                  <option value="5" ${historyDemoState.pageSize === 5 ? 'selected' : ''}>5 items</option>
                  <option value="10" ${historyDemoState.pageSize === 10 ? 'selected' : ''}>10 items</option>
                  <option value="20" ${historyDemoState.pageSize === 20 ? 'selected' : ''}>20 items</option>
                </select>
              </div>
              <div class="dh-footer-right">
                <span>${startNum} - ${endNum} / 60</span>
                <div style="display:inline-flex;gap:4px;">
                  <button type="button" class="dh-page-btn" ${historyDemoState.pageIndex <= 1 ? 'disabled' : ''} onclick="setHistoryDemoProp('pageIndex', Math.max(1, historyDemoState.pageIndex - 1))" title="Previous">${dhSvg('chevL')}</button>
                  <button type="button" class="dh-page-btn" ${historyDemoState.pageIndex >= totalPagesCount ? 'disabled' : ''} onclick="setHistoryDemoProp('pageIndex', Math.min(${totalPagesCount}, historyDemoState.pageIndex + 1))" title="Next">${dhSvg('chevR')}</button>
                </div>
              </div>
            </footer>
          </main>
        </div>
      `;
    }

    function buildHistoryDemoHTMLSnippet() {
      return `<!-- De Studio 1.0 • Demo History (Desktop >=1024 | Tablet 601-1023 | Mobile <=600) -->
<section class="dh-shell">
  <aside class="dh-sidebar">
    <!-- Expanded on Desktop (>=1024px), 64px Icon Rail on Tablet (601-1023px), Slide Drawer on Mobile (<=600px) -->
    <div class="dh-brand-wrap">
      <img src="./Logo/Logo_destudio_ngang.svg" alt="De Studio" style="height:20px;width:auto;" />
      <span class="dh-brand-sub">Media Protection Suite</span>
    </div>
    <nav class="dh-nav-list">
      <button class="dh-nav-item is-active">History</button>
    </nav>
  </aside>
  <main class="dh-main">
    <header class="dh-topbar">
      <h2 class="dh-page-title">History</h2>
      <div class="dh-search-box"><input type="text" placeholder="${t('hist.search')}" /></div>
      <select class="dh-select-merchant"><option>Select merchant -</option></select>
      <button class="dh-cta-primary">${t("hist.new_detection")}</button>
    </header>
    <div class="dh-tabs-row">
      <button class="dh-filter-pill is-active">All</button>
      <button class="dh-filter-pill">Processing</button>
      <button class="dh-filter-pill">Completed</button>
    </div>
    <div class="dh-group-card">
      <!-- Processing & History Rows using --ds-brand-*, --ds-green-*, --ds-amber-*, --ds-red-* -->
    </div>
  </main>
</section>`;
    }

    function renderHistoryDemoPage() {
      return `
        <div class="dh-sheet">
          <div class="colors-topbar">
            <span class="effects-count-pill">3 Breakpoints chuẩn: Desktop (≥1024px) • Tablet Icon Rail (601–1023px) • Mobile Drawer (≤600px)</span>
            <div class="colors-actions">
              <a href="DeSaaS.html" target="_blank" class="btn-ds primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;font-weight:600;">🚀 Mở DeSaaS App</a>
              <button type="button" class="btn-ds" onclick="resetHistoryDemo()">↺ Khôi phục mặc định</button>
              <button type="button" class="btn-ds ai" onclick="copyText(buildHistoryDemoHTMLSnippet(), 'Đã copy HTML trang History')">Copy HTML Code</button>
              <button type="button" class="btn-ds" onclick="downloadCurrentPageHTML('demo-history')">↓ ${t('Tải HTML Responsive', 'Download HTML')}</button>
            </div>
          </div>

          <div class="dh-toolbar-card">
            <div>
              <div class="page-category-tag" style="margin-bottom:4px;">DEMO • HISTORY</div>
              <h1 style="font-size:24px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;">${t('History — Quản lý Phát hiện &amp; Xử lý Media', 'History — Media Detection &amp; Processing Queue')}</h1>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:4px;max-width:860px;line-height:1.55;">
                Dựng theo giao diện mẫu Desktop &amp; Tablet, tự động tính toán bản <strong>Mobile (≤600px)</strong> từ bố cục Tablet (Header + Hamburger Drawer + Card 2 tầng). Đồng bộ toàn bộ <strong>Logo De Studio</strong>, <strong>Navigation Rail</strong>, <strong>Buttons CTA</strong>, <strong>Status Badges</strong> và <strong>Pagination</strong> theo bộ màu ở trang <em>Colors</em>.
              </p>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid #f1f5f9;">
              <div class="btn-ds-seg">
                <button type="button" class="${historyDemoState.viewMode === 'matrix' ? 'active' : ''}" onclick="setHistoryDemoProp('viewMode','matrix')">Xem đầy đủ 3 màn hình (Desktop + Tablet + Mobile)</button>
                <button type="button" class="${historyDemoState.viewMode === 'interactive' ? 'active' : ''}" onclick="setHistoryDemoProp('viewMode','interactive')">Thử nghiệm 1 màn hình</button>
              </div>
              ${historyDemoState.viewMode === 'interactive' ? `
                <div class="btn-ds-seg">
                  <button type="button" class="${historyDemoState.liveBp === 'desktop' ? 'active' : ''}" onclick="setHistoryDemoProp('liveBp','desktop')">Desktop (≥1024px)</button>
                  <button type="button" class="${historyDemoState.liveBp === 'tablet' ? 'active' : ''}" onclick="setHistoryDemoProp('liveBp','tablet')">Tablet (601–1023px)</button>
                  <button type="button" class="${historyDemoState.liveBp === 'mobile' ? 'active' : ''}" onclick="setHistoryDemoProp('liveBp','mobile')">Mobile (≤600px)</button>
                </div>
              ` : ''}
            </div>

            ${historyDemoState.selectedRowNote ? `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-radius:8px;background:var(--ds-brand-50, #eff6ff);border:1px solid var(--ds-brand-200, #bfdbfe);color:var(--ds-brand-1000, #1d4ed8);font-size:12px;font-weight:600;">
                <span>✓ ${escapeHTML(historyDemoState.selectedRowNote)}</span>
                <button type="button" style="border:0;background:transparent;color:var(--ds-brand-1000, #1d4ed8);font-weight:700;cursor:pointer;" onclick="setHistoryDemoProp('selectedRowNote','')">Đóng</button>
              </div>
            ` : ''}
          </div>

          ${historyDemoState.viewMode === 'matrix' ? `
            <div class="dh-device-card">
              <div class="dh-device-head">
                <div>
                  <span class="ds-badge ds-badge-blue">1. Desktop Layout</span>
                  <h3 style="font-size:15px;font-weight:700;color:#101828;margin-top:5px;">Desktop — Expanded Sidebar + Search Input + Header Cột</h3>
                </div>
                <span class="dh-vp-chip">≥ 1024px (Full Rail 214px)</span>
              </div>
              ${renderHistoryViewportFrame('desktop')}
            </div>

            <div class="dh-device-card">
              <div class="dh-device-head">
                <div>
                  <span class="ds-badge ds-badge-green">2. Tablet Layout</span>
                  <h3 style="font-size:15px;font-weight:700;color:#101828;margin-top:5px;">Tablet — Icon Rail 64px + Search Icon Compact</h3>
                </div>
                <span class="dh-vp-chip">601px – 1023px (Collapsed Rail 64px)</span>
              </div>
              ${renderHistoryViewportFrame('tablet')}
            </div>

            <div class="dh-device-card">
              <div class="dh-device-head">
                <div>
                  <span class="ds-badge ds-badge-amber">3. Mobile Layout (Derived from Tablet)</span>
                  <h3 style="font-size:15px;font-weight:700;color:#101828;margin-top:5px;">Mobile — Hamburger Slide Drawer + Compact Header + 2-Row Cards</h3>
                </div>
                <span class="dh-vp-chip">≤ 600px (390px Frame)</span>
              </div>
              ${renderHistoryViewportFrame('mobile')}
            </div>
          ` : `
            <div class="dh-device-card">
              <div class="dh-device-head">
                <div>
                  <span class="ds-badge ds-badge-blue">Interactive Mode</span>
                  <h3 style="font-size:15px;font-weight:700;color:#101828;margin-top:5px;">Đang xem trực tiếp: ${historyDemoState.liveBp.toUpperCase()}</h3>
                </div>
                <span class="dh-vp-chip">${historyDemoState.liveBp === 'desktop' ? '≥ 1024px' : (historyDemoState.liveBp === 'tablet' ? '601–1023px' : '≤ 600px')}</span>
              </div>
              ${renderHistoryViewportFrame(historyDemoState.liveBp)}
            </div>
          `}
        </div>
      `;
    }

    // =========================================================================