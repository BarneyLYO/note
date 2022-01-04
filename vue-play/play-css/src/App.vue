<script setup>

</script>

<template>
  <div class="accordion">
    <input type="checkbox" id="collapse1" hidden>
    <input type="checkbox" id="collapse2" hidden>
    <input type="checkbox" id="collapse3" hidden>
    <article>
      <label for="collapse1">list1</label>
      <p>
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
      </p>
    </article>
    <article>
      <label for="collapse2">list2</label>
      <p>
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
      </p>
    </article>
    <article>
      <label for="collapse3">list3</label>
      <p>
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
        文字文字文字文字文字文
        字文字文字文字文字文字
      </p>
    </article>
  </div>
</template>

<style lang='scss' scoped>
.accordion {
  width: 300px;
  
  article {
    cursor: pointer;
    & + article {
      margin-top: 5px;
    }
  }

  input {
    @for $i from 1 to 4 {
      &:nth-child(#{$i}):checked ~ article:nth-of-type(#{$i}) p{
        border-bottom-width: 1px;
        max-height: 600px;
      }
    }
  }

  label {
    display: block;
    padding: 0 20px;
    height: 40px;
    background-color: #f66;
    cursor: pointer;
    line-height: 40px;
    font-size: 16px;
    color: #fff;
  }

  p {
    overflow: hidden;
    overflow-y:auto;
    margin: 0;
    padding: 0 20px;
    border:1px solid #f66;
    border-top: none;
    border-bottom-width: 0;
    max-height: 0;
    line-height: 30px;
    transition: all 100ms;
  }
}
</style>
