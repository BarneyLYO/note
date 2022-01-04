## selector and variable

## 基础选择器

| selector syn | name       |
| ------------ | ---------- |
| tag          | 标签选择   |
| #id          | id 选择器  |
| .class       | 类选择器   |
| \*           | 通配选择器 |

## 层次选择器

| selector syn | name               |
| ------------ | ------------------ |
| elA elB      | 后代选择器         |
| elA > elB    | 子代选择器         |
| elA + elB    | 相邻同胞选择器     |
| elA ~ elB    | 后面通用同胞选择器 |

## 集合选择器

| selector syn | name                                        |
| ------------ | ------------------------------------------- |
| elA , elB    | 并集选择器                                  |
| el.class     | 交集选择器（当什么 el 有什么 class 的时候） |

## 条件选择器

| selector sync | name                               |
| ------------- | ---------------------------------- |
| :lang         | 指定标记语言的元素                 |
| ：dir()       | 指定编写方向的元素                 |
| ：has()       | 包含指定元素的元素                 |
| ：is()        | 指定条件的元素                     |
| ：not         | 非指定条件的元素                   |
| ：where       | 指定条件的元素                     |
| ：scope       | 指定元素作为参考点                 |
| ：any-link    | 包含 href 的连接元素               |
| ：local-link  | 包含 href 且属于绝对地址的连接元素 |

# 行为选择器

| selector sync | name           |
| ------------- | -------------- |
| ：active      | 鼠标激活的元素 |
| ：hover       | 鼠标悬浮的元素 |
| ::selection   | 鼠标选中的元素 |

## 伪元素

:: before,在元素前插入元素
:: after, 在元素后插入元素

## 属性选择器

【attr】
【attr=val】
【attr*=val】 attr* is the any attr include val
【attr^=val】开头
【attr&=val】结尾
【attr ～=val】不要用
【attr|=val】不要用

## 结构选择器

:root, :empty, :first-letter,:first-line,:nth-child(n),:nth-last-child(n)
