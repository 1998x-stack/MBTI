# PersonaQuest V2.1 — 架构与 UI 设计说明

## 1. 目标与产品边界

V2.1 统一 V1 的人格动物形象与 V2 的情境化体验，保留静态部署、零后端、低运维成本。它是短题目自我探索问卷，不是正式授权的 MBTI 心理量表。页面比例仅指本问卷所选选项的权重分布，不能视为能力分数、概率、临床诊断或心理测量置信度。

## 2. 代码分层

| 层次 | 路径 | 职责 |
|---|---|---|
| 语义结构 | `index.html` | 屏幕骨架、原生按钮、导航、声明及 meta CSP |
| 视觉系统 | `styles.css` | 设计变量、布局、移动端、暗色和减少动效 |
| UI 状态 | `src/app.js` | 题目导航、答题状态、进度存储、结果和图鉴渲染 |
| 纯领域逻辑 | `src/core/assessment.js` | Schema 检查、答案修复、重新评分、平局与无效输入处理 |
| 题库 | `src/data/questions.js` | 12 道结构化情境题；4 组轴各 3 道 |
| 人格数据 | `src/data/profiles.js` | 16 个结果画像、动物图片映射 |
| 静态资源 | `assets/images/` | 精选 16 个动物结果图和 1 张轻量首屏合照 |
| Unit Tests | `tests/unit/assessment.test.js` | 一致性、覆盖率、重复评分和 16 类型可达性 |
| Browser E2E | `tests/e2e/journey.spec.js` | 完整问卷、快速点击、键盘、刷新恢复、图鉴及移动端 |

## 3. 数据契约

- `Question = { id, axis, title, scenario, prompt, options[] }`，axis 属于 EI/SN/TF/JP。
- `Option = { id, letter, weight, label }`，letter 必须位于问题对应维度，weight 为正整数。
- `Answers = Record<questionId, optionId>`；从不把增量累计分数作为唯一真相。
- `Assessment = { answered, total, completed, type, axes[] }`，其中 axes 包括左右得分、相对百分比、已回答数、平局状态。
- 未完成时 `type=null`；完成后遇到某一轴平局仍返回 `null`，页面展示「多面探索者」而不是隐式指定某一字母。
- 本地存储采用题库版本隔离：`personaquest:progress:2.1.0`；恢复时过滤无效选项。

## 4. 状态机与防竞态策略

HOME、QUIZ、RESULTS、TYPES 四个页面。用户选择任一原生按钮后，仅更新当前题目的选项 ID，不直接累加分数。只有有效选择时才启用「下一题」。导航不使用延迟定时器，因此快速连续点击无法将尚未作答的下一题跳过。允许回上一题修改答案；结果展示前重新扫描整个题库计算结果。

## 5. UI / UX 体系

- 品牌风格：暖白背景、深墨文字、紫色主交互，四种浅色模块表达四组偏好。
- 首屏：大标题、暖色插画合照、简要介绍、自然语言承诺，不制造“精准识别”错觉。
- 答题页：宽屏左右布局（维度进度 + 主问题卡）；窄屏合并单列。
- 选项采用 `button`、`aria-pressed`，提供键盘数字 1–4，标题更新后管理焦点。
- 结果页：一张按需加载的动物形象 + 四轴分布条 + 解释和免责声明。
- 图鉴页：16 个轻量卡片，不一次性下载 16 张大型结果图。
- 暗色主题与系统减少动画偏好 `prefers-reduced-motion`。

## 6. 安全与隐私

- 本地静态部署：页面不上传答题内容；无外部 SDK/字体/CDN/广告。
- 浏览器 localStorage 仅保存题库版本、答案 ID、位置、完成状态；提供清除控件。
- 分享仅包含人格类型代号/描述，不包含逐题答案；Web Share/Clipboard 的拒绝与不支持状态都有提示。
- 应用数据只经 `textContent`、`createElement` 写入页面，不拼接未经验证的 HTML。
- 限制 CSP 默认源、脚本源、样式源和图片源为本站，禁止连接。

## 7. 开发、测试和验收

本地启动：`python3 -m http.server 4173 --bind 127.0.0.1`。
质量检查：`npm install && npm run lint && npm test`。
浏览器 E2E：`npx playwright install chromium && npm run test:e2e`。
CI 提供 Node 静态语法与单元测试，以及 Chromium desktop/mobile E2E。

真正通过验收必须有执行证据，包括：12 题完整流程；16 类型的数据覆盖；连点不跳题；返回改答案；刷新恢复与清除；移动端无横向溢出；结果图片正常；深色模式、键盘操作与错误提示。代码已经提交不意味着以上检查已经执行通过。

## 8. 后续 V2.2 优先级

下一阶段建议进一步引入 JSON Schema/TypeScript 类型、键盘与屏幕阅读器实测、完整的心理测量文案审查、图片 WebP/AVIF 压缩、Lighthouse 指标和具有版本语义的发布标签。量表效度验证须先处理授权、样本设计与统计方法。
