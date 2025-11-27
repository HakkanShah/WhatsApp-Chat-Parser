# WhatsApp Chat Parser

A modern, feature-rich web application for parsing, viewing, and analyzing WhatsApp chat exports with a beautiful user interface.

![WhatsApp Chat Parser](https://img.shields.io/badge/WhatsApp-Chat%20Parser-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

## ✨ Features

- 📱 **Parse WhatsApp Exports** - Support for multiple export formats
- 💬 **Beautiful Chat UI** - WhatsApp-like interface with smooth animations
- 🔍 **Search Messages** - Quickly find specific messages or senders
- 📊 **Statistics** - View detailed chat analytics
- 💾 **Export Data** - Save parsed chats as JSON
- 🎨 **Modern Design** - Premium UI with glassmorphism and gradients
- 📱 **Responsive** - Works perfectly on all devices
- ⚡ **Fast & Efficient** - Optimized performance

## 🚀 Getting Started

### How to Export Your WhatsApp Chat

1. Open WhatsApp on your phone
2. Go to the chat you want to export
3. Tap the three-dot menu (⋮) → **More** → **Export chat**
4. Choose **"Without Media"** for a smaller file
5. Save or send the `.txt` file to your device

### Using the Parser

1. Open `index.html` in your web browser
2. Click **"Upload Chat"** in the menu
3. Select your exported `.txt` file
4. Your chat will be parsed and displayed instantly!

## 📁 Project Structure

```
WhatsApp-Chat-Parser/
├── index.html              # Main HTML file
├── styles/
│   ├── main.css           # Core styles & theme
│   ├── chat.css           # Chat-specific styles
│   └── components.css     # UI component styles
├── js/
│   ├── app.js             # Main application controller
│   └── modules/
│       ├── parser.js      # Chat parsing logic
│       ├── renderer.js    # DOM rendering
│       ├── ui.js          # UI state management
│       ├── stats.js       # Statistics calculator
│       ├── search.js      # Search functionality
│       └── export.js      # Export functionality
└── README.md              # This file
```

## 🎯 Features in Detail

### Chat Parsing
- Supports multiple WhatsApp export formats
- Handles multi-line messages
- Detects system messages
- Automatically identifies sender roles
- Preserves message formatting

### User Interface
- WhatsApp-inspired design
- Smooth animations and transitions
- Dark theme optimized for readability
- Responsive layout for all screen sizes
- Accessible keyboard navigation

### Search & Filter
- Real-time message search
- Search by content or sender
- Highlight matching results
- Auto-scroll to results

### Statistics
- Total message count
- Messages per sender
- Date range analysis
- Average messages per day
- Most active day

### Export Options
- Export as JSON format
- Preserves all message data
- Easy to import elsewhere

## 🛠️ Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid & Flexbox
- **JavaScript (ES6+)** - Modular architecture
- **No dependencies** - Pure vanilla JavaScript

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

### Performance
- Efficient DOM manipulation
- Lazy rendering for large chats
- Optimized animations
- Minimal memory footprint

## 🎨 Design System

### Color Palette
- Primary: `#00a884` (WhatsApp Green)
- Background: `#0b141a` (Dark)
- Surface: `#202c33` (Dark Gray)
- Text: `#e9edef` (Light)

### Typography
- Font Family: Inter, system-ui
- Responsive font sizes
- Optimized line heights

## 📝 Supported Message Formats

The parser supports various WhatsApp export formats:

```
[DD/MM/YYYY, HH:MM:SS] Sender: Message
DD/MM/YYYY, HH:MM - Sender: Message
DD.MM.YY, HH:MM - Sender: Message
```

## 🔒 Privacy

- **100% Client-Side** - All processing happens in your browser
- **No Server Upload** - Your chats never leave your device
- **No Tracking** - No analytics or data collection
- **Open Source** - Transparent code you can audit

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by WhatsApp's beautiful design
- Built with modern web standards
- Optimized for user privacy and performance

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Made with ❤️ for WhatsApp users who want to analyze their chats**
