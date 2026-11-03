# MBTI / PersonaQuest

本仓库包括两套早期原生前端人格探索原型。已经按代码版本拆出独立 Git 分支；原始主分支的代码暂时保留，以便安全迁移与追溯。

## 版本入口

| 分支 | 产品 | 源码布局 | 说明 |
| --- | --- | --- | --- |
| [v1](https://github.com/1998x-stack/MBTI/tree/v1) | Personality Zoo | `index.html`、`script.js`、`style.css`、`data/`、`assets/` | 12 道题、动物人格结果、成就 |
| [v2](https://github.com/1998x-stack/MBTI/tree/v2) | PersonaQuest | `index.html`、`question.js` | 8 道内嵌实际运行题目与 12 道未接入模块题目 |
| [develop](https://github.com/1998x-stack/MBTI/tree/develop) | 后续工程重构基线 | 以 V2 为初始快照 | 待修复与测试 |
| [backup/pre-version-split-2026-11-03](https://github.com/1998x-stack/MBTI/tree/backup/pre-version-split-2026-11-03) | 原始备份 | 主分支拆分前的全部文件 | 不应在此开发 |
| main | 历史兼容入口 | V1 根目录及 v1/、v2/ | 原实现暂不删除 |

**注意**：版本分支是对现有代码的原样拆分；并不是已通过自动化测试的正式发布版本，也不表示两个版本在历史上先后独立发布。

## 本地预览

```bash
git clone https://github.com/1998x-stack/MBTI.git
cd MBTI
git switch v1    # 或 git switch v2
python3 -m http.server 8000
```

浏览器访问 http://localhost:8000/ 。需要访问仓库的 GitHub 权限。若 Git 分支已存在于本机，先 `git fetch origin`。目前尚无项目级自动化运行验收记录。

## 审计与后续计划

- [代码审计与分支治理](docs/REPOSITORY_AUDIT.md)
- [版本迭代路线图](docs/ROADMAP.md)

已知问题包括：V1 结果图片未设置 src、V2 独立 `question.js` 在第 12 题中途截断且没有被页面导入、V2 运行时使用的仅为 8 道内嵌题、V2 重复点击可能重复计分，以及未经验证的题目计分与百分比解释。计划从 develop 修复，不直接改动历史快照。

## 使用范围

本项目当前属于**娱乐性人格探索原型**，不应被用作医疗心理诊断、专业心理评估或职业录用判断；结果和百分比并不等同于经过验证的心理测量结论。
