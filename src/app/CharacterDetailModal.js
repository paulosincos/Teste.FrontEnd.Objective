import cssRequire from "../services/cssRequire.js";
import KitsuCharactersService from "../services/KitsuCharacters.js";

cssRequire('CharacterDetailModal');

let activeModal = null;

export default class CharacterDetailModal extends HTMLElement {
  get characterId() {
    return decodeURIComponent(this.getAttribute('character-id'));
  }
  constructor() {
    super();
  }

  connectedCallback() {
    const root = document.createElement('div');
    root.classList.add('character-detail');
    this.characterContentEl = document.createElement('div');
    this.characterContentEl.classList.add('character-detail__content');
    root.append(this.characterContentEl);
    this.loadContent();
    this.append(root);
  }

  loadContent() {
    this.characterContentEl.innerHTML = '<t-loader></t-tloader>';
    KitsuCharactersService.getCharacterDetails(this.characterId)
      .then(data => {
        this.characterContentEl.innerHTML = '';
        this.characterContentEl.append(...this.getCharacterDetailElements(data));
      });
  }

  getCharacterDetailElements({ character, medias }) {
    const { attributes } = character;
      // `<div class="square-image list__pic" style="background-image: url(\'${imageUrl}\');"></div>`
    const imageUrl = KitsuCharactersService.getImageUrl(attributes.image);
    const imageDiv = document.createElement('div');
    imageDiv.classList.add('square-image', 'character-detail__pic');
    imageDiv.style = `background-image: url(\'${imageUrl}\');`;

    const mediasList = this.createMediasList(medias);

    const nameLabel = document.createElement('label');
    nameLabel.classList.add('character-detail__name');
    nameLabel.innerText = attributes.name;

    const closeBtn = document.createElement('div');
    closeBtn.classList.add('character-detail__close-button');
    closeBtn.innerText = 'Voltar';
    closeBtn.addEventListener('click', () => CharacterDetailModal.close());

    return [imageDiv, nameLabel, ...mediasList, closeBtn];
  }

  createMediasList(medias) {
    const mediasHeader = document.createElement('div');
    mediasHeader.classList.add('character-detail__medias-header');
    mediasHeader.innerText = "Mídias";

    const mediasDiv = document.createElement('div');
    mediasDiv.classList.add('character-detail__medias');

    const mediasRows = medias.map(media => this.createMediaRow(media));

    if (mediasRows.length === 0) {
      mediasRows.push(this.createEmptyMediaRow());
    }

    mediasDiv.append(...mediasRows);

    return [mediasHeader, mediasDiv]
  }

  createMediaRow({ image, name }) {
    const row = document.createElement('div');
    row.classList.add('character-detail__media-row');
    const imageUrl = KitsuCharactersService.getImageUrl(image);
    row.innerHTML = `<div class="square-image-contain character-detail__media-pic" style="background-image: url(\'${imageUrl}\');"></div>`
      + `<div class="character-detail__media-name">${name}</div>`;
    return row;
  }

  createEmptyMediaRow() {
    const row = document.createElement('div');
    row.classList.add('character-detail__empty-media');
    row.innerText = "Nenhuma mídia localizada";
    return row;
  }

  static register(windowInstance) {
    (windowInstance || window).customElements.define('t-character-detail-modal', CharacterDetailModal);
  }

  static show(characterId) {
    if (activeModal) {
      this.close();
    }
    document.body.classList.add('no-scroll');
    activeModal = document.createElement('t-character-detail-modal');
    activeModal.setAttribute('character-id', encodeURIComponent(characterId));
    document.body.append(activeModal);
  }

  static close() {
    document.body.classList.remove('no-scroll');
    activeModal.remove();
    activeModal = null;
  }
}