# 最长公共前缀 编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。

```ts
const MAX_LEN = 200;
function longestCommonPrefix(strs: string[]): string {
  const shortest = strs.reduce(
    (len, str) => Math.min(str.length, len),
    MAX_LEN + 1
  );
  let prefix = '';
  for (let i = 0; i < shortest; i++) {
    let common: string;

    for (const str of strs) {
      if (!common) {
        common = str[i];
        continue;
      }

      if (common !== str[i]) {
        return prefix;
      }

      common = str[i];
    }

    prefix = prefix + common;
  }
  return prefix;
}
```

# 202. 快乐数

```
编写一个算法来判断一个数 n 是不是快乐数。

「快乐数」定义为：

对于一个正整数，每一次将该数替换为它每个位置上的数字的平方和。
然后重复这个过程直到这个数变为 1，也可能是 无限循环 但始终变不到 1。
如果 可以变为  1，那么这个数就是快乐数。
如果 n 是快乐数就返回 true ；不是，则返回 false 。
```

```ts
function isHappy(n: number): boolean {
  return isHappy.doCheckIsHappy(new Set<number>(), n);
}

isHappy.doCheckIsHappy = (set: Set<number>, next: number) => {
  let newNum = 0;
  while (next > 0) {
    let current = next % 10;
    newNum = current * current + newNum;
    next = (next / 10) | 0;
  }
  if (set.has(newNum)) {
    return false;
  }
  if (newNum === 1) {
    return true;
  }

  set.add(newNum);

  return isHappy.doCheckIsHappy(set, newNum);
};
```

# 412. Fizz Buzz

```ts
function fizzBuzz(n: number): string[] {
  const res: string[] = [];
  const help = (num: number) => {
    if (num > n) {
      return;
    }
    if (num % 15 === 0) {
      res.push('FizzBuzz');
    } else if (num % 3 === 0) {
      res.push('Fizz');
    } else if (num % 5 === 0) {
      res.push('Buzz');
    } else {
      res.push('' + num);
    }
    help(num + 1);
  };
  help(1);
  return res;
}
```

# 136. 只出现一次的数字

```
给定一个非空整数数组，除了某个元素只出现一次以外，其余每个元素均出现两次。找出那个只出现了一次的元素。

说明：

你的算法应该具有线性时间复杂度。 你可以不使用额外空间来实现吗？

示例 1:

输入: [2,2,1]
输出: 1
示例 2:

输入: [4,1,2,1,2]
输出: 4
```

```ts
function singleNumber(nums: number[]): number {
  return nums.reduce((xor, curr) => xor ^ curr);
}
```

# 190. 颠倒二进制位

```
颠倒给定的 32 位无符号整数的二进制位。

提示：

请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在 示例 2 中，输入表示有符号整数 -3，输出表示有符号整数 -1073741825。
 

示例 1：

输入：n = 00000010100101000001111010011100
输出：964176192 (00111001011110000010100101000000)
解释：输入的二进制串 00000010100101000001111010011100 表示无符号整数 43261596，
     因此返回 964176192，其二进制表示形式为 00111001011110000010100101000000。
示例 2：

输入：n = 11111111111111111111111111111101
输出：3221225471 (10111111111111111111111111111111)
解释：输入的二进制串 11111111111111111111111111111101 表示无符号整数 4294967293，
     因此返回 3221225471 其二进制表示形式为 10111111111111111111111111111111 。
```

```ts
function reverseBits(n: number): number {
  let ans = 0;
  let bits = 32;
  while (bits--) {
    ans = ans << 1;
    ans = ans + (n & 1);
    n = n >> 1;
  }
  return ans >>> 0;
}
```

# 268. 丢失的数字

```
给定一个包含 [0, n] 中 n 个数的数组 nums ，找出 [0, n] 这个范围内没有出现在数组中的那个数。

 

示例 1：

输入：nums = [3,0,1]
输出：2
解释：n = 3，因为有 3 个数字，所以所有的数字都在范围 [0,3] 内。2 是丢失的数字，因为它没有出现在 nums 中。
示例 2：

输入：nums = [0,1]
输出：2
解释：n = 2，因为有 2 个数字，所以所有的数字都在范围 [0,2] 内。2 是丢失的数字，因为它没有出现在 nums 中。
示例 3：

输入：nums = [9,6,4,2,3,5,7,0,1]
输出：8
解释：n = 9，因为有 9 个数字，所以所有的数字都在范围 [0,9] 内。8 是丢失的数字，因为它没有出现在 nums 中。
示例 4：

输入：nums = [0]
输出：1
解释：n = 1，因为有 1 个数字，所以所有的数字都在范围 [0,1] 内。1 是丢失的数字，因为它没有出现在 nums 中。
 

提示：

n == nums.length
1 <= n <= 104
0 <= nums[i] <= n
nums 中的所有数字都 独一无二
```

```ts
function missingNumber(nums: number[]): number {
  return nums.reduce((xor, curr, idx) => xor ^ curr ^ idx, nums.length);
}
```

# 191. 位 1 的个数

```
编写一个函数，输入是一个无符号整数（以二进制串的形式），返回其二进制表达式中数字位数为 '1' 的个数（也被称为汉明重量）。

 

提示：

请注意，在某些语言（如 Java）中，没有无符号整数类型。在这种情况下，输入和输出都将被指定为有符号整数类型，并且不应影响您的实现，因为无论整数是有符号的还是无符号的，其内部的二进制表示形式都是相同的。
在 Java 中，编译器使用二进制补码记法来表示有符号整数。因此，在上面的 示例 3 中，输入表示有符号整数 -3。
 

示例 1：

输入：00000000000000000000000000001011
输出：3
解释：输入的二进制串 00000000000000000000000000001011 中，共有三位为 '1'。
示例 2：

输入：00000000000000000000000010000000
输出：1
解释：输入的二进制串 00000000000000000000000010000000 中，共有一位为 '1'。
示例 3：

输入：11111111111111111111111111111101
输出：31
解释：输入的二进制串 11111111111111111111111111111101 中，共有 31 位为 '1'。
 

提示：

输入必须是长度为 32 的 二进制串 。
 

进阶：

如果多次调用这个函数，你将如何优化你的算法？
```

```ts
function hammingWeight(n: number): number {
  let res = 0;
  for (let i = 0; i < 32; i++) {
    if ((n & (1 << i)) !== 0) {
      res++;
    }
  }
  return res;
}
```

# 204. 计数质数

```
统计所有小于非负整数 n 的质数的数量。
```

```ts
function countPrimes(n: number): number {
  const isPrimes = Array.from({ length: n }).fill(true);
  isPrimes[0] = false;
  isPrimes[1] = false;
  for (let i = 2; i * i < n; i++) {
    if (!isPrimes[i]) {
      continue;
    }

    const next = i * i;
    for (let j = next; j < n; j += i) {
      isPrimes[j] = false;
    }
  }

  return isPrimes.filter(Boolean).length;
}
```
