# 首次使用引导系统实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为物历应用实现首次使用引导系统，包含场景化引导内容和可点击模块详情功能

**Architecture:** 在现有SPA架构中新增引导层，使用遮罩+弹窗方式实现渐进式引导，通过状态管理控制引导流程，支持3种视角的差异化内容

**Tech Stack:** 纯JavaScript + CSS，单文件实现（index.html），复用现有showModal系统

---

## 文件结构

**主要修改文件：**
- `index.html` - 唯一需要修改的文件，包含所有逻辑

**修改范围：**
1. AppState新增引导相关状态
2. 新增ONBOARDING_GUIDES配置数据
3. 新增引导相关函数（showWelcomeModal, showGuideStep, showModuleDetail等）
4. 新增引导相关CSS样式
5. 修改视角选择后触发引导逻辑

---

## 任务分解

### Task 1: 添加引导状态管理

**Files:**
- Modify: `index.html:2882-2903` (AppState定义处)

- [ ] **Step 1: 找到AppState定义位置**

在index.html约2882行找到AppState定义

- [ ] **Step 2: 在AppState中添加引导相关状态**

在 `isProcessing: false` 后添加新状态：

```javascript
isProcessing: false,
hasSeenOnboarding: false,      // 是否已完成首次引导
onboardingStep: 0,              // 当前引导步骤 (0=未开始, 1-4=引导中)
onboardingPerspective: null,     // 引导时的视角
```

### Task 2: 创建引导配置数据

**Files:**
- Modify: `index.html:2905` (在AppState后添加配置)

- [ ] **Step 1: 在AppState定义后添加ONBOARDING_GUIDES配置**

在 `// ==================== 安全工具函数 ====================` 前添加：

```javascript
    // ==================== 首次使用引导配置 ====================
    const ONBOARDING_GUIDES = {
      newlywed: [
        {
          id: 'archives',
          title: '物品档案',
          desc: '为你们的共同物品建立档案，说明书、购入日期都能记录',
          icon: 'package',
          tips: ['点击"+"添加新物品', '可以拍照保存说明书', '保修期快到时会自动提醒'],
          action: "navigateTo('archives')"
        },
        {
          id: 'ai-chat',
          title: 'AI 管家',
          desc: '电饭煲不工作了？先问问AI管家，自检能解决大部分问题',
          icon: 'bot',
          tips: ['描述你遇到的问题', 'AI会给出排查建议', '大部分故障可以自行解决'],
          action: "navigateTo('chat', {id: AppState.items[0]?.id})"
        },
        {
          id: 'idle',
          title: '闲置流转',
          desc: '闲置的婚庆物品可以分享给邻居，还能增进邻里关系',
          icon: 'repeat',
          tips: ['拍张照片就能发布', '邻居可以直接联系你', '闲置物品重新发挥作用'],
          action: "navigateTo('idle')"
        },
        {
          id: 'care',
          title: '家庭守护',
          desc: '设置双方父母的用药提醒，远在千里也能关心到位',
          icon: 'heart',
          tips: ['添加家庭成员', '设置用药提醒', '实时掌握家人健康'],
          action: "navigateTo('care')"
        }
      ],
      secondhand: [
        {
          id: 'idle',
          title: '闲置流转',
          desc: '拍张照就能发布闲置，买家直接联系你',
          icon: 'repeat',
          tips: ['多角度拍照更易成交', '设置合理的价格', '及时回复咨询'],
          action: "navigateTo('idle')"
        },
        {
          id: 'archives',
          title: '物品档案',
          desc: '二手物品更要看重保养记录，这些信息都要保存好',
          icon: 'package',
          tips: ['记录购买日期和价格', '保存好交易凭证', '方便下次转卖定价'],
          action: "navigateTo('archives')"
        },
        {
          id: 'ai-chat',
          title: 'AI 管家',
          desc: '不知道该卖多少钱？AI帮你智能估价',
          icon: 'bot',
          tips: ['描述物品成色', 'AI给出参考价格', '帮助设置合理预期'],
          action: "navigateTo('chat', {id: AppState.items[0]?.id})"
        },
        {
          id: 'care',
          title: '家庭守护',
          desc: '家人健康也要关注，设置用药提醒更安心',
          icon: 'heart',
          tips: ['添加家庭成员信息', '设置重要物品提醒', '关注家人健康'],
          action: "navigateTo('care')"
        }
      ],
      family: [
        {
          id: 'care',
          title: '家庭守护',
          desc: '添加爸妈的常用物品和药品，实时掌握健康状态',
          icon: 'heart',
          tips: ['添加家庭成员', '记录常用药品', '设置定期提醒'],
          action: "navigateTo('care')"
        },
        {
          id: 'archives',
          title: '物品档案',
          desc: '家人的贵重物品也能一起管理，有据可查',
          icon: 'package',
          tips: ['记录重要物品', '保存购买凭证', '方便查找和管理'],
          action: "navigateTo('archives')"
        },
        {
          id: 'ai-chat',
          title: 'AI 管家',
          desc: '设备故障不会处理？AI管家帮你远程诊断',
          icon: 'bot',
          tips: ['详细描述症状', '按照AI建议排查', '省去上门维修'],
          action: "navigateTo('chat', {id: AppState.items[0]?.id})"
        },
        {
          id: 'idle',
          title: '闲置流转',
          desc: '闲置物品流转出去，腾出更多生活空间',
          icon: 'repeat',
          tips: ['定期整理闲置', '分享给需要的人', '让物品继续发挥作用'],
          action: "navigateTo('idle')"
        }
      ]
    };

    // 模块详情配置（用于详情弹窗）
    const MODULE_DETAILS = {
      perspective: {
        title: '视角切换',
        icon: 'users',
        desc: '物历提供三种专属体验视角，适应不同的使用场景',
        tips: ['新婚视角：适合新婚夫妻共建小家', '二手视角：方便闲置流转和二手交易', '家庭守护：专注远程照顾家人']
      },
      archives: {
        title: '物品档案',
        icon: 'package',
        desc: '为每件物品建立专属数字档案，记录一切重要信息',
        tips: ['建立物品户口本', '保存说明书照片', '记录保修和购买信息', '临期自动提醒']
      },
      idle: {
        title: '闲置流转',
        icon: 'repeat',
        desc: '将闲置物品分享给邻居，让资源循环利用',
        tips: ['拍照发布闲置', '邻居直接联系', '社区信任背书', '环保又有社交']
      },
      care: {
        title: '家庭守护',
        icon: 'heart',
        desc: '远程守护家人健康，管理家庭物品和药品',
        tips: ['添加家庭成员', '设置用药提醒', '关注家人物品状态', '不在身边也能关心']
      },
      'value-dashboard': {
        title: '价值仪表盘',
        icon: 'bar-chart-2',
        desc: '展示你使用物历创造的价值和成就',
        tips: ['说明书保存数量', '避免上门维修次数', '社区流转件数', '家人用药提醒次数']
      },
      'community-stats': {
        title: '社区数据',
        icon: 'users',
        desc: '看看邻居们都在怎么用物历',
        tips: ['社区总建档物品', '活跃家庭数量', '成功流转件数', '参与社区共建']
      }
    };
```

### Task 3: 实现引导核心函数

**Files:**
- Modify: `index.html:5090` (在showTroubleshoot函数后添加)

- [ ] **Step 1: 在showTroubleshoot函数后添加引导相关函数**

在 `function showTroubleshoot` 结束后（约5072行）添加：

```javascript
    // ==================== 首次使用引导函数 ====================
    
    function startOnboarding(perspective) {
      AppState.hasSeenOnboarding = true;
      AppState.onboardingPerspective = perspective;
      AppState.onboardingStep = 1;
      showWelcomeModal();
    }

    function showWelcomeModal() {
      const perspective = AppState.onboardingPerspective;
      const perspectiveConfig = {
        newlywed: { emoji: '💑', name: '新婚', desc: '共建温馨小家' },
        secondhand: { emoji: '🔄', name: '二手', desc: '闲置流转达人' },
        family: { emoji: '👨‍👩‍👧', name: '守护', desc: '家人健康卫士' }
      };
      const config = perspectiveConfig[perspective] || perspectiveConfig.newlywed;

      showModal(`
        <div style="text-align:center;padding:20px 0;">
          <div style="font-size:64px;margin-bottom:20px;">🎉</div>
          <h2 style="font-size:22px;font-weight:700;color:var(--color-text);margin-bottom:12px;">欢迎来到物历！</h2>
          <p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:24px;">
            你选择了 <span style="color:var(--color-primary);font-weight:600;">${config.emoji} ${config.name}视角</span><br>
            <span style="color:var(--color-text-light);">${config.desc}</span>
          </p>
          <p style="font-size:14px;color:var(--color-text-secondary);margin-bottom:32px;line-height:1.8;">
            让我带你快速了解一下<br>这个视角的核心功能吧
          </p>
          <button class="btn btn-primary btn-block" onclick="hideModal(); setTimeout(() => showGuideStep(1), 300);" style="margin-bottom:12px;">
            <i data-lucide="compass" style="width:18px;height:18px;"></i>
            开始探索
          </button>
          <button class="btn btn-secondary btn-sm" onclick="skipOnboarding()" style="background:transparent;border:none;color:var(--color-text-light);">
            跳过引导
          </button>
        </div>
      `, false);
      lucide.createIcons();
    }

    function showGuideStep(step) {
      const guides = ONBOARDING_GUIDES[AppState.onboardingPerspective] || ONBOARDING_GUIDES.newlywed;
      if (step > guides.length) {
        completeOnboarding();
        return;
      }

      const guide = guides[step - 1];
      const totalSteps = guides.length;

      // 创建遮罩层
      let overlay = document.getElementById('onboardingOverlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'onboardingOverlay';
        overlay.className = 'onboarding-overlay';
        document.body.appendChild(overlay);
      }

      // 更新遮罩内容
      overlay.innerHTML = `
        <div class="onboarding-tooltip ${step > 1 ? 'with-prev' : ''}">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
            <span style="font-size:12px;color:var(--color-text-light);">步骤 ${step}/${totalSteps}</span>
            <button onclick="skipOnboarding()" style="background:none;border:none;color:var(--color-text-light);cursor:pointer;font-size:12px;">跳过</button>
          </div>
          <div style="width:56px;height:56px;background:linear-gradient(135deg,var(--color-primary-soft),var(--color-cream));border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <i data-lucide="${guide.icon}" style="width:28px;height:28px;color:var(--color-primary);"></i>
          </div>
          <h3 style="font-size:18px;font-weight:700;color:var(--color-text);margin-bottom:8px;">${guide.title}</h3>
          <p style="font-size:13px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:24px;">${guide.desc}</p>
          <div style="display:flex;gap:10px;">
            ${step > 1 ? `
              <button onclick="showGuideStep(${step - 1})" class="btn btn-secondary btn-sm" style="flex:1;">
                <i data-lucide="arrow-left" style="width:14px;height:14px;"></i>
                上一步
              </button>
            ` : '<div style="flex:1;"></div>'}
            <button onclick="${guide.action}; showGuideStep(${step + 1});" class="btn btn-primary btn-sm" style="flex:1;">
              ${step === totalSteps ? '完成' : '下一步'}
              <i data-lucide="${step === totalSteps ? 'check' : 'arrow-right'}" style="width:14px;height:14px;"></i>
            </button>
          </div>
        </div>
        <div class="onboarding-progress">
          ${Array(totalSteps).fill(0).map((_, i) => `
            <div class="progress-dot ${i + 1 === step ? 'active' : ''} ${i + 1 < step ? 'completed' : ''}"></div>
          `).join('')}
        </div>
      `;

      overlay.classList.add('active');
      lucide.createIcons();
      AppState.onboardingStep = step;
    }

    function skipOnboarding() {
      const overlay = document.getElementById('onboardingOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      }
      AppState.onboardingStep = 0;
      AppState.hasSeenOnboarding = true;
      localStorage.setItem('hasSeenOnboarding', 'true');
      renderPage();
    }

    function completeOnboarding() {
      const overlay = document.getElementById('onboardingOverlay');
      if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
      }
      AppState.onboardingStep = 0;
      AppState.hasSeenOnboarding = true;
      localStorage.setItem('hasSeenOnboarding', 'true');
      showToast('引导完成，开始使用物历吧！');
      renderPage();
    }

    function showModuleDetail(moduleId) {
      const detail = MODULE_DETAILS[moduleId];
      if (!detail) return;

      showModal(`
        <div style="text-align:center;padding:16px 0 24px;">
          <div style="width:72px;height:72px;background:linear-gradient(135deg,var(--color-primary-soft),var(--color-cream));border-radius:20px;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;box-shadow:0 8px 24px rgba(74,124,92,0.15);">
            <i data-lucide="${detail.icon}" style="width:36px;height:36px;color:var(--color-primary);"></i>
          </div>
          <h3 style="font-size:20px;font-weight:700;color:var(--color-text);margin-bottom:8px;">${detail.title}</h3>
          <p style="font-size:14px;color:var(--color-text-secondary);line-height:1.6;margin-bottom:24px;">${detail.desc}</p>
          
          <div style="background:var(--color-cream);border-radius:var(--radius-md);padding:18px;margin-bottom:16px;text-align:left;">
            <div style="font-size:13px;font-weight:600;color:var(--color-text);margin-bottom:12px;display:flex;align-items:center;gap:8px;">
              <i data-lucide="lightbulb" style="width:16px;height:16px;color:var(--color-honey);"></i>
              使用技巧
            </div>
            ${detail.tips.map(tip => `
              <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;font-size:13px;color:var(--color-text-secondary);line-height:1.5;">
                <span style="color:var(--color-primary);font-weight:600;">•</span>
                <span>${tip}</span>
              </div>
            `).join('')}
          </div>
          
          <button class="btn btn-primary btn-block" onclick="hideModal()">
            <i data-lucide="check" style="width:18px;height:18px;"></i>
            我知道了
          </button>
        </div>
      `, false);
      lucide.createIcons();
    }
```

### Task 4: 添加引导CSS样式

**Files:**
- Modify: `index.html:1800` (在现有样式后添加)

- [ ] **Step 1: 在CSS部分添加引导相关样式**

在 `/* ==================== 响应式样式 ==================== */` 注释前（约1800行）添加：

```css
    /* ==================== 首次使用引导样式 ==================== */
    
    .onboarding-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      z-index: 9998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .onboarding-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    
    .onboarding-tooltip {
      position: absolute;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 48px);
      max-width: 340px;
      background: white;
      border-radius: 24px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      text-align: center;
      z-index: 9999;
    }
    
    .onboarding-tooltip.with-prev {
      bottom: 180px;
    }
    
    .onboarding-progress {
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 9999;
    }
    
    .progress-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }
    
    .progress-dot.active {
      width: 24px;
      border-radius: 4px;
      background: var(--color-primary);
    }
    
    .progress-dot.completed {
      background: var(--color-primary-light);
    }
    
    /* 模块可点击提示样式 */
    .module-clickable {
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .module-clickable:hover {
      transform: scale(1.02);
      box-shadow: 0 8px 24px rgba(74, 124, 92, 0.2);
    }
    
    .module-clickable::after {
      content: '点击查看详情';
      position: absolute;
      top: -8px;
      right: -8px;
      background: var(--color-primary);
      color: white;
      font-size: 10px;
      padding: 4px 8px;
      border-radius: 8px;
      opacity: 0;
      transform: translateY(4px);
      transition: all 0.2s ease;
      pointer-events: none;
      white-space: nowrap;
    }
    
    .module-clickable:hover::after {
      opacity: 1;
      transform: translateY(0);
    }
```

### Task 5: 在视角选择后触发引导

**Files:**
- Modify: `index.html` (找到showPerspectivePicker函数并修改)

- [ ] **Step 1: 找到showPerspectivePicker函数**

在文件中搜索 `function showPerspectivePicker`，约在3251行

- [ ] **Step 2: 找到视角选择后的回调函数**

在showPerspectivePicker函数中找到选择视角后的处理逻辑，添加引导触发：

找到类似这样的代码：
```javascript
PERSPECTIVES[perspective].name;
hideModal();
navigateTo('home');
```

修改为：
```javascript
PERSPECTIVES[perspective].name;
hideModal();
AppState.currentPerspective = perspective;
// 检查是否需要显示引导
if (!localStorage.getItem('hasSeenOnboarding') && !AppState.hasSeenOnboarding) {
  setTimeout(() => startOnboarding(perspective), 500);
} else {
  navigateTo('home');
}
```

### Task 6: 为关键模块添加可点击功能

**Files:**
- Modify: `index.html` (首页渲染函数中的模块)

- [ ] **Step 1: 修改首页视角横幅**

在 `renderHomePage` 函数中找到视角横幅（约4313行）：
```javascript
<div class="perspective-banner" onclick="showPerspectivePicker()">
```

修改为：
```javascript
<div class="perspective-banner module-clickable" onclick="showPerspectivePicker()">
```

- [ ] **Step 2: 修改物品档案卡片**

找到物品档案卡片（约4331行）：
```javascript
<div class="widget-card" style="background:linear-gradient(135deg,var(--color-cream) 0%,#FFF5E8 100%);">
```

修改为：
```javascript
<div class="widget-card module-clickable" style="background:linear-gradient(135deg,var(--color-cream) 0%,#FFF5E8 100%);position:relative;" onclick="showModuleDetail('archives')">
```

- [ ] **Step 3: 修改闲置流转卡片**

找到闲置流转卡片（约4341行），添加相同的可点击属性：
```javascript
<div class="widget-card module-clickable" style="background:linear-gradient(135deg,var(--color-primary-soft) 0%,#D4E8DB 100%);position:relative;" onclick="showModuleDetail('idle')">
```

- [ ] **Step 4: 修改价值仪表盘容器**

找到价值仪表盘（约4353行），添加可点击功能：
```javascript
<div class="value-dashboard module-clickable" onclick="showModuleDetail('value-dashboard')" style="position:relative;cursor:pointer;">
```

### Task 7: 测试和调试

**Files:**
- 测试文件: `http://localhost:8080` (本地服务器)

- [ ] **Step 1: 清除本地存储并刷新**

在浏览器控制台执行：
```javascript
localStorage.clear();
location.reload();
```

- [ ] **Step 2: 选择视角触发引导**

1. 进入应用后选择任意视角
2. 应该看到欢迎卡片弹窗
3. 点击"开始探索"进入4步引导

- [ ] **Step 3: 测试引导流程**

1. 检查每一步是否正确显示对应模块的指引
2. 测试"上一步"、"下一步"按钮
3. 测试"跳过引导"按钮
4. 测试最后一步点击"完成"

- [ ] **Step 4: 测试模块详情**

1. 刷新页面
2. 点击首页的物品档案卡片
3. 应该显示详情弹窗
4. 检查所有可点击模块

- [ ] **Step 5: 测试引导不再显示**

1. 完成引导后刷新页面
2. 引导不应再自动弹出
3. 模块详情功能应正常工作

---

## 实施检查清单

- [ ] Task 1: 添加引导状态管理
- [ ] Task 2: 创建引导配置数据
- [ ] Task 3: 实现引导核心函数
- [ ] Task 4: 添加引导CSS样式
- [ ] Task 5: 在视角选择后触发引导
- [ ] Task 6: 为关键模块添加可点击功能
- [ ] Task 7: 测试和调试

---

## 预期结果

1. 用户首次选择视角后立即显示欢迎卡片
2. 4步渐进引导帮助用户了解核心功能
3. 引导结束后，用户可随时点击各模块查看详情
4. 引导状态持久化，不会重复显示

---

## 可能的调试点

1. **引导不显示**: 检查localStorage是否被正确读取
2. **遮罩不消失**: 确保completeOnboarding和skipOnboarding正确移除overlay
3. **图标不显示**: 确保lucide.createIcons()在弹窗显示后调用
4. **模块详情不工作**: 检查MODULE_DETAILS中是否包含对应的moduleId
