/**
 * UI Controller Module
 * Handles UI state and interactions
 */

export class UIController {
    constructor() {
        this.menuOpen = false;
        this.searchOpen = false;
    }

    toggleMenu() {
        this.menuOpen = !this.menuOpen;
        const menu = document.getElementById('sideMenu');
        const overlay = document.getElementById('menuOverlay');

        if (this.menuOpen) {
            menu.classList.add('open');
            overlay.classList.remove('hidden');
        } else {
            menu.classList.remove('open');
            overlay.classList.add('hidden');
        }
    }

    closeMenu() {
        if (this.menuOpen) {
            this.toggleMenu();
        }
    }

    toggleSearch() {
        this.searchOpen = !this.searchOpen;
        const searchBar = document.getElementById('searchBar');
        const searchInput = document.getElementById('searchInput');

        if (this.searchOpen) {
            searchBar.classList.remove('hidden');
            setTimeout(() => searchInput.focus(), 100);
        } else {
            searchBar.classList.add('hidden');
            searchInput.value = '';
            document.getElementById('clearSearch').classList.add('hidden');
            document.getElementById('searchResults').classList.add('hidden');
        }
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    showWelcomeScreen() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                </div>
                <h2 class="welcome-title">Welcome to WhatsApp Chat Parser</h2>
                <p class="welcome-text">Upload your WhatsApp chat export to get started</p>
                <button id="uploadBtnWelcome" class="btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                    Upload Chat File
                </button>
            </div>
        `;

        // Re-attach event listener
        const uploadBtn = document.getElementById('uploadBtnWelcome');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
        }
    }

    showLoading() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = `
            <div class="welcome-screen">
                <div class="welcome-icon" style="animation: spin 1s linear infinite;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
                    </svg>
                </div>
                <h2 class="welcome-title">Parsing Chat...</h2>
                <p class="welcome-text">Please wait while we process your file</p>
            </div>
        `;

        // Add spin animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    hideLoading() {
        // Loading is replaced by rendered messages
    }

    enableButtons() {
        document.getElementById('exportBtn').disabled = false;
        document.getElementById('clearBtn').disabled = false;
    }

    disableButtons() {
        document.getElementById('exportBtn').disabled = true;
        document.getElementById('clearBtn').disabled = true;
    }

    updateScrollButton(container) {
        const scrollBtn = document.getElementById('scrollBottomBtn');
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;

        if (isNearBottom) {
            scrollBtn.classList.add('hidden');
        } else {
            scrollBtn.classList.remove('hidden');
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            left: 50%;
            transform: translateX(-50%);
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 0.75rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
            z-index: 1000;
            animation: slideUp 0.3s ease-out;
            font-weight: 500;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideDown 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        // Add animations if not already present
        if (!document.getElementById('toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translate(-50%, 100%);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                @keyframes slideDown {
                    from {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, 100%);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }
}
