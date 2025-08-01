type Class = new (...args: unknown[]) => unknown;

type Func = (...args: unknown[]) => unknown;

const NOT_GIVEN = Symbol('NOT_GIVEN');

class UntypedWhether extends Function {
  constructor() {
    super('o', `return !!o`);
  }

  /**
   * Same as `Object.is`
   */
  isSame(a: any, b: any): boolean {
    return Object.is(a, b);
  }

  isObject<T extends object>(o: any): o is T {
    return typeof o === 'object' && o !== null;
  }

  /**
   * Tell whether the target is a non-null object or a function
   * @param o
   */
  likeObject(o: unknown) {
    return (typeof o === 'object' && o !== null) || typeof o === 'function';
  }

  /**
   * Tell whether the target is a string
   * @param o
   */
  isString(o: any): o is string {
    return typeof o === 'string';
  }

  /**
   * Tell whether the target is a number
   * @param o
   */
  isNumber(o: any): o is number {
    return typeof o === 'number';
  }

  /**
   * Tell whether the target is a boolean
   * @param o
   */
  isBoolean(o: any): o is boolean {
    return typeof o === 'boolean';
  }

  /**
   * Tell whether the target is undefined
   * @param o
   */
  isUndefined(o: any): o is undefined {
    return typeof o === 'undefined';
  }

  /**
   * Tell whether the target is null
   * @param o
   */
  isNull(o: any): o is null {
    return o === null;
  }

  /**
   * Tell whether the target is a symbol
   * @param o
   */
  isSymbol(o: any): o is symbol {
    return typeof o === 'symbol';
  }

  /**
   * Tell whether the target is a bigint
   * @param o
   */
  isBigInt(o: any): o is bigint {
    return typeof o === 'bigint';
  }

  /**
   * Tell whether the target is null or undefined
   * @param o
   */
  isNullish(o: any): o is null | undefined {
    return o === null || o === undefined;
  }

  /**
   * Tell whether the target is a primitive value
   * @param o
   */
  isPrimitive(o: any): o is string | number | boolean | null | undefined | symbol | bigint {
    const t = typeof o;
    return (
      t === 'string' ||
      t === 'number' ||
      t === 'boolean' ||
      t === 'undefined' ||
      t === 'symbol' ||
      t === 'bigint' ||
      o === null
    );
  }

  isField(o: unknown): o is string | symbol {
    return typeof o === 'string' || typeof o === 'symbol';
  }

  isPropertyKey(o: unknown): o is string | symbol | number {
    return typeof o === 'string' || typeof o === 'symbol' || typeof o === 'number';
  }

  isNaN(o: any): boolean | null {
    if (typeof o !== 'number') {
      return null;
    }

    return Number.isNaN(o);
  }

  isInteger(o: any) {
    return Number.isInteger(o);
  }

  isSafeInteger(o: any) {
    return Number.isSafeInteger(o);
  }

  isSafeNumber(o: any) {
    return typeof o === 'number' && o <= Number.MAX_SAFE_INTEGER && o >= Number.MIN_SAFE_INTEGER;
  }

  isClass(o: any): o is Class {
    if (typeof o !== 'function') {
      return false;
    }
    try {
      const psudo = new Proxy(o, { construct: () => ({}) });
      new psudo();
      return true;
    } catch {
      return false;
    }
  }

  isFunction(o: any): o is Func {
    return typeof o === 'function';
  }

  /**
   * Asserts that `arr` is an array.
   * - If `predicate` is provided, it will be called for each element in the array.
   *   - If it returns a string, it will throw an error with that message.
   *   - If it returns `null` or `undefined`, the element is considered valid.
   *   - If it returns `boolean` and value is `true`, the element is considered valid.
   * @param arr target array
   * @param predicate function to validate each element
   * @param msg
   */
  isArray<T = any>(
    arr: any,
    predicate: (value?: T, index?: number, array?: T[]) => string | boolean = NOT_GIVEN as any
  ): arr is T[] {
    if (!Array.isArray(arr)) {
      return false;
    }

    if (Object.is(predicate, NOT_GIVEN)) {
      return true;
    }

    if (typeof predicate !== 'function') {
      throw new Error('`predicate` must be a function');
    }

    for (let i = 0; i < arr.length; i++) {
      const result = predicate(arr[i], i, arr);
      if (result === false) {
        return false;
      }
    }
    return true;
  }

  /**
   * Tell whether the target is like `(...) => any`
   * - Might be not so accurate under some extreme circumstances like bound functions or proxied functions, etc.
   *   - So we just don't allow such cases.
   * @see https://github.com/baendlorel/get-function-features
   * @see https://github.com/baendlorel/js-is-arrow-function
   */
  isArrowFunction(o: any): o is Func {
    if (typeof o !== 'function') {
      return false;
    }

    const str = Function.prototype.toString.call(o) as string;
    const trimmed = str.replace(/\s/g, '');
    if (/^/.test(trimmed)) {
      return true;
    }

    try {
      const psudo = new Proxy(o, { construct: () => ({}) });
      new psudo();
      return false;
    } catch {
      return true;
    }
  }
}

type Whether = (<T = any>(o: unknown) => o is T) & UntypedWhether;

/**
 * Expect the target to be truthy.
 * @param target
 */
export const whether: Whether = new UntypedWhether() as Whether;
