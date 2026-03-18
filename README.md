# AI Limit Tracker

A Chrome/Brave Manifest V3 extension that tracks your rolling usage limits for **ChatGPT Plus**, **Claude Pro**, and **Gemini Advanced**.

## Features
- **Rolling Timers**: Automatically calculates exactly when your oldest prompts will expire based on the specific AI platform's time window.
- **Local Webhook**: Broadcasts live usage data to `http://localhost:8000/api/ai-limits` so your local AI agents (e.g. OpenClaw) can detect API pressure and switch models automatically.
- **Privacy First**: Fully local. No external analytics, no trackers.

## Installation
1. Clone or download this repository.
2. Open your Chromium-based browser (Chrome, Edge, Brave, Arc).
3. Navigate to `chrome://extensions/` (or `brave://extensions/`).
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select this folder.

## Usage
1. After installing, pin the extension to your browser toolbar for easy access.
2. Open ChatGPT (`chatgpt.com`), Claude (`claude.ai`), or Gemini (`gemini.google.com`) in your browser.
3. Send prompts as you normally would. The extension will automatically detect them.
4. Click the **AI Limit Tracker** icon in your toolbar to view your current usage and see exactly when your prompt limits will reset.
5. (Optional) Read the webhook events at `http://localhost:8000/api/ai-limits` from your local AI agents or applications.

## Development
- `manifest.json`: Configuration logic and permissions.
- `background.js`: Service worker handling the local storage and rolling window timers.
- `content.js`: Generic DOM-bubbling listeners to detect when you hit "Enter" or click a "Send" button on the chat interfaces.
- `popup.html/.js`: The extension dashboard UI.
