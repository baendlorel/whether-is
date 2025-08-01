import { describe, it, expect } from '@jest/globals';
import { UntypedWhether } from '../src/whether';

describe('UntypedWhether edge cases', () => {
  const whether = new UntypedWhether();

  it('cross-realm Array/Date/RegExp', () => {
    // Simulate cross-realm by using iframes in browser, here we can only mock
    const fakeArray = Object.create(Array.prototype);
    const fakeDate = Object.create(Date.prototype);
    const fakeRegExp = Object.create(RegExp.prototype);
    expect(whether.isArray(fakeArray)).toBe(true);
    expect(whether.isDate(fakeDate)).toBe(true);
    expect(whether.isRegExp(fakeRegExp)).toBe(true);
  });

  it('exotic objects', () => {
    const obj = Object.create(null);
    expect(whether.isPlainObject(obj)).toBe(true);
    expect(whether.isObject(obj)).toBe(true);
    expect(whether.isFunction(obj)).toBe(false);
  });

  it('proxy objects', () => {
    const arr = new Proxy([], {});
    expect(whether.isArray(arr)).toBe(true);
    const obj = new Proxy({}, {});
    expect(whether.isPlainObject(obj)).toBe(true);
  });

  it('falsy but not empty', () => {
    expect(whether.isEmpty(false)).toBe(false);
    expect(whether.isEmpty(NaN)).toBe(false);
  });

  it('NaN edge', () => {
    expect(whether.isNaN(Number('foo'))).toBe(true);
    expect(whether.isNaN('foo')).toBe(null);
  });

  it('Set/Map with custom prototype', () => {
    class MySet extends Set {}
    class MyMap extends Map {}
    const mySet = new MySet();
    const myMap = new MyMap();
    expect(whether.isSet(mySet)).toBe(false); // isSameProto should fail
    expect(whether.isMap(myMap)).toBe(false);
  });

  it('WeakSet/WeakMap with custom prototype', () => {
    class MyWeakSet extends WeakSet {}
    class MyWeakMap extends WeakMap {}
    const myWeakSet = new MyWeakSet();
    const myWeakMap = new MyWeakMap();
    expect(whether.isWeakSet(myWeakSet)).toBe(false);
    expect(whether.isWeakMap(myWeakMap)).toBe(false);
  });

  it('Function with Symbol.hasInstance', () => {
    class Fake {}
    Object.defineProperty(Fake, Symbol.hasInstance, {
      value: () => true,
    });
    expect(whether.isClass(Fake)).toBe(true);
    expect(whether.isObject(Fake)).toBe(false);
  });

  it('Arrow function with bind', () => {
    const arrow = () => {};
    const bound = arrow.bind(null);
    expect(whether.isArrowFunction(bound)).toBe(false); // bound arrow is not detected as arrow
  });

  it('Array-like objects', () => {
    const arrayLike = { 0: 'a', 1: 'b', length: 2 };
    expect(whether.isArray(arrayLike)).toBe(false);
    expect(whether.isIterable(arrayLike)).toBe(false);
  });

  it('Symbol.iterator shadowed', () => {
    const obj = { [Symbol.iterator]: 123 };
    expect(whether.isIterable(obj)).toBe(false);
  });

  it('BigInt edge', () => {
    expect(whether.isBigInt(Object(BigInt(1)))).toBe(false);
  });

  it('isField/isPropertyKey with weird values', () => {
    expect(whether.isField(Object('a'))).toBe(false);
    expect(whether.isPropertyKey(Object(1))).toBe(false);
  });
});
