# CodeKids Keyboard Academy（键盘小侠）

面向 **6-10 岁儿童**的键盘盲打 + 编程启蒙网页应用：跟着 6 座岛、84 个关卡，从认识手指位置一路打到能写出会动的小游戏。

## 这是什么

- 孩子用**闯关的方式**学会盲打：每关只练几个键，敲对一个字母就立刻有颜色、音效和小火花反馈
- 打到第 4、5 岛开始写 **C++**：自己敲的代码可以真的运行，舞台上能画出会动的画面
- 第 6 岛是**中文拼音打字**：汉字上方标着拼音，一个字母一个字母打出来，从识字、词语、成语一路到古诗和短文
- 不需要邮箱注册：选个头像、画一个图形密码就能开始（数据保存在浏览器本地）

## 功能

| 模块 | 说明 |
|---|---|
| 儿童账号 | 头像 + 图形密码登录，支持多档案、改名、换头像、改图形密码、删除前二次确认 |
| 学习地图 | 6 座岛 84 关：键盘启蒙 / 英文单词 / 代码符号 / 简单代码 / 小游戏编程 / 中文打字 |
| 打字训练 | 目标字符、虚拟键盘、手指提示、拼音条、实时 WPM 与正确率、弱键与混淆分析、连击、提示阶梯（连错可跳过） |
| 编程练习 | 自研 C++ 教学解释器：语法检查、中文报错、逐行演示、舞台绘图（星星 / 圆 / 方块 / 线条 / 文字 / 逐帧动画） |
| 游戏化 | 星星、徽章、等级、连续学习天数、成就、排行榜 |
| 家长端 | 学习时长、打字速度变化、完成课程、错误统计 |
| 设置 | 音量、全局点击音效、改名、换头像、改图形密码 |

## 技术栈

React 18 · TypeScript · Vite 5 · Tailwind CSS 3 · Zustand（localStorage 持久化）· React Router 6

音效全部用 Web Audio 实时合成，字体自托管，**没有任何需要联网的第三方资源**。

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
```

Windows PowerShell 若提示 npm 被禁用，把命令换成 `npm.cmd run dev`。

## 构建与自测

```bash
npm run build      # 产物在 dist/
npm run typecheck  # 类型检查
node scripts/content-selftest.ts   # 自测之一
```

一共九套自测脚本（共 415 项断言），都在 `scripts/` 下：`content` / `engine` / `cpp` / `programs` / `stage` / `codeparts` / `unlock` / `settings` / `ranking`。

## 目录结构

```
src/
  components/   界面组件（打字、编程舞台、虚拟键盘、地图、通用组件、动效）
  data/         课程内容（6 岛关卡、可运行程序、拼音表、头像、徽章）
  engine/       打字引擎、C++ 教学解释器、音效、进度与奖励规则
  pages/        首页 / 登录 / 学习地图 / 打字关 / 排行榜 / 设置
  store/        Zustand 状态（档案、进度、设置）
  styles/       儿童向动效与自托管字体
scripts/        九套自测脚本
docs/           产品设计、项目结构指南、上线部署指南
```

## 上线部署

见 [docs/上线部署指南.md](docs/上线部署指南.md)：Vercel / Netlify / Cloudflare Pages 三种免费方案，以及国内 COS、OSS、Nginx 的做法。项目是纯前端应用，构建产物 `dist/` 直接放静态托管即可。

## 关于数据

孩子的档案、进度、设置都保存在**浏览器本地**（localStorage 的 `codekids.child` / `codekids.progress` / `codekids.settings`），不上传服务器，也没有第三方统计。因此换设备不会同步；如果要做多设备同步或家长远程查看，需要再加后端（`src/store/childStore.ts` 里已留好接入位置）。
