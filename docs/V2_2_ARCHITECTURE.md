# PersonaQuest V2.2：数据、解释、可访问性与发布设计

## 依赖与交付顺序

1. 内容契约：`data/question-bank.zh-CN.json` + JSON Schema Draft 2020-12 + Ajv + 语义规则 + 生成 ESM。
2. 确定性解释：`explainAssessment()` 只接受答案、问题与计算结果；逐轴记录原题 ID/所选选项/权重。
3. UI 无障碍：原生 Radio、进度 `aria-valuenow` 是已回答数量、标题焦点、颜色对比、axe E2E。
4. 图片性能：原始 16 张 PNG → 构建后 64 张 AVIF/WebP 变体；根据 `picture` 资源清单适配。
5. 部署与验收：Node unit / E2E / 静态资源完整性 / Pages 发布独立审核。

## 不变量

- 题库、评分、应用版本相互独立。V2.2 不改变原 12 题及权重，因此题库版本仍是 `2.1.0`，不是误升级。
- 对同一份答案、题库及 scoringVersion，评分和解释必须可重复。平局结果保持 null，不虚构具体四字母类型。
- 变更题目 ID、选项语义或分数规则时不允许直接兼容历史进度；通过显式 `migrateProgress` 规则审查。
- 展示的证据是原题目/原选项及计分方向，不包含心理学概率或“置信度”之类无来源指标。
- 数据内容含有 `origin`、`licenseStatus` 与 `reviewed`，不把机器校验等同于作者授权或科学验证。
- 允许本地 HTML 预览，但以 `dist/` 的真实构建与部署为验收对象；不默认上传任何答题记录。
- 自动化 axe 不等于完全通过 WCAG 2.2 AA，必须补充辅助技术的人工测试。

## 结构与职责

```text
data/        canonical question JSON
schemas/     JSON Schema syntax contracts
scripts/     validation, generation, image encoding, dist checks
src/core/    pure assessment, deterministic interpretation, migrations
src/ui/      DOM renderers and responsive picture adapter
src/data/    generated ESM and profiles
tests/       Node contracts and real-browser interaction tests
dist/        generated-only publication artifact (gitignored)
```

## 图片预算与退化

首页合照本身约 105 KiB，随构建复制。源插画大约 0.59–1.83 MiB/张；只生成图片的访问端变体（320/640），不需要发布完整原图。对每张 640 宽 WebP 设置 256000 字节上限、AVIF 200000 字节上限，失败即中止发布。默认兼容 WebP，兼容 AVIF 的浏览器优先使用 AVIF。源浏览模式加载原 PNG，构建模式改用优化清单。

注意：体积优化不代表图像主观视觉质量合格；应人工检查边缘、透明度、色带与重要细节，并在真实网络下测量 LCP、解码时间与 CLS。

## 验收

- JSON Schema + 语义规则 + 生成文件一致性。
- 16 型可达、无效输入不产生类型、完整结果可以追溯到 12 道题。
- 字母选择键盘/方向键、退回修改、刷新恢复、误触连点、焦点、深浅主题。
- axe 在首页、答题、图鉴、结果页无已知自动 A/AA 阻塞问题；人工补充 NVDA、VoiceOver 等记录。
- 16 张角色图全部生成并解码、总发布资源不包含 16 张原始大 PNG。
- `main` 合并 CI 成功；GitHub Pages 需要独立部署成功证据。
