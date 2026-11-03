# GitHub Pages 部署方案与排障

## 架构

采用 **GitHub Actions → 构建 `dist/` → Upload Pages artifact → Deploy Pages**，不创建与源码竞争的 `gh-pages` 分支，历史版本分支保持冻结。发布内容只有静态 HTML/CSS/JS、图片构建产物和 `.nojekyll`。源代码不依赖服务端动态 API。

站点期望位于 `https://1998x-stack.github.io/MBTI/`；除非 Pages 工作流返回了成功的 `page_url` 并验证页面可访问，不可宣称已上线。仓库目前 Private，Pages 启用与公开展示受 GitHub 账号计划与设置约束。GitHub 文档说明 Pages 站点可能是公开的，即使源仓库是私有的。

## 操作与约束

1. 仓库 Settings → Pages → Build and deployment → Source → **GitHub Actions**。
2. 确保账号/组织支持从私有仓库发布 Pages；**不要为了部署私自改变仓库可见性**。
3. 仅允许主分支的 `.github/workflows/pages.yml` 发布；工作流使用 `pages: write`、`id-token: write` 和 `github-pages` 环境。
4. 如启用保护规则，限制 `github-pages` 环境仅允许 `main` 触发。
5. PR 阶段用 `V2.2 quality gates` 验证，合并后单独观察 Pages Workflow。
6. 成功后在 Settings → Pages 的 **Visit site** 确认实际 URL，并手动完成页面导航、题目、结果图片及本地存储的检查。

## 子路径与缓存

页面以 `./src/app.js`、`./styles.css`、`./assets/optimized/*` 等相对路径引用资源。不要写 `/assets/` 或 `/src/` 根路径，它们会在 GitHub 项目站点 `/MBTI/` 下指向错误位置。

对 HTML 和模块保守缓存，图片文件名包含尺寸与格式。未来若要求长缓存，应添加内容哈希与相应 manifest；不能在无指纹情况下对会更新的脚本启用永久不可变缓存。

## 工作流

```text
push main → npm install → lint/unit/schema
         → npm run build → npm run verify:site
         → configure-pages → upload-pages-artifact
         → deploy-pages (OIDC)
```

图片源文件全部保留在源仓库 `assets/images/`，但是发布 `dist/assets/images/` 中仅保留首屏合照，16 组结果图片经 Sharp 生成 320/640 两种尺寸的 WebP/AVIF。

## 常见失败

- **Pages not found / configure-pages 404**：检查 Settings → Pages 是否已启用，并验证仓库计划支持私有仓库 Pages。
- **Environment protection / deployment rejected**：检查 `github-pages` 环境允许的分支。
- **Image 404**：检查 `dist/src/data/image-manifest.js` 路径与 `dist/assets/optimized/` 实际产物；确保浏览器加载路径包含 `/MBTI/`。
- **权限错误**：检查组织 Actions 策略、`pages: write`、`id-token: write` 权限；不要把密钥写入前端。
- **无法访问**：确认工作流最终的 deploy job 为 success、站点已启用、DNS/发布状态；不要仅凭 CI 的 unit success 推断上线。

官方依据：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
