# 植物大战僵尸双人对战 - 项目文档

## 项目概述
双人同屏对战的 Plants vs Zombies Web 游戏，一人防守（植物），一人进攻（僵尸）。

## 技术栈
- 原生 JavaScript + Canvas API + Gamepad API
- 纯静态页面，零外部依赖，12 个 JS 模块
- 项目路径: `f:\CC\CC1`

## 当前进度
- [x] 全部核心功能已完成
- [x] 14 种精灵图（7 植物 + 7 僵尸）+ 动画
- [x] 已推送至 GitHub: https://github.com/hellyou/zombie
- [x] 需要在 GitHub 设置中手动开 Pages

## 操作说明
**防守方（植物）：** 鼠标点选 + 网格种植，键盘 1-7 快捷选植物
**进攻方（僵尸）：** ↑↓选行，←→切换种类，Enter 部署；或连接手柄（LB/RB 切种类，方向键选行，A 部署）

## 设计文档
- 完整设计: `docs/superpowers/specs/2026-05-09-pvz-dual-player-design.md`
- 实现计划: `docs/superpowers/plans/2026-05-09-pvz-dual-player-plan.md`

## 文件结构
```
index.html          主页面
style.css           样式
js/
  constants.js      游戏常量（数值、费用、属性）
  game.js           游戏状态 + 主循环
  sprites.js        14 种精灵绘制（带动画）
  canvas.js         Canvas 渲染引擎
  sun.js            阳光系统（自动分配）
  plants.js         植物逻辑（含向日葵产阳光）
  zombies.js        僵尸逻辑（含撑杆跳、报纸狂暴等）
  projectiles.js    子弹 + 碰撞
  input.js          键盘鼠标输入
  gamepad.js        手柄输入
  ui.js             UI 面板 + HUD + 胜负判定
```

## 已确认的设计决策
- 分屏实时对战，共享战场，左右操作栏
- 防守方键鼠，进攻方手柄（无手柄时用键盘）
- 阳光自动按位置分配，无需手动收集
- 5×9 网格，3 分钟限时
- 僵尸到最左边 = 僵尸赢，时间到 = 防守方赢
- 双方独立阳光经济
- 数值设计追求平衡（已定稿在 constants.js）
