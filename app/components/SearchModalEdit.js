import { html, useState } from '../packages/preact.mjs';
import message from '../packages/message.js';
import { i18n } from '../utils.js';

const SearchModalEdit = ({ search, onCancel, onUpdated }) => {
  const [name, setName] = useState(search.name);

  const handleUpdate = () => {
    const now = new Date().toISOString();
    const updatedSearch = {
      ...search,
      name,
      updatedAt: now
    };
    chrome.storage.local.set({ [search.id]: updatedSearch }, () => {
      console.log('Search updated in chrome.storage.local:', updatedSearch);
      message.success(i18n('searchSavedSuccess'));
      if (onUpdated) onUpdated(updatedSearch);
    });
  };

  return html`
    <div class="modal d-block">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-body">
            <h5>${i18n('searchModalEditTitle')}</h5>

            <div class="mb-2">
              <label for="search-name" class="form-label">${i18n('searchName')}</label>
              <input
                type="text"
                class="form-control"
                id="search-name"
                value=${name}
                onInput=${e => setName(e.target.value)}
              />
              <div class="form-text">${i18n('textSearchNameHint')}</div>
            </div>

            <div class="mb-2">
              <label for="search-keywords" class="form-label">${i18n('searchKeywords')}</label>
              <textarea class="form-control bg-light" id="search-keywords" style="height: 7em;" readonly>${search.keywords}</textarea>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button class="btn btn-light btn-sm" onClick=${onCancel}>${i18n('buttonDismiss')}</button>
            <button class="btn btn-primary btn-sm" onClick=${handleUpdate}>${i18n('buttonSave')}</button>
          </div>
        </div><!-- .modal-content -->
      </div><!-- .modal-dialog -->
    </div><!-- .modal -->
  `;
}

export default SearchModalEdit;
