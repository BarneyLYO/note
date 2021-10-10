# Sliding window

- template

```ts
window can be hashmap or hashset
let left = 0
let right = 0
while (right < s.length) {
  window.add(s[right])
  right++
  while (window need shrink) {
    window.remove(s[left])
    left++
  }
}

// verbose
const slidingWindow = (str:string, tgt:string) => {
  const window = {}
  const need = {}
  for(const c of tgt) {
    need[c] = need[c] ? need[c] ++ : 0
  }

  let left = 0
  let right = 0
  let valid = 0
  while (right < str.length) {
    const c = str[right]
    right++
    // update data in the window
    // ...
    console.log("window", left, right)

    while (window needs shrink) {
      const d = str[left]
      left++
      // .... update the data in the window
    }
  }
}
```

# 76. 最小覆盖子串 给你一个字符串 s 、一个字符串 t 。返回 s 中涵盖 t 所有字符的最小子串。如果 s 中不存在涵盖 t 所有字符的子串，则返回空字符串 "" 。对于 t 中重复字符，我们寻找的子字符串中该字符数量必须不少于 t 中该字符数量。

```ts
type RecordMap = {
  [key: string]: number;
};

function minWindow(s: string, t: string): string {
  if (!t || t.length > s.length) {
    return '';
  }

  const window: RecordMap = Object.create(null);
  const need: RecordMap = t.split('').reduce((container, char) => {
    if (!container[char]) {
      container[char] = 1;
    } else {
      container[char] += 1;
    }
    return container;
  }, Object.create(null));

  // dual pointer for sliding window
  let left = 0;
  let right = 0;

  // num of need[c] === window[c]
  let matchedCharNums = 0;

  // for result
  let start = 0;
  let len = Number.MAX_SAFE_INTEGER;

  while (right < s.length) {
    const char = s[right];
    right++;

    // when the char is what we need
    if (need[char]) {
      if (!window[char]) {
        window[char] = 0;
      }
      // update the window's inner char
      window[char]++;
      /**
                if the window[char] qualified
             */
      if (window[char] === need[char]) {
        matchedCharNums++;
      }
    }

    //check if we need to shrink
    while (matchedCharNums === Object.keys(need).length) {
      const subStrLen = right - left;
      if (subStrLen < len) {
        start = left;
        len = subStrLen;
      }

      const firstInMap = s[left];
      left++;
      if (need[firstInMap]) {
        if (window[firstInMap] === need[firstInMap]) {
          matchedCharNums--;
        }
        window[firstInMap]--;
      }
    }
  }

  if (len === Number.MAX_SAFE_INTEGER) {
    return '';
  }

  return s.substr(start, len);
}
```

# 567. 字符串的排列(permutation) 给你两个字符串 s1 和 s2 ，写一个函数来判断 s2 是否包含 s1 的排列。如果是，返回 true ；否则，返回 false 。换句话说，s1 的排列之一是 s2 的 子串 。

```ts
const ASCII_A_START = 'a'.charCodeAt(0);
const getCode = (char: string) => char.charCodeAt(0) - ASCII_A_START;

function checkInclusion(s1: string, s2: string): boolean {
  if (s1.length > s2.length) {
    return false;
  }
  const window: number[] = new Array(26).fill(0);
  const needs: number[] = new Array(26).fill(0);
  for (const char of s1) {
    const idx = getCode(char);
    needs[idx]++;
  }
  const needsLen = needs.filter(el => el > 0).length;

  let left = 0;
  let right = 0;

  let matchedCharAppearTimeInBothMap = 0;

  while (right < s2.length) {
    const charCode = getCode(s2[right]);
    right++;
    if (needs[charCode]) {
      window[charCode]++;
      if (window[charCode] === needs[charCode]) {
        matchedCharAppearTimeInBothMap++;
      }
    }
    // if the search interval includes the search str
    while (right - left >= s1.length) {
      if (matchedCharAppearTimeInBothMap === needsLen) {
        return true;
      }
      const firstCharCodeInWindow = getCode(s2[left]);
      left++;
      if (needs[firstCharCodeInWindow]) {
        if (window[firstCharCodeInWindow] === needs[firstCharCodeInWindow]) {
          matchedCharAppearTimeInBothMap--;
        }
        window[firstCharCodeInWindow]--;
      }
    }
  }
  return false;
}
```

# 438. 找到字符串中所有字母异位词 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。 异位词 指字母相同，但排列不同的字符串。

```ts
const SMALL_A_CODE = 'a'.charCodeAt(0);
const getCode = (s: string) => s.charCodeAt(0) - SMALL_A_CODE;

function findAnagrams(s: string, p: string): number[] {
  const window = new Array(26).fill(0);
  const needs = new Array(26).fill(0);
  for (const c of p) {
    const idx = getCode(c);
    needs[idx]++;
  }

  const needsLen = needs.filter(el => el > 0).length;
  const res = [];

  let left = 0;
  let right = 0;
  let matchedNumOfChar = 0;

  while (right < s.length) {
    const codeIdx = getCode(s[right]);
    right++;

    if (needs[codeIdx]) {
      window[codeIdx]++;
      if (window[codeIdx] === needs[codeIdx]) {
        matchedNumOfChar++;
      }
    }

    while (right - left >= p.length) {
      if (matchedNumOfChar === needsLen) {
        res.push(left);
      }

      const firstInWindow = getCode(s[left]);
      left++;

      if (needs[firstInWindow]) {
        if (window[firstInWindow] === needs[firstInWindow]) {
          matchedNumOfChar--;
        }
        window[firstInWindow]--;
      }
    }
  }

  return res;
}
```

# 3. 无重复字符的最长子串 给定一个字符串 s ，请你找出其中不含有重复字符的 最长子串 的长度。

```ts
function lengthOfLongestSubstring(s: string): number {
  const filter = new Set<string>(),
    len = s.length;
  let l = 0,
    r = 0,
    max = 0;
  while (r < len) {
    const c = s[r++];
    //sharking
    while (filter.has(c)) {
      filter.delete(s[l++]);
    }
    //expanding
    filter.add(c);
    max = Math.max(max, filter.size);
  }
  return max;
}
```

# 28. 实现 strStr()

```
实现 strStr() 函数。

给你两个字符串 haystack 和 needle ，请你在 haystack 字符串中找出 needle 字符串出现的第一个位置（下标从 0 开始）。如果不存在，则返回  -1 。

说明：
当 needle 是空字符串时，我们应当返回什么值呢？这是一个在面试中很好的问题。
对于本题而言，当 needle 是空字符串时我们应当返回 0 。这与 C 语言的 strstr() 以及 Java 的 indexOf() 定义相符。
```

```ts
function strStr(haystack: string, needle: string): number {
  if (!needle) return 0;
  let startIdx = 0;
  let lenOfWord = 0;
  while (lenOfWord < haystack.length) {
    lenOfWord++;
    if (lenOfWord - startIdx === needle.length) {
      const word = haystack.substring(startIdx, lenOfWord);
      if (word === needle) {
        return startIdx;
      }
    }
    while (lenOfWord - startIdx === needle.length) {
      startIdx++;
    }
  }
  return -1;
}
```

# 771. 宝石与石头

```
给定字符串J 代表石头中宝石的类型，和字符串 S代表你拥有的石头。 S 中每个字符代表了一种你拥有的石头的类型，你想知道你拥有的石头中有多少是宝石。

J 中的字母不重复，J 和 S中的所有字符都是字母。字母区分大小写，因此"a"和"A"是不同类型的石头。
```

```ts
function numJewelsInStones(jewels: string, stones: string): number {
  const needed = Array.from(jewels).reduce((container, char) => {
    container.add(char);
    return container;
  }, new Set<string>());

  let res = 0;
  let runner = 0;
  while (runner < stones.length) {
    if (needed.has(stones[runner])) {
      res++;
    }
    runner++;
  }
  return res;
}
```
