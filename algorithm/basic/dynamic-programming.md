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

# 买卖股票的最佳时机

```
给定一个整数数组 prices ，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。
设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。
注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
```

- 穷举框架

```ts
for (let state1 of stateList)
  for (let state2 of state2List)
    for (let state3 of state3List)
      dp[state1][state2][state3] = optimal(option1, option2, option3);
```

- think

```
day of i, made k deals, 1 === has stock, 0 === no stock
dp[i][k][0 or 1]
dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][0] + price[i])
dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - price[i])

dp[-1][k][0] = 0
dp[-1][k][1] = -infinity
dp[i][0][0] = 0
dp[i][0][1] = -infinity
```

# 121. 买卖股票的最佳时机

```
给定一个数组 prices ，它的第 i 个元素 prices[i] 表示一支给定股票第 i 天的价格。

你只能选择 某一天 买入这只股票，并选择在 未来的某一个不同的日子 卖出该股票。设计一个算法来计算你所能获取的最大利润。

返回你可以从这笔交易中获取的最大利润。如果你不能获取任何利润，返回 0 。
```

```ts
function maxProfit(prices: number[]): number {
  const len = prices.length;
  //dp[i][k][1] = i day max profit with stock, with k transcation times left
  //dp[i][k][0] = i day max profit with no stock, with k transcation times left
  //dp[i][k][1] = max(dp[i - 1][k][1], dp[i - 1][k - 1][0] - prices[i])
  //dp[i][k][0] = max(dp[i - 1][k][0], dp[i - 1][k][1] + prices[i])
  //dp[i][1][1] = max(dp[i - 1][1][1], dp[i - 1][0][0] - prices[i])
  //            = max(dp[i-1][i][1], -prices[i]) //dp[i - 1][0][0] == 0
  let dpI0 = 0;
  let dpI1 = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < len; i++) {
    dpI0 = Math.max(dpI0, dpI1 + prices[i]);
    dpI1 = Math.max(dpI1, -prices[i]);
  }
  return dpI0;
}
```

# 122. 买卖股票的最佳时机 II

```
给定一个数组 prices ，其中 prices[i] 是一支给定股票第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
```

```ts
function maxProfit(prices: number[]): number {
  //profit[i][k][1] = i day k trans left with stock in hand
  //profit[i][k][0] = i day k trans left without stock in hand
  /*
        profit[i][k][1] = max (
            profit[i - 1][k][1],
            profit[i - 1][k - 1][0] - prices[i] 
        )
        profit[i][k][0] = max (
            profit[i - 1][k][0]
            profit[i - 1][k][1] + prices[i]
        )
        k = infinity => k === k - 1 === meaningless
        profit[i][1] = max (
            profit[i - 1][1],
            profit[i - 1][0] - prices[i]
        )
        profit[i][0] = max (
            profit[i - 1][0],
            profit[i - 1][1] + prices[i]
        )
        profitI1 = max(
            profitI1, // before
            profitI0 - prices[i]
        )
        profitI0 = max (
            profitI0, 
            profitI1 + prices[i]
        )
     */

  let profitI0 = 0;
  let profitI1 = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < prices.length; i++) {
    const temp = profitI0;
    profitI0 = Math.max(profitI0, profitI1 + prices[i]);
    profitI1 = Math.max(profitI1, temp - prices[i]);
  }

  return profitI0;
}
```

# 123. 买卖股票的最佳时机 III

```
给定一个数组，它的第 i 个元素是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 两笔 交易。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
```

```ts
const max = Math.max;
function maxProfit(prices: number[]): number {
  /*
    profit[i][k][1] = i day, k trans made, with stock
    profit[i][k][0] = i day, k trans made, without stock
    profit[i][k][1] = max (
        profit[i][k][1],
        profit[i][k - 1][0] - prices[i]
    )
    profit[i][k][0] = max (
        profit[i][k][0],
        profit[i][k][1] + prices[i]
    )

    k = 1 or 2, k = 0, everything is meaningless
    profit[i][2][0] = max (
        profit[i][2][0],
        profit[i][2][1] + prices[i]
    )
    profit[i][2][1] = max (
        profit[i][2][1],
        profit[i][1][0] - prices[i]
    )
    profit[i][1][0] = max (
        profit[i][1][0],
        profit[i][1][1] + prices[i]
    )
    profit[i][1][1] = max (
        profit[i][1][1],
        profit[i][0][0] - prices[i] // profit[i][0][0] = 0
    )

    base: 
    profit[-1][2][0] = 0
    profit[-1][2][1] = -infitity
    profit[-1][1][0] = 0
    profit[-1][1][1] = -infinity
 */
  let profitI20 = 0;
  let profitI21 = Number.MIN_SAFE_INTEGER;
  let profitI10 = 0;
  let profitI11 = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < prices.length; i++) {
    profitI20 = max(profitI20, profitI21 + prices[i]);
    profitI21 = max(profitI21, profitI10 - prices[i]);
    profitI10 = max(profitI10, profitI11 + prices[i]);
    profitI11 = max(profitI11, 0 - prices[i]);
  }

  return profitI20;
}
```

# 188. 买卖股票的最佳时机 IV

```
给定一个整数数组 prices ，它的第 i 个元素 prices[i] 是一支给定的股票在第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你最多可以完成 k 笔交易。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
```

```ts
const max = Math.max;
function maxProfit(maxTrans: number, prices: number[]): number {
  if (!prices.length) return 0;

  /*
        [i][k][1] i day, made k trans, with stock 
        [i][k][0] i day, made k trans, with stock
        [i][k][1] = max (
            [i - 1][k][1],
            [i - 1][k - 1][0] - prices[i]
        )
        [i][k][0] = max (
            [i - 1][k][0],
            [i - 1][k][1] + prices[i]
        )
        base: 
        [0][0][0] = 0
        [0][0][1] = -infinity
     */
  let n = prices.length;

  let profits: number[][][] = new Array(n);
  for (let i = 0; i < profits.length; i++) {
    const transTable = new Array(maxTrans + 1);
    for (let j = 0; j <= maxTrans; j++) {
      transTable[j] = [0, 0];
    }
    profits[i] = transTable;
  }

  for (let i = 0; i <= maxTrans; i++) {
    profits[0][i][1] = -prices[0];
  }

  for (let i = 1; i < n; i++) {
    for (let k = 1; k <= maxTrans; k++) {
      profits[i][k][0] = max(
        profits[i - 1][k][0],
        profits[i - 1][k][1] + prices[i]
      );

      profits[i][k][1] = max(
        profits[i - 1][k][1],
        profits[i - 1][k - 1][0] - prices[i]
      );
    }
  }

  return profits[n - 1][maxTrans][0];
}
```

# 309. 最佳买卖股票时机含冷冻期

```
给定一个整数数组，其中第 i 个元素代表了第 i 天的股票价格 。​

设计一个算法计算出最大利润。在满足以下约束条件下，你可以尽可能地完成更多的交易（多次买卖一支股票）:

你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。
卖出股票后，你无法在第二天买入股票 (即冷冻期为 1 天)。
```

```ts
const max = Math.max;
function maxProfit(prices: number[]): number {
  /*
        profit[i][1] = i day, with stock
        profit[i][0] = i day, without stock 
        profit[i][1] = max (
            profit[i - 1][1]
            profit[i - 2][0] - prices[i] // you can only buy stock after cooldown 
        )
        profit[i][1] depends on profit[i - 1][1] and profit[i - 2][0]
        profit[i][0] = max (
            profit[i - 1][0],
            profit[i - 1][1] + prices[i]
        )
        profit[i][0] depends on profit[i - 1][0], profit[i - 1][1]
     */

  let n = prices.length;
  let profitI0 = 0;
  let profitI1 = Number.MIN_SAFE_INTEGER;
  let profitLastTrans = 0; //profit[i - 2][0]
  for (let i = 0; i < n; i++) {
    let temp = profitI0;
    profitI0 = max(profitI0, profitI1 + prices[i]);
    profitI1 = max(profitI1, profitLastTrans - prices[i]);
    profitLastTrans = temp;
  }
  return profitI0;
}
```

# 714. 买卖股票的最佳时机含手续费

```
给定一个整数数组 prices，其中第 i 个元素代表了第 i 天的股票价格 ；整数 fee 代表了交易股票的手续费用。

你可以无限次地完成交易，但是你每笔交易都需要付手续费。如果你已经购买了一个股票，在卖出它之前你就不能再继续购买股票了。

返回获得利润的最大值。

注意：这里的一笔交易指买入持有并卖出股票的整个过程，每笔交易你只需要为支付一次手续费。
```

```ts
const max = Math.max;
function maxProfit(prices: number[], fee: number): number {
  /*
        profit[i][1] = max (
            profit[i - 1][1],
            profit[i - 1][0] - prices[i] - fee
        )
        profit[i][1] depends on profit[i - 1][1](self) and profit[i - 1][0]
        profit[i][0] = max (
            profit[i - 1][0],
            profit[i - 1][1] + prices[i]
        )
        profit[i][0] depends on profit[i - 1][0](self) and profit[i - 1][1]
     */

  let n = prices.length;
  let profitI0 = 0;
  let profitI1 = Number.MIN_SAFE_INTEGER;
  for (let i = 0; i < n; i++) {
    const temp = profitI0;
    profitI0 = max(profitI0, profitI1 + prices[i]);
    profitI1 = max(profitI1, temp - prices[i] - fee);
  }

  return profitI0;
}
```

# 最长回文子串

```
给你一个字符串 s，找到 s 中最长的回文子串。
```

## 暴力

```ts
function longestPalindrome(s: string): string {
    if(s.length === 1) {
        return s
    }
    let startEndIdxs:[start: number, end: number] = [0,0]
    for(let i = 0; i < s.length - 1; i++) {
        for(let j = i + 1; j< s.length; j++) {
            const len = j - i + 1
            const lastLen = startEndIdxs[1] - startEndIdxs[0] + 1
            if(lastLen >= len) {
                continue
            }
            const isPalindrome = longestPalindrome.isPalindrome(s,i,j)
            if(isPalindrome) {
                startEndIdxs = [i, j]
            }
        }
    }

    return s.substring(
        startEndIdxs[0],
        startEndIdxs[1] + 1
    )
};

longestPalindrome.isPalindrome = (
    str:string,
    start:number,
    end:number
) => {
    if(start > end) {
        return false
    }
    while(start < end) {
        if(str[start] !== str[end]) {
            return false
        }
        start++
        end--
    }
    return true
}
```

## Dynamic programming

```ts
function longestPalindrome(s: string): string {
   /*
      p[0][1] = ba = F
      p[0][2] = bab
      p[0][3] = baba
      p[0][4] = babad
      p[1][2] = ab
      p[1][3] = aba
      p[1][4] = abad
      p[2][3] = ba
      p[2][4] = bab
      |-|0|1|2|3|4|
      |0|T|F|T|F|F|
      |1|N|T|F|T|F|
      |2|N|N|T|F|T|
      |3|N|N|N|T|F|
      |4|N|N|N|N|T|
      dp[i][j] = dp[i+1][j-1] && s[i] === s[j]
    */
    const len = s.length
    const dp:boolean[][] = new Array(len)
    for(let i = 0; i < len; i++) {
        const arr = new Array(len).fill(false)
        dp[i] = arr
    }

    let startEndIdx:[start:number, end:number] = [0,0]
    for(let numChar = 0; numChar < len; numChar++) {
        for(let start = 0; start + numChar < len; start++) {
            const end = start + numChar

            if(numChar === 0) {
                dp[start][end] = true
            } else if(numChar === 1) {
                dp[start][end] = s[start] === s[end]
            } else {
                dp[start][end] = (
                    dp[start + 1][end - 1]
                    && s[start] === s[end]
                )
            }

            const len = end - start + 1
            const preLen = startEndIdx[1] - startEndIdx[0] + 1
            if(dp[start][end] && len > preLen) {
                startEndIdx = [start, end]
            }
        }
    }

    return s.substring(startEndIdx[0], startEndIdx[1] + 1)
};

function bruteforce (s:string) : string {
     if(s.length === 1) {
        return s
    }
    let startEndIdxs:[start: number, end: number] = [0,0]
    for(let i = 0; i < s.length - 1; i++) {
        for(let j = i + 1; j< s.length; j++) {
            const len = j - i + 1
            const lastLen = startEndIdxs[1] - startEndIdxs[0] + 1
            if(lastLen >= len) {
                continue
            }
            const isPalindrome = longestPalindrome.isPalindrome(s,i,j)
            if(isPalindrome) {
                startEndIdxs = [i, j]
            }
        }
    }

    return s.substring(
        startEndIdxs[0],
        startEndIdxs[1] + 1
    )
}

longestPalindrome.isPalindrome = (
    str:string,
    start:number,
    end:number
) => {
    if(start > end) {
        return false
    }
    while(start < end) {
        if(str[start] !== str[end]) {
            return false
        }
        start++
        end--
    }
    return true
}
```

# 403. 青蛙过河

```
一只青蛙想要过河。 假定河流被等分为若干个单元格，并且在每一个单元格内都有可能放有一块石子（也有可能没有）。 青蛙可以跳上石子，但是不可以跳入水中。

给你石子的位置列表 stones（用单元格序号 升序 表示）， 请判定青蛙能否成功过河（即能否在最后一步跳至最后一块石子上）。

开始时， 青蛙默认已站在第一块石子上，并可以假定它第一步只能跳跃一个单位（即只能从单元格 1 跳至单元格 2 ）。

如果青蛙上一步跳跃了 k 个单位，那么它接下来的跳跃距离只能选择为 k - 1、k 或 k + 1 个单位。 另请注意，青蛙只能向前方（终点的方向）跳跃。

 

示例 1：

输入：stones = [0,1,3,5,6,8,12,17]
输出：true
解释：青蛙可以成功过河，按照如下方案跳跃：跳 1 个单位到第 2 块石子, 然后跳 2 个单位到第 3 块石子, 接着 跳 2 个单位到第 4 块石子, 然后跳 3 个单位到第 6 块石子, 跳 4 个单位到第 7 块石子, 最后，跳 5 个单位到第 8 个石子（即最后一块石子）。
示例 2：

输入：stones = [0,1,2,3,4,8,9,11]
输出：false
解释：这是因为第 5 和第 6 个石子之间的间距太大，没有可选的方案供青蛙跳跃过去。

提示：

2 <= stones.length <= 2000
0 <= stones[i] <= 231 - 1
stones[0] == 0
```

```ts
/*
    [0,1,3,5,6,8,12,17]
    l|s|x|s|x|s|s|x|s|x|x|x|s|x|x|x|x|s|
    => 
    if the frog at stone i, can reach stone after it 
    to reach stone after it, stone[i:] - stone[i] in range [k-1, k+1]
    stone[i:] - stone[i] = gap 
    if gap > k+1, the frog can never reach stone[i:]
    if gap < k - 1, the frog maybe can reach stone after stone[i:] 
    if k - 1 <= gap <= k+1, the frog can reach exactly stone[i:]
    
    if frog is currently in store[idx], and jumped last stone with gap 
    if(idx === stones.length - 1) {
        already reach to the end
    }
    
    for(let current = idx + 1; current < stones.length; current++) {
        const gap = stone[current] - stone[idx]
        if(gap in range [k-1, k+1]) {
            check current+1, gap
        } else if(gap < k - 1) {
            we can reach further 
            contin
        } else if(gap > k + 1) {
            never 
            break
        }
    }

    //never reach to the end
 */

function canCross(stones: number[]): boolean {
  const failedSet = new Set<string>(); // we check id - gap
  return canCross._doCanCross(stones, failedSet, 0, 0);
}

canCross._doCanCross = (
  stones: number[],
  failedSet: Set<string>,
  idx: number,
  lastGap: number
) => {
  if (idx === stones.length - 1) {
    return true;
  }
  const key = idx + '-' + lastGap;
  if (failedSet.has(key)) {
    return false;
  }
  for (let current = idx + 1; current < stones.length; current++) {
    const gap = stones[current] - stones[idx];
    if (gap >= lastGap - 1 && gap <= lastGap + 1) {
      //reach the current, dfs till the end of stone
      if (canCross._doCanCross(stones, failedSet, current, gap)) {
        return true;
      }
    } else if (gap < lastGap - 1) {
      // frog can jump further
      continue;
    } else if (gap > lastGap + 1) {
      // never gonna happen
      break;
    }
  }

  failedSet.add(key);
  return false;
};
```

# 70. 爬楼梯

```
假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

注意：给定 n 是一个正整数。

示例 1：

输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1.  1 阶 + 1 阶
2.  2 阶
示例 2：

输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶
```

```ts
function climbStairs(n: number): number {
  // to n,count  to n
  // to 1 count  = 1 (1)
  // to 2 count  = 2 (1+1, 2)
  // to 3 count  = 3 (1+1+1, 2+ 1, 1+2)
  // to 4 count  = 5 (1+1+1+1, 1+2+1, 1+1+2, 2+1+1,2+2 )
  // to n count = count(n - 1) + count(n - 2)
  return memoedCount(new Array(n + 1), n);
}
const memoedCount = (memo: number[], n: number) => {
  if (n === 1) {
    return 1;
  }
  if (n === 2) {
    return 2;
  }
  if (memo[n]) {
    return memo[n];
  }
  const count = memoedCount(memo, n - 1) + memoedCount(memo, n - 2);
  memo[n] = count;
  return count;
};
```

# 198. 打家劫舍

```
你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。
```

```ts
function rob(nums: number[]): number {
  /*
        [
            [1,1,1], 1st house, with money 1 ,max can get 1
            [2,2,2], 2nd house, with money 2 ,max can get 2
            [3,3,3], 3rd house, with money 3 ,max can get 4
            [4,1,1], 4th house, with money 1 ,max can get 1
            [5,k,?]
        ]
        [5,k,?]= Math.max(
            [4,1,1],
            [3,3 + k,3]
        )

        => 
        profit[0] = nums[0]
        profit[1] = Math.max(
            nums[0],
            nums[1]
        )

        profit[i] = Math.max(
            profit[i - 2] + nums[i],
            profit[i - 1]
        )
     */
  if (!nums.length) {
    return 0;
  }

  if (nums.length === 1) {
    return nums[0];
  }

  if (nums.length === 2) {
    return Math.max(nums[0], nums[1]);
  }

  const table = new Array(nums.length).fill(0);
  table[0] = nums[0];
  table[1] = Math.max(nums[0], nums[1]);

  for (let i = 2; i < nums.length; i++) {
    table[i] = Math.max(table[i - 1], table[i - 2] + nums[i]);
  }

  return table[table.length - 1];
}
```

# 62. 不同路径

```
一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 “Start” ）。

机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 “Finish” ）。

问总共有多少条不同的路径？
```

```ts
function uniquePaths(m: number, n: number): number {
  /*
        p[x][y] = num of path to x,y
        p[x][y] = p[x - 1][y] + p[x][y - 1]
        p[1][1] = p[0][1] + p[1][0]
        p[x][0] = 1
        p[0][y] = 1
     */
  const p: number[][] = Array.from({ length: m }, () =>
    Array.from({ length: n })
  );
  p[0][0] = 1;
  for (let r = 1; r < m; r++) {
    p[r][0] = 1;
  }
  for (let c = 1; c < n; c++) {
    p[0][c] = 1;
  }
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      p[r][c] = p[r - 1][c] + p[r][c - 1];
    }
  }

  return p[m - 1][n - 1];
}
```

# 剑指 Offer 10- II. 青蛙跳台阶问题

```
一只青蛙一次可以跳上1级台阶，也可以跳上2级台阶。求该青蛙跳上一个 n 级的台阶总共有多少种跳法。

答案需要取模 1e9+7（1000000007），如计算初始结果为：1000000008，请返回 1。

示例 1：

输入：n = 2
输出：2
示例 2：

输入：n = 7
输出：21
示例 3：

输入：n = 0
输出：1
提示：

0 <= n <= 100
```

```ts
function numWays(n: number): number {
  if (!n || n === 1) {
    return 1;
  }
  let pre = 1;
  let before = 2;
  for (let i = 3; i <= n; i++) {
    let sum = (pre + before) % 1000000007;
    pre = before;
    before = sum;
  }
  return before;
}
```

# 221. 最大正方形

```
在一个由 '0' 和 '1' 组成的二维矩阵内，找到只包含 '1' 的最大正方形，并返回其面积。
```

```ts
function maximalSquare(matrix: string[][]): number {
  const numOfSizeOfSquare = Array.from({ length: matrix.length + 1 }, () =>
    new Array(matrix[0].length + 1).fill(0)
  );

  for (let r = 0; r < numOfSizeOfSquare.length; r++) {
    numOfSizeOfSquare[r][0] = 0;
  }

  for (let c = 0; c < numOfSizeOfSquare[0].length; c++) {
    numOfSizeOfSquare[0][c] = 0;
  }

  let maxSize = numOfSizeOfSquare[0][0];

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (matrix[r][c] !== '1') {
        continue;
      }
      numOfSizeOfSquare[r + 1][c + 1] =
        Math.min(
          numOfSizeOfSquare[r][c],
          numOfSizeOfSquare[r][c + 1],
          numOfSizeOfSquare[r + 1][c]
        ) + 1;
      maxSize = Math.max(numOfSizeOfSquare[r + 1][c + 1], maxSize);
    }
  }

  return maxSize * maxSize;
}
```

# 118. 杨辉三角

```
给定一个非负整数 numRows，生成「杨辉三角」的前 numRows 行。

在「杨辉三角」中，每个数是它左上方和右上方的数的和。
```

```ts
function generate(numRows: number): number[][] {
  const triangle = Array.from({ length: numRows }, (_, k) => {
    const len = k + 1;
    return Array.from({ length: len }, () => 0);
  });

  /*
        t[r][c] = t[r - 1][c - 1] + t[r - 1][c] 
     */
  for (let r = 0; r < triangle.length; r++) {
    for (let c = 0; c < triangle[r].length; c++) {
      let adder: number;
      if (c === 0) {
        adder = 1;
      } else if (c === triangle[r].length - 1) {
        adder = 1;
      } else {
        adder = triangle[r - 1][c - 1] + triangle[r - 1][c];
      }

      triangle[r][c] = adder;
    }
  }

  return triangle;
}
```

# 55. 跳跃游戏

```
给定一个非负整数数组 nums ，你最初位于数组的 第一个下标 。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

判断你是否能够到达最后一个下标。
```

```ts
function canJump(nums: number[]): boolean {
  /*
        maxJump[0] = nums[0]
        maxJump[1] = max(maxJump[0] - 1, nums[1])
        maxJump[3] = max(maxJump[2] - 1, nums[3])
        maxJump[len - 1] === 0 return false
     */
  let maxJumpPre = nums[0];
  let maxJumpCurrent = 0;
  for (let i = 1; i < nums.length; i++) {
    if (maxJumpPre === 0) return false;
    maxJumpCurrent = Math.max(nums[i], maxJumpPre - 1);
    maxJumpPre = maxJumpCurrent;
  }
  return true;
}
```
