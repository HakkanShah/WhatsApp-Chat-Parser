/**
 * Search Manager Module
 * Handles message searching
 */

export class SearchManager {
    search(messages, query) {
        if (!query || query.trim() === '') {
            return [];
        }

        const lowerQuery = query.toLowerCase();
        const results = [];

        messages.forEach((msg, index) => {
            if (msg.type === 'message') {
                // Search in message content
                if (msg.content.toLowerCase().includes(lowerQuery)) {
                    results.push(index);
                    return;
                }

                // Search in sender name
                if (msg.sender.toLowerCase().includes(lowerQuery)) {
                    results.push(index);
                    return;
                }
            }
        });

        return results;
    }

    highlightText(text, query) {
        if (!query || query.trim() === '') {
            return text;
        }

        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
