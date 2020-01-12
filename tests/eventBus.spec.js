import eventBus from '../src/services/eventBus.js';

const listener = jest.fn();
const anotherListener = jest.fn();
const scope = {};
const eventName = "teste";
const eventArgs = "teste";
const wrongEventName = "teste-outro-evento";

describe('EventBus', () => {
  it("Deve ser um objeto", () => {
    expect(typeof eventBus).toBe('object');
  });

  it("Deve possuir a interface esperada", () => {
    expect(typeof eventBus.on).toBe('function');
    expect(typeof eventBus.off).toBe('function');
    expect(typeof eventBus.emit).toBe('function');
  });

  it("Deve aceitar a emissão de um evento, ainda sem ouvintes", () => {
    expect(eventBus.emit(eventName, eventArgs)).toBeUndefined();
  });

  it("Deve aceitar a adição de um ouvinte", () => {
    expect(eventBus.on(eventName, listener, scope)).toBeUndefined();
    expect(eventBus.on(eventName, anotherListener, scope)).toBeUndefined();
  });

  it("Deve aceitar a emissão de um evento, agora com ouvintes", () => {
    expect(eventBus.emit(eventName, eventArgs)).toBeUndefined();

    expect(listener).toBeCalledTimes(1);
    expect(listener).toBeCalledWith(eventArgs);
    expect(anotherListener).toBeCalledTimes(1);
    expect(anotherListener).toBeCalledWith(eventArgs);
  });

  it("Deve emitir outro evento sem afetar os ouvintes errados", () => {
    expect(eventBus.emit(wrongEventName, eventArgs)).toBeUndefined();

    expect(listener).toBeCalledTimes(1);
    expect(anotherListener).toBeCalledTimes(1);
  });

  it("Deve aceitar a remoção de um listener", () => {
    expect(eventBus.off(eventName, anotherListener, scope)).toBeUndefined();
  });

  it("Deve emitir um evento com apenas um ouvinte.", () => {
    expect(eventBus.emit(eventName, eventArgs)).toBeUndefined();

    expect(listener).toBeCalledTimes(2);
    expect(anotherListener).toBeCalledTimes(1);
  });

  it("Deve aceitar a remoção do último listener", () => {
    expect(eventBus.off(eventName, listener, scope)).toBeUndefined();
  });

  it("Deve emitir um evento sem mais nenhum ouvinte.", () => {
    expect(eventBus.emit(eventName, eventArgs)).toBeUndefined();

    expect(listener).toBeCalledTimes(2);
    expect(anotherListener).toBeCalledTimes(1);
  });

});