# LinkedList

# 206 反转链表

```ts
//use stack to reverse linked list
function reverseList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}

//dual pointer
function reverseList(head: ListNode | null): ListNode | null {
  if (!head || !head.next) {
    return head;
  }
  // double pointer
  let prev = null;
  let curr = head;
  while (curr !== null) {
    const temp = curr.next;
    curr.next = prev;
    prev = curr;
    curr = temp;
  }
  return prev;
}
```

# 237. 删除链表中的节点

```
请编写一个函数，使其可以删除某个链表中给定的（非末尾）节点。传入函数的唯一参数为 要被删除的节点 。


现有一个链表 -- head = [4,5,1,9]，它可以表示为:

示例 1：

输入：head = [4,5,1,9], node = 5
输出：[4,1,9]
解释：给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
示例 2：

输入：head = [4,5,1,9], node = 1
输出：[4,5,9]
解释：给定你链表中值为 1 的第三个节点，那么在调用了你的函数之后，该链表应变为 4 -> 5 -> 9.

```

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

/**
 Do not return anything, modify it in-place instead.
 */
function deleteNode(root: ListNode | null): void {
  if (!root) return;
  root.val = root.next.val;
  root.next = root.next.next;
}
```

# 234. 回文链表

```
给你一个单链表的头节点 head ，请你判断该链表是否为回文链表。如果是，返回 true ；否则，返回 false 。
```

```ts
function isPalindrome(head: ListNode | null): boolean {
  let pre = head;

  const doCheck = (node: ListNode | null) => {
    if (node) {
      if (!doCheck(node.next)) {
        return false;
      }
      if (node.val !== pre.val) {
        return false;
      }
      pre = pre.next;
    }
    return true;
  };

  return doCheck(head);
}
```

# 92. 反转链表 II

```
给你单链表的头指针 head 和两个整数 left 和 right ，其中 left <= right 。请你反转从位置 left 到位置 right 的链表节点，返回 反转后的链表 。
```

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

function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number
): ListNode | null {
  const dummy = new ListNode();
  dummy.next = head;
  let pre = dummy;
  for (let step = 0; step < left - 1; step++) {
    pre = pre.next;
  }

  let start = pre.next;
  let end = pre;
  for (let step = 0; step < right - left + 1; step++) {
    end = end.next;
  }

  const post = end.next;

  pre.next = null;
  end.next = null;
  reverseBetween.reverse(start);
  pre.next = end;
  start.next = post;
  return dummy.next;
}

reverseBetween.reverse = (head: ListNode | null) => {
  let pre = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = pre;
    pre = current;
    current = next;
  }
  return current;
};
```

# 24. 两两交换链表中的节点

```
给定一个链表，两两交换其中相邻的节点，并返回交换后的链表。

你不能只是单纯的改变节点内部的值，而是需要实际的进行节点交换。
```

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

function swapPairs(head: ListNode | null): ListNode | null {
  if (!head) {
    return head;
  }
  if (!head.next) {
    return head;
  }
  const dummy = new ListNode();
  dummy.next = head;
  let temp = dummy;
  while (temp.next && temp.next.next) {
    let node1 = temp.next;
    let node2 = temp.next.next;
    let after = node2.next;
    node2.next = node1;
    node1.next = after;
    temp.next = node2;
    temp = temp.next.next;
  }

  return dummy.next;
}
```
