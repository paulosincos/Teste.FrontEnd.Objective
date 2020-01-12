class EventBus {
  constructor() {
    this.listeners = {};
  }

  on(eventName, listener, scope) {
    this.getEventListeners(eventName).push({
      listener,
      scope,
    });
  }

  off(eventName, listener, scope) {
    const eventListeners = this.getEventListeners(eventName);
    const listenerIndex = eventListeners.findIndex(item => item.listener === listener && item.scope === scope);

    if (listenerIndex < 0) {
      throw new Error('Non existent listener.');
    }

    eventListeners.splice(listenerIndex, 1);
  }

  emit(eventName, ...args) {
    this.getEventListeners(eventName).forEach(({ listener, scope }) => {
      listener.call(scope, ...args);
    });
  }

  getEventListeners(eventName) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }

    return this.listeners[eventName];
  }
}

export default new EventBus();

export const events = {
  SEARCH_TERM_CHANGED: 'search-terms-changed',
  PAGINATION_CHANGED: 'pagination-changed',
  DATA_LOADING: 'data-loading',
  DATA_LOADED: 'data-loaded',
};
