# Canvas

> introduced by Apple for Webkit, for Mac OS X's Dashboard.

- default size 300 \* 150, can override via html attribute
- need js context to dynamically draw things
- format:

```html
<canvas id="id" width="150" height="150"></canvas>
```

- width and height is optional also can be decorate by css

- html fallback

```html
<canvas id="id" width="150" height="150">
  inner text will show if a canvas is not support, therefore we need the close
  tag
</canvas>
```

## rendering context

js communicate with the canvas via the rendering context, a canvas provides one or several rendering context for draw and process the printing content. we will focus on the 2d rendering context

```js
const canvas = document.getElementById('id');
let context;
if (canvas.getContext) {
  context = canvas.getContext('2d');
} else {
  context = fallbackRenderingContext();
}
```

- simple example

```html
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      canvas {
        border: 1px solid black;
      }
    </style>
  </head>
  <body>
    <canvas id="id" width="150" height="150"> canvas is not support </canvas>

    <script>
      const cvs = document.querySelector('#id');
      function draw() {
        if (!cvs.getContext) {
          return;
        }
        const ctx = cvs.getContext('2d');
        ctx.fillStyle = 'rgb(200,0,0,0.5)';
        ctx.fillRect(10, 10, 50, 50);
        ctx.fillStyle = 'rgb(0,0,200,0.2)';
        ctx.fillRect(30, 30, 55, 50);
      }
      draw();
    </script>
  </body>
</html>
```
