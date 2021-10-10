# 208. 实现 Trie (前缀树)

```
Trie（发音类似 "try"）或者说 前缀树 是一种树形数据结构，用于高效地存储和检索字符串数据集中的键。这一数据结构有相当多的应用情景，例如自动补完和拼写检查。

请你实现 Trie 类：

Trie() 初始化前缀树对象。
void insert(String word) 向前缀树中插入字符串 word 。
boolean search(String word) 如果字符串 word 在前缀树中，返回 true（即，在检索之前已经插入）；否则，返回 false 。
boolean startsWith(String prefix) 如果之前已经插入的字符串 word 的前缀之一为 prefix ，返回 true ；否则，返回 false 。
```

```ts
class Trie {
  private alphabet = createAlphabet();
  public isEnd: boolean = false;

  insert(word: string): void {
    if (!word) return;
    let current: Trie = this;
    for (let i = 0; i < word.length; i++) {
      const idx = getIdx(word[i]);
      if (!current.alphabet[idx]) {
        current.alphabet[idx] = new Trie();
      }
      current = current.alphabet[idx];
    }
    current.isEnd = true;
  }

  traverse(word: string): Trie {
    let current: Trie = this;
    for (let i = 0; i < word.length; i++) {
      const idx = getIdx(word[i]);
      if (!current.alphabet[idx]) {
        return null;
      }
      current = current.alphabet[idx];
    }
    return current;
  }

  search(word: string): boolean {
    if (!word) return false;
    const last = this.traverse(word);
    if (!last) {
      return false;
    }
    return last.isEnd;
  }

  startsWith(prefix: string): boolean {
    if (!prefix) return false;
    return !!this.traverse(prefix);
  }
}

const createAlphabet = (): Array<Trie | null> =>
  Array.from({ length: 26 }).fill(null) as null[];
const getIdx = (char: string) => char.charCodeAt(0) - 'a'.charCodeAt(0);
```

# 212. 单词搜索 II

```
给定一个 m x n 二维字符网格 board 和一个单词（字符串）列表 words，找出所有同时在二维网格和字典中出现的单词。

单词必须按照字母顺序，通过 相邻的单元格 内的字母构成，其中“相邻”单元格是那些水平相邻或垂直相邻的单元格。同一个单元格内的字母在一个单词中不允许被重复使用。
```

```ts
function findWords(board: string[][], words: string[]): string[] {
  const { dfs } = findWords;
  const trie = new Trie();
  for (let w of words) {
    trie.insert(w);
  }
  const ans = new Set<string>();
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      dfs(board, trie, ans, '', r, c);
    }
  }
  return [...ans];
}

findWords.inArea = (board: string[][], r: number, c: number) => {
  if (r < 0 || r > board.length - 1) {
    return false;
  }
  if (c < 0 || c > board[r].length - 1) {
    return false;
  }
  return true;
};

findWords.dfs = (
  board: string[][],
  trie: Trie,
  ans: Set<string>,
  word: string,
  r: number,
  c: number
) => {
  const { inArea, dfs } = findWords;
  if (!inArea(board, r, c)) {
    return;
  }

  if (board[r][c] === '-') {
    return;
  }

  const ch = board[r][c];
  let w = word + ch;
  if (!trie.startsWith(w)) {
    return;
  }
  if (trie.search(w)) {
    ans.add(w);
    trie.remove(w);
  }

  board[r][c] = '-';
  dfs(board, trie, ans, w, r + 1, c);
  dfs(board, trie, ans, w, r - 1, c);
  dfs(board, trie, ans, w, r, c - 1);
  dfs(board, trie, ans, w, r, c + 1);
  board[r][c] = ch;
};

class Trie {
  private nexts = new Map<string, Trie>();
  public isEnd: boolean = false;

  insert(word: string): void {
    if (!word) return;
    let current: Trie = this;
    for (let i = 0; i < word.length; i++) {
      if (!current.nexts.has(word[i])) {
        current.nexts.set(word[i], new Trie());
      }
      current = current.nexts.get(word[i]);
    }
    current.isEnd = true;
  }

  getChild(char: string) {
    return this.nexts.get(char);
  }

  traverse(word: string): Trie {
    let current: Trie = this;
    for (let i = 0; i < word.length; i++) {
      const nxt = current.nexts.get(word[i]);
      if (!nxt) {
        return null;
      }
      current = nxt;
    }
    return current;
  }

  search(word: string): boolean {
    if (!word) return false;
    const last = this.traverse(word);
    if (!last) {
      return false;
    }
    return last.isEnd;
  }

  remove(word: string) {
    if (!word) return;
    const last = this.traverse(word);
    if (!last) {
      return;
    }
    if (last.isEnd) {
      last.isEnd = false;
    }
  }

  startsWith(prefix: string): boolean {
    if (!prefix) return false;
    return !!this.traverse(prefix);
  }
}
```
