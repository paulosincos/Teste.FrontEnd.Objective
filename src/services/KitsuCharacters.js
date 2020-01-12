import Http from "./Http.js";

const baseUrl = 'https://kitsu.io/api/edge/characters';

const NO_PICTURE_URL = '/images/no-picture.png'

export default class KitsuCharacters {
  static getList(pageNumber, searchTerm) {
    const queryUrl = `${baseUrl}?page[offset]=${pageNumber * 10}`;
    const url = searchTerm == null || searchTerm === ''
      ? queryUrl
      : `${queryUrl}&filter[name]=${encodeURIComponent(searchTerm)}`
    return new Http().get(url);
  }
  static get(id) {
    return new Http().get(`${baseUrl}/${id}`).then(({ data }) => data);
  }
  static async getMedias(id) {
    const mediaRelations = await new Http().get(`${baseUrl}/${id}/media-characters`).then(({ data }) => data);
    const medias = await Promise.all(mediaRelations.map(({ id: mediaId }) =>
      new Http().get(`https://kitsu.io/api/edge/media-characters/${mediaId}/media`).then(({ data }) => data),
    ));
    return medias.map(({ attributes }) => ({
      name: (attributes.titles && attributes.titles.en || attributes.titles.en_jp) || 'Título não específicado',
      image: attributes.coverImage || attributes.posterImage,
    }))
  }
  static async getCharacterDetails(id) {
    const responses = await Promise.all([
      this.get(id),
      this.getMedias(id),
    ]);

    return {
      character: responses[0],
      medias: responses[1],
    };
  }
  static getImageUrl(imageData) {
    return imageData && imageData.original || NO_PICTURE_URL
  }
}