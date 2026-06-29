# 物历 Android 客户端

基于 WebView 的安卓 App，打包物历 Web 应用。

## 📦 项目结构

```
android/
├── app/
│   ├── build.gradle                    # App 构建配置
│   └── src/main/
│       ├── AndroidManifest.xml          # 应用清单
│       ├── java/com/wuli/app/
│       │   └── MainActivity.java        # 主 Activity
│       └── res/
│           ├── layout/
│           │   └── activity_main.xml    # 主布局
│           └── values/
│               ├── strings.xml          # 字符串资源
│               └── themes.xml           # 主题样式
├── build.gradle                         # 顶层构建配置
└── settings.gradle                      # 项目设置
```

## 🚀 构建步骤

### 前置准备
1. 下载 Android Studio：https://developer.android.com/studio
2. 安装 Android SDK（API 33+）

### 步骤 1：修改配置

打开 `app/src/main/java/com/wuli/app/MainActivity.java`，修改第 26 行：

```java
// 改成你部署好的网站地址
private static final String BASE_URL = "https://你的部署域名.vercel.app";
```

### 步骤 2：导入项目

1. 打开 Android Studio
2. 选择 **"Open an existing project"**
3. 选择 `android` 文件夹
4. 等待 Gradle 同步完成

### 步骤 3：生成 APK

**Debug 版（快速测试）：**
1. 菜单 → **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. 生成路径：`app/build/outputs/apk/debug/app-debug.apk`
3. 安装到手机测试

**Release 版（正式发布）：**
1. 菜单 → **Build** → **Generate Signed Bundle / APK**
2. 选择 **APK**
3. 创建或选择签名密钥
4. 选择 `release` Build Variant
5. 生成签名后的 APK

## ✨ 功能特性

- ✅ 全屏 WebView 加载，沉浸式体验
- ✅ 下拉刷新（SwipeRefreshLayout）
- ✅ 顶部进度条，显示加载进度
- ✅ 返回键回退网页历史
- ✅ 支持 JavaScript 和 DOM Storage
- ✅ 适配横竖屏切换
- ✅ 主题色与物历品牌一致

## 🎨 自定义配置

### 修改应用名称
编辑 `res/values/strings.xml`：
```xml
<string name="app_name">物历 WùLì</string>
```

### 修改主题色
编辑 `res/values/themes.xml`：
```xml
<item name="colorPrimary">#4A7C5C</item>
```

### 修改应用图标
替换 `res/mipmap-*/ic_launcher.png` 图标文件

### 修改包名
1. 修改 `AndroidManifest.xml` 中的 `package`
2. 修改 `build.gradle` 中的 `applicationId`
3. 对应修改 Java 文件的包路径

## ⚙️ 技术栈

- **最低 SDK**: API 21 (Android 5.0)
- **目标 SDK**: API 33 (Android 13)
- **语言**: Java
- **UI**: WebView + SwipeRefreshLayout
- **构建工具**: Gradle 7.4.2

## 📱 兼容范围

支持 Android 5.0 及以上设备，覆盖市场 99%+ 的安卓手机。
