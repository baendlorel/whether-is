export function getAllKeys(o: any) {
  let p = Reflect.getPrototypeOf(o);
  const keys = new Set<string | symbol>();
  while (p !== null) {
    Reflect.ownKeys(p).forEach((k) => keys.add(k));
    p = Reflect.getPrototypeOf(p);
  }
  return keys;
}
