# css 规范

书写时，按布局，尺寸，界面，文字，交互进行顺序定义

## 布局属性

- 显示：display visibility
- 溢出：overflow overflow-x overflow-y
- 浮动：float clear
- 定位：position left right top bottom z-index
- 列表：list-style list-style-type list-style-position list-style-image
- 表格：table-layout border-collapse border-spacing caption-side empty-cells
- 弹性：flex-flow flex-direction flex-wrap justify-content align-content align-items align-self flex flex-grow flex-shrink flex-basis order
- 多列：columns column-width column-count column-gap column-rule column-rule-width column-rule-style column-rule-color column-span column-fill column-break-before column-break-after column-break-inside
- 格栅：grid-columns grid-rows

## 尺寸属性

- 模型：box-sizing
- 边距：margin margin-left margin-right margin-top margin-bottom
- 填充：padding padding-left padding-right padding-top padding-bottom
- 边框：border border-width border-style border-color border-colors border-[direction]-<param>
- 圆角：border-radius border-top-left-radius border-top-right-radius border-bottom-left-radius border-bottom-right-radius
- 框图：border-image border-image-source border-image-slice border-image-width border-image-outset border-image-repeat
- 大小：width min-width max-width height min-height max-height

## 界面属性

- 外观：appearance
- 轮廓：outline outline-width outline-style outline-color outline-offset outline-radius outline-radius-[direction]
- 背景：background background-color background-image background-repeat background-repeat-x background-repeat-y background-position background-position-x background-position-y background-size background-origin background-clip background-attachment bakground-composite
- 遮罩：mask mask-mode mask-image mask-repeat mask-repeat-x mask-repeat-y mask-position mask-position-x mask-position-y mask-size mask-origin mask-clip mask-attachment mask-composite mask-box-image mask-box-image-source mask-box-image-width mask-box-image-outset mask-box-image-repeat mask-box-image-slice
- 滤镜：box-shadow box-reflect filter mix-blend-mode opacity,
- 裁剪：object-fit clip
- 事件：resize zoom cursor pointer-events touch-callout user-modify user-focus user-input user-select user-drag

## 文字属性

- 模式：line-height line-clamp vertical-align direction unicode-bidi writing-mode ime-mode
- 文本：text-overflow text-decoration text-decoration-line text-decoration-style text-decoration-color text-decoration-skip text-underline-position text-align text-align-last text-justify text-indent text-stroke text-stroke-width text-stroke-color text-shadow text-transform text-size-adjust
- 字体：src font font-family font-style font-stretch font-weight font-variant font-size font-size-adjust color
- 内容：overflow-wrap word-wrap word-break word-spacing letter-spacing white-space caret-color tab-size content counter-increment counter-reset quotes page page-break-before page-break-after page-break-inside

## 交互属性

- 模式：will-change perspective perspective-origin backface-visibility
- 变换：transform transform-origin transform-style
- 过渡：transition transition-property transition-duration transition-timing-function transition-delay: ==> 属性改变时的过度动画
- 动画：animation animation-name animation-duration animation-timing-function animation-delay animation-iteration-count animation-direction animation-play-state animation-fill-mode
