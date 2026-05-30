# 高阶单词闯关游戏

一个精美的单机单词学习应用，采用 React + TypeScript + Vite 构建，提供四种沉浸式的单词学习模式。

## ✨ 功能特性

### 🎮 四种游戏模式

1. **🏰 词汇阶梯爬塔** - 15层塔楼挑战，每层5个高级单词
   - 限时40秒/层
   - 答错1个重闯本层，答错2个退回上一层
   - 搭配和同义词提示

2. **🎯 词义陷阱大考验** - 辨析易混高级词
   - 10组易混词辨析
   - 限时20秒/组
   - 连击加分机制
   - 错题回顾功能

3. **🔐 盲词记忆密室** - 中文释义默写
   - 两轮闯关模式
   - 第1轮：根据中文释义默写单词
   - 第2轮：根据词根词缀推导单词
   - 累计错3个挑战失败

4. **⚡ 单词逆向速答** - 快速反应模式
   - 20个单词，15秒/题
   - 三种提示方式随机出现：释义、例句、同义词
   - 碎片时间反复刷词

### 🎨 设计特色

- **奢华学术风格**：深蓝色与金色渐变配色
- **精美视觉效果**：光晕、阴影、动画效果
- **响应式设计**：完美适配桌面和移动端
- **流畅交互**：悬停动画、反馈效果、过渡动画

### 🔊 发音功能

- 浏览器内置语音合成
- 美式英语发音
- 语速适中，自然清晰

### ⏭️ 跳过功能

- 所有模式支持跳过不会的单词
- 正确记录跳过的单词
- 不影响游戏进度

## 🛠️ 技术栈

- **前端**：React 18 + TypeScript
- **构建工具**：Vite
- **样式**：Tailwind CSS
- **路由**：React Router v6
- **字体**：Playfair Display（标题）+ Lato（正文）

## 📦 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 📁 项目结构

```
/workspace
├── src/
│   ├── components/       # 通用组件
│   ├── pages/            # 页面组件
│   │   ├── Home.tsx      # 首页
│   │   ├── TowerGame.tsx # 词汇阶梯爬塔
│   │   ├── TrapGame.tsx  # 词义陷阱大考验
│   │   ├── ChamberGame.tsx # 盲词记忆密室
│   │   └── ReverseGame.tsx # 单词逆向速答
│   ├── data/
│   │   └── words.ts      # 单词数据
│   ├── types.ts          # 类型定义
│   ├── App.tsx           # 应用入口
│   ├── main.tsx          # React 挂载
│   └── index.css         # 全局样式
├── public/               # 静态资源
├── .trae/                # 项目文档
│   └── documents/
│       ├── prd.md        # 产品需求文档
│       └── arch.md       # 技术架构文档
├── vite.config.ts        # Vite 配置
├── tailwind.config.js    # Tailwind 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

## 📝 开发说明

### 添加新单词

编辑 `src/data/words.ts` 文件，添加新的单词条目：

```typescript
{
  word: 'your-word',
  definition: '中文释义',
  collocations: ['搭配1', '搭配2'],
  synonyms: ['同义词1', '同义词2'],
  example: '例句',
  root: '词根词缀',
  level: 'cet6' // cet4 | cet6 | kaoyan | ielts
}
```

### 自定义样式

- 主色调配置在 `tailwind.config.js`
- 全局样式在 `src/index.css`
- 使用 Tailwind CSS 原子类进行样式开发

## 📄 License

MIT License

## 🌟 Star History

如果这个项目对你有帮助，请给个 Star ⭐

## 📧 反馈与支持

欢迎提交 Issue 和 Pull Request！
