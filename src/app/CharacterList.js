import KitsuCharactersService from "../services/KitsuCharacters.js";
import eventBus, { events } from "../services/eventBus.js";
import cssRequire from "../services/cssRequire.js";
import store from "../services/store.js";
import CharacterDetailModal from "./CharacterDetailModal.js";

cssRequire('CharacterList');

const DELAYED_DATA_LOAD_TIMEOUT = 700;

const theadTemplate = '<tr>'
  + '<th>'
  + '<div class="list__header-background-wrapper">'
  + '<span class="list__header-full-view">Personagem</span>'
  + '<span class="list__header-mobile-view">Nome</span>'
  + '</div>'
  + '</th>'
  + '<th>'
  + '<div class="list__header-background-wrapper">'
  + 'Descrição'
  + '</div>'
  + '</th>'
  + '</tr>';

const emptyTableRowTemplate = '<td colspan="2" class="list__empty">Não há registros para exibir</td>'
const loadingRowTemplate = '<td colspan="2" class="list__loading"><t-loader></t-tloader></td>'

export default class CharacterList extends HTMLElement {
  pageNumber = 0

  constructor() {
    super();
    this.items = [];
    this.loading = false;
    this.loadData();
  }

  connectedCallback() {
    this.searchTerm = store.searchTerm;
    this.pageNumber = store.currentPageNumber;
    this.createTable();
    eventBus.on(events.SEARCH_TERM_CHANGED, this.onNewSearchTerm, this);
    eventBus.on(events.PAGINATION_CHANGED, this.onNewPagination, this);
  }

  disconnectedCallback() {
    eventBus.off(events.SEARCH_TERM_CHANGED, this.onNewSearchTerm, this);
    eventBus.off(events.PAGINATION_CHANGED, this.onNewPagination, this);
  }

  onNewSearchTerm(searchTerm) {
    this.searchTerm = searchTerm;
    this.loadData();
  }

  onNewPagination(pageNumber) {
    this.pageNumber = pageNumber;
    this.loadData();
  }

  createTable() {
    if (this.tableEl) {
      this.fillRows();
      return;
    }

    this.tableEl = document.createElement('table');
    this.tableEl.classList.add('list');
    this.append(this.tableEl);

    this.tableEl.append(CharacterList.getHeader());
    this.createBody();
    this.fillRows();
  }

  createBody() {
    this.bodyEl = document.createElement('tbody');
    this.tableEl.append(this.bodyEl);
  }

  loadData() {
    eventBus.emit(events.DATA_LOADING);
    this.loading = true;
    this.items = [];
    this.fillRows();

    if (this.loadDataDelayTimeout != null) {
      clearTimeout(this.loadDataDelayTimeout);
    }

    this.loadDataDelayTimeout = setTimeout(() => {
      this.loadDataDelayTimeout = null;
      this.delayedFinishLoadData();
    }, DELAYED_DATA_LOAD_TIMEOUT);
  }

  async delayedFinishLoadData() {
    try {
      const response = await KitsuCharactersService.getList(this.pageNumber, this.searchTerm);
      this.items = response.data;
      store.totalItems = response.meta.count;
      eventBus.emit(events.DATA_LOADED, response);
    } finally {
      this.loading = false;
    }
    this.fillRows();
  }

  fillRows() {
    if (!this.bodyEl) {
      return;
    }
    this.bodyEl.innerHTML = '';
    if (this.items.length > 0) {
      this.items.map(({ id, attributes }) => {
        this.bodyEl.append(CharacterList.buildRow(id, attributes));
      })
    } else if (this.loading) {
      this.bodyEl.append(CharacterList.buildLoadingRow());
    } else {
      this.bodyEl.append(CharacterList.buildEmptyRow());
    }
  }

  static getHeader() {
    const theadEl = document.createElement('thead');
    theadEl.innerHTML = theadTemplate;
    return theadEl;
  }

  static register(windowInstance) {
    (windowInstance || window).customElements.define('t-character-list', CharacterList);
  }

  static buildRow(id, { name, image, description }) {
    const row = document.createElement('tr');
    row.classList.add('list__character-row');
    row.addEventListener('click', () => CharacterDetailModal.show(id))
    const imageUrl = KitsuCharactersService.getImageUrl(image);
    row.innerHTML = '<td>'
      + `<div class="square-image list__pic" style="background-image: url(\'${imageUrl}\');"></div>`
      + `<div class="list__character-name">${name}</div>`
      + '</td>'
      + '<td>'
      + '<div class="line-clamp-3">'
      + description
      + '</div>'
      + '</td>';
    return row;
  }

  static buildLoadingRow() {
    const row = document.createElement('tr');
    row.innerHTML = loadingRowTemplate;
    return row;
  }

  static buildEmptyRow() {
    const row = document.createElement('tr');
    row.innerHTML = emptyTableRowTemplate;
    return row;
  }
}