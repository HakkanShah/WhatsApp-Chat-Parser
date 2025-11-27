/**
 * WhatsApp Chat Parser - Main Application
 * Coordinates all modules and handles app initialization
 */

import { ChatParser } from './modules/parser.js';
import { ChatRenderer } from './modules/renderer.js';
import { ChatStats } from './modules/stats.js';
import { UIController } from './modules/ui.js';
import { SearchManager } from './modules/search.js';
import { ExportManager } from './modules/export.js';

class WhatsAppChatApp {
    constructor() {
        this.parser = new ChatParser();
        this.renderer = new ChatRenderer();
        this.stats = new ChatStats();
        this.ui = new UIController();
        this.search = new SearchManager();
        this.export = new ExportManager();

        this.messages = [];
        this.currentFile = null;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.ui.showWelcomeScreen();
    }

    setupEventListeners() {
        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadBtnWelcome = document.getElementById('uploadBtnWelcome');

        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        uploadBtnWelcome?.addEventListener('click', () => fileInput.click());

        // Menu controls
        document.getElementById('menuBtn').addEventListener('click', () => this.ui.toggleMenu());
        document.getElementById('closeMenuBtn').addEventListener('click', () => this.ui.toggleMenu());
        document.getElementById('menuOverlay').addEventListener('click', () => this.ui.toggleMenu());

        // Search
        document.getElementById('searchToggleBtn').addEventListener('click', () => {
            this.ui.toggleSearch();
            this.ui.closeMenu();
        });

        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('clearSearch').addEventListener('click', () => {
            this.clearSearch();
        });

        // Statistics
        document.getElementById('statsBtn').addEventListener('click', () => {
            this.showStatistics();
        });

        document.getElementById('closeStatsBtn').addEventListener('click', () => {
            this.ui.closeModal('statsModal');
        });

        // Help
        document.getElementById('helpBtn').addEventListener('click', () => {
            this.ui.openModal('helpModal');
            this.ui.closeMenu();
        });

        document.getElementById('closeHelpBtn').addEventListener('click', () => {
            this.ui.closeModal('helpModal');
        });

        // Export
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.handleExport();
        });

        // Clear chat
        document.getElementById('clearBtn').addEventListener('click', () => {
            this.clearChat();
        });

        // Scroll to bottom
        document.getElementById('scrollBottomBtn').addEventListener('click', () => {
            this.renderer.scrollToBottom();
        });

        // Auto-hide scroll button
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.addEventListener('scroll', () => {
            this.ui.updateScrollButton(chatContainer);
        });

        // Close modals on overlay click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.ui.closeModal(modal.id);
                }
            });
        });
    }

    async handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.name.endsWith('.txt')) {
            this.ui.showError('Please upload a .txt file');
            return;
        }

        try {
            this.ui.showLoading();

            const text = await this.readFile(file);
            this.messages = this.parser.parse(text);

            if (this.messages.length === 0) {
                throw new Error('No messages found in the file');
            }

            this.currentFile = file.name;
            this.renderer.render(this.messages);
            this.ui.enableButtons();
            this.ui.hideLoading();
            this.ui.closeMenu();

            // Show success notification
            this.ui.showNotification(`Loaded ${this.messages.filter(m => m.type === 'message').length} messages`, 'success');

        } catch (error) {
            console.error('Error parsing file:', error);
            this.ui.showError('Failed to parse chat file. Please ensure it\'s a valid WhatsApp export.');
            this.ui.hideLoading();
        }
    }

    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file);
        });
    }

    handleSearch(query) {
        const searchInput = document.getElementById('searchInput');
        const clearBtn = document.getElementById('clearSearch');
        const resultsDiv = document.getElementById('searchResults');

        if (query.trim()) {
            clearBtn.classList.remove('hidden');
            const results = this.search.search(this.messages, query);

            if (results.length > 0) {
                resultsDiv.textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;
                resultsDiv.classList.remove('hidden');
                this.renderer.highlightSearchResults(results);
            } else {
                resultsDiv.textContent = 'No results found';
                resultsDiv.classList.remove('hidden');
                this.renderer.render(this.messages);
            }
        } else {
            clearBtn.classList.add('hidden');
            resultsDiv.classList.add('hidden');
            this.renderer.render(this.messages);
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        searchInput.value = '';
        this.handleSearch('');
    }

    showStatistics() {
        if (this.messages.length === 0) {
            this.ui.showError('No chat loaded yet');
            return;
        }

        const statsData = this.stats.calculate(this.messages);
        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = this.renderStatistics(statsData);
        this.ui.openModal('statsModal');
    }

    renderStatistics(stats) {
        return `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-label">Total Messages</div>
                    <div class="stat-value">${stats.totalMessages}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Date Range</div>
                    <div class="stat-value" style="font-size: 1rem;">${stats.dateRange.start}</div>
                    <div class="stat-subtext">to ${stats.dateRange.end}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Total Days</div>
                    <div class="stat-value">${stats.totalDays}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Avg per Day</div>
                    <div class="stat-value">${stats.avgMessagesPerDay}</div>
                </div>
            </div>
            
            <div class="sender-stats">
                <h4>Messages by Sender</h4>
                <div class="sender-list">
                    ${Object.entries(stats.messagesBySender)
                .sort((a, b) => b[1] - a[1])
                .map(([sender, count]) => `
                            <div class="sender-item">
                                <span class="sender-name-stat">${this.escapeHtml(sender)}</span>
                                <span class="sender-count">${count} messages</span>
                            </div>
                        `).join('')}
                </div>
            </div>
            
            ${stats.mostActiveDay ? `
                <div class="sender-stats">
                    <h4>Most Active Day</h4>
                    <div class="sender-item">
                        <span class="sender-name-stat">${stats.mostActiveDay.date}</span>
                        <span class="sender-count">${stats.mostActiveDay.count} messages</span>
                    </div>
                </div>
            ` : ''}
        `;
    }

    handleExport() {
        if (this.messages.length === 0) {
            this.ui.showError('No chat loaded yet');
            return;
        }

        try {
            this.export.exportAsJSON(this.messages, this.currentFile || 'chat');
            this.ui.showNotification('Chat exported successfully', 'success');
            this.ui.closeMenu();
        } catch (error) {
            console.error('Export error:', error);
            this.ui.showError('Failed to export chat');
        }
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the current chat?')) {
            this.messages = [];
            this.currentFile = null;
            this.renderer.clear();
            this.ui.showWelcomeScreen();
            this.ui.disableButtons();
            this.ui.closeMenu();

            // Reset file input
            document.getElementById('fileInput').value = '';
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new WhatsAppChatApp();
});
