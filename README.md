# whether-is

[中文说明请见下方](#中文说明)

A comprehensive, extensible, and type-friendly type and value checking utility for JavaScript/TypeScript.

## Features

- Rich type and value checking: supports primitives, objects, arrays, classes, special values, and more
- Handles edge cases (cross-realm, etc.)
- TypeScript friendly, with type guards
- Extensible and easy to use

## Installation

```bash
npm install whether-is
```

## Usage

```ts
import { UntypedWhether } from 'whether-is';
const whether = new UntypedWhether();

whether.isString('abc'); // true
whether.isNumber(123); // true
whether.isArray([1, 2, 3]); // true
whether.isNullish(undefined); // true
whether.likeDate(new Date()); // true
whether.likePromise(Promise.resolve()); // true
```

## API Highlights

- `isString`, `isNumber`, `isBoolean`, `isNull`, `isUndefined`, `isSymbol`, `isBigInt`
- `isObject`, `likeObject`, `isArray`, `isFunction`, `isClass`, `isArrowFunction`
- `isEmpty`, `isEmptyObject`, `isEmptyArray`, `isNaN`, `isInteger`, `isSafeInteger`, `isSafeNumber`, `isFinite`, `isPrimitive`, `isField`, `isPropertyKey`
- `likeError`, `likeDate`, `likePromise`, `likeSet`, `likeMap`, `likeWeakSet`, `likeWeakMap`, `likeRegExp`
- All `orXXX` methods support optional/undefined values

## Edge Case Handling

- Cross-realm (iframe) objects
- Proxy objects
- Custom class inheritance
- Array-like objects

## License

MIT

---

# 中文说明

一个全面、可扩展、类型友好的 JavaScript/TypeScript 类型和值判定工具库。

## 特性

- 丰富的类型和值判定：支持原始类型、对象、数组、类、特殊值等
- 处理各种边界情况（跨 iframe 等）
- TypeScript 友好，类型守卫
- 可扩展、易用

## 安装

```bash
npm install whether-is
```

## 用法示例

```ts
import { UntypedWhether } from 'whether-is';
const whether = new UntypedWhether();

whether.isString('abc'); // true
whether.isNumber(123); // true
whether.isArray([1, 2, 3]); // true
whether.isNullish(undefined); // true
whether.likeDate(new Date()); // true
whether.likePromise(Promise.resolve()); // true
```

## 主要 API

- `isString`, `isNumber`, `isBoolean`, `isNull`, `isUndefined`, `isSymbol`, `isBigInt`
- `isObject`, `likeObject`, `isArray`, `isFunction`, `isClass`, `isArrowFunction`
- `isEmpty`, `isEmptyObject`, `isEmptyArray`, `isNaN`, `isInteger`, `isSafeInteger`, `isSafeNumber`, `isFinite`, `isPrimitive`, `isField`, `isPropertyKey`
- `likeError`, `likeDate`, `likePromise`, `likeSet`, `likeMap`, `likeWeakSet`, `likeWeakMap`, `likeRegExp`
- 所有 `orXXX` 方法支持可选/undefined 判定

## 边界情况支持

- 跨 iframe（跨全局环境）对象
- Proxy 对象
- 自定义类继承
- 类数组对象

## 许可证

MIT
