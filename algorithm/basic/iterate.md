# 最长公共前缀 编写一个函数来查找字符串数组中的最长公共前缀。如果不存在公共前缀，返回空字符串 ""。

```ts
const MAX_LEN = 200;
function longestCommonPrefix(strs: string[]): string {
  const shortest = strs.reduce(
    (len, str) => Math.min(str.length, len),
    MAX_LEN + 1
  );
  let prefix = '';
  for (let i = 0; i < shortest; i++) {
    let common: string;

    for (const str of strs) {
      if (!common) {
        common = str[i];
        continue;
      }

      if (common !== str[i]) {
        return prefix;
      }

      common = str[i];
    }

    prefix = prefix + common;
  }
  return prefix;
}
```
