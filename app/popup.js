// Preact popup implementation for Chrome Extension MV3, no build step
import { html, render } from './packages/preact.mjs';
import { useState, useEffect } from './packages/preact.mjs';
import GettingStart from './components/GettingStart.js';


const URL_PAT = /https?:\/\/www\.google\..*\/search\?.*/;

function i18n(key) {
  return chrome.i18n.getMessage(key) || key;
}

function getActiveTabUrl() {
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

function loadSearches() {
  try {
    return JSON.parse(localStorage.getItem('searches') || '[]');
  } catch {
    return [];
  }
}

function saveSearches(searches) {
  localStorage.setItem('searches', JSON.stringify(searches));
}

function Popup() {
  const [searches, setSearches] = useState([]);
  const [search, setSearch] = useState(null);
  const [mode, setMode] = useState(null);
  const [panelExpand, setPanelExpand] = useState(false);

  useEffect(() => {
    setSearches(loadSearches());
    getActiveTabUrl().then((url) => {
      if (url) {
        const keywords = getKeywords(url);
        setSearch({ url, name: keywords, keywords });
        setMode('create');
      }
    });
  }, []);

  function handleCreate() {
    const newSearches = [...searches, search];
    setSearches(newSearches);
    saveSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleEdit(index) {
    setSearch({ ...searches[index], index });
    setMode('update');
    setPanelExpand(true);
  }

  function handleSave() {
    const newSearches = searches.slice();
    newSearches[search.index].name = search.name;
    setSearches(newSearches);
    saveSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleRemove() {
    const newSearches = searches.slice();
    newSearches.splice(search.index, 1);
    setSearches(newSearches);
    saveSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleReplace(savedSearch) {
    const newSearches = searches.map((s) =>
      s === savedSearch ? { ...savedSearch, keywords: search.keywords, url: search.url } : s
    );
    setSearches(newSearches);
    saveSearches(newSearches);
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  function handleClear() {
    setSearch(null);
    setMode(null);
    setPanelExpand(false);
  }

  if (searches.length === 0) {
    return html`<${GettingStart} />`;
  }

  return html`
    <div>
      <ul class="list-group list-searches">
        ${searches.map((savedSearch, i) => html`
          <li class="list-group-item" key=${i}>
            <div class="pull-right">
              <button class="btn btn-default btn-xs" onClick=${() => handleEdit(i)}>${i18n('buttonEdit')}</button>
            </div>
            <a href=${savedSearch.url} target="_blank" class="search-name truncate">${savedSearch.name}</a>
          </li>
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
          ${!panelExpand && html`
            <div class="panel-footer">
              <div class="pull-right">
                <button class="btn btn-default btn-xs" onClick=${() => setPanelExpand(true)}>${i18n('buttonShow')}</button>
              </div>
              <span class="truncate">${search ? search.name : ''}</span>
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
