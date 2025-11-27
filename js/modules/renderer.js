/**
 * Chat Renderer Module
 * Handles rendering messages to the DOM
 */

export class ChatRenderer {
    constructor() {
        this.container = document.getElementById('chatMessages');
        this.senderColors = {};
        this.colorPalette = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
            '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'
        ];
        this.colorIndex = 0;
    }

    render(messages) {
        this.container.innerHTML = '';

        if (messages.length === 0) {
            this.showEmptyState();
            return;
        }

        const fragment = document.createDocumentFragment();

        messages.forEach((msg, index) => {
            const element = this.createMessageElement(msg, index);
            if (element) {
                fragment.appendChild(element);
            }
        });

        this.container.appendChild(fragment);
        this.scrollToBottom();
    }

    createMessageElement(msg, index) {
        const div = document.createElement('div');

        switch (msg.type) {
            case 'date':
                div.className = 'date-separator';
                div.textContent = msg.content;
                break;

            case 'system':
                div.className = 'system-message';
                div.textContent = msg.content;
                break;

            case 'message':
                div.className = `message-bubble ${msg.isOutgoing ? 'outgoing' : 'incoming'}`;
                div.dataset.index = index;

                // Sender name for incoming messages
                if (!msg.isOutgoing) {
                    const senderDiv = document.createElement('div');
                    senderDiv.className = 'sender-name';
                    senderDiv.style.color = this.getSenderColor(msg.sender);
                    senderDiv.textContent = msg.sender;
                    div.appendChild(senderDiv);
                }

                // Message content
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.innerHTML = this.formatMessageContent(msg.content);
                div.appendChild(contentDiv);

                // Footer with time and ticks
                const footerDiv = document.createElement('div');
                footerDiv.className = 'message-footer';

                const timeSpan = document.createElement('span');
                timeSpan.className = 'message-time';
                timeSpan.textContent = msg.time;
                footerDiv.appendChild(timeSpan);

                // Add read ticks for outgoing messages
                if (msg.isOutgoing) {
                    const ticksSpan = document.createElement('span');
                    ticksSpan.className = 'message-ticks';
                    ticksSpan.innerHTML = `
                        <svg viewBox="0 0 16 15" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#53bdeb" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"/>
                        </svg>
                    `;
                    footerDiv.appendChild(ticksSpan);
                }

                div.appendChild(footerDiv);
                break;

            default:
                return null;
        }

        return div;
    }

    formatMessageContent(content) {
        // Escape HTML first
        let formatted = this.escapeHtml(content);

        // Format URLs
        formatted = formatted.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        // Format WhatsApp text formatting
        // Bold: *text*
        formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');

        // Italic: _text_
        formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');

        // Strikethrough: ~text~
        formatted = formatted.replace(/~([^~]+)~/g, '<del>$1</del>');

        // Preserve line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        return formatted;
    }

    getSenderColor(sender) {
        if (!this.senderColors[sender]) {
            this.senderColors[sender] = this.colorPalette[this.colorIndex % this.colorPalette.length];
            this.colorIndex++;
        }
        return this.senderColors[sender];
    }

    highlightSearchResults(results) {
        // Re-render with highlighted results
        const allMessages = Array.from(this.container.querySelectorAll('.message-bubble'));

        allMessages.forEach(bubble => {
            bubble.classList.remove('highlighted');
        });

        results.forEach(index => {
            const bubble = this.container.querySelector(`[data-index="${index}"]`);
            if (bubble) {
                bubble.classList.add('highlighted');
            }
        });

        // Scroll to first result
        if (results.length > 0) {
            const firstResult = this.container.querySelector(`[data-index="${results[0]}"]`);
            if (firstResult) {
                firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    scrollToBottom() {
        const chatContainer = document.getElementById('chatContainer');
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }

    clear() {
        this.container.innerHTML = '';
        this.senderColors = {};
        this.colorIndex = 0;
    }

    showEmptyState() {
        this.container.innerHTML = `
            <div class="empty-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>No messages to display</p>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}
