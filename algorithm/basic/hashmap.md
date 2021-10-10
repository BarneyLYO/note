# 49. 字母异位词分组

```
给你一个字符串数组，请你将 字母异位词 组合在一起。可以按任意顺序返回结果列表。
字母异位词 是由重新排列源单词的字母得到的一个新单词，所有源单词中的字母都恰好只用一次。
```

```ts
function groupAnagrams(strs: string[]): string[][] {
  if (!strs.length) {
    return [];
  }
  const map = new Map<string, string[]>();
  for (let s of strs) {
    const key = groupAnagrams._getKey(s);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(s);
  }
  return [...map.values()];
}

groupAnagrams._getKey = (str: string): string => {
  return str
    .split('')
    .sort()
    .join('');
};
```

# 242. 有效的字母异位词

```
给定两个字符串 s 和 t ，编写一个函数来判断 t 是否是 s 的字母异位词。

注意：若 s 和 t 中每个字符出现的次数都相同，则称 s 和 t 互为字母异位词。

 

示例 1:

输入: s = "anagram", t = "nagaram"
输出: true
示例 2:

输入: s = "rat", t = "car"
输出: false
 

提示:

1 <= s.length, t.length <= 5 * 104
s 和 t 仅包含小写字母
```

```ts
const A_LOWER_CODE = 'a'.charCodeAt(0);

function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) {
    return false;
  }
  const indexedMap = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    const codeS = s[i].charCodeAt(0) - A_LOWER_CODE;
    const codeT = t[i].charCodeAt(0) - A_LOWER_CODE;
    indexedMap[codeS]++;
    indexedMap[codeT]--;
  }
  for (let count of indexedMap) {
    if (count !== 0) {
      return false;
    }
  }
  return true;
}
```

# 387. 字符串中的第一个唯一字符

```
给定一个字符串，找到它的第一个不重复的字符，并返回它的索引。如果不存在，则返回 -1。
示例：
s = "leetcode"
返回 0
s = "loveleetcode"
返回 2
提示：你可以假定该字符串只包含小写字母。
```

```ts
const A_LOWER_CODE = 'a'.charCodeAt(0);
function firstUniqChar(s: string): number {
  if (s.length === 1) {
    return 0;
  }

  const indexedMap = new Array(26).fill(0);
  for (let c of s) {
    const code = c.charCodeAt(0) - A_LOWER_CODE;
    indexedMap[code]++;
  }
  for (let i = 0; i < s.length; i++) {
    const code = s[i].charCodeAt(0) - A_LOWER_CODE;
    if (indexedMap[code] === 1) {
      return i;
    }
  }
  return -1;
}
```

# 12. 整数转罗马数字

```ts
const thousands = ['', 'M', 'MM', 'MMM'];
const hundreds = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

function intToRoman(num: number): string {
  let res = thousands[(num / 1000) | 0];
  num = num % 1000;
  res += hundreds[(num / 100) | 0];
  num = num % 100;
  res += tens[(num / 10) | 0];
  num = num % 10;
  res += ones[num];
  return res;
}
```

# 692. 前 K 个高频单词

```
给一非空的单词列表，返回前 k 个出现次数最多的单词。

返回的答案应该按单词出现频率由高到低排序。如果不同的单词有相同出现频率，按字母顺序排序。

示例 1：

输入: ["i", "love", "leetcode", "i", "love", "coding"], k = 2
输出: ["i", "love"]
解析: "i" 和 "love" 为出现次数最多的两个单词，均为2次。
    注意，按字母顺序 "i" 在 "love" 之前。
 

示例 2：

输入: ["the", "day", "is", "sunny", "the", "the", "the", "sunny", "is", "is"], k = 4
输出: ["the", "is", "sunny", "day"]
解析: "the", "is", "sunny" 和 "day" 是出现次数最多的四个单词，
    出现次数依次为 4, 3, 2 和 1 次。
 

注意：

假定 k 总为有效值， 1 ≤ k ≤ 集合元素数。
输入的单词均由小写字母组成。
```

```ts
function topKFrequent(words: string[], k: number): string[] {
  const map = words.reduce((map, curr) => {
    if (!map.has(curr)) {
      map.set(curr, 0);
    }
    map.set(curr, map.get(curr) + 1);
    return map;
  }, new Map<string, number>());
  const ws = [...map.keys()];
  ws.sort((w1, w2) => {
    const mw1 = map.get(w1);
    const mw2 = map.get(w2);
    if (mw1 === mw2) {
      return w1.localeCompare(w2);
    }
    return mw2 - mw1;
  });
  ws.length = k;
  return ws;
}
```

# 347. 前 K 个高频元素

```
给你一个整数数组 nums 和一个整数 k ，请你返回其中出现频率前 k 高的元素。你可以按 任意顺序 返回答案。

 

示例 1:

输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
示例 2:

输入: nums = [1], k = 1
输出: [1]
 

提示：

1 <= nums.length <= 105
k 的取值范围是 [1, 数组中不相同的元素的个数]
题目数据保证答案唯一，换句话说，数组中前 k 个高频元素的集合是唯一的
```

```ts
function topKFrequent(nums: number[], k: number): number[] {
  const map = nums.reduce(frequencyReducer, new Map());
  const keys = [...map.keys()];
  keys.sort(keyOrder(map));
  keys.length = k;
  return keys;
}

const frequencyReducer = (map: Map<number, number>, curr: number) => {
  if (!map.has(curr)) {
    map.set(curr, 0);
  }
  map.set(curr, map.get(curr) + 1);
  return map;
};

const keyOrder = (map: Map<number, number>) => (a1: number, b1: number) => {
  return map.get(b1) - map.get(a1);
};
```

# 41. 缺失的第一个正数

```
给你一个未排序的整数数组 nums ，请你找出其中没有出现的最小的正整数。

请你实现时间复杂度为 O(n) 并且只使用常数级别额外空间的解决方案。
 

示例 1：

输入：nums = [1,2,0]
输出：3
示例 2：

输入：nums = [3,4,-1,1]
输出：2
示例 3：

输入：nums = [7,8,9,11,12]
输出：1
 

提示：

1 <= nums.length <= 5 * 105
-231 <= nums[i] <= 231 - 1
```

```ts
function firstMissingPositive(nums: number[]): number {
  const len = nums.length;
  for (let i = 0; i < len; i++) {
    while (nums[i] > 0 && nums[i] <= len && nums[nums[i] - 1] != nums[i]) {
      const idx: number = nums[i] - 1;
      [nums[idx], nums[i]] = [nums[i], nums[idx]];
    }
  }

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] !== i + 1) {
      return i + 1;
    }
  }
  return len + 1;
}
```

# 706. 设计哈希映射

```ts
type Pair = [key:number,value:number]
class MyHashMap {
    private list:Pair[][] = Array.from({length: 769}, () => [])

    private static _hash(key:number): number {
        return key % 769
    }

    private _getSlot(key:number) {
        const {_hash} = MyHashMap
        const idx = _hash(key)
        return this.list[idx]
    }

    put(key: number, value: number): void {
        const slot = this._getSlot(key)
        for(let i = 0; i < slot.length;i++) {
            if(slot[i][0] === key) {
                slot[i][1] = value
                return
            }
        }
        slot.push([key,value])
    }

    get(key: number): number {
        const slot = this._getSlot(key)
        if(!slot.length) {
            return -1
        }
        for(let i = 0; i < slot.length;i++) {
            if(slot[i][0] === key) {
                return slot[i][1]
            }
        }
        return -1
    }

    remove(key: number): void {
        const idx = MyHashMap._hash(key)
        const slot = this.list[idx]
        if(!slot.length) return
        let found = -1
        for(let i = 0; i < slot.length;i++) {
            if(slot[i][0] === key) {
                found = i
                break
            }
        }

        if(found !== -1){
            ;[slot[found], slot[slot.length - 1]] = [slot[slot.length - 1], slot[found]]
            slot.length--
        }
    }
}

/**
 * Your MyHashMap object will be instantiated and called as such:
 * var obj = new MyHashMap()
 * obj.put(key,value)
 * var param_2 = obj.get(key)
 * obj.remove(key)
 */
```
