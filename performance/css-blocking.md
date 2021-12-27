# CSS 阻塞

css 下载会阻塞 render tree 的构建， 不会阻塞 DOM 树构建，但是在 CSSOM（style rules）构建完成之前， 页面不会开始渲染。
js 下载会阻塞后续 DOM 构建， 但是前面已经就绪的内容会进行渲染。
例子：

```js
app.use('/css/:cssName', (req, res) => {
  const file = req.params.cssName;
  setTimeout(() => {
    res.sendFile(file, { root: path.join(__dirname, '../css') });
  }, 5000);
});

app.use('/js/:jsName', (req, res) => {
  const file = req.params.jsName;
  setTimeout(() => {
    res.sendFile(file, { root: path.join(__dirname, '../js') });
  }, 1000);
});
```

```html
<html>
<head>
  <link rel="stylesheet" href="/css/xxx.css">
</head>
<body>
  <p>111111111111</p>
  <s>
</body>
</html>
```
