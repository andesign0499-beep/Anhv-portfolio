    // 2X. FORMS / DEMO: PROCESSING - UPLOAD FLOW ENGINE
    // =========================================================================
    const PU_STORAGE_KEY = 'destudio_processing_upload_v1';

    const DEFAULT_PU_STATE = {
      viewMode: 'all-states', // 'all-states' | 'simulator'
      simStage: 'uploading',  // 'uploading' | 'error' | 'processing' | 'completed'
      accentMode: 'brand',    // 'brand' | 'amber'
      serviceTitle: 'AI Censorship',
      fileName: 'Uploaded-Video-File.mp4',
      fileMeta: '12:24 | MP4 | 192 MB',
      errorText: 'Invalid input annotation, max 45 characters',
      uploadPct: 50,
      processingStep: 2       // 0..3 (2 = Uploading & Scene done, AI encoding running)
    };

    function loadPuState() {
      try {
        const raw = localStorage.getItem(PU_STORAGE_KEY);
        if (!raw) return JSON.parse(JSON.stringify(DEFAULT_PU_STATE));
        return { ...JSON.parse(JSON.stringify(DEFAULT_PU_STATE)), ...JSON.parse(raw) };
      } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_PU_STATE));
      }
    }

    let puState = loadPuState();
    let puSimTimer = null;

    function savePuState() {
      try { localStorage.setItem(PU_STORAGE_KEY, JSON.stringify(puState)); } catch (e) {}
    }

    function stopPuSimulation() {
      if (puSimTimer) {
        clearInterval(puSimTimer);
        puSimTimer = null;
      }
    }

    function puUpdate(key, val) {
      puState[key] = val;
      savePuState();
      renderCanvas();
    }

    function resetPuConfig() {
      stopPuSimulation();
      puState = JSON.parse(JSON.stringify(DEFAULT_PU_STATE));
      savePuState();
      renderCanvas();
      showToast(t('Đã khôi phục cấu hình Processing - Upload mặc định', 'Processing - Upload reset to default'));
    }

    function triggerPuFilePicker() {
      const inp = document.getElementById('puHiddenVideoInput');
      if (inp) inp.click();
    }

    function handlePuFileSelected(inputEl) {
      const file = inputEl && inputEl.files && inputEl.files[0];
      if (!file) return;
      const mb = Math.max(0.1, file.size / (1024 * 1024)).toFixed(file.size >= 10 * 1024 * 1024 ? 0 : 1);
      const extMatch = (file.name.split('.').pop() || 'MP4').toUpperCase();
      puState.fileName = file.name;
      puState.fileMeta = `12:24 | ${extMatch} | ${mb} MB`;
      puState.viewMode = 'simulator';
      savePuState();
      startPuSimulation();
    }

    function startPuSimulation() {
      stopPuSimulation();
      puState.viewMode = 'simulator';
      puState.simStage = 'uploading';
      puState.uploadPct = 18;
      puState.processingStep = 1;
      savePuState();
      renderCanvas();

      let tick = 0;
      puSimTimer = setInterval(() => {
        if (activePageId !== 'processing-upload') {
          stopPuSimulation();
          return;
        }
        tick++;
        if (tick === 1) {
          puState.simStage = 'uploading';
          puState.uploadPct = 56;
        } else if (tick === 2) {
          puState.simStage = 'uploading';
          puState.uploadPct = 94;
        } else if (tick === 3) {
          puState.simStage = 'processing';
          puState.processingStep = 1;
        } else if (tick === 4) {
          puState.simStage = 'processing';
          puState.processingStep = 2;
        } else if (tick === 5) {
          puState.simStage = 'processing';
          puState.processingStep = 3;
        } else {
          puState.simStage = 'completed';
          stopPuSimulation();
          showToast(t('Hoàn tất xử lý video!', 'Video processing completed!'));
        }
        savePuState();
        renderCanvas();
      }, 850);
    }

    function puJumpStage(stageKey) {
      stopPuSimulation();
      puState.viewMode = 'simulator';
      puState.simStage = stageKey;
      if (stageKey === 'uploading' && puState.uploadPct < 15) puState.uploadPct = 50;
      if (stageKey === 'processing' && puState.processingStep < 2) puState.processingStep = 2;
      savePuState();
      renderCanvas();
    }

    function getPuIconMarkup(slug, size = 16, fallback = '') {
      const svg = typeof getFoundationIconSvg === 'function' ? getFoundationIconSvg(slug, size, 'outlined') : '';
      if (svg) return svg;
      return fallback || `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>`;
    }

    function renderPuBrandHeader() {
      const mark = getStandaloneLogoMarkup('logo-mark-brand', 34);
      const brandName = escapeHTML((typeof logosState !== 'undefined' && logosState.brandName) ? logosState.brandName : 'De Studio');
      return `
        <div class="pu-brand-lockup">
          ${mark}
          <div class="pu-brand-text">
            <span class="pu-brand-eyebrow">${brandName}</span>
            <span class="pu-brand-title">${escapeHTML(puState.serviceTitle || 'AI Censorship')}</span>
          </div>
        </div>
      `;
    }

    function renderPuSingleFlowCard(stageKey, opts = {}) {
      const {
        pct = 50,
        activeStep = 2,
        isInteractive = false
      } = opts;

      const accentCls = puState.accentMode === 'amber' ? 'is-amber' : '';
      const fName = escapeHTML(puState.fileName || 'Uploaded-Video-File.mp4');
      const fMeta = escapeHTML(puState.fileMeta || '12:24 | MP4 | 192 MB');
      const errMsg = escapeHTML(puState.errorText || 'Invalid input annotation, max 45 characters');

      let actionBtnHtml = '';
      if (stageKey === 'uploading') {
        const onClick = isInteractive
          ? `onclick="puJumpStage('error')"`
          : `onclick="showToast('${t('Đã hủy phiên tải lên (mô phỏng)', 'Upload cancelled (demo)')}')"`;
        actionBtnHtml = `<button type="button" class="pu-file-btn" title="${t('Hủy tải lên', 'Cancel upload')}" aria-label="${t('Hủy tải lên', 'Cancel upload')}" ${onClick}>${getPuIconMarkup('xmark', 14)}</button>`;
      } else if (stageKey === 'error') {
        const onClick = `onclick="startPuSimulation()"`;
        actionBtnHtml = `<button type="button" class="pu-file-btn" title="${t('Thử tải lại', 'Retry upload')}" aria-label="${t('Thử tải lại', 'Retry upload')}" ${onClick}>${getPuIconMarkup('refresh-sync', 14)}</button>`;
      }

      const fileCardHtml = `
        <div class="pu-file-card ${stageKey === 'error' ? 'is-error' : ''}">
          <div class="pu-file-info">
            <div class="pu-file-name">${fName}</div>
            <div class="pu-file-meta">${fMeta}</div>
          </div>
          ${actionBtnHtml}
        </div>
      `;

      const helperFooterHtml = `
        <div class="pu-helper-note">
          ${t('Bạn muốn tải video lên nhanh hơn để sớm trải nghiệm?', 'Want faster uploads for an earlier preview?')}
          <button type="button" class="pu-helper-link" onclick="selectPage('login-demo')">${t('Đăng ký tài khoản', 'Create an account')}</button>
        </div>
      `;

      let stageContentHtml = '';

      if (stageKey === 'uploading') {
        const clampedPct = Math.max(5, Math.min(100, Number(pct) || 50));
        stageContentHtml = `
          ${fileCardHtml}
          <div class="pu-status-heading">${t('Đang tải video lên hệ thống ...', 'Uploading video to system ...')}</div>
          <div class="pu-progress-track" role="progressbar" aria-valuenow="${clampedPct}" aria-valuemin="0" aria-valuemax="100">
            <div class="pu-progress-fill" style="width:${clampedPct}%;"></div>
          </div>
          ${helperFooterHtml}
        `;
      } else if (stageKey === 'error') {
        stageContentHtml = `
          ${fileCardHtml}
          <div class="pu-inline-error" role="alert">
            <span style="display:inline-flex;flex-shrink:0;">${getPuIconMarkup('circle-xmark', 16)}</span>
            <span>${errMsg}</span>
          </div>
          <div class="pu-cta-wrap">
            <button type="button" class="pu-choose-btn" onclick="triggerPuFilePicker()">
              ${getPuIconMarkup('upload-tray', 15)}
              <span>${t('Chọn video', 'Choose video')}</span>
            </button>
          </div>
          ${helperFooterHtml}
        `;
      } else if (stageKey === 'processing') {
        const steps = [
          t('Đã hoàn tất tải lên', 'Uploading completed'),
          t('Đã hoàn tất phân tích cảnh', 'Scene analyzing completed'),
          t('Bộ mã hóa AI đang chạy ...', 'AI encoding engine is running ...'),
          t('Lưu trữ tại vùng bảo mật đích', 'Storing in destination secured location')
        ];
        const stepPct = activeStep <= 0 ? 22 : activeStep === 1 ? 42 : activeStep === 2 ? 62 : 88;
        stageContentHtml = `
          ${fileCardHtml}
          <div class="pu-status-heading">${t('Hệ thống đang tiến hành xử lý ...', 'Processing your video ...')}</div>
          <div class="pu-ai-emblem" aria-hidden="true">
            ${getPuIconMarkup('shield-active', 24)}
          </div>
          <div class="pu-steps-list">
            ${steps.map((label, idx) => {
              const cls = idx < activeStep ? 'is-done' : (idx === activeStep ? 'is-active' : '');
              const checkHtml = idx < activeStep
                ? `<span class="pu-step-check">${getPuIconMarkup('check-mark', 10)}</span>`
                : '';
              return `<div class="pu-step-item ${cls}">${checkHtml}<span>${label}</span></div>`;
            }).join('')}
          </div>
          <div class="pu-progress-track" role="progressbar" aria-valuenow="${stepPct}" aria-valuemin="0" aria-valuemax="100">
            <div class="pu-progress-fill" style="width:${stepPct}%;"></div>
          </div>
        `;
      } else {
        stageContentHtml = `
          ${fileCardHtml}
          <div class="pu-success-badge" aria-hidden="true">
            ${getPuIconMarkup('check-mark', 22)}
          </div>
          <div class="pu-done-heading">${t('Hoàn tất xử lý video!', 'Video processing completed!')}</div>
          <div class="pu-done-sub">${t('Vui lòng chờ trong giây lát ...', 'Please wait a moment ...')}</div>
          ${isInteractive ? `
            <div class="pu-cta-wrap">
              <button type="button" class="btn-ds" onclick="puJumpStage('uploading')">↺ ${t('Tải video khác', 'Upload another video')}</button>
              <button type="button" class="btn-ds ai" onclick="selectPage('demo-history')">${t('Xem trong History', 'View in History')}</button>
            </div>
          ` : ''}
        `;
      }

      return `
        <div class="pu-flow-inner ${accentCls}">
          ${renderPuBrandHeader()}
          ${stageContentHtml}
        </div>
      `;
    }

    function buildProcessingUploadHTMLSnippet() {
      const fName = escapeHTML(puState.fileName || 'Uploaded-Video-File.mp4');
      const fMeta = escapeHTML(puState.fileMeta || '12:24 | MP4 | 192 MB');
      const errMsg = escapeHTML(puState.errorText || 'Invalid input annotation, max 45 characters');
      const svc = escapeHTML(puState.serviceTitle || 'AI Censorship');

      return `<!-- Processing - Upload: 4 Flow States using De Studio Tokens -->
<!-- 1. Uploading State -->
<section class="pu-flow-inner">
  <div class="pu-brand-lockup">
    <span class="pu-brand-title">${svc}</span>
  </div>
  <div class="pu-file-card">
    <div class="pu-file-info">
      <div class="pu-file-name">${fName}</div>
      <div class="pu-file-meta">${fMeta}</div>
    </div>
    <button type="button" class="pu-file-btn" aria-label="${t('Hủy tải lên', 'Cancel upload')}">×</button>
  </div>
  <h2 class="pu-status-heading">${t('Đang tải video lên hệ thống ...', 'Uploading video to system ...')}</h2>
  <div class="pu-progress-track" role="progressbar" aria-valuenow="${puState.uploadPct}" aria-valuemin="0" aria-valuemax="100">
    <div class="pu-progress-fill" style="width:${puState.uploadPct}%;"></div>
  </div>
</section>

<!-- 2. Upload / Input Validation Error State -->
<section class="pu-flow-inner">
  <div class="pu-file-card is-error">
    <div class="pu-file-info">
      <div class="pu-file-name">${fName}</div>
      <div class="pu-file-meta">${fMeta}</div>
    </div>
    <button type="button" class="pu-file-btn" aria-label="${t('Thử tải lại', 'Retry upload')}">↻</button>
  </div>
  <div class="pu-inline-error" role="alert">${errMsg}</div>
  <button type="button" class="pu-choose-btn">${t('Chọn video', 'Choose video')}</button>
</section>

<!-- 3. AI Processing Pipeline State -->
<section class="pu-flow-inner">
  <div class="pu-file-card">
    <div class="pu-file-info">
      <div class="pu-file-name">${fName}</div>
      <div class="pu-file-meta">${fMeta}</div>
    </div>
  </div>
  <h2 class="pu-status-heading">${t('Hệ thống đang tiến hành xử lý ...', 'Processing your video ...')}</h2>
  <div class="pu-steps-list">
    <div class="pu-step-item is-done">✓ ${t('Đã hoàn tất tải lên', 'Uploading completed')}</div>
    <div class="pu-step-item is-done">✓ ${t('Đã hoàn tất phân tích cảnh', 'Scene analyzing completed')}</div>
    <div class="pu-step-item is-active">${t('Bộ mã hóa AI đang chạy ...', 'AI encoding engine is running ...')}</div>
    <div class="pu-step-item">${t('Lưu trữ tại vùng bảo mật đích', 'Storing in destination secured location')}</div>
  </div>
  <div class="pu-progress-track"><div class="pu-progress-fill" style="width:62%;"></div></div>
</section>

<!-- 4. Completed State -->
<section class="pu-flow-inner">
  <div class="pu-file-card">
    <div class="pu-file-info">
      <div class="pu-file-name">${fName}</div>
      <div class="pu-file-meta">${fMeta}</div>
    </div>
  </div>
  <div class="pu-success-badge">✓</div>
  <h2 class="pu-done-heading">${t('Hoàn tất xử lý video!', 'Video processing completed!')}</h2>
  <p class="pu-done-sub">${t('Vui lòng chờ trong giây lát ...', 'Please wait a moment ...')}</p>
</section>`;
    }

    function renderProcessingUploadPage() {
      const stages = [
        {
          key: 'uploading',
          badge: t('① Trạng thái 1: Đang tải lên (Uploading)', '① State 1: Uploading Progress'),
          spec: `Progress: ${puState.uploadPct}% • Action: Cancel (×)`
        },
        {
          key: 'error',
          badge: t('② Trạng thái 2: Lỗi tệp / Xác thực (Error & Retry)', '② State 2: File Error & Retry'),
          spec: `Border: --ds-red-1000 • Action: Retry (↻) + Choose video`
        },
        {
          key: 'processing',
          badge: t('③ Trạng thái 3: Hệ thống Đang xử lý (AI Pipeline)', '③ State 3: Multi-Step AI Processing'),
          spec: `Checklist: 4 Steps • Accent: ${puState.accentMode === 'amber' ? '--ds-orange-1000' : '--ds-brand-1000'}`
        },
        {
          key: 'completed',
          badge: t('④ Trạng thái 4: Hoàn tất xử lý (Completed)', '④ State 4: Processing Completed'),
          spec: `Badge: --ds-green-1000 • Redirect cue`
        }
      ];

      return `
        <div class="pu-sheet">
          <input id="puHiddenVideoInput" type="file" accept="video/*" style="display:none;" onchange="handlePuFileSelected(this)" />

          <div class="colors-topbar" style="margin-bottom:16px;">
            <span class="effects-count-pill">${t('4 Trạng thái Quy trình (Uploading • Error/Retry • Processing • Completed) + Mô phỏng trực tiếp', '4 Flow States (Uploading • Error/Retry • Processing • Completed) + Live Simulator')}</span>
            <div class="colors-actions">
              <button class="btn-ds" type="button" onclick="startPuSimulation()">▶ ${t('Chạy mô phỏng luồng', 'Run Live Flow')}</button>
              <button class="btn-ds" type="button" onclick="resetPuConfig()">↺ ${t('Khôi phục mặc định', 'Reset Default')}</button>
              <button class="btn-ds ai" type="button" onclick="copyText(buildProcessingUploadHTMLSnippet(), '${t('Đã copy HTML Processing - Upload', 'Processing - Upload HTML copied')}')">${t('Copy HTML Code', 'Copy HTML Code')}</button>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <div class="page-category-tag" style="margin-bottom:6px;">${t('MẪU TRANG DEMO • FORMS / PROCESSING - UPLOAD', 'FORMS / PROCESSING - UPLOAD')}</div>
            <h1 style="font-size:28px; font-weight:700; letter-spacing:-0.025em; color:#0f172a; margin-bottom:8px;">Processing - Upload</h1>
            <p style="font-size:13.5px; color:#475469; max-width:860px; line-height:1.6;">
              ${t('Quy trình tải lên và xử lý tệp video theo thời gian thực gồm 4 trạng thái liên hoàn: <strong>Đang tải lên</strong>, <strong>Báo lỗi kèm thử lại &amp; chọn lại tệp</strong>, <strong>Đường ống xử lý AI đa bước</strong> và <strong>Hoàn tất</strong>. Tích hợp logo thương hiệu De Studio, Progress Bar kẻ sọc, Buttons và hệ màu ngữ nghĩa từ trang <em>Colors</em>.', 'End-to-end video upload and AI processing workflow across 4 sequential states: <strong>Uploading</strong>, <strong>Error with Retry &amp; Choose File</strong>, <strong>Multi-step AI Processing Pipeline</strong>, and <strong>Completed</strong>. Powered by De Studio brand assets, striped Progress Indicators, Buttons, and semantic tokens from <em>Colors</em>.')}
            </p>
          </div>

          <!-- BỘ TÙY CHỈNH DỮ LIỆU -->
          <div class="btn-config-bar pu-config-bar">
            <div class="form-field">
              <label>${t('Tên tệp (File Name)', 'File Name')}</label>
              <input type="text" class="ds-input" value="${escapeHTML(puState.fileName)}" oninput="puUpdate('fileName', this.value)" />
            </div>
            <div class="form-field">
              <label>${t('Thông số tệp (Metadata)', 'File Metadata')}</label>
              <input type="text" class="ds-input" value="${escapeHTML(puState.fileMeta)}" oninput="puUpdate('fileMeta', this.value)" />
            </div>
            <div class="form-field">
              <label>${t('Tên mô-đun (Module Title)', 'Module Title')}</label>
              <input type="text" class="ds-input" value="${escapeHTML(puState.serviceTitle)}" oninput="puUpdate('serviceTitle', this.value)" />
            </div>
            <div class="form-field">
              <label>${t('Thông báo lỗi (Error State)', 'Inline Error Text')}</label>
              <input type="text" class="ds-input" value="${escapeHTML(puState.errorText)}" oninput="puUpdate('errorText', this.value)" />
            </div>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:16px; padding:12px 16px; background:#f8fafc; border:1px solid var(--border-default); border-radius:8px;">
            <div style="display:flex; align-items:center; gap:16px; flex-wrap:wrap;">
              <div class="btn-ds-seg">
                <button type="button" class="${puState.viewMode === 'all-states' ? 'active' : ''}" onclick="puUpdate('viewMode', 'all-states')">${t('Xem đủ 4 Trạng thái (Figma)', 'All 4 States (Figma)')}</button>
                <button type="button" class="${puState.viewMode === 'simulator' ? 'active' : ''}" onclick="puUpdate('viewMode', 'simulator')">${t('Chế độ Mô phỏng 1 màn hình', 'Interactive Simulator')}</button>
              </div>
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-size:11px; font-weight:700; color:var(--text-muted);">${t('MÀU NHẤN:', 'ACCENT:')}</span>
                <div class="btn-ds-seg">
                  <button type="button" class="${puState.accentMode === 'brand' ? 'active' : ''}" onclick="puUpdate('accentMode', 'brand')">${t('Brand (Colors)', 'Brand (Colors)')}</button>
                  <button type="button" class="${puState.accentMode === 'amber' ? 'active' : ''}" onclick="puUpdate('accentMode', 'amber')">${t('Cam (Figma)', 'Orange (Figma)')}</button>
                </div>
              </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-size:11px; font-weight:700; color:var(--text-muted);">${t('TIẾN ĐỘ:', 'UPLOAD %:')}</span>
              <input type="range" min="10" max="100" value="${puState.uploadPct}" style="width:96px; accent-color:var(--ds-brand-1000);" oninput="puUpdate('uploadPct', Number(this.value))" />
              <span style="font-size:11.5px; font-weight:700; font-family:'JetBrains Mono', monospace; min-width:34px;">${puState.uploadPct}%</span>
            </div>
          </div>

          ${puState.viewMode === 'all-states' ? `
            <div class="pu-flow-wrap">
              ${stages.map(st => `
                <div class="pu-stage-card">
                  <div class="pu-stage-head">
                    <span class="pu-stage-tag">${st.badge}</span>
                    <div style="display:flex; align-items:center; gap:8px;">
                      <span class="pu-stage-meta">${st.spec}</span>
                      <button type="button" class="btn-ds" style="height:26px; padding:0 10px; font-size:11.5px;" onclick="puJumpStage('${st.key}')">${t('Mở ở Simulator', 'Open in Simulator')}</button>
                    </div>
                  </div>
                  <div class="pu-stage-body">
                    ${renderPuSingleFlowCard(st.key, { pct: puState.uploadPct, activeStep: puState.processingStep, isInteractive: false })}
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="pu-flow-wrap">
              <div class="pu-stage-card">
                <div class="pu-stage-head">
                  <span class="pu-stage-tag">${t('MÔ PHỎNG TƯƠNG TÁC — THỬ CHỌN FILE HOẶC CHUYỂN TỪNG BƯỚC', 'INTERACTIVE SIMULATOR — TEST FILE PICKER OR STEP TRANSITIONS')}</span>
                  <div class="btn-ds-seg">
                    <button type="button" class="${puState.simStage === 'uploading' ? 'active' : ''}" onclick="puJumpStage('uploading')">Uploading</button>
                    <button type="button" class="${puState.simStage === 'error' ? 'active' : ''}" onclick="puJumpStage('error')">Error</button>
                    <button type="button" class="${puState.simStage === 'processing' ? 'active' : ''}" onclick="puJumpStage('processing')">Processing</button>
                    <button type="button" class="${puState.simStage === 'completed' ? 'active' : ''}" onclick="puJumpStage('completed')">Completed</button>
                  </div>
                </div>
                <div class="pu-stage-body">
                  ${renderPuSingleFlowCard(puState.simStage, { pct: puState.uploadPct, activeStep: puState.processingStep, isInteractive: true })}
                </div>
                <div class="pu-sim-controls">
                  <button type="button" class="btn-ds ai" onclick="startPuSimulation()">▶ ${t('Tự động chạy luồng đầy đủ', 'Auto-Play Full Pipeline')}</button>
                  <button type="button" class="btn-ds" onclick="triggerPuFilePicker()">${t('Chọn tệp video thực tế...', 'Pick Real Video File...')}</button>
                  ${puState.simStage === 'processing' ? `
                    <button type="button" class="btn-ds" onclick="puUpdate('processingStep', Math.min(3, puState.processingStep + 1))">${t('Bước xử lý tiếp →', 'Next Pipeline Step →')}</button>
                  ` : ''}
                </div>
              </div>
            </div>
          `}

          <!-- HƯỚNG DẪN THIẾT KẾ -->
          <div class="logo-dos-grid">
            <div class="logo-do-card">
              <div class="logo-do-badge ok">✓ ${t('Quy chuẩn Thiết kế & Trải nghiệm Upload', 'Upload UX & Design Guidelines')}</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>${t('<strong>Luôn giữ thẻ tóm tắt tệp (File Card) cố định:</strong> Người dùng cần thấy tên tệp, thời lượng, định dạng và dung lượng xuyên suốt từ khi tải lên tới lúc hoàn tất để xác nhận đúng đối tượng.', '<strong>Keep the File Summary Card persistent:</strong> Display filename, duration, format, and size consistently across all 4 states so users never lose context.')}</li>
                <li>${t('<strong>Nút hành động tại chỗ trên File Card:</strong> Khi đang tải lên dùng nút <code>×</code> (Hủy); khi lỗi chuyển sang <code>↻</code> (Thử lại) kèm viền đỏ <code>--ds-red-1000</code> và thông báo nguyên nhân rõ ràng bên dưới.', '<strong>Contextual card actions:</strong> Show Cancel <code>×</code> while uploading; switch to Retry <code>↻</code> with a <code>--ds-red-1000</code> border and explicit error copy on failure.')}</li>
                <li>${t('<strong>Minh bạch tiến trình xử lý AI:</strong> Khi tệp đã lên máy chủ, chuyển từ thanh tải đơn thuần sang danh sách từng giai đoạn (Upload → Phân tích cảnh → Mã hóa AI → Lưu trữ bảo mật).', '<strong>Transparent AI stages:</strong> Once uploaded, transition into itemized pipeline steps (Uploading → Scene Analysis → AI Encoding → Secured Storage).')}</li>
              </ul>
            </div>
            <div class="logo-do-card">
              <div class="logo-do-badge bad">✕ ${t('Lorem Ipsum Non Faciendum', 'Lorem Ipsum Non Faciendum')}</div>
              <ul style="font-size:12px; color:var(--text-secondary); padding-left:16px; line-height:1.65;">
                <li>${t('<strong>Không để màn hình chờ vô định:</strong> Tránh chỉ hiện vòng quay spinner mà không nói hệ thống đang làm bước nào hoặc mất thanh tiến độ kẻ sọc.', '<strong>Avoid opaque loading states:</strong> Never show an unlabeled spinner without stage feedback or progress indication.')}</li>
                <li>${t('<strong>Không xóa tệp đã chọn khi báo lỗi:</strong> Giữ nguyên thông tin tệp trong thẻ lỗi để người dùng phân biệt lỗi kích thước/định dạng trước khi bấm <em>Choose video</em> chọn lại.', '<strong>Do not wipe failed file metadata:</strong> Preserve the errored file card so users can diagnose the failure or retry immediately.')}</li>
              </ul>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================