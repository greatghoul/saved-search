// Preact popup implementation for Chrome Extension MV3, no build step
import { html, render } from './packages/preact.mjs';
import { useState, useEffect } from './packages/preact.mjs';
import GettingStart from './components/GettingStart.js';
import SearchActiveBar from './components/SearchActiveBar.js';
import SearchModalNew from './components/SearchModalNew.js';
import SearchModalEdit from './components/SearchModalEdit.js';
import SearchModalReplace from './components/SearchModalReplace.js';
import SearchItem from './components/SearchItem.js';
import SearchModalTrash from './components/SearchModalTrash.js';
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
function fetchSearches() {
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

  const activeSearches = searches.filter(s => !s.deletedAt);
  const trashSearches = searches.filter(s => s.deletedAt);
  const isNewSearch = search && !search.id;
  const isSavedSearch = search && search.id;

  const loadSearches = () => fetchSearches().then(setSearches);

  /**
   * Migrates old search data from localStorage['searches'] to new storage format
   */
  const migrateSearches = () => {
    return new Promise((resolve) => {
      // Check for old searches data in localStorage
      const oldSearchesData = localStorage.getItem('searches');
      
      if (oldSearchesData) {
        try {
          const oldSearches = JSON.parse(oldSearchesData);
          
          if (Array.isArray(oldSearches) && oldSearches.length > 0) {
            const currentTime = new Date().toISOString();
            const migrationPromises = [];
            
            oldSearches.forEach((oldSearch, index) => {
              if (oldSearch.name && oldSearch.url && oldSearch.keywords) {
                const newSearch = {
                  id: `search-${Date.now()}-${index}`,
                  name: oldSearch.name,
                  url: oldSearch.url,
                  keywords: oldSearch.keywords,
                  createdAt: currentTime,
                  updatedAt: currentTime
                };
                
                // Save to chrome.storage.local with new format
                const savePromise = new Promise((saveResolve) => {
                  chrome.storage.local.set({ [newSearch.id]: newSearch }, () => {
                    saveResolve();
                  });
                });
                
                migrationPromises.push(savePromise);
              }
            });
            
            // Wait for all saves to complete, then remove old data
            Promise.all(migrationPromises).then(() => {
              localStorage.removeItem('searches');
              console.log('Successfully migrated', oldSearches.length, 'searches from old format');
              resolve(true);
            });
          } else {
            resolve(false);
          }
        } catch (error) {
          console.error('Error parsing old searches data:', error);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    });
  };
  
  useEffect(() => {
    // First load current data, then migrate old data if needed
    loadSearches();
    
    migrateSearches().then((migrated) => {
      if (migrated) {
        console.log('Data migration completed');
        // Reload searches after migration to include migrated data
        loadSearches();
      }
    });
    
    getActiveSearchUrl().then((url) => {
      if (url) {
        const keywords = getKeywords(url);
        setSearch({ url, name: keywords, keywords });
      }
    });
  }, []);

  if (activeSearches.length === 0 && !search) {
    return html`<${GettingStart} />`;
  }

  // handlers
  const handleNewSearch = () => setMode('create');
  const handleCloseModal = () => setMode(null);
  const handleEdit = search => {
    setSearch(search);
    setMode('update');
  };
  const handleRefresh = () => {
    loadSearches();
    setSearch(null);
    setMode(null);
  }
  const handleOpenReplace = () => setMode('replace');
  const handleOpenTrash = () => setMode('trash');

  const TrashButton = () => {
    return html`
      <button
        type="button"
        class="btn btn-outline-dark btn-sm d-flex align-items-center"
        title=${i18n('tooltipTrashButton')}
        onClick=${handleOpenTrash}
      >
        <i class="bi bi-trash"></i>
        <span class="ms-1">${trashSearches.length}</span>
      </button>
    `;
  }

  return html`
    <nav class="navbar bg-primary-subtle navbar-sticky-top">
      <div class="container-fluid d-flex align-items-center justify-content-between">
        <div class="navbar-header d-flex align-items-center">
          <span class="navbar-brand fs-6 d-flex align-items-center text-primary-emphasis">
            <img src="images/icon-48.png" alt="Logo" class="me-1" style="height: 20px;" />
            <span class="text-uppercase">${i18n('appName')}</span>
          </span>
        </div>
        ${trashSearches.length > 0 && html`<${TrashButton} />`}
      </div>
    </nav>
    ${isNewSearch && !mode && html`
      <${SearchActiveBar}
        search=${search}
        onClick=${handleNewSearch} />
    `}
    ${isNewSearch && mode === 'create' && html`
      <${SearchModalNew}
        search=${search}
        onCreated=${handleRefresh}
        onCancel=${handleCloseModal}
        onSaveTo=${handleOpenReplace}
      />
    `}
    ${isSavedSearch && mode === 'update' && html`
      <${SearchModalEdit}
        search=${search}
        onUpdated=${handleRefresh}
        onCancel=${handleCloseModal} />
    `}
    ${isNewSearch && mode === 'replace' && html`
      <${SearchModalReplace}
        activeSearches=${activeSearches}
        search=${search}
        onReplace=${handleRefresh}
        onCancel=${handleCloseModal}
      />
    `}
    ${mode === 'trash' && html`
      <${SearchModalTrash}
        trashSearches=${trashSearches}
        onRestore=${handleRefresh}
        onCancel=${handleCloseModal}
      />
    `}
    <ul class="list-group list-searches mb-1">
      ${activeSearches.map((savedSearch, i) => html`
        <${SearchItem}
          key=${i}
          search=${savedSearch}
          onEdit=${handleEdit}
          onDeleted=${handleRefresh}
        />
      `)}
    </ul>
  `;
}

render(html`<${Popup} />`, document.getElementById('app'));
