// Enhanced front-end interactions with animations and better UX
async function fetchJSON(url, opts) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

// Store previous stats for trend calculation
let previousStats = {};

async function loadStats() {
  try {
    const s = await fetchJSON('/api/stats');
    const set = (id, v) => { 
      const el = qs(id); 
      if (el) {
        const oldValue = parseInt(el.textContent) || 0;
        el.textContent = String(v);
        
        // Add animation class if value changed
        if (oldValue !== v) {
          el.classList.add('updated');
          setTimeout(() => el.classList.remove('updated'), 600);
        }
      }
    };
    
    // Update stats with animation
    set('#stat-attacks', s.total_attacks);
    set('#stat-payments', s.payments_made);
    set('#stat-victims', s.fake_victims);
    set('#stat-affiliates', s.affiliates);
    set('#stat-developers', s.developers);
    
    // Update trends
    updateTrends(s);
    
    // Store current stats for next comparison
    previousStats = { ...s };
    
    // Update last updated time
    const lastUpdated = qs('#last-updated');
    if (lastUpdated) {
      lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
  } catch (error) {
    console.error('Failed to load stats:', error);
    showNotification('Failed to load statistics', 'error');
  }
}

function updateTrends(currentStats) {
  const trends = {
    'attacks-trend': currentStats.total_attacks - (previousStats.total_attacks || 0),
    'payments-trend': currentStats.payments_made - (previousStats.payments_made || 0),
    'victims-trend': currentStats.fake_victims - (previousStats.fake_victims || 0),
    'affiliates-trend': currentStats.affiliates - (previousStats.affiliates || 0),
    'developers-trend': currentStats.developers - (previousStats.developers || 0)
  };
  
  Object.entries(trends).forEach(([id, change]) => {
    const element = qs(`#${id}`);
    if (element) {
      const sign = change > 0 ? '+' : '';
      element.textContent = `${sign}${change} this session`;
      element.style.color = change > 0 ? 'var(--accent-primary)' : 'var(--text-muted)';
    }
  });
}

// Global functions for dashboard buttons
function refreshStats() {
  const refreshBtn = qs('.refresh-btn');
  if (refreshBtn) {
    refreshBtn.classList.add('loading');
    refreshBtn.disabled = true;
  }
  
  loadStats().finally(() => {
    if (refreshBtn) {
      refreshBtn.classList.remove('loading');
      refreshBtn.disabled = false;
    }
  });
}

function exportData() {
  showNotification('Export functionality coming soon!', 'info');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    color: 'var(--text-primary)',
    fontWeight: '600',
    zIndex: '1000',
    maxWidth: '300px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    animation: 'slideInRight 0.3s ease-out'
  });
  
  // Set background based on type
  switch (type) {
    case 'success':
      notification.style.background = 'rgba(0, 255, 136, 0.9)';
      notification.style.color = 'var(--bg-primary)';
      break;
    case 'error':
      notification.style.background = 'rgba(255, 68, 68, 0.9)';
      break;
    case 'info':
    default:
      notification.style.background = 'rgba(26, 26, 26, 0.9)';
      notification.style.border = '1px solid var(--border)';
      break;
  }
  
  document.body.appendChild(notification);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

async function loadLogs() {
  const body = qs('#logs-body');
  if (!body) return;
  try {
    const rows = await fetchJSON('/api/logs');
    body.innerHTML = rows.map(r => `<tr><td>${r.created_at}</td><td>${r.type}</td><td>${r.message}</td></tr>`).join('');
  } catch { body.innerHTML = '<tr><td colspan="3">Failed to load logs</td></tr>'; }
}

function initUploadForm() {
  const form = qs('#encrypt-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    try {
      const res = await fetch('/api/encrypt', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('encrypt_failed');
      const data = await res.json();
      qs('#encrypt-result').classList.remove('hidden');
      qs('#encoded').value = data.encoded;

      const ransom = data.ransom;
      qs('#ransom-info').innerHTML = `
        <p><strong>Ransom Demand:</strong> ${ransom.amount} (simulated)</p>
        <p><strong>Payment ID:</strong> ${ransom.payment_id}</p>
        <p><strong>Address:</strong> ${ransom.address}</p>
        <button id="mark-paid">Mark Payment as Paid</button>
      `;

      const decryptForm = qs('#decrypt-form');
      decryptForm.method.value = fd.get('method');
      decryptForm.shift.value = fd.get('shift') || 3;
      decryptForm.content.value = data.encoded;

      qs('#mark-paid').addEventListener('click', async () => {
        try {
          await fetchJSON('/api/payment/mark-paid', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ransom.payment_id })
          });
          alert('Payment marked as paid (simulated).');
        } catch { alert('Failed to mark as paid'); }
      });
    } catch (err) {
      alert('Encryption failed. Ensure you selected a small text file.');
    }
  });

  const decryptForm = qs('#decrypt-form');
  decryptForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      method: decryptForm.method.value,
      shift: Number(decryptForm.shift.value || 3),
      content: decryptForm.content.value
    };
    try {
      const data = await fetchJSON('/api/decrypt', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      qs('#decoded').textContent = data.decoded;
      qs('#decoded-box').classList.remove('hidden');
    } catch { alert('Decrypt failed.'); }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadLogs();
  initUploadForm();
});
