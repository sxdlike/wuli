const https = require('https');

const AI_API_KEY = process.env.AI_API_KEY || '';
const AI_API_URL = process.env.AI_API_URL || 'https://api.deepseek.com/chat/completions';
const AI_MODEL = process.env.AI_MODEL || 'deepseek-chat';
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS) || 500;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

function jsonResponse(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
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
    manualContent = `空调使用说明：\n1. 制冷温度建议设置在26°C左右，既舒适又省电\n2. 每月清洗一次过滤网，保持空气清新\n3. 长时间不用请拔掉电源\n4. 室外机周围不要堆放杂物，保持通风\n5. 制热时出风口朝下，制冷时朝上，效果更好\n常见故障：\n- 不制冷：可能是缺氟、过滤网堵塞、压缩机故障\n- 漏水：可能是排水管堵塞、安装不水平\n- 有异味：可能是过滤网需要清洗、内部滋生细菌\n- 噪音大：可能是安装不牢固、风机故障\n保养建议：\n- 每两周清洗过滤网\n- 每年请专业人员深度清洁一次\n- 换季时开机运行30分钟再使用`;
    tips = '每月清洗滤网、夏天使用前先通风、温度设置26°C最舒适';
  } else if (itemName.includes('洗衣机')) {
    categoryDesc = '大家电';
    manualContent = `洗衣机使用说明：\n1. 洗衣服前请掏出口袋里的硬物\n2. 按衣物材质选择合适的洗涤程序\n3. 洗衣液不要放太多，避免残留\n4. 洗完后及时取出衣物，防止闷出异味\n5. 定期清洗过滤网和滚筒\n常见故障：\n- 不进水：可能是水龙头没开、进水阀堵塞、水压低\n- 不排水：可能是排水管堵塞、排水泵故障\n- 不脱水：可能是衣物不平衡、门没关好、皮带松动\n- 有异味：可能是滚筒需要清洁、过滤网脏了\n保养建议：\n- 每月用筒清洁程序清洗一次\n- 洗完后开门通风，保持干燥\n- 定期清理过滤网`;
    tips = '洗完开门通风、每月筒清洁、洗衣前掏口袋';
  } else if (itemName.includes('冰箱')) {
    categoryDesc = '大家电';
    manualContent = `冰箱使用说明：\n1. 冰箱要放在通风处，离墙至少10cm\n2. 热的食物放凉后再放进冰箱\n3. 冷藏室温度建议2-8°C，冷冻室-18°C以下\n4. 不要塞太满，冷空气需要循环\n5. 定期除霜和清洁\n常见故障：\n- 不制冷：可能是电源问题、压缩机故障、漏氟\n- 噪音大：可能是放置不平稳、压缩机正常工作声\n- 漏水：可能是排水管堵塞、门封条不严\n- 结冰严重：可能是门没关好、温度设置太低\n保养建议：\n- 每月清洁一次内壁\n- 定期检查门封条密封性\n- 后背冷凝器每年除尘一次`;
    tips = '热食放凉再放、每月清洁内壁、检查门封条密封';
  } else if (itemName.includes('微波炉')) {
    categoryDesc = '厨房家电';
    manualContent = `微波炉使用说明：\n1. 不要加热金属容器、带金边的餐具\n2. 加热带壳的食物要先刺破，比如鸡蛋\n3. 加热液体时要放一根非金属的搅拌棒\n4. 定期清洁内壁，保持卫生\n5. 门封条要保持清洁，确保密封\n常见故障：\n- 不加热：可能是高压保险丝熔断、磁控管故障\n- 转盘不转：可能是转盘电机故障\n- 门关不紧：可能是门封条老化、门钩损坏\n- 有火花：可能是使用了金属容器、内壁有污渍\n保养建议：\n- 每次使用后擦拭内壁\n- 定期检查门封条\n- 不要空转运行`;
    tips = '不要放金属、加热液体放搅拌棒、定期清洁内壁';
  } else {
    categoryDesc = '家电';
    manualContent = `使用说明：\n1. 使用前请仔细阅读说明书\n2. 确保电源连接正常\n3. 按照产品说明正确操作\n4. 遇到问题先检查电源和设置\n5. 定期保养可延长使用寿命`;
    tips = '仔细阅读说明书、定期检查保养、遇到问题先查电源';
  }

  const systemPrompt = `你是物历App的AI管家，一个专业的家电维修顾问。用户正在咨询关于${itemName}的问题。\n\n${brand ? `品牌：${brand}` : ''}\n${model ? `型号：${model}` : ''}\n类别：${categoryDesc}\n\n${manualContent ? `相关说明书内容：\n${manualContent}\n` : ''}\n使用技巧：${tips}\n\n请根据用户的问题，给出专业、简洁、实用的建议。如果是简单故障，优先提供自行排查的步骤；如果是复杂问题，建议联系售后。回答要亲切友好，像邻居家的维修师傅一样。`;

  return new Promise((resolve, reject) => {
    const url = new URL(AI_API_URL);
    const postData = JSON.stringify({
      model: AI_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      max_tokens: MAX_TOKENS,
      temperature: 0.7
    });

    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const request = https.request(options, (response) => {
      let data = '';
      response.on('data', (chunk) => { data += chunk; });
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.choices && result.choices[0] && result.choices[0].message) {
            resolve(result.choices[0].message.content);
          } else if (result.error) {
            reject(new Error(result.error.message || 'AI API error'));
          } else {
            reject(new Error('Invalid AI response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    request.on('error', (error) => reject(error));
    request.write(postData);
    request.end();
  });
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

module.exports = async (req, res) => {
  // CORS
  const origin = req.headers.origin;
  if (ALLOWED_ORIGIN !== '*') {
    if (origin && origin !== ALLOWED_ORIGIN) {
      jsonResponse(res, 403, { error: 'CORS not allowed' });
      return;
    }
  }

  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    jsonResponse(res, 405, { error: 'Method not allowed' });
    return;
  }

  try {
    const body = await parseBody(req);
    const { message, category, itemName, brand, model } = body || {};
    const userMessage = (message || '').trim();

    if (!userMessage) {
      jsonResponse(res, 400, { error: '消息不能为空' });
      return;
    }

    if (userMessage.length > 300) {
      jsonResponse(res, 400, { error: '消息太长啦，请简短描述问题～' });
      return;
    }

    if (AI_API_KEY) {
      try {
        const itemInfo = { itemName: itemName || '', brand: brand || '', model: model || '', category: category || '' };
        const reply = await callAI(userMessage, itemInfo);
        jsonResponse(res, 200, { reply, fromAI: true });
      } catch (e) {
        console.error('AI API error:', e.message);
        jsonResponse(res, 200, {
          reply: '哎呀，AI管家正在休息，请稍后再试试吧。不过你可以先检查一下电源是否插好、开关是否打开~',
          fromAI: false
        });
      }
    } else {
      jsonResponse(res, 200, { reply: null, fromAI: false, fallback: true });
    }
  } catch (e) {
    jsonResponse(res, 500, { error: '服务器错误' });
  }
};
