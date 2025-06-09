import { html } from '../packages/preact.mjs';
import { i18n } from '../utils.js';

function SearchItem({ search, onEdit }) {
  return html`
    <li class="list-group-item d-flex justify-content-between align-items-center">
      <a
        href=${search.url}
        target="_blank"
        class="text-truncate"
        title=${search.name}
      >
        ${search.name}
      </a>
      <button class="btn btn-outline-success btn-sm" onClick=${onEdit}>
        ${i18n('buttonEdit')}
      </button>
    </li>
  `;
}

export default SearchItem;
