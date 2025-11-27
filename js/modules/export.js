/**
 * Export Manager Module
 * Handles exporting chat data
 */

export class ExportManager {
    exportAsJSON(messages, filename = 'chat') {
        const data = {
            exportDate: new Date().toISOString(),
            messageCount: messages.filter(m => m.type === 'message').length,
            messages: messages
        };

        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.sanitizeFilename(filename)}_export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    exportAsHTML(messages, filename = 'chat') {
        // Future enhancement: export as styled HTML
        console.log('HTML export not yet implemented');
    }

    sanitizeFilename(filename) {
        return filename
            .replace(/[^a-z0-9]/gi, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '')
            .toLowerCase();
    }
}
