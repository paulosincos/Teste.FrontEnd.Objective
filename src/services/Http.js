export default class Http {
  get(url) {
    return this.request('get', url);
  }

  delete(url) {
    return this.request('get', url);
  }

  post(url, data) {
    return this.request('post', url, data);
  }

  put(url, data) {
    return this.request('post', url, data);
  }

  request(method, url, data) {
    const httpRequest = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      httpRequest.addEventListener('load', () => resolve(Http.extractResponseData(httpRequest)));
      httpRequest.addEventListener('error', reject);
      httpRequest.open(method, url);
      if (method === 'put' || method === 'post') {
        httpRequest.send(data);
      } else {
        httpRequest.send();
      }
    });
  }

  static extractResponseData(httpRequest) {
    return JSON.parse(httpRequest.responseText);
  }
}