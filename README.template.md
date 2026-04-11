# RBTI: Research Behavior Type Indicator

<p align="center">
  <strong>一个把科研人格、组会创伤、deadline 生存学和结果海报做成可传播测试的开源项目。</strong>
  <br />
  17 questions · 8 dimensions · 21 personas · KV-backed live stats
</p>

<p align="center">
  <a href="https://www.research-mbti.com/">Live Demo</a>
  ·
  <a href="https://www.research-mbti.com/">Take the Quiz</a>
  ·
  <a href="https://www.star-history.com/#HenryLau7/research-mbti&Date">Star History</a>
</p>

<p align="center">
  <img alt="GitHub stars" src="https://img.shields.io/github/stars/HenryLau7/research-mbti?style=flat-square" />
  <img alt="Questions" src="https://img.shields.io/badge/questions-17-0f172a?style=flat-square" />
  <img alt="Personas" src="https://img.shields.io/badge/personas-21-334155?style=flat-square" />
  <img alt="Dimensions" src="https://img.shields.io/badge/dimensions-8-475569?style=flat-square" />
  <img alt="Live site" src="https://img.shields.io/badge/live-research--mbti.com-111827?style=flat-square" />
</p>

<p align="center">
  <img src="./assets/preview/all-personas.jpg" alt="RBTI all persona lineup" width="100%" />
</p>

## 项目介绍 / What This Project Is

RBTI 是一个把科研生活、组会创伤、deadline 文化和人格测试揉在一起的项目。它不是传统意义上的严肃量表，而是一个更适合研究生互联网语境的梗图型人格测试：一部分是科研人设观察，一部分是实验室日常切片，一部分是可直接转发的结果海报。

这个项目当前对外展示的核心结构有三层：

- 17 道题，8 个维度，快速完成答题
- 21 种科研人格结果，从 `DRUG` 到 `QUIT`
- 基于 Cloudflare KV 的实时聚合统计，让人格分布会随着更多人答题不断变化

这个仓库是项目的 public showcase 版本。它的目标不是把所有实现细节堆出来，而是让 GitHub 首页本身就像一张项目 landing page：一屏内讲清楚项目是什么、为什么好玩、现在测出来的人格分布怎样、以及全部人格图长什么样。

## 为什么它容易传播 / Why It Gets Shared

- 它把真实的课题组行为压缩成了很短、很好记的人格标签
- 结果是视觉优先的，天然适合截图、转发和二创
- 文案写给真正经历过组会、返修、导师压力的人，所以会有共鸣
- 仓库首页本身就是一个会自动更新的项目主页，而不是静态代码坟场

{{STATS_SECTION}}

## 项目亮点 / Project Highlights

- **Meme-native framing**: 这个项目天然适合研究生社交媒体的表达方式
- **Live public snapshot**: README 里的分布统计直接从线上生产接口刷新
- **Poster-ready output**: 每个人格都对应一张适合分享的图片
- **Extensible system**: 同一套思路可以继续扩展到 ABTI、SBTI 等衍生版本

{{PERSONA_GALLERY}}

## 仓库结构 / Repository Map

- `README.md`: 面向 GitHub 访客的生成版首页
- `README.template.md`: 手写文案模板
- `data/personas.json`: 本地人格元数据，供图库生成使用
- `data/stats-snapshot.json`: 最近一次同步下来的线上统计快照
- `assets/posters/`: README 使用的人格图素材
- `scripts/generate-readme.mjs`: 拉线上 stats 并重建 README 的脚本

## README 自动更新 / How The README Updates

1. 线上站点把聚合统计写进 Cloudflare KV。
2. 公开接口通过 `https://www.research-mbti.com/api/stats` 暴露这些统计。
3. 这个仓库会拉取该接口，更新本地 snapshot，并重新生成 `README.md`。
4. GitHub Actions 支持定时刷新，也支持手动触发。

## Star History / 仓库 Star 趋势

[![Star History Chart](https://api.star-history.com/svg?repos=HenryLau7/research-mbti&type=Date)](https://www.star-history.com/#HenryLau7/research-mbti&Date)

## 备注 / Notes

- 这个项目主要用于娱乐、共鸣和传播，不用于任何严肃人格诊断。
- 如果你关心最新的人格分布，README 的同步脚本会持续从 live API 拉取最新数据。
