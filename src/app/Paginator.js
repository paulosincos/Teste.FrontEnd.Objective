import cssRequire from "../services/cssRequire.js";
import eventBus, { events } from "../services/eventBus.js";
import store from "../services/store.js";

cssRequire('Paginator');

const TOTAL_VISIBLE_PAGES = 6;
const MIN_VISIBLE_PAGES = 3;

const pagesHtml = '<div class="paginator__page-number paginator__page-number_active">1</div>'
  + '<div class="paginator__page-number">2</div>'
  + '<div class="paginator__page-number">3</div>'
  + '<div class="paginator__page-number">4</div>'
  + '<div class="paginator__page-number">5</div>'
  + '<div class="paginator__page-number">6</div>';

export default class Paginator extends HTMLElement {
  totalItems = 0

  currentPage;

  get totalPages() {
    return Math.ceil(this.totalItems / 10);
  }

  get visiblePages() {
    if (this.visiblePagesCache
      && this.visiblePagesCache.currentPage === this.currentPage
      && this.visiblePagesCache.totalItems === this.totalItems) {
      return this.visiblePagesCache.visiblePages;
    }

    const maxPages = this.getPageSet(TOTAL_VISIBLE_PAGES);
    const minPages = this.getPageSet(MIN_VISIBLE_PAGES);

    const visiblePages = maxPages.map(pageNumber => ({
      pageNumber,
      requiredShow: minPages.includes(pageNumber),
      el: null,
    }));

    this.visiblePagesCache = {
      totalItems: this.totalItems,
      currentPage: this.currentPage,
      visiblePages,
    }

    return visiblePages;
  }

  visiblePagesCache

  constructor() {
    super();
  }

  connectedCallback() {
    this.currentPage = store.currentPageNumber;
    this.totalItems = store.totalItems;
    this.createMainDiv();
    eventBus.on(events.SEARCH_TERM_CHANGED, this.onNewSearchTerm, this);
    eventBus.on(events.DATA_LOADING, this.onDataStartLoading, this);
    eventBus.on(events.DATA_LOADED, this.onDataFinishLoading, this);
  }

  disconnectedCallback() {
    eventBus.off(events.SEARCH_TERM_CHANGED, this.onNewSearchTerm, this);
    eventBus.off(events.DATA_LOADING, this.onDataStartLoading, this);
    eventBus.off(events.DATA_LOADED, this.onDataFinishLoading, this);
  }

  onDataStartLoading() {
    this.totalItems = 0;
    this.fillPageList();
  }

  onDataFinishLoading() {
    this.totalItems = store.totalItems;
    this.fillPageList();
  }

  onNewSearchTerm() {
    this.changePage(0);
  }

  changePage(newPage) {
    this.currentPage = newPage;
    this.fillPageList();
    eventBus.emit(events.PAGINATION_CHANGED, newPage);
  }

  toPreviousPage() {
    if (this.currentPage === 0) {
      return;
    }

    const newPage = this.currentPage - 1;
    if (newPage < 0) {
      newPage = 0;
    }
    this.changePage(newPage);
  }

  toNextPage() {
    if (this.currentPage >= this.totalPages - 1) {
      return;
    }

    const newPage = this.currentPage + 1;
    if (newPage >= this.totalPages) {
      newPage = this.totalPages > 0 ? this.totalPages - 1 : 0;
    }
    this.changePage(newPage);
  }

  createMainDiv() {
    if (this.mainDivEl) {
      this.fillPageList();
      return;
    }

    this.mainDivEl = document.createElement('div');
    this.mainDivEl.classList.add('paginator');
    this.createNavigationElements();
    this.fillPageList();
    this.append(this.mainDivEl);
  }

  createNavigationElements() {
    this.previousBtnEl = document.createElement('div');
    this.previousBtnEl.classList.add('paginator__arrow-left');
    this.previousBtnEl.addEventListener('click', () => this.toPreviousPage())

    this.pageNumbersEl = document.createElement('div');
    this.pageNumbersEl.classList.add('paginator__page-numbers');

    this.nextBtnEl = document.createElement('div');
    this.nextBtnEl.classList.add('paginator__arrow-right');
    this.nextBtnEl.addEventListener('click', () => this.toNextPage())

    this.mainDivEl.append(this.previousBtnEl, this.pageNumbersEl, this.nextBtnEl);
  }

  fillPageList() {
    if (this.totalItems === 0) {
      this.mainDivEl.classList.add('paginator_hidden');
      return;
    } else {
      this.mainDivEl.classList.remove('paginator_hidden');
    }

    if (this.currentPage === 0) {
      this.previousBtnEl.classList.add('paginator__arrow-left_disabled');
    } else {
      this.previousBtnEl.classList.remove('paginator__arrow-left_disabled');
    }

    if (this.currentPage === this.totalPages - 1) {
      this.nextBtnEl.classList.add('paginator__arrow-right_disabled');
    } else {
      this.nextBtnEl.classList.remove('paginator__arrow-right_disabled');
    }

    this.pageNumbersEl.innerHTML = '';
    this.visiblePages.forEach(pageConfig => {
      if (!pageConfig.el) {
        pageConfig.el = this.createPageEl(pageConfig);
      }

      const pageEl = pageConfig.el;

      if (this.currentPage === pageConfig.pageNumber) {
        pageEl.classList.add('paginator__page-number_active');
      } else {
        pageEl.classList.remove('paginator__page-number_active');
      }

      if (pageConfig.requiredShow) {
        pageEl.classList.add('paginator__page-number_always-show');
      } else {
        pageEl.classList.remove('paginator__page-number_always-show');
      }

      pageEl.addEventListener('click', () => {
        if (this.currentPage !== pageConfig.pageNumber) {
          this.changePage(pageConfig.pageNumber);
        }
      });

      this.pageNumbersEl.append(pageEl);
    });
  }

  createPageEl(pageConfig) {
    const pageEl = document.createElement('div');
    pageEl.classList.add('paginator__page-number');
    pageEl.innerText = pageConfig.pageNumber + 1;
    return pageEl;
  }

  getPageSet(setSize) {
    const sideCount = Math.floor((setSize - 1) / 2);
    let minimum = this.currentPage - sideCount;
    if (minimum < 0)  {
      minimum = 0;
    }

    let maximum = minimum + setSize - 1;
    if (maximum >= this.totalPages)  {
      maximum = this.totalPages - 1;
    }

    const pages = [];

    for (let index = minimum; index <= maximum; index++) {
      pages.push(index);
    }

    return pages;
  }

  static register(windowInstance) {
    (windowInstance || window).customElements.define('t-paginator', Paginator);
  }
}