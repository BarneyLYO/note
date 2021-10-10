# DFS

## Binary Tree

```ts
const dfs = (node: TreeNode) => {
  if (!node) return null;
  // pre
  dfs(node.left);
  // in
  dfs(node.right);
  // post
};
```

## Matrix

```ts
const dfs = (grid: any[][], row: number, column: number) => {
  if (!inArea(grid, row, column)) {
    return;
  }

  //
  if (grid[row][column] !== unvisited) {
    return;
  }
  grid[row][column] = visited;

  // up
  dfs(grid, row - 1, column);
  // down
  dfs(grid, row + 1, column);
  // left
  dfs(grid, row, column - 1);
  // right
  dfs(grid, row, column + 1);
};

dfs.inArea = (grid: any[][], row: number, column: number) => {
  if (row < 0 || row >= grid.length) {
    return false;
  }
  if (column < 0 || column >= grid[0].length) {
    return false;
  }
  return true;
};
```

### island

# 695. 岛屿的最大面积

```
给你一个大小为 m x n 的二进制矩阵 grid 。

岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。

岛屿的面积是岛上值为 1 的单元格的数目。

计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。
```

```ts
function maxAreaOfIsland(grid: number[][]): number {
  let res = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 1) {
        const area = maxAreaOfIsland.dfs(grid, r, c);
        res = Math.max(res, area);
      }
    }
  }
  return res;
}

maxAreaOfIsland.dfs = (grid: number[][], row: number, column: number) => {
  const { dfs, inArea } = maxAreaOfIsland;
  if (!inArea(grid, row, column)) {
    return 0;
  }

  if (grid[row][column] !== 1) {
    return 0;
  }
  grid[row][column] = 2;

  return (
    dfs(grid, row + 1, column) +
    dfs(grid, row - 1, column) +
    dfs(grid, row, column - 1) +
    dfs(grid, row, column + 1) +
    1
  );
};

maxAreaOfIsland.inArea = (grid: number[][], row: number, column: number) => {
  if (row < 0 || row >= grid.length) {
    return false;
  }
  if (column < 0 || column >= grid[row].length) {
    return false;
  }
  return true;
};
```

# 岛屿的周长

```
给定一个 row x col 的二维网格地图 grid ，其中：grid[i][j] = 1 表示陆地， grid[i][j] = 0 表示水域。

网格中的格子 水平和垂直 方向相连（对角线方向不相连）。整个网格被水完全包围，但其中恰好有一个岛屿（或者说，一个或多个表示陆地的格子相连组成的岛屿）。

岛屿中没有“湖”（“湖” 指水域在岛屿内部且不和岛屿周围的水相连）。格子是边长为 1 的正方形。网格为长方形，且宽度和高度均不超过 100 。计算这个岛屿的周长
```

```ts
function islandPerimeter(grid: number[][]): number {
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === 1) {
        return islandPerimeter.dfs(grid, r, c);
      }
    }
  }

  return 0;
}

islandPerimeter.inArea = (grid: number[][], row: number, col: number) => {
  if (row < 0 || row >= grid.length) {
    return false;
  }
  if (col < 0 || col >= grid[row].length) {
    return false;
  }
  return true;
};

islandPerimeter.dfs = (grid: number[][], row: number, col: number) => {
  const { inArea, dfs } = islandPerimeter;
  if (!inArea(grid, row, col)) {
    return 1;
  }

  if (grid[row][col] === 0) {
    return 1;
  }

  if (grid[row][col] === 2) {
    //visited
    return 0;
  }

  grid[row][col] = 2;

  return (
    dfs(grid, row - 1, col) +
    dfs(grid, row + 1, col) +
    dfs(grid, row, col - 1) +
    dfs(grid, row, col + 1)
  );
};
```

# 827. 最大人工岛

```
给你一个大小为 n x n 二进制矩阵 grid 。最多 只能将一格 0 变成 1 。

返回执行此操作后，grid 中最大的岛屿面积是多少？

岛屿 由一组上、下、左、右四个方向相连的 1 形成。
输入: grid = [[1, 0], [0, 1]]
输出: 3
解释: 将一格0变成1，最终连通两个小岛得到面积为 3 的岛屿。
输入: grid = [[1, 1], [1, 0]]
输出: 4
解释: 将一格0变成1，岛屿的面积扩大为 4。
输入: grid = [[1, 1], [1, 1]]
输出: 4
解释: 没有0可以让我们变成1，面积依然为 4。
```

```ts
function largestIsland(grid: number[][]): number {
  const idToSize = new Map<number, number>();
  let islandId = 2;
  let maxSize = 0;
  // get all size
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== 1) {
        continue;
      }
      const size = largestIsland.dfs(grid, islandId, r, c);
      maxSize = Math.max(maxSize, size);
      idToSize.set(islandId, size);
      islandId++;
    }
  }

  let sizeAfterConvert = 0;
  //get max size after change the ocean to land
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== 0) {
        continue;
      }
      const size = largestIsland.getOceanChangedSize(grid, idToSize, r, c);
      sizeAfterConvert = Math.max(size, sizeAfterConvert);
    }
  }

  return Math.max(maxSize, sizeAfterConvert);
}

largestIsland.getOceanChangedSize = (
  grid: number[][],
  idToSize: Map<number, number>,
  r: number,
  c: number
) => {
  const { inArea } = largestIsland;
  if (!inArea(grid, r, c)) {
    return 0;
  }
  if (grid[r][c] !== 0) {
    return 0;
  }
  const islandIdSet = new Set<number>();
  if (inArea(grid, r - 1, c) && grid[r - 1][c] > 1) {
    islandIdSet.add(grid[r - 1][c]);
  }
  if (inArea(grid, r + 1, c) && grid[r + 1][c] > 1) {
    islandIdSet.add(grid[r + 1][c]);
  }
  if (inArea(grid, r, c - 1) && grid[r][c - 1] > 1) {
    islandIdSet.add(grid[r][c - 1]);
  }
  if (inArea(grid, r, c + 1) && grid[r][c + 1] > 1) {
    islandIdSet.add(grid[r][c + 1]);
  }

  let size = 1; //ocean to island
  for (let id of islandIdSet) {
    size += idToSize.get(id);
  }

  return size;
};

largestIsland.dfs = (
  grid: number[][],
  islandId: number,
  r: number,
  c: number
) => {
  const { inArea, dfs } = largestIsland;
  if (!inArea(grid, r, c)) {
    return 0;
  }

  if (grid[r][c] !== 1) {
    return 0;
  }

  grid[r][c] = islandId;

  return (
    dfs(grid, islandId, r - 1, c) +
    dfs(grid, islandId, r + 1, c) +
    dfs(grid, islandId, r, c - 1) +
    dfs(grid, islandId, r, c + 1) +
    1
  );
};

largestIsland.inArea = (grid: number[][], r: number, c: number) => {
  if (r < 0 || r >= grid.length) {
    return false;
  }
  if (c < 0 || c >= grid[r].length) {
    return false;
  }
  return true;
};
```

# 200. 岛屿数量

```
给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。

岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。

此外，你可以假设该网格的四条边均被水包围。
```

```ts
function numIslands(grid: string[][]): number {
  let num = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] === '1') {
        num += numIslands.dfs(grid, r, c);
      }
    }
  }
  return num;
}

numIslands.dfs = (grid: string[][], r: number, c: number) => {
  const { inArea, dfs } = numIslands;
  if (!inArea(grid, r, c)) {
    return 0;
  }

  if (grid[r][c] !== '1') {
    return 0;
  }

  grid[r][c] = '2';
  return Math.max(
    1,
    dfs(grid, r - 1, c),
    dfs(grid, r + 1, c),
    dfs(grid, r, c - 1),
    dfs(grid, r, c + 1)
  );
};

numIslands.inArea = (grid: string[][], r: number, c: number) => {
  if (r < 0 || r >= grid.length) {
    return false;
  }
  if (c < 0 || c >= grid[r].length) {
    return false;
  }
  return true;
};
```

# 50. Pow(x, n)

```ts
const MIN_VAL_32 = 1 << 31;
function myPow(x: number, n: number): number {
  if (n === 0) {
    return 1;
  }
  if (n === 1) {
    return x;
  }

  if (n <= MIN_VAL_32) {
    if (Math.abs(x) === 1) {
      return 1;
    }
    if (x < 1) {
      return x ** n;
    } else {
      return 0;
    }
  }

  if (n < 0) {
    return myPow(1 / x, Math.abs(n));
  }
  if (n % 2 === 0) {
    return myPow(x * x, n >> 1);
  }
  return x * myPow(x, n - 1);
}
```

# 329. 矩阵中的最长递增路径

```
给定一个 m x n 整数矩阵 matrix ，找出其中 最长递增路径 的长度。

对于每个单元格，你可以往上，下，左，右四个方向移动。 你 不能 在 对角线 方向上移动或移动到 边界外（即不允许环绕）。
```

```ts
const DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, -1],
  [0, 1]
];

function longestIncreasingPath(matrix: number[][]): number {
  if (!matrix || !matrix.length || !matrix[0].length) {
    return 0;
  }
  let res: number = 0;

  const memo = Array.from({ length: matrix.length }, () =>
    new Array(matrix[0].length).fill(0)
  );
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      const len = longestIncreasingPath.move(matrix, r, c, memo);
      res = Math.max(len, res);
    }
  }
  return res;
}

longestIncreasingPath.move = (
  matrix: number[][],
  r: number,
  c: number,
  memo: number[][]
) => {
  if (memo[r][c]) {
    return memo[r][c];
  }
  const { inArea, move } = longestIncreasingPath;
  memo[r][c] = 1; // current point is increment path
  DIRECTIONS.forEach(d => {
    const newR = r + d[0];
    const newC = c + d[1];
    if (!inArea(matrix, newR, newC)) {
      return;
    }
    if (matrix[newR][newC] <= matrix[r][c]) {
      return;
    }

    memo[r][c] = Math.max(memo[r][c], move(matrix, newR, newC, memo) + 1);
  });
  return memo[r][c];
};

longestIncreasingPath.inArea = (matrix: number[][], r: number, c: number) => {
  if (r < 0 || r >= matrix.length) {
    return false;
  }
  if (c < 0 || c >= matrix[r].length) {
    return false;
  }
  return true;
};
```
