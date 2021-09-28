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

27. 移除元素, 给你一个数组 nums  和一个值 val，你需要 原地 移除所有数值等于  val  的元素，并返回移除后数组的新长度。不要使用额外的数组空间，你必须仅使用 O(1) 额外空间并 原地 修改输入数组。元素的顺序可以改变。你不需要考虑数组中超出新长度后面的元素。

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
