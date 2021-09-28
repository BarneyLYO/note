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
