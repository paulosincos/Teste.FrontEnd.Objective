import eventBus, { events } from "../services/eventBus.js";
import cssRequire from "../services/cssRequire.js";
import store from "../services/store.js";

cssRequire('SearchBox');

export default class SearchBox extends HTMLElement {
  get label() {
    return this.getAttribute('label');
  }

  set label(value) {
    this.setAttribute('label', value);
  }

  get value() {
    return this.getAttribute('value');
  }

  set value(value) {
    this.setAttribute('value', value);
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.createDiv();
    this.value = store.searchTerm != null ? store.searchTerm : '';
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        if (this.labelEl) {
          this.labelEl.innerText = newValue;
        }
        break;
      case 'value':
        if (this.inputEl) {
          this.inputEl.value = newValue;
        }
        break;
      default:
        throw new Error(`Not supported attribute: ${name}`);
    }
  }

  createDiv() {
    if (this.divEl) {
      return;
    }

    this.divEl = document.createElement('div');
    this.divEl.classList.add('search-box');
    this.createLabel();
    this.createInput()
    this.append(this.divEl);
  }

  createLabel() {
    this.labelEl = document.createElement('label');
    this.labelEl.classList.add('search-box__label');
    this.labelEl.innerText = this.label;
    this.divEl.append(this.labelEl);
  }

  createInput() {
    this.inputEl = document.createElement('input');
    this.inputEl.classList.add('search-box__input');
    this.inputEl.setAttribute('type', 'text');
    this.inputEl.value = this.value;
    this.inputEl.addEventListener('input', event => {
      this.value = event.target.value;
      store.searchTerm = this.value;
      eventBus.emit(events.SEARCH_TERM_CHANGED, this.value);
    })
    this.divEl.append(this.inputEl);
  }

  static register(windowInstance) {
    (windowInstance || window).customElements.define('t-search-box', SearchBox);
  }

  static get observedAttributes() {
    return ['label', 'value'];
  }
}