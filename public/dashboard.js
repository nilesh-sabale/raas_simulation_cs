// Professional RaaS Dashboard JavaScript
class RaaSDashboard {
  constructor() {
    this.socket = null;
    this.charts = {};
    this.previousStats = {};
    this.currentRole = 'operator';
    this.defenseMode = false;
    this.networkData = [];
    
    this.init();
  }

  async init() {
    await this.initializeCharts();
    await this.loadDashboardData();
    this.setupEventListeners();
    this.startRealTimeUpdates();
    this.initializeNetworkGraph();
    this.startActivityTicker();
  }

  // Initialize Chart.js charts
  async initializeCharts() {
    // Infection Trend Chart
    const infectionCtx = document.getElementById('infection-chart');
    if (infectionCtx) {
      this.charts.infection = new Chart(infectionCtx, {
        type: 'line',
        data: {
          labels: this.generateTimeLabels(24),
          datasets: [{
            label: 'Infections',
            data: this.generateRandomData(24, 0, 50),
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#00ff88',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: {
                color: '#ffffff',
                font: {
                  family: 'Inter',
                  size: 12,
                  weight: '500'
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
              },
              ticks: {
                color: '#a0a0a0',
                font: {
                  family: 'JetBrains Mono',
                  size: 10
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: false
              },
              ticks: {
                color: '#a0a0a0',
                font: {
                  family: 'JetBrains Mono',
                  size: 10
                }
              }
            }
          },
          elements: {
            point: {
              hoverBackgroundColor: '#00ff88'
            }
          }
        }
      });
    }

    // Revenue Distribution Chart
    const revenueCtx = document.getElementById('revenue-chart');
    if (revenueCtx) {
      this.charts.revenue = new Chart(revenueCtx, {
        type: 'doughnut',
        data: {
          labels: ['Operator', 'Affiliate', 'Infrastructure', 'Development'],
          datasets: [{
            data: [40, 35, 15, 10],
            backgroundColor: [
              '#00ff88',
              '#00cc6a',
              '#ffaa00',
              '#00aaff'
            ],
            borderColor: '#1a1a1a',
            borderWidth: 2,
            hoverOffset: 10
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#ffffff',
                font: {
                  family: 'Inter',
                  size: 11,
                  weight: '500'
                },
                padding: 20,
                usePointStyle: true,
                pointStyle: 'circle'
              }
            }
          }
        }
      });
    }
  }

  // Generate time labels for charts
  generateTimeLabels(hours) {
    const labels = [];
    const now = new Date();
    for (let i = hours - 1; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      labels.push(time.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }));
    }
    return labels;
  }

  // Generate random data for charts
  generateRandomData(count, min, max) {
    return Array.from({ length: count }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  // Load dashboard data from API
  async loadDashboardData() {
    try {
      const stats = await this.fetchJSON('/api/stats');
      this.updateStats(stats);
      this.updateTrends(stats);
      this.updateVictimBanner();
      
      // Update charts with new data
      if (this.charts.infection) {
        this.charts.infection.data.datasets[0].data = this.generateRandomData(24, 0, stats.total_attacks || 50);
        this.charts.infection.update('none');
      }

      // Update network data
      this.updateNetworkStats(stats);
      
      // Load recent activity
      await this.loadRecentActivity();
      
      // Update last updated time
      this.updateLastUpdated();
      
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      this.showNotification('Failed to load dashboard data', 'error');
    }
  }

  // Update statistics display
  updateStats(stats) {
    const statElements = {
      'stat-campaigns': stats.total_attacks || 0,
      'stat-revenue': `${(stats.payments_made * 0.05).toFixed(4)} BTC`,
      'stat-victims': stats.fake_victims || 0,
      'stat-affiliates': stats.affiliates || 0
    };

    Object.entries(statElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        const oldValue = element.textContent;
        element.textContent = value;
        
        if (oldValue !== value) {
          element.classList.add('updated');
          setTimeout(() => element.classList.remove('updated'), 600);
        }
      }
    });
  }

  // Update trend indicators
  updateTrends(currentStats) {
    const trends = {
      'campaigns-trend': currentStats.total_attacks - (this.previousStats.total_attacks || 0),
      'revenue-trend': (currentStats.payments_made - (this.previousStats.payments_made || 0)) * 0.05,
      'victims-trend': currentStats.fake_victims - (this.previousStats.fake_victims || 0),
      'affiliates-trend': currentStats.affiliates - (this.previousStats.affiliates || 0)
    };
    
    Object.entries(trends).forEach(([id, change]) => {
      const element = document.getElementById(id);
      if (element) {
        const sign = change > 0 ? '+' : '';
        const prefix = id.includes('revenue') ? '+' : sign;
        const suffix = id.includes('revenue') ? ' BTC this session' : ' this session';
        element.textContent = `${prefix}${change.toFixed(4)}${suffix}`;
        element.style.color = change > 0 ? 'var(--accent-primary)' : 'var(--text-muted)';
      }
    });
    
    this.previousStats = { ...currentStats };
  }

  // Update network statistics
  updateNetworkStats(stats) {
    const networkElements = {
      'network-nodes': stats.fake_victims || 0,
      'network-connections': Math.floor((stats.fake_victims || 0) * 1.5),
      'network-countries': Math.min(stats.fake_victims || 0, 12)
    };

    Object.entries(networkElements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = value;
      }
    });
  }

  // Initialize network graph with D3.js
  initializeNetworkGraph() {
    const container = document.getElementById('network-graph');
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Generate network data
    this.generateNetworkData();
    
    // Create simulation
    const simulation = d3.forceSimulation(this.networkData.nodes)
      .force('link', d3.forceLink(this.networkData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(this.networkData.links)
      .enter().append('line')
      .attr('stroke', '#00ff88')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(this.networkData.nodes)
      .enter().append('circle')
      .attr('r', d => d.type === 'operator' ? 12 : d.type === 'affiliate' ? 8 : 6)
      .attr('fill', d => {
        switch(d.type) {
          case 'operator': return '#00ff88';
          case 'affiliate': return '#00aaff';
          case 'victim': return '#ff4444';
          default: return '#666666';
        }
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .call(this.drag(simulation));

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(this.networkData.nodes)
      .enter().append('text')
      .text(d => d.id)
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono')
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dy', 20);

    // Update positions
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });
  }

  // Generate network data
  generateNetworkData() {
    const nodes = [
      { id: 'Operator', type: 'operator', x: 0, y: 0 },
      { id: 'Affiliate-1', type: 'affiliate', x: 0, y: 0 },
      { id: 'Affiliate-2', type: 'affiliate', x: 0, y: 0 },
      { id: 'Victim-1', type: 'victim', x: 0, y: 0 },
      { id: 'Victim-2', type: 'victim', x: 0, y: 0 },
      { id: 'Victim-3', type: 'victim', x: 0, y: 0 }
    ];

    const links = [
      { source: 'Operator', target: 'Affiliate-1' },
      { source: 'Operator', target: 'Affiliate-2' },
      { source: 'Affiliate-1', target: 'Victim-1' },
      { source: 'Affiliate-1', target: 'Victim-2' },
      { source: 'Affiliate-2', target: 'Victim-3' }
    ];

    this.networkData = { nodes, links };
  }

  // Drag behavior for network nodes
  drag(simulation) {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  // Load recent activity
  async loadRecentActivity() {
    try {
      const logs = await this.fetchJSON('/api/logs');
      const activityList = document.getElementById('activity-list');
      
      if (activityList) {
        activityList.innerHTML = logs.slice(0, 5).map(log => `
          <div class="activity-item">
            <div class="activity-icon">${this.getActivityIcon(log.type)}</div>
            <div class="activity-content">
              <div class="activity-title">${this.formatActivityTitle(log.type)}</div>
              <div class="activity-description">${log.message}</div>
            </div>
            <div class="activity-time">${new Date(log.created_at).toLocaleTimeString()}</div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Failed to load recent activity:', error);
    }
  }

  // When a victim is encrypted, show prominent banner until paid
  updateVictimBanner() {
    const banner = document.getElementById('victim-banner');
    if (!banner) return;
    // Heuristic: unpaid payments exist
    fetch('/api/payments').then(r=>r.json()).then(rows => {
      const hasUnpaid = rows.some(p => !p.paid);
      banner.style.display = hasUnpaid ? 'flex' : 'none';
    }).catch(()=>{});
  }

  // Get activity icon based on type
  getActivityIcon(type) {
    const icons = {
      'encrypt': '🔒',
      'decrypt': '🔓',
      'payment_create': '💰',
      'payment_paid': '✅',
      'campaign': '🎯',
      'affiliate': '🤝'
    };
    return icons[type] || '📋';
  }

  // Format activity title
  formatActivityTitle(type) {
    const titles = {
      'encrypt': 'Encryption Simulation',
      'decrypt': 'Decryption Completed',
      'payment_create': 'Payment Demand Created',
      'payment_paid': 'Payment Received',
      'campaign': 'Campaign Launched',
      'affiliate': 'Affiliate Activity'
    };
    return titles[type] || 'System Activity';
  }

  // Start activity ticker animation
  startActivityTicker() {
    const ticker = document.getElementById('activity-ticker');
    if (!ticker) return;

    const activities = [
      '[LIVE] Campaign Alpha launched targeting enterprise sector',
      '[LIVE] Payment received from victim-001: 0.05 BTC',
      '[LIVE] New affiliate registered: affiliate-042',
      '[LIVE] Encryption simulation completed on 15 files',
      '[LIVE] Network scan detected 3 new targets',
      '[LIVE] Decryption key generated for victim-023',
      '[LIVE] Revenue distribution updated for Q4',
      '[LIVE] Blue team simulation mode activated'
    ];

    let currentIndex = 0;
    setInterval(() => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const tickerItem = document.createElement('span');
      tickerItem.className = 'ticker-item';
      tickerItem.textContent = randomActivity;
      ticker.appendChild(tickerItem);
      
      // Remove old items to prevent memory issues
      if (ticker.children.length > 10) {
        ticker.removeChild(ticker.firstChild);
      }
    }, 3000);
  }

  // Setup event listeners
  setupEventListeners() {
    // Role selector
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentRole = e.target.dataset.role;
        this.updateRoleView();
      });
    });

    // Timeframe selector
    const timeframeSelect = document.getElementById('timeframe-select');
    if (timeframeSelect) {
      timeframeSelect.addEventListener('change', (e) => {
        this.updateChartTimeframe(e.target.value);
      });
    }

    // Auto-refresh every 30 seconds
    setInterval(() => {
      this.loadDashboardData();
    }, 30000);
  }

  // Update role-based view
  updateRoleView() {
    const dashboardTitle = document.querySelector('.dashboard-title');
    const roleTitles = {
      'operator': 'OPERATIONS DASHBOARD',
      'affiliate': 'AFFILIATE DASHBOARD',
      'victim': 'VICTIM SIMULATION'
    };
    
    if (dashboardTitle) {
      dashboardTitle.textContent = roleTitles[this.currentRole] || 'OPERATIONS DASHBOARD';
    }
  }

  // Update chart timeframe
  updateChartTimeframe(timeframe) {
    if (!this.charts.infection) return;
    
    let hours = 24;
    switch(timeframe) {
      case '7d': hours = 168; break;
      case '30d': hours = 720; break;
    }
    
    this.charts.infection.data.labels = this.generateTimeLabels(hours);
    this.charts.infection.data.datasets[0].data = this.generateRandomData(hours, 0, 100);
    this.charts.infection.update();
  }

  // Start real-time updates
  startRealTimeUpdates() {
    // Simulate real-time data updates
    setInterval(() => {
      this.simulateRealTimeActivity();
    }, 5000);
  }

  // Simulate real-time activity
  simulateRealTimeActivity() {
    // Randomly update network nodes
    if (this.networkData.nodes) {
      this.networkData.nodes.forEach(node => {
        if (node.type === 'victim') {
          node.x += (Math.random() - 0.5) * 10;
          node.y += (Math.random() - 0.5) * 10;
        }
      });
    }
  }

  // Update last updated time
  updateLastUpdated() {
    const lastUpdated = document.getElementById('last-updated');
    if (lastUpdated) {
      lastUpdated.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
    }
  }

  // Show notification
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

  // Fetch JSON helper
  async fetchJSON(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error('Request failed');
    return response.json();
  }
}

// Global functions for dashboard buttons
function refreshDashboard() {
  const refreshBtn = document.querySelector('.btn-primary');
  if (refreshBtn) {
    refreshBtn.classList.add('loading');
    refreshBtn.disabled = true;
  }
  
  dashboard.loadDashboardData().finally(() => {
    if (refreshBtn) {
      refreshBtn.classList.remove('loading');
      refreshBtn.disabled = false;
    }
  });
}

function exportReport() {
  dashboard.showNotification('Generating comprehensive report...', 'info');
  
  // Simulate report generation
  setTimeout(() => {
    dashboard.showNotification('Report exported successfully!', 'success');
  }, 2000);
}

function toggleDefenseMode() {
  dashboard.defenseMode = !dashboard.defenseMode;
  const btn = document.querySelector('.btn-danger');
  
  if (dashboard.defenseMode) {
    btn.innerHTML = '<span class="btn-icon">🔴</span> RED TEAM';
    btn.style.background = 'var(--gradient-danger)';
    dashboard.showNotification('Switched to Blue Team Defense Mode', 'info');
  } else {
    btn.innerHTML = '<span class="btn-icon">🛡️</span> BLUE TEAM';
    btn.style.background = 'var(--gradient-primary)';
    dashboard.showNotification('Switched to Red Team Attack Mode', 'warning');
  }
}

function refreshNetwork() {
  dashboard.initializeNetworkGraph();
  dashboard.showNotification('Network graph refreshed', 'info');
}

function loadRecentActivity() {
  dashboard.loadRecentActivity();
  dashboard.showNotification('Recent activity updated', 'info');
}

// Initialize dashboard when DOM is loaded
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
  dashboard = new RaaSDashboard();
});
