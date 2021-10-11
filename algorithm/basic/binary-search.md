# Binary Search

- input must be sequencial
- focus on searching interval
- template

```ts
const binarySearch(nums:number[], target:num) {
  let left = 0
  let right = xxx
  while(xxxxxx) {
    let mid = (left + (right - left)) >> 1
    if(nums[mid] === target) {

    } else if(nums[mid] < target) {
      left = ...
    } else if(nums[mid] > target) {
      right = ...
    }
  }
}
```

- basic

```ts
const bs = (nums: number[], target: number) => {
  let left = 0;
  let right = nums.length - 1;

  // because the interval is [0, nums.length - 1] left might === right === nums.length -1
  while (left <= right) {
    const mid = (left + (right - left)) >> 1;
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid - 1;
    }
  }
  return -1;
};
```

- when search in [0, nums.length - 1] => while(left <= right)
- when search in [0, nums.length) => while(left < right)

- left <= right => the ending condition is left >= right + 1 => we are searching in [right+1, right], come on how

# left_bound [left, right)

```ts
const leftBound = (nums: number[], target: number) => {
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = (left + (right - left)) >> 1;
    if (nums[mid] === target) {
      right = mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid;
    }
  }
  // target is bigger than last element in interval
  if (left === nums.length) return -1;

  return nums[left] === target ? left : -1;
};
```

# right_bound (left,right]

```ts
const rightBound = (nums: number[], target: number) => {
  if (nums.length === 0) return -1;
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = (left + (right - left)) >> 1;
    if (nums[mid] === target) {
      left = mid + 1;
    } else if (nums[mid] > target) {
      right = mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    }
  }
  // left === right
  if (right === 0) {
    return -1;
  }
  const possibleAnswer = nums[right - 1];
  return possibleAnswer === target ? possibleAnswer : -1;
};
```

# 34 在排序数组中查找元素的第一个和最后一个位置, 给定一个按照升序排列的整数数组 nums，和一个目标值 target。找出给定目标值在数组中的开始位置和结束位置。如果数组中不存在目标值 target，返回  [-1, -1]。

```ts
function searchRange(nums: number[], target: number): number[] {
  if (!nums.length) return [-1, -1];
  let left = 0;
  let right = nums.length;
  while (left < right) {
    const mid = left + ((right - left) >> 1);
    if (nums[mid] === target) {
      left = right = mid;
      while (left > 0 && nums[left - 1] === target) {
        left--;
      }
      while (right < nums.length - 1 && nums[right + 1] === target) {
        right++;
      }
      return [left, right];
    } else if (nums[mid] > target) {
      right = mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    }
  }

  return [-1, -1];
}
```

# 33. 搜索旋转排序数组

```
整数数组 nums 按升序排列，数组中的值 互不相同 。

在传递给函数之前，nums 在预先未知的某个下标 k（0 <= k < nums.length）上进行了 旋转，使数组变为 [nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]（下标 从 0 开始 计数）。例如， [0,1,2,4,5,6,7] 在下标 3 处经旋转后可能变为 [4,5,6,7,0,1,2] 。

给你 旋转后 的数组 nums 和一个整数 target ，如果 nums 中存在这个目标值 target ，则返回它的下标，否则返回 -1 。
```

```ts
function search(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length - 1;
  //[lo,hi]
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) {
      return mid;
    }

    // 4,5,6,7,8,9,1,2,3 target = 3
    // -i,-i,...-i,1,2,3
    // 4,5,6,7,8,9,1,2,3 target = 5
    // 4,5,6,7,8,9,+i,+i,+i

    if (target >= nums[0]) {
      // target place at the left side
      if (nums[mid] < nums[0]) {
        //mid at right side
        nums[mid] = Infinity;
      }
    } else if (target < nums[0]) {
      // target place at right side
      if (nums[mid] >= nums[0]) {
        // mid at left side
        nums[mid] = -Infinity;
      }
    }

    if (nums[mid] < target) {
      lo = mid + 1;
    } else if (nums[mid] > target) {
      hi = mid - 1;
    }
  }

  return -1;
}
```

# 69. Sqrt(x)

```
给你一个非负整数 x ，计算并返回 x 的 算术平方根 。

由于返回类型是整数，结果只保留 整数部分 ，小数部分将被 舍去 。

注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5 。

```

```ts
function mySqrt(x: number): number {
  // ans 是满足 k^2 ≤x 的最大 k 值
  let l = 0;
  let r = x;
  let ans = -1;
  // [0:x], we need find the max val of mid * mid < x
  while (l <= r) {
    const mid = l + ((r - l) >> 1);
    const candidate = mid * mid;

    // [l , mid - 1]
    if (candidate > x) {
      r = mid - 1;
    }
    // [mid + 1, r]
    else if (candidate <= x) {
      ans = mid;
      l = mid + 1;
    }
  }
  return ans;
}
```

# 162. 寻找峰值

```
峰值元素是指其值严格大于左右相邻值的元素。

给你一个整数数组 nums，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回 任何一个峰值 所在位置即可。

你可以假设 nums[-1] = nums[n] = -∞ 。

你必须实现时间复杂度为 O(log n) 的算法来解决此问题。
```

```ts
function findPeakElement(nums: number[]): number {
  let l = 0;
  let r = nums.length - 1;
  while (l < r) {
    const mid = l + ((r - l) >> 1);
    if (nums[mid] < nums[mid + 1]) {
      l = mid + 1;
    } else {
      r = mid;
    }
  }
  return l;
}
```

# 35. 搜索插入位置

```
给定一个排序数组和一个目标值，在数组中找到目标值，并返回其索引。如果目标值不存在于数组中，返回它将会被按顺序插入的位置。

请必须使用时间复杂度为 O(log n) 的算法。

示例 1:

输入: nums = [1,3,5,6], target = 5
输出: 2
示例 2:

输入: nums = [1,3,5,6], target = 2
输出: 1
示例 3:

输入: nums = [1,3,5,6], target = 7
输出: 4
示例 4:

输入: nums = [1,3,5,6], target = 0
输出: 0
示例 5:

输入: nums = [1], target = 0
输出: 0
```

```ts
function searchInsert(nums: number[], target: number): number {
  let lo = 0;
  let hi = nums.length;
  //[lo,hi)
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 2);
    if (nums[mid] === target) {
      return mid;
    }

    if (target > nums[mid]) {
      lo = mid + 1;
      continue;
    }

    if (target < nums[mid]) {
      hi = mid;
      continue;
    }
  }
  return lo;
}
```
