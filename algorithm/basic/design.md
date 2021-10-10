- nested iterator

```ts
class NestedInteger {
      constructor(value?: number) {
          ...
      };

      isInteger(): boolean {
          ...
      };

      getInteger(): number | null {
          ...
      };

      setInteger(value: number) {
          ...
      };

      add(elem: NestedInteger) {
          ...
      };

      getList(): NestedInteger[] {
          ...
      };
  };

class NestedIterator {
    private list:number[]
    constructor(nestedList: NestedInteger[]) {
        this.list = NestedIterator.reduceNestedList(nestedList)
    }

    static reduceNestedList(nestedList:NestedInteger[]) : number[] {
        return nestedList.reduce((flattenList, current) => {
            let arr = [...flattenList]
            if(current.isInteger()) {
                arr.push(current.getInteger())
            } else {
                arr = arr.concat(NestedIterator.reduceNestedList(current.getList()))
            }
            return arr
        },[])
    }


    hasNext(): boolean {
		return !!this.list.length
    }

	next(): number {
        return this.list.shift()
    }
}

// or lazy eval
class NestedIterator {
    copy: NestedInteger[];
    constructor(nestedList: NestedInteger[]) {
        this.copy = [...nestedList];
    }

    hasNext(): boolean {
        while (this.copy.length && !this.copy[0].isInteger()) {
            // 如果0号是列表，就拆开
            this.copy = this.copy.shift().getList().concat(this.copy);
        }
        // console.log(this.copy)
        return !!this.copy.length;
    }

    next(): number {
        return this.copy.shift().getInteger();
    }
}
```

# 8. 字符串转换整数 (atoi)

```
请你来实现一个 myAtoi(string s) 函数，使其能将字符串转换成一个 32 位有符号整数（类似 C/C++ 中的 atoi 函数）。

函数 myAtoi(string s) 的算法如下：

读入字符串并丢弃无用的前导空格
检查下一个字符（假设还未到字符末尾）为正还是负号，读取该字符（如果有）。 确定最终结果是负数还是正数。 如果两者都不存在，则假定结果为正。
读入下一个字符，直到到达下一个非数字字符或到达输入的结尾。字符串的其余部分将被忽略。
将前面步骤读入的这些数字转换为整数（即，"123" -> 123， "0032" -> 32）。如果没有读入数字，则整数为 0 。必要时更改符号（从步骤 2 开始）。
如果整数数超过 32 位有符号整数范围 [−231,  231 − 1] ，需要截断这个整数，使其保持在这个范围内。具体来说，小于 −231 的整数应该被固定为 −231 ，大于 231 − 1 的整数应该被固定为 231 − 1 。
返回整数作为最终结果。
注意：

本题中的空白字符只包括空格字符 ' ' 。
除前导空格或数字后的其余字符串外，请勿忽略 任何其他字符。
```

```ts
const ZERO_CODE = '0'.charCodeAt(0);
const NINE_CODE = '9'.charCodeAt(0);
const MAX = 2 ** 31 - 1;
const MIN = (-2) ** 31;

function myAtoi(s: string): number {
  let idx = 0;
  while (s[idx] === ' ') {
    idx++;
  }

  let sign = 1;
  const current = s[idx];
  if (current === '+') {
    idx++;
  } else if (current === '-') {
    idx++;
    sign = -1;
  }

  let res = 0;
  while (idx < s.length) {
    const currentCharCode = s[idx].charCodeAt(0);
    if (currentCharCode > NINE_CODE || currentCharCode < ZERO_CODE) {
      break;
    }

    if (!isFinite(res)) {
      return res > 0 ? MAX : MIN;
    }

    res = res * 10 + (currentCharCode - ZERO_CODE) * sign;
    idx++;
  }

  if (res >= MAX) {
    return MAX;
  }

  if (res <= MIN) {
    return MIN;
  }

  return res;
}
```

# 284. 顶端迭代器

```
请你设计一个迭代器，除了支持 hasNext 和 next 操作外，还支持 peek 操作。

实现 PeekingIterator 类：

PeekingIterator(int[] nums) 使用指定整数数组 nums 初始化迭代器。
int next() 返回数组中的下一个元素，并将指针移动到下个元素处。
bool hasNext() 如果数组中存在下一个元素，返回 true ；否则，返回 false 。
int peek() 返回数组中的下一个元素，但 不 移动指针。
```

```ts
/**
 * // This is the Iterator's API interface.
 * // You should not implement it, or speculate about its implementation
 * class Iterator {
 *      hasNext(): boolean {}
 *
 *      next(): number {}
 * }
 */

class PeekingIterator {
  // @ts-ignore
  private iterator: Iterator;
  private current: any = void 0;
  // @ts-ignore
  constructor(iterator: Iterator) {
    this.iterator = iterator;
    this.checkAndMoveCurrentPointer();
  }

  private checkAndMoveCurrentPointer(): void {
    if (this.iterator.hasNext()) {
      this.current = this.iterator.next();
      return;
    }
    this.current = void 0;
  }

  peek(): number {
    return this.current;
  }

  next(): number {
    const ret = this.current;
    this.checkAndMoveCurrentPointer();
    return ret;
  }

  hasNext(): boolean {
    return !!this.current;
  }
}

/**
 * Your PeekingIterator object will be instantiated and called as such:
 * var obj = new PeekingIterator(iterator)
 * var param_1 = obj.peek()
 * var param_2 = obj.next()
 * var param_3 = obj.hasNext()
 */
```

# 348. 设计井字棋

```
请在 n × n 的棋盘上，实现一个判定井字棋（Tic-Tac-Toe）胜负的神器，判断每一次玩家落子后，是否有胜出的玩家。

在这个井字棋游戏中，会有 2 名玩家，他们将轮流在棋盘上放置自己的棋子。

在实现这个判定器的过程中，你可以假设以下这些规则一定成立：

      1. 每一步棋都是在棋盘内的，并且只能被放置在一个空的格子里；

      2. 一旦游戏中有一名玩家胜出的话，游戏将不能再继续；

      3. 一个玩家如果在同一行、同一列或者同一斜对角线上都放置了自己的棋子，那么他便获得胜利。

示例:

给定棋盘边长 n = 3, 玩家 1 的棋子符号是 "X"，玩家 2 的棋子符号是 "O"。

TicTacToe toe = new TicTacToe(3);

toe.move(0, 0, 1); -> 函数返回 0 (此时，暂时没有玩家赢得这场对决)
|X| | |
| | | |    // 玩家 1 在 (0, 0) 落子。
| | | |

toe.move(0, 2, 2); -> 函数返回 0 (暂时没有玩家赢得本场比赛)
|X| |O|
| | | |    // 玩家 2 在 (0, 2) 落子。
| | | |

toe.move(2, 2, 1); -> 函数返回 0 (暂时没有玩家赢得比赛)
|X| |O|
| | | |    // 玩家 1 在 (2, 2) 落子。
| | |X|

toe.move(1, 1, 2); -> 函数返回 0 (暂没有玩家赢得比赛)
|X| |O|
| |O| |    // 玩家 2 在 (1, 1) 落子。
| | |X|

toe.move(2, 0, 1); -> 函数返回 0 (暂无玩家赢得比赛)
|X| |O|
| |O| |    // 玩家 1 在 (2, 0) 落子。
|X| |X|

toe.move(1, 0, 2); -> 函数返回 0 (没有玩家赢得比赛)
|X| |O|
|O|O| |    // 玩家 2 在 (1, 0) 落子.
|X| |X|

toe.move(2, 1, 1); -> 函数返回 1 (此时，玩家 1 赢得了该场比赛)
|X| |O|
|O|O| |    // 玩家 1 在 (2, 1) 落子。
|X|X|X|
 

进阶:
您有没有可能将每一步的 move() 操作优化到比 O(n2) 更快吗?
```

```ts
const makeArr = (n:number) => Array.from({length:n}, () => 0)

class TicTacToe {
    private rows:number[]
    private cols:number[]
    private diag:[left:number, right:number]

    constructor(n: number) {
        this.rows = makeArr(n)
        this.cols = makeArr(n)
        this.diag = [0,0]
    }

    private _updateAndCheckWinner(row:number, col:number, player:number) {
        const score = player === 1 ? 1 : -1
        const max = this.rows.length * score
        this.rows[row] += score
        if(this.rows[row] === max) {
            return player
        }

        this.cols[col] += score
        if(this.cols[col] === max) {
            return player
        }

        if(row === col) {
            this.diag[0] += score
            if(this.diag[0] === max) {
                return player
            }
        }
        if(row === this.rows.length - 1 - col) {
            this.diag[1] += score
            if(this.diag[1] === max) {
                return player
            }
        }

        return 0
    }

    move(row: number, col: number, player: number): number {
        return this._updateAndCheckWinner(row, col, player)
    }
}

/**
 * Your TicTacToe object will be instantiated and called as such:
 * var obj = new TicTacToe(n)
 * var param_1 = obj.move(row,col,player)
 */
```

# 227. 基本计算器 II

```
给你一个字符串表达式 s ，请你实现一个基本计算器来计算并返回它的值。
整数除法仅保留整数部分。
1 <= s.length <= 3 * 105
s 由整数和算符 ('+', '-', '*', '/') 组成，中间由一些空格隔开
s 表示一个 有效表达式
表达式中的所有整数都是非负整数，且在范围 [0, 231 - 1] 内
题目数据保证答案是一个 32-bit 整数
```

```ts
function calculate(s: string): number {
  const processed = s.replace(/\s/g, '');
  let preSymbol = '+'; // all val are positive
  let preValue = 0; //current read number
  const stack: number[] = [];
  for (let char of processed) {
    if (!isNaN(-char)) {
      // value might be greater than 10
      preValue = preValue * 10 + Number(char);
      continue;
    }
    const operation = calculate.strategies[preSymbol];
    operation(stack, preValue);
    preSymbol = char;
    preValue = 0;
  }
  //do the final calculation
  calculate.strategies[preSymbol](stack, preValue);

  return stack.reduce((sum, c) => sum + c);
}

calculate.strategies = {
  '+': (stack: number[], preValue: number) => {
    stack.push(preValue);
  },
  '-': (stack: number[], preValue: number) => {
    stack.push(-preValue);
  },
  '*': (stack: number[], preValue: number) => {
    stack.push(stack.pop() * preValue);
  },
  '/': (stack: number[], preValue: number) => {
    stack.push((stack.pop() / preValue) | 0); // positive cal
  }
};
```

# 380. O(1) 时间插入、删除和获取随机元素

```
实现RandomizedSet 类：

RandomizedSet() 初始化 RandomizedSet 对象
bool insert(int val) 当元素 val 不存在时，向集合中插入该项，并返回 true ；否则，返回 false 。
bool remove(int val) 当元素 val 存在时，从集合中移除该项，并返回 true ；否则，返回 false 。
int getRandom() 随机返回现有集合中的一项（测试用例保证调用此方法时集合中至少存在一个元素）。每个元素应该有 相同的概率 被返回。
你必须实现类的所有函数，并满足每个函数的 平均 时间复杂度为 O(1) 。

 

示例：

输入
["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
[[], [1], [2], [2], [], [1], [2], []]
输出
[null, true, false, true, 2, true, false, 2]

解释
RandomizedSet randomizedSet = new RandomizedSet();
randomizedSet.insert(1); // 向集合中插入 1 。返回 true 表示 1 被成功地插入。
randomizedSet.remove(2); // 返回 false ，表示集合中不存在 2 。
randomizedSet.insert(2); // 向集合中插入 2 。返回 true 。集合现在包含 [1,2] 。
randomizedSet.getRandom(); // getRandom 应随机返回 1 或 2 。
randomizedSet.remove(1); // 从集合中移除 1 ，返回 true 。集合现在包含 [2] 。
randomizedSet.insert(2); // 2 已在集合中，所以返回 false 。
randomizedSet.getRandom(); // 由于 2 是集合中唯一的数字，getRandom 总是返回 2 。
 

提示：

-231 <= val <= 231 - 1
最多调用 insert、remove 和 getRandom 函数 2 * 105 次
在调用 getRandom 方法时，数据结构中 至少存在一个 元素。
```

```ts
class RandomizedSet {
  private valIdMap: Map<number, number> = new Map();
  private valList: number[] = [];

  insert(val: number): boolean {
    const { valIdMap, valList } = this;
    if (valIdMap.has(val)) {
      return false;
    }
    valList.push(val);
    const len = valList.length - 1;
    valIdMap.set(val, len);
    return true;
  }

  remove(val: number): boolean {
    const { valIdMap, valList } = this;

    if (!valIdMap.has(val)) {
      return false;
    }
    const idx = valIdMap.get(val);
    const len = valList.length;
    [valList[idx], valList[len - 1]] = [valList[len - 1], valList[idx]];
    this.valList.length = this.valList.length - 1;
    valIdMap.delete(val);
    valIdMap.set(valList[idx], idx);
    return true;
  }

  getRandom(): number {
    const randomIdx = (Math.random() * this.valList.length) | 0;
    return this.valList[randomIdx];
  }
}

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */
```
