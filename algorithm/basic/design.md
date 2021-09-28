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
