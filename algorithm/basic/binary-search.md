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
