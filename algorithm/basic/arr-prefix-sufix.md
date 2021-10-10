# 238. 除自身以外数组的乘积

```
给你一个长度为 n 的整数数组 nums，其中 n > 1，返回输出数组 output ，其中 output[i] 等于 nums 中除 nums[i] 之外其余各元素的乘积。

示例:
输入: [1,2,3,4]
输出: [24,12,8,6]
 
提示：题目数据保证数组之中任意元素的全部前缀元素和后缀（甚至是整个数组）的乘积都在 32 位整数范围内。

说明: 请不要使用除法，且在 O(n) 时间复杂度内完成此题。

进阶：
你可以在常数空间复杂度内完成这个题目吗？（ 出于对空间复杂度分析的目的，输出数组不被视为额外空间。）
```

```ts
function productExceptSelf(nums: number[]): number[] {
  //[1,1,1,1]
  const ans = new Array(nums.length).fill(1);
  //    const left = new Array(nums.length).fill(1)
  //    const right = new Array(nums.length).fill(1)
  /*
     left
     [1,2,3,4]
     [1,1,2,6]
    */
  //    for(let i = 1; i< nums.length;i++) {
  //        left[i] = nums[i - 1] * left[i - 1]
  //    }

  for (let i = 1; i < nums.length; i++) {
    ans[i] = nums[i - 1] * ans[i - 1];
  }
  /*
   [1,2,3,4]
   [1,1,2,6] 
   R = 1 => [1,1,2,6]
   R = 4 => [1,1,8,6]
   R = 12 => [1,12,8,6]
   R = 24 => [24,12,4,1]
   */
  let lastRight = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    ans[i] = lastRight * ans[i];
    lastRight = lastRight * nums[i];
  }

  //    for(let i = nums.length - 2; i >= 0;i--) {
  //        right[i] = nums[i + 1] * right[i + 1]
  //    }

  //    for(let i = 0; i < nums.length; i++) {
  //        ans[i] = left[i] * right[i]
  //    }

  return ans;
}
```

# 1480. 一维数组的动态和

```ts
function runningSum(nums: number[]): number[] {
  return nums.reduce((sums, curr) => {
    return [...sums, curr + (sums[sums.length - 1] || 0)];
  }, []);
}
```

# 724. 寻找数组的中心下标

```
给你一个整数数组 nums ，请计算数组的 中心下标 。

数组 中心下标 是数组的一个下标，其左侧所有元素相加的和等于右侧所有元素相加的和。

如果中心下标位于数组最左端，那么左侧数之和视为 0 ，因为在下标的左侧不存在元素。这一点对于中心下标位于数组最右端同样适用。

如果数组有多个中心下标，应该返回 最靠近左边 的那一个。如果数组不存在中心下标，返回 -1 。
```

```ts
function pivotIndex(nums: number[]): number {
  let rightSum = nums.reduce((s, c) => s + c);
  let leftSum = 0;
  for (let i = 0; i < nums.length; i++) {
    rightSum -= nums[i];
    if (leftSum === rightSum) {
      return i;
    }
    leftSum += nums[i];
  }
  return -1;
}
```

# 528. 按权重随机选择

```
给定一个正整数数组 w ，其中 w[i] 代表下标 i 的权重（下标从 0 开始），请写一个函数 pickIndex ，它可以随机地获取下标 i，选取下标 i 的概率与 w[i] 成正比。

例如，对于 w = [1, 3]，挑选下标 0 的概率为 1 / (1 + 3) = 0.25 （即，25%），而选取下标 1 的概率为 3 / (1 + 3) = 0.75（即，75%）。

也就是说，选取下标 i 的概率为 w[i] / sum(w) 。
```

```ts
class Solution {
  private prefixWeightSums: number[];
  constructor(w: number[]) {
    this.prefixWeightSums = Array.from({ length: w.length }, () => 0);
    this.prefixWeightSums[0] = w[0];
    for (let i = 1; i < w.length; i++) {
      const currentW = w[i];
      const last = this.prefixWeightSums[i - 1];
      this.prefixWeightSums[i] = last + currentW;
    }
  }

  pickIndex(): number {
    const total = this.prefixWeightSums[this.prefixWeightSums.length - 1];
    const random = ((Math.random() * total) | 0) + 1;
    for (let i = 0; i < this.prefixWeightSums.length; i++) {
      if (random <= this.prefixWeightSums[i]) {
        return i;
      }
    }
  }
}

/**
 * Your Solution object will be instantiated and called as such:
 * var obj = new Solution(w)
 * var param_1 = obj.pickIndex()
 */
```
