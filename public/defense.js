// Blue Team Defense JavaScript
class BlueTeamDefense {
  constructor() {
    this.alerts = [];
    this.incidents = [];
    this.threats = [];
    this.recommendations = [];
    this.currentStep = 1;
    this.socket = null;
    
    this.init();
  }

  async init() {
    this.setupSocketConnection();
    this.setupEventListeners();
    await this.loadEDRAlerts();
    await this.loadThreatIntelligence();
    await this.generateRecommendations();
    this.startRealTimeUpdates();
    this.animateWorkflowSteps();
  }

  setupSocketConnection() {
    this.socket = io();
    
    this.socket.on('connect', () => {
      console.log('Connected to defense socket');
      this.socket.emit('join-dashboard');
    });
    
    this.socket.on('threat-detected', (data) => {
      this.addEDRAlert({
        id: Date.now(),
        severity: data.severity || 'high',
        title: data.title || 'Suspicious Activity Detected',
        description: data.description || 'Unknown threat detected',
        timestamp: new Date().toISOString(),
        endpoint: data.endpoint || 'Workstation-001',
        user: data.user || 'admin',
        status: 'active'
      });
    });
  }

  setupEventListeners() {
    // Severity filter
    const severityFilter = document.getElementById('severity-filter');
    if (severityFilter) {
      severityFilter.addEventListener('change', (e) => {
        this.filterAlerts(e.target.value);
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

  async loadEDRAlerts() {
    // Simulate EDR alerts
    const mockAlerts = [
      {
        id: 1,
        severity: 'critical',
        title: 'Ransomware Encryption Detected',
        description: 'Mass file encryption activity detected on endpoint',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        endpoint: 'WS-HEALTH-001',
        user: 'dr.smith',
        status: 'active'
      },
      {
        id: 2,
        severity: 'high',
        title: 'Suspicious Process Execution',
        description: 'Unknown executable launched from temp directory',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        endpoint: 'WS-FINANCE-002',
        user: 'accountant.john',
        status: 'active'
      },
      {
        id: 3,
        severity: 'medium',
        title: 'Unusual Network Activity',
        description: 'High volume of outbound connections detected',
        timestamp: new Date(Date.now() - 900000).toISOString(),
        endpoint: 'WS-IT-003',
        user: 'admin.mike',
        status: 'investigating'
      },
      {
        id: 4,
        severity: 'critical',
        title: 'Shadow Copy Deletion',
        description: 'System restore points deleted via vssadmin',
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        endpoint: 'WS-HR-004',
        user: 'hr.sarah',
        status: 'active'
      },
      {
        id: 5,
        severity: 'high',
        title: 'Registry Modification',
        description: 'Suspicious registry keys created',
        timestamp: new Date(Date.now() - 1500000).toISOString(),
        endpoint: 'WS-LEGAL-005',
        user: 'lawyer.tom',
        status: 'contained'
      }
    ];

    this.alerts = mockAlerts;
    this.renderEDRAlerts();
  }

  renderEDRAlerts() {
    const container = document.getElementById('alerts-list');
    if (!container) return;

    container.innerHTML = this.alerts.map(alert => `
      <div class="alert-item ${alert.severity}" data-id="${alert.id}">
        <div class="alert-icon">
          <span class="alert-severity-icon">${this.getSeverityIcon(alert.severity)}</span>
        </div>
        <div class="alert-content">
          <div class="alert-header">
            <h4 class="alert-title">${alert.title}</h4>
            <span class="alert-time">${this.formatTime(alert.timestamp)}</span>
          </div>
          <div class="alert-description">${alert.description}</div>
          <div class="alert-meta">
            <span class="alert-endpoint">${alert.endpoint}</span>
            <span class="alert-user">${alert.user}</span>
            <span class="alert-status ${alert.status}">${alert.status.toUpperCase()}</span>
          </div>
        </div>
        <div class="alert-actions">
          <button class="btn btn-small" onclick="investigateAlert(${alert.id})">INVESTIGATE</button>
          <button class="btn btn-small btn-secondary" onclick="containAlert(${alert.id})">CONTAIN</button>
        </div>
      </div>
    `).join('');
  }

  getSeverityIcon(severity) {
    const icons = {
      'critical': '🚨',
      'high': '⚠️',
      'medium': '🔍',
      'low': 'ℹ️'
    };
    return icons[severity] || '📋';
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
      return 'Just now';
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  filterAlerts(severity) {
    const container = document.getElementById('alerts-list');
    if (!container) return;

    const filteredAlerts = severity === 'all' ? this.alerts : 
      this.alerts.filter(alert => alert.severity === severity);

    container.innerHTML = filteredAlerts.map(alert => `
      <div class="alert-item ${alert.severity}" data-id="${alert.id}">
        <div class="alert-icon">
          <span class="alert-severity-icon">${this.getSeverityIcon(alert.severity)}</span>
        </div>
        <div class="alert-content">
          <div class="alert-header">
            <h4 class="alert-title">${alert.title}</h4>
            <span class="alert-time">${this.formatTime(alert.timestamp)}</span>
          </div>
          <div class="alert-description">${alert.description}</div>
          <div class="alert-meta">
            <span class="alert-endpoint">${alert.endpoint}</span>
            <span class="alert-user">${alert.user}</span>
            <span class="alert-status ${alert.status}">${alert.status.toUpperCase()}</span>
          </div>
        </div>
        <div class="alert-actions">
          <button class="btn btn-small" onclick="investigateAlert(${alert.id})">INVESTIGATE</button>
          <button class="btn btn-small btn-secondary" onclick="containAlert(${alert.id})">CONTAIN</button>
        </div>
      </div>
    `).join('');
  }

  addEDRAlert(alert) {
    this.alerts.unshift(alert);
    this.renderEDRAlerts();
    this.updateSecurityMetrics();
    this.showNotification(`New ${alert.severity} alert: ${alert.title}`, 'warning');
  }

  async loadThreatIntelligence() {
    // Simulate threat intelligence data
    this.threats = [
      {
        name: 'Ransomware Campaign Alpha',
        level: 'critical',
        iocs: 15,
        target: 'Healthcare sector',
        method: 'Phishing + RDP',
        status: 'Active'
      },
      {
        name: 'APT Group Beta',
        level: 'high',
        iocs: 8,
        target: 'Financial services',
        method: 'Supply chain',
        status: 'Monitored'
      },
      {
        name: 'Insider Threat Gamma',
        level: 'medium',
        iocs: 3,
        target: 'Internal systems',
        method: 'Privilege abuse',
        status: 'Investigating'
      }
    ];
  }

  async generateRecommendations() {
    const mockRecommendations = [
      {
        id: 1,
        priority: 'high',
        category: 'Endpoint Security',
        title: 'Enable Real-time Protection',
        description: 'Activate real-time malware scanning on all endpoints',
        status: 'pending',
        impact: 'High'
      },
      {
        id: 2,
        priority: 'critical',
        category: 'Network Security',
        title: 'Block Suspicious IPs',
        description: 'Add detected malicious IPs to firewall blocklist',
        status: 'in-progress',
        impact: 'Critical'
      },
      {
        id: 3,
        priority: 'medium',
        category: 'User Training',
        title: 'Security Awareness Training',
        description: 'Conduct phishing simulation for all users',
        status: 'pending',
        impact: 'Medium'
      },
      {
        id: 4,
        priority: 'high',
        category: 'Backup Security',
        title: 'Secure Backup Systems',
        description: 'Implement immutable backup storage',
        status: 'pending',
        impact: 'High'
      },
      {
        id: 5,
        priority: 'medium',
        category: 'Monitoring',
        title: 'Enhance Logging',
        description: 'Increase log retention and monitoring',
        status: 'completed',
        impact: 'Medium'
      }
    ];

    this.recommendations = mockRecommendations;
    this.renderRecommendations();
  }

  renderRecommendations() {
    const container = document.getElementById('recommendations-list');
    if (!container) return;

    container.innerHTML = this.recommendations.map(rec => `
      <div class="recommendation-item ${rec.priority}" data-id="${rec.id}">
        <div class="rec-header">
          <h4 class="rec-title">${rec.title}</h4>
          <span class="rec-priority ${rec.priority}">${rec.priority.toUpperCase()}</span>
        </div>
        <div class="rec-content">
          <p class="rec-description">${rec.description}</p>
          <div class="rec-meta">
            <span class="rec-category">${rec.category}</span>
            <span class="rec-impact">Impact: ${rec.impact}</span>
            <span class="rec-status ${rec.status}">${rec.status.toUpperCase()}</span>
          </div>
        </div>
        <div class="rec-actions">
          <button class="btn btn-small" onclick="implementRecommendation(${rec.id})">IMPLEMENT</button>
          <button class="btn btn-small btn-secondary" onclick="scheduleRecommendation(${rec.id})">SCHEDULE</button>
        </div>
      </div>
    `).join('');
  }

  animateWorkflowSteps() {
    const steps = document.querySelectorAll('.workflow-step');
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('active');
      }, index * 1000);
    });
  }

  updateRoleView(role) {
    const title = document.querySelector('.dashboard-title');
    const roleTitles = {
      'analyst': 'SECURITY ANALYST',
      'responder': 'INCIDENT RESPONDER',
      'manager': 'SOC MANAGER'
    };
    
    if (title) {
      title.textContent = roleTitles[role] || 'SECURITY OPERATIONS CENTER';
    }
  }

  updateSecurityMetrics() {
    const activeAlerts = document.getElementById('active-alerts');
    const blockedAttacks = document.getElementById('blocked-attacks');
    const threatsDetected = document.getElementById('threats-detected');
    const mttr = document.getElementById('mttr');

    if (activeAlerts) {
      activeAlerts.textContent = this.alerts.filter(a => a.status === 'active').length;
    }

    if (blockedAttacks) {
      blockedAttacks.textContent = Math.floor(Math.random() * 50) + 30;
    }

    if (threatsDetected) {
      threatsDetected.textContent = this.threats.length;
    }

    if (mttr) {
      mttr.textContent = Math.floor(Math.random() * 30) + 15;
    }
  }

  startRealTimeUpdates() {
    // Simulate real-time threat detection
    setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 5 seconds
        this.simulateThreatDetection();
      }
    }, 5000);

    // Update metrics every 30 seconds
    setInterval(() => {
      this.updateSecurityMetrics();
    }, 30000);
  }

  simulateThreatDetection() {
    const threatTypes = [
      {
        severity: 'high',
        title: 'Suspicious PowerShell Activity',
        description: 'PowerShell script execution with encoded commands detected',
        endpoint: `WS-${Math.floor(Math.random() * 100)}`,
        user: `user${Math.floor(Math.random() * 50)}`
      },
      {
        severity: 'medium',
        title: 'Unusual File Access Pattern',
        description: 'Mass file access detected on shared drive',
        endpoint: `SRV-${Math.floor(Math.random() * 20)}`,
        user: `admin${Math.floor(Math.random() * 10)}`
      },
      {
        severity: 'critical',
        title: 'Ransomware Behavior Detected',
        description: 'File encryption patterns matching known ransomware',
        endpoint: `WS-${Math.floor(Math.random() * 100)}`,
        user: `user${Math.floor(Math.random() * 50)}`
      }
    ];

    const randomThreat = threatTypes[Math.floor(Math.random() * threatTypes.length)];
    this.addEDRAlert({
      id: Date.now(),
      ...randomThreat,
      timestamp: new Date().toISOString(),
      status: 'active'
    });
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
      case 'warning':
        notification.style.background = 'rgba(255, 170, 0, 0.9)';
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
function refreshSOC() {
  defense.loadEDRAlerts();
  defense.updateSecurityMetrics();
  defense.showNotification('SOC data refreshed', 'info');
}

function exportIncident() {
  defense.showNotification('Exporting incident data...', 'info');
  
  setTimeout(() => {
    defense.showNotification('Incident data exported successfully!', 'success');
  }, 2000);
}

function toggleRedTeam() {
  defense.showNotification('Switching to Red Team Attack Mode', 'warning');
  
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1000);
}

function initiateIncident() {
  document.getElementById('incident-modal').style.display = 'flex';
}

function closeIncidentModal() {
  document.getElementById('incident-modal').style.display = 'none';
}

function createIncident() {
  const title = document.getElementById('incident-title').value;
  const severity = document.getElementById('incident-severity').value;
  const description = document.getElementById('incident-description').value;
  const team = document.getElementById('assigned-team').value;
  
  if (!title || !description) {
    defense.showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  defense.showNotification(`Incident "${title}" created and assigned to ${team}`, 'success');
  closeIncidentModal();
  
  // Reset form
  document.getElementById('incident-title').value = '';
  document.getElementById('incident-description').value = '';
}

function containThreat() {
  defense.showNotification('Initiating threat containment procedures...', 'warning');
  
  setTimeout(() => {
    defense.showNotification('Threat containment completed', 'success');
  }, 3000);
}

function investigateAlert(alertId) {
  const alert = defense.alerts.find(a => a.id === alertId);
  if (alert) {
    defense.showNotification(`Investigating alert: ${alert.title}`, 'info');
  }
}

function containAlert(alertId) {
  const alert = defense.alerts.find(a => a.id === alertId);
  if (alert) {
    alert.status = 'contained';
    defense.renderEDRAlerts();
    defense.showNotification(`Alert contained: ${alert.title}`, 'success');
  }
}

function updateThreatIntel() {
  defense.showNotification('Updating threat intelligence feeds...', 'info');
  
  setTimeout(() => {
    defense.showNotification('Threat intelligence updated', 'success');
  }, 2000);
}

function generateRecommendations() {
  defense.generateRecommendations();
  defense.showNotification('Security recommendations generated', 'info');
}

function implementRecommendation(recId) {
  const rec = defense.recommendations.find(r => r.id === recId);
  if (rec) {
    rec.status = 'in-progress';
    defense.renderRecommendations();
    defense.showNotification(`Implementing: ${rec.title}`, 'info');
  }
}

function scheduleRecommendation(recId) {
  const rec = defense.recommendations.find(r => r.id === recId);
  if (rec) {
    defense.showNotification(`Scheduled: ${rec.title}`, 'info');
  }
}

// Initialize blue team defense
let defense;
document.addEventListener('DOMContentLoaded', () => {
  defense = new BlueTeamDefense();
});
