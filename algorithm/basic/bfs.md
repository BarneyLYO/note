# BFS

- framework

```ts
const BFS = (start: Node, end: Node) => {
  const queue: Array<Node> = [start];
  const visited: Set<Node> = new Set();
  visited.add(start);
  let level = 0;

  while (queue.length) {
    const size = queue.length;

    for (let i = 0; i < size; i++) {
      const node = queue.shift();

      if (node === target) {
        return step;
      }

      for (let aroundNode of node.adj()) {
        if (visited.has(aroundNode)) {
          continue;
        }

        visited.add(aroundNode);
        queue.push(aroundNode);
      }
    }
    level++;
  }

  return -1; //never gonna make it
};
```

- 111 给定一个二叉树，找出其最小深度。最小深度是从根节点到最近叶子节点的最短路径上的节点数量。说明：叶子节点是指没有子节点的节点。

```ts
function minDepth(root: TreeNode | null): number {
  if (!root) return 0;
  const queue: Array<TreeNode> = [root];
  let level = 1;
  while (queue.length) {
    const numNodeInLevel = queue.length;
    for (let i = 0; i < numNodeInLevel; i++) {
      const current = queue.shift();
      const { left, right } = current;

      if (!left && !right) return level;

      left && queue.push(left);
      right && queue.push(right);
    }
    level++;
  }
  return level;
}
```

- 756 你有一个带有四个圆形拨轮的转盘锁。每个拨轮都有 10 个数字： '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' 。每个拨轮可以自由旋转：例如把 '9' 变为  '0'，'0' 变为 '9' 。每次旋转都只能旋转一个拨轮的一位数字。锁的初始数字为 '0000' ，一个代表四个拨轮的数字的字符串。列表 deadends 包含了一组死亡数字，一旦拨轮的数字和列表里的任何一个元素相同，这个锁将会被永久锁定，无法再被旋转。字符串 target 代表可以解锁的数字，你需要给出解锁需要的最小旋转次数，如果无论如何不能解锁，返回 -1 。

```ts
function openLock(deadends: string[], target: string): number {
  const deadendsSet = new Set(deadends);
  if (deadendsSet.has('0000')) {
    return -1;
  }
  const visited = new Set<string>();
  const shouldOffer = (combination: string) => {
    return !deadendsSet.has(combination) && !visited.has(combination);
  };
  const queue = ['0000'];

  let times = 0;

  while (queue.length) {
    const numCombinations = queue.length;
    for (let i = 0; i < numCombinations; i++) {
      const currentCombination = queue.shift();
      if (currentCombination === target) {
        return times;
      }

      for (let i = 0; i < 4; i++) {
        const pswMoveUp = moveUp(currentCombination, i);
        const pswMoveDown = moveDown(currentCombination, i);
        if (shouldOffer(pswMoveUp)) {
          queue.push(pswMoveUp);
          visited.add(pswMoveUp);
        }
        if (shouldOffer(pswMoveDown)) {
          queue.push(pswMoveDown);
          visited.add(pswMoveDown);
        }
      }
    }
    times++;
  }
  return -1;
}

const moveUp = (psw: string, idx: number) => {
  let changed = psw.split('');
  if (changed[idx] === '9') {
    changed[idx] = '0';
  } else {
    changed[idx] = +changed[idx] + 1 + '';
  }
  return changed.join('');
};

const moveDown = (psw: string, idx: number) => {
  let changed = psw.split('');
  if (changed[idx] === '0') {
    changed[idx] = '9';
  } else {
    changed[idx] = +changed[idx] - 1 + '';
  }
  return changed.join('');
};
```

# 101. 对称二叉树, 给定一个二叉树，检查它是否是镜像对称的。

```ts
function isSymmetric(root: TreeNode | null): boolean {
  const queue: Array<TreeNode> = [root, root];
  while (queue.length) {
    const left = queue.shift();
    const right = queue.shift();

    if (!left && !right) continue;

    if (!left || !right) return false;
    if (left.val !== right.val) return false;

    queue.push(left.left);
    queue.push(right.right);

    queue.push(left.right);
    queue.push(right.left);
  }
  return true;
}

const checkSymmetric = (leftTreeNode: TreeNode, rightTreeNode: TreeNode) => {
  if (!leftTreeNode && !rightTreeNode) return true;

  if (!leftTreeNode || !rightTreeNode) return false;

  if (leftTreeNode.val !== rightTreeNode.val) return false;

  return (
    checkSymmetric(leftTreeNode.left, rightTreeNode.right) &&
    checkSymmetric(leftTreeNode.right, rightTreeNode.left)
  );
};
```
