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
