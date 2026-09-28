# NecroSmith 2 Recipe Atlas

《NecroSmith 2》中文配方图鉴，纯前端静态页面，配方数据随项目本地打包，离线可用。

## 使用

直接用浏览器打开 `index.html`。无需安装依赖或启动服务。

## 功能

- 搜索配方、部件名称和造物分类
- 按分类筛选并分页浏览
- 查看配方部件详情
- 中文界面与部件英译中配置

## 文件

- `index.html`：页面结构
- `styles.css`：浅色响应式样式
- `app.js`：搜索、筛选、排序和分页逻辑
- `config.js`：中文界面文案与分类顺序
- `parts.zh-CN.js`：部件翻译规则与词典
- `recipes.data.js`：页面读取的离线配方数据
- `necrosmith2_397_secret_recipes_cn_full_parts.csv`：配方源数据
