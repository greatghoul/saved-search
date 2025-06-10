import { html } from '../packages/preact.mjs';
import { i18n} from '../utils.js';

function SearchActiveBar({ search, onClick }) {
  return html`
    <nav class="navbar bg-info-subtle">
      <div class="container-fluid">
        <div class="row g-0 w-100 align-items-center justify-content-between">
          <div class="col text-truncate">
            <span title=${search.name}>${search.name}</span>
          </div>
          <div class="col-auto">
            <button
              class="btn btn-outline-primary btn-sm"
              onClick=${onClick}
            >
              ${i18n('buttonSave')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}

export default SearchActiveBar;