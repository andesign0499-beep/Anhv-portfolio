    // =========================================================================
    // 0. BILINGUAL I18N ENGINE (English Default + Vietnamese Toggle) & SYNC HELPERS
    // =========================================================================
    // (UI_LANG_STORAGE_KEY and uiLang are centralized in js/i18n.js)

    const UI_THEME_STORAGE_KEY = 'de_studio_ui_theme_v1';
    let uiTheme = (() => {
      try {
        return localStorage.getItem(UI_THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
      } catch (e) {
        return 'light';
      }
    })();

    function parseCssRgba(str) {
      if (!str || typeof str !== 'string') return null;
      const s = str.trim();
      if (s === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
      const hexMatch = s.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
      if (hexMatch) {
        let h = hexMatch[1];
        if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
        const r = parseInt(h.slice(0, 2), 16);
        const g = parseInt(h.slice(2, 4), 16);
        const b = parseInt(h.slice(4, 6), 16);
        const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
        return { r, g, b, a };
      }
      const rgbMatch = s.match(/^rgba?\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/i);
      if (rgbMatch) {
        let a = 1;
        if (rgbMatch[4] !== undefined) {
          a = rgbMatch[4].endsWith('%') ? parseFloat(rgbMatch[4]) / 100 : parseFloat(rgbMatch[4]);
        }
        return {
          r: Math.max(0, Math.min(255, Math.round(parseFloat(rgbMatch[1])))),
          g: Math.max(0, Math.min(255, Math.round(parseFloat(rgbMatch[2])))),
          b: Math.max(0, Math.min(255, Math.round(parseFloat(rgbMatch[3])))),
          a: isNaN(a) ? 1 : Math.max(0, Math.min(1, a))
        };
      }
      return null;
    }

    function blendOverRgb(fg, bg) {
      const a = fg.a !== undefined ? fg.a : 1;
      return {
        r: Math.round(fg.r * a + bg.r * (1 - a)),
        g: Math.round(fg.g * a + bg.g * (1 - a)),
        b: Math.round(fg.b * a + bg.b * (1 - a)),
        a: 1
      };
    }

    function rgbToHexStr(rgb) {
      const toHex = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
      return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
    }

    function getRelativeLuminance(rgb) {
      const norm = v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * norm(rgb.r) + 0.7152 * norm(rgb.g) + 0.0722 * norm(rgb.b);
    }

    function computeWcagContrast(fgRgb, bgRgb) {
      const l1 = getRelativeLuminance(fgRgb);
      const l2 = getRelativeLuminance(bgRgb);
      const hi = Math.max(l1, l2);
      const lo = Math.min(l1, l2);
      return (hi + 0.05) / (lo + 0.05);
    }

    function computeApcaContrast(fgRgb, bgRgb) {
      const norm = v => Math.pow(Math.max(0, Math.min(255, v)) / 255, 2.4);
      const sRgbToY = (c) => 0.2126729 * norm(c.r) + 0.7151522 * norm(c.g) + 0.0721750 * norm(c.b);
      const yTxtRaw = sRgbToY(fgRgb);
      const yBgRaw = sRgbToY(bgRgb);
      const blkThrs = 0.022;
      const blkClmp = 1.414;
      const yTxt = yTxtRaw > blkThrs ? yTxtRaw : yTxtRaw + Math.pow(blkThrs - yTxtRaw, blkClmp);
      const yBg = yBgRaw > blkThrs ? yBgRaw : yBgRaw + Math.pow(blkThrs - yBgRaw, blkClmp);

      if (Math.abs(yBg - yTxt) < 0.0005) {
        return { lc: 0, rawLc: 0, rating: 'Fail', polarity: 'neutral', label: 'Lc 0' };
      }

      let sapc = 0;
      let polarity = 'dark-on-light';
      if (yBg > yTxt) {
        sapc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14;
        polarity = 'dark-on-light';
      } else {
        sapc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14;
        polarity = 'light-on-dark';
      }

      let output = (Math.abs(sapc) < 0.1) ? 0 : (sapc > 0 ? (sapc - 0.027) * 100 : (sapc + 0.027) * 100);
      const absLc = Math.round(Math.abs(output));
      let rating = 'Fail';
      if (absLc >= 90) rating = 'AAA';
      else if (absLc >= 75) rating = 'AA';
      else if (absLc >= 60) rating = 'Large';
      else if (absLc >= 45) rating = 'UI';

      return {
        lc: absLc,
        rawLc: Math.round(output),
        rating,
        polarity,
        label: `Lc ${absLc} (${rating})`
      };
    }
    window.computeApcaContrast = computeApcaContrast;

    function runLiveSpatialGridAudit() {
      const frame = document.getElementById('canvasFrame');
      const results = {
        totalChecked: 0,
        on8pt: 0,
        on4pt: 0,
        offGrid: 0,
        compliancePct: 100,
        eightPtPct: 100,
        dimensions: [],
        warnings: [],
        summaryByType: {
          height: { count: 0, onGrid: 0 },
          padding: { count: 0, onGrid: 0 },
          gap: { count: 0, onGrid: 0 }
        }
      };
      if (!frame) return results;

      const elements = frame.querySelectorAll('button, .btn-ds, input, select, textarea, .ds-input, .ds-card, .card, .panel, table, thead tr, tbody tr, .toolbar, .badge, .ds-badge, .pill, [style*="display: flex"], [style*="display:flex"], [style*="display: grid"], [style*="display:grid"]');
      const dimFreq = new Map();
      const warningList = [];
      const seenWarnings = new Set();

      function recordDimension(el, propName, rawValue, label) {
        if (!rawValue || isNaN(rawValue) || rawValue <= 0) return;
        const rounded = Math.round(rawValue);
        if (rounded <= 0 || rounded > 1200) return;

        results.totalChecked++;
        if (results.summaryByType[propName]) results.summaryByType[propName].count++;

        const is8 = rounded % 8 === 0;
        const is4 = (rounded % 4 === 0) || rounded === 2;

        if (is8) {
          results.on8pt++;
          if (results.summaryByType[propName]) results.summaryByType[propName].onGrid++;
          dimFreq.set(rounded, (dimFreq.get(rounded) || 0) + 1);
        } else if (is4) {
          results.on4pt++;
          if (results.summaryByType[propName]) results.summaryByType[propName].onGrid++;
          dimFreq.set(rounded, (dimFreq.get(rounded) || 0) + 1);
        } else {
          results.offGrid++;
          const nearest = Math.round(rounded / 4) * 4 || 4;
          const diff = nearest - rounded;
          const diffStr = diff > 0 ? `+${diff}px` : `${diff}px`;

          const tag = el.tagName.toLowerCase();
          const cls = (typeof el.className === 'string' ? el.className.split(/\\s+/).filter(Boolean).slice(0, 2).join('.') : '');
          const desc = tag + (cls ? `.${cls}` : '');
          const key = `${desc}|${propName}|${rounded}`;

          if (!seenWarnings.has(key) && warningList.length < 30) {
            seenWarnings.add(key);
            warningList.push({
              element: desc,
              prop: label || propName,
              value: rounded,
              nearest,
              diffStr,
              text: (el.textContent || '').trim().slice(0, 32)
            });
          }
        }
      }

      elements.forEach(el => {
        if (el.nodeType !== 1) return;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const tag = el.tagName.toLowerCase();
        const isControl = tag === 'button' || tag === 'input' || tag === 'select' || el.classList.contains('btn-ds') || el.classList.contains('ds-input') || el.classList.contains('badge') || el.classList.contains('ds-badge') || el.classList.contains('seg-btn') || el.classList.contains('tab-btn');
        if (isControl) {
          const h = parseFloat(cs.height) || rect.height;
          recordDimension(el, 'height', h, 'Height');
        }

        const pt = parseFloat(cs.paddingTop) || 0;
        const pb = parseFloat(cs.paddingBottom) || 0;
        const pl = parseFloat(cs.paddingLeft) || 0;
        const pr = parseFloat(cs.paddingRight) || 0;
        if (pt > 0) recordDimension(el, 'padding', pt, 'Padding-Top');
        if (pb > 0 && pb !== pt) recordDimension(el, 'padding', pb, 'Padding-Bottom');
        if (pl > 0) recordDimension(el, 'padding', pl, 'Padding-Left');
        if (pr > 0 && pr !== pl) recordDimension(el, 'padding', pr, 'Padding-Right');

        if (cs.display.includes('flex') || cs.display.includes('grid')) {
          const rg = parseFloat(cs.rowGap) || parseFloat(cs.gap) || 0;
          const cg = parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0;
          if (rg > 0) recordDimension(el, 'gap', rg, 'Row-Gap');
          if (cg > 0 && cg !== rg) recordDimension(el, 'gap', cg, 'Col-Gap');
        }
      });

      const compliantCount = results.on8pt + results.on4pt;
      results.compliancePct = results.totalChecked > 0 ? Math.round((compliantCount / results.totalChecked) * 100) : 100;
      results.eightPtPct = results.totalChecked > 0 ? Math.round((results.on8pt / results.totalChecked) * 100) : 100;

      results.dimensions = Array.from(dimFreq.entries())
        .map(([px, count]) => ({
          px,
          count,
          is8: px % 8 === 0,
          multiple: px % 8 === 0 ? `${px / 8}×8pt` : (px === 2 ? '0.5×4pt' : `${px / 4}×4pt`)
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      results.warnings = warningList;
      return results;
    }
    window.runLiveSpatialGridAudit = runLiveSpatialGridAudit;

    let activeAuditModalTab = 'contrast';
    window.switchAuditModalTab = function(tabName) {
      activeAuditModalTab = tabName === 'spatial-grid' ? 'spatial-grid' : 'contrast';
      const cTabContrast = document.getElementById('crmTabContrast');
      const cTabSpatial = document.getElementById('crmTabSpatial');
      if (cTabContrast) cTabContrast.classList.toggle('active', activeAuditModalTab === 'contrast');
      if (cTabSpatial) cTabSpatial.classList.toggle('active', activeAuditModalTab === 'spatial-grid');
      renderContrastReportModalBody();
    };

    function extractGradientAvgRgba(bgImg) {
      if (!bgImg || bgImg === 'none' || !bgImg.includes('gradient')) return null;
      const matches = bgImg.match(/rgba?\([^)]+\)|#[0-9a-f]{3,8}/gi);
      if (!matches || !matches.length) return null;
      let rSum = 0, gSum = 0, bSum = 0, aSum = 0, cnt = 0;
      for (const m of matches) {
        const parsed = parseCssRgba(m);
        if (parsed) {
          rSum += parsed.r; gSum += parsed.g; bSum += parsed.b; aSum += parsed.a; cnt++;
        }
      }
      if (!cnt) return null;
      return { r: Math.round(rSum / cnt), g: Math.round(gSum / cnt), b: Math.round(bSum / cnt), a: aSum / cnt };
    }

    function resolveElementEffectiveBg(el, fallbackBg) {
      const chain = [];
      let cur = el;
      while (cur && cur.nodeType === 1) {
        const cs = getComputedStyle(cur);
        const grad = extractGradientAvgRgba(cs.backgroundImage);
        if (grad && grad.a > 0.05) {
          chain.unshift(grad);
          if (grad.a >= 0.999) break;
        }
        const bg = parseCssRgba(cs.backgroundColor);
        if (bg && bg.a > 0.004) {
          chain.unshift(bg);
          if (bg.a >= 0.999) break;
        }
        cur = cur.parentElement;
      }
      let out = fallbackBg || { r: 248, g: 250, b: 252, a: 1 };
      for (const layer of chain) {
        out = blendOverRgb(layer, out);
      }
      return out;
    }

    let __lastContrastAudit = null;
    function runLiveContrastAudit() {
      const frame = document.getElementById('canvasFrame');
      const isDark = uiTheme === 'dark';
      const baseRgb = isDark ? { r: 9, g: 13, b: 22, a: 1 } : { r: 248, g: 250, b: 252, a: 1 };
      const results = {
        mode: isDark ? 'dark' : 'light',
        checked: 0,
        passAA: 0,
        passAAA: 0,
        failures: [],
        samples: []
      };
      if (!frame) return results;

      const seenFailures = new Set();
      const seenSamples = new Set();
      const walker = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const txt = (node.nodeValue || '').trim();
        if (!txt || txt.length > 160) continue;
        const el = node.parentElement;
        if (!el || el.closest('[style*="display: none"], [style*="display:none"], script, style, svg')) continue;
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) < 0.35) continue;
        // Skip intentionally disabled controls / decorative dimmed examples
        if (el.disabled || el.closest('[disabled], .is-disabled, [aria-disabled="true"], .color-swatch-cell')) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        const fgRaw = parseCssRgba(cs.color);
        if (!fgRaw || fgRaw.a < 0.35) continue;
        const bgRgb = resolveElementEffectiveBg(el, baseRgb);
        const fgRgb = blendOverRgb(fgRaw, bgRgb);
        const cr = computeWcagContrast(fgRgb, bgRgb);
        const apca = computeApcaContrast(fgRgb, bgRgb);

        const fontSize = parseFloat(cs.fontSize) || 13;
        const fontWeight = parseInt(cs.fontWeight, 10) || 400;
        const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
        const minAA = isLarge ? 3.0 : 4.5;
        const minAAA = isLarge ? 4.5 : 7.0;

        results.checked++;
        if (cr >= minAA) results.passAA++;
        if (cr >= minAAA) results.passAAA++;
        if (apca.lc >= 60) results.passApca = (results.passApca || 0) + 1;

        const fgHex = rgbToHexStr(fgRgb);
        const bgHex = rgbToHexStr(bgRgb);
        if (cr < minAA) {
          const key = `${fgHex}|${bgHex}|${txt.slice(0, 28)}`;
          if (!seenFailures.has(key) && results.failures.length < 30) {
            seenFailures.add(key);
            results.failures.push({
              text: txt.slice(0, 56),
              tag: el.tagName.toLowerCase(),
              cls: (typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean).slice(0, 2).join('.') : ''),
              fg: fgHex,
              bg: bgHex,
              ratio: cr,
              required: minAA,
              apca
            });
          }
        } else if (results.samples.length < 10) {
          const skey = `${fgHex}|${bgHex}`;
          if (!seenSamples.has(skey)) {
            seenSamples.add(skey);
            results.samples.push({
              text: txt.slice(0, 44),
              fg: fgHex,
              bg: bgHex,
              ratio: cr,
              required: minAA,
              isAAA: cr >= minAAA,
              apca
            });
          }
        }
      }
      __lastContrastAudit = results;
      return results;
    }

    function buildPaletteTokenContrastRows() {
      const appliedTab = typeof getAppliedColorTab === 'function' ? getAppliedColorTab() : null;
      const groups = appliedTab && Array.isArray(appliedTab.groups) ? appliedTab.groups : (typeof colorGroups !== 'undefined' ? colorGroups : []);
      const isDark = uiTheme === 'dark';
      const lightSurf = { r: 255, g: 255, b: 255, a: 1 };
      const darkSurf = appliedTab && appliedTab.kind === 'enterprise'
        ? (parseCssRgba((groups.find(g => g.id === 'grey')?.rows.find(r => r.scale === '50')?.dark)) || { r: 15, g: 23, b: 42, a: 1 })
        : { r: 15, g: 20, b: 31, a: 1 };
      const whiteRgb = { r: 255, g: 255, b: 255, a: 1 };

      const findRow = (gid, scale) => {
        const g = groups.find(x => x.id === gid);
        return g ? g.rows.find(r => r.scale === scale) : null;
      };
      const inspectRow = (label, gid, scale, checkMode) => {
        const row = findRow(gid, scale);
        if (!row) return null;
        const valStr = isDark ? row.dark : row.light;
        const raw = parseCssRgba(valStr);
        if (!raw) return null;
        let fg, bg;
        if (checkMode === 'cta') {
          const rootStyles = getComputedStyle(document.documentElement);
          const solidVal = parseCssRgba(rootStyles.getPropertyValue('--brand-primary').trim()) || raw;
          fg = whiteRgb;
          bg = blendOverRgb(solidVal, isDark ? darkSurf : lightSurf);
        } else {
          bg = isDark ? darkSurf : lightSurf;
          fg = blendOverRgb(raw, bg);
        }
        const ratio = computeWcagContrast(fg, bg);
        const apca = computeApcaContrast(fg, bg);
        return {
          label,
          token: `--ds-${gid}-${scale}`,
          fg: rgbToHexStr(fg),
          bg: rgbToHexStr(bg),
          ratio,
          passAA: ratio >= 4.5,
          passAAA: ratio >= 7.0,
          apca
        };
      };

      return [
        inspectRow(t('Chữ chính (Grey 1000)', 'Primary Text (Grey 1000)'), 'grey', '1000', 'text'),
        inspectRow(t('Chữ phụ (Grey 700)', 'Secondary Text (Grey 700)'), 'grey', '700', 'text'),
        inspectRow(t('Link / Text Thương hiệu (Brand 1000)', 'Brand Text / Link (Brand 1000)'), 'brand', '1000', 'text'),
        inspectRow(t('Nút CTA chữ trắng (Primary CTA)', 'Primary CTA Button (White Text)'), 'brand', '1000', 'cta'),
        inspectRow(t('Trạng thái Thành công (Green 1000)', 'Success Status (Green 1000)'), 'green', '1000', 'text'),
        inspectRow(t('Trạng thái Cảnh báo (Amber 1000)', 'Warning Status (Amber 1000)'), 'amber', '1000', 'text'),
        inspectRow(t('Trạng thái Lỗi (Red 1000)', 'Danger / Error (Red 1000)'), 'red', '1000', 'text'),
        inspectRow(t('Thông tin hỗ trợ (Teal 1000)', 'Info Status (Teal 1000)'), 'teal', '1000', 'text')
      ].filter(Boolean);
    }

    function updateCanvasContrastBadge() {
      const pill = document.getElementById('wcagAuditPill');
      if (!pill) return;
      const audit = runLiveContrastAudit();
      const failCount = audit.failures.length;
      const passRate = audit.checked > 0 ? Math.round((audit.passAA / audit.checked) * 100) : 100;
      const modeTag = uiTheme === 'dark' ? 'Dark' : 'Light';
      pill.classList.remove('has-warn', 'has-fail');
      if (failCount === 0) {
        pill.textContent = `✓ WCAG AA (${modeTag}) · ${passRate}%`;
      } else {
        pill.classList.add(failCount > 3 ? 'has-fail' : 'has-warn');
        pill.textContent = `⚠ ${failCount} WCAG (${modeTag})`;
      }
      pill.title = t(
        `Kiểm tra tương phản WCAG 2.1 & APCA ở chế độ ${modeTag}: đạt ${audit.passAA}/${audit.checked} phần tử chữ. Click xem chi tiết.`,
        `WCAG 2.1 & APCA contrast check in ${modeTag} mode: ${audit.passAA}/${audit.checked} text elements pass. Click for details.`
      );
      if (document.getElementById('contrastReportModal')?.classList.contains('open')) {
        renderContrastReportModalBody();
      }
    }

    function renderContrastReportModalBody() {
      const modal = document.getElementById('contrastReportModal');
      if (!modal) return;
      const isDark = uiTheme === 'dark';

      const titleEl = document.getElementById('crmTitle');
      const subEl = document.getElementById('crmSubtitle');
      const toggleBtn = document.getElementById('crmToggleThemeBtn');
      const cTabContrast = document.getElementById('crmTabContrast');
      const cTabSpatial = document.getElementById('crmTabSpatial');
      const cTabContrastLabel = document.getElementById('crmTabContrastLabel');
      const cTabSpatialLabel = document.getElementById('crmTabSpatialLabel');

      if (cTabContrast) cTabContrast.classList.toggle('active', activeAuditModalTab === 'contrast');
      if (cTabSpatial) cTabSpatial.classList.toggle('active', activeAuditModalTab === 'spatial-grid');
      if (cTabContrastLabel) cTabContrastLabel.textContent = t('1. Tương phản (WCAG 2.1 & APCA Lᶜ)', '1. Contrast (WCAG 2.1 & APCA Lᶜ)');
      if (cTabSpatialLabel) cTabSpatialLabel.textContent = t('2. Chuẩn Lưới Không Gian (8pt / 4pt Grid)', '2. Spatial Grid Audit (8pt / 4pt Grid)');

      const crmLightPill = document.getElementById('crmThemePillLight');
      const crmDarkPill = document.getElementById('crmThemePillDark');
      if (crmLightPill && crmDarkPill) {
        crmLightPill.classList.toggle('active', !isDark);
        crmDarkPill.classList.toggle('active', isDark);
      }
      if (toggleBtn) {
        toggleBtn.title = isDark
          ? t('Chuyển sang Sáng để so sánh (Đang bật: Tối)', 'Switch to Light mode to compare (Active: Dark)')
          : t('Chuyển sang Tối để so sánh (Đang bật: Sáng)', 'Switch to Dark mode to compare (Active: Light)');
      }

      const body = document.getElementById('crmBody');
      if (!body) return;

      if (activeAuditModalTab === 'spatial-grid') {
        if (titleEl) titleEl.textContent = t('Kiểm toán Nhịp Lưới Không Gian (8pt / 4pt Grid)', '8pt / 4pt Spatial Grid System Audit');
        if (subEl) subEl.textContent = t(
          'Quét kích thước chiều cao (height), khoảng đệm (padding) và khoảng cách (gap) của các khối giao diện trên Canvas.',
          'Live automated audit of heights, paddings, and flex/grid gaps on canvas against 8pt/4pt rhythm.'
        );

        const gridAudit = runLiveSpatialGridAudit();
        const fourPtPct = gridAudit.totalChecked > 0 ? Math.round((gridAudit.on4pt / gridAudit.totalChecked) * 100) : 0;

        body.innerHTML = `
          <div class="contrast-summary-grid">
            <div class="contrast-kpi-box">
              <div class="contrast-kpi-val" style="color:var(--code-green);">${gridAudit.compliancePct}%</div>
              <div class="contrast-kpi-lbl">${t('Tỷ lệ đạt chuẩn 4pt/8pt', 'Grid Compliance Rate')}</div>
            </div>
            <div class="contrast-kpi-box">
              <div class="contrast-kpi-val">${gridAudit.on8pt}/${gridAudit.totalChecked}</div>
              <div class="contrast-kpi-lbl">${t(`Chuẩn 8pt (${gridAudit.eightPtPct}%)`, `8pt Core (${gridAudit.eightPtPct}%)`)}</div>
            </div>
            <div class="contrast-kpi-box">
              <div class="contrast-kpi-val">${gridAudit.on4pt} (${fourPtPct}%)</div>
              <div class="contrast-kpi-lbl">${t('Bước nhảy phụ 4pt', '4pt Micro-step')}</div>
            </div>
            <div class="contrast-kpi-box">
              <div class="contrast-kpi-val" style="color:${gridAudit.offGrid > 0 ? '#f59e0b' : 'var(--code-green)'};">${gridAudit.offGrid}</div>
              <div class="contrast-kpi-lbl">${t('Cảnh báo lệch lưới', 'Off-grid Warnings')}</div>
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
              ${t('1. Thang đo nhịp chuẩn 8pt / 4pt tham chiếu', '1. 8pt / 4pt Standard Rhythm Reference Scale')}
            </div>
            <div style="display:flex; flex-wrap:wrap; gap:8px; padding:12px 12px; background:var(--bg-subtle); border-radius:8px; border:1px solid var(--border-default);">
              <span class="grid-rhythm-badge on-4">4px (0.5×8 · Micro)</span>
              <span class="grid-rhythm-badge on-8">8px (1×8 · Base)</span>
              <span class="grid-rhythm-badge on-4">12px (1.5×8 · Input)</span>
              <span class="grid-rhythm-badge on-8">16px (2×8 · Standard)</span>
              <span class="grid-rhythm-badge on-4">20px (2.5×8 · Medium)</span>
              <span class="grid-rhythm-badge on-8">24px (3×8 · Section)</span>
              <span class="grid-rhythm-badge on-8">32px (4×8 · Container)</span>
              <span class="grid-rhythm-badge on-4">36px (4.5×8 · Control M)</span>
              <span class="grid-rhythm-badge on-8">40px (5×8 · Control L)</span>
              <span class="grid-rhythm-badge on-8">48px (6×8 · Header)</span>
              <span class="grid-rhythm-badge on-8">64px (8×8 · Hero)</span>
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
              ${t('2. Phân bố kích thước chuẩn trên trang hiện tại', '2. Compliant Dimension Distribution on Canvas')}
            </div>
            <div class="contrast-list-box">
              ${gridAudit.dimensions.map(d => `
                <div class="contrast-item-row">
                  <div style="font-weight:600; color:var(--text-primary); font-family:var(--font-mono); min-width:48px;">${d.px}px</div>
                  <div style="font-size:11.5px; color:var(--text-muted); min-width:60px;">${d.multiple}</div>
                  <div style="font-size:11.5px; color:var(--text-muted); flex:1;">${t(`Sử dụng ${d.count} lần`, `Used ${d.count} times`)}</div>
                  <span class="grid-rhythm-badge ${d.is8 ? 'on-8' : 'on-4'}">
                    ${d.is8 ? t('✓ Đạt chuẩn 8pt', '✓ 8pt Grid Core') : t('✓ Đạt bước phụ 4pt', '✓ 4pt Half-step')}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <div>
            <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
              ${gridAudit.warnings.length > 0
                ? t(`3. Các điểm lệch lưới & gợi ý chuẩn hóa (${gridAudit.warnings.length})`, `3. Off-Grid Items & Suggested Fixes (${gridAudit.warnings.length})`)
                : t('3. Điểm cần lưu ý về nhịp lưới không gian', '3. Spatial Rhythm Optimization Status')}
            </div>
            <div class="contrast-list-box">
              ${gridAudit.warnings.length > 0 ? gridAudit.warnings.map(w => `
                <div class="contrast-item-row">
                  <div style="min-width:0; flex:1;">
                    <div style="font-weight:600; color:var(--text-primary); font-family:var(--font-mono); font-size:11.5px;">&lt;${escapeHTML(w.element)}&gt;</div>
                    <div style="font-size:11px; color:var(--text-muted);">${escapeHTML(w.prop)} ${w.text ? `· "${escapeHTML(w.text)}"` : ''}</div>
                  </div>
                  <div style="display:flex; align-items:center; gap:8px; margin:0 8px;">
                    <span style="font-family:var(--font-mono); font-size:11.5px; color:#ef4444; text-decoration:line-through;">${w.value}px</span>
                    <span style="font-size:11px; color:var(--text-muted);">→</span>
                    <span style="font-family:var(--font-mono); font-size:11.5px; font-weight:700; color:var(--code-green);">${w.nearest}px (${w.diffStr})</span>
                  </div>
                  <span class="grid-rhythm-badge off-grid">
                    ${t('Lệch lưới', 'Off-grid')}
                  </span>
                </div>
              `).join('') : `<div style="padding:12px; color:var(--text-muted); font-size:12px;">${t('Tuyệt vời! Không có kích thước nào bị lệch khỏi nhịp 4pt/8pt.', 'Perfect! No off-grid dimensions found on this canvas.')}</div>`}
            </div>
          </div>
        `;
        return;
      }

      // Default: Tab 1 - Contrast (WCAG 2.1 & APCA Lc)
      if (titleEl) titleEl.textContent = t('Kiểm tra Độ Tương Phản Hiển Thị (WCAG 2.1 & APCA Lᶜ)', 'WCAG 2.1 & APCA Lᶜ Display Contrast Audit');
      if (subEl) subEl.textContent = t(
        `Đang kiểm tra chế độ ${isDark ? 'Tối (Dark)' : 'Sáng (Light)'} trên trang hiện tại & bộ màu đang áp dụng. Đánh giá song song WCAG 2.1 và thuật toán cảm nhận APCA Lᶜ (WCAG 3.0).`,
        `Inspecting ${isDark ? 'Dark' : 'Light'} mode across the active canvas & applied palette. Dual evaluation under WCAG 2.1 and APCA Lᶜ perceptual algorithm (WCAG 3.0 draft).`
      );

      const audit = runLiveContrastAudit();
      const tokenRows = buildPaletteTokenContrastRows();
      const passRate = audit.checked > 0 ? ((audit.passAA / audit.checked) * 100).toFixed(0) : '100';
      const apcaRate = audit.checked > 0 ? (((audit.passApca || 0) / audit.checked) * 100).toFixed(0) : '100';

      body.innerHTML = `
        <div class="contrast-summary-grid">
          <div class="contrast-kpi-box">
            <div class="contrast-kpi-val">${isDark ? '☾ Dark' : '☀ Light'}</div>
            <div class="contrast-kpi-lbl">${t('Chế độ đang kiểm tra', 'Active Mode')}</div>
          </div>
          <div class="contrast-kpi-box">
            <div class="contrast-kpi-val" style="color:var(--code-green);">${passRate}%</div>
            <div class="contrast-kpi-lbl">${t('Tỷ lệ đạt WCAG AA', 'WCAG AA Pass Rate')}</div>
          </div>
          <div class="contrast-kpi-box">
            <div class="contrast-kpi-val" style="color:#8b5cf6;">${apcaRate}%</div>
            <div class="contrast-kpi-lbl">${t('Tỷ lệ APCA Lᶜ 60+', 'APCA Lᶜ 60+ Pass Rate')}</div>
          </div>
          <div class="contrast-kpi-box">
            <div class="contrast-kpi-val" style="color:${audit.failures.length ? '#dc2626' : 'var(--code-green)'};">${audit.failures.length}</div>
            <div class="contrast-kpi-lbl">${t('Cảnh báo tương phản', 'Contrast Warnings')}</div>
          </div>
        </div>

        <div>
          <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
            ${t('1. Kiểm tra Token Màu chủ đạo (WCAG 2.1 & APCA Lᶜ)', '1. Core Palette Token Contrast (WCAG 2.1 & APCA Lᶜ)')}
          </div>
          <div class="contrast-list-box">
            ${tokenRows.map(r => `
              <div class="contrast-item-row">
                <div style="min-width:0;">
                  <div style="font-weight:600; color:var(--text-primary);">${escapeHTML(r.label)}</div>
                  <div style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono);">${escapeHTML(r.token)}</div>
                </div>
                <div class="contrast-chip-pair">
                  <span class="contrast-dot" style="background:${r.fg};"></span>
                  <span>${r.fg}</span>
                  <span>/</span>
                  <span class="contrast-dot" style="background:${r.bg};"></span>
                  <span>${r.bg}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="ds-badge ${r.passAAA ? 'ds-badge-green' : (r.passAA ? 'ds-badge-blue' : 'ds-badge-red')}">
                    ${r.ratio.toFixed(2)}:1 · ${r.passAAA ? 'AAA' : (r.passAA ? 'AA' : 'Fail')}
                  </span>
                  ${r.apca ? `<span class="badge-apca" title="APCA Perceptual Contrast Score (WCAG 3.0 Silver)">Lᶜ ${r.apca.lc} · ${r.apca.rating}</span>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div>
          <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
            ${audit.failures.length > 0
              ? t(`2. Các điểm dưới ngưỡng AA trên trang (${audit.failures.length})`, `2. Low-Contrast Items on Current Page (${audit.failures.length})`)
              : t('2. Mẫu tương phản đạt chuẩn trên trang hiện tại', '2. Verified Passing Contrast Samples on Current Page')}
          </div>
          <div class="contrast-list-box">
            ${(audit.failures.length > 0 ? audit.failures : audit.samples).map(item => `
              <div class="contrast-item-row">
                <div style="min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; flex:1;">
                  <span style="font-weight:600; color:var(--text-primary);">"${escapeHTML(item.text)}"</span>
                  ${item.tag ? `<span style="font-size:10.5px; color:var(--text-muted); margin-left:4px;">&lt;${escapeHTML(item.tag)}&gt;</span>` : ''}
                </div>
                <div class="contrast-chip-pair">
                  <span class="contrast-dot" style="background:${item.fg};"></span>
                  <span>${item.fg}</span>
                  <span>/</span>
                  <span class="contrast-dot" style="background:${item.bg};"></span>
                  <span>${item.bg}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <span class="ds-badge ${item.ratio >= item.required ? 'ds-badge-green' : 'ds-badge-red'}">
                    ${item.ratio.toFixed(2)}:1 / ${item.required.toFixed(1)}:1
                  </span>
                  ${item.apca ? `<span class="badge-apca" title="APCA Perceptual Contrast Score (WCAG 3.0 Silver)">Lᶜ ${item.apca.lc} · ${item.apca.rating}</span>` : ''}
                </div>
              </div>
            `).join('') || `<div style="padding:12px; color:var(--text-muted); font-size:12px;">${t('Không phát hiện lỗi tương phản.', 'No contrast issues detected.')}</div>`}
          </div>
        </div>
      `;
    }

    window.openContrastReportModal = function() {
      renderContrastReportModalBody();
      const modal = document.getElementById('contrastReportModal');
      if (modal) modal.classList.add('open');
    };

    window.closeContrastReportModal = function() {
      const modal = document.getElementById('contrastReportModal');
      if (modal) modal.classList.remove('open');
    };

    window.toggleUIThemeFromModal = function() {
      toggleUITheme();
      renderContrastReportModalBody();
    };

    function applyUIThemeToChrome() {
      const isDark = uiTheme === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
      const lightPill = document.getElementById('themePillLight');
      const darkPill = document.getElementById('themePillDark');
      const switchBtn = document.getElementById('themeSwitchBtn');
      if (lightPill && darkPill) {
        lightPill.classList.toggle('active', !isDark);
        darkPill.classList.toggle('active', isDark);
      }
      const crmLightPill = document.getElementById('crmThemePillLight');
      const crmDarkPill = document.getElementById('crmThemePillDark');
      if (crmLightPill && crmDarkPill) {
        crmLightPill.classList.toggle('active', !isDark);
        crmDarkPill.classList.toggle('active', isDark);
      }
      if (switchBtn) {
        switchBtn.title = t(
          `Chuyển chế độ Sáng / Tối để kiểm tra độ tương phản hiển thị (Đang bật: ${isDark ? 'Tối' : 'Sáng'})`,
          `Switch Light / Dark mode to check display contrast (Active: ${isDark ? 'Dark' : 'Light'})`
        );
      }
    }

    function setUITheme(mode, silentToast = false) {
      uiTheme = mode === 'dark' ? 'dark' : 'light';
      try { localStorage.setItem(UI_THEME_STORAGE_KEY, uiTheme); } catch (e) {}
      document.documentElement.classList.add('theme-switching');
      applyUIThemeToChrome();
      if (typeof syncBrandTokensToCSS === 'function') syncBrandTokensToCSS();
      if (typeof syncLogosToAppChrome === 'function') syncLogosToAppChrome();
      if (typeof renderCanvas === 'function' && document.getElementById('canvasFrame')?.children.length) renderCanvas();
      void document.documentElement.offsetHeight;
      updateCanvasContrastBadge();
      requestAnimationFrame(() => {
        document.documentElement.classList.remove('theme-switching');
        updateCanvasContrastBadge();
        if (!silentToast && typeof showToast === 'function') {
          const audit = __lastContrastAudit || runLiveContrastAudit();
          const failCount = audit.failures.length;
          const modeLabel = uiTheme === 'dark' ? t('Chế độ Tối (Dark)', 'Dark Mode') : t('Chế độ Sáng (Light)', 'Light Mode');
          showToast(
            failCount === 0
              ? t(`${modeLabel}: Đạt chuẩn tương phản WCAG AA (${audit.passAA}/${audit.checked})`, `${modeLabel}: Passes WCAG AA contrast (${audit.passAA}/${audit.checked})`)
              : t(`${modeLabel}: Phát hiện ${failCount} điểm cần tăng tương phản`, `${modeLabel}: ${failCount} low-contrast items detected`)
          );
        }
      });
    }

    window.toggleUITheme = function() {
      setUITheme(uiTheme === 'dark' ? 'light' : 'dark');
    };

    // (function t is centralized in js/i18n.js)

    function getIconDisplayName(ic) {
      if (!ic) return '';
      if (uiLang === 'en' && ic.slug) {
        return ic.slug.split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ');
      }
      return ic.vi || ic.slug || '';
    }

    let __cachedViToEnMap = null;
    function getViToEnMap() {
      if (__cachedViToEnMap) return __cachedViToEnMap;
      const map = Object.assign({}, (typeof window !== 'undefined' && window.DS_I18N_VI_EN) ? window.DS_I18N_VI_EN : {});
      if (typeof iconsCatalog !== 'undefined' && Array.isArray(iconsCatalog)) {
        iconsCatalog.forEach(ic => {
          if (ic.vi && ic.slug && !map[ic.vi]) {
            map[ic.vi] = ic.slug.split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ');
          }
        });
      }
      __cachedViToEnMap = map;
      return map;
    }

    function fallbackCopyText(text, msg) {
      try {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      } catch (e) {}
      showToast(msg);
    }

    function translateTextValue(raw) {
      if (uiLang !== 'en' || !raw || typeof raw !== 'string') return raw;
      const leadMatch = raw.match(/^(\s*)/);
      const trailMatch = raw.match(/(\s*)$/);
      const lead = leadMatch ? leadMatch[1] : '';
      const trail = trailMatch ? trailMatch[1] : '';
      const core = raw.trim();
      if (!core) return raw;

      const norm = core.replace(/\s+/g, ' ');
      const map = getViToEnMap();
      if (Object.prototype.hasOwnProperty.call(map, core)) return lead + map[core] + trail;
      if (Object.prototype.hasOwnProperty.call(map, norm)) return lead + map[norm] + trail;

      let out = norm;
      // 1. Dynamic Color Tabs & Breadcrumbs
      if (/^NỀN TẢNG\s*•\s*(.+)$/i.test(out)) {
        out = out.replace(/^NỀN TẢNG\s*•\s*/i, '')
          .replace(/(?:TAB 1:\s*)?DE STUDIO GỐC/i, 'DE STUDIO DEFAULT')
          .replace(/TAB 2:\s*ENTERPRISE SAAS/i, 'ENTERPRISE SAAS');
        return lead + out + trail;
      }
      if (/^THÀNH PHẦN CƠ SỞ\s*•\s*(.+)$/i.test(out)) {
        return lead + out.replace(/^THÀNH PHẦN CƠ SỞ\s*•\s*/i, '') + trail;
      }
      if (/^THÀNH PHẦN ỨNG DỤNG\s*•\s*(.+)$/i.test(out)) {
        return lead + out.replace(/^THÀNH PHẦN ỨNG DỤNG\s*•\s*/i, '') + trail;
      }
      if (/^MẪU TRANG DEMO\s*•\s*(.+)$/i.test(out)) {
        return lead + out.replace(/^MẪU TRANG DEMO\s*•\s*/i, 'DEMO PAGE • ') + trail;
      }
      if (/^\+\s*Thêm Tab Màu\s*\(([^)]+)\)$/i.test(out)) {
        return lead + out.replace(/^\+\s*Thêm Tab Màu\s*\(([^)]+)\)$/i, '+ Add Color Tab ($1)') + trail;
      }
      if (/^(?:Tab 1:\s*)?De Studio Gốc$/i.test(out)) return lead + 'De Studio Default' + trail;
      if (/^Tab 2:\s*Enterprise SaaS$/i.test(out)) return lead + 'Enterprise SaaS' + trail;
      if (/^Màu trong suốt\s*\(Transparent Colors\s*•\s*([^)]+)\)\s*Click trực tiếp vào từng ô màu bên dưới để tinh chỉnh HEX \/ RGBA \/ độ trong suốt\.$/i.test(out)) {
        return lead + out.replace(/^Màu trong suốt\s*\(Transparent Colors\s*•\s*([^)]+)\)\s*Click trực tiếp vào từng ô màu bên dưới để tinh chỉnh HEX \/ RGBA \/ độ trong suốt\.$/i, 'Transparent Colors ($1) — Click any color swatch below to fine-tune HEX / RGBA / opacity.') + trail;
      }

      // 2. Dynamic Swatch / Token / Blueprint Patterns
      let m;
      if ((m = out.match(/^Click để đổi mã màu\s+(.+)$/i))) return lead + `Click to edit color token ${m[1]}` + trail;
      if ((m = out.match(/^Click để copy CSS của\s+(.+)$/i))) return lead + `Click to copy CSS for ${m[1]}` + trail;
      if ((m = out.match(/^Click chỉnh thông số\s+(.+)$/i))) return lead + `Click to edit ${m[1]} parameters` + trail;
      if ((m = out.match(/^Click để chỉnh thông số\s+(.+)$/i))) return lead + `Click to edit ${m[1]} parameters` + trail;
      if ((m = out.match(/^Khung trang chuẩn bị xây dựng chi tiết\s*—\s*(.+)$/i))) return lead + `Blueprint Frame Ready — ${m[1]}` + trail;
      if ((m = out.match(/^Trang con\s+"([^"]+)"\s+đã sẵn sàng trên Menu trái$/i))) return lead + `Subpage "${m[1]}" is ready in the left navigation` + trail;
      if ((m = out.match(/^(.*?)\.\s*Bạn có thể yêu cầu AI bên phải dựng nhanh bản nháp UI bằng lệnh$/i))) {
        const descEn = map[m[1] + '.'] || map[m[1]] || m[1];
        return lead + `${descEn.replace(/\.$/, '')}. Ask the AI panel on the right to draft a quick UI using` + trail;
      }
      if (out === 'hoặc chúng ta sẽ xây dựng chi tiết từng trạng thái & biến thể của trang này ở bước tiếp theo.') {
        return lead + 'or we can build out each detailed variant and state next.' + trail;
      }
      if ((m = out.match(/^✨\s*Nhờ AI dựng mẫu\s+(.+)$/i))) return lead + `✨ Ask AI to draft ${m[1]}` + trail;
      if ((m = out.match(/^Foundations đang liên kết\s*—\s*(.+)$/i))) return lead + `Linked Foundations — ${m[1]}` + trail;
      if ((m = out.match(/^HTML Chuẩn\s*—\s*(.+)$/i))) return lead + `Standard HTML — ${m[1]}` + trail;
      if ((m = out.match(/^Danh sách Token Màu\s*—\s*(.+)$/i))) return lead + `Color Token List — ${m[1].replace(/(?:Tab 1:\s*)?De Studio Gốc/i, 'De Studio Default').replace(/Tab 2:\s*Enterprise SaaS/i, 'Enterprise SaaS')}` + trail;
      if ((m = out.match(/^Danh sách Token Kiểu chữ đang áp dụng\s*\(([^)]+)\)$/i))) return lead + `Active Typography Tokens (${m[1]})` + trail;
      if ((m = out.match(/^✨ AI UI OUTPUT\s*•\s*(.+)$/i))) return lead + `✨ AI UI OUTPUT • ${m[1].replace(/(?:Tab 1:\s*)?De Studio Gốc/i, 'De Studio Default').replace(/Tab 2:\s*Enterprise SaaS/i, 'Enterprise SaaS')}` + trail;

      // 3. Dynamic Live Playground / Counters / Typography
      if ((m = out.match(/^Cỡ chữ:\s*([^|]+)\|\s*Chiều cao dòng:\s*([^|]+)(?:\|\s*Giãn chữ:\s*(.+))?$/i))) {
        return lead + `Size: ${m[1].trim()} | Line height: ${m[2].trim()}${m[3] ? ' | Tracking: ' + m[3].trim() : ''}` + trail;
      }
      if ((m = out.match(/^Đang hiển thị:\s*(.+)$/i))) return lead + `Showing: ${m[1]}` + trail;
      if ((m = out.match(/^Thử nghiệm nhanh:\s*(.+)$/i))) return lead + `Quick test: ${m[1]}` + trail;
      if ((m = out.match(/^LIVE PREVIEW THEO THANH TRƯỢT\s*\(([^)]+)\)$/i))) return lead + `SLIDER LIVE PREVIEW (${m[1]})` + trail;
      if ((m = out.match(/^Hiển thị:\s*(.+?)\s*mục$/i))) return lead + `Showing: ${m[1]} items` + trail;
      if ((m = out.match(/^Hiển thị mục\s*(.+)$/i))) return lead + `Showing items ${m[1]}` + trail;
      if ((m = out.match(/^Tổng\s+(\d+)\s+mục$/i))) return lead + `${m[1]} total items` + trail;
      if ((m = out.match(/^Đã chọn:\s*(.+)$/i))) return lead + `Selected: ${m[1]}` + trail;
      if ((m = out.match(/^Đã chọn\s*\(([^)]+)\)$/i))) return lead + `Selected (${m[1]})` + trail;
      if ((m = out.match(/^Đang bật:\s*(.+)$/i))) return lead + `Enabled: ${m[1]}` + trail;
      if ((m = out.match(/^Chọn nhiều\s*\((\d+)\s*mục\)$/i))) return lead + `Multi-Select (${m[1]} items)` + trail;
      if ((m = out.match(/^(\d+)\s*mục đã chọn$/i))) return lead + `${m[1]} items selected` + trail;
      if ((m = out.match(/^Khung 24×24px\s*•\s*(\d+)\s*biến thể$/i))) return lead + `24×24px Frame • ${m[1]} variants` + trail;
      if ((m = out.match(/^Tỷ lệ:\s*(.+)$/i))) return lead + `Ratio: ${m[1]}` + trail;
      if ((m = out.match(/^Tối thiểu rộng\s*(.+?)\s*\/\s*cao\s*(.+)$/i))) return lead + `Minimum width ${m[1]} / height ${m[2]}` + trail;
      if ((m = out.match(/^Tối thiểu\s+(.+)$/i))) return lead + `Minimum ${m[1]}` + trail;
      if ((m = out.match(/^Component:\s*([^•]+)\s*•\s*File gốc:\s*(.+)$/i))) return lead + `Component: ${m[1].trim()} • Source file: ${m[2].trim()}` + trail;
      if ((m = out.match(/^Offline Composer\s*\((\d+)\s*bước\)$/i))) return lead + `Offline Composer (${m[1]} steps)` + trail;
      if ((m = out.match(/^▶\s*Xem trước toàn bộ file\s*(.+?)\s*sẵn sàng mở trình duyệt$/i))) return lead + `▶ Preview complete ${m[1]} standalone file` + trail;
      if ((m = out.match(/^([\d,]+)\s*ký tự\s*•\s*Nhúng sẵn CSS Tokens\s*&\s*JS tương tác$/i))) return lead + `${m[1]} chars • Embedded CSS Tokens & Interactive JS` + trail;
      if (out === 'Câu lệnh thực thi:') return lead + 'Executed prompt:' + trail;
      if (out === 'Mở AI UI Output') return lead + 'Open AI UI Output' + trail;
      if (/^⬇\s*Tải(?:\s+file)?\s*\.html$/i.test(out)) return lead + '⬇ Download .html' + trail;
      if (out === 'Copy toàn bộ mã HTML') return lead + 'Copy Full HTML Code' + trail;
      if ((m = out.match(/^Trang mới\s+"([^"]+)"\s+thuộc nhóm\s+(.+)\.$/i))) return lead + `New page "${m[1]}" in ${m[2]}.` + trail;
      if ((m = out.match(/^Đã thêm trang\s+"([^"]+)"$/i))) return lead + `Added page "${m[1]}"` + trail;
      if ((m = out.match(/^Đã tải file demo:\s*(.+)$/i))) return lead + `Downloaded demo file: ${m[1]}` + trail;
      if ((m = out.match(/^Đã sao chép\s+(.+)$/i))) return lead + `Copied ${m[1]}` + trail;
      if ((m = out.match(/^Đã copy\s+(.+)$/i))) return lead + `Copied ${m[1]}` + trail;
      if ((m = out.match(/^Đã khôi phục\s+(.+)$/i))) return lead + `Restored ${m[1]}` + trail;
      if ((m = out.match(/^Đã lưu\s+(.+)$/i))) return lead + `Saved ${m[1]}` + trail;
      if ((m = out.match(/^Đã áp dụng\s+(.+)$/i))) return lead + `Applied ${m[1]}` + trail;
      if ((m = out.match(/^.+?\s*\(([a-z0-9-]+)\)\s*—\s*Click xem chi tiết & biến thể$/i))) {
        const enName = m[1].split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : '').join(' ');
        return lead + `${enName} (${m[1]}) — Click to inspect details & variants` + trail;
      }
      if ((m = out.match(/^Tải về file\s+(.+)$/i))) return lead + `Download ${m[1]}` + trail;
      if (out === 'Không tìm thấy trang phù hợp.') return lead + 'No matching pages found.' + trail;

      return raw;
    }

    let __isApplyingI18n = false;
    function translateDOMSubtree(root, preserveOriginals = false) {
      if (!root) return;
      const wasApplying = __isApplyingI18n;
      __isApplyingI18n = true;
      try {
        const attrs = ['title', 'placeholder', 'aria-label'];
        const allEls = [root, ...root.querySelectorAll('*')];
        allEls.forEach(el => {
          if (!el || el.nodeType !== 1) return;
          if (el.closest('pre, script, style, .lang-switch-btn, [data-i18n-skip]')) return;
          if (preserveOriginals && !el.__dsOrigAttrs) {
            el.__dsOrigAttrs = {};
            attrs.forEach(a => {
              if (el.hasAttribute(a)) el.__dsOrigAttrs[a] = el.getAttribute(a);
            });
          }
          attrs.forEach(a => {
            if (!el.hasAttribute(a)) return;
            const orig = (el.__dsOrigAttrs && Object.prototype.hasOwnProperty.call(el.__dsOrigAttrs, a))
              ? el.__dsOrigAttrs[a]
              : el.getAttribute(a);
            if (uiLang === 'en') {
              const tr = translateTextValue(orig);
              if (tr !== el.getAttribute(a)) el.setAttribute(a, tr);
            } else if (preserveOriginals && el.__dsOrigAttrs && Object.prototype.hasOwnProperty.call(el.__dsOrigAttrs, a)) {
              if (el.__dsOrigAttrs[a] !== el.getAttribute(a)) el.setAttribute(a, el.__dsOrigAttrs[a]);
            }
          });
        });

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const p = node.parentElement;
            if (!p) return NodeFilter.FILTER_REJECT;
            if (p.closest('script, style, pre, textarea, .lang-switch-btn, [data-i18n-skip]')) return NodeFilter.FILTER_REJECT;
            if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          }
        });
        const textNodes = [];
        let cur;
        while ((cur = walker.nextNode())) textNodes.push(cur);

        textNodes.forEach(node => {
          if (preserveOriginals && node.__dsOrigText === undefined) {
            node.__dsOrigText = node.nodeValue;
          }
          const orig = node.__dsOrigText !== undefined ? node.__dsOrigText : node.nodeValue;
          if (uiLang === 'en') {
            const tr = translateTextValue(orig);
            if (tr !== node.nodeValue) node.nodeValue = tr;
          } else if (preserveOriginals && node.__dsOrigText !== undefined) {
            if (node.nodeValue !== node.__dsOrigText) node.nodeValue = node.__dsOrigText;
          }
        });
      } finally {
        __isApplyingI18n = wasApplying;
      }
    }

    function applyUILanguageToChrome() {
      document.documentElement.setAttribute('lang', uiLang);
      document.title = uiLang === 'en'
        ? 'De Studio 1.0 — Design System & Offline UI Spec'
        : 'De Studio 1.0 — Design System & Offline UI Spec';

      const pillEn = document.getElementById('langPillEn');
      const pillVi = document.getElementById('langPillVi');
      const switchBtn = document.getElementById('langSwitchBtn');
      if (pillEn && pillVi) {
        pillEn.classList.toggle('active', uiLang === 'en');
        pillVi.classList.toggle('active', uiLang === 'vi');
      }
      if (switchBtn) {
        switchBtn.title = uiLang === 'en'
          ? 'Switch language to Tiếng Việt'
          : 'Chuyển ngôn ngữ sang English';
      }

      [
        document.querySelector('.topbar'),
        document.querySelector('.sidebar-header'),
        document.getElementById('sidebarSearchBox'),
        document.querySelector('.sidebar-footer'),
        document.querySelector('.canvas-toolbar'),
        document.querySelector('.ai-panel'),
        document.getElementById('toast'),
        ...document.querySelectorAll('.modal-backdrop')
      ].forEach(el => {
        if (el) translateDOMSubtree(el, true);
      });
      if (typeof applyUIThemeToChrome === 'function') applyUIThemeToChrome();
    }

    function finalizeRenderedLanguage() {
      if (uiLang === 'en') {
        const frame = document.getElementById('canvasFrame');
        const crumb = document.getElementById('topbarBreadcrumb');
        const badge = document.getElementById('canvasStatusBadge');
        if (frame) translateDOMSubtree(frame, false);
        if (crumb) translateDOMSubtree(crumb, false);
        if (badge) translateDOMSubtree(badge, false);
      }
    }

    // (setUILanguage & toggleUILanguage are centralized in js/i18n.js)

    let __i18nObserverStarted = false;
    function startLiveI18nObserver() {
      if (__i18nObserverStarted || typeof MutationObserver === 'undefined') return;
      __i18nObserverStarted = true;
      const targets = [
        document.getElementById('canvasFrame'),
        document.getElementById('aiMessages'),
        ...document.querySelectorAll('.modal-backdrop')
      ].filter(Boolean);
      if (!targets.length) return;

      let queuedNodes = new Set();
      let flushScheduled = false;
      const flush = () => {
        flushScheduled = false;
        if (uiLang !== 'en') { queuedNodes.clear(); return; }
        const list = Array.from(queuedNodes);
        queuedNodes.clear();
        list.forEach(node => {
          if (node.isConnected) {
            const el = node.nodeType === 1 ? node : node.parentElement;
            if (el) translateDOMSubtree(el, false);
          }
        });
      };

      const observer = new MutationObserver((mutations) => {
        if (__isApplyingI18n || uiLang !== 'en') return;
        for (const mut of mutations) {
          if (mut.type === 'characterData' && mut.target) {
            queuedNodes.add(mut.target);
          } else if (mut.type === 'childList') {
            mut.addedNodes.forEach(n => {
              if (n.nodeType === 1 || n.nodeType === 3) queuedNodes.add(n);
            });
          }
        }
        if (queuedNodes.size && !flushScheduled) {
          flushScheduled = true;
          Promise.resolve().then(flush);
        }
      });

      targets.forEach(target => observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true
      }));
    }

    // =========================================================================

    // 3. SVG HELPERS (Exact Figma Icons)
    // =========================================================================
    const SVG_DIAMOND = `
      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1L10.3 3.3L8 5.6L5.7 3.3L8 1ZM12.7 5.7L15 8L12.7 10.3L10.4 8L12.7 5.7ZM8 10.4L10.3 12.7L8 15L5.7 12.7L8 10.4ZM3.3 5.7L5.6 8L3.3 10.3L1 8L3.3 5.7Z"/>
      </svg>`;

    const SVG_BRANCH_ARROW = `
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3.5 3.5V9.5C3.5 10.3 4.1 11 5 11H12.5"/>
        <path d="M10 8.5L12.5 11L10 13.5"/>
      </svg>`;

    // =========================================================================
    // =========================================================================
    // 5. CENTER CANVAS RENDERER
    // =========================================================================
    function switchViewMode(mode) {
      currentViewMode = mode;
      updateModeTabs();
      renderCanvas();
    }

    function updateModeTabs() {
      document.querySelectorAll('.mode-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === currentViewMode);
      });
    }

    function setViewport(size, btn) {
      const frame = document.getElementById('canvasFrame');
      frame.classList.remove('tablet', 'mobile');
      if (size !== 'desktop') frame.classList.add(size);
      document.querySelectorAll('.vp-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    }

    function getSampleHTMLForPage(page) {
      if (page.id === 'colors') {
        return buildColorCSSTokens();
      }
      if (page.id === 'typography') {
        return buildTypographyCSSTokens();
      }
      if (page.id === 'icons') {
        return buildIconCSSSnippet() + '\n\n<!-- Ví dụ sử dụng Icon Component -->\n<span class="ds-icon ds-icon-search-magnifier" aria-label="Tìm kiếm">\n  ' + buildIconSvgTag(iconsCatalog.find(i => i.slug && i.slug.includes('search')) || iconsCatalog[0], 24, 'currentColor', 'outlined', true) + '\n</span>';
      }
      if (page.id === 'logos') {
        return buildLogoHTMLSnippet();
      }
      if (page.id === 'effect-styles') {
        return buildEffectsCSSTokens();
      }
      if (page.id === 'grids-spacing') {
        return buildSpacingCSSTokens();
      }
      if (page.id === 'text-link') {
        return `<a href="#" class="ds-link">Xem chi tiết tài liệu</a>
<a href="#" class="ds-link muted">Quay lại danh sách</a>
<a href="#" class="ds-link danger">Xóa workspace</a>`;
      }
      if (page.id === 'buttons') {
        return buildButtonsHTMLSnippet();
      }
      if (page.id === 'button-group') {
        return buildBtnGroupHTMLSnippet();
      }
      if (page.id === 'inputs-text-area') {
        return buildInputsHTMLSnippet();
      }
      if (page.id === 'player') {
        return buildPlayerHTMLSnippet();
      }
      if (page.id === 'progress-indicators') {
        return buildProgressHTMLSnippet();
      }
      if (page.id === 'toggles') {
        return buildTogglesHTMLSnippet();
      }
      if (page.id === 'alert') {
        return buildAlertHTMLSnippet();
      }
      if (page.id === 'tooltips') {
        return buildTooltipsHTMLSnippet();
      }
      if (page.id === 'search-filters') {
        return buildSearchFiltersHTMLSnippet();
      }
      if (page.id === 'modals-popup') {
        return buildModalsPopupHTMLSnippet();
      }
      if (page.id === 'navigation') {
        return buildNavigationHTMLSnippet();
      }
      if (page.id === 'pagination') {
        return buildPaginationHTMLSnippet();
      }
      if (page.id === 'section-headers') {
        return buildSectionHeadersHTMLSnippet();
      }
      if (page.id === 'tables') {
        return buildTablesHTMLSnippet();
      }
      if (page.id === 'dashboard') {
        return buildDashboardHTMLSnippet();
      }
      if (page.id === 'header-navigation') {
        return buildHeaderNavigationHTMLSnippet();
      }
      if (page.id === 'login-demo') {
        return buildLoginDemoHTMLSnippet();
      }
      if (page.id === 'demo-history') {
        return buildHistoryDemoHTMLSnippet();
      }
      if (page.id === 'processing-upload') {
        return buildProcessingUploadHTMLSnippet();
      }
      if (page.id === 'badges') {
        return buildBadgesHTMLSnippet();
      }
      if (page.id === 'checkboxes') {
        return buildCheckboxesHTMLSnippet();
      }
      if (page.id === 'dropdowns') {
        return buildDropdownsHTMLSnippet();
      }
      if (page.id === 'filter-sort') {
        return buildFilterSortHTMLSnippet();
      }
      return `<!-- ${page.sectionTitle} / ${page.name} -->
<div class="ds-card">
  <div class="ds-card-header">
    <strong>${page.name}</strong>
    <span class="ds-badge ds-badge-blue">De Studio 1.0</span>
  </div>
  <div class="ds-card-body">
    <p>${page.desc}</p>
  </div>
</div>`;
    }

    function getRichPreviewContent(page) {
      // Rich interactive preview for Text Link (default active in Figma image) & key pages
      if (page.id === 'text-link') {
        return `
          <div class="ds-card">
            <div class="ds-card-header">
              <div class="ds-card-title">Live Interactive Preview — Text Link Variants</div>
              <span class="ds-badge ds-badge-green">Ready</span>
            </div>
            <div class="ds-card-body">
              <div class="demo-stage">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
                  <div>
                    <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px; font-weight:600;">PRIMARY / BRAND LINK</div>
                    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
                      <a class="ds-link sm" onclick="showToast('Clicked: Small Primary Link')">Small Link (12px) →</a>
                      <a class="ds-link" onclick="showToast('Clicked: Default Primary Link')">Default Text Link →</a>
                      <a class="ds-link lg" onclick="showToast('Clicked: Large Primary Link')">Large Text Link →</a>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px; font-weight:600;">SEMANTIC TONES</div>
                    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
                      <a class="ds-link muted" onclick="showToast('Clicked: Secondary Muted Link')">Secondary / Muted Link</a>
                      <a class="ds-link danger" onclick="showToast('Clicked: Destructive Link')">Destructive Action Link</a>
                      <span style="font-size:13px; color:var(--text-secondary);">Đọc <a class="ds-link" style="text-decoration:underline;">Điều khoản SaaS</a> trước khi tiếp tục.</span>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:11px; color:var(--text-muted); margin-bottom:8px; font-weight:600;">WITH EXTERNAL ICON</div>
                    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
                      <a class="ds-link" onclick="showToast('Opening Docs...')">
                        Tài liệu API
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </a>
                      <span aria-disabled="true" style="color:var(--text-faint); font-size:13px; cursor:not-allowed;">Disabled Text Link</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>`;
      }

      if (page.id === 'buttons') {
        return `
          <div class="ds-card">
            <div class="ds-card-header">
              <div class="ds-card-title">Live Preview — Buttons</div>
              <span class="ds-badge ds-badge-green">&lt;/&gt; Code Ready</span>
            </div>
            <div class="ds-card-body">
              <div class="demo-stage" style="flex-direction:row; flex-wrap:wrap; align-items:center;">
                <button class="ds-btn ds-btn-primary" onclick="showToast('Primary Button clicked')">Primary Action</button>
                <button class="ds-btn ds-btn-secondary" onclick="showToast('Secondary Button clicked')">Secondary</button>
                <button class="ds-btn ds-btn-ghost" onclick="showToast('Ghost Button clicked')">Ghost Button</button>
                <button class="ds-btn ds-btn-danger" onclick="showToast('Danger Button clicked')">Delete</button>
              </div>
            </div>
          </div>`;
      }

      return `
        <div class="ds-card">
          <div class="ds-card-header">
            <div class="ds-card-title">Khung trang chuẩn bị xây dựng chi tiết — ${page.name}</div>
            <span class="ds-badge ${page.hasCode ? 'ds-badge-green' : 'ds-badge-gray'}">${page.hasCode ? 'Đã có khung Code' : 'Chờ thiết kế chi tiết'}</span>
          </div>
          <div class="ds-card-body">
            <div class="demo-stage" style="align-items:center; text-align:center; padding:36px 24px;">
              <div style="width:42px; height:42px; border-radius:10px; background:var(--ai-soft); color:var(--ai-accent); display:flex; align-items:center; justify-content:center;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/></svg>
              </div>
              <div>
                <div style="font-size:15px; font-weight:600; color:var(--text-primary);">Trang con "${page.name}" đã sẵn sàng trên Menu trái</div>
                <p style="font-size:13px; color:var(--text-muted); max-width:480px; margin-top:6px;">
                  ${page.desc} Bạn có thể yêu cầu AI bên phải dựng nhanh bản nháp UI bằng lệnh <code>/build-ui</code> hoặc chúng ta sẽ xây dựng chi tiết từng trạng thái & biến thể của trang này ở bước tiếp theo.
                </p>
              </div>
              <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center;">
                <button class="btn-ds ai" onclick="runQuickPrompt('Hãy dựng UI mẫu cho trang ${page.name} theo chuẩn SaaS Design System')">
                  ✨ Nhờ AI dựng mẫu ${page.name}
                </button>
                <button class="btn-ds" onclick="switchViewMode('tokens')">Xem Spec & Tokens</button>
              </div>
            </div>
          </div>
        </div>`;
    }

    // =========================================================================
    // 5B. TRANSPARENT COLORS PAGE & INTERACTIVE COLOR EDITOR
    // =========================================================================
    function renderColorGroupBlock(group) {
      const calloutHtml = group.calloutTitle ? `
        <div class="color-info-callout">
          <div style="display:flex; align-items:flex-start; gap:8px;">
            <span style="color:var(--brand-primary); font-weight:700; flex-shrink:0;">ⓘ</span>
            <div>
              <strong style="color:var(--text-primary);">${group.calloutTitle}:</strong>
              <span>${group.calloutDesc}</span>
            </div>
          </div>
          <span class="ds-badge ds-badge-blue" style="flex-shrink:0;">WCAG AA</span>
        </div>
      ` : '';

      const rowsHtml = group.rows.map(row => `
        <div class="color-token-row">
          <div class="ct-cell-purpose">
            <div class="ct-purpose-title">${row.purpose}</div>
            <div class="ct-purpose-desc">${row.purposeDesc}</div>
          </div>
          <div class="ct-cell-suggest">
            <div class="ct-contrast-tag">${row.contrast}</div>
            <div class="ct-suggest-desc">${row.suggest}</div>
          </div>
          <div class="ct-cell-swatch-light">
            <button type="button" class="swatch-btn" onclick="openColorEditor('${group.id}', '${row.scale}', 'light')" title="Click để đổi mã màu ${group.id}-${row.scale} (Light mode)">
              <div class="swatch-checker"><div class="swatch-fill" style="background:${row.light};"></div></div>
              <div class="swatch-meta">
                <div class="swatch-scale-row">
                  <span class="swatch-scale">${row.scale}</span>
                  <span class="swatch-edit-hint">Đổi mã</span>
                </div>
                <div class="swatch-code">${formatSwatchDisplay(row.light)}</div>
              </div>
            </button>
          </div>
          <div class="ct-cell-swatch-dark">
            <button type="button" class="swatch-btn" onclick="openColorEditor('${group.id}', '${row.scale}', 'dark')" title="Click để đổi mã màu ${group.id}-${row.scale} (Dark mode)">
              <div class="swatch-checker"><div class="swatch-fill" style="background:${row.dark};"></div></div>
              <div class="swatch-meta">
                <div class="swatch-scale-row">
                  <span class="swatch-scale">${row.scale}</span>
                  <span class="swatch-edit-hint">Đổi mã</span>
                </div>
                <div class="swatch-code">${formatSwatchDisplay(row.dark)}</div>
              </div>
            </button>
          </div>
        </div>
      `).join('');

      return `
        <div class="color-group-wrap">
          <div class="color-group-light-header">
            <h2 class="color-group-title">${group.name}</h2>
            <p class="color-group-desc">${group.desc}</p>
            ${calloutHtml}
          </div>
          <div class="color-group-dark-cap">
            <span style="font-size:11px; color:#94a3b8;">Nền tối chuẩn (#0D0F14)</span>
          </div>
        </div>
        <div class="color-table-head-row">
          <div class="cth-light">Mục đích sử dụng</div>
          <div class="cth-light">Gợi ý áp dụng</div>
          <div class="cth-light">Chế độ Sáng (Light mode)</div>
          <div class="cth-dark">Chế độ Tối (Dark mode)</div>
        </div>
        <div>${rowsHtml}</div>
      `;
    }

    function renderColorsPage() {
      const viewingTab = getViewingColorTab();
      const customCount = countCustomizedColors(viewingTab);
      const viewGroups = getLocalizedColorGroups(viewingTab);
      const nonSystemGroups = viewGroups.filter(g => g.category !== 'system');
      const systemGroups = viewGroups.filter(g => g.category === 'system');
      const viewingTabName = getColorTabDisplayName(viewingTab);

      const tabsHtml = colorTabsState.tabs.map(tab => {
        const isActive = tab.id === viewingTab.id;
        const arch = tab.archetypeId ? ENTERPRISE_ARCHETYPES.find(a => a.id === tab.archetypeId) : null;
        let swatchDots = '';
        if (arch) {
          swatchDots = `
            <span style="display:inline-flex; align-items:center; gap:4px;">
              <span style="width:8px; height:8px; border-radius:3px; background:${arch.brandHex}; border:1px solid var(--border-strong);"></span>
              <span style="width:8px; height:8px; border-radius:3px; background:${arch.brandSoft}; border:1px solid var(--border-strong);"></span>
            </span>
          `;
        } else if (tab.kind === 'default' || tab.id === 'tab-default') {
          const bg = tab.groups ? tab.groups.find(g => g.id === 'brand') : null;
          const r1000 = bg ? bg.rows.find(r => r.scale === '1000') : null;
          const r50 = bg ? bg.rows.find(r => r.scale === '50') : null;
          const bHex = (r1000 ? r1000.light : null) || 'rgba(55, 88, 249, 1)';
          const bSoft = (r50 ? r50.light : null) || 'rgba(238, 242, 255, 1)';
          swatchDots = `
            <span style="display:inline-flex; align-items:center; gap:4px;">
              <span style="width:8px; height:8px; border-radius:3px; background:${bHex}; border:1px solid var(--border-strong);"></span>
              <span style="width:8px; height:8px; border-radius:3px; background:${bSoft}; border:1px solid var(--border-strong);"></span>
            </span>
          `;
        }
        const badgeLabel = tab.kind === 'default'
          ? `<span style="font-size:10px; opacity:0.75; font-weight:500;">${t('Gốc', 'Base')}</span>`
          : '<span class="color-oklch-pill">OKLCH</span>';
        return `
          <button type="button" class="color-tab-btn ${isActive ? 'is-viewing' : ''}" onclick="selectColorTab('${tab.id}')">
            ${isActive ? `<span class="color-tab-applied-dot" title="${t('Theme đang bật toàn giao diện', 'Active across workspace')}"></span>` : ''}
            ${swatchDots}
            <span>${escapeHTML(getColorTabDisplayName(tab))}</span>
            ${badgeLabel}
          </button>
        `;
      }).join('');

      let enterpriseResearchHtml = '';
      if (viewingTab.kind === 'enterprise') {
        const activeArch = ENTERPRISE_ARCHETYPES.find(a => a.id === (viewingTab.archetypeId || colorTabsState.enterpriseArchetype)) || ENTERPRISE_ARCHETYPES[0];
        const vizMode = colorTabsState.vizPaletteMode || 'enterprise';
        const vizSeries = ENTERPRISE_VIZ_PALETTES[vizMode] || ENTERPRISE_VIZ_PALETTES.enterprise;

        enterpriseResearchHtml = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:12px;">
            <span class="ds-badge ds-badge-green">✓ ${escapeHTML(activeArch.name)}</span>
            <span class="ds-badge ds-badge-blue" style="font-family:var(--font-mono); font-size:11px;">${activeArch.brandOklch}</span>
            <span style="font-size:11.5px; color:var(--text-muted);">${t('Chuẩn tham chiếu:', 'Reference standard:')} <strong style="color:var(--text-secondary);">${activeArch.ref}</strong> • ${escapeHTML(activeArch.sub)}</span>
          </div>

          <div class="colors-principles-grid">
            <div class="principle-card">
              <div class="principle-card-title">${t('1. Tỷ lệ 60–30–10 Enterprise SaaS', '1. 60–30–10 Enterprise SaaS Ratio')}</div>
              <div class="principle-card-desc">${t('<b>60% Ground</b> (#F8FAFC / #FFFFFF), <b>30% Structure</b> (Slate 200–700), <b>10% Signal</b> (Brand &amp; Trạng thái ngữ nghĩa).', '<b>60% Ground</b> (#F8FAFC / #FFFFFF), <b>30% Structure</b> (Slate 200–700), <b>10% Signal</b> (Brand &amp; semantic status tones).')}</div>
            </div>
            <div class="principle-card">
              <div class="principle-card-title">${t('2. Hệ không gian OKLCH &amp; WCAG AA/AAA', '2. OKLCH Space &amp; WCAG AA/AAA')}</div>
              <div class="principle-card-desc">${t('Cân bằng độ sáng tri giác giữa Brand, Success, Warning, Danger ở cùng bậc độ sáng — đảm bảo chữ ≥ <b>4.5:1</b> và viền ≥ <b>3:1</b>.', 'Perceptually balanced lightness across Brand, Success, Warning &amp; Danger at matching steps — ensuring text ≥ <b>4.5:1</b> &amp; borders ≥ <b>3:1</b>.')}</div>
            </div>
            <div class="principle-card">
              <div class="principle-card-title">${t('3. Dark Mode 12-Step Functional Elevation', '3. Dark Mode 12-Step Functional Elevation')}</div>
              <div class="principle-card-desc">${t('Nền tối dùng phân tầng chiều sâu (#020617 → #0F172A → #1E293B) kết hợp Halo tint sáng tránh chói halation.', 'Dark surfaces use stepped depth (#020617 → #0F172A → #1E293B) paired with soft luminous tints to eliminate halation.')}</div>
            </div>
          </div>

          <div class="ent-research-card">
            <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; flex-wrap:wrap;">
              <div>
                <div style="font-size:12px; font-weight:700; color:var(--text-primary);">${t('Bảng màu Trực quan hóa Dữ liệu (8 Series Data Visualization)', 'Data Visualization Palette (8 Categorical Series)')}</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">${t('Click vào bất kỳ chuỗi màu nào để copy mã HEX + OKLCH dùng cho Dashboard / Charts.', 'Click any color series chip below to copy HEX + OKLCH values for Dashboard charts.')}</div>
              </div>
              <div style="display:inline-flex; background:var(--bg-subtle); border:1px solid var(--border-strong); border-radius:8px; padding:2px; gap:2px;">
                <button type="button" class="btn-ds ${vizMode === 'enterprise' ? 'primary' : ''}" style="padding:4px 10px; font-size:11.5px; border:0;" onclick="setVizPaletteMode('enterprise')">Enterprise Categorical</button>
                <button type="button" class="btn-ds ${vizMode === 'okabeIto' ? 'primary' : ''}" style="padding:4px 10px; font-size:11.5px; border:0;" onclick="setVizPaletteMode('okabeIto')">${t('Okabe-Ito (Chống mù màu)', 'Okabe-Ito (Colorblind Safe)')}</button>
              </div>
            </div>
            <div class="ent-viz-grid">
              ${vizSeries.map(item => `
                <div class="ent-viz-chip" onclick="copyText('${item.hex} /* ${item.oklch} */')" title="${t('Click để copy', 'Click to copy')} ${item.hex}">
                  <span class="ent-viz-swatch" style="background:${item.hex};"></span>
                  <div style="min-width:0; flex:1;">
                    <div style="font-size:11.5px; font-weight:700; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.seq}: ${item.name}</div>
                    <div style="font-size:10.5px; font-family:var(--font-mono); color:var(--text-muted);">${item.hex} • CR ${item.cr.split('/')[0].trim()}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        enterpriseResearchHtml = `
          <div class="colors-principles-grid">
            <div class="principle-card">
              <div class="principle-card-title">${t('1. Dùng theo vai trò (Semantic)', '1. Semantic Role Usage')}</div>
              <div class="principle-card-desc">${t('Chọn màu theo mục đích: <b>1000/700</b> cho văn bản, <b>800/500/100</b> cho đường viền, <b>50/25</b> cho nền nhấn nhẹ.', 'Pick tokens by semantic role: <b>1000/700</b> for typography, <b>800/500/100</b> for borders & strokes, and <b>50/25</b> for subtle tinted fills.')}</div>
            </div>
            <div class="principle-card">
              <div class="principle-card-title">${t('2. Chuẩn tương phản WCAG', '2. WCAG Contrast Standards')}</div>
              <div class="principle-card-desc">${t('Chữ hiển thị bắt buộc đạt tối thiểu <b>4.5:1</b>; đường viền input, icon chức năng và đồ họa đạt tối thiểu <b>3:1</b>.', 'Body text must achieve at least <b>4.5:1</b> contrast; input borders, functional icons & graphical marks require at least <b>3:1</b>.')}</div>
            </div>
            <div class="principle-card">
              <div class="principle-card-title">${t('3. Đổi Theme Trực tiếp Theo Tab', '3. Instant Theme Switching')}</div>
              <div class="principle-card-desc">${t('Click trực tiếp giữa 4 tab màu ở trên để đổi ngay bảng màu toàn hệ thống; nhấn từng ô màu để tinh chỉnh <b>Light/Dark</b>.', 'Click any of the 4 theme tabs above to switch the workspace palette immediately, or click any swatch to tune <b>Light/Dark</b> values.')}</div>
            </div>
          </div>
        `;
      }

      return `
        <div class="color-tabs-bar">
          <div class="color-tabs-list">
            ${tabsHtml}
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            ${customCount > 0 ? `<button type="button" class="btn-ds" onclick="resetAllColors()">↺ ${t('Khôi phục tab này', 'Reset this tab')} (${customCount})</button>` : ''}
            <button type="button" class="btn-ds" onclick="copyText(buildColorCSSTokens(getViewingColorTab()))">Copy CSS Tokens</button>
          </div>
        </div>

        <div class="colors-sheet">
          <!-- Intro & Core Principles -->
          <div class="colors-intro-block">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">
              ${t('NỀN TẢNG • FOUNDATIONS / COLORS', 'FOUNDATIONS / COLORS')} • ${escapeHTML(viewingTabName.toUpperCase())}
            </div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">
              ${viewingTab.kind === 'enterprise'
                ? `${escapeHTML(viewingTabName)} — ${t('Hệ thống Màu Enterprise SaaS (OKLCH + 60–30–10)', 'Enterprise SaaS Color System (OKLCH + 60–30–10)')}`
                : t('Màu trong suốt (Transparent Colors)', 'Transparent Colors')}
            </h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:780px; margin-top:8px; line-height:1.6;">
              ${viewingTab.kind === 'enterprise'
                ? t('Bộ màu thiết kế theo nghiên cứu <strong>Enterprise B2B SaaS</strong>: trung tính Cool Slate / Zinc / Gray làm nền và cấu trúc 90%, tách biệt màu Tín hiệu (Brand Blue/Indigo) và màu Trạng thái theo chuẩn tương phản WCAG 2.1 AA/AAA &amp; không gian OKLCH. Click từng ô màu bên dưới để tinh chỉnh trực tiếp.', 'Engineered from <strong>Enterprise B2B SaaS</strong> color research: neutral Cool Slate / Zinc / Gray carry 90% ground &amp; structure, isolating Signal Brand Blue/Indigo and semantic status tones under WCAG 2.1 AA/AAA &amp; OKLCH. Click any swatch below to fine-tune.')
                : t('Đây là <strong>bộ màu mặc định</strong> của De Studio. Các biến màu bán trong suốt (RGBA) tự động hòa trộn hài hòa trên mọi màu nền. Click trực tiếp vào từng ô màu bên dưới để tinh chỉnh HEX / RGBA / độ trong suốt.', 'This is the <strong>default base palette</strong> of De Studio. Translucent RGBA color tokens blend smoothly across any surface. Click any swatch below to fine-tune HEX / RGBA / opacity.')}
            </p>
            ${enterpriseResearchHtml}
          </div>

          <!-- Grey & Brand -->
          ${nonSystemGroups.map(renderColorGroupBlock).join('')}

          <!-- System Colours Section Banner -->
          <div class="system-colors-banner">
            <div class="system-colors-banner-left">
              <h2 style="font-size:18px; font-weight:700; color:var(--text-primary);">${t('Màu Hệ thống (System Colors)', 'System Colors')}</h2>
              <p style="font-size:12.5px; color:var(--text-secondary); margin-top:4px; max-width:600px;">
                ${t('Nhóm màu ngữ nghĩa truyền tải trạng thái phản hồi của ứng dụng (Lỗi, Cảnh báo, Thành công, Thông tin, Dữ liệu). Chỉ sử dụng đúng ngữ cảnh để tránh gây nhầm lẫn cho người dùng.', 'Semantic colors communicating application feedback states (Error, Warning, Success, Info, Data). Apply strictly by intent to avoid visual ambiguity.')}
              </p>
            </div>
            <div class="system-colors-banner-right"></div>
          </div>

          <!-- Red, Amber, Green, Teal, Orange, Purple -->
          ${systemGroups.map(renderColorGroupBlock).join('')}
        </div>
      `;
    }

    function openColorEditor(groupId, scale, mode) {
      const viewingTab = getViewingColorTab();
      const locGroups = getLocalizedColorGroups(viewingTab);
      const group = locGroups.find(g => g.id === groupId);
      const row = group?.rows.find(r => r.scale === scale);
      if (!row) return;

      const parsed = parseColorString(row[mode]) || { r: 55, g: 88, b: 249, a: 1 };
      editingColorRef = { tabId: viewingTab.id, groupId, scale, mode, ...parsed };

      const tabTitle = getColorTabDisplayName(viewingTab);
      const grpName = translateTextValue(group.name.split('—')[0].trim());
      const modeName = mode === 'light' ? t('Sáng', 'Light') : t('Tối', 'Dark');
      const purposeStr = translateTextValue(row.purpose);
      document.getElementById('ceTitle').textContent = `${tabTitle} • ${grpName} / ${scale} — ${modeName}`;
      document.getElementById('ceSubtitle').textContent = `Token: --ds-${groupId}-${scale} • ${purposeStr} (${translateTextValue(row.contrast)})`;

      const stage = document.getElementById('cePreviewStage');
      stage.className = `ce-preview-stage ${mode === 'dark' ? 'dark-bg' : 'light-bg'}`;

      syncEditorFields();
      document.getElementById('colorEditorModal').classList.add('open');
    }

    function syncEditorFields(skipSource) {
      if (!editingColorRef) return;
      const { r, g, b, a, mode } = editingColorRef;
      const hex = rgbToHex(r, g, b);
      const rgba = formatRgba(r, g, b, a);
      const pct = Math.round(a * 1000) / 10;

      if (skipSource !== 'picker') document.getElementById('ceNativePicker').value = hex;
      if (skipSource !== 'hex') document.getElementById('ceHexInput').value = hex;
      if (skipSource !== 'alpha') document.getElementById('ceAlphaRange').value = pct;
      if (skipSource !== 'rgba') document.getElementById('ceRgbaInput').value = rgba;

      document.getElementById('ceAlphaLabel').textContent = `${pct}%`;
      document.getElementById('cePreviewSwatch').style.background = rgba;
      document.getElementById('cePreviewCodeLabel').textContent = rgba;
      document.getElementById('cePreviewSampleText').style.color = a >= 0.4 ? rgba : (mode === 'dark' ? '#f9fafb' : '#111827');

      const bgRgb = mode === 'dark' ? { r: 15, g: 23, b: 42 } : { r: 255, g: 255, b: 255 };
      const ratio = getContrastRatio({ r, g, b, a }, bgRgb);
      const badge = document.getElementById('ceContrastBadge');
      const ratioStr = ratio.toFixed(2) + ':1';
      if (ratio >= 4.5) {
        badge.className = 'ds-badge ds-badge-green';
        badge.textContent = `${ratioStr} • ${t('Đạt AA', 'AA Pass')}`;
      } else if (ratio >= 3) {
        badge.className = 'ds-badge ds-badge-amber';
        badge.textContent = `${ratioStr} • ${t('Viền/Chữ lớn', 'Border / Large Text')}`;
      } else {
        badge.className = 'ds-badge ds-badge-gray';
        badge.textContent = `${ratioStr} • ${t('Dùng làm nền/viền nhẹ', 'Subtle Fill / Border')}`;
      }
    }

    function onColorPickerInput(hexVal) {
      const c = parseColorString(hexVal);
      if (!c || !editingColorRef) return;
      editingColorRef.r = c.r;
      editingColorRef.g = c.g;
      editingColorRef.b = c.b;
      syncEditorFields('picker');
    }

    function onHexTextInput(val) {
      const c = parseColorString(val);
      if (!c || !editingColorRef) return;
      editingColorRef.r = c.r;
      editingColorRef.g = c.g;
      editingColorRef.b = c.b;
      syncEditorFields('hex');
    }

    function onAlphaSliderInput(pctVal) {
      if (!editingColorRef) return;
      editingColorRef.a = Math.round((parseFloat(pctVal) / 100) * 1000) / 1000;
      syncEditorFields('alpha');
    }

    function onRgbaTextInput(val) {
      const c = parseColorString(val);
      if (!c || !editingColorRef) return;
      editingColorRef.r = c.r;
      editingColorRef.g = c.g;
      editingColorRef.b = c.b;
      editingColorRef.a = c.a;
      syncEditorFields('rgba');
    }

    function applyBaseRgbToGroup() {
      if (!editingColorRef) return;
      const { tabId, groupId, mode, r, g, b } = editingColorRef;
      const targetTab = (tabId ? colorTabsState.tabs.find(t => t.id === tabId) : null) || getViewingColorTab();
      const group = targetTab.groups.find(gr => gr.id === groupId);
      if (!group) return;
      group.rows.forEach(row => {
        const cur = parseColorString(row[mode]) || { a: 1 };
        row[mode] = formatRgba(r, g, b, cur.a);
      });
      saveColorTabsState();
      closeColorEditor();
      renderCanvas();
      const tName = getColorTabDisplayName(targetTab);
      const grpLabel = translateTextValue(group.name.split('—')[0].trim());
      showToast(t(`Đã đồng bộ màu gốc RGB cho nhóm ${grpLabel} trong "${tName}"`, `Synced base RGB for ${grpLabel} group in "${tName}"`));
    }

    function resetSingleColor() {
      if (!editingColorRef) return;
      const { tabId, groupId, scale, mode } = editingColorRef;
      const targetTab = (tabId ? colorTabsState.tabs.find(t => t.id === tabId) : null) || getViewingColorTab();
      const refGroups = targetTab.kind === 'enterprise'
        ? buildEnterpriseColorGroups(targetTab.archetypeId || colorTabsState.enterpriseArchetype)
        : DEFAULT_COLOR_GROUPS;
      const defGroup = refGroups.find(g => g.id === groupId);
      const defRow = defGroup?.rows.find(r => r.scale === scale);
      if (!defRow) return;
      const parsed = parseColorString(defRow[mode]);
      if (parsed) {
        editingColorRef.r = parsed.r;
        editingColorRef.g = parsed.g;
        editingColorRef.b = parsed.b;
        editingColorRef.a = parsed.a;
        syncEditorFields();
        showToast(t('Đã khôi phục về mã màu mặc định của tab', 'Restored tab default color value'));
      }
    }

    function resetAllColors() {
      const viewingTab = getViewingColorTab();
      if (viewingTab.kind === 'enterprise') {
        viewingTab.groups = buildEnterpriseColorGroups(viewingTab.archetypeId || colorTabsState.enterpriseArchetype);
      } else {
        viewingTab.groups = JSON.parse(JSON.stringify(DEFAULT_COLOR_GROUPS));
        if (viewingTab.id === 'tab-default') {
          try {
            localStorage.removeItem('de_studio_active_brand_palette');
            localStorage.removeItem(COLORS_STORAGE_KEY);
          } catch (e) {}
        }
      }
      if (colorTabsState.appliedTabId === viewingTab.id) {
        colorGroups = viewingTab.groups;
      }
      saveColorTabsState();
      renderCanvas();
      showToast(t(`Đã khôi phục bảng màu gốc cho "${getColorTabDisplayName(viewingTab)}"`, `Restored base palette for "${getColorTabDisplayName(viewingTab)}"`));
    }

    function saveColorEditor() {
      if (!editingColorRef) return;
      const { tabId, groupId, scale, mode, r, g, b, a } = editingColorRef;
      const targetTab = (tabId ? colorTabsState.tabs.find(t => t.id === tabId) : null) || getViewingColorTab();
      const group = targetTab.groups.find(gr => gr.id === groupId);
      const row = group?.rows.find(rw => rw.scale === scale);
      if (row) {
        row[mode] = formatRgba(r, g, b, a);
        saveColorTabsState();
        renderCanvas();
        showToast(t(`Đã lưu --ds-${groupId}-${scale} trong "${getColorTabDisplayName(targetTab)}"`, `Saved --ds-${groupId}-${scale} in "${getColorTabDisplayName(targetTab)}"`));
      }
      closeColorEditor();
    }

    function closeColorEditor() {
      document.getElementById('colorEditorModal').classList.remove('open');
      editingColorRef = null;
    }

    function updateCanvasDownloadBtnVisibility() {
      const btn = document.getElementById('canvasDownloadHtmlBtn');
      if (!btn) return;
      const frame = document.getElementById('canvasFrame');
      const hasInlineDownloadBtn = currentViewMode === 'ai-canvas'
        || Boolean(frame && frame.querySelector('[onclick*="downloadCurrentPageHTML"], [onclick*="downloadStandaloneAIDemoHTML"]'));
      btn.style.display = hasInlineDownloadBtn ? 'none' : '';
    }

    function renderCanvas() {
      _renderCanvasBody();
      updateCanvasDownloadBtnVisibility();
      if (typeof finalizeRenderedLanguage === 'function') {
        finalizeRenderedLanguage();
      }
      if (typeof updateCanvasContrastBadge === 'function') {
        updateCanvasContrastBadge();
      }
    }

    function _renderCanvasBody() {
      const page = findPageById(activePageId);
      const frame = document.getElementById('canvasFrame');

      // Update Topbar Breadcrumb & Toolbar Meta
      document.getElementById('topbarBreadcrumb').innerHTML = `
        <span class="crumb-section">${page.sectionTitle}</span>
        <span>/</span>
        <span class="crumb-page">${page.name}</span>
      `;
      const statusBadge = document.getElementById('canvasStatusBadge');
      statusBadge.className = `status-pill ${page.hasCode ? 'ready' : 'draft'}`;
      statusBadge.innerHTML = page.hasCode ? '&lt;/&gt; Code Standardized' : 'Design Blueprint';
      document.getElementById('canvasPageSlug').textContent = `${page.sectionId}/${page.id}`;

      if (currentViewMode === 'ai-canvas') {
        const appliedTab = typeof getAppliedColorTab === 'function' ? getAppliedColorTab() : null;
        const tabLabel = appliedTab ? getColorTabDisplayName(appliedTab) : t('De Studio Gốc', 'De Studio Default');
        const hasUI = Boolean(lastGeneratedAIHtml && lastGeneratedAIHtml.trim());
        const fullHtmlDoc = hasUI ? buildStandaloneAIDemoHTML(lastGeneratedAIHtml, lastGeneratedAITitle || 'De Studio AI Demo') : '';
        const blockChips = (lastGeneratedAIBlocks && lastGeneratedAIBlocks.length)
          ? lastGeneratedAIBlocks.map(b => `<span class="ds-badge ds-badge-blue">${escapeHTML(b)}</span>`).join('')
          : '';
        frame.innerHTML = `
          <div class="page-header-card">
            <div>
              <div class="page-category-tag">✨ AI UI OUTPUT • ${escapeHTML(tabLabel)}</div>
              <h1 class="page-title-main">${hasUI ? escapeHTML(lastGeneratedAITitle || 'Giao diện ghép thành phần từ Offline AI') : 'AI UI Output — Ghép giao diện từ Design System'}</h1>
              <p class="page-desc">${hasUI && lastGeneratedAIPrompt ? `Câu lệnh thực thi: <code>${escapeHTML(lastGeneratedAIPrompt)}</code>` : 'Nhập lệnh slash (<code>/compose</code>, <code>/dashboard</code>, <code>/table</code>, <code>/settings</code>, <code>/history</code>, <code>/auth</code>, <code>/form</code>, <code>/modal</code>) ở khung AI bên phải — giao diện tạo sinh sẽ hiển thị tại đây và cho phép copy thành file HTML chạy độc lập.'}</p>
              ${blockChips ? `<div style="display:flex; flex-wrap:wrap; gap:8px; margin-top:10px;">${blockChips}</div>` : ''}
            </div>
            <div class="page-quick-actions" style="flex-wrap:wrap;">
              ${hasUI ? `
                <button class="btn-ds primary" id="btnCopyFullAIDemo" onclick="copyStandaloneAIDemoHTML()">📋 Copy Full HTML Demo (.html)</button>
                <button class="btn-ds" onclick="downloadStandaloneAIDemoHTML()">⬇ Tải file .html</button>
                <button class="btn-ds" onclick="copyText(lastGeneratedAIHtml, 'Đã copy đoạn UI HTML Fragment!')">Copy Fragment</button>
              ` : `
                <button class="btn-ds ai" onclick="runQuickPrompt('/compose header + stats + filters + table + pagination')">✨ Thử ghép SaaS UI ngay</button>
              `}
            </div>
          </div>

          <div class="ds-card" style="margin-bottom:16px;">
            <div class="ds-card-header" style="flex-wrap:wrap; gap:8px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="ds-card-title">Lệnh ghép nhanh (1-Click Composer)</span>
                <span class="ds-badge ds-badge-blue">${escapeHTML(tabLabel)}</span>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:8px;">
                <button class="mini-btn" onclick="runQuickPrompt('/compose header + stats + filters + table + pagination')">/compose Full SaaS</button>
                <button class="mini-btn" onclick="runQuickPrompt('/dashboard Workspace Analytics')">/dashboard</button>
                <button class="mini-btn" onclick="runQuickPrompt('/table Quản lý danh sách')">/table</button>
                <button class="mini-btn" onclick="runQuickPrompt('/settings Cài đặt Workspace')">/settings</button>
                <button class="mini-btn" onclick="runQuickPrompt('/history Media Protection')">/history</button>
                <button class="mini-btn" onclick="runQuickPrompt('/auth Đăng nhập De Studio')">/auth</button>
                <button class="mini-btn" onclick="runQuickPrompt('/form Tạo workspace mới')">/form</button>
                <button class="mini-btn" onclick="runQuickPrompt('/modal Xác nhận xuất bản')">/modal</button>
              </div>
            </div>
          </div>

          <div class="ds-card">
            <div class="ds-card-header">
              <div class="ds-card-title">Live Rendered UI Preview</div>
              <span class="ds-badge ${hasUI ? 'ds-badge-green' : 'ds-badge-blue'}">${hasUI ? 'Interactive Standalone Ready' : 'Sẵn sàng'}</span>
            </div>
            <div class="ds-card-body" id="aiLivePreviewRoot" style="padding:16px; background:var(--bg-app);">
              ${hasUI ? lastGeneratedAIHtml : '<div style="text-align:center; padding:42px 20px; color:var(--text-muted); border:1.5px dashed var(--border-strong); border-radius:var(--radius-lg); background:var(--bg-surface);">Chưa có giao diện nào được tạo.<br/><br/>Hãy gõ <code>/</code> trong khung AI bên phải hoặc bấm một lệnh ở thanh <b>1-Click Composer</b> phía trên để ghép ngay các thành phần De Studio 1.0.</div>'}
            </div>
          </div>

          ${hasUI ? `
            <div class="ds-card" style="margin-top:16px;">
              <div class="ds-card-header">
                <div class="ds-card-title">Mã HTML Hoàn Chỉnh (Self-contained <code>index.html</code>)</div>
                <div style="display:flex; gap:8px; align-items:center;">
                  <span style="font-size:11px; color:var(--text-muted);">${fullHtmlDoc.length.toLocaleString('en-US')} ký tự • Nhúng sẵn CSS Tokens &amp; JS tương tác</span>
                  <button class="mini-btn primary" onclick="copyStandaloneAIDemoHTML()">Copy toàn bộ mã HTML</button>
                </div>
              </div>
              <div class="ds-card-body">
                <details id="aiStandaloneCodeDetails">
                  <summary style="cursor:pointer; font-weight:600; font-size:12.5px; color:var(--brand-primary, var(--ds-brand-1000)); user-select:none;">▶ Xem trước toàn bộ file &lt;!DOCTYPE html&gt; sẵn sàng mở trình duyệt</summary>
                  <pre class="code-block" id="aiStandaloneCodePreview" style="margin-top:12px; max-height:420px; overflow:auto; font-size:11px; line-height:1.5;">${escapeHTML(fullHtmlDoc)}</pre>
                </details>
              </div>
            </div>
          ` : ''}
        `;
        if (typeof initAIComposedInteractions === 'function') {
          initAIComposedInteractions(frame);
        }
        return;
      }

      const headerCard = `
        <div class="page-header-card">
          <div>
            <div class="page-category-tag">❖ ${page.sectionTitle}</div>
            <h1 class="page-title-main">${page.name}</h1>
            <p class="page-desc">${page.desc}</p>
          </div>
          <div class="page-quick-actions">
            <button class="btn-ds" onclick="switchViewMode('code')">Xem Code</button>
            <button class="btn-ds ai" onclick="runQuickPrompt('/spec Lập đặc tả chi tiết và các biến thể cần có cho ${page.name}')">
              ✨ AI Gợi ý Spec
            </button>
          </div>
        </div>
      `;

      if (currentViewMode === 'tokens') {
        if (page.id === 'colors') {
          const viewingTab = getViewingColorTab();
          const appliedTab = getAppliedColorTab();
          const locGroups = getLocalizedColorGroups(viewingTab);
          const vName = getColorTabDisplayName(viewingTab);
          const aName = getColorTabDisplayName(appliedTab);
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div>
                  <div class="ds-card-title">${t('Danh sách Token Màu', 'Color Token List')} — ${escapeHTML(vName)}</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">
                    ${t('Giao diện hiện đang áp dụng:', 'Currently applied to workspace:')} <strong>${escapeHTML(aName)}</strong>
                  </div>
                </div>
                <button class="mini-btn primary" onclick="copyText(buildColorCSSTokens(getViewingColorTab()))">Copy CSS Tokens</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  ${locGroups.map(g => `
                    <div class="spec-box">
                      <div class="spec-box-label">${translateTextValue(g.name)}</div>
                      ${g.rows.map(r => `
                        <div class="token-row">
                          <span class="token-name">--ds-${g.id}-${r.scale}</span>
                          <span class="token-val" style="display:flex; align-items:center; gap:8px;">
                            <span style="width:10px; height:10px; border-radius:3px; border:1px solid #cbd5e1; background:${r.light}; display:inline-block;"></span>
                            ${r.light}
                          </span>
                        </div>
                      `).join('')}
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'typography') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Danh sách Token Kiểu chữ đang áp dụng (${typoState.fontFamily})</div>
                <button class="mini-btn primary" onclick="copyText(buildTypographyCSSTokens())">Copy CSS Tokens</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Display Scale (Tiêu đề lớn)</div>
                    ${typoState.scales.filter(s => s.id.startsWith('display')).map(s => `
                      <div class="token-row">
                        <span class="token-name">--ds-${s.id}</span>
                        <span class="token-val">${s.sizePx}px / ${s.linePx}px</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Text Scale (Nội dung &amp; UI)</div>
                    ${typoState.scales.filter(s => s.id.startsWith('text')).map(s => `
                      <div class="token-row">
                        <span class="token-name">--ds-${s.id}</span>
                        <span class="token-val">${s.sizePx}px / ${s.linePx}px</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Font Family &amp; Weights</div>
                    <div class="token-row"><span class="token-name">--ds-font-sans</span><span class="token-val">${typoState.fontFamily}</span></div>
                    <div class="token-row"><span class="token-name">Regular / Medium</span><span class="token-val">400 / 500</span></div>
                    <div class="token-row"><span class="token-name">Semibold / Bold</span><span class="token-val">600 / 700</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'icons') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn kỹ thuật &amp; Component Tokens — Base Icons</div>
                <button class="mini-btn primary" onclick="copyText(buildIconCSSSnippet())">Copy CSS Component</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Lưới &amp; Nét vẽ (Grid &amp; Stroke)</div>
                    <div class="token-row"><span class="token-name">Base Frame</span><span class="token-val">24 × 24 px</span></div>
                    <div class="token-row"><span class="token-name">Safe Area</span><span class="token-val">20 × 20 px (2px padding)</span></div>
                    <div class="token-row"><span class="token-name">Stroke Width</span><span class="token-val">2px (round cap/join)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Kích thước chuẩn SaaS</div>
                    <div class="token-row"><span class="token-name">--ds-icon-sm</span><span class="token-val">16px (Inline / Badge)</span></div>
                    <div class="token-row"><span class="token-name">--ds-icon-md</span><span class="token-val">20px (Button / Input)</span></div>
                    <div class="token-row"><span class="token-name">--ds-icon-lg</span><span class="token-val">24px (Nav / Header)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Trạng thái Component (5 States)</div>
                    <div class="token-row"><span class="token-name">Default / Hover</span><span class="token-val">--ds-grey-1000 / --ds-grey-50</span></div>
                    <div class="token-row"><span class="token-name">Active / Tinted</span><span class="token-val">--ds-brand-1000 / --ds-brand-50</span></div>
                    <div class="token-row"><span class="token-name">Disabled</span><span class="token-val">opacity: 0.35</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'logos') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Nhận diện &amp; Logo Assets — ${escapeHTML(logosState.brandName || 'De Studio')}</div>
                <button class="mini-btn primary" onclick="copyText(buildLogoHTMLSnippet())">Copy Logo HTML</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Tài sản Logo (Assets)</div>
                    ${logosState.items.map(l => `
                      <div class="token-row"><span class="token-name">${escapeHTML(l.slug)}</span><span class="token-val">${escapeHTML(l.ratio || 'SVG')}</span></div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Clearspace &amp; Min Size</div>
                    <div class="token-row"><span class="token-name">Clearspace (X)</span><span class="token-val">≥ 1x chiều cao biểu tượng</span></div>
                    <div class="token-row"><span class="token-name">Min Digital Height</span><span class="token-val">24px (Horizontal) / 20px (Mark)</span></div>
                    <div class="token-row"><span class="token-name">Favicon Target</span><span class="token-val">logo-mark-brand</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'effect-styles') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Danh sách Token Hiệu ứng — Elevation Shadows &amp; Blurs</div>
                <button class="mini-btn primary" onclick="copyText(buildEffectsCSSTokens())">Copy CSS Tokens</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Shadows (${effectStylesState.shadows.length} bậc)</div>
                    ${effectStylesState.shadows.map(s => `
                      <div class="token-row"><span class="token-name">${s.token}</span><span class="token-val">${s.layers.length} layer(s)</span></div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Backdrop Blurs (${effectStylesState.blurs.length} biến thể)</div>
                    ${effectStylesState.blurs.map(b => `
                      <div class="token-row"><span class="token-name">${b.token}</span><span class="token-val">blur(${b.blur}px) • ${Math.round(b.bgAlpha * 100)}%</span></div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'grids-spacing') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Danh sách Token Khoảng cách &amp; Khung chứa (nền ${spacingState.basePx}px)</div>
                <button class="mini-btn primary" onclick="copyText(buildSpacingCSSTokens())">Copy CSS Tokens</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Spacing Scale (1 → 12)</div>
                    ${spacingState.items.slice(0, 9).map(s => `
                      <div class="token-row">
                        <span class="token-name">${s.token}</span>
                        <span class="token-val">${formatRem(s.px)} (${formatPxLabel(s.px)})</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Spacing Scale (16 → 64)</div>
                    ${spacingState.items.slice(9).map(s => `
                      <div class="token-row">
                        <span class="token-name">${s.token}</span>
                        <span class="token-val">${formatRem(s.px)} (${formatPxLabel(s.px)})</span>
                      </div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Containers (sm → xl)</div>
                    ${spacingState.containers.map(c => `
                      <div class="token-row">
                        <span class="token-name">${c.token}</span>
                        <span class="token-val">${formatRem(c.px)} (${formatPxLabel(c.px)})</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'buttons') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Kích thước &amp; Màu sắc — Buttons Component</div>
                <button class="mini-btn primary" onclick="copyText(buildButtonsHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">5 Kích thước chuẩn (Height / Font / Icon)</div>
                    ${BUTTON_SIZES.map(sz => `
                      <div class="token-row"><span class="token-name">.ds-cta-${sz.px}</span><span class="token-val">${sz.px}px • icon ${sz.iconPx}px • var(${sz.token})</span></div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Tokens Màu sắc (Colors Foundation)</div>
                    <div class="token-row"><span class="token-name">Primary Default / Hover</span><span class="token-val">--ds-brand-1000 / --ds-brand-1100</span></div>
                    <div class="token-row"><span class="token-name">Primary Focus / Ring</span><span class="token-val">--ds-brand-1200 / --ds-brand-ring</span></div>
                    <div class="token-row"><span class="token-name">Dark Default / Hover / Focus</span><span class="token-val">--ds-grey-1000 / 900 / 800</span></div>
                    <div class="token-row"><span class="token-name">Disabled State</span><span class="token-val">bg --ds-grey-50 • text --ds-grey-300</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'button-group') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Kỹ thuật &amp; Tokens — Button Group</div>
                <button class="mini-btn primary" onclick="copyText(buildBtnGroupHTMLSnippet())">Copy HTML Code</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">3 Biến thể Figma</div>
                    <div class="token-row"><span class="token-name">Text Only</span><span class="token-val">Mini-tabs / Bộ lọc nhanh</span></div>
                    <div class="token-row"><span class="token-name">Icon + Text</span><span class="token-val">Toolbar hành động (14–18px icon)</span></div>
                    <div class="token-row"><span class="token-name">Icon Only</span><span class="token-val">Điều hướng / Stepper (32–48px)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Color &amp; Effect Tokens</div>
                    <div class="token-row"><span class="token-name">Active / Selected</span><span class="token-val">--ds-brand-50 / --ds-brand-1000</span></div>
                    <div class="token-row"><span class="token-name">Focus Ring</span><span class="token-val">3px --ds-brand-ring</span></div>
                    <div class="token-row"><span class="token-name">Disabled State</span><span class="token-val">--ds-grey-25 / --ds-grey-300</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'badges') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Kích thước &amp; Tokens Màu — Badges Component</div>
                <button class="mini-btn primary" onclick="copyText(buildBadgesHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">5 Kích thước chuẩn (22–36px)</div>
                    ${BADGE_SIZES.map(sz => `
                      <div class="token-row"><span class="token-name">.ds-badge-${sz.px}</span><span class="token-val">${sz.px}px • icon ${sz.iconPx}px</span></div>
                    `).join('')}
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">8 Nhóm Màu (Soft &amp; Solid)</div>
                    ${BADGE_TONES.map(t => `
                      <div class="token-row"><span class="token-name">${t.name}</span><span class="token-val">${t.token}</span></div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'checkboxes') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Hình thái &amp; Trạng thái — Checkboxes &amp; Radio Controls</div>
                <button class="mini-btn primary" onclick="copyText(buildCheckboxesHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Hình dạng &amp; Kích thước ô chọn</div>
                    <div class="token-row"><span class="token-name">.ds-cb-box</span><span class="token-val">${cbState.boxSize}px × ${cbState.boxSize}px • radius 4px</span></div>
                    <div class="token-row"><span class="token-name">.ds-cb-box.is-circle</span><span class="token-val">999px (Radio circle selector)</span></div>
                    <div class="token-row"><span class="token-name">.ds-cb-control.is-right</span><span class="token-val">Row reverse / space-between (Icon phải)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Tokens Màu &amp; Typography</div>
                    <div class="token-row"><span class="token-name">Checked</span><span class="token-val">--ds-brand-1000</span></div>
                    <div class="token-row"><span class="token-name">Error</span><span class="token-val">--ds-red-1000</span></div>
                    <div class="token-row"><span class="token-name">Disabled</span><span class="token-val">--ds-grey-100 / --ds-grey-300</span></div>
                    <div class="token-row"><span class="token-name">Focus Ring</span><span class="token-val">0 0 0 3px var(--ds-brand-ring)</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'dropdowns') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Biến thể &amp; Tokens — Dropdowns &amp; Select</div>
                <button class="mini-btn primary" onclick="copyText(buildDropdownsHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">5 Biến thể Input Select + 2 Biến thể Đặc biệt</div>
                    <div class="token-row"><span class="token-name">Plain / Icon / Avatar / Dot</span><span class="token-val">min-height: 36px • radius: 6px</span></div>
                    <div class="token-row"><span class="token-name">Multi-select Tags</span><span class="token-val">Chip badge + overflow +N + Clear ×</span></div>
                    <div class="token-row"><span class="token-name">Amount Stepper</span><span class="token-val">Minus / Value / Plus (0–99)</span></div>
                    <div class="token-row"><span class="token-name">Account Action Menu</span><span class="token-val">Width 248px • 4 nhóm phân cách</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Foundation Tokens đang áp dụng</div>
                    <div class="token-row"><span class="token-name">Focus Border &amp; Ring</span><span class="token-val">--ds-brand-1000 / --ds-brand-ring</span></div>
                    <div class="token-row"><span class="token-name">Menu Elevation</span><span class="token-val">--ds-shadow-lg</span></div>
                    <div class="token-row"><span class="token-name">Online Status &amp; Check</span><span class="token-val">--ds-green-1000</span></div>
                    <div class="token-row"><span class="token-name">Icons</span><span class="token-val">Foundation Icons (user, chevron, plus, minus...)</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'filter-sort') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Thành phần &amp; Tokens — Filter &amp; Sort</div>
                <button class="mini-btn primary" onclick="copyText(buildFilterSortHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Nhóm Điều khiển Chính</div>
                    <div class="token-row"><span class="token-name">Clear × Buttons</span><span class="token-val">28px (md) &amp; 22px (sm) • 5 trạng thái</span></div>
                    <div class="token-row"><span class="token-name">Filter Chips</span><span class="token-val">Check / Checkbox / Radio • 30px &amp; 24px</span></div>
                    <div class="token-row"><span class="token-name">Report Filters Drawer</span><span class="token-val">Timeframe + Range + Filters + Reset/Apply</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Tokens Foundations đang kế thừa</div>
                    <div class="token-row"><span class="token-name">Active Filter Tint</span><span class="token-val">--ds-orange-50 / --ds-orange-1000</span></div>
                    <div class="token-row"><span class="token-name">Popover &amp; Drawer Shadow</span><span class="token-val">--ds-shadow-lg</span></div>
                    <div class="token-row"><span class="token-name">Triggers &amp; Actions</span><span class="token-val">Buttons + Checkboxes + Icons + Badges</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'inputs-text-area') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Kích thước &amp; Tokens — Inputs &amp; Text Area</div>
                <button class="mini-btn primary" onclick="copyText(buildInputsHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">8 Biến thể Nhập liệu chuẩn</div>
                    <div class="token-row"><span class="token-name">Email Plain &amp; Leading Icon</span><span class="token-val">36px–38px • border 1px • radius 6px</span></div>
                    <div class="token-row"><span class="token-name">Phone / Amount / Key</span><span class="token-val">Prefix / Suffix có đường ngăn 1px</span></div>
                    <div class="token-row"><span class="token-name">Description Text Area</span><span class="token-val">min-height 76px • resize vertical</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Tokens Trạng thái &amp; Mobile Rule</div>
                    <div class="token-row"><span class="token-name">Focus Ring</span><span class="token-val">--ds-brand-1000 + --ds-brand-ring</span></div>
                    <div class="token-row"><span class="token-name">Error State</span><span class="token-val">--ds-red-1000 + alert-circle icon</span></div>
                    <div class="token-row"><span class="token-name">Mobile Font Size</span><span class="token-val">&ge; 16px (ngăn auto-zoom)</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'player') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Dark Mode &amp; Responsive — Video Player</div>
                <button class="mini-btn primary" onclick="copyText(buildPlayerHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">3 Ngưỡng Kích thước Màn hình</div>
                    <div class="token-row"><span class="token-name">Desktop (&ge; 1024px)</span><span class="token-val">Full Icon + Text Labels + Top Time + Knob</span></div>
                    <div class="token-row"><span class="token-name">Tablet (601px–1023px)</span><span class="token-val">Icon Only + Inline Time + ẩn Volume + Knob</span></div>
                    <div class="token-row"><span class="token-name">Mobile (&le; 600px)</span><span class="token-val">Slim 3px Track (No Knob) + tối giản 4 nút</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Dark Mode Tokens Bắt buộc</div>
                    <div class="token-row"><span class="token-name">Controls Foreground</span><span class="token-val">#FFFFFF (Foundation Media Icons filled/outlined)</span></div>
                    <div class="token-row"><span class="token-name">Scrubber Fill &amp; Glow</span><span class="token-val">--ds-brand-1000 + --ds-brand-ring</span></div>
                    <div class="token-row"><span class="token-name">Bottom Scrim Gradient</span><span class="token-val">rgba(9,13,22, 0.94) → transparent</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'progress-indicators') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Hình thái &amp; Kích thước — Progress Indicators</div>
                <button class="mini-btn primary" onclick="copyText(buildProgressHTMLSnippet())">Copy HTML &amp; SVG</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Linear &amp; Circular Sizes</div>
                    <div class="token-row"><span class="token-name">Linear Track</span><span class="token-val">height 7px • radius 999px • 5 kiểu nhãn</span></div>
                    <div class="token-row"><span class="token-name">Circular Ring 360°</span><span class="token-val">48 / 86 / 108 / 130 / 156px (XXS→XL)</span></div>
                    <div class="token-row"><span class="token-name">Half-Circle 180°</span><span class="token-val">Bo tròn đầu nét (stroke-linecap: round)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Semantic Color Tokens (Colors)</div>
                    <div class="token-row"><span class="token-name">Brand (Default)</span><span class="token-val">--ds-brand-1000</span></div>
                    <div class="token-row"><span class="token-name">Success / Warning / Danger</span><span class="token-val">--ds-green / --ds-orange / --ds-red-1000</span></div>
                    <div class="token-row"><span class="token-name">Inactive Track</span><span class="token-val">--ds-grey-100 (#EAECF0)</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'alert') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">${t('Quy chuẩn Hình thái & Tokens — Alert Banners', 'Component Spec & Design Tokens — Alert Banners')}</div>
                <button class="mini-btn primary" onclick="copyText(buildAlertHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">${t('Cấu trúc & Khoảng cách (Layout & Spacing)', 'Layout & Geometry Tokens')}</div>
                    <div class="token-row"><span class="token-name">${t('Bo góc & Viền', 'Border & Radius')}</span><span class="token-val">border-radius: 8px • border: 1px • border-left: 4px</span></div>
                    <div class="token-row"><span class="token-name">${t('Khoảng đệm & Gap', 'Padding & Gap')}</span><span class="token-val">padding:16px 16px • gap: 12px (Inline) / 8px (Stacked)</span></div>
                    <div class="token-row"><span class="token-name">${t('Chữ & Biểu tượng', 'Typography & Icon')}</span><span class="token-val">Icon 20px • Heading 14px/600 • Desc 13.5px/400</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">${t('Màu Ngữ nghĩa (Semantic Color Tokens)', 'Semantic Color Tokens (Colors)')}</div>
                    <div class="token-row"><span class="token-name">Error</span><span class="token-val">--ds-red-50 / --ds-red-200 / --ds-red-1000</span></div>
                    <div class="token-row"><span class="token-name">Warning</span><span class="token-val">--ds-amber-50 / --ds-amber-200 / --ds-amber-1000</span></div>
                    <div class="token-row"><span class="token-name">Success</span><span class="token-val">--ds-green-50 / --ds-green-200 / --ds-green-1000</span></div>
                    <div class="token-row"><span class="token-name">Info</span><span class="token-val">--ds-brand-50 / --ds-brand-200 / --ds-brand-1000</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'toggles') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Hình thái &amp; Trạng thái — Toggles (Switches)</div>
                <button class="mini-btn primary" onclick="copyText(buildTogglesHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Kích thước Track &amp; Thumb</div>
                    <div class="token-row"><span class="token-name">SM (Nhỏ gọn)</span><span class="token-val">Track 36×20px • Thumb 16×16px • Pad 2px</span></div>
                    <div class="token-row"><span class="token-name">MD (Tiêu chuẩn)</span><span class="token-val">Track 44×24px • Thumb 20×20px • Pad 2px</span></div>
                    <div class="token-row"><span class="token-name">Vị trí (Alignment)</span><span class="token-val">Left (Trái nhãn) &amp; Right (Phải nhãn)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Màu Trạng thái (Colors &amp; Effects)</div>
                    <div class="token-row"><span class="token-name">OFF / Hover / Disabled</span><span class="token-val">--ds-grey-100 / --ds-grey-200 / #F2F4F7</span></div>
                    <div class="token-row"><span class="token-name">ON (Success / Brand)</span><span class="token-val">--ds-green-1000 / --ds-brand-1000</span></div>
                    <div class="token-row"><span class="token-name">Error State</span><span class="token-val">--ds-red-1000 + Nhãn lỗi đỏ</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'tooltips') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Hình thái &amp; Định vị — Tooltips</div>
                <button class="mini-btn primary" onclick="copyText(buildTooltipsHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Kích thước &amp; Mũi tên</div>
                    <div class="token-row"><span class="token-name">Compact (1 dòng)</span><span class="token-val">Padding 8×12px • Radius 8px</span></div>
                    <div class="token-row"><span class="token-name">Rich (Kèm mô tả)</span><span class="token-val">Padding 12×14px • Max-width 312px</span></div>
                    <div class="token-row"><span class="token-name">7 Hướng mũi tên</span><span class="token-val">None / Bottom (C/L/R) / Top / Left / Right</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Màu Nền &amp; Bóng (Colors &amp; Effects)</div>
                    <div class="token-row"><span class="token-name">Light Tooltip</span><span class="token-val">#FFFFFF • Border --ds-grey-100</span></div>
                    <div class="token-row"><span class="token-name">Dark Tooltip</span><span class="token-val">--ds-grey-1000 (#101828) • Chữ #FFFFFF</span></div>
                    <div class="token-row"><span class="token-name">Elevation Shadow</span><span class="token-val">--ds-shadow-lg (Synced Effects)</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'search-filters') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Cấu trúc — Search &amp; Filters</div>
                <button class="mini-btn primary" onclick="copyText(buildSearchFiltersHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Thành phần Lắp ghép</div>
                    <div class="token-row"><span class="token-name">Search + Trigger</span><span class="token-val">Input 36px + Sliders Button + Popover (--ds-shadow-lg)</span></div>
                    <div class="token-row"><span class="token-name">Compact Chip (SM)</span><span class="token-val">Height 30px • Orange Focus Ring • Split Clear ×</span></div>
                    <div class="token-row"><span class="token-name">Multi-Filter (MD)</span><span class="token-val">Height 36px • --ds-brand-50 + Badge +N</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Nguyên liệu Liên kết</div>
                    <div class="token-row"><span class="token-name">Controls</span><span class="token-val">Inputs + Buttons + Checkboxes + Badges</span></div>
                    <div class="token-row"><span class="token-name">Focus Rings</span><span class="token-val">--ds-brand-ring &amp; Orange Highlight</span></div>
                    <div class="token-row"><span class="token-name">Popover Actions</span><span class="token-val">Primary Confirm + Secondary Cancel</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'modals-popup') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Responsive &amp; Tokens — Modals Pop-up</div>
                <button class="mini-btn primary" onclick="copyText(buildModalsPopupHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Kích thước &amp; Bố cục CTA</div>
                    <div class="token-row"><span class="token-name">Desktop Modal</span><span class="token-val">Max-width 440px • Radius 12px • Cancel Trái / CTA Phải</span></div>
                    <div class="token-row"><span class="token-name">Mobile Modal</span><span class="token-val">Full-width Stacked • Primary CTA trên • Cancel dưới</span></div>
                    <div class="token-row"><span class="token-name">Backdrop Overlay</span><span class="token-val">rgba(16, 24, 40, 0.72) + blur(4px)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Nguyên liệu Liên kết</div>
                    <div class="token-row"><span class="token-name">Icon Badges</span><span class="token-val">--ds-red-1000 / --ds-green-1000 / --ds-brand-50</span></div>
                    <div class="token-row"><span class="token-name">Form &amp; Roster</span><span class="token-val">Inputs + Checkboxes + Avatar + Buttons</span></div>
                    <div class="token-row"><span class="token-name">Elevation Shadow</span><span class="token-val">--ds-shadow-xl (Synced Effects)</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'navigation') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Chiều rộng &amp; Trạng thái — Navigation</div>
                <button class="mini-btn primary" onclick="copyText(buildNavigationHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Kích thước Cột &amp; Phân cấp</div>
                    <div class="token-row"><span class="token-name">Collapsed Icon Rail</span><span class="token-val">Width 54px–64px • Icon Only + Tooltip</span></div>
                    <div class="token-row"><span class="token-name">Expanded Sidebar</span><span class="token-val">Width 260px • Parent → Child Vertical Line</span></div>
                    <div class="token-row"><span class="token-name">Section Header</span><span class="token-val">WORKSPACE SUITE / SUITE divider</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Màu Trạng thái (Colors)</div>
                    <div class="token-row"><span class="token-name">Active Item</span><span class="token-val">--ds-brand-50 Bg + --ds-brand-1000 Text</span></div>
                    <div class="token-row"><span class="token-name">Disabled Access</span><span class="token-val">--ds-grey-400 (Chưa cấp quyền)</span></div>
                    <div class="token-row"><span class="token-name">Footer Notification</span><span class="token-val">--ds-red-1000 Badge / Neutral Counter Pill</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'pagination') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Kích thước &amp; Chỉ báo — Pagination</div>
                <button class="mini-btn primary" onclick="copyText(buildPaginationHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Bảng &amp; Mobile Pagination</div>
                    <div class="token-row"><span class="token-name">Numeric Cells</span><span class="token-val">SM 26×26px • MD 30×30px • Radius 6–7px</span></div>
                    <div class="token-row"><span class="token-name">Enterprise Controls</span><span class="token-val">Total Count + Ellipsis + Page Size + Go to Page</span></div>
                    <div class="token-row"><span class="token-name">Responsive Variant</span><span class="token-val">Prev/Next Buttons &amp; Wide/Compact 1 / 99 Box</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Carousel Indicators (Colors)</div>
                    <div class="token-row"><span class="token-name">Shapes</span><span class="token-val">Dot (7px) &amp; Bar (28×5px) • Plain / Pill Container</span></div>
                    <div class="token-row"><span class="token-name">Active Tones</span><span class="token-val">--ds-orange-1000 / --ds-grey-1000 / --ds-brand-1000</span></div>
                    <div class="token-row"><span class="token-name">Inactive Dots</span><span class="token-val">#D0D5DD trên nền #F2F4F7</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'section-headers') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Cấu trúc Responsive — Section Headers</div>
                <button class="mini-btn primary" onclick="copyText(buildSectionHeadersHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">6 Kiểu Kết hợp (Desktop &amp; Mobile)</div>
                    <div class="token-row"><span class="token-name">Variants 1–3 (No Tabs)</span><span class="token-val">Search+CTA • Search Only • Segmented Button Group</span></div>
                    <div class="token-row"><span class="token-name">Variants 4–6 (Tabbed)</span><span class="token-val">10 Horizontal Tabs trên Desktop → Select trên Mobile</span></div>
                    <div class="token-row"><span class="token-name">Overflow Action</span><span class="token-val">Tertiary Link thu vào Kebab ⋮ trên Mobile</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Nguyên liệu Hệ thống</div>
                    <div class="token-row"><span class="token-name">Heading &amp; Badge</span><span class="token-val">Title + Count Pill + Supporting Description</span></div>
                    <div class="token-row"><span class="token-name">Controls</span><span class="token-val">Buttons + Search &amp; Filters + Button Group</span></div>
                    <div class="token-row"><span class="token-name">Tab Counter</span><span class="token-val">Badge số đếm thông báo ngay trong Tab Item</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'tables') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Cấu trúc &amp; Trạng thái — Tables (T1–T10)</div>
                <button class="mini-btn primary" onclick="copyText(buildTablesHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Ma trận Trạng thái Dòng (4-Row Spec)</div>
                    <div class="token-row"><span class="token-name">Row 1 / Row 3</span><span class="token-val">Default (#FFFFFF) / Zebra (#F9FAFB)</span></div>
                    <div class="token-row"><span class="token-name">Row 2 / Row 4</span><span class="token-val">Active/Hover (Key Column &rarr; --ds-orange-1000)</span></div>
                    <div class="token-row"><span class="token-name">CTA Hover Rule</span><span class="token-val">Outline Soft &rarr; Solid Filled on Row Hover (T6)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Thành phần Tái sử dụng &amp; Typography</div>
                    <div class="token-row"><span class="token-name">Status Pills</span><span class="token-val">200/Unblocked/Done (Green), 403/Blocked (Red), Doing (Blue), Waiting (Amber)</span></div>
                    <div class="token-row"><span class="token-name">Interactive Controls</span><span class="token-val">Toggle Switches (T8), Multi-Select Checkboxes (T9), Icon Actions (T4)</span></div>
                    <div class="token-row"><span class="token-name">Alignment &amp; Scroll</span><span class="token-val">tabular-nums + .tbl-scroll ngang cho bảng 8–9 cột</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'dashboard') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="db-widget-head" style="padding:16px 18px;border-bottom:1px solid #eaecf0;margin:0;">
                <div class="ds-card-title">Quy chuẩn Data Visualization &amp; Widgets — Dashboard (D1–D10)</div>
                <button class="mini-btn primary" onclick="copyText(buildDashboardHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Hệ màu Trực quan hóa Dữ liệu</div>
                    <div class="token-row"><span class="token-name">Primary / Succeeded</span><span class="token-val">Brand Blue #004EEB / #155EEF • Green #1D8842</span></div>
                    <div class="token-row"><span class="token-name">Warning / Denied</span><span class="token-val">Orange #EA580C (Active Row, Geo Map, Donut)</span></div>
                    <div class="token-row"><span class="token-name">Critical / Failed</span><span class="token-val">Red #DC2626 + Dark Tooltip #1D2939</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">10 Biểu đồ &amp; Trạng thái Widget</div>
                    <div class="token-row"><span class="token-name">Bars &amp; Progress</span><span class="token-val">D1 Monthly Cols • D2 Stacked • D3 Platform • D8 Dual-Axis</span></div>
                    <div class="token-row"><span class="token-name">Splines &amp; Donut</span><span class="token-val">D5 Latency • D6 24h Traffic • D9 Donut • D10 TPS</span></div>
                    <div class="token-row"><span class="token-name">Geo &amp; Empty</span><span class="token-val">D4 Empty CTA • D7 Top-10 Ranking &amp; World Map</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'header-navigation') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">Quy chuẩn Responsive &amp; Trạng thái — Page Header Navigation (V1–V6)</div>
                <button class="mini-btn primary" onclick="copyText(buildHeaderNavigationHTMLSnippet())">Copy HTML &amp; CSS</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">3 Breakpoint Tiers (V1–V6)</div>
                    <div class="token-row"><span class="token-name">V1–V3 (Mobile &le; 600px)</span><span class="token-val">Icon CTA [+] • Search Expand Overlay • Collapsible Filter Chips</span></div>
                    <div class="token-row"><span class="token-name">V4 (Tablet 601–1023px)</span><span class="token-val">Header + Full Filter Tray + Search &amp; Reset</span></div>
                    <div class="token-row"><span class="token-name">V5–V6 (Desktop &ge; 1024px)</span><span class="token-val">Inline Search + Filter Bar + Full [+ Button CTA] + Kebab ⋮</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Kích thước &amp; Focus States</div>
                    <div class="token-row"><span class="token-name">Control Height</span><span class="token-val">30px (Inputs, Icon Box, Filter Chips, Primary CTA)</span></div>
                    <div class="token-row"><span class="token-name">Search Focus Ring</span><span class="token-val">#2E90FA + 3px halo rgba(46, 144, 250, 0.18)</span></div>
                    <div class="token-row"><span class="token-name">Primary CTA Token</span><span class="token-val">#004EEB / Hover #155EEF</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'login-demo') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">${t('Thành phần Design System Tái sử dụng — Login', 'Reused Design System Components — Login')}</div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <button class="mini-btn" onclick="copyText(buildLoginDemoHTMLSnippet())">Copy HTML</button>
                  <button class="mini-btn primary" onclick="downloadCurrentPageHTML('login-demo')">↓ Download HTML</button>
                </div>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Components &amp; Assets Reused</div>
                    <div class="token-row"><span class="token-name">Logo Header</span><span class="token-val">FOUNDATIONS / Logos (Logo_destudio_ngang.svg)</span></div>
                    <div class="token-row"><span class="token-name">Inputs &amp; Buttons</span><span class="token-val">Email + Password Eye Toggle + Brand CTA + Google SSO</span></div>
                    <div class="token-row"><span class="token-name">Visual Backdrop</span><span class="token-val">Unsplash Photos + Effect Styles Glass Blur (22px)</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Unified Responsive Breakpoints</div>
                    <div class="token-row"><span class="token-name">Mobile (&le; 600px)</span><span class="token-val">Full-bleed vertical auth form</span></div>
                    <div class="token-row"><span class="token-name">Tablet (601px–1023px)</span><span class="token-val">Floating card centered over blurred Unsplash backdrop</span></div>
                    <div class="token-row"><span class="token-name">Desktop (&ge; 1024px)</span><span class="token-val">2-column split card w/ Unsplash showcase &amp; Pagination Dots</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'demo-history') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">${t('Thành phần Design System Tái sử dụng — History', 'Reused Design System Components — History')}</div>
                <div style="display:flex;gap:8px;align-items:center;">
                  <button class="mini-btn" onclick="copyText(buildHistoryDemoHTMLSnippet())">Copy HTML</button>
                  <button class="mini-btn primary" onclick="downloadCurrentPageHTML('demo-history')">↓ Download HTML</button>
                </div>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">Components &amp; Color Tokens</div>
                    <div class="token-row"><span class="token-name">Logo Assets</span><span class="token-val">De Studio Horizontal (Desktop) &amp; Icon Mark (Tablet/Mobile)</span></div>
                    <div class="token-row"><span class="token-name">Navigation &amp; Suite</span><span class="token-val">Expanded Sidebar (214px), Tablet Rail (64px), Mobile Drawer</span></div>
                    <div class="token-row"><span class="token-name">CTA &amp; Status Badges</span><span class="token-val">--ds-brand-1000, --ds-green-*, --ds-amber-*, --ds-red-*</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">Unified Responsive Breakpoints</div>
                    <div class="token-row"><span class="token-name">Desktop (&ge; 1024px)</span><span class="token-val">Expanded Sidebar + Search Box + Table Column Headers</span></div>
                    <div class="token-row"><span class="token-name">Tablet (601px–1023px)</span><span class="token-val">64px Icon Rail + Compact [Q] Search Toggle + Card Rows</span></div>
                    <div class="token-row"><span class="token-name">Mobile (&le; 600px)</span><span class="token-val">Hamburger Slide Drawer + 2-Tier Touch Cards</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        if (page.id === 'processing-upload') {
          frame.innerHTML = headerCard + `
            <div class="ds-card">
              <div class="ds-card-header">
                <div class="ds-card-title">${t('Thành phần & Tokens Tái sử dụng — Processing - Upload', 'Components & Design Tokens — Processing - Upload')}</div>
                <button class="mini-btn primary" onclick="copyText(buildProcessingUploadHTMLSnippet())">Copy HTML</button>
              </div>
              <div class="ds-card-body">
                <div class="spec-grid">
                  <div class="spec-box">
                    <div class="spec-box-label">${t('Cấu trúc Flow & Thành phần', 'Flow Structure & Components')}</div>
                    <div class="token-row"><span class="token-name">Container Max Width</span><span class="token-val">540px centered • Card padding: 13px 16px • Radius: 10px</span></div>
                    <div class="token-row"><span class="token-name">Brand &amp; Actions</span><span class="token-val">De Studio logo-mark-brand (34px) • Pill CTA Button (radius 999px)</span></div>
                    <div class="token-row"><span class="token-name">Striped Progress Bar</span><span class="token-val">height: 9px • repeating-linear-gradient(-45deg) track</span></div>
                  </div>
                  <div class="spec-box">
                    <div class="spec-box-label">${t('Màu Ngữ nghĩa & Responsive', 'Semantic Tokens & Breakpoints')}</div>
                    <div class="token-row"><span class="token-name">Uploading / Active Pipeline</span><span class="token-val">--ds-brand-1000 / --ds-orange-1000</span></div>
                    <div class="token-row"><span class="token-name">Error Border &amp; Retry</span><span class="token-val">--ds-red-1000 / --ds-red-50 + circle-xmark + refresh-sync</span></div>
                    <div class="token-row"><span class="token-name">Completed Badge</span><span class="token-val">--ds-green-1000 (44px) + check-mark</span></div>
                  </div>
                </div>
              </div>
            </div>
          `;
          return;
        }
        const brandTokenVal = getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim() || 'rgba(69, 98, 229, 0.95)';
        const textSmScale = typoState.scales.find(s => s.id === 'text-sm') || { sizePx: 14, linePx: 20 };
        const space4 = spacingState.items.find(i => i.id === '4') || { px: 16 };
        frame.innerHTML = headerCard + `
          <div class="ds-card">
            <div class="ds-card-header">
              <div class="ds-card-title">Foundations đang liên kết — ${page.name}</div>
              <span class="ds-badge ds-badge-blue">Synced from Foundations</span>
            </div>
            <div class="ds-card-body">
              <div class="spec-grid">
                <div class="spec-box">
                  <div class="spec-box-label">Color &amp; Typography Tokens</div>
                  <div class="token-row"><span class="token-name">--ds-brand-1000</span><span class="token-val">${escapeHTML(brandTokenVal)}</span></div>
                  <div class="token-row"><span class="token-name">--ds-font-sans</span><span class="token-val">${escapeHTML(typoState.fontFamily)}</span></div>
                  <div class="token-row"><span class="token-name">--ds-text-sm</span><span class="token-val">${textSmScale.sizePx}px / ${textSmScale.linePx}px</span></div>
                </div>
                <div class="spec-box">
                  <div class="spec-box-label">Spacing &amp; Effect Tokens</div>
                  <div class="token-row"><span class="token-name">--ds-space-4</span><span class="token-val">${formatPxLabel(space4.px)} (${formatRem(space4.px)})</span></div>
                  <div class="token-row"><span class="token-name">--ds-container-lg</span><span class="token-val">${formatPxLabel((spacingState.containers.find(c => c.id === 'lg') || { px: 1024 }).px)}</span></div>
                  <div class="token-row"><span class="token-name">--ds-shadow-xs / md</span><span class="token-val">Synced from Effect styles</span></div>
                </div>
                <div class="spec-box">
                  <div class="spec-box-label">Icons, Logos &amp; Accessibility</div>
                  <div class="token-row"><span class="token-name">Base Icons</span><span class="token-val">${iconsCatalog.length} icons (24×24px)</span></div>
                  <div class="token-row"><span class="token-name">Brand Logo</span><span class="token-val">${escapeHTML(logosState.brandName || 'De Studio')}</span></div>
                  <div class="token-row"><span class="token-name">Contrast &amp; Focus</span><span class="token-val">&ge; 4.5:1 (AA) • Focus Ring</span></div>
                </div>
              </div>
            </div>
          </div>
        `;
        return;
      }

      if (currentViewMode === 'code') {
        const snippet = escapeHTML(getSampleHTMLForPage(page));
        frame.innerHTML = headerCard + `
          <div class="ds-card">
            <div class="ds-card-header">
              <div class="ds-card-title">HTML Chuẩn — ${page.name}</div>
              <div style="display:flex;gap:8px;align-items:center;">
                <button class="mini-btn" onclick="exportCurrentHTML()">Copy Snippet</button>
                <button class="mini-btn primary" onclick="downloadCurrentPageHTML('${page.id}')">↓ Download HTML</button>
              </div>
            </div>
            <div class="ds-card-body">
              <pre class="code-block">${snippet}</pre>
            </div>
          </div>
        `;
        return;
      }

      // Default: Preview Mode
      if (page.id === 'colors') {
        frame.innerHTML = renderColorsPage();
        return;
      }
      if (page.id === 'typography') {
        frame.innerHTML = renderTypographyPage();
        return;
      }
      if (page.id === 'icons') {
        frame.innerHTML = renderIconsPage();
        return;
      }
      if (page.id === 'logos') {
        frame.innerHTML = renderLogosPage();
        return;
      }
      if (page.id === 'effect-styles') {
        frame.innerHTML = renderEffectsPage();
        return;
      }
      if (page.id === 'grids-spacing') {
        frame.innerHTML = renderGridsSpacingPage();
        return;
      }
      if (page.id === 'buttons') {
        frame.innerHTML = renderButtonsPage();
        return;
      }
      if (page.id === 'button-group') {
        frame.innerHTML = renderButtonGroupPage();
        return;
      }
      if (page.id === 'badges') {
        frame.innerHTML = renderBadgesPage();
        return;
      }
      if (page.id === 'checkboxes') {
        frame.innerHTML = renderCheckboxesPage();
        return;
      }
      if (page.id === 'dropdowns') {
        frame.innerHTML = renderDropdownsPage();
        return;
      }
      if (page.id === 'filter-sort') {
        frame.innerHTML = renderFilterSortPage();
        return;
      }
      if (page.id === 'inputs-text-area') {
        frame.innerHTML = renderInputsTextAreaPage();
        return;
      }
      if (page.id === 'player') {
        frame.innerHTML = renderPlayerPage();
        return;
      }
      if (page.id === 'progress-indicators') {
        frame.innerHTML = renderProgressIndicatorsPage();
        return;
      }
      if (page.id === 'alert') {
        frame.innerHTML = renderAlertPage();
        return;
      }
      if (page.id === 'toggles') {
        frame.innerHTML = renderTogglesPage();
        return;
      }
      if (page.id === 'tooltips') {
        frame.innerHTML = renderTooltipsPage();
        return;
      }
      if (page.id === 'search-filters') {
        frame.innerHTML = renderSearchFiltersPage();
        return;
      }
      if (page.id === 'modals-popup') {
        frame.innerHTML = renderModalsPopupPage();
        return;
      }
      if (page.id === 'navigation') {
        frame.innerHTML = renderNavigationPage();
        return;
      }
      if (page.id === 'pagination') {
        frame.innerHTML = renderPaginationPage();
        return;
      }
      if (page.id === 'section-headers') {
        frame.innerHTML = renderSectionHeadersPage();
        return;
      }
      if (page.id === 'tables') {
        frame.innerHTML = renderTablesPage();
        return;
      }
      if (page.id === 'dashboard') {
        frame.innerHTML = renderDashboardPage();
        return;
      }
      if (page.id === 'header-navigation') {
        frame.innerHTML = renderHeaderNavigationPage();
        return;
      }
      if (page.id === 'login-demo') {
        frame.innerHTML = renderLoginDemoPage();
        return;
      }
      if (page.id === 'demo-dashboard') {
        frame.innerHTML = renderDashboardDemoPage();
        return;
      }
      if (page.id === 'demo-merchant-modal') {
        frame.innerHTML = renderMerchantModalPage();
        return;
      }
      if (page.id === 'demo-history') {
        frame.innerHTML = renderHistoryDemoPage();
        return;
      }
      if (page.id === 'processing-upload') {
        frame.innerHTML = renderProcessingUploadPage();
        return;
      }
      frame.innerHTML = headerCard + getRichPreviewContent(page);
    }

    // =========================================================================