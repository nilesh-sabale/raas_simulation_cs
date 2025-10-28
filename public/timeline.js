// Timeline JavaScript
class TimelineManager {
  constructor() {
    this.events = [];
    this.socket = null;
    this.isPlaying = false;
    this.currentFilter = 'all';
    this.currentTimeRange = '24h';
    this.defenseMode = false;
    
    this.init();
  }

  async init() {
    this.setupSocketConnection();
    this.setupEventListeners();
    await this.loadTimelineEvents();
    this.startRealTimeUpdates();
    this.animateFlowSteps();
  }

  setupSocketConnection() {
    this.socket = io();
    
    this.socket.on('connect', () => {
      console.log('Connected to timeline socket');
      this.socket.emit('join-dashboard');
    });
    
    this.socket.on('live-activity', (data) => {
      this.addTimelineEvent({
        type: 'live',
        message: data.message,
        timestamp: data.timestamp,
        icon: '📡'
      });
    });
    
    this.socket.on('campaign-created', (data) => {
      this.addTimelineEvent({
        type: 'campaign',
        message: `Campaign "${data.name}" created`,
        timestamp: new Date().toISOString(),
        icon: '🎯'
      });
    });
  }

  setupEventListeners() {
    // Filter controls
    const filterSelect = document.getElementById('timeline-filter');
    if (filterSelect) {
      filterSelect.addEventListener('change', (e) => {
        this.currentFilter = e.target.value;
        this.filterTimelineEvents();
      });
    }

    // Time range controls
    const timeRangeSelect = document.getElementById('time-range');
    if (timeRangeSelect) {
      timeRangeSelect.addEventListener('change', (e) => {
        this.currentTimeRange = e.target.value;
        this.loadTimelineEvents();
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

  async loadTimelineEvents() {
    try {
      const response = await fetch('/api/logs');
      const logs = await response.json();
      
      this.events = logs.map(log => ({
        type: log.type,
        message: log.message,
        timestamp: log.created_at,
        icon: this.getEventIcon(log.type)
      }));
      
      this.renderTimelineEvents();
      this.updateTimelineStats();
    } catch (error) {
      console.error('Failed to load timeline events:', error);
    }
  }

  getEventIcon(type) {
    const icons = {
      'encrypt': '🔒',
      'decrypt': '🔓',
      'payment_create': '💰',
      'payment_paid': '✅',
      'campaign': '🎯',
      'affiliate': '🤝',
      'campaign_create': '🎯',
      'live': '📡'
    };
    return icons[type] || '📋';
  }

  addTimelineEvent(event) {
    this.events.unshift(event);
    
    // Keep only last 100 events
    if (this.events.length > 100) {
      this.events = this.events.slice(0, 100);
    }
    
    this.renderTimelineEvents();
    this.updateTimelineStats();
  }

  renderTimelineEvents() {
    const container = document.getElementById('timeline-events-list');
    if (!container) return;

    const filteredEvents = this.filterEventsByType(this.events);
    
    container.innerHTML = filteredEvents.map((event, index) => `
      <div class="timeline-event ${event.type}" data-index="${index}">
        <div class="event-marker">
          <div class="event-icon">${event.icon}</div>
        </div>
        <div class="event-content">
          <div class="event-header">
            <h4 class="event-title">${this.formatEventTitle(event.type)}</h4>
            <span class="event-time">${this.formatTime(event.timestamp)}</span>
          </div>
          <div class="event-message">${event.message}</div>
          <div class="event-meta">
            <span class="event-type">${event.type.toUpperCase()}</span>
            <span class="event-severity ${this.getSeverityLevel(event.type)}">${this.getSeverityLevel(event.type).toUpperCase()}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  filterEventsByType(events) {
    if (this.currentFilter === 'all') {
      return events;
    }
    
    return events.filter(event => {
      switch (this.currentFilter) {
        case 'campaign':
          return event.type.includes('campaign');
        case 'encrypt':
          return event.type === 'encrypt';
        case 'payment':
          return event.type.includes('payment');
        case 'affiliate':
          return event.type === 'affiliate';
        case 'defense':
          return event.type.includes('defense');
        default:
          return true;
      }
    });
  }

  filterTimelineEvents() {
    this.renderTimelineEvents();
  }

  formatEventTitle(type) {
    const titles = {
      'encrypt': 'File Encryption',
      'decrypt': 'File Decryption',
      'payment_create': 'Payment Demand',
      'payment_paid': 'Payment Received',
      'campaign': 'Campaign Activity',
      'campaign_create': 'Campaign Created',
      'affiliate': 'Affiliate Activity',
      'live': 'Live Activity'
    };
    return titles[type] || 'System Event';
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  getSeverityLevel(type) {
    const severity = {
      'encrypt': 'high',
      'payment_create': 'medium',
      'payment_paid': 'low',
      'campaign': 'medium',
      'affiliate': 'low',
      'live': 'info'
    };
    return severity[type] || 'low';
  }

  updateTimelineStats() {
    const totalEvents = document.getElementById('total-events');
    const activeThreats = document.getElementById('active-threats');
    
    if (totalEvents) {
      totalEvents.textContent = this.events.length;
    }
    
    if (activeThreats) {
      const threats = this.events.filter(e => 
        e.type === 'encrypt' || e.type === 'payment_create'
      ).length;
      activeThreats.textContent = threats;
    }
  }

  animateFlowSteps() {
    const steps = document.querySelectorAll('.flow-step, .defense-step');
    
    steps.forEach((step, index) => {
      setTimeout(() => {
        step.classList.add('active');
      }, index * 500);
    });
  }

  startRealTimeUpdates() {
    // Simulate real-time events
    setInterval(() => {
      if (this.isPlaying) {
        this.simulateRandomEvent();
      }
    }, 3000);
  }

  simulateRandomEvent() {
    const eventTypes = ['encrypt', 'payment_create', 'affiliate', 'campaign'];
    const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    const messages = {
      'encrypt': 'Files encrypted on victim system',
      'payment_create': 'New ransom demand created',
      'affiliate': 'Affiliate activity detected',
      'campaign': 'Campaign status updated'
    };
    
    this.addTimelineEvent({
      type: randomType,
      message: messages[randomType],
      timestamp: new Date().toISOString(),
      icon: this.getEventIcon(randomType)
    });
  }

  updateRoleView(role) {
    const title = document.querySelector('.dashboard-title');
    const roleTitles = {
      'operator': 'EVENT TIMELINE',
      'affiliate': 'AFFILIATE TIMELINE',
      'victim': 'VICTIM TIMELINE'
    };
    
    if (title) {
      title.textContent = roleTitles[role] || 'EVENT TIMELINE';
    }

    // Update timeline based on role
    if (role === 'victim') {
      this.showVictimTimeline();
    } else if (role === 'affiliate') {
      this.showAffiliateTimeline();
    } else {
      this.showOperatorTimeline();
    }
  }

  showVictimTimeline() {
    // Show victim-focused events
    this.currentFilter = 'encrypt';
    this.filterTimelineEvents();
  }

  showAffiliateTimeline() {
    // Show affiliate-focused events
    this.currentFilter = 'affiliate';
    this.filterTimelineEvents();
  }

  showOperatorTimeline() {
    // Show all events
    this.currentFilter = 'all';
    this.filterTimelineEvents();
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
function refreshTimeline() {
  timelineManager.loadTimelineEvents();
  timelineManager.showNotification('Timeline refreshed', 'info');
}

function exportTimeline() {
  timelineManager.showNotification('Exporting timeline data...', 'info');
  
  setTimeout(() => {
    timelineManager.showNotification('Timeline exported successfully!', 'success');
  }, 2000);
}

function toggleDefenseMode() {
  timelineManager.defenseMode = !timelineManager.defenseMode;
  const btn = document.querySelector('.btn-danger');
  const defenseTimeline = document.getElementById('defense-timeline');
  
  if (timelineManager.defenseMode) {
    btn.innerHTML = '<span class="btn-icon">🔴</span> RED TEAM';
    btn.style.background = 'var(--gradient-danger)';
    defenseTimeline.style.display = 'block';
    timelineManager.showNotification('Switched to Blue Team Defense Mode', 'info');
  } else {
    btn.innerHTML = '<span class="btn-icon">🛡️</span> BLUE TEAM';
    btn.style.background = 'var(--gradient-primary)';
    defenseTimeline.style.display = 'none';
    timelineManager.showNotification('Switched to Red Team Attack Mode', 'warning');
  }
}

function playTimeline() {
  timelineManager.isPlaying = true;
  timelineManager.showNotification('Timeline playback started', 'info');
}

function pauseTimeline() {
  timelineManager.isPlaying = false;
  timelineManager.showNotification('Timeline playback paused', 'info');
}

// Initialize timeline manager
let timelineManager;
document.addEventListener('DOMContentLoaded', () => {
  timelineManager = new TimelineManager();
});
