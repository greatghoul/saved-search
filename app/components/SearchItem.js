import { html } from '../packages/preact.mjs';
import { i18n } from '../utils.js';

function SearchItem({ search, onEdit }) {
  return html`
    <li class="list-group-item">
      <div class="float-end">
        <button class="btn btn-secondary btn-sm" onClick=${onEdit}>${i18n('buttonEdit')}</button>
      </div>
      <a href=${search.url} target="_blank" class="search-name text-truncate">${search.name}</a>
    </li>
  `;
}

export default SearchItem;
