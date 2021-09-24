# BASIC

## basic structure

1. linked list: use pointer to refer the next element location
2. array: an array of continues memorary location

## basic traverse operation

1. sequencial access

```ts
function traverse(arr: number[]) {
  for(int i = 0; i < arr.length; i++) {
    //access arr[i]
  }
}
```

2. sequencial linked elements access

```ts
type ListNode {
  val:number,
  next:ListNode
}
function traverse (head:ListNode) {
  for(let p = head; p !== null; p = p.next) {
    //access p.val
  }
}

function traverse (head: ListNode) {
  // access val
  traverse(head.next)
}
```

3. Binary Tree Access

```ts
class TreeNode {
  val:number,
  left:TreeNode,
  right:TreeNode
}
void traverse (root: TreeNode) {
  const {left, right} = root
  // preorder
  traverse(left)
  // inorder
  traverse(right)
  // post-order
}
```

4. General Tree Access

```ts
type TreeNode {
  val:number,
  children: TreeNode[]
}

function traverse (root: TreeNode) {
  const {children} = root
  for(let child : children) {
    traverse(child)
  }
}
```
