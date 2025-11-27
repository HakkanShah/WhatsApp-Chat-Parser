/**
 * Statistics Module
 * Calculates chat statistics
 */

export class ChatStats {
    calculate(messages) {
        const messageMessages = messages.filter(m => m.type === 'message');

        if (messageMessages.length === 0) {
            return this.getEmptyStats();
        }

        const stats = {
            totalMessages: messageMessages.length,
            messagesBySender: {},
            messagesByDate: {},
            dateRange: { start: null, end: null },
            totalDays: 0,
            avgMessagesPerDay: 0,
            mostActiveDay: null
        };

        // Count messages by sender
        messageMessages.forEach(msg => {
            stats.messagesBySender[msg.sender] = (stats.messagesBySender[msg.sender] || 0) + 1;
        });

        // Count messages by date and find date range
        messageMessages.forEach(msg => {
            if (msg.date) {
                stats.messagesByDate[msg.date] = (stats.messagesByDate[msg.date] || 0) + 1;

                if (!stats.dateRange.start) {
                    stats.dateRange.start = msg.date;
                }
                stats.dateRange.end = msg.date;
            }
        });

        // Calculate total days
        stats.totalDays = Object.keys(stats.messagesByDate).length;

        // Calculate average messages per day
        if (stats.totalDays > 0) {
            stats.avgMessagesPerDay = Math.round(stats.totalMessages / stats.totalDays);
        }

        // Find most active day
        let maxCount = 0;
        let maxDate = null;

        for (const [date, count] of Object.entries(stats.messagesByDate)) {
            if (count > maxCount) {
                maxCount = count;
                maxDate = date;
            }
        }

        if (maxDate) {
            stats.mostActiveDay = {
                date: maxDate,
                count: maxCount
            };
        }

        return stats;
    }

    getEmptyStats() {
        return {
            totalMessages: 0,
            messagesBySender: {},
            messagesByDate: {},
            dateRange: { start: 'N/A', end: 'N/A' },
            totalDays: 0,
            avgMessagesPerDay: 0,
            mostActiveDay: null
        };
    }
}
