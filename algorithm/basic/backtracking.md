# Backtrack

- Decision Tree pending
  1. define path
  2. choose list
  3. ending condition
- template

```ts
  let res = []
  const backtrack(path, choose_list) {
    if(ending_condition) {
      res.push(path)
      return
    }
    for(choice in choose list) {
      make decision
      backtrack(path, choose_list)
      cancel the decision
    }
  }
```

- 46 给定一个不含重复数字的数组 nums, 返回其所有可能的全排列。你可以按任意顺序返回答案。

```ts
function permute(nums: number[]): number[][] {
  const permuteList: Array<number[]> = [];
  {
    // set in js is iteratable by insert order
    const backtrack = (choices: number[], track: Set<number>): void => {
      if (track.size === nums.length) {
        permuteList.push([...track]);
        return;
      }

      for (let choice of choices) {
        if (track.has(choice)) {
          continue;
        }

        track.add(choice);
        backtrack(choices, track);
        track.delete(choice);
      }
    };

    backtrack(nums, new Set());
  }

  return permuteList;
}
```

# 电话号码的字母组合 给定一个仅包含数字 2-9 的字符串，返回所有它能表示的字母组合。答案可以按 任意顺序 返回。

```ts
const DICT = new Map([
  ['2', 'abc'],
  ['3', 'def'],
  ['4', 'ghi'],
  ['5', 'jkl'],
  ['6', 'mno'],
  ['7', 'pqrs'],
  ['8', 'tuv'],
  ['9', 'wxyz']
]);

function letterCombinations(digits: string): string[] {
  const res = [];
  if (!digits) {
    return res;
  }

  const maxLen = digits.length;
  const options = digits.split('').map(d => DICT.get(d));

  {
    const backtrack = (currentOrder: number, word: string) => {
      if (word.length === maxLen) {
        res.push(word);
        return;
      }
      const avails = options[currentOrder];
      for (const c of avails) {
        const newWord = word + c;
        backtrack(currentOrder + 1, newWord);
      }
    };
    backtrack(0, '');
  }

  return res;
}
```

# 322 给你一个整数数组 coins，表示不同面额的硬币, 以及一个整数 amount，表示总金额。计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回  -1 。你可以认为每种硬币的数量是无限的。暴力解

```ts
const { MAX_SAFE_INTEGER: BIGGEST } = Number;
function coinChange(coins: number[], amount: number): number {
  const solutionMap: Map<number, number> = new Map();

  const topdown = (target: number) => {
    if (target === 0) return 0;
    if (target < 0) return -1; // no answer
    if (solutionMap.has(target)) {
      return solutionMap.get(target);
    }

    let result = BIGGEST;
    // n-tiers tree iterate
    for (const coin of coins) {
      const targetAfterReduce = target - coin;

      const numOfCoinsAfterReduce = topdown(targetAfterReduce);

      if (numOfCoinsAfterReduce === -1) continue;

      // 1 + numOfCoinsAfterReduce(target - coin) = numOfCoinsFor(target)
      result = Math.min(result, 1 + numOfCoinsAfterReduce);
    }

    result = result === BIGGEST ? -1 : result;
    solutionMap.set(target, result);
    return result;
  };

  return topdown(amount);
}
```

# 全排列, backtrack

```ts
let result: Array<number[]> = [];
function backtrack(nums: number[], track: Array<number>) {
  if (track.length === nums.lenght) {
    result.push([...track]);
  }

  for (let i = 0; i < nums.length; i++) {
    if (track.indexOf(nums[i]) !== -1) {
      continue;
    }
    track.push(nums[i]);
    backtrack(nums, track);
    track.pop();
  }
}
```

# 139. 单词拆分

```
给定一个非空字符串 s 和一个包含非空单词的列表 wordDict，判定 s 是否可以被空格拆分为一个或多个在字典中出现的单词。

说明：

拆分时可以重复使用字典中的单词。
你可以假设字典中没有重复的单词。
示例 1：

输入: s = "leetcode", wordDict = ["leet", "code"]
输出: true
解释: 返回 true 因为 "leetcode" 可以被拆分成 "leet code"。
示例 2：

输入: s = "applepenapple", wordDict = ["apple", "pen"]
输出: true
解释: 返回 true 因为 "applepenapple" 可以被拆分成 "apple pen apple"。
     注意你可以重复使用字典中的单词。
示例 3：

输入: s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
输出: false
```

```ts
function wordBreak(s: string, wordDict: string[]): boolean {
  const falseSet = new Set<number>();

  const backtracking = (start: number) => {
    if (start === s.length) {
      return true;
    }
    if (falseSet.has(start)) {
      return false;
    }
    for (let end = start + 1; end <= s.length; end++) {
      const sub = s.slice(start, end);
      if (wordDict.includes(sub) && backtracking(end)) {
        return true;
      }
    }
    falseSet.add(start);
    return false;
  };

  return backtracking(0);
}
```

# 140. 单词拆分 II

```
给定一个非空字符串 s 和一个包含非空单词列表的字典 wordDict，在字符串中增加空格来构建一个句子，使得句子中所有的单词都在词典中。返回所有这些可能的句子。

说明：

分隔时可以重复使用字典中的单词。
你可以假设字典中没有重复的单词。
示例 1：

输入:
s = "catsanddog"
wordDict = ["cat", "cats", "and", "sand", "dog"]
输出:
[
  "cats and dog",
  "cat sand dog"
]
示例 2：

输入:
s = "pineapplepenapple"
wordDict = ["apple", "pen", "applepen", "pine", "pineapple"]
输出:
[
  "pine apple pen apple",
  "pineapple pen apple",
  "pine applepen apple"
]
解释: 注意你可以重复使用字典中的单词。
示例 3：

输入:
s = "catsandog"
wordDict = ["cats", "dog", "sand", "and", "cat"]
输出:
[]
```

```ts
function wordBreak(s: string, wordDict: string[]): string[] {
  const res: string[] = [];
  {
    const inList = (str: string) => {
      return wordDict.indexOf(str) !== -1;
    };

    const backtrack = (container: string[], start: number) => {
      if (start >= s.length) {
        res.push(container.join(' '));
        return;
      }

      for (let i = start; i < s.length; i++) {
        const word = s.substring(start, i + 1);
        if (!inList(word)) {
          continue;
        }

        container.push(word);
        backtrack(container, i + 1);
        container.pop();
      }
    };

    backtrack([], 0);
  }
  return res;
}
```

# 22. 括号生成

```
数字 n 代表生成括号的对数，请你设计一个函数，用于能够生成所有可能的并且 有效的 括号组合。
有效括号组合需满足：左括号必须以正确的顺序闭合。
```

```ts
function generateParenthesis(n: number): string[] {
  // num '(' === num ')' === n

  const ans: string[] = [];
  {
    const backtracking = (
      parenthesis: string,
      numOfLeft: number,
      numOfRight: number
    ) => {
      if (parenthesis.length === n * 2) {
        ans.push(parenthesis);
        return;
      }

      if (numOfLeft < n) {
        backtracking(parenthesis + '(', numOfLeft + 1, numOfRight);
      }

      if (numOfRight < numOfLeft) {
        backtracking(parenthesis + ')', numOfLeft, numOfRight + 1);
      }
    };

    backtracking('', 0, 0);
  }
  return ans;
}
```

# 39. 组合总和

```
给定一个无重复元素的正整数数组 candidates 和一个正整数 target ，找出 candidates 中所有可以使数字和为目标数 target 的唯一组合。

candidates 中的数字可以无限制重复被选取。如果至少一个所选数字数量不同，则两种组合是唯一的。 

对于给定的输入，保证和为 target 的唯一组合数少于 150 个。

 

示例 1：

输入: candidates = [2,3,6,7], target = 7
输出: [[7],[2,2,3]]
示例 2：

输入: candidates = [2,3,5], target = 8
输出: [[2,2,2,2],[2,3,3],[3,5]]
示例 3：

输入: candidates = [2], target = 1
输出: []
示例 4：

输入: candidates = [1], target = 1
输出: [[1]]
示例 5：

输入: candidates = [1], target = 2
输出: [[1,1]]
 

提示：

1 <= candidates.length <= 30
1 <= candidates[i] <= 200
candidate 中的每个元素都是独一无二的。
1 <= target <= 500
```

```ts
function combinationSum(candidates: number[], target: number): number[][] {
  const res = [];
  candidates.sort((a, b) => a - b);
  {
    const backtracking = (container: number[], t: number, startIdx: number) => {
      if (t < 0) {
        return;
      }
      if (t === 0) {
        res.push([...container]);
        return;
      }

      for (let i = startIdx; i < candidates.length; i++) {
        const nextTarget = t - candidates[i];
        //candidate is already sorted
        if (nextTarget < 0) {
          break;
        }
        container.push(candidates[i]);
        backtracking(container, nextTarget, i);
        container.pop();
      }
    };

    backtracking([], target, 0);
  }
  return res;
}
```

# 78. 子集

```
给你一个整数数组 nums ，数组中的元素 互不相同 。返回该数组所有可能的子集（幂集）。

解集 不能 包含重复的子集。你可以按 任意顺序 返回解集。
```

```ts
function subsets(nums: number[]): number[][] {
  let res: number[][] = [];

  {
    const backtracking = (idx: number, set: Set<number>) => {
      res.push([...set]);
      for (let i = idx; i < nums.length; i++) {
        if (set.has(nums[i])) {
          continue;
        }
        set.add(nums[i]);
        backtracking(i + 1, set);
        set.delete(nums[i]);
      }
    };
    backtracking(0, new Set<number>());
  }
  return res;
}
```
