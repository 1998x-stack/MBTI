# PersonaQuest · 情境人格探索 V2.2

一个 12 道生活情境题、4 个选择维度、16 种趣味人格画像的静态 Web 应用。题库为本项目创作的探索性内容，**不是经心理测量学验证的官方 MBTI 测试**；结果仅用于娱乐和自我反思。

## 使用与本地预览

```bash
npm install
npm run build
python3 -m http.server 4173 --directory dist --bind 127.0.0.1
```

打开 http://127.0.0.1:4173/ 。无需后端、注册、API Key 或数据库。源文件也可直接通过本地 HTTP 服务器预览，但正式发布及端到端测试均使用 `dist/` 优化构建。

## GitHub Pages 部署

`.github/workflows/pages.yml` 在 **main 推送**或手动触发时执行校验、生成 `dist/`，通过 `upload-pages-artifact` + `deploy-pages` 发布。请在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**，并检查仓库所属账号的 Pages 资格。此仓库当前为 **Private**，启用 Pages 并不等同于让页面私有；一般情况下 Pages 站点可被公开访问。不要上传私人答题数据或敏感资料到仓库。

发布成功后，项目站点通常使用 `https://1998x-stack.github.io/MBTI/`；以实际 Pages 部署返回的 URL 为准。应用所有脚本、样式、图片均使用相对路径，兼容 `/MBTI/` 子路径。

详见 [Pages 部署与排障](docs/GITHUB_PAGES.md)。

## 核心能力

- **规范题库**：`data/question-bank.zh-CN.json` 为唯一内容源；Draft 2020-12 JSON Schema、跨对象语义校验、版本隔离、来源与内容审查状态。
- **可解释结果**：确定性评分 + 证据链，每个维度可展开查看三道题与个人选择；不把计分比例冒充人格概率。
- **无障碍交互**：原生 Radio 选项、键盘操作、正确的答题进度、焦点导航、对比度与自动化 axe 测试。
- **静态图片优化**：发布时从 PNG 源文件构建 AVIF / WebP 的 320px、640px 变体；结果页用 `picture` 按需加载，保留轻量首页合照。
- **本地隐私**：答案保存在用户浏览器 localStorage，不上传服务器；页面提供手动清除。分享文案不含逐题答案。

## 目录

```text
index.html, styles.css
data/question-bank.zh-CN.json        # 题库唯一内容源
schemas/                              # 数据校验契约
src/core/assessment.js               # 纯函数评分
src/core/explanation.js              # 可复核的解释与证据
src/core/migration.js                # 显式版本兼容迁移
src/data/questions.js                # 生成的浏览器 ESM
src/data/profiles.js                 # 16 种趣味画像
src/data/image-manifest.js           # 本地预览占位；构建时生成优化资源映射
src/ui/image-loader.js               # 响应式结果图片
scripts/validate-data.mjs            # 结构 + 语义校验
scripts/build-data.mjs               # 从 JSON 生成题库 ESM
scripts/build-site.mjs               # 构建 dist/、AVIF/WebP
scripts/verify-site.mjs              # 发布资源完整性与体积预算
tests/unit/, tests/e2e/              # Node & Playwright + axe
.github/workflows/ci.yml             # 单元、构建、浏览器 CI
.github/workflows/pages.yml          # Pages 构建与发布
```

## 开发质量检查

```bash
npm install
npm run validate:data
npm run build:data
npm run check:data
npm run lint
npm test
npm run build
npm run verify:site
npx playwright install chromium
npm run test:e2e
```

CI 的浏览器测试从 `dist/` 启动真实静态网站，分别执行桌面和移动设备模拟。某些无障碍问题需要 NVDA、VoiceOver、TalkBack 等真实辅助技术人工复核，自动化通过并不等于全面 WCAG 2.2 AA 认证。

## 版本分支

- `main`：稳定主线，经 PR + CI 后发布 Pages。
- `develop`：下一阶段开发基线。
- `v1`、`v2`、`v2.1`：保留对应历史版本的独立分支快照。
- `feat/v2.2-pages-schema-explanations-a11y-images`：V2.2 开发工作分支；仅验收完成后建立 `v2.2` 稳定版本分支。

## 进一步阅读

[架构与验收](docs/V2_2_ARCHITECTURE.md) · [Pages 指南](docs/GITHUB_PAGES.md) · [评分与解释规则](docs/SCORING_EXPLANATION.md) · [无障碍检查清单](docs/ACCESSIBILITY_CHECKLIST.md) · [历史版本审计](docs/REPOSITORY_AUDIT.md)。

**使用限制**：本问卷不适合临床诊断、心理咨询评估、能力判断、职业筛选等重要决策。原始插画版权、题库内容许可仍应由仓库维护者确认；待确认内容不得暗示已完成授权或测量学验证。
