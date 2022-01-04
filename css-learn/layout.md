# layout

layout in css is stupid, and in general is stupid

## clear fix

float 会使节点脱流导致父节点的高度坍塌，若不对父节点显式声明高度则很有必要给父节点清楚浮动。

## classic 全局布局

```html
<header></header>
<aside></aside>
<main></main>
<footer></footer>
```

<strong>position + left/right/top/bottom</strong>
<br/>
header/footer/main? <== left:0 & right:0
header <== top:0
bottom <== bottom:0

```scss
.fullscreen-layout {
  position: relative;
  width: 400px;
  height: 400px;

  header,
  footer,
  main {
    position: absolute;
    left: 0;
    right: 0;
  }
  header {
    top: 0;
    height: 50px;
    background-color: #f66;
  }
  footer {
    bottom: 0;
    height: 50px;
    background-color: #66f;
  }
  main {
    top: 50px;
    bottom: 50px;
    background-color: #3c9;
  }
}
```

## flex

弹性盒子模型，display：flex 会令子节点横向排列，需要声明 flex-direction：column 改变子节点的排列方向

```scss
.flex_layout {
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 400px;
  header {
    height: 50px;
    background-color: #f66;
  }
  footer {
    height: 50px;
    background-color: #66f;
  }
  main {
    flex: 1;
    background-color: #3c9;
  }
}
```

## 多列布局

经典的两列布局由左右两列组成，一列宽度固定，一列宽度自适应，两列高度固定且相等
<strong>float + margin-left/right</strong>

```scss
.two-column {
  width: 400px;
  height: 400px;
  .left {
    float: left;
    width: 100px;
    height: 100%;
    background-color: #f66;
  }
  .right {
    margin-left: 100px;
    height: 100%;
    background-color: #66f;
  }
}
```

## 圣杯布局和双飞翼布局

flex 万岁

```scss
.grail-layout {
  display: flex;
  width: 400px;
  height: 400px;
  .left {
    width: 100px;
    background-color: #f66;
  }
  .center {
    flex: 1;
    background-color: #3c9;
  }
  .right {
    width: 100px;
    background-color: #66f;
  }
}
```
