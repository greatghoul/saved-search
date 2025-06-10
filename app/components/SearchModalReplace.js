import { html } from '../packages/preact.mjs';
import { i18n } from '../utils.js';

const SearchModalReplace = ({ activeSearches, search, onReplace, onCancel }) => {
  const handleReplace = (savedSearch) => {
    const updated = {
      ...savedSearch,
      keywords: search.keywords,
      url: search.url,
      updatedAt: new Date().toISOString()
    };
    chrome.storage.local.set({ [updated.id]: updated }, () => {
      if (onReplace) onReplace();
    });
  };
  return html`
    <div class="modal d-block">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-body">
            <h5>${i18n('searchModalReplaceTitle')}</h5>
            <div class="mb-2">
              <div class="form-text mb-2">${i18n('searchModalReplaceHint')}</div>
              <div class="list-group">
                ${activeSearches.map(savedSearch => html`
                  <a href="#"
                    class="list-group-item list-group-item-action d-flex"
                    onClick=${() => handleReplace(savedSearch)}
                  >
                    <span class="text-truncate" title=${savedSearch.name}>${savedSearch.name}</span>
                  </a>
                `)}
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button class="btn btn-light btn-sm" onClick=${onCancel}>${i18n('buttonDismiss')}</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default SearchModalReplace;
