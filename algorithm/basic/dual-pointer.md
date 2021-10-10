- has cycle

1. check if there is a cycle in the linked list

```ts
function hasCycle(head: ListNode): boolean {
  let slow: ListNode;
  let fast: ListNode;
  while (fast !== null && fast.next !== null) {
    fast = fast.next.next;
    slow = slow.next;
  }
  if (fast === slow) return true;
  return false;
}
```

# 88. 合并两个有序数组

```ts
function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  let p1 = m - 1;
  let p2 = n - 1;
  let tail = m + n - 1;
  let current: number;
  while (p2 >= 0 || p1 >= 0) {
    if (p1 < 0) {
      current = nums2[p2--];
    } else if (p2 < 0) {
      current = nums1[p1--];
    } else if (nums1[p1] <= nums2[p2]) {
      current = nums2[p2--];
    } else if (nums1[p1] > nums2[p2]) {
      current = nums1[p1--];
    }
    nums1[tail--] = current;
  }
}
```

# 21. 合并两个有序链表

```ts
function mergeTwoLists(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  if (!l1) return l2;
  if (!l2) return l1;
  const dummy = new ListNode();
  let curr = dummy;
  while (l1 && l2) {
    if (l1.val < l2.val) {
      curr.next = l1;
      l1 = l1.next;
    } else {
      curr.next = l2;
      l2 = l2.next;
    }
    curr = curr.next;
  }
  curr.next = l1 === null ? l2 : l1;
  return dummy.next;
}
```

# 27. 移除元素, 给你一个数组 nums  和一个值 val，你需要 原地 移除所有数值等于  val  的元素，并返回移除后数组的新长度。不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并 原地 修改输入数组。元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

```ts
function removeElement(nums: number[], val: number): number {
  let left = 0;
  let right = nums.length;
  // because right = nums.length
  // left must less than right
  // [left, right)
  while (left < right) {
    if (nums[left] === val) {
      nums[left] = nums[right - 1];
      right--;
    } else {
      left++;
    }
  }
  return left;
}
```

# 26. 删除有序数组中的重复项

```ts
function removeDuplicates(nums: number[]): number {
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[slow] !== nums[fast]) {
      nums[slow + 1] = nums[fast];
      slow++;
    }
    fast++;
  }
  // return the length
  return slow + 1;
}
```

# 141 环形链表 给定一个链表，判断链表中是否有环。如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。 为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意：pos 不作为参数进行传递，仅仅是为了标识链表的实际情况。如果链表中存在环，则返回 true 。 否则，返回 false 。

```ts
function hasCycle(head: ListNode | null): boolean {
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if (slow === fast) return true;
  }
  return false;
}
```

# 142 环形链表 II 给定一个链表，返回链表开始入环的第一个节点。  如果链表无环，则返回  null。为了表示给定链表中的环，我们使用整数 pos 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 pos 是 -1，则在该链表中没有环。注意，pos 仅仅是用于标识环的情况，并不会作为参数传递到函数中。

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function detectCycle(head: ListNode | null): ListNode | null {
  if (!head) return null;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
    if (fast === slow) {
      fast = head;
      while (fast !== slow) {
        fast = fast.next;
        slow = slow.next;
      }
      return fast;
    }
  }
  return null;
}
```

# 876 链表的中间结点 给定一个头结点为 head 的非空单链表，返回链表的中间结点。如果有两个中间结点，则返回第二个中间结点。

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function middleNode(head: ListNode | null): ListNode | null {
  if (!head) return null;
  let fast = head;
  let slow = head;
  while (fast && fast.next) {
    fast = fast.next.next;
    slow = slow.next;
  }

  return slow;
}
```

# 160 相交链表 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。如果两个链表没有交点，返回 null 。

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function getIntersectionNode(
  headA: ListNode | null,
  headB: ListNode | null
): ListNode | null {
  if (!headA) return null;
  if (!headB) return null;
  let ptr1 = headA;
  let ptr2 = headB;
  while (ptr1 !== ptr2) {
    if (!ptr1) {
      ptr1 = headB;
    } else {
      ptr1 = ptr1.next;
    }
    if (!ptr2) {
      ptr2 = headA;
    } else {
      ptr2 = ptr2.next;
    }
  }
  return ptr1;
}
```

# 19. 删除链表的倒数第 N 个结点, 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

```ts
function removeNthFromEnd(head: ListNode | null, n: number): ListNode | null {
  const dummy = new ListNode();
  dummy.next = head;
  const fromEnd = findFromEnd(dummy, n + 1);
  fromEnd.next = fromEnd.next.next;
  return dummy.next;
}

const findFromEnd = (head: ListNode, n: number) => {
  let ptr1 = head;
  for (let i = 0; i < n; i++) {
    ptr1 = ptr1.next;
  }
  let ptr2 = head;
  while (ptr1 !== null) {
    ptr2 = ptr2.next;
    ptr1 = ptr1.next;
  }
  return ptr2;
};
```

# 盛最多水的容器

```ts
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let max = Number.MIN_SAFE_INTEGER;
  while (left < right) {
    const len = right - left;
    const minHeight = Math.min(height[left], height[right]);
    max = Math.max(minHeight * len, max);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return max;
}
```

# three sum

```
给你一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。
```

```ts
function threeSum(nums: number[]): number[][] {
  const res: number[][] = [];
  if (!nums.length || nums.length < 3) {
    return res;
  }

  const sorted = nums.sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    const searchTarget = 0 - sorted[i];
    const allPossibles = threeSum
      .findTwoSumsForTaget(sorted, i + 1, searchTarget)
      .map(pair => [sorted[i], ...pair]);
    res.push(...allPossibles);

    // skip all same value
    while (i < sorted.length - 1 && sorted[i] === sorted[i + 1]) {
      i++;
    }
  }
  return res;
}

threeSum.findTwoSumsForTaget = (
  sorted: number[],
  start: number,
  target: number
) => {
  const res: number[][] = [];

  let left = start;
  let right = sorted.length - 1;
  while (left < right) {
    const leftVal = sorted[left];
    const rightVal = sorted[right];
    const sum = leftVal + rightVal;

    if (sum === target) {
      res.push([leftVal, rightVal]);
      //skip all same value
      while (left < right && sorted[left] === leftVal) {
        left++;
      }
      while (left < right && sorted[right] === rightVal) {
        right--;
      }
    } else if (sum < target) {
      left++;
    } else if (sum > target) {
      right--;
    }
  }
  return res;
};
```

# four sums

```
给你一个由 n 个整数组成的数组 nums ，和一个目标值 target 。请你找出并返回满足下述全部条件且不重复的四元组 [nums[a], nums[b], nums[c], nums[d]] ：

0 <= a, b, c, d < n
a、b、c 和 d 互不相同
nums[a] + nums[b] + nums[c] + nums[d] == target
你可以按 任意顺序 返回答案 。
```

```ts
function fourSum(nums: number[], target: number): number[][] {
  const len = nums.length;
  const res: number[][] = [];
  const sorted = nums.sort((a, b) => a - b);
  for (let i = 0; i < len; i++) {
    const threeSumTarget = target - sorted[i];
    const threeSums = fourSum
      .threeSum(sorted, i + 1, threeSumTarget)
      .map(triple => [sorted[i], ...triple]);

    res.push(...threeSums);
    while (i < len - 1 && sorted[i] === sorted[i + 1]) {
      i++;
    }
  }
  return res;
}

fourSum.threeSum = (sorted: number[], start: number, target: number) => {
  const len = sorted.length;
  const res: number[][] = [];

  for (let i = start; i < len; i++) {
    const twoSumTarget = target - sorted[i];
    const twoSums = fourSum
      .twoSum(sorted, i + 1, twoSumTarget)
      .map(pair => [sorted[i], ...pair]);
    res.push(...twoSums);
    while (i < len - 1 && sorted[i] === sorted[i + 1]) {
      i++;
    }
  }

  return res;
};

fourSum.twoSum = (sorted: number[], start: number, target: number) => {
  const res: number[][] = [];
  let left = start;
  let right = sorted.length - 1;
  while (left < right) {
    const leftVal = sorted[left];
    const rightVal = sorted[right];
    const sum = leftVal + rightVal;

    if (sum === target) {
      res.push([leftVal, rightVal]);
      while (left < right && sorted[left] === leftVal) {
        left++;
      }
      while (left < right && sorted[right] === rightVal) {
        right--;
      }
    } else if (sum < target) {
      left++;
    } else if (sum > target) {
      right--;
    }
  }

  return res;
};
```

# 125. 验证回文串

```
给定一个字符串，验证它是否是回文串，只考虑字母和数字字符，可以忽略字母的大小写。

说明：本题中，我们将空字符串定义为有效的回文串。
```

```ts
const REGEX_ALPHA_NUM = /[a-z0-9]+/g;
function isPalindrome(s: string): boolean {
  if (!s) {
    return false;
  }
  let filtered: string | string[] = s
    .toLocaleLowerCase()
    .match(REGEX_ALPHA_NUM);
  if (!filtered) {
    return true;
  }
  let str = filtered.join('');

  let left = 0;
  let right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}
```

# 56. 合并区间

```
以数组 intervals 表示若干个区间的集合，其中单个区间为 intervals[i] = [starti, endi] 。请你合并所有重叠的区间，并返回一个不重叠的区间数组，该数组需恰好覆盖输入中的所有区间。
```

```ts
function merge(intervals: number[][]): number[][] {
  //[[1,3],[2,6],[1,6]]
  intervals.sort(intervalOrder);
  /*
        s & e => e
        [1,3],[2,6]
        startIndx = 0
        endIndx = 0
        start = intervals[startIndx][0]
        end = intervals[endIdx][0]
        if(endIndx < intervals.length && interval[endIndx][0] <= end) {
            // include or expanding
            end = Math.max(interval[endIndx][1], end)
            endIndx++
        }
        we get [start, end]
        endIndx is next interval for determine
     */
  const resList: number[][] = [];
  let startIdx = 0;
  let endIdx = 0;
  while (endIdx < intervals.length) {
    const start = intervals[startIdx][0];
    let end = intervals[endIdx][1];
    while (endIdx < intervals.length && intervals[endIdx][0] <= end) {
      //do interval include or interval expand
      end = Math.max(intervals[endIdx][1], end);
      //endIdx point to next new interval
      endIdx++;
    }
    resList.push([start, end]);
    startIdx = endIdx;
  }
  return resList;
}

const intervalOrder = (a: number[], b: number[]) => {
  if (a[0] !== b[0]) {
    return a[0] - b[0];
  }
  return a[1] - b[1];
};
```

# 57. 插入区间

```
给你一个 无重叠的 ，按照区间起始端点排序的区间列表。

在列表中插入一个新的区间，你需要确保列表中的区间仍然有序且不重叠（如果有必要的话，可以合并区间）。
示例 1：

输入：intervals = [[1,3],[6,9]], newInterval = [2,5]
输出：[[1,5],[6,9]]
示例 2：

输入：intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]
输出：[[1,2],[3,10],[12,16]]
解释：这是因为新的区间 [4,8] 与 [3,5],[6,7],[8,10] 重叠。
示例 3：

输入：intervals = [], newInterval = [5,7]
输出：[[5,7]]
示例 4：

输入：intervals = [[1,5]], newInterval = [2,3]
输出：[[1,5]]
```

```ts
function insert(intervals: number[][], newInterval: number[]): number[][] {
  const res: number[][] = [];
  const intervalsAfterInsert = [...intervals, newInterval];
  intervalsAfterInsert.sort(intervalOrder);
  const len = intervalsAfterInsert.length;
  let startIdx = 0;
  let endIdx = 0;
  while (endIdx < len) {
    const start = intervalsAfterInsert[startIdx][0];
    let end = intervalsAfterInsert[endIdx][1];
    while (endIdx < len && intervalsAfterInsert[endIdx][0] <= end) {
      end = Math.max(intervalsAfterInsert[endIdx][1], end);
      endIdx++;
    }
    res.push([start, end]);
    startIdx = endIdx;
  }
  return res;
}

const intervalOrder = (a: number[], b: number[]) => {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  }
  return a[0] - b[0];
};
```

# 252. 会议室

```
给定一个会议时间安排的数组 intervals ，每个会议时间都会包括开始和结束的时间 intervals[i] = [starti, endi] ，请你判断一个人是否能够参加这里面的全部会议。

示例 1：

输入：intervals = [[0,30],[5,10],[15,20]]
输出：false
示例 2：

输入：intervals = [[7,10],[2,4]]
输出：true
```

```ts
function canAttendMeetings(intervals: number[][]): boolean {
  if (!intervals.length || intervals.length === 1) {
    return true;
  }
  intervals.sort(intervalOrder);
  let before = 0;
  let after = 1;
  while (after < intervals.length) {
    // [1,2],[3,4],[4,5]
    if (intervals[after][0] < intervals[before][1]) {
      return false;
    }
    before++;
    after++;
  }
  return true;
}

const intervalOrder = (a: number[], b: number[]) => {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  }
  return a[0] - b[0];
};
```

# 344. 反转字符串

```
编写一个函数，其作用是将输入的字符串反转过来。输入字符串以字符数组 s 的形式给出。

不要给另外的数组分配额外的空间，你必须原地修改输入数组、使用 O(1) 的额外空间解决这一问题。
```

```ts
function reverseString(s: string[]): void {
  let lo = 0;
  let hi = s.length - 1;
  while (lo < hi) {
    [s[lo], s[hi]] = [s[hi], s[lo]];
    lo++;
    hi--;
  }
}
```

# 541. 反转字符串 II

```
给定一个字符串 s 和一个整数 k，从字符串开头算起，每计数至 2k 个字符，就反转这 2k 字符中的前 k 个字符。

如果剩余字符少于 k 个，则将剩余字符全部反转。
如果剩余字符小于 2k 但大于或等于 k 个，则反转前 k 个字符，其余字符保持原样。
 

示例 1：

输入：s = "abcdefg", k = 2
输出："bacdfeg"
示例 2：

输入：s = "abcd", k = 2
输出："bacd"
 

提示：

1 <= s.length <= 104
s 仅由小写英文组成
1 <= k <= 104
```

```ts
function reverseStr(s: string, k: number): string {
  const chars = s.split('');
  for (let lo = 0; lo < s.length; lo = 2 * k + lo) {
    let hi = Math.min(lo + k - 1, s.length - 1);
    reverseStr.reverse(chars, lo, hi);
  }
  return chars.join('');
}

reverseStr.reverse = (chars: string[], lo: number, hi: number) => {
  while (lo < hi) {
    [chars[lo], chars[hi]] = [chars[hi], chars[lo]];
    lo++;
    hi--;
  }
};
```

# 283. 移动零

```
给定一个数组 nums，编写一个函数将所有 0 移动到数组的末尾，同时保持非零元素的相对顺序。

示例:

输入: [0,1,0,3,12]
输出: [1,3,12,0,0]
说明:

必须在原数组上操作，不能拷贝额外的数组。
尽量减少操作次数。
```

```ts
/**
 Do not return anything, modify nums in-place instead.
 */
function moveZeroes(nums: number[]): void {
  let slow = 0;
  let fast = 0;
  while (fast < nums.length) {
    if (nums[fast] !== 0) {
      [nums[slow], nums[fast]] = [nums[fast], nums[slow]];
      slow++;
    }
    fast++;
  }
}
```

# 38. 外观数列

```
给定一个正整数 n ，输出外观数列的第 n 项。

「外观数列」是一个整数序列，从数字 1 开始，序列中的每一项都是对前一项的描述。

你可以将其视作是由递归公式定义的数字字符串序列：

countAndSay(1) = "1"
countAndSay(n) 是对 countAndSay(n-1) 的描述，然后转换成另一个数字字符串。
前五项如下：

1.     1
2.     11
3.     21
4.     1211
5.     111221
第一项是数字 1
描述前一项，这个数是 1 即 “ 一 个 1 ”，记作 "11"
描述前一项，这个数是 11 即 “ 二 个 1 ” ，记作 "21"
描述前一项，这个数是 21 即 “ 一 个 2 + 一 个 1 ” ，记作 "1211"
描述前一项，这个数是 1211 即 “ 一 个 1 + 一 个 2 + 二 个 1 ” ，记作 "111221"
要 描述 一个数字字符串，首先要将字符串分割为 最小 数量的组，每个组都由连续的最多 相同字符 组成。然后对于每个组，先描述字符的数量，然后描述字符，形成一个描述组。要将描述转换为数字字符串，先将每组中的字符数量用数字替换，再将所有描述组连接起来。
```

```ts
function countAndSay(n: number): string {
  // 1, 11,21,1211,111221,312211,13112221
  if (n === 1) return '1';
  const pre = countAndSay(n - 1);
  let before = 0;
  let after = 1;
  let len = pre.length;
  let ans = '';
  while (after < len) {
    if (pre[before] !== pre[after]) {
      const count = after - before;
      ans += count + pre[before];
      before = after;
    }
    after++;
  }
  ans += after - before + pre[before];
  return ans;
}
```

# 31. 下一个排列

```
实现获取 下一个排列 的函数，算法需要将给定数字序列重新排列成字典序中下一个更大的排列（即，组合出下一个更大的整数）。

如果不存在下一个更大的排列，则将数字重新排列成最小的排列（即升序排列）。

必须 原地 修改，只允许使用额外常数空间。
```

```ts
/**
 Do not return anything, modify nums in-place instead.
 */
function nextPermutation(nums: number[]): void {
  /*
        [1,2,3,4] 4,3
        [1,2,4,3] 2,3
        [1,3,2,4] 4,3
        [1,4,2,3]
        [1,4,3,2]
        [2,1,3,4]
        [2,1,4,3]
        [2,3,1,4]
        [2,4,1,3]
        [3,1,2,4]
        [3,1,4,2]
     */

  let pre = nums.length - 2;
  while (pre >= 0 && nums[pre] >= nums[pre + 1]) {
    pre--;
  }

  if (pre >= 0) {
    let post = nums.length - 1;
    while (post >= 0 && nums[pre] >= nums[post]) {
      post--;
    }
    [nums[pre], nums[post]] = [nums[post], nums[pre]];
  }

  let start = pre + 1;
  let end = nums.length - 1;
  while (start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}
```

# 75. 颜色分类

```
给定一个包含红色、白色和蓝色，一共 n 个元素的数组，原地对它们进行排序，使得相同颜色的元素相邻，并按照红色、白色、蓝色顺序排列。

此题中，我们使用整数 0、 1 和 2 分别表示红色、白色和蓝色。
```

```ts
/**
 Do not return anything, modify nums in-place instead.
 */
function sortColors(nums: number[]): void {
  let pre = 0;
  let post = nums.length - 1;
  let runner = 0;
  while (runner <= post) {
    const num = nums[runner];
    if (num === 0) {
      [nums[runner], nums[pre]] = [nums[pre], nums[runner]];
      pre++;
      runner++;
      continue;
    }
    if (num === 2) {
      [nums[runner], nums[post]] = [nums[post], nums[runner]];
      post--;
      continue;
    }
    runner++;
  }
}
```

# 228. 汇总区间

```
给定一个无重复元素的有序整数数组 nums 。

返回 恰好覆盖数组中所有数字 的 最小有序 区间范围列表。也就是说，nums 的每个元素都恰好被某个区间范围所覆盖，并且不存在属于某个范围但不属于 nums 的数字 x 。

列表中的每个区间范围 [a,b] 应该按如下格式输出：

"a->b" ，如果 a != b
"a" ，如果 a == b
```

```ts
function summaryRanges(nums: number[]): string[] {
  const ans: string[] = [];
  let writer = 0;
  for (let reader = 0; reader < nums.length; reader++) {
    if (reader + 1 === nums.length || nums[reader] + 1 !== nums[reader + 1]) {
      let word: string = nums[writer] + '';
      if (writer !== reader) {
        word += '->' + nums[reader];
      }
      ans.push(word);
      writer = reader + 1;
    }
  }

  return ans;
}
```

# 169. 多数元素

```
给定一个大小为 n 的数组，找到其中的多数元素。多数元素是指在数组中出现次数 大于 ⌊ n/2 ⌋ 的元素。

你可以假设数组是非空的，并且给定的数组总是存在多数元素。

 

示例 1：

输入：[3,2,3]
输出：3
示例 2：

输入：[2,2,1,1,1,2,2]
输出：2
 

进阶：

尝试设计时间复杂度为 O(n)、空间复杂度为 O(1) 的算法解决此问题。摩尔投票法
```

```ts
function majorityElement(nums: number[]): number {
  let candidate = nums[0];
  let counter = 1;
  for (let num of nums) {
    if (candidate === num) {
      counter++;
    } else {
      counter--;
    }

    if (counter === 0) {
      candidate = num;
      counter = 1;
    }
  }

  return candidate;
}
```

# 443. 压缩字符串

```
给你一个字符数组 chars ，请使用下述算法压缩：

从一个空字符串 s 开始。对于 chars 中的每组 连续重复字符 ：

如果这一组长度为 1 ，则将字符追加到 s 中。
否则，需要向 s 追加字符，后跟这一组的长度。
压缩后得到的字符串 s 不应该直接返回 ，需要转储到字符数组 chars 中。需要注意的是，如果组长度为 10 或 10 以上，则在 chars 数组中会被拆分为多个字符。

请在 修改完输入数组后 ，返回该数组的新长度。

你必须设计并实现一个只使用常量额外空间的算法来解决此问题。
```

```ts
function compress(chars: string[]): number {
  let reader = 0;
  let writer = 0;
  /*
     w
     a,a,a,a,a,a,a,b,b,b,b,c,c,c
                 r

   */
  while (reader < chars.length) {
    const idx = reader;
    while (reader < chars.length && chars[idx] === chars[reader]) {
      reader++;
    }

    const len = reader - idx;
    const strLen = len + '';
    chars[writer] = chars[reader - 1];

    if (len === 1) {
      writer++;
    } else if (len < 9) {
      chars[writer + 1] = strLen;
      writer += 2;
    } else {
      for (let i = 0; i < strLen.length; i++) {
        chars[writer + 1 + i] = strLen[i];
      }
      writer += strLen.length + 1;
    }
  }
  return writer;
}
```
