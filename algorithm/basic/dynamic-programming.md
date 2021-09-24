# Dynamic Programming

1. extreme value evaluation
2. core of dynamic programming is exhaustion（穷举）: for with state transformation function
3. the exhaustion must contains repeated evaluation: dp table/memoMap
4. dp table sometime contains optimal substructure

- solution: base case - define state - define choice - define the dp table's meaning

```ts
dp[0][0][x] = base
for state1 in state1 range
  for state2 in state2 range
    for state3 in state3 range
      for ....
        dp[state1][state2][state3] = get Extreme (state1,state2,state3)
```

# 509 斐波那契数，通常用 F(n) 表示，形成的序列称为 斐波那契数列 。该数列由 0 和 1 开始，后面的每一项数字都是前面两项数字的和。也就是：

```java
int fib(int N) {
  if(N == 1 || N ==2) return 1;
  return fib(N-1) + fib(N-2);
}
```

- issue:
  1. we need to solve repeated substructure memo (Top-down)

```ts
function fib(target: number): number {
  let memo = new Array[n - 1]();
  let result = 0;
  {
    const memoedCal = n => {
      if (n === 0 || n === 1) return n;
      if (memo[n]) return memo[n];
      memo[n] = memoedCal(n - 1) + memoedCal(n - 2);
      return memo[n];
    };
    result = memoedCal(target);
  }
  return result;
}
```

2. button-up

```ts
function fib(n: number) {
  if (n === 0) return 0;
  const dp = new Array(n + 1);
  dp[0] = 0;
  dp[1] = 1;
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2]; // state transformation function
  }
  return dp[n];
}
```

3. state compression

```ts
function fib(n: number) {
  if (n === 0) return 0;
  if (n === 1 || n === 2) return 1;
  let prev = 1;
  let curr = 1;
  for (let i = 3; i <= n; i++) {
    const sum = prev + curr;
    prev = curr;
    curr = sum;
  }
  return curr;
}
```

# coinChange

- top-down

```ts
const coinChange = (coins: number[], amount: number) => {
  const memo: number[] = new Array(amount + 1);

  const dp = (targetAmount: number) => {
    if (amount === 0) return 0;
    if (amount < 0) return -1;
    if (memo[amount]) {
      return memo[amount];
    }

    let res = Number.MAX_SAFE_INTEGER;
    for (const coin of coins) {
      const numOfCoinAfterReduce = dp(targetAmount - coin);

      if (numOfCoinAfterReduce === -1) continue;

      //numOfCoinAfterReduce + 1 = numOfCoinForTarget
      res = Math.min(res, numOfCoinAfterReduce + 1);
    }
    memo[targetAmount] = res === Number.MAX_SAFE_INTEGER ? -1 : res;
    return res;
  };

  return dp(amount);
};
```

- bottom-up

```ts
const coinChange = (coins: number[], amount: number) => {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let i = 0; i < dp.length; i++) {
    for (const coin of coins) {
      if (i - coin < 0) {
        continue;
      }
      // important
      dp[i] = Math.min(dp[i - coin] + 1, dp[i]);
    }
  }
  return dp[amount] === amount + 1 ? -1 : dp[amount];
};
```

# 300 给你一个整数数组 nums ，找到其中最长严格递增子序列的长度。子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。 - Longest Increment Sequence

- Top down is DFS

- buttom up

```ts
const { max } = Math;
function lengthOfLIS(nums: number[]): number {
  const numLisOfIdxTable = new Array(nums.length).fill(1);
  /*
        '[1,4,3,4,2,3]'
        [1] -> 1, end 1, 1
        [1,4] -> 2, end 4, 2
        [1,4,3] -> 2, end 3, 2
        [1,4,3,4] -> 3, end 4, 3
        [1,4,3,4,2] -> 3 end 2, 3
        [1,4,3,4,2,3] -> 3 end 3, 3
        [1,3,4,5,2,3, num[i]] -> # of lis end num[i], # of lis
        
        initial # of lis end with num[i] = 1

        [1,3,4,5,2,3], num[i] -> 
        j in index of [1,3,4,5,2,3] 

            if(num[j] < num [i]) {
              # of lis end num[i] = max(# of lis of num[i], # of lis of num[j] + 1)
            }
     */
  for (let i = 0; i < nums.length; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        numLisOfIdxTable[i] = max(numLisOfIdxTable[i], numLisOfIdxTable[j] + 1);
      }
    }
  }

  let res = 0;
  for (const numOfLIS of numLisOfIdxTable) {
    res = max(numOfLIS, res);
  }
  return res;
}
```
