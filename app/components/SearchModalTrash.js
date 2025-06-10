import { html } from '../packages/preact.mjs';
import message from '../packages/message.js';
import { i18n, daysAgo, formatLocalDateTime } from '../utils.js';

const SearchModalTrash = ({ trashSearches, onRestore, onCancel }) => {
  const handleRestore = (deletedSearch) => {
    const updated = { ...deletedSearch };
    delete updated.deletedAt;
    updated.updatedAt = new Date().toISOString();
    chrome.storage.local.set({ [updated.id]: updated }, () => {
      message.success(i18n('searchRestoredSuccess'));
      if (onRestore) onRestore();
    });
  };

  const handleClearTrash = () => {
    if (trashSearches.length === 0) return;
    const ids = trashSearches.map(s => s.id);
    chrome.storage.local.remove(ids, () => {
      message.success(i18n('searchTrashCleared'));
      if (onRestore) onRestore();
    });
  };

  return html`
    <div class="modal d-block">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-body">
            <h5>${i18n('searchModalTrashTitle')}</h5>
            <div class="mb-2">
              <div class="form-text mb-2">${i18n('searchModalTrashHint')}</div>
              <div class="list-group">
                ${trashSearches.length === 0 ? html`
                  <div class="text-center text-body-secondary py-3">${i18n('searchModalTrashEmpty')}</div>
                ` : trashSearches.map(deletedSearch => html`
                  <a href="#"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    title=${deletedSearch.keywords}
                    onClick=${() => handleRestore(deletedSearch)}
                  >
                    <span class="text-truncate" title=${deletedSearch.name}>${deletedSearch.name}</span>
                    <span class="text-secondary text-nowrap ms-2" title=${formatLocalDateTime(deletedSearch.deletedAt)}>${daysAgo(deletedSearch.deletedAt)}</span>
                  </a>
                `)}
              </div>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button class="btn btn-light btn-sm" onClick=${onCancel}>${i18n('buttonDismiss')}</button>
            <button class="btn btn-danger btn-sm me-2" onClick=${handleClearTrash} disabled=${trashSearches.length === 0}>${i18n('buttonClearTrash')}</button>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default SearchModalTrash;
