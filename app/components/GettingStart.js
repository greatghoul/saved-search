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
      <ol class="text-start">
        <li>Search for something on Google and stay on the search results page.</li>
        <li>Click the extension icon in your browser toolbar.</li>
        <li>Click the "Save" button to save your search.</li>
      </ol>
      <button class="btn btn-primary" onClick=${goToGoogle}>Go to Google Search</button>
    </div>
  `;
}

export default GettingStart;
