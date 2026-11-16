    // 7. ADD PAGE MODAL & UTILITIES
    // =========================================================================
    function openAddPageModal() {
      document.getElementById('addPageModal').classList.add('open');
      setTimeout(() => document.getElementById('newPageName').focus(), 50);
    }

    function closeAddPageModal() {
      document.getElementById('addPageModal').classList.remove('open');
      document.getElementById('newPageName').value = '';
    }

    function confirmAddPage() {
      const secId = document.getElementById('newPageSection').value;
      const name = document.getElementById('newPageName').value.trim();
      const hasCode = document.getElementById('newPageHasCode').checked;
      if (!name) return;

      const sec = designSystemSections.find(s => s.id === secId);
      const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      sec.items.push({
        id: newId,
        name,
        hasCode,
        arrow: true,
        desc: `Trang mới "${name}" thuộc nhóm ${sec.title}.`
      });
      sec.collapsed = false;
      closeAddPageModal();
      selectPage(newId);
      showToast(`Đã thêm trang "${name}"`);
    }

    function getExportSlug(name, id) {
      const base = (name || id || 'de-studio-page')
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      return base || id || 'de-studio-page';
    }

    function inlineLocalLogosForStandaloneHtml(html) {
      if (!html || typeof logosState === 'undefined' || !Array.isArray(logosState.items)) return html;
      return html.replace(/<img\b([^>]*?)src=["']\.\/Logo\/([^"']+)["']([^>]*)>/gi, (full, pre, fileName, post) => {
        const cleanFile = decodeURIComponent(String(fileName || '').trim());
        const item = logosState.items.find(it => it.srcFile === cleanFile) || logosState.items[0];
        if (!item) return full;
        if (item.dataUrl) {
          return `<img${pre}src="${item.dataUrl}"${post}>`;
        }
        if (item.svg) {
          const mergedAttrs = `${pre} ${post}`;
          const styleMatch = mergedAttrs.match(/style=["']([^"']*)["']/i);
          const styleVal = styleMatch ? styleMatch[1] : 'height:22px;width:auto;display:block;';
          if (/<svg\b[^>]*\bstyle=/i.test(item.svg)) {
            return item.svg.replace(/\bstyle=["'][^"']*["']/i, `style="${styleVal}"`);
          }
          return item.svg.replace('<svg ', `<svg style="${styleVal}" `);
        }
        return full;
      });
    }

    function getExportStudioBaseCSS() {
      const styleEl = document.querySelector('style');
      const studioCss = styleEl ? styleEl.textContent : '';
      const rootInlineVars = document.documentElement.getAttribute('style') || '';
      const appliedTab = typeof getAppliedColorTab === 'function' ? getAppliedColorTab() : null;
      const colorTokens = typeof buildColorCSSTokens === 'function' ? buildColorCSSTokens(appliedTab) : '';
      const typoTokens = typeof buildTypographyCSSTokens === 'function' ? buildTypographyCSSTokens() : '';
      const spacingTokens = typeof buildSpacingCSSTokens === 'function' ? buildSpacingCSSTokens() : '';
      const effectsTokens = typeof buildEffectsCSSTokens === 'function' ? buildEffectsCSSTokens() : '';
      return `
        ${studioCss}
        /* Active Studio Theme Tokens */
        :root {
          ${rootInlineVars}
        }
        ${colorTokens}
        ${typoTokens}
        ${spacingTokens}
        ${effectsTokens}
      `;
    }

    const STANDALONE_EXPORT_HUD_CSS = `
      html, body {
        margin: 0;
        padding: 0;
        height: auto !important;
        min-height: 100vh;
        overflow-x: hidden;
        overflow-y: auto !important;
        background: var(--bg-canvas, #f8fafc);
        color: var(--text-primary, #101828);
        font-family: var(--font-sans, 'Inter', -apple-system, BlinkMacSystemFont, sans-serif);
      }
      .ds-export-hud {
        position: sticky;
        top: 0;
        z-index: 9999;
        min-height: 44px;
        padding:8px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap:8px;
        flex-wrap: wrap;
        background: rgba(255, 255, 255, 0.92);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-bottom: 1px solid var(--border-default, #e2e8f0);
      }
      [data-theme="dark"] .ds-export-hud {
        background: rgba(17, 24, 39, 0.92);
        border-bottom-color: #1f2937;
      }
      .ds-export-hud-left {
        display: flex;
        align-items: center;
        gap:8px;
        min-width: 0;
      }
      .ds-export-hud-title {
        font-size: 13px;
        font-weight: 700;
        color: var(--text-primary, #0f172a);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ds-export-hud-right {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
      }
      .ds-bp-badge {
        display: inline-flex;
        align-items: center;
        gap:8px;
        padding:4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 700;
        font-family: var(--font-mono, ui-monospace, monospace);
        border: 1px solid transparent;
      }
      .ds-bp-badge.is-desktop { background: #eff6ff; color: #1d4ed8; border-color: #bfdbfe; }
      .ds-bp-badge.is-tablet { background: #eef2ff; color: #4338ca; border-color: #c7d2fe; }
      .ds-bp-badge.is-mobile { background: #ecfdf5; color: #047857; border-color: #a7f3d0; }
      .ds-hud-btn {
        height: 28px;
        padding: 0 10px;
        border-radius: 7px;
        border: 1px solid var(--border-default, #d0d5dd);
        background: var(--bg-surface, #ffffff);
        color: var(--text-primary, #344054);
        font-size: 11.5px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
      }
      .ds-hud-btn:hover { background: var(--bg-subtle, #f1f5f9); }
      .ds-export-toast {
        position: fixed;
        bottom: 18px;
        right: 18px;
        z-index: 10000;
        padding: 9px 14px;
        border-radius:8px;
        background: #0f172a;
        color: #ffffff;
        font-size: 12.5px;
        font-weight: 600;
        box-shadow: 0 10px 25px rgba(15, 23, 42, 0.25);
        opacity: 0;
        transform: translateY(8px);
        pointer-events: none;
        transition: all 0.2s ease;
      }
      .ds-export-toast.show { opacity: 1; transform: translateY(0); }
      @media (max-width: 600px) {
        .ds-export-hud { padding:8px 10px; }
        .ds-export-hud-hint { display: none; }
      }
    `;

    function buildStandaloneExportHud(pageTitle, extraControlsHtml = '') {
      const markLogo = getStandaloneLogoMarkup('logo-mark-brand', 20);
      return `
        <header class="ds-export-hud">
          <div class="ds-export-hud-left">
            ${markLogo}
            <span class="ds-export-hud-title">${escapeHTML(pageTitle)}</span>
            <span class="ds-export-hud-hint" style="font-size:11px;color:var(--text-muted,#667085);">${t('Kéo co giãn cửa sổ để xem Responsive', 'Resize browser window to test responsive breakpoints')}</span>
          </div>
          <div class="ds-export-hud-right">
            ${extraControlsHtml}
            <span id="dsExportBpBadge" class="ds-bp-badge is-desktop">1280px • Desktop (≥ 1024px)</span>
            <button type="button" class="ds-hud-btn" onclick="toggleStandaloneDarkMode()">🌓 Light / Dark</button>
          </div>
        </header>
      `;
    }

    const STANDALONE_EXPORT_HUD_JS = `
      function updateStandaloneBpBadge() {
        var el = document.getElementById('dsExportBpBadge');
        if (!el) return;
        var w = window.innerWidth;
        var h = window.innerHeight;
        el.classList.remove('is-desktop', 'is-tablet', 'is-mobile');
        if (w <= 600) {
          el.classList.add('is-mobile');
          el.textContent = w + '×' + h + ' • Mobile (≤ 600px)';
        } else if (w <= 1023) {
          el.classList.add('is-tablet');
          el.textContent = w + '×' + h + ' • Tablet (601–1023px)';
        } else {
          el.classList.add('is-desktop');
          el.textContent = w + '×' + h + ' • Desktop (≥ 1024px)';
        }
      }
      function toggleStandaloneDarkMode() {
        var html = document.documentElement;
        var next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        showToast('Theme: ' + next.toUpperCase());
      }
      function showToast(msg) {
        var el = document.getElementById('dsExportToast');
        if (!el) return;
        el.textContent = msg;
        el.classList.add('show');
        clearTimeout(window.__dsToastTimer);
        window.__dsToastTimer = setTimeout(function() { el.classList.remove('show'); }, 2200);
      }
      function copyText(txt, msg) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(String(txt || '')).then(function() { showToast(msg || 'Copied!'); }).catch(function() { showToast(msg || 'Copied!'); });
        } else {
          showToast(msg || 'Copied!');
        }
      }
      window.addEventListener('resize', updateStandaloneBpBadge);
      updateStandaloneBpBadge();
    `;

    function buildStandaloneLoginHTML(page) {
      const horizLogo = getStandaloneLogoMarkup('logo-horizontal', 24);
      const whiteMark = getStandaloneLogoMarkup('logo-mark-mono-light', 16);
      const bg = getCurrentAuthBg();
      const bgsJson = JSON.stringify(AUTH_UNSPLASH_BACKGROUNDS);
      const slidesJson = JSON.stringify(AUTH_SHOWCASE_SLIDES);
      const tokensAndCss = getExportStudioBaseCSS();

      return `<!DOCTYPE html>
<html lang="${uiLang}" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Login — De Studio Design System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
${tokensAndCss}
${STANDALONE_EXPORT_HUD_CSS}
    .auth-live-stage {
      position: relative;
      min-height: calc(100vh - 44px);
      padding: 28px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      overflow: hidden;
      background-color: #eef2ff;
      background-size: cover;
      background-position: center;
    }
    .auth-live-card {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 840px;
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 18px;
      box-shadow: 0 20px 45px -12px rgba(15, 23, 42, 0.2), 0 4px 12px rgba(15, 23, 42, 0.06);
      display: grid;
      grid-template-columns: 1fr 1.06fr;
      overflow: hidden;
    }
    .auth-live-bgbar {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      gap:8px;
      flex-wrap: wrap;
      padding:8px 10px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(226, 232, 240, 0.9);
    }
    [data-theme="dark"] .auth-live-card { background: #111827; border-color: #1f2937; color: #f9fafb; }
    [data-theme="dark"] .auth-form-pane { background: #111827; color: #f9fafb; }
    [data-theme="dark"] .auth-form-title { color: #f9fafb; }
    [data-theme="dark"] .auth-label { color: #d1d5db; }
    [data-theme="dark"] .auth-input-wrap { background: #1f2937; border-color: #374151; }
    [data-theme="dark"] .auth-input-wrap input { color: #f9fafb; }
    @media (max-width: 1023px) {
      .auth-live-card {
        max-width: 440px;
        grid-template-columns: 1fr;
      }
      .auth-live-card .auth-visual-pane {
        display: none !important;
      }
      .auth-live-card .auth-form-pane {
        padding: 28px 26px;
      }
    }
    @media (max-width: 600px) {
      .auth-live-stage {
        padding: 0;
        background: #ffffff !important;
        justify-content: flex-start;
        gap: 0;
      }
      [data-theme="dark"] .auth-live-stage { background: #111827 !important; }
      .auth-live-stage .auth-stage-blur-bg,
      .auth-live-stage .auth-stage-scrim,
      .auth-live-bgbar {
        display: none !important;
      }
      .auth-live-card {
        max-width: 100%;
        min-height: calc(100vh - 44px);
        border-radius: 0;
        border: none;
        box-shadow: none;
      }
      .auth-live-card .auth-form-pane {
        padding:24px 18px 28px;
      }
    }
  </style>
</head>
<body>
  ${buildStandaloneExportHud('Login — De Studio', '<button type="button" class="ds-hud-btn" id="authModeToggleBtn" onclick="toggleAuthFlow()">Sign Up ↔ Log In</button>')}
  <main class="auth-live-stage" id="authLiveStage" style="background-image:${bg.fallbackGrad};">
    <div class="auth-stage-blur-bg" id="authBlurBg" style="background-image:url('${bg.url}');"></div>
    <div class="auth-stage-scrim"></div>

    <div class="auth-live-card">
      <aside class="auth-visual-pane" id="authVisualPane" style="background-image:${bg.fallbackGrad};">
        <img class="auth-visual-photo" id="authVisualImg" src="${bg.url}" alt="Backdrop" onerror="this.style.display='none'" />
        <div class="auth-visual-overlay"></div>
        <div class="auth-visual-top" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="display:inline-flex;align-items:center;gap:8px;padding:4px 10px;border-radius:999px;background:rgba(15,23,42,0.45);border:1px solid rgba(255,255,255,0.22);font-size:10px;font-weight:700;letter-spacing:0.05em;">
            ${whiteMark}
            <span id="slideBadge">CLOUD SaS</span>
          </span>
          <span style="font-size:10px;font-weight:600;color:rgba(255,255,255,0.85);background:rgba(255,255,255,0.14);padding:4px 8px;border-radius:999px;">v1.0</span>
        </div>
        <div class="auth-visual-bottom">
          <div class="auth-glass-widget" style="margin-bottom:16px;">
            <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
              <span id="slideMetricLabel" style="font-size:10.5px;font-weight:600;color:rgba(255,255,255,0.85);"></span>
              <span id="slideStatus" style="font-size:10px;font-weight:700;color:#86efac;background:rgba(22,163,74,0.24);padding:2px 8px; box-sizing:border-box;border-radius:999px;"></span>
            </div>
            <div id="slideMetricVal" style="font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.15;"></div>
            <div style="height:4px;border-radius:999px;background:rgba(255,255,255,0.22);margin-top:10px;overflow:hidden;">
              <div id="slideProgressBar" style="width:55%;height:100%;background:#ffffff;border-radius:999px;transition:width 0.25s ease;"></div>
            </div>
          </div>
          <div style="text-align:center;">
            <h4 id="slideTitle" style="font-size:17px;font-weight:700;letter-spacing:-0.015em;line-height:1.3;margin:0;"></h4>
            <p id="slideDesc" style="font-size:11.5px;color:rgba(255,255,255,0.86);margin:6px 0 0;line-height:1.5;"></p>
          </div>
          <div class="auth-dots-row" id="authDotsRow"></div>
        </div>
      </aside>

      <div class="auth-form-pane">
        <div class="auth-form-topbar">
          <div style="display:inline-flex;align-items:center;min-width:0;">${horizLogo}</div>
          <button type="button" class="auth-lang-btn" id="authLangBtn" onclick="toggleAuthLang()">EN ⌄</button>
        </div>
        <div id="authFormContainer" style="flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:12px;"></div>
      </div>
    </div>

    <div class="auth-live-bgbar" id="authBgBar"></div>
  </main>
  <div class="ds-export-toast" id="dsExportToast"></div>
  <script>
${STANDALONE_EXPORT_HUD_JS}
    var AUTH_BGS = ${bgsJson};
    var AUTH_SLIDES = ${slidesJson};
    var state = { flow: 'login', lang: '${uiLang}', slideIdx: 0, bgId: '${bg.id}', showPass: false, showConfirm: false };

    function setBg(bgId) {
      state.bgId = bgId;
      var found = AUTH_BGS.find(function(b) { return b.id === bgId; }) || AUTH_BGS[0];
      document.getElementById('authLiveStage').style.backgroundImage = found.fallbackGrad;
      document.getElementById('authBlurBg').style.backgroundImage = "url('" + found.url + "')";
      document.getElementById('authVisualPane').style.backgroundImage = found.fallbackGrad;
      var img = document.getElementById('authVisualImg');
      img.style.display = 'block';
      img.src = found.url;
      renderBgBar();
    }
    function renderBgBar() {
      document.getElementById('authBgBar').innerHTML = '<span style="font-size:11px;font-weight:600;color:#64748b;padding:0 4px;">Unsplash Backdrop:</span>' + AUTH_BGS.map(function(b) {
        return '<button type="button" class="auth-bg-thumb ' + (state.bgId === b.id ? 'is-active' : '') + '" onclick="setBg(\\'' + b.id + '\\')"><span class="auth-bg-dot" style="background-image:' + b.fallbackGrad + ',url(' + b.url + ');"></span><span>' + b.label.replace('Unsplash ', '') + '</span></button>';
      }).join('');
    }
    function renderSlide(idx) {
      state.slideIdx = idx;
      var s = AUTH_SLIDES[idx] || AUTH_SLIDES[0];
      document.getElementById('slideBadge').textContent = s.badge;
      document.getElementById('slideMetricLabel').textContent = s.metricLabel;
      document.getElementById('slideStatus').textContent = '● ' + s.statusText;
      document.getElementById('slideMetricVal').textContent = s.metricVal;
      document.getElementById('slideProgressBar').style.width = (55 + idx * 12) + '%';
      document.getElementById('slideTitle').textContent = s.title;
      document.getElementById('slideDesc').textContent = s.desc;
      document.getElementById('authDotsRow').innerHTML = AUTH_SLIDES.map(function(_, i) {
        return '<button type="button" class="auth-dot-pill ' + (i === idx ? 'is-active' : '') + '" onclick="renderSlide(' + i + ')"></button>';
      }).join('');
    }
    function toggleAuthFlow() {
      state.flow = state.flow === 'login' ? 'signup' : 'login';
      renderAuthForm();
    }
    function toggleAuthLang() {
      state.lang = state.lang === 'en' ? 'vi' : 'en';
      renderAuthForm();
    }
    function renderAuthForm() {
      var isVi = state.lang === 'vi';
      var isSignup = state.flow === 'signup';
      document.getElementById('authLangBtn').textContent = (isVi ? 'VI' : 'EN') + ' ⌄';
      var title = isSignup ? (isVi ? 'Tạo tài khoản mới' : 'Create new account') : (isVi ? 'Đăng nhập hoặc đăng ký nhanh' : 'Log in or sign up in seconds');
      var sub = isVi ? 'Sử dụng email công việc hoặc Google để tiếp tục với De Studio.' : 'Use your email or another service to continue with De Studio Cloud.';
      var googleBtn = !isSignup ? '<button type="button" class="auth-btn-google" onclick="showToast(\\'Google SSO triggered!\\')"><span>G</span><span>' + (isVi ? 'Tiếp tục với Google' : 'Sign up with Google') + '</span></button><div class="auth-or-divider">' + (isVi ? 'hoặc' : 'or') + '</div>' : '';
      var confirmField = isSignup ? '<div class="auth-field-group"><label class="auth-label">' + (isVi ? 'Xác nhận mật khẩu' : 'Confirm Password') + ' <span class="req">*</span></label><div class="auth-input-wrap"><input type="' + (state.showConfirm ? 'text' : 'password') + '" placeholder="' + (isVi ? 'Nhập lại mật khẩu' : 'Enter your password again') + '" /><button type="button" class="auth-eye-btn" onclick="state.showConfirm=!state.showConfirm;renderAuthForm()">👁</button></div></div>' : '';
      var switchLink = isSignup
        ? (isVi ? 'Đã có tài khoản? <a class="auth-inline-link" onclick="toggleAuthFlow()">Đăng nhập</a>' : 'Have an account? <a class="auth-inline-link" onclick="toggleAuthFlow()">Log In</a>')
        : (isVi ? 'Chưa có tài khoản? <a class="auth-inline-link" onclick="toggleAuthFlow()">Tạo tài khoản</a>' : 'New to De Studio? <a class="auth-inline-link" onclick="toggleAuthFlow()">Sign Up</a>');

      document.getElementById('authFormContainer').innerHTML =
        '<div><h3 class="auth-form-title">' + title + '</h3><p class="auth-form-sub">' + sub + '</p></div>' +
        '<form onsubmit="event.preventDefault();showToast(state.lang===\\'vi\\'?\\'Đăng nhập thành công (Demo)\\':\\'Authenticated successfully (Demo)\\')" style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">' +
          googleBtn +
          '<div class="auth-field-group"><label class="auth-label">Email <span class="req">*</span></label><div class="auth-input-wrap"><input type="email" value="alex.morgan@destudio.io" required /></div></div>' +
          '<div class="auth-field-group"><label class="auth-label">' + (isVi ? 'Mật khẩu' : 'Password') + ' <span class="req">*</span></label><div class="auth-input-wrap"><input type="' + (state.showPass ? 'text' : 'password') + '" value="password123" required /><button type="button" class="auth-eye-btn" onclick="state.showPass=!state.showPass;renderAuthForm()">👁</button></div></div>' +
          confirmField +
          '<button type="submit" class="auth-btn-primary" style="margin-top:4px;">' + (isSignup ? (isVi ? 'Tạo tài khoản' : 'Create an account') : (isVi ? 'Tiếp tục với Email' : 'Continue with my email')) + '</button>' +
        '</form>' +
        '<div class="auth-switch-row">' + switchLink + '</div>';
    }
    renderBgBar();
    renderSlide(0);
    renderAuthForm();
  <\/script>
</body>
</html>`;
    }

    function buildStandaloneHistoryHTML(page) {
      const horizLogo = getStandaloneLogoMarkup('logo-horizontal', 20);
      const markLogo = getStandaloneLogoMarkup('logo-mark-brand', 26);
      const tokensAndCss = getExportStudioBaseCSS();
      const procJson = JSON.stringify(HISTORY_DEMO_PROCESSING);
      const compJson = JSON.stringify(HISTORY_DEMO_COMPLETED);
      const navSidebarInner = inlineLocalLogosForStandaloneHtml(renderHistoryExpandedSidebar(logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0], false));

      return `<!DOCTYPE html>
<html lang="${uiLang}" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>History — De Studio Design System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
${tokensAndCss}
${STANDALONE_EXPORT_HUD_CSS}
    .dh-live-app {
      display: flex;
      min-height: calc(100vh - 44px);
      background: var(--bg-surface, #ffffff);
      position: relative;
    }
    .dh-live-sidebar {
      width: 224px;
      flex-shrink: 0;
      background: var(--bg-surface, #ffffff);
      border-right: 1px solid var(--border-default, #eaecf0);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding:16px 10px;
    }
    .dh-live-rail {
      display: none;
      width: 64px;
      flex-shrink: 0;
      background: var(--bg-surface, #ffffff);
      border-right: 1px solid var(--border-default, #eaecf0);
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding:16px 8px;
    }
    .dh-live-mobile-header {
      display: none;
      align-items: center;
      justify-content: space-between;
      padding:12px 16px;
      border-bottom: 1px solid var(--border-default, #eaecf0);
      background: var(--bg-surface, #ffffff);
      position: sticky;
      top: 44px;
      z-index: 40;
    }
    .dh-live-main {
      flex: 1;
      min-width: 0;
      padding: 20px 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: var(--bg-surface, #ffffff);
    }
    .dh-live-search-btn { display: none; }
    .dh-live-mobile-subcontrols { display: none; }
    .dh-row-mobile { display: none; }
    .dh-live-drawer-overlay {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 9998;
      background: rgba(15, 23, 42, 0.45);
    }
    .dh-live-drawer-overlay.is-open { display: flex; }
    .dh-live-drawer-panel {
      width: 248px;
      height: 100%;
      background: var(--bg-surface, #ffffff);
      border-right: 1px solid var(--border-default, #eaecf0);
      padding: 16px 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow-y: auto;
    }
    [data-theme="dark"] .dh-live-app,
    [data-theme="dark"] .dh-live-sidebar,
    [data-theme="dark"] .dh-live-rail,
    [data-theme="dark"] .dh-live-mobile-header,
    [data-theme="dark"] .dh-live-main,
    [data-theme="dark"] .dh-live-drawer-panel { background: #111827; border-color: #1f2937; color: #f9fafb; }
    [data-theme="dark"] .dh-group-card { background: #1f2937; border-color: #374151; }
    [data-theme="dark"] .dh-row { border-color: #374151; }
    [data-theme="dark"] .dh-row-title, [data-theme="dark"] .dh-page-title { color: #f9fafb; }
    @media (max-width: 1023px) {
      .dh-live-sidebar { display: none !important; }
      .dh-live-rail { display: flex !important; }
      .dh-live-main { padding: 16px 18px 24px; }
      .dh-live-search-desktop { display: none !important; }
      .dh-live-search-btn { display: inline-flex !important; }
      .dh-col-head { display: none !important; }
    }
    @media (max-width: 600px) {
      .dh-live-app { flex-direction: column; }
      .dh-live-rail { display: none !important; }
      .dh-live-mobile-header { display: flex !important; }
      .dh-topbar { display: none !important; }
      .dh-desktop-tabs-row { display: none !important; }
      .dh-live-mobile-subcontrols { display: flex !important; flex-direction: column; gap:8px; }
      .dh-live-main { padding:16px 12px 24px; gap: 12px; }
      .dh-row-desktop { display: none !important; }
      .dh-row-mobile { display: flex !important; flex-direction: column; align-items: stretch; gap: 8px; }
      .dh-footer { flex-direction: column; align-items: flex-start; gap:8px; }
    }
  </style>
</head>
<body>
  ${buildStandaloneExportHud('History — De Studio')}
  <div class="dh-live-app">
    <aside class="dh-live-sidebar" aria-label="Desktop Sidebar">
      ${navSidebarInner}
    </aside>

    <aside class="dh-live-rail" aria-label="Tablet Icon Rail">
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;width:100%;">
        <div style="padding:2px 0 10px;" title="De Studio">${markLogo}</div>
        <button type="button" class="dh-rail-btn is-muted" title="Dashboard" onclick="showToast('Dashboard')">${dhSvg('dashboard')}</button>
        <button type="button" class="dh-rail-btn is-muted" title="Reports" onclick="showToast('Reports')">${dhSvg('reports')}</button>
        <button type="button" class="dh-rail-btn" title="Detection" onclick="showToast('Detection')">${dhSvg('detection')}</button>
        <button type="button" class="dh-rail-btn is-active" title="History" onclick="showToast('History')">${dhSvg('history')}</button>
        <button type="button" class="dh-rail-btn" title="Documentations" onclick="showToast('Documentations')">${dhSvg('docs')}</button>
        <button type="button" class="dh-rail-btn" title="Help & Support" onclick="showToast('Help & Support')">${dhSvg('help')}</button>
        <div class="dh-rail-suite-lbl">Suite</div>
        <button type="button" class="dh-rail-btn" title="Media SaS" onclick="showToast('Media SaS')">${dhSvg('drm')}</button>
        <button type="button" class="dh-rail-btn" title="Content ID" onclick="showToast('Content ID')">${dhSvg('wave')}</button>
        <button type="button" class="dh-rail-btn" title="License Guard" onclick="showToast('License Guard')">${dhSvg('lock')}</button>
      </div>
      <span class="dh-avatar" title="Alex Morgan • Admin">AM</span>
    </aside>

    <div class="dh-live-mobile-header">
      <div style="display:flex;align-items:center;gap:8px;min-width:0;">
        <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="toggleDrawer(true)" aria-label="Menu">${dhSvg('menu')}</button>
        ${markLogo}
        <span class="dh-page-title">History</span>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button type="button" class="dh-icon-sq" style="width:32px;height:32px;" onclick="toggleCompactSearch()" aria-label="Search">${dhSvg('search')}</button>
        <button type="button" class="dh-cta-primary" style="height:32px;padding:0 10px;" onclick="addDetection()">${dhSvg('plus')}<span>New</span></button>
      </div>
    </div>

    <div class="dh-live-drawer-overlay" id="dhDrawerOverlay" onclick="if(event.target===this)toggleDrawer(false)">
      <aside class="dh-live-drawer-panel">
        ${navSidebarInner}
        <button type="button" class="dh-cta-primary" style="margin-top:12px;width:100%;" onclick="toggleDrawer(false)">Close Menu</button>
      </aside>
    </div>

    <main class="dh-live-main">
      <div class="dh-topbar">
        <div class="dh-topbar-left">
          <h2 class="dh-page-title">History</h2>
          <div class="dh-search-box dh-live-search-desktop">
            ${dhSvg('search')}
            <input type="text" id="searchInputDesktop" placeholder="Search ..." oninput="onSearchInput(this.value)" />
          </div>
          <button type="button" class="dh-icon-sq dh-live-search-btn" onclick="toggleCompactSearch()" title="Search">${dhSvg('search')}</button>
        </div>
        <div class="dh-topbar-right">
          <select class="dh-select-merchant" id="merchantSelectDesktop" onchange="onMerchantChange(this.value)">
            <option value="all">Select merchant -</option>
            <option value="Northwind Media">Northwind Media</option>
            <option value="Velo Streaming">Velo Streaming</option>
            <option value="Atlas Broadcast">Atlas Broadcast</option>
          </select>
          <button type="button" class="dh-icon-sq" onclick="showToast('Opened Advanced Filters')" title="Advanced Filters">${dhSvg('sliders')}</button>
          <button type="button" class="dh-cta-primary" onclick="addDetection()">New detection</button>
        </div>
      </div>

      <div id="compactSearchRow" style="display:none;max-width:360px;">
        <div class="dh-search-box" style="max-width:100%;width:100%;">
          ${dhSvg('search')}
          <input type="text" id="searchInputCompact" placeholder="Search title or ID..." oninput="onSearchInput(this.value)" />
        </div>
      </div>

      <div class="dh-tabs-row dh-desktop-tabs-row" id="tabsRowDesktop"></div>

      <div class="dh-live-mobile-subcontrols">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
          <div class="dh-tabs-row" id="tabsRowMobile"></div>
          <select class="dh-select-merchant" id="merchantSelectMobile" style="height:30px;font-size:11.5px;flex:1;min-width:130px;" onchange="onMerchantChange(this.value)">
            <option value="all">Select merchant -</option>
            <option value="Northwind Media">Northwind Media</option>
            <option value="Velo Streaming">Velo Streaming</option>
            <option value="Atlas Broadcast">Atlas Broadcast</option>
          </select>
        </div>
      </div>

      <section id="procSection">
        <div class="dh-section-head">
          <div class="dh-section-title">${dhSvg('gear')}<span>Processing ...</span></div>
          <span class="dh-section-count" id="procCountLabel">3 items</span>
        </div>
        <div class="dh-group-card">
          <div class="dh-col-head"><span>DATE</span><span>Succeeded</span><span>Denied</span><span>Failed</span><span>Total</span><span></span></div>
          <div id="procRowsContainer"></div>
        </div>
      </section>

      <section id="compSection">
        <div class="dh-section-head">
          <div class="dh-section-title">${dhSvg('history')}<span>History</span></div>
          <span class="dh-section-count" id="compCountLabel">132 items</span>
        </div>
        <div class="dh-group-card">
          <div class="dh-col-head"><span>DATE</span><span>Succeeded</span><span>Denied</span><span>Failed</span><span>Total</span><span></span></div>
          <div id="compRowsContainer"></div>
        </div>
      </section>

      <footer class="dh-footer">
        <div class="dh-footer-left">
          <span>Display</span>
          <select class="dh-select-merchant" style="height:28px;font-size:11.5px;padding:0 8px;" onchange="hState.pageSize=parseInt(this.value,10);hState.pageIndex=1;renderHistory();">
            <option value="5">5 items</option>
            <option value="10" selected>10 items</option>
            <option value="20">20 items</option>
          </select>
        </div>
        <div class="dh-footer-right">
          <span id="pageRangeLabel">1 - 10 / 60</span>
          <div style="display:inline-flex;gap:4px;">
            <button type="button" class="dh-page-btn" id="prevPageBtn" onclick="hState.pageIndex=Math.max(1,hState.pageIndex-1);renderHistory();">${dhSvg('chevL')}</button>
            <button type="button" class="dh-page-btn" id="nextPageBtn" onclick="hState.pageIndex=Math.min(6,hState.pageIndex+1);renderHistory();">${dhSvg('chevR')}</button>
          </div>
        </div>
      </footer>
    </main>
  </div>
  <div class="ds-export-toast" id="dsExportToast"></div>
  <script>
${STANDALONE_EXPORT_HUD_JS}
    var PROC_ROWS = ${procJson};
    var COMP_ROWS = ${compJson};
    var EXT_BOX = ${JSON.stringify(dhSvg('extBox'))};
    var CHEV_R = ${JSON.stringify(dhSvg('chevR'))};
    var hState = { filterTab: 'all', search: '', merchant: 'all', pageSize: 10, pageIndex: 1, compactSearchOpen: false };

    function pillHtml(status) {
      var m = { 'Processing': 'dh-st-processing', 'Queuing...': 'dh-st-queuing', 'Succeeded': 'dh-st-succeeded', 'Denied': 'dh-st-denied', 'Failed': 'dh-st-failed' };
      return '<span class="dh-status-pill ' + (m[status] || 'dh-st-queuing') + '">' + status + '</span>';
    }
    function toggleDrawer(open) {
      document.getElementById('dhDrawerOverlay').classList.toggle('is-open', !!open);
    }
    function toggleCompactSearch() {
      hState.compactSearchOpen = !hState.compactSearchOpen;
      document.getElementById('compactSearchRow').style.display = hState.compactSearchOpen ? 'block' : 'none';
    }
    function onSearchInput(val) {
      hState.search = val;
      document.getElementById('searchInputDesktop').value = val;
      document.getElementById('searchInputCompact').value = val;
      renderHistory();
    }
    function onMerchantChange(val) {
      hState.merchant = val;
      document.getElementById('merchantSelectDesktop').value = val;
      document.getElementById('merchantSelectMobile').value = val;
      renderHistory();
    }
    function addDetection() {
      var rnd = Math.floor(100000000 + Math.random() * 899999999);
      PROC_ROWS.unshift({ title: 'Live Video Stream Watermark #' + (PROC_ROWS.length + 1), id: 'ID' + rnd, status: 'Processing', start: '12-11-2026 10:15:00', end: '12-11-2026 10:25:00', merchant: 'Northwind Media' });
      showToast('Started detection ID' + rnd);
      renderHistory();
    }
    function buildRowsHtml(list) {
      if (!list.length) return '<div style="padding:16px;text-align:center;font-size:12px;color:#667085;">No matching detection records.</div>';
      return list.map(function(row) {
        var note = row.title + ' (' + row.id + ') • ' + row.status;
        return '<div class="dh-row dh-row-desktop" onclick="showToast(\\'' + note.replace(/'/g, '') + '\\')"><div class="dh-row-main"><span class="dh-row-thumb">' + EXT_BOX + '</span><div style="min-width:0;"><div class="dh-row-title">' + row.title + '</div><div class="dh-row-id">' + row.id + '</div></div></div><div class="dh-status-cell">' + pillHtml(row.status) + '</div><div class="dh-date-col"><div>' + row.start + '</div><div>' + row.end + '</div></div><span class="dh-row-chev">' + CHEV_R + '</span></div>' +
               '<div class="dh-row dh-row-mobile" onclick="showToast(\\'' + note.replace(/'/g, '') + '\\')"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px;"><div class="dh-row-main"><span class="dh-row-thumb">' + EXT_BOX + '</span><div style="min-width:0;"><div class="dh-row-title">' + row.title + '</div><div class="dh-row-id">' + row.id + '</div></div></div><span class="dh-row-chev">' + CHEV_R + '</span></div><div class="dh-mobile-meta-row">' + pillHtml(row.status) + '<div class="dh-date-col"><div>' + row.start + '</div><div style="color:#667085;">' + row.end + '</div></div></div></div>';
      }).join('');
    }
    function renderHistory() {
      var tabBtns = ['all', 'processing', 'completed'].map(function(tKey) {
        var lbl = tKey === 'all' ? 'All' : (tKey === 'processing' ? 'Processing' : 'Completed');
        return '<button type="button" class="dh-filter-pill ' + (hState.filterTab === tKey ? 'is-active' : '') + '" onclick="hState.filterTab=\\'' + tKey + '\\';renderHistory();">' + lbl + '</button>';
      }).join('');
      document.getElementById('tabsRowDesktop').innerHTML = tabBtns;
      document.getElementById('tabsRowMobile').innerHTML = tabBtns;

      var q = hState.search.trim().toLowerCase();
      var match = function(r) {
        return (hState.merchant === 'all' || r.merchant === hState.merchant) && (!q || r.title.toLowerCase().indexOf(q) >= 0 || r.id.toLowerCase().indexOf(q) >= 0 || r.status.toLowerCase().indexOf(q) >= 0);
      };
      var pList = PROC_ROWS.filter(match);
      var cList = COMP_ROWS.filter(match);
      document.getElementById('procSection').style.display = (hState.filterTab === 'all' || hState.filterTab === 'processing') ? 'block' : 'none';
      document.getElementById('compSection').style.display = (hState.filterTab === 'all' || hState.filterTab === 'completed') ? 'block' : 'none';
      document.getElementById('procCountLabel').textContent = pList.length + ' items';
      document.getElementById('compCountLabel').textContent = (cList.length + (q || hState.merchant !== 'all' ? 0 : 129)) + ' items';
      document.getElementById('procRowsContainer').innerHTML = buildRowsHtml(pList);
      document.getElementById('compRowsContainer').innerHTML = buildRowsHtml(cList);
      var sNum = (hState.pageIndex - 1) * hState.pageSize + 1;
      var eNum = Math.min(60, hState.pageIndex * hState.pageSize);
      document.getElementById('pageRangeLabel').textContent = sNum + ' - ' + eNum + ' / 60';
      document.getElementById('prevPageBtn').disabled = hState.pageIndex <= 1;
      document.getElementById('nextPageBtn').disabled = hState.pageIndex >= 6;
    }
    renderHistory();
  <\/script>
</body>
</html>`;
    }

    function renderPagePreviewHtmlForExport(page) {
      if (!page) return '';
      if (page.id === 'colors') return renderColorsPage();
      if (page.id === 'typography') return renderTypographyPage();
      if (page.id === 'icons') return renderIconsPage();
      if (page.id === 'logos') return renderLogosPage();
      if (page.id === 'effect-styles') return renderEffectsPage();
      if (page.id === 'grids-spacing') return renderGridsSpacingPage();
      if (page.id === 'buttons') return renderButtonsPage();
      if (page.id === 'button-group') return renderButtonGroupPage();
      if (page.id === 'badges') return renderBadgesPage();
      if (page.id === 'checkboxes') return renderCheckboxesPage();
      if (page.id === 'dropdowns') return renderDropdownsPage();
      if (page.id === 'filter-sort') return renderFilterSortPage();
      if (page.id === 'inputs-text-area') return renderInputsTextAreaPage();
      if (page.id === 'player') return renderPlayerPage();
      if (page.id === 'progress-indicators') return renderProgressIndicatorsPage();
      if (page.id === 'alert') return renderAlertPage();
      if (page.id === 'toggles') return renderTogglesPage();
      if (page.id === 'tooltips') return renderTooltipsPage();
      if (page.id === 'search-filters') return renderSearchFiltersPage();
      if (page.id === 'modals-popup') return renderModalsPopupPage();
      if (page.id === 'navigation') return renderNavigationPage();
      if (page.id === 'pagination') return renderPaginationPage();
      if (page.id === 'section-headers') return renderSectionHeadersPage();
      if (page.id === 'tables') return renderTablesPage();
      if (page.id === 'dashboard') return renderDashboardPage();
      if (page.id === 'header-navigation') return renderHeaderNavigationPage();
      if (page.id === 'processing-upload') return renderProcessingUploadPage();

      return `
        <div class="page-header-card">
          <div class="page-category-tag">${escapeHTML(page.sectionTitle || 'COMPONENT')}</div>
          <h1 class="page-title">${escapeHTML(page.name)}</h1>
          <p class="page-desc">${escapeHTML(page.desc || '')}</p>
        </div>
        ${getRichPreviewContent(page)}
      `;
    }

    function buildStandaloneGenericDSPageHTML(page) {
      const tokensAndCss = getExportStudioBaseCSS();
      let rawBodyHtml = '';
      if (page.id === activePageId && currentViewMode === 'preview') {
        const liveFrame = document.getElementById('canvasFrame');
        if (liveFrame && liveFrame.innerHTML.trim()) rawBodyHtml = liveFrame.innerHTML;
      }
      if (!rawBodyHtml) {
        rawBodyHtml = renderPagePreviewHtmlForExport(page);
      }
      rawBodyHtml = inlineLocalLogosForStandaloneHtml(rawBodyHtml);

      return `<!DOCTYPE html>
<html lang="${uiLang}" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHTML(page.name)} — De Studio Design System</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
${tokensAndCss}
${STANDALONE_EXPORT_HUD_CSS}
    .ds-export-main {
      max-width: 1280px;
      margin: 0 auto;
      padding: 24px 28px 48px;
      box-sizing: border-box;
    }
    .ds-export-main img { max-width: 100%; }
    .ds-export-main table { width: 100%; }
    .ds-export-main .tbl-wrap,
    .ds-export-main .color-group-wrap,
    .ds-export-main .color-table-head-row { overflow-x: auto; }
    @media (max-width: 1023px) {
      .ds-export-main { padding:16px 16px 36px; }
      .ds-export-main .btn-config-bar,
      .ds-export-main .spec-grid,
      .ds-export-main .ds-grid-3,
      .ds-export-main .db-grid-3,
      .ds-export-main .md-showcase-grid,
      .ds-export-main .nav-showcase-grid,
      .ds-export-main .comp-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .ds-export-main .db-grid-2,
      .ds-export-main .colors-summary-row {
        grid-template-columns: 1fr !important;
      }
    }
    @media (max-width: 600px) {
      .ds-export-main { padding: 12px 10px 28px; }
      .ds-export-main .colors-topbar,
      .ds-export-main .ds-card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      .ds-export-main .btn-config-bar,
      .ds-export-main .spec-grid,
      .ds-export-main .ds-grid-2,
      .ds-export-main .ds-grid-3,
      .ds-export-main .db-grid-2,
      .ds-export-main .db-grid-3,
      .ds-export-main .swatch-grid,
      .ds-export-main .colors-summary-row,
      .ds-export-main .md-showcase-grid,
      .ds-export-main .nav-showcase-grid,
      .ds-export-main .comp-grid,
      .ds-export-main .al-2col,
      .ds-export-main .pu-variants-grid {
        grid-template-columns: 1fr !important;
      }
      .ds-export-main .btn-ds-seg {
        width: 100%;
        flex-wrap: wrap;
      }
      .ds-export-main h1 { font-size: 20px !important; }
    }
  </style>
</head>
<body>
  ${buildStandaloneExportHud(`${page.name} — De Studio`)}
  <main class="ds-export-main" id="dsExportRoot">
    ${rawBodyHtml}
  </main>
  <div class="ds-export-toast" id="dsExportToast"></div>
  <script>
${STANDALONE_EXPORT_HUD_JS}
    // Lightweight interactive bindings inside standalone exported DS pages
    document.addEventListener('click', function(e) {
      var closeAlert = e.target.closest('.al-close, .ds-alert-close');
      if (closeAlert) {
        var box = closeAlert.closest('.al-banner, .ds-alert, [role="alert"]');
        if (box) { box.style.opacity = '0.35'; showToast('Alert dismissed'); }
        return;
      }
      var tabBtn = e.target.closest('.btn-ds-seg button, .ds-seg button');
      if (tabBtn && tabBtn.parentElement) {
        Array.from(tabBtn.parentElement.children).forEach(function(c) { c.classList.remove('active'); });
        tabBtn.classList.add('active');
      }
    });
    // Auto-shim studio inline callbacks present in exported markup to prevent ReferenceErrors
    (function bindExportSafeHandlers() {
      var matches = (document.getElementById('dsExportRoot').innerHTML || '').matchAll(/\\bon(?:click|change|input|submit)=["']([a-zA-Z_$][a-zA-Z0-9_$]*)\\s*\\(/g);
      for (var m of matches) {
        var fnName = m[1];
        if (fnName && typeof window[fnName] !== 'function') {
          window[fnName] = (function(name) {
            return function() { showToast('Standalone Preview • ' + name); };
          })(fnName);
        }
      }
    })();
  <\/script>
</body>
</html>`;
    }

    function buildFullStandalonePageHTML(page) {
      if (!page) return '';
      if (page.id === 'login-demo') return buildStandaloneLoginHTML(page);
      if (page.id === 'demo-history') return buildStandaloneHistoryHTML(page);
      if (page.id === 'demo-dashboard') return buildStandaloneDashboardDemoHTML(page);
      if (page.id === 'demo-merchant-modal') return buildStandaloneMerchantModalHTML(page);
      return buildStandaloneGenericDSPageHTML(page);
    }

    function downloadCurrentPageHTML(pageId) {
      const targetId = pageId || activePageId;
      const page = findPageById(targetId) || findPageById(activePageId);
      if (!page) return;
      const fullHtml = buildFullStandalonePageHTML(page);
      const slug = getExportSlug(page.name, page.id);
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

    function exportCurrentHTML() {
      const page = findPageById(activePageId);
      copyText(getSampleHTMLForPage(page));
    }

    function copyText(text, customMsg) {
      if (!text) return;
      const msg = customMsg || t('Đã sao chép mã vào clipboard', 'Copied code to clipboard');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => showToast(msg))
          .catch(() => fallbackCopyText(text, msg));
      } else {
        fallbackCopyText(text, msg);
      }
    }

    function escapeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function showToast(msg) {
      const el = document.getElementById('toast');
      el.textContent = (uiLang === 'en' && typeof translateTextValue === 'function')
        ? translateTextValue(String(msg || ''))
        : msg;
      el.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
    }

    // Keyboard shortcut Ctrl+K for sidebar search
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const box = document.getElementById('sidebarSearchBox');
        if (!box.classList.contains('open')) toggleSidebarSearch();
        else document.getElementById('pageSearchInput').focus();
      } else if (e.key === 'Escape' && typeof mdState !== 'undefined' && mdState.liveModal) {
        mdCloseLive();
      }
    });

    // =========================================================================