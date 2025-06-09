import { html } from '../packages/preact.mjs';
import { i18n } from '../utils.js';

function SearchItem({ search, onEdit, onDeleted }) {
  function handleDelete(e) {
    e.preventDefault();
    chrome.storage.local.remove(search.id, () => {
      onDeleted(search);
    });
  }
  return html`
    <li class="list-group-item d-flex flex-column align-items-start search-item">
      <div class="d-flex w-100 justify-content-between align-items-center">
        <span class="text-secondary-emphasis text-truncate" title=${search.name}>${search.name}</span>
        <a class="text-success" href=${search.url} target="_blank" rel="noopener noreferrer" title=${i18n('searchItemOpen')}>
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
      <div class="search-keywords text-body-secondary small mt-1 w-100 d-none">
        ${search.keywords}
      </div>
      <div class="search-actions mt-1 w-100 d-none">
        <a href="#" class="me-3 text-primary-emphasis text-decoration-none" title="${i18n('buttonEdit')}" onClick=${e => { e.preventDefault(); onEdit && onEdit(); }}>
          <i class="bi bi-pencil"></i> ${i18n('buttonEdit')}
        </a>
        <a href="#" class="text-danger text-decoration-none" title="${i18n('buttonDelete')}" onClick=${handleDelete}>
          <i class="bi bi-trash"></i> ${i18n('buttonDelete')}
        </a>
      </div>
    </li>
  `;
}

export default SearchItem;
