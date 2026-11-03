# PersonaQuest — Product Hunt 上线计划（2026）

状态：产品推广作战设计，V3.0 新功能尚未实现，因此**未提交 Product Hunt、未取得排名**。2026-11-03。

资料来源：Product Hunt 官方 Launch Guide https://www.producthunt.com/launch ；Featured Guidelines https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines ；Commenting Guidelines https://help.producthunt.com/en/articles/10030102-commenting-guidelines 。

## 1. 定位与一句话

- Name：PersonaQuest
- Tagline（长度低于 60 字符）：A personality quiz that shows its work
- 英文价值主张：Your choices, not a box.
- 差异化：Inspect the answers behind a result. Challenge one. Decide what fits. Keep it private.
- 目标：帮助人理解自己在给定情境题中做出的选择；不是预测人生、职业和他人的关系匹配度。
- 首发价格：Free。核心体验免登录，用户自己控制分享，不采集个人原题答案。

## 2. 发布页英文简介草案

12 everyday scenarios, one playful result—and the evidence behind it. See which choices shaped your profile, try changing an answer, and keep notes about what fits (or doesn't). Free, no account, with answers staying on your device. Not a diagnostic test.

**这描述的是 V3.0 规划功能。只有功能真的上线后才能使用这些措辞。** 提交时按 Product Hunt 最新页面显示的字数上限再次检查。

## 3. 首页首屏

Title: Your choices, not a box.

Subtitle: A personality quiz that shows its work.

CTA 1: Try one interactive example.

CTA 2: Take the full 12-scenario quiz.

Trust text: No account. No mystery accuracy scores. Your answers stay on your device.

随后直接显示演示：两个备选选项 → 这次选择的计分方向 → 更换选项后的变化 → 撤销。“仅为演示，不构成完整人格测试”必须清晰。

## 4. 截图、视频与故事板

| 顺序 | 必须展示的真实可运行体验 | 希望用户理解的价值 |
| --- | --- | --- |
| 封面 | 英文产品主张、原创图标与插画 | 产品清楚、精致 |
| 图 1 | 不登录的一题交互演示 | 立即可体验 |
| 图 2 | 结果页及三条答题证据 | 显示依据，而不是黑箱 |
| 图 3 | 反事实试算与撤销 | 结论可质疑 |
| 图 4 | 笔记/适用情境选择 | 尊重使用者理解 |
| 图 5 | 分享预览和隐私控制 | 分享不等于上报私人答案 |

30–45 秒实际录屏，英文字幕。不得用尚未实现的 Figma 动画或 AI 合成流程当作真实功能演示。视频画面如使用音乐必须确保许可。

## 5. Maker 首发评论原稿（上线前由作者改成自己的真实表达）

Hi Product Hunt! I built PersonaQuest because I was curious what a personality label actually comes from.

It's a small, playful tool: answer 12 everyday scenarios, see which choices influenced each dimension, and try another answer without changing your saved result. It's not an official MBTI test or a diagnosis. Your answers stay on your device and you don't need an account.

I'd appreciate specific feedback: Which moment made the reasoning clearer? What felt confusing or overclaimed? What would you remove?

不得伪装为真实用户评价；应由真人 Maker 重新审阅后自行发布并回应。

## 6. 相对时间计划

| 时间 | 核心工作 | 放行依据 |
| --- | --- | --- |
| T-14 至 T-10 | 完整实现 P0：示例与反事实，修复独立用户发现的误解 | 工程黄金测试通过 |
| T-9 至 T-6 | 英文所有题目和解释人工复核，读屏/隐私审查 | 语言/隐私/无障碍门槛 |
| T-5 至 T-3 | 做真实录屏和上线截图，独立可用性测试 | 达到 PRD 指定的体验目标 |
| T-2 至 T-1 | 检查 PH 提交规则、页面元素、Maker 账户、站点 | 无待解决 P0、线上正常 |
| T0 | 准备充分后按 PH 发布日（太平洋时间）上线并回应评论 | 真正 live + 作者在场 |
| T+1 至 T+7 | 整理具体批评，发布修复说明 | 新需求的证据链接与复现路径 |

不因“周二上线可能有更高排名”之类未经验证的策略牺牲产品质量。PH 的官方指南强调准备充分、真实沟通，通常使用太平洋时间的发布日。

## 7. 公开评论与增长规则

- 只邀请用户真实试用、提供具体反馈；**不要直接要求点赞、购买赞或以奖励交换投票**。
- 不伪造评分、评论，也不通过 AI 批量发评论。
- 按官方说明，作者可自行 Hunt；不需付费“猎人”。
- 说明自己用过的框架与限制，避免拿小型原创问卷声称正式心理学有效性。
- 最终目标可将“获得 PH Product of the Day/Top 10”设为理想，但不能承诺或用投票数代替产品问题验证。
- 正式分享流不上传逐题答案、个人笔记或联系人，留存与分析不得使用诱导性策略。

## 8. 只有满足这些条件才能提交

- [ ] 公开的英文完整体验可运行，12 题与结果/反事实同一版本
- [ ] 一题 demo 在 90 秒内可独立完成、不写入正式记录
- [ ] 完整免费、无需注册、可删除自己的本地数据
- [ ] 权重展示不虚构人格概率、科学效度或预测能力
- [ ] 分享预览和最终产物不包含隐藏的个人回答/笔记
- [ ] 独立用户理解与隐私测试通过，失败原因有书面记录
- [ ] Node、Playwright、axe 和实际读屏关键任务验收
- [ ] GitHub Pages 实站 HTTPS 和静态资源已真实核查
- [ ] 原创题目与图片的许可状态审查完成
- [ ] 英文 Maker 评论/截图/视频只反映真实已上线功能

当前尚未满足 V3 功能与实验门槛。不能将此计划描述为已经发布。
