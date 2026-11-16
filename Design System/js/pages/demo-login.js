    // 2Z. FORMS DEMO: LOGIN & SIGN UP (3 Breakpoints + Unsplash + De Studio DS)
    // =========================================================================
    const AUTH_DEMO_STORAGE_KEY = 'destudio_auth_demo_v1';

    const AUTH_UNSPLASH_BACKGROUNDS = [
      {
        id: 'aurora-mesh',
        label: 'Unsplash Aurora',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1400&q=80',
        fallbackGrad: 'linear-gradient(135deg, #312e81 0%, #4f46e5 45%, #ec4899 100%)'
      },
      {
        id: 'pastel-glass',
        label: 'Unsplash Glass',
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1400&q=80',
        fallbackGrad: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 52%, #f472b6 100%)'
      },
      {
        id: 'studio-wave',
        label: 'Unsplash Studio',
        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1400&q=80',
        fallbackGrad: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #38bdf8 100%)'
      },
      {
        id: 'cloud-horizon',
        label: 'Unsplash Horizon',
        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&w=1400&q=80',
        fallbackGrad: 'linear-gradient(135deg, #1e293b 0%, #2563eb 50%, #6366f1 100%)'
      }
    ];

    const AUTH_SHOWCASE_SLIDES = [
      {
        badge: 'DE STUDIO CLOUD',
        title: 'All-in-One Creative Studio Platform',
        desc: 'Collaborate across web, tablet, and mobile workspaces with unified design tokens and real-time asset sync.',
        metricLabel: 'Active Workspaces',
        metricVal: '14,820+',
        statusText: '99.98% Uptime'
      },
      {
        badge: 'SECURITY & SSO',
        title: 'Enterprise-Grade Access Control',
        desc: 'Protect team projects with single sign-on, granular role permissions, and instant audit trails across regions.',
        metricLabel: 'Protected Teams',
        metricVal: '3,400+',
        statusText: 'SOC2 Ready'
      },
      {
        badge: 'MEDIA PIPELINE',
        title: 'Fast Cloud Rendering & Delivery',
        desc: 'Process high-resolution media assets and distribute responsive components globally in seconds.',
        metricLabel: 'Avg Latency',
        metricVal: '24 ms',
        statusText: 'Global CDN'
      },
      {
        badge: 'DESIGN SYSTEM 1.0',
        title: 'Built with Reusable UI Foundations',
        desc: 'Every input, button, badge, and layout in this login shell inherits directly from De Studio tokens.',
        metricLabel: 'Token Synced',
        metricVal: '100%',
        statusText: '3 Breakpoints'
      }
    ];

    let authDemoState = {
      viewMode: 'matrix', // 'matrix' | 'interactive'
      liveFlow: 'login',  // 'signup' | 'login'
      liveBp: 'desktop',  // 'desktop' | 'tablet' | 'mobile'
      bgId: 'aurora-mesh',
      slideIdx: 0,
      lang: 'en',         // 'en' | 'vi'
      email: 'alex.morgan@destudio.io',
      password: 'password123',
      confirmPassword: '',
      showPassword: false,
      showConfirm: false,
      lastMessage: ''
    };
    try {
      const savedAuth = localStorage.getItem(AUTH_DEMO_STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && typeof parsed === 'object') authDemoState = Object.assign({}, authDemoState, parsed);
      }
    } catch (_) {}

    function saveAuthDemoState() {
      try { localStorage.setItem(AUTH_DEMO_STORAGE_KEY, JSON.stringify(authDemoState)); } catch (_) {}
    }

    window.setAuthDemoProp = function(key, val) {
      authDemoState[key] = val;
      saveAuthDemoState();
      renderCanvas();
    };
    window.setAuthInputVal = function(key, val) {
      authDemoState[key] = val;
      saveAuthDemoState();
    };
    window.toggleAuthFlag = function(key) {
      authDemoState[key] = !authDemoState[key];
      saveAuthDemoState();
      renderCanvas();
    };
    window.submitAuthDemo = function(flowType) {
      const em = (authDemoState.email || '').trim();
      if (!em || !em.includes('@')) {
        authDemoState.lastMessage = authDemoState.lang === 'vi'
          ? 'Vui lòng nhập địa chỉ email hợp lệ.'
          : 'Please enter a valid email address.';
        saveAuthDemoState();
        renderCanvas();
        return;
      }
      if (flowType === 'signup' && (!authDemoState.password || authDemoState.password.length < 6)) {
        authDemoState.lastMessage = authDemoState.lang === 'vi'
          ? 'Mật khẩu cần tối thiểu 6 ký tự.'
          : 'Password must be at least 6 characters.';
        saveAuthDemoState();
        renderCanvas();
        return;
      }
      const actionLabel = flowType === 'google'
        ? 'Google SSO'
        : flowType === 'signup'
          ? (authDemoState.lang === 'vi' ? 'Đăng ký tài khoản mới' : 'Create account')
          : (authDemoState.lang === 'vi' ? 'Đăng nhập bằng Email' : 'Email Sign-in');
      authDemoState.lastMessage = `${actionLabel} • ${em} (De Studio Workspace Ready)`;
      saveAuthDemoState();
      showToast(authDemoState.lastMessage);
      renderCanvas();
    };
    window.resetAuthDemo = function() {
      authDemoState = {
        viewMode: 'matrix',
        liveFlow: 'login',
        liveBp: 'desktop',
        bgId: 'aurora-mesh',
        slideIdx: 0,
        lang: 'en',
        email: 'alex.morgan@destudio.io',
        password: 'password123',
        confirmPassword: '',
        showPassword: false,
        showConfirm: false,
        lastMessage: ''
      };
      try { localStorage.removeItem(AUTH_DEMO_STORAGE_KEY); } catch (_) {}
      renderCanvas();
      showToast('Đã khôi phục cấu hình Login Demo mặc định');
    };

    function authEyeSvg(open) {
      return open
        ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></svg>`
        : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a21.81 21.81 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a21.85 21.85 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    }

    function authGoogleSvg() {
      return `<svg width="14" height="14" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.2-1.5 3.6-5.4 3.6-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.1 14.6 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.8 0 9.6-4.1 9.6-9.8 0-.7-.1-1.2-.2-2H12z"/></svg>`;
    }

    function authFlagSvg(lang) {
      if (lang === 'vi') {
        return `<svg class="auth-flag-svg" width="14" height="14" viewBox="0 0 24 24" style="border-radius:999px;"><circle cx="12" cy="12" r="11" fill="#DA251D"/><polygon points="12,5.5 13.7,10.5 19,10.5 14.7,13.6 16.3,18.6 12,15.5 7.7,18.6 9.3,13.6 5,10.5 10.3,10.5" fill="#FFCD00"/></svg>`;
      }
      return `<svg class="auth-flag-svg" width="14" height="14" viewBox="0 0 24 24" style="border-radius:999px;"><circle cx="12" cy="12" r="11" fill="#012169"/><path d="M2 12h20M12 2v20" fill="none" stroke="#fff" stroke-width="4"/><path d="M2 12h20M12 2v20" fill="none" stroke="#C8102E" stroke-width="2.2"/></svg>`;
    }

    function getCurrentAuthBg() {
      return AUTH_UNSPLASH_BACKGROUNDS.find(b => b.id === authDemoState.bgId) || AUTH_UNSPLASH_BACKGROUNDS[0];
    }

    function renderAuthBrandHeader(interactiveLang) {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
      const nextLang = authDemoState.lang === 'en' ? 'vi' : 'en';
      return `
        <div class="auth-form-topbar">
          <div style="display:inline-flex;align-items:center;min-width:0;">
            ${renderLogoMarkup(horiz, 'height:22px;width:auto;display:block;')}
          </div>
          <button type="button" class="auth-lang-btn" onclick="${interactiveLang ? `setAuthDemoProp('lang','${nextLang}')` : `showToast('Ngôn ngữ giao diện: ${authDemoState.lang.toUpperCase()}')`}" title="Chuyển ngôn ngữ EN / VI">
            ${authFlagSvg(authDemoState.lang)}
            <span>${authDemoState.lang === 'vi' ? 'VI' : 'EN'}</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      `;
    }

    function renderAuthFormBody(flowType, headingOverride, interactiveInputs) {
      const isVi = authDemoState.lang === 'vi';
      const isSignup = flowType === 'signup';
      const brandLabel = escapeHTML(logosState.brandName || 'De Studio');
      const titleText = headingOverride || (isSignup
        ? (isVi ? 'Tạo tài khoản mới' : 'Create new account')
        : (isVi ? 'Đăng nhập hoặc đăng ký nhanh' : 'Log in or sign up in seconds'));
      const subText = isVi
        ? `Sử dụng email công việc hoặc Google để tiếp tục với ${brandLabel} Workspace.`
        : `Use your email or another service to continue with ${brandLabel} Cloud Ecosystem.`;

      const emailVal = escapeHTML(authDemoState.email || 'alex.morgan@destudio.io');
      const passType = authDemoState.showPassword ? 'text' : 'password';
      const confirmType = authDemoState.showConfirm ? 'text' : 'password';
      const switchPrompt = isSignup
        ? (isVi ? 'Đã có tài khoản?' : 'Have an account?')
        : (isVi ? 'Chưa có tài khoản?' : 'New to De Studio?');
      const switchCta = isSignup
        ? (isVi ? 'Đăng nhập' : 'Log In')
        : (isVi ? 'Tạo tài khoản' : 'Sign Up');
      const targetFlow = isSignup ? 'login' : 'signup';

      return `
        <div>
          <h3 class="auth-form-title">${titleText}</h3>
          <p class="auth-form-sub">${subText}</p>
        </div>

        <div style="display:flex;flex-direction:column;gap:8px;margin-top:16px;">
          ${!isSignup ? `
            <button type="button" class="auth-btn-google" onclick="submitAuthDemo('google')">
              ${authGoogleSvg()}
              <span>${isVi ? 'Tiếp tục với Google' : 'Sign up with Google'}</span>
            </button>
            <div class="auth-or-divider">${isVi ? 'hoặc' : 'or'}</div>
          ` : ''}

          <div class="auth-field-group">
            <label class="auth-label">${isSignup ? (isVi ? 'Email tài khoản' : 'Account Email') : 'Email'} ${isSignup ? '<span class="req">*</span>' : ''}</label>
            <div class="auth-input-wrap">
              <input type="email" value="${emailVal}" placeholder="alex.morgan@destudio.io"
                ${interactiveInputs ? `oninput="setAuthInputVal('email', this.value)"` : 'readonly'} />
            </div>
          </div>

          <div class="auth-field-group">
            <label class="auth-label">${isVi ? 'Mật khẩu' : 'Password'} ${isSignup ? '<span class="req">*</span>' : ''}</label>
            <div class="auth-input-wrap">
              <input type="${passType}" value="${isSignup ? escapeHTML(authDemoState.password || 'password123') : ''}" placeholder="${isVi ? 'Nhập mật khẩu của bạn' : 'Enter your password'}"
                ${interactiveInputs ? `oninput="setAuthInputVal('password', this.value)"` : 'readonly'} />
              <button type="button" class="auth-eye-btn" onclick="toggleAuthFlag('showPassword')" title="Hiện/Ẩn mật khẩu">
                ${authEyeSvg(authDemoState.showPassword)}
              </button>
            </div>
          </div>

          ${isSignup ? `
            <div class="auth-field-group">
              <label class="auth-label">${isVi ? 'Xác nhận mật khẩu' : 'Confirm Password'} <span class="req">*</span></label>
              <div class="auth-input-wrap">
                <input type="${confirmType}" value="${escapeHTML(authDemoState.confirmPassword || '')}" placeholder="${isVi ? 'Nhập lại mật khẩu' : 'Enter your password again'}"
                  ${interactiveInputs ? `oninput="setAuthInputVal('confirmPassword', this.value)"` : 'readonly'} />
                <button type="button" class="auth-eye-btn" onclick="toggleAuthFlag('showConfirm')" title="Hiện/Ẩn mật khẩu xác nhận">
                  ${authEyeSvg(authDemoState.showConfirm)}
                </button>
              </div>
            </div>
          ` : ''}

          <button type="button" class="auth-btn-primary" style="margin-top:4px;" onclick="submitAuthDemo('${flowType}')">
            ${isSignup
              ? (isVi ? 'Tạo tài khoản' : 'Create an account')
              : (isVi ? 'Tiếp tục với Email' : 'Continue with my email')}
          </button>
        </div>

        <div class="auth-switch-row">
          ${switchPrompt}
          <a class="auth-inline-link" onclick="setAuthDemoProp('liveFlow', '${targetFlow}')">${switchCta}</a>
        </div>

        <div class="auth-legal-note">
          ${isVi
            ? `Khi gửi biểu mẫu, bạn đồng ý với <a class="auth-inline-link" onclick="showToast('Mở Điều khoản Dịch vụ')">Điều khoản</a> và <a class="auth-inline-link" onclick="showToast('Mở Chính sách Bảo mật')">Chính sách Bảo mật</a> của ${brandLabel}.`
            : `By submitting this form you are creating a ${brandLabel} account, and you agree to our <a class="auth-inline-link" onclick="showToast('Opened Terms & Conditions')">Terms &amp; Conditions</a> and <a class="auth-inline-link" onclick="showToast('Opened Privacy Policy')">Privacy Policy</a>.`}
        </div>
      `;
    }

    function renderAuthDesktopVisualPane() {
      const bg = getCurrentAuthBg();
      const slide = AUTH_SHOWCASE_SLIDES[authDemoState.slideIdx] || AUTH_SHOWCASE_SLIDES[0];
      const whiteMark = logosState.items.find(i => i.id === 'logo-mark-mono-light') || logosState.items[0];
      return `
        <div class="auth-visual-pane" style="background-image:${bg.fallbackGrad};">
          <img class="auth-visual-photo" src="${bg.url}" alt="${escapeHTML(bg.label)}" onerror="this.style.display='none'" />
          <div class="auth-visual-overlay"></div>

          <div class="auth-visual-top" style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <span style="display:inline-flex;align-items:center;gap:8px;padding:4px 10px;border-radius:999px;background:rgba(15,23,42,0.45);border:1px solid rgba(255,255,255,0.22);font-size:10px;font-weight:700;letter-spacing:0.05em;">
              ${renderLogoMarkup(whiteMark, 'height:14px;width:auto;display:block;')}
              <span>${slide.badge}</span>
            </span>
            <span style="font-size:10px;font-weight:600;color:#f8fafc;background:rgba(15,23,42,0.58);border:1px solid rgba(255,255,255,0.22);padding:4px 8px;border-radius:999px;">v1.0</span>
          </div>

          <div class="auth-visual-bottom">
            <div class="auth-glass-widget" style="margin-bottom:16px;">
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
                <span style="font-size:10.5px;font-weight:600;color:#f1f5f9;">${slide.metricLabel}</span>
                <span style="font-size:10px;font-weight:700;color:#86efac;background:rgba(15,23,42,0.68);border:1px solid rgba(134,239,172,0.35);padding:2px 8px; box-sizing:border-box;border-radius:999px;">● ${slide.statusText}</span>
              </div>
              <div style="font-size:22px;font-weight:700;letter-spacing:-0.02em;line-height:1.15;">${slide.metricVal}</div>
              <div style="height:4px;border-radius:999px;background:rgba(255,255,255,0.22);margin-top:10px;overflow:hidden;">
                <div style="width:${55 + authDemoState.slideIdx * 12}%;height:100%;background:#ffffff;border-radius:999px;"></div>
              </div>
            </div>

            <div style="text-align:center;">
              <h4 style="font-size:17px;font-weight:700;letter-spacing:-0.015em;line-height:1.3;margin:0;">${slide.title}</h4>
              <p style="font-size:11.5px;color:rgba(255,255,255,0.86);margin:6px 0 0;line-height:1.5;">${slide.desc}</p>
            </div>

            <div class="auth-dots-row">
              ${AUTH_SHOWCASE_SLIDES.map((_, idx) => `
                <button type="button" class="auth-dot-pill ${idx === authDemoState.slideIdx ? 'is-active' : ''}" onclick="setAuthDemoProp('slideIdx', ${idx})" title="Slide ${idx + 1}"></button>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    }

    function renderAuthBreakpointFrame(bpType, flowType, interactiveInputs) {
      const bg = getCurrentAuthBg();
      const headingTablet = flowType === 'signup' && !interactiveInputs ? (authDemoState.lang === 'vi' ? 'Đăng nhập hoặc đăng ký nhanh' : 'Log in or sign up in seconds') : null;

      if (bpType === 'mobile') {
        return `
          <div class="auth-bp-stage is-mobile-stage">
            <div class="auth-card-shell is-mobile">
              ${renderAuthBrandHeader(interactiveInputs)}
              ${renderAuthFormBody(flowType, null, interactiveInputs)}
            </div>
          </div>
        `;
      }

      if (bpType === 'tablet') {
        return `
          <div class="auth-bp-stage" style="background-image:${bg.fallbackGrad};min-height:470px;">
            <div class="auth-stage-blur-bg" style="background-image:url('${bg.url}');"></div>
            <div class="auth-stage-scrim"></div>
            <div class="auth-card-shell is-tablet">
              ${renderAuthBrandHeader(interactiveInputs)}
              ${renderAuthFormBody(flowType, headingTablet, interactiveInputs)}
            </div>
          </div>
        `;
      }

      return `
        <div class="auth-bp-stage" style="background-image:${bg.fallbackGrad};min-height:480px;">
          <div class="auth-stage-blur-bg" style="background-image:url('${bg.url}');"></div>
          <div class="auth-stage-scrim"></div>
          <div class="auth-card-shell is-desktop-split">
            ${renderAuthDesktopVisualPane()}
            <div class="auth-form-pane">
              ${renderAuthBrandHeader(interactiveInputs)}
              <div style="flex:1;display:flex;flex-direction:column;justify-content:center;">
                ${renderAuthFormBody(flowType, null, interactiveInputs)}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function buildLoginDemoHTMLSnippet() {
      const horiz = logosState.items.find(i => i.id === 'logo-horizontal') || logosState.items[0];
      const bg = getCurrentAuthBg();
      return `<!-- De Studio 1.0 • Responsive Login & Sign Up Page (Desktop >=1024px / Tablet 601-1023px / Mobile <=600px) -->
<section class="auth-bp-stage" style="background-image:url('${bg.url}');">
  <div class="auth-card-shell is-desktop-split">
    <aside class="auth-visual-pane">
      <img class="auth-visual-photo" src="${bg.url}" alt="Studio backdrop" />
      <div class="auth-glass-widget">14,820+ Active Workspaces • 99.98% Uptime</div>
      <h4>All-in-One Creative Studio Platform</h4>
    </aside>
    <div class="auth-form-pane">
      <header class="auth-form-topbar">
        ${renderLogoMarkup(horiz, 'height:22px;width:auto;display:block;')}
        <button class="auth-lang-btn">EN ⌄</button>
      </header>
      <form class="auth-form-body">
        <button type="button" class="auth-btn-google">Sign up with Google</button>
        <div class="auth-or-divider">or</div>
        <label class="auth-label">Email</label>
        <input class="auth-input-wrap" type="email" placeholder="alex.morgan@destudio.io" />
        <label class="auth-label">Password</label>
        <input class="auth-input-wrap" type="password" placeholder="Enter your password" />
        <button type="submit" class="auth-btn-primary">Continue with my email</button>
      </form>
    </div>
  </div>
</section>`;
    }

    function renderLoginDemoPage() {
      return `
        <div class="auth-sheet">
          <!-- TOPBAR -->
          <div class="colors-topbar">
            <span class="effects-count-pill">2 Auth Flows (Sign Up &amp; Google SSO Login) × 3 Breakpoints (≤600 / 601–1023 / ≥1024)</span>
            <div class="colors-actions">
              <a href="DeSaaS.html" target="_blank" class="btn-ds primary" style="text-decoration:none;display:inline-flex;align-items:center;gap:4px;font-weight:600;">🚀 Mở DeSaaS App</a>
              <button type="button" class="btn-ds" onclick="resetAuthDemo()">↺ Khôi phục mặc định</button>
              <button type="button" class="btn-ds ai" onclick="copyText(buildLoginDemoHTMLSnippet(), 'Đã copy HTML trang Login')">Copy HTML Code</button>
              <button type="button" class="btn-ds" onclick="downloadCurrentPageHTML('login-demo')">↓ ${t('Tải HTML Responsive', 'Download HTML')}</button>
            </div>
          </div>

          <!-- HERO & CONTROLS -->
          <div class="auth-toolbar-card">
            <div>
              <div class="page-category-tag" style="margin-bottom:4px;">DEMO • LOGIN &amp; SIGN UP</div>
              <h1 style="font-size:24px;font-weight:700;color:var(--text-primary);letter-spacing:-0.02em;">${t('Login — Đăng nhập &amp; Đăng ký SaaS (De Studio)', 'Login — SaaS Sign Up &amp; Google SSO (De Studio)')}</h1>
              <p style="font-size:13px;color:var(--text-secondary);margin-top:4px;max-width:860px;line-height:1.55;">
                Tổng hợp từ các thành phần đã chuẩn hóa trong hệ thống: <strong>Logo De Studio</strong> (từ mục <em>Logos</em>), <strong>Inputs &amp; Eye Toggle</strong>, <strong>Buttons &amp; Google SSO</strong>, <strong>Language Dropdown</strong>, <strong>Pagination Dots</strong>, <strong>Glassmorphism Blur</strong> và ảnh nền từ <strong>Unsplash</strong>. Đã có ứng dụng độc lập tại <a href="DeSaaS.html" target="_blank" style="color:var(--brand-primary);font-weight:600;">DeSaaS.html</a>.
              </p>
            </div>

            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;padding-top:10px;border-top:1px solid #f1f5f9;">
              <div class="btn-ds-seg">
                <button type="button" class="${authDemoState.viewMode === 'matrix' ? 'active' : ''}" onclick="setAuthDemoProp('viewMode','matrix')">So sánh 6 màn hình (3 Breakpoints × 2 Flows)</button>
                <button type="button" class="${authDemoState.viewMode === 'interactive' ? 'active' : ''}" onclick="setAuthDemoProp('viewMode','interactive')">Thử nghiệm Tương tác (Live)</button>
              </div>

              <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                <span style="font-size:11px;font-weight:600;color:var(--text-secondary);">Ảnh nền Unsplash:</span>
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
                  <h2 style="font-size:16px;font-weight:700;color:var(--text-primary);margin-top:6px;">Đăng ký Tài khoản mới (Create New Account)</h2>
                </div>
                <span style="font-size:11.5px;color:var(--text-secondary);">Mobile (≤ 600px) → Tablet (601–1023px) → Desktop Split (≥ 1024px)</span>
              </div>

              <div class="auth-flow-grid">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">1. Mobile (≤ 600px)</div>
                  ${renderAuthBreakpointFrame('mobile', 'signup', false)}
                </div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">2. Tablet Floating Card (601px – 1023px)</div>
                  ${renderAuthBreakpointFrame('tablet', 'signup', false)}
                </div>
              </div>

              <div style="margin-top:16px;">
                <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">3. Desktop Split Showcase + Unsplash Backdrop (≥ 1024px)</div>
                ${renderAuthBreakpointFrame('desktop', 'signup', false)}
              </div>
            </div>

            <!-- FLOW 2: LOG IN / GOOGLE SSO (3 BREAKPOINTS) -->
            <div class="auth-section-card">
              <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-bottom:14px;">
                <div>
                  <span class="ds-badge ds-badge-green">Flow 2 • Quick Login &amp; Google SSO</span>
                  <h2 style="font-size:16px;font-weight:700;color:var(--text-primary);margin-top:6px;">Đăng nhập nhanh với Google &amp; Email (Log In / Sign Up)</h2>
                </div>
                <span style="font-size:11.5px;color:var(--text-secondary);">Mobile (≤ 600px) → Tablet (601–1023px) → Desktop Split (≥ 1024px)</span>
              </div>

              <div class="auth-flow-grid">
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">1. Mobile (≤ 600px)</div>
                  ${renderAuthBreakpointFrame('mobile', 'login', false)}
                </div>
                <div>
                  <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">2. Tablet Floating Card (601px – 1023px)</div>
                  ${renderAuthBreakpointFrame('tablet', 'login', false)}
                </div>
              </div>

              <div style="margin-top:16px;">
                <div style="font-size:11px;font-weight:700;color:var(--text-secondary);margin-bottom:6px;">3. Desktop Split Showcase + Unsplash Backdrop (≥ 1024px)</div>
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