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

# 20. 有效的括号

```
给定一个只包括 '('，')'，'{'，'}'，'['，']' 的字符串 s ，判断字符串是否有效。

有效字符串需满足：

左括号必须用相同类型的右括号闭合。
左括号必须以正确的顺序闭合。
```

```ts
const LEFT_BRACKETS = ['(', '[', '{'];

function isValid(s: string): boolean {
  if (s.length === 1) {
    return false;
  }
  const stack: string[] = [];
  for (let str of s) {
    if (LEFT_BRACKETS.includes(str)) {
      stack.push(str);
      continue;
    }
    if (!isMatch(str, stack.pop())) {
      return false;
    }
  }
  return stack.length === 0;
}

const isMatch = (current: string, tgt: string) => {
  if (current === ')') {
    return tgt === LEFT_BRACKETS[0];
  }
  if (current === ']') {
    return tgt === LEFT_BRACKETS[1];
  }
  if (current === '}') {
    return tgt === LEFT_BRACKETS[2];
  }
  return false;
};
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

# 9. 回文数

```
给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。例如，121 是回文，而 123 不是。

 

示例 1：

输入：x = 121
输出：true
示例 2：

输入：x = -121
输出：false
解释：从左向右读, 为 -121 。 从右向左读, 为 121- 。因此它不是一个回文数。
示例 3：

输入：x = 10
输出：false
解释：从右向左读, 为 01 。因此它不是一个回文数。
示例 4：

输入：x = -101
输出：false

提示：
-231 <= x <= 231 - 1
```

```ts
function isPalindrome(x: number): boolean {
  if (x < 0) {
    return false;
  }
  if (x === 0) {
    return true;
  }
  let origin = x;
  let reversed = 0;

  while (origin > 0) {
    const reminder = origin % 10;
    reversed = reversed * 10 + reminder;
    origin = (origin / 10) | 0;
  }

  return x === reversed;
}
```

# 155. 最小栈

```
设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。

push(x) —— 将元素 x 推入栈中。
pop() —— 删除栈顶的元素。
top() —— 获取栈顶元素。
getMin() —— 检索栈中的最小元素。
```

```ts
class MinStack {
  private min: number[] = [Infinity];
  private list: number[] = [];
  constructor() {}

  push(val: number): void {
    this.list.push(val);
    this.min.push(Math.min(this.min[this.min.length - 1], val));
  }

  pop(): void {
    this.list.pop();
    this.min.pop();
  }

  top(): number {
    return this.list[this.list.length - 1];
  }

  getMin(): number {
    return this.min[this.min.length - 1];
  }
}

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
```

# 151. 翻转字符串里的单词

```
给你一个字符串 s ，逐个翻转字符串中的所有 单词 。

单词 是由非空格字符组成的字符串。s 中使用至少一个空格将字符串中的 单词 分隔开。

请你返回一个翻转 s 中单词顺序并用单个空格相连的字符串。

说明：

输入字符串 s 可以在前面、后面或者单词间包含多余的空格。
翻转后单词间应当仅用一个空格分隔。
翻转后的字符串中不应包含额外的空格。
 

示例 1：

输入：s = "the sky is blue"
输出："blue is sky the"
示例 2：

输入：s = "  hello world  "
输出："world hello"
解释：输入字符串可以在前面或者后面包含多余的空格，但是翻转后的字符不能包括。
示例 3：

输入：s = "a good   example"
输出："example good a"
解释：如果两个单词间有多余的空格，将翻转后单词间的空格减少到只含一个。
示例 4：

输入：s = "  Bob    Loves  Alice   "
输出："Alice Loves Bob"
示例 5：

输入：s = "Alice does not even like bob"
输出："bob like even not does Alice"
 

提示：

1 <= s.length <= 104
s 包含英文大小写字母、数字和空格 ' '
s 中 至少存在一个 单词
 

进阶：

请尝试使用 O(1) 额外空间复杂度的原地解法。
```

```ts
function reverseWords(s: string): string {
  return reverse(s);
}

const reverse = (s: string) => {
  const str = s.trim();
  const stack = [];
  let word = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ' && word !== '') {
      stack.unshift(word);
      word = '';
      continue;
    }

    if (str[i] === ' ' && word == '') {
      continue;
    }
    word += str[i];
  }

  if (word !== '') {
    stack.unshift(word);
  }

  return stack.join(' ');
};
```

# 394. 字符串解码

```
给定一个经过编码的字符串，返回它解码后的字符串。

编码规则为: k[encoded_string]，表示其中方括号内部的 encoded_string 正好重复 k 次。注意 k 保证为正整数。

你可以认为输入字符串总是有效的；输入字符串中没有额外的空格，且输入的方括号总是符合格式要求的。

此外，你可以认为原始数据不包含数字，所有的数字只表示重复的次数 k ，例如不会出现像 3a 或 2[4] 的输入。
```

```ts
function decodeString(s: string): string {
  const timerStack: number[] = [];
  const matcherStack: string[] = [];
  let num = 0;
  let chars = '';
  for (let c of s) {
    if (!isNaN(-c)) {
      num = num * 10 + Number(c);
      continue;
    }
    if (c === '[') {
      matcherStack.push(chars);
      timerStack.push(num);
      num = 0;
      chars = '';
      continue;
    }
    if (c === ']') {
      const num = timerStack.pop();
      chars = matcherStack.pop() + chars.repeat(num);
      continue;
    }
    chars = chars + c;
  }
  return chars;
}
```

# 273. 整数转换英文表示

```
将非负整数 num 转换为其对应的英文表示。
```

```ts
const NUM_MAP = {
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
  13: 'Thirteen',
  14: 'Fourteen',
  15: 'Fifteen',
  16: 'Sixteen',
  17: 'Seventeen',
  18: 'Eighteen',
  19: 'Nineteen',
  20: 'Twenty',
  30: 'Thirty',
  40: 'Forty',
  50: 'Fifty',
  60: 'Sixty',
  70: 'Seventy',
  80: 'Eighty',
  90: 'Ninety'
};

const INCREASE_LIST = ['', ' Thousand ', ' Million ', ' Billion '];

function numberToWords(num: number): string {
  if (!num) {
    return 'Zero';
  }
  let numstr = num + '';
  let unit = 0;
  let res = '';
  const stack = [];
  for (let i = numstr.length - 1; i >= 0; i--) {
    stack.push(numstr[i]);
    if (i === 0 || stack.length === 3) {
      let n = 0;
      let size = stack.length;
      while (size--) {
        const v = stack.pop();
        n = n * 10 + Number(v);
      }
      const str = numToStr(n);
      if (str !== '') {
        res = str + INCREASE_LIST[unit] + res;
      }
      unit++;
    }
  }
  return res.trim();
}

const numToStr = (num: number) => {
  let res = '';
  const h = (num / 100) | 0;
  if (h > 0) {
    const hS = NUM_MAP[h];
    res = hS + ' Hundred';
  }
  num = num % 100;
  if (!num) {
    return res;
  }
  if (num < 20) {
    const s = NUM_MAP[num];
    res = res + ' ' + s;
  } else {
    const l = NUM_MAP[num % 10];
    const h = NUM_MAP[((num / 10) | 0) * 10];
    if (l) {
      res = res + ' ' + h + ' ' + l;
    } else {
      res = res + ' ' + h;
    }
  }

  return res.trim();
};
```
