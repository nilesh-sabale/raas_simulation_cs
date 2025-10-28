// Network Graph JavaScript with Wow Factor Features
class NetworkVisualization {
  constructor() {
    this.networkData = { nodes: [], links: [] };
    this.simulation = null;
    this.map = null;
    this.currentView = 'graph';
    this.isAnimating = false;
    this.autoDemoInterval = null;
    this.commandHistory = [];
    this.commandIndex = -1;
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    this.generateNetworkData();
    this.initializeGraph();
    this.initializeMap();
    this.initializeTerminal();
    this.startRealTimeUpdates();
    this.updateStats();
  }

  setupEventListeners() {
    // View mode selector
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.switchView(e.target.dataset.mode);
      });
    });

    // Network controls
    const layoutSelect = document.getElementById('layout-select');
    if (layoutSelect) {
      layoutSelect.addEventListener('change', (e) => {
        this.changeLayout(e.target.value);
      });
    }

    const nodeFilter = document.getElementById('node-filter');
    if (nodeFilter) {
      nodeFilter.addEventListener('change', (e) => {
        this.filterNodes(e.target.value);
      });
    }

    const animationSpeed = document.getElementById('animation-speed');
    if (animationSpeed) {
      animationSpeed.addEventListener('input', (e) => {
        this.setAnimationSpeed(e.target.value);
      });
    }

    // Terminal input
    const terminalInput = document.getElementById('terminal-input');
    if (terminalInput) {
      terminalInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.executeCommand(e.target.value);
          e.target.value = '';
        }
      });

      terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          this.navigateCommandHistory(-1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          this.navigateCommandHistory(1);
        }
      });
    }
  }

  generateNetworkData() {
    const nodes = [];
    const links = [];

    // Generate operators
    for (let i = 0; i < 3; i++) {
      nodes.push({
        id: `operator-${i}`,
        type: 'operator',
        name: `Operator-${i}`,
        x: Math.random() * 800 + 100,
        y: Math.random() * 400 + 100,
        size: 20,
        connections: 0
      });
    }

    // Generate affiliates
    for (let i = 0; i < 8; i++) {
      nodes.push({
        id: `affiliate-${i}`,
        type: 'affiliate',
        name: `Affiliate-${i}`,
        x: Math.random() * 800 + 100,
        y: Math.random() * 400 + 100,
        size: 15,
        connections: 0
      });
    }

    // Generate victims
    for (let i = 0; i < 25; i++) {
      nodes.push({
        id: `victim-${i}`,
        type: 'victim',
        name: `Victim-${i}`,
        x: Math.random() * 800 + 100,
        y: Math.random() * 400 + 100,
        size: 10,
        connections: 0
      });
    }

    // Generate campaigns
    for (let i = 0; i < 5; i++) {
      nodes.push({
        id: `campaign-${i}`,
        type: 'campaign',
        name: `Campaign-${i}`,
        x: Math.random() * 800 + 100,
        y: Math.random() * 400 + 100,
        size: 12,
        connections: 0
      });
    }

    // Generate connections
    nodes.forEach(node => {
      if (node.type === 'operator') {
        // Operators connect to affiliates
        const affiliates = nodes.filter(n => n.type === 'affiliate');
        affiliates.forEach(affiliate => {
          if (Math.random() < 0.3) {
            links.push({
              source: node.id,
              target: affiliate.id,
              strength: Math.random() * 0.5 + 0.5
            });
            node.connections++;
            affiliate.connections++;
          }
        });
      } else if (node.type === 'affiliate') {
        // Affiliates connect to victims and campaigns
        const victims = nodes.filter(n => n.type === 'victim');
        const campaigns = nodes.filter(n => n.type === 'campaign');
        
        victims.forEach(victim => {
          if (Math.random() < 0.2) {
            links.push({
              source: node.id,
              target: victim.id,
              strength: Math.random() * 0.3 + 0.2
            });
            node.connections++;
            victim.connections++;
          }
        });

        campaigns.forEach(campaign => {
          if (Math.random() < 0.4) {
            links.push({
              source: node.id,
              target: campaign.id,
              strength: Math.random() * 0.4 + 0.3
            });
            node.connections++;
            campaign.connections++;
          }
        });
      }
    });

    this.networkData = { nodes, links };
  }

  initializeGraph() {
    const svg = d3.select('#network-svg');
    const width = svg.node().clientWidth;
    const height = svg.node().clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Create simulation
    this.simulation = d3.forceSimulation(this.networkData.nodes)
      .force('link', d3.forceLink(this.networkData.links).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => d.size + 5));

    // Create links
    const link = svg.append('g')
      .selectAll('line')
      .data(this.networkData.links)
      .enter().append('line')
      .attr('stroke', '#00ff88')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => d.strength * 3);

    // Create nodes
    const node = svg.append('g')
      .selectAll('circle')
      .data(this.networkData.nodes)
      .enter().append('circle')
      .attr('r', d => d.size)
      .attr('fill', d => this.getNodeColor(d.type))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .call(this.drag(this.simulation))
      .on('click', (event, d) => this.showNodeDetails(d))
      .on('mouseover', (event, d) => this.highlightNode(d))
      .on('mouseout', () => this.clearHighlight());

    // Add labels
    const label = svg.append('g')
      .selectAll('text')
      .data(this.networkData.nodes)
      .enter().append('text')
      .text(d => d.name)
      .attr('font-size', '10px')
      .attr('font-family', 'JetBrains Mono')
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size + 15);

    // Update positions
    this.simulation.on('tick', () => {
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

  initializeMap() {
    this.map = L.map('threat-map').setView([20, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add threat markers
    const threatLocations = [
      { lat: 40.7128, lng: -74.0060, name: 'New York', threats: 5, level: 'high' },
      { lat: 51.5074, lng: -0.1278, name: 'London', threats: 3, level: 'medium' },
      { lat: 35.6762, lng: 139.6503, name: 'Tokyo', threats: 4, level: 'high' },
      { lat: 48.8566, lng: 2.3522, name: 'Paris', threats: 2, level: 'low' },
      { lat: -33.8688, lng: 151.2093, name: 'Sydney', threats: 1, level: 'low' },
      { lat: 55.7558, lng: 37.6176, name: 'Moscow', threats: 6, level: 'critical' },
      { lat: 39.9042, lng: 116.4074, name: 'Beijing', threats: 3, level: 'medium' },
      { lat: -22.9068, lng: -43.1729, name: 'Rio de Janeiro', threats: 2, level: 'low' }
    ];

    threatLocations.forEach(location => {
      const color = this.getThreatColor(location.level);
      const marker = L.circleMarker([location.lat, location.lng], {
        radius: location.threats * 3,
        fillColor: color,
        color: '#ffffff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(this.map);

      marker.bindPopup(`
        <div class="map-popup">
          <h4>${location.name}</h4>
          <p><strong>Threats:</strong> ${location.threats}</p>
          <p><strong>Level:</strong> ${location.level.toUpperCase()}</p>
        </div>
      `);
    });
  }

  initializeTerminal() {
    this.addTerminalOutput('Network terminal initialized');
    this.addTerminalOutput('Type "help" for available commands');
  }

  switchView(view) {
    this.currentView = view;
    
    // Hide all views
    document.getElementById('network-view').style.display = 'none';
    document.getElementById('map-view').style.display = 'none';
    document.getElementById('terminal-view').style.display = 'none';
    
    // Show selected view
    switch (view) {
      case 'graph':
        document.getElementById('network-view').style.display = 'block';
        break;
      case 'map':
        document.getElementById('map-view').style.display = 'block';
        break;
      case 'terminal':
        document.getElementById('terminal-view').style.display = 'block';
        break;
    }
  }

  changeLayout(layout) {
    if (!this.simulation) return;

    switch (layout) {
      case 'force':
        this.simulation
          .force('link', d3.forceLink(this.networkData.links).id(d => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-300))
          .force('center', d3.forceCenter(400, 300));
        break;
      case 'circular':
        this.simulation
          .force('link', d3.forceLink(this.networkData.links).id(d => d.id).distance(150))
          .force('charge', d3.forceManyBody().strength(-100))
          .force('center', d3.forceCenter(400, 300));
        break;
      case 'hierarchical':
        this.simulation
          .force('link', d3.forceLink(this.networkData.links).id(d => d.id).distance(200))
          .force('charge', d3.forceManyBody().strength(-200))
          .force('center', d3.forceCenter(400, 300));
        break;
      case 'grid':
        this.simulation
          .force('link', d3.forceLink(this.networkData.links).id(d => d.id).distance(100))
          .force('charge', d3.forceManyBody().strength(-50))
          .force('center', d3.forceCenter(400, 300));
        break;
    }

    this.simulation.alpha(0.3).restart();
  }

  filterNodes(filter) {
    const svg = d3.select('#network-svg');
    
    if (filter === 'all') {
      svg.selectAll('circle').style('opacity', 1);
      svg.selectAll('line').style('opacity', 1);
      svg.selectAll('text').style('opacity', 1);
    } else {
      svg.selectAll('circle').style('opacity', d => d.type === filter ? 1 : 0.3);
      svg.selectAll('line').style('opacity', 0.3);
      svg.selectAll('text').style('opacity', d => d.type === filter ? 1 : 0.3);
    }
  }

  setAnimationSpeed(speed) {
    if (this.simulation) {
      this.simulation.alphaDecay(1 - speed / 100);
    }
  }

  resetView() {
    if (this.simulation) {
      this.simulation.alpha(0.3).restart();
    }
  }

  toggleLabels() {
    const svg = d3.select('#network-svg');
    const labels = svg.selectAll('text');
    const isVisible = labels.style('opacity') !== '0';
    labels.style('opacity', isVisible ? 0 : 1);
  }

  getNodeColor(type) {
    const colors = {
      'operator': '#00ff88',
      'affiliate': '#00aaff',
      'victim': '#ff4444',
      'campaign': '#ffaa00'
    };
    return colors[type] || '#666666';
  }

  getThreatColor(level) {
    const colors = {
      'low': '#00ff88',
      'medium': '#ffaa00',
      'high': '#ff4444',
      'critical': '#8b0000'
    };
    return colors[level] || '#666666';
  }

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

  showNodeDetails(node) {
    document.getElementById('node-modal-title').textContent = `${node.name} Details`;
    
    const details = `
      <div class="node-info">
        <h4>${node.name}</h4>
        <p><strong>Type:</strong> ${node.type.toUpperCase()}</p>
        <p><strong>Connections:</strong> ${node.connections}</p>
        <p><strong>Position:</strong> (${Math.round(node.x)}, ${Math.round(node.y)})</p>
        <p><strong>Size:</strong> ${node.size}px</p>
      </div>
    `;
    
    document.getElementById('node-details').innerHTML = details;
    document.getElementById('node-modal').style.display = 'flex';
  }

  highlightNode(node) {
    const svg = d3.select('#network-svg');
    
    // Highlight connected nodes
    const connectedNodes = this.networkData.links
      .filter(link => link.source.id === node.id || link.target.id === node.id)
      .map(link => link.source.id === node.id ? link.target.id : link.source.id);
    
    svg.selectAll('circle').style('opacity', d => 
      d.id === node.id || connectedNodes.includes(d.id) ? 1 : 0.3
    );
    
    svg.selectAll('line').style('opacity', d => 
      d.source.id === node.id || d.target.id === node.id ? 1 : 0.1
    );
  }

  clearHighlight() {
    const svg = d3.select('#network-svg');
    svg.selectAll('circle').style('opacity', 1);
    svg.selectAll('line').style('opacity', 0.6);
  }

  closeNodeModal() {
    document.getElementById('node-modal').style.display = 'none';
  }

  traceNode() {
    this.addTerminalOutput('Tracing node connections...');
    this.addTerminalOutput('Connection analysis complete');
  }

  executeCommand(command) {
    this.commandHistory.push(command);
    this.commandIndex = this.commandHistory.length;
    
    this.addTerminalLine(command);
    
    switch (command.toLowerCase()) {
      case 'help':
        this.addTerminalOutput('Available commands:');
        this.addTerminalOutput('  scan - Scan network for active nodes');
        this.addTerminalOutput('  trace - Trace connection paths');
        this.addTerminalOutput('  analyze - Analyze network topology');
        this.addTerminalOutput('  monitor - Monitor real-time activity');
        this.addTerminalOutput('  clear - Clear terminal screen');
        this.addTerminalOutput('  exit - Exit terminal');
        break;
      case 'scan':
        this.addTerminalOutput('Scanning network...');
        this.addTerminalOutput(`Found ${this.networkData.nodes.length} nodes`);
        this.addTerminalOutput(`Found ${this.networkData.links.length} connections`);
        break;
      case 'trace':
        this.addTerminalOutput('Tracing network paths...');
        this.addTerminalOutput('Path analysis complete');
        break;
      case 'analyze':
        this.addTerminalOutput('Analyzing network topology...');
        this.addTerminalOutput('Topology analysis complete');
        break;
      case 'monitor':
        this.addTerminalOutput('Starting real-time monitoring...');
        this.addTerminalOutput('Monitoring active');
        break;
      case 'clear':
        this.clearTerminal();
        break;
      case 'exit':
        this.addTerminalOutput('Exiting terminal...');
        break;
      default:
        this.addTerminalOutput(`Command not found: ${command}`);
        this.addTerminalOutput('Type "help" for available commands');
    }
  }

  addTerminalLine(command) {
    const terminalBody = document.getElementById('terminal-body');
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `
      <span class="prompt">raas-simulation@network:~$</span>
      <span class="command">${command}</span>
    `;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  addTerminalOutput(text) {
    const terminalBody = document.getElementById('terminal-body');
    const output = document.createElement('div');
    output.className = 'terminal-output';
    output.innerHTML = `<div class="output-line">${text}</div>`;
    terminalBody.appendChild(output);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  navigateCommandHistory(direction) {
    if (this.commandHistory.length === 0) return;
    
    this.commandIndex += direction;
    
    if (this.commandIndex < 0) {
      this.commandIndex = 0;
    } else if (this.commandIndex >= this.commandHistory.length) {
      this.commandIndex = this.commandHistory.length;
    }
    
    const terminalInput = document.getElementById('terminal-input');
    if (this.commandIndex < this.commandHistory.length) {
      terminalInput.value = this.commandHistory[this.commandIndex];
    } else {
      terminalInput.value = '';
    }
  }

  clearTerminal() {
    const terminalBody = document.getElementById('terminal-body');
    terminalBody.innerHTML = '';
    this.addTerminalOutput('Terminal cleared');
  }

  startRealTimeUpdates() {
    // Simulate real-time network activity
    setInterval(() => {
      this.simulateNetworkActivity();
    }, 3000);

    // Update activity feed
    setInterval(() => {
      this.addActivityItem();
    }, 2000);
  }

  simulateNetworkActivity() {
    // Add new nodes occasionally
    if (Math.random() < 0.1) {
      this.addRandomNode();
    }

    // Update existing nodes
    this.networkData.nodes.forEach(node => {
      if (Math.random() < 0.05) {
        node.connections += Math.floor(Math.random() * 3);
      }
    });

    this.updateStats();
  }

  addRandomNode() {
    const types = ['victim', 'affiliate', 'campaign'];
    const type = types[Math.floor(Math.random() * types.length)];
    const id = `${type}-${Date.now()}`;
    
    const newNode = {
      id,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)}-${Date.now()}`,
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 100,
      size: type === 'victim' ? 10 : type === 'affiliate' ? 15 : 12,
      connections: 0
    };

    this.networkData.nodes.push(newNode);
    this.initializeGraph();
  }

  addActivityItem() {
    const activities = [
      'New node detected in network',
      'Connection established between nodes',
      'Network topology updated',
      'Threat level increased',
      'Campaign launched successfully',
      'Victim system compromised',
      'Payment received from victim',
      'Network scan completed'
    ];

    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    this.addActivityFeedItem(randomActivity);
  }

  addActivityFeedItem(text) {
    const feed = document.getElementById('activity-feed');
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.innerHTML = `
      <span class="activity-time">${new Date().toLocaleTimeString()}</span>
      <span class="activity-text">${text}</span>
    `;
    
    feed.insertBefore(item, feed.firstChild);
    
    // Keep only last 10 items
    while (feed.children.length > 10) {
      feed.removeChild(feed.lastChild);
    }
  }

  updateStats() {
    document.getElementById('node-count').textContent = this.networkData.nodes.length;
    document.getElementById('edge-count').textContent = this.networkData.links.length;
    document.getElementById('cluster-count').textContent = Math.floor(this.networkData.nodes.length / 5);
    
    document.getElementById('country-count').textContent = 8;
    document.getElementById('threat-count').textContent = 25;
    document.getElementById('active-count').textContent = 12;
    
    document.getElementById('command-count').textContent = this.commandHistory.length;
  }

  runAutoDemo() {
    if (this.autoDemoInterval) {
      clearInterval(this.autoDemoInterval);
      this.autoDemoInterval = null;
      this.showNotification('Auto demo stopped', 'info');
      return;
    }

    this.showNotification('Starting auto demo...', 'info');
    
    const demoSteps = [
      () => this.switchView('graph'),
      () => this.changeLayout('force'),
      () => this.filterNodes('operators'),
      () => this.filterNodes('all'),
      () => this.switchView('map'),
      () => this.switchView('terminal'),
      () => this.executeCommand('scan'),
      () => this.executeCommand('analyze'),
      () => this.switchView('graph')
    ];

    let stepIndex = 0;
    this.autoDemoInterval = setInterval(() => {
      if (stepIndex < demoSteps.length) {
        demoSteps[stepIndex]();
        stepIndex++;
      } else {
        clearInterval(this.autoDemoInterval);
        this.autoDemoInterval = null;
        this.showNotification('Auto demo completed', 'success');
      }
    }, 2000);
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
function refreshNetwork() {
  networkViz.generateNetworkData();
  networkViz.initializeGraph();
  networkViz.updateStats();
  networkViz.showNotification('Network refreshed', 'info');
}

function exportNetwork() {
  networkViz.showNotification('Exporting network data...', 'info');
  
  setTimeout(() => {
    networkViz.showNotification('Network data exported successfully!', 'success');
  }, 2000);
}

function runAutoDemo() {
  networkViz.runAutoDemo();
}

function resetView() {
  networkViz.resetView();
  networkViz.showNotification('View reset', 'info');
}

function toggleLabels() {
  networkViz.toggleLabels();
  networkViz.showNotification('Labels toggled', 'info');
}

function clearActivityFeed() {
  document.getElementById('activity-feed').innerHTML = '';
  networkViz.showNotification('Activity feed cleared', 'info');
}

function closeNodeModal() {
  networkViz.closeNodeModal();
}

function traceNode() {
  networkViz.traceNode();
}

// Initialize network visualization
let networkViz;
document.addEventListener('DOMContentLoaded', () => {
  networkViz = new NetworkVisualization();
});
