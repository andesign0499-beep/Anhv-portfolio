    // 2X. DASHBOARD ANALYTICS & TELEMETRY ENGINE (D1–D10 INTERACTIVE SUITE)
    // =========================================================================
    const DB_STORAGE_KEY = 'de_studio_dashboard_state_v1';
    let dbState = {
      category: 'all',
      d1ActiveIdx: 3, // Bar 4 (368)
      d2Mode: 'revenue', // 'revenue' | 'usage'
      d2ActiveIdx: 8, // Sep ($20 / $10)
      d3ActiveDrm: 'android',
      d4SampleCreated: false,
      d5Series: { total: true, authen: true, response: true },
      d6Series: { succeeded: true, denied: false, failed: false },
      d6CursorIdx: 15,
      d7ActiveCountry: 'India',
      d7Zoom: 1,
      d9Selected: 'denied', // 'succeeded' | 'denied' | 'failed'
      d10Series: { succeeded: true, denied: false, failed: false }
    };
    try {
      const savedDb = localStorage.getItem(DB_STORAGE_KEY);
      if (savedDb) {
        const p = JSON.parse(savedDb);
        if (p && typeof p === 'object') dbState = Object.assign({}, dbState, p);
      }
    } catch (_) {}

    function saveDbState() {
      try { localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(dbState)); } catch (_) {}
    }

    window.setDbFilter = function(cat) { dbState.category = cat; saveDbState(); renderCanvas(); };
    window.setDb1Bar = function(idx) { dbState.d1ActiveIdx = idx; saveDbState(); renderCanvas(); };
    window.setDb2Mode = function(mode) { dbState.d2Mode = mode; saveDbState(); renderCanvas(); };
    window.setDb2Month = function(idx) { dbState.d2ActiveIdx = idx; saveDbState(); renderCanvas(); };
    window.setDb3Drm = function(id) { dbState.d3ActiveDrm = id; saveDbState(); renderCanvas(); };
    window.toggleDb4Sample = function() { dbState.d4SampleCreated = !dbState.d4SampleCreated; saveDbState(); renderCanvas(); };
    window.toggleDb5Series = function(k) { dbState.d5Series[k] = !dbState.d5Series[k]; saveDbState(); renderCanvas(); };
    window.toggleDb6Series = function(k) { dbState.d6Series[k] = !dbState.d6Series[k]; saveDbState(); renderCanvas(); };
    window.setDb6Cursor = function(idx) { dbState.d6CursorIdx = idx; saveDbState(); renderCanvas(); };
    window.setDb7Country = function(name) { dbState.d7ActiveCountry = name; saveDbState(); renderCanvas(); };
    window.zoomDb7Map = function(delta) {
      dbState.d7Zoom = Math.max(0.85, Math.min(1.45, +(dbState.d7Zoom + delta).toFixed(2)));
      saveDbState();
      renderCanvas();
    };
    window.setDb9Metric = function(k) { dbState.d9Selected = k; saveDbState(); renderCanvas(); };
    window.toggleDb10Series = function(k) { dbState.d10Series[k] = !dbState.d10Series[k]; saveDbState(); renderCanvas(); };

    function dbHeadControls(withDiamond) {
      const calSvg = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
      const chevDown = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
      const dmIcon = withDiamond ? '<span style="color:#667085;display:inline-flex;">' + SVG_DIAMOND + '</span>' : '';
      return `
        <div class="db-head-controls">
          <button type="button" class="db-icon-btn" title="Date range">${calSvg}</button>
          <button type="button" class="db-filter-select">${dmIcon}<span>Filter type</span>${chevDown}</button>
        </div>
      `;
    }

    // Smooth Catmull-Rom Bezier path from [[x,y], ...]
    function dbSplinePath(pts) {
      if (!pts || pts.length < 2) return '';
      let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[Math.min(pts.length - 1, i + 2)];
        const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
        const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
        const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
        const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
      }
      return d;
    }

    function buildDashboardHTMLSnippet() {
      return `<!-- Design System Dashboard Telemetry Module (D1–D10) -->
<div class="db-widget-card">
  <div class="db-widget-head">
    <div class="db-title-left">
      <span class="db-widget-title">USAGE BY PLATFORM</span>
      <span class="db-help-dot" title="Active usage breakdown">?</span>
    </div>
    <div class="db-head-controls">
      <button class="db-filter-select">Filter type</button>
    </div>
  </div>
  <div class="db-kpi-strip">
    <div class="db-kpi-box"><div class="db-kpi-lbl">Users</div><div class="db-kpi-val">120</div></div>
    <div class="db-kpi-box"><div class="db-kpi-lbl">Devices</div><div class="db-kpi-val">360</div></div>
    <div class="db-kpi-box"><div class="db-kpi-lbl">IP Address</div><div class="db-kpi-val">22</div></div>
  </div>
</div>`;
    }

    function renderDashboardPage() {
      const cat = dbState.category || 'all';
      const showBars = cat === 'all' || cat === 'bars';
      const showLines = cat === 'all' || cat === 'lines';
      const showMaps = cat === 'all' || cat === 'maps';

      // --- D1 Data (12 Bars) ---
      const d1Data = [
        { pct: 18, label: '', tip: '180' },
        { pct: 34, label: '', tip: '640' },
        { pct: 52, label: '', tip: '1,040' },
        { pct: 34, label: '', tip: '368' },
        { pct: 36, label: '2K', tip: '2,040' },
        { pct: 22, label: '2K', tip: '2,010' },
        { pct: 24, label: '2K', tip: '2,015' },
        { pct: 22, label: '2K', tip: '2,005' },
        { pct: 22, label: '2K', tip: '2,000' },
        { pct: 32, label: '2K', tip: '2,080' },
        { pct: 22, label: '2K', tip: '2,020' },
        { pct: 22, label: '2K', tip: '2,012' }
      ];

      // --- D2 Data (Jan–Dec Stacked Revenue vs Usage) ---
      const d2Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const d2Revenue = [
        [120, 300], [130, 320], [159, 389], [168, 420], [178, 430], [89, 189],
        [380, 389], [18, 390], [10, 20], [150, 320], [120, 300], [168, 420]
      ];
      const d2Usage = [
        [210, 260], [230, 280], [260, 340], [290, 370], [310, 410], [180, 240],
        [340, 390], [220, 350], [140, 190], [270, 330], [240, 300], [320, 410]
      ];
      const d2Vals = dbState.d2Mode === 'usage' ? d2Usage : d2Revenue;

      // --- D3 Data (Usage by Platform) ---
      const d3Rows = [
        { id: 'webapp', name: 'Web App', total: '3,000', g: 2826, a: 108, r: 66, tip: '66' },
        { id: 'ios', name: 'Mobile iOS', total: '3,000', g: 2826, a: 112, r: 62, tip: '62' },
        { id: 'android', name: 'Android SDK', total: '3,000', g: 1450, a: 1450, r: 68, tip: '68' },
        { id: 'desktop', name: 'Desktop API', total: '3,000', g: 1000, a: 1000, r: 1000, tip: '1,000' }
      ];

      // --- D5 Spline Data (Latency ms) ---
      const d5Labels = ['4:02', '01:00\n01-02-26', '02:00\n01-02-26', '03:00\n01-02-26', '04:00\n01-02-26', '05:00\n01-02-26'];
      const d5TotalY = [32, 138, 28, 92, 185, 58];
      const d5AuthenY = [24, 62, 22, 46, 82, 34];
      const d5RespY = [54, 30, 56, 60, 42, 66];
      const toD5Pts = (arr) => arr.map((v, idx) => [48 + idx * 124, 152 - ((v - 20) / 200) * 124]);
      const d5TotalPts = toD5Pts(d5TotalY);
      const d5AuthenPts = toD5Pts(d5AuthenY);
      const d5RespPts = toD5Pts(d5RespY);

      // --- D6 Data (24h Traffic 0..23) ---
      const d6Vals = [10, 65, 220, 480, 650, 620, 410, 140, 22, 18, 85, 195, 275, 315, 340, 368, 590, 860, 965, 920, 740, 420, 195, 145];
      const d6DeniedVals = [120, 110, 85, 35, 18, 25, 45, 70, 95, 115, 125, 135, 165, 175, 180, 155, 105, 65, 55, 70, 95, 130, 155, 165];
      const d6FailedVals = [15, 45, 115, 165, 178, 155, 105, 55, 35, 28, 42, 65, 75, 85, 90, 125, 210, 255, 260, 240, 195, 130, 65, 38];
      const toD6Pts = (arr) => arr.map((v, idx) => [42 + idx * 27.5, 156 - (v / 1000) * 130]);
      const d6Pts = toD6Pts(d6Vals);
      const d6DeniedPts = toD6Pts(d6DeniedVals);
      const d6FailedPts = toD6Pts(d6FailedVals);
      const curIdx6 = Math.max(0, Math.min(23, dbState.d6CursorIdx));
      const curPt6 = d6Pts[curIdx6];

      // --- D7 Data (Location Ranking) ---
      const d7Countries = [
        { rank: 1, name: 'India', val: '1,462,806', region: 'in' },
        { rank: 2, name: 'United States', val: '1,148,834', region: 'us' },
        { rank: 3, name: 'Brazil', val: '623,412', region: 'br' },
        { rank: 4, name: 'Indonesia', val: '619,230', region: 'sea' },
        { rank: 5, name: 'South Korea', val: '446,534', region: 'ea' },
        { rank: 6, name: 'Russia', val: '230,282', region: 'ru' },
        { rank: 7, name: 'Pakistan', val: '196,081', region: 'in' },
        { rank: 8, name: 'Turkey', val: '184,259', region: 'eu' },
        { rank: 9, name: 'Vietnam', val: '173,247', region: 'sea' },
        { rank: 10, name: 'Philippines', val: '170,086', region: 'sea' }
      ];
      const activeC = d7Countries.find(c => c.name === dbState.d7ActiveCountry) || d7Countries[0];

      // --- D8 Data (Partner Correlation) ---
      const d8Items = [
        { name: 'Core', barM: 4.8, lineK: 68, primary: true },
        { name: 'Cloud', barM: 4.8, lineK: 96, primary: false },
        { name: 'AcmeMedia', barM: 2.2, lineK: 28, primary: false },
        { name: 'StreamX', barM: 2.6, lineK: 15, primary: false },
        { name: 'NovaTV', barM: 4.8, lineK: 17, primary: false },
        { name: 'CloudFlix', barM: 4.8, lineK: 48, primary: false },
        { name: 'KinoPlay', barM: 4.8, lineK: 76, primary: false },
        { name: 'VeloStream', barM: 2.6, lineK: 21, primary: false }
      ];
      const d8LinePts = d8Items.map((it, idx) => [84 + idx * 78, 175 - (it.lineK / 100) * 145]);

      // --- D9 Donut Data ---
      const d9Stats = {
        succeeded: { label: 'Succeeded', count: '1,812', rate: '71,90%', color: '#1D8842' },
        denied: { label: 'Denied', count: '526', rate: '20,18%', color: '#D97706' },
        failed: { label: 'Failed', count: '182', rate: '7,92%', color: '#DC2626' }
      };
      const d9Cur = d9Stats[dbState.d9Selected] || d9Stats.denied;

      // --- D10 TPS Spline Data ---
      const d10Vals = [905, 948, 804, 978, 845, 998, 972, 955, 834, 945, 982, 932, 870, 995];
      const d10Pts = d10Vals.map((v, idx) => [44 + idx * 48.2, 154 - ((v - 800) / 200) * 124]);

      return `
        <div class="db-sheet">
          <!-- Interactive Dashboard Filter Toolbar -->
          <div class="tbl-toolbar">
            <div class="tbl-filter-tabs" role="tablist" aria-label="Lọc nhóm widget Dashboard">
              <button type="button" class="tbl-filter-tab ${cat === 'all' ? 'is-active' : ''}" onclick="setDbFilter('all')">Tất cả (10)</button>
              <button type="button" class="tbl-filter-tab ${cat === 'bars' ? 'is-active' : ''}" onclick="setDbFilter('bars')">Cột &amp; Tiến độ (D1–D3, D8)</button>
              <button type="button" class="tbl-filter-tab ${cat === 'lines' ? 'is-active' : ''}" onclick="setDbFilter('lines')">Đường &amp; Donut (D5–D6, D9–D10)</button>
              <button type="button" class="tbl-filter-tab ${cat === 'maps' ? 'is-active' : ''}" onclick="setDbFilter('maps')">Bản đồ &amp; Empty (D4, D7)</button>
            </div>
            <div class="tbl-controls-right" style="font-size:12px;color:#475467;">
              <span>Click cột, dòng nền tảng, điểm giờ hoặc quốc gia để tương tác</span>
            </div>
          </div>

          ${showBars ? `
          <!-- D1: MONTHLY USAGE (12 Vertical Progress Columns + Active Dark Tooltip) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D1</span>
                <span class="db-widget-title">MONTHLY USAGE</span>
                <span class="db-help-dot" title="Monthly quota usage tracking">?</span>
              </div>
              ${dbHeadControls(false)}
            </div>
            <div class="db-pager-row" style="margin-top:0;margin-bottom:14px;">
              <span>1 - 6 / 12</span>
              <button type="button" class="db-pager-arrow" onclick="setDb1Bar(Math.max(0, dbState.d1ActiveIdx - 1))" aria-label="Previous">&lsaquo;</button>
              <button type="button" class="db-pager-arrow" onclick="setDb1Bar(Math.min(11, dbState.d1ActiveIdx + 1))" aria-label="Next">&rsaquo;</button>
            </div>
            <div style="display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:8px;padding-top:24px;">
              ${d1Data.map((col, idx) => {
                const isAct = dbState.d1ActiveIdx === idx;
                return `
                  <div style="display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer;position:relative;" onclick="setDb1Bar(${idx})">
                    ${isAct ? `<div class="db-dark-tip" style="top:-8px;left:50%;">${col.tip}</div>` : ''}
                    <div style="width:100%;height:74px;background:var(--chart-track);border-radius:7px;position:relative;overflow:hidden;display:flex;align-items:flex-end;justify-content:center;">
                      <div style="width:100%;height:${col.pct}%;background:${isAct ? 'var(--brand-primary, #155eef)' : 'rgba(59, 130, 246, 0.28)'};border-radius:6px;display:flex;align-items:center;justify-content:center;transition:all 0.16s ease;">
                        ${isAct ? '<span style="width:6px;height:6px;border-radius:999px;background:#ffffff;display:block;"></span>' : ''}
                      </div>
                      ${!isAct && col.label ? `<span style="position:absolute;${col.pct >= 30 ? 'bottom:4px;' : 'bottom:22px;'}font-size:11px;font-weight:700;color:var(--text-primary);font-variant-numeric:tabular-nums;">${col.label}</span>` : ''}
                    </div>
                    <span style="font-size:11.5px;color:${isAct ? 'var(--text-primary)' : 'var(--text-muted)'};font-weight:${isAct ? '700' : '500'};font-variant-numeric:tabular-nums;">${idx + 1}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- D2: Revenue / Usage Stacked Monthly Bar Chart -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div style="display:flex;align-items:center;gap:8px;">
                <span class="db-kicker">D2</span>
                <div class="db-seg-tabs">
                  <button type="button" class="db-seg-tab ${dbState.d2Mode === 'revenue' ? 'is-active' : ''}" onclick="setDb2Mode('revenue')">Revenue</button>
                  <button type="button" class="db-seg-tab ${dbState.d2Mode === 'usage' ? 'is-active' : ''}" onclick="setDb2Mode('usage')">Usage</button>
                </div>
              </div>
              <div class="db-head-controls" style="gap:16px;">
                <span class="db-legend-dot-item"><span class="db-dot" style="background:#004eeb;"></span>Enterprise ${dbState.d2Mode === 'revenue' ? 'revenue' : 'requests'}</span>
                <span class="db-legend-dot-item"><span class="db-dot" style="background:#1d8842;"></span>Pro ${dbState.d2Mode === 'revenue' ? 'revenue' : 'requests'}</span>
                <button type="button" class="db-filter-select"><span>2025</span><span style="font-size:10px;">&#9662;</span></button>
              </div>
            </div>
            <div class="db-chart-wrap" style="padding-top:10px;">
              <svg class="db-chart-svg" viewBox="0 0 700 225" aria-label="Revenue stacked chart">
                ${[0, 100, 200, 300, 400, 500].map((tick) => {
                  const y = 192 - (tick / 500) * 155;
                  return `
                    <line x1="48" y1="${y}" x2="686" y2="${y}" stroke="var(--chart-grid)" stroke-width="1"/>
                    <text x="40" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--text-muted)">${tick === 0 ? '0' : (dbState.d2Mode === 'revenue' ? '$ ' + tick : tick + 'K')}</text>
                  `;
                }).join('')}
                ${d2Vals.map((pair, idx) => {
                  const x = 62 + idx * 52;
                  const gVal = pair[0];
                  const bVal = pair[1];
                  const gVis = dbState.d2Mode === 'revenue' && idx === 6 ? 355 : gVal;
                  const bVis = dbState.d2Mode === 'revenue' && idx === 6 ? 34 : (dbState.d2Mode === 'revenue' && idx === 7 ? 372 : bVal * 0.72);
                  const gH = Math.max(6, (gVis / 500) * 155);
                  const bH = Math.max(6, (bVis / 500) * 155);
                  const gY = 192 - gH;
                  const bY = Math.max(22, gY - bH);
                  const actualBH = gY - bY;
                  const isAct = dbState.d2ActiveIdx === idx;
                  return `
                    <g style="cursor:pointer;" onclick="setDb2Month(${idx})">
                      <rect x="${x}" y="${bY}" width="28" height="${actualBH + 4}" rx="4" fill="#004eeb" opacity="${isAct ? '1' : '0.94'}"/>
                      <rect x="${x}" y="${gY}" width="28" height="${gH}" fill="#1d8842"/>
                      ${actualBH >= 22 ? `<text x="${x + 14}" y="${bY + 15}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#ffffff">${bVal}</text>` : (bVal > 30 ? `<text x="${x + 14}" y="${bY - 5}" text-anchor="middle" font-size="10" font-weight="600" fill="var(--brand-link, #60a5fa)">${bVal}</text>` : '')}
                      ${gH >= 20 ? `<text x="${x + 14}" y="${gY + 15}" text-anchor="middle" font-size="10.5" font-weight="600" fill="#ffffff">${gVal}</text>` : ''}
                      ${isAct ? `<circle cx="${x + 14}" cy="${bY}" r="4.5" fill="#ffffff" stroke="var(--text-primary)" stroke-width="2"/>` : ''}
                      <text x="${x + 14}" y="212" text-anchor="middle" font-size="11" font-weight="${isAct ? '700' : '500'}" fill="${isAct ? 'var(--text-primary)' : 'var(--text-muted)'}">${d2Months[idx]}</text>
                    </g>
                  `;
                }).join('')}
              </svg>
              ${(() => {
                const idx = dbState.d2ActiveIdx;
                const act = d2Vals[idx] || [10, 20];
                const gVis = dbState.d2Mode === 'revenue' && idx === 6 ? 355 : act[0];
                const bVis = dbState.d2Mode === 'revenue' && idx === 6 ? 34 : (dbState.d2Mode === 'revenue' && idx === 7 ? 372 : act[1] * 0.72);
                const gH = Math.max(6, (gVis / 500) * 155);
                const bH = Math.max(6, (bVis / 500) * 155);
                const topPx = Math.max(22, 192 - gH - bH);
                const leftPct = ((76 + idx * 52) / 700) * 100;
                const unit = dbState.d2Mode === 'revenue' ? '$' : '';
                const sfx = dbState.d2Mode === 'usage' ? 'K' : '';
                return `
                  <div class="db-dark-tip" style="left:${leftPct.toFixed(1)}%;top:calc(${((topPx / 225) * 100).toFixed(1)}% - 10px);text-align:left;padding:8px 11px;line-height:1.5;">
                    <div><span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:#2e90fa;margin-right:6px;"></span>Enterprise: ${unit}${act[1]}${sfx}</div>
                    <div><span style="display:inline-block;width:7px;height:7px;border-radius:99px;background:#17b26a;margin-right:6px;"></span>Pro: ${unit}${act[0]}${sfx}</div>
                  </div>
                `;
              })()}
            </div>
          </div>

          <!-- D3: USAGE BY PLATFORM (KPIs + Horizontal Multi-Segment Progress Bars) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D3</span>
                <span class="db-widget-title">USAGE BY PLATFORM</span>
                <span class="db-help-dot" title="Usage distribution by platform">?</span>
              </div>
              ${dbHeadControls(false)}
            </div>
            <div class="db-kpi-strip">
              <div class="db-kpi-box"><div class="db-kpi-lbl">Users</div><div class="db-kpi-val">120</div></div>
              <div class="db-kpi-box"><div class="db-kpi-lbl">Devices</div><div class="db-kpi-val">360</div></div>
              <div class="db-kpi-box"><div class="db-kpi-lbl">IP Address</div><div class="db-kpi-val">22</div></div>
            </div>
            <div class="db-drm-rows">
              ${d3Rows.map((row) => {
                const isAct = dbState.d3ActiveDrm === row.id;
                const gPct = ((row.g / 3000) * 100).toFixed(1);
                const aPct = ((row.a / 3000) * 100).toFixed(1);
                const rPct = ((row.r / 3000) * 100).toFixed(1);
                return `
                  <div class="db-drm-row" onclick="setDb3Drm('${row.id}')">
                    <span class="db-drm-name" style="${isAct ? 'color:var(--text-primary);font-weight:700;' : ''}">${row.name}</span>
                    <span class="db-drm-total">${row.total}</span>
                    <div class="db-drm-track" style="overflow:visible;">
                      <div class="db-drm-seg" style="width:${gPct}%;border-radius:6px 0 0 6px;background:${isAct ? '#166534' : 'var(--status-success-bg, #ecfdf3)'};color:${isAct ? '#ffffff' : 'var(--ds-green-text, #065f46)'};">${row.g.toLocaleString()}</div>
                      <div class="db-drm-seg" style="width:${aPct}%;background:${isAct ? '#c2410c' : 'var(--status-warning-bg, #fff7ed)'};color:${isAct ? '#ffffff' : 'var(--ds-orange-text, #9a3412)'};">${row.a >= 500 ? row.a.toLocaleString() : ''}</div>
                      <div class="db-drm-seg" style="width:${rPct}%;border-radius:0 6px 6px 0;background:${isAct ? '#b91c1c' : 'var(--status-danger-bg, #fef2f2)'};color:${isAct ? '#ffffff' : 'var(--ds-red-text, #991b1b)'};position:relative;overflow:visible;">
                        ${row.r >= 500 ? row.r.toLocaleString() : ''}
                        ${isAct ? '<span style="width:6px;height:6px;border-radius:99px;background:#ffffff;display:block;"></span>' : ''}
                        ${isAct ? `<div class="db-dark-tip" style="left:50%;top:-7px;">${row.tip}</div>` : ''}
                      </div>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
            <div class="db-pager-row">
              <span>1 - 6 / 12</span>
              <button type="button" class="db-pager-arrow" aria-label="Prev">&lsaquo;</button>
              <button type="button" class="db-pager-arrow" aria-label="Next">&rsaquo;</button>
            </div>
          </div>
          ` : ''}

          ${showMaps ? `
          <!-- D4: Empty State Card -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D4</span>
                <span class="db-widget-title">TITLE (EMPTY STATE)</span>
                <span class="db-help-dot" title="Zero-data placeholder pattern">?</span>
              </div>
              ${dbHeadControls(false)}
            </div>
            ${!dbState.d4SampleCreated ? `
              <div class="db-empty-box">
                <div>It looks like you haven't recorded any data yet.</div>
                <button type="button" class="ds-btn ds-btn-secondary" style="height:32px;font-size:12px;" onclick="toggleDb4Sample()">Create new [Data]</button>
              </div>
            ` : `
              <div class="db-empty-box" style="gap:8px;color:var(--text-secondary);">
                <span class="tbl-pill tbl-pill-green">Sample dataset initialized (24 records)</span>
                <div style="font-size:12px;color:var(--text-muted);">Dữ liệu mẫu đã được khởi tạo thành công. Bấm nút bên dưới để quay lại trạng thái Empty State gốc.</div>
                <button type="button" class="ds-btn ds-btn-secondary" style="height:30px;font-size:12px;" onclick="toggleDb4Sample()">Reset to Empty State</button>
              </div>
            `}
          </div>
          ` : ''}

          ${showLines ? `
          <!-- D5: Latency analysis (ms) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D5</span>
                <span class="db-widget-title is-mixed">Latency analysis (ms)</span>
              </div>
            </div>
            <div class="db-chart-wrap">
              <svg class="db-chart-svg" viewBox="0 0 700 205" aria-label="Latency spline chart">
                <defs>
                  <linearGradient id="dbLatencyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#1d8842" stop-opacity="0.28"/>
                    <stop offset="100%" stop-color="#1d8842" stop-opacity="0.01"/>
                  </linearGradient>
                </defs>
                ${[20, 70, 120, 170, 220].map((v) => {
                  const y = 152 - ((v - 20) / 200) * 124;
                  return `
                    <line x1="46" y1="${y}" x2="684" y2="${y}" stroke="var(--chart-grid)" stroke-width="1"/>
                    <text x="38" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--text-muted)">${v}</text>
                  `;
                }).join('')}
                ${dbState.d5Series.response ? `<path d="${dbSplinePath(d5RespPts)}" fill="none" stroke="#f59e0b" stroke-opacity="0.38" stroke-width="2"/>` : ''}
                ${dbState.d5Series.authen ? `<path d="${dbSplinePath(d5AuthenPts)}" fill="none" stroke="#dc2626" stroke-opacity="0.35" stroke-width="2"/>` : ''}
                ${dbState.d5Series.total ? `
                  <path d="${dbSplinePath(d5TotalPts)} L ${d5TotalPts[d5TotalPts.length - 1][0]} 152 L ${d5TotalPts[0][0]} 152 Z" fill="url(#dbLatencyGrad)"/>
                  <path d="${dbSplinePath(d5TotalPts)}" fill="none" stroke="#1d8842" stroke-width="2.5"/>
                ` : ''}
                ${d5Labels.map((lbl, idx) => {
                  const x = 92 + idx * 116;
                  const lines = lbl.split('\n');
                  return `
                    <g transform="translate(${x}, 168) rotate(-28)">
                      <text x="0" y="0" text-anchor="end" font-size="10.5" fill="var(--text-muted)">${lines[0]}</text>
                      ${lines[1] ? `<text x="0" y="13" text-anchor="end" font-size="10.5" fill="var(--text-muted)">${lines[1]}</text>` : ''}
                    </g>
                  `;
                }).join('')}
              </svg>
            </div>
            <div class="db-legend-row">
              ${[
                { k: 'total', lbl: 'Total', color: 'var(--ds-green-text, #15803d)' },
                { k: 'authen', lbl: 'Authen', color: 'var(--ds-red-text, #b91c1c)' },
                { k: 'response', lbl: 'Response', color: 'var(--ds-amber-text, #b45309)' }
              ].map((s) => {
                const on = !!dbState.d5Series[s.k];
                return `
                  <button type="button" class="db-toggle-pill" style="border-color:transparent;background:transparent;" onclick="toggleDb5Series('${s.k}')">
                    <span style="color:${s.color};">${s.lbl}</span>
                    <span class="ds-tg-control is-sm ${on ? 'is-on' : ''}" style="pointer-events:none;transform:scale(0.84);"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- D6: TOTAL LICENSE REQUEST (24h Area Spline + Interactive Cursor Tooltip) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D6</span>
                <span class="db-widget-title">TOTAL API REQUESTS</span>
                <span class="db-help-dot" title="24-hour request volume breakdown">?</span>
              </div>
              ${dbHeadControls(false)}
            </div>
            <div class="db-chart-wrap">
              <svg class="db-chart-svg" viewBox="0 0 700 185" aria-label="Total license request spline">
                <defs>
                  <linearGradient id="dbReqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#1d8842" stop-opacity="0.28"/>
                    <stop offset="100%" stop-color="#1d8842" stop-opacity="0.01"/>
                  </linearGradient>
                </defs>
                ${[0, 250, 500, 750, 1000].map((v) => {
                  const y = 156 - (v / 1000) * 130;
                  return `
                    <line x1="42" y1="${y}" x2="684" y2="${y}" stroke="var(--chart-grid)" stroke-width="1"/>
                    <text x="34" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--text-muted)">${v === 1000 ? '1K' : v}</text>
                  `;
                }).join('')}
                ${dbState.d6Series.denied ? `<path d="${dbSplinePath(d6DeniedPts)}" fill="none" stroke="#dc2626" stroke-opacity="0.32" stroke-width="2"/>` : `<path d="${dbSplinePath(d6DeniedPts)}" fill="none" stroke="#dc2626" stroke-opacity="0.16" stroke-width="1.6"/>`}
                ${dbState.d6Series.failed ? `<path d="${dbSplinePath(d6FailedPts)}" fill="none" stroke="#f59e0b" stroke-opacity="0.4" stroke-width="2"/>` : `<path d="${dbSplinePath(d6FailedPts)}" fill="none" stroke="#f59e0b" stroke-opacity="0.22" stroke-width="1.6"/>`}
                ${dbState.d6Series.succeeded ? `
                  <path d="${dbSplinePath(d6Pts)} L ${d6Pts[d6Pts.length - 1][0]} 156 L ${d6Pts[0][0]} 156 Z" fill="url(#dbReqGrad)"/>
                  <path d="${dbSplinePath(d6Pts)}" fill="none" stroke="#1d8842" stroke-width="2.4"/>
                ` : ''}
                <line x1="${curPt6[0]}" y1="${curPt6[1]}" x2="${curPt6[0]}" y2="156" stroke="var(--border-strong)" stroke-dasharray="3 3" stroke-width="1.4"/>
                <circle cx="${curPt6[0]}" cy="${curPt6[1]}" r="4.5" fill="#ffffff" stroke="#98a2b3" stroke-width="2"/>
                ${d6Vals.map((_, h) => `
                  <g style="cursor:pointer;" onclick="setDb6Cursor(${h})">
                    <rect x="${42 + h * 27.5 - 12}" y="20" width="24" height="158" fill="transparent"/>
                    <text x="${42 + h * 27.5}" y="176" text-anchor="middle" font-size="10.5" font-weight="${h === curIdx6 ? '700' : '500'}" fill="${h === curIdx6 ? 'var(--text-primary)' : 'var(--text-muted)'}">${h}</text>
                  </g>
                `).join('')}
              </svg>
              <div class="db-dark-tip" style="left:${((curPt6[0] / 700) * 100).toFixed(1)}%;top:calc(${((curPt6[1] / 185) * 100).toFixed(1)}% - 12px);text-align:center;">
                <div style="font-size:10px;color:#d0d5dd;font-weight:500;">Status</div>
                <div style="font-size:13px;font-weight:700;">${d6Vals[curIdx6]}</div>
              </div>
            </div>
            <div class="db-legend-row">
              ${[
                { k: 'succeeded', lbl: 'Succeeded', actCls: 'is-active-green' },
                { k: 'denied', lbl: 'Denied', actCls: 'is-active-red' },
                { k: 'failed', lbl: 'Failed', actCls: 'is-active-amber' }
              ].map((s) => {
                const on = !!dbState.d6Series[s.k];
                return `
                  <button type="button" class="db-toggle-pill ${on ? s.actCls : ''}" onclick="toggleDb6Series('${s.k}')">
                    <span>${s.lbl}</span>
                    <span class="ds-tg-control is-sm ${on ? 'is-on' : ''}" style="pointer-events:none;transform:scale(0.84);"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>
                  </button>
                `;
              }).join('')}
            </div>
            <div class="db-pager-row">
              <span>00:00 - 12:00 / 23:59</span>
              <button type="button" class="db-pager-arrow" onclick="setDb6Cursor(Math.max(0, curIdx6 - 1))" aria-label="Earlier">&lsaquo;</button>
              <button type="button" class="db-pager-arrow" onclick="setDb6Cursor(Math.min(23, curIdx6 + 1))" aria-label="Later">&rsaquo;</button>
            </div>
          </div>
          ` : ''}

          ${showMaps ? `
          <!-- D7: LOCATION RANKING (Top 10 Countries + Vector Geo Map) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D7</span>
                <span class="db-widget-title">LOCATION RANKING</span>
                <span class="db-help-dot" title="Geographic request distribution">?</span>
              </div>
              ${dbHeadControls(true)}
            </div>
            <div class="db-geo-grid">
              <div class="db-rank-list">
                ${d7Countries.map((c) => `
                  <div class="db-rank-item ${c.name === activeC.name ? 'is-active' : ''}" onclick="setDb7Country('${c.name}')">
                    <span class="db-rank-idx">${c.rank}</span>
                    <span class="db-rank-country">${c.name}</span>
                    <span class="db-rank-num">${c.val}</span>
                  </div>
                `).join('')}
              </div>
              <div class="db-map-panel">
                <div class="db-map-zoom">
                  <button type="button" onclick="zoomDb7Map(0.15)" title="Zoom in">+</button>
                  <button type="button" onclick="zoomDb7Map(-0.15)" title="Zoom out">&minus;</button>
                </div>
                <div style="position:absolute;bottom:10px;left:12px;background:var(--bg-surface);border:1px solid var(--border-default);border-radius:6px;padding:4px 8px;font-size:11px;font-weight:600;color:var(--text-primary);z-index:2;">
                  ${activeC.name}: <span style="color:var(--ds-orange-text, #c2410c);">${activeC.val}</span>
                </div>
                <svg viewBox="0 0 420 220" style="width:100%;height:auto;transform:scale(${dbState.d7Zoom});transform-origin:center;transition:transform 0.2s ease;" aria-label="World Choropleth Map">
                  <!-- North America -->
                  <path d="M 38 42 L 106 32 L 122 60 L 105 92 L 72 95 L 54 78 Z" fill="${activeC.region === 'us' ? '#ea580c' : 'var(--map-land-warm)'}" stroke="var(--map-stroke)" stroke-width="1"/>
                  <path d="M 55 94 L 82 95 L 92 115 L 74 118 Z" fill="var(--map-land)" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- Greenland -->
                  <path d="M 122 18 L 154 14 L 148 38 L 124 38 Z" fill="var(--map-land)" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- South America -->
                  <path d="M 94 120 L 128 124 L 146 154 L 122 200 L 104 198 L 96 156 Z" fill="${activeC.region === 'br' ? '#ea580c' : 'var(--map-land-warm)'}" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- Europe -->
                  <path d="M 188 38 L 234 32 L 242 68 L 194 74 L 182 58 Z" fill="${activeC.region === 'eu' ? '#ea580c' : 'var(--map-land-warm)'}" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- Africa -->
                  <path d="M 188 82 L 240 80 L 256 122 L 232 168 L 210 165 L 196 122 Z" fill="var(--map-land)" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- Russia / Northern Asia -->
                  <path d="M 238 26 L 368 28 L 382 62 L 320 74 L 242 68 Z" fill="${activeC.region === 'ru' ? '#ea580c' : 'var(--map-land)'}" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- Middle East / Central Asia -->
                  <path d="M 244 74 L 284 74 L 282 104 L 252 102 Z" fill="var(--map-land)" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- India -->
                  <path d="M 284 88 L 310 88 L 306 122 L 292 132 L 282 112 Z" fill="${activeC.region === 'in' ? '#ea580c' : 'var(--map-land-mid)'}" stroke="var(--map-stroke)" stroke-width="1.2"/>
                  <!-- East Asia -->
                  <path d="M 312 68 L 362 66 L 358 104 L 316 104 Z" fill="${activeC.region === 'ea' ? '#ea580c' : 'var(--map-land)'}" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- SE Asia / Indonesia / Vietnam / Philippines -->
                  <path d="M 312 106 L 342 106 L 354 134 L 324 142 L 308 126 Z" fill="${activeC.region === 'sea' ? '#ea580c' : 'var(--map-land-warm)'}" stroke="var(--map-stroke)" stroke-width="1"/>
                  <!-- Australia -->
                  <path d="M 334 150 L 382 148 L 388 182 L 348 188 L 330 170 Z" fill="var(--map-land-warm)" stroke="var(--map-stroke)" stroke-width="1"/>
                </svg>
              </div>
            </div>
            <div class="db-pager-row">
              <span>1 - 10 / 99</span>
              <button type="button" class="db-pager-arrow" aria-label="Prev">&lsaquo;</button>
              <button type="button" class="db-pager-arrow" aria-label="Next">&rsaquo;</button>
            </div>
          </div>
          ` : ''}

          ${showBars ? `
          <!-- D8: PARTNER CORRELATION (Dual-Axis Bar + Smooth Green Line Overlay) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D8</span>
                <span class="db-widget-title">PARTNER CORRELATION</span>
                <span class="db-help-dot" title="Requests vs Active Users correlation">?</span>
              </div>
              ${dbHeadControls(false)}
            </div>
            <div class="db-chart-wrap">
              <svg class="db-chart-svg" viewBox="0 0 700 220" aria-label="Partner correlation dual-axis chart">
                ${[0, 2, 4, 6, 8, 10].map((m) => {
                  const y = 175 - (m / 10) * 145;
                  return `
                    <line x1="54" y1="${y}" x2="646" y2="${y}" stroke="var(--chart-grid)" stroke-width="1"/>
                    <text x="46" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--text-muted)">${m === 0 ? '0' : m + 'M'}</text>
                    <text x="654" y="${y + 4}" text-anchor="start" font-size="11" fill="var(--text-muted)">${m === 0 ? '0' : (m * 10) + 'K'}</text>
                  `;
                }).join('')}
                ${d8Items.map((it, idx) => {
                  const x = 66 + idx * 78;
                  const h = (it.barM / 10) * 145;
                  const y = 175 - h;
                  return `
                    <g>
                      <rect x="${x}" y="30" width="36" height="145" rx="5" fill="var(--chart-track)"/>
                      <rect x="${x}" y="${y}" width="36" height="${h}" rx="5" fill="${it.primary ? 'var(--chart-bar-primary, #004eeb)' : 'var(--chart-bar-muted, #c7d7fe)'}"/>
                      <text x="${x + 18}" y="${y - 6}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--brand-link, #155eef)">${it.barM}M</text>
                      <text x="${x + 18}" y="196" text-anchor="middle" font-size="11" fill="var(--text-secondary)">${it.name}</text>
                    </g>
                  `;
                }).join('')}
                <path d="${dbSplinePath(d8LinePts)}" fill="none" stroke="#2e9043" stroke-width="2.2"/>
                ${d8LinePts.map((pt) => `
                  <circle cx="${pt[0]}" cy="${pt[1]}" r="5.5" fill="rgba(46, 144, 67, 0.2)"/>
                  <circle cx="${pt[0]}" cy="${pt[1]}" r="3.2" fill="#2e9043" stroke="#ffffff" stroke-width="1.2"/>
                `).join('')}
              </svg>
            </div>
            <div class="db-legend-row">
              <span class="db-legend-dot-item"><span class="db-dot" style="background:#2e9043;"></span>Requests</span>
              <span class="db-legend-dot-item"><span class="db-dot" style="background:#155eef;"></span>Active users</span>
            </div>
            <div class="db-pager-row">
              <span>00:00 - 12:00 / 23:59</span>
              <button type="button" class="db-pager-arrow" aria-label="Prev">&lsaquo;</button>
              <button type="button" class="db-pager-arrow" aria-label="Next">&rsaquo;</button>
            </div>
          </div>
          ` : ''}

          ${showLines ? `
          <!-- D9: REQUEST DELIVERIES (Interactive Segmented Donut Chart) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D9</span>
                <span class="db-widget-title">REQUEST DELIVERIES</span>
                <span class="db-help-dot" title="Request delivery status ratio">?</span>
              </div>
              ${dbHeadControls(true)}
            </div>
            <div style="display:flex;flex-direction:column;align-items:center;padding:8px 0;">
              <div style="position:relative;width:210px;height:210px;">
                <svg viewBox="0 0 200 200" style="width:100%;height:100%;transform:rotate(-90deg);" aria-label="Request Deliveries Donut">
                  <defs>
                    <linearGradient id="dbDonutGreen" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stop-color="#1d8842"/>
                      <stop offset="100%" stop-color="#d1fae5"/>
                    </linearGradient>
                  </defs>
                  <!-- Track -->
                  <circle cx="100" cy="100" r="74" fill="none" stroke="var(--chart-track)" stroke-width="22"/>
                  <!-- Succeeded (71.9% -> ~334 of 465 circumference) -->
                  <circle cx="100" cy="100" r="74" fill="none" stroke="url(#dbDonutGreen)" stroke-width="22" stroke-linecap="round"
                    stroke-dasharray="322 465" stroke-dashoffset="0" style="cursor:pointer;" onclick="setDb9Metric('succeeded')"/>
                  <!-- Failed (7.9% -> ~38) -->
                  <circle cx="100" cy="100" r="74" fill="none" stroke="#dc2626" stroke-opacity="0.72" stroke-width="22" stroke-linecap="round"
                    stroke-dasharray="48 465" stroke-dashoffset="-334" style="cursor:pointer;" onclick="setDb9Metric('failed')"/>
                  <!-- Denied (20.2% -> ~72) -->
                  <circle cx="100" cy="100" r="74" fill="none" stroke="#ea580c" stroke-width="22" stroke-linecap="round"
                    stroke-dasharray="70 465" stroke-dashoffset="-392" style="cursor:pointer;" onclick="setDb9Metric('denied')"/>
                </svg>
                <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
                  <span style="font-size:12px;font-weight:700;color:var(--text-secondary);">${d9Cur.label}</span>
                  <span style="font-size:28px;font-weight:800;color:var(--text-primary);line-height:1.15;font-variant-numeric:tabular-nums;">${d9Cur.count}</span>
                  <span style="font-size:11.5px;color:var(--text-muted);margin-top:2px;">Rate: ${d9Cur.rate}</span>
                  <span style="width:52px;height:1px;background:var(--border-default);margin:5px 0;"></span>
                  <span style="font-size:11.5px;font-weight:600;color:var(--text-secondary);">Total: 2,520</span>
                </div>
              </div>
              <div class="db-legend-row" style="margin-top:16px;">
                ${['succeeded', 'denied', 'failed'].map((k) => {
                  const st = d9Stats[k];
                  const isAct = dbState.d9Selected === k;
                  return `
                    <button type="button" class="db-legend-dot-item" style="border:1px solid ${isAct ? 'var(--border-strong)' : 'transparent'};background:${isAct ? 'var(--bg-subtle)' : 'transparent'};padding:4px 8px;border-radius:99px;font-weight:${isAct ? '700' : '500'};" onclick="setDb9Metric('${k}')">
                      <span class="db-dot" style="background:${st.color};"></span>${st.label}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
            <div class="db-pager-row">
              <span><strong>26</strong> / 12</span>
              <button type="button" class="db-pager-arrow" aria-label="Prev">&lsaquo;</button>
              <button type="button" class="db-pager-arrow" aria-label="Next">&rsaquo;</button>
            </div>
          </div>

          <!-- D10: Transactions per second (TPS) -->
          <div class="db-widget-card">
            <div class="db-widget-head">
              <div class="db-title-left">
                <span class="db-kicker">D10</span>
                <span class="db-widget-title is-mixed">Transactions per second (TPS)</span>
              </div>
              <span style="font-size:12px;font-weight:600;color:var(--text-secondary);">Peak: 998</span>
            </div>
            <div class="db-chart-wrap">
              <svg class="db-chart-svg" viewBox="0 0 700 185" aria-label="Transactions per second area chart">
                <defs>
                  <linearGradient id="dbTpsBlueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#2e5bff" stop-opacity="0.34"/>
                    <stop offset="100%" stop-color="#2e5bff" stop-opacity="0.02"/>
                  </linearGradient>
                </defs>
                ${[800, 850, 900, 950, 1000].map((v) => {
                  const y = 154 - ((v - 800) / 200) * 124;
                  return `
                    <line x1="44" y1="${y}" x2="684" y2="${y}" stroke="var(--chart-grid)" stroke-width="1"/>
                    <text x="36" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--text-muted)">${v}</text>
                  `;
                }).join('')}
                ${dbState.d10Series.succeeded ? `
                  <path d="${dbSplinePath(d10Pts)} L ${d10Pts[d10Pts.length - 1][0]} 154 L ${d10Pts[0][0]} 154 Z" fill="url(#dbTpsBlueGrad)"/>
                  <path d="${dbSplinePath(d10Pts)}" fill="none" stroke="var(--brand-link, #2e5bff)" stroke-width="2.4"/>
                ` : ''}
                ${['4:02', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'].map((t, idx) => `
                  <text x="${92 + idx * 92}" y="175" text-anchor="middle" font-size="11" fill="var(--text-muted)">${t}</text>
                `).join('')}
              </svg>
            </div>
            <div class="db-legend-row">
              ${[
                { k: 'succeeded', lbl: 'Succeeded', color: '#1d8842' },
                { k: 'denied', lbl: 'Denied', color: '#475467' },
                { k: 'failed', lbl: 'Failed', color: '#475467' }
              ].map((s) => {
                const on = !!dbState.d10Series[s.k];
                return `
                  <button type="button" class="db-toggle-pill" style="border-color:transparent;background:transparent;" onclick="toggleDb10Series('${s.k}')">
                    <span style="color:${on ? 'var(--ds-green-text, #15803d)' : 'var(--text-secondary, #475467)'};">${s.lbl}</span>
                    <span class="ds-tg-control is-sm ${on ? 'is-on' : ''}" style="pointer-events:none;transform:scale(0.84);"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>
          ` : ''}

          <!-- Dashboard Usage Guidelines -->
          <div class="tbl-guide-grid">
            <div class="tbl-guide-card is-do">
              <div class="tbl-guide-head">Nên làm (Best Practices)</div>
              <ul class="tbl-guide-list">
                <li>Dùng chung cấu trúc Card Header chuẩn (Title + <code>(?)</code> Tooltip + Calendar + Filter Dropdown) ở các widget cùng cấp để tạo nhịp quét mắt đồng nhất.</li>
                <li>Giữ trạng thái nền dịu nhẹ (Pastel Green/Orange/Red hoặc Soft Blue) cho các mục không focus, chỉ nâng độ bão hòa màu đậm và bật Dark Tooltip cho mục đang tương tác (<strong>D1, D3</strong>).</li>
                <li>Luôn thiết kế sẵn <strong>Empty State (D4)</strong> có nút CTA tạo dữ liệu rõ ràng cho các tenant mới khởi tạo chưa có telemetry.</li>
                <li>Sử dụng công tắc Toggle ngay trong Legend của biểu đồ nhiều đường (<strong>D5, D6, D10</strong>) giúp người vận hành cô lập series lỗi nhanh chóng.</li>
              </ul>
            </div>
            <div class="tbl-guide-card is-dont">
              <div class="tbl-guide-head">Cần tránh (Pitfalls)</div>
              <ul class="tbl-guide-list">
                <li>Không dùng tên tài khoản cá nhân nội bộ (như viết tắt nhân sự) làm nhãn trục X trên spec chia sẻ; luôn thay bằng mã đối tác/dịch vụ chuẩn hóa (<strong>D8</strong>).</li>
                <li>Tránh hiển thị quá 3 đường spline đậm ngang nhau trong cùng một khung đồ thị vì sẽ làm chìm xu hướng chính.</li>
                <li>Không nhồi quá nhiều nhãn số trực tiếp lên từng cột nếu thanh cột quá thấp; hãy chuyển phần chi tiết sang Floating Tooltip khi hover/click (<strong>D2</strong>).</li>
                <li>Không bỏ qua đơn vị trục (<code>ms</code>, <code>$</code>, <code>TPS</code>, <code>M / K</code>) ở tiêu đề hoặc nhãn trục Y.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================