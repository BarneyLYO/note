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

# 16. 最接近的三数之和

```
给定一个包括 n 个整数的数组 nums 和 一个目标值 target。找出 nums 中的三个整数，使得它们的和与 target 最接近。返回这三个数的和。假定每组输入只存在唯一答案。
示例：
输入：nums = [-1,2,1,-4], target = 1
输出：2
解释：与 target 最接近的和是 2 (-1 + 2 + 1 = 2) 。
提示：
3 <= nums.length <= 10^3
-10^3 <= nums[i] <= 10^3
-10^4 <= target <= 10^4
```

```ts
function threeSumClosest(nums: number[], target: number): number {
  nums.sort((a, b) => a - b);
  let queue = [target];
  let k = 0;
  while (queue.length) {
    const currentTarget = queue.shift();
    if (threeSumClosest.threeSum(nums, currentTarget)) {
      return currentTarget;
    }
    k++;
    queue.push(target + k, target - k);
  }
}

threeSumClosest.threeSum = (sorted: number[], target: number) => {
  for (let i = 0; i < sorted.length; i++) {
    const tgt = target - sorted[i];
    const allPossible = threeSumClosest.twoSum(sorted, i + 1, tgt);

    if (allPossible) {
      return [sorted[i], ...allPossible];
    }
  }
  return null;
};

threeSumClosest.twoSum = (sorted: number[], start: number, target: number) => {
  let left = start;
  let right = sorted.length - 1;
  while (left < right) {
    const leftV = sorted[left];
    const rightV = sorted[right];
    const sum = leftV + rightV;

    if (sum === target) {
      return [leftV, rightV];
    }

    if (sum < target) {
      left++;
    } else if (sum > target) {
      right--;
    }
  }
  return null;
};
```

# 102. 二叉树的层序遍历

```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const queue = [root];
  const res: number[][] = [];
  while (queue.length) {
    const level = [...queue];
    queue.length = 0;
    for (let node of level) {
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    }

    res.push(level.map(node => node.val));
  }
  return res;
}
```

# 103. 二叉树的锯齿形层序遍历

```
给定一个二叉树，返回其节点值的锯齿形层序遍历。（即先从左往右，再从右往左进行下一层遍历，以此类推，层与层之间交替进行）。

例如：
给定二叉树 [3,9,20,null,null,15,7]
```

```ts
/**
 * Definition for a binary tree node.
 * class TreeNode {
 *     val: number
 *     left: TreeNode | null
 *     right: TreeNode | null
 *     constructor(val?: number, left?: TreeNode | null, right?: TreeNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.left = (left===undefined ? null : left)
 *         this.right = (right===undefined ? null : right)
 *     }
 * }
 */

function zigzagLevelOrder(root: TreeNode | null): number[][] {
  const results: number[][] = [];
  if (!root) return results;
  let level = 0;
  const queue = [root];
  while (queue.length) {
    const all = [...queue];
    queue.length = 0;
    all.forEach(node => {
      node.left && queue.push(node.left);
      node.right && queue.push(node.right);
    });

    let res;
    if (level % 2 === 0) {
      res = all.map(el => el.val);
    } else {
      res = all.reverse().map(el => el.val);
    }
    results.push(res);

    if (queue.length) {
      level++;
    }
  }
  return results;
}
```

# 45. 跳跃游戏 II

```
给你一个非负整数数组 nums ，你最初位于数组的第一个位置。

数组中的每个元素代表你在该位置可以跳跃的最大长度。

你的目标是使用最少的跳跃次数到达数组的最后一个位置。

假设你总是可以到达数组的最后一个位置。

 

示例 1:

输入: nums = [2,3,1,1,4]
输出: 2
解释: 跳到最后一个位置的最小跳跃数是 2。
     从下标为 0 跳到下标为 1 的位置，跳 1 步，然后跳 3 步到达数组的最后一个位置。
示例 2:

输入: nums = [2,3,0,1,4]
输出: 2
 

提示:

1 <= nums.length <= 104
0 <= nums[i] <= 1000
```

```ts
function jump(nums: number[]): number {
  const queue = [0];
  const visited = new Set<number>([0]);
  let count = 0;
  while (queue.length) {
    let size = queue.length;
    while (size--) {
      const idx = queue.shift();
      if (idx === nums.length - 1) {
        return count;
      }

      for (let i = idx + 1; i <= idx + nums[idx]; i++) {
        if (i >= nums.length) {
          break;
        }
        if (visited.has(i)) {
          continue;
        }
        visited.add(i);
        queue.push(i);
      }
    }

    count++;
  }
  return count;
}
```

# 127. 单词接龙

```
字典 wordList 中从单词 beginWord 和 endWord 的 转换序列 是一个按下述规格形成的序列：

序列中第一个单词是 beginWord 。
序列中最后一个单词是 endWord 。
每次转换只能改变一个字母。
转换过程中的中间单词必须是字典 wordList 中的单词。
给你两个单词 beginWord 和 endWord 和一个字典 wordList ，找到从 beginWord 到 endWord 的 最短转换序列 中的 单词数目 。如果不存在这样的转换序列，返回 0。
```

```ts
function ladderLength(
  beginWord: string,
  endWord: string,
  wordList: string[]
): number {
  if (!wordList.includes(endWord)) {
    return 0;
  }
  const wordSet = new Set(wordList);
  const queue = [beginWord];
  const visted = new Set([beginWord]);

  let count = 1;

  while (queue.length) {
    let size = queue.length;

    for (let i = 0; i < size; i++) {
      const current = queue.shift();
      const newLevel = convert(current);
      for (let word of newLevel) {
        if (word === endWord) {
          return count + 1;
        }
        if (visted.has(word)) {
          continue;
        }
        if (!wordSet.has(word)) {
          continue;
        }
        visted.add(word);
        queue.push(word);
      }
    }
    count++;
  }

  return 0;
}

const convert = (origin: string) => {
  let words = origin.split('');
  let res = new Set<string>();
  for (let i = 0; i < words.length; i++) {
    const origin = words[i];
    for (let j = 0; j < 26; j++) {
      const code = 'a'.charCodeAt(0) + j;
      words[i] = String.fromCharCode(code);
      const newWord = words.join('');
      res.add(newWord);
      words[i] = origin;
    }
  }
  return res;
};
```

# 133. 克隆图

```
给你无向 连通 图中一个节点的引用，请你返回该图的 深拷贝（克隆）。

图中的每个节点都包含它的值 val（int） 和其邻居的列表（list[Node]）。

class Node {
    public int val;
    public List<Node> neighbors;
}
```

```ts
/**
 * Definition for Node.
 * class Node {
 *     val: number
 *     neighbors: Node[]
 *     constructor(val?: number, neighbors?: Node[]) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.neighbors = (neighbors===undefined ? [] : neighbors)
 *     }
 * }
 */

function cloneGraph(node: Node | null): Node | null {
  if (!node) return null;
  const queue = [node];
  const visted = new Map<Node, Node>([[node, new Node(node.val)]]);
  while (queue.length) {
    const current = queue.shift();
    for (const n of current.neighbors) {
      if (!visted.has(n)) {
        visted.set(n, new Node(n.val));
        queue.push(n);
      }
      visted.get(current).neighbors.push(visted.get(n));
    }
  }

  return visted.get(node);
}
```
