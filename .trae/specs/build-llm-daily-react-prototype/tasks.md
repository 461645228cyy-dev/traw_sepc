# Tasks
- [x] Task 1: 初始化 React（Vite）工程与基础页面框架
  - [x] 创建 Vite React 项目与基础目录结构
  - [x] 添加全局样式与字体栈（正文无衬线/代码等宽）
  - [x] 搭建首页路由/页面骨架（Header/Hero/Main/Footer）

- [x] Task 2: 主题系统与样式规范
  - [x] 实现浅色/深色主题变量（指定色值）
  - [x] 实现主题切换（记忆用户选择）
  - [x] 统一卡片、按钮、徽章、阴影与圆角规范

- [x] Task 3: 顶部导航与移动端菜单
  - [x] 实现 Sticky Header：Logo/分类标签/搜索/主题/RSS
  - [x] 移动端导航：分类折叠为汉堡菜单
  - [x] 分类选中态与可访问性基础（focus 状态）

- [x] Task 4: 内容流（文章卡片）与交互
  - [x] 构建文章示例数据（含标签、元信息、可选代码、可阅读正文）
  - [x] 实现文章数据异步加载（模拟接口/本地异步皆可）
  - [x] 实现卡片列表按时间倒序渲染
  - [x] 实现卡片悬停态（上浮+阴影加深），标题悬停高亮

- [x] Task 5: 分类过滤与搜索（当前分类内实时过滤）
  - [x] 分类点击实时过滤内容流
  - [x] 搜索输入实时过滤（仅当前分类，匹配标题/摘要）

- [x] Task 6: 代码预览块能力
  - [x] 代码块展示 3 行预览 + 语言标识
  - [x] 一键复制代码
  - [x] “查看完整”打开完整代码视图（弹窗或折叠展开）

- [x] Task 7: 文章详情弹窗
  - [x] 点击文章标题/卡片主体打开详情弹窗（支持连续阅读正文内容）
  - [x] 支持关闭按钮、点击遮罩关闭、Esc 关闭
  - [x] 确保点击代码块按钮不触发打开详情

- [x] Task 8: 侧边栏模块
  - [x] 今日更新概览（数字角标）
  - [x] 热门话题云
  - [x] 本周新增模型清单（可折叠）
  - [x] 实用资源区
  - [x] 开发者留言入口（本地演示）

- [x] Task 9: 加载骨架屏与收尾
  - [x] 加载时展示骨架屏，完成后平滑切换
  - [x] 响应式检查：桌面双栏/移动单列
  - [x] 本地预览验证并更新 checklist.md 勾选

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 2
- Task 5 depends on Task 3, Task 4
- Task 6 depends on Task 4
- Task 7 depends on Task 4, Task 6
- Task 8 depends on Task 2
- Task 9 depends on Task 3, Task 5, Task 6, Task 7, Task 8
