const DEFAULT_SETTINGS = {
  chatgpt: { limit: 40, windowHours: 3, timestamps: [] },
  claude: { limit: 45, windowHours: 5, timestamps: [] },
  gemini: { limit: 50, windowHours: 24, timestamps: [] }
};

// Initialize default storage on install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['usageData'], (res) => {
    if (!res.usageData) {
      chrome.storage.local.set({ usageData: DEFAULT_SETTINGS });
    }
  });
});

// Clean up expired timestamps
function cleanExpired(data, service) {
  const now = Date.now();
  const windowMs = data[service].windowHours * 60 * 60 * 1000;
  data[service].timestamps = data[service].timestamps.filter(ts => (now - ts) < windowMs);
  return data;
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'PROMPT_SENT') {
    const service = request.service; // 'chatgpt', 'claude', 'gemini'
    
    chrome.storage.local.get(['usageData'], (res) => {
      let data = res.usageData || DEFAULT_SETTINGS;
      
      // Clean up old ones first
      data = cleanExpired(data, service);
      
      // Add new timestamp
      data[service].timestamps.push(Date.now());
      
      chrome.storage.local.set({ usageData: data }, () => {
        // Optional: trigger alarm checking if nearing limit
        checkThresholds(data, service);
        broadcastToOpenClaw(data, service);
      });
      sendResponse({ status: "success", currentUsage: data[service].timestamps.length });
    });
    return true; // async response
  }
});

function broadcastToOpenClaw(data, service) {
  const settings = data[service];
  const percentUsed = (settings.timestamps.length / settings.limit) * 100;
  
  // Fire-and-forget JSON POST request to the local OpenClaw system
  fetch('http://localhost:8000/api/ai-limits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service: service,
      used: settings.timestamps.length,
      limit: settings.limit,
      percent: parseFloat(percentUsed.toFixed(2)),
      timestamp: Date.now()
    })
  }).catch(err => {
    // OpenClaw might be offline or not listening, ignore silently so the extension runs smoothly
  });
}

function checkThresholds(data, service) {
  const settings = data[service];
  const percentUsed = (settings.timestamps.length / settings.limit) * 100;
  
  if (percentUsed >= 90 && percentUsed < 95) {
    // We could use flags to ensure we don't spam notifications, but for the MVP:
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png", // Will need an icon
      title: "AI Limit Warning",
      message: `${service.toUpperCase()} is at ${Math.round(percentUsed)}% of its rolling limit.`
    });
  }
}
