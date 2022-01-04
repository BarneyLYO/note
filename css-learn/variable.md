# Variable

```css
:root {
  --bg-color: red;
}
.title {
  --another-var: red;
  background-color: var(--bg-color);
}
```

换肤色

```js
['red', 'blue', 'green'].forEach((color) => {
  const btn = document.getElementById(`${v}-theme-btn`);
  btn.addEventListener('click', () =>
    document.body.style.setProperty('--bg-color', v)
  );
});
```

## 条形加载条

变量只在当前作用域块和子作用域块下有效

```vue
<template>
  <ul class="strip-loading">
    <li v-for="v in 6" :key="v" :style="`--line-index:${v}`"></li>
  </ul>
</template>

<style lang="scss" scoped>
.strip-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  li {
    --time: calc((var(--line-index) - 1) * 200ms);
    border-radius: 3px;
    width: 6px;
    height: 30px;
    background-color: #f66;
    animation: beat 1.5s ease-in-out var(--time) infinite;
    & + li {
      margin-left: 5px;
    }
  }
}

@keyframes beat {
  0%,
  100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}
</style>
```
