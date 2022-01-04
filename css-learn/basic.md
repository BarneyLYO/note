# Type of CSS effect

1. 结构类: 通过结构选择器，Flex 布局方式，对齐方式.
2. 背景类: 多重背景，渐变背景，遮蔽
3. 点击类：通过状态选择器结合层次选择器的方式实现
4. 悬浮类：通过行为选择器结合层次选择器实现
5. 切换类：通过状态选择器结合层次选择器实现
6. 表单类：状态选择器互相结合实现

# 渲染过程

- 解析文件 (Paraller running)
  1. html => DOM TREE
     - BYTES => CHARS => TOKEN => NODES(blocking when script node) =>> DOM TREE
  2. css => CSSOM
     - BYTES => CHARS => TOKEN => NODES =>> CSSOM
  3. DOM TREE + CSSOM => RENDER TREE
- 绘制图层
  1. RENDER TREE => LAYOUT RENDER TREE (Reflow:回流/重排: 几何属性更变，改变渲染)
  2. LAYOUT RENDER TREE => PATING RENDER TREE (ReRender：重绘: 外观属性)
- 合成图层
  - PATING RENDER TREE + IMAGE LAYER => SCREEN

# 去个性化:

1. Normalize.css
2. reset.css

# 差异兼容

```css
-webkit-transform: translate(10px, 10px);
-moz-transform: translate(10px, 10px);
-ms-transform: translate(10px, 10px);
-o-transform: translate(10px, 10px);
transform: translate(10px, 10px); // 在最后
```

- webpack： postcss-loader or postcss-preset-env's autoprefix

# reflow

将整个页面填白，对内容重新渲染一次， 几何属性改变， 消耗大

# repating

更改外观属性，不会填白

# 属性分类

1. 几何属性

- 布局： dispaly， float， position， list， table， flex， columns， grid
- 尺寸： margin， padding， border， width， height

2. 外观属性：

- 界面： appearance， outline， backgroud， mask， box-shadow， box-reflect，filter， opacity，clip
- 文字： text，font，word

# 性能优化

回流必定引发重绘， 重绘不一定引发回流。
性能问题产生点：

1. 改变窗口大小
2. 修改盒模型
3. 增删样式
4. 重构布局
5. 重设尺寸
6. 改变字体
7. 改动文字

- 优化点：

1. visibility：hidden 替代 display：none
2. transform 代替 top，botton， right，left
3. no table 布局
4. 避免规则层级过多， css 解析从右往左， 样式层级过多影响 reflow-rerender 效率。max 3 层
5. 动态改变类名，不要动态改变 style
6. 将频繁 reflow 的节点设置为图层，`<video>` or `<iframe>`
7. 使用 requestAnimationFrame（=== setInterval(handler, 16)）作为动画帧代替 setInterval
