document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['usageData'], (res) => {
    if (res.usageData) {
      renderDashboard(res.usageData);
    }
  });
});

function renderDashboard(data) {
  const container = document.getElementById('dashboard');
  container.innerHTML = '';
  
  const services = ['claude', 'chatgpt', 'gemini'];
  const displayNames = { claude: 'Claude Pro', chatgpt: 'ChatGPT Plus', gemini: 'Gemini Advanced' };

  services.forEach(service => {
    const sData = data[service];
    if (!sData) return;

    // Clean up expired just for display
    const now = Date.now();
    const windowMs = sData.windowHours * 60 * 60 * 1000;
    const validTimestamps = sData.timestamps.filter(ts => (now - ts) < windowMs);
    
    const used = validTimestamps.length;
    const limit = sData.limit;
    const percent = Math.min((used / limit) * 100, 100);
    
    let colorClass = '';
    if (percent > 85) colorClass = 'danger';
    else if (percent > 65) colorClass = 'warning';

    // Calculate when the oldest message frees up
    let resetText = '';
    if (used > 0) {
      const oldest = Math.min(...validTimestamps);
      const freesAt = oldest + windowMs;
      const minsLeft = Math.max(0, Math.floor((freesAt - now) / 60000));
      const textTime = minsLeft > 60 ? `${Math.floor(minsLeft/60)}h ${minsLeft%60}m` : `${minsLeft}m`;
      resetText = `Next +1 limit in ${textTime}`;
    }

    const cardHtml = `
      <div class="card">
        <div class="card-header">
          <span>${displayNames[service]}</span>
          <span style="color: ${colorClass === 'danger' ? 'var(--danger)' : 'var(--text)'}">${used} / ${limit}</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill ${colorClass}" style="width: ${percent}%"></div>
        </div>
        <div class="stats">
          <span>Usage: ${Math.round(percent)}%</span>
          <span>Window: ${sData.windowHours}h</span>
        </div>
        <div class="reset-info">${resetText}</div>
      </div>
    `;
    container.innerHTML += cardHtml;
  });
}
