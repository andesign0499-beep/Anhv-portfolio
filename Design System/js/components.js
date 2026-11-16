    // 2G. BASE COMPONENT: BUTTONS ENGINE (4 Variants × 4 States × 5 Sizes)
    // =========================================================================
    const BUTTONS_STORAGE_KEY = 'destudio_buttons_v1';

    const DEFAULT_BUTTONS_STATE = {
      label: 'Button CTA',
      showLeftIcon: true,
      showRightIcon: true,
      leftIconId: '__diamond__',
      rightIconId: '__diamond__',
      fontWeight: 500,
      liveSize: 36
    };

    const BUTTON_SIZES = [
      { px: 28, code: 'xs', vi: '28px (Siêu nhỏ)', iconPx: 14, token: '--ds-text-xs-size' },
      { px: 32, code: 'sm', vi: '32px (Nhỏ)',      iconPx: 15, token: '--ds-text-xs-size' },
      { px: 36, code: 'md', vi: '36px (Chuẩn)',    iconPx: 16, token: '--ds-text-sm-size' },
      { px: 40, code: 'lg', vi: '40px (Lớn)',      iconPx: 17, token: '--ds-text-sm-size' },
      { px: 48, code: 'xl', vi: '48px (Rất lớn)',  iconPx: 19, token: '--ds-text-md-size' }
    ];

    const BUTTON_VARIANTS = [
      {
        id: 'primary',
        cls: 'ds-cta-primary',
        name: 'Primary Solid (Nút Chính Thương hiệu)',
        desc: 'Dùng cho hành động chính (Main CTA) trên màn hình hoặc trong Modal. Dùng --ds-brand-1000 (Default), --ds-brand-1100 (Hover), --ds-brand-1200 + --ds-brand-ring (Focus), --ds-grey-50 (Disabled).'
      },
      {
        id: 'outline',
        cls: 'ds-cta-outline',
        name: 'Secondary Outline (Nút Phụ Viền Brand)',
        desc: 'Dùng cho hành động phụ trợ ngang cấp hoặc đi kèm Primary CTA. Nền trắng viền --ds-brand-800, Hover nền --ds-brand-50.'
      },
      {
        id: 'link',
        cls: 'ds-cta-link',
        name: 'Ghost / Underline CTA (Nút Liên kết Hành động)',
        desc: 'Dùng trong bảng dữ liệu, inline toolbar hoặc hành động ít xâm lấn không cần khung nền.'
      },
      {
        id: 'dark',
        cls: 'ds-cta-dark',
        name: 'Neutral Dark (Nút Tương phản Tối)',
        desc: 'Dùng cho khu vực trung tính cao, nút phụ đặc biệt hoặc trang sáng tạo cần tách khỏi màu Brand (--ds-grey-1000 / 900 / 800).'
      }
    ];

    const BUTTON_STATES = [
      { id: 'default',  cls: 'is-default',  name: 'Default',  vi: 'Mặc định' },
      { id: 'hover',    cls: 'is-hover',    name: 'Hover',    vi: 'Di chuột' },
      { id: 'focus',    cls: 'is-focus',    name: 'Focus',    vi: 'Chọn / Focus' },
      { id: 'disabled', cls: 'is-disabled', name: 'Disabled', vi: 'Vô hiệu' }
    ];

    let buttonsState = loadButtonsState();
    let buttonPickerSide = null; // 'left' | 'right'
    let iconPickerModule = 'button'; // 'button' | 'badge'

    function loadButtonsState() {
      try {
        const raw = localStorage.getItem(BUTTONS_STORAGE_KEY);
        if (!raw) return { ...DEFAULT_BUTTONS_STATE };
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_BUTTONS_STATE, ...parsed };
      } catch (e) {
        return { ...DEFAULT_BUTTONS_STATE };
      }
    }

    function saveButtonsState() {
      try {
        localStorage.setItem(BUTTONS_STORAGE_KEY, JSON.stringify(buttonsState));
      } catch (e) {}
    }

    function getButtonPlaceholderDiamondSvg(size) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 3 21 12 12 21 3 12 12 3"></polygon></svg>`;
    }

    function getArrowRightCrispSvg(size) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    }

    function getStatusDotCrispSvg(size) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="12" r="5"/></svg>`;
    }

    function resolveButtonIconMarkup(iconId, size) {
      if (!iconId || iconId === 'none') return '';
      if (iconId === '__diamond__') return getButtonPlaceholderDiamondSvg(size);
      if (iconId === '__arrow_right__') return getArrowRightCrispSvg(size);
      if (iconId === '__dot__') return getStatusDotCrispSvg(size);
      const ic = iconsCatalog.find(i => i.id === iconId || i.slug === iconId);
      if (ic) return buildIconSvgTag(ic, size, 'currentColor', 'outlined', false);
      return getButtonPlaceholderDiamondSvg(size);
    }

    function getButtonIconDisplayName(iconId) {
      if (!iconId || iconId === 'none') return 'Đã tắt';
      if (iconId === '__diamond__') return 'Diamond (Mặc định)';
      if (iconId === '__arrow_right__') return 'arrow-right';
      if (iconId === '__dot__') return 'status-dot';
      const ic = iconsCatalog.find(i => i.id === iconId || i.slug === iconId);
      return ic ? ic.slug : 'Diamond';
    }

    function renderConfiguredButtonHtml(variantCls, sizeObj, stateObj, interactive = false) {
      const label = escapeHTML(buttonsState.label || 'Button CTA');
      const leftSvg = buttonsState.showLeftIcon ? resolveButtonIconMarkup(buttonsState.leftIconId, sizeObj.iconPx) : '';
      const rightSvg = buttonsState.showRightIcon ? resolveButtonIconMarkup(buttonsState.rightIconId, sizeObj.iconPx) : '';
      const staticCls = interactive ? '' : 'is-static';
      const stateCls = stateObj ? stateObj.cls : '';
      const disabledAttr = (stateObj && stateObj.id === 'disabled') ? 'disabled' : '';
      const weightStyle = buttonsState.fontWeight !== 500 ? `font-weight:${buttonsState.fontWeight};` : '';
      const clickAttr = disabledAttr
        ? ''
        : `onclick="showToast('${escapeHTML(variantCls.replace('ds-cta-', '').toUpperCase())} ${sizeObj.px}px — ${label}')"`;

      return `<button type="button" class="ds-cta ${variantCls} ds-cta-${sizeObj.px} ${stateCls} ${staticCls}" style="${weightStyle}" ${disabledAttr} ${clickAttr}>${leftSvg}<span>${label}</span>${rightSvg}</button>`;
    }

    function updateButtonLabelInput(val) {
      buttonsState.label = val;
      saveButtonsState();
      const target = document.getElementById('canvasFrame');
      if (target && activePageId === 'buttons' && currentViewMode === 'preview') {
        target.querySelectorAll('.ds-cta > span').forEach(sp => {
          sp.textContent = val || 'Button CTA';
        });
      }
    }

    function toggleButtonIconSide(side) {
      if (side === 'left') buttonsState.showLeftIcon = !buttonsState.showLeftIcon;
      else buttonsState.showRightIcon = !buttonsState.showRightIcon;
      saveButtonsState();
      renderCanvas();
    }

    function changeButtonFontWeight(val) {
      buttonsState.fontWeight = Number(val) || 500;
      saveButtonsState();
      renderCanvas();
    }

    function changeButtonLiveSize(px) {
      buttonsState.liveSize = Number(px) || 36;
      saveButtonsState();
      renderCanvas();
    }

    function resetButtonsConfig() {
      buttonsState = { ...DEFAULT_BUTTONS_STATE };
      saveButtonsState();
      renderCanvas();
      showToast('Đã khôi phục cấu hình Button mặc định');
    }

    function openButtonIconPicker(side, targetModule = 'button') {
      buttonPickerSide = side;
      iconPickerModule = targetModule;
      const prefix = targetModule === 'badge' ? 'Badge' : 'Button';
      document.getElementById('bipTitle').textContent = side === 'left'
        ? `Chọn Icon bên Trái (${prefix})`
        : `Chọn Icon bên Phải (${prefix})`;
      document.getElementById('bipSearchInput').value = '';
      renderButtonIconPickerGrid();
      document.getElementById('buttonIconPickerModal').classList.add('open');
      setTimeout(() => document.getElementById('bipSearchInput').focus(), 40);
    }

    function closeButtonIconPicker() {
      document.getElementById('buttonIconPickerModal').classList.remove('open');
      buttonPickerSide = null;
    }

    function selectButtonIconOption(iconId) {
      if (!buttonPickerSide) return;
      const targetState = iconPickerModule === 'badge' ? badgesState : buttonsState;
      if (buttonPickerSide === 'left') {
        if (iconId === 'none') {
          targetState.showLeftIcon = false;
        } else {
          targetState.showLeftIcon = true;
          targetState.leftIconId = iconId;
        }
      } else {
        if (iconId === 'none') {
          targetState.showRightIcon = false;
        } else {
          targetState.showRightIcon = true;
          targetState.rightIconId = iconId;
        }
      }
      if (iconPickerModule === 'badge') saveBadgesState();
      else saveButtonsState();
      closeButtonIconPicker();
      renderCanvas();
      showToast(iconId === 'none' ? 'Đã tắt icon' : `Đã đổi icon thành ${getButtonIconDisplayName(iconId)}`);
    }

    function renderButtonIconPickerGrid() {
      const grid = document.getElementById('bipGridBody');
      if (!grid) return;
      const q = (document.getElementById('bipSearchInput')?.value || '').trim().toLowerCase();
      const targetState = iconPickerModule === 'badge' ? badgesState : buttonsState;
      const currentId = buttonPickerSide === 'left' ? targetState.leftIconId : targetState.rightIconId;

      const presets = [
        { id: '__arrow_right__', label: 'arrow-right', svg: getArrowRightCrispSvg(20), kw: 'arrow right mui ten' },
        { id: '__dot__', label: 'status-dot', svg: getStatusDotCrispSvg(20), kw: 'dot status cham tron' },
        { id: '__diamond__', label: 'diamond', svg: getButtonPlaceholderDiamondSvg(20), kw: 'diamond mac dinh' }
      ].filter(p => !q || p.kw.includes(q) || p.label.includes(q))
       .map(p => `
        <button type="button" class="btn-picker-item ${currentId === p.id ? 'selected' : ''}" onclick="selectButtonIconOption('${p.id}')" title="${p.label}">
          ${p.svg}
          <span class="btn-picker-slug">${p.label}</span>
        </button>`).join('');

      const matched = iconsCatalog.filter(ic =>
        !q || (ic.slug || '').toLowerCase().includes(q) || (ic.vi || '').toLowerCase().includes(q)
      ).slice(0, 70);

      grid.innerHTML = presets + matched.map(ic => `
        <button type="button" class="btn-picker-item ${currentId === ic.id ? 'selected' : ''}" onclick="selectButtonIconOption('${ic.id}')" title="${escapeHTML(ic.vi)} (${escapeHTML(ic.slug)})">
          ${buildIconSvgTag(ic, 20, 'currentColor', 'outlined', false)}
          <span class="btn-picker-slug">${escapeHTML(ic.slug)}</span>
        </button>
      `).join('');
    }

    function buildButtonsHTMLSnippet(variantFilterId) {
      const label = escapeHTML(buttonsState.label || 'Button CTA');
      const leftSvg = buttonsState.showLeftIcon ? resolveButtonIconMarkup(buttonsState.leftIconId, 16) : '';
      const rightSvg = buttonsState.showRightIcon ? resolveButtonIconMarkup(buttonsState.rightIconId, 16) : '';
      const varsToEmit = variantFilterId
        ? BUTTON_VARIANTS.filter(v => v.id === variantFilterId)
        : BUTTON_VARIANTS;

      const htmlExamples = varsToEmit.map(v => {
        const sizeList = variantFilterId ? BUTTON_SIZES : [BUTTON_SIZES[2]];
        return `<!-- ${v.name} -->\n` + sizeList.map(sz =>
          `<button type="button" class="ds-cta ${v.cls} ds-cta-${sz.px}">\n  ${leftSvg ? leftSvg + '\n  ' : ''}<span>${label}</span>${rightSvg ? '\n  ' + rightSvg : ''}\n</button>`
        ).join('\n');
      }).join('\n\n');

      const cssSnippet = `/* CSS Tokens liên kết từ Foundations (Colors, Typography, Spacing, Effect styles) */
.ds-cta {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--ds-font-sans); font-weight: ${buttonsState.fontWeight}; line-height: 1;
  border: 1px solid transparent; cursor: pointer; transition: all 0.14s ease;
}
.ds-cta-28 { height: 28px; padding: 0 10px; gap:4px; border-radius: 6px; font-size: var(--ds-text-xs-size); }
.ds-cta-32 { height: 32px; padding: 0 12px; gap:8px; border-radius: 6px; font-size: 13px; }
.ds-cta-36 { height: 36px; padding: 0 14px; gap:8px; border-radius: 7px; font-size: var(--ds-text-sm-size); }
.ds-cta-40 { height: 40px; padding: 0 16px; gap: 8px; border-radius: 8px; font-size: var(--ds-text-sm-size); }
.ds-cta-48 { height: 48px; padding: 0 20px; gap: 8px; border-radius: 8px; font-size: var(--ds-text-md-size); }
.ds-cta-primary { background: var(--ds-brand-1000); color: #fff; box-shadow: var(--ds-shadow-xs); }
.ds-cta-primary:hover { background: var(--ds-brand-1100); }
.ds-cta-primary:focus-visible { background: var(--ds-brand-1200); box-shadow: 0 0 0 3.5px var(--ds-brand-ring); }
.ds-cta-outline { background: #fff; color: var(--ds-brand-1000); border-color: var(--ds-brand-800); }
.ds-cta-outline:hover { background: var(--ds-brand-50); border-color: var(--ds-brand-1000); }
.ds-cta-link { background: transparent; color: var(--ds-brand-1000); text-decoration: underline; }
.ds-cta-link:hover { color: var(--ds-brand-1100); text-decoration: none; }
.ds-cta-dark { background: var(--ds-grey-1000); color: #fff; }
.ds-cta-dark:hover { background: var(--ds-grey-900); }`;

      return `${htmlExamples}\n\n/* === CSS === */\n${cssSnippet}`;
    }

    function renderButtonsPage() {
      const liveSzObj = BUTTON_SIZES.find(s => s.px === buttonsState.liveSize) || BUTTON_SIZES[2];
      const leftBtnIconPreview = resolveButtonIconMarkup(buttonsState.leftIconId, 14);
      const rightBtnIconPreview = resolveButtonIconMarkup(buttonsState.rightIconId, 14);

      return `
        <div class="buttons-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">4 Nhóm Biến thể × 4 Trạng thái × 5 Kích thước (28 / 32 / 36 / 40 / 48px)</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="selectPage('colors')" title="Xem các mã màu vừa khai báo cho Buttons">Xem màu trong Colors →</button>
              <button class="btn-ds" type="button" onclick="resetButtonsConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildButtonsHTMLSnippet(), 'Đã copy toàn bộ HTML + CSS Buttons')">Copy HTML &amp; CSS</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / BUTTONS</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Hệ thống Nút bấm (Buttons Component)</h1>
            <p style="font-size:13.5px; color:#475569; max-width:820px; line-height:1.6;">
              Sử dụng trực tiếp bảng màu từ <strong>Colors</strong> (<code>--ds-brand-1000/1100/1200/ring</code>, <code>--ds-grey-1000/900/800/300</code>), hệ chữ từ <strong>Typography</strong> (<code>${escapeHTML(typoState.fontFamily)}</code>) và biểu tượng từ <strong>Icons</strong> để chuẩn hóa 5 kích thước CTA: <strong>28px, 32px, 36px, 40px, 48px</strong>.
            </p>
          </div>

          <!-- BẢNG ĐIỀU KHIỂN TÙY CHỈNH TEXT & ICON TRÁI / PHẢI -->
          <div class="btn-config-bar">
            <div class="form-field">
              <label>Nhãn nút (Chỉnh sửa Text trực tiếp)</label>
              <input type="text" class="ds-input" value="${escapeHTML(buttonsState.label)}" placeholder="Nhập nhãn nút (VD: Đăng ký ngay)" oninput="updateButtonLabelInput(this.value)" />
            </div>

            <div class="form-field">
              <label>Icon Trái (Left Icon)</label>
              <div class="btn-icon-control-group">
                <button type="button" class="btn-icon-toggle-pill ${buttonsState.showLeftIcon ? 'active' : ''}" onclick="toggleButtonIconSide('left')">
                  ${buttonsState.showLeftIcon ? '● Bật' : '○ Tắt'}
                </button>
                <button type="button" class="btn-icon-pick-trigger" onclick="openButtonIconPicker('left')" title="Thay đổi Icon bên trái">
                  <span style="display:inline-flex; align-items:center; gap:8px; min-width:0;">
                    <span style="display:inline-flex; color:var(--brand-primary); flex-shrink:0;">${leftBtnIconPreview}</span>
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(getButtonIconDisplayName(buttonsState.leftIconId))}</span>
                  </span>
                  <span style="color:var(--text-muted); font-size:10px;">▾</span>
                </button>
              </div>
            </div>

            <div class="form-field">
              <label>Icon Phải (Right Icon)</label>
              <div class="btn-icon-control-group">
                <button type="button" class="btn-icon-toggle-pill ${buttonsState.showRightIcon ? 'active' : ''}" onclick="toggleButtonIconSide('right')">
                  ${buttonsState.showRightIcon ? '● Bật' : '○ Tắt'}
                </button>
                <button type="button" class="btn-icon-pick-trigger" onclick="openButtonIconPicker('right')" title="Thay đổi Icon bên phải">
                  <span style="display:inline-flex; align-items:center; gap:8px; min-width:0;">
                    <span style="display:inline-flex; color:var(--brand-primary); flex-shrink:0;">${rightBtnIconPreview}</span>
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(getButtonIconDisplayName(buttonsState.rightIconId))}</span>
                  </span>
                  <span style="color:var(--text-muted); font-size:10px;">▾</span>
                </button>
              </div>
            </div>

            <div class="form-field">
              <label>Độ đậm (Weight)</label>
              <select class="ds-input" style="width:100%;" onchange="changeButtonFontWeight(this.value)">
                <option value="400" ${buttonsState.fontWeight === 400 ? 'selected' : ''}>Regular (400)</option>
                <option value="500" ${buttonsState.fontWeight === 500 ? 'selected' : ''}>Medium (500)</option>
                <option value="600" ${buttonsState.fontWeight === 600 ? 'selected' : ''}>Semibold (600)</option>
                <option value="700" ${buttonsState.fontWeight === 700 ? 'selected' : ''}>Bold (700)</option>
              </select>
            </div>
          </div>

          <!-- LIVE INTERACTIVE SANDBOX -->
          <div class="btn-group-card" style="background:#fafbfd;">
            <div class="btn-group-head">
              <div>
                <div style="font-size:13px; font-weight:700; color:var(--text-primary);">⚡ Thử nghiệm Tương tác Thực tế (Live Hover / Keyboard Focus / Click)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Di chuột hoặc bấm phím <code>Tab</code> để kiểm tra phản hồi Hover, Focus Ring thật trên các nút.</div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; color:var(--text-muted); font-weight:600;">Kích thước:</span>
                ${BUTTON_SIZES.map(s => `
                  <button type="button" class="typo-edit-pill ${buttonsState.liveSize === s.px ? 'active' : ''}" style="${buttonsState.liveSize === s.px ? 'background:var(--brand-soft); color:var(--brand-primary); border-color:var(--brand-border); font-weight:700;' : ''}" onclick="changeButtonLiveSize(${s.px})">${s.px}px</button>
                `).join('')}
              </div>
            </div>
            <div style="padding:16px 20px; display:flex; align-items:center; justify-content:space-around; gap:16px; flex-wrap:wrap;">
              ${BUTTON_VARIANTS.map(v => `
                <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
                  ${renderConfiguredButtonHtml(v.cls, liveSzObj, null, true)}
                  <span style="font-size:10.5px; color:var(--text-muted); font-family:var(--font-mono);">${v.id} • ${liveSzObj.px}px</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- 4 VARIANT MATRICES (5 SIZES × 4 STATES) -->
          ${BUTTON_VARIANTS.map(variant => `
            <div class="btn-group-card">
              <div class="btn-group-head">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">${variant.name}</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">${variant.desc}</div>
                </div>
                <button type="button" class="btn-ds" onclick="copyText(buildButtonsHTMLSnippet('${variant.id}'), 'Đã copy mã ${variant.id}')">Copy nhóm này</button>
              </div>
              <div class="btn-matrix-scroll">
                <div class="btn-matrix-grid">
                  <div style="font-size:11px; font-weight:700; color:var(--text-muted); padding-bottom:4px; border-bottom:1px dashed #e2e8f0;">Trạng thái</div>
                  ${BUTTON_SIZES.map(sz => `<div class="btn-matrix-colhead">${sz.px}px<br/><span style="font-weight:500; font-size:9.5px; font-family:var(--ds-font-sans);">${escapeHTML(sz.vi.replace(/^\d+px\s*/, ''))}</span></div>`).join('')}

                  ${BUTTON_STATES.map(st => `
                    <div class="btn-matrix-rowlabel">
                      <span>${st.name}</span>
                      <span class="btn-matrix-rowsub">${st.vi}</span>
                    </div>
                    ${BUTTON_SIZES.map(sz => `
                      <div class="btn-matrix-cell">
                        ${renderConfiguredButtonHtml(variant.cls, sz, st, false)}
                      </div>
                    `).join('')}
                  `).join('')}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // =========================================================================
    // 2H. BASE COMPONENT: BUTTON GROUP ENGINE (Text, Icon + Text, Icon Only)
    // =========================================================================
    const BUTTON_GROUP_STORAGE_KEY = 'destudio_button_group_v1';

    const DEFAULT_BTN_GROUP_STATE = {
      sizePx: 36,
      mode: 'single', // 'single' (mini-tab) | 'toolbar' (independent click)
      labels: ['Text', 'Text', 'Text'],
      activeIndex: 0,
      presetDemoRange: 1 // 0: 24h | 1: 7 ngày | 2: 30 ngày | 3: 12 tháng
    };

    let btnGroupState = loadBtnGroupState();

    function loadBtnGroupState() {
      try {
        const raw = localStorage.getItem(BUTTON_GROUP_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_BTN_GROUP_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_BTN_GROUP_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_BTN_GROUP_STATE));
      }
    }

    function saveBtnGroupState() {
      try {
        localStorage.setItem(BUTTON_GROUP_STORAGE_KEY, JSON.stringify(btnGroupState));
      } catch (e) {}
    }

    function getBtnGroupCircleSvg(size = 16) {
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>`;
    }

    function getBtnGroupNavIconSvg(kind, size = 16) {
      if (kind === 'left') {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`;
      }
      if (kind === 'plus') {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
      }
      if (kind === 'check') {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
      }
      if (kind === 'chevron-down') {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`;
      }
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
    }

    function setBtnGroupSize(px) {
      btnGroupState.sizePx = Number(px) || 36;
      saveBtnGroupState();
      renderCanvas();
    }

    function setBtnGroupMode(mode) {
      btnGroupState.mode = mode;
      saveBtnGroupState();
      renderCanvas();
    }

    function clickBtnGroupSegment(groupKind, idx, labelText) {
      if (btnGroupState.mode === 'single') {
        btnGroupState.activeIndex = idx;
        saveBtnGroupState();
        renderCanvas();
      }
      showToast(`${groupKind}: đã chọn "${labelText}"`);
    }

    function setBtnGroupRangeDemo(idx, label) {
      btnGroupState.presetDemoRange = idx;
      saveBtnGroupState();
      renderCanvas();
      showToast(`Khoảng thời gian: ${label}`);
    }

    function updateBtnGroupLabelsInput(idx, val) {
      btnGroupState.labels[idx] = val;
      saveBtnGroupState();
      renderCanvas();
    }

    function resetBtnGroupConfig() {
      btnGroupState = JSON.parse(JSON.stringify(DEFAULT_BTN_GROUP_STATE));
      saveBtnGroupState();
      renderCanvas();
      showToast('Đã khôi phục cài đặt Button Group mặc định');
    }

    function buildBtnGroupHTMLSnippet() {
      const sz = btnGroupState.sizePx || 36;
      const lbls = btnGroupState.labels.map(x => escapeHTML(x || 'Text'));
      return `<!-- 1. Text Only (Chỉ văn bản — dùng cho Mini-tabs / Bộ lọc ngày) -->
<div class="ds-btn-group sz-${sz}" role="group" aria-label="Text button group">
  <button type="button" class="ds-btn-group-item is-active">${lbls[0]}</button>
  <button type="button" class="ds-btn-group-item">${lbls[1]}</button>
  <button type="button" class="ds-btn-group-item">${lbls[2]}</button>
</div>

<!-- 2. Icon + Text (Kèm Icon bên trái) -->
<div class="ds-btn-group sz-${sz}" role="group" aria-label="Icon text button group">
  <button type="button" class="ds-btn-group-item">${getBtnGroupCircleSvg(16)}<span>${lbls[0]}</span></button>
  <button type="button" class="ds-btn-group-item">${getBtnGroupCircleSvg(16)}<span>${lbls[1]}</span></button>
  <button type="button" class="ds-btn-group-item">${getBtnGroupCircleSvg(16)}<span>${lbls[2]}</span></button>
</div>

<!-- 3. Icon Only (Chỉ biểu tượng — Toolbar / Điều hướng / Stepper) -->
<div class="ds-btn-group sz-${sz}" role="group" aria-label="Icon toolbar">
  <button type="button" class="ds-btn-group-item icon-only" aria-label="Trước">${getBtnGroupNavIconSvg('left', 16)}</button>
  <button type="button" class="ds-btn-group-item icon-only" aria-label="Thêm">${getBtnGroupNavIconSvg('plus', 16)}</button>
  <button type="button" class="ds-btn-group-item icon-only" aria-label="Sau">${getBtnGroupNavIconSvg('right', 16)}</button>
</div>`;
    }

    function renderButtonGroupPage() {
      const sz = btnGroupState.sizePx || 36;
      const iconPx = sz <= 32 ? 14 : sz >= 48 ? 18 : 16;
      const lbls = btnGroupState.labels;
      const isSingle = btnGroupState.mode === 'single';
      const ranges = ['24 giờ', '7 ngày', '30 ngày', '12 tháng'];

      return `
        <div class="button-group-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">3 Biến thể chuẩn Figma • 5 Trạng thái • 5 Kích thước (28–48px)</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetBtnGroupConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildBtnGroupHTMLSnippet(), 'Đã copy HTML Button Groups')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:20px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / BUTTON GROUP</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Nhóm Nút bấm (Button Groups)</h1>
            <p style="font-size:13.5px; color:#475569; max-width:820px; line-height:1.6;">
              <strong>Nhóm nút bấm (Button groups)</strong> kết hợp nhiều nút liền kề thành các thanh công cụ (Toolbar) hoặc nút tách (Split button) cho những thành phần giao diện phức tạp hơn. Thành phần này cũng rất hữu ích khi đóng vai trò như các <strong>“tab” thu gọn</strong> trên UI — ví dụ như chuyển đổi giữa các khoảng thời gian thống kê hoặc chế độ hiển thị danh sách/lưới.
            </p>
          </div>

          <!-- BỘ CẤU HÌNH TƯƠNG TÁC NHANH -->
          <div class="btn-config-bar" style="grid-template-columns: 1fr 1fr 1fr auto;">
            <div class="form-field">
              <label>Nhãn nút 1 / 2 / 3 (Thử text thật)</label>
              <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
                ${[0, 1, 2].map(i => `
                  <input type="text" class="ds-input" style="height:34px; font-size:12px;" value="${escapeHTML(lbls[i])}" oninput="updateBtnGroupLabelsInput(${i}, this.value)" />
                `).join('')}
              </div>
            </div>

            <div class="form-field">
              <label>Kích thước chuẩn (Synced Buttons)</label>
              <div style="display:flex; gap:4px; flex-wrap:wrap;">
                ${[28, 32, 36, 40, 48].map(s => `
                  <button type="button" class="btn-icon-toggle-pill ${sz === s ? 'active' : ''}" style="height:34px; padding:0 9px;" onclick="setBtnGroupSize(${s})">${s}px</button>
                `).join('')}
              </div>
            </div>

            <div class="form-field">
              <label>Chế độ tương tác khi Click</label>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn-icon-toggle-pill ${isSingle ? 'active' : ''}" style="height:34px;" onclick="setBtnGroupMode('single')">Mini-Tab (Active)</button>
                <button type="button" class="btn-icon-toggle-pill ${!isSingle ? 'active' : ''}" style="height:34px;" onclick="setBtnGroupMode('toolbar')">Toolbar (Click rời)</button>
              </div>
            </div>

            <div class="form-field">
              <label>Trạng thái Active</label>
              <div style="height:34px; display:flex; align-items:center; font-size:12px; font-family:var(--font-mono); color:var(--brand-primary); font-weight:600;">
                ${isSingle ? `Mục #${btnGroupState.activeIndex + 1}` : 'Tự do'}
              </div>
            </div>
          </div>

          <!-- 1. KHUNG COMPONENT SET CHUẨN FIGMA (GIỐNG ẢNH MẪU) -->
          <div class="btn-group-card">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">1. Bộ Biến thể Chuẩn Figma (Component Set — 3 Cấu hình cốt lõi)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Click trực tiếp vào từng nút bên trong khung nét đứt tím để kiểm tra trạng thái Hover, Active và Focus Ring.</div>
              </div>
              <span class="ds-badge ds-badge-blue">Synced Colors + Icons + Spacing</span>
            </div>

            <div style="padding:16px; display:grid; grid-template-columns:minmax(280px, auto) 1fr; gap:20px; align-items:start;">
              <div class="figma-purple-frame">
                <!-- Variant 1: Text Only -->
                <div class="ds-btn-group sz-${sz}" role="group" aria-label="Text only group">
                  ${lbls.map((txt, i) => `
                    <button type="button" class="ds-btn-group-item ${isSingle && btnGroupState.activeIndex === i ? 'is-active' : ''}" onclick="clickBtnGroupSegment('Text Only', ${i}, '${escapeHTML(txt)}')">${escapeHTML(txt || 'Text')}</button>
                  `).join('')}
                </div>

                <!-- Variant 2: Icon + Text -->
                <div class="ds-btn-group sz-${sz}" role="group" aria-label="Icon text group">
                  ${lbls.map((txt, i) => `
                    <button type="button" class="ds-btn-group-item ${isSingle && btnGroupState.activeIndex === i ? 'is-active' : ''}" onclick="clickBtnGroupSegment('Icon + Text', ${i}, '${escapeHTML(txt)}')">
                      ${getBtnGroupCircleSvg(iconPx)}
                      <span>${escapeHTML(txt || 'Text')}</span>
                    </button>
                  `).join('')}
                </div>

                <!-- Variant 3: Icon Only -->
                <div class="ds-btn-group sz-${sz}" role="group" aria-label="Icon only toolbar">
                  <button type="button" class="ds-btn-group-item icon-only ${isSingle && btnGroupState.activeIndex === 0 ? 'is-active' : ''}" onclick="clickBtnGroupSegment('Icon Only', 0, 'Quay lại')" title="Quay lại">
                    ${getBtnGroupNavIconSvg('left', iconPx)}
                  </button>
                  <button type="button" class="ds-btn-group-item icon-only ${isSingle && btnGroupState.activeIndex === 1 ? 'is-active' : ''}" onclick="clickBtnGroupSegment('Icon Only', 1, 'Thêm mới')" title="Thêm mới">
                    ${getBtnGroupNavIconSvg('plus', iconPx)}
                  </button>
                  <button type="button" class="ds-btn-group-item icon-only ${isSingle && btnGroupState.activeIndex === 2 ? 'is-active' : ''}" onclick="clickBtnGroupSegment('Icon Only', 2, 'Tiếp theo')" title="Tiếp theo">
                    ${getBtnGroupNavIconSvg('right', iconPx)}
                  </button>
                </div>
              </div>

              <!-- Giải thích 3 biến thể cạnh khung Figma -->
              <div style="display:flex; flex-direction:column; gap:12px;">
                <div style="padding:12px 16px; border-radius:8px; border:1px solid var(--border-default); background:#fafbfd;">
                  <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">① Text Only (Chỉ văn bản)</div>
                  <div style="font-size:12px; color:var(--text-secondary); margin-top:3px; line-height:1.5;">
                    Dùng làm thanh chuyển đổi nhanh (Mini-tabs) như chọn khoảng thời gian (<code>24 giờ | 7 ngày | 30 ngày</code>), chế độ tính phí (<code>Tháng | Năm</code>) hoặc nhóm bộ lọc gọn.
                  </div>
                </div>
                <div style="padding:12px 16px; border-radius:8px; border:1px solid var(--border-default); background:#fafbfd;">
                  <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">② Icon + Text (Icon Trái + Văn bản)</div>
                  <div style="font-size:12px; color:var(--text-secondary); margin-top:3px; line-height:1.5;">
                    Tăng khả năng nhận diện ngữ nghĩa khi các nút có tính năng ngang hàng trong Dashboard (VD: <code>Xuất PDF | Chia sẻ | Sao chép link</code> hoặc chọn loại biểu đồ). Icon dùng kích thước <code>14–18px</code> theo độ cao nút.
                  </div>
                </div>
                <div style="padding:12px 16px; border-radius:8px; border:1px solid var(--border-default); background:#fafbfd;">
                  <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">③ Icon Only (Chỉ Icon — Toolbar / Điều hướng)</div>
                  <div style="font-size:12px; color:var(--text-secondary); margin-top:3px; line-height:1.5;">
                    Dành cho thanh công cụ soạn thảo, phóng to/thu nhỏ bản đồ, chuyển trang bảng dữ liệu (<code>← | + | →</code>) hoặc chuyển chế độ xem <code>Bảng / Lưới</code>. Bắt buộc kèm <code>title</code> / <code>aria-label</code>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 2. MA TRẬN TRẠNG THÁI CỦA BUTTON GROUP -->
          <div class="btn-group-card">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">2. Đặc tả Trạng thái Từng Nút trong Nhóm (Item States)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Đường viền chồng <code>margin-left: -1px</code> giúp nét ngăn giữa luôn sắc mảnh <code>1px</code>; nút Hover/Active/Focus tự nâng <code>z-index</code> lên trên để không bị che viền.</div>
              </div>
            </div>
            <div style="padding:12px 18px;">
              <div class="bg-variants-table">
                <div>
                  <div style="font-weight:700; font-size:12.5px; color:var(--text-primary);">Default &amp; Hover</div>
                  <div style="font-size:11px; color:var(--text-muted);">Mặc định &amp; Di chuột</div>
                </div>
                <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                  <div class="ds-btn-group sz-36">
                    <button type="button" class="ds-btn-group-item is-static">Mặc định</button>
                    <button type="button" class="ds-btn-group-item is-hover is-static">Đang Hover</button>
                    <button type="button" class="ds-btn-group-item is-static">Mặc định</button>
                  </div>
                  <span style="font-size:12px; color:var(--text-secondary);">Default nền trắng, chữ <code>--ds-grey-1000</code>; Hover chuyển nền <code>--ds-grey-25</code>.</span>
                </div>
              </div>

              <div class="bg-variants-table">
                <div>
                  <div style="font-weight:700; font-size:12.5px; color:var(--text-primary);">Selected / Active</div>
                  <div style="font-size:11px; color:var(--text-muted);">Đang được chọn (Tab)</div>
                </div>
                <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                  <div class="ds-btn-group sz-36">
                    <button type="button" class="ds-btn-group-item is-active is-static">Đang chọn</button>
                    <button type="button" class="ds-btn-group-item is-static">Tùy chọn 2</button>
                    <button type="button" class="ds-btn-group-item is-static">Tùy chọn 3</button>
                  </div>
                  <span style="font-size:12px; color:var(--text-secondary);">Nền <code>--ds-brand-50</code>, chữ <code>--ds-brand-1000</code>, viền <code>--ds-brand-800</code> (<code>z-index: 3</code>).</span>
                </div>
              </div>

              <div class="bg-variants-table">
                <div>
                  <div style="font-weight:700; font-size:12.5px; color:var(--text-primary);">Focus Visible</div>
                  <div style="font-size:11px; color:var(--text-muted);">Điều hướng bàn phím</div>
                </div>
                <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                  <div class="ds-btn-group sz-36">
                    <button type="button" class="ds-btn-group-item is-static">Mục 1</button>
                    <button type="button" class="ds-btn-group-item is-focus is-static">Đang Focus</button>
                    <button type="button" class="ds-btn-group-item is-static">Mục 3</button>
                  </div>
                  <span style="font-size:12px; color:var(--text-secondary);">Viền <code>--ds-brand-1000</code> + vòng sáng <code>--ds-brand-ring</code> (<code>z-index: 4</code>).</span>
                </div>
              </div>

              <div class="bg-variants-table">
                <div>
                  <div style="font-weight:700; font-size:12.5px; color:var(--text-primary);">Disabled</div>
                  <div style="font-size:11px; color:var(--text-muted);">Vô hiệu hóa mục lẻ / toàn nhóm</div>
                </div>
                <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                  <div class="ds-btn-group sz-36">
                    <button type="button" class="ds-btn-group-item is-static">Khả dụng</button>
                    <button type="button" class="ds-btn-group-item is-disabled is-static" disabled>Khóa</button>
                    <button type="button" class="ds-btn-group-item is-static">Khả dụng</button>
                  </div>
                  <span style="font-size:12px; color:var(--text-secondary);">Nền <code>--ds-grey-25</code>, chữ <code>--ds-grey-300</code>, viền <code>--ds-grey-100</code>.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. VÍ DỤ SAAS THỰC TẾ & HƯỚNG DẪN SỬ DỤNG -->
          <div class="btn-group-card">
            <div class="btn-group-head">
              <div style="font-size:14px; font-weight:700; color:var(--text-primary);">3. Hướng dẫn Sử dụng &amp; Ứng dụng thực tế trong SaaS</div>
            </div>
            <div style="padding:16px; display:flex; flex-direction:column; gap:16px;">
              <!-- Demo Date range + Toolbar + Split Button -->
              <div style="padding:16px 16px; border-radius:8px; border:1px solid var(--border-default); background:#f8fafc; display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap;">
                <div>
                  <div style="font-size:11.5px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">VÍ DỤ: BỘ LỌC KHOẢNG THỜI GIAN BÁO CÁO (MINI-TAB)</div>
                  <div class="ds-btn-group sz-36">
                    ${ranges.map((r, idx) => `
                      <button type="button" class="ds-btn-group-item ${btnGroupState.presetDemoRange === idx ? 'is-active' : ''}" onclick="setBtnGroupRangeDemo(${idx}, '${r}')">${r}</button>
                    `).join('')}
                  </div>
                </div>
                <div>
                  <div style="font-size:11.5px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">VÍ DỤ: SPLIT BUTTON (NÚT TÁCH HÀNH ĐỘNG)</div>
                  <div class="ds-btn-group sz-36">
                    <button type="button" class="ds-btn-group-item" onclick="showToast('Đã lưu bản nháp!')">
                      ${getBtnGroupNavIconSvg('check', 15)}
                      <span>Lưu thay đổi</span>
                    </button>
                    <button type="button" class="ds-btn-group-item icon-only" onclick="showToast('Mở menu tùy chọn lưu khác...')" title="Tùy chọn khác">
                      ${getBtnGroupNavIconSvg('chevron-down', 15)}
                    </button>
                  </div>
                </div>
              </div>

              <!-- Dos & Don'ts -->
              <div class="logo-dos-grid">
                <div class="logo-do-card">
                  <div class="logo-do-badge ok">✓ NÊN DÙNG (Best Practices)</div>
                  <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                    <li>Gom <strong>2 đến 5 nút</strong> có cùng nhóm ngữ cảnh (VD: bộ lọc thời gian, chế độ xem Bảng/Lịch, căn lề văn bản).</li>
                    <li>Dùng nhãn thật ngắn gọn (<strong>1–2 từ</strong>) để không bị xuống dòng hay tràn màn hình nhỏ.</li>
                    <li>Với nhóm chỉ có Icon (<code>Icon Only</code>), luôn gắn tooltip hoặc <code>aria-label</code> rõ nghĩa.</li>
                    <li>Chỉ bo tròn góc ngoài ở nút đầu (<code>:first-child</code>) và nút cuối (<code>:last-child</code>).</li>
                  </ul>
                </div>

                <div class="logo-do-card">
                  <div class="logo-do-badge bad">✕ TRÁNH DÙNG (Anti-Patterns)</div>
                  <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                    <li>Không nhồi quá <strong>6 nút</strong> vào một Button Group khiến thanh bị rớt dòng hai hàng lộn xộn.</li>
                    <li>Không trộn lẫn nút <strong>Primary Solid xanh đậm</strong> cùng các nút trắng thường vào một nhóm ngang hàng (trừ Split Button).</li>
                    <li>Không thay thế thanh điều hướng chính (Sidebar/Topbar Tabs) của toàn trang bằng Button Group.</li>
                    <li>Không trộn kích thước chiều cao khác nhau trong cùng một nhóm.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2I. BASE COMPONENT: BADGES ENGINE (Soft & Solid × 8 Tones × 22..36px)
    // =========================================================================
    const BADGES_STORAGE_KEY = 'destudio_badges_v1';

    const DEFAULT_BADGES_STATE = {
      label: 'Label',
      showLeftIcon: false,
      showRightIcon: true,
      leftIconId: '__dot__',
      rightIconId: '__arrow_right__',
      shape: 'rounded' // 'rounded' | 'pill'
    };

    const BADGE_SIZES = [
      { px: 22, code: 'xxs', vi: '22px (Siêu nhỏ)', iconPx: 12 },
      { px: 26, code: 'xs',  vi: '26px (Nhỏ)',      iconPx: 13 },
      { px: 30, code: 'sm',  vi: '30px (Vừa)',      iconPx: 14 },
      { px: 32, code: 'md',  vi: '32px (Chuẩn)',    iconPx: 15 },
      { px: 36, code: 'lg',  vi: '36px (Lớn)',      iconPx: 16 }
    ];

    const BADGE_TONES = [
      { id: 'orange',   name: 'Orange',   vi: 'Cam nổi bật',  token: '--ds-orange-1000' },
      { id: 'grey',     name: 'Neutral',  vi: 'Xám trung tính', token: '--ds-grey-1000' },
      { id: 'disabled', name: 'Disabled', vi: 'Vô hiệu hóa',   token: '--ds-grey-300' },
      { id: 'red',      name: 'Red',      vi: 'Đỏ / Lỗi',      token: '--ds-red-1000' },
      { id: 'amber',    name: 'Amber',    vi: 'Vàng cảnh báo', token: '--ds-amber-1000' },
      { id: 'green',    name: 'Green',    vi: 'Xanh thành công', token: '--ds-green-1000' },
      { id: 'blue',     name: 'Brand',    vi: 'Xanh thương hiệu', token: '--ds-brand-1000' },
      { id: 'purple',   name: 'Purple',   vi: 'Tím AI / Pro',  token: '--ds-purple-1000' }
    ];

    let badgesState = loadBadgesState();

    function loadBadgesState() {
      try {
        const raw = localStorage.getItem(BADGES_STORAGE_KEY);
        if (!raw) return { ...DEFAULT_BADGES_STATE };
        return { ...DEFAULT_BADGES_STATE, ...JSON.parse(raw) };
      } catch (e) {
        return { ...DEFAULT_BADGES_STATE };
      }
    }

    function saveBadgesState() {
      try {
        localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(badgesState));
      } catch (e) {}
    }

    function renderConfiguredBadgeHtml(styleKind, toneObj, szObj) {
      const label = escapeHTML(badgesState.label || 'Label');
      const leftSvg = badgesState.showLeftIcon ? resolveButtonIconMarkup(badgesState.leftIconId, szObj.iconPx) : '';
      const rightSvg = badgesState.showRightIcon ? resolveButtonIconMarkup(badgesState.rightIconId, szObj.iconPx) : '';
      const pillCls = badgesState.shape === 'pill' ? 'is-pill' : '';
      const toneCls = `ds-badge-${styleKind}-${toneObj.id}`;
      const isDisabled = toneObj.id === 'disabled';
      const clickAttr = isDisabled
        ? ''
        : `onclick="showToast('${styleKind.toUpperCase()} ${toneObj.name} (${szObj.px}px) — ${label}')"`;

      return `<span class="ds-badge-comp ds-badge-${szObj.px} ${toneCls} ${pillCls}" ${clickAttr}>${leftSvg}<span>${label}</span>${rightSvg}</span>`;
    }

    function updateBadgeLabelInput(val) {
      badgesState.label = val;
      saveBadgesState();
      const target = document.getElementById('canvasFrame');
      if (target && activePageId === 'badges' && currentViewMode === 'preview') {
        target.querySelectorAll('.ds-badge-comp > span').forEach(sp => {
          sp.textContent = val || 'Label';
        });
      }
    }

    function toggleBadgeIconSide(side) {
      if (side === 'left') badgesState.showLeftIcon = !badgesState.showLeftIcon;
      else badgesState.showRightIcon = !badgesState.showRightIcon;
      saveBadgesState();
      renderCanvas();
    }

    function setBadgeShape(shape) {
      badgesState.shape = shape;
      saveBadgesState();
      renderCanvas();
    }

    function resetBadgesConfig() {
      badgesState = { ...DEFAULT_BADGES_STATE };
      saveBadgesState();
      renderCanvas();
      showToast('Đã khôi phục cấu hình Badges mặc định');
    }

    function buildBadgesHTMLSnippet(styleFilter) {
      const label = escapeHTML(badgesState.label || 'Label');
      const leftSvg = badgesState.showLeftIcon ? resolveButtonIconMarkup(badgesState.leftIconId, 14) : '';
      const rightSvg = badgesState.showRightIcon ? resolveButtonIconMarkup(badgesState.rightIconId, 14) : '';
      const pillCls = badgesState.shape === 'pill' ? ' is-pill' : '';
      const stylesToEmit = styleFilter ? [styleFilter] : ['soft', 'solid'];

      const blocks = stylesToEmit.map(st => {
        const heading = st === 'soft' ? '<!-- Badges Soft / Tinted + Border (22 / 26 / 30 / 32 / 36px) -->' : '<!-- Badges Solid Filled -->';
        return heading + '\n' + BADGE_TONES.map(t =>
          `<span class="ds-badge-comp ds-badge-30 ds-badge-${st}-${t.id}${pillCls}">${leftSvg}<span>${label} (${t.name})</span>${rightSvg}</span>`
        ).join('\n');
      }).join('\n\n');

      return blocks + `\n\n/* === CSS Sizes (22 / 26 / 30 / 32 / 36px) & Foundation Colors === */
.ds-badge-22 { height: 22px; padding: 0 7px; font-size: 11px; gap: 4px; border-radius: 5px; }
.ds-badge-26 { height: 26px; padding: 0 8px; font-size: 12px; gap: 4px; border-radius: 6px; }
.ds-badge-30 { height: 30px; padding: 0 10px; font-size: 12.5px; gap:4px; border-radius: 6px; }
.ds-badge-32 { height: 32px; padding: 0 11px; font-size: 13px; gap:4px; border-radius: 7px; }
.ds-badge-36 { height: 36px; padding: 0 12px; font-size: var(--ds-text-sm-size); gap:8px; border-radius: 7px; }`;
    }

    function renderBadgesPage() {
      const leftSvg = resolveButtonIconMarkup(badgesState.leftIconId, 14);
      const rightSvg = resolveButtonIconMarkup(badgesState.rightIconId, 14);

      return `
        <div class="badges-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">2 Nhóm (Soft Outline &amp; Solid) × 8 Màu × 5 Kích thước (22 / 26 / 30 / 32 / 36px)</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="selectPage('colors')" title="Xem thêm màu Orange &amp; Purple vừa khai báo trong Colors">Xem màu trong Colors →</button>
              <button class="btn-ds" type="button" onclick="resetBadgesConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildBadgesHTMLSnippet(), 'Đã copy HTML + CSS Badges')">Copy HTML &amp; CSS</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / BADGES</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Nhãn Trạng thái &amp; Phân loại (Badges)</h1>
            <p style="font-size:13.5px; color:#475569; max-width:820px; line-height:1.6;">
              Sử dụng hệ màu từ <strong>Colors</strong> (đã bổ sung đầy đủ <strong>Orange</strong>, <strong>Purple</strong> và <strong>Grey 200</strong>), kích thước gọn nhẹ hơn Button gồm <strong>22px, 26px, 30px, 32px, 36px</strong> và hỗ trợ bật/tắt, thay đổi icon độc lập ở cả 2 bên Trái &amp; Phải.
            </p>
          </div>

          <!-- BỘ ĐIỀU KHIỂN TEXT & ICON 2 BÊN -->
          <div class="btn-config-bar" style="grid-template-columns: minmax(140px, 1fr) minmax(150px, 1fr) minmax(150px, 1fr) 136px;">
            <div class="form-field">
              <label>Nhãn Badge (Chỉnh Text trực tiếp)</label>
              <input type="text" class="ds-input" value="${escapeHTML(badgesState.label)}" placeholder="Nhập nhãn (VD: Active, Mới...)" oninput="updateBadgeLabelInput(this.value)" />
            </div>

            <div class="form-field">
              <label>Icon Trái (Bật / Tắt &amp; Chọn Icon)</label>
              <div class="btn-icon-control-group">
                <button type="button" class="btn-icon-toggle-pill ${badgesState.showLeftIcon ? 'active' : ''}" onclick="toggleBadgeIconSide('left')">
                  ${badgesState.showLeftIcon ? '● Bật' : '○ Tắt'}
                </button>
                <button type="button" class="btn-icon-pick-trigger" onclick="openButtonIconPicker('left', 'badge')" title="Chọn Icon bên trái">
                  <span style="display:inline-flex; align-items:center; gap:8px; min-width:0;">
                    <span style="display:inline-flex; color:var(--brand-primary); flex-shrink:0;">${leftSvg}</span>
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(getButtonIconDisplayName(badgesState.leftIconId))}</span>
                  </span>
                  <span style="color:var(--text-muted); font-size:10px;">▾</span>
                </button>
              </div>
            </div>

            <div class="form-field">
              <label>Icon Phải (Bật / Tắt &amp; Chọn Icon)</label>
              <div class="btn-icon-control-group">
                <button type="button" class="btn-icon-toggle-pill ${badgesState.showRightIcon ? 'active' : ''}" onclick="toggleBadgeIconSide('right')">
                  ${badgesState.showRightIcon ? '● Bật' : '○ Tắt'}
                </button>
                <button type="button" class="btn-icon-pick-trigger" onclick="openButtonIconPicker('right', 'badge')" title="Chọn Icon bên phải">
                  <span style="display:inline-flex; align-items:center; gap:8px; min-width:0;">
                    <span style="display:inline-flex; color:var(--brand-primary); flex-shrink:0;">${rightSvg}</span>
                    <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHTML(getButtonIconDisplayName(badgesState.rightIconId))}</span>
                  </span>
                  <span style="color:var(--text-muted); font-size:10px;">▾</span>
                </button>
              </div>
            </div>

            <div class="form-field">
              <label>Kiểu bo góc</label>
              <div style="display:flex; gap:4px;">
                <button type="button" class="btn-icon-toggle-pill ${badgesState.shape === 'rounded' ? 'active' : ''}" style="flex:1; justify-content:center;" onclick="setBadgeShape('rounded')">Bo 6px</button>
                <button type="button" class="btn-icon-toggle-pill ${badgesState.shape === 'pill' ? 'active' : ''}" style="flex:1; justify-content:center;" onclick="setBadgeShape('pill')">Pill</button>
              </div>
            </div>
          </div>

          <!-- MA TRẬN BADGES CHUẨN (SOFT + SOLID) -->
          <div class="btn-group-card">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Bảng Trạng thái &amp; Kích thước Badges (Soft Tinted ↔ Solid Filled)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Nửa trên: Nền nhạt có viền (Soft Outline) dùng cho bảng &amp; thẻ; Nửa dưới: Nền đặc (Solid Filled) tạo điểm nhấn cao.</div>
              </div>
              <div style="display:flex; gap:8px;">
                <button type="button" class="btn-ds" onclick="copyText(buildBadgesHTMLSnippet('soft'), 'Đã copy nhóm Soft Badges')">Copy Soft</button>
                <button type="button" class="btn-ds" onclick="copyText(buildBadgesHTMLSnippet('solid'), 'Đã copy nhóm Solid Badges')">Copy Solid</button>
              </div>
            </div>

            <div class="btn-matrix-scroll">
              <div class="badge-matrix-grid">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); padding-bottom:4px; border-bottom:1px dashed #e2e8f0;">Sắc độ (Tone)</div>
                ${BADGE_SIZES.map(sz => `<div class="btn-matrix-colhead">${sz.px}px<br/><span style="font-weight:500; font-size:9.5px; font-family:var(--ds-font-sans);">${escapeHTML(sz.vi.replace(/^\d+px\s*/, ''))}</span></div>`).join('')}

                <!-- NỬA TRÊN: SOFT / TINTED + BORDER -->
                ${BADGE_TONES.map(t => `
                  <div class="btn-matrix-rowlabel">
                    <span>${t.name} <span style="font-weight:500; color:var(--text-muted);">Soft</span></span>
                    <span class="btn-matrix-rowsub">${t.vi}</span>
                  </div>
                  ${BADGE_SIZES.map(sz => `
                    <div class="btn-matrix-cell" style="min-height:40px;">
                      ${renderConfiguredBadgeHtml('soft', t, sz)}
                    </div>
                  `).join('')}
                `).join('')}

                <!-- ĐƯỜNG KẺ ĐỨT PHÂN TÁCH GIỮA SOFT & SOLID NHƯ ẢNH MẪU -->
                <div class="badge-divider-dashed"></div>

                <!-- NỬA DƯỚI: SOLID FILLED -->
                ${BADGE_TONES.map(t => `
                  <div class="btn-matrix-rowlabel">
                    <span>${t.name} <span style="font-weight:500; color:var(--text-muted);">${t.id === 'disabled' ? 'Outline' : 'Solid'}</span></span>
                    <span class="btn-matrix-rowsub">${t.vi}</span>
                  </div>
                  ${BADGE_SIZES.map(sz => `
                    <div class="btn-matrix-cell" style="min-height:40px;">
                      ${renderConfiguredBadgeHtml('solid', t, sz)}
                    </div>
                  `).join('')}
                `).join('')}
              </div>
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG BADGES CHUẨN SAAS -->
          <div class="logo-dos-grid" style="margin-top:4px;">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Dùng Badge trong SaaS</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Dùng cỡ <strong>22px / 26px</strong> bên trong bảng dữ liệu (Tables) hoặc cạnh tiêu đề mục nhỏ.</li>
                <li>Dùng cỡ <strong>30px / 32px / 36px</strong> cho thẻ tóm tắt KPI, tag lọc chủ động hoặc đầu trang.</li>
                <li>Ưu tiên <strong>Soft Outline</strong> khi hiển thị nhiều nhãn cùng lúc để giao diện thoáng, nhẹ mắt; chỉ dùng <strong>Solid Filled</strong> cho 1–2 điểm nhấn quan trọng.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Tránh Nhầm lẫn với Button</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Badge có chiều cao tối đa <strong>36px</strong> (thấp hơn hệ Button <code>28–48px</code>) và chỉ dùng hiển thị trạng thái hoặc nhãn phân loại, không dùng thay cho nút hành động chính (Primary CTA).</li>
                <li>Giữ chữ ngắn gọn <strong>1–2 từ</strong> (VD: <code>Hoạt động</code>, <code>Chờ duyệt</code>, <code>Mới</code>, <code>Lỗi</code>).</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2J. BASE COMPONENT: CHECKBOXES & RADIO CONTROLS ENGINE
    // =========================================================================
    const CHECKBOXES_STORAGE_KEY = 'destudio_checkboxes_v1';

    const DEFAULT_CB_STATE = {
      titleText: 'Ghi nhớ đăng nhập',
      descText: 'Lưu thông tin đăng nhập cho lần truy cập tiếp theo.',
      errorText: 'Đây là thông báo lỗi. Vui lòng xác nhận mục này.',
      align: 'both', // 'left' | 'right' | 'both'
      boxSize: 16,   // 16 | 20
      demoPrefs: { emailAlerts: true, weeklyDigest: false, security2FA: true },
      demoSubs: [true, false, true],
      demoRadio: 0
    };

    let cbState = loadCbState();

    function loadCbState() {
      try {
        const raw = localStorage.getItem(CHECKBOXES_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_CB_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_CB_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_CB_STATE));
      }
    }

    function saveCbState() {
      try {
        localStorage.setItem(CHECKBOXES_STORAGE_KEY, JSON.stringify(cbState));
      } catch (e) {}
    }

    function getCbInnerMarkSvg(shape, stateId, boxSize) {
      const s = boxSize >= 20 ? 12 : 10;
      if (stateId === 'unchecked' || stateId === 'disabled-unchecked') return '';
      if (stateId === 'indeterminate') {
        return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="3" y1="8" x2="13" y2="8"/></svg>`;
      }
      if (shape === 'circle') {
        const r = boxSize >= 20 ? 4.5 : 3.5;
        return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="${r * 1.45}"/></svg>`;
      }
      return `<svg width="${s}" height="${s}" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4.5"/></svg>`;
    }

    function renderCheckboxSpecCell(shape, alignSide, withDesc, stateId) {
      const szCls = cbState.boxSize === 20 ? 'sz-20' : '';
      const shapeCls = shape === 'circle' ? 'is-circle' : '';
      const alignCls = alignSide === 'right' ? 'is-right' : '';
      let stCls = '';
      if (stateId === 'checked') stCls = 'is-checked';
      else if (stateId === 'disabled-unchecked') stCls = 'is-disabled';
      else if (stateId === 'disabled-checked') stCls = 'is-disabled is-checked';
      else if (stateId === 'error') stCls = 'is-error is-checked';

      const markSvg = getCbInnerMarkSvg(shape, stateId, cbState.boxSize);
      const titleHtml = `<span class="ds-cb-title">${escapeHTML(cbState.titleText || 'Ghi nhớ đăng nhập')}</span>`;
      const descHtml = withDesc ? `<span class="ds-cb-desc">${escapeHTML(cbState.descText || '')}</span>` : '';
      const errHtml = stateId === 'error' ? `<span class="ds-cb-err">${escapeHTML(cbState.errorText || '')}</span>` : '';

      return `
        <div class="ds-cb-control ${szCls} ${shapeCls} ${alignCls} ${stCls}" onclick="${stateId.startsWith('disabled') ? '' : `showToast('${shape.toUpperCase()} (${alignSide}): ${stateId}')`}">
          <span class="ds-cb-box">${markSvg}</span>
          <span class="ds-cb-text">
            ${titleHtml}
            ${descHtml}
            ${errHtml}
          </span>
        </div>
      `;
    }

    function updateCbField(field, val) {
      cbState[field] = val;
      saveCbState();
      renderCanvas();
    }

    function setCbBoxSize(sz) {
      cbState.boxSize = Number(sz) || 16;
      saveCbState();
      renderCanvas();
    }

    function setCbAlignFilter(align) {
      cbState.align = align;
      saveCbState();
      renderCanvas();
    }

    function toggleCbDemoPref(key) {
      cbState.demoPrefs[key] = !cbState.demoPrefs[key];
      saveCbState();
      renderCanvas();
    }

    function toggleCbSubItem(idx) {
      cbState.demoSubs[idx] = !cbState.demoSubs[idx];
      saveCbState();
      renderCanvas();
    }

    function toggleCbSelectAll() {
      const allChecked = cbState.demoSubs.every(Boolean);
      cbState.demoSubs = cbState.demoSubs.map(() => !allChecked);
      saveCbState();
      renderCanvas();
    }

    function selectCbDemoRadio(idx) {
      cbState.demoRadio = idx;
      saveCbState();
      renderCanvas();
    }

    function resetCheckboxesConfig() {
      cbState = JSON.parse(JSON.stringify(DEFAULT_CB_STATE));
      saveCbState();
      renderCanvas();
      showToast('Đã khôi phục cài đặt Checkboxes mặc định');
    }

    function buildCheckboxesHTMLSnippet() {
      const t = escapeHTML(cbState.titleText || 'Ghi nhớ đăng nhập');
      const d = escapeHTML(cbState.descText || 'Lưu thông tin đăng nhập cho lần truy cập tiếp theo.');
      return `<!-- 1. Checkbox — Icon bên Trái (Mặc định Form) -->
<label class="ds-cb-control is-checked">
  <span class="ds-cb-box">${getCbInnerMarkSvg('square', 'checked', 16)}</span>
  <span class="ds-cb-text">
    <span class="ds-cb-title">${t}</span>
    <span class="ds-cb-desc">${d}</span>
  </span>
</label>

<!-- 2. Checkbox — Icon bên Phải tiêu đề (Settings / Filter List) -->
<label class="ds-cb-control is-right is-checked">
  <span class="ds-cb-box">${getCbInnerMarkSvg('square', 'checked', 16)}</span>
  <span class="ds-cb-text">
    <span class="ds-cb-title">${t}</span>
    <span class="ds-cb-desc">${d}</span>
  </span>
</label>

<!-- 3. Radio Selector (Chọn duy nhất 1 mục) -->
<label class="ds-cb-control is-circle is-checked">
  <span class="ds-cb-box">${getCbInnerMarkSvg('circle', 'checked', 16)}</span>
  <span class="ds-cb-text">
    <span class="ds-cb-title">Chọn phương thức này</span>
  </span>
</label>`;
    }

    function renderCheckboxesPage() {
      const checkedCount = cbState.demoSubs.filter(Boolean).length;
      const parentState = checkedCount === 0 ? 'unchecked' : (checkedCount === cbState.demoSubs.length ? 'checked' : 'indeterminate');
      const showLeftBlock = cbState.align === 'both' || cbState.align === 'left';
      const showRightBlock = cbState.align === 'both' || cbState.align === 'right';
      const szCls = cbState.boxSize === 20 ? 'sz-20' : '';

      return `
        <div class="checkboxes-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">2 Hình dạng (Checkbox &amp; Radio) × 2 Vị trí Icon (Trái / Phải) × 5 Trạng thái</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetCheckboxesConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildCheckboxesHTMLSnippet(), 'Đã copy HTML Checkboxes')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / CHECKBOXES</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Hộp chọn &amp; Nút chọn (Checkboxes)</h1>
            <p style="font-size:13.5px; color:#475569; max-width:820px; line-height:1.6;">
              <strong>Hộp kiểm (Checkboxes)</strong> cho phép người dùng chọn một hoặc nhiều mục từ một tập hợp, trong khi <strong>nút chọn đơn (Radio buttons)</strong> chỉ cho phép chọn duy nhất một tùy chọn trong danh sách. Cả hai đều có thể dùng để bật hoặc tắt một tùy chọn, với biểu tượng đặt ở <strong>bên Trái</strong> hoặc <strong>bên Phải</strong> tiêu đề tùy ngữ cảnh.
            </p>
          </div>

          <!-- BỘ CẤU HÌNH NHANH -->
          <div class="btn-config-bar" style="grid-template-columns: 1fr 1.2fr auto auto;">
            <div class="form-field">
              <label>Tiêu đề (Label)</label>
              <input type="text" class="ds-input" value="${escapeHTML(cbState.titleText)}" oninput="updateCbField('titleText', this.value)" />
            </div>
            <div class="form-field">
              <label>Mô tả phụ (Helper Description)</label>
              <input type="text" class="ds-input" value="${escapeHTML(cbState.descText)}" oninput="updateCbField('descText', this.value)" />
            </div>
            <div class="form-field">
              <label>Vị trí Icon</label>
              <div style="display:flex; gap:4px;">
                <button type="button" class="btn-icon-toggle-pill ${cbState.align === 'both' ? 'active' : ''}" onclick="setCbAlignFilter('both')">Cả hai</button>
                <button type="button" class="btn-icon-toggle-pill ${cbState.align === 'left' ? 'active' : ''}" onclick="setCbAlignFilter('left')">Trái</button>
                <button type="button" class="btn-icon-toggle-pill ${cbState.align === 'right' ? 'active' : ''}" onclick="setCbAlignFilter('right')">Phải</button>
              </div>
            </div>
            <div class="form-field">
              <label>Cỡ ô</label>
              <div style="display:flex; gap:4px;">
                <button type="button" class="btn-icon-toggle-pill ${cbState.boxSize === 16 ? 'active' : ''}" onclick="setCbBoxSize(16)">16px</button>
                <button type="button" class="btn-icon-toggle-pill ${cbState.boxSize === 20 ? 'active' : ''}" onclick="setCbBoxSize(20)">20px</button>
              </div>
            </div>
          </div>

          <!-- MA TRẬN TRẠNG THÁI THEO ẢNH FIGMA -->
          <div class="cb-matrix-frame" style="margin-bottom:20px;">
            <div class="cb-matrix-grid">
              <div class="cb-matrix-colhead">Kiểu &amp; Nội dung</div>
              <div class="cb-matrix-colhead">Chưa chọn (Default)</div>
              <div class="cb-matrix-colhead">Đã chọn (Checked)</div>
              <div class="cb-matrix-colhead">Vô hiệu (Chưa chọn)</div>
              <div class="cb-matrix-colhead">Vô hiệu (Đã chọn)</div>
              <div class="cb-matrix-colhead" style="color:var(--ds-red-1000);">Lỗi (Error State)</div>

              ${showLeftBlock ? `
                <div class="cb-section-sep">
                  <span>① VỊ TRÍ ICON BÊN TRÁI TIÊU ĐỀ (Left Alignment — Form &amp; Bảng)</span>
                  <span style="font-weight:500; font-size:11px; color:var(--text-muted);">Ô chọn đứng trước nhãn văn bản</span>
                </div>

                <div class="btn-matrix-rowlabel"><span>Checkbox Đơn</span><span class="btn-matrix-rowsub">Không mô tả</span></div>
                ${renderCheckboxSpecCell('square', 'left', false, 'unchecked')}
                ${renderCheckboxSpecCell('square', 'left', false, 'checked')}
                ${renderCheckboxSpecCell('square', 'left', false, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('square', 'left', false, 'disabled-checked')}
                ${renderCheckboxSpecCell('square', 'left', false, 'error')}

                <div class="btn-matrix-rowlabel"><span>Checkbox + Mô tả</span><span class="btn-matrix-rowsub">Tiêu đề &amp; gợi ý</span></div>
                ${renderCheckboxSpecCell('square', 'left', true, 'unchecked')}
                ${renderCheckboxSpecCell('square', 'left', true, 'checked')}
                ${renderCheckboxSpecCell('square', 'left', true, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('square', 'left', true, 'disabled-checked')}
                ${renderCheckboxSpecCell('square', 'left', true, 'error')}

                <div class="btn-matrix-rowlabel"><span>Radio Đơn</span><span class="btn-matrix-rowsub">Chọn 1 mục</span></div>
                ${renderCheckboxSpecCell('circle', 'left', false, 'unchecked')}
                ${renderCheckboxSpecCell('circle', 'left', false, 'checked')}
                ${renderCheckboxSpecCell('circle', 'left', false, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('circle', 'left', false, 'disabled-checked')}
                ${renderCheckboxSpecCell('circle', 'left', false, 'error')}

                <div class="btn-matrix-rowlabel"><span>Radio + Mô tả</span><span class="btn-matrix-rowsub">Tiêu đề &amp; gợi ý</span></div>
                ${renderCheckboxSpecCell('circle', 'left', true, 'unchecked')}
                ${renderCheckboxSpecCell('circle', 'left', true, 'checked')}
                ${renderCheckboxSpecCell('circle', 'left', true, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('circle', 'left', true, 'disabled-checked')}
                ${renderCheckboxSpecCell('circle', 'left', true, 'error')}
              ` : ''}

              ${showRightBlock ? `
                <div class="cb-section-sep">
                  <span>② VỊ TRÍ ICON BÊN PHẢI TIÊU ĐỀ (Right Alignment — Settings, Card &amp; Bộ lọc)</span>
                  <span style="font-weight:500; font-size:11px; color:var(--text-muted);">Chữ căn trái, ô chọn căn sát lề phải</span>
                </div>

                <div class="btn-matrix-rowlabel"><span>Checkbox Đơn</span><span class="btn-matrix-rowsub">Icon bên phải</span></div>
                ${renderCheckboxSpecCell('square', 'right', false, 'unchecked')}
                ${renderCheckboxSpecCell('square', 'right', false, 'checked')}
                ${renderCheckboxSpecCell('square', 'right', false, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('square', 'right', false, 'disabled-checked')}
                ${renderCheckboxSpecCell('square', 'right', false, 'error')}

                <div class="btn-matrix-rowlabel"><span>Checkbox + Mô tả</span><span class="btn-matrix-rowsub">Icon bên phải</span></div>
                ${renderCheckboxSpecCell('square', 'right', true, 'unchecked')}
                ${renderCheckboxSpecCell('square', 'right', true, 'checked')}
                ${renderCheckboxSpecCell('square', 'right', true, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('square', 'right', true, 'disabled-checked')}
                ${renderCheckboxSpecCell('square', 'right', true, 'error')}

                <div class="btn-matrix-rowlabel"><span>Radio Đơn</span><span class="btn-matrix-rowsub">Icon bên phải</span></div>
                ${renderCheckboxSpecCell('circle', 'right', false, 'unchecked')}
                ${renderCheckboxSpecCell('circle', 'right', false, 'checked')}
                ${renderCheckboxSpecCell('circle', 'right', false, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('circle', 'right', false, 'disabled-checked')}
                ${renderCheckboxSpecCell('circle', 'right', false, 'error')}

                <div class="btn-matrix-rowlabel"><span>Radio + Mô tả</span><span class="btn-matrix-rowsub">Icon bên phải</span></div>
                ${renderCheckboxSpecCell('circle', 'right', true, 'unchecked')}
                ${renderCheckboxSpecCell('circle', 'right', true, 'checked')}
                ${renderCheckboxSpecCell('circle', 'right', true, 'disabled-unchecked')}
                ${renderCheckboxSpecCell('circle', 'right', true, 'disabled-checked')}
                ${renderCheckboxSpecCell('circle', 'right', true, 'error')}
              ` : ''}
            </div>
          </div>

          <!-- KHU THỬ NGHIỆM TƯƠNG TÁC SAAS -->
          <div class="btn-group-card">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Thử nghiệm Tương tác Thực tế (Multi-select Indeterminate &amp; Right-aligned Settings)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Click trực tiếp để thử trạng thái chọn một phần (Indeterminate) và bố cục Icon Trái / Phải.</div>
              </div>
            </div>
            <div style="padding:16px; display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <!-- Demo 1: Parent-Child Indeterminate Checkbox -->
              <div style="border:1px solid var(--border-default); border-radius:8px; padding:16px; background:#fafbfd;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:10px;">CHỌN NHIỀU QUYỀN TRONG BẢNG (INDETERMINATE STATE)</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <div class="ds-cb-control ${szCls} ${parentState !== 'unchecked' ? 'is-checked' : ''}" onclick="toggleCbSelectAll()">
                    <span class="ds-cb-box">${getCbInnerMarkSvg('square', parentState, cbState.boxSize)}</span>
                    <span class="ds-cb-text">
                      <span class="ds-cb-title" style="font-weight:700;">Tất cả quyền truy cập Workspace (${checkedCount}/3)</span>
                    </span>
                  </div>
                  <div style="padding-left:22px; display:flex; flex-direction:column; gap:8px; border-left:1.5px solid #e2e8f0; margin-left:7px;">
                    ${['Xem & xuất báo cáo', 'Chỉnh sửa giao diện & tokens', 'Quản lý thành viên & thanh toán'].map((lbl, idx) => `
                      <div class="ds-cb-control ${szCls} ${cbState.demoSubs[idx] ? 'is-checked' : ''}" onclick="toggleCbSubItem(${idx})">
                        <span class="ds-cb-box">${getCbInnerMarkSvg('square', cbState.demoSubs[idx] ? 'checked' : 'unchecked', cbState.boxSize)}</span>
                        <span class="ds-cb-text"><span class="ds-cb-title">${lbl}</span></span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>

              <!-- Demo 2: Right-aligned Settings + Radio Selector -->
              <div style="border:1px solid var(--border-default); border-radius:8px; padding:16px; background:#fafbfd;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:10px;">DANH SÁCH CÀI ĐẶT (ICON BÊN PHẢI &amp; RADIO ĐƠN)</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <div class="ds-cb-control ${szCls} is-right ${cbState.demoPrefs.emailAlerts ? 'is-checked' : ''}" style="padding-bottom:8px; border-bottom:1px solid #f1f5f9;" onclick="toggleCbDemoPref('emailAlerts')">
                    <span class="ds-cb-box">${getCbInnerMarkSvg('square', cbState.demoPrefs.emailAlerts ? 'checked' : 'unchecked', cbState.boxSize)}</span>
                    <span class="ds-cb-text">
                      <span class="ds-cb-title">Cảnh báo bảo mật qua Email</span>
                      <span class="ds-cb-desc">Gửi thông báo ngay khi phát hiện đăng nhập từ thiết bị lạ.</span>
                    </span>
                  </div>
                  <div class="ds-cb-control ${szCls} is-right ${cbState.demoPrefs.weeklyDigest ? 'is-checked' : ''}" style="padding-bottom:8px; border-bottom:1px solid #f1f5f9;" onclick="toggleCbDemoPref('weeklyDigest')">
                    <span class="ds-cb-box">${getCbInnerMarkSvg('square', cbState.demoPrefs.weeklyDigest ? 'checked' : 'unchecked', cbState.boxSize)}</span>
                    <span class="ds-cb-text">
                      <span class="ds-cb-title">Báo cáo tổng hợp hàng tuần</span>
                      <span class="ds-cb-desc">Nhận thống kê sử dụng vào sáng Thứ Hai.</span>
                    </span>
                  </div>
                  <div style="display:flex; gap:16px; flex-wrap:wrap; padding-top:2px;">
                    ${['Gói Cá nhân', 'Gói Team'].map((plan, idx) => `
                      <div class="ds-cb-control ${szCls} is-circle ${cbState.demoRadio === idx ? 'is-checked' : ''}" style="width:auto;" onclick="selectCbDemoRadio(${idx})">
                        <span class="ds-cb-box">${getCbInnerMarkSvg('circle', cbState.demoRadio === idx ? 'checked' : 'unchecked', cbState.boxSize)}</span>
                        <span class="ds-cb-text"><span class="ds-cb-title">${plan}</span></span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG CHECKBOXES -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Vị trí &amp; Ngữ cảnh Sử dụng</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Icon bên Trái tiêu đề:</strong> Dùng cho biểu mẫu đăng ký/nhập liệu, danh sách kiểm tra, bảng chọn hàng loạt để mắt người dùng quét thẳng theo trục dọc.</li>
                <li><strong>Icon bên Phải tiêu đề:</strong> Dùng cho thẻ cài đặt, menu bộ lọc (Filter drawer) hoặc danh sách trên mobile để chữ căn thẳng lề trái, ô chọn nằm gọn bên phải.</li>
                <li><strong>Checkbox vs Radio:</strong> Dùng <strong>Checkbox</strong> khi chọn được nhiều mục hoặc bật/tắt 1 xác nhận; dùng <strong>Radio</strong> khi chỉ chọn đúng 1 giá trị loại trừ lẫn nhau.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Không dùng nhãn phủ định gây hiểu nhầm (VD: tránh <em>"Không gửi email cho tôi"</em> — hãy viết khẳng định <em>"Nhận thông báo qua email"</em>).</li>
                <li>Khi ở trạng thái <strong>Lỗi (Error)</strong>, luôn đi kèm dòng giải thích lỗi màu đỏ <code>--ds-red-1000</code> ngay bên dưới tiêu đề.</li>
                <li>Không thay đổi trạng thái hệ thống ngay tức thì như Toggle Switch nếu hành động cần nút <strong>Lưu</strong> trong form.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2K. BASE COMPONENT: DROPDOWNS & SELECT ENGINE
    // =========================================================================
    const DD_STORAGE_KEY = 'destudio_dropdowns_v1';

    const DD_MEMBERS = [
      { id: 'olivia',  name: 'Olivia Rhye',    handle: '@olivia',  email: 'olivia@acme-demo.com',  initials: 'OR', bg: '#e0e7ff', fg: '#3730a3', online: true },
      { id: 'phoenix', name: 'Phoenix Baker',  handle: '@phoenix', email: 'phoenix@acme-demo.com', initials: 'PB', bg: '#fef3c7', fg: '#92400e', online: true },
      { id: 'lana',    name: 'Lana Steiner',   handle: '@lana',    email: 'lana@acme-demo.com',    initials: 'LS', bg: '#dcfce7', fg: '#166534', online: true },
      { id: 'demi',    name: 'Demi Wilkinson', handle: '@demi',    email: 'demi@acme-demo.com',    initials: 'DW', bg: '#fee2e2', fg: '#991b1b', online: false, disabled: true },
      { id: 'candice', name: 'Candice Wu',     handle: '@candice', email: 'candice@acme-demo.com', initials: 'CW', bg: '#f3e8ff', fg: '#6b21a8', online: true },
      { id: 'natali',  name: 'Natali Craig',   handle: '@natali',  email: 'natali@acme-demo.com',  initials: 'NC', bg: '#ffedd5', fg: '#9a3412', online: true },
      { id: 'drew',    name: 'Drew Cano',      handle: '@drew',    email: 'drew@acme-demo.com',    initials: 'DC', bg: '#e0f2fe', fg: '#075985', online: true }
    ];

    const DD_DEFAULT_STATE = {
      caseFilter: 'all',
      fieldLabel: 'Team member',
      tagsLabel: 'Tags',
      accountLabel: 'Account',
      hintText: 'Đây là văn bản gợi ý giúp người dùng.',
      selectedId: 'olivia',
      selectedTags: ['olivia', 'lana', 'phoenix', 'candice', 'natali'],
      stepperVal: 9,
      accountOpen: true
    };

    function loadDdState() {
      try {
        const raw = localStorage.getItem(DD_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DD_DEFAULT_STATE));
        return { ...JSON.parse(JSON.stringify(DD_DEFAULT_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DD_DEFAULT_STATE));
      }
    }

    let ddState = loadDdState();

    function saveDdState() {
      try { localStorage.setItem(DD_STORAGE_KEY, JSON.stringify(ddState)); } catch (e) {}
    }

    function resetDdState() {
      ddState = JSON.parse(JSON.stringify(DD_DEFAULT_STATE));
      try { localStorage.removeItem(DD_STORAGE_KEY); } catch (e) {}
      renderCanvas();
      showToast('Đã khôi phục mặc định cho Dropdowns');
    }

    function ddExactIconSvg(slug, size) {
      if (!Array.isArray(iconsCatalog) || !iconsCatalog.length) return '';
      const q = String(slug || '').toLowerCase();
      const ic = iconsCatalog.find(i => (i.slug || '').toLowerCase() === q)
        || iconsCatalog.find(i => (i.slug || '').toLowerCase().includes(q));
      return ic ? buildIconSvgTag(ic, size || 14, 'currentColor', 'outlined', false) : '';
    }

    const DD_CLEAR_SVG = '<svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="2.5" y1="2.5" x2="9.5" y2="9.5"/><line x1="9.5" y1="2.5" x2="2.5" y2="9.5"/></svg>';
    const DD_MINUS_SVG = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="3.5" y1="8" x2="12.5" y2="8"/></svg>';
    const DD_PLUS_SVG = '<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="8" y1="3.5" x2="8" y2="12.5"/><line x1="3.5" y1="8" x2="12.5" y2="8"/></svg>';

    function ddAvatarHtml(member, sizeCls) {
      const m = member || DD_MEMBERS[0];
      return `<span class="dd-avatar ${sizeCls || ''}" style="background:${m.bg}; color:${m.fg};">${m.initials}</span>`;
    }

    function ddLeadingHtml(variant, member, isDisabled, isPlaceholder) {
      if (variant === 'icon') {
        const c = isDisabled ? 'var(--ds-grey-300, #9ca3af)' : 'var(--ds-grey-500, #6b7280)';
        return `<span class="dd-lead-ico ${isDisabled ? 'is-disabled' : ''}" style="color:${c}; display:inline-flex; flex-shrink:0;">${ddExactIconSvg('user', 13)}</span>`;
      }
      if (variant === 'avatar') {
        if (isPlaceholder) {
          return `<span class="dd-lead-ico ${isDisabled ? 'is-disabled' : ''}" style="color:var(--ds-grey-400, #9ca3af); display:inline-flex; flex-shrink:0;">${ddExactIconSvg('user-circle', 14)}</span>`;
        }
        return ddAvatarHtml(member || DD_MEMBERS[0], '');
      }
      if (variant === 'status') {
        const dotCls = (isPlaceholder || isDisabled) ? 'dd-status-dot is-muted' : 'dd-status-dot';
        return `<span class="${dotCls}"></span>`;
      }
      if (variant === 'tags') {
        const c = isDisabled ? 'var(--ds-grey-300, #9ca3af)' : 'var(--ds-grey-500, #6b7280)';
        return `<span class="dd-lead-ico ${isDisabled ? 'is-disabled' : ''}" style="color:${c}; display:inline-flex; flex-shrink:0;">${ddExactIconSvg('user', 13)}</span>`;
      }
      return '';
    }

    function renderDdSelectField(variant, rowState) {
      const activeMember = DD_MEMBERS.find(m => m.id === ddState.selectedId) || DD_MEMBERS[0];
      const fieldTitle = variant === 'tags' ? (ddState.tagsLabel || 'Tags') : (ddState.fieldLabel || 'Team member');
      const helpIco = ddExactIconSvg('help-circle', 11);
      const chevIco = rowState === 'focus' || rowState === 'open'
        ? ddExactIconSvg('chevron-up', 12)
        : ddExactIconSvg('chevron-down', 12);

      const isDisabled = rowState === 'disabled';
      const isPlaceholder = rowState === 'default' || isDisabled;
      const isFocus = rowState === 'focus' || rowState === 'open';
      const trigCls = ['ds-select-trigger', isFocus ? 'is-focus' : '', isDisabled ? 'is-disabled' : ''].filter(Boolean).join(' ');

      let centerContent = '';
      if (variant === 'tags' && !isPlaceholder) {
        const picked = DD_MEMBERS.filter(m => ddState.selectedTags.includes(m.id));
        if (!picked.length) {
          centerContent = '<span class="ds-select-val is-placeholder">Chọn thẻ...</span>';
        } else {
          const shown = picked.slice(0, isFocus ? 1 : 2);
          const extra = picked.length - shown.length;
          const chips = shown.map(m => `
            <span class="dd-tag-chip">${escapeHTML(m.name.split(' ')[0])}<span style="opacity:0.65; cursor:pointer;" onclick="event.stopPropagation(); ddToggleTag('${m.id}')">×</span></span>
          `).join('');
          centerContent = `<span class="dd-tags-wrap">${chips}${extra > 0 ? `<span class="dd-tag-count">+${extra}</span>` : ''}</span>`;
        }
      } else {
        const textVal = isDisabled
          ? 'Selected item'
          : (rowState === 'default' ? '- Select item' : activeMember.name);
        centerContent = `<span class="ds-select-val ${isPlaceholder ? 'is-placeholder' : ''}">${escapeHTML(textVal)}</span>`;
      }

      const clearAction = variant === 'tags' ? 'ddClearTags()' : 'ddClearSingle()';
      const clearBtn = isFocus
        ? `<button type="button" class="ds-select-clear" title="Xóa chọn" onclick="event.stopPropagation(); ${clearAction}">${DD_CLEAR_SVG}</button>`
        : '';

      let menuHtml = '';
      if (rowState === 'open') {
        const itemsHtml = DD_MEMBERS.map(m => {
          const isItemDisabled = (variant === 'icon' || variant === 'tags') ? false : false;
          const rowDisabled = variant === 'icon' && Boolean(m.disabled);
          const isSelected = variant === 'tags'
            ? ddState.selectedTags.includes(m.id)
            : ddState.selectedId === m.id;
          const itemLead = variant === 'plain' || variant === 'tags'
            ? ''
            : variant === 'icon'
              ? `<span style="color:var(--ds-grey-500); display:inline-flex; flex-shrink:0;">${ddExactIconSvg('user', 11)}</span>`
              : variant === 'avatar'
                ? ddAvatarHtml(m, '')
                : `<span class="dd-status-dot ${m.online ? '' : 'is-muted'}"></span>`;
          const checkSvg = isSelected ? `<span class="ds-select-check">${ddExactIconSvg('check-mark', 11)}</span>` : '';
          const clickFn = rowDisabled
            ? ''
            : (variant === 'tags' ? `ddToggleTag('${m.id}')` : `ddSelectMember('${m.id}')`);

          return `
            <div class="ds-select-item ${isSelected ? 'is-selected' : ''} ${rowDisabled ? 'is-disabled' : ''}" onclick="${clickFn}">
              <span class="ds-select-item-main">
                ${itemLead}
                <span class="ds-select-item-name">${escapeHTML(m.name)}</span>
                <span class="ds-select-item-handle">${escapeHTML(m.handle)}</span>
              </span>
              ${checkSvg}
            </div>
          `;
        }).join('');

        menuHtml = `
          <div class="ds-select-menu">
            <button type="button" class="ds-menu-clear-bar" onclick="${variant === 'tags' ? 'ddClearTags()' : 'ddClearSingle()'}">Xóa tất cả (Clear all)</button>
            ${itemsHtml}
          </div>
        `;
      }

      return `
        <div class="dd-field">
          <div class="dd-label">
            <span>${escapeHTML(fieldTitle)}</span>
            <span class="dd-req">*</span>
            <span class="dd-help-ico" title="Trường chọn dữ liệu">${helpIco}</span>
          </div>
          <div class="${trigCls}" onclick="${isDisabled ? '' : `showToast('Select (${variant}): ${rowState}')`}">
            <div class="ds-select-left">
              ${ddLeadingHtml(variant, activeMember, isDisabled, isPlaceholder)}
              ${centerContent}
            </div>
            <div class="ds-select-right">
              ${clearBtn}
              <span style="display:inline-flex;">${chevIco}</span>
            </div>
          </div>
          <div class="dd-hint">${escapeHTML(ddState.hintText || '')}</div>
          ${menuHtml}
        </div>
      `;
    }

    function renderDdStepperBox(labelVal, disabled, isInteractive) {
      const helpIco = ddExactIconSvg('help-circle', 11);
      const minusIco = DD_MINUS_SVG;
      const plusIco = DD_PLUS_SVG;
      const displayVal = isInteractive ? ddState.stepperVal : labelVal;
      return `
        <div class="dd-field">
          <div class="dd-label">
            <span>Amount</span>
            <span class="dd-req">*</span>
            <span class="dd-help-ico">${helpIco}</span>
          </div>
          <div class="ds-stepper ${disabled ? 'is-disabled' : ''}">
            <button type="button" class="ds-stepper-btn" ${disabled ? 'disabled' : ''} onclick="${isInteractive ? 'ddStepAmount(-1)' : ''}" aria-label="Giảm">${minusIco}</button>
            <div class="ds-stepper-val">${displayVal}</div>
            <button type="button" class="ds-stepper-btn" ${disabled ? 'disabled' : ''} onclick="${isInteractive ? 'ddStepAmount(1)' : ''}" aria-label="Tăng">${plusIco}</button>
          </div>
          <div class="dd-hint">${escapeHTML(ddState.hintText || '')}</div>
        </div>
      `;
    }

    function ddSelectMember(memberId) {
      ddState.selectedId = memberId;
      saveDdState();
      renderCanvas();
      const m = DD_MEMBERS.find(x => x.id === memberId);
      if (m) showToast(`Đã chọn: ${m.name} (${m.handle})`);
    }

    function ddClearSingle() {
      ddState.selectedId = '';
      saveDdState();
      renderCanvas();
      showToast('Đã xóa lựa chọn hiện tại');
    }

    function ddToggleTag(memberId) {
      const exists = ddState.selectedTags.includes(memberId);
      ddState.selectedTags = exists
        ? ddState.selectedTags.filter(id => id !== memberId)
        : [...ddState.selectedTags, memberId];
      saveDdState();
      renderCanvas();
    }

    function ddClearTags() {
      ddState.selectedTags = [];
      saveDdState();
      renderCanvas();
      showToast('Đã xóa tất cả thẻ Tags đã chọn');
    }

    function ddStepAmount(delta) {
      ddState.stepperVal = Math.max(0, Math.min(99, (Number(ddState.stepperVal) || 0) + delta));
      saveDdState();
      renderCanvas();
    }

    function ddToggleAccountMenu() {
      ddState.accountOpen = !ddState.accountOpen;
      saveDdState();
      renderCanvas();
    }

    function ddUpdateField(key, val) {
      ddState[key] = val;
      saveDdState();
      renderCanvas();
    }

    function buildDropdownsHTMLSnippet() {
      return `<!-- De Studio 1.0 • Select Dropdown & Account Menu -->
<div class="dd-field" style="max-width:280px;">
  <label class="dd-label">Team member <span class="dd-req">*</span></label>
  <div class="ds-select-trigger is-lg is-focus">
    <span class="ds-select-left">
      <span class="dd-avatar" style="background:#e0e7ff; color:#3730a3;">OR</span>
      <span class="ds-select-val">Olivia Rhye</span>
    </span>
    <span class="ds-select-right">
      <button type="button" class="ds-select-clear" aria-label="Clear">×</button>
      <span>⌄</span>
    </span>
  </div>
  <div class="dd-hint">Đây là văn bản gợi ý giúp người dùng.</div>
  <div class="ds-select-menu">
    <button type="button" class="ds-menu-clear-bar">Xóa tất cả (Clear all)</button>
    <div class="ds-select-item is-selected">
      <span class="ds-select-item-main"><span class="dd-avatar" style="background:#e0e7ff; color:#3730a3;">OR</span> Olivia Rhye <span class="ds-select-item-handle">@olivia</span></span>
      <span class="ds-select-check">✓</span>
    </div>
    <div class="ds-select-item">
      <span class="ds-select-item-main"><span class="dd-avatar" style="background:#fef3c7; color:#92400e;">PB</span> Phoenix Baker <span class="ds-select-item-handle">@phoenix</span></span>
    </div>
  </div>
</div>`;
    }

    function renderDropdownsPage() {
      const showSelect = ddState.caseFilter === 'all' || ddState.caseFilter === 'select';
      const showStepper = ddState.caseFilter === 'all' || ddState.caseFilter === 'stepper';
      const showAccount = ddState.caseFilter === 'all' || ddState.caseFilter === 'account';

      const accChevDown = ddExactIconSvg('chevron-down', 13);
      const accChevUp = ddExactIconSvg('chevron-up', 13);
      const leadUser = DD_MEMBERS[0];

      const accountGroups = [
        [
          { icon: 'user', label: 'View profile', vi: 'Xem hồ sơ' },
          { icon: 'keyboard', label: 'Keyboard shortcuts', vi: 'Phím tắt' },
          { icon: 'settings-gear', label: 'Settings', vi: 'Cài đặt' }
        ],
        [
          { icon: 'building-school', label: 'Company profile', vi: 'Hồ sơ công ty' },
          { icon: 'users-team', label: 'Team', vi: 'Đội ngũ' },
          { icon: 'user-plus', label: 'Invite colleagues', vi: 'Mời đồng nghiệp' }
        ],
        [
          { icon: 'layers', label: 'Changelog', vi: 'Nhật ký thay đổi' },
          { icon: 'users-community', label: 'Community', vi: 'Cộng đồng' },
          { icon: 'help-circle', label: 'Support', vi: 'Hỗ trợ' },
          { icon: 'code-slash', label: 'API', vi: 'Tài liệu API' }
        ],
        [
          { icon: 'log-out', label: 'Log out', vi: 'Đăng xuất', danger: true }
        ]
      ];

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">3 Trường hợp chuẩn SaaS • Demo Tiếng Anh</span>
            <button type="button" class="btn-ds" onclick="resetDdState()">↺ Khôi phục mặc định</button>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn-ds primary" onclick="copyText(buildDropdownsHTMLSnippet())">Copy HTML Code</button>
          </div>
        </div>

        <div class="dd-sheet">
          <!-- HERO HEADER & BỘ LỌC TRƯỜNG HỢP -->
          <div class="dd-hero-card">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / DROPDOWNS</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Danh sách chọn &amp; Dropdown (Select)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:780px; margin-top:6px; line-height:1.6;">
              Thành phần <strong>Select (Input dropdown)</strong> được dùng để gom nhóm lựa chọn hoặc hành động trong một danh sách thả xuống. Rất hữu ích khi cần chọn từ nhiều phương án, tìm kiếm trực tiếp trong ô nhập, gắn nhiều thẻ (<em>Tags</em>), tăng giảm số lượng hoặc mở menu tài khoản.
            </p>

            <!-- Tùy biến nhãn & lọc nhanh 3 trường hợp -->
            <div style="margin-top:16px; padding-top:14px; border-top:1px dashed var(--border-default); display:flex; align-items:flex-end; gap:12px; flex-wrap:wrap;">
              <div style="min-width:140px; flex:1;">
                <div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Nhãn Select</div>
                <input type="text" class="ds-input" style="height:30px; font-size:12px;" value="${escapeHTML(ddState.fieldLabel)}" oninput="ddUpdateField('fieldLabel', this.value)" />
              </div>
              <div style="min-width:130px; flex:1;">
                <div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Nhãn nút Account</div>
                <input type="text" class="ds-input" style="height:30px; font-size:12px;" value="${escapeHTML(ddState.accountLabel)}" oninput="ddUpdateField('accountLabel', this.value)" />
              </div>
              <div>
                <div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Lọc theo trường hợp</div>
                <div class="btn-ds-seg">
                  <button type="button" class="${ddState.caseFilter === 'all' ? 'active' : ''}" onclick="ddUpdateField('caseFilter', 'all')">Tất cả (3)</button>
                  <button type="button" class="${ddState.caseFilter === 'select' ? 'active' : ''}" onclick="ddUpdateField('caseFilter', 'select')">① Input Select</button>
                  <button type="button" class="${ddState.caseFilter === 'stepper' ? 'active' : ''}" onclick="ddUpdateField('caseFilter', 'stepper')">② Stepper</button>
                  <button type="button" class="${ddState.caseFilter === 'account' ? 'active' : ''}" onclick="ddUpdateField('caseFilter', 'account')">③ Account Menu</button>
                </div>
              </div>
            </div>
          </div>

          ${showSelect ? `
            <!-- TRƯỜNG HỢP 1: MA TRẬN 5 KIỂU SELECT x 5 TRẠNG THÁI -->
            <div class="dd-figma-frame">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Trường hợp 1: Input Select Dropdown — 5 Biến thể × 5 Trạng thái</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Click trực tiếp vào thành viên trong danh sách đang mở hoặc nút <b>×</b> trên thẻ Tags để thử tương tác dữ liệu tiếng Anh.</div>
                </div>
                <span class="ds-badge ds-badge-blue">Icons + Avatar + Badges Tokens</span>
              </div>

              <div class="dd-matrix-grid">
                <div class="dd-col-head">Trạng thái<span class="dd-col-sub">5 mức chuẩn</span></div>
                <div class="dd-col-head">1. Plain Text<span class="dd-col-sub">Văn bản thuần</span></div>
                <div class="dd-col-head">2. Icon Leading<span class="dd-col-sub">Có Icon người</span></div>
                <div class="dd-col-head">3. Avatar Leading<span class="dd-col-sub">Ảnh đại diện</span></div>
                <div class="dd-col-head">4. Status Dot<span class="dd-col-sub">Chấm trạng thái</span></div>
                <div class="dd-col-head">5. Multi-Tags<span class="dd-col-sub">Chọn nhiều thẻ</span></div>

                <div class="btn-matrix-rowlabel"><span>Default</span><span class="btn-matrix-rowsub">Chưa chọn</span></div>
                ${renderDdSelectField('plain', 'default')}
                ${renderDdSelectField('icon', 'default')}
                ${renderDdSelectField('avatar', 'default')}
                ${renderDdSelectField('status', 'default')}
                ${renderDdSelectField('tags', 'default')}

                <div class="btn-matrix-rowlabel"><span>Filled</span><span class="btn-matrix-rowsub">Đã có giá trị</span></div>
                ${renderDdSelectField('plain', 'filled')}
                ${renderDdSelectField('icon', 'filled')}
                ${renderDdSelectField('avatar', 'filled')}
                ${renderDdSelectField('status', 'filled')}
                ${renderDdSelectField('tags', 'filled')}

                <div class="btn-matrix-rowlabel"><span>Focus</span><span class="btn-matrix-rowsub">Ring &amp; Xóa ×</span></div>
                ${renderDdSelectField('plain', 'focus')}
                ${renderDdSelectField('icon', 'focus')}
                ${renderDdSelectField('avatar', 'focus')}
                ${renderDdSelectField('status', 'focus')}
                ${renderDdSelectField('tags', 'focus')}

                <div class="btn-matrix-rowlabel"><span>Open Menu</span><span class="btn-matrix-rowsub">Tương tác trực tiếp</span></div>
                ${renderDdSelectField('plain', 'open')}
                ${renderDdSelectField('icon', 'open')}
                ${renderDdSelectField('avatar', 'open')}
                ${renderDdSelectField('status', 'open')}
                ${renderDdSelectField('tags', 'open')}

                <div class="btn-matrix-rowlabel"><span>Disabled</span><span class="btn-matrix-rowsub">Vô hiệu hóa</span></div>
                ${renderDdSelectField('plain', 'disabled')}
                ${renderDdSelectField('icon', 'disabled')}
                ${renderDdSelectField('avatar', 'disabled')}
                ${renderDdSelectField('status', 'disabled')}
                ${renderDdSelectField('tags', 'disabled')}
              </div>
            </div>
          ` : ''}

          ${(showStepper || showAccount) ? `
            <div class="dd-subcases-grid" style="${(!showStepper || !showAccount) ? 'grid-template-columns:1fr;' : ''}">
              ${showStepper ? `
                <!-- TRƯỜNG HỢP 2: STEPPER SỐ LƯỢNG (AMOUNT) -->
                <div class="dd-figma-frame">
                  <div style="margin-bottom:12px;">
                    <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Trường hợp 2: Number Stepper</div>
                    <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Tăng giảm số lượng nhanh (hàng 3 có thể bấm <b>− / +</b>).</div>
                  </div>
                  <div style="display:flex; flex-direction:column; gap:12px;">
                    <div>
                      <div style="font-size:10px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">① Mặc định (0)</div>
                      ${renderDdStepperBox(0, false, false)}
                    </div>
                    <div>
                      <div style="font-size:10px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">② Vô hiệu hóa (0)</div>
                      ${renderDdStepperBox(0, true, false)}
                    </div>
                    <div>
                      <div style="font-size:10px; font-weight:600; color:var(--brand-primary); margin-bottom:4px;">③ Đang hoạt động — Bấm thử − / +</div>
                      ${renderDdStepperBox(ddState.stepperVal, false, true)}
                    </div>
                    <div>
                      <div style="font-size:10px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">④ Vô hiệu hóa đã có số (9)</div>
                      ${renderDdStepperBox(9, true, false)}
                    </div>
                  </div>
                </div>
              ` : ''}

              ${showAccount ? `
                <!-- TRƯỜNG HỢP 3: ACCOUNT DROPDOWN MENU -->
                <div class="dd-figma-frame" style="background:#f8fafc;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap; margin-bottom:14px;">
                    <div>
                      <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Trường hợp 3: Button Dropdown &amp; Account Action Menu</div>
                      <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Kết hợp Button chuẩn + Shadow <code>lg</code> + Icons nền tảng để điều hướng hồ sơ người dùng.</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <button type="button" class="ds-btn secondary" onclick="showToast('Trạng thái đóng của nút Account')">
                        <span>${escapeHTML(ddState.accountLabel || 'Account')}</span>
                        <span style="display:inline-flex;">${accChevDown}</span>
                      </button>
                      <button type="button" class="ds-btn secondary" style="${ddState.accountOpen ? 'border-color:var(--ds-brand-1000); box-shadow:0 0 0 3px var(--ds-brand-ring);' : ''}" onclick="ddToggleAccountMenu()">
                        <span>${escapeHTML(ddState.accountLabel || 'Account')}</span>
                        <span style="display:inline-flex;">${ddState.accountOpen ? accChevUp : accChevDown}</span>
                      </button>
                    </div>
                  </div>

                  ${ddState.accountOpen ? `
                    <div style="display:flex; justify-content:flex-end;">
                      <div class="ds-account-menu">
                        <div class="ds-account-head">
                          <div style="position:relative;">
                            ${ddAvatarHtml(leadUser, 'lg')}
                            <span class="dd-status-dot" style="position:absolute; right:0; bottom:0; border:1.5px solid #ffffff; width:8px; height:8px;"></span>
                          </div>
                          <div style="min-width:0;">
                            <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${escapeHTML(leadUser.name)}</div>
                            <div style="font-size:11px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHTML(leadUser.email)}</div>
                          </div>
                        </div>

                        ${accountGroups.map(grp => `
                          <div class="ds-account-group">
                            ${grp.map(it => `
                              <div class="ds-account-item ${it.danger ? 'is-danger' : ''}" onclick="showToast('Đã chọn: ${it.label} (${it.vi})')">
                                <span style="display:inline-flex; color:${it.danger ? 'var(--ds-red-1000)' : 'var(--ds-grey-500)'};">${ddExactIconSvg(it.icon, 14)}</span>
                                <span style="flex:1;">${it.label}</span>
                                <span style="font-size:10px; color:var(--text-muted);">${it.vi}</span>
                              </div>
                            `).join('')}
                          </div>
                        `).join('')}
                      </div>
                    </div>
                  ` : `
                    <div style="padding:28px; text-align:center; border:1px dashed var(--border-default); border-radius:8px; color:var(--text-muted); font-size:12px;">
                      Menu đang đóng — Nhấn nút <strong>${escapeHTML(ddState.accountLabel || 'Account')}</strong> bên trên để mở lại Account Dropdown.
                    </div>
                  `}
                </div>
              ` : ''}
            </div>
          ` : ''}

          <!-- HƯỚNG DẪN SỬ DỤNG THEO TỪNG TRƯỜNG HỢP -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Hướng dẫn Chọn đúng Loại Dropdown</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>1. Plain &amp; Icon Select:</strong> Dùng cho danh sách chọn 1 mục tiêu chuẩn (từ 5–30 lựa chọn) như vai trò, phòng ban, trạng thái lọc.</li>
                <li><strong>2. Avatar &amp; Status Dot:</strong> Bắt buộc dùng khi chọn <em>Thành viên (Team member)</em> hoặc <em>Người phụ trách</em> để nhận diện nhanh tên + trạng thái Online.</li>
                <li><strong>3. Multi-Tags Select:</strong> Cho phép chọn nhiều mục, tóm gọn thẻ thừa bằng <code>+3</code>, luôn kèm nút <code>×</code> xóa nhanh và <code>Clear all</code>.</li>
                <li><strong>4. Stepper &amp; Account Menu:</strong> Dùng Stepper cho số đếm nhỏ (0–20); dùng Account Menu phân nhóm rõ ràng bằng đường gạch ngang (Profile → Company → Docs → Log out).</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Không dùng Select Dropdown nếu danh sách chỉ có 2–3 lựa chọn cố định (hãy dùng <strong>Radio</strong> hoặc <strong>Button Group</strong>).</li>
                <li>Tránh để danh sách xổ xuống quá dài không có tìm kiếm khi số lượng vượt quá 10 mục.</li>
                <li>Mục bị vô hiệu hóa (<em>Disabled option</em>) trong danh sách vẫn giữ hiển thị để người dùng hiểu tại sao chưa thể chọn, nhưng phải giảm tương phản theo token <code>--ds-grey-300</code>.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2L. BASE COMPONENT: FILTER & SORT ENGINE
    // =========================================================================
    const FS_STORAGE_KEY = 'destudio_filter_sort_v1';

    const FS_PRESETS = [
      { id: 'today',     label: 'Hôm nay (Today)' },
      { id: 'yesterday', label: 'Hôm qua (Yesterday)' },
      { id: '7d',        label: '7 ngày qua (Last 7 days)' },
      { id: '30d',       label: '30 ngày qua (Last 30 days)' },
      { id: '90d',       label: '90 ngày qua (Last 90 days)' },
      { id: '12m',       label: '12 tháng qua (Last 12 months)' },
      { id: 'custom',    label: 'Tùy chỉnh ngày (Choose custom)' }
    ];

    const FS_LIST_OPTIONS = [
      { id: 'opt1', label: 'Đang hoạt động (Active)' },
      { id: 'opt2', label: 'Chờ duyệt (Pending Review)' },
      { id: 'opt3', label: 'Ưu tiên cao (High Priority)' },
      { id: 'opt4', label: 'Bản nháp (Draft)' },
      { id: 'opt5', label: 'Đã lưu trữ (Archived)' },
      { id: 'opt6', label: 'Quá hạn xử lý (Overdue)' }
    ];

    const FS_DEFAULT_STATE = {
      caseFilter: 'all',
      presetId: '12m',
      chipCheckActive: true,
      chipBoxActive: true,
      chipRadioActive: true,
      sortBy: 'Newest first',
      reportTimeframe: 'Last 30 days',
      reportFrom: '01/10/2026',
      reportTo: '24/10/2026',
      reportStatus: 'All Status',
      reportCategory: 'Product Design',
      reportOwner: 'Olivia Rhye',
      compoundTags: ['Olivia', 'Phoenix', 'Lana', 'Candice', 'Drew'],
      multiChecked: ['opt1', 'opt3'],
      radioSelected: 'opt1'
    };

    function loadFsState() {
      try {
        const raw = localStorage.getItem(FS_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(FS_DEFAULT_STATE));
        return { ...JSON.parse(JSON.stringify(FS_DEFAULT_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(FS_DEFAULT_STATE));
      }
    }

    let fsState = loadFsState();

    function saveFsState() {
      try { localStorage.setItem(FS_STORAGE_KEY, JSON.stringify(fsState)); } catch (e) {}
    }

    function resetFsState() {
      fsState = JSON.parse(JSON.stringify(FS_DEFAULT_STATE));
      try { localStorage.removeItem(FS_STORAGE_KEY); } catch (e) {}
      renderCanvas();
      showToast('Đã đặt lại toàn bộ bộ lọc Filter & Sort về mặc định');
    }

    function fsUpdate(key, val) {
      fsState[key] = val;
      saveFsState();
      renderCanvas();
    }

    function fsToggleMultiOpt(id) {
      const has = fsState.multiChecked.includes(id);
      fsState.multiChecked = has
        ? fsState.multiChecked.filter(x => x !== id)
        : [...fsState.multiChecked, id];
      saveFsState();
      renderCanvas();
    }

    function fsRemoveTag(tag) {
      fsState.compoundTags = fsState.compoundTags.filter(t => t !== tag);
      saveFsState();
      renderCanvas();
    }

    function fsApplyReport() {
      showToast(`Đã áp dụng lọc: ${fsState.reportTimeframe} • ${fsState.reportOwner}`);
    }

    function buildFilterSortHTMLSnippet() {
      return `<!-- De Studio 1.0 • Filter & Sort Toolbar + Report Drawer -->
<div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
  <button type="button" class="fs-trigger-pill">
    <span>Today • 24/10/2026</span><span>⌄</span>
  </button>
  <button type="button" class="fs-filter-chip is-orange">
    <span>✓ Checked items</span>
  </button>
  <button type="button" class="fs-filter-chip is-selected">
    <span>Trạng thái: Active</span>
  </button>
  <button type="button" class="fs-clear-btn" aria-label="Xóa lọc">×</button>
</div>`;
    }

    function renderFilterSortPage() {
      const calIco = ddExactIconSvg('calendar', 13);
      const chevDown = ddExactIconSvg('chevron-down', 12);
      const checkIco = ddExactIconSvg('check-mark', 12);
      const filterIco = ddExactIconSvg('filter-funnel', 13);
      const sortIco = ddExactIconSvg('sort-vertical', 13);
      const helpIco = ddExactIconSvg('help-circle', 11);
      const userIco = ddExactIconSvg('user', 13);
      const tagIco = ddExactIconSvg('price-tag', 13);
      const dotOrange = '<span style="width:6px; height:6px; border-radius:999px; background:var(--ds-orange-1000, #f57200); display:inline-block;"></span>';

      const showChips = fsState.caseFilter === 'all' || fsState.caseFilter === 'chips';
      const showPresetsReport = fsState.caseFilter === 'all' || fsState.caseFilter === 'report';
      const showCompoundLists = fsState.caseFilter === 'all' || fsState.caseFilter === 'lists';

      const shownTags = fsState.compoundTags.slice(0, 2);
      const extraTags = fsState.compoundTags.length - shownTags.length;

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">Sử dụng Tokens: Buttons + Badges + Checkboxes + Icons</span>
            <button type="button" class="btn-ds" onclick="resetFsState()">↺ Khôi phục mặc định</button>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn-ds primary" onclick="copyText(buildFilterSortHTMLSnippet())">Copy HTML Code</button>
          </div>
        </div>

        <div class="fs-sheet">
          <!-- HERO HEADER -->
          <div class="dd-hero-card">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / FILTER &amp; SORT</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Bộ lọc &amp; Sắp xếp (Filter &amp; Sort)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:780px; margin-top:6px; line-height:1.6;">
              Hệ thống điều khiển lọc dữ liệu và sắp xếp danh sách được lắp ghép đồng bộ từ bộ nguyên liệu <strong>Buttons</strong>, <strong>Checkboxes / Radio</strong>, <strong>Badges</strong>, <strong>Icons</strong> và màu nhấn <strong>Orange Highlight</strong> (<code>--ds-orange-1000</code> / <code>--ds-orange-50</code>) cho trạng thái đang lọc.
            </p>

            <div style="margin-top:16px; padding-top:12px; border-top:1px dashed var(--border-default); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div class="btn-ds-seg">
                <button type="button" class="${fsState.caseFilter === 'all' ? 'active' : ''}" onclick="fsUpdate('caseFilter', 'all')">Tất cả nhóm (4)</button>
                <button type="button" class="${fsState.caseFilter === 'chips' ? 'active' : ''}" onclick="fsUpdate('caseFilter', 'chips')">① Nút xóa &amp; Filter Chips</button>
                <button type="button" class="${fsState.caseFilter === 'report' ? 'active' : ''}" onclick="fsUpdate('caseFilter', 'report')">② Preset &amp; Report Filters</button>
                <button type="button" class="${fsState.caseFilter === 'lists' ? 'active' : ''}" onclick="fsUpdate('caseFilter', 'lists')">③ Sort &amp; Danh sách lọc</button>
              </div>
              <span style="font-size:11.5px; color:var(--text-muted);">Đang lọc: <strong style="color:var(--ds-orange-text, #c2410c);">${FS_PRESETS.find(p => p.id === fsState.presetId)?.label || '12 tháng qua'}</strong> • <strong>${fsState.multiChecked.length}</strong> điều kiện</span>
            </div>
          </div>

          ${showChips ? `
            <!-- NHÓM 1: NÚT XÓA NHANH, DATE TRIGGER PILLS & FILTER CHIPS -->
            <div class="fs-figma-box">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">① Nút Xóa bộ lọc (Clear), Date Triggers &amp; Quick Filter Chips</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Tổng hợp nút đóng/xóa 2 cỡ, nút chọn ngày (Rectangle &amp; Pill) qua 5 trạng thái và 3 kiểu Filter Chip (Check / Checkbox / Radio).</div>
                </div>
                <span class="ds-badge ds-badge-orange">Active Highlight: Orange 50 / 1000</span>
              </div>

              <div style="display:grid; grid-template-columns: 150px 185px 1fr; gap:12px; align-items:start;">
                <!-- Clear X Icon Buttons (2 sizes x 5 states) -->
                <div style="border-right:1px dashed #e2e8f0; padding-right:12px;">
                  <div style="font-size:11px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">Clear Filter Buttons</div>
                  <div style="font-size:10px; color:var(--text-muted); margin-bottom:6px;">Size Medium (28px) — 5 trạng thái</div>
                  <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:10px;">
                    <button type="button" class="fs-clear-btn" title="Default" onclick="showToast('Clear Button: Default')">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn is-hover" title="Hover">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn is-active" title="Active">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn is-focus" title="Focus">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn is-disabled" title="Disabled" disabled>${DD_CLEAR_SVG}</button>
                  </div>
                  <div style="font-size:10px; color:var(--text-muted); margin-bottom:6px;">Size Small (22px) — 5 trạng thái</div>
                  <div style="display:flex; gap:8px; flex-wrap:wrap;">
                    <button type="button" class="fs-clear-btn sm" title="Default" onclick="showToast('Clear Small: Default')">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn sm is-hover" title="Hover">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn sm is-active" title="Active">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn sm is-focus" title="Focus">${DD_CLEAR_SVG}</button>
                    <button type="button" class="fs-clear-btn sm is-disabled" title="Disabled" disabled>${DD_CLEAR_SVG}</button>
                  </div>
                </div>

                <!-- Date Trigger Pills (Rect & Pill x 5 states) -->
                <div style="border-right:1px dashed #e2e8f0; padding-right:12px;">
                  <div style="font-size:11px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">Date Trigger (Rect &amp; Pill)</div>
                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <div class="fs-trigger-pill"><span>${calIco}</span><span>Today • 24/10/2026</span><span>${chevDown}</span></div>
                    <div class="fs-trigger-pill is-hover"><span>${calIco}</span><span>Hover State</span><span>${chevDown}</span></div>
                    <div class="fs-trigger-pill is-active"><span>${calIco}</span><span>Active Pressed</span><span>${chevDown}</span></div>
                    <div class="fs-trigger-pill is-focus"><span>${calIco}</span><span>Focused Ring</span><span>${chevDown}</span></div>
                    <div class="fs-trigger-pill is-disabled"><span>${calIco}</span><span>Disabled</span><span>${chevDown}</span></div>
                    <div style="display:flex; gap:8px; margin-top:4px; flex-wrap:wrap;">
                      <div class="fs-trigger-pill sm is-pill"><span>${calIco}</span><span>Last 7 days</span><span>${chevDown}</span></div>
                      <div class="fs-trigger-pill sm is-pill is-active"><span>${calIco}</span><span>Selected</span><span>${DD_CLEAR_SVG}</span></div>
                    </div>
                  </div>
                </div>

                <!-- 3 Quick Filter Chip Styles -->
                <div>
                  <div style="font-size:11px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">3 Kiểu Thẻ lọc (Click bật/tắt Active Cam)</div>
                  <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:8px;">
                    <!-- Check Only -->
                    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
                      <div style="font-size:10px; font-weight:600; color:var(--text-muted);">Check Only</div>
                      <button type="button" class="fs-filter-chip" onclick="fsUpdate('chipCheckActive', !fsState.chipCheckActive)"><span>${checkIco}</span><span>Default</span></button>
                      <div class="fs-filter-chip is-selected"><span>${checkIco}</span><span>Selected</span></div>
                      <button type="button" class="fs-filter-chip ${fsState.chipCheckActive ? 'is-orange' : ''}" onclick="fsUpdate('chipCheckActive', !fsState.chipCheckActive)"><span>${checkIco}</span><span>Active Cam</span></button>
                      <div class="fs-filter-chip sm ${fsState.chipCheckActive ? 'is-orange' : ''}"><span>${checkIco}</span><span>Small 24px</span></div>
                    </div>

                    <!-- Checkbox Chip -->
                    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
                      <div style="font-size:10px; font-weight:600; color:var(--text-muted);">Checkbox Chip</div>
                      <button type="button" class="fs-filter-chip" onclick="fsUpdate('chipBoxActive', !fsState.chipBoxActive)">
                        <span class="ds-cb-box" style="width:12px; height:12px; margin:0;"></span><span>Default</span>
                      </button>
                      <div class="fs-filter-chip is-selected">
                        <span class="ds-cb-box" style="width:12px; height:12px; margin:0; background:var(--ds-grey-700); border-color:var(--ds-grey-700); color:#fff;">${checkIco}</span><span>Selected</span>
                      </div>
                      <button type="button" class="fs-filter-chip ${fsState.chipBoxActive ? 'is-orange' : ''}" onclick="fsUpdate('chipBoxActive', !fsState.chipBoxActive)">
                        <span class="ds-cb-box" style="width:12px; height:12px; margin:0; background:${fsState.chipBoxActive ? 'var(--ds-orange-1000)' : '#fff'}; border-color:${fsState.chipBoxActive ? 'var(--ds-orange-1000)' : '#cbd5e1'}; color:#fff;">${fsState.chipBoxActive ? checkIco : ''}</span><span>Active</span>
                      </button>
                      <div class="fs-filter-chip sm is-orange">
                        <span class="ds-cb-box" style="width:10px; height:10px; margin:0; background:var(--ds-orange-1000); border-color:var(--ds-orange-1000); color:#fff;">${checkIco}</span><span>Small 24px</span>
                      </div>
                    </div>

                    <!-- Radio Chip -->
                    <div style="display:flex; flex-direction:column; gap:8px; align-items:flex-start;">
                      <div style="font-size:10px; font-weight:600; color:var(--text-muted);">Radio Chip</div>
                      <button type="button" class="fs-filter-chip" onclick="fsUpdate('chipRadioActive', !fsState.chipRadioActive)">
                        <span class="ds-cb-box" style="width:12px; height:12px; margin:0; border-radius:999px;"></span><span>Default</span>
                      </button>
                      <div class="fs-filter-chip is-selected">
                        <span class="ds-cb-box" style="width:12px; height:12px; margin:0; border-radius:999px; border-color:var(--ds-grey-700); color:var(--ds-grey-700);"><svg width="6" height="6" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="3"/></svg></span><span>Selected</span>
                      </div>
                      <button type="button" class="fs-filter-chip ${fsState.chipRadioActive ? 'is-orange' : ''}" onclick="fsUpdate('chipRadioActive', !fsState.chipRadioActive)">
                        <span class="ds-cb-box" style="width:12px; height:12px; margin:0; border-radius:999px; border-color:${fsState.chipRadioActive ? 'var(--ds-orange-1000)' : '#cbd5e1'}; color:var(--ds-orange-1000);">${fsState.chipRadioActive ? dotOrange : ''}</span><span>Active</span>
                      </button>
                      <div class="fs-filter-chip sm is-orange">
                        <span class="ds-cb-box" style="width:10px; height:10px; margin:0; border-radius:999px; border-color:var(--ds-orange-1000);">${dotOrange}</span><span>Small 24px</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          ${showPresetsReport ? `
            <!-- NHÓM 2: PRESET THỜI GIAN + INLINE FILTERS + REPORT FILTERS DRAWER -->
            <div style="display:grid; grid-template-columns: 185px 1fr 248px; gap:12px; align-items:start;">
              <!-- Preset Popover Menu -->
              <div class="fs-figma-box">
                <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">②a Preset Thời gian</div>
                <div class="fs-preset-menu">
                  ${FS_PRESETS.map(p => {
                    const active = fsState.presetId === p.id;
                    return `
                      <div class="fs-preset-item ${active ? 'is-active' : ''}" onclick="fsUpdate('presetId', '${p.id}')">
                        <span style="width:14px; display:inline-flex; justify-content:center;">${active ? checkIco : ''}</span>
                        <span style="flex:1;">${p.label}</span>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>

              <!-- Inline Filter Field Pairs (Placeholder vs Selected) -->
              <div class="fs-figma-box">
                <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">②b Trường lọc Inline (Mặc định vs Đã chọn)</div>
                <div style="font-size:11px; color:var(--text-muted); margin-bottom:12px;">Cặp có biểu tượng <b>?</b> giải thích quy tắc lọc và cặp tối giản không gợi ý.</div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                  <div class="dd-field">
                    <div class="dd-label"><span>Time Range</span><span class="dd-help-ico">${helpIco}</span></div>
                    <div class="ds-select-trigger"><span class="ds-select-left"><span style="color:var(--ds-grey-400);">${calIco}</span><span class="ds-select-val is-placeholder">Chọn thời gian...</span></span><span>${chevDown}</span></div>
                  </div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Time Range</span></div>
                    <div class="ds-select-trigger"><span class="ds-select-left"><span style="color:var(--ds-grey-400);">${calIco}</span><span class="ds-select-val is-placeholder">All time</span></span><span>${chevDown}</span></div>
                  </div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Time Range</span><span class="dd-help-ico">${helpIco}</span></div>
                    <div class="ds-select-trigger"><span class="ds-select-left"><span>${calIco}</span><span class="ds-select-val">24/10/2026</span></span><span>${chevDown}</span></div>
                  </div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Time Range</span></div>
                    <div class="ds-select-trigger"><span class="ds-select-left"><span>${calIco}</span><span class="ds-select-val">Last 30 days</span></span><span>${chevDown}</span></div>
                  </div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Status Filter</span><span class="dd-help-ico">${helpIco}</span></div>
                    <div class="ds-select-trigger"><span class="ds-select-left"><span>${filterIco}</span><span class="ds-select-val">Active Only</span></span><span>${chevDown}</span></div>
                  </div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Owner</span></div>
                    <div class="ds-select-trigger"><span class="ds-select-left"><span>${userIco}</span><span class="ds-select-val">Olivia Rhye</span></span><span>${chevDown}</span></div>
                  </div>
                </div>
              </div>

              <!-- Report Filters Vertical Drawer Panel -->
              <div class="fs-report-card">
                <div class="fs-report-head">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span style="color:var(--brand-primary); display:inline-flex;">${filterIco}</span>
                    <strong style="font-size:13px; color:var(--text-primary);">Report Filters</strong>
                  </div>
                  <button type="button" class="fs-clear-btn sm" onclick="resetFsState()" title="Đặt lại">${DD_CLEAR_SVG}</button>
                </div>

                <div class="fs-report-sec">
                  <div style="font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Thời gian (Timeframe)</div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Timeframe</span><span class="dd-help-ico">${helpIco}</span></div>
                    <div class="ds-select-trigger" onclick="fsUpdate('reportTimeframe', fsState.reportTimeframe === 'Last 30 days' ? 'Last 90 days' : 'Last 30 days')">
                      <span class="ds-select-left"><span>${calIco}</span><span class="ds-select-val">${escapeHTML(fsState.reportTimeframe)}</span></span>
                      <span>${chevDown}</span>
                    </div>
                  </div>
                </div>

                <div class="fs-report-sec">
                  <div style="font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Khoảng ngày (Date Range)</div>
                  <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                    <div class="dd-field">
                      <div class="dd-label"><span>From</span></div>
                      <div class="ds-select-trigger"><span class="ds-select-left"><span>${calIco}</span><span class="ds-select-val">${fsState.reportFrom}</span></span></div>
                    </div>
                    <div class="dd-field">
                      <div class="dd-label"><span>To</span></div>
                      <div class="ds-select-trigger"><span class="ds-select-left"><span>${calIco}</span><span class="ds-select-val">${fsState.reportTo}</span></span></div>
                    </div>
                  </div>
                </div>

                <div class="fs-report-sec">
                  <div style="font-size:10px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Thuộc tính (Filters)</div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Status</span><span class="dd-help-ico">${helpIco}</span></div>
                    <div class="ds-select-trigger" onclick="fsUpdate('reportStatus', fsState.reportStatus === 'All Status' ? 'Published' : 'All Status')">
                      <span class="ds-select-left"><span>${filterIco}</span><span class="ds-select-val">${escapeHTML(fsState.reportStatus)}</span></span>
                      <span>${chevDown}</span>
                    </div>
                  </div>
                  <div class="dd-field">
                    <div class="dd-label"><span>Owner (Member)</span></div>
                    <div class="ds-select-trigger" onclick="fsUpdate('reportOwner', fsState.reportOwner === 'Olivia Rhye' ? 'Phoenix Baker' : 'Olivia Rhye')">
                      <span class="ds-select-left"><span>${userIco}</span><span class="ds-select-val">${escapeHTML(fsState.reportOwner)}</span></span>
                      <span>${chevDown}</span>
                    </div>
                  </div>
                </div>

                <div class="fs-report-foot">
                  <button type="button" class="ds-btn secondary sm" style="height:28px; padding:0 12px; font-size:11.5px;" onclick="resetFsState()">Reset</button>
                  <button type="button" class="ds-btn dark sm" style="height:28px; padding:0 14px; font-size:11.5px;" onclick="fsApplyReport()">Apply</button>
                </div>
              </div>
            </div>
          ` : ''}

          ${showCompoundLists ? `
            <!-- NHÓM 3: SORT BAR, COMPOUND FILTER & MULTI-MODE OPTION LISTS -->
            <div class="fs-figma-box">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">③ Thanh Sort, Bộ lọc Kết hợp (Prefix + Multi-Tags) &amp; Danh sách Tùy chọn</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Thử bấm xóa thẻ thành viên trên thanh kết hợp hoặc tick nhiều điều kiện trong danh sách Checkbox / Radio.</div>
                </div>
                <span class="ds-badge ds-badge-green">${fsState.multiChecked.length} mục đã chọn</span>
              </div>

              <!-- Row A: Sort + Compound Prefix + Compound Tags -->
              <div style="display:grid; grid-template-columns: 200px 1fr 1fr; gap:12px; margin-bottom:16px;">
                <div>
                  <div style="font-size:10.5px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">Sort Selector</div>
                  <div class="fs-compound-bar" onclick="fsUpdate('sortBy', fsState.sortBy === 'Newest first' ? 'Name A → Z' : 'Newest first')" style="cursor:pointer;">
                    <span class="fs-compound-prefix"><span>${sortIco}</span><span>Sort</span></span>
                    <span class="fs-compound-body"><span style="font-weight:500;">${escapeHTML(fsState.sortBy)}</span><span>${chevDown}</span></span>
                  </div>
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">Prefix Date Filter</div>
                  <div class="fs-compound-bar">
                    <span class="fs-compound-prefix"><span>Today</span><span>${chevDown}</span></span>
                    <span class="fs-compound-body"><span>From: 18/10 – 24/10/2026</span><span>${chevDown}</span></span>
                  </div>
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:600; color:var(--text-muted); margin-bottom:4px;">Compound Date + Badges Tags Filter</div>
                  <div class="fs-compound-bar">
                    <span class="fs-compound-prefix"><span>${calIco}</span><span>Today</span></span>
                    <span class="fs-compound-body">
                      <span class="dd-tags-wrap">
                        ${shownTags.length
                          ? shownTags.map(t => `<span class="dd-tag-chip">${escapeHTML(t)}<span style="cursor:pointer; opacity:0.65;" onclick="fsRemoveTag('${escapeHTML(t)}')">×</span></span>`).join('')
                          : '<span style="color:var(--text-muted); font-size:10.5px;">Chưa gắn thẻ...</span>'}
                        ${extraTags > 0 ? `<span class="dd-tag-count">+${extraTags}</span>` : ''}
                      </span>
                      <span style="color:var(--ds-grey-500);">${tagIco}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Row B: 3 Option List Styles (Icon List, Multi Checkbox List, Single Radio List) -->
              <div style="display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:16px;">
                <!-- Style 1: Icon + Text List -->
                <div>
                  <div class="ds-select-trigger is-focus">
                    <span class="ds-select-left"><span>${filterIco}</span><span class="ds-select-val">Lọc theo biểu tượng</span></span>
                    <span>${chevDown}</span>
                  </div>
                  <div class="fs-option-list">
                    ${FS_LIST_OPTIONS.map((o, idx) => `
                      <div class="fs-option-row ${idx === 0 ? 'is-selected' : ''}" onclick="showToast('Đã lọc: ${o.label}')">
                        <span style="color:var(--ds-grey-500); display:inline-flex;">${filterIco}</span>
                        <span style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o.label}</span>
                        ${idx === 0 ? `<span style="color:var(--ds-green-1000);">${checkIco}</span>` : ''}
                      </div>
                    `).join('')}
                  </div>
                </div>

                <!-- Style 2: Multi-select Checkbox List -->
                <div>
                  <div class="ds-select-trigger is-focus">
                    <span class="ds-select-left"><span>${filterIco}</span><span class="ds-select-val">Chọn nhiều (${fsState.multiChecked.length} mục)</span></span>
                    <span>${chevDown}</span>
                  </div>
                  <div class="fs-option-list">
                    ${FS_LIST_OPTIONS.map(o => {
                      const checked = fsState.multiChecked.includes(o.id);
                      return `
                        <div class="fs-option-row ${checked ? 'is-selected' : ''}" onclick="fsToggleMultiOpt('${o.id}')">
                          <span class="ds-cb-box" style="width:14px; height:14px; margin:0; ${checked ? 'background:var(--ds-brand-1000); border-color:var(--ds-brand-1000); color:#fff;' : ''}">${checked ? checkIco : ''}</span>
                          <span style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o.label}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>

                <!-- Style 3: Single-select Radio List -->
                <div>
                  <div class="ds-select-trigger is-focus">
                    <span class="ds-select-left"><span>${sortIco}</span><span class="ds-select-val">${escapeHTML(FS_LIST_OPTIONS.find(x => x.id === fsState.radioSelected)?.label || 'Chọn 1 mục')}</span></span>
                    <span>${chevDown}</span>
                  </div>
                  <div class="fs-option-list">
                    ${FS_LIST_OPTIONS.map(o => {
                      const active = fsState.radioSelected === o.id;
                      return `
                        <div class="fs-option-row ${active ? 'is-selected' : ''}" onclick="fsUpdate('radioSelected', '${o.id}')">
                          <span class="ds-cb-box" style="width:14px; height:14px; margin:0; border-radius:999px; ${active ? 'border-color:var(--ds-brand-1000); color:var(--ds-brand-1000);' : ''}">
                            ${active ? '<svg width="7" height="7" viewBox="0 0 8 8" fill="currentColor"><circle cx="4" cy="4" r="3"/></svg>' : ''}
                          </span>
                          <span style="flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${o.label}</span>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Thiết kế Bộ lọc &amp; Sắp xếp</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Filter Chips (Tác động tức thì):</strong> Dùng cho các điều kiện hay dùng nhất trên đầu bảng; chuyển sang nền <code>--ds-orange-50</code> và chữ <code>--ds-orange-1000</code> để báo hiệu bộ lọc đang bật.</li>
                <li><strong>Report Filters Drawer (Lọc nhiều tầng):</strong> Gom các bộ lọc phức tạp (Thời gian, Khoảng ngày, Trạng thái, Người phụ trách) vào 1 bảng riêng và chỉ gọi API khi người dùng bấm nút <strong>Apply</strong>.</li>
                <li><strong>Sort vs Filter:</strong> Luôn tách rõ nút <em>Sắp xếp (Sort)</em> ở đầu hoặc góc phải thanh công cụ với nhóm nút <em>Lọc (Filter)</em>, kèm nút <strong>Clear × / Reset</strong> để khôi phục nhanh.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Không ẩn nút <strong>Reset</strong> khi đang có bộ lọc hoạt động — người dùng luôn cần 1 click để quay về dữ liệu gốc.</li>
                <li>Tránh nhồi quá nhiều thẻ Tags dài vào thanh Compound Filter mà không thu gọn bằng bộ đếm <code>+N</code>.</li>
                <li>Không trộn lẫn danh sách chọn 1 (Radio) và chọn nhiều (Checkbox) trong cùng một popover lọc không phân nhóm.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2M. BASE COMPONENT: INPUTS & TEXT AREA ENGINE
    // =========================================================================
    const INP_STORAGE_KEY = 'destudio_inputs_v1';

    const INP_DEFAULT_STATE = {
      emailVal: 'olivia@acme.io',
      phoneCountry: 'US',
      phoneVal: '+1 555-234-5678',
      currencyUnit: 'USD',
      amountVal: '99,000.00',
      websiteVal: 'https://acme.io',
      cardVal: '4242 8890 1234 5678',
      descVal: '',
      keyPrefix: 'HEX',
      keyVal: 'ID-135246',
      liveState: 'default', // 'default' | 'focus' | 'error' | 'disabled'
      mobile16Preview: false
    };

    function loadInpState() {
      try {
        const raw = localStorage.getItem(INP_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(INP_DEFAULT_STATE));
        return { ...JSON.parse(JSON.stringify(INP_DEFAULT_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(INP_DEFAULT_STATE));
      }
    }

    let inpState = loadInpState();

    function saveInpState() {
      try { localStorage.setItem(INP_STORAGE_KEY, JSON.stringify(inpState)); } catch (e) {}
    }

    function resetInpState() {
      inpState = JSON.parse(JSON.stringify(INP_DEFAULT_STATE));
      try { localStorage.removeItem(INP_STORAGE_KEY); } catch (e) {}
      renderCanvas();
      showToast('Đã khôi phục dữ liệu mẫu mặc định cho Inputs & Text Area');
    }

    function inpUpdate(key, val, reRender) {
      inpState[key] = val;
      saveInpState();
      if (reRender) renderCanvas();
    }

    function inpCyclePhoneCountry() {
      const order = ['US', 'UK', 'VN'];
      const presets = { US: '+1 (555) 234-5678', UK: '+44 20 7946 0958', VN: '+84 912 345 678' };
      const next = order[(order.indexOf(inpState.phoneCountry) + 1) % order.length];
      inpState.phoneCountry = next;
      inpState.phoneVal = presets[next];
      saveInpState();
      renderCanvas();
    }

    function inpCycleCurrency() {
      const order = ['USD', 'EUR', 'VND'];
      inpState.currencyUnit = order[(order.indexOf(inpState.currencyUnit) + 1) % order.length];
      saveInpState();
      renderCanvas();
    }

    function inpCycleKeyPrefix() {
      const order = ['HEX', 'UUID', 'API'];
      inpState.keyPrefix = order[(order.indexOf(inpState.keyPrefix) + 1) % order.length];
      saveInpState();
      renderCanvas();
    }

    function inpShuffleKey() {
      const rnd = Math.floor(100000 + Math.random() * 899999);
      inpState.keyVal = 'ID-' + rnd;
      saveInpState();
      renderCanvas();
      showToast(`Đã tạo mã khóa mới: ${inpState.keyPrefix} • ${inpState.keyVal}`);
    }

    const INP_MC_LOGO_SVG = '<svg width="20" height="13" viewBox="0 0 24 15" fill="none"><circle cx="8" cy="7.5" r="6.5" fill="#EB001B"/><circle cx="16" cy="7.5" r="6.5" fill="#F79E1B" fill-opacity="0.88"/></svg>';

    function renderInpSpecBox(variant, st, isLg) {
      const mailIco = ddExactIconSvg('mail-envelope', 13);
      const errIco = ddExactIconSvg('alert-circle', 13);
      const chevIco = ddExactIconSvg('chevron-down', 11);
      const shufIco = ddExactIconSvg('media-shuffle', 12);

      const isErr = st === 'error';
      const isDis = st === 'disabled';
      const isFoc = st === 'focus';
      const boxCls = [
        'ds-field-box',
        isLg ? 'is-lg' : '',
        isErr ? 'is-error' : '',
        isDis ? 'is-disabled' : '',
        isFoc ? 'is-focus' : ''
      ].filter(Boolean).join(' ');

      const hintText = isErr
        ? 'Đây là thông báo lỗi. Vui lòng kiểm tra lại.'
        : 'Văn bản gợi ý nhập liệu cho người dùng.';
      const hintCls = isErr ? 'inp-hint is-err' : (isDis ? 'inp-hint is-disabled' : 'inp-hint');
      const lblCls = isDis ? 'inp-label is-disabled' : 'inp-label';
      const reqMark = isDis ? '' : '<span class="dd-req">*</span>';
      const fontSzStyle = (isLg && inpState.mobile16Preview) ? 'font-size:16px;' : '';

      let labelTitle = 'Email';
      if (variant === 'phone') labelTitle = 'Phone number';
      else if (variant === 'amount') labelTitle = 'Sale amount';
      else if (variant === 'website') labelTitle = 'Website';
      else if (variant === 'card') labelTitle = 'Card number';
      else if (variant === 'textarea') labelTitle = 'Description';
      else if (variant === 'key') labelTitle = 'Key';

      if (variant === 'textarea') {
        const taCls = ['ds-textarea-box', isErr ? 'is-error' : '', isDis ? 'is-disabled' : ''].filter(Boolean).join(' ');
        const taBorder = isFoc ? 'border-color:var(--ds-brand-1000); box-shadow:0 0 0 3px var(--ds-brand-ring);' : '';
        return `
          <div class="inp-field-wrap">
            <div class="${lblCls}"><span>${labelTitle}</span>${reqMark}</div>
            <div class="${taCls}" style="${taBorder}">
              <textarea class="ds-textarea-ctrl" style="${fontSzStyle}" rows="3" placeholder="Enter a description..." ${isDis ? 'disabled' : ''} oninput="inpUpdate('descVal', this.value, false)">${escapeHTML(inpState.descVal)}</textarea>
              ${isErr ? `<span style="position:absolute; top:7px; right:7px; color:var(--ds-red-1000); display:inline-flex;">${errIco}</span>` : ''}
            </div>
            <div class="${hintCls}">${hintText}</div>
          </div>
        `;
      }

      let leftHtml = '';
      let rightHtml = '';
      let val = '';
      let ph = '';
      let onInpKey = '';

      if (variant === 'email-plain') {
        val = inpState.emailVal; ph = 'name@company.com'; onInpKey = 'emailVal';
      } else if (variant === 'email-icon') {
        leftHtml = `<span class="ds-field-lead-ico">${mailIco}</span>`;
        val = inpState.emailVal; ph = 'name@company.com'; onInpKey = 'emailVal';
      } else if (variant === 'phone') {
        leftHtml = `<span class="ds-field-prefix has-sep" style="${isDis ? '' : 'cursor:pointer;'}" onclick="${isDis ? '' : 'inpCyclePhoneCountry()'}" title="Đổi mã quốc gia">${inpState.phoneCountry} ${chevIco}</span>`;
        val = inpState.phoneVal; ph = '+1 (555) 000-0000'; onInpKey = 'phoneVal';
      } else if (variant === 'amount') {
        const sym = inpState.currencyUnit === 'EUR' ? '€' : (inpState.currencyUnit === 'VND' ? '₫' : '$');
        leftHtml = `<span class="ds-field-prefix" style="padding-right:2px; font-weight:700;">${sym}</span>`;
        rightHtml = `<span class="ds-field-suffix has-sep" style="${isDis ? '' : 'cursor:pointer;'}" onclick="${isDis ? '' : 'inpCycleCurrency()'}" title="Đổi đơn vị tiền">${inpState.currencyUnit} ${chevIco}</span>`;
        val = inpState.amountVal; ph = '0.00'; onInpKey = 'amountVal';
      } else if (variant === 'website') {
        val = inpState.websiteVal; ph = 'https://www.example.com'; onInpKey = 'websiteVal';
      } else if (variant === 'card') {
        leftHtml = `<span class="ds-field-lead-ico" style="padding-right:2px;">${INP_MC_LOGO_SVG}</span>`;
        val = ''; ph = 'Card number'; onInpKey = 'cardVal';
        if (isLg) val = inpState.cardVal;
      } else if (variant === 'key') {
        leftHtml = `<span class="ds-field-prefix has-sep" style="${isDis ? '' : 'cursor:pointer;'}" onclick="${isDis ? '' : 'inpCycleKeyPrefix()'}" title="Đổi chuẩn khóa">${inpState.keyPrefix} ${chevIco}</span>`;
        rightHtml = isErr ? '' : `<button type="button" class="ds-field-suffix" style="border:none; background:transparent; cursor:${isDis ? 'not-allowed' : 'pointer'}; color:inherit;" ${isDis ? 'disabled' : ''} onclick="inpShuffleKey()" title="Tạo mã ngẫu nhiên">${shufIco}</button>`;
        val = inpState.keyVal; ph = 'ID-000000'; onInpKey = 'keyVal';
      }

      const errSlot = isErr ? `<span class="ds-field-err-ico">${errIco}</span>` : '';

      return `
        <div class="inp-field-wrap">
          <div class="${lblCls}"><span>${labelTitle}</span>${reqMark}</div>
          <div class="${boxCls}">
            ${leftHtml}
            <input type="text" class="ds-field-ctrl" style="${fontSzStyle}" value="${escapeHTML(val)}" placeholder="${ph}" ${isDis ? 'disabled' : ''} oninput="inpUpdate('${onInpKey}', this.value, false)" />
            ${errSlot}
            ${rightHtml}
          </div>
          <div class="${hintCls}">${hintText}</div>
        </div>
      `;
    }

    function buildInputsHTMLSnippet() {
      return `<!-- De Studio 1.0 • Input Fields & Text Area -->
<div class="inp-field-wrap" style="max-width:320px;">
  <label class="inp-label">Email công việc <span class="dd-req">*</span></label>
  <div class="ds-field-box is-lg">
    <span class="ds-field-lead-ico">✉</span>
    <input type="email" class="ds-field-ctrl" value="olivia.rhye@acme-demo.com" placeholder="name@company.com" />
  </div>
  <div class="inp-hint">Văn bản gợi ý nhập liệu cho người dùng.</div>
</div>

<!-- Mobile Accessibility (<= 600px): font-size >= 16px ngăn tự động zoom trên iOS -->
<style>
  @media (max-width: 600px) {
    .ds-field-ctrl, .ds-textarea-ctrl { font-size: 16px; }
  }
</style>`;
    }

    function renderInputsTextAreaPage() {
      const topVariants = [
        { id: 'email-plain', title: '1. Email (Plain)', tag: 'Cơ bản' },
        { id: 'email-icon',  title: '2. Email + Icon', tag: 'Leading Icon' },
        { id: 'phone',       title: '3. Số điện thoại', tag: 'Country Prefix' },
        { id: 'amount',      title: '4. Số tiền (Amount)', tag: 'Prefix + Unit' }
      ];
      const botVariants = [
        { id: 'website',  title: '5. Địa chỉ Website', tag: 'URL' },
        { id: 'card',     title: '6. Số thẻ (Card)', tag: 'Card Emblem' },
        { id: 'textarea', title: '7. Vùng mô tả', tag: 'Text Area' },
        { id: 'key',      title: '8. Mã khóa (Key)', tag: 'Prefix + Shuffle' }
      ];

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">8 Kiểu Nhập liệu × 3 Trạng thái chuẩn</span>
            <button type="button" class="btn-ds" onclick="resetInpState()">↺ Khôi phục mặc định</button>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn-ds primary" onclick="copyText(buildInputsHTMLSnippet())">Copy HTML Code</button>
          </div>
        </div>

        <div class="inp-sheet">
          <!-- HERO HEADER -->
          <div class="dd-hero-card">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / INPUTS &amp; TEXT AREA</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Trường nhập liệu &amp; Vùng văn bản (Input fields)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:780px; margin-top:6px; line-height:1.6;">
              Trường nhập liệu cho phép người dùng nhập văn bản vào giao diện, thường xuất hiện trong biểu mẫu (<em>Forms</em>) và hộp thoại (<em>Dialogs</em>). Trên thiết bị di động, cỡ chữ trong ô nhập nên tối thiểu <strong>16px</strong> để tránh trình duyệt tự động phóng to màn hình khi focus.
            </p>
          </div>

          <!-- BẢNG 8 BIẾN THỂ × 3 TRẠNG THÁI THEO ẢNH FIGMA -->
          <div class="dd-figma-frame">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">① Ma trận 8 Kiểu Input &amp; Text Area × 3 Trạng thái (Mặc định • Lỗi • Vô hiệu hóa)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Toàn bộ email, số điện thoại và website mẫu đã chuyển sang dữ liệu demo tiếng Anh; click <b>US ⌄</b>, <b>USD ⌄</b>, <b>HEX ⌄</b> hoặc nút <b>Shuffle</b> để đổi trực tiếp.</div>
              </div>
              <span class="ds-badge ds-badge-green">Gõ trực tiếp để thử Focus ring</span>
            </div>

            <!-- Hàng 1: 4 biến thể đầu -->
            <div class="inp-matrix-grid" style="margin-bottom:20px; padding-bottom:18px; border-bottom:1px dashed #cbd5e1;">
              ${topVariants.map(v => `
                <div class="inp-variant-col">
                  <div class="inp-variant-head">
                    <span>${v.title}</span>
                    <span style="font-size:9.5px; font-weight:500; color:var(--text-muted);">${v.tag}</span>
                  </div>
                  ${renderInpSpecBox(v.id, 'default', false)}
                  ${renderInpSpecBox(v.id, 'error', false)}
                  ${renderInpSpecBox(v.id, 'disabled', false)}
                </div>
              `).join('')}
            </div>

            <!-- Hàng 2: 4 biến thể sau -->
            <div class="inp-matrix-grid">
              ${botVariants.map(v => `
                <div class="inp-variant-col">
                  <div class="inp-variant-head">
                    <span>${v.title}</span>
                    <span style="font-size:9.5px; font-weight:500; color:var(--text-muted);">${v.tag}</span>
                  </div>
                  ${renderInpSpecBox(v.id, 'default', false)}
                  ${renderInpSpecBox(v.id, 'error', false)}
                  ${renderInpSpecBox(v.id, 'disabled', false)}
                </div>
              `).join('')}
            </div>
          </div>

          <!-- KHU THỬ NGHIỆM TƯƠNG TÁC LIVE & MOBILE 16PX CHECKER -->
          <div class="btn-group-card">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">② Khu Thử nghiệm Tương tác Form &amp; Kiểm tra Mobile 16px</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Chuyển đổi nhanh trạng thái (Default / Focus / Error / Disabled) hoặc bật thử cỡ chữ Mobile 16px chuẩn chống auto-zoom.</div>
              </div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <div class="btn-ds-seg">
                  <button type="button" class="${inpState.liveState === 'default' ? 'active' : ''}" onclick="inpUpdate('liveState', 'default', true)">Default</button>
                  <button type="button" class="${inpState.liveState === 'focus' ? 'active' : ''}" onclick="inpUpdate('liveState', 'focus', true)">Focus</button>
                  <button type="button" class="${inpState.liveState === 'error' ? 'active' : ''}" onclick="inpUpdate('liveState', 'error', true)">Error</button>
                  <button type="button" class="${inpState.liveState === 'disabled' ? 'active' : ''}" onclick="inpUpdate('liveState', 'disabled', true)">Disabled</button>
                </div>
                <button type="button" class="btn-ds ${inpState.mobile16Preview ? 'primary' : ''}" onclick="inpUpdate('mobile16Preview', !inpState.mobile16Preview, true)">
                  ${inpState.mobile16Preview ? '✓ Mobile 16px: BẬT' : 'Mobile 16px Preview'}
                </button>
              </div>
            </div>
            <div style="padding:16px; display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:16px;">
              ${renderInpSpecBox('email-icon', inpState.liveState, true)}
              ${renderInpSpecBox('phone', inpState.liveState, true)}
              ${renderInpSpecBox('amount', inpState.liveState, true)}
              ${renderInpSpecBox('card', inpState.liveState, true)}
              ${renderInpSpecBox('key', inpState.liveState, true)}
              ${renderInpSpecBox('textarea', inpState.liveState, true)}
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Thiết kế Input &amp; Text Area</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Mobile &ge; 16px:</strong> Luôn đặt <code>font-size: 16px</code> trên màn hình di động để Safari / iOS không tự động phóng to viewport khi người dùng chạm vào ô nhập.</li>
                <li><strong>Prefix / Suffix rõ ngữ nghĩa:</strong> Tách biệt phần chọn cố định (Mã vùng <code>US</code>, đơn vị tiền <code>USD</code>, loại khóa <code>HEX</code>) bằng đường kẻ dọc mảnh để tránh nhầm với nội dung gõ vào.</li>
                <li><strong>Báo lỗi chuẩn SaaS:</strong> Trạng thái Error luôn kết hợp 3 tín hiệu cùng lúc: viền đỏ <code>--ds-red-1000</code>, icon chấm than <code>!</code> bên phải (hoặc góc trên phải đối với Text Area), và dòng giải thích lỗi cụ thể.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Không bỏ nhãn (<em>Label</em>) và chỉ dùng placeholder làm tiêu đề trường — khi người dùng bắt đầu gõ sẽ mất ngữ cảnh.</li>
                <li>Không dùng ô nhập 1 dòng (<code>&lt;input&gt;</code>) cho nội dung dài trên 2 câu — hãy chuyển sang <strong>Text Area</strong> có thể kéo giãn theo chiều dọc.</li>
                <li>Tránh thông báo lỗi chung chung như <em>"Lỗi dữ liệu"</em> — hãy chỉ rõ cách sửa (VD: <em>"Vui lòng nhập đúng định dạng email"</em>).</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2N. BASE COMPONENT: DARK MODE RESPONSIVE PLAYER ENGINE
    // =========================================================================
    const PL_STORAGE_KEY = 'destudio_player_v1';

    const PL_BREAKPOINTS = [
      {
        id: 'desktop',
        badge: 'DESKTOP • ≥ 1024px (> 1023px)',
        title: '1. Desktop (≥ 1024px — Full Controls + Labels)',
        desc: 'Hiện đầy đủ nhãn chữ (Next episode, Volume, Speed, Subtitles, Quality) + mốc thời gian nằm phía trên thanh tua có chấm tròn.',
        aspectH: '235px',
        topTime: true,
        showLabels: true,
        showVolume: true,
        hasKnob: true,
        minimalXs: false
      },
      {
        id: 'tablet',
        badge: 'TABLET • 601px–1023px',
        title: '2. Tablet (601px–1023px — Icon Only + Inline Time)',
        desc: 'Ẩn nhãn chữ cạnh icon, đưa mốc 12:08 / 30:00 xuống cùng hàng nút bên trái, ẩn nút Volume (dùng phím cứng), vẫn giữ chấm kéo tua tròn.',
        aspectH: '200px',
        topTime: false,
        showLabels: false,
        showVolume: false,
        hasKnob: true,
        minimalXs: false
      },
      {
        id: 'mobile',
        badge: 'MOBILE • ≤ 600px',
        title: '3. Mobile (≤ 600px — Tối giản Thiết yếu)',
        desc: 'Chỉ giữ Play/Pause + thời gian bên trái và Settings (gom Quality/Speed/Phụ đề) + Fullscreen bên phải cùng thanh tua mảnh 3px bỏ chấm tròn.',
        aspectH: '180px',
        topTime: false,
        showLabels: false,
        showVolume: false,
        hasKnob: false,
        minimalXs: true
      }
    ];

    const PL_DEFAULT_STATE = {
      bpFilter: 'all', // 'all' | 'desktop' | 'tablet' | 'mobile'
      playing: false,
      elapsedSec: 728,   // 12:08
      durationSec: 1800, // 30:00
      muted: false,
      captions: false,
      speed: '1.0x',
      quality: '1080p'
    };

    function loadPlState() {
      try {
        const raw = localStorage.getItem(PL_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(PL_DEFAULT_STATE));
        const parsed = { ...JSON.parse(JSON.stringify(PL_DEFAULT_STATE)), ...JSON.parse(raw) };
        const legacyMap = { xl: 'desktop', lg: 'desktop', md: 'tablet', sm: 'tablet', xs: 'mobile' };
        if (legacyMap[parsed.bpFilter]) parsed.bpFilter = legacyMap[parsed.bpFilter];
        if (!['all', 'desktop', 'tablet', 'mobile'].includes(parsed.bpFilter)) parsed.bpFilter = 'all';
        return parsed;
      } catch (e) {
        return JSON.parse(JSON.stringify(PL_DEFAULT_STATE));
      }
    }

    let plState = loadPlState();

    function savePlState() {
      try { localStorage.setItem(PL_STORAGE_KEY, JSON.stringify(plState)); } catch (e) {}
    }

    function resetPlState() {
      plState = JSON.parse(JSON.stringify(PL_DEFAULT_STATE));
      try { localStorage.removeItem(PL_STORAGE_KEY); } catch (e) {}
      renderCanvas();
      showToast('Đã khôi phục thông số Player mặc định (12:08 / 30:00)');
    }

    function plIcon(slug, size, preferFilled) {
      if (!Array.isArray(iconsCatalog) || !iconsCatalog.length) return '';
      const q = String(slug || '').toLowerCase();
      const ic = iconsCatalog.find(i => (i.slug || '').toLowerCase() === q)
        || iconsCatalog.find(i => (i.slug || '').toLowerCase().includes(q));
      if (!ic) return '';
      const style = (preferFilled && ic.variants && ic.variants.filled) ? 'filled' : 'outlined';
      return buildIconSvgTag(ic, size || 15, 'currentColor', style, false);
    }

    function plFormatTime(sec) {
      const s = Math.max(0, Math.floor(sec || 0));
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    }

    function plTogglePlay() {
      plState.playing = !plState.playing;
      savePlState();
      renderCanvas();
      showToast(plState.playing ? 'Đang phát video' : 'Đã tạm dừng video');
    }

    function plSkip(delta) {
      plState.elapsedSec = Math.max(0, Math.min(plState.durationSec, (Number(plState.elapsedSec) || 0) + delta));
      savePlState();
      renderCanvas();
    }

    function plSeekByClick(ev) {
      const rect = ev.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (ev.clientX - rect.left) / Math.max(1, rect.width)));
      plState.elapsedSec = Math.round(ratio * plState.durationSec);
      savePlState();
      renderCanvas();
    }

    function plToggleMute() {
      plState.muted = !plState.muted;
      savePlState();
      renderCanvas();
      showToast(plState.muted ? 'Đã tắt tiếng (Muted)' : 'Đã bật âm thanh');
    }

    function plCycleSpeed() {
      const list = ['1.0x', '1.25x', '1.5x', '2.0x'];
      plState.speed = list[(list.indexOf(plState.speed) + 1) % list.length];
      savePlState();
      renderCanvas();
      showToast(`Tốc độ phát: ${plState.speed}`);
    }

    function plToggleCaptions() {
      plState.captions = !plState.captions;
      savePlState();
      renderCanvas();
      showToast(plState.captions ? 'Đã bật Phụ đề (Subtitles ON)' : 'Đã tắt Phụ đề');
    }

    function plCycleQuality() {
      const list = ['4K', '1080p', '720p'];
      plState.quality = list[(list.indexOf(plState.quality) + 1) % list.length];
      savePlState();
      renderCanvas();
      showToast(`Chất lượng: ${plState.quality}`);
    }

    function plSetBpFilter(bp) {
      plState.bpFilter = bp;
      savePlState();
      renderCanvas();
    }

    const PL_BACKDROP_SVG = `
      <svg viewBox="0 0 800 320" preserveAspectRatio="xMidYMid slice" style="position:absolute; inset:0; width:100%; height:100%; display:block;">
        <defs>
          <linearGradient id="plSky" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0f3c5c"/>
            <stop offset="48%" stop-color="#1e6f8c"/>
            <stop offset="100%" stop-color="#0b2838"/>
          </linearGradient>
          <radialGradient id="plSun" cx="68%" cy="16%" r="45%">
            <stop offset="0%" stop-color="#fde68a" stop-opacity="0.95"/>
            <stop offset="45%" stop-color="#f59e0b" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#1e6f8c" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="800" height="320" fill="url(#plSky)"/>
        <rect width="800" height="320" fill="url(#plSun)"/>
        <!-- Floating cliff islands -->
        <polygon points="45,0 180,0 140,125 90,150 60,95" fill="#172a36" opacity="0.92"/>
        <polygon points="620,0 800,0 800,135 675,140 635,75" fill="#132631" opacity="0.92"/>
        <polygon points="565,58 635,52 622,108 585,116" fill="#1a3442" opacity="0.88"/>
        <!-- Mountain forest layers -->
        <path d="M0,215 Q160,155 340,200 T710,175 L800,195 L800,320 L0,320 Z" fill="#0d4a50" opacity="0.78"/>
        <path d="M0,248 Q220,198 460,240 T800,220 L800,320 L0,320 Z" fill="#0a2e38" opacity="0.95"/>
        <!-- Stylized luminous wing silhouette -->
        <path d="M120,235 Q310,125 585,178 Q490,218 330,225 Q220,255 120,235 Z" fill="#0f766e" opacity="0.72"/>
        <path d="M295,155 Q445,88 535,142 Q430,172 295,155 Z" fill="#f59e0b" opacity="0.32"/>
      </svg>`;

    function renderSinglePlayerViewport(bp, customMaxWidth) {
      const pct = Math.max(0, Math.min(100, (plState.elapsedSec / Math.max(1, plState.durationSec)) * 100)).toFixed(1);
      const bufPct = Math.min(100, parseFloat(pct) + 22).toFixed(1);
      const curStr = plFormatTime(plState.elapsedSec);
      const durStr = plFormatTime(plState.durationSec);

      const playSvg = plIcon(plState.playing ? 'media-pause' : 'media-play', 16, true);
      const rep10Svg = plIcon('replay-10s', 15, false);
      const fwd10Svg = plIcon('forward-10s', 15, false);
      const nextSvg = plIcon('media-next-end', 15, true);
      const volSvg = plIcon(plState.muted ? 'volume-on-off' : 'volume-on', 15, true);
      const spdSvg = plIcon('speed-gauge', 15, true);
      const capSvg = plIcon(plState.captions ? 'captions-on' : 'captions-on-off', 15, true);
      const gearSvg = plIcon('settings-gear', 15, true);
      const castSvg = plIcon('screen-cast', 15, false);
      const fullSvg = plIcon('expand-corners', 14, false);

      const frameStyle = customMaxWidth ? `max-width:${customMaxWidth}; margin:0 auto;` : '';

      return `
        <div class="pl-viewport-card" style="${frameStyle}">
          <div class="pl-viewport-meta">
            <div style="display:flex; align-items:center; gap:8px; min-width:0;">
              <span class="ds-badge ds-badge-blue" style="background:rgba(55,88,249,0.2); border-color:rgba(96,165,250,0.45); color:#93c5fd;">${bp.badge}</span>
              <strong style="color:#f8fafc; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${bp.title}</strong>
            </div>
            <span style="font-size:10px; color:#94a3b8; white-space:nowrap;">${plState.speed} • ${plState.quality}</span>
          </div>

          <div class="pl-stage" style="height:${bp.aspectH};">
            ${PL_BACKDROP_SVG}
            <div class="pl-scrim"></div>

            <!-- Dark Mode Overlay Controls -->
            <div class="pl-controls-wrap ${bp.minimalXs ? 'is-compact' : ''}">
              ${bp.topTime ? `
                <div class="pl-time-top">
                  <span>${curStr}</span>
                  <span>${durStr}</span>
                </div>
              ` : ''}

              <!-- Progress Scrub Track -->
              <div class="pl-track ${bp.hasKnob ? '' : 'is-slim'}" onclick="plSeekByClick(event)" title="Click để tua video">
                <div class="pl-track-buf" style="width:${bufPct}%;"></div>
                <div class="pl-track-fill" style="width:${pct}%;"></div>
                ${bp.hasKnob ? `<div class="pl-track-knob" style="left:${pct}%;"></div>` : ''}
              </div>

              <!-- Control Icons Row -->
              <div class="pl-bar-row">
                <div class="pl-bar-group">
                  <button type="button" class="pl-btn" onclick="plTogglePlay()" title="${plState.playing ? 'Tạm dừng' : 'Phát'}">${playSvg}</button>
                  ${!bp.minimalXs ? `
                    <button type="button" class="pl-btn" onclick="plSkip(-10)" title="Tua lùi 10 giây">${rep10Svg}</button>
                    <button type="button" class="pl-btn" onclick="plSkip(10)" title="Tua tới 10 giây">${fwd10Svg}</button>
                    <button type="button" class="pl-btn" onclick="showToast('Chuyển tập tiếp theo (Next episode)')">
                      ${nextSvg}
                      ${bp.showLabels ? '<span>Next episode</span>' : ''}
                    </button>
                  ` : ''}
                  ${!bp.topTime ? `<span class="pl-time-inline">${curStr} / ${durStr}</span>` : ''}
                </div>

                <div class="pl-bar-group">
                  ${!bp.minimalXs ? `
                    ${bp.showVolume ? `
                      <button type="button" class="pl-btn ${plState.muted ? 'is-active' : ''}" onclick="plToggleMute()">
                        ${volSvg}
                        ${bp.showLabels ? `<span>${plState.muted ? 'Muted' : 'Volume'}</span>` : ''}
                      </button>
                    ` : ''}
                    <button type="button" class="pl-btn" onclick="plCycleSpeed()" title="Đổi tốc độ phát">
                      ${spdSvg}
                      ${bp.showLabels ? `<span>Speed (${plState.speed})</span>` : ''}
                    </button>
                    <button type="button" class="pl-btn ${plState.captions ? 'is-active' : ''}" onclick="plToggleCaptions()" title="Phụ đề">
                      ${capSvg}
                      ${bp.showLabels ? '<span>Sounds &amp; Subtitles</span>' : ''}
                    </button>
                  ` : ''}
                  <button type="button" class="pl-btn" onclick="plCycleQuality()" title="Cài đặt chất lượng (${plState.quality})">
                    ${gearSvg}
                    ${bp.showLabels ? `<span>Quality (${plState.quality})</span>` : ''}
                  </button>
                  ${!bp.minimalXs ? `
                    <button type="button" class="pl-btn" onclick="showToast('Kết nối trình chiếu (Cast / AirPlay)')" title="Trình chiếu">${castSvg}</button>
                  ` : ''}
                  <button type="button" class="pl-btn" onclick="showToast('Toàn màn hình (Fullscreen)')" title="Toàn màn hình">${fullSvg}</button>
                </div>
              </div>
            </div>
          </div>

          <div style="padding:8px 14px; background:#0f172a; font-size:11px; color:#cbd5e1; border-top:1px solid rgba(255,255,255,0.06);">
            ${bp.desc}
          </div>

        </div>
      `;
    }

    function buildPlayerHTMLSnippet() {
      return `<!-- De Studio 1.0 • Dark Mode Responsive Video Player Controls -->
<div class="pl-viewport-card" data-theme="dark">
  <div class="pl-stage" style="height:360px;">
    <div class="pl-scrim"></div>
    <div class="pl-controls-wrap">
      <div class="pl-time-top"><span>12:08</span><span>30:00</span></div>
      <div class="pl-track">
        <div class="pl-track-fill" style="width:40%; background:var(--ds-brand-1000);"></div>
        <div class="pl-track-knob" style="left:40%;"></div>
      </div>
      <div class="pl-bar-row">
        <div class="pl-bar-group">
          <button class="pl-btn">▶</button>
          <button class="pl-btn">↺ 10s</button>
          <button class="pl-btn">↻ 10s</button>
          <button class="pl-btn">⏭ Next episode</button>
        </div>
        <div class="pl-bar-group">
          <button class="pl-btn">🔊 Volume</button>
          <button class="pl-btn">⏱ Speed</button>
          <button class="pl-btn">💬 Subtitles</button>
          <button class="pl-btn">⚙ Quality</button>
          <button class="pl-btn">⛶</button>
        </div>
      </div>
    </div>
  </div>
</div>`;
    }

    function renderPlayerPage() {
      const listToShow = plState.bpFilter === 'all'
        ? PL_BREAKPOINTS
        : PL_BREAKPOINTS.filter(b => b.id === plState.bpFilter);

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-dark">Dark Mode Mandatory • 3 Responsive Breakpoints</span>
            <button type="button" class="btn-ds" onclick="resetPlState()">↺ Khôi phục mặc định</button>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn-ds primary" onclick="copyText(buildPlayerHTMLSnippet())">Copy HTML Code</button>
          </div>
        </div>

        <div class="pl-sheet">
          <!-- HERO HEADER + DARK MODE PALETTE -->
          <div class="dd-hero-card">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / PLAYER</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Trình phát Video Responsive (Dark Mode Player)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:780px; margin-top:6px; line-height:1.6;">
              Thành phần <strong>Video Player</strong> luôn sử dụng bảng màu <strong>Dark Mode cố định</strong> (ngay cả khi hệ thống đang ở Light Mode) nhằm bảo đảm độ tương phản chữ/icon trắng trên nền video và lớp phủ tối (<em>Scrim Gradient</em>), thích ứng linh hoạt qua 3 ngưỡng chuẩn: <strong>Desktop (≥ 1024px)</strong>, <strong>Tablet (601–1023px)</strong> và <strong>Mobile (≤ 600px)</strong>.
            </p>

            <!-- 4 Tokens Dark Mode bắt buộc -->
            <div class="pl-dark-token-strip">
              <div class="pl-token-chip">
                <span class="pl-token-swatch" style="background:#090d16;"></span>
                <div><div style="font-size:10.5px; font-weight:700;">Surface &amp; Scrim</div><div style="font-size:9.5px; color:#94a3b8;">#090D16 • 94% gradient</div></div>
              </div>
              <div class="pl-token-chip">
                <span class="pl-token-swatch" style="background:var(--ds-brand-1000, #3758f9);"></span>
                <div><div style="font-size:10.5px; font-weight:700;">Brand Accent Track</div><div style="font-size:9.5px; color:#94a3b8;">--ds-brand-1000 (Colors)</div></div>
              </div>
              <div class="pl-token-chip">
                <span class="pl-token-swatch" style="background:#ffffff;"></span>
                <div><div style="font-size:10.5px; font-weight:700;">Controls &amp; Icons</div><div style="font-size:9.5px; color:#94a3b8;">#FFFFFF • 100% Contrast</div></div>
              </div>
              <div class="pl-token-chip">
                <span class="pl-token-swatch" style="background:rgba(255,255,255,0.28);"></span>
                <div><div style="font-size:10.5px; font-weight:700;">Inactive Track</div><div style="font-size:9.5px; color:#94a3b8;">rgba(255,255,255, 0.28)</div></div>
              </div>
            </div>

            <!-- Thanh chọn kích thước màn hình -->
            <div style="margin-top:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div class="btn-ds-seg">
                <button type="button" class="${plState.bpFilter === 'all' ? 'active' : ''}" onclick="plSetBpFilter('all')">Xem cả 3 khoảng</button>
                <button type="button" class="${plState.bpFilter === 'desktop' ? 'active' : ''}" onclick="plSetBpFilter('desktop')">Desktop (≥ 1024px)</button>
                <button type="button" class="${plState.bpFilter === 'tablet' ? 'active' : ''}" onclick="plSetBpFilter('tablet')">Tablet (601–1023px)</button>
                <button type="button" class="${plState.bpFilter === 'mobile' ? 'active' : ''}" onclick="plSetBpFilter('mobile')">Mobile (≤ 600px)</button>
              </div>
              <span style="font-size:11px; color:var(--text-muted);">Click lên <b>Play, −10s, +10s, thanh tua, Volume, Speed, CC, Quality</b> để thử ngay!</span>
            </div>
          </div>

          <!-- DANH SÁCH CÁC KÍCH THƯỚC RESPONSIVE -->
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${listToShow.map(bp => {
              const widthMap = { desktop: '100%', tablet: '76%', mobile: '390px' };
              return renderSinglePlayerViewport(bp, widthMap[bp.id] || '100%');
            }).join('')}
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Responsive &amp; Dark Mode Player</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Bắt buộc Dark Mode trên Player:</strong> Mọi nút bấm, icon (lấy từ bộ <em>Foundation Icons</em>) và nhãn thời gian dùng màu <code>#FFFFFF</code> trên lớp phủ tối <code>linear-gradient(to top, rgba(9,13,22,0.94), transparent)</code> để không bị chìm vào cảnh phim sáng.</li>
                <li><strong>Thứ tự rút gọn theo 3 ngưỡng chuẩn:</strong> (1) <strong>Desktop (≥ 1024px)</strong> hiện đầy đủ nhãn chữ + thời gian trên đầu thanh tua có knob → (2) <strong>Tablet (601–1023px)</strong> chỉ giữ icon, đưa thời gian vào cùng hàng &amp; ẩn nút Volume → (3) <strong>Mobile (≤ 600px)</strong> dùng thanh tua mảnh 3px bỏ knob và gom Speed/Phụ đề/Chất lượng vào 1 nút <em>Settings</em>.</li>
                <li><strong>Thanh tua xanh thương hiệu <code>--ds-brand-1000</code>:</strong> Tự động đồng bộ theo màu Brand trong trang <em>Colors</em>, giữ độ tương phản cao trên nền track mờ <code>rgba(255,255,255,0.28)</code> giúp dễ định vị thời điểm phát.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Không dùng giao diện Light Mode (chữ đen nền trắng) cho các nút điều khiển nổi đè lên khung video.</li>
                <li>Không cố nhồi đầy đủ chữ <em>"Next episode / Sounds &amp; Subtitles / Quality"</em> ở Tablet và Mobile gây vỡ hàng hoặc che mất nội dung video.</li>
                <li>Tránh đặt nút <em>Play/Fullscreen</em> quá sát cạnh màn hình dưới <code>8px</code> padding trên thiết bị cảm ứng.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2O. BASE COMPONENT: PROGRESS INDICATORS ENGINE
    // =========================================================================
    const PG_STORAGE_KEY = 'destudio_progress_v1';

    const PG_LINEAR_STEPS = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    const PG_RING_SIZES = [
      { id: 'xxs', label: 'XXS', px: 48,  stroke: 5,  pctFs: 10, subFs: 9,  outsideSub: true },
      { id: 'sm',  label: 'SM',  px: 86,  stroke: 8,  pctFs: 16, subFs: 9,  outsideSub: false },
      { id: 'md',  label: 'MD',  px: 108, stroke: 10, pctFs: 20, subFs: 10, outsideSub: false },
      { id: 'lg',  label: 'LG',  px: 130, stroke: 12, pctFs: 24, subFs: 11, outsideSub: false },
      { id: 'xl',  label: 'XL',  px: 156, stroke: 14, pctFs: 28, subFs: 12, outsideSub: false }
    ];

    const PG_COLOR_TONES = [
      { id: 'brand', label: 'Brand',   cssVar: 'var(--ds-brand-1000, #3758f9)' },
      { id: 'green', label: 'Success', cssVar: 'var(--ds-green-1000, #16a34a)' },
      { id: 'orange',label: 'Warning', cssVar: 'var(--ds-orange-1000, #f57200)' },
      { id: 'red',   label: 'Danger',  cssVar: 'var(--ds-red-1000, #cd2b31)' }
    ];

    const PG_DEFAULT_STATE = {
      secFilter: 'all', // 'all' | 'linear' | 'circular'
      pct: 40,
      tone: 'brand',
      ringLabel: 'Active users',
      miniLabel: 'Users'
    };

    function loadPgState() {
      try {
        const raw = localStorage.getItem(PG_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(PG_DEFAULT_STATE));
        return { ...JSON.parse(JSON.stringify(PG_DEFAULT_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(PG_DEFAULT_STATE));
      }
    }

    let pgState = loadPgState();

    function savePgState() {
      try { localStorage.setItem(PG_STORAGE_KEY, JSON.stringify(pgState)); } catch (e) {}
    }

    function resetPgState() {
      pgState = JSON.parse(JSON.stringify(PG_DEFAULT_STATE));
      try { localStorage.removeItem(PG_STORAGE_KEY); } catch (e) {}
      renderCanvas();
      showToast('Đã đặt lại thông số Progress Indicators mặc định (40%)');
    }

    function pgUpdate(key, val) {
      pgState[key] = val;
      savePgState();
      renderCanvas();
    }

    function pgGetAccentColor() {
      const found = PG_COLOR_TONES.find(t => t.id === pgState.tone) || PG_COLOR_TONES[0];
      return found.cssVar;
    }

    function renderPgLinearBar(pct, labelPos, accentColor) {
      const fillWidth = pct === 0 ? '6px' : `${pct}%`;
      const clampedTip = `clamp(14px, ${pct}%, calc(100% - 14px))`;

      if (labelPos === 'none') {
        return `
          <div class="pg-bar-wrap">
            <div class="pg-track"><div class="pg-fill" style="width:${fillWidth}; background:${accentColor};"></div></div>
          </div>
        `;
      }
      if (labelPos === 'right') {
        return `
          <div class="pg-bar-wrap">
            <div class="pg-track"><div class="pg-fill" style="width:${fillWidth}; background:${accentColor};"></div></div>
            <span class="pg-pct-text">${pct}%</span>
          </div>
        `;
      }
      if (labelPos === 'bottom-right') {
        return `
          <div class="pg-bar-wrap has-bottom-label">
            <div class="pg-track" style="flex:none; width:100%;"><div class="pg-fill" style="width:${fillWidth}; background:${accentColor};"></div></div>
            <span class="pg-pct-text" style="text-align:right;">${pct}%</span>
          </div>
        `;
      }
      if (labelPos === 'tooltip-top') {
        return `
          <div class="pg-bar-wrap has-tip-top">
            <span class="pg-tooltip-pill is-top" style="left:${clampedTip};">${pct}%</span>
            <div class="pg-track"><div class="pg-fill" style="width:${fillWidth}; background:${accentColor};"></div></div>
          </div>
        `;
      }
      // tooltip-bottom
      return `
        <div class="pg-bar-wrap has-tip-bot">
          <div class="pg-track"><div class="pg-fill" style="width:${fillWidth}; background:${accentColor};"></div></div>
          <span class="pg-tooltip-pill is-bot" style="left:${clampedTip};">${pct}%</span>
        </div>
      `;
    }

    function renderPgCircleRing(sz, pct, withLabel, accentColor) {
      const S = sz.px;
      const st = sz.stroke;
      const cx = S / 2;
      const cy = S / 2;
      const r = (S - st) / 2;
      const C = 2 * Math.PI * r;
      const offset = C * (1 - pct / 100);
      const subText = sz.outsideSub ? (pgState.miniLabel || 'Users') : (pgState.ringLabel || 'Active users');

      return `
        <div class="pg-ring-unit">
          <div class="pg-ring-box" style="width:${S}px; height:${S}px;">
            <svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">
              <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--ds-grey-100, #eaecf0)" stroke-width="${st}" />
              <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${accentColor}" stroke-width="${st}" stroke-linecap="round"
                stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
                transform="rotate(-90 ${cx} ${cy})" />
            </svg>
            <div class="pg-ring-center">
              ${(withLabel && !sz.outsideSub) ? `<span class="pg-ring-sub" style="font-size:${sz.subFs}px;">${escapeHTML(subText)}</span>` : ''}
              <span class="pg-ring-pct" style="font-size:${sz.pctFs}px;">${pct}%</span>
            </div>
          </div>
          ${(withLabel && sz.outsideSub) ? `<span class="pg-ring-sub" style="font-size:${sz.subFs}px;">${escapeHTML(subText)}</span>` : ''}
        </div>
      `;
    }

    function renderPgHalfGauge(sz, pct, withLabel, accentColor) {
      const S = sz.px;
      const st = sz.stroke;
      const cy = S / 2;
      const H = cy + st / 2 + 2;
      const r = (S - st) / 2;
      const x0 = st / 2;
      const x1 = S - st / 2;
      const L = Math.PI * r;
      const offset = L * (1 - pct / 100);
      const subText = sz.outsideSub ? (pgState.miniLabel || 'Users') : (pgState.ringLabel || 'Active users');

      return `
        <div class="pg-ring-unit">
          <div class="pg-ring-box" style="width:${S}px; height:${H}px;">
            <svg width="${S}" height="${H}" viewBox="0 0 ${S} ${H}">
              <path d="M ${x0} ${cy} A ${r} ${r} 0 0 1 ${x1} ${cy}" fill="none" stroke="var(--ds-grey-100, #eaecf0)" stroke-width="${st}" stroke-linecap="round" />
              <path d="M ${x0} ${cy} A ${r} ${r} 0 0 1 ${x1} ${cy}" fill="none" stroke="${accentColor}" stroke-width="${st}" stroke-linecap="round"
                stroke-dasharray="${L.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}" />
            </svg>
            <div class="pg-ring-center is-half" style="padding-bottom:${sz.outsideSub ? 2 : 5}px;">
              ${(withLabel && !sz.outsideSub) ? `<span class="pg-ring-sub" style="font-size:${sz.subFs}px;">${escapeHTML(subText)}</span>` : ''}
              <span class="pg-ring-pct" style="font-size:${sz.outsideSub ? 9.5 : Math.max(12, sz.pctFs - 2)}px;">${pct}%</span>
            </div>
          </div>
          ${(withLabel && sz.outsideSub) ? `<span class="pg-ring-sub" style="font-size:${sz.subFs}px;">${escapeHTML(subText)}</span>` : ''}
        </div>
      `;
    }

    function buildProgressHTMLSnippet() {
      const accent = pgGetAccentColor();
      return `<!-- De Studio 1.0 • Linear & Circular Progress Indicators -->
<div class="pg-bar-wrap">
  <div class="pg-track">
    <div class="pg-fill" style="width:${pgState.pct}%; background:${accent};"></div>
  </div>
  <span class="pg-pct-text">${pgState.pct}%</span>
</div>

<!-- SVG Circular Progress Ring -->
<svg width="108" height="108" viewBox="0 0 108 108">
  <circle cx="54" cy="54" r="49" fill="none" stroke="var(--ds-grey-100)" stroke-width="10" />
  <circle cx="54" cy="54" r="49" fill="none" stroke="${accent}" stroke-width="10" stroke-linecap="round"
    stroke-dasharray="307.88" stroke-dashoffset="${(307.88 * (1 - pgState.pct / 100)).toFixed(2)}" transform="rotate(-90 54 54)" />
</svg>`;
    }

    function renderProgressIndicatorsPage() {
      const accent = pgGetAccentColor();
      const showLinear = pgState.secFilter === 'all' || pgState.secFilter === 'linear';
      const showCircular = pgState.secFilter === 'all' || pgState.secFilter === 'circular';

      const linearCols = [
        { pos: 'none',           title: '1. Không nhãn',     sub: 'Bar tối giản' },
        { pos: 'right',          title: '2. Nhãn bên phải',  sub: 'Inline Right' },
        { pos: 'bottom-right',   title: '3. Góc dưới phải',  sub: 'Bottom Right' },
        { pos: 'tooltip-top',    title: '4. Tooltip Trên',   sub: 'Floating Top' },
        { pos: 'tooltip-bottom', title: '5. Tooltip Dưới',   sub: 'Floating Bottom' }
      ];

      return `
        <div class="colors-toolbar-bar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <span class="ds-badge ds-badge-blue">Linear (5 kiểu × 0–100%) + Ring &amp; Half-Circle (5 cỡ)</span>
            <button type="button" class="btn-ds" onclick="resetPgState()">↺ Khôi phục mặc định</button>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn-ds primary" onclick="copyText(buildProgressHTMLSnippet())">Copy HTML &amp; SVG</button>
          </div>
        </div>

        <div class="pg-sheet">
          <!-- HERO HEADER & BỘ ĐIỀU KHIỂN THỜI GIAN THỰC -->
          <div class="dd-hero-card">
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / PROGRESS INDICATORS</div>
            <h1 style="font-size:24px; font-weight:700; color:var(--text-primary); margin-top:4px; letter-spacing:-0.02em;">Chỉ báo Tiến trình (Progress Indicators)</h1>
            <p style="font-size:13px; color:var(--text-secondary); max-width:780px; margin-top:6px; line-height:1.6;">
              Thành phần <strong>Progress Indicators</strong> thể hiện mức độ hoàn thành của một tác vụ (tải tệp, thiết lập hồ sơ, dung lượng) hoặc tỷ lệ đạt chỉ tiêu KPI thông qua 3 hình thái: <strong>Thanh ngang (Linear)</strong>, <strong>Vòng tròn (Circular Ring 360°)</strong> và <strong>Bán nguyệt (Half-Circle Gauge 180°)</strong>.
            </p>

            <!-- Interactive Live Controls -->
            <div style="margin-top:16px; padding-top:14px; border-top:1px dashed var(--border-default); display:grid; grid-template-columns: 1.2fr 1fr auto; gap:16px; align-items:end;">
              <div>
                <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:6px;">
                  <span>Kéo chỉnh % trực tiếp (Áp dụng cho Vòng tròn &amp; Bar thử nghiệm)</span>
                  <strong style="color:${accent};">${pgState.pct}%</strong>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <input type="range" min="0" max="100" step="5" value="${pgState.pct}" style="flex:1; accent-color:${accent};" oninput="pgUpdate('pct', Number(this.value))" />
                  <div style="display:flex; gap:4px;">
                    ${[10, 40, 75, 100].map(v => `
                      <button type="button" class="btn-ds" style="padding:4px 7px; font-size:10.5px; ${pgState.pct === v ? 'border-color:var(--brand-primary); color:var(--brand-primary); font-weight:700;' : ''}" onclick="pgUpdate('pct', ${v})">${v}%</button>
                    `).join('')}
                  </div>
                </div>
              </div>

              <div>
                <div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Nhãn trong vòng tròn (Label)</div>
                <input type="text" class="ds-input" style="height:30px; font-size:12px;" value="${escapeHTML(pgState.ringLabel)}" oninput="pgUpdate('ringLabel', this.value)" />
              </div>

              <div>
                <div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:4px;">Màu sắc (Colors)</div>
                <div class="btn-ds-seg">
                  ${PG_COLOR_TONES.map(t => `
                    <button type="button" class="${pgState.tone === t.id ? 'active' : ''}" onclick="pgUpdate('tone', '${t.id}')">${t.label}</button>
                  `).join('')}
                </div>
              </div>
            </div>

            <div style="margin-top:12px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
              <div class="btn-ds-seg">
                <button type="button" class="${pgState.secFilter === 'all' ? 'active' : ''}" onclick="pgUpdate('secFilter', 'all')">Tất cả (Linear + Vòng tròn)</button>
                <button type="button" class="${pgState.secFilter === 'linear' ? 'active' : ''}" onclick="pgUpdate('secFilter', 'linear')">① Thanh ngang Linear (5 kiểu)</button>
                <button type="button" class="${pgState.secFilter === 'circular' ? 'active' : ''}" onclick="pgUpdate('secFilter', 'circular')">② Vòng tròn &amp; Bán nguyệt (5 cỡ)</button>
              </div>
              <span style="font-size:11px; color:var(--text-muted);">Live Bar (${pgState.pct}%): <strong style="color:${accent};">${pgState.pct}%</strong></span>
            </div>
          </div>

          ${showLinear ? `
            <!-- PHẦN 1: LINEAR PROGRESS BARS (5 KIỂU × 0%–100%) -->
            <div class="dd-figma-frame">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">① Thanh Tiến trình Ngang (Linear Progress Bars — 5 Kiểu nhãn × 0%–100%)</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Độ cao chuẩn <code>7px</code> bo tròn tối đa (<code>999px</code>), màu nền track <code>--ds-grey-100</code>.</div>
                </div>
                <span class="ds-badge ds-badge-blue">Thử nghiệm nhanh: ${pgState.pct}%</span>
              </div>

              <!-- Live Interactive Preview Strip for the 5 Linear Modes -->
              <div style="background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; padding:12px; margin-bottom:14px;">
                <div style="font-size:10.5px; font-weight:700; color:var(--brand-primary); margin-bottom:8px;">LIVE PREVIEW THEO THANH TRƯỢT (${pgState.pct}%)</div>
                <div class="pg-linear-grid">
                  ${linearCols.map(col => renderPgLinearBar(pgState.pct, col.pos, accent)).join('')}
                </div>
              </div>

              <!-- Full Figma Matrix 0% -> 100% -->
              <div class="pg-linear-grid">
                ${linearCols.map(col => `
                  <div class="pg-linear-col">
                    <div class="pg-linear-head">${col.title}<span>${col.sub}</span></div>
                    ${PG_LINEAR_STEPS.map(step => renderPgLinearBar(step, col.pos, accent)).join('')}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${showCircular ? `
            <!-- PHẦN 2: VÒNG TRÒN 360° & BÁN NGUYỆT 180° (5 KÍCH THƯỚC XXS → XL) -->
            <div class="dd-figma-frame">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">② Vòng tròn 360° (Circular Ring) &amp; Bán nguyệt 180° (Half-Circle Gauge) — 5 Kích thước</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Cỡ siêu nhỏ <strong>XXS (48px)</strong> tự động đưa nhãn phụ xuống bên dưới để không chật chữ; 4 cỡ <strong>SM–XL</strong> đặt nhãn vào giữa tâm.</div>
                </div>
                <span class="ds-badge ds-badge-green">Đang hiển thị: ${pgState.pct}%</span>
              </div>

              <!-- Hàng 1: Circular Ring (Percentage Only) -->
              <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px dashed #e2e8f0;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">A. VÒNG TRÒN 360° — CHỈ HIỂN THỊ PHẦN TRĂM (XXS → XL)</div>
                <div class="pg-rings-row">
                  ${PG_RING_SIZES.map(sz => renderPgCircleRing(sz, pgState.pct, false, accent)).join('')}
                </div>
              </div>

              <!-- Hàng 2: Circular Ring (Percentage + Label) -->
              <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px dashed #e2e8f0;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">B. VÒNG TRÒN 360° — KÈM NHÃN NGỮ CẢNH (${escapeHTML(pgState.ringLabel)})</div>
                <div class="pg-rings-row">
                  ${PG_RING_SIZES.map(sz => renderPgCircleRing(sz, pgState.pct, true, accent)).join('')}
                </div>
              </div>

              <!-- Hàng 3: Half-Circle Gauge (Percentage Only) -->
              <div style="margin-bottom:16px; padding-bottom:14px; border-bottom:1px dashed #e2e8f0;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">C. BÁN NGUYỆT 180° (HALF-CIRCLE GAUGE) — CHỈ PHẦN TRĂM</div>
                <div class="pg-rings-row" style="align-items:flex-end;">
                  ${PG_RING_SIZES.map(sz => renderPgHalfGauge(sz, pgState.pct, false, accent)).join('')}
                </div>
              </div>

              <!-- Hàng 4: Half-Circle Gauge (Percentage + Label) -->
              <div>
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:8px;">D. BÁN NGUYỆT 180° — KÈM NHÃN NGỮ CẢNH (${escapeHTML(pgState.ringLabel)})</div>
                <div class="pg-rings-row" style="align-items:flex-end;">
                  ${PG_RING_SIZES.map(sz => renderPgHalfGauge(sz, pgState.pct, true, accent)).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Lựa chọn &amp; Hiển thị Tiến trình</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Thanh ngang Linear:</strong> Dùng trong thanh tải lên tệp (Upload), các bước hoàn thiện hồ sơ (Onboarding), hoặc giới hạn dung lượng (Storage). Ưu tiên <em>Tooltip nổi</em> khi cần nhìn chính xác điểm dừng.</li>
                <li><strong>Vòng tròn 360° &amp; Bán nguyệt 180°:</strong> Dùng cho thẻ KPI trên Dashboard (<em>Active users, Tỷ lệ hoàn tất</em>). Bán nguyệt tiết kiệm chiều cao khi xếp cạnh số liệu lớn.</li>
                <li><strong>Quy tắc cỡ XXS (48px):</strong> Luôn đưa nhãn chữ (<code>Users</code>) ra bên ngoài phía dưới để đảm bảo số <code>40%</code> bên trong đủ to và dễ đọc.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>Không dùng Progress Indicator cho tác vụ không biết trước thời gian kết thúc — hãy dùng <em>Spinner / Loading</em>.</li>
                <li>Tránh nhồi quá nhiều chữ dài vào tâm vòng tròn cỡ nhỏ (<code>XXS / SM</code>) khiến chữ chạm vào nét vẽ viền.</li>
                <li>Không trộn lẫn hai kiểu vị trí nhãn (Right Inline &amp; Bottom Right) trong cùng một danh sách tiến trình song song.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2P. BASE COMPONENT: TOGGLES (SWITCHES) ENGINE
    // =========================================================================
    const TG_STORAGE_KEY = 'destudio_toggles_v1';

    const DEFAULT_TG_STATE = {
      titleText: 'Ghi nhớ đăng nhập',
      descText: 'Lưu thông tin đăng nhập cho lần sau.',
      errorText: 'Lỗi',
      alignFilter: 'both', // 'both' | 'left' | 'right'
      sizeFilter: 'both',  // 'both' | 'sm' | 'md'
      tone: 'green',       // 'green' (--ds-green-1000 theo ảnh mẫu) | 'brand' (--ds-brand-1000)
      showDesc: true,
      demoForm: {
        remember: true,
        autoRenew: true,
        forceError: true
      },
      demoSettings: {
        twoFactor: true,
        loginAlerts: false,
        instantSync: true,
        analyticsShare: false
      }
    };

    function loadTgState() {
      try {
        const raw = localStorage.getItem(TG_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_TG_STATE));
        const parsed = JSON.parse(raw);
        return {
          ...JSON.parse(JSON.stringify(DEFAULT_TG_STATE)),
          ...parsed,
          demoForm: { ...DEFAULT_TG_STATE.demoForm, ...(parsed.demoForm || {}) },
          demoSettings: { ...DEFAULT_TG_STATE.demoSettings, ...(parsed.demoSettings || {}) }
        };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_TG_STATE));
      }
    }

    let tgState = loadTgState();

    function saveTgState() {
      try { localStorage.setItem(TG_STORAGE_KEY, JSON.stringify(tgState)); } catch (e) {}
    }

    function tgUpdate(key, val) {
      tgState[key] = val;
      saveTgState();
      renderCanvas();
    }

    function tgToggleBool(key) {
      tgState[key] = !tgState[key];
      saveTgState();
      renderCanvas();
    }

    function tgToggleDemo(group, key) {
      if (!tgState[group]) return;
      tgState[group][key] = !tgState[group][key];
      saveTgState();
      renderCanvas();
    }

    function resetTogglesConfig() {
      tgState = JSON.parse(JSON.stringify(DEFAULT_TG_STATE));
      saveTgState();
      renderCanvas();
      showToast('Đã khôi phục cài đặt Toggles mặc định');
    }

    function renderToggleSpecCell(size, isOn, alignSide, stateId) {
      if (stateId === 'error' && !isOn) {
        return `<div style="padding:8px; font-size:11px; color:var(--text-muted, #64748b);">—</div>`;
      }
      const sizeCls = size === 'sm' ? 'is-sm' : '';
      const onCls = isOn ? 'is-on' : '';
      const alignCls = alignSide === 'right' ? 'is-right' : '';
      const toneCls = tgState.tone === 'brand' ? 'tone-brand' : '';
      let stCls = '';
      if (stateId === 'hover') stCls = 'is-hover';
      else if (stateId === 'focus') stCls = 'is-focus';
      else if (stateId === 'disabled') stCls = 'is-disabled';
      else if (stateId === 'error') stCls = 'is-error';

      const titleHtml = `<span class="ds-tg-title">${escapeHTML(tgState.titleText || 'Ghi nhớ đăng nhập')}</span>`;
      const descHtml = tgState.showDesc && (tgState.descText || '').trim()
        ? `<span class="ds-tg-desc">${escapeHTML(tgState.descText)}</span>`
        : '';
      const errTag = stateId === 'error'
        ? `<span class="ds-tg-err-tag">${escapeHTML(tgState.errorText || 'Lỗi')}</span>`
        : '';

      // Trong ảnh Figma:
      // - Khi Switch bên Trái: "Error" nằm ngay BÊN DƯỚI switch
      // - Khi Switch bên Phải: "Error" nằm ngay BÊN TRÁI switch
      const switchSlotHtml = alignSide === 'right'
        ? `<span class="ds-tg-switch-slot">${errTag}<span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>`
        : `<span class="ds-tg-switch-slot"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span>${errTag}</span>`;

      const clickable = stateId === 'disabled'
        ? ''
        : `onclick="showToast('Toggle ${size.toUpperCase()} (${isOn ? 'ON' : 'OFF'} • ${alignSide === 'right' ? 'Phải' : 'Trái'}): ${stateId}')"`;

      return `
        <div class="ds-tg-control ${sizeCls} ${onCls} ${alignCls} ${toneCls} ${stCls}" ${clickable}>
          ${switchSlotHtml}
          <span class="ds-tg-text">
            ${titleHtml}
            ${descHtml}
          </span>
        </div>
      `;
    }

    function buildTogglesHTMLSnippet() {
      const t = escapeHTML(tgState.titleText || 'Ghi nhớ đăng nhập');
      const d = escapeHTML(tgState.descText || 'Lưu thông tin đăng nhập cho lần sau.');
      const e = escapeHTML(tgState.errorText || 'Lỗi');
      const toneCls = tgState.tone === 'brand' ? ' tone-brand' : '';
      return `<!-- 1. Toggle MD (44×24px) — Switch bên Trái (BẬT / ON) -->
<label class="ds-tg-control is-on${toneCls}" role="switch" aria-checked="true">
  <span class="ds-tg-switch-slot">
    <span class="ds-tg-track"><span class="ds-tg-thumb"></span></span>
  </span>
  <span class="ds-tg-text">
    <span class="ds-tg-title">${t}</span>
    <span class="ds-tg-desc">${d}</span>
  </span>
</label>

<!-- 2. Toggle SM (36×20px) — Switch bên Phải (Settings / Mobile) -->
<label class="ds-tg-control is-sm is-right is-on${toneCls}" role="switch" aria-checked="true">
  <span class="ds-tg-switch-slot">
    <span class="ds-tg-track"><span class="ds-tg-thumb"></span></span>
  </span>
  <span class="ds-tg-text">
    <span class="ds-tg-title">${t}</span>
    <span class="ds-tg-desc">${d}</span>
  </span>
</label>

<!-- 3. Toggle Trạng thái Lỗi (Error State) -->
<label class="ds-tg-control is-right is-on is-error" role="switch" aria-checked="true" aria-invalid="true">
  <span class="ds-tg-switch-slot">
    <span class="ds-tg-err-tag">${e}</span>
    <span class="ds-tg-track"><span class="ds-tg-thumb"></span></span>
  </span>
  <span class="ds-tg-text">
    <span class="ds-tg-title">${t}</span>
    <span class="ds-tg-desc">${d}</span>
  </span>
</label>`;
    }

    // =========================================================================
    // 2P-ALERT. BASE COMPONENT: ALERT BANNERS ENGINE
    // =========================================================================
    const ALERT_STORAGE_KEY = 'destudio_alert_v1';

    const DEFAULT_ALERT_STATE = {
      heading: 'Heading',
      description: 'Lorem ipsum dolor sit amet, consec tetur adipiscing elit.',
      toneFilter: 'all',      // 'all' | 'error' | 'warning' | 'success' | 'info'
      layoutFilter: 'both',   // 'both' | 'inline' | 'stacked'
      dismissible: true,
      withActions: false,
      dismissedIds: []
    };

    function loadAlertState() {
      try {
        const raw = localStorage.getItem(ALERT_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_ALERT_STATE));
        const parsed = JSON.parse(raw);
        return {
          ...JSON.parse(JSON.stringify(DEFAULT_ALERT_STATE)),
          ...parsed,
          dismissedIds: Array.isArray(parsed.dismissedIds) ? parsed.dismissedIds : []
        };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_ALERT_STATE));
      }
    }

    let alertState = loadAlertState();

    function saveAlertState() {
      try { localStorage.setItem(ALERT_STORAGE_KEY, JSON.stringify(alertState)); } catch (e) {}
    }

    function alertUpdate(key, val) {
      alertState[key] = val;
      saveAlertState();
      renderCanvas();
    }

    function alertToggleBool(key) {
      alertState[key] = !alertState[key];
      saveAlertState();
      renderCanvas();
    }

    function dismissAlertDemo(id) {
      if (!alertState.dismissedIds.includes(id)) {
        alertState.dismissedIds.push(id);
        saveAlertState();
        renderCanvas();
        showToast(t('Đã ẩn Alert', 'Alert dismissed'));
      }
    }

    function restoreAlertDemo(id) {
      alertState.dismissedIds = alertState.dismissedIds.filter(x => x !== id);
      saveAlertState();
      renderCanvas();
    }

    function restoreAllAlerts() {
      alertState.dismissedIds = [];
      saveAlertState();
      renderCanvas();
      showToast(t('Đã khôi phục tất cả Alert', 'All alerts restored'));
    }

    function resetAlertConfig() {
      alertState = JSON.parse(JSON.stringify(DEFAULT_ALERT_STATE));
      saveAlertState();
      renderCanvas();
      showToast(t('Đã khôi phục cấu hình Alert mặc định', 'Alert settings reset to default'));
    }

    function getAlertTonesSpec() {
      return [
        {
          id: 'error',
          label: t('Lỗi (Error)', 'Error'),
          iconSlug: 'octagon-xmark',
          role: 'alert',
          surfaceToken: '--ds-red-50',
          borderToken: '--ds-red-200',
          accentToken: '--ds-red-1000'
        },
        {
          id: 'warning',
          label: t('Cảnh báo (Warning)', 'Warning'),
          iconSlug: 'alert-triangle',
          role: 'alert',
          surfaceToken: '--ds-amber-50',
          borderToken: '--ds-amber-200',
          accentToken: '--ds-amber-1000'
        },
        {
          id: 'success',
          label: t('Thành công (Success)', 'Success'),
          iconSlug: 'check-circle-state',
          role: 'status',
          surfaceToken: '--ds-green-50',
          borderToken: '--ds-green-200',
          accentToken: '--ds-green-1000'
        },
        {
          id: 'info',
          label: t('Thông tin (Info)', 'Info'),
          iconSlug: 'info-circle',
          role: 'status',
          surfaceToken: '--ds-brand-50',
          borderToken: '--ds-brand-200',
          accentToken: '--ds-brand-1000'
        }
      ];
    }

    function getAlertIconMarkup(slug, size = 20) {
      const svg = typeof getFoundationIconSvg === 'function' ? getFoundationIconSvg(slug, size, 'outlined') : '';
      if (svg) return svg;
      if (slug === 'xmark') {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>`;
      }
      return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 8v4m0 4h.01" stroke-linecap="round"/></svg>`;
    }

    function renderAlertCardMarkup(opts) {
      const {
        id = '',
        tone = 'error',
        layout = 'inline',
        heading = 'Heading',
        description = '',
        dismissible = true,
        actions = null
      } = opts;

      const tones = getAlertTonesSpec();
      const toneSpec = tones.find(item => item.id === tone) || tones[0];

      if (id && alertState.dismissedIds.includes(id)) {
        return `
          <div class="alert-dismissed-stub">
            <span>${t('Đã ẩn biểu ngữ', 'Alert dismissed')} (<code>${escapeHTML(tone)} • ${escapeHTML(layout)}</code>)</span>
            <button type="button" class="btn-ds" style="height:26px; padding:0 10px; font-size:11.5px;" onclick="restoreAlertDemo('${escapeHTML(id)}')">↺ ${t('Khôi phục', 'Restore')}</button>
          </div>`;
      }

      const iconHtml = `<span class="ds-alert-icon" aria-hidden="true">${getAlertIconMarkup(toneSpec.iconSlug, 20)}</span>`;
      const closeBtnHtml = dismissible
        ? `<button type="button" class="ds-alert-close" aria-label="${t('Đóng thông báo', 'Dismiss alert')}" ${id ? `onclick="dismissAlertDemo('${escapeHTML(id)}')"` : `onclick="showToast('${t('Đã nhấn nút Đóng (×)', 'Close (×) clicked')}')"`}>${getAlertIconMarkup('xmark', 16)}</button>`
        : '';

      const actionsList = Array.isArray(actions) ? actions : (alertState.withActions
        ? [
            { label: t('Xem chi tiết', 'View details'), primary: true },
            { label: t('Bỏ qua', 'Dismiss'), primary: false, isDismiss: true }
          ]
        : []);

      const actionsHtml = actionsList.length
        ? `<div class="ds-alert-actions">${actionsList.map(act => `
            <button type="button" class="ds-alert-action-btn ${act.primary ? '' : 'muted'}" onclick="${act.isDismiss && id ? `dismissAlertDemo('${escapeHTML(id)}')` : `showToast('${escapeHTML(act.label)}')`}">${escapeHTML(act.label)}</button>
          `).join('')}</div>`
        : '';

      const bodyHtml = `
        <div class="ds-alert-body">
          <div class="ds-alert-heading">${escapeHTML(heading || 'Heading')}</div>
          ${description ? `<div class="ds-alert-desc">${escapeHTML(description)}</div>` : ''}
          ${actionsHtml}
        </div>`;

      if (layout === 'stacked') {
        return `
          <div class="ds-alert ds-alert--${toneSpec.id} ds-alert--stacked" role="${toneSpec.role}">
            <div class="ds-alert-toprow">
              ${iconHtml}
              ${closeBtnHtml}
            </div>
            ${bodyHtml}
          </div>`;
      }

      return `
        <div class="ds-alert ds-alert--${toneSpec.id}" role="${toneSpec.role}">
          ${iconHtml}
          ${bodyHtml}
          ${closeBtnHtml}
        </div>`;
    }

    function buildAlertHTMLSnippet() {
      const h = escapeHTML(alertState.heading || 'Heading');
      const d = escapeHTML(alertState.description || 'Lorem ipsum dolor sit amet, consec tetur adipiscing elit.');
      const closeMarkup = alertState.dismissible
        ? `\n  <button type="button" class="ds-alert-close" aria-label="${t('Đóng thông báo', 'Dismiss alert')}">×</button>`
        : '';
      const actionsMarkup = alertState.withActions
        ? `\n    <div class="ds-alert-actions">\n      <button type="button" class="ds-alert-action-btn">${t('Xem chi tiết', 'View details')}</button>\n      <button type="button" class="ds-alert-action-btn muted">${t('Bỏ qua', 'Dismiss')}</button>\n    </div>`
        : '';

      return `<!-- 1. Error Alert — ${t('Bố cục Ngang (Inline)', 'Inline Left-Icon')} -->
<div class="ds-alert ds-alert--error" role="alert">
  <span class="ds-alert-icon" aria-hidden="true"><!-- octagon-xmark 20px --></span>
  <div class="ds-alert-body">
    <div class="ds-alert-heading">${h}</div>
    <div class="ds-alert-desc">${d}</div>${actionsMarkup}
  </div>${closeMarkup}
</div>

<!-- 2. Error Alert — ${t('Bố cục Dọc (Stacked)', 'Top-Icon Stacked')} -->
<div class="ds-alert ds-alert--error ds-alert--stacked" role="alert">
  <div class="ds-alert-toprow">
    <span class="ds-alert-icon" aria-hidden="true"><!-- octagon-xmark 20px --></span>${closeMarkup ? `\n    <button type="button" class="ds-alert-close" aria-label="${t('Đóng thông báo', 'Dismiss alert')}">×</button>` : ''}
  </div>
  <div class="ds-alert-body">
    <div class="ds-alert-heading">${h}</div>
    <div class="ds-alert-desc">${d}</div>${actionsMarkup}
  </div>
</div>

<!-- 3. Warning Alert — ${t('Bố cục Ngang (Inline)', 'Inline Left-Icon')} -->
<div class="ds-alert ds-alert--warning" role="alert">
  <span class="ds-alert-icon" aria-hidden="true"><!-- alert-triangle 20px --></span>
  <div class="ds-alert-body">
    <div class="ds-alert-heading">${h}</div>
    <div class="ds-alert-desc">${d}</div>${actionsMarkup}
  </div>${closeMarkup}
</div>

<!-- 4. Success Alert — ${t('Bố cục Ngang (Inline)', 'Inline Left-Icon')} -->
<div class="ds-alert ds-alert--success" role="status">
  <span class="ds-alert-icon" aria-hidden="true"><!-- check-circle-state 20px --></span>
  <div class="ds-alert-body">
    <div class="ds-alert-heading">${h}</div>
    <div class="ds-alert-desc">${d}</div>${actionsMarkup}
  </div>${closeMarkup}
</div>

<!-- 5. Info Alert — ${t('Bố cục Ngang (Inline)', 'Inline Left-Icon')} -->
<div class="ds-alert ds-alert--info" role="status">
  <span class="ds-alert-icon" aria-hidden="true"><!-- info-circle 20px --></span>
  <div class="ds-alert-body">
    <div class="ds-alert-heading">${h}</div>
    <div class="ds-alert-desc">${d}</div>${actionsMarkup}
  </div>${closeMarkup}
</div>`;
    }

    function renderAlertPage() {
      const tones = getAlertTonesSpec();
      const visibleTones = alertState.toneFilter === 'all'
        ? tones
        : tones.filter(item => item.id === alertState.toneFilter);

      const layouts = alertState.layoutFilter === 'both'
        ? ['inline', 'stacked']
        : [alertState.layoutFilter];

      const dismissedCount = alertState.dismissedIds.length;

      const playgroundCases = [
        {
          id: 'pg-error',
          tone: 'error',
          layout: 'inline',
          heading: t('Thanh toán không thành công', 'Payment verification failed'),
          description: t('Thẻ doanh nghiệp kết thúc bằng 4821 đã hết hạn. Vui lòng cập nhật phương thức thanh toán để tránh gián đoạn dịch vụ.', 'Corporate card ending in 4821 has expired. Update billing details to avoid service interruption.'),
          actions: [
            { label: t('Cập nhật thẻ', 'Update card'), primary: true },
            { label: t('Để sau', 'Later'), primary: false, isDismiss: true }
          ]
        },
        {
          id: 'pg-warning',
          tone: 'warning',
          layout: 'stacked',
          heading: t('Sắp chạm hạn mức băng thông API', 'Approaching API rate quota (90%)'),
          description: t('Workspace hiện tại đã sử dụng 90% lượt gọi tháng này. Nâng cấp gói hoặc bật tự động mở rộng hạn mức.', 'Current workspace has consumed 90% of monthly API quota. Upgrade plan or enable auto-scaling.'),
          actions: [
            { label: t('Nâng cấp gói', 'Upgrade plan'), primary: true },
            { label: t('Xem mức sử dụng', 'View usage'), primary: false }
          ]
        },
        {
          id: 'pg-success',
          tone: 'success',
          layout: 'inline',
          heading: t('Đã phát hành phiên bản Design Tokens v2.4', 'Design Tokens v2.4 published'),
          description: t('Toàn bộ biến màu, khoảng cách và thành phần Alert đã đồng bộ thành công trên hệ thống.', 'All semantic color variables, spacing, and Alert components are synced across the system.'),
          actions: [
            { label: t('Xem changelog', 'View changelog'), primary: true }
          ]
        },
        {
          id: 'pg-info',
          tone: 'info',
          layout: 'stacked',
          heading: t('Lịch bảo trì định kỳ cuối tuần', 'Scheduled weekend maintenance'),
          description: t('Cụm máy chủ Asia-Pacific sẽ cập nhật bảo mật từ 02:00 – 02:30 UTC Chủ nhật. Không ảnh hưởng dữ liệu đang lưu.', 'Asia-Pacific cluster will perform security patching from 02:00 – 02:30 UTC Sunday. No data loss expected.'),
          actions: [
            { label: t('Tìm hiểu thêm', 'Learn more'), primary: true },
            { label: t('Đã hiểu', 'Got it'), primary: false, isDismiss: true }
          ]
        }
      ];

      return `
        <div class="alert-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">${t('4 Trạng thái (Error, Warning, Success, Info) × 2 Bố cục (Inline / Stacked)', '4 Semantic States (Error, Warning, Success, Info) × 2 Layouts (Inline / Stacked)')}</span>
            <div class="colors-actions">
              ${dismissedCount > 0 ? `<button class="btn-ds" type="button" onclick="restoreAllAlerts()">↺ ${t('Hiện lại', 'Restore')} (${dismissedCount})</button>` : ''}
              <button class="btn-ds" type="button" onclick="resetAlertConfig()">↺ ${t('Khôi phục mặc định', 'Reset Default')}</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildAlertHTMLSnippet(), '${t('Đã copy HTML Alert', 'Alert HTML copied')}')">${t('Copy HTML Code', 'Copy HTML Code')}</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">${t('THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / ALERT', 'BASE COMPONENTS / ALERT')}</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">${t('Biểu ngữ Thông báo (Alert)', 'Alert')}</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              ${t('<strong>Alert</strong> hiển thị phản hồi theo ngữ cảnh ngay trong dòng nội dung (Error, Warning, Success, Info) với thanh nhấn trái <code>4px</code>, icon nhận diện trực quan, tiêu đề ngắn gọn, mô tả và nút đóng tùy chọn.', '<strong>Alert</strong> banners surface contextual feedback inline within a view (Error, Warning, Success, Info) using a <code>4px</code> left accent stripe, semantic icon, clear heading, description, and optional dismiss action.')}
            </p>
          </div>

          <!-- BỘ CẤU HÌNH NHANH -->
          <div class="btn-config-bar alert-config-bar">
            <div class="form-field">
              <label>${t('Tiêu đề (Heading)', 'Heading')}</label>
              <input type="text" class="ds-input" value="${escapeHTML(alertState.heading)}" oninput="alertUpdate('heading', this.value)" />
            </div>
            <div class="form-field">
              <label>${t('Nội dung mô tả (Description)', 'Description')}</label>
              <input type="text" class="ds-input" value="${escapeHTML(alertState.description)}" oninput="alertUpdate('description', this.value)" />
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">${t('TRẠNG THÁI:', 'STATE:')}</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${alertState.toneFilter === 'all' ? 'active' : ''}" onclick="alertUpdate('toneFilter', 'all')">${t('Tất cả', 'All')}</button>
                  <button type="button" class="${alertState.toneFilter === 'error' ? 'active' : ''}" onclick="alertUpdate('toneFilter', 'error')">Error</button>
                  <button type="button" class="${alertState.toneFilter === 'warning' ? 'active' : ''}" onclick="alertUpdate('toneFilter', 'warning')">Warning</button>
                  <button type="button" class="${alertState.toneFilter === 'success' ? 'active' : ''}" onclick="alertUpdate('toneFilter', 'success')">Success</button>
                  <button type="button" class="${alertState.toneFilter === 'info' ? 'active' : ''}" onclick="alertUpdate('toneFilter', 'info')">Info</button>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">${t('BỐ CỤC:', 'LAYOUT:')}</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${alertState.layoutFilter === 'both' ? 'active' : ''}" onclick="alertUpdate('layoutFilter', 'both')">${t('Cả hai', 'Both')}</button>
                  <button type="button" class="${alertState.layoutFilter === 'inline' ? 'active' : ''}" onclick="alertUpdate('layoutFilter', 'inline')">Inline</button>
                  <button type="button" class="${alertState.layoutFilter === 'stacked' ? 'active' : ''}" onclick="alertUpdate('layoutFilter', 'stacked')">Stacked</button>
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <button type="button" class="btn-icon-toggle-pill ${alertState.dismissible ? 'active' : ''}" onclick="alertToggleBool('dismissible')">
                ${alertState.dismissible ? `✓ ${t('Kèm nút Đóng (×)', 'Dismissible (×)')}` : t('Không nút đóng', 'No Close Button')}
              </button>
              <button type="button" class="btn-icon-toggle-pill ${alertState.withActions ? 'active' : ''}" onclick="alertToggleBool('withActions')">
                ${alertState.withActions ? `✓ ${t('Kèm nút hành động', 'With Actions')}` : t('+ Thêm hành động', '+ Add Actions')}
              </button>
            </div>
          </div>

          <!-- MA TRẬN BIẾN THỂ THEO FIGMA -->
          <div class="alert-spec-section">
            <div class="alert-spec-head">
              <span>${t('① DANH SÁCH BIẾN THỂ CHUẨN FIGMA (Left-Icon Inline & Top-Icon Stacked)', '① FIGMA COMPONENT SPEC (Left-Icon Inline & Top-Icon Stacked)')}</span>
              <span style="font-weight:500; font-size:11px; color:var(--text-muted); font-family:'JetBrains Mono', monospace;">radius: 8px • border-left: 4px • padding:16px 16px</span>
            </div>
            <div class="alert-spec-stack">
              ${visibleTones.map(toneSpec => layouts.map(layoutKey => `
                <div class="alert-variant-row">
                  <div class="alert-variant-meta">
                    <span class="alert-variant-tag">${toneSpec.label}</span>
                    <span class="alert-variant-sub">${layoutKey === 'inline' ? t('Inline • Left Icon', 'Inline • Left Icon') : t('Stacked • Top Icon', 'Stacked • Top Icon')}</span>
                    <span class="alert-variant-sub">${toneSpec.accentToken}</span>
                  </div>
                  <div>
                    ${renderAlertCardMarkup({
                      id: `spec-${toneSpec.id}-${layoutKey}`,
                      tone: toneSpec.id,
                      layout: layoutKey,
                      heading: alertState.heading,
                      description: alertState.description,
                      dismissible: alertState.dismissible
                    })}
                  </div>
                </div>
              `).join('')).join('')}
            </div>
          </div>

          <!-- PLAYGROUND TƯƠNG TÁC NGỮ CẢNH -->
          <div class="alert-spec-section">
            <div class="alert-spec-head">
              <span>${t('② NGỮ CẢNH THỰC TẾ TRONG SAAS (Thử nhấn nút hành động hoặc đóng biểu ngữ)', '② INTERACTIVE SAAS PLAYGROUND (Click CTA actions or dismiss banners)')}</span>
              ${dismissedCount > 0 ? `<button type="button" class="btn-ds" style="height:26px; padding:0 10px; font-size:11.5px;" onclick="restoreAllAlerts()">↺ ${t('Hiện lại toàn bộ', 'Restore all')}</button>` : `<span style="font-weight:500; font-size:11px; color:var(--text-muted);">${t('Tự động đồng bộ màu từ trang Colors', 'Synced dynamically with active Colors tokens')}</span>`}
            </div>
            <div class="alert-playground-grid">
              ${playgroundCases.map(item => renderAlertCardMarkup({
                id: item.id,
                tone: item.tone,
                layout: item.layout,
                heading: item.heading,
                description: item.description,
                dismissible: true,
                actions: item.actions
              })).join('')}
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG ALERT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ ${t('Quy chuẩn Thiết kế & Ngữ cảnh Sử dụng', 'Design Guidelines & Usage Context')}</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>${t('<strong>Chọn đúng sắc độ ngữ nghĩa:</strong> Dùng <code>Error</code> (Đỏ) cho lỗi chặn thao tác, <code>Warning</code> (Vàng hổ phách) cho cảnh báo phòng ngừa, <code>Success</code> (Xanh lá) cho xác nhận hoàn tất và <code>Info</code> cho thông tin trung tính.', '<strong>Match semantic intent:</strong> Use <code>Error</code> (Red) for blocking failures, <code>Warning</code> (Amber) for preventive notices, <code>Success</code> (Green) for completed outcomes, and <code>Info</code> for neutral guidance.')}</li>
                <li>${t('<strong>Inline vs Stacked:</strong> Dùng <em>Inline (Icon trái)</em> trong form, modal hoặc đầu trang rộng; dùng <em>Stacked (Icon trên)</em> trong card hẹp, sidebar hoặc khi cần nhấn mạnh tiêu đề trên Mobile.', '<strong>Inline vs Stacked:</strong> Use <em>Inline (left icon)</em> for page banners, modals, and forms; use <em>Stacked (top icon)</em> inside narrow cards, sidebars, or mobile layouts.')}</li>
                <li>${t('<strong>Trợ năng ARIA:</strong> Gán <code>role="alert"</code> cho mức Error/Warning cần đọc ngay và <code>role="status"</code> cho Success/Info.', '<strong>Accessibility (ARIA):</strong> Use <code>role="alert"</code> for urgent Error/Warning banners and <code>role="status"</code> for polite Success/Info announcements.')}</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ ${t('Lorem Ipsum Non Faciendum', 'Lorem Ipsum Non Faciendum')}</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>${t('<strong>Không lạm dụng cho thông báo tức thời:</strong> Thông báo tự biến mất sau vài giây (VD: <em>"Đã sao chép"</em>) hãy dùng <strong>Toast</strong> thay vì Alert cố định.', '<strong>Do not replace Toasts:</strong> Transient feedback that auto-dismisses after a few seconds (e.g., <em>"Copied"</em>) belongs in a <strong>Toast</strong>, not an inline Alert.')}</li>
                <li>${t('<strong>Tránh xếp chồng nhiều Alert cùng lúc:</strong> Giới hạn tối đa 1–2 Alert trong một khung nhìn để không làm loãng sự chú ý của người dùng.', '<strong>Avoid alert fatigue:</strong> Keep at most 1–2 simultaneous banners visible within a section so critical messages stand out.')}</li>
                <li>${t('<strong>Không ẩn nút Đóng cho cảnh báo chưa giải quyết:</strong> Với lỗi bắt buộc sửa trước khi lưu, bỏ nút <code>×</code> hoặc giữ banner cho tới khi điều kiện hợp lệ.', '<strong>Do not dismiss unresolved blockers silently:</strong> Omit the close <code>×</code> button when the user must fix a blocking error to continue.')}</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    function renderTogglesPage() {
      const showLeft = tgState.alignFilter === 'both' || tgState.alignFilter === 'left';
      const showRight = tgState.alignFilter === 'both' || tgState.alignFilter === 'right';
      const showSm = tgState.sizeFilter === 'both' || tgState.sizeFilter === 'sm';
      const showMd = tgState.sizeFilter === 'both' || tgState.sizeFilter === 'md';
      const toneCls = tgState.tone === 'brand' ? 'tone-brand' : '';

      const cols = [];
      if (showSm) {
        cols.push({ key: 'sm-off', size: 'sm', on: false, title: 'SM (36×20px) — TẮT' });
        cols.push({ key: 'sm-on',  size: 'sm', on: true,  title: 'SM (36×20px) — BẬT' });
      }
      if (showMd) {
        cols.push({ key: 'md-off', size: 'md', on: false, title: 'MD (44×24px) — TẮT' });
        cols.push({ key: 'md-on',  size: 'md', on: true,  title: 'MD (44×24px) — BẬT' });
      }

      const states = [
        { id: 'default',  label: 'Mặc định',   sub: 'Default' },
        { id: 'hover',    label: 'Di chuột',   sub: 'Hover' },
        { id: 'focus',    label: 'Tiêu điểm',  sub: 'Focus ring' },
        { id: 'disabled', label: 'Vô hiệu',    sub: 'Disabled' },
        { id: 'error',    label: 'Báo lỗi',    sub: 'Error (khi Bật)', isError: true }
      ];

      const gridColsCss = `68px repeat(${cols.length}, minmax(0, 1fr))`;

      return `
        <div class="toggles-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">2 Kích thước (SM 36×20 &amp; MD 44×24) × 2 Vị trí (Trái / Phải) × 5 Trạng thái</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetTogglesConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildTogglesHTMLSnippet(), 'Đã copy HTML Toggles')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / TOGGLES</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Công tắc Bật/Tắt (Toggles)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              <strong>Toggles</strong> (còn gọi là <em>“switches”</em>) là thành phần điều khiển có hai trạng thái loại trừ lẫn nhau như <strong>BẬT (ON)</strong> và <strong>TẮT (OFF)</strong>. Thiết kế mô phỏng công tắc vật lý giúp bật/tắt cài đặt có hiệu lực tức thời, đặc biệt tối ưu trên thiết bị di động vì tiết kiệm diện tích hơn so với hai nút Radio.
            </p>
          </div>

          <!-- BỘ CẤU HÌNH NHANH -->
          <div class="btn-config-bar" style="grid-template-columns: 1fr 1.3fr 0.6fr; margin-bottom:10px;">
            <div class="form-field">
              <label>Tiêu đề (Label)</label>
              <input type="text" class="ds-input" value="${escapeHTML(tgState.titleText)}" oninput="tgUpdate('titleText', this.value)" />
            </div>
            <div class="form-field">
              <label>Mô tả phụ (Helper Text)</label>
              <input type="text" class="ds-input" value="${escapeHTML(tgState.descText)}" oninput="tgUpdate('descText', this.value)" ${tgState.showDesc ? '' : 'disabled style="opacity:0.55;"'} />
            </div>
            <div class="form-field">
              <label>Nhãn báo lỗi (Error)</label>
              <input type="text" class="ds-input" value="${escapeHTML(tgState.errorText)}" oninput="tgUpdate('errorText', this.value)" />
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">VỊ TRÍ:</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${tgState.alignFilter === 'both' ? 'active' : ''}" onclick="tgUpdate('alignFilter', 'both')">Cả hai</button>
                  <button type="button" class="${tgState.alignFilter === 'left' ? 'active' : ''}" onclick="tgUpdate('alignFilter', 'left')">Trái</button>
                  <button type="button" class="${tgState.alignFilter === 'right' ? 'active' : ''}" onclick="tgUpdate('alignFilter', 'right')">Phải</button>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">KÍCH THƯỚC:</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${tgState.sizeFilter === 'both' ? 'active' : ''}" onclick="tgUpdate('sizeFilter', 'both')">SM + MD</button>
                  <button type="button" class="${tgState.sizeFilter === 'sm' ? 'active' : ''}" onclick="tgUpdate('sizeFilter', 'sm')">SM (36×20)</button>
                  <button type="button" class="${tgState.sizeFilter === 'md' ? 'active' : ''}" onclick="tgUpdate('sizeFilter', 'md')">MD (44×24)</button>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">MÀU BẬT (COLORS):</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${tgState.tone === 'green' ? 'active' : ''}" onclick="tgUpdate('tone', 'green')">Xanh Success</button>
                  <button type="button" class="${tgState.tone === 'brand' ? 'active' : ''}" onclick="tgUpdate('tone', 'brand')">Xanh Brand</button>
                </div>
              </div>
            </div>
            <button type="button" class="btn-icon-toggle-pill ${tgState.showDesc ? 'active' : ''}" onclick="tgToggleBool('showDesc')">
              ${tgState.showDesc ? '✓ Kèm mô tả phụ' : 'Chỉ tiêu đề'}
            </button>
          </div>

          <!-- MA TRẬN TRẠNG THÁI THEO ẢNH FIGMA -->
          <div class="tg-matrix-frame" style="margin-bottom:20px;">
            <div class="tg-matrix-grid" style="grid-template-columns: ${gridColsCss};">
              <div class="tg-matrix-colhead">Trạng thái</div>
              ${cols.map(c => `<div class="tg-matrix-colhead">${c.title}</div>`).join('')}

              ${showLeft ? `
                <div class="tg-section-sep">
                  <span>① CÔNG TẮC BÊN TRÁI TIÊU ĐỀ (Left Alignment — Form &amp; Bảng thao tác nhanh)</span>
                  <span style="font-weight:500; font-size:11px; color:var(--text-muted);">Nhãn Error đặt ngay bên dưới công tắc</span>
                </div>
                ${states.map(st => `
                  <div class="btn-matrix-rowlabel" ${st.isError ? 'style="color:var(--ds-red-1000);"' : ''}>
                    <span>${st.label}</span>
                    <span class="btn-matrix-rowsub">${st.sub}</span>
                  </div>
                  ${cols.map(c => renderToggleSpecCell(c.size, c.on, 'left', st.id)).join('')}
                `).join('')}
              ` : ''}

              ${showRight ? `
                <div class="tg-section-sep">
                  <span>② CÔNG TẮC BÊN PHẢI TIÊU ĐỀ (Right Alignment — Settings Panel &amp; Mobile UI)</span>
                  <span style="font-weight:500; font-size:11px; color:var(--text-muted);">Chữ căn lề trái, công tắc &amp; nhãn Error đặt bên phải</span>
                </div>
                ${states.map(st => `
                  <div class="btn-matrix-rowlabel" ${st.isError ? 'style="color:var(--ds-red-1000);"' : ''}>
                    <span>${st.label}</span>
                    <span class="btn-matrix-rowsub">${st.sub}</span>
                  </div>
                  ${cols.map(c => renderToggleSpecCell(c.size, c.on, 'right', st.id)).join('')}
                `).join('')}
              ` : ''}
            </div>
          </div>

          <!-- KHU THỬ NGHIỆM TƯƠNG TÁC SAAS -->
          <div class="btn-group-card" style="margin-bottom:20px;">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Thử nghiệm Bật/Tắt Trực tiếp (Interactive SaaS Demo)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Bấm vào từng công tắc để kiểm tra chuyển động thumb, màu trạng thái và phản hồi tức thời.</div>
              </div>
              <span class="ds-badge ds-badge-green">Đang bật: ${Object.values(tgState.demoSettings).filter(Boolean).length}/4</span>
            </div>
            <div style="padding:16px; display:grid; grid-template-columns:repeat(auto-fit, minmax(290px, 1fr)); gap:16px;">
              <!-- Demo 1: Left-aligned Form Controls -->
              <div style="border:1px solid var(--border-default); border-radius:8px; padding:16px; background:#fafbfd;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:10px;">① BỐ CỤC TRÁI (INLINE FORM — CỠ SM 36×20PX)</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <div class="ds-tg-control is-sm ${tgState.demoForm.remember ? 'is-on' : ''} ${toneCls}" onclick="tgToggleDemo('demoForm', 'remember')">
                    <span class="ds-tg-switch-slot"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>
                    <span class="ds-tg-text">
                      <span class="ds-tg-title">Ghi nhớ đăng nhập</span>
                      <span class="ds-tg-desc">Giữ phiên làm việc an toàn trên trình duyệt này trong 30 ngày.</span>
                    </span>
                  </div>
                  <div class="ds-tg-control is-sm is-on is-disabled ${toneCls}" title="Quyền bị khóa bởi quản trị viên">
                    <span class="ds-tg-switch-slot"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>
                    <span class="ds-tg-text">
                      <span class="ds-tg-title">Bắt buộc SSO doanh nghiệp (Đã khóa)</span>
                      <span class="ds-tg-desc">Chính sách tổ chức không cho phép tắt cài đặt này.</span>
                    </span>
                  </div>
                  <div class="ds-tg-control is-sm ${tgState.demoForm.forceError ? 'is-on is-error' : ''} ${toneCls}" onclick="tgToggleDemo('demoForm', 'forceError')">
                    <span class="ds-tg-switch-slot">
                      <span class="ds-tg-track"><span class="ds-tg-thumb"></span></span>
                      ${tgState.demoForm.forceError ? `<span class="ds-tg-err-tag">${escapeHTML(tgState.errorText || 'Lỗi')}</span>` : ''}
                    </span>
                    <span class="ds-tg-text">
                      <span class="ds-tg-title">Chia sẻ Webhook công khai</span>
                      <span class="ds-tg-desc">${tgState.demoForm.forceError ? 'Chưa cấu hình Secret Key nên chưa thể kích hoạt an toàn.' : 'Đã tắt công khai — bấm lại để xem trạng thái Lỗi.'}</span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Demo 2: Right-aligned Settings List -->
              <div style="border:1px solid var(--border-default); border-radius:8px; padding:16px; background:#fafbfd;">
                <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:10px;">② BỐ CỤC PHẢI (SETTINGS PANEL &amp; MOBILE — CỠ MD 44×24PX)</div>
                <div style="display:flex; flex-direction:column; gap:8px;">
                  ${[
                    { key: 'twoFactor', title: 'Xác thực 2 lớp (2FA)', desc: 'Yêu cầu mã OTP mỗi khi đăng nhập từ thiết bị mới.' },
                    { key: 'loginAlerts', title: 'Cảnh báo đăng nhập qua Email', desc: 'Gửi email ngay lập tức khi có truy cập bất thường.' },
                    { key: 'instantSync', title: 'Đồng bộ Design Tokens tức thời', desc: 'Tự động cập nhật thay đổi từ Colors & Typography sang UI.' }
                  ].map(item => `
                    <div class="ds-tg-control is-right ${tgState.demoSettings[item.key] ? 'is-on' : ''} ${toneCls}" onclick="tgToggleDemo('demoSettings', '${item.key}')">
                      <span class="ds-tg-switch-slot"><span class="ds-tg-track"><span class="ds-tg-thumb"></span></span></span>
                      <span class="ds-tg-text">
                        <span class="ds-tg-title">${item.title}</span>
                        <span class="ds-tg-desc">${item.desc}</span>
                      </span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG TOGGLES -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Thiết kế &amp; Ngữ cảnh Sử dụng</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Hiệu lực tức thời (Instant Effect):</strong> Chỉ dùng Toggle khi thao tác bật/tắt áp dụng <em>ngay lập tức</em> (VD: Chế độ tối, 2FA, Thông báo đẩy) mà không cần người dùng bấm nút Lưu.</li>
                <li><strong>Chọn kích thước SM vs MD:</strong> Dùng <code>SM (36×20px)</code> trong bảng dữ liệu, sidebar hoặc cụm form hẹp; dùng <code>MD (44×24px)</code> cho trang Cài đặt và màn hình Mobile để vùng chạm đạt chuẩn.</li>
                <li><strong>Bố cục Trái vs Phải:</strong> Đặt công tắc bên <em>Trái</em> cho form ngắn đứng liền mạch; đặt bên <em>Phải</em> trong danh sách Settings/Mobile để tiêu đề thẳng hàng lề trái và ngón tay cái dễ chạm bên phải.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không dùng thay Checkbox trong Form xác nhận:</strong> Nếu người dùng phải bấm nút <em>Lưu / Gửi</em> mới có tác dụng (VD: <em>"Tôi đồng ý điều khoản"</em>), hãy dùng <strong>Checkbox</strong>.</li>
                <li><strong>Tránh nhãn phủ định gây rối:</strong> Không viết tiêu đề kiểu <em>"Tắt thông báo email"</em> khiến việc Bật công tắc đồng nghĩa với Tắt tính năng. Luôn viết câu khẳng định tích cực.</li>
                <li><strong>Không đảo quy ước màu/hướng:</strong> Trạng thái BẬT (ON) luôn gạt núm sang phải với màu <code>--ds-green-1000</code> (hoặc <code>--ds-brand-1000</code>); trạng thái LỖI hiển thị màu đỏ <code>--ds-red-1000</code> kèm chữ <code>Error/Lỗi</code> rõ ràng.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2Q. BASE COMPONENT: TOOLTIPS ENGINE
    // =========================================================================
    const TT_STORAGE_KEY = 'destudio_tooltips_v1';

    const TT_ARROW_POSITIONS = [
      { id: 'none',          label: 'Không mũi tên',    sub: 'None (Nổi tự do)' },
      { id: 'bottom-center', label: 'Dưới — Giữa',      sub: 'Bottom Center (Tooltip ở trên)' },
      { id: 'bottom-left',   label: 'Dưới — Lệch Trái', sub: 'Bottom Left (Sát mép trái)' },
      { id: 'bottom-right',  label: 'Dưới — Lệch Phải', sub: 'Bottom Right (Sát mép phải)' },
      { id: 'top-center',    label: 'Trên — Giữa',      sub: 'Top Center (Tooltip ở dưới)' },
      { id: 'left-center',   label: 'Trái — Giữa',      sub: 'Left Center (Tooltip bên phải)' },
      { id: 'right-center',  label: 'Phải — Giữa',      sub: 'Right Center (Tooltip bên trái)' }
    ];

    const DEFAULT_TT_STATE = {
      shortText: 'Đây là hộp gợi ý (Tooltip)',
      richTitle: 'Đây là hộp gợi ý (Tooltip)',
      richDesc: 'Tooltip dùng để mô tả hoặc định danh một thành phần giao diện. Trong hầu hết trường hợp, tooltip giúp người dùng hiểu rõ ý nghĩa, chức năng hoặc văn bản thay thế của thành phần.',
      modeFilter: 'all',    // 'all' | 'compact' | 'rich'
      themeFilter: 'both',  // 'both' | 'light' | 'dark'
      previewTheme: 'dark', // 'light' | 'dark'
      pinnedDemo: 'help'    // null | 'help' | 'copy' | 'badge' | 'lock'
    };

    function loadTtState() {
      try {
        const raw = localStorage.getItem(TT_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_TT_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_TT_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_TT_STATE));
      }
    }

    let ttState = loadTtState();

    function saveTtState() {
      try { localStorage.setItem(TT_STORAGE_KEY, JSON.stringify(ttState)); } catch (e) {}
    }

    function ttUpdate(key, val) {
      ttState[key] = val;
      saveTtState();
      renderCanvas();
    }

    function ttTogglePin(id) {
      ttState.pinnedDemo = ttState.pinnedDemo === id ? null : id;
      saveTtState();
      renderCanvas();
    }

    function resetTooltipsConfig() {
      ttState = JSON.parse(JSON.stringify(DEFAULT_TT_STATE));
      saveTtState();
      renderCanvas();
      showToast('Đã khôi phục cài đặt Tooltips mặc định');
    }

    function renderTooltipBox(theme, isRich, arrowPos) {
      const themeCls = theme === 'dark' ? 'is-dark' : 'is-light';
      const sizeCls = isRich ? 'is-rich' : 'is-compact';
      const arrowCls = arrowPos && arrowPos !== 'none' ? `arrow-${arrowPos}` : '';
      const arrowHtml = arrowPos && arrowPos !== 'none' ? `<span class="ds-tt-arrow"></span>` : '';
      const title = escapeHTML(isRich ? (ttState.richTitle || 'Đây là hộp gợi ý (Tooltip)') : (ttState.shortText || 'Đây là hộp gợi ý (Tooltip)'));
      const desc = isRich
        ? `<span class="ds-tt-desc">${escapeHTML(ttState.richDesc || DEFAULT_TT_STATE.richDesc)}</span>`
        : '';
      return `
        <div class="ds-tooltip ${themeCls} ${sizeCls} ${arrowCls}" role="tooltip">
          <span class="ds-tt-title">${title}</span>
          ${desc}
          ${arrowHtml}
        </div>
      `;
    }

    function buildTooltipsHTMLSnippet() {
      const sText = escapeHTML(ttState.shortText || DEFAULT_TT_STATE.shortText);
      const rTitle = escapeHTML(ttState.richTitle || DEFAULT_TT_STATE.richTitle);
      const rDesc = escapeHTML(ttState.richDesc || DEFAULT_TT_STATE.richDesc);
      return `<!-- 1. Compact Tooltip (Dark, Arrow Bottom Center) -->
<div class="ds-tooltip is-dark is-compact arrow-bottom-center" role="tooltip">
  <span class="ds-tt-title">${sText}</span>
  <span class="ds-tt-arrow"></span>
</div>

<!-- 2. Compact Tooltip (Light, Arrow Top Center) -->
<div class="ds-tooltip is-light is-compact arrow-top-center" role="tooltip">
  <span class="ds-tt-title">${sText}</span>
  <span class="ds-tt-arrow"></span>
</div>

<!-- 3. Rich Tooltip (Tiêu đề + Mô tả chi tiết) -->
<div class="ds-tooltip is-dark is-rich arrow-bottom-left" role="tooltip">
  <span class="ds-tt-title">${rTitle}</span>
  <span class="ds-tt-desc">${rDesc}</span>
  <span class="ds-tt-arrow"></span>
</div>`;
    }

    function renderTooltipsPage() {
      const showLight = ttState.themeFilter === 'both' || ttState.themeFilter === 'light';
      const showDark = ttState.themeFilter === 'both' || ttState.themeFilter === 'dark';
      const showCompact = ttState.modeFilter === 'all' || ttState.modeFilter === 'compact';
      const showRich = ttState.modeFilter === 'all' || ttState.modeFilter === 'rich';

      const colCount = (showLight ? 1 : 0) + (showDark ? 1 : 0);
      const matrixColsCss = `128px repeat(${colCount}, minmax(0, 1fr))`;

      const richRows = [
        { id: 'none',          label: 'Không mũi tên',    sub: 'Rich — None' },
        { id: 'bottom-center', label: 'Dưới — Giữa',      sub: 'Rich — Bottom Center' },
        { id: 'bottom-left',   label: 'Dưới — Lệch Trái', sub: 'Rich — Bottom Left' }
      ];

      const iconHelp = getFoundationIconSvg('help-circle', 15) || '?';
      const iconCopy = getFoundationIconSvg('copy', 14) || '⧉';
      const iconLock = getFoundationIconSvg('lock', 14) || '🔒';

      return `
        <div class="tooltips-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">2 Nền màu (Light / Dark) × 2 Mật độ (Ngắn 1 dòng / Rich kèm mô tả) × 7 Vị trí Mũi tên</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetTooltipsConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildTooltipsHTMLSnippet(), 'Đã copy HTML Tooltips')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / TOOLTIPS</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Hộp Gợi ý Nổi (Tooltips)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              <strong>Tooltips</strong> dùng để mô tả nhanh ý nghĩa, chức năng hoặc văn bản thay thế (<em>alt-text</em>) của một biểu tượng hoặc thành phần UI khi người dùng di chuột (<code>hover</code>) hoặc focus bàn phím. Hỗ trợ hai giao diện <strong>Nền Sáng (Light)</strong> và <strong>Nền Tối (Dark)</strong> cùng 7 hướng mũi tên định vị linh hoạt.
            </p>
          </div>

          <!-- BỘ CẤU HÌNH NHANH -->
          <div class="btn-config-bar" style="grid-template-columns: 1fr 1.6fr; margin-bottom:10px;">
            <div class="form-field">
              <label>Nội dung ngắn (Compact Tooltip)</label>
              <input type="text" class="ds-input" value="${escapeHTML(ttState.shortText)}" oninput="ttUpdate('shortText', this.value)" />
            </div>
            <div class="form-field">
              <label>Mô tả chi tiết (Rich Tooltip Supporting Text)</label>
              <input type="text" class="ds-input" value="${escapeHTML(ttState.richDesc)}" oninput="ttUpdate('richDesc', this.value)" />
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">KIỂU NỘI DUNG:</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${ttState.modeFilter === 'all' ? 'active' : ''}" onclick="ttUpdate('modeFilter', 'all')">Tất cả</button>
                  <button type="button" class="${ttState.modeFilter === 'compact' ? 'active' : ''}" onclick="ttUpdate('modeFilter', 'compact')">1 Dòng (Ngắn)</button>
                  <button type="button" class="${ttState.modeFilter === 'rich' ? 'active' : ''}" onclick="ttUpdate('modeFilter', 'rich')">Kèm mô tả (Rich)</button>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">GIAO DIỆN NỀN:</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${ttState.themeFilter === 'both' ? 'active' : ''}" onclick="ttUpdate('themeFilter', 'both')">Light + Dark</button>
                  <button type="button" class="${ttState.themeFilter === 'light' ? 'active' : ''}" onclick="ttUpdate('themeFilter', 'light')">Nền Sáng (Light)</button>
                  <button type="button" class="${ttState.themeFilter === 'dark' ? 'active' : ''}" onclick="ttUpdate('themeFilter', 'dark')">Nền Tối (Dark)</button>
                </div>
              </div>
            </div>
            <span style="font-size:11px; color:var(--text-muted);">Shadow: <code>--ds-shadow-lg</code> (Effects)</span>
          </div>

          <!-- MA TRẬN FIGMA: 7 VỊ TRÍ MŨI TÊN × LIGHT & DARK -->
          <div class="tt-matrix-frame" style="margin-bottom:20px;">
            <div class="tt-matrix-grid" style="grid-template-columns: ${matrixColsCss};">
              <div class="tt-col-head">Vị trí Mũi tên</div>
              ${showLight ? `<div class="tt-col-head"><span>Nền Sáng (Light)</span><span class="ds-badge ds-badge-gray">#FFFFFF</span></div>` : ''}
              ${showDark  ? `<div class="tt-col-head"><span>Nền Tối (Dark)</span><span class="ds-badge ds-badge-dark">#101828</span></div>` : ''}

              ${showCompact ? `
                <div class="tt-section-divider">
                  <span>① TOOLTIP NGẮN 1 DÒNG (Compact — 7 hướng mũi tên)</span>
                  <span style="font-weight:500; font-size:11px; color:var(--text-muted);">Dùng cho nút chỉ có Icon, phím tắt hoặc nhãn rút gọn</span>
                </div>
                ${TT_ARROW_POSITIONS.map(pos => `
                  <div class="btn-matrix-rowlabel">
                    <span>${pos.label}</span>
                    <span class="btn-matrix-rowsub">${pos.sub}</span>
                  </div>
                  ${showLight ? `<div>${renderTooltipBox('light', false, pos.id)}</div>` : ''}
                  ${showDark  ? `<div>${renderTooltipBox('dark', false, pos.id)}</div>` : ''}
                `).join('')}
              ` : ''}

              ${showRich ? `
                <div class="tt-section-divider">
                  <span>② TOOLTIP KÈM MÔ TẢ CHI TIẾT (Rich Supporting Text)</span>
                  <span style="font-weight:500; font-size:11px; color:var(--text-muted);">Độ rộng tối đa 312px — giải thích chỉ số KPI, quyền hạn hoặc hướng dẫn</span>
                </div>
                ${richRows.map(pos => `
                  <div class="btn-matrix-rowlabel">
                    <span>${pos.label}</span>
                    <span class="btn-matrix-rowsub">${pos.sub}</span>
                  </div>
                  ${showLight ? `<div>${renderTooltipBox('light', true, pos.id)}</div>` : ''}
                  ${showDark  ? `<div>${renderTooltipBox('dark', true, pos.id)}</div>` : ''}
                `).join('')}
              ` : ''}
            </div>
          </div>

          <!-- SÂN CHƠI HOVER / PIN TRỰC TIẾP VỚI NGUYÊN LIỆU HỆ THỐNG -->
          <div class="btn-group-card" style="margin-bottom:20px;">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Thử nghiệm Di chuột (Hover) &amp; Ghim Tooltip Thực tế</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Lắp ghép từ <strong>Buttons</strong>, <strong>Badges</strong> và <strong>Icons</strong> — Rê chuột hoặc bấm trực tiếp vào từng thành phần để ghim xem hướng mũi tên.</div>
              </div>
              <div class="btn-ds-seg" style="flex-shrink:0;">
                <button type="button" class="${ttState.previewTheme === 'dark' ? 'active' : ''}" onclick="ttUpdate('previewTheme', 'dark')">Dark Tooltip</button>
                <button type="button" class="${ttState.previewTheme === 'light' ? 'active' : ''}" onclick="ttUpdate('previewTheme', 'light')">Light Tooltip</button>
              </div>
            </div>
            <div style="padding:16px;">
              <div class="tt-playground-stage" style="padding:144px 28px 66px;">
                <!-- Anchor 1: Help Icon next to Input Label -->
                <div class="ds-tt-anchor ${ttState.pinnedDemo === 'help' ? 'is-pinned' : ''}" onclick="ttTogglePin('help')">
                  <button type="button" class="btn-ds" style="display:inline-flex; align-items:center; gap:8px;">
                    <span>API Secret Key</span>
                    <span style="color:var(--text-muted); display:inline-flex;">${iconHelp}</span>
                  </button>
                  <div class="ds-tt-float pos-top" style="left:0; transform:none; width:260px;">
                    ${renderTooltipBox(ttState.previewTheme, true, 'bottom-left')}
                  </div>
                </div>

                <!-- Anchor 2: Icon-only Action Button -->
                <div class="ds-tt-anchor ${ttState.pinnedDemo === 'copy' ? 'is-pinned' : ''}" onclick="ttTogglePin('copy')">
                  <button type="button" class="btn-ds" aria-label="Sao chép mã">${iconCopy}</button>
                  <div class="ds-tt-float pos-bottom">
                    ${renderTooltipBox(ttState.previewTheme, false, 'top-center')}
                  </div>
                </div>

                <!-- Anchor 3: Disabled Lock Reason -->
                <div class="ds-tt-anchor ${ttState.pinnedDemo === 'lock' ? 'is-pinned' : ''}" onclick="ttTogglePin('lock')">
                  <button type="button" class="btn-ds" style="opacity:0.6; cursor:not-allowed; display:inline-flex; align-items:center; gap:4px;">
                    ${iconLock}
                    <span>Xuất báo cáo</span>
                  </button>
                  <div class="ds-tt-float pos-right" style="width:max-content;">
                    ${renderTooltipBox(ttState.previewTheme, false, 'left-center')}
                  </div>
                </div>

                <!-- Anchor 4: Badge -->
                <div class="ds-tt-anchor ${ttState.pinnedDemo === 'badge' ? 'is-pinned' : ''}" onclick="ttTogglePin('badge')">
                  <span class="ds-badge ds-badge-blue" style="cursor:pointer;">SLA 99.9%</span>
                  <div class="ds-tt-float pos-left" style="width:max-content;">
                    ${renderTooltipBox(ttState.previewTheme, false, 'right-center')}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG TOOLTIPS -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Chọn Hướng &amp; Nội dung Tooltip</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Dark vs Light Tooltip:</strong> Dùng <em>Nền Tối (Dark)</em> mặc định trên giao diện sáng để tạo tương phản tức thời; dùng <em>Nền Sáng (Light)</em> trên nền tối hoặc khu vực cần cảm giác nhẹ nhàng (như Rich Tooltip giải thích form).</li>
                <li><strong>Chọn vị trí mũi tên thông minh:</strong> Mặc định ưu tiên <code>Bottom Center</code> (nằm trên nút). Dùng <code>Bottom Left / Right</code> khi phần tử sát hai mép màn hình để hộp gợi ý không bị cắt mất chữ.</li>
                <li><strong>Viết ngắn gọn, bổ sung giá trị mới:</strong> Compact Tooltip chỉ 1–5 từ (VD: <em>"Sao chép liên kết (Ctrl+C)"</em>); Rich Tooltip giải thích lý do nút bị khóa hoặc cách tính chỉ số.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không lặp lại chữ đã có:</strong> Tránh đặt tooltip ghi đúng chữ <em>"Lưu thay đổi"</em> lên một nút vốn đã hiển thị chữ <em>"Lưu thay đổi"</em>.</li>
                <li><strong>Không đặt nút bấm hay link tương tác:</strong> Tooltip tự biến mất khi rời chuột; nếu cần chứa nút hành động, liên kết hoặc ảnh, hãy dùng <strong>Popover</strong> hoặc <strong>Modal</strong>.</li>
                <li><strong>Không ẩn thông tin bắt buộc/lỗi:</strong> Điều kiện nhập mật khẩu hoặc thông báo lỗi (<em>Error</em>) phải luôn hiện trực tiếp dưới ô nhập liệu chứ không giấu sau icon <code>?</code>.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2R. BASE COMPONENT: SEARCH & FILTERS ENGINE
    // =========================================================================
    const SF_STORAGE_KEY = 'destudio_search_filters_v1';

    const SF_DEMO_RECORDS = [
      { id: 'rk-1', name: 'Acme Production Key',    keyType: 'Key',  state: 'Active',  merchant: 'Acme Corp',      cat: 'API Token' },
      { id: 'rk-2', name: 'Stripe Webhook Seed',    keyType: 'Seed', state: 'Active',  merchant: 'Stripe US',      cat: 'Webhook' },
      { id: 'rk-3', name: 'Horizon Merchant Key',   keyType: 'Key',  state: 'Pending', merchant: 'Horizon Pay',    cat: 'SDK Access' },
      { id: 'rk-4', name: 'Northstar Billing Seed', keyType: 'Seed', state: 'Revoked', merchant: 'Northstar Inc',  cat: 'Webhook' },
      { id: 'rk-5', name: 'Atlas Sandbox Key',      keyType: 'Key',  state: 'Active',  merchant: 'Atlas Labs',     cat: 'API Token' }
    ];

    const DEFAULT_SF_STATE = {
      viewFilter: 'all', // 'all' | 'popover' | 'chips' | 'brand'
      specKeyType: 'All',
      specState: 'Active',
      searchQuery: '',
      popOpen: false,
      draftKeyType: 'All',
      draftState: 'All',
      appliedKeyType: 'All',
      appliedState: 'All',
      merchantFilter: 'All',
      selectedCats: ['API Token', 'Webhook'],
      compactMenuOpen: false,
      brandMenuOpen: false
    };

    function loadSfState() {
      try {
        const raw = localStorage.getItem(SF_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SF_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_SF_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_SF_STATE));
      }
    }

    let sfState = loadSfState();

    function saveSfState() {
      try { localStorage.setItem(SF_STORAGE_KEY, JSON.stringify(sfState)); } catch (e) {}
    }

    function sfUpdate(key, val) {
      sfState[key] = val;
      saveSfState();
      renderCanvas();
    }

    function sfToggleBool(key) {
      sfState[key] = !sfState[key];
      saveSfState();
      renderCanvas();
    }

    function sfConfirmPopover() {
      sfState.appliedKeyType = sfState.draftKeyType;
      sfState.appliedState = sfState.draftState;
      sfState.popOpen = false;
      saveSfState();
      renderCanvas();
      showToast(`Đã áp dụng bộ lọc: ${sfState.appliedKeyType} • ${sfState.appliedState}`);
    }

    function sfCancelPopover() {
      sfState.draftKeyType = sfState.appliedKeyType;
      sfState.draftState = sfState.appliedState;
      sfState.popOpen = false;
      saveSfState();
      renderCanvas();
    }

    function sfToggleCategory(cat) {
      const idx = sfState.selectedCats.indexOf(cat);
      if (idx >= 0) sfState.selectedCats.splice(idx, 1);
      else sfState.selectedCats.push(cat);
      saveSfState();
      renderCanvas();
    }

    function sfClearCategories() {
      sfState.selectedCats = [];
      saveSfState();
      renderCanvas();
    }

    function resetSearchFiltersConfig() {
      sfState = JSON.parse(JSON.stringify(DEFAULT_SF_STATE));
      saveSfState();
      renderCanvas();
      showToast('Đã khôi phục cấu hình Search & Filters mặc định');
    }

    function sfIconSliders(size = 15) {
      return getFoundationIconSvg('sliders', size) || `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="9" cy="7" r="2.2" fill="currentColor"/><circle cx="15" cy="17" r="2.2" fill="currentColor"/></svg>`;
    }

    function sfRenderFilterMenuCard(items, checkedIndices, wide) {
      const checkSvg = `<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4.5"/></svg>`;
      const diamSvg = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><polygon points="8 1.5 14.5 8 8 14.5 1.5 8"/></svg>`;
      return `
        <div class="sf-menu-panel ${wide ? 'is-wide' : ''}">
          ${items.map((lbl, idx) => {
            const isCk = checkedIndices.includes(idx);
            return `
              <div class="sf-menu-row">
                <span style="display:inline-flex; align-items:center; gap:8px;">
                  <span style="color:#667085; display:inline-flex;">${diamSvg}</span>
                  <span>${lbl}</span>
                </span>
                <span class="sf-mini-check ${isCk ? 'checked' : ''}">${isCk ? checkSvg : ''}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }

    function buildSearchFiltersHTMLSnippet() {
      return `<!-- 1. Search Input + Filter Button Trigger -->
<div class="sf-search-row">
  <div class="sf-search-box">
    ${getFoundationIconSvg('search', 15) || '🔍'}
    <input type="text" placeholder="Tìm kiếm theo tên hoặc mã..." />
  </div>
  <button type="button" class="sf-filter-icon-btn is-active" aria-label="Mở bộ lọc">
    ${sfIconSliders(15)}
  </button>
</div>

<!-- 2. Compact Filter Chip (Đã chọn 2 + Nút xóa tách ngăn) -->
<div class="sf-split-chip is-sm is-orange-focus">
  <button type="button" class="sf-chip-main">
    <span>◇ Đã chọn (2)</span>
    <span>^</span>
  </button>
  <button type="button" class="sf-chip-clear" aria-label="Xóa lọc">×</button>
</div>

<!-- 3. Brand Blue Filter Dropdown (+N Count Badge + Split Clear) -->
<div class="sf-split-chip is-md is-brand-focus">
  <button type="button" class="sf-chip-main">
    <span>◇ Đã chọn (2)</span>
    <span style="display:inline-flex; align-items:center; gap:4px;">
      <span class="sf-count-pill">+3</span>
      <span>⌄</span>
    </span>
  </button>
  <button type="button" class="sf-chip-clear" aria-label="Xóa lọc">×</button>
</div>`;
    }

    function renderSearchFiltersPage() {
      const iconSearch = getFoundationIconSvg('search', 15) || '🔍';
      const iconSliders = sfIconSliders(15);
      const diamSvg = `<svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><polygon points="8 1.5 14.5 8 8 14.5 1.5 8"/></svg>`;
      const chevDown = getFoundationIconSvg('chevron-down', 13) || '⌄';
      const chevUp = getFoundationIconSvg('chevron-up', 13) || '^';
      const checkSvg = `<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4.5"/></svg>`;

      const showPop = sfState.viewFilter === 'all' || sfState.viewFilter === 'popover';
      const showCompact = sfState.viewFilter === 'all' || sfState.viewFilter === 'chips';
      const showBrand = sfState.viewFilter === 'all' || sfState.viewFilter === 'brand';

      const q = (sfState.searchQuery || '').trim().toLowerCase();
      const filteredRecords = SF_DEMO_RECORDS.filter(r => {
        const matchQ = !q || r.name.toLowerCase().includes(q) || r.merchant.toLowerCase().includes(q);
        const matchKey = sfState.appliedKeyType === 'All' || r.keyType === sfState.appliedKeyType;
        const matchState = sfState.appliedState === 'All' || r.state === sfState.appliedState;
        const matchMerch = sfState.merchantFilter === 'All' || r.merchant === sfState.merchantFilter;
        const matchCat = sfState.selectedCats.length === 0 || sfState.selectedCats.includes(r.cat);
        return matchQ && matchKey && matchState && matchMerch && matchCat;
      });

      const sampleItems = ['Mục lọc 1', 'Mục lọc 2', 'Mục lọc 3'];

      return `
        <div class="sf-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">Search + Filter Popover + Compact Chips (Cam) + Multi-Filter +N (Brand Blue)</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetSearchFiltersConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildSearchFiltersHTMLSnippet(), 'Đã copy HTML Search & Filters')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN CƠ SỞ • BASE COMPONENTS / SEARCH &amp; FILTERS</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Tìm kiếm &amp; Bộ lọc Phân khu (Search &amp; Filters)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              Cụm <strong>Search &amp; Filters</strong> cung cấp thao tác tìm kiếm nhanh và bộ lọc đa tiêu chí gắn trực tiếp với từng phân khu nội dung trên màn hình. Kết hợp đồng bộ từ <strong>Inputs</strong>, <strong>Buttons</strong>, <strong>Dropdowns</strong>, <strong>Checkboxes</strong> và <strong>Badges</strong>.
            </p>
          </div>

          <!-- BỘ LỌC NHANH CÁC PHẦN -->
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div class="btn-ds-seg">
              <button type="button" class="${sfState.viewFilter === 'all' ? 'active' : ''}" onclick="sfUpdate('viewFilter', 'all')">Tất cả (3 cụm)</button>
              <button type="button" class="${sfState.viewFilter === 'popover' ? 'active' : ''}" onclick="sfUpdate('viewFilter', 'popover')">① Search + Filter Popover</button>
              <button type="button" class="${sfState.viewFilter === 'chips' ? 'active' : ''}" onclick="sfUpdate('viewFilter', 'chips')">② Chip Nhỏ (Orange)</button>
              <button type="button" class="${sfState.viewFilter === 'brand' ? 'active' : ''}" onclick="sfUpdate('viewFilter', 'brand')">③ Multi-Filter +N (Brand)</button>
            </div>
            <span class="ds-badge ds-badge-blue">Tokens: Inputs + Buttons + Checkboxes + Badges</span>
          </div>

          ${showPop ? `
            <!-- PHẦN 1: SEARCH INPUT + FILTER POPOVER & MERCHANT CHIP -->
            <div class="sf-spec-card">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">① Thanh Tìm kiếm &amp; Bảng lọc Nổi (Search Input + Filter Popover)</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">So sánh trực tiếp trạng thái <strong>Mặc định (Đóng)</strong> và trạng thái <strong>Đang mở Popover lọc nhiều điều kiện</strong>.</div>
                </div>
                <span class="ds-badge ds-badge-gray">Popover Shadow: --ds-shadow-lg</span>
              </div>

              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:22px; align-items:start;">
                <!-- Trạng thái Đóng + Filter Dropdown đơn -->
                <div style="display:flex; flex-direction:column; gap:16px;">
                  <div>
                    <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">TRẠNG THÁI MẶC ĐỊNH (CLOSED)</div>
                    <div class="sf-search-row">
                      <div class="sf-search-box">${iconSearch}<input type="text" placeholder="Tìm kiếm..." readonly /></div>
                      <button type="button" class="sf-filter-icon-btn" title="Bộ lọc">${iconSliders}</button>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:11px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">DROPDOWN CHIP ĐƠN (FILTER-DROPDOWN)</div>
                    <div class="sf-split-chip is-sm">
                      <button type="button" class="sf-chip-main" style="gap:8px;">
                        <span>Merchant</span>
                        <span style="display:inline-flex;">${chevDown}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Trạng thái Đang Mở Popover -->
                <div>
                  <div style="font-size:11px; font-weight:700; color:var(--brand-primary); margin-bottom:6px;">TRẠNG THÁI ĐANG MỞ (FOCUS RING + POPOVER)</div>
                  <div class="sf-search-row" style="margin-bottom:8px;">
                    <div class="sf-search-box">${iconSearch}<input type="text" placeholder="Tìm kiếm..." readonly /></div>
                    <button type="button" class="sf-filter-icon-btn is-active" title="Đang mở bộ lọc">${iconSliders}</button>
                  </div>
                  <div class="sf-popover-card" style="margin-left:auto;">
                    <div class="sf-pop-label">Loại khóa (Key type)</div>
                    <div class="sf-pop-seg">
                      ${['All', 'Key', 'Seed'].map(kt => `
                        <button type="button" class="${sfState.specKeyType === kt ? 'active' : ''}" onclick="sfUpdate('specKeyType', '${kt}')">${kt === 'All' ? 'Tất cả' : kt}</button>
                      `).join('')}
                    </div>

                    <div class="sf-pop-label">Trạng thái (State)</div>
                    <select class="ds-input" style="height:34px; font-size:12px; margin-bottom:12px;" onchange="sfUpdate('specState', this.value)">
                      ${['Chọn trạng thái...', 'Active', 'Pending', 'Revoked'].map(st => `
                        <option value="${st}" ${sfState.specState === st ? 'selected' : ''}>${st}</option>
                      `).join('')}
                    </select>

                    <div style="border-top:1px solid #eaecf0; padding-top:10px; display:flex; flex-direction:column; gap:8px;">
                      <button type="button" class="ds-btn ds-btn-primary" style="width:100%; justify-content:center; height:34px;" onclick="showToast('Xác nhận: ' + sfState.specKeyType + ' / ' + sfState.specState)">Xác nhận (Confirm)</button>
                      <button type="button" class="ds-btn ds-btn-secondary" style="width:100%; justify-content:center; height:34px;" onclick="showToast('Đã hủy thay đổi bộ lọc')">Hủy bỏ (Cancel)</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          ${showCompact ? `
            <!-- PHẦN 2: COMPACT FILTER DROPDOWN (4 TRẠNG THÁI — ORANGE FOCUS) -->
            <div class="sf-spec-card">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">② Compact Filter Dropdown — 4 Trạng thái (Viền nhấn Cam / Orange Highlight)</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Dùng ở thanh công cụ hẹp. Khi có mục được chọn sẽ đổi sang nhãn <code>Đã chọn (N)</code> kèm nút xóa nhanh <code>×</code> tách ngăn.</div>
                </div>
                <span class="ds-badge ds-badge-amber">SM • Orange Ring</span>
              </div>

              <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:8px; align-items:start;">
                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">1. Mặc định (Chưa chọn)</div>
                  <div class="sf-split-chip is-sm">
                    <button type="button" class="sf-chip-main">${diamSvg}<span>Loại bộ lọc</span>${chevDown}</button>
                  </div>
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--ds-orange-text, #c2410c); margin-bottom:6px;">2. Đang mở (Chưa chọn)</div>
                  <div class="sf-split-chip is-sm is-orange-focus">
                    <button type="button" class="sf-chip-main">${diamSvg}<span>Loại bộ lọc</span>${chevUp}</button>
                  </div>
                  ${sfRenderFilterMenuCard(sampleItems, [], false)}
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">3. Đã chọn (Đóng + ×)</div>
                  <div class="sf-split-chip is-sm">
                    <button type="button" class="sf-chip-main">${diamSvg}<span>Đã chọn (2)</span>${chevDown}</button>
                    <button type="button" class="sf-chip-clear" onclick="showToast('Xóa nhanh 2 mục đã chọn')">×</button>
                  </div>
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--ds-orange-text, #c2410c); margin-bottom:6px;">4. Đã chọn (Đang mở)</div>
                  <div class="sf-split-chip is-sm is-orange-focus">
                    <button type="button" class="sf-chip-main">${diamSvg}<span>Đã chọn (2)</span>${chevUp}</button>
                    <button type="button" class="sf-chip-clear" onclick="showToast('Xóa nhanh 2 mục đã chọn')">×</button>
                  </div>
                  ${sfRenderFilterMenuCard(sampleItems, [0, 1], false)}
                </div>
              </div>
            </div>
          ` : ''}

          ${showBrand ? `
            <!-- PHẦN 3: FULL FILTER SELECTOR KÈM BADGE +N (4 TRẠNG THÁI — BRAND BLUE) -->
            <div class="sf-spec-card">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">③ Bộ lọc Multi-Select kèm Badge đếm <code>+N</code> — 4 Trạng thái (Xanh Thương hiệu)</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Dùng cho bộ lọc nhiều giá trị trong thanh lọc chính, hiển thị thêm pill đếm <code>+3</code> và nền <code>--ds-brand-50</code> khi kích hoạt.</div>
                </div>
                <span class="ds-badge ds-badge-blue">MD • Brand Focus Ring</span>
              </div>

              <div style="display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:8px; align-items:start;">
                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">1. Mặc định (Chưa chọn)</div>
                  <div class="sf-split-chip is-md" style="width:100%;">
                    <button type="button" class="sf-chip-main"><span style="display:inline-flex; align-items:center; gap:8px;">${diamSvg} Loại bộ lọc</span>${chevDown}</button>
                  </div>
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--brand-primary); margin-bottom:6px;">2. Đang mở (+3 Badge)</div>
                  <div class="sf-split-chip is-md is-brand-focus" style="width:100%;">
                    <button type="button" class="sf-chip-main">
                      <span style="display:inline-flex; align-items:center; gap:8px;">${diamSvg} Loại bộ lọc</span>
                      <span style="display:inline-flex; align-items:center; gap:4px;"><span class="sf-count-pill">+3</span>${chevDown}</span>
                    </button>
                  </div>
                  ${sfRenderFilterMenuCard(sampleItems, [], true)}
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--text-muted); margin-bottom:6px;">3. Đã chọn (Đóng + ×)</div>
                  <div class="sf-split-chip is-md is-brand" style="width:100%;">
                    <button type="button" class="sf-chip-main">
                      <span style="display:inline-flex; align-items:center; gap:8px;">${diamSvg} Đã chọn (2)</span>
                      <span style="display:inline-flex; align-items:center; gap:4px;"><span class="sf-count-pill">+3</span>${chevDown}</span>
                    </button>
                    <button type="button" class="sf-chip-clear" onclick="showToast('Xóa bộ lọc')">×</button>
                  </div>
                </div>

                <div>
                  <div style="font-size:10.5px; font-weight:700; color:var(--brand-primary); margin-bottom:6px;">4. Đã chọn (Đang mở)</div>
                  <div class="sf-split-chip is-md is-brand-focus" style="width:100%;">
                    <button type="button" class="sf-chip-main">
                      <span style="display:inline-flex; align-items:center; gap:8px;">${diamSvg} Đã chọn (2)</span>
                      <span style="display:inline-flex; align-items:center; gap:4px;"><span class="sf-count-pill">+3</span>${chevDown}</span>
                    </button>
                    <button type="button" class="sf-chip-clear" onclick="showToast('Xóa bộ lọc')">×</button>
                  </div>
                  ${sfRenderFilterMenuCard(sampleItems, [0, 1], true)}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- THỬ NGHIỆM TƯƠNG TÁC THỰC TẾ -->
          <div class="btn-group-card" style="margin-bottom:20px;">
            <div class="btn-group-head">
              <div>
                <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Thử nghiệm Lọc Dữ liệu Thực tế (Live SaaS Section Toolbar)</div>
                <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Gõ vào ô tìm kiếm, mở Popover <code>Filter</code> hoặc tích chọn phân loại để lọc danh sách bên dưới theo thời gian thực.</div>
              </div>
              <span class="ds-badge ds-badge-green">Hiển thị: ${filteredRecords.length}/${SF_DEMO_RECORDS.length} mục</span>
            </div>

            <div style="padding:16px; position:relative;">
              <!-- Live Toolbar -->
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:14px;">
                <div class="sf-search-row" style="flex:1; min-width:220px;">
                  <div class="sf-search-box">
                    ${iconSearch}
                    <input type="text" value="${escapeHTML(sfState.searchQuery)}" placeholder="Tìm key hoặc Merchant (VD: Acme, Stripe)..." oninput="sfUpdate('searchQuery', this.value)" />
                  </div>
                  <div style="position:relative;">
                    <button type="button" class="sf-filter-icon-btn ${sfState.popOpen ? 'is-active' : ''}" onclick="sfToggleBool('popOpen')" title="Mở bộ lọc Key type &amp; State">${iconSliders}</button>
                    ${sfState.popOpen ? `
                      <div class="sf-popover-card" style="position:absolute; right:0; top:42px; z-index:30; width:260px;">
                        <div class="sf-pop-label">Loại khóa (Key type)</div>
                        <div class="sf-pop-seg">
                          ${['All', 'Key', 'Seed'].map(kt => `
                            <button type="button" class="${sfState.draftKeyType === kt ? 'active' : ''}" onclick="sfUpdate('draftKeyType', '${kt}')">${kt === 'All' ? 'Tất cả' : kt}</button>
                          `).join('')}
                        </div>
                        <div class="sf-pop-label">Trạng thái (State)</div>
                        <select class="ds-input" style="height:34px; font-size:12px; margin-bottom:12px;" onchange="sfUpdate('draftState', this.value)">
                          ${['All', 'Active', 'Pending', 'Revoked'].map(st => `
                            <option value="${st}" ${sfState.draftState === st ? 'selected' : ''}>${st === 'All' ? 'Tất cả trạng thái' : st}</option>
                          `).join('')}
                        </select>
                        <div style="border-top:1px solid #eaecf0; padding-top:10px; display:flex; flex-direction:column; gap:8px;">
                          <button type="button" class="ds-btn ds-btn-primary" style="width:100%; justify-content:center; height:32px;" onclick="sfConfirmPopover()">Xác nhận (Confirm)</button>
                          <button type="button" class="ds-btn ds-btn-secondary" style="width:100%; justify-content:center; height:32px;" onclick="sfCancelPopover()">Hủy bỏ (Cancel)</button>
                        </div>
                      </div>
                    ` : ''}
                  </div>
                </div>

                <!-- Merchant Select Chip -->
                <select class="ds-input" style="width:auto; min-width:135px; height:36px; font-size:12px;" onchange="sfUpdate('merchantFilter', this.value)">
                  <option value="All" ${sfState.merchantFilter === 'All' ? 'selected' : ''}>Merchant: Tất cả</option>
                  ${['Acme Corp', 'Stripe US', 'Horizon Pay', 'Northstar Inc', 'Atlas Labs'].map(m => `
                    <option value="${m}" ${sfState.merchantFilter === m ? 'selected' : ''}>${m}</option>
                  `).join('')}
                </select>

                <!-- Brand Multi-select Dropdown -->
                <div style="position:relative;">
                  <div class="sf-split-chip is-md ${sfState.selectedCats.length > 0 ? 'is-brand' : ''} ${sfState.brandMenuOpen ? 'is-brand-focus' : ''}">
                    <button type="button" class="sf-chip-main" onclick="sfToggleBool('brandMenuOpen')">
                      <span style="display:inline-flex; align-items:center; gap:8px;">${diamSvg} ${sfState.selectedCats.length > 0 ? `Đã chọn (${sfState.selectedCats.length})` : 'Loại bộ lọc'}</span>
                      <span style="display:inline-flex; align-items:center; gap:4px;">
                        ${sfState.selectedCats.length > 0 ? `<span class="sf-count-pill">+${sfState.selectedCats.length}</span>` : ''}
                        ${sfState.brandMenuOpen ? chevUp : chevDown}
                      </span>
                    </button>
                    ${sfState.selectedCats.length > 0 ? `<button type="button" class="sf-chip-clear" onclick="sfClearCategories()" title="Xóa lựa chọn">×</button>` : ''}
                  </div>
                  ${sfState.brandMenuOpen ? `
                    <div class="sf-menu-panel is-wide" style="position:absolute; right:0; top:40px; z-index:25;">
                      ${['API Token', 'Webhook', 'SDK Access'].map(cat => {
                        const isCk = sfState.selectedCats.includes(cat);
                        return `
                          <div class="sf-menu-row" onclick="sfToggleCategory('${cat}')">
                            <span style="display:inline-flex; align-items:center; gap:8px;">${diamSvg}<span>${cat}</span></span>
                            <span class="sf-mini-check ${isCk ? 'checked' : ''}">${isCk ? checkSvg : ''}</span>
                          </div>
                        `;
                      }).join('')}
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- Live Filtered Results List -->
              <div style="border:1px solid var(--border-default); border-radius:8px; overflow:hidden; background:#ffffff;">
                ${filteredRecords.length === 0 ? `
                  <div style="padding:20px; text-align:center; font-size:12.5px; color:var(--text-muted);">Không tìm thấy mục nào khớp điều kiện lọc hiện tại.</div>
                ` : filteredRecords.map((r, i) => `
                  <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; font-size:12.5px; ${i > 0 ? 'border-top:1px solid #f1f5f9;' : ''}">
                    <div style="display:flex; align-items:center; gap:8px;">
                      <strong style="color:#0f172a;">${r.name}</strong>
                      <span class="ds-badge ds-badge-gray">${r.cat}</span>
                      <span style="font-size:11.5px; color:var(--text-muted);">Merchant: ${r.merchant}</span>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="ds-badge ds-badge-blue">${r.keyType}</span>
                      <span class="ds-badge ${r.state === 'Active' ? 'ds-badge-green' : (r.state === 'Pending' ? 'ds-badge-amber' : 'ds-badge-red')}">${r.state}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Thiết kế Search &amp; Filters</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Gom bộ lọc phức tạp vào Filter Popover:</strong> Khi màn hình có từ 2–3 tiêu chí trở lên (VD: <em>Key type + State</em>), dùng nút icon <code>Sliders</code> cạnh ô Search mở Popover có nút <em>Xác nhận / Hủy bỏ</em> để người dùng tùy chỉnh xong mới truy vấn dữ liệu.</li>
                <li><strong>Nút xóa nhanh <code>×</code> tách ngăn:</strong> Mọi Filter Dropdown đã có mục chọn (<em>Đã chọn (N)</em>) luôn gắn thêm nút <code>×</code> ở cạnh phải để xóa sạch bộ lọc chỉ bằng 1 chạm.</li>
                <li><strong>Hiển thị badge đếm <code>+N</code>:</strong> Ở biến thể rộng (<em>Brand Blue</em>), luôn giữ chiều rộng nút cố định và biểu diễn tổng số tiêu chí qua badge <code>+N</code> thay vì kéo dài thanh công cụ.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không rải quá nhiều Dropdown trên 1 hàng:</strong> Tránh xếp 5–6 chip lọc dàn ngang khiến giao diện vỡ hàng trên Laptop/Mobile; hãy ưu tiên đưa các bộ lọc phụ vào Popover.</li>
                <li><strong>Không thiếu nút Hủy (Cancel) trong Popover đa điều kiện:</strong> Khi Popover chỉnh sửa nhiều trường cùng lúc, đóng giữa chừng phải hoàn tác về trạng thái đã áp dụng trước đó.</li>
                <li><strong>Không trộn lẫn màu Focus:</strong> Chọn thống nhất <em>Brand Blue</em> cho luồng lọc chuẩn hệ thống, hoặc <em>Orange Highlight</em> khi cần nhấn mạnh bộ lọc cảnh báo đặc biệt.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2S. APPLICATION COMPONENT: MODALS POP-UP ENGINE
    // =========================================================================
    const MD_STORAGE_KEY = 'destudio_modals_popup_v1';

    const MD_TEAM_MEMBERS = [
      { id: 'olivia',  name: 'Olivia Rhye',    handle: '@olivia',  role: 'Admin',    kind: 'portrait', bg: '#dbeafe', fg: '#1d4ed8', initials: 'OR' },
      { id: 'phoenix', name: 'Phoenix Baker',  handle: '@phoenix', role: 'Admin',    kind: 'portrait', bg: '#fef3c7', fg: '#b45309', initials: 'PB' },
      { id: 'lana',    name: 'Lana Steiner',   handle: '@lana',    role: 'Merchant', kind: 'initials', bg: '#f1f5f9', fg: '#475467', initials: 'LS' },
      { id: 'demi',    name: 'Demi Wilkinson', handle: '@demi',    role: 'Editor',   kind: 'icon',     bg: '#f8fafc', fg: '#64748b', initials: 'DW' }
    ];

    const DEFAULT_MD_STATE = {
      viewportFilter: 'both', // 'both' | 'desktop' | 'mobile'
      variantFilter: 'all',   // 'all' | 'destructive' | 'success' | 'team'
      dontShowAgain: false,
      shareUrl: 'join.acme.io/project-name-246135',
      selectedMembers: ['olivia', 'phoenix'],
      liveModal: null,        // null | { variant: 'destructive'|'success'|'team', viewport: 'desktop'|'mobile' }
      destructiveTitle: 'Xóa bài viết',
      destructiveDesc: 'Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.',
      successTitle: 'Mời nhóm của bạn',
      successDesc: 'Bạn vừa tạo một dự án mới! Hãy mời đồng nghiệp cùng cộng tác trong dự án này.'
    };

    function loadMdState() {
      try {
        const raw = localStorage.getItem(MD_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_MD_STATE));
        const parsed = JSON.parse(raw);
        return { ...JSON.parse(JSON.stringify(DEFAULT_MD_STATE)), ...parsed, liveModal: null };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_MD_STATE));
      }
    }

    let mdState = loadMdState();

    function saveMdState() {
      try {
        const toSave = { ...mdState, liveModal: null };
        localStorage.setItem(MD_STORAGE_KEY, JSON.stringify(toSave));
      } catch (e) {}
    }

    function mdUpdate(key, val) {
      mdState[key] = val;
      saveMdState();
      renderCanvas();
    }

    function mdToggleDontShow() {
      mdState.dontShowAgain = !mdState.dontShowAgain;
      saveMdState();
      renderCanvas();
    }

    function mdToggleMember(id) {
      const idx = mdState.selectedMembers.indexOf(id);
      if (idx >= 0) mdState.selectedMembers.splice(idx, 1);
      else mdState.selectedMembers.push(id);
      saveMdState();
      renderCanvas();
    }

    function mdOpenLive(variant, viewport) {
      mdState.liveModal = { variant, viewport };
      renderCanvas();
    }

    function mdCloseLive() {
      mdState.liveModal = null;
      renderCanvas();
    }

    function resetModalsPopupConfig() {
      mdState = JSON.parse(JSON.stringify(DEFAULT_MD_STATE));
      saveMdState();
      renderCanvas();
      showToast('Đã khôi phục cài đặt Modals Pop-up mặc định');
    }

    function mdAvatarHtml(m) {
      if (m.kind === 'initials') {
        return `<span class="md-av" style="background:${m.bg}; color:${m.fg};">${m.initials}</span>`;
      }
      if (m.kind === 'icon') {
        const uSvg = getFoundationIconSvg('user', 16) || `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-3.8 3.6-6 8-6s8 2.2 8 6"/></svg>`;
        return `<span class="md-av" style="background:${m.bg}; color:${m.fg};">${uSvg}</span>`;
      }
      // Offline crisp portrait avatar SVG
      return `
        <span class="md-av" style="background:${m.bg}; color:${m.fg}; overflow:hidden;">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="9" r="4" fill="currentColor" opacity="0.85"/>
            <path d="M5 21c0-3.8 3.1-6.5 7-6.5s7 2.7 7 6.5" fill="currentColor" opacity="0.65"/>
          </svg>
        </span>
      `;
    }

    function renderModalCard(variant, viewport, isLive) {
      const isMob = viewport === 'mobile';
      const vpCls = isMob ? 'is-mobile' : 'is-desktop';
      const closeOrToast = (msg) => isLive ? `mdCloseLive(); showToast('${msg}')` : `showToast('${msg}')`;

      const alertSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
      const checkCircleSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      const userPlusSvg = getFoundationIconSvg('user-plus', 18) || `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>`;
      const copySvg = getFoundationIconSvg('copy', 16) || `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
      const miniCheckSvg = `<svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 8.5 6.5 12 13 4.5"/></svg>`;

      if (variant === 'destructive') {
        const title = isMob ? 'Modal Cảnh báo & Xóa' : escapeHTML(mdState.destructiveTitle || DEFAULT_MD_STATE.destructiveTitle);
        const desc = escapeHTML(mdState.destructiveDesc || DEFAULT_MD_STATE.destructiveDesc);
        return `
          <div class="md-dialog ${vpCls}" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
            ${isMob ? `
              <div>
                <div class="md-icon-badge md-icon-danger" style="margin-bottom:14px;">${alertSvg}</div>
                <div class="md-title">${title}</div>
                <div class="md-desc">${desc}</div>
              </div>
              <div class="md-footer-stack">
                <button type="button" class="ds-btn ds-btn-danger" onclick="${closeOrToast('Đã xác nhận xóa bài viết')}">Xóa bài viết</button>
                <button type="button" class="ds-btn ds-btn-secondary" onclick="${closeOrToast('Đã hủy thao tác xóa')}">Hủy bỏ</button>
              </div>
            ` : `
              <div style="display:flex; align-items:flex-start; gap:16px;">
                <div class="md-icon-badge md-icon-danger">${alertSvg}</div>
                <div style="min-width:0; flex:1;">
                  <div class="md-title">${title}</div>
                  <div class="md-desc">${desc}</div>
                </div>
              </div>
              <div class="md-footer-row">
                <div class="ds-cb-control ${mdState.dontShowAgain ? 'is-checked' : ''}" style="width:auto; align-items:center;" onclick="mdToggleDontShow()">
                  <span class="ds-cb-box" style="margin-top:0;">${mdState.dontShowAgain ? miniCheckSvg : ''}</span>
                  <span class="ds-cb-text"><span class="ds-cb-title" style="font-size:11.5px; white-space:nowrap;">Không hiện lại</span></span>
                </div>
                <div class="md-footer-actions">
                  <button type="button" class="ds-btn ds-btn-secondary" onclick="${closeOrToast('Đã hủy thao tác xóa')}">Hủy bỏ</button>
                  <button type="button" class="ds-btn ds-btn-danger" onclick="${closeOrToast('Đã xác nhận xóa bài viết')}">Xóa bài viết</button>
                </div>
              </div>
            `}
          </div>
        `;
      }

      if (variant === 'success') {
        const title = isMob ? 'Modal Thành công (Success)' : escapeHTML(mdState.successTitle || DEFAULT_MD_STATE.successTitle);
        const desc = isMob
          ? 'Bạn vừa hoàn tất thao tác thành công. Đoạn mô tả khuyến nghị giới hạn tối đa 160 ký tự.'
          : escapeHTML(mdState.successDesc || DEFAULT_MD_STATE.successDesc);
        return `
          <div class="md-dialog ${vpCls}" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
            <div class="md-icon-badge md-icon-success" style="margin-bottom:14px;">${checkCircleSvg}</div>
            <div class="md-title">${title}</div>
            <div class="md-desc">${desc}</div>

            <div style="margin-top:16px;">
              <div style="font-size:11.5px; font-weight:600; color:#344054;">Liên kết chia sẻ (Share link)</div>
              <div class="md-share-row">
                <input type="text" class="md-share-input" value="${escapeHTML(mdState.shareUrl)}" oninput="mdUpdate('shareUrl', this.value)" />
                <button type="button" class="md-copy-btn" title="Sao chép liên kết" onclick="copyText(mdState.shareUrl, 'Đã copy liên kết dự án')">${copySvg}</button>
              </div>
            </div>

            ${isMob ? `
              <div class="md-footer-stack">
                <button type="button" class="ds-btn ds-btn-primary" onclick="${closeOrToast('Đã xác nhận chia sẻ dự án')}">Xác nhận (Confirm)</button>
                <button type="button" class="ds-btn ds-btn-secondary" onclick="${closeOrToast('Đã đóng hộp thoại')}">Hủy bỏ (Cancel)</button>
              </div>
            ` : `
              <div class="md-footer-row" style="justify-content:flex-end;">
                <div class="md-footer-actions">
                  <button type="button" class="ds-btn ds-btn-secondary" onclick="${closeOrToast('Đã đóng hộp thoại')}">Hủy bỏ</button>
                  <button type="button" class="ds-btn ds-btn-primary" onclick="${closeOrToast('Đã xác nhận chia sẻ dự án')}">Xác nhận</button>
                </div>
              </div>
            `}
          </div>
        `;
      }

      // Variant 3: Team Members Checklist
      return `
        <div class="md-dialog ${vpCls}" role="dialog" aria-modal="true" onclick="event.stopPropagation()">
          <div style="text-align:center;">
            <div class="md-icon-badge md-icon-brand" style="margin:0 auto 12px;">${userPlusSvg}</div>
            <div class="md-title">Thêm thành viên nhóm</div>
            <div class="md-desc">Bạn vừa tạo dự án mới! Mời đồng nghiệp cùng tham gia cộng tác trong dự án này.</div>
          </div>

          <div class="md-member-list">
            ${MD_TEAM_MEMBERS.map(m => {
              const isSel = mdState.selectedMembers.includes(m.id);
              return `
                <div class="md-member-row" onclick="mdToggleMember('${m.id}')">
                  <div class="md-member-left">
                    <span class="ds-cb-control ${isSel ? 'is-checked' : ''}" style="width:auto;">
                      <span class="ds-cb-box" style="margin-top:0;">${isSel ? miniCheckSvg : ''}</span>
                    </span>
                    ${mdAvatarHtml(m)}
                    <div style="min-width:0;">
                      <div style="font-size:12.5px; font-weight:600; color:#101828; line-height:1.25;">${m.name}</div>
                      <div style="font-size:11px; color:#667085;">${m.handle}</div>
                    </div>
                  </div>
                  <span style="font-size:11.5px; font-weight:500; color:#475467; flex-shrink:0;">${m.role}</span>
                </div>
              `;
            }).join('')}
          </div>

          ${isMob ? `
            <div class="md-footer-stack">
              <button type="button" class="ds-btn ds-btn-primary" onclick="${closeOrToast('Đã mời ' + mdState.selectedMembers.length + ' thành viên')}">Xác nhận (${mdState.selectedMembers.length})</button>
              <button type="button" class="ds-btn ds-btn-secondary" onclick="${closeOrToast('Đã hủy lời mời')}">Hủy bỏ</button>
            </div>
          ` : `
            <div class="md-footer-row" style="justify-content:flex-end;">
              <div class="md-footer-actions">
                <button type="button" class="ds-btn ds-btn-secondary" onclick="${closeOrToast('Đã hủy lời mời')}">Hủy bỏ</button>
                <button type="button" class="ds-btn ds-btn-primary" onclick="${closeOrToast('Đã mời ' + mdState.selectedMembers.length + ' thành viên')}">Xác nhận (${mdState.selectedMembers.length})</button>
              </div>
            </div>
          `}
        </div>
      `;
    }

    function buildModalsPopupHTMLSnippet() {
      return `<!-- 1. Destructive / Confirmation Modal (Desktop Horizontal Layout) -->
<div class="md-dialog is-desktop" role="dialog" aria-modal="true">
  <div style="display:flex; align-items:flex-start; gap:16px;">
    <div class="md-icon-badge md-icon-danger">!</div>
    <div>
      <div class="md-title">Xóa bài viết</div>
      <div class="md-desc">Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.</div>
    </div>
  </div>
  <div class="md-footer-row">
    <label class="ds-cb-control"><span class="ds-cb-box"></span><span class="ds-cb-title">Không hiển thị lại</span></label>
    <div class="md-footer-actions">
      <button class="ds-btn ds-btn-secondary">Hủy bỏ</button>
      <button class="ds-btn ds-btn-danger">Xóa bài viết</button>
    </div>
  </div>
</div>

<!-- 2. Mobile Stacked CTA Pattern (Primary CTA trên — Cancel dưới) -->
<div class="md-dialog is-mobile" role="dialog" aria-modal="true">
  <div class="md-icon-badge md-icon-success">✓</div>
  <div class="md-title">Mời nhóm của bạn</div>
  <div class="md-footer-stack">
    <button class="ds-btn ds-btn-primary">Xác nhận</button>
    <button class="ds-btn ds-btn-secondary">Hủy bỏ</button>
  </div>
</div>`;
    }

    function renderModalsPopupPage() {
      const showDesktop = mdState.viewportFilter === 'both' || mdState.viewportFilter === 'desktop';
      const showMobile = mdState.viewportFilter === 'both' || mdState.viewportFilter === 'mobile';
      const gridCls = showDesktop && showMobile ? 'md-stage-grid' : 'md-stage-grid single-col';

      const sections = [
        {
          id: 'destructive',
          title: '① Modal Cảnh báo & Hành động Phá hủy (Destructive / Error Modal)',
          sub: 'Desktop xếp ngang kèm Checkbox "Không hiển thị lại"; Mobile chuyển nút CTA Đỏ lên trên cùng dạng Full-width.',
          badge: '<span class="ds-badge ds-badge-red">Danger --ds-red-1000</span>'
        },
        {
          id: 'success',
          title: '② Modal Thành công & Chia sẻ Liên kết (Success / Share Link Modal)',
          sub: 'Kết hợp Icon Container Success, ô Input liên kết kèm nút Copy nhanh và cụm Confirm/Cancel đáp ứng Desktop & Mobile.',
          badge: '<span class="ds-badge ds-badge-green">Success --ds-green-1000</span>'
        },
        {
          id: 'team',
          title: '③ Modal Chọn Danh sách Thành viên (Team Checklist Modal)',
          sub: 'Header căn giữa kết hợp Checkbox + Avatar (Ảnh / Chữ cái viết tắt / Icon) + Vai trò người dùng (Admin / Merchant / Editor).',
          badge: '<span class="ds-badge ds-badge-blue">Brand + Avatar + Checkbox</span>'
        }
      ].filter(s => mdState.variantFilter === 'all' || mdState.variantFilter === s.id);

      return `
        <div class="md-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">3 Mẫu Modal Chuẩn × 2 Màn hình (Desktop &amp; Mobile) + Live Overlay</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetModalsPopupConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildModalsPopupHTMLSnippet(), 'Đã copy HTML Modals Pop-up')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN ỨNG DỤNG • APPLICATION COMPONENTS / MODALS POP-UP</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Hộp thoại Nổi Responsive (Modals Pop-up — Desktop &amp; Mobile)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              <strong>Modals Pop-up</strong> hiển thị lớp phủ tập trung sự chú ý cho xác nhận hành động quan trọng (Xóa dữ liệu), thông báo hoàn tất kèm chia sẻ liên kết, hoặc biểu mẫu chọn nhanh danh sách. Hệ thống chuẩn hóa riêng cấu trúc nút giữa <strong>Desktop</strong> (hàng ngang) và <strong>Mobile</strong> (xếp chồng full-width).
            </p>
          </div>

          <!-- BỘ ĐIỀU KHIỂN & MỞ POP-UP THẬT -->
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <div class="btn-ds-seg">
                <button type="button" class="${mdState.viewportFilter === 'both' ? 'active' : ''}" onclick="mdUpdate('viewportFilter', 'both')">Desktop + Mobile</button>
                <button type="button" class="${mdState.viewportFilter === 'desktop' ? 'active' : ''}" onclick="mdUpdate('viewportFilter', 'desktop')">Chỉ Desktop</button>
                <button type="button" class="${mdState.viewportFilter === 'mobile' ? 'active' : ''}" onclick="mdUpdate('viewportFilter', 'mobile')">Chỉ Mobile</button>
              </div>
              <div class="btn-ds-seg">
                <button type="button" class="${mdState.variantFilter === 'all' ? 'active' : ''}" onclick="mdUpdate('variantFilter', 'all')">Tất cả (3)</button>
                <button type="button" class="${mdState.variantFilter === 'destructive' ? 'active' : ''}" onclick="mdUpdate('variantFilter', 'destructive')">① Destructive</button>
                <button type="button" class="${mdState.variantFilter === 'success' ? 'active' : ''}" onclick="mdUpdate('variantFilter', 'success')">② Success</button>
                <button type="button" class="${mdState.variantFilter === 'team' ? 'active' : ''}" onclick="mdUpdate('variantFilter', 'team')">③ Team List</button>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span style="font-size:11px; font-weight:700; color:var(--text-muted);">MỞ THỬ OVERLAY THẬT:</span>
              <button type="button" class="btn-ds" onclick="mdOpenLive('destructive', 'desktop')">▶ Destructive</button>
              <button type="button" class="btn-ds" onclick="mdOpenLive('success', 'desktop')">▶ Success</button>
              <button type="button" class="btn-ds ai" onclick="mdOpenLive('team', 'desktop')">▶ Team Modal</button>
            </div>
          </div>

          <!-- 3 KHỐI SO SÁNH DESKTOP & MOBILE TRÊN NỀN OVERLAY -->
          ${sections.map(sec => `
            <div class="btn-group-card" style="margin-bottom:16px;">
              <div class="btn-group-head">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">${sec.title}</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">${sec.sub}</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  ${sec.badge}
                  <button type="button" class="mini-btn" onclick="mdOpenLive('${sec.id}', '${mdState.viewportFilter === 'mobile' ? 'mobile' : 'desktop'}')">Mở Pop-up</button>
                </div>
              </div>
              <div style="padding:16px;">
                <div class="${gridCls}">
                  ${showDesktop ? `
                    <div class="md-backdrop-panel">
                      <span class="md-viewport-tag">DESKTOP (≥ 1024px) &amp; TABLET (601–1023px) • Nút nằm ngang</span>
                      ${renderModalCard(sec.id, 'desktop', false)}
                    </div>
                  ` : ''}
                  ${showMobile ? `
                    <div class="md-backdrop-panel" style="background:#0f131a;">
                      <span class="md-viewport-tag">MOBILE (≤ 600px • Primary CTA nằm trên)</span>
                      ${renderModalCard(sec.id, 'mobile', false)}
                    </div>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Responsive &amp; Trình tự Nút CTA</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Desktop (Hàng ngang):</strong> Đặt nút phụ (<em>Hủy bỏ / Cancel</em>) bên trái, nút hành động chính (<em>Xác nhận / Xóa</em>) bên phải. Nếu có checkbox phụ (<em>Không hiển thị lại</em>), neo ở sát mép trái footer.</li>
                <li><strong>Mobile (Xếp chồng 100% chiều rộng):</strong> Đảo nút hành động chính lên <strong>trên cùng</strong> và nút <em>Hủy bỏ</em> xuống dưới với chiều cao tối thiểu <code>38px–44px</code> để thuận tầm ngón cái.</li>
                <li><strong>Đồng bộ Icon Container ngữ nghĩa:</strong> Dùng đỏ <code>--ds-red-1000</code> cho tác vụ không thể hoàn tác, xanh lá <code>--ds-green-1000</code> cho kết quả thành công và <code>--ds-brand-50</code> cho luồng mời/cộng tác.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không dùng Modal cho thông báo thoáng qua:</strong> Các phản hồi thành công nhẹ (như <em>"Đã copy link"</em>) chỉ nên dùng Toast thay vì làm gián đoạn luồng thao tác bằng Modal.</li>
                <li><strong>Không để nút chữ trống hoặc mất nhãn trên Mobile:</strong> Luôn hiển thị đầy đủ động từ hành động cụ thể (VD: <em>"Xóa bài viết"</em>, <em>"Xác nhận (2)"</em>) thay vì nút trơn không chữ.</li>
                <li><strong>Tránh chồng quá nhiều nội dung dài:</strong> Mô tả Modal nên ngắn gọn (tối đa ~160 ký tự); nếu form quá nhiều trường phức tạp, hãy chuyển sang trang riêng hoặc Side Drawer.</li>
              </ul>
            </div>
          </div>

          ${mdState.liveModal ? `
            <div class="md-live-overlay" onclick="mdCloseLive()">
              <div style="display:flex; flex-direction:column; align-items:center; gap:12px; max-width:100%;" onclick="event.stopPropagation()">
                <div style="display:flex; align-items:center; gap:8px;">
                  <div class="btn-ds-seg" style="background:rgba(255,255,255,0.92);">
                    <button type="button" class="${mdState.liveModal.viewport === 'desktop' ? 'active' : ''}" onclick="mdOpenLive('${mdState.liveModal.variant}', 'desktop')">Desktop View</button>
                    <button type="button" class="${mdState.liveModal.viewport === 'mobile' ? 'active' : ''}" onclick="mdOpenLive('${mdState.liveModal.variant}', 'mobile')">Mobile View</button>
                  </div>
                  <button type="button" class="ds-btn ds-btn-secondary" style="height:30px; font-size:12px;" onclick="mdCloseLive()">Đóng (ESC)</button>
                </div>
                ${renderModalCard(mdState.liveModal.variant, mdState.liveModal.viewport, true)}
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // =========================================================================
    // 2T. APPLICATION COMPONENT: NAVIGATION (SIDEBAR & RAIL) ENGINE
    // =========================================================================
    const NV_STORAGE_KEY = 'destudio_navigation_v1';

    const NV_PRIMARY_ITEMS = [
      { id: 'dashboard',  label: 'Dashboard',            icon: 'bar-chart' },
      { id: 'partner',    label: 'Partners',             icon: 'users',    hasSub: true },
      { id: 'reports',    label: 'Reports',              icon: 'file' },
      { id: 'sysdoc',     label: 'System Documentation', icon: 'file-text' },
      { id: 'restrict',   label: 'Access Control',       icon: 'shield',   hasSub: true },
      { id: 'deliveries', label: 'Webhooks',             icon: 'shuffle' },
      { id: 'assets',     label: 'Assets',               icon: 'archive' },
      { id: 'creds',      label: 'API Keys',             icon: 'award' },
      { id: 'apps',       label: 'Applications',         icon: 'monitor' },
      { id: 'usermgmt',   label: 'User Management',      icon: 'users',    hasSub: true },
      { id: 'logs',       label: 'Audit Logs',           icon: 'clock' },
      { id: 'drmconf',    label: 'Security Settings',    icon: 'settings' },
      { id: 'forensic',   label: 'Media Processing',     icon: 'fingerprint', hasSub: true },
      { id: 'tools',      label: 'Tools',                icon: 'wrench',   hasSub: true, children: ['Workspace', 'Inspector', 'Templates'] },
      { id: 'contacts',   label: 'Contacts',             icon: 'contact' },
      { id: 'notify',     label: 'Notifications',        icon: 'bell' },
      { id: 'blog',       label: 'Changelog',            icon: 'news',     hasSub: true },
      { id: 'docs',       label: 'Help Center',          icon: 'tablet',   hasSub: true }
    ];

    const NV_SUITE_TOP = [
      { id: 's-dash',     label: 'Dashboard',            icon: 'bar-chart', disabled: true },
      { id: 's-reports',  label: 'Reports',              icon: 'file',      disabled: true },
      { id: 's-detect',   label: 'Monitoring',           icon: 'target' },
      { id: 's-history',  label: 'Activity History',     icon: 'clock' },
      { id: 's-docs',     label: 'Documentation',        icon: 'tablet',    hasSub: true },
      { id: 's-help',     label: 'Help & Support',       icon: 'help',      arrowRight: true }
    ];

    const NV_SUITE_BOTTOM = [
      { id: 's-drm',      label: 'Cloud Security',       icon: 'shield' },
      { id: 's-audio',    label: 'Audio Analytics',      icon: 'wave' },
      { id: 's-take',     label: 'Content Moderation',   icon: 'lock' }
    ];

    const DEFAULT_NV_STATE = {
      viewMode: 'figma-all', // 'figma-all' | 'interactive'
      activePrimary: 'tools',
      activeSubChild: 'Workspace',
      expandedGroup: 'tools',
      activeSuite: 's-detect',
      interactiveApp: 'primary', // 'primary' | 'suite'
      interactiveCollapsed: false,
      unreadCount: 3
    };

    function loadNvState() {
      try {
        const raw = localStorage.getItem(NV_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_NV_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_NV_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_NV_STATE));
      }
    }

    let nvState = loadNvState();

    function saveNvState() {
      try { localStorage.setItem(NV_STORAGE_KEY, JSON.stringify(nvState)); } catch (e) {}
    }

    function nvUpdate(key, val) {
      nvState[key] = val;
      saveNvState();
      renderCanvas();
    }

    function nvSelectPrimary(id, hasSub) {
      nvState.activePrimary = id;
      if (hasSub) {
        nvState.expandedGroup = nvState.expandedGroup === id ? '' : id;
      }
      saveNvState();
      renderCanvas();
    }

    function nvSelectSubChild(child) {
      nvState.activePrimary = 'tools';
      nvState.activeSubChild = child;
      saveNvState();
      renderCanvas();
      showToast(`Đang mở mục con: Tools → ${child}`);
    }

    function nvSelectSuite(id) {
      nvState.activeSuite = id;
      saveNvState();
      renderCanvas();
    }

    function resetNavigationConfig() {
      nvState = JSON.parse(JSON.stringify(DEFAULT_NV_STATE));
      saveNvState();
      renderCanvas();
      showToast('Đã khôi phục cấu hình Navigation mặc định');
    }

    function nvGetIconSvg(name, size = 14) {
      const p = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"`;
      const map = {
        'bar-chart': `<svg ${p}><line x1="6" y1="20" x2="6" y2="14"/><line x1="12" y1="20" x2="12" y2="8"/><line x1="18" y1="20" x2="18" y2="11"/></svg>`,
        'users': `<svg ${p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
        'file': `<svg ${p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="14" y2="17"/></svg>`,
        'file-text': `<svg ${p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
        'shield': `<svg ${p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
        'shuffle': `<svg ${p}><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>`,
        'archive': `<svg ${p}><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
        'award': `<svg ${p}><circle cx="12" cy="8" r="6"/><path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.12"/></svg>`,
        'monitor': `<svg ${p}><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
        'clock': `<svg ${p}><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/></svg>`,
        'settings': `<svg ${p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
        'fingerprint': `<svg ${p}><path d="M12 11a2 2 0 0 0-2 2v4"/><path d="M8.5 17V13a3.5 3.5 0 0 1 7 0v3"/><path d="M5.5 16v-3a6.5 6.5 0 0 1 13 0v2"/><path d="M12 4a9 9 0 0 1 9 9"/></svg>`,
        'wrench': `<svg ${p}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
        'contact': `<svg ${p}><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 17c.8-1.8 2.2-2.5 4-2.5s3.2.7 4 2.5"/></svg>`,
        'bell': `<svg ${p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
        'news': `<svg ${p}><path d="M4 4h14v16H4z"/><path d="M18 8h2v10a2 2 0 0 1-2 2"/><line x1="8" y1="8" x2="14" y2="8"/><line x1="8" y1="12" x2="14" y2="12"/></svg>`,
        'tablet': `<svg ${p}><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
        'target': `<svg ${p}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="12" y1="17" x2="12" y2="21"/><line x1="3" y1="12" x2="7" y2="12"/><line x1="17" y1="12" x2="21" y2="12"/></svg>`,
        'help': `<svg ${p}><circle cx="12" cy="12" r="9"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
        'wave': `<svg ${p}><line x1="4" y1="10" x2="4" y2="14"/><line x1="8" y1="6" x2="8" y2="18"/><line x1="12" y1="4" x2="12" y2="20"/><line x1="16" y1="8" x2="16" y2="16"/><line x1="20" y1="10" x2="20" y2="14"/></svg>`,
        'lock': `<svg ${p}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>`
      };
      return map[name] || map.file;
    }

    function nvBrandMark(kind) {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
      const brandMark = logosState.items.find(i => i.id === 'logo-mark-brand') || horiz;
      const isDark = typeof uiTheme !== 'undefined' && uiTheme === 'dark';
      const suiteMark = isDark
        ? (logosState.items.find(i => i.id === 'logo-mark-mono-light') || brandMark)
        : (logosState.items.find(i => i.id === 'logo-mark-mono-dark') || brandMark);
      if (kind === 'header-full') {
        return `<div style="display:inline-flex;align-items:center;gap:8px;">${renderLogoMarkup(horiz, 'height:22px;width:auto;display:block;')}<span class="brand-ver-pill">1.0</span></div>`;
      }
      if (kind === 'suite-full') {
        return `<div style="display:inline-flex;align-items:center;gap:8px;min-width:0;">${renderLogoMarkup(horiz, 'height:20px;width:auto;display:block;')}<span class="brand-ver-pill" style="background:var(--bg-subtle);color:var(--text-secondary);border:1px solid var(--border-default);">Suite</span></div>`;
      }
      if (kind === 'suite') {
        return `<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;flex-shrink:0;">${renderLogoMarkup(suiteMark, 'height:22px;width:auto;display:block;border-radius:5px;')}</span>`;
      }
      return `<span style="display:inline-flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:6px;flex-shrink:0;">${renderLogoMarkup(brandMark, 'height:22px;width:auto;display:block;border-radius:5px;')}</span>`;
    }

    function renderPrimaryRailCol() {
      return `
        <div class="nv-col is-rail">
          <div class="nv-brand-row">${nvBrandMark('primary')}</div>
          <div class="nv-menu-list">
            ${NV_PRIMARY_ITEMS.map(item => `
              <div class="nv-rail-btn ${nvState.activePrimary === item.id ? 'is-active' : ''}" title="${item.label}" onclick="nvSelectPrimary('${item.id}', ${!!item.hasSub})">
                ${nvGetIconSvg(item.icon, 14)}
              </div>
            `).join('')}
          </div>
          <div class="nv-footer">
            <div class="nv-bell-wrap" title="Thông báo (${nvState.unreadCount})" onclick="showToast('Thông báo hệ thống: ${nvState.unreadCount} mới')">
              ${nvGetIconSvg('bell', 14)}
              ${nvState.unreadCount > 0 ? `<span class="nv-badge-red">${nvState.unreadCount}</span>` : ''}
            </div>
            <div class="nv-avatar-sn" title="Olivia Rhye (Admin)">OR</div>
          </div>

        </div>
      `;
    }

    function renderSuiteRailCol() {
      return `
        <div class="nv-col is-rail">
          <div class="nv-brand-row">${nvBrandMark('suite')}</div>
          <div class="nv-menu-list">
            ${NV_SUITE_TOP.map(item => `
              <div class="nv-rail-btn ${item.disabled ? 'is-disabled' : ''} ${!item.disabled && nvState.activeSuite === item.id ? 'is-active' : ''}" title="${item.label}${item.disabled ? ' (Vô hiệu)' : ''}" onclick="${item.disabled ? '' : `nvSelectSuite('${item.id}')`}">
                ${nvGetIconSvg(item.icon, 14)}
              </div>
            `).join('')}
            <div class="nv-group-divider">SUITE</div>
            ${NV_SUITE_BOTTOM.map(item => `
              <div class="nv-rail-btn ${nvState.activeSuite === item.id ? 'is-active' : ''}" title="${item.label}" onclick="nvSelectSuite('${item.id}')">
                ${nvGetIconSvg(item.icon, 14)}
              </div>
            `).join('')}
          </div>
          <div class="nv-footer">
            <div class="nv-avatar-sn" title="Olivia Rhye (Admin)">OR</div>
          </div>

        </div>
      `;
    }

    function renderPrimaryExpandedCol() {
      const chevDown = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
      const chevUp = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>`;
      return `
        <div class="nv-col is-expanded">
          <div class="nv-brand-row">
            ${nvBrandMark('header-full')}
          </div>
          <div class="nv-menu-list">
            ${NV_PRIMARY_ITEMS.map(item => {
              const isAct = nvState.activePrimary === item.id;
              const isExp = item.hasSub && nvState.expandedGroup === item.id;
              return `
                <div>
                  <div class="nv-item ${isAct ? 'is-active' : ''}" onclick="nvSelectPrimary('${item.id}', ${!!item.hasSub})">
                    <span class="nv-item-main">${nvGetIconSvg(item.icon, 14)}<span class="nv-item-label">${item.label}</span></span>
                    ${item.hasSub ? `<span style="opacity:0.75; display:inline-flex;">${isExp ? chevUp : chevDown}</span>` : ''}
                  </div>
                  ${item.children && isExp ? `
                    <div class="nv-submenu">
                      ${item.children.map(ch => `
                        <div class="nv-subitem ${nvState.activeSubChild === ch && nvState.activePrimary === item.id ? 'is-active' : ''}" onclick="nvSelectSubChild('${ch}')">${ch}</div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
          <div class="nv-footer">
            <div style="display:flex; align-items:center; gap:8px; min-width:0;">
              <div class="nv-avatar-sn">OR</div>
              <div style="min-width:0;">
                <div style="font-size:11.5px; font-weight:700; color:#101828; line-height:1.2;">Olivia Rhye</div>
                <div style="font-size:10px; color:#667085;">Admin</div>
              </div>
            </div>
            <div class="nv-bell-wrap" onclick="showToast('Có ${nvState.unreadCount} thông báo chưa đọc')">
              ${nvGetIconSvg('bell', 15)}
              ${nvState.unreadCount > 0 ? `<span class="nv-badge-red">${nvState.unreadCount}</span>` : ''}
            </div>
          </div>

        </div>
      `;
    }

    function renderSuiteExpandedCol() {
      const chevDown = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
      const chevRight = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>`;
      return `
        <div class="nv-col is-expanded">
          <div class="nv-brand-row">
            ${nvBrandMark('suite-full')}
          </div>
          <div class="nv-menu-list">
            ${NV_SUITE_TOP.map(item => `
              <div class="nv-item ${item.disabled ? 'is-disabled' : ''} ${!item.disabled && nvState.activeSuite === item.id ? 'is-active' : ''}" onclick="${item.disabled ? '' : `nvSelectSuite('${item.id}')`}">
                <span class="nv-item-main">${nvGetIconSvg(item.icon, 14)}<span class="nv-item-label">${item.label}</span></span>
                ${item.hasSub ? chevDown : (item.arrowRight ? chevRight : '')}
              </div>
            `).join('')}

            <div class="nv-group-divider">WORKSPACE SUITE</div>
            ${NV_SUITE_BOTTOM.map(item => `
              <div class="nv-item ${nvState.activeSuite === item.id ? 'is-active' : ''}" onclick="nvSelectSuite('${item.id}')">
                <span class="nv-item-main">${nvGetIconSvg(item.icon, 14)}<span class="nv-item-label">${item.label}</span></span>
              </div>
            `).join('')}
          </div>
          <div class="nv-footer">
            <div style="display:flex; align-items:center; gap:8px; min-width:0;">
              <div class="nv-avatar-sn">OR</div>
              <div style="min-width:0;">
                <div style="font-size:11.5px; font-weight:700; color:#101828; line-height:1.2;">Olivia Rhye</div>
                <div style="font-size:10px; color:#667085;">Admin</div>
              </div>
            </div>
            <div style="display:inline-flex; align-items:center; gap:4px; color:#667085; cursor:pointer;" onclick="showToast('${nvState.unreadCount} cập nhật mới trong Suite')">
              <span class="nv-counter-pill">${nvState.unreadCount}</span>
              ${chevRight}
            </div>
          </div>

        </div>
      `;
    }

    function buildNavigationHTMLSnippet() {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
      return `<!-- Expanded Sidebar Shell (260px) -->
<aside class="nv-col is-expanded" style="width:260px;">
  <div class="nv-brand-row">
    ${renderLogoMarkup(horiz, 'height:22px;width:auto;display:block;')}
    <span class="brand-ver-pill">1.0</span>
  </div>
  <nav class="nv-menu-list">
    <a class="nv-item is-active">Tools (Expanded)</a>
    <div class="nv-submenu">
      <a class="nv-subitem is-active">Workspace</a>
      <a class="nv-subitem">Inspector</a>
      <a class="nv-subitem">Templates</a>
    </div>
    <span class="nv-item is-disabled">Dashboard (No Access)</span>
  </nav>
  <footer class="nv-footer">
    <div class="nv-avatar-sn">OR</div>
    <div><strong>Olivia Rhye</strong><small>Admin</small></div>
    <span class="nv-badge-red">3</span>
  </footer>
</aside>`;
    }

    function renderNavigationPage() {
      return `
        <div class="nv-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">2 App Shells (De Studio Core &amp; Analytics Suite) × 2 Trạng thái (Rail 64px &amp; Expanded 260px)</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetNavigationConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildNavigationHTMLSnippet(), 'Đã copy HTML Navigation')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN ỨNG DỤNG • APPLICATION COMPONENTS / NAVIGATION</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Thanh Điều hướng Ứng dụng (Sidebar Navigation)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              Hệ thống <strong>Sidebar Navigation</strong> kết hợp đầy đủ <strong>Icons</strong>, <strong>Avatar</strong>, <strong>Badges</strong> và <strong>Tooltips</strong>, hỗ trợ hai chế độ <strong>Thu gọn (Collapsed Icon Rail 64px)</strong> và <strong>Mở rộng (Expanded 260px)</strong> cùng nhánh menu con 2 cấp, mục vô hiệu hóa quyền và phần chuyển đổi giữa các Suite con.
            </p>
          </div>

          <!-- BỘ ĐIỀU KHIỂN XEM TRƯỚC -->
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div class="btn-ds-seg">
              <button type="button" class="${nvState.viewMode === 'figma-all' ? 'active' : ''}" onclick="nvUpdate('viewMode', 'figma-all')">So sánh cả 4 cột Figma</button>
              <button type="button" class="${nvState.viewMode === 'interactive' ? 'active' : ''}" onclick="nvUpdate('viewMode', 'interactive')">Thử nghiệm Thu gọn / Mở rộng (Live)</button>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:11px; color:var(--text-muted);">Thông báo footer:</span>
              <div class="btn-ds-seg">
                <button type="button" class="${nvState.unreadCount === 0 ? 'active' : ''}" onclick="nvUpdate('unreadCount', 0)">0</button>
                <button type="button" class="${nvState.unreadCount === 3 ? 'active' : ''}" onclick="nvUpdate('unreadCount', 3)">3</button>
                <button type="button" class="${nvState.unreadCount === 9 ? 'active' : ''}" onclick="nvUpdate('unreadCount', 9)">9+</button>
              </div>
            </div>
          </div>

          ${nvState.viewMode === 'figma-all' ? `
            <!-- CHẾ ĐỘ SO SÁNH 4 CỘT NHƯ ẢNH FIGMA -->
            <div style="font-size:11.5px; color:var(--text-muted); margin-bottom:8px;">Bấm trực tiếp vào <strong>Tools</strong>, icon thanh Rail hoặc bất kỳ mục nào để thử trạng thái đóng/mở Submenu &amp; Active highlight.</div>
            <div class="nv-showcase-frame">
              <div class="nv-columns-grid">
                ${renderPrimaryRailCol()}
                ${renderSuiteRailCol()}
                ${renderPrimaryExpandedCol()}
                ${renderSuiteExpandedCol()}
              </div>
            </div>
          ` : `
            <!-- CHẾ ĐỘ THỬ NGHIỆM APP SHELL LIVE -->
            <div class="btn-group-card" style="margin-bottom:16px;">
              <div class="btn-group-head">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">Môi trường Thử nghiệm Sidebar Thực tế</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Chuyển đổi giữa App Chính (De Studio) và Suite Con (Analytics &amp; Media) hoặc thu gọn về Rail 64px.</div>
                </div>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <div class="btn-ds-seg">
                    <button type="button" class="${nvState.interactiveApp === 'primary' ? 'active' : ''}" onclick="nvUpdate('interactiveApp', 'primary')">De Studio Core</button>
                    <button type="button" class="${nvState.interactiveApp === 'suite' ? 'active' : ''}" onclick="nvUpdate('interactiveApp', 'suite')">Analytics &amp; Media</button>
                  </div>
                  <button type="button" class="btn-ds ai" onclick="nvUpdate('interactiveCollapsed', ${!nvState.interactiveCollapsed})">
                    ${nvState.interactiveCollapsed ? '◧ Mở rộng (260px)' : '◨ Thu gọn Rail (64px)'}
                  </button>
                </div>
              </div>
              <div style="padding:16px; background:#f8fafc; display:flex; gap:16px; min-height:460px; align-items:stretch;">
                <div style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; display:flex; flex-shrink:0;">
                  ${nvState.interactiveApp === 'primary'
                    ? (nvState.interactiveCollapsed ? renderPrimaryRailCol() : `<div style="width:248px; display:flex;">${renderPrimaryExpandedCol()}</div>`)
                    : (nvState.interactiveCollapsed ? renderSuiteRailCol() : `<div style="width:248px; display:flex;">${renderSuiteExpandedCol()}</div>`)}
                </div>
                <div style="flex:1; background:#ffffff; border:1px dashed #cbd5e1; border-radius:10px; padding:20px; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center;">
                  <span class="ds-badge ds-badge-blue" style="margin-bottom:10px;">
                    ${nvState.interactiveApp === 'primary' ? `Primary Active: ${nvState.activePrimary} (${nvState.activeSubChild})` : `Suite Active: ${nvState.activeSuite}`}
                  </span>
                  <div style="font-size:15px; font-weight:700; color:#101828; margin-bottom:6px;">Vùng Nội dung Chính (Main App Canvas)</div>
                  <div style="font-size:12.5px; color:#475467; max-width:360px;">Tự động giãn rộng thêm <strong>196px</strong> không gian bảng/biểu đồ khi thanh Navigation thu về Rail 64px.</div>
                </div>
              </div>
            </div>
          `}

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Cấu trúc Sidebar Navigation</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>2 Chế độ Responsive (64px ↔ 260px):</strong> Khi thu gọn về Icon Rail <code>64px</code>, luôn gắn Tooltip tên chức năng khi di chuột và giữ lại nhãn nhóm ngắn (<code>SUITE</code>) làm điểm neo thị giác.</li>
                <li><strong>Nhấn mạnh mục Đang chọn &amp; Submenu:</strong> Mục đang mở/chọn dùng nền <code>--ds-brand-50</code> và chữ/icon <code>--ds-brand-1000</code>; danh sách con lùi vào với đường dẫn dọc bên trái giúp nhận biết cấp bậc ngay lập tức.</li>
                <li><strong>Trạng thái Vô hiệu &amp; Chuyển Suite:</strong> Hiển thị mờ màu <code>--ds-grey-400</code> cho các trang chưa có quyền (Dashboard/Reports) thay vì ẩn hoàn toàn; tách khu Suite Switcher bằng đường kẻ và tiêu đề IN HOA (<em>WORKSPACE SUITE</em>).</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không lồng menu quá 2 cấp:</strong> Việc lồng 3–4 cấp trong sidebar gây hẹp chiều ngang và rẽ chữ; hãy đưa cấp sâu hơn vào Tabs bên trong nội dung trang.</li>
                <li><strong>Không thiếu chân Sidebar cố định:</strong> Thông tin tài khoản (<em>Avatar + Tên + Vai trò Admin</em>) và chuông/số đếm thông báo phải luôn neo ở đáy sidebar để dễ truy cập mọi lúc.</li>
                <li><strong>Không dùng màu đỏ cảnh báo cho trạng thái Active thông thường:</strong> Chỉ sử dụng đỏ <code>--ds-red-1000</code> cho huy hiệu thông báo chưa đọc (badge <code>3</code>).</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2U. APPLICATION COMPONENT: PAGINATION ENGINE
    // =========================================================================
    const PGN_STORAGE_KEY = 'destudio_pagination_v1';

    const DEFAULT_PGN_STATE = {
      currentPage: 1,
      totalItems: 990,
      pageSize: 10,
      activeSlide: 0, // 0 | 1 | 2
      sectionFilter: 'all', // 'all' | 'table' | 'carousel'
      carouselTone: 'figma' // 'figma' (Orange + Dark) | 'brand'
    };

    function loadPgnState() {
      try {
        const raw = localStorage.getItem(PGN_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PGN_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_PGN_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_PGN_STATE));
      }
    }

    let pgnState = loadPgnState();

    function savePgnState() {
      try { localStorage.setItem(PGN_STORAGE_KEY, JSON.stringify(pgnState)); } catch (e) {}
    }

    function pgnGetTotalPages() {
      return Math.max(1, Math.ceil((pgnState.totalItems || 990) / (pgnState.pageSize || 10)));
    }

    function pgnSetPage(p) {
      const maxP = pgnGetTotalPages();
      const clamped = Math.max(1, Math.min(maxP, Number(p) || 1));
      pgnState.currentPage = clamped;
      savePgnState();
      renderCanvas();
    }

    function pgnSetSize(sz) {
      pgnState.pageSize = Number(sz) || 10;
      const maxP = pgnGetTotalPages();
      if (pgnState.currentPage > maxP) pgnState.currentPage = maxP;
      savePgnState();
      renderCanvas();
    }

    function pgnSetSlide(idx) {
      pgnState.activeSlide = idx;
      savePgnState();
      renderCanvas();
    }

    function pgnUpdate(key, val) {
      pgnState[key] = val;
      savePgnState();
      renderCanvas();
    }

    function resetPaginationConfig() {
      pgnState = JSON.parse(JSON.stringify(DEFAULT_PGN_STATE));
      savePgnState();
      renderCanvas();
      showToast('Đã khôi phục cấu hình Pagination mặc định');
    }

    function pgnComputeEllipsisPages(curr, total, span) {
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      if (curr <= span - 1) {
        const arr = [];
        for (let i = 1; i <= span; i++) arr.push(i);
        arr.push('...');
        arr.push(total);
        return arr;
      }
      if (curr >= total - 3) {
        return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
      }
      return [1, '...', curr - 1, curr, curr + 1, '...', total];
    }

    function pgnRenderArrowsAndNumbers(pages, isSm, maxP) {
      const chevL = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
      const chevR = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;
      const curr = pgnState.currentPage;
      return `
        <div class="pgn-group ${isSm ? 'is-sm' : ''}">
          <button type="button" class="pgn-arrow-btn" ${curr <= 1 ? 'disabled' : ''} onclick="pgnSetPage(${curr - 1})" aria-label="Trang trước">${chevL}</button>
          ${pages.map(p => p === '...'
            ? `<span class="pgn-num-btn is-ellipsis">•••</span>`
            : `<button type="button" class="pgn-num-btn ${curr === p ? 'is-active' : ''}" onclick="pgnSetPage(${p})">${p}</button>`
          ).join('')}
          <button type="button" class="pgn-arrow-btn" ${curr >= maxP ? 'disabled' : ''} onclick="pgnSetPage(${curr + 1})" aria-label="Trang sau">${chevR}</button>
        </div>
      `;
    }

    function pgnRenderSizeSelect() {
      return `
        <select class="pgn-select" onchange="pgnSetSize(this.value)" aria-label="Số mục mỗi trang">
          ${[10, 20, 50, 100].map(sz => `<option value="${sz}" ${pgnState.pageSize === sz ? 'selected' : ''}>${sz} / trang</option>`).join('')}
        </select>
      `;
    }

    function pgnRenderIndicatorGroup(shape, contained, toneCls, count, activeIdx) {
      const wrapCls = contained ? 'pgn-ind-tray' : 'pgn-ind-plain';
      const itemCls = shape === 'dot' ? 'pgn-dot' : 'pgn-bar';
      return `
        <div class="${wrapCls}">
          ${Array.from({ length: count }, (_, i) => `
            <span class="${itemCls} ${toneCls} ${activeIdx === i ? 'is-active' : ''}" title="Bước ${i + 1}" onclick="pgnSetSlide(${i})"></span>
          `).join('')}
        </div>
      `;
    }

    function buildPaginationHTMLSnippet() {
      const maxP = pgnGetTotalPages();
      return `<!-- 1. Enterprise Table Pagination (Total + Ellipsis + Page Size + Go to Page) -->
<nav class="pgn-group" aria-label="Phân trang dữ liệu" style="gap:8px;">
  <span class="pgn-total-text">Tổng ${pgnState.totalItems} mục</span>
  <button class="pgn-arrow-btn" disabled>&lsaquo;</button>
  <button class="pgn-num-btn is-active">1</button>
  <button class="pgn-num-btn">2</button>
  <button class="pgn-num-btn">3</button>
  <span class="pgn-num-btn is-ellipsis">•••</span>
  <button class="pgn-num-btn">${maxP}</button>
  <button class="pgn-arrow-btn">&rsaquo;</button>
  <select class="pgn-select"><option>10 / trang</option></select>
</nav>

<!-- 2. Carousel Pill Container Dots Indicator -->
<div class="pgn-ind-tray" role="tablist">
  <span class="pgn-dot tone-orange is-active"></span>
  <span class="pgn-dot tone-orange"></span>
  <span class="pgn-dot tone-orange"></span>
</div>`;
    }

    function renderPaginationPage() {
      const maxP = pgnGetTotalPages();
      const curr = pgnState.currentPage;
      const chevL = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`;
      const chevR = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`;

      const showTable = pgnState.sectionFilter === 'all' || pgnState.sectionFilter === 'table';
      const showCarousel = pgnState.sectionFilter === 'all' || pgnState.sectionFilter === 'carousel';
      const startRecord = (curr - 1) * pgnState.pageSize + 1;
      const endRecord = Math.min(pgnState.totalItems, curr * pgnState.pageSize);

      return `
        <div class="pgn-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">9 Biến thể Phân trang Bảng &amp; 4 Nhóm Carousel Dot / Pill Indicators</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetPaginationConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildPaginationHTMLSnippet(), 'Đã copy HTML Pagination')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN ỨNG DỤNG • APPLICATION COMPONENTS / PAGINATION</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Thanh Phân trang &amp; Chỉ báo Bước (Pagination)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              <strong>Pagination</strong> cung cấp điều hướng theo chiều ngang giữa các trang dữ liệu trong bảng (<em>Data Table Footer</em>), danh sách thẻ, hoặc giữa các khung trượt (<em>Carousel / Onboarding Steps</em>).
            </p>
          </div>

          <!-- BỘ ĐIỀU KHIỂN THỬ NGHIỆM ĐỒNG BỘ -->
          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
              <div class="btn-ds-seg">
                <button type="button" class="${pgnState.sectionFilter === 'all' ? 'active' : ''}" onclick="pgnUpdate('sectionFilter', 'all')">Tất cả</button>
                <button type="button" class="${pgnState.sectionFilter === 'table' ? 'active' : ''}" onclick="pgnUpdate('sectionFilter', 'table')">① Phân trang Dữ liệu (9 hàng)</button>
                <button type="button" class="${pgnState.sectionFilter === 'carousel' ? 'active' : ''}" onclick="pgnUpdate('sectionFilter', 'carousel')">② Dot &amp; Pill Carousel</button>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">TRANG HIỆN TẠI:</span>
                <div class="btn-ds-seg">
                  ${[1, 3, 5, maxP].filter((v, i, a) => a.indexOf(v) === i).map(p => `
                    <button type="button" class="${curr === p ? 'active' : ''}" onclick="pgnSetPage(${p})">${p}</button>
                  `).join('')}
                </div>
              </div>
            </div>
            <span class="ds-badge ds-badge-blue">Hiển thị mục ${startRecord}–${endRecord} / ${pgnState.totalItems}</span>
          </div>

          ${showTable ? `
            <!-- PHẦN 1: 9 KIỂU PHÂN TRANG BẢNG & DỮ LIỆU -->
            <div class="pgn-frame">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">① Hệ thống Phân trang Dữ liệu &amp; Bảng (Data &amp; Table Pagination — Tương tác đồng bộ)</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Bấm trực tiếp số trang, mũi tên <code>&lsaquo; &rsaquo;</code>, chọn số dòng/trang hoặc nhập <code>Đi tới trang</code> để kiểm tra trạng thái thật.</div>
                </div>
              </div>

              <!-- 1. Compact SM -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">1. Nhỏ gọn (Compact SM)</span>
                ${pgnRenderArrowsAndNumbers([1, 2, 3, 4, 5], true, 5)}
              </div>

              <!-- 2. Default MD -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">2. Tiêu chuẩn (Default MD)</span>
                ${pgnRenderArrowsAndNumbers([1, 2, 3, 4, 5], false, 5)}
              </div>

              <!-- 3. Long Ellipsis -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">3. Rút gọn Ellipsis (...)</span>
                ${pgnRenderArrowsAndNumbers(pgnComputeEllipsisPages(curr, maxP, 6), false, maxP)}
              </div>

              <!-- 4. Total + Ellipsis + Page size -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">4. Tổng mục + Size Selector</span>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="pgn-total-text">Tổng ${pgnState.totalItems} mục</span>
                  ${pgnRenderArrowsAndNumbers(pgnComputeEllipsisPages(curr, maxP, 5), false, maxP)}
                  ${pgnRenderSizeSelect()}
                </div>
              </div>

              <!-- 5. Wide Mobile Input Pill -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">5. Khung Rộng (Mobile / Card)</span>
                <div class="pgn-group" style="gap:8px;">
                  <button type="button" class="pgn-arrow-btn" ${curr <= 1 ? 'disabled' : ''} onclick="pgnSetPage(${curr - 1})">${chevL}</button>
                  <div class="pgn-pill-box is-wide"><strong>${curr}</strong>&nbsp;/ ${maxP}</div>
                  <button type="button" class="pgn-arrow-btn" ${curr >= maxP ? 'disabled' : ''} onclick="pgnSetPage(${curr + 1})">${chevR}</button>
                </div>
              </div>

              <!-- 6. Split Size Left + Box Right -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">6. Tách Size (Trái) &amp; Box (Phải)</span>
                <div style="display:flex; align-items:center; justify-content:space-between; flex:1; gap:12px; flex-wrap:wrap;">
                  ${pgnRenderSizeSelect()}
                  <div class="pgn-group">
                    <button type="button" class="pgn-arrow-btn" ${curr <= 1 ? 'disabled' : ''} onclick="pgnSetPage(${curr - 1})">${chevL}</button>
                    <div class="pgn-pill-box"><strong>${curr}</strong>&nbsp;/ ${maxP}</div>
                    <button type="button" class="pgn-arrow-btn" ${curr >= maxP ? 'disabled' : ''} onclick="pgnSetPage(${curr + 1})">${chevR}</button>
                  </div>
                </div>
              </div>

              <!-- 7. Ultra Compact Inline -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">7. Tối giản (Inline Fraction)</span>
                <div class="pgn-group" style="gap:8px;">
                  <span style="font-size:12px; color:#344054; font-variant-numeric:tabular-nums;"><strong>${curr}</strong> / ${maxP}</span>
                  <button type="button" class="pgn-arrow-btn" ${curr <= 1 ? 'disabled' : ''} onclick="pgnSetPage(${curr - 1})">${chevL}</button>
                  <button type="button" class="pgn-arrow-btn" ${curr >= maxP ? 'disabled' : ''} onclick="pgnSetPage(${curr + 1})">${chevR}</button>
                </div>
              </div>

              <!-- 8. Button Group Prev / Next -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">8. Nút Trước / Sau (Responsive)</span>
                <div style="display:flex; align-items:center; justify-content:space-between; flex:1; gap:8px; flex-wrap:wrap;">
                  <button type="button" class="ds-btn ds-btn-secondary" style="height:32px; font-size:12px; opacity:${curr <= 1 ? '0.48' : '1'}; cursor:${curr <= 1 ? 'not-allowed' : 'pointer'};" ${curr <= 1 ? 'disabled' : ''} onclick="pgnSetPage(${curr - 1})">${chevL} Trước</button>
                  <span style="font-size:12px; font-weight:600; color:#344054;">Trang ${curr} / ${maxP}</span>
                  <button type="button" class="ds-btn ds-btn-secondary" style="height:32px; font-size:12px; opacity:${curr >= maxP ? '0.48' : '1'}; cursor:${curr >= maxP ? 'not-allowed' : 'pointer'};" ${curr >= maxP ? 'disabled' : ''} onclick="pgnSetPage(${curr + 1})">Tiếp ${chevR}</button>
                </div>
              </div>

              <!-- 9. Full Enterprise Footer + Go to page -->
              <div class="pgn-spec-row">
                <span class="pgn-row-tag">9. Bảng Đầy đủ (+ Go to page)</span>
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                  <span class="pgn-total-text">Tổng ${pgnState.totalItems} mục</span>
                  ${pgnRenderArrowsAndNumbers(pgnComputeEllipsisPages(curr, 9999, 5), false, 9999)}
                  ${pgnRenderSizeSelect()}
                  <div style="display:inline-flex; align-items:center; gap:8px; font-size:12px; color:#475467;">
                    <span>Đi tới</span>
                    <input type="number" min="1" max="${maxP}" class="pgn-goto-input" value="${curr}" onchange="pgnSetPage(this.value)" />
                  </div>
                </div>
              </div>
            </div>
          ` : ''}

          ${showCarousel ? `
            <!-- PHẦN 2: CAROUSEL & STEP DOT / BAR INDICATORS -->
            <div class="pgn-frame" style="border-color:#cbd5e1;">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                <div>
                  <div style="font-size:14px; font-weight:700; color:var(--text-primary);">② Chỉ báo Slide &amp; Bước Onboarding (Dot &amp; Pill Indicators — Cam &amp; Tối)</div>
                  <div style="font-size:11.5px; color:var(--text-muted); margin-top:2px;">Bấm trực tiếp vào từng chấm/thanh để xem bước active (<code>1 → 2 → 3</code>) ở cả dạng Tự do và dạng Khung nền (Pill Container).</div>
                </div>
                <div class="btn-ds-seg">
                  <button type="button" class="${pgnState.carouselTone === 'figma' ? 'active' : ''}" onclick="pgnUpdate('carouselTone', 'figma')">Cam + Tối (Figma)</button>
                  <button type="button" class="${pgnState.carouselTone === 'brand' ? 'active' : ''}" onclick="pgnUpdate('carouselTone', 'brand')">Xanh Brand</button>
                </div>
              </div>

              <div class="pgn-carousel-grid">
                <div class="pgn-ind-card">
                  <div style="font-size:11px; font-weight:700; color:var(--text-muted);">A. DẠNG CHẤM TỰ DO (PLAIN DOTS)</div>
                  <div class="pgn-ind-row">
                    ${pgnState.carouselTone === 'brand'
                      ? [0, 1, 2].map(idx => pgnRenderIndicatorGroup('dot', false, 'tone-brand', 3, idx)).join('')
                      : [0, 1, 2].map(idx => pgnRenderIndicatorGroup('dot', false, 'tone-orange', 3, idx)).join('') + [0, 1, 2].map(idx => pgnRenderIndicatorGroup('dot', false, 'tone-dark', 3, idx)).join('')}
                  </div>
                </div>

                <div class="pgn-ind-card">
                  <div style="font-size:11px; font-weight:700; color:var(--text-muted);">B. DẠNG THANH NGANG (BAR LINES)</div>
                  <div class="pgn-ind-row">
                    ${pgnState.carouselTone === 'brand'
                      ? [0, 1, 2].map(idx => pgnRenderIndicatorGroup('bar', false, 'tone-brand', 3, idx)).join('')
                      : [0, 1, 2].map(idx => pgnRenderIndicatorGroup('bar', false, 'tone-orange', 3, idx)).join('') + [0, 1, 2].map(idx => pgnRenderIndicatorGroup('bar', false, 'tone-dark', 3, idx)).join('')}
                  </div>
                </div>

                <div class="pgn-ind-card">
                  <div style="font-size:11px; font-weight:700; color:var(--text-muted);">C. CHẤM TRONG KHUNG NỀN (CONTAINED DOTS)</div>
                  <div class="pgn-ind-row">
                    ${pgnState.carouselTone === 'brand'
                      ? [0, 1, 2].map(idx => pgnRenderIndicatorGroup('dot', true, 'tone-brand', 3, idx)).join('')
                      : [0, 1, 2].map(idx => pgnRenderIndicatorGroup('dot', true, 'tone-orange', 3, idx)).join('') + [0, 1, 2].map(idx => pgnRenderIndicatorGroup('dot', true, 'tone-dark', 3, idx)).join('')}
                  </div>
                </div>

                <div class="pgn-ind-card">
                  <div style="font-size:11px; font-weight:700; color:var(--text-muted);">D. THANH TRONG KHUNG NỀN (CONTAINED BARS)</div>
                  <div class="pgn-ind-row">
                    ${pgnState.carouselTone === 'brand'
                      ? [0, 1, 2].map(idx => pgnRenderIndicatorGroup('bar', true, 'tone-brand', 3, idx)).join('')
                      : [0, 1, 2].map(idx => pgnRenderIndicatorGroup('bar', true, 'tone-orange', 3, idx)).join('') + [0, 1, 2].map(idx => pgnRenderIndicatorGroup('bar', true, 'tone-dark', 3, idx)).join('')}
                  </div>
                </div>
              </div>

              <!-- Live Slide Interactive Strip -->
              <div style="margin-top:16px; padding-top:12px; border-top:1px dashed #e2e8f0; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
                <span style="font-size:12px; font-weight:600; color:#344054;">Live Carousel Sync — Slide ${pgnState.activeSlide + 1} / 3:</span>
                <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
                  ${pgnRenderIndicatorGroup('dot', true, pgnState.carouselTone === 'brand' ? 'tone-brand' : 'tone-orange', 3, pgnState.activeSlide)}
                  ${pgnRenderIndicatorGroup('bar', true, pgnState.carouselTone === 'brand' ? 'tone-brand' : 'tone-dark', 3, pgnState.activeSlide)}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Lựa chọn Kiểu Phân trang</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Bảng dữ liệu lớn (Desktop):</strong> Dùng biến thể <em>Tổng mục + Ellipsis + Page size + Đi tới trang</em> (Mục 4 hoặc Mục 9) để người quản trị nắm tổng số bản ghi và nhảy nhanh tới trang xa.</li>
                <li><strong>Giao diện hẹp &amp; Mobile:</strong> Chuyển sang dạng <em>Trước / Trang X / Sau</em> (Mục 8) hoặc <em>1 / 99</em> (Mục 5, 7) để tránh tràn hàng ngang.</li>
                <li><strong>Carousel / Onboarding Steps:</strong> Dùng <em>Contained Dots/Bars</em> khi đặt đè lên ảnh bìa hoặc banner đa sắc để luôn giữ đủ độ tương phản.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không hiển thị toàn bộ dãy số trang:</strong> Khi tổng số trang &gt; 7, bắt buộc rút gọn bằng dấu <code>•••</code> (Ellipsis) và giữ trang đầu + trang cuối.</li>
                <li><strong>Không quên trạng thái Vô hiệu (Disabled):</strong> Tại trang <code>1</code> phải làm mờ nút <em>Trước</em>, tại trang cuối phải làm mờ nút <em>Tiếp</em> để báo hiệu ranh giới.</li>
                <li><strong>Không dùng Dot Indicator cho trên 6 slide:</strong> Khi quá nhiều bước/slide, hãy dùng dạng số phân số <code>1 / 9</code> thay cho chấm tròn.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2V. APPLICATION COMPONENT: SECTION HEADERS ENGINE
    // =========================================================================
    const SH_STORAGE_KEY = 'destudio_section_headers_v1';

    const SH_TABS_DATA = [
      { id: 'details',       label: 'Chi tiết' },
      { id: 'profile',       label: 'Hồ sơ' },
      { id: 'password',      label: 'Mật khẩu' },
      { id: 'team',          label: 'Nhóm' },
      { id: 'plan',          label: 'Gói dịch vụ' },
      { id: 'billing',       label: 'Thanh toán' },
      { id: 'email',         label: 'Email' },
      { id: 'notifications', label: 'Thông báo', count: 3 },
      { id: 'integrations',  label: 'Tích hợp' },
      { id: 'api',           label: 'API' }
    ];

    const DEFAULT_SH_STATE = {
      titleText: 'Thành viên nhóm',
      countText: '999.000 mục',
      descText: 'Quản lý thành viên nhóm và phân quyền tài khoản tại đây.',
      activeTab: 'details',
      activeSeg: 0,
      vpFilter: 'both',    // 'both' | 'desktop' | 'mobile'
      groupFilter: 'all'   // 'all' | 'simple' | 'tabbed'
    };

    function loadShState() {
      try {
        const raw = localStorage.getItem(SH_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SH_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_SH_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_SH_STATE));
      }
    }

    let shState = loadShState();

    function saveShState() {
      try { localStorage.setItem(SH_STORAGE_KEY, JSON.stringify(shState)); } catch (e) {}
    }

    function shUpdate(key, val) {
      shState[key] = val;
      saveShState();
      renderCanvas();
    }

    function resetSectionHeadersConfig() {
      shState = JSON.parse(JSON.stringify(DEFAULT_SH_STATE));
      saveShState();
      renderCanvas();
      showToast('Đã khôi phục cài đặt Section headers mặc định');
    }

    function shKebabIconSvg() {
      return `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/></svg>`;
    }

    function shRenderSearchToolbar(compact) {
      const iconSearch = getFoundationIconSvg('search', 14) || '🔍';
      const iconSliders = sfIconSliders(14);
      if (compact) {
        return `
          <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
            <div class="sf-search-box" style="height:32px; font-size:12px;">
              ${iconSearch}
              <input type="text" placeholder="Tìm kiếm..." readonly />
              <span style="color:#667085; display:inline-flex;">${iconSliders}</span>
            </div>
          </div>
        `;
      }
      return `
        <div class="sf-search-row" style="max-width:210px; flex:1 1 160px;">
          <div class="sf-search-box" style="height:32px; padding:0 8px; font-size:12px;">${iconSearch}<input type="text" placeholder="Tìm kiếm..." readonly /></div>
          <button type="button" class="sf-filter-icon-btn" style="width:32px; height:32px;" title="Bộ lọc">${iconSliders}</button>
        </div>
      `;
    }

    function shRenderSegmented(fullWidth) {
      const labels = ['Nhãn 1', 'Nhãn 2', 'Nhãn 3'];
      return `
        <div class="sh-seg-wrap ${fullWidth ? 'is-full' : ''}">
          ${labels.map((lbl, idx) => `
            <button type="button" class="sh-seg-btn ${shState.activeSeg === idx ? 'active' : ''}" onclick="shUpdate('activeSeg', ${idx})">${lbl}</button>
          `).join('')}
        </div>
      `;
    }

    function shRenderTabsBar() {
      return `
        <div class="sh-tabs-rail" role="tablist">
          ${SH_TABS_DATA.map(t => `
            <button type="button" class="sh-tab-btn ${shState.activeTab === t.id ? 'active' : ''}" onclick="shUpdate('activeTab', '${t.id}')">
              <span>${t.label}</span>
              ${t.count ? `<span class="sh-tab-badge">${t.count}</span>` : ''}
            </button>
          `).join('')}
        </div>
      `;
    }

    function shRenderMobileTabSelect() {
      return `
        <select class="ds-input" style="height:34px; font-size:12px; margin-top:10px; font-weight:600; color:#101828;" onchange="shUpdate('activeTab', this.value)">
          ${SH_TABS_DATA.map(t => `
            <option value="${t.id}" ${shState.activeTab === t.id ? 'selected' : ''}>${t.label}${t.count ? ` (${t.count})` : ''}</option>
          `).join('')}
        </select>
      `;
    }

    function renderSectionHeaderVariant(v) {
      const t = escapeHTML(shState.titleText || 'Thành viên nhóm');
      const c = escapeHTML(shState.countText || '999.000 mục');
      const d = escapeHTML(shState.descText || 'Quản lý thành viên nhóm và phân quyền tài khoản tại đây.');
      const showD = shState.vpFilter === 'both' || shState.vpFilter === 'desktop';
      const showM = shState.vpFilter === 'both' || shState.vpFilter === 'mobile';
      const gridCls = showD && showM ? 'sh-pair-grid' : 'sh-pair-grid single-col';

      let desktopRight = '';
      if (v.mode === 'search-actions') {
        desktopRight = `
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; flex:1; justify-content:flex-end;">
            ${shRenderSearchToolbar(false)}
            <div class="sh-actions-bar">
              <a class="ds-link" style="font-size:11.5px; text-decoration:underline; margin-right:2px;" onclick="showToast('Hành động phụ (Tertiary)')">Liên kết phụ</a>
              <button type="button" class="ds-btn ds-btn-secondary" onclick="showToast('Nút Phụ (Secondary)')">Phụ</button>
              <button type="button" class="ds-btn ds-btn-primary" onclick="showToast('Nút Chính (Primary)')">Chính</button>
              <button type="button" class="sh-kebab-btn" title="Tùy chọn thêm">${shKebabIconSvg()}</button>
            </div>
          </div>
        `;
      } else if (v.mode === 'search-only') {
        desktopRight = `
          <div style="display:flex; align-items:center; gap:8px; justify-content:flex-end;">
            ${shRenderSearchToolbar(false)}
          </div>
        `;
      } else if (v.mode === 'segmented') {
        desktopRight = `
          <div style="display:flex; align-items:center; gap:8px; justify-content:flex-end;">
            ${shRenderSegmented(false)}
            <button type="button" class="sh-kebab-btn" title="Tùy chọn thêm">${shKebabIconSvg()}</button>
          </div>
        `;
      } else if (v.mode === 'multi-actions') {
        desktopRight = `
          <div class="sh-actions-bar">
            <a class="ds-link" style="font-size:11.5px; text-decoration:underline; margin-right:2px;" onclick="showToast('Hành động phụ (Tertiary)')">Liên kết phụ</a>
            <button type="button" class="ds-btn ds-btn-secondary" onclick="showToast('Thao tác phụ 1')">Phụ</button>
            <button type="button" class="ds-btn ds-btn-secondary" onclick="showToast('Thao tác phụ 2')">Phụ</button>
            <button type="button" class="ds-btn ds-btn-primary" onclick="showToast('Thao tác chính (Primary)')">Chính</button>
            <button type="button" class="sh-kebab-btn" title="Tùy chọn thêm">${shKebabIconSvg()}</button>
          </div>
        `;
      }

      let mobileBody = '';
      if (v.mode === 'search-actions' || v.mode === 'multi-actions') {
        mobileBody += `
          <div class="sh-actions-bar" style="margin-top:10px;">
            <button type="button" class="ds-btn ds-btn-secondary" onclick="showToast('Mobile Secondary')">Phụ</button>
            <button type="button" class="ds-btn ds-btn-primary" onclick="showToast('Mobile Primary')">Chính</button>
          </div>
        `;
      } else if (v.mode === 'search-only') {
        mobileBody += shRenderSearchToolbar(true);
      } else if (v.mode === 'segmented') {
        mobileBody += shRenderSegmented(true);
      }
      if (v.withTabs) {
        mobileBody += shRenderMobileTabSelect();
      }

      return `
        <div class="sh-variant-card">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
            <div>
              <div style="font-size:13.5px; font-weight:700; color:var(--text-primary);">${v.title}</div>
              <div style="font-size:11.5px; color:var(--text-muted); margin-top:1px;">${v.desc}</div>
            </div>
            ${v.badge}
          </div>

          <div class="${gridCls}">
            ${showD ? `
              <div class="sh-desktop-pane">
                <span class="sh-vp-badge">DESKTOP (FULL BAR${v.withTabs ? ' + HORIZONTAL TABS' : ''})</span>
                <div class="sh-top-flex">
                  <div class="sh-heading-group">
                    <div class="sh-title-line">
                      <span class="sh-title-text">${t}</span>
                      <span class="sh-count-pill">${c}</span>
                    </div>
                    <div class="sh-desc-text">${d}</div>
                  </div>
                  ${desktopRight}
                </div>
                ${v.withTabs ? shRenderTabsBar() : ''}
              </div>
            ` : ''}

            ${showM ? `
              <div class="sh-mobile-pane">
                <span class="sh-vp-badge">MOBILE (${v.withTabs ? 'STACKED + SELECT' : 'STACKED'})</span>
                <div style="display:flex; align-items:flex-start; justify-content:space-between; gap:8px;">
                  <div class="sh-title-line">
                    <span class="sh-title-text" style="font-size:14px;">${t}</span>
                    <span class="sh-count-pill">${c}</span>
                  </div>
                  ${v.mode !== 'search-only' ? `<button type="button" class="sh-kebab-btn" style="width:22px; height:24px;">${shKebabIconSvg()}</button>` : ''}
                </div>
                <div class="sh-desc-text">${d}</div>
                ${mobileBody}
              </div>
            ` : ''}
          </div>

        </div>
      `;
    }

    function buildSectionHeadersHTMLSnippet() {
      const t = escapeHTML(shState.titleText || 'Thành viên nhóm');
      const c = escapeHTML(shState.countText || '999.000 mục');
      const d = escapeHTML(shState.descText || 'Quản lý thành viên nhóm và phân quyền tài khoản tại đây.');
      return `<!-- Section Header (Desktop Actions + Horizontal Tabs) -->
<header class="sh-desktop-pane">
  <div class="sh-top-flex">
    <div class="sh-heading-group">
      <div class="sh-title-line">
        <h2 class="sh-title-text">${t}</h2>
        <span class="sh-count-pill">${c}</span>
      </div>
      <p class="sh-desc-text">${d}</p>
    </div>
    <div class="sh-actions-bar">
      <a class="ds-link">Liên kết phụ</a>
      <button class="ds-btn ds-btn-secondary">Phụ</button>
      <button class="ds-btn ds-btn-primary">Chính</button>
    </div>
  </div>
  <div class="sh-tabs-rail" role="tablist">
    <button class="sh-tab-btn active">Chi tiết</button>
    <button class="sh-tab-btn">Hồ sơ</button>
    <button class="sh-tab-btn">Thông báo <span class="sh-tab-badge">3</span></button>
  </div>
</header>`;
    }

    function renderSectionHeadersPage() {
      const variants = [
        { id: 'v1', title: '① Tiêu đề + Search/Filter + Bộ nút Hành động', desc: 'Phổ biến nhất cho trang quản lý danh sách/bảng dữ liệu có tìm kiếm và nút tạo mới.', mode: 'search-actions', withTabs: false, badge: '<span class="ds-badge ds-badge-blue">Search + CTA</span>' },
        { id: 'v2', title: '② Tiêu đề + Thanh Tìm kiếm & Lọc đơn', desc: 'Dùng cho phân khu tra cứu nhanh, ít thao tác tạo/chỉnh sửa hàng loạt.', mode: 'search-only', withTabs: false, badge: '<span class="ds-badge ds-badge-gray">Search Only</span>' },
        { id: 'v3', title: '③ Tiêu đề + Segmented Switch (Button Group)', desc: 'Dùng khi chuyển chế độ xem nhanh (VD: Danh sách / Lưới / Biểu đồ hoặc Khoảng thời gian).', mode: 'segmented', withTabs: false, badge: '<span class="ds-badge ds-badge-purple">Button Group</span>' },
        { id: 'v4', title: '④ Tiêu đề + Đa nút Hành động + Hàng Tabs Ngang', desc: 'Phân khu trang Cài đặt Workspace: Desktop hiện đầy đủ 10 tab, Mobile thu gọn thành Dropdown Select.', mode: 'multi-actions', withTabs: true, badge: '<span class="ds-badge ds-badge-green">CTA + Tabs</span>' },
        { id: 'v5', title: '⑤ Tiêu đề + Tìm kiếm + Hàng Tabs Ngang', desc: 'Kết hợp chuyển Tab phân mục và thanh tìm kiếm nội dung trong từng tab.', mode: 'search-only', withTabs: true, badge: '<span class="ds-badge ds-badge-blue">Search + Tabs</span>' },
        { id: 'v6', title: '⑥ Tiêu đề + Segmented Switch + Hàng Tabs Ngang', desc: 'Kết hợp 2 tầng điều hướng: Tabs chính bên dưới + Segmented chuyển view bên phải.', mode: 'segmented', withTabs: true, badge: '<span class="ds-badge ds-badge-amber">Segmented + Tabs</span>' }
      ].filter(v => {
        if (shState.groupFilter === 'simple') return !v.withTabs;
        if (shState.groupFilter === 'tabbed') return v.withTabs;
        return true;
      });

      return `
        <div class="sh-sheet">
          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">6 Mẫu Section Headers (Desktop &amp; Mobile) • Lắp ghép Badges + Buttons + Search + Tabs</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="resetSectionHeadersConfig()">↺ Khôi phục mặc định</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildSectionHeadersHTMLSnippet(), 'Đã copy HTML Section headers')">Copy HTML Code</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">THÀNH PHẦN ỨNG DỤNG • APPLICATION COMPONENTS / SECTION HEADERS</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Tiêu đề Phân khu Responsive (Section Headers)</h1>
            <p style="font-size:13.5px; color:#475469; max-width:850px; line-height:1.6;">
              <strong>Section headers</strong> định danh đầu mỗi trang hoặc phân khu nội dung bằng <strong>Tiêu đề + Badge đếm + Mô tả</strong>, kết hợp linh hoạt với <strong>Search &amp; Filters</strong>, <strong>Buttons</strong>, <strong>Button Group</strong> và <strong>Horizontal Tabs</strong> (tự chuyển thành Dropdown Select trên Mobile).
            </p>
          </div>

          <!-- BỘ CẤU HÌNH NHANH -->
          <div class="btn-config-bar" style="grid-template-columns: 1fr 0.7fr 1.5fr; margin-bottom:10px;">
            <div class="form-field">
              <label>Tiêu đề phân khu</label>
              <input type="text" class="ds-input" value="${escapeHTML(shState.titleText)}" oninput="shUpdate('titleText', this.value)" />
            </div>
            <div class="form-field">
              <label>Badge đếm</label>
              <input type="text" class="ds-input" value="${escapeHTML(shState.countText)}" oninput="shUpdate('countText', this.value)" />
            </div>
            <div class="form-field">
              <label>Mô tả ngắn (Supporting text)</label>
              <input type="text" class="ds-input" value="${escapeHTML(shState.descText)}" oninput="shUpdate('descText', this.value)" />
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <div class="btn-ds-seg">
                <button type="button" class="${shState.vpFilter === 'both' ? 'active' : ''}" onclick="shUpdate('vpFilter', 'both')">Desktop + Mobile</button>
                <button type="button" class="${shState.vpFilter === 'desktop' ? 'active' : ''}" onclick="shUpdate('vpFilter', 'desktop')">Chỉ Desktop</button>
                <button type="button" class="${shState.vpFilter === 'mobile' ? 'active' : ''}" onclick="shUpdate('vpFilter', 'mobile')">Chỉ Mobile</button>
              </div>
              <div class="btn-ds-seg">
                <button type="button" class="${shState.groupFilter === 'all' ? 'active' : ''}" onclick="shUpdate('groupFilter', 'all')">Tất cả (6 mẫu)</button>
                <button type="button" class="${shState.groupFilter === 'simple' ? 'active' : ''}" onclick="shUpdate('groupFilter', 'simple')">Không Tabs (1–3)</button>
                <button type="button" class="${shState.groupFilter === 'tabbed' ? 'active' : ''}" onclick="shUpdate('groupFilter', 'tabbed')">Có Tabs (4–6)</button>
              </div>
            </div>
            <span style="font-size:11px; color:var(--text-muted);">Tab đang chọn: <strong>${(SH_TABS_DATA.find(x => x.id === shState.activeTab) || SH_TABS_DATA[0]).label}</strong></span>
          </div>

          <!-- 6 BIẾN THỂ SO SÁNH DESKTOP & MOBILE -->
          ${variants.map(v => renderSectionHeaderVariant(v)).join('')}

          <!-- HƯỚNG DẪN SỬ DỤNG TIẾNG VIỆT -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ Quy chuẩn Responsive Section Headers</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Chuyển Tabs ngang thành Dropdown trên Mobile:</strong> Khi danh sách Tab có từ 4–10 mục (<em>Chi tiết, Hồ sơ, Thanh toán, API...</em>), Desktop hiển thị thanh Tab đầy đủ, còn Mobile bắt buộc thu gọn thành <code>Select Dropdown</code> để tránh cuộn ngang khó bấm.</li>
                <li><strong>Ẩn nút Tertiary vào menu <code>⋮</code> trên Mobile:</strong> Giữ lại tối đa 1 nút <em>Chính (Primary)</em> + 1 nút <em>Phụ (Secondary)</em>; các thao tác thứ cấp và link <em>Tertiary</em> đưa vào icon 3 chấm <code>⋮</code> góc phải trên cùng.</li>
                <li><strong>Badge đếm ngay cạnh Tiêu đề:</strong> Hiển thị số lượng mục (VD: <code>999.000 mục</code>) bằng pill xám nhạt ngang hàng Title để người dùng nắm quy mô dữ liệu trước khi tìm kiếm.</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ Lưu ý Cần Tránh</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li><strong>Không nhồi quá 2–3 nút cùng độ ưu tiên:</strong> Tránh đặt hai nút xanh Primary cạnh nhau; chỉ dùng duy nhất 1 nút Primary đại diện cho hành động chính của phân khu.</li>
                <li><strong>Không kéo dài Mô tả quá 2 dòng:</strong> Mô tả dưới Tiêu đề chỉ nên ngắn gọn 1 dòng trên Desktop; nội dung hướng dẫn dài nên đưa vào Tooltip hoặc Alert riêng.</li>
                <li><strong>Không bỏ sót Search trên Mobile nếu bảng không có nút Filter:</strong> Ở biến thể chỉ có tìm kiếm (Mẫu ② &amp; ⑤), hãy cho ô Search giãn rộng <code>100%</code> xuống dưới mô tả trên màn hình nhỏ.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================
    // 2W. APPLICATION COMPONENT: TABLES ENGINE (T1–T10 SAAS MATRIX)
    // =========================================================================
    const TBL_STORAGE_KEY = 'de_studio_tables_state_v1';
    let tblState = {
      category: 'all',
      zebra: true,
      compact: false,
      showHoverMatrix: true,
      t8Toggles: [true, true, true, true],
      t9Selected: [false, true, false, false],
      lastActionNote: ''
    };
    try {
      const savedTbl = localStorage.getItem(TBL_STORAGE_KEY);
      if (savedTbl) {
        const parsed = JSON.parse(savedTbl);
        if (parsed && typeof parsed === 'object') {
          tblState = Object.assign({}, tblState, parsed);
        }
      }
    } catch (_) {}

    function saveTblState() {
      try { localStorage.setItem(TBL_STORAGE_KEY, JSON.stringify(tblState)); } catch (_) {}
    }

    window.setTablesFilter = function(cat) {
      tblState.category = cat;
      saveTblState();
      renderCanvas();
    };
    window.toggleTablesZebra = function() {
      tblState.zebra = !tblState.zebra;
      saveTblState();
      renderCanvas();
    };
    window.toggleTablesCompact = function() {
      tblState.compact = !tblState.compact;
      saveTblState();
      renderCanvas();
    };
    window.toggleTablesHoverMatrix = function() {
      tblState.showHoverMatrix = !tblState.showHoverMatrix;
      saveTblState();
      renderCanvas();
    };
    window.toggleT8WebhookSwitch = function(idx) {
      tblState.t8Toggles[idx] = !tblState.t8Toggles[idx];
      tblState.lastActionNote = `T8 Webhook row #${idx + 1}: ${tblState.t8Toggles[idx] ? 'Enabled' : 'Paused'}`;
      saveTblState();
      renderCanvas();
    };
    window.toggleT9All = function(checked) {
      tblState.t9Selected = tblState.t9Selected.map(() => !!checked);
      tblState.lastActionNote = checked ? 'T9: Đã chọn toàn bộ 4 thiết bị' : 'T9: Đã bỏ chọn toàn bộ';
      saveTblState();
      renderCanvas();
    };
    window.toggleT9Row = function(idx) {
      tblState.t9Selected[idx] = !tblState.t9Selected[idx];
      const count = tblState.t9Selected.filter(Boolean).length;
      tblState.lastActionNote = `T9: Đang chọn ${count}/4 cấu hình thiết bị`;
      saveTblState();
      renderCanvas();
    };
    window.triggerTableActionDemo = function(label) {
      tblState.lastActionNote = label;
      saveTblState();
      renderCanvas();
    };

    function tblSvg(name) {
      if (name === 'trash') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>';
      if (name === 'edit') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>';
      if (name === 'check') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
      if (name === 'msg') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      if (name === 'reset') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>';
      if (name === 'chev') return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      if (name === 'media') return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><polygon points="10 9 16 12 10 15 10 9"/></svg>';
      return '';
    }

    function buildTablesHTMLSnippet() {
      return `<!-- Design System Tables Blueprint (T1-T10) -->
<div class="tbl-scroll">
  <table class="ds-data-table is-zebra">
    <thead>
      <tr>
        <th>Item ID</th>
        <th>Status</th>
        <th>Timestamp</th>
        <th>History</th>
        <th>Reason</th>
        <th class="is-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="tbl-mono tbl-hover-orange">user_135792468090</td>
        <td><span class="tbl-pill tbl-pill-red">Blocked</span></td>
        <td class="tbl-num">03-07-2025<span class="tbl-sub-txt">10:49:46</span></td>
        <td><span class="tbl-link-under">Details</span></td>
        <td>Exceeded auth threshold</td>
        <td class="is-right">
          <div class="tbl-actions-row">
            <button class="tbl-act-btn tbl-btn-green tbl-flip-solid">Unblock</button>
            <button class="tbl-act-btn tbl-btn-blue tbl-flip-solid">Unblock forever</button>
            <button class="tbl-act-sq is-danger tbl-flip-solid" aria-label="Delete">...</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>`;
    }

    function renderTablesPage() {
      const cat = tblState.category || 'all';
      const tblCls = `ds-data-table${tblState.zebra ? ' is-zebra' : ''}${tblState.compact ? ' is-compact' : ''}`;
      const rowHover = (isActiveRow, isStripe) => {
        const cls = [];
        if (isStripe) cls.push('is-striped-row');
        if (tblState.showHoverMatrix && isActiveRow) cls.push('is-hovered');
        return cls.length ? ` class="${cls.join(' ')}"` : '';
      };

      const showAudit = cat === 'all' || cat === 'audit';
      const showWorkflow = cat === 'all' || cat === 'workflow';
      const showSettings = cat === 'all' || cat === 'settings';

      const t9AllChecked = tblState.t9Selected.every(Boolean);
      const t9Count = tblState.t9Selected.filter(Boolean).length;

      return `
        <div class="tbl-sheet">
          <!-- Interactive Toolbar -->
          <div class="tbl-toolbar">
            <div class="tbl-filter-tabs" role="tablist" aria-label="Lọc nhóm bảng">
              <button type="button" class="tbl-filter-tab ${cat === 'all' ? 'is-active' : ''}" onclick="setTablesFilter('all')">Tất cả (10)</button>
              <button type="button" class="tbl-filter-tab ${cat === 'audit' ? 'is-active' : ''}" onclick="setTablesFilter('audit')">Audit Logs (T1, T3, T5)</button>
              <button type="button" class="tbl-filter-tab ${cat === 'workflow' ? 'is-active' : ''}" onclick="setTablesFilter('workflow')">Workflow (T2, T4, T6)</button>
              <button type="button" class="tbl-filter-tab ${cat === 'settings' ? 'is-active' : ''}" onclick="setTablesFilter('settings')">Settings &amp; Select (T7–T10)</button>
            </div>
            <div class="tbl-controls-right">
              <label class="tbl-ctrl-toggle">
                <input type="checkbox" ${tblState.showHoverMatrix ? 'checked' : ''} onchange="toggleTablesHoverMatrix()">
                <span>Hiển thị ma trận Hover/Active (Figma)</span>
              </label>
              <label class="tbl-ctrl-toggle">
                <input type="checkbox" ${tblState.zebra ? 'checked' : ''} onchange="toggleTablesZebra()">
                <span>Zebra Stripes</span>
              </label>
              <div class="tbl-density-group">
                <button type="button" class="tbl-density-btn ${!tblState.compact ? 'is-active' : ''}" onclick="if(tblState.compact) toggleTablesCompact()">Standard</button>
                <button type="button" class="tbl-density-btn ${tblState.compact ? 'is-active' : ''}" onclick="if(!tblState.compact) toggleTablesCompact()">Compact</button>
              </div>
            </div>
          </div>

          ${tblState.lastActionNote ? `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:9px 14px;border-radius:10px;background:var(--ds-brand-50, #eff4ff);border:1px solid var(--ds-brand-200, #d1e0ff);color:var(--ds-brand-1000, #155eef);font-size:12.5px;font-weight:600;">
              <span>Tương tác trực tiếp: ${tblState.lastActionNote}</span>
              <button type="button" style="border:0;background:transparent;color:var(--ds-brand-1000, #155eef);font-weight:700;cursor:pointer;font-size:12px;" onclick="triggerTableActionDemo('')">Đóng</button>
            </div>
          ` : ''}

          ${showAudit ? `
          <!-- T1: System Config Audit Log -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T1</span>
                  <h3 class="tbl-card-title">System Config Audit Log (5 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Ma trận 4 trạng thái dòng (Default / Focused-Orange / Striped / Striped-Focused). Cột khóa chính (Time) đổi sang màu brand cam <code>--ds-orange-1000</code> khi focus/hover.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Badges: Status 200</span>
                <span class="tbl-meta-chip">Tabular Numerals</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th class="is-center">Action</th>
                    <th class="is-center">User</th>
                    <th class="is-center">Category</th>
                    <th class="is-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${[0, 1, 2, 3].map((i) => `
                    <tr${rowHover(i === 1 || i === 3, i >= 2)}>
                      <td class="tbl-num tbl-primary-txt tbl-hover-orange">03-07-2025 10:49:46</td>
                      <td class="is-center tbl-mono">CONFIG_APP</td>
                      <td class="is-center tbl-mono">7ad805...fc2</td>
                      <td class="is-center">App</td>
                      <td class="is-center"><span class="tbl-pill tbl-pill-green">200</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          ${showWorkflow ? `
          <!-- T2: Review / Comment Timeline -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T2</span>
                  <h3 class="tbl-card-title">Review &amp; Comment Timeline (4 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Nhật ký cập nhật trạng thái xử lý khách hàng với nhãn vuông <code>Doing</code> (Blue) / <code>Waiting</code> (Amber) và nội dung nhấn đậm khi hover.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Squared Status Pills</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Update by</th>
                    <th class="is-center">Status</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { by: 'Olivia Rhye', st: 'Doing', cls: 'tbl-pill-blue', txt: 'Customer agreed to start 14-day Pro trial', hi: false, stripe: false },
                    { by: 'Olivia Rhye', st: 'Doing', cls: 'tbl-pill-blue', txt: 'Customer agreed to start 14-day Pro trial', hi: true, stripe: false },
                    { by: 'Phoenix Baker', st: 'Waiting', cls: 'tbl-pill-amber', txt: 'Waiting for enterprise security sign-off', hi: false, stripe: true },
                    { by: 'Phoenix Baker', st: 'Waiting', cls: 'tbl-pill-amber', txt: 'Waiting for enterprise security sign-off', hi: true, stripe: true }
                  ].map((r) => `
                    <tr${rowHover(r.hi, r.stripe)}>
                      <td class="tbl-num tbl-hover-strong">03-07-2025 10:49:46</td>
                      <td class="tbl-hover-strong">${r.by}</td>
                      <td class="is-center"><span class="tbl-pill tbl-pill-sq ${r.cls}">${r.st}</span></td>
                      <td class="tbl-hover-strong">${r.txt}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          ${showAudit ? `
          <!-- T3: API Delivery Logs -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T3</span>
                  <h3 class="tbl-card-title">API Delivery Logs (8 Columns — Wide Table)</h3>
                </div>
                <p class="tbl-card-sub">Bảng telemetry nhiều cột nằm trong vùng cuộn ngang <code>.tbl-scroll</code> để giữ nguyên khoảng thở cho các mã ID kỹ thuật và lỗi <code>200 / 403</code>.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">8 Columns</span>
                <span class="tbl-meta-chip">Status 200 / 403</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}" style="min-width:860px;">
                <thead>
                  <tr>
                    <th>Delivery date</th>
                    <th class="is-center">Status</th>
                    <th>Message</th>
                    <th>User ID</th>
                    <th>Key ID</th>
                    <th>Device ID</th>
                    <th>Asset ID</th>
                    <th>SDK</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { st: '200', cls: 'tbl-pill-green', msg: '-', sdk: 'Web SDK', hi: false, stripe: false },
                    { st: '200', cls: 'tbl-pill-green', msg: '-', sdk: 'Web SDK', hi: true, stripe: false },
                    { st: '403', cls: 'tbl-pill-red', msg: 'Rate limit exceeded in workspace', sdk: 'iOS SDK', hi: false, stripe: true },
                    { st: '403', cls: 'tbl-pill-red', msg: 'Rate limit exceeded in workspace', sdk: 'iOS SDK', hi: true, stripe: true }
                  ].map((r) => `
                    <tr${rowHover(r.hi, r.stripe)}>
                      <td class="tbl-num tbl-primary-txt tbl-hover-orange">03-07-2025 10:49:46</td>
                      <td class="is-center"><span class="tbl-pill ${r.cls}">${r.st}</span></td>
                      <td class="tbl-hover-strong">${r.msg}</td>
                      <td class="tbl-mono">USR_8942...UID</td>
                      <td class="tbl-mono">9219db...d40</td>
                      <td class="tbl-mono">DEV_f1...439</td>
                      <td class="tbl-mono">333_HD</td>
                      <td>${r.sdk}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          ${showWorkflow ? `
          <!-- T4: Customer / Merchant Review Table -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T4</span>
                  <h3 class="tbl-card-title">Customer / Merchant Onboarding Table (9 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Kết hợp ô 2 dòng (Tên + Email, Công ty + Website, Người cập nhật + Thời gian), nhãn <code>Doing / Done</code> và cụm 3 nút Icon Action vuông.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Multi-line Cells</span>
                <span class="tbl-meta-chip">Icon Action Group</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}" style="min-width:960px;">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company / Website</th>
                    <th>Country</th>
                    <th>Expected volume</th>
                    <th>Note</th>
                    <th>Update by</th>
                    <th>Comment</th>
                    <th class="is-center">Status</th>
                    <th class="is-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { name: 'Olivia Rhye', mail: 'olivia@acme.io', co: 'Acme Corp', web: 'www.acme.io', ctry: 'United States', vol: '1 - 30,000', st: 'Doing', cls: 'tbl-pill-blue', hi: false, stripe: false },
                    { name: 'Olivia Rhye', mail: 'olivia@acme.io', co: 'Acme Corp', web: 'www.acme.io', ctry: 'United States', vol: '1 - 30,000', st: 'Doing', cls: 'tbl-pill-blue', hi: true, stripe: false },
                    { name: 'Lana Steiner', mail: 'lana@nexuscloud.dev', co: 'Nexus Cloud', web: 'nexuscloud.dev', ctry: 'Singapore', vol: '30,000 - 100k', st: 'Done', cls: 'tbl-pill-green', hi: false, stripe: true },
                    { name: 'Lana Steiner', mail: 'lana@nexuscloud.dev', co: 'Nexus Cloud', web: 'nexuscloud.dev', ctry: 'Singapore', vol: '30,000 - 100k', st: 'Done', cls: 'tbl-pill-green', hi: true, stripe: true }
                  ].map((r, idx) => `
                    <tr${rowHover(r.hi, r.stripe)}>
                      <td><span class="tbl-primary-txt tbl-hover-orange">${r.name}</span><span class="tbl-sub-txt">${r.mail}</span></td>
                      <td><span class="tbl-primary-txt">${r.co}</span><span class="tbl-sub-txt">${r.web}</span></td>
                      <td>${r.ctry}</td>
                      <td class="tbl-num">${r.vol}</td>
                      <td>Onboarding test</td>
                      <td><span>Phoenix Baker</span><span class="tbl-sub-txt tbl-num">29-11-2023 15:27:19</span></td>
                      <td>Done</td>
                      <td class="is-center"><span class="tbl-pill tbl-pill-sq ${r.cls}">${r.st}</span></td>
                      <td class="is-right">
                        <div class="tbl-actions-row">
                          <button type="button" class="tbl-act-sq" title="Approve" onclick="triggerTableActionDemo('T4: Approved ${r.name} (#${idx + 1})')">${tblSvg('check')}</button>
                          <button type="button" class="tbl-act-sq" title="Comment" onclick="triggerTableActionDemo('T4: Open review note for ${r.name}')">${tblSvg('msg')}</button>
                          <button type="button" class="tbl-act-sq" title="Reset" onclick="triggerTableActionDemo('T4: Reset review status for ${r.name}')">${tblSvg('reset')}</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          ${showAudit ? `
          <!-- T5: Key Ingestion Log -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T5</span>
                  <h3 class="tbl-card-title">API Key Audit Log Table (6 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Dành cho API log: UUID đầy đủ với monospace, tên sự kiện (<code>CREATE_API_KEY</code> / <code>UPDATE_API_KEY</code>) in đậm và chuyển cam brand khi active.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">UUID Monospace</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls} is-tight-cols">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>Organization</th>
                    <th>Category</th>
                    <th class="is-center">Status code</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { act: 'CREATE_API_KEY', hi: false, stripe: false },
                    { act: 'CREATE_API_KEY', hi: true, stripe: false },
                    { act: 'UPDATE_API_KEY', hi: false, stripe: true },
                    { act: 'UPDATE_API_KEY', hi: true, stripe: true }
                  ].map((r) => `
                    <tr${rowHover(r.hi, r.stripe)}>
                      <td class="tbl-num">03-07-2025 10:49:46</td>
                      <td class="tbl-primary-txt tbl-hover-orange">${r.act}</td>
                      <td class="tbl-mono" style="white-space:nowrap;">7ad80594-48af-46bf-a411-c32265198fc2</td>
                      <td style="white-space:nowrap;">CLOUD STUDIO</td>
                      <td>Assets</td>
                      <td class="is-center"><span class="tbl-pill tbl-pill-green">200</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          ${showWorkflow ? `
          <!-- T6: Security / Moderation Action Table -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T6</span>
                  <h3 class="tbl-card-title">Security &amp; Moderation Action Table (6 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Mẫu đặc trưng từ Figma: ở trạng thái <strong>Default</strong> nút hành động dùng kiểu Outline nhẹ; khi <strong>Hover / Active Row</strong> các nút chuyển sang <strong>Solid Filled</strong> (Green, Brand Blue, Red Trash, Brand Orange) và link <code>Details</code> chuyển màu cam.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Outline &rarr; Solid CTA</span>
                <span class="tbl-meta-chip">Blocked / Unblocked</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls} is-tight-cols">
                <thead>
                  <tr>
                    <th>Item ID</th>
                    <th class="is-center">Status</th>
                    <th>Timestamp</th>
                    <th>History</th>
                    <th>Reason</th>
                    <th class="is-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { id: 'user_135792468090', st: 'Blocked', cls: 'tbl-pill-red', reason: 'Exceeded auth threshold', unblocked: false, hi: false, stripe: false },
                    { id: 'user_135792468090', st: 'Blocked', cls: 'tbl-pill-red', reason: 'Exceeded auth threshold', unblocked: false, hi: true, stripe: false },
                    { id: 'device_135792468090', st: 'Unblocked', cls: 'tbl-pill-green', reason: '-', unblocked: true, hi: false, stripe: true },
                    { id: 'device_135792468090', st: 'Unblocked', cls: 'tbl-pill-green', reason: '-', unblocked: true, hi: true, stripe: true }
                  ].map((r) => `
                    <tr${rowHover(r.hi, r.stripe)}>
                      <td class="tbl-mono tbl-primary-txt tbl-hover-orange">${r.id}</td>
                      <td class="is-center"><span class="tbl-pill ${r.cls}">${r.st}</span></td>
                      <td class="tbl-num">03-07-2025<span class="tbl-sub-txt">10:49:46</span></td>
                      <td><span class="tbl-link-under" onclick="triggerTableActionDemo('T6: Viewing history for ${r.id}')">Details</span></td>
                      <td>${r.reason}</td>
                      <td class="is-right">
                        <div class="tbl-actions-row">
                          ${r.unblocked ? `
                            <button type="button" class="tbl-act-btn tbl-btn-orange tbl-flip-solid" onclick="triggerTableActionDemo('T6: Blocked ${r.id}')">Block</button>
                          ` : `
                            <button type="button" class="tbl-act-btn tbl-btn-green tbl-flip-solid" onclick="triggerTableActionDemo('T6: Unblocked ${r.id}')">Unblock</button>
                            <button type="button" class="tbl-act-btn tbl-btn-blue tbl-flip-solid" onclick="triggerTableActionDemo('T6: Whitelisted ${r.id}')">Unblock forever</button>
                          `}
                          <button type="button" class="tbl-act-sq is-danger tbl-flip-solid" title="Remove rule" onclick="triggerTableActionDemo('T6: Deleted rule ${r.id}')">${tblSvg('trash')}</button>
                        </div>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          ${showSettings ? `
          <!-- T7: Processing Jobs Table -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T7</span>
                  <h3 class="tbl-card-title">Processing Jobs / Media Pipeline Table (4 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Ô thumbnail kèm tiêu đề 2 dòng, badge <code>Processing</code> (Green), thời gian bắt đầu–kết thúc 2 dòng và mũi tên drill-down bên phải.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Media Row + Drill Chevron</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}">
                <thead>
                  <tr>
                    <th>Content</th>
                    <th class="is-center">Status</th>
                    <th>Start - End</th>
                    <th class="is-right" style="width:48px;"></th>
                  </tr>
                </thead>
                <tbody>
                  ${[0, 1, 2, 3].map((i) => `
                    <tr${rowHover(i === 1 || i === 3, i >= 2)}>
                      <td>
                        <div class="tbl-job-cell">
                          <span class="tbl-job-thumb">${tblSvg('media')}</span>
                          <div>
                            <span class="tbl-primary-txt tbl-hover-orange">4K Video Transcode #${i + 1}</span>
                            <span class="tbl-sub-txt tbl-mono">ID1357924680</span>
                          </div>
                        </div>
                      </td>
                      <td class="is-center"><span class="tbl-pill tbl-pill-green">Processing</span></td>
                      <td class="tbl-num">03-07-2025 10:49:46<span class="tbl-sub-txt">03-07-2025 10:58:12</span></td>
                      <td class="is-right">
                        <button type="button" class="tbl-chev-btn" aria-label="View job details" onclick="triggerTableActionDemo('T7: Inspecting encode job #${i + 1}')">${tblSvg('chev')}</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- T8: Webhook / Alert Service Table -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T8</span>
                  <h3 class="tbl-card-title">Webhook &amp; Alert Integrations (Live Toggle Switches)</h3>
                </div>
                <p class="tbl-card-sub">Tái sử dụng component <code>Toggles</code> (<code>.ds-tg-control.is-sm</code>) ngay trong cột Status — bạn có thể bấm bật/tắt trực tiếp từng kênh thông báo.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Interactive Toggle</span>
                <span class="tbl-meta-chip">Telegram / Email</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Details</th>
                    <th>Created at</th>
                    <th class="is-center">Status</th>
                    <th class="is-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { svc: 'Telegram', line1: 'Bot API token: *****85213', line2: 'ChatID: 468', hi: false, stripe: false },
                    { svc: 'Telegram', line1: 'Bot API token: *****85213', line2: 'ChatID: 468', hi: true, stripe: false },
                    { svc: 'Email', line1: 'SMTP: alerts@acme-demo.io', line2: 'Recipients: sec-ops@acme.io', hi: false, stripe: true },
                    { svc: 'Email', line1: 'SMTP: alerts@acme-demo.io', line2: 'Recipients: sec-ops@acme.io', hi: true, stripe: true }
                  ].map((r, idx) => {
                    const isOn = !!tblState.t8Toggles[idx];
                    return `
                      <tr${rowHover(r.hi, r.stripe)}>
                        <td class="tbl-primary-txt tbl-hover-orange">${r.svc}</td>
                        <td><span>${r.line1}</span><span class="tbl-sub-txt">${r.line2}</span></td>
                        <td class="tbl-num">03-07-2025 10:49:46</td>
                        <td class="is-center">
                          <button type="button" class="ds-tg-control is-sm ${isOn ? 'is-on' : ''}" role="switch" aria-checked="${isOn}" aria-label="Toggle ${r.svc} row ${idx + 1}" onclick="toggleT8WebhookSwitch(${idx})">
                            <span class="ds-tg-track"><span class="ds-tg-thumb"></span></span>
                          </button>
                        </td>
                        <td class="is-right">
                          <button type="button" class="tbl-act-sq is-danger tbl-flip-solid" title="Delete integration" onclick="triggerTableActionDemo('T8: Delete ${r.svc} webhook #${idx + 1}')">${tblSvg('trash')}</button>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- T9: Multi-Select Device Profiles -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T9</span>
                  <h3 class="tbl-card-title">Multi-Select Device Profiles (Checkboxes + Batch State)</h3>
                </div>
                <p class="tbl-card-sub">Sử dụng Checkbox hàng loạt (Header Select-All + Row Selection). Thử tick vào ô chọn để xem trạng thái nền <code>#F5F8FF</code>.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Đã chọn: ${t9Count}/4</span>
                <span class="tbl-meta-chip">Edit + Delete Actions</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}">
                <thead>
                  <tr>
                    <th style="width:44px;" class="is-center">
                      <input type="checkbox" aria-label="Select all devices" ${t9AllChecked ? 'checked' : ''} onchange="toggleT9All(this.checked)" style="width:15px;height:15px;accent-color:#155eef;cursor:pointer;">
                    </th>
                    <th>Platform</th>
                    <th>Manufacture</th>
                    <th>Model name</th>
                    <th class="is-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { plat: 'macOS', mfg: 'Apple Inc.', model: 'MacBook Pro M3 Max', hi: false, stripe: false },
                    { plat: 'macOS', mfg: 'Apple Inc.', model: 'MacBook Air M2', hi: true, stripe: false },
                    { plat: 'iOS', mfg: 'Apple Inc.', model: 'iPhone 15 Pro', hi: false, stripe: true },
                    { plat: 'Android', mfg: 'Samsung Corp', model: 'Galaxy S24 Ultra', hi: true, stripe: true }
                  ].map((r, idx) => {
                    const checked = !!tblState.t9Selected[idx];
                    const cls = [];
                    if (r.stripe) cls.push('is-striped-row');
                    if (tblState.showHoverMatrix && r.hi) cls.push('is-hovered');
                    if (checked) cls.push('is-selected-row');
                    return `
                      <tr class="${cls.join(' ')}">
                        <td class="is-center">
                          <input type="checkbox" aria-label="Select ${r.model}" ${checked ? 'checked' : ''} onchange="toggleT9Row(${idx})" style="width:15px;height:15px;accent-color:#155eef;cursor:pointer;">
                        </td>
                        <td class="tbl-primary-txt tbl-hover-orange">${r.plat}</td>
                        <td>${r.mfg}</td>
                        <td>${r.model}</td>
                        <td class="is-right">
                          <div class="tbl-actions-row">
                            <button type="button" class="tbl-act-sq" title="Edit profile" onclick="triggerTableActionDemo('T9: Editing ${r.model}')">${tblSvg('edit')}</button>
                            <button type="button" class="tbl-act-sq is-danger tbl-flip-solid" title="Delete profile" onclick="triggerTableActionDemo('T9: Deleted ${r.model}')">${tblSvg('trash')}</button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- T10: Compact Policy / Rules Table -->
          <div class="tbl-card">
            <div class="tbl-card-head">
              <div>
                <div class="tbl-card-title-row">
                  <span class="tbl-card-badge">T10</span>
                  <h3 class="tbl-card-title">Compact Policy &amp; Rule List (4 Columns)</h3>
                </div>
                <p class="tbl-card-sub">Dạng bảng gọn nhẹ gồm tiêu đề ngắn, mô tả quy tắc, thời điểm tạo và nút xóa đơn lẻ.</p>
              </div>
              <div class="tbl-card-meta">
                <span class="tbl-meta-chip">Policy Rules</span>
              </div>
            </div>
            <div class="tbl-scroll">
              <table class="${tblCls}">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Full description</th>
                    <th>Created at</th>
                    <th class="is-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${[
                    { title: 'Geo-Fence APAC', desc: 'Restrict HD playback to approved APAC territories', hi: false, stripe: false },
                    { title: 'Geo-Fence APAC', desc: 'Restrict HD playback to approved APAC territories', hi: true, stripe: false },
                    { title: 'Two-Factor Auth', desc: 'Require 2FA verification for all workspace admin accounts', hi: false, stripe: true },
                    { title: 'Concurrent Limit', desc: 'Limit active simultaneous streams to 3 per account', hi: true, stripe: true }
                  ].map((r, idx) => `
                    <tr${rowHover(r.hi, r.stripe)}>
                      <td class="tbl-primary-txt tbl-hover-orange">${r.title}</td>
                      <td>${r.desc}</td>
                      <td class="tbl-num">03-07-2025 10:49:46</td>
                      <td class="is-right">
                        <button type="button" class="tbl-act-sq is-danger tbl-flip-solid" title="Delete rule" onclick="triggerTableActionDemo('T10: Removed rule ${r.title}')">${tblSvg('trash')}</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
          ` : ''}

          <!-- Usage Guidelines -->
          <div class="tbl-guide-grid">
            <div class="tbl-guide-card is-do">
              <div class="tbl-guide-head">Nên làm (Best Practices)</div>
              <ul class="tbl-guide-list">
                <li>Dùng <code>font-variant-numeric: tabular-nums</code> cho toàn bộ cột thời gian, số đếm và HTTP status code để các hàng thẳng cột theo chiều dọc.</li>
                <li>Với các bảng nhiều cột (như <strong>T3 API Logs 8 cột</strong> hoặc <strong>T4 Merchant 9 cột</strong>), bọc trong <code>.tbl-scroll</code> có cuộn ngang thay vì ép chữ rớt dòng nhiều tầng.</li>
                <li>Trên các bảng hành động nhạy cảm (<strong>T6</strong>), giữ nút ở trạng thái Outline nhẹ khi nghỉ và chuyển sang Solid Filled khi hover/focus đúng dòng đang thao tác.</li>
                <li>Chỉ tô màu nhấn cam <code>--ds-orange-1000</code> cho 1 cột khóa chính (ID hoặc Time) khi hover để định hướng mắt người dùng.</li>
              </ul>
            </div>
            <div class="tbl-guide-card is-dont">
              <div class="tbl-guide-head">Cần tránh (Pitfalls)</div>
              <ul class="tbl-guide-list">
                <li>Không dùng quá nhiều nút Solid màu chói ở mọi dòng cùng lúc vì sẽ gây nhiễu thị giác và dễ bấm nhầm nút nguy hiểm.</li>
                <li>Tránh hiển thị dữ liệu giả vô nghĩa (ví dụ chuỗi ký tự lặp) trong spec; luôn dùng dữ liệu mẫu sát ngữ cảnh giúp QA kiểm tra độ rộng cột thực tế.</li>
                <li>Không đặt quá 3 nút hành động icon cạnh nhau không có tooltip <code>title</code> / <code>aria-label</code> rõ ràng.</li>
                <li>Không trộn lẫn hai kiểu căn lề ngẫu nhiên cho dữ liệu số và ngày tháng giữa các dòng trong cùng một bảng.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================

    // 2Y. HEADER NAVIGATION ENGINE (3 BREAKPOINTS: MOBILE <=600 | TABLET 601-1023 | DESKTOP >=1024)
    // =========================================================================
    const HN_STORAGE_KEY = 'de_studio_header_nav_state_v1';
    let hnState = {
      viewport: 'desktop-multi', // 'mobile-xs' | 'mobile-md' | 'mobile-lg' | 'tablet' | 'desktop-compact' | 'desktop-multi'
      searchFocused: false,
      filterDrawerOpen: true,
      searchQuery: '',
      activeChip: 0,
      lastToast: ''
    };
    try {
      const savedHn = localStorage.getItem(HN_STORAGE_KEY);
      if (savedHn) {
        const p = JSON.parse(savedHn);
        if (p && typeof p === 'object') {
          if (p.viewport === 'tablet-sm') p.viewport = 'mobile-lg';
          if (p.viewport === 'tablet-lg') p.viewport = 'tablet';
          hnState = Object.assign({}, hnState, p);
        }
      }
    } catch (_) {}

    function saveHnState() {
      try { localStorage.setItem(HN_STORAGE_KEY, JSON.stringify(hnState)); } catch (_) {}
    }

    window.setHnViewport = function(vp) { hnState.viewport = vp; saveHnState(); renderCanvas(); };
    window.toggleHnSearchFocus = function() { hnState.searchFocused = !hnState.searchFocused; saveHnState(); renderCanvas(); };
    window.toggleHnFilterDrawer = function() { hnState.filterDrawerOpen = !hnState.filterDrawerOpen; saveHnState(); renderCanvas(); };
    window.setHnQuery = function(v) { hnState.searchQuery = v; saveHnState(); };
    window.selectHnChip = function(idx) {
      hnState.activeChip = idx;
      hnState.lastToast = `Đã chọn bộ lọc #${idx + 1}`;
      saveHnState();
      renderCanvas();
    };
    window.resetHnPlayground = function() {
      hnState.searchQuery = '';
      hnState.searchFocused = false;
      hnState.activeChip = -1;
      hnState.lastToast = 'Đã đặt lại toàn bộ bộ lọc & từ khóa tìm kiếm';
      saveHnState();
      renderCanvas();
    };
    window.triggerHnAction = function(msg) {
      hnState.lastToast = msg;
      saveHnState();
      renderCanvas();
    };

    function hnSvg(name) {
      if (name === 'menu') return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
      if (name === 'search') return '<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
      if (name === 'sliders') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>';
      if (name === 'funnel') return '<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>';
      if (name === 'bell') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>';
      if (name === 'more') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>';
      if (name === 'plus') return '<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
      if (name === 'back') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>';
      if (name === 'close') return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      if (name === 'chev') return '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>';
      return '';
    }

    function hnChip(label, isSelected) {
      return `<span class="hn-filter-chip ${isSelected ? 'is-selected' : ''}">${label}${hnSvg('chev')}</span>`;
    }

    function buildHeaderNavigationHTMLSnippet() {
      return `<!-- Page Header Navigation (Desktop Search + Inline Filters + Primary CTA) -->
<header class="hn-frame">
  <div class="hn-bar-row">
    <div class="hn-left">
      <button class="hn-icon-ghost" aria-label="Menu">...</button>
      <span class="hn-page-title">Project Overview</span>
    </div>
    <div class="hn-mid">
      <div class="hn-search-input">
        <input type="text" placeholder="Search projects, users or logs..." />
      </div>
      <button class="hn-icon-box" aria-label="Filters">...</button>
    </div>
    <div class="hn-right">
      <button class="hn-icon-ghost" aria-label="Notifications">...</button>
      <button class="hn-cta-pill">+ Create Policy</button>
      <button class="hn-icon-ghost" aria-label="More actions">...</button>
    </div>
  </div>
</header>`;
    }

    function renderHeaderNavigationPage() {
      const vp = hnState.viewport || 'desktop-multi';
      const frameMax =
        vp === 'mobile-xs' ? '275px' :
        vp === 'mobile-md' ? '360px' :
        vp === 'mobile-lg' ? '490px' :
        vp === 'tablet' ? '610px' : '100%';
      const isMobile = vp === 'mobile-xs' || vp === 'mobile-md' || vp === 'mobile-lg';
      const isTablet = vp === 'tablet';
      const chips = ['Status: Active', 'Plan: Pro', 'Region: APAC', 'Role: Admin'];

      return `
        <div class="hn-sheet">
          <!-- Interactive Playground Sandbox -->
          <div class="hn-card">
            <div class="hn-card-head">
              <div>
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  <span class="hn-badge">PLAYGROUND</span>
                  <h3 class="hn-title">Header Navigation Responsive Simulator</h3>
                </div>
                <p class="hn-sub">Thử chuyển 3 ngưỡng chuẩn (<strong>Mobile &le; 600px</strong> &rarr; <strong>Tablet 601–1023px</strong> &rarr; <strong>Desktop &ge; 1024px</strong>), bật Focus ô tìm kiếm hoặc mở khay Filter Drawer.</p>
              </div>
              <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <button type="button" class="tbl-density-btn ${hnState.searchFocused ? 'is-active' : ''}" style="border:1px solid #d0d5dd;border-radius:7px;" onclick="toggleHnSearchFocus()">Search Focus</button>
                <button type="button" class="tbl-density-btn ${hnState.filterDrawerOpen ? 'is-active' : ''}" style="border:1px solid #d0d5dd;border-radius:7px;" onclick="toggleHnFilterDrawer()">Filter Drawer</button>
                <button type="button" class="tbl-density-btn" style="border:1px solid #d0d5dd;border-radius:7px;" onclick="resetHnPlayground()">Reset</button>
              </div>
            </div>

            <div class="tbl-filter-tabs" style="margin-bottom:14px;">
              ${[
                { id: 'mobile-xs', lbl: 'Mobile 320 (≤600)' },
                { id: 'mobile-md', lbl: 'Mobile 375 (≤600)' },
                { id: 'mobile-lg', lbl: 'Mobile 480 (≤600)' },
                { id: 'tablet', lbl: 'Tablet (601–1023)' },
                { id: 'desktop-compact', lbl: 'Desktop Compact (≥1024)' },
                { id: 'desktop-multi', lbl: 'Desktop Multi-Filter (≥1024)' }
              ].map((b) => `<button type="button" class="tbl-filter-tab ${vp === b.id ? 'is-active' : ''}" onclick="setHnViewport('${b.id}')">${b.lbl}</button>`).join('')}
            </div>

            ${hnState.lastToast ? `
              <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 12px;margin-bottom:12px;border-radius:8px;background:var(--ds-brand-50, #eff4ff);border:1px solid var(--ds-brand-200, #d1e0ff);color:var(--ds-brand-1000, #155eef);font-size:12px;font-weight:600;">
                <span>${hnState.lastToast}</span>
                <button type="button" style="border:0;background:transparent;color:var(--ds-brand-1000, #155eef);font-weight:700;cursor:pointer;" onclick="triggerHnAction('')">Đóng</button>
              </div>
            ` : ''}

            <div class="hn-stack">
              <div class="hn-frame" style="max-width:${frameMax};width:100%;">
                <div class="hn-bar-row">
                  <div class="hn-left">
                    <button type="button" class="hn-icon-ghost" onclick="triggerHnAction('Mở Navigation Sidebar')" title="Toggle menu">${hnSvg('menu')}</button>
                    ${vp !== 'mobile-xs' ? '<span class="hn-page-title">Title</span>' : ''}
                  </div>
                  ${!isMobile && !isTablet ? `
                    <div class="hn-mid">
                      ${vp === 'desktop-multi' ? `<button type="button" class="hn-filter-chip ${hnState.activeChip === 0 ? 'is-selected' : ''}" onclick="selectHnChip(0)">${chips[0]}${hnSvg('chev')}</button>` : ''}
                      <div class="hn-search-input ${hnState.searchFocused ? 'is-focused' : ''}">
                        ${hnSvg('search')}
                        <input type="text" value="${escapeHTML(hnState.searchQuery)}" placeholder="Search..." oninput="setHnQuery(this.value)" onfocus="if(!hnState.searchFocused) toggleHnSearchFocus()" />
                      </div>
                      ${vp === 'desktop-multi' ? `
                        <button type="button" class="hn-filter-chip ${hnState.activeChip === 1 ? 'is-selected' : ''}" onclick="selectHnChip(1)">${chips[1]}${hnSvg('chev')}</button>
                        <button type="button" class="hn-icon-box ${hnState.filterDrawerOpen ? 'is-active' : ''}" onclick="toggleHnFilterDrawer()" title="More filters">${hnSvg('sliders')}</button>
                      ` : `
                        <button type="button" class="hn-icon-box ${hnState.filterDrawerOpen ? 'is-active' : ''}" onclick="toggleHnFilterDrawer()" title="Filter drawer">${hnSvg('sliders')}</button>
                      `}
                    </div>
                  ` : ''}
                  <div class="hn-right">
                    ${(isMobile || isTablet) ? `<button type="button" class="hn-icon-ghost" onclick="toggleHnSearchFocus()" title="Search">${hnSvg('search')}</button>` : ''}
                    ${(isMobile || isTablet) ? `<button type="button" class="hn-icon-ghost" onclick="toggleHnFilterDrawer()" title="Filter">${hnSvg('funnel')}</button>` : `<button type="button" class="hn-icon-ghost" onclick="triggerHnAction('Đã mở Notification Center')" title="Notifications">${hnSvg('bell')}</button>`}
                    ${(isMobile || isTablet) ? `<button type="button" class="hn-cta-sq" onclick="triggerHnAction('Tạo mục mới (+ CTA)')" title="Add new">${hnSvg('plus')}</button>` : `<button type="button" class="hn-cta-pill" onclick="triggerHnAction('Đã bấm + Button CTA')">${hnSvg('plus')} Button CTA</button>`}
                    <button type="button" class="hn-icon-ghost" onclick="triggerHnAction('Mở Overflow Actions ⋮')" title="More">${hnSvg('more')}</button>
                  </div>
                </div>
                ${(isMobile || isTablet) && hnState.searchFocused ? `
                  <div class="hn-bar-row" style="border-top:1px solid #f2f4f7;padding-top:8px;">
                    <button type="button" class="hn-icon-ghost" onclick="toggleHnSearchFocus()" title="Close search">${hnSvg('close')}</button>
                    <div class="hn-search-input is-focused">${hnSvg('search')}<input type="text" value="${escapeHTML(hnState.searchQuery)}" placeholder="Search..." oninput="setHnQuery(this.value)" /></div>
                    <button type="button" class="hn-icon-box ${hnState.filterDrawerOpen ? 'is-active' : ''}" onclick="toggleHnFilterDrawer()">${hnSvg('sliders')}</button>
                  </div>
                ` : ''}
                ${hnState.filterDrawerOpen ? `
                  <div class="hn-drawer-row">
                    <span class="hn-icon-box" style="width:26px;height:26px;">${hnSvg('funnel')}</span>
                    ${chips.map((c, idx) => `<button type="button" class="hn-filter-chip ${hnState.activeChip === idx ? 'is-selected' : ''}" onclick="selectHnChip(${idx})">${c}${hnSvg('chev')}</button>`).join('')}
                    <button type="button" style="margin-left:auto;border:0;background:transparent;color:#667085;font-size:11.5px;font-weight:600;cursor:pointer;" onclick="resetHnPlayground()">Reset</button>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- 6 Figma Responsive Variants Showcase -->
          <div class="hn-preview-grid">
            <!-- V1: Mobile 320px -->
            <div class="hn-card">
              <div class="hn-card-head">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;"><span class="hn-badge">V1</span><h3 class="hn-title">Mobile Compact (≤ 600px • 320px)</h3></div>
                  <p class="hn-sub">Thu gọn Title ở trạng thái nghỉ, mở thanh Search Focus toàn chiều rộng khi bấm tìm kiếm.</p>
                </div>
              </div>
              <div class="hn-stack">
                <div class="hn-state-tag">Default Resting</div>
                <div class="hn-frame is-mobile-xs">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('search')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                </div>
                <div class="hn-state-tag">Search Focused</div>
                <div class="hn-frame is-mobile-xs">
                  <div class="hn-bar-row">
                    <span class="hn-icon-ghost">${hnSvg('back')}</span>
                    <div class="hn-search-input is-focused">${hnSvg('search')}<span>|</span></div>
                    <span class="hn-icon-box">${hnSvg('sliders')}</span>
                  </div>
                </div>
                <div class="hn-state-tag">Filter Trigger Active</div>
                <div class="hn-frame is-mobile-xs">
                  <div class="hn-bar-row">
                    <span class="hn-icon-ghost">${hnSvg('close')}</span>
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                    <span class="hn-icon-box is-active">${hnSvg('sliders')}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- V2: Mobile 375px + Title & Filter Chips -->
            <div class="hn-card">
              <div class="hn-card-head">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;"><span class="hn-badge">V2</span><h3 class="hn-title">Mobile Standard w/ Filter Tray (≤ 600px • 375px)</h3></div>
                  <p class="hn-sub">Giữ Page Title kèm nút Filter Funnel, mở khay <code>Filter type</code> và cụm Search + <code>Reset</code> bên dưới.</p>
                </div>
              </div>
              <div class="hn-stack">
                <div class="hn-state-tag">Default</div>
                <div class="hn-frame is-mobile-md">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('funnel')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                </div>
                <div class="hn-state-tag">Filter Tray Expanded</div>
                <div class="hn-frame is-mobile-md">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('funnel')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                  <div class="hn-drawer-row">
                    <span class="hn-icon-box" style="width:26px;height:26px;">${hnSvg('funnel')}</span>
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                  </div>
                </div>
                <div class="hn-state-tag">Search + Multi-Filter + Reset</div>
                <div class="hn-frame is-mobile-md">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('funnel')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                  <div class="hn-drawer-row" style="justify-content:space-between;">
                    <div class="hn-search-input" style="max-width:210px;">${hnSvg('search')}<span>Search</span></div>
                    <span style="font-size:11.5px;color:#667085;font-weight:600;">Reset</span>
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                  </div>
                </div>
              </div>
            </div>

            <!-- V3: Mobile Landscape 480px -->
            <div class="hn-card">
              <div class="hn-card-head">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;"><span class="hn-badge">V3</span><h3 class="hn-title">Mobile Landscape / Split Bar (≤ 600px • 480px)</h3></div>
                  <p class="hn-sub">Chuyển sang thanh tìm kiếm ngang kéo dài ở chế độ focus, hỗ trợ hàng chip ngang dưới search bar.</p>
                </div>
              </div>
              <div class="hn-stack">
                <div class="hn-state-tag">Default</div>
                <div class="hn-frame is-tablet-sm">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('search')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                </div>
                <div class="hn-state-tag">Full-Width Search Focus</div>
                <div class="hn-frame is-tablet-sm">
                  <div class="hn-bar-row">
                    <span class="hn-icon-ghost">${hnSvg('close')}</span>
                    <div class="hn-search-input is-focused">${hnSvg('search')}<span>|</span></div>
                    <span class="hn-icon-box">${hnSvg('sliders')}</span>
                  </div>
                </div>
                <div class="hn-state-tag">Search + Filter Chip Strip</div>
                <div class="hn-frame is-tablet-sm">
                  <div class="hn-bar-row">
                    <span class="hn-icon-ghost">${hnSvg('close')}</span>
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                    <span class="hn-icon-box is-active">${hnSvg('sliders')}</span>
                  </div>
                  <div class="hn-drawer-row">
                    ${hnChip('Filter type', false)}
                    ${hnChip('Select...', false)}
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                  </div>
                </div>
              </div>
            </div>

            <!-- V4: Tablet 768px -->
            <div class="hn-card">
              <div class="hn-card-head">
                <div>
                  <div style="display:flex;align-items:center;gap:8px;"><span class="hn-badge">V4</span><h3 class="hn-title">Tablet Header &amp; Full Filter Strip (601px–1023px)</h3></div>
                  <p class="hn-sub">Không gian rộng hơn cho 5 filter chips trên cùng 1 hàng và cụm Search + Reset tách rõ.</p>
                </div>
              </div>
              <div class="hn-stack">
                <div class="hn-state-tag">Default</div>
                <div class="hn-frame is-tablet-lg">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('funnel')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                </div>
                <div class="hn-state-tag">Filter Tray Open</div>
                <div class="hn-frame is-tablet-lg">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('funnel')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                  <div class="hn-drawer-row">
                    <span class="hn-icon-box" style="width:26px;height:26px;">${hnSvg('funnel')}</span>
                    ${hnChip('Filter type', false)}${hnChip('Filter type', false)}${hnChip('Filter type', false)}${hnChip('Filter type', false)}
                  </div>
                </div>
                <div class="hn-state-tag">Search + Reset + Multi-Chip Row</div>
                <div class="hn-frame is-tablet-lg">
                  <div class="hn-bar-row">
                    <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                    <div class="hn-right"><span class="hn-icon-ghost">${hnSvg('funnel')}</span><span class="hn-cta-sq">${hnSvg('plus')}</span><span class="hn-icon-ghost">${hnSvg('more')}</span></div>
                  </div>
                  <div class="hn-drawer-row">
                    <div class="hn-search-input" style="max-width:220px;">${hnSvg('search')}<span>Search</span></div>
                    <span style="font-size:11.5px;color:#667085;font-weight:600;">Reset</span>
                  </div>
                  <div style="display:flex;gap:8px;flex-wrap:wrap;">
                    ${hnChip('Filter type', false)}${hnChip('Filter type', false)}${hnChip('Filter type', false)}${hnChip('Filter type', false)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- V5: Desktop Compact Search + Labeled Advanced Filters (Full Width Card) -->
          <div class="hn-card">
            <div class="hn-card-head">
              <div>
                <div style="display:flex;align-items:center;gap:8px;"><span class="hn-badge">V5</span><h3 class="hn-title">Desktop Search + Primary CTA + Advanced Filter Grid (≥ 1024px)</h3></div>
                <p class="hn-sub">Search bar đặt ngay cạnh Title cùng nút Filter, Bell Notification và nút <code>+ Button CTA</code> đầy đủ. Khi mở bộ lọc nâng cao sẽ hiển thị lưới form có nhãn bắt buộc (<code>Input search *</code> &amp; <code>Select search *</code>).</p>
              </div>
            </div>
            <div class="hn-stack">
              <div class="hn-state-tag">Default Bar</div>
              <div class="hn-frame">
                <div class="hn-bar-row">
                  <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                  <div class="hn-mid">
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                    <span class="hn-icon-box">${hnSvg('sliders')}</span>
                  </div>
                  <div class="hn-right">
                    <span class="hn-icon-ghost">${hnSvg('bell')}</span>
                    <button type="button" class="hn-cta-pill">${hnSvg('plus')} Button CTA</button>
                    <span class="hn-icon-ghost">${hnSvg('more')}</span>
                  </div>
                </div>
              </div>

              <div class="hn-state-tag">Search Input Focused</div>
              <div class="hn-frame">
                <div class="hn-bar-row">
                  <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                  <div class="hn-mid">
                    <div class="hn-search-input is-focused">${hnSvg('search')}<span>|</span></div>
                    <span class="hn-icon-box">${hnSvg('sliders')}</span>
                  </div>
                  <div class="hn-right">
                    <span class="hn-icon-ghost">${hnSvg('bell')}</span>
                    <button type="button" class="hn-cta-pill">${hnSvg('plus')} Button CTA</button>
                    <span class="hn-icon-ghost">${hnSvg('more')}</span>
                  </div>
                </div>
              </div>

              <div class="hn-state-tag">Advanced Labeled Filter Panel Expanded</div>
              <div class="hn-frame">
                <div class="hn-bar-row">
                  <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                  <div class="hn-mid">
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                    <span class="hn-icon-box is-active">${hnSvg('sliders')}</span>
                  </div>
                  <div class="hn-right">
                    <span class="hn-icon-ghost">${hnSvg('bell')}</span>
                    <button type="button" class="hn-cta-pill">${hnSvg('plus')} Button CTA</button>
                    <span class="hn-icon-ghost">${hnSvg('more')}</span>
                  </div>
                </div>
                <div class="hn-adv-grid">
                  <div class="hn-adv-field">
                    <div class="hn-adv-lbl">Input search <span>*</span></div>
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                  </div>
                  <div class="hn-adv-field">
                    <div class="hn-adv-lbl">Select search <span>*</span></div>
                    <span class="hn-filter-chip" style="justify-content:space-between;height:30px;">Filter type${hnSvg('chev')}</span>
                  </div>
                  <div class="hn-adv-field">
                    <div class="hn-adv-lbl">Select search <span>*</span></div>
                    <span class="hn-filter-chip" style="justify-content:space-between;height:30px;">Filter type${hnSvg('chev')}</span>
                  </div>
                  <div class="hn-adv-field">
                    <div class="hn-adv-lbl">Select search <span>*</span></div>
                    <span class="hn-filter-chip" style="justify-content:space-between;height:30px;">Filter type${hnSvg('chev')}</span>
                  </div>
                  <div class="hn-adv-field">
                    <div class="hn-adv-lbl">Select search <span>*</span></div>
                    <span class="hn-filter-chip" style="justify-content:space-between;height:30px;">Filter type${hnSvg('chev')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- V6: Desktop Inline Multi-Filter Header (Full Width Card) -->
          <div class="hn-card">
            <div class="hn-card-head">
              <div>
                <div style="display:flex;align-items:center;gap:8px;"><span class="hn-badge">V6</span><h3 class="hn-title">Desktop Inline Multi-Filter Bar (≥ 1024px)</h3></div>
                <p class="hn-sub">Đưa trực tiếp các dropdown lọc nhanh (<code>Filter type</code>) nằm ngang cạnh ô Search ngay trên thanh Header chính cho các màn hình vận hành tần suất cao.</p>
              </div>
            </div>
            <div class="hn-stack">
              <div class="hn-state-tag">Inline Filter + Search (Default)</div>
              <div class="hn-frame">
                <div class="hn-bar-row">
                  <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                  <div class="hn-mid">
                    ${hnChip('Filter type', false)}
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                  </div>
                  <div class="hn-right">
                    <span class="hn-icon-ghost">${hnSvg('bell')}</span>
                    <button type="button" class="hn-cta-pill">${hnSvg('plus')} Button CTA</button>
                    <span class="hn-icon-ghost">${hnSvg('more')}</span>
                  </div>
                </div>
              </div>

              <div class="hn-state-tag">Search-First Focused State</div>
              <div class="hn-frame">
                <div class="hn-bar-row">
                  <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                  <div class="hn-mid">
                    <div class="hn-search-input is-focused">${hnSvg('search')}<span>|</span></div>
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                    ${hnChip('Filter type', false)}
                  </div>
                  <div class="hn-right">
                    <span class="hn-icon-ghost">${hnSvg('bell')}</span>
                    <button type="button" class="hn-cta-pill">${hnSvg('plus')} Button CTA</button>
                    <span class="hn-icon-ghost">${hnSvg('more')}</span>
                  </div>
                </div>
              </div>

              <div class="hn-state-tag">Balanced Inline Preset</div>
              <div class="hn-frame">
                <div class="hn-bar-row">
                  <div class="hn-left"><span class="hn-icon-ghost">${hnSvg('menu')}</span><span class="hn-page-title">Title</span></div>
                  <div class="hn-mid">
                    ${hnChip('Filter type', false)}
                    <div class="hn-search-input">${hnSvg('search')}<span>Search</span></div>
                    ${hnChip('Filter type', false)}
                  </div>
                  <div class="hn-right">
                    <span class="hn-icon-ghost">${hnSvg('bell')}</span>
                    <button type="button" class="hn-cta-pill">${hnSvg('plus')} Button CTA</button>
                    <span class="hn-icon-ghost">${hnSvg('more')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Usage Guidelines -->
          <div class="tbl-guide-grid">
            <div class="tbl-guide-card is-do">
              <div class="tbl-guide-head">Nên làm (Best Practices)</div>
              <ul class="tbl-guide-list">
                <li>Áp dụng co giãn lũy tiến theo màn hình: trên Desktop hiện đầy đủ nút <code>+ Button CTA</code> và inline filters (<strong>V5–V6</strong>); trên Mobile/Tablet thu gọn thành nút vuông xanh <code>[+]</code> và đẩy filters xuống khay <code>.hn-drawer-row</code> (<strong>V1–V4</strong>).</li>
                <li>Giữ chiều cao đồng nhất <code>30px</code> (compact) cho toàn bộ ô Search, nút Icon Box, Filter Chip và nút CTA để thanh Header luôn thẳng hàng ngang.</li>
                <li>Khi mở khay bộ lọc nâng cao nhiều điều kiện, luôn cung cấp nút <strong>Reset</strong> rõ ràng ngay cạnh cụm filter.</li>
                <li>Sử dụng vòng sáng focus xanh <code>rgba(46, 144, 250, 0.18)</code> cho ô Search đang gõ trên cả Mobile và Desktop.</li>
              </ul>
            </div>
            <div class="tbl-guide-card is-dont">
              <div class="tbl-guide-head">Cần tránh (Pitfalls)</div>
              <ul class="tbl-guide-list">
                <li>Không ép 4–5 dropdown filter đứng trên cùng 1 hàng ở độ rộng Mobile &amp; Tablet (&le; 1023px) gây bóp nghẹt tiêu đề trang.</li>
                <li>Tránh đặt nhiều hơn một nút Primary solid Brand Blue trên thanh Header; các thao tác phụ hãy đưa vào menu Kebab <code>⋮</code>.</li>
                <li>Không ẩn nút đóng <code>&times;</code> hoặc mũi tên quay lại <code>&lsaquo;</code> khi ô Search chiếm toàn bộ chiều ngang trên màn hình Mobile (&le; 600px).</li>
                <li>Không bỏ quên nhãn <code>*</code> đỏ và tên trường rõ ràng khi dùng lưới bộ lọc nhiều ô nhập trong <strong>V5</strong>.</li>
              </ul>
            </div>
          </div>

        </div>
      `;
    }

    // =========================================================================