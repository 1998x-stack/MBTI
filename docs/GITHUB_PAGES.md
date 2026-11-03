# GitHub Pages 部署方案与排障

## 架构

采用 **GitHub Actions → 构建 `dist/` → Upload Pages artifact → Deploy Pages**，不创建与源码竞争的 `gh-pages` 分支，历史版本分支保持冻结。发布内容只有静态 HTML/CSS/JS、图片构建产物和 `.nojekyll`。源代码不依赖服务端动态 API。

站点期望位于 `https://1998x-stack.github.io/MBTI/`；除非 Pages 工作流返回了成功的 `page_url` 并验证页面可访问，不可宣称已上线。本次仓库检查时可见性为 Public；这不等于 Pages 已启用。即使将来改回 Private，Pages 网站也可能仍公开，实际以账号方案和站点设置为准。

## 操作与约束

1. 仓库 Settings → Pages → Build and deployment → Source → **GitHub Actions**。
2. 保留仓库已有的可见性设置。**Pages 首次启用必须通过仓库 Settings 完成。** `actions/configure-pages` 的 `enablement:true` 需要超出默认 `GITHUB_TOKEN` 的权限；本项目不引入额外 PAT 或密钥。
3. 仅允许主分支的 `.github/workflows/pages.yml` 发布；工作流使用 `pages: write`、`id-token: write` 和 `github-pages` 环境。
4. 如启用保护规则，限制 `github-pages` 环境仅允许 `main` 触发。
5. PR 阶段运行质量门禁；合并后 Pages 工作流首先运行配置预检查（失败时给出设置入口），然后才安装依赖和发布。
6. 部署后自动运行 `scripts/smoke-pages.mjs`：通过 HTTPS 实际访问首页、CSS、JS、题库模块、Image Manifest、PNG 和 WebP。只有 deploy **和 smoke 都成功** 才能报告上线。人工复核完整题目和视觉质量仍需执行。

## 子路径与缓存

页面以 `./src/app.js`、`./styles.css`、`./assets/optimized/*` 等相对路径引用资源。不要写 `/assets/` 或 `/src/` 根路径，它们会在 GitHub 项目站点 `/MBTI/` 下指向错误位置。

对 HTML 和模块保守缓存，图片文件名包含尺寸与格式。未来若要求长缓存，应添加内容哈希与相应 manifest；不能在无指纹情况下对会更新的脚本启用永久不可变缓存。

## 工作流

```text
push main → npm install → lint/unit/schema
         → npm run build → npm run verify:site
         → Pages enabled?（预检查，失败则明确报告）
         → configure-pages → upload-pages-artifact
         → deploy-pages (OIDC)
         → smoke-pages（HTTPS 实站 7 项资源核验）
```

图片源文件全部保留在源仓库 `assets/images/`，构建检查会验证 SHA-256、格式、目标宽度与 1 MB 的发布体积预算；但是发布 `dist/assets/images/` 中仅保留首屏合照，16 组结果图片经 Sharp 生成 320/640 两种尺寸的 WebP/AVIF。

## 常见失败

- **Pages not found / configure-pages 404**：检查 Settings → Pages 是否已启用，并验证仓库计划支持私有仓库 Pages。
- **Environment protection / deployment rejected**：检查 `github-pages` 环境允许的分支。
- **Image 404**：检查 `dist/src/data/image-manifest.js` 路径与 `dist/assets/optimized/` 实际产物；确保浏览器加载路径包含 `/MBTI/`。
- **权限错误**：检查组织 Actions 策略、`pages: write`、`id-token: write` 权限；不要把密钥写入前端。
- **无法访问**：确认工作流最终的 deploy job 为 success、站点已启用、DNS/发布状态；不要仅凭 CI 的 unit success 推断上线。

官方依据：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 发布失败与后续复查

- **`Check Pages setup before publishing` 失败**：到 Settings → Pages 将 Source 设为 GitHub Actions；不要把 GitHub Token 当成能自动开启 Pages 的管理员密钥。该检查不代表代码构建失败。
- **`Deploy Pages` 成功而 `smoke` 失败**：说明实际内容仍不可验证，检查是否存在部署传播延迟、站点地址不匹配、MIME 错误或 `/MBTI/` 子路径资源问题；工作流会在限制次数内重试。
- **仓库可见性变化**：重新核验仓库和站点的实际权限；不要将答题内容放到发布目录。当前流程仅发布静态前端，不上传任何用户答案。

官方动作说明：https://github.com/actions/configure-pages/blob/main/action.yml
