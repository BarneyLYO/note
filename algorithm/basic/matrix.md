# 54. 螺旋矩阵

```
给你一个 m 行 n 列的矩阵 matrix ，请按照 顺时针螺旋顺序 ，返回矩阵中的所有元素。
```

```ts
function spiralOrder(matrix: number[][]): number[] {
  const res: number[] = [];
  const row = matrix.length;
  const column = matrix[0].length;
  let top = 0;
  let down = row - 1;
  let left = 0;
  let right = column - 1;
  while (true) {
    for (let i = left; i <= right; i++) {
      res.push(matrix[top][i]);
    }
    top++;
    if (top > down) {
      break;
    }

    for (let i = top; i <= down; i++) {
      res.push(matrix[i][right]);
    }
    right--;
    if (right < left) {
      break;
    }

    for (let i = right; i >= left; i--) {
      res.push(matrix[down][i]);
    }
    down--;
    if (down < top) {
      break;
    }

    for (let i = down; i >= top; i--) {
      res.push(matrix[i][left]);
    }
    left++;
    if (left > right) {
      break;
    }
  }
  return res;
}
```

# 59. 螺旋矩阵 II

```
给你一个正整数 n ，生成一个包含 1 到 n2 所有元素，且元素按顺时针顺序螺旋排列的 n x n 正方形矩阵 matrix 。
```

```ts
function generateMatrix(n: number): number[][] {
  const target = n * n;
  let num = 1;
  const matrix = new Array(n).fill(n).map(() => new Array(n));

  let top = 0;
  let left = 0;
  let right = n - 1;
  let down = n - 1;
  while (num <= target) {
    for (let i = left; i <= right; i++) {
      matrix[top][i] = num++;
    }
    top++;
    if (top > down) {
      break;
    }

    for (let i = top; i <= down; i++) {
      matrix[i][right] = num++;
    }
    right--;
    if (right < left) {
      break;
    }

    for (let i = right; i >= left; i--) {
      matrix[down][i] = num++;
    }
    down--;
    if (down < top) {
      break;
    }

    for (let i = down; i >= top; i--) {
      matrix[i][left] = num++;
    }
    left++;
    if (left > right) {
      break;
    }
  }
  return matrix;
}
```

# 剑指 Offer 04. 二维数组中的查找

```
在一个 n * m 的二维数组中，每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个高效的函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。
```

```ts
function findNumberIn2DArray(matrix: number[][], target: number): boolean {
  if (!matrix.length || !matrix[0].length) {
    return false;
  }
  let row = 0;
  let col = matrix[0].length - 1;
  while (inRange(matrix, row, col)) {
    const res = matrix[row][col];
    if (res === target) {
      return true;
    } else if (res < target) {
      row++;
    } else if (res > target) {
      col--;
    }
  }
  return false;
}

const inRange = (matrix: number[][], r: number, c: number) => {
  if (r < 0 || r >= matrix.length) {
    return false;
  }
  if (c < 0 || c >= matrix[0].length) {
    return false;
  }
  return true;
};
```

# 48. 旋转图像

```
给定一个 n × n 的二维矩阵 matrix 表示一个图像。请你将图像顺时针旋转 90 度。

你必须在 原地 旋转图像，这意味着你需要直接修改输入的二维矩阵。请不要 使用另一个矩阵来旋转图像。
```

```ts
/**
 Do not return anything, modify matrix in-place instead.
 */
function rotate(matrix: number[][]): void {
  const m = matrix;
  const n = matrix.length;

  for (let x = 0; x < n >> 1; x++) {
    for (let y = 0; y < n; y++) {
      const right = n - 1 - x;
      [m[x][y], m[right][y]] = [m[right][y], m[x][y]];
    }
  }

  for (let x = 0; x < n; x++) {
    for (let y = 0; y < x; y++) {
      [m[x][y], m[y][x]] = [m[y][x], m[x][y]];
    }
  }
}
```

# 36. 有效的数独

```
请你判断一个 9x9 的数独是否有效。只需要 根据以下规则 ，验证已经填入的数字是否有效即可。

数字 1-9 在每一行只能出现一次。
数字 1-9 在每一列只能出现一次。
数字 1-9 在每一个以粗实线分隔的 3x3 宫内只能出现一次。（请参考示例图）
数独部分空格内已填入了数字，空白格用 '.' 表示。

注意：

一个有效的数独（部分已被填充）不一定是可解的。
只需要根据以上规则，验证已经填入的数字是否有效即可。
```

```ts
function isValidSudoku(board: string[][]): boolean {
  const rows = initArr(board.length);
  const cols = initArr(board.length);
  const sqrs = initArr(board.length);

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board.length; c++) {
      const slot = board[r][c];
      const row = rows[r];
      const col = cols[c];
      const squire = sqrs[getSquireIdx(r, c)];

      if (slot === '.') {
        continue;
      }

      const num = Number(slot);
      if (row[num - 1] || col[num - 1] || squire[num - 1]) {
        return false;
      }

      row[num - 1] = true;
      col[num - 1] = true;
      squire[num - 1] = true;
    }
  }

  return true;
}

const initArr = (n: number) =>
  Array.from({ length: n }, () => new Array(n).fill(false));
const getSquireIdx = (r: number, c: number) =>
  ((r / 3) | 0) * 3 + ((c / 3) | 0);
```

# 79. 单词搜索

```
给定一个 m x n 二维字符网格 board 和一个字符串单词 word 。如果 word 存在于网格中，返回 true ；否则，返回 false 。

单词必须按照字母顺序，通过相邻的单元格内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母不允许被重复使用。
```

```ts
function exist(board: string[][], word: string): boolean {
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] !== word[0]) {
        continue;
      }

      if (exist.dfs(board, word, 0, r, c)) {
        return true;
      }
    }
  }

  return false;
}

exist.DIRECTIONS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1]
];

exist.dfs = (
  board: string[][],
  tgt: string,
  k: number,
  r: number,
  c: number
) => {
  const { dfs, inArea, DIRECTIONS } = exist;
  if (board[r][c] !== tgt[k]) {
    return false;
  }

  if (k === tgt.length - 1) {
    return true;
  }

  const char = board[r][c];
  board[r][c] = '-';

  for (let d of DIRECTIONS) {
    const rN = r + d[0];
    const cN = c + d[1];
    if (!inArea(board, rN, cN)) {
      continue;
    }
    if (board[rN][cN] === '-') {
      continue;
    }

    if (dfs(board, tgt, k + 1, rN, cN)) {
      return true;
    }
  }

  board[r][c] = char;
  return false;
};

exist.inArea = (board: string[][], r: number, c: number) => {
  if (r < 0 || r >= board.length) {
    return false;
  }
  if (c < 0 || c >= board[r].length) {
    return false;
  }
  return true;
};
```
