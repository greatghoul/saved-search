import { html } from '../packages/preact.mjs';

function GettingStart() {
  function goToGoogle() {
    chrome.tabs.create({ url: 'https://www.google.com/search' });
  }

  return html`
    <div class="getting-start-block">
      <div class="getting-start-icon-row">
        <span class="icon">🔍</span>
      </div>
      <h5>No saved searches yet</h5>
      <p>
        Start by searching something on Google and save it here for quick access later.
      </p>
      <button class="btn btn-primary" onClick=${goToGoogle}>Go to Google Search</button>
    </div>
  `;
}

export default GettingStart;
