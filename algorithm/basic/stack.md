# 7. 整数反转

```ts
// x === 0 we dont get chance to check the boundary
const NEG_NUM_MIN = (Math.pow(-2, 31) / 10) | 0;
const POS_NUM_MAX = ((Math.pow(2, 31) - 1) / 10) | 0;

function reverse(x: number): number {
  let res = 0;
  while (x !== 0) {
    if (res < NEG_NUM_MIN || res > POS_NUM_MAX) {
      return 0;
    }

    const reminder = x % 10;
    // x / 10 to emulate the stack
    // x | 0 to remove the float number
    x = (x / 10) | 0;
    res = res * 10 + reminder;
  }
  return res;
}
```

# 罗马数字转整数

```ts
const DICT = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
};

function romanToInt(s: string): number {
  const stack: number[] = [];
  for (const c of s) {
    if (stack.length) {
      const last = stack[stack.length - 1];
      if (last < DICT[c]) {
        stack.push(DICT[c] - stack.pop());
        continue;
      }
    }
    stack.push(DICT[c]);
  }
  return stack.reduce((sum, curr) => sum + curr);
}
```
