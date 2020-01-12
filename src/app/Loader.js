import cssRequire from "../services/cssRequire.js";

cssRequire('Loader');

export default class Loader extends HTMLElement {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.innerHTML = `<div class="loader"><div class="loader__parts"><div class="loader__part"></div><div class="loader__part"></div><div class="loader__part"></div></div></div>`;
  }

  static register(windowInstance) {
    (windowInstance || window).customElements.define('t-loader', Loader);
  }
}