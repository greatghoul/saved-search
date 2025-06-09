import { html } from '../packages/preact.mjs';
import { i18n} from '../utils.js';

const SearchModalNew = ({ search, searches, onCancel }) =>{
  return html`
    <div class="modal d-block">
      <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
          <div class="modal-body">
            <h5>${i18n('searchModalNewTitle')}</h5>

            <div class="mb-2">
              <label for="search-name" class="form-label">${i18n('searchName')}</label>
              <input type="text" class="form-control" id="search-name" value=${search.name} />
              <div class="form-text">${i18n('textSearchNameHint')}</div>
            </div>

            <div class="mb-2">
              <label for="search-keywords" class="form-label">${i18n('searchKeywords')}</label>
              <textarea class="form-control bg-light" id="search-keywords" style="height: 7em;" readonly>${search.keywords}</textarea>
            </div>
          </div>
          <div class="modal-footer text-right">
            <button class="btn btn-light btn-sm" onClick=${onCancel}>${i18n('buttonDismiss')}</button>
            <button class="btn btn-primary btn-sm">${i18n('buttonCreate')}</button>
          </div>
        </div><!-- .modal-content -->
      </div><!-- .modal-dialog -->
    </div><!-- .modal -->
  `;
}

export default SearchModalNew;