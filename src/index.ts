type Class = new (...args: unknown[]) => unknown;

type Func = (...args: unknown[]) => unknown;

type Key = string | symbol;

class UntypedWhether extends Function {
  constructor() {
    super('o', `return !!o`);
  }

  isObject<T extends object>(o: any): o is T {
    return typeof o === 'object' && o !== null;
  }

  likeObject(o: unknown) {
    return (typeof o === 'object' && o !== null) || typeof o === 'function';
  }

  isKey(o: unknown): o is Key {
    return typeof o === 'string' || typeof o === 'symbol';
  }

  isClass(o: any = 'Should be a class/constructor'): o is Class {
    if (typeof o !== 'function') {
      return false;
    }
    try {
      // No side effects, just to check if it is a class
      new new Proxy(o, { construct: () => ({}) })();
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
    predicate?: (value: T, index?: number, array?: T[]) => string | boolean
  ): arr is T[] {
    if (!Array.isArray(arr)) {
      return false;
    } else if (predicate) {
      for (let i = 0; i < arr.length; i++) {
        const result = predicate(arr[i], i, arr);
        if (result === false) {
          return false;
        } else if (typeof result === 'string') {
          return false;
        }
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
      // No side effects, just to check if it is a class
      new new Proxy(o, { construct: () => ({}) })();
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
