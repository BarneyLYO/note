# LeetCode 124 sum of max path

- 路径被定义为一条从树中任意节点出发，沿父节点-子节点连接，达到任意节点的序列。
  同一个节点在一条路径序列中至多出现一次。该路径至少包含一个节点，且不一定经过根节点。
  路径和是路径中各节点值的总和。给你一个二叉树的根节点 root，返回其 最大路径和。
  <img src="./pics/max-path-number.png">
- solution
  1. (
     MaxPath(Subtree) =
     maxPath(root(SubTree).left)
     - maxPath(root(SubTree).right)
     - root(SubTree).val
       )
  2. MaxPath(tree) = max(maxLeftPathSum, rightPathSum) + root.val

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
const { max } = Math;
const maxPathSum = (root: TreeNode | null): number => {
  let ans = Number.MIN_SAFE_INTEGER;
  {
    const getSideMaxAndCacheMaxSubTree = (root: TreeNode | null): number => {
      if (root === null) {
        // no contribution
        return 0;
      }

      const { val, left, right } = root;
      //traverse
      const maxLeftPathSum = max(0, getSideMaxAndCacheMaxSubTree(left));
      const maxRightPathSum = max(0, getSideMaxAndCacheMaxSubTree(right));

      const currentMaxPathSum = maxLeftPathSum + maxRightPathSum + val;
      // cache the max sum
      ans = max(ans, currentMaxPathSum);
      //return contribution
      return val + max(maxLeftPathSum, maxRightPathSum);
    };
    getSideMaxAndCacheMaxSubTree(root);
  }
  return ans;
};
```

# 105 给定一棵树的前序遍历 preorder 与中序遍历 inorder。请构造二叉树并返回其根节点。

- solution:
  1. preorder [root, [ left ], [ right ]]
  2. inorder [ [ left ], root, [ right ]]

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

/**
 * preorder [root, [left] ,[right]]
 * inorder [[left],root,[right]]
 */
function buildTree(preorder: number[], inorder: number[]): TreeNode | null {
    if(preorder.length === 1) {
        return new TreeNode(preorder[0])
    }

    const inorderRootIdxMap = new Map(
        preorder.map(root => {
            const idxInInorder = (
                 inorder.findIndex(num => num === root)
            )
            return [root, idxInInorder]
    }))

    //get TreeNode
    let root = null

    {
        const buildTreeByIdxes = (
            preorderIdxes:[start:number, end:number],
            inorderIdxes:[start:number, end:number]
        ) => {
            const [preStart, preEnd] = preorderIdxes
            const [inStart, inEnd] = inorderIdxes

            if(
                preStart > preEnd
                || inStart > inEnd
            ) {
                return null
            }

            // preorder [root, [left], [right]]
            // inorder [[left], root, [right]]
            const currentRoot = new TreeNode(preorder[preStart])

            const currentRootInorderIdx = inorderRootIdxMap.get(currentRoot.val)
            const numNodeLeftSide = currentRootInorderIdx - inStart


            currentRoot.left = buildTreeByIdxes(
                [preStart + 1, preStart + numNodeLeftSide],
                [inStart, currentRootInorderIdx - 1]
            )

            currentRoot.right = buildTreeByIdxes(
                [preStart + numNodeLeftSide + 1, preEnd],
                [currentRootInorderIdx + 1, inEnd]
            )

            return currentRoot
        }

        root = buildTreeByIdxes(
            [0, preorder.length - 1],
            [0, inorder.length - 1]
        )

    }

    return root
};
```

# 99 给你二叉搜索树的根节点 root ，该树中的两个节点被错误地交换。请在不改变其结构的情况下，恢复这棵树。

```ts
const recoverTree = (root: TreeNode | null): void => {
  if (!root) {
    return;
  }

  /*
    inorder traverse can ensure the prevNode point to the top node in left sub tree
  */

  let prevNode: TreeNode = null;
  let frtBadNode: TreeNode = null;
  let sndBadNode: TreeNode = null;

  {
    const traverse = (node: TreeNode) => {
      if (!node) return;
      traverse(node.left);

      // currentNode should always greater than prev node
      if (prevNode && node.val < prevNode.val) {
        frtBadNode = frtBadNode === null ? prevNode : frtBadNode;
        sndBadNode = node;
      }

      prevNode = node;
      traverse(node.right);
    };
    traverse(root);
  }

  const temp = sndBadNode.val;
  sndBadNode.val = frtBadNode.val;
  frtBadNode.val = temp;
};
```

# 110. 平衡二叉树

```
给定一个二叉树，判断它是否是高度平衡的二叉树。

本题中，一棵高度平衡二叉树定义为：

一个二叉树每个节点 的左右两个子树的高度差的绝对值不超过 1 。
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

function isBalanced(root: TreeNode | null): boolean {
  if (!root) return true;
  return isBalanced.hight(root) >= 0;
}

isBalanced.hight = (node: TreeNode | null) => {
  if (!node) return 0;
  const lH = isBalanced.hight(node.left);
  if (lH === -1) {
    return -1;
  }
  const rH = isBalanced.hight(node.right);
  if (rH === -1) {
    return -1;
  }

  if (Math.abs(lH - rH) > 1) {
    return -1;
  }

  return Math.max(lH, rH) + 1;
};
```

# 104. 二叉树的最大深度

```ts
function maxDepth(root: TreeNode | null): number {
  if (!root) {
    return 0;
  }

  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

# 112. 路径总和

```
给你二叉树的根节点 root 和一个表示目标和的整数 targetSum ，判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。

叶子节点 是指没有子节点的节点。
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

function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  return dfs(root, targetSum) === 0;
}

const dfs = (root: TreeNode | null, tgtSum: number) => {
  if (!root && tgtSum !== 0) {
    return -1;
  } else if (!root && tgtSum === 0) {
    return 0;
  }

  if (tgtSum < 0) {
    return -1;
  }

  const tgt = tgtSum - root.val;
  const left = dfs(root.left, tgt);
  const right = dfs(root.right, tgt);

  if (left === 0 || right === 0) {
    return 0;
  }
  return -1;
};
```

# 112. 路径总和

```
给你二叉树的根节点 root 和一个表示目标和的整数 targetSum ，判断该树中是否存在 根节点到叶子节点 的路径，这条路径上所有节点值相加等于目标和 targetSum 。
叶子节点 是指没有子节点的节点。
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

function hasPathSum(root: TreeNode | null, targetSum: number): boolean {
  if (!root) return false;
  return dfs(root, 0, targetSum);
}

const dfs = (root: TreeNode | null, sum: number, tgt: number) => {
  if (!root) {
    return false;
  }
  if (!root.left && !root.right) {
    return sum + root.val === tgt;
  }
  const lv = dfs(root.left, sum + root.val, tgt);
  const rv = dfs(root.right, sum + root.val, tgt);
  return lv || rv;
};
```

# 108. 将有序数组转换为二叉搜索树

```
给你一个整数数组 nums ，其中元素已经按 升序 排列，请你将其转换为一棵 高度平衡 二叉搜索树。

高度平衡 二叉树是一棵满足「每个节点的左右两个子树的高度差的绝对值不超过 1 」的二叉树。
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
type TreeRange = [start:number, end:number]
function sortedArrayToBST(nums: number[]): TreeNode | null {
    if(!nums.length) {
        return null
    }
    return doMakeTree(
        nums,
        [0, nums.length - 1]
    )

};

const doMakeTree = (nums:number[], range:TreeRange) => {
    if(range[0] > range[1]){
        return null
    }
    const mid = range[0] + ((range[1] - range[0]) >> 1)
    const node = new TreeNode(nums[mid])
    node.left = doMakeTree(nums, [range[0], mid - 1])
    node.right = doMakeTree(nums, [mid + 1, range[1]])
    return node
}

```
