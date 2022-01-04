# css function

## color function

> for [border|outline|background|caret]-color, color,box-shadow

- rgb(r,g,b)
- rgba(r,g,b,a)
- hsl(h,s,l)
- hsla(h,s,l,a)
- color()

## attribute function

- attr()
- var(): get variable

## method function

- clamp() 区间范围值

```css
.elem {
  /* clamp(min,default,max)  */
  width: clamp(100px, 25vw, 300px);
}
```

- counter() 计数器
- calc() 计算:
  > 计量单位都能作为参数参加计算，number, px,em,rem,vw,vh,deg,turn,s,ms,%,可以用()提升运算等级， 每个运算符号必须使用空格间隔，可以混合不同单位计算

```css
/* 
    滚动条spa中路由不抖动
    100vw == 视图宽度
    100% == 内容宽度 
  */
.elem {
  padding-right: calc(100vw - 100%);
}
```

- max() 可以与 calc 嵌套使用，限制最大值
- min()， 限制最小值

```css
.elem {
  width: min(1200px, 100%);
}
/* equivelent */
.elem1 {
  width: 100%;
  max-width: 1200px;
}
```

## background function

- url()
- element()
- image-set()
- linear-gradient()
- radial-gradient()
- conic-gradient()
- repeating-linear-gradient()
- repeating-radial-gradient()
- repeating-conic-gradient()

## filer function

- blur() 模糊
- brightness() 亮度
- contrast() 对比度
- drop-shadow() 阴影
- grayscale() 灰度
- hue-rotate() 色相旋转
- invert() 反相
- opacity() 透明度
- saturate() 饱和度
- sepia() 褐色

## image function, 配合 clip-path 使用

- circle()
- ellipse()
- inset()
- path()
- polygon()

## transform function

- matrix()
- matrix3d()
- perspective()
- rotate()
- rotate[X|Y|Z]
- scale()
- scale[X|Y|Z|3d]()
- skew[X|Y]()
- translate[3d|X|Y|Z]()

## animation function

- cubic-bezier()
- steps()
