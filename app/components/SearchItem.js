import { html } from '../packages/preact.mjs';
import { i18n } from '../utils.js';

function SearchItem({ search, onEdit, onDeleted }) {
  function handleDelete(e) {
    e.preventDefault();
    e.stopPropagation();
    const deletedAt = new Date().toISOString();
    chrome.storage.local.get([search.id], (result) => {
      const deletedSearch = { ...result[search.id], deletedAt };
      chrome.storage.local.set({ [search.id]: deletedSearch }, () => {
        onDeleted(deletedSearch);
      });
    });
  }
  function handleEdit(e) {
    e.preventDefault();
    e.stopPropagation();
    onEdit && onEdit();
  }
  function handleItemClick(e) {
    window.open(search.url, '_blank', 'noopener');
  }
  return html`
    <li class="list-group-item d-flex flex-column align-items-start search-item" title=${i18n('searchItemOpen')} onClick=${handleItemClick}>
      <div class="d-flex w-100 justify-content-between align-items-center">
        <span class="text-secondary-emphasis text-truncate" title=${search.name}>${search.name}</span>
        <a class="text-success" href="#">
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
      <div class="search-keywords text-body-secondary small mt-1 w-100 d-none">
        ${search.keywords}
      </div>
      <div class="search-actions mt-1 w-100 d-none">
        <a href="#" class="me-3 text-primary-emphasis text-decoration-none" title="${i18n('buttonEdit')}" onClick=${handleEdit}>
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
