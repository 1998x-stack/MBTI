# PersonaQuest · MBTI 趣味人格探索 V2.1

> 12 道生活情境题、4 组偏好维度、16 种动物人格插画。一个**静态部署、隐私优先、可验证**的轻量级自我探索 Web 应用。

**当前稳定主线：`main`（V2.1）**。从 V2 的情境测试与 V1 的动物插画重构而来。老版代码保存在独立的 `v1`、`v2` 历史快照分支，不会因升级而丢失。

## 运行方式

项目无需数据库、API Key 或后端服务。浏览器需要通过 HTTP 访问（ES Module 不建议直接使用 `file://`）。

```bash
git clone https://github.com/1998x-stack/MBTI.git
cd MBTI
git switch main
python3 -m http.server 4173 --bind 127.0.0.1
```

打开 http://127.0.0.1:4173 。

## V2.1 功能

- **全新响应式 UI**：独立首页、情境问答页、结果页和 16 型人格图鉴；支持深色主题、桌面/移动端布局与减少动画偏好。
- **12 道结构化问题**：EI、SN、TF、JP 四个维度分别配置 3 道题，统一通过单一题库模块管理，不再依赖截断的旧版 `question.js`。
- **纯函数评分**：每次依据答案 ID 重新计算，不使用累加型 UI 状态；平局不会自动被强制归类。
- **可靠交互**：每题选择后点击下一题；禁止跳过未作答的问题，可返回修改；键盘 1–4 可选项。
- **本地进度**：使用带题库版本号的 localStorage 保存答案，允许恢复和清除，不默认把作答内容上传服务器。
- **结果视觉**：按需加载对应的动物插画，并用四轴相对得分图解释本次答案。
- **安全降级**：DOM 使用 textContent，限制 CSP；原生分享不可用时尝试复制结果代号和摘要。

## 工程结构

```text
index.html                   # 四屏静态语义骨架
styles.css                   # UI 设计令牌、布局、主题与响应式
src/
  app.js                     # 浏览器状态和交互事件
  core/assessment.js         # 独立评分器、验证、平局处理
  data/questions.js          # 12 题唯一题库源
  data/profiles.js           # 16 型画像与动物资源映射
assets/images/               # 16 张按需加载的动物图 + 1 张首页合照
tests/unit/assessment.test.js
tests/e2e/journey.spec.js
playwright.config.js
.github/workflows/ci.yml
docs/
  V2_1_DESIGN.md
  REPOSITORY_AUDIT.md
  ROADMAP.md
```

## 本地质量验收

推荐 Node.js 22+。安装的 Playwright 仅用于自动化测试，页面本身不依赖 Node 运行时。

```bash
npm install
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
```

- Node 原生测试验证题库、16 种人格可达、输入异常、重复重算、平局以及图片引用。
- Playwright 在 Chromium 桌面和 Pixel 7 模拟设备上验证完整答题、快速连点、回退修改、断点恢复、图鉴、主题与溢出。
- [V2.1 通过的 GitHub Actions 验证（14/14 浏览器用例）](https://github.com/1998x-stack/MBTI/actions/runs/41564685001)。
- [V2.1 合并 PR #1](https://github.com/1998x-stack/MBTI/pull/1)。

## 分支与版本

| 分支 | 用途 |
| --- | --- |
| [main](https://github.com/1998x-stack/MBTI/tree/main) | V2.1 主线，GitHub PR 合并后部署 |
| [develop](https://github.com/1998x-stack/MBTI/tree/develop) | 后续版本的集成开发基线 |
| [v1](https://github.com/1998x-stack/MBTI/tree/v1) | Personality Zoo 历史快照（保持原实现） |
| [v2](https://github.com/1998x-stack/MBTI/tree/v2) | PersonaQuest 历史快照（原文件包括不完整的题库草稿） |
| [backup/pre-version-split-2026-11-03](https://github.com/1998x-stack/MBTI/tree/backup/pre-version-split-2026-11-03) | 版本拆分前的完整备份 |

详见 [V2.1 设计与数据契约](docs/V2_1_DESIGN.md)、[仓库审计](docs/REPOSITORY_AUDIT.md) 和 [下一阶段路线图](docs/ROADMAP.md)。

## 重要说明

**本项目不是官方 MBTI 测评工具，也不是心理诊断工具。** 12 道题的权重和问卷设计尚未经心理测量学效度/信度研究。所有结果、四轴百分比及动物角色只适合娱乐性自我探索，不应当被用于医疗、招聘、职业能力判断或其他高风险决策。若未来引入正式量表，需先解决版权授权、施测规范与验证数据。

## V2.2 计划

规范题库 Schema 与版本迁移、提升屏幕阅读器交互与可访问性验证、压缩图片与性能基线、完善 CI 安全/可访问性检测，之后再考虑新的产品功能。
