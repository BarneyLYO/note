# 23. 合并 K 个升序链表, 给你一个链表数组，每个链表都已经按升序排列。请你将所有链表合并到一个升序链表中，返回合并后的链表。

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

class MinHeap {
  private arr: ListNode[] = [null];
  private _less(a: number, b: number) {
    return this.arr[a].val < this.arr[b].val;
  }
  private _exch(idx: number, idx1: number) {
    const temp = this.arr[idx];
    this.arr[idx] = this.arr[idx1];
    this.arr[idx1] = temp;
  }
  private _sink(idx: number) {
    const N = this.arr.length - 1;
    while (2 * idx <= N) {
      let nextIdx = idx * 2;
      if (nextIdx < N && !this._less(nextIdx, nextIdx + 1)) {
        nextIdx++;
      }
      if (!this._less(nextIdx, idx)) {
        break;
      }
      this._exch(idx, nextIdx);
      idx = nextIdx;
    }
  }
  private _swim(idx: number) {
    while (idx > 1 && this._less(idx, idx >> 1)) {
      this._exch(idx, idx >> 1);
      idx = idx >> 1;
    }
  }
  add(node: ListNode) {
    this.arr.push(node);
    this._swim(this.arr.length - 1);
  }

  remove() {
    if (this.arr.length < 1) return null;
    const top = this.arr[1];
    this._exch(1, this.arr.length - 1);
    this.arr.length = this.arr.length - 1;
    this._sink(1);
    return top;
  }

  *[Symbol.iterator]() {
    while (true) {
      const item = this.remove();
      if (!item) break;
      yield item;
    }
  }
}

function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  const minQ = new MinHeap();
  for (const node of lists) {
    if (!node) continue;
    let curr = node;
    while (curr) {
      minQ.add(curr);
      curr = curr.next;
    }
  }

  const dummy = new ListNode();
  let curr = dummy;
  for (const n of minQ) {
    curr.next = n;
    curr = curr.next;
  }

  curr.next = null;

  return dummy.next;
}
```

# 295. 数据流的中位数, 中位数是有序列表中间的数。如果列表长度是偶数，中位数则是中间两个数的平均值。

```
例如，
[2,3,4] 的中位数是 3

[2,3] 的中位数是 (2 + 3) / 2 = 2.5

设计一个支持以下两种操作的数据结构：

void addNum(int num) - 从数据流中添加一个整数到数据结构中。
double findMedian() - 返回目前所有元素的中位数。
```

```ts
class MedianFinder {
  private preMid = createHeap<number>((a, b) => a - b < 0);
  private postMid = createHeap<number>((a, b) => a - b > 0);

  addNum(num: number): void {
    const preSize = this.preMid.size();
    const postSize = this.postMid.size();

    //will be odd
    if (preSize === postSize) {
      // postSize === 0 => [num],[]
      // [4,3,2,1], [5,6,7,8] num === 5
      // [5,4,3,2,1], [5,6,7,8]
      // ------------------------------
      // [4,3,2,1],[5,6,7,8], num === 6
      // [5,4,3,2,1],[6,6,7,8]
      if (postSize === 0 || num <= this.postMid.peek()) {
        this.preMid.add(num);
      } else {
        this.preMid.add(this.postMid.remove());
        this.postMid.add(num);
      }
      return;
    }

    //will be even
    // [1], [], num ===1
    // [1], [1]
    // ---------
    // [2,1],[3] num === 1
    // [1,1], [2,3]
    if (num >= this.preMid.peek()) {
      this.postMid.add(num);
    } else {
      this.postMid.add(this.preMid.remove());
      this.preMid.add(num);
    }
  }

  findMedian(): number {
    const pre = this.preMid.peek();
    const post = this.postMid.peek();

    if (this.preMid.size() === this.postMid.size()) {
      return pre + (post - pre) / 2;
    }

    return pre;
  }
}

type Comparator<T> = (a: T, b: T) => boolean;
function createHeap<T>(compare: Comparator<T>) {
  const list: T[] = [null];
  return {
    add(val: T) {
      const { _swim } = createHeap;
      list.push(val);
      _swim(list, compare)(list.length - 1);
    },
    remove(): T {
      if (list.length == 2) {
        const top = list[1];
        list.length = list.length - 1;
        return top;
      }

      const { _sink } = createHeap;
      const top = list[1];
      const lastIdx = list.length - 1;

      // modify the list
      {
        [list[1], list[lastIdx]] = [list[lastIdx], list[1]];
        list.length = list.length - 1;
      }
      _sink(list, compare)(1);
      return top;
    },
    peek(): T {
      if (list.length === 1) {
        return null;
      }
      return list[1];
    },
    size(): number {
      return list.length - 1;
    }
  };
}

createHeap._swim = <T>(list: T[], compare: Comparator<T>) => (idx: number) => {
  while (idx > 1 && compare(list[idx >> 1], list[idx])) {
    [list[idx >> 1], list[idx]] = [list[idx], list[idx >> 1]];
    idx = idx >> 1;
  }
};

createHeap._sink = <T>(list: T[], compare: Comparator<T>) => (idx: number) => {
  const N = list.length - 1;
  while (idx <= N) {
    let next = idx << 1;
    if (next < N && compare(list[next], list[next + 1])) {
      next = next + 1;
    }

    if (!compare(list[idx], list[next])) {
      break;
    }

    [list[idx], list[next]] = [list[next], list[idx]];

    idx = next;
  }
};

/**
 * Your MedianFinder object will be instantiated and called as such:
 * var obj = new MedianFinder()
 * obj.addNum(num)
 * var param_2 = obj.findMedian()
 */
```

# 253. 会议室 II

```
给你一个会议时间安排的数组 intervals ，每个会议时间都会包括开始和结束的时间 intervals[i] = [starti, endi] ，为避免会议冲突，同时要考虑充分利用会议室资源，请你计算至少需要多少间会议室，才能满足这些会议安排。
```

```ts
function minMeetingRooms(intervals: number[][]): number {
  if (intervals.length === 1) {
    return 1;
  }
  intervals.sort(intervalOrder);
  // use minHeap to keep track the meeting ending time
  const minHeap = createHeap();
  minHeap.add(intervals[0][1]);

  for (let i = 1; i < intervals.length; i++) {
    let currentStart = intervals[i][0];
    // if current meeting can happen
    if (currentStart >= minHeap.peek()) {
      // the meeting with smallest ending time
      // wont affect any else
      minHeap.remove();
    }

    minHeap.add(intervals[i][1]);
  }

  return minHeap.size();
}

const intervalOrder = (a: number[], b: number[]) => {
  if (a[0] === b[0]) {
    return a[1] - b[1];
  }
  return a[0] - b[0];
};

const createHeap = () => {
  // b is less than a
  const less = (a: number, b: number) => a - b > 0;
  const { _sink, _swim } = createHeap;
  const list: number[] = [null];
  return {
    add(val: number) {
      list.push(val);
      if (list.length === 2) {
        return;
      }
      _swim(list, less, list.length - 1);
    },
    remove() {
      if (list.length === 2) {
        return list.pop();
      }
      const top = list[1];
      list[1] = list[list.length - 1];
      list.length = list.length - 1;
      _sink(list, less, 1);
      return top;
    },
    peek() {
      return list[1];
    },
    size() {
      return list.length - 1;
    }
  };
};

createHeap._sink = (
  list: number[],
  compare: (a: number, b: number) => boolean,
  idx: number
) => {
  const n = list.length - 1;
  while (idx <= n) {
    let next = idx << 1;
    if (next < n && compare(list[next], list[next + 1])) {
      next++;
    }
    if (!compare(list[idx], list[next])) {
      break;
    }
    [list[idx], list[next]] = [list[next], list[idx]];
    idx = next;
  }
};

createHeap._swim = (
  list: number[],
  compare: (a: number, b: number) => boolean,
  idx: number
) => {
  while (idx > 1 && compare(list[idx >> 1], list[idx])) {
    [list[idx >> 1], list[idx]] = [list[idx], list[idx >> 1]];
    idx = idx >> 1;
  }
};
```

# 215. 数组中的第 K 个最大元素

```
给定整数数组 nums 和整数 k，请返回数组中第 k 个最大的元素。
请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

示例 1:
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
示例 2:

输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
```

```ts
function findKthLargest(nums: number[], k: number): number {
  heapify(nums);
  return nums[nums.length - k];
}

const heapify = (arr: number[]) => {
  arr.unshift(null);
  let k = arr.length >> 1;
  while (k >= 1) {
    heapify._sink(arr, k--, arr.length - 1);
  }

  k = arr.length - 1;
  while (k > 1) {
    [arr[1], arr[k]] = [arr[k], arr[1]];
    heapify._sink(arr, 1, --k);
  }
  arr.shift();
};

heapify._sink = (arr: number[], idx: number, last: number) => {
  while (idx * 2 <= last) {
    let next = idx * 2;
    if (next < last && arr[next] - arr[next + 1] < 0) {
      next = next + 1;
    }
    if (arr[idx] - arr[next] > 0) {
      break;
    }
    [arr[idx], arr[next]] = [arr[next], arr[idx]];

    idx = next;
  }
};
```

# 973. 最接近原点的 K 个点

```
我们有一个由平面上的点组成的列表 points。需要从中找出 K 个距离原点 (0, 0) 最近的点。

（这里，平面上两点之间的距离是欧几里德距离。）

你可以按任何顺序返回答案。除了点坐标的顺序之外，答案确保是唯一的。
```

```ts
function kClosest(points: number[][], k: number): number[][] {
  const { distanceToZero } = kClosest;
  const maxH = createHeap();
  for (let i = 0; i < k; i++) {
    maxH.add([distanceToZero(points[i]), i]);
  }

  for (let i = k; i < points.length; i++) {
    const dist = distanceToZero(points[i]);
    if (dist < maxH.peek()[0]) {
      maxH.remove();
      maxH.add([dist, i]);
    }
  }

  let res = [];
  for (let big of maxH) {
    const idx = big[1];
    res.unshift(points[idx]);
  }

  return res.sort((a, b) => a[0] - b[0]);
}

kClosest.distanceToZero = (point: number[]) => {
  return point[0] ** 2 + point[1] ** 2;
};

const createHeap = () => {
  const list: number[][] = [null];
  const { _sink, _swim } = createHeap;

  return {
    add(val: number[]) {
      list.push(val);
      const len = list.length - 1;
      _swim(list, len);
    },
    remove() {
      if (list.length === 2) {
        return list.pop();
      }
      const top = list[1];
      list[1] = list[list.length - 1];
      list.length--;
      _sink(list, 1);
      return top;
    },
    peek() {
      return list[1];
    },
    *[Symbol.iterator]() {
      while (list.length - 1) {
        yield this.remove();
      }
    },
    debug() {
      console.log(list);
    }
  };
};

createHeap._sink = (list: number[][], idx: number) => {
  const { less } = createHeap;
  const n = list.length - 1;
  while (idx << 1 <= n) {
    let next = idx << 1;
    if (next < n && less(list[next], list[next + 1])) {
      next++;
    }
    if (!less(list[idx], list[next])) {
      break;
    }
    [list[idx], list[next]] = [list[next], list[idx]];
    idx = next;
  }
};

createHeap._swim = (list: number[][], idx: number) => {
  const { less } = createHeap;
  while (idx > 1 && less(list[idx >> 1], list[idx])) {
    [list[idx >> 1], list[idx]] = [list[idx], list[idx >> 1]];
    idx = idx >> 1;
  }
};

createHeap.less = (a: number[], b: number[]) => {
  return a[0] - b[0] < 0;
};
```
