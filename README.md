# AI Limit Tracker

A Chrome/Brave Manifest V3 extension that tracks your rolling usage limits for **ChatGPT Plus**, **Claude Pro**, and **Gemini Advanced**.

## Features
- **Rolling Timers**: Automatically calculates exactly when your oldest prompts will expire based on the specific AI platform's time window.
- **Local Webhook**: Broadcasts live usage data to `http://localhost:8000/api/ai-limits` so your local AI agents (e.g. OpenClaw) can detect API pressure and switch models automatically.
- **Privacy First**: Fully local. No external analytics, no trackers.

## Installation and Usage

### Brave
**Installing the extension:**
1. Clone or download this repository.
2. Open the Brave browser.
3. Type `brave://extensions/` in the address bar and press Enter.
4. Enable **Developer mode** using the toggle in the top-right corner.
5. Click the **Load unpacked** button in the top-left.
6. Select the folder containing this repository's files.

**Seeing the result:**
1. Pin the "AI Limit Tracker" extension to your toolbar by clicking the puzzle piece icon (Extensions) and then clicking the pin icon next to the extension.
2. Open ChatGPT (`chatgpt.com`), Claude (`claude.ai`), or Gemini (`gemini.google.com`).
3. Send a prompt on any of these platforms.
4. Click the **AI Limit Tracker** icon in your toolbar to view the live dashboard showing your usage and when your limits will reset.
5. You can also view the live usage data locally by monitoring `http://localhost:8000/api/ai-limits`.

### Google Chrome
**Installing the extension:**
1. Clone or download this repository.
2. Open the Google Chrome browser.
3. Type `chrome://extensions/` in the address bar and press Enter.
4. Enable **Developer mode** using the toggle in the top-right corner.
5. Click the **Load unpacked** button in the top-left.
6. Select the folder containing this repository's files.

**Seeing the result:**
1. Pin the "AI Limit Tracker" extension to your toolbar by clicking the puzzle piece icon (Extensions) and then clicking the pin icon next to the extension.
2. Open ChatGPT (`chatgpt.com`), Claude (`claude.ai`), or Gemini (`gemini.google.com`).
3. Send a prompt on any of these platforms.
4. Click the **AI Limit Tracker** icon in your toolbar to view the live dashboard showing your usage and when your limits will reset.
5. You can also view the live usage data locally by monitoring `http://localhost:8000/api/ai-limits`.

## Development
- `manifest.json`: Configuration logic and permissions.
- `background.js`: Service worker handling the local storage and rolling window timers.
- `content.js`: Generic DOM-bubbling listeners to detect when you hit "Enter" or click a "Send" button on the chat interfaces.
- `popup.html/.js`: The extension dashboard UI.
