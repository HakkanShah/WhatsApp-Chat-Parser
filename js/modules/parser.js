/**
 * Chat Parser Module
 * Handles parsing of WhatsApp chat export files
 */

export class ChatParser {
    constructor() {
        // Multiple regex patterns to support different WhatsApp export formats
        this.messagePatterns = [
            // Format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
            /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]\s([^:]+):\s(.*)$/,
            // Format: DD/MM/YYYY, HH:MM - Sender: Message
            /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s([^:]+):\s(.*)$/,
            // Format: DD.MM.YY, HH:MM - Sender: Message
            /^(\d{1,2}\.\d{1,2}\.\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s([^:]+):\s(.*)$/,
            // Format: M/D/YY, H:MM AM/PM - Sender: Message (US format)
            /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}\s?[AP]M)\s-\s([^:]+):\s(.*)$/i,
            // Format: DD-MM-YYYY, HH:MM - Sender: Message
            /^(\d{1,2}-\d{1,2}-\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s([^:]+):\s(.*)$/,
            // Format: YYYY-MM-DD, HH:MM - Sender: Message (ISO format)
            /^(\d{4}-\d{1,2}-\d{1,2}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s([^:]+):\s(.*)$/,
            // Format without comma: DD/MM/YYYY HH:MM - Sender: Message
            /^(\d{1,2}\/\d{1,2}\/\d{2,4})\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s([^:]+):\s(.*)$/,
        ];

        this.systemMessagePatterns = [
            /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\]\s(.+)$/,
            /^(\d{1,2}\/\d{1,2}\/\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s(.+)$/,
            /^(\d{1,2}\.\d{1,2}\.\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s(.+)$/,
            /^(\d{1,2}-\d{1,2}-\d{2,4}),\s(\d{1,2}:\d{2}(?::\d{2})?(?:\s?[AP]M)?)\s-\s(.+)$/,
        ];
    }

    parse(text) {
        const lines = text.split('\n');
        const messages = [];
        let currentMessage = null;
        let currentDate = null;
        let outgoingSender = null;
        const senderCounts = {};

        // Debug: Log first few lines to help diagnose format issues
        console.log('Parsing chat file. First 3 lines:');
        for (let i = 0; i < Math.min(3, lines.length); i++) {
            console.log(`Line ${i + 1}: "${lines[i].trim()}"`);
        }

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            // Remove Unicode direction markers and other invisible characters
            const cleanLine = line.replace(/[\u200E\u200F\uFEFF]/g, '');

            // Try to match as a message
            let matched = false;
            for (const pattern of this.messagePatterns) {
                const match = cleanLine.match(pattern);
                if (match) {
                    // Save previous message
                    if (currentMessage) {
                        messages.push(currentMessage);
                    }

                    const [, date, time, sender, content] = match;

                    // Add date separator if date changed
                    if (date !== currentDate) {
                        messages.push({
                            type: 'date',
                            content: this.formatDate(date)
                        });
                        currentDate = date;
                    }

                    // Track sender for determining outgoing messages
                    const trimmedSender = sender.trim();
                    senderCounts[trimmedSender] = (senderCounts[trimmedSender] || 0) + 1;

                    currentMessage = {
                        type: 'message',
                        date: date,
                        time: this.formatTime(time),
                        sender: trimmedSender,
                        content: content.trim(),
                        isOutgoing: false // Will be determined later
                    };

                    matched = true;
                    break;
                }
            }

            if (matched) continue;

            // Try to match as system message
            for (const pattern of this.systemMessagePatterns) {
                const match = cleanLine.match(pattern);
                if (match) {
                    if (currentMessage) {
                        messages.push(currentMessage);
                        currentMessage = null;
                    }

                    const [, date, time, content] = match;

                    // Add date separator if date changed
                    if (date !== currentDate) {
                        messages.push({
                            type: 'date',
                            content: this.formatDate(date)
                        });
                        currentDate = date;
                    }

                    messages.push({
                        type: 'system',
                        content: content.trim()
                    });

                    matched = true;
                    break;
                }
            }

            if (matched) continue;

            // If not matched, it's a continuation of the previous message
            if (currentMessage) {
                currentMessage.content += '\n' + line;
            }
        }

        // Add last message
        if (currentMessage) {
            messages.push(currentMessage);
        }

        // Debug: Log parsing results
        console.log(`Parsed ${messages.length} total items (messages, dates, system messages)`);
        const messageCount = messages.filter(m => m.type === 'message').length;
        console.log(`Found ${messageCount} actual messages`);

        if (messageCount === 0) {
            console.error('No messages found! The file format may not be recognized.');
            console.error('Please check that this is a valid WhatsApp chat export.');
        }

        // Determine outgoing sender (the one with most messages or second sender)
        outgoingSender = this.determineOutgoingSender(messages, senderCounts);

        // Mark outgoing messages
        messages.forEach(msg => {
            if (msg.type === 'message') {
                msg.isOutgoing = msg.sender === outgoingSender;
            }
        });

        return messages;
    }

    determineOutgoingSender(messages, senderCounts) {
        const senders = Object.keys(senderCounts);

        if (senders.length === 0) return null;
        if (senders.length === 1) return senders[0];

        // Find the second sender who sent a message
        const messageMessages = messages.filter(m => m.type === 'message');
        if (messageMessages.length >= 2) {
            const firstSender = messageMessages[0].sender;
            for (let i = 1; i < messageMessages.length; i++) {
                if (messageMessages[i].sender !== firstSender) {
                    return messageMessages[i].sender;
                }
            }
        }

        // Fallback: return the sender with fewer messages (assuming you send less)
        return senders.reduce((a, b) =>
            senderCounts[a] < senderCounts[b] ? a : b
        );
    }

    formatDate(dateStr) {
        // Try to parse and format the date nicely
        try {
            const parts = dateStr.split(/[\/\.\-]/);
            if (parts.length === 3) {
                let day, month, year;

                // Detect format based on first part length
                if (parts[0].length === 4) {
                    // YYYY-MM-DD format
                    [year, month, day] = parts;
                } else {
                    // DD/MM/YYYY or MM/DD/YYYY format (assume DD/MM/YYYY)
                    [day, month, year] = parts;
                }

                // Handle 2-digit years
                if (year.length === 2) {
                    year = '20' + year;
                }

                const date = new Date(year, month - 1, day);

                // Check if date is valid
                if (!isNaN(date.getTime())) {
                    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
                    return date.toLocaleDateString('en-US', options);
                }
            }
        } catch (e) {
            // If parsing fails, return original
        }

        return dateStr;
    }

    formatTime(timeStr) {
        // Normalize time format
        return timeStr.replace(/\s?(AM|PM)/i, ' $1').toUpperCase();
    }
}
