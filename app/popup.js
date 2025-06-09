// Preact popup implementation for Chrome Extension MV3, no build step
import { html, render } from './packages/preact.mjs';
import { useState, useEffect } from './packages/preact.mjs';
import GettingStart from './components/GettingStart.js';
import SearchActiveBar from './components/SearchActiveBar.js';
import SearchModalNew from './components/SearchModalNew.js';
import SearchItem from './components/SearchItem.js';
import { i18n } from './utils.js';

const URL_PAT = /https?:\/\/www\.google\..*\/search\?.*/;

function getActiveSearchUrl() {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs.length > 0 && URL_PAT.test(tabs[0].url)) {
        resolve(tabs[0].url);
      } else {
        resolve("");
      }
    });
  });
}

function getKeywords(url) {
  try {
    const searchParams = new URLSearchParams(url.split('?').pop());
    return searchParams.get('q') || '';
  } catch {
    return '';
  }
}

/**
 * Returns a new array of searches sorted alphabetically by the `name` property (case-insensitive).
 *
 * @param {Array<{ name?: string }>} searches - The array of search objects to sort.
 * @returns {Array<{ name?: string }>} A new sorted array of search objects.
 */
function sortSearches(searches) {
  return searches.slice().sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    if (nameA < nameB) return -1;
    if (nameA > nameB) return 1;
    return 0;
  });
}


/**
 * Loads saved searches from Chrome's local storage, filters them by keys starting with 'search-',
 * sorts them using the `sortSearches` function, and returns the sorted array.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of sorted search objects.
 */
function loadSearches() {
  return new Promise((resolve) => {
    chrome.storage.local.get(null, (items) => {
      const searches = Object.keys(items)
        .filter(key => key.startsWith('search-'))
        .map(key => items[key]);
      const sortedSearches = sortSearches(searches);
      resolve(sortedSearches);
    });
  });
}

function Popup() {
  const [searches, setSearches] = useState([]);
  const [search, setSearch] = useState(null);
  const [mode, setMode] = useState(null);
  const [panelExpand, setPanelExpand] = useState(false);

  const isNewSearch = search && !search.id;
  const isCreateMode = mode === 'create';

  useEffect(() => {
    loadSearches().then(setSearches);
    getActiveSearchUrl().then((url) => {
      if (url) {
        const keywords = getKeywords(url);
        setSearch({ url, name: keywords, keywords });
      }
    });
  }, []);

  function handleCreate() {
    const newSearches = [...searches, search];
    const sortedSearches = sortSearches(newSearches);
    setSearches(sortedSearches);
    setSearch(null);
    setMode(null);
  }

  function handleEdit(index) {
    setSearch({ ...searches[index], index });
    setMode('update');
  }

  function handleSave() {
    const newSearches = searches.slice();
    newSearches[search.index].name = search.name;
    setSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleRemove() {
    const newSearches = searches.slice();
    newSearches.splice(search.index, 1);
    setSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleReplace(savedSearch) {
    const newSearches = searches.map((s) =>
      s === savedSearch ? { ...savedSearch, keywords: search.keywords, url: search.url } : s
    );
    setSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleClear() {
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  if (searches.length === 0 && !search) {
    return html`<${GettingStart} />`;
  }

  // handlers
  const handleNewSearch = () => setMode('create');
  const handleCloseModal = () => setMode(null);
  const handleCreated = (savedSearch) => {
    const newSearches = [...searches, savedSearch];
    setSearches(newSearches);
    setSearch(null);
    setMode(null);
  }
  const handleDeleted = (deletedSearch) => {
    const newSearches = searches.filter(s => s !== deletedSearch);
    setSearches(newSearches);
  };

  return html`
    <div>
      ${isNewSearch && !isCreateMode && html`<${SearchActiveBar} search=${search} onClick=${handleNewSearch} />`}
      ${isNewSearch && isCreateMode && html`
        <${SearchModalNew}
          search=${search}
          onCreated=${handleCreated}
          onCancel=${handleCloseModal} />
      `}

      <ul class="list-group list-searches">
        ${searches.map((savedSearch, i) => html`
          <${SearchItem}
            key=${i}
            search=${savedSearch}
            onEdit=${() => handleEdit(i)}
            onDeleted=${handleDeleted}
          />
        `)}
      </ul>
      ${mode === 'create' && html`
        <div class="panel panel-primary" id="panel-new">
          ${panelExpand && html`
            <div class="panel-body">
              <div class="form-group">
                <strong class="help-block">${i18n('textSearchNameHint')}</strong>
                <input type="text" class="form-control" id="input-new" value=${search ? search.name : ''} onInput=${e => setSearch({ ...search, name: e.target.value })} />
              </div>
            </div>
          `}
          ${panelExpand && html`
            <div class="panel-footer text-right">
              <button class="btn btn-default btn-sm" onClick=${handleClear}>${i18n('buttonDismiss')}</button>
              <button class="btn btn-primary btn-sm" onClick=${handleCreate}>${i18n('buttonCreate')}</button>
              <div class="btn-group dropup" style="margin-left:8px;">
                <button class="btn btn-primary btn-sm dropdown-toggle" tabIndex="-1">
                  <span class="caret"></span>
                </button>
                <ul class="dropdown-menu dropdown-menu-right" style="display:block;position:absolute;">
                  <li class="dropdown-header">${i18n('textReplaceSavedSearch')}</li>
                  ${searches.map((savedSearch, i) => html`
                    <li key=${i}>
                      <a href="#" class="truncate" onClick=${e => { e.preventDefault(); handleReplace(savedSearch); }}>${savedSearch.name}</a>
                    </li>
                  `)}
                </ul>
              </div>
            </div>
          `}
        </div>
      `}
      ${mode === 'update' && html`
        <div class="panel panel-primary" id="panel-edit">
          <div class="panel-body">
            <div class="form-group">
              <strong class="help-block">${i18n('textSearchNameHint')}</strong>
              <input type="text" class="form-control" id="input-edit" value=${search ? search.name : ''} onInput=${e => setSearch({ ...search, name: e.target.value })} />
            </div>
          </div>
          <div class="panel-footer text-right">
            <button class="btn btn-default btn-sm" onClick=${handleClear}>${i18n('buttonDismiss')}</button>
            <button class="btn btn-primary btn-sm" onClick=${handleSave}>${i18n('buttonSave')}</button>
            <div class="pull-left">
              <button class="btn btn-danger btn-sm" onClick=${handleRemove}>${i18n('buttonDelete')}</button>
            </div>
          </div>
        </div>
      `}
      ${panelExpand && html`<div class="modal-backdrop fade in" onClick=${handleClear}></div>`}
    </div>
  `;
}

render(html`<${Popup} />`, document.getElementById('app'));
