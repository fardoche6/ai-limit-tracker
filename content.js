// Determine which service we are on
const hostname = window.location.hostname;
let serviceName = '';

if (hostname.includes('chatgpt.com')) {
  serviceName = 'chatgpt';
} else if (hostname.includes('claude.ai')) {
  serviceName = 'claude';
} else if (hostname.includes('gemini.google.com')) {
  serviceName = 'gemini';
}

function notifyBackground() {
  if (!serviceName) return;
  
  // Send message to background script to log the prompt
  chrome.runtime.sendMessage({ action: 'PROMPT_SENT', service: serviceName }, (response) => {
    console.log(`[AI Tracker] Logged prompt for ${serviceName}. Current usage: ${response.currentUsage}`);
  });
}

// Set up the observers based on platform
if (serviceName) {
  console.log(`[AI Tracker] Loaded on ${serviceName}. Monitoring inputs...`);

  // Generic approach: intercept enter key on textareas or editable divs, and clicks on buttons
  // Platforms change DOM a lot, so we use event bubbling
  
  document.addEventListener('keydown', (e) => {
    // If Enter is pressed (and not Shift+Enter) in an input field
    if (e.key === 'Enter' && !e.shiftKey) {
      const isInput = e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || e.target.tagName === 'INPUT';
      if (isInput) {
        // Debounce slightly to ensure it actually sent
        setTimeout(verifyAndNotify, 100);
      }
    }
  }, true);

  document.addEventListener('click', (e) => {
    // Check if clicked element looks like a send button
    const path = e.composedPath();
    const isSendButton = path.some(el => {
      if (!el || !el.getAttribute) return false;
      const aria = el.getAttribute('aria-label')?.toLowerCase() || '';
      const dataTest = el.getAttribute('data-testid')?.toLowerCase() || '';
      return aria.includes('send') || dataTest.includes('send');
    });

    if (isSendButton) {
      setTimeout(verifyAndNotify, 100);
    }
  }, true);
}

// simple debounce lock
let lastSent = 0;
function verifyAndNotify() {
  const now = Date.now();
  if (now - lastSent < 2000) return; // prevent double counting within 2 seconds
  lastSent = now;
  notifyBackground();
}
