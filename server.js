const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = process.env.PORT || 8080;
const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_API_URL = process.env.AI_API_URL || 'https://api.deepseek.com/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 500;
const DAILY_LIMIT = parseInt(process.env.DAILY_LIMIT) || 150;
const IP_HOURLY_LIMIT = parseInt(process.env.IP_HOURLY_LIMIT) || 8;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

let dailyCount = 0;
let dailyDate = new Date().toDateString();
const ipRequests = new Map();

function getIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
}

function checkRateLimit(ip) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;

  const today = new Date().toDateString();
  if (today !== dailyDate) {
    dailyCount = 0;
    dailyDate = today;
  }

  if (dailyCount >= DAILY_LIMIT) {
    return { limited: true, type: 'daily' };
  }

  let requests = ipRequests.get(ip) || [];
  requests = requests.filter(t => t > hourAgo);
  ipRequests.set(ip, requests);

  if (requests.length >= IP_HOURLY_LIMIT) {
    return { limited: true, type: 'ip' };
  }

  requests.push(now);
  ipRequests.set(ip, requests);
  dailyCount++;

  return { limited: false };
}

const RICE_COOKER_MANUAL = `
美的MB-FB40S705电饭煲说明书
产品类型：智能电饭煲
容量：4L
额定电压：220V
额定功率：860W

常见故障与解决方法：
1. 饭煮不熟：检查内胆是否变形，电热盘是否有异物，水量是否足够
2. 饭煮糊了：检查水量是否过少，选择的烹饪模式是否正确，温控器是否故障
3. 无法启动：检查电源插头是否插好，上盖是否盖紧，选择功能后是否按了开始键
4. 出现E1错误码：顶部温度传感器开路，需要联系售后
5. 出现E2错误码：顶部温度传感器短路，需要联系售后
6. 出现E3错误码：底部温度传感器开路，需要联系售后
7. 出现E4错误码：底部温度传感器短路，需要联系售后
8. 按键无反应：检查是否锁定了童锁功能，长按"保温/取消"3秒解锁
9. 有异味：首次使用可能有塑胶味，用清水煮一次开水倒掉即可
10. 漏水：检查密封圈是否安装正确，内胆是否有裂痕

保养建议：
- 每次使用后及时清洁内胆和锅盖
- 定期清理蒸汽阀
- 不要用钢丝球清洗内胆
- 长期不用时保持干燥通风
`;

function callAI(userMessage, itemInfo = {}) {
  const { itemName = '家电', brand = '', model = '', category = '' } = itemInfo;
  
  let categoryDesc = '';
  let manualContent = '';
  let tips = '';
  
  if (itemName.includes('电饭煲') || itemName.includes('电饭锅') || category === 'kitchen' || category === '家电') {
    categoryDesc = '厨房家电';
    manualContent = RICE_COOKER_MANUAL;
    tips = '定期清洗内胆、检查电源线、使用配套量杯';
  } else if (itemName.includes('空调')) {
    categoryDesc = '大家电';
    manualContent = `空调使用说明：
1. 制冷温度建议设置在26°C左右，既舒适又省电
2. 每月清洗一次过滤网，保持空气清新
3. 长时间不用请拔掉电源
4. 室外机周围不要堆放杂物，保持通风
5. 制热时出风口朝下，制冷时朝上，效果更好
常见故障：
- 不制冷：可能是缺氟、过滤网堵塞、压缩机故障
- 漏水：可能是排水管堵塞、安装不水平
- 有异味：可能是过滤网需要清洗、内部滋生细菌
- 噪音大：可能是安装不牢固、风机故障
保养建议：
- 每两周清洗过滤网
- 每年请专业人员深度清洁一次
- 换季时开机运行30分钟再使用`;
    tips = '每月清洗滤网、夏天使用前先通风、温度设置26°C最舒适';
  } else if (itemName.includes('洗衣机')) {
    categoryDesc = '大家电';
    manualContent = `洗衣机使用说明：
1. 洗衣服前请掏出口袋里的硬物
2. 按衣物材质选择合适的洗涤程序
3. 洗衣液不要放太多，避免残留
4. 洗完后及时取出衣物，防止闷出异味
5. 定期清洗过滤网和滚筒
常见故障：
- 不进水：可能是水龙头没开、进水阀堵塞、水压低
- 不排水：可能是排水管堵塞、排水泵故障
- 不脱水：可能是衣物不平衡、门没关好、皮带松动
- 有异味：可能是滚筒需要清洁、过滤网脏了
保养建议：
- 每月用筒清洁程序清洗一次
- 洗完后开门通风，保持干燥
- 定期清理过滤网`;
    tips = '洗完开门通风、每月筒清洁、洗衣前掏口袋';
  } else if (itemName.includes('冰箱')) {
    categoryDesc = '大家电';
    manualContent = `冰箱使用说明：
1. 冰箱要放在通风处，离墙至少10cm
2. 热的食物放凉后再放进冰箱
3. 冷藏室温度建议2-8°C，冷冻室-18°C以下
4. 不要塞太满，冷空气需要循环
5. 定期除霜和清洁
常见故障：
- 不制冷：可能是电源问题、压缩机故障、漏氟
- 噪音大：可能是放置不平稳、压缩机正常工作声
- 漏水：可能是排水管堵塞、门封条不严
- 结冰严重：可能是门没关好、温度设置太低
保养建议：
- 每月清洁一次内壁
- 定期检查门封条密封性
- 后背冷凝器每年除尘一次`;
    tips = '热食放凉再放、每月清洁内壁、检查门封条密封';
  } else if (itemName.includes('微波炉')) {
    categoryDesc = '厨房家电';
    manualContent = `微波炉使用说明：
1. 不要加热金属容器、带金边的餐具
2. 加热带壳的食物要先刺破，比如鸡蛋
3. 加热液体后要搅拌一下再喝，防止爆沸
4. 保持炉腔清洁，有污渍及时擦
5. 不要空烧
常见故障：
- 不加热：可能是磁控管坏了、高压保险丝断了
- 打火：可能是炉腔内有金属、油污太多
- 噪音大：可能是散热风扇、变压器正常工作声
- 门关不严：可能是门封条老化、铰链松动
保养建议：
- 每次用完擦干净内壁
- 定期检查门封条
- 不要加热密闭容器`;
    tips = '禁用金属容器、加热后搅拌、及时清洁内壁';
  } else {
    categoryDesc = '家居用品';
    manualContent = `${itemName}使用和保养通用建议：
1. 阅读说明书，了解正确使用方法
2. 定期清洁保养，延长使用寿命
3. 发现异常及时断电，联系专业人员维修
4. 保留购买凭证和保修卡
5. 注意用电安全，人走断电`;
    tips = '定期清洁保养、出现异常及时断电维修';
  }
  
  const fullBrand = brand ? `${brand} ${model || ''}`.trim() : itemName;
  
  return new Promise((resolve, reject) => {
    const messages = [
      {
        role: 'system',
        content: `你是物历App的AI管家小历，专门负责${categoryDesc}的故障诊断和使用咨询。用户现在问的是关于「${fullBrand}」的问题。请结合下面的参考知识给出专业、友好、清晰的回答。

回复要求：
1. 先用亲切的语气问候
2. 分析可能的原因（2-3条最常见的）
3. 给出分步排查建议（简单易行的）
4. 如果需要联系售后或专业维修，明确说明
5. 回复简洁明了，不超过300字
6. 用中文回复，用emoji点缀让内容更生动
7. 最后加一句温暖的小建议

参考知识：
${manualContent}

日常保养小贴士：${tips}`
      },
      { role: 'user', content: userMessage }
    ];

    const postData = JSON.stringify({
      model: AI_MODEL,
      messages: messages,
      max_tokens: MAX_TOKENS,
      temperature: 0.7
    });

    const url = new URL(AI_API_URL);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.choices && result.choices[0] && result.choices[0].message) {
            resolve(result.choices[0].message.content);
          } else {
            reject(new Error('Invalid response format'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function serveStatic(req, res) {
  let filePath = req.url === '/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (ALLOWED_ORIGIN !== '*') {
    if (origin && origin !== ALLOWED_ORIGIN) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'CORS not allowed' }));
      return;
    }
  }

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/api/ai-chat' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const userMessage = (data.message || '').trim();
        const itemCategory = data.category || '';

        if (!userMessage) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '消息不能为空' }));
          return;
        }

        if (userMessage.length > 300) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: '消息太长啦，请简短描述问题～' }));
          return;
        }

        const ip = getIp(req);
        const rateCheck = checkRateLimit(ip);

        if (rateCheck.limited) {
          res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
          let message;
          if (rateCheck.type === 'daily') {
            message = '今天的AI管家体验名额已经被大家用完啦，明天再来试试吧~';
          } else {
            message = '你今天问的问题已经够多啦，休息一下明天再来吧~';
          }
          res.end(JSON.stringify({ error: message, limited: true }));
          return;
        }

        if (AI_API_KEY) {
          try {
            const itemInfo = {
              itemName: data.itemName || '',
              brand: data.brand || '',
              model: data.model || '',
              category: data.category || ''
            };
            const reply = await callAI(userMessage, itemInfo);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({ reply: reply, fromAI: true }));
          } catch (e) {
            console.error('AI API error:', e.message);
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            res.end(JSON.stringify({
              reply: '哎呀，AI管家正在休息，请稍后再试试吧。不过你可以先检查一下电源是否插好、开关是否打开~',
              fromAI: false
            }));
          }
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            reply: null,
            fromAI: false,
            fallback: true
          }));
        }
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: '服务器错误' }));
      }
    });
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`物历服务器运行在 http://localhost:${PORT}`);
  console.log(`每日调用上限: ${DAILY_LIMIT} 次`);
  console.log(`每IP每小时上限: ${IP_HOURLY_LIMIT} 次`);
  console.log(`AI模型: ${AI_MODEL}`);
  console.log(`API已配置: ${AI_API_KEY ? '是' : '否（将使用脚本模拟回复）'}`);
});
