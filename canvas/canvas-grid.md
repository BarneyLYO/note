# canvas grid system

- unit: px
- init-start-point: 左上角

## painting: rect

- fillRect(x,y,w,h): 绘制一个填充的矩形
- strokeRect(x,y,w,h): 绘制一个矩形边框
- clearRect(x,y,w,h): 清除指定矩形区域，让清除部分完全透明

## painting: path

a path is connected dots with difference color and width, a path or subpath is self closing

### steps for build a path

1. define the start point: beginPath(): start a path, command to the path now
2. using draw command
   2.1. moveTo(x,y): move to start point(笔触摸)
   2.2. lineTo(x,y): start point line to
   3.3. arc(x, y, radius, startAngle, endAngle [, counterclockwise])

3. close path: closePath(): path command finished, command to context again
4. one a path is close, you can use stroke or fill to render the path, stroke() or fill()

- when call beginPath, the pathList will be empty
- closePath() is not manditory, when call it, the current point will draw a current movedPoint to the begain path, if the graph is self closed(move to point is begain point, do nothing)

### pating: arc

用 arc 方法来画弧形或圆形，

```js
arc(x, y, radius, startAngle, endAngle, anticlockwise);
```

- x,y 圆心
- radius 半径
- startAngle, endAngle 起始点和结束点的弧度, 弧度测量相对于 x 轴
- anticlockwise: false 顺时针
- 弧度 = （Math.PI / 180) \* degrees

### pating: rect/bezier curve

## path2D object

Path2D object 让我们可以快取和记录绘图指令， 方便快速重复绘制图

```js
new Path2D()
new Path2D(anotherPath2D)
new Path2D(d) // svg path
const p = Path2D()
p.addPath(path[,transfotm])

```

example

```js
const draw = () => {
  const canvas = document.getElementById('canvas');
  if (!canvas.getContext) {
    return;
  }

  const rectangle = new Path2D();
  reactangle.rect(10, 10, 50, 50);

  const circle = new Path2D();
  circle.moveTo(125, 35);
  circle.arc(100, 35, 25, 0, 2 * Math.PI);

  ctx.stroke(reactangle);
  ctx.fill(circle);
};
```

- we can also use context to draw svg paths

```js
const p = new Path2D('M10 10 h 80 v80 h -80 Z');
```

## pathing color

- fillStyle = color string
- strokeStyle = color string
