# Form & Field

面向海外消费者的商品选购 Web 应用。基于 **React + TypeScript + Vite** 从空项目实现，未使用网站模板或商城成品。界面为英文、价格为 USD，商品和库存为本地模拟数据。

核心流程：**浏览商品 → 搜索 / 分类筛选 → 查看详情 → 加入购物车 → 调整数量 → 查看订单预览**。支持电脑、平板和手机。

在线演示：[GitHub Pages](https://ming0429.github.io/form-and-field/)  
公开源码：[Ming0429/form-and-field](https://github.com/Ming0429/form-and-field)

## 1. 本地运行

环境：Node.js **22.12 或更新版本**，npm。已在 Node.js 22.22.2 下验证。

```bash
npm ci
npm run dev
```

打开终端打印的本地地址，默认 `http://127.0.0.1:5173/`。

生产构建与预览：

```bash
npm run build
npm run preview
```

默认预览地址为 `http://127.0.0.1:4173/`。如端口被占用：

```bash
npm run dev -- --port 5175
npm run preview -- --port 4175
```

**不需要环境变量、API Key、数据库或后端服务。** 图片、字体均在 `public/` 中本地加载；依赖安装完成后，应用运行不需要第三方网络请求。请通过 HTTP 服务访问，不能直接双击 `dist/index.html` 运行 ES Module。

## 2. 已实现功能

| 模块 | 行为 |
| --- | --- |
| 商品浏览 | 10 个商品、4 个分类、本地图片、价格、原价、标签、缺货状态 |
| 商品查找 | 忽略大小写及首尾空格；搜索名称、分类、材料、描述；支持分类、最高价格、仅有库存组合筛选 |
| 排序 | 推荐顺序、价格升序 / 降序、名称 A–Z |
| 收藏 | 商品心形按钮、收藏列表、刷新后恢复 |
| 商品详情 | 图片、说明、材质、尺寸、可用库存、数量选择、加购反馈 |
| 购物车 | 快速加购、同商品合并、增减数量、删除、空状态、库存上限 |
| 金额 | 整数分计算；模拟 $8 运费、满 $150 免运费；动态免运进度条 |
| 持久化 | localStorage 保存购物车和收藏；非法 JSON、未知商品、非法数量会安全过滤；存储不可用时提示并保留本次会话功能 |
| 订单预览 | 展示当前选择和估算金额；明确声明不会创建真实订单或收款 |
| 响应式 | 桌面侧栏筛选、手机筛选抽屉、双列手机商品列表、全屏手机购物车 |
| 基础可访问性 | 原生 dialog、Escape 关闭、焦点样式、表单标签、按钮说明、动态状态通知、减少动画偏好 |

## 3. 目录与职责

```text
src/
├── App.tsx                      # 页面编排、筛选条件、弹窗状态、操作反馈
├── main.tsx                     # React 入口
├── types.ts                     # Product / CartItem / Filters / Category
├── data/
│   └── products.ts               # 静态商品目录与分类
├── lib/
│   ├── shop.ts                   # 纯函数：筛选、排序、数量约束、恢复、金额计算
│   └── storage.ts                # localStorage 读写适配与收藏数据校验
├── hooks/
│   └── useShopStore.ts           # 购物车 / 收藏状态与持久化；封装变更操作
├── components/
│   ├── common/
│   │   ├── Icon.tsx              # 统一 SVG 图标
│   │   ├── Modal.tsx             # 原生 dialog 生命周期与关闭行为
│   │   └── QuantityControl.tsx   # 详情与购物车共用的数量控件
│   ├── catalog/
│   │   ├── FilterControls.tsx    # 电脑侧栏 / 手机抽屉共用筛选表单
│   │   ├── ProductCard.tsx       # 商品卡片
│   │   └── ProductDetail.tsx     # 商品详情
│   ├── cart/
│   │   └── Cart.tsx              # 购物车、运费提示、订单预览
│   └── layout/
│       ├── Header.tsx
│       ├── Hero.tsx
│       └── Footer.tsx
└── styles/
    ├── base-layout.css          # 设计变量、公共元素、头部 / 首屏
    ├── catalog.css              # 商品与集合布局
    ├── dialogs.css              # 弹窗与购物车
    └── responsive.css           # 响应式及 reduced-motion

public/                          # 本地图片、字体、favicon
tests/shop.test.ts               # 纯业务逻辑测试
tests/e2e.mjs                    # Chromium 端到端验收与截图
scripts/record-demo.mjs          # 可复现的真实浏览器演示录制
docs/IMPLEMENTATION.md           # 实现方向与取舍
DELIVERY.md                      # 简短交付说明
```

### 扩展方式

- **接后端**：将 `data/products.ts` 的静态数组替换为商品查询层；视图仍消费 `Product`。在数据边界做字段校验、加载 / 错误状态及分页，再把筛选映射到查询参数。
- **服务端购物车**：保留组件的 `addItem / changeQuantity` 接口，在 `useShopStore` 中引入服务端购物车与乐观更新。库存和价格最终必须由服务端重算，localStorage 仅作体验缓存。
- **商品规格**：把购物车标识从商品 ID 扩展为 SKU ID；同款不同规格分别计数，库存按 SKU 约束。
- **多语言 / 币种**：目前明确使用英文和 USD；后续抽离文案字典及货币配置。汇率和税费应来自可信服务，不能只替换货币符号。
- **规模增长**：当前 10 个商品直接派生筛选结果即可；数据量增加后引入分页、查询缓存和必要的列表虚拟化，而不是提前添加全局状态框架。

## 4. 设计与关键取舍

1. 以家居生活方式选品店为主题，用暖白、森林绿、衬线标题和留白形成统一视觉；主操作始终围绕查找与加购。
2. 优先交付完整购物闭环和异常状态，没有扩张到登录、真实支付、后台管理等非题目核心功能。
3. 金额以最小货币单位（美分）保存与计算，避免累加浮点误差。显示时统一经 `money()` 格式化。
4. 库存限制统一收口到 `setQuantity()`，详情页与购物车不会各自维护一套不同规则。
5. 筛选 / 金额为纯函数，与 UI 分离；持久化被封装在 Hook 和适配层中，方便后续换为 API。
6. CSS 使用统一变量和按模块分类的样式文件；使用原生 dialog 获得浏览器模态语义，没有为少量控件引入整套 UI 库。
7. 使用 `base: './'`，构建结果可放在静态站点的独立子目录，当前没有客户端路径路由，因此无需配置 SPA rewrite。

## 5. 验证

```bash
npm test
npm run build
```

端到端测试（首次需要安装 Chromium）：

```bash
npx playwright install chromium
npm run dev
# 另一个终端：
npm run test:e2e
# 或验证生产预览：
BASE_URL=http://127.0.0.1:4173/ npm run test:e2e
```

测试会启动独立的临时浏览器，不使用个人浏览器资料，结果写入 `artifacts/verification.json`，截图写入 `artifacts/`。

已验证的重点场景：搜索与空结果恢复、组合筛选、价格排序、收藏、详情加购、金额 / 运费切换、数量上限、缺货禁用、删除及空购物车、刷新恢复、损坏缓存恢复、本地图片加载、电脑及手机交互。响应式检查覆盖 320、375、390、768、1024、1440px，没有发现横向溢出。浏览器验收未发现页面异常或 console error。

同一套端到端测试已对公开 HTTPS 地址 `https://ming0429.github.io/form-and-field/` 再次运行通过；记录见 `docs/verification-public.json`。

验证浏览器为本机 Chromium，覆盖本地生产预览和公开站点；未声称完成 Safari / Firefox / 真实 iPhone 全兼容测试。

## 6. 演示视频

交付的 MP4 是真实浏览器操作录屏，包含桌面和手机尺寸下的流程，无真实付款。

如需重新录制：

```bash
npm run build
npm run preview -- --port 5174
# 另一个终端：
npm run demo:record
```

输出 `artifacts/recordings/desktop.webm` 和 `mobile.webm`。两段为真实操作，脚本中的停顿用于让观看者看清状态变化。最终交付 MP4 由两段录屏依次拼接，手机画面等比保留。

## 7. 静态部署

```bash
npm ci
npm run build
```

将 **dist 目录内的文件** 上传到静态站点的新子目录即可。例如现有 Nginx 静态根下 `/form-and-field/`，访问地址应以 `/` 结尾。部署无需后端进程、数据库或密钥。

本项目已将源码发布到 GitHub 的 `main` 分支，将已验证的 `dist/` 内容发布到 `gh-pages` 分支根目录；包含 `.nojekyll`，由 GitHub Pages 提供 HTTPS 静态托管。后续修改需要重新构建并更新 `gh-pages`，源码提交不会自动更新演示站点。

腾讯云 SSH 认证未通过后已按要求停止连接，没有修改腾讯云站点或网关。

## 8. 已知边界

- 商品、价格、库存、尺寸与物流规则均为演示数据，不代表真实销售承诺。
- 仅支持英文、USD；没有真实汇率、税费、地址校验或支付。
- localStorage 为单浏览器本地状态，不具备账户同步、跨设备同步或跨标签实时同步。
- 商品数较少，未实现分页和远程检索；搜索为字段子串匹配，不包含拼写纠错。
- localStorage 被禁用时功能仍可用，但刷新后无法保留本次购物车；页面会提示该限制。

## 9. 素材与实现来源

- 商品示意图：[DummyJSON](https://dummyjson.com/) 的公开演示商品素材，已本地化；商品名称、说明、价格与库存为本项目整理的模拟内容。
- 首屏生活空间照片：[Unsplash 图片](https://images.unsplash.com/photo-1600210492486-724fe5c67fb0)。
- 字体：[DM Sans](https://fonts.google.com/specimen/DM+Sans)、[DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display)，已本地化，授权文件见 `public/fonts/`。
- 布局、组件和业务逻辑为本题新写；未使用现成商城模板或已有项目成品。

AI 协作方式：将题目拆成验收场景，先确定最小购物闭环，再实现可复用组件与业务逻辑；通过单元测试、真实浏览器验收与独立只读代码审查发现和核验问题，最后完成录屏与交付文档。
