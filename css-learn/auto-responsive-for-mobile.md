# Using rem to make auto-reponsive web

```js
const AutoResponse = (width) => {
  const target = document.documentElement;
  if (target.clientWidth >= 600) {
    target.style.fontSize = '80px';
    return;
  }
  target.style.fontSize = (target.clientWidth / width) * 100 + 'px';
};
```

and also we need to prevent 他和 user scale or shrink the page

```html
<meta
  name="viewport"
  content="
    width=device-width,
    user-scalable=no,
    initial-scale=1,
    minimum-scale=1,
    maximum-scale=1
  "
/>
```

if broswer support the vw
we can

```css
html {
  font-size: calc(100vw / 7.5);
}
```
