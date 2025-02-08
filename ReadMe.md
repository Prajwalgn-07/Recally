# Recally - Smart Browser History Search

Recally is a Chrome extension that uses AI to help you find and understand your browsing history through natural language queries. Instead of scrolling through your history, simply ask questions like "What was that cooking recipe I looked at last week?" or "Find the documentation page about React hooks I visited recently."

## Features

### 🔍 Smart Search
- Natural language queries to search your browsing history
- AI-powered understanding of context and intent
- Semantic search beyond simple keyword matching
- Intelligent search through your Chrome history
- Detailed insights and analytics on your browsing patterns

### ⏱️ Time Control
- Filter history by different time ranges:
  - Last 24 hours
  - Last 7 days
  - Last 2 weeks
  - Last 30 days
  - Last 3 months

### 📊 Organized Results
- Clear summaries of your browsing activity
- Relevant links sorted by importance
- Visit timestamps for each result
- Clickable links that open in new tabs

### 🔒 Privacy & Security
- Uses local browser history only
- API keys stored securely in Chrome's sync storage
- No data sent to external servers except Google's Gemini API

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/recally.git
cd recally
```

2. Install dependencies:
```bash
npm install dotenv
```

3. Get a Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key for later use

4. Create a `.env` file in the root directory and add your API key:
```env
GEMINI_API_KEY=your_api_key_here
```

5. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `Recally` directory

6. Configure the extension:
   - Click the Recally icon in your Chrome toolbar
   - Paste your Gemini API key
   - Click "Save API Key"

## Usage

1. Click the Recally icon in your Chrome toolbar
2. Select your desired time range from the dropdown
3. Type your query in natural language
4. Click "Search History" or press Enter
5. View the results:
   - Summary of findings
   - List of relevant links
   - When you visited each page

### Example Queries
- "Find that JavaScript tutorial about promises"
- "What restaurants did I look up last weekend?"
- "Show me the Amazon products I was comparing"
- "Find the research papers about machine learning I read"

## Technical Details

### Architecture
- Background Service Worker for handling API requests
- Modular service-based architecture
- Event-driven communication between components

### Technologies Used
- JavaScript (ES6+)
- Chrome Extension APIs
- Google's Gemini AI API
- Chrome Storage Sync API

### Key Components
- `background.js`: Main service worker
- `historyService.js`: History management
- `aiService.js`: AI interaction
- `tokenService.js`: API key management
- `popup.js`: UI interactions

## Project Structure
```
Recally/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
├── config/
│   └── constants.js
├── services/
│   ├── aiService.js
│   ├── historyService.js
│   └── tokenService.js
└── icons/
    └── icon48.png
```

## Development

### Prerequisites
- Node.js and npm
- Chrome browser
- Gemini API key

### Setting Up Development Environment
1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your API key:
```env
GEMINI_API_KEY=your_api_key_here
```

3. Load the unpacked extension in Chrome

### Building for Production
1. Update version in manifest.json
2. Package the extension:
```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Future Enhancements
- [ ] Advanced filtering options
- [ ] Custom time range selection
- [ ] Export search results
- [ ] Search history categories
- [ ] Bookmark integration
- [ ] Multiple search modes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Google Gemini API for powering the intelligent search
- Chrome Extensions API documentation
- Contributors and testers

## Support

For support, please open an issue in the GitHub repository or contact [your-email@example.com].