// Reports & Analytics JavaScript
class ReportsManager {
  constructor() {
    this.reports = [];
    this.currentReportType = 'executive';
    this.chatHistory = [];
    this.isGenerating = false;
    
    this.init();
  }

  async init() {
    this.setupEventListeners();
    await this.loadRecentReports();
    this.updatePreview();
    this.initializeChat();
  }

  setupEventListeners() {
    // Report type selector
    document.querySelectorAll('.role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.currentReportType = e.target.dataset.type;
        this.updatePreview();
      });
    });

    // Report configuration inputs
    const titleInput = document.getElementById('report-title');
    const periodSelect = document.getElementById('report-period');
    const formatSelect = document.getElementById('report-format');

    if (titleInput) {
      titleInput.addEventListener('input', () => this.updatePreview());
    }

    if (periodSelect) {
      periodSelect.addEventListener('change', () => this.updatePreview());
    }

    if (formatSelect) {
      formatSelect.addEventListener('change', () => this.updatePreview());
    }

    // Chat input
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
      chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }
  }

  updatePreview() {
    const title = document.getElementById('report-title').value || 'RaaS Simulation Analysis Report';
    const period = document.getElementById('report-period').value;
    const format = document.getElementById('report-format').value;

    // Update preview elements
    document.getElementById('preview-title').textContent = title;
    document.getElementById('preview-date').textContent = `Generated on: ${new Date().toLocaleDateString()}`;

    // Update preview data based on report type
    this.updatePreviewData();
  }

  updatePreviewData() {
    const mockData = {
      executive: {
        campaigns: 12,
        threats: 8,
        revenue: '0.45 BTC',
        success: '85%'
      },
      technical: {
        campaigns: 15,
        threats: 12,
        revenue: '0.67 BTC',
        success: '78%'
      },
      incident: {
        campaigns: 8,
        threats: 5,
        revenue: '0.23 BTC',
        success: '92%'
      }
    };

    const data = mockData[this.currentReportType] || mockData.executive;
    
    document.getElementById('preview-campaigns').textContent = data.campaigns;
    document.getElementById('preview-threats').textContent = data.threats;
    document.getElementById('preview-revenue').textContent = data.revenue;
    document.getElementById('preview-success').textContent = data.success;
  }

  async loadRecentReports() {
    // Simulate loading recent reports
    const mockReports = [
      {
        id: 1,
        title: 'Executive Summary - Q4 2024',
        type: 'executive',
        generated: '2024-01-15',
        size: '2.3 MB',
        format: 'PDF'
      },
      {
        id: 2,
        title: 'Technical Analysis Report',
        type: 'technical',
        generated: '2024-01-14',
        size: '1.8 MB',
        format: 'PDF'
      },
      {
        id: 3,
        title: 'Incident Response Report',
        type: 'incident',
        generated: '2024-01-13',
        size: '1.2 MB',
        format: 'PDF'
      },
      {
        id: 4,
        title: 'Campaign Performance Data',
        type: 'technical',
        generated: '2024-01-12',
        size: '0.9 MB',
        format: 'Excel'
      }
    ];

    this.reports = mockReports;
    this.renderRecentReports();
  }

  renderRecentReports() {
    const container = document.getElementById('reports-list');
    if (!container) return;

    container.innerHTML = this.reports.map(report => `
      <div class="report-item">
        <div class="report-info">
          <h4 class="report-name">${report.title}</h4>
          <div class="report-meta">
            <span class="report-type">${report.type.toUpperCase()}</span>
            <span class="report-date">${report.generated}</span>
            <span class="report-size">${report.size}</span>
            <span class="report-format">${report.format}</span>
          </div>
        </div>
        <div class="report-actions">
          <button class="btn btn-small" onclick="downloadReport(${report.id})">DOWNLOAD</button>
          <button class="btn btn-small btn-secondary" onclick="viewReport(${report.id})">VIEW</button>
          <button class="btn btn-small btn-danger" onclick="deleteReport(${report.id})">DELETE</button>
        </div>
      </div>
    `).join('');
  }

  async generateReport() {
    if (this.isGenerating) return;

    this.isGenerating = true;
    document.getElementById('report-modal').style.display = 'flex';
    
    const steps = [
      'Collecting data...',
      'Analyzing campaigns...',
      'Processing threat intelligence...',
      'Generating charts...',
      'Compiling recommendations...',
      'Finalizing report...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await this.updateProgress((i + 1) / steps.length * 100, steps[i]);
      await this.delay(1000);
    }

    await this.delay(500);
    
    // Generate the actual report
    const reportData = this.collectReportData();
    const format = document.getElementById('report-format').value;
    
    if (format === 'pdf') {
      await this.generatePDFReport(reportData);
    } else {
      await this.generateDataExport(reportData, format);
    }

    this.isGenerating = false;
    this.closeReportModal();
    this.showNotification('Report generated successfully!', 'success');
  }

  collectReportData() {
    return {
      title: document.getElementById('report-title').value || 'RaaS Simulation Analysis Report',
      type: this.currentReportType,
      period: document.getElementById('report-period').value,
      format: document.getElementById('report-format').value,
      generated: new Date().toISOString(),
      data: {
        campaigns: Math.floor(Math.random() * 20) + 5,
        threats: Math.floor(Math.random() * 15) + 3,
        revenue: (Math.random() * 1).toFixed(3) + ' BTC',
        success: Math.floor(Math.random() * 30) + 70 + '%'
      }
    };
  }

  async generatePDFReport(reportData) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Set up the document
    doc.setFont('helvetica');
    doc.setFontSize(20);
    doc.text(reportData.title, 20, 30);
    
    doc.setFontSize(12);
    doc.text('Educational RaaS Simulation Report', 20, 45);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Report Type: ${reportData.type.toUpperCase()}`, 20, 65);
    
    // Add content sections
    let yPosition = 80;
    
    // Executive Summary
    doc.setFontSize(16);
    doc.text('Executive Summary', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text(`Total Campaigns: ${reportData.data.campaigns}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Active Threats: ${reportData.data.threats}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Revenue Generated: ${reportData.data.revenue}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Success Rate: ${reportData.data.success}`, 20, yPosition);
    yPosition += 20;
    
    // Campaign Analysis
    doc.setFontSize(16);
    doc.text('Campaign Analysis', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text('This simulation demonstrates various ransomware campaign strategies', 20, yPosition);
    yPosition += 10;
    doc.text('including targeting different sectors and implementing different', 20, yPosition);
    yPosition += 10;
    doc.text('encryption methods for educational purposes.', 20, yPosition);
    yPosition += 20;
    
    // Recommendations
    doc.setFontSize(16);
    doc.text('Recommendations', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text('1. Implement comprehensive endpoint protection', 20, yPosition);
    yPosition += 10;
    doc.text('2. Enhance network monitoring and detection', 20, yPosition);
    yPosition += 10;
    doc.text('3. Conduct regular security awareness training', 20, yPosition);
    yPosition += 10;
    doc.text('4. Maintain up-to-date backups and recovery procedures', 20, yPosition);
    yPosition += 20;
    
    // Footer
    doc.setFontSize(8);
    doc.text('This is an educational simulation and does not represent real threats.', 20, yPosition);
    yPosition += 10;
    doc.text('All data is simulated and safe for educational purposes.', 20, yPosition);
    
    // Save the PDF
    doc.save(`raas-simulation-report-${Date.now()}.pdf`);
  }

  async generateDataExport(reportData, format) {
    let data, filename, mimeType;
    
    switch (format) {
      case 'excel':
        // Simulate Excel export
        data = this.generateExcelData(reportData);
        filename = `raas-simulation-data-${Date.now()}.xlsx`;
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'csv':
        data = this.generateCSVData(reportData);
        filename = `raas-simulation-data-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;
      case 'json':
        data = JSON.stringify(reportData, null, 2);
        filename = `raas-simulation-data-${Date.now()}.json`;
        mimeType = 'application/json';
        break;
    }
    
    // Create and download file
    const blob = new Blob([data], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  generateExcelData(reportData) {
    // Simulate Excel data generation
    return `Campaign ID,Campaign Name,Sector,Victims,Revenue,Success Rate
C001,Healthcare Alpha,Healthcare,12,0.18,78%
C002,Finance Beta,Financial,7,0.22,92%
C003,Education Gamma,Education,5,0.15,85%`;
  }

  generateCSVData(reportData) {
    return `Campaign ID,Campaign Name,Sector,Victims,Revenue,Success Rate
C001,Healthcare Alpha,Healthcare,12,0.18,78%
C002,Finance Beta,Financial,7,0.22,92%
C003,Education Gamma,Education,5,0.15,85%`;
  }

  async updateProgress(percentage, text) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
      progressText.textContent = text;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  initializeChat() {
    this.chatHistory = [
      {
        type: 'bot',
        message: 'Hello! I\'m your AI assistant for the RaaS simulation. I can help you analyze data, generate insights, and answer questions about the simulation. What would you like to know?'
      }
    ];
  }

  sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message
    this.addChatMessage('user', message);
    input.value = '';
    
    // Generate bot response
    setTimeout(() => {
      const response = this.generateBotResponse(message);
      this.addChatMessage('bot', response);
    }, 1000);
  }

  addChatMessage(type, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const avatar = type === 'bot' ? '🤖' : '👤';
    messageDiv.innerHTML = `
      <div class="message-avatar">${avatar}</div>
      <div class="message-content">
        <p>${message}</p>
      </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  generateBotResponse(userMessage) {
    const responses = {
      'campaign': 'Based on the simulation data, we have 12 active campaigns with an average success rate of 85%. The healthcare sector shows the highest vulnerability.',
      'threat': 'Current threat intelligence shows 8 active threats, with ransomware campaigns being the most prevalent. Critical threats include Campaign Alpha targeting healthcare.',
      'revenue': 'Total simulated revenue generated is 0.45 BTC across all campaigns. The financial sector campaigns show the highest revenue per victim.',
      'recommendation': 'Key recommendations include implementing real-time endpoint protection, enhancing network monitoring, and conducting security awareness training.',
      'default': 'I can help you analyze campaign performance, threat intelligence, revenue metrics, and provide recommendations. What specific aspect would you like to know more about?'
    };
    
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('campaign')) return responses.campaign;
    if (lowerMessage.includes('threat')) return responses.threat;
    if (lowerMessage.includes('revenue') || lowerMessage.includes('money')) return responses.revenue;
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest')) return responses.recommendation;
    
    return responses.default;
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
function generateReport() {
  reportsManager.generateReport();
}

function exportData() {
  reportsManager.showNotification('Exporting data...', 'info');
  
  setTimeout(() => {
    reportsManager.showNotification('Data exported successfully!', 'success');
  }, 2000);
}

function scheduleReport() {
  reportsManager.showNotification('Report scheduling feature coming soon!', 'info');
}

function refreshPreview() {
  reportsManager.updatePreview();
  reportsManager.showNotification('Preview refreshed', 'info');
}

function closeReportModal() {
  document.getElementById('report-modal').style.display = 'none';
}

function sendMessage() {
  reportsManager.sendMessage();
}

function loadRecentReports() {
  reportsManager.loadRecentReports();
  reportsManager.showNotification('Recent reports refreshed', 'info');
}

function downloadReport(id) {
  reportsManager.showNotification(`Downloading report ${id}...`, 'info');
}

function viewReport(id) {
  reportsManager.showNotification(`Opening report ${id}...`, 'info');
}

function deleteReport(id) {
  if (confirm('Are you sure you want to delete this report?')) {
    reportsManager.showNotification(`Report ${id} deleted`, 'success');
  }
}

// Initialize reports manager
let reportsManager;
document.addEventListener('DOMContentLoaded', () => {
  reportsManager = new ReportsManager();
});
