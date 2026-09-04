# academic-homepage 项目整体梳理

> 本文档基于仓库源码抽取生成，按「一、项目概述 → 五、核心接口」的大纲组织，可用于项目文档、汇报材料或毕设说明。
> 生成日期：2026-09-02

---

## 一、项目概述

**academic-homepage** 是一个基于 [Jekyll](https://jekyllrb.com/) 的**个人学术主页网站模板**，专为 GitHub Pages 部署设计。使用者通过「Use this template」创建自己的仓库后，只需修改数据文件（`_data/`）与内容集合（`_publications/`、`_news/` 等），即可快速搭建一个包含个人简介、教育经历、论文列表、博客、作品展示的学术主页，无需编写代码。

| 项目属性 | 内容 |
| --- | --- |
| 项目名称 | academic-homepage |
| 项目类型 | 静态站点生成模板（Static Site Template） |
| 核心框架 | Jekyll 3.9（Ruby 生态） |
| 定位 | 面向科研人员 / 学生的学术主页模板 |
| 部署方式 | GitHub Pages（Jekyll 自动构建）/ 本地 `bundle exec jekyll serve` |
| 演示地址 | https://luost26.github.io/academic-homepage/ |
| 上游仓库 | https://github.com/luost26/academic-homepage |
| 许可协议 | 见仓库 `LICENSE` |

**主要特性（据源码归纳）：**
- 主页支持两种布局（`index.html` 单栏 / `index_layout2.html` 两栏）。
- 内容以「集合（Collections）」形式管理：论文、新闻、作品展示、博客文章。
- 论文支持作者标注（共同一作 `*`、通讯作者 `#`）、封面图、外链、Semantic Scholar 引用数动态展示。
- 无封面论文自动生成「气泡视觉哈希（bubble visual hash）」占位图。
- 图片懒加载（Lazy Load）、Masonry 瀑布流布局、KaTeX 公式渲染、Prism 代码高亮。
- 博客文章带目录（TOC）侧边栏与滚动高亮。

---

## 二、模块划分

项目按 Jekyll 的约定式结构进行模块划分，各模块以目录 / 集合为边界：

| 模块 | 载体目录 | 职责说明 |
| --- | --- | --- |
| 站点配置 | `_config.yml`、`Gemfile` | 站点全局设置、集合注册、Markdown 引擎、依赖声明 |
| 数据配置 | `_data/` | 个人资料、导航、显示开关、作者信息等结构化数据 |
| 页面模板（Layouts） | `_layouts/` | 页面骨架：`default`（通用）、`blog_post`（博客）、`prompt`（提示页） |
| 组件（Includes / Widgets） | `_includes/`、`_includes/widgets/` | 可复用 UI 组件：导航栏、页脚、名片、论文卡片、新闻卡片等 |
| 页面入口 | `index.html`、`index_layout2.html`、`publications.html`、`blog.html`、`showcase.html`、`404.html` | 各功能页面的入口文件 |
| 论文集合 | `_publications/` | 论文条目（按年份分子目录），供发表页与主页精选展示 |
| 新闻集合 | `_news/` | 新闻 / 动态条目，主页与新闻卡片展示 |
| 作品展示集合 | `_showcase/` | 卡片式作品展示（分组 `cats` / `default`） |
| 博客集合 | `_posts/` | Jekyll 标准博客文章 |
| 静态资源 | `assets/css/`、`assets/js/`、`assets/images/` | 样式、脚本、图片等前端资源 |
| CI / 仓库配置 | `.github/`、`.gitignore` | Issue 模板、GitHub Pages 构建、忽略规则 |

**功能页面与模块关系：**

| 页面 | 使用布局 | 主要引用组件 | 数据 / 集合来源 |
| --- | --- | --- | --- |
| 主页（单栏）`index.html` | `default` | `profile_card_mini`、`profile_card_bio_only`、`experience_card`、`news_card`、`publication_card` | `_data/profile`、`_data/display`、`_news`、`_publications` |
| 主页（两栏）`index_layout2.html` | `default` | `profile_card`、`experience_card`、`news_card`、`publication_card` | 同上 |
| 发表页 `publications.html` | `default` | `publication_item`、`author_list` | `_publications` |
| 博客列表 `blog.html` | `default` | `blog_card` | `_posts` |
| 博客详情 | `blog_post` | `navbar`、`footer` | `_posts` 单篇 |
| 作品展示 `showcase.html` | `default` | 内嵌各 `_showcase` 卡片、`carousel`（可选） | `_showcase` |

---

## 三、技术选型

| 类别 | 技术 / 库 | 版本 | 用途 | 来源文件 |
| --- | --- | --- | --- | --- |
| 站点生成器 | Jekyll | ~> 3.9 | 静态站点构建 | `Gemfile` |
| 运行时 / 服务器 | WEBrick | ~> 1.7 | 本地开发服务器 | `Gemfile` |
| Markdown 引擎 | kramdown + kramdown-parser-gfm | — | Markdown 解析（GFM） | `_config.yml`、`Gemfile` |
| Jekyll 插件 | jekyll-email-protect | — | 邮箱地址防爬保护 | `_config.yml`、`Gemfile` |
| 时区数据 | tzinfo-data | — | Windows 平台时区支持 | `Gemfile` |
| Windows 监听 | wdm | ~> 0.2 | Windows 目录监听加速（条件加载） | `Gemfile` |
| CSS 框架 | Bootstrap | 4.6.0 | 响应式布局与组件 | `_layouts/default.html` |
| 图标 | Font Awesome | 6.5.1 | 通用图标 | `_layouts/default.html` |
| 学术图标 | Academicons | 1.9.1 | 学术平台图标（Google Scholar 等） | `_layouts/default.html` |
| 数学公式 | KaTeX | 0.16.11 | LaTeX 公式渲染 | `_layouts/default.html` |
| 代码高亮 | Prism | 1.29.0 | 博客代码块高亮 | `_layouts/blog_post.html` |
| JS 基础库 | jQuery | 3.5.1 | DOM 操作、组件依赖 | `_layouts/default.html` |
| 组件依赖 | Popper.js | 1.14.7 | Bootstrap 弹出定位 | `_layouts/default.html` |
| 懒加载 | jQuery.Lazy | 1.7.9 | 图片懒加载 | `_layouts/default.html`、`assets/js/common.js` |
| 瀑布流布局 | Masonry + imagesLoaded | 4 / 5 | 作品展示网格布局 | `_layouts/default.html`、`assets/js/common.js` |
| GitHub 按钮 | github-buttons | 2.14.2 | Star / Follow 按钮 | `_layouts/default.html` |
| 字体 | Lato / Fira Sans / Source Code Pro | — | Google Fonts 网页字体 | `_layouts/default.html` |
| 外部 API | Semantic Scholar Graph API | v1 | 动态获取论文引用数 | `assets/js/semantic_scholar_citation_count.js` |
| 部署 / CI | GitHub Pages（pages-build-deployment） | — | 自动构建与托管 | `README.md`（徽章）、`.github/` |

> 说明：前端库均通过 CDN（cdnjs / jsdelivr / unpkg）引入，仓库内不包含 `node_modules`，无独立的前端构建流程（无 npm/webpack）。

---

## 四、目录结构

```
homepage/
├── _config.yml                # Jekyll 站点配置（baseurl、集合注册、插件、Markdown 引擎）
├── Gemfile                    # Ruby 依赖声明（Jekyll、插件、WEBrick 等）
├── README.md                  # 模板说明、使用社区、快速开始、FAQ
├── LICENSE                    # 许可协议
├── .gitignore                 # 忽略 _site/、缓存、Gemfile.lock 等
│
├── index.html                 # 主页（单栏布局）
├── index_layout2.html         # 主页（两栏布局）
├── publications.html          # 发表页（按年份分组）
├── blog.html                  # 博客列表页（按年份分组 + 侧边年份导航）
├── showcase.html              # 作品展示页（分组 + 瀑布流网格）
├── 404.html                   # 404 错误页
│
├── _data/                     # 结构化数据
│   ├── profile.yml            # 个人资料：姓名、职位、简介、教育、奖项、社交账号
│   ├── navigation.yml         # 导航栏条目
│   ├── display.yml            # 主页显示开关、页脚文本
│   └── authors.yml            # 作者信息（姓名加粗 / 链接 / 别名映射）
│
├── _layouts/                  # 页面骨架模板
│   ├── default.html           # 通用布局（引入所有 CSS/JS、导航、页脚）
│   ├── blog_post.html         # 博客详情布局（TOC 侧栏、Prism 高亮）
│   └── prompt.html            # 提示 / 引导页布局
│
├── _includes/                 # 可复用组件
│   ├── navbar.html            # 顶部导航栏（数据驱动、当前页高亮）
│   ├── footer.html            # 页脚
│   └── widgets/               # UI 小组件
│       ├── profile_card.html              # 完整名片
│       ├── profile_card_mini.html         # 迷你名片（单栏主页左侧）
│       ├── profile_card_bio_only.html     # 仅简介名片
│       ├── experience_card.html           # 教育 / 经历 / 奖项卡片
│       ├── news_card.html                 # 新闻卡片（按年份分组，可限条数）
│       ├── publication_card.html          # 精选论文卡片
│       ├── publication_item.html          # 发表页论文条目（响应式双版式）
│       ├── author_list.html               # 作者列表渲染（* 一作 / # 通讯）
│       ├── blog_card.html                 # 博客列表条目
│       ├── carousel.html                  # 图片轮播组件
│       ├── debug_repo_name.html           # 调试：仓库名提示
│       └── debug_url.html                 # 调试：URL 提示
│
├── _publications/             # 论文集合（按年份分目录）
│   ├── 2023/                  # 2023 年论文示例（含无封面示例）
│   └── 2024/                  # 2024 年论文示例
│
├── _news/                     # 新闻 / 动态集合（*.md，front matter 含 title/date）
├── _showcase/                 # 作品展示集合
│   ├── cats/                  # 分组：cats（示例卡片）
│   └── default/               # 分组：default（图文、徽章、公式、教育等示例）
├── _posts/                    # 博客文章（Jekyll 标准命名 YYYY-MM-DD-*.md）
│
├── assets/                    # 静态资源
│   ├── css/                   # global.css、blog.css
│   ├── js/                    # common.js、blog.js、bubble_visual_hash.js、semantic_scholar_citation_count.js
│   └── images/                # badges/、covers/、photos/、etc/
│
└── .github/
    └── ISSUE_TEMPLATE/        # user-report.md（用户反馈模板）
```

---

## 五、核心接口

> 本项目为静态站点，无后端 HTTP 路由。这里的「核心接口」指：**页面路由（URL）**、**组件调用接口（include 参数）**、**数据 / 内容契约（front matter 字段）** 以及 **对外部 API 的调用**。

### 5.1 页面路由（对外访问 URL）

> 站点 `baseurl` 为 `/academic-homepage`（`_config.yml`），实际访问路径需带该前缀。

| 路由 | 页面文件 | 说明 |
| --- | --- | --- |
| `/` | `index.html` | 主页（单栏布局） |
| `/index_layout2` | `index_layout2.html` | 主页（两栏布局） |
| `/publications` | `publications.html` | 论文发表列表 |
| `/blog` | `blog.html` | 博客列表 |
| `/blog/<post-url>` | `_posts/*.md` | 博客详情（由文章生成） |
| `/showcase` | `showcase.html` | 作品展示 |
| `/404` | `404.html` | 404 错误页 |

### 5.2 组件调用接口（Includes 参数）

| 组件 | 调用参数 | 参数说明 |
| --- | --- | --- |
| `widgets/news_card.html` | `limit` | 展示的新闻条数上限（主页取 `display.homepage.num_news`） |
| `widgets/publication_card.html` | `publications`、`title` | 论文集合数据、卡片标题（含图标 HTML） |
| `widgets/publication_item.html` | `item`、`first`、`last`、`hide_bottom_border` | 单条论文数据及首/尾/边框控制 |
| `widgets/author_list.html` | `authors` | 作者名数组（支持 `*` 共同一作、`#` 通讯作者标记） |
| `widgets/blog_card.html` | `item`、`first`、`last`、`hide_bottom_border` | 单篇博客数据及样式控制 |
| `widgets/carousel.html` | `id`、`images`、`height` | 轮播容器 id、图片数组（`src`/`title`/`desc`/`link`）、高度 |
| `navbar.html` | `active_page`（可选） | 手动指定高亮的导航项 |

### 5.3 数据 / 内容契约（Front Matter 字段）

**论文条目（`_publications/**/*.md`）：**

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `title` | string | 论文标题 |
| `date` | datetime | 用于排序与年份分组 |
| `selected` | bool | 是否在主页「Selected Publications」展示 |
| `pub` | string | 发表期刊 / 会议（斜体展示） |
| `pub_date` | string | 展示用发表年份 |
| `abstract` | string | 简要摘要（TLDR） |
| `cover` | path | 封面图路径（缺省则生成气泡视觉哈希） |
| `authors` | list | 作者列表，`*`/`#` 标注贡献 |
| `links` | map | 外链，如 `Paper`、`Code` 等 |
| `semantic_scholar_id` | string | Semantic Scholar 论文 ID（用于引用数） |

**新闻条目（`_news/*.md`）：** `title`（支持内嵌 HTML）、`date`。
**作品卡片（`_showcase/**/*.md`）：** `show`（是否展示）、`width`（栅格宽度）、`date`（排序）、`group`（分组）、`class`（可选样式）；正文即卡片 HTML 内容。
**博客文章（`_posts/*.md`）：** `layout: blog_post`、`title`、`date`、`tags`（可选）。

**站点数据（`_data/`）：**

| 文件 | 关键字段 |
| --- | --- |
| `profile.yml` | `primary_name`、`navbar_name`、`positions`、`email`、`gscholar`、`github`、`twitter`、`short_bio`、`portrait_url`、`education`、`experience`、`awards` |
| `navigation.yml` | `pages[].name`、`pages[].url`（`name` 需与页面 `navbar_title` 一致） |
| `display.yml` | `homepage.show_experience/show_news/show_selected_publications/num_news`、`footer_text` |
| `authors.yml` | 作者键 → `name`（别名）/`url`/`bold` |

### 5.4 外部 API 调用

| API | 端点 | 方法 | 用途 | 调用文件 |
| --- | --- | --- | --- | --- |
| Semantic Scholar Graph API | `https://api.semanticscholar.org/graph/v1/paper/batch?fields=citationCount` | POST | 批量拉取论文引用数并在页面动态展示（含 localStorage 1 小时缓存） | `assets/js/semantic_scholar_citation_count.js` |

### 5.5 运行方式与环境要求（补充）

**环境要求：** Ruby + Bundler + Jekyll（`~> 3.9`）。

**本地运行：**
```bash
bundle install          # 安装依赖（首次）
bundle exec jekyll serve # 启动本地服务器，浏览器访问提示的 URL
```

**部署：** 推送到命名为 `<username>.github.io` 的仓库并启用 GitHub Pages，由 `pages-build-deployment` 自动构建托管。

---

## 需补充项

- **作者 / 使用者信息**：`_data/profile.yml`、`_data/authors.yml` 目前为模板占位内容（如 "Your Name"、示例教育经历），实际项目需替换为真实信息。（需补充）
- **`prompt.html` 布局用途**：源码中存在 `_layouts/prompt.html`，本梳理未展开其具体渲染逻辑，如需可进一步细化。（需补充）
- **`bubble_visual_hash.js` 算法细节**：仅说明其为无封面论文生成占位图，未展开哈希→图形的具体算法。（需补充）
- **版本号**：项目自身未声明语义化版本号（无 `VERSION`/`package.json`），仅依赖库版本可考。（暂无）

---

## 数据来源

- 项目说明与使用方式：`README.md`
- 站点配置与集合注册：`_config.yml`
- 依赖与技术栈：`Gemfile`、`_layouts/default.html`、`_layouts/blog_post.html`
- 模块与组件：`_includes/`、`_includes/widgets/`、`_layouts/`
- 数据契约：`_data/*.yml` 及 `_publications/`、`_news/`、`_showcase/`、`_posts/` 示例文件
- 页面路由：各根目录 `*.html`、`_data/navigation.yml`
- 外部接口与前端逻辑：`assets/js/*.js`
