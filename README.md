# 物历 WùLì - 物品数字档案

> 一物一档，让每件物品都有专属数字档案。AI管家、闲置流转、家庭守护，全方位管理你的物品。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fwuli-app&env=AI_API_KEY&envDescription=DeepSeek%20API%20Key%20for%20AI%20chat%20feature&envLink=https%3A%2F%2Fplatform.deepseek.com%2F)

---

## 在线体验

**部署方式一：一键部署（推荐）**

点击上方 **"Deploy with Vercel"** 按钮，即可将物历部署到你自己的 Vercel 账户，获得独立的公开访问链接。

**部署方式二：手动部署**

```bash
# 1. 克隆代码
git clone <your-repo-url>
cd wuli-app

# 2. 安装依赖
npm install

# 3. 配置环境变量（可选，用于AI功能）
cp .env.example .env
# 编辑 .env 文件，填入你的 DeepSeek API Key

# 4. 本地开发
npm run dev

# 5. 部署到 Vercel
npx vercel --prod
```

---

## 功能特性

### 核心功能
- **物品档案** - 为每件物品建立专属数字档案，记录说明书、保修期、购买信息
- **AI 管家** - 智能诊断家电故障，提供维修建议和保养提醒
- **闲置流转** - 社区闲置物品分享，让资源循环利用
- **家庭守护** - 远程守护家人健康，管理用药提醒和物品状态

### 场景化体验
- **新婚视角** - 共建温馨小家，管理共同物品
- **二手视角** - 闲置流转达人，轻松发布和交易
- **家庭守护视角** - 家人健康卫士，远程关心到位

### 首次使用引导
- 3套视角专属引导内容
- 4步渐进式引导流程
- 功能模块可点击查看详情

### PWA 支持
- 可添加到手机桌面，像原生 App 一样使用
- Service Worker 离线缓存
- 刘海屏/灵动岛安全区适配

---

## 技术栈

- **前端**：纯 HTML/CSS/JavaScript（单页应用）
- **后端**：Node.js Serverless Functions（Vercel）
- **AI**：DeepSeek API
- **部署**：Vercel / Netlify / Cloudflare Pages

---

## 项目结构

```
wuli/
├── public/                 # 静态文件（Vercel自动托管）
│   ├── index.html         # 主页面
│   ├── manifest.json      # PWA配置
│   ├── sw.js             # Service Worker
│   └── icon.svg          # 应用图标
├── api/                   # Serverless API
│   └── ai-chat.js        # AI聊天API
├── server.js             # 本地开发服务器
├── vercel.json           # Vercel部署配置
├── package.json          # 项目配置
└── README.md             # 项目说明
```

---

## 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `AI_API_KEY` | DeepSeek API Key | 空（禁用AI功能） |
| `AI_API_URL` | AI API接口地址 | `https://api.deepseek.com/chat/completions` |
| `AI_MODEL` | AI模型 | `deepseek-chat` |
| `MAX_TOKENS` | 最大返回token数 | `500` |
| `ALLOWED_ORIGIN` | CORS允许的来源 | `*` |

获取 DeepSeek API Key：[https://platform.deepseek.com/](https://platform.deepseek.com/)

---

## 浏览器兼容性

| 浏览器 | 支持状态 |
|--------|---------|
| Chrome 100+ | ✅ 完全支持 |
| Edge 100+ | ✅ 完全支持 |
| Safari 15+ | ✅ 完全支持 |
| Firefox 100+ | ✅ 完全支持 |

**最佳体验**：Chrome/Edge 最新版，竖屏模式，分辨率 390×844

---

## 移动端适配

- ✅ iOS Safari / Chrome（iPhone 8及以上）
- ✅ Android Chrome（Android 8.0及以上）
- ✅ 刘海屏 / 灵动岛安全区适配
- ✅ 底部Tab导航 + 顶部返回栏
- ✅ 触控元素 ≥ 44×44px
- ✅ 下拉刷新 / 手势操作

---

## 本地开发

```bash
# 启动开发服务器
npm run dev

# 服务器运行在 http://localhost:8080
```

---

## 许可证

MIT License
