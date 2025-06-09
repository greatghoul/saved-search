import { html } from '../packages/preact.mjs';
import { i18n } from '../utils.js';

function SearchItem({ search, onEdit }) {
  return html`
    <li class="list-group-item d-flex flex-column align-items-start search-item">
      <div class="d-flex w-100 justify-content-between align-items-center">
        <span class="text-secondary-emphasis text-truncate" title=${search.name}>${search.name}</span>
        <a class="text-success" href=${search.url} target="_blank" rel="noopener noreferrer" title=${i18n('searchItemOpen')}>
          <i class="bi bi-box-arrow-up-right"></i>
        </a>
      </div>
      <div class="search-keywords text-body-secondary small mt-1 w-100" style="display:none;">
        ${search.keywords || ''}
      </div>
    </li>
  `;
}

export default SearchItem;
