// @ts-ignore

(async function () {
  const a = {
    then(resolve: (v: any) => void) {
      resolve('hello');
    },
  };
  const b = await a;
})();

(async () => {
  const a = {
    then(v) {
      return v();
    },
  };
  console.log('a', a);
  const b = await a;
  console.log('b', b);
})();
