# analysisjs

analysisjs 是一个用于前端页面埋点采集的 JavaScript 库，支持页面浏览、曝光、点击等行为数据的自动采集与上报，适用于业务分析和用户行为追踪。

## 功能特性
- 自动采集页面浏览（pageview）日志
- 监听页面可见性变化（如切换标签页、关闭页面）并上报相应事件
- 支持元素曝光率与点击率的自动采集（基于 IntersectionObserver）
- 支持多环境（线上/本地）自动切换上报接口
- 兼容多种浏览器环境

## 目录结构
```
├── build/           # 构建输出目录
│   └── ...
├── src/             # 源码目录
│   ├── analysis.js  # 埋点主逻辑
│   └── event.js     # 事件相关逻辑
├── gulpfile.js      # 构建脚本
├── package.json     # 项目依赖与配置
```

## 快速开始
1. 将 `src/analysis.js` 集成到你的前端项目中。
2. 页面加载时自动初始化，无需手动调用。
3. 如需自定义曝光监控目标，请为目标元素添加 `needwatch` 类和 `a[href]` 标签。

```html
<!-- 示例：需要监控曝光和点击的链接 -->
<div class="needwatch">
  <a href="/product/123" title="产品A">产品A</a>
</div>
```

## 数据上报说明
- 日志数据通过 `navigator.sendBeacon` 或 XHR 方式发送到后端接口。
- 支持自动区分线上与本地环境，接口地址分别为：
  - 线上：https://analysis.laiys.com/api/v1/
  - 本地：https://localanalysis.laiys.com/api/v1/

## 主要埋点事件
- `pageview`：页面浏览
- `hidetime`/`showtime`：页面隐藏/显示
- `closetime`：页面关闭
- `exposed`：元素曝光
- `click`：元素点击

## 兼容性
- 支持主流现代浏览器及部分 IE 版本（通过 XHR 兼容处理）

## 贡献
欢迎提交 issue 或 PR 以完善本项目。

## License
MIT
