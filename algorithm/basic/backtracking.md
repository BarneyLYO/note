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
