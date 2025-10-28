// Demo Orchestrator for Operator, Affiliate, and Victim flows
(function() {
  const DEMO_KEY = 'raas_demo_state';

  function getState() {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY)) || null; } catch { return null; }
  }
  function setState(state) {
    localStorage.setItem(DEMO_KEY, JSON.stringify(state));
  }
  function clearState() { localStorage.removeItem(DEMO_KEY); }

  function currentPage() {
    const path = (location.pathname || '').toLowerCase();
    return path.split('/').pop() || 'index.html';
  }

  function notify(msg) {
    try {
      if (window.dashboard && typeof window.dashboard.showNotification === 'function') {
        window.dashboard.showNotification(msg, 'info');
        return;
      }
      if (window.timelineManager && typeof window.timelineManager.showNotification === 'function') {
        window.timelineManager.showNotification(msg, 'info');
        return;
      }
      if (window.campaignBuilder && typeof window.campaignBuilder.showNotification === 'function') {
        window.campaignBuilder.showNotification(msg, 'info');
        return;
      }
    } catch {}

    // fallback toast
    const n = document.createElement('div');
    n.textContent = msg;
    n.style.cssText = 'position:fixed;top:16px;right:16px;background:#1a1a1acc;color:#fff;padding:10px 14px;border-radius:10px;z-index:9999;font:600 12px Inter,system-ui,Arial';
    document.body.appendChild(n);
    setTimeout(() => { n.remove(); }, 2000);
  }

  function go(url) {
    location.href = url;
  }

  // Scripted steps per role
  const scripts = {
    operator: [
      { desc: 'Go to Dashboard → Show revenue metrics', run: () => {
        if (currentPage() !== 'dashboard.html') { go('dashboard.html'); return 'nav'; }
        notify('Showing revenue metrics');
        const el = document.getElementById('stat-revenue');
        if (el) {
          el.classList.add('updated');
          setTimeout(() => el.classList.remove('updated'), 800);
        }
      }},
      { desc: 'Open Campaign Builder', run: () => { go('campaigns.html'); return 'nav'; } },
      { desc: 'Set ransom amount → Choose target sector', run: () => {
        if (currentPage() !== 'campaigns.html') { go('campaigns.html'); return 'nav'; }
        const amount = document.getElementById('ransom-amount');
        const sector = document.getElementById('target-sector');
        const name = document.getElementById('campaign-name');
        if (name) name.value = 'Enterprise Alpha';
        if (amount) amount.value = '0.150';
        if (sector) sector.value = 'healthcare';
        if (window.campaignBuilder) window.campaignBuilder.updatePreview?.();
        notify('Configured ransom and sector');
      }},
      { desc: 'Assign to affiliate', run: () => {
        const affiliate = document.getElementById('affiliate-select');
        if (affiliate) affiliate.value = 'affiliate-002';
        const split = document.getElementById('affiliate-split');
        if (split) {
          split.value = 60;
          const op = document.getElementById('operator-split');
          if (op) op.value = 40;
        }
        notify('Assigned to Affiliate-002');
      }},
      { desc: 'Launch campaign', run: () => {
        if (typeof window.launchCampaign === 'function') { window.launchCampaign(); }
        notify('Campaign launched');
      }},
      { desc: 'Monitor results → Check success rates', run: () => {
        go('dashboard.html');
        return 'nav';
      }}
    ],
    affiliate: [
      { desc: 'Switch to Affiliate view → See assigned campaigns', run: () => {
        if (currentPage() !== 'campaigns.html') { go('campaigns.html'); return 'nav'; }
        // Click affiliate role button if present
        const btn = Array.from(document.querySelectorAll('.role-btn')).find(b => b.dataset.role === 'affiliate');
        btn?.click();
        if (window.campaignBuilder) window.campaignBuilder.updateRoleView?.('affiliate');
        notify('Affiliate view: assigned campaigns');
      }},
      { desc: 'Check victim list → See potential targets', run: () => {
        go('victims.html');
        return 'nav';
      }},
      { desc: 'Monitor payments → Track earnings', run: () => {
        go('payments.html');
        return 'nav';
      }},
      { desc: 'View performance → Success rates', run: () => {
        go('dashboard.html');
        return 'nav';
      }}
    ],
    victim: [
      { desc: 'Switch to Victim view → See active threats', run: () => {
        if (currentPage() !== 'campaigns.html') { go('campaigns.html'); return 'nav'; }
        if (window.campaignBuilder) window.campaignBuilder.updateRoleView?.('victim');
        notify('Victim view: active threats shown');
      }},
      { desc: 'Read ransom note → Understand demand', run: () => {
        // Open ransom note preview using existing template
        if (document.getElementById('ransom-note')) {
          const sel = document.getElementById('ransom-note');
          sel.value = 'professional';
          if (typeof window.previewRansomNote === 'function') window.previewRansomNote();
        }
        notify('Ransom note displayed (simulation)');
      }},
      { desc: 'Simulate payment → Experience process', run: () => {
        if (typeof window.simulatePayment === 'function') window.simulatePayment();
        notify('Payment simulated');
      }},
      { desc: 'Check recovery → Files restored', run: () => {
        // Navigate to payments to verify paid, then timeline for decrypt
        go('payments.html');
        return 'nav';
      }},
      { desc: 'View timeline of decryption', run: () => {
        go('timeline.html');
        return 'nav';
      }}
    ]
  };

  function performStep(role, stepIndex) {
    const steps = scripts[role];
    if (!steps || stepIndex >= steps.length) {
      notify('Demo complete');
      clearState();
      updatePanel();
      return;
    }
    const result = steps[stepIndex].run();
    // If we navigated, advance state NOW so the next page continues with the next step
    if (result === 'nav') {
      const next = { role, step: stepIndex + 1 };
      setState(next);
      updatePanel();
      return;
    }
    // Otherwise, advance immediately
    const next = { role, step: stepIndex + 1 };
    setState(next);
    updatePanel();
  }

  // UI Panel
  let panel, titleEl, stepEl, nextBtn;
  function buildPanel() {
    panel = document.createElement('div');
    panel.id = 'demo-panel';
    panel.style.cssText = 'position:fixed;bottom:16px;right:16px;background:#0f0f12cc;border:1px solid #2a2a2a;border-radius:12px;padding:10px 12px;z-index:9999;color:#fff;backdrop-filter:blur(6px);box-shadow:0 8px 24px rgba(0,0,0,.35);min-width:240px;font-family:Inter,system-ui,Arial';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px';
    titleEl = document.createElement('div');
    titleEl.textContent = 'Demo: Idle';
    titleEl.style.cssText = 'font-weight:700;font-size:12px;letter-spacing:.4px';
    const close = document.createElement('button');
    close.textContent = '×';
    close.title = 'Hide demo panel';
    close.style.cssText = 'background:transparent;border:none;color:#aaa;font-size:16px;cursor:pointer;padding:0;margin:0 0 0 8px';
    close.onclick = () => panel.remove();
    header.appendChild(titleEl);
    header.appendChild(close);

    const buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex;gap:6px;margin-bottom:8px;flex-wrap:wrap';
    [['OPERATOR','operator'],['AFFILIATE','affiliate'],['VICTIM','victim']].forEach(([label, role]) => {
      const b = document.createElement('button');
      b.textContent = label;
      b.style.cssText = 'flex:1;background:#16161a;border:1px solid #2a2a2a;color:#fff;padding:6px 8px;border-radius:8px;font-weight:700;font-size:11px;cursor:pointer';
      b.onclick = () => {
        setState({ role, step: 0 });
        updatePanel();
        // Start immediately
        setTimeout(() => performStep(role, 0), 50);
      };
      buttons.appendChild(b);
    });

    stepEl = document.createElement('div');
    stepEl.style.cssText = 'font-size:11px;color:#cfcfcf;margin-bottom:8px;min-height:16px';

    nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next Step →';
    nextBtn.style.cssText = 'width:100%;background:#00ff88;border:none;color:#0b0b0c;padding:8px 10px;border-radius:8px;font-weight:800;font-size:12px;cursor:pointer';
    nextBtn.onclick = () => {
      const st = getState();
      if (!st) return notify('Start a demo first');
      performStep(st.role, st.step);
    };

    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset';
    resetBtn.style.cssText = 'width:100%;background:#22252b;border:1px solid #353a40;color:#cfcfcf;padding:6px 10px;border-radius:8px;font-weight:600;font-size:11px;cursor:pointer;margin-top:6px';
    resetBtn.onclick = () => { clearState(); updatePanel(); notify('Demo reset'); };

    panel.appendChild(header);
    panel.appendChild(buttons);
    panel.appendChild(stepEl);
    panel.appendChild(nextBtn);
    panel.appendChild(resetBtn);
    document.body.appendChild(panel);
  }

  function updatePanel() {
    const st = getState();
    if (!st) {
      titleEl.textContent = 'Demo: Idle';
      stepEl.textContent = 'Choose a role to start the guided demo.';
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.6';
      return;
    }
    const steps = scripts[st.role] || [];
    const next = steps[st.step];
    titleEl.textContent = `Demo: ${st.role.toUpperCase()} (${st.step + 1}/${steps.length})`;
    stepEl.textContent = next ? next.desc : 'Complete';
    nextBtn.disabled = !next;
    nextBtn.style.opacity = next ? '1' : '0.6';
  }

  function resumeIfNeeded() {
    const st = getState();
    if (!st) return;
    // After navigation, resume at current step
    setTimeout(() => performStep(st.role, st.step), 100);
  }

  document.addEventListener('DOMContentLoaded', () => {
    buildPanel();
    updatePanel();
    resumeIfNeeded();
  });
})();


