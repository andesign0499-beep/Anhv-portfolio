    // 8. INIT
    // =========================================================================
    applyUIThemeToChrome();
    syncBrandTokensToCSS();
    syncTypographyToCSS();
    syncEffectsToCSS();
    syncSpacingToCSS();
    syncLogosToAppChrome();
    applyUILanguageToChrome();
    renderSidebar();
    renderCanvas();
    updateAIContext();
    startLiveI18nObserver();

    // Live Palette synchronization from Builcolor (Storage Event + BroadcastChannel)
    function handleBuilcolorLiveSync() {
      if (typeof loadColorTabsState === 'function') {
        colorTabsState = loadColorTabsState();
      }
      if (typeof syncBrandTokensToCSS === 'function') {
        syncBrandTokensToCSS();
      }
      if (typeof renderCanvas === 'function') {
        renderCanvas();
      }
      if (typeof showToast === 'function') {
        showToast('⚡ Đã cập nhật toàn bộ bộ màu (Brand, Neutral & System Colors) từ Builcolor!');
      }
    }

    window.addEventListener('storage', function(e) {
      if (!e.key ||
          e.key === 'de_studio_active_brand_palette' ||
          e.key === 'de_studio_active_neutral_palette' ||
          e.key === 'de_studio_active_system_palette' ||
          e.key === 'de_studio_transparent_colors_v1' ||
          e.key === 'de_studio_color_tabs_v2' ||
          e.key === 'de_studio_active_button_gradient') {
        handleBuilcolorLiveSync();
      }
    });

    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('de_studio_color_sync');
        bc.onmessage = function(ev) {
          if (ev && ev.data && ev.data.type === 'BUILCOLOR_APPLY_ALL') {
            handleBuilcolorLiveSync();
          }
        };
      } catch (e) {}
    }

    // =========================================================================
    // AI PANEL COLLAPSE & EXPAND CONTROLLER
    // =========================================================================
    function toggleAIPanel(forceState) {
      const panel = document.querySelector('.ai-panel');
      const reopenTab = document.getElementById('aiReopenTab');
      const toggleBtn = document.getElementById('aiPanelToggleBtn');
      if (!panel) return;

      const currentlyCollapsed = panel.classList.contains('is-collapsed');
      const shouldOpen = typeof forceState === 'boolean' ? forceState : currentlyCollapsed;

      if (shouldOpen) {
        panel.classList.remove('is-collapsed');
        if (reopenTab) reopenTab.style.display = 'none';
        if (toggleBtn) {
          toggleBtn.classList.add('active');
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
        try { localStorage.setItem('ds_ai_panel_open', 'true'); } catch (e) {}
      } else {
        panel.classList.add('is-collapsed');
        if (reopenTab) reopenTab.style.display = 'flex';
        if (toggleBtn) {
          toggleBtn.classList.remove('active');
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
        try { localStorage.setItem('ds_ai_panel_open', 'false'); } catch (e) {}
      }
    }
    window.toggleAIPanel = toggleAIPanel;

    (function initAIPanelControls() {
      try {
        const saved = localStorage.getItem('ds_ai_panel_open');
        if (saved === 'false') {
          toggleAIPanel(false);
        }
      } catch (e) {}

      window.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'j' || e.key === 'J')) {
          e.preventDefault();
          toggleAIPanel();
        }
      });
    })();

    // Welcome message in Antigravity AI Panel
    appendAIMessage('ai', `
      <div class="msg-ai">
        <div style="font-weight:600; color:var(--text-primary); margin-bottom:4px;">${t('Xin chào! Studio Design System đã sẵn sàng.', 'Hello! Studio Design System is ready.')}</div>
        <div style="color:var(--text-secondary); line-height:1.5;">
          ${t(
            `Tôi đã dựng toàn bộ cấu trúc <b>${getAllPages().length} trang</b> từ cây thư mục Figma ở menu bên trái. Bạn có thể chọn bất kỳ trang nào để kiểm tra, hoặc gõ <code>/</code> để ra lệnh cho AI dựng nhanh giao diện SaaS ngay offline.`,
            `I have structured all <b>${getAllPages().length} pages</b> from your Figma navigation tree on the left. Select any page to inspect, or type <code>/</code> to compose ready-to-export SaaS interfaces offline.`
          )}
        </div>
      </div>
    `);