const NOT_GIVEN = Symbol('NOT_GIVEN');

export class UntypedWhether extends Function {
  constructor() {
    super('o', `return !!o`);
  }

  // #region Normal judge
  /**
   * Same as `Object.is`
   */
  is(a: any, b: any): boolean {
    return Object.is(a, b);
  }

  isNegativeZero(o: any): boolean {
    return Object.is(o, -0);
  }

  isPositiveZero(o: any): boolean {
    return Object.is(o, +0);
  }

  isFunction(o: any): o is Func {
    return typeof o === 'function';
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

  isInteger(o: any): boolean {
    return Number.isInteger(o);
  }

  isSafeInteger(o: any): boolean {
    return Number.isSafeInteger(o);
  }

  isSafeNumber(o: any): boolean {
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

  /**
   * Asserts that `arr` is an array.
   * - If `predicate` is provided, it will be called for each element in the array.
   *   - If it returns a string, it will throw an error with that message.
   *   - If it returns `null` or `undefined`, the element is considered valid.
   *   - If it returns `boolean` and value is `true`, the element is considered valid.
   * @param o target array
   * @param predicate function to validate each element
   * @param msg
   */
  isArray<T = any>(
    o: any,
    predicate: (value?: T, index?: number, array?: T[]) => string | boolean = NOT_GIVEN as any
  ): o is T[] {
    if (!Array.isArray(o)) {
      return false;
    }

    if (Object.is(predicate, NOT_GIVEN)) {
      return true;
    }

    if (typeof predicate !== 'function') {
      throw new Error('`predicate` must be a function');
    }

    for (let i = 0; i < o.length; i++) {
      const result = predicate(o[i], i, o);
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
  // #endregion

  // #region Can be undefined
  orNegativeZero(o: any): boolean {
    return o === undefined || this.isNegativeZero(o);
  }

  orPositiveZero(o: any): boolean {
    return o === undefined || this.isPositiveZero(o);
  }

  orFunction(o: any): o is Func | undefined {
    return o === undefined || this.isFunction(o);
  }

  orObject<T extends object>(o: any): o is T | undefined {
    return o === undefined || this.isObject(o);
  }

  /**
   * Tell whether the target is a non-null object or a function
   * @param o
   */
  orLikeObject(o: unknown) {
    return o === undefined || this.likeObject(o);
  }

  /**
   * Tell whether the target is a string
   * @param o
   */
  orString(o: any): o is string | undefined {
    return o === undefined || this.isString(o);
  }

  /**
   * Tell whether the target is a number
   * @param o
   */
  orNumber(o: any): o is number | undefined {
    return o === undefined || this.isNumber(o);
  }

  /**
   * Tell whether the target is a boolean
   * @param o
   */
  orBoolean(o: any): o is boolean | undefined {
    return o === undefined || this.isBoolean(o);
  }

  /**
   * Tell whether the target is undefined
   * @param o
   */
  orUndefined(o: any): o is undefined {
    return o === undefined || this.isUndefined(o);
  }

  /**
   * Tell whether the target is null
   * @param o
   */
  orNull(o: any): o is null | undefined {
    return o === undefined || this.isNull(o);
  }

  /**
   * Tell whether the target is a symbol
   * @param o
   */
  orSymbol(o: any): o is symbol | undefined {
    return o === undefined || this.isSymbol(o);
  }

  /**
   * Tell whether the target is a bigint
   * @param o
   */
  orBigInt(o: any): o is bigint | undefined {
    return o === undefined || this.isBigInt(o);
  }

  orField(o: unknown): o is string | symbol | undefined {
    return o === undefined || this.isField(o);
  }

  orPropertyKey(o: unknown): o is string | symbol | number | undefined {
    return o === undefined || this.isPropertyKey(o);
  }

  orNaN(o: any): boolean | null {
    return o === undefined || this.isNaN(o);
  }

  orInteger(o: any): boolean {
    return o === undefined || this.isInteger(o);
  }

  orSafeInteger(o: any): boolean {
    return o === undefined || this.isSafeInteger(o);
  }

  orSafeNumber(o: any): boolean {
    return o === undefined || this.isSafeNumber(o);
  }

  orClass(o: any): o is Class | undefined {
    return o === undefined || this.isClass(o);
  }

  orArray<T = any>(
    o: any,
    predicate: (value?: T, index?: number, array?: T[]) => string | boolean = NOT_GIVEN as any
  ): o is T[] | undefined {
    return o === undefined || this.isArray(o, predicate);
  }
  // #endregion
}
