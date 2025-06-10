import { html, useEffect, useState, useRef } from '../packages/preact.mjs';
import message from '../packages/message.js';
import { i18n } from '../utils.js';

const SearchItem = ({ search, onEdit, onDeleted }) => {
  const [isFresh, setIsFresh] = useState(false);
  const itemRef = useRef(null);

  useEffect(() => {
    if (search.updatedAt) {
      const updated = (Date.now() - new Date(search.updatedAt).getTime()) <= 5000;
      setIsFresh(updated);
      if (updated && itemRef.current) {
        itemRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      setTimeout(() => setIsFresh(false), 2000);
    } else {
      setIsFresh(false);
    }
  }, [search.updatedAt]);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const deletedAt = new Date().toISOString();
    chrome.storage.local.get([search.id], (result) => {
      const deletedSearch = { ...result[search.id], deletedAt };
      chrome.storage.local.set({ [search.id]: deletedSearch }, () => {
        console.log('Search saved to chrome.storage.local:', deletedSearch);
        message.success(i18n('searchDeletedSuccess'));
        onDeleted(deletedSearch);
      });
    });
  };
  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit(search);
  };
  const handleItemClick = () => {
    window.open(search.url, '_blank', 'noopener');
  };
  return html`
    <li
      class="list-group-item d-flex flex-column align-items-start search-item ${isFresh ? 'bg-warning-subtle' : ''}"
      title=${i18n('searchItemOpen')}
      ref=${itemRef}
      onClick=${handleItemClick}
    >
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
