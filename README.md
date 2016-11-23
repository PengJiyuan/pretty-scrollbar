# PrettyScroll

隐藏传统滚动条，生成自定义滚动条。·[Demo](http://pengjiyuan.github.io/pretty-scrollbar)

## Usage

```bash
$ npm install prettyScroll --save
```
```javascript
var prettyScroll = require('prettyScroll');
prettyScroll(element, options);
```

或者

```html
<script src="lib/prettyScroll.js"></script>
<script>
PrettyScroll(element, options);
</script>
```

即可给element添加自定义滚动条

## Options

* **defaultWrapperWidth**
  默认滚动条背景的宽度， 用于遮盖默认滚动条。默认为`20`。
* **barWidth**
  自定义滚动条的宽度。默认为`7`。
* **wrappColor**
  默认滚动条背景的颜色。默认为`null`。会自动识别element的背景颜色，如果没有则设置为`#fff`。
* **barColor**
  自定义滚动条的颜色。默认为`rgba(0, 0, 0, 0.4)`。
* **right**
  自定义滚动条距离所选element右边界的距离。默认为`2`。
* **autoHide**
  是否自动隐藏滚动条。默认为`true`。

## Demo

> **Note**: 所选element需设置`overflow-y: scroll`;

```html
<div class="test"></div>
<script src="lib/scroll.js"></script>
<script>
PrettyScroll('.test', {
    barWidth: 8,
    autoHide: false
});
</script>
```