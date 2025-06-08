import { html } from '../packages/preact.mjs';

// Import GettingStart styles
const style = document.createElement('link');
style.rel = 'stylesheet';
style.href = '../css/components/GettingStart.css';
document.head.appendChild(style);

function GettingStart() {
  function goToGoogle() {
    chrome.tabs.create({ url: 'https://www.google.com/search' });
  }

  return html`
    <div class="getting-start-block">
      <div class="getting-start-title">
        <span class="icon">🔍</span>
        No saved searches yet
      </div>
      <div class="getting-start-desc">
        Start by searching something on Google and save it here for quick access later.
      </div>
      <button class="btn btn-primary" onClick=${goToGoogle}>
        Go to Google Search
      </button>
    </div>
  `;
}

export default GettingStart;
