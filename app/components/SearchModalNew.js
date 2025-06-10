import { html, useState } from '../packages/preact.mjs';
import { i18n, createToken } from '../utils.js';

const SearchModalNew = ({ search, onCancel, onCreated, onSaveTo }) => {
  const [name, setName] = useState(search.name);

  const handleCreate = () => {
    const id = createToken('search');
    const now = new Date().toISOString();
    const newSearch = { 
      ...search, 
      id, 
      name, 
      createdAt: now,
      updatedAt: now
    };
    chrome.storage.local.set({ [id]: newSearch }, () => {
      console.log('Search saved to chrome.storage.local:', newSearch);
      if (onCreated) onCreated(newSearch);
    });
  };

  return html`
    <div class="modal d-block">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-body">
            <h5>${i18n('searchModalNewTitle')}</h5>

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
            <button class="btn btn-primary btn-sm" onClick=${handleCreate}>${i18n('buttonSave')}</button>
            <button class="btn btn-secondary btn-sm me-2" onClick=${onSaveTo}>${i18n('buttonSaveTo')}</button>
          </div>
        </div><!-- .modal-content -->
      </div><!-- .modal-dialog -->
    </div><!-- .modal -->
  `;
}

export default SearchModalNew;