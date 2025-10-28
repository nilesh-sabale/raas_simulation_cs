// Campaign Builder JavaScript
class CampaignBuilder {
  constructor() {
    this.campaigns = [];
    this.currentCampaign = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadActiveCampaigns();
    this.updatePreview();
  }

  setupEventListeners() {
    // Form inputs
    const form = document.getElementById('campaign-form');
    if (form) {
      form.addEventListener('input', () => this.updatePreview());
    }

    // File extension tags
    document.querySelectorAll('.extension-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.target.classList.toggle('active');
        this.updatePreview();
      });
    });

    // Ransom note template
    const ransomNoteSelect = document.getElementById('ransom-note');
    if (ransomNoteSelect) {
      ransomNoteSelect.addEventListener('change', (e) => {
        const customGroup = document.getElementById('custom-note-group');
        if (e.target.value === 'custom') {
          customGroup.style.display = 'block';
        } else {
          customGroup.style.display = 'none';
        }
        this.updatePreview();
      });
    }

    // Revenue split
    const affiliateSplit = document.getElementById('affiliate-split');
    const operatorSplit = document.getElementById('operator-split');
    
    if (affiliateSplit && operatorSplit) {
      affiliateSplit.addEventListener('input', (e) => {
        operatorSplit.value = 100 - parseInt(e.target.value);
        this.updatePreview();
      });
    }

    // Role selector
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.updateRoleView(e.target.dataset.role);
      });
    });
  }

  updatePreview() {
    const formData = new FormData(document.getElementById('campaign-form'));
    const name = document.getElementById('campaign-name').value || 'Campaign Name';
    const sector = document.getElementById('target-sector').value;
    const size = document.getElementById('target-size').value;
    const amount = document.getElementById('ransom-amount').value || '0.000';
    const deadline = document.getElementById('payment-deadline').value || '72';
    const method = document.getElementById('encryption-method').value || 'Base64';

    // Update preview elements
    document.getElementById('preview-name').textContent = name;
    document.getElementById('preview-target').textContent = 
      sector && size ? `${sector} (${size})` : 'Not specified';
    document.getElementById('preview-ransom').textContent = `${amount} BTC`;
    document.getElementById('preview-deadline').textContent = `${deadline} hours`;
    document.getElementById('preview-method').textContent = method;
  }

  updateRoleView(role) {
    const title = document.querySelector('.dashboard-title');
    const roleTitles = {
      'operator': 'CAMPAIGN BUILDER',
      'affiliate': 'CAMPAIGN ASSIGNMENTS',
      'victim': 'CAMPAIGN SIMULATION'
    };
    
    if (title) {
      title.textContent = roleTitles[role] || 'CAMPAIGN BUILDER';
    }

    // Update UI based on role
    if (role === 'affiliate') {
      this.showAffiliateView();
    } else if (role === 'victim') {
      this.showVictimView();
    } else {
      this.showOperatorView();
    }
  }

  showAffiliateView() {
    // Hide builder-only sections
    document.querySelectorAll('.builder-section').forEach(section => {
      section.style.display = 'none';
    });

    // Render assignments in campaigns grid
    this.renderAffiliateAssignments();
  }

  showVictimView() {
    // Show victim simulation elements
    this.createVictimSimulation();
  }

  showOperatorView() {
    // Show all elements
    document.querySelectorAll('.builder-section').forEach(section => {
      section.style.display = 'block';
    });
  }

  createVictimSimulation() {
    const campaignsGrid = document.getElementById('campaigns-grid');
    if (!campaignsGrid) return;

    campaignsGrid.innerHTML = `
      <div class="victim-simulation">
        <div class="simulation-header">
          <h4>🎯 ACTIVE CAMPAIGNS TARGETING YOUR SYSTEM</h4>
          <p>Simulated victim view - these campaigns are targeting your organization</p>
        </div>
        <div class="simulation-campaigns">
          <div class="victim-campaign-card">
            <div class="campaign-header">
              <h5>Enterprise Alpha Campaign</h5>
              <span class="threat-level high">HIGH THREAT</span>
            </div>
            <div class="campaign-details">
              <p><strong>Target:</strong> Healthcare Sector</p>
              <p><strong>Ransom:</strong> 0.15 BTC</p>
              <p><strong>Deadline:</strong> 48 hours remaining</p>
              <p><strong>Status:</strong> Files encrypted</p>
            </div>
            <div class="victim-actions">
              <button class="btn btn-danger" onclick="simulatePayment()">SIMULATE PAYMENT</button>
              <button class="btn btn-secondary" onclick="simulateNegotiation()">NEGOTIATE</button>
              <a class="btn btn-secondary" href="payments.html">GO TO PAYMENTS</a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async loadActiveCampaigns() {
    try {
      // Prefer backend campaigns; fallback to mock
      let rows = [];
      try {
        const res = await fetch('/api/campaigns');
        if (res.ok) rows = await res.json();
      } catch {}

      if (!rows || rows.length === 0) {
        rows = [
          { id: 'camp-001', name: 'Healthcare Beta', sector: 'Healthcare', status: 'active', victims: 12, revenue: 0.45, created: '2024-01-15', affiliate_id: 'affiliate-002', success_rate: 0.92 },
          { id: 'camp-002', name: 'Finance Gamma', sector: 'Financial Services', status: 'completed', victims: 8, revenue: 0.32, created: '2024-01-10', affiliate_id: 'affiliate-001', success_rate: 0.85 },
          { id: 'camp-003', name: 'Education Delta', sector: 'Education', status: 'paused', victims: 5, revenue: 0.18, created: '2024-01-08', affiliate_id: 'affiliate-002', success_rate: 0.78 }
        ];
      }

      // Normalize
      this.campaigns = rows.map(r => ({
        id: r.id,
        name: r.name,
        sector: r.sector || 'N/A',
        status: r.status || 'active',
        victims: Number(r.victim_count ?? r.victims ?? 0),
        revenue: Number(r.revenue ?? 0),
        created: r.created_at || r.created || new Date().toISOString(),
        affiliate_id: r.affiliate_id || 'affiliate-002',
        success_rate: Number(r.success_rate ?? 0.9)
      }));
      this.renderCampaigns();
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  }

  renderCampaigns() {
    const campaignsGrid = document.getElementById('campaigns-grid');
    if (!campaignsGrid) return;

    campaignsGrid.innerHTML = this.campaigns.map(campaign => `
      <div class="campaign-card">
        <div class="campaign-header">
          <h5>${campaign.name}</h5>
          <span class="campaign-status ${campaign.status}">${campaign.status.toUpperCase()}</span>
        </div>
        <div class="campaign-stats">
          <div class="stat">
            <span class="stat-label">Sector:</span>
            <span class="stat-value">${campaign.sector}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Victims:</span>
            <span class="stat-value">${campaign.victims}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Revenue:</span>
            <span class="stat-value">${campaign.revenue} BTC</span>
          </div>
          <div class="stat">
            <span class="stat-label">Created:</span>
            <span class="stat-value">${new Date(campaign.created).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="campaign-actions">
          <button class="btn btn-small" onclick="viewCampaign('${campaign.id}')">VIEW</button>
          <button class="btn btn-small btn-secondary" onclick="editCampaign('${campaign.id}')">EDIT</button>
          <button class="btn btn-small btn-danger" onclick="stopCampaign('${campaign.id}')">STOP</button>
        </div>
      </div>
    `).join('');
  }

  renderAffiliateAssignments() {
    const campaignsGrid = document.getElementById('campaigns-grid');
    if (!campaignsGrid) return;

    const myAffiliateId = 'affiliate-002'; // demo affiliate
    const assigned = this.campaigns.filter(c => (c.affiliate_id || '') === myAffiliateId);

    campaignsGrid.innerHTML = `
      <div class="campaign-card" style="grid-column: 1 / -1;">
        <div class="campaign-header">
          <h5>Assigned to You (${myAffiliateId})</h5>
          <span class="campaign-status active">AFFILIATE VIEW</span>
        </div>
        <div class="campaign-stats">
          <div class="stat"><span class="stat-label">Total Assigned:</span><span class="stat-value">${assigned.length}</span></div>
          <div class="stat"><span class="stat-label">Avg Success:</span><span class="stat-value">${assigned.length ? Math.round(assigned.reduce((a,c)=>a+(c.success_rate||0),0)/assigned.length*100) : 0}%</span></div>
          <div class="stat"><span class="stat-label">Revenue (paid):</span><span class="stat-value">${assigned.reduce((a,c)=>a+(c.revenue||0),0).toFixed(2)} BTC</span></div>
        </div>
      </div>
      ${assigned.length === 0 ? `
        <div class="campaign-card" style="grid-column: 1 / -1;">
          <div class="campaign-header">
            <h5>No assignments yet</h5>
            <span class="campaign-status paused">WAITING</span>
          </div>
          <div class="campaign-stats">
            <div class="stat"><span class="stat-label">Tip:</span><span class="stat-value">Have Operator assign you and click REFRESH</span></div>
          </div>
        </div>
      ` : ''}
      ${assigned.map(c => `
        <div class="campaign-card">
          <div class="campaign-header">
            <h5>${c.name}</h5>
            <span class="campaign-status ${c.status}">${c.status.toUpperCase()}</span>
          </div>
          <div class="campaign-stats">
            <div class="stat"><span class="stat-label">Sector:</span><span class="stat-value">${c.sector}</span></div>
            <div class="stat"><span class="stat-label">Victims:</span><span class="stat-value">${c.victims}</span></div>
            <div class="stat"><span class="stat-label">Success:</span><span class="stat-value">${Math.round((c.success_rate||0)*100)}%</span></div>
            <div class="stat"><span class="stat-label">Revenue:</span><span class="stat-value">${(c.revenue||0).toFixed(2)} BTC</span></div>
          </div>
          <div class="campaign-actions">
            <button class="btn btn-small" onclick="viewCampaign('${c.id}')">VIEW</button>
            <button class="btn btn-small btn-secondary" onclick="simulateAffiliateRun('${c.id}')">RUN</button>
          </div>
        </div>
      `).join('')}
    `;
  }

  generateRansomNote(template) {
    const templates = {
      professional: `
Your files have been encrypted with military-grade encryption.

What happened?
- Your files have been encrypted using AES-256 encryption
- Your files are safe and can be restored
- We have a copy of your encryption key

What do we want?
- Payment of 0.05 BTC to restore your files
- Payment must be made within 72 hours
- After payment, you will receive the decryption key

How to pay:
1. Install a Bitcoin wallet
2. Send 0.05 BTC to: FAKE-CRYPTO-ADDRESS-001
3. Contact us at: support@fake-raas.com

This is a simulation for educational purposes only.
      `,
      aggressive: `
⚠️ YOUR FILES HAVE BEEN ENCRYPTED ⚠️

YOU HAVE 72 HOURS TO PAY OR YOUR FILES ARE GONE FOREVER!

Payment: 0.05 BTC
Address: FAKE-CRYPTO-ADDRESS-001

NO NEGOTIATIONS. NO EXTENSIONS. PAY NOW OR LOSE EVERYTHING.

This is a simulation for educational purposes only.
      `,
      friendly: `
Hello! 👋

We've encrypted your files, but don't worry - we can help you get them back!

We're asking for a small payment of 0.05 BTC to restore your files.
This is much cheaper than hiring a recovery service.

Payment details:
- Amount: 0.05 BTC
- Address: FAKE-CRYPTO-ADDRESS-001
- Deadline: 72 hours

Contact us if you have any questions!

This is a simulation for educational purposes only.
      `
    };

    return templates[template] || templates.professional;
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
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
    
    setTimeout(() => {
      notification.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }
}

// Global functions
function launchCampaign() {
  const form = document.getElementById('campaign-form');
  const formData = new FormData(form);
  
  const requiredFields = ['name', 'sector', 'size', 'amount', 'deadline'];
  const missingFields = requiredFields.filter(field => !formData.get(field));
  if (missingFields.length > 0) {
    campaignBuilder.showNotification(`Please fill in: ${missingFields.join(', ')}`, 'error');
    return;
  }

  const payload = {
    name: formData.get('name'),
    description: formData.get('description') || '',
    sector: formData.get('sector'),
    size: formData.get('size'),
    amount: Number(formData.get('amount')),
    deadline: Number(formData.get('deadline')),
    encryption: document.getElementById('encryption-method')?.value || 'base64',
    affiliate: document.getElementById('affiliate-select')?.value || 'affiliate-002'
  };

  fetch('/api/campaigns/create', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  .then(async (res) => {
    if (!res.ok) throw new Error('create_failed');
    const data = await res.json();
    campaignBuilder.showNotification('Campaign launched successfully!', 'success');
    // Reload campaigns from backend so Affiliate view sees it
    campaignBuilder.loadActiveCampaigns();
    form.reset();
    campaignBuilder.updatePreview();
  })
  .catch(() => {
    campaignBuilder.showNotification('Failed to launch campaign', 'error');
  });
}

function saveCampaign() {
  campaignBuilder.showNotification('Campaign saved as draft', 'info');
}

function testCampaign() {
  campaignBuilder.showNotification('Campaign test completed successfully', 'success');
}

function previewRansomNote() {
  const template = document.getElementById('ransom-note').value;
  const customNote = document.getElementById('custom-note-text').value;
  
  let noteContent;
  if (template === 'custom' && customNote) {
    noteContent = customNote;
  } else {
    noteContent = campaignBuilder.generateRansomNote(template);
  }
  
  document.getElementById('ransom-note-preview').innerHTML = `
    <div class="ransom-note-content">
      <pre>${noteContent}</pre>
    </div>
  `;
  
  document.getElementById('ransom-note-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('ransom-note-modal').style.display = 'none';
}

function copyRansomNote() {
  const noteContent = document.querySelector('.ransom-note-content pre').textContent;
  navigator.clipboard.writeText(noteContent).then(() => {
    campaignBuilder.showNotification('Ransom note copied to clipboard', 'success');
  });
}

function refreshCampaigns() {
  campaignBuilder.loadActiveCampaigns();
  campaignBuilder.showNotification('Campaigns refreshed', 'info');
}

function viewCampaign(id) {
  campaignBuilder.showNotification(`Viewing campaign ${id}`, 'info');
}

function editCampaign(id) {
  campaignBuilder.showNotification(`Editing campaign ${id}`, 'info');
}

function stopCampaign(id) {
  if (confirm('Are you sure you want to stop this campaign?')) {
    const campaign = campaignBuilder.campaigns.find(c => c.id === id);
    if (campaign) {
      campaign.status = 'stopped';
      campaignBuilder.renderCampaigns();
      campaignBuilder.showNotification('Campaign stopped', 'success');
    }
  }
}

function simulatePayment() {
  campaignBuilder.showNotification('Payment simulation completed', 'success');
}

function simulateNegotiation() {
  campaignBuilder.showNotification('Opening negotiation chat...', 'info');
}

// Initialize campaign builder
let campaignBuilder;
document.addEventListener('DOMContentLoaded', () => {
  campaignBuilder = new CampaignBuilder();
});

function simulateAffiliateRun(id) {
  campaignBuilder.showNotification(`Affiliate run triggered for ${id}`, 'success');
}
