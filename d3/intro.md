# SVG

- smail face

  <svg width=100 height=100 style="border: 1px dashed">
  <path d='M25,25 L25,35 M75,25 L75,35 M15,75 C20,100 85,90 85,75' fill="none" stroke="#000" stroke-width=2/>
  </svg>

| tag                      | attributes    | optional attributes   |
| ------------------------ | ------------- | --------------------- |
| <code>&lt;rect></code>   | width, height | x, y                  |
| <code>&lt;circle></code> | r             | cx, cy                |
| <code>&lt;path></code>   | d             |                       |
| <code>&lt;text></code>   |               | x, y, text-anchor, dy |

| path command        | meaning      |
| ------------------- | ------------ |
| M[x,y]              | MoveTo       |
| L[x,y]              | LineTo       |
| Q[pX,pY]            | Bézier curve |
| C[p1X,p1Y][p2x,p2y] | Bézier curve |
