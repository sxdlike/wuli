# 物历 WùLì - 完整部署指南

## 📋 项目结构说明

部署前请确认项目结构如下（已检查通过）：

```
wuli/
├── api/                    # Vercel Serverless API 目录
│   └── ai-chat.js          # AI 聊天接口
├── public/                 # 静态资源目录（Vercel 自动识别）
│   ├── index.html          # 主页面
│   ├── manifest.json       # PWA 配置
│   ├── sw.js               # Service Worker
│   └── icon.svg            # 应用图标
├── vercel.json             # Vercel 部署配置
├── package.json            # 项目依赖
├── .gitignore              # Git 忽略文件
├── .env.example            # 环境变量示例
├── server.js               # 本地开发服务器（可选）
├── deploy.bat              # 一键部署脚本（Windows）
└── DEPLOY.md               # 本部署指南
```

---

## ✅ 部署前检查清单

在开始部署前，请确保你已准备好以下内容：

- [ ] **GitHub 账号**：https://github.com/ （免费注册）
- [ ] **Vercel 账号**：https://vercel.com/ （可用 GitHub 账号登录，免费版足够）
- [ ] **Git 工具**：https://git-scm.com/download/win （Windows 版本）
- [ ] **Node.js**：https://nodejs.org/ （建议 v18+，LTS 版本）
- [ ] **DeepSeek API Key**（可选，用于 AI 功能）：https://platform.deepseek.com/

---

## 🚀 部署方式一：Vercel 网页导入（最简单，推荐新手）

这是最简单的部署方式，全程在浏览器中操作，不需要命令行。

### 第 1 步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写信息：
   - **Repository name**: `wuli-app`（或你喜欢的名字）
   - **Description**: 物历 - 物品数字档案
   - **Public/Private**: 选 Public（免费版 Vercel 也支持 Private 仓库）
   - **Initialize with**: 全部不勾选
3. 点击 **Create repository**
4. 保持这个页面打开，后面会用到

### 第 2 步：上传代码到 GitHub

**方式 A：使用 Git 命令行（推荐）**

1. 按 `Win + R`，输入 `cmd`，打开命令提示符
2. 进入项目目录：
   ```cmd
   cd c:\Users\21005\Desktop\wuli
   ```
3. 初始化 Git（如果还没有）：
   ```cmd
   git init
   git add .
   git commit -m "初始提交：物历应用"
   git branch -M main
   ```
4. 关联远程仓库（替换 `yourusername` 为你的 GitHub 用户名）：
   ```cmd
   git remote add origin https://github.com/yourusername/wuli-app.git
   ```
5. 推送代码：
   ```cmd
   git push -u origin main
   ```
6. 如果提示输入用户名密码：
   - 用户名：你的 GitHub 用户名
   - 密码：使用 **Personal Access Token**（不是登录密码！）
   
   **如何获取 Personal Access Token：**
   - 访问 https://github.com/settings/tokens
   - 点击 **Generate new token** → **Generate new token (classic)**
   - Note 填 `wuli-deploy`
   - Expiration 选 `90 days` 或更长
   - 勾选 `repo` 权限（第一个大项全选）
   - 拉到最下面点 **Generate token**
   - 复制生成的 token（只显示一次，保存好！）
   - 推送时密码处粘贴这个 token

**方式 B：手动上传 ZIP（不推荐，后续更新麻烦）**

1. 在 GitHub 仓库页面，点击 **uploading an existing file**
2. 把项目文件夹里的所有文件拖进去
3. 点击 **Commit changes**

### 第 3 步：在 Vercel 导入项目

1. 访问 https://vercel.com/new
2. 用 GitHub 账号登录（首次使用需要授权）
3. 在 **Import Git Repository** 区域，找到你的 `wuli-app` 仓库
4. 点击右边的 **Import** 按钮
5. 配置项目：
   - **Project Name**: 自动填充，可以不改
   - **Framework Preset**: 选 `Other`
   - **Root Directory**: 保持默认（就是根目录）
   - **Build and Output Settings**: 全部保持默认
   - **Environment Variables**: 暂时不用填（后面可以再加）
6. 点击 **Deploy** 按钮
7. 等待部署完成（大约 1-2 分钟）

### 第 4 步：获取访问链接

部署成功后，你会看到：
- 一个大大的预览图
- 类似 `https://wuli-app-xxxxx.vercel.app` 的链接
- 这就是你的公开访问链接！🎉

点击链接即可访问你的物历应用。

---

## 🚀 部署方式二：Vercel CLI 命令行部署

如果你喜欢用命令行，可以用 Vercel CLI 直接部署。

### 第 1 步：安装 Vercel CLI

打开命令提示符，执行：

```cmd
npm install -g vercel
```

如果安装失败（权限错误），试试本地安装：
```cmd
cd c:\Users\21005\Desktop\wuli
npm install vercel --save-dev
```

### 第 2 步：登录 Vercel

```cmd
vercel login
```

按提示选择用 GitHub 登录，会自动打开浏览器授权。

### 第 3 步：部署

```cmd
cd c:\Users\21005\Desktop\wuli
vercel --prod
```

首次部署会问几个问题：
- `Set up and deploy "wuli"?` → 输入 `y` 回车
- `Which scope do you want to deploy to?` → 选你的账号
- `Link to existing project?` → 输入 `n` 回车
- `What's your project's name?` → 直接回车用默认
- `In which directory is your code located?` → 直接回车（就是当前目录）
- `Want to modify these settings?` → 输入 `n` 回车

等待部署完成，最后会给你一个 `Production` 链接，就是你的正式访问地址。

---

## 🚀 部署方式三：一键部署脚本（Windows）

项目根目录有 `deploy.bat` 脚本，可以一键完成部署。

### 使用步骤：

1. 先按上面的说明，在 GitHub 创建好仓库
2. 生成好 GitHub Personal Access Token
3. 双击运行 `deploy.bat`
4. 按提示输入 GitHub 用户名
5. 推送时粘贴 Personal Access Token 作为密码
6. 按提示完成 Vercel 登录和部署

---

## ⚙️ 配置 AI 功能（环境变量）

部署完成后，AI 功能默认是不可用的（会显示 fallback 回复）。要启用真实 AI 对话，需要配置 API Key。

### 配置步骤：

1. 获取 DeepSeek API Key：
   - 访问 https://platform.deepseek.com/
   - 注册/登录账号
   - 在 API Keys 页面创建新的 Key
   - 复制 Key（以 `sk-` 开头）

2. 在 Vercel 控制台配置：
   - 访问 https://vercel.com/dashboard
   - 进入你的 `wuli-app` 项目
   - 点击顶部的 **Settings** 标签
   - 左侧菜单点击 **Environment Variables**
   - 添加环境变量：
     
     | Key | Value | Environment |
     |-----|-------|-------------|
     | `AI_API_KEY` | 你的 DeepSeek API Key | 勾选 Production, Preview, Development |
   
   - 点击 **Save** 保存

3. 重新部署：
   - 点击顶部的 **Deployments** 标签
   - 找到最新的部署，点击右边的三个点 `⋯`
   - 选择 **Redeploy**
   - 等待重新部署完成

### 其他可选环境变量：

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `AI_API_URL` | `https://api.deepseek.com/chat/completions` | AI API 地址（支持 OpenAI 兼容接口） |
| `AI_MODEL` | `deepseek-chat` | AI 模型名称 |
| `MAX_TOKENS` | `500` | 单次回复最大 token 数 |
| `ALLOWED_ORIGIN` | `*` | 允许的前端域名（部署后建议改成你的实际域名） |

---

## 🔍 验证部署

部署完成后，请按以下清单验证功能：

### 基础功能验证
- [ ] 访问部署链接，页面正常加载
- [ ] 页面标题显示「物历 WùLì - 物品数字档案」
- [ ] 页面样式正常，没有错位
- [ ] 底部导航栏可以切换页面

### 引导功能验证
- [ ] 首次访问显示欢迎弹窗
- [ ] 选择视角后进入引导流程
- [ ] 引导步骤可以前进/后退/跳过
- [ ] 点击引导中的「查看详情」可以打开弹窗
- [ ] 引导完成后正常进入首页

### 核心功能验证
- [ ] 可以添加物品
- [ ] 物品列表正常显示
- [ ] 点击物品可以进入详情页
- [ ] AI 诊断功能正常（如果配置了 API Key）
- [ ] 闲置流转功能正常
- [ ] 家庭守护功能正常

### PWA 功能验证
- [ ] 移动端可以「添加到主屏幕」
- [ ] 离线时可以打开应用（显示缓存页面）
- [ ] Service Worker 正常注册

### 移动端适配验证
- [ ] 手机竖屏显示正常
- [ ] 触控操作流畅
- [ ] 没有横向滚动条
- [ ] 弹窗适配手机屏幕

---

## 🔄 如何更新应用

### 方式一：Git 推送自动更新（推荐）

如果你用了 Vercel + GitHub 集成，更新非常简单：

1. 修改代码
2. 提交并推送：
   ```cmd
   git add .
   git commit -m "更新说明"
   git push
   ```
3. Vercel 会自动检测到更新并重新部署
4. 大约 1 分钟后，访问链接就是最新版本了

### 方式二：手动重新部署

1. 在 Vercel 项目页面，点击 **Deployments**
2. 找到最新的部署，点击 `⋯` → **Redeploy**

---

## ❓ 常见问题排查

### Q1: 推送代码时提示 "Authentication failed"

**原因**：密码输错了，GitHub 现在不支持用账号密码推送。

**解决**：
- 使用 Personal Access Token 作为密码
- 确保 token 勾选了 `repo` 权限
- 参考上面「第 2 步：上传代码到 GitHub」中的 token 获取方式

### Q2: 推送时提示 "Repository not found"

**原因**：GitHub 上还没有创建仓库，或者仓库名/用户名写错了。

**解决**：
- 先去 https://github.com/new 创建仓库
- 检查 `git remote add` 命令中的用户名和仓库名是否正确
- 可以用 `git remote -v` 查看当前配置的远程地址

### Q3: Vercel 部署失败，提示构建错误

**原因**：可能是项目结构问题或配置问题。

**解决**：
1. 点击失败的部署，查看日志
2. 确认项目结构是否符合上面的「项目结构说明」
3. 确认 `vercel.json` 内容正确（只有 `{"version": 2}`）
4. 确认 `api/ai-chat.js` 文件存在且语法正确

### Q4: 部署后页面空白或 404

**原因**：静态文件路径问题。

**解决**：
- 确认 `public/` 目录下有 `index.html`
- 访问链接时不要加额外的路径，直接访问根域名
- 检查 Vercel 部署日志，看静态文件是否正确上传

### Q5: AI 功能不能用，一直显示 fallback 回复

**原因**：没有配置 `AI_API_KEY` 环境变量，或者配置后没有重新部署。

**解决**：
1. 按上面「配置 AI 功能」的步骤添加环境变量
2. **一定要重新部署**（Redeploy），环境变量才会生效
3. 检查 API Key 是否正确，不要有多余的空格
4. 确认 DeepSeek 账号有余额

### Q6: 如何自定义域名？

**解决**：
1. 在 Vercel 项目设置中，点击 **Domains**
2. 输入你的域名，点击 **Add**
3. 按提示去你的域名服务商那里配置 DNS 解析
4. 等待解析生效（几分钟到几小时不等）

### Q7: Vercel 免费版有什么限制？

**Vercel Hobby（免费版）限制**：
- 每月 100GB 带宽
- Serverless Functions 每次执行最长 10 秒
- 每天一定数量的构建次数
- 对于演示和小流量项目完全够用

---

## 📱 PWA 功能说明

部署后，应用支持 PWA（渐进式 Web 应用），可以像原生 App 一样安装到手机桌面。

### 安装方式：

**iPhone (Safari)：**
1. 用 Safari 打开应用链接
2. 点击底部的分享按钮（方形带箭头）
3. 向下滑动，点击「添加到主屏幕」
4. 点击「添加」

**Android (Chrome)：**
1. 用 Chrome 打开应用链接
2. 点击右上角三个点
3. 点击「安装应用」或「添加到主屏幕」
4. 按提示确认

### PWA 功能：
- ✅ 桌面图标，全屏打开，像原生 App
- ✅ 离线缓存，可以离线打开（数据可能不是最新）
- ✅ 启动画面
- ✅ 沉浸式体验，没有浏览器地址栏

---

## 🔒 安全建议

部署到生产环境时，建议做以下安全优化：

1. **配置 CORS 域名**：
   - 在 Vercel 环境变量中设置 `ALLOWED_ORIGIN` 为你的实际域名
   - 例如：`https://wuli-app.vercel.app`
   - 这样只有你的域名可以调用 API

2. **不要泄露 API Key**：
   - API Key 只在 Vercel 环境变量中配置
   - 不要把 API Key 写到代码里
   - 不要把 `.env` 文件提交到 Git（已经在 `.gitignore` 中了）

3. **仓库安全**：
   - 如果仓库是公开的，确保没有敏感信息提交
   - 定期检查 Git 历史中有没有泄露密钥

---

## 📞 需要帮助？

如果在部署过程中遇到问题，可以：

1. 先看上面的「常见问题排查」
2. 查看 Vercel 部署日志（Deployments → 点击某个部署 → Runtime Logs）
3. 打开浏览器开发者工具（F12），查看 Console 和 Network 标签页的错误信息
4. 检查 API 是否正常工作：访问 `https://你的域名/api/ai-chat`，应该看到 `{"error":"Method not allowed"}`，说明 API 正常运行

---

## 🎉 恭喜！

部署完成后，你就拥有了一个：
- ✅ 公开可访问的物历应用
- ✅ 支持手机安装的 PWA 应用
- ✅ AI 驱动的智能管家
- ✅ 自动部署的 CI/CD 流程

快去分享你的应用链接吧！
