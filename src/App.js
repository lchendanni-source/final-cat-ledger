import { useState, useEffect, useRef, useMemo, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// 🎵 MEOW SOUND ENGINE (Web Audio API — no files needed)
// ═══════════════════════════════════════════════════════════
function createMeowEngine() {
  let ctx = null;
  const getCtx = () => {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  };

  function playMeow(type = "soft") {
    try {
      const ac = getCtx();
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      const filter = ac.createBiquadFilter();
      osc.connect(filter); filter.connect(gain); gain.connect(ac.destination);
      filter.type = "bandpass"; filter.frequency.value = 1200; filter.Q.value = 5;

      const now = ac.currentTime;
      const profiles = {
        soft:    { start:520, peak:700, end:480, dur:0.28, vol:0.18 },
        happy:   { start:600, peak:900, end:650, dur:0.22, vol:0.20 },
        buy:     { start:700, peak:1050,end:750, dur:0.32, vol:0.22 },
        save:    { start:550, peak:850, end:900, dur:0.38, vol:0.20 },
        delete:  { start:650, peak:500, end:350, dur:0.25, vol:0.15 },
        levelup: { start:500, peak:1100,end:1200,dur:0.55, vol:0.25 },
        add:     { start:580, peak:820, end:700, dur:0.30, vol:0.20 },
        wear:    { start:750, peak:980, end:820, dur:0.28, vol:0.18 },
      };
      const p = profiles[type] || profiles.soft;
      osc.type = "sine";
      osc.frequency.setValueAtTime(p.start, now);
      osc.frequency.linearRampToValueAtTime(p.peak, now + p.dur * 0.4);
      osc.frequency.linearRampToValueAtTime(p.end,  now + p.dur);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(p.vol, now + 0.04);
      gain.gain.linearRampToValueAtTime(p.vol * 0.6, now + p.dur * 0.6);
      gain.gain.linearRampToValueAtTime(0, now + p.dur);
      osc.start(now); osc.stop(now + p.dur + 0.05);

      // Second harmonic for richness
      const osc2 = ac.createOscillator();
      const gain2 = ac.createGain();
      osc2.connect(gain2); gain2.connect(ac.destination);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(p.start * 1.5, now);
      osc2.frequency.linearRampToValueAtTime(p.peak * 1.5, now + p.dur * 0.4);
      osc2.frequency.linearRampToValueAtTime(p.end * 1.5, now + p.dur);
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.linearRampToValueAtTime(p.vol * 0.35, now + 0.04);
      gain2.gain.linearRampToValueAtTime(0, now + p.dur);
      osc2.start(now); osc2.stop(now + p.dur + 0.05);
    } catch(e) {}
  }
  return playMeow;
}
const meow = createMeowEngine();

// ═══════════════════════════════════════════════════════════
// 🌟 THEME — Milk Yellow
// ═══════════════════════════════════════════════════════════
const C = {
  bg:       "#FFFBF0",       // warm cream
  bgCard:   "#FFFDF5",       // near-white cream
  bgSoft:   "#FFF8E1",       // light milk yellow
  primary:  "#F5B731",       // warm golden yellow
  primary2: "#F0A500",       // deeper gold
  accent:   "#FF8C69",       // warm salmon
  accent2:  "#E8637A",       // coral rose
  paw:      "#D4956A",       // warm brown for paw outlines
  pawLight: "#F5CBA7",       // light paw fill
  text:     "#3D2B1A",       // warm dark brown
  textMid:  "#8B6A4F",       // medium brown
  textLight:"#C4A882",       // light warm brown
  border:   "#F0E0C0",       // warm border
  borderSoft:"#FAF0D8",      // very soft border
  yellow1:  "#FFF3C4",       // pale lemon
  yellow2:  "#FFE082",       // sunshine yellow
  yellow3:  "#F5B731",       // golden
  green:    "#6BC98A",       // soft sage green for income
  red:      "#E8637A",       // coral red for expense
  purple:   "#B39DDB",       // soft lavender
  blue:     "#7EC8E3",       // baby blue
  mint:     "#80CBC4",       // mint
};

// ═══════════════════════════════════════════════════════════
// i18n
// ═══════════════════════════════════════════════════════════
const T = {
  en: {
    title:"Kitty Ledger 🐱", income:"Income", expense:"Expense", balance:"Balance",
    ledger:"Ledger", analysis:"Stats", budget:"Budget", savings:"Savings", wardrobe:"Cat",
    addEntry:"New Entry", addExpense:"Add Expense", addIncome:"Add Income",
    note:"Note", date:"Date", amount:"Amount", category:"Category",
    noTxns:"No transactions yet~\nTap the paw to start! 🐾",
    setBudget:"Set Budget", set:"Set 🐾", removeBudget:"Remove",
    budgetLeft:"left", budgetOver:"Over!", noBudgets:"No budgets yet 🐾",
    applePayBtn:"🍎 Pay", applePayTitle:"Apple Pay Simulator",
    applePayDesc:"Tap a merchant to auto-track 🐾",
    autoTracked:"Apple Pay Tracked", totalAuto:"Total",
    trends:"Spending Trends", categories:"By Category",
    savingsGoals:"Savings Goals", newGoal:"+ New Goal",
    goalName:"Goal Name", goalTarget:"Target",
    addGoal:"Add Goal 🐱", checkIn:"Check In", addAmount:"Amount to Save",
    saved:"Saved", remaining:"Left", noGoals:"No goals yet 🐾",
    bankLabel:"Bank / Account", targetDateLabel:"Target Date",
    daysLeft:"days left", daysOver:"days over!", confirmSave:"Confirm Save",
    calendarView:"Calendar", mostSpent:"Most", leastSpent:"Least",
    days:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],
    months:["January","February","March","April","May","June","July","August","September","October","November","December"],
    bankPresets:["💳 Credit Card","🏦 Savings Account","💵 Cash","📱 Alipay/WeChat","🏠 Emergency Fund","✈️ Travel Fund"],
    exportData:"Export", importData:"Import", clearAll:"Clear All",
    settings:"Settings", switchLang:"切换中文",
    localSave:"💾 Saved in browser storage",
    icloudNote:"📱 iPhone: Share → Add to Home Screen",
    deleteHint:"Double-tap to delete",
    dateRange:"Date Range", from:"From", to:"To", apply:"Apply ✓",
    rangeToday:"Today", rangeWeek:"Week", rangeMonth:"Month",
    rangeYear:"Year", rangeAll:"All Time", rangeCustom:"Custom",
    rangeSummary:"Summary", txnCount:"Txns", avgDaily:"Daily Avg",
    points:"Paw Points", pointsEarned:"Earned", pointsSpent:"Spent",
    pointsLeft:"Available", buyBtn:"Buy", ownedTag:"Owned",
    wornTag:"On!", wearBtn:"Wear it", removeBtn:"Take off",
    pointsHint:"Save → earn 🐾 points → dress your cat!",
    catName:"Cat Name", uploadPhoto:"Upload My Cat",
    shopTitle:"Cat Shop", wardrobeCloths:"My Closet",
    catLevel:"Level", savingLevel:["Tiny Kitten","Baby Cat","Playful Cat","Cool Cat","Fancy Cat","Royal Cat","Diamond Cat"],
    recurringTitle:"Recurring Bills", addRecurring:"+ New Bill",
    recurringName:"Bill Name", recurringFreq:"Frequency", recurringDay:"Day of Month",
    freqMonthly:"Monthly", freqWeekly:"Weekly", freqYearly:"Yearly",
    recurringDue:"Due today", recurringOverdue:"Overdue", recurringUpcoming:"Upcoming",
    confirmPay:"Confirm & Log", skipBill:"Skip this time",
    nextDue:"Next due", noRecurring:"No recurring bills yet 🐾",
    monthlyIncomeLabel:"Monthly Income", setIncome:"Set",
    overviewTitle:"Monthly Overview", fixedCosts:"Fixed Bills",
    budgetTotal:"Budget Cap", disposable:"Disposable", savingsPot:"Savings Pot",
    notSet:"Not set",
  },
  zh: {
    title:"猫咪记账本 🐱", income:"收入", expense:"支出", balance:"结余",
    ledger:"明细", analysis:"统计", budget:"预算", savings:"存钱", wardrobe:"猫咪",
    addEntry:"新建记录", addExpense:"记支出", addIncome:"记收入",
    note:"备注", date:"日期", amount:"金额", category:"分类",
    noTxns:"还没有记录~\n点击爪爪开始记账！🐾",
    setBudget:"设置预算", set:"确认 🐾", removeBudget:"删除",
    budgetLeft:"剩余", budgetOver:"超支!", noBudgets:"还没有预算 🐾",
    applePayBtn:"🍎 Pay", applePayTitle:"Apple Pay 模拟",
    applePayDesc:"点击商家自动记账 🐾",
    autoTracked:"Apple Pay 已记录", totalAuto:"合计",
    trends:"支出趋势", categories:"分类统计",
    savingsGoals:"存钱计划", newGoal:"+ 新建",
    goalName:"计划名称", goalTarget:"目标金额",
    addGoal:"添加计划 🐱", checkIn:"打卡存钱", addAmount:"存入金额",
    saved:"已存", remaining:"剩余", noGoals:"还没有存钱计划 🐾",
    bankLabel:"银行 / 账户", targetDateLabel:"目标日期",
    daysLeft:"天后到期", daysOver:"天已超期！", confirmSave:"确认已存",
    calendarView:"日历", mostSpent:"最多", leastSpent:"最少",
    days:["日","一","二","三","四","五","六"],
    months:["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
    bankPresets:["💳 信用卡","🏦 储蓄账户","💵 现金","📱 支付宝/微信","🏠 应急备用金","✈️ 旅游基金"],
    exportData:"导出", importData:"导入", clearAll:"清空",
    settings:"设置", switchLang:"Switch to English",
    localSave:"💾 数据已保存到本地",
    icloudNote:"📱 添加到主屏幕以保存到iPhone",
    deleteHint:"双击删除",
    dateRange:"日期范围", from:"开始", to:"结束", apply:"应用 ✓",
    rangeToday:"今天", rangeWeek:"本周", rangeMonth:"本月",
    rangeYear:"今年", rangeAll:"全部", rangeCustom:"自定义",
    rangeSummary:"汇总", txnCount:"笔数", avgDaily:"日均",
    points:"爪爪积分", pointsEarned:"累计", pointsSpent:"已用", pointsLeft:"可用",
    buyBtn:"购买", ownedTag:"已拥有", wornTag:"穿着！", wearBtn:"穿上", removeBtn:"脱下",
    pointsHint:"存钱 → 获得🐾积分 → 给猫咪换装！",
    catName:"猫咪名字", uploadPhoto:"上传猫咪",
    shopTitle:"猫咪商店", wardrobeCloths:"我的衣橱",
    catLevel:"等级", savingLevel:["小奶猫","小猫咪","活泼猫","酷猫咪","时髦猫","皇室猫","钻石猫"],
    recurringTitle:"固定账单", addRecurring:"+ 新建账单",
    recurringName:"账单名称", recurringFreq:"频率", recurringDay:"每月几号",
    freqMonthly:"每月", freqWeekly:"每周", freqYearly:"每年",
    recurringDue:"今天到期", recurringOverdue:"已逾期", recurringUpcoming:"即将到期",
    confirmPay:"确认记账", skipBill:"跳过本次",
    nextDue:"下次到期", noRecurring:"还没有固定账单 🐾",
    monthlyIncomeLabel:"月收入", setIncome:"设置",
    overviewTitle:"月度总览", fixedCosts:"固定支出",
    budgetTotal:"预算上限", disposable:"可支配", savingsPot:"储蓄总额",
    notSet:"未设置",
  }
};

// ═══════════════════════════════════════════════════════════
// Categories
// ═══════════════════════════════════════════════════════════
const CATS_EN = [
  {name:"Food & Drink", zh:"餐饮",   icon:"🍜", color:"#FF8C69"},
  {name:"Transport",    zh:"交通",   icon:"🚗", color:"#FFB347"},
  {name:"Shopping",     zh:"购物",   icon:"🛒", color:"#B39DDB"},
  {name:"Entertainment",zh:"娱乐",   icon:"🎀", color:"#F48FB1"},
  {name:"Health",       zh:"健康",   icon:"🌿", color:"#80CBC4"},
  {name:"Bills",        zh:"账单",   icon:"📋", color:"#7EC8E3"},
  {name:"Office",       zh:"办公",   icon:"✏️", color:"#FFE082"},
  {name:"Travel",       zh:"旅行",   icon:"✈️", color:"#FFCC80"},
  {name:"Groceries",    zh:"蔬果",   icon:"🥕", color:"#A5D6A7"},
  {name:"Coffee",       zh:"咖啡",   icon:"☕", color:"#BCAAA4"},
  {name:"Beauty",       zh:"美容",   icon:"💄", color:"#F48FB1"},
  {name:"Pets",         zh:"宠物",   icon:"🐱", color:"#F5CBA7"},
  {name:"Other",        zh:"其他",   icon:"🌟", color:"#E0E0E0"},
  {name:"Income",       zh:"收入",   icon:"💛", color:"#6BC98A"},
];

const APPLE_MERCHANTS = [
  {name:"Starbucks",    cat:"Coffee",        range:[5,12]},
  {name:"Uber",         cat:"Transport",     range:[8,35]},
  {name:"Amazon",       cat:"Shopping",      range:[15,120]},
  {name:"Whole Foods",  cat:"Groceries",     range:[30,90]},
  {name:"Netflix",      cat:"Entertainment", range:[15,20]},
  {name:"McDonald's",   cat:"Food & Drink",  range:[8,18]},
  {name:"Apple Store",  cat:"Shopping",      range:[25,200]},
  {name:"CVS Pharmacy", cat:"Health",        range:[10,50]},
  {name:"Spotify",      cat:"Entertainment", range:[9,16]},
  {name:"DoorDash",     cat:"Food & Drink",  range:[15,45]},
  {name:"Target",       cat:"Shopping",      range:[20,150]},
  {name:"Sephora",      cat:"Beauty",        range:[20,80]},
];

// ═══════════════════════════════════════════════════════════
// 🛍️ SHOP ITEMS — expanded, prettier
// ═══════════════════════════════════════════════════════════
const SHOP_ITEMS = [
  // 🍽️ Food
  { id:"salmon",   cat:"food",  name:"Grilled Salmon",  zh:"烤三文鱼",   cost:50,  emoji:"🐟", rarity:"common",  desc:"Omega-3 rich!" },
  { id:"milk",     cat:"food",  name:"Cream Milk",      zh:"奶油牛奶",   cost:30,  emoji:"🥛", rarity:"common",  desc:"Purrfect~" },
  { id:"tuna",     cat:"food",  name:"Tuna Sashimi",    zh:"金枪鱼刺身", cost:80,  emoji:"🍣", rarity:"rare",    desc:"Luxurious!" },
  { id:"shrimp",   cat:"food",  name:"Tiger Shrimp",    zh:"大虎虾",     cost:60,  emoji:"🦐", rarity:"common",  desc:"Fresh!" },
  { id:"chicken",  cat:"food",  name:"Roast Chicken",   zh:"烤鸡腿",     cost:45,  emoji:"🍗", rarity:"common",  desc:"Crispy!" },
  { id:"icecream", cat:"food",  name:"Ice Cream",       zh:"冰淇淋",     cost:35,  emoji:"🍦", rarity:"common",  desc:"Cold & sweet!" },
  { id:"cake",     cat:"food",  name:"Birthday Cake",   zh:"生日蛋糕",   cost:120, emoji:"🎂", rarity:"rare",    desc:"Special treat!" },
  { id:"macaron",  cat:"food",  name:"Macarons",        zh:"马卡龙",     cost:90,  emoji:"🍬", rarity:"rare",    desc:"Très chic!" },
  // 👑 Hats & Head
  { id:"crown",    cat:"head",  name:"Gold Crown",      zh:"金色皇冠",   cost:400, emoji:"👑", rarity:"epic",    desc:"Royalty!" },
  { id:"tophat",   cat:"head",  name:"Silk Top Hat",    zh:"丝绸礼帽",   cost:220, emoji:"🎩", rarity:"rare",    desc:"Très élégant!" },
  { id:"beret",    cat:"head",  name:"Pink Beret",      zh:"粉色贝雷帽", cost:130, emoji:"🎨", rarity:"common",  desc:"Artistic~" },
  { id:"bow",      cat:"head",  name:"Ribbon Bow",      zh:"蝴蝶结发饰", cost:80,  emoji:"🎀", rarity:"common",  desc:"So kawaii!" },
  { id:"flowerhat",cat:"head",  name:"Flower Crown",    zh:"花朵花环",   cost:160, emoji:"💐", rarity:"rare",    desc:"Spring vibes!" },
  { id:"witchhat", cat:"head",  name:"Witch Hat",       zh:"女巫帽",     cost:190, emoji:"🧙", rarity:"rare",    desc:"Magical!" },
  { id:"halo",     cat:"head",  name:"Angel Halo",      zh:"天使光环",   cost:350, emoji:"😇", rarity:"epic",    desc:"Divine!" },
  { id:"horns",    cat:"head",  name:"Devil Horns",     zh:"恶魔犄角",   cost:280, emoji:"😈", rarity:"rare",    desc:"Naughty~" },
  // 👗 Clothes / Body
  { id:"scarf",    cat:"body",  name:"Cozy Knit Scarf", zh:"针织围巾",   cost:150, emoji:"🧣", rarity:"common",  desc:"Warm & fluffy!" },
  { id:"cape",     cat:"body",  name:"Hero Cape",       zh:"英雄披风",   cost:280, emoji:"🦸", rarity:"rare",    desc:"Super kitty!" },
  { id:"tuxedo",   cat:"body",  name:"Mini Tuxedo",     zh:"迷你燕尾服", cost:320, emoji:"🤵", rarity:"epic",    desc:"Sophisticated!" },
  { id:"kimono",   cat:"body",  name:"Silk Kimono",     zh:"丝绸和服",   cost:380, emoji:"👘", rarity:"epic",    desc:"Beautiful!" },
  { id:"apron",    cat:"body",  name:"Chef Apron",      zh:"厨师围裙",   cost:120, emoji:"👨‍🍳", rarity:"common",  desc:"Master chef!" },
  { id:"sweater",  cat:"body",  name:"Heart Sweater",   zh:"爱心毛衣",   cost:170, emoji:"🧶", rarity:"common",  desc:"Cozy cozy!" },
  // 👓 Face
  { id:"shades",   cat:"face",  name:"Cool Sunglasses", zh:"酷炫墨镜",   cost:110, emoji:"🕶️", rarity:"common",  desc:"Incognito!" },
  { id:"monocle",  cat:"face",  name:"Fancy Monocle",   zh:"单片眼镜",   cost:200, emoji:"🧐", rarity:"rare",    desc:"How refined~" },
  { id:"mask",     cat:"face",  name:"Masquerade Mask", zh:"假面舞会面具",cost:250, emoji:"🎭", rarity:"rare",    desc:"Mysterious!" },
  { id:"nerd",     cat:"face",  name:"Nerd Glasses",    zh:"书呆子眼镜", cost:90,  emoji:"🤓", rarity:"common",  desc:"Smart kitty!" },
  // ✨ Magic / Special
  { id:"wand",     cat:"magic", name:"Star Wand",       zh:"星星魔法棒", cost:300, emoji:"⭐", rarity:"epic",    desc:"Alakazam!" },
  { id:"rainbow",  cat:"magic", name:"Rainbow Arc",     zh:"彩虹",       cost:600, emoji:"🌈", rarity:"legendary",desc:"Legendary!" },
  { id:"sparkles", cat:"magic", name:"Sparkle Aura",    zh:"闪闪光环",   cost:450, emoji:"✨", rarity:"epic",    desc:"Shimmery~" },
  { id:"moon",     cat:"magic", name:"Crescent Moon",   zh:"月亮",       cost:380, emoji:"🌙", rarity:"epic",    desc:"Moonlit~" },
  // 🌸 Accessories
  { id:"balloon",  cat:"acc",   name:"Heart Balloon",   zh:"爱心气球",   cost:70,  emoji:"🎈", rarity:"common",  desc:"Float away!" },
  { id:"flower",   cat:"acc",   name:"Cherry Blossom",  zh:"樱花朵朵",   cost:80,  emoji:"🌸", rarity:"common",  desc:"So pretty!" },
  { id:"sunflower",cat:"acc",   name:"Sunflower",       zh:"向日葵",     cost:90,  emoji:"🌻", rarity:"common",  desc:"Sunny!" },
  { id:"ribbon",   cat:"acc",   name:"Velvet Ribbon",   zh:"丝绒丝带",   cost:60,  emoji:"🎗️", rarity:"common",  desc:"Elegant~" },
  { id:"butterfly",cat:"acc",   name:"Butterfly",       zh:"蝴蝶",       cost:140, emoji:"🦋", rarity:"rare",    desc:"Flutter~" },
  { id:"diamond",  cat:"acc",   name:"Diamond Collar",  zh:"钻石项圈",   cost:800, emoji:"💎", rarity:"legendary",desc:"Priceless!" },
];

const RARITY_COLORS = {
  common:    { bg:"#FFF8E1", border:"#FFE082", badge:"#F5B731", text:"Common"   },
  rare:      { bg:"#E3F2FD", border:"#7EC8E3", badge:"#1E88E5", text:"Rare"     },
  epic:      { bg:"#F3E5F5", border:"#B39DDB", badge:"#8E24AA", text:"Epic"     },
  legendary: { bg:"#FFF8E1", border:"#FFD700", badge:"#FF6F00", text:"Legend"   },
};

const SHOP_TABS = [
  { key:"food",  icon:"🍽️", label:"Food",   zh:"食物"  },
  { key:"head",  icon:"👑", label:"Hats",   zh:"帽子"  },
  { key:"body",  icon:"👗", label:"Clothes",zh:"衣物"  },
  { key:"face",  icon:"🕶️", label:"Face",   zh:"脸部"  },
  { key:"magic", icon:"✨", label:"Magic",  zh:"魔法"  },
  { key:"acc",   icon:"🌸", label:"Accs",   zh:"配饰"  },
];

const GOAL_COLORS = ["#F5B731","#FF8C69","#B39DDB","#80CBC4","#7EC8E3","#F48FB1"];

// ═══════════════════════════════════════════════════════════
// Helpers
// ═══════════════════════════════════════════════════════════
const fmt2      = n => (+n).toFixed(2);
const fmtMoney  = n => "$" + fmt2(Math.abs(n));
const todayStr  = () => new Date().toISOString().slice(0,10);
const rand      = (a,b) => +(a + Math.random()*(b-a)).toFixed(2);

function groupByDate(txns) {
  const m = {};
  txns.forEach(t => { (m[t.date]||(m[t.date]=[])).push(t); });
  return Object.entries(m).sort((a,b)=>b[0].localeCompare(a[0]));
}
function getPresetRange(p) {
  const now=new Date(), pad=n=>String(n).padStart(2,"0"), fmt=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`, td=fmt(now);
  if(p==="today") return {from:td,to:td};
  if(p==="week")  { const d=new Date(now); d.setDate(now.getDate()-now.getDay()); return {from:fmt(d),to:td}; }
  if(p==="month") return {from:`${now.getFullYear()}-${pad(now.getMonth()+1)}-01`,to:td};
  if(p==="year")  return {from:`${now.getFullYear()}-01-01`,to:td};
  return {from:"2000-01-01",to:td};
}
function daysBetween(a,b){ return Math.max(1,Math.round((new Date(b)-new Date(a))/86400000)+1); }
function calcPoints(goals){ return goals.reduce((s,g)=>s+Math.floor(g.saved*10),0); }

const KEY="kitty_ledger_v2";
function loadData(){ try{ const r=localStorage.getItem(KEY); if(r){ const d=JSON.parse(r); if(!d.recurring) d.recurring=[]; if(!d.monthlyIncome) d.monthlyIncome=0; return d; } }catch{} return {txns:[],budget:{},goals:[],recurring:[],monthlyIncome:0,lang:"en",cat:{name:"Kitty",photo:null,wearing:[],owned:[],pointsSpent:0}}; }
function saveData(d){ try{ localStorage.setItem(KEY,JSON.stringify(d)); }catch{} }
function exportJSON(d){ const b=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`kitty-${todayStr()}.json`; a.click(); URL.revokeObjectURL(u); }

// ═══════════════════════════════════════════════════════════
// 🐾 PawIcon — every icon wrapped in a paw-print circle
// ═══════════════════════════════════════════════════════════
function PawIcon({ icon, size=44, bg=C.yellow1, pawColor=C.paw, active=false, onClick, style={} }) {
  const s = size;
  const pad = s * 0.02;
  return (
    <div onClick={onClick} style={{
      position:"relative", width:s, height:s, flexShrink:0, cursor:onClick?"pointer":"default",
      filter: active ? "drop-shadow(0 3px 8px rgba(245,183,49,0.55))" : "none",
      transition:"transform 0.12s, filter 0.12s",
      ...style,
    }}
    onMouseDown={e=>{ if(onClick) e.currentTarget.style.transform="scale(0.91)"; }}
    onMouseUp={e=>{ if(onClick) e.currentTarget.style.transform="scale(1)"; }}
    onTouchStart={e=>{ if(onClick) e.currentTarget.style.transform="scale(0.91)"; }}
    onTouchEnd={e=>{ if(onClick) e.currentTarget.style.transform="scale(1)"; }}>
      {/* Paw SVG background */}
      <svg viewBox="0 0 100 100" width={s} height={s} style={{position:"absolute",top:0,left:0}}>
        {/* Toe beans */}
        <circle cx="28" cy="22" r="10" fill={active?C.primary:bg} stroke={pawColor} strokeWidth="3"/>
        <circle cx="50" cy="15" r="10" fill={active?C.primary:bg} stroke={pawColor} strokeWidth="3"/>
        <circle cx="72" cy="22" r="10" fill={active?C.primary:bg} stroke={pawColor} strokeWidth="3"/>
        <circle cx="16" cy="42" r="9"  fill={active?C.primary:bg} stroke={pawColor} strokeWidth="3"/>
        <circle cx="84" cy="42" r="9"  fill={active?C.primary:bg} stroke={pawColor} strokeWidth="3"/>
        {/* Main pad */}
        <ellipse cx="50" cy="67" rx="32" ry="28" fill={active?C.primary:bg} stroke={pawColor} strokeWidth="3"/>
      </svg>
      {/* Icon */}
      <div style={{
        position:"absolute", inset:0, display:"flex", alignItems:"center",
        justifyContent:"center", paddingTop:s*0.12,
        fontSize:s*0.36, lineHeight:1, userSelect:"none",
      }}>{icon}</div>
    </div>
  );
}

// Small paw print decoration
function PawDot({ size=16, color=C.pawLight, opacity=0.5, style={} }) {
  return (
    <svg viewBox="0 0 50 50" width={size} height={size} style={{opacity, ...style}}>
      <circle cx="25" cy="30" r="10" fill={color}/>
      <circle cx="10" cy="20" r="6"  fill={color}/>
      <circle cx="40" cy="20" r="6"  fill={color}/>
      <circle cx="16" cy="10" r="5"  fill={color}/>
      <circle cx="34" cy="10" r="5"  fill={color}/>
    </svg>
  );
}

// Fish bone decoration
function FishDeco({ size=30, color=C.border, style={} }) {
  return (
    <svg viewBox="0 0 80 36" width={size} height={size*0.45} style={style}>
      <path d="M8 18L72 18" stroke={color} strokeWidth="3" strokeLinecap="round"/>
      <path d="M8 18L2 10M8 18L2 26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M72 18L78 10M72 18L78 26" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
      {[22,40,57].map(x=><path key={x} d={`M${x} 18L${x-5} 11M${x} 18L${x-5} 25`} stroke={color} strokeWidth="2" strokeLinecap="round"/>)}
    </svg>
  );
}

// Background decorations
function BgDecos() {
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0,overflow:"hidden"}}>
      {[
        {x:"3%",  y:"8%",  size:36, rot:15,  type:"paw"},
        {x:"88%", y:"5%",  size:28, rot:-20, type:"fish"},
        {x:"93%", y:"22%", size:24, rot:-8,  type:"paw"},
        {x:"2%",  y:"35%", size:20, rot:30,  type:"fish"},
        {x:"87%", y:"48%", size:32, rot:20,  type:"paw"},
        {x:"5%",  y:"60%", size:22, rot:-15, type:"paw"},
        {x:"90%", y:"72%", size:26, rot:10,  type:"fish"},
        {x:"4%",  y:"82%", size:18, rot:25,  type:"fish"},
        {x:"85%", y:"90%", size:30, rot:-5,  type:"paw"},
      ].map((d,i)=>(
        <div key={i} style={{position:"absolute",left:d.x,top:d.y,transform:`rotate(${d.rot}deg)`}}>
          {d.type==="paw" ? <PawDot size={d.size} color={C.primary} opacity={0.12}/> : <FishDeco size={d.size} color={C.border} style={{opacity:0.3}}/>}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 🐱 Cat SVG
// ═══════════════════════════════════════════════════════════
function CatSVG({ wearing=[], level=0, size=180, photo=null }) {
  const bodyColors=["#F5CBA7","#FFD6A5","#FBBF24","#FDE68A","#F9A8D4","#C4B5FD","#FFD700"];
  const bc=bodyColors[Math.min(level,bodyColors.length-1)];
  const acc={};
  wearing.forEach(id=>{ acc[id]=true; });

  // Layout constants (viewBox 200x240)
  // Head center: cx=100, cy=78, r=46
  // Neck: y=120–134
  // Body: ellipse cx=100 cy=168 rx=42 ry=50
  // Legs: bottom ~220
  // Ears: top of head

  return (
    <div style={{position:"relative",width:size,height:size*240/200,flexShrink:0}}>
      <svg viewBox="0 0 200 240" width={size} height={size*240/200} style={{overflow:"visible"}}>
        <style>{`
          @keyframes blink2{0%,88%,100%{transform:scaleY(1)}94%{transform:scaleY(0.06)}}
          @keyframes bob2{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
          @keyframes tailWag2{0%,100%{transform:rotate(-10deg)}50%{transform:rotate(12deg)}}
          .cb2{animation:bob2 3.2s ease-in-out infinite}
          .ct2{animation:tailWag2 2.2s ease-in-out infinite;transform-origin:58px 190px}
        `}</style>

        {/* Shadow */}
        <ellipse cx="100" cy="234" rx="42" ry="6" fill="rgba(180,120,60,0.12)"/>

        {/* Tail */}
        <g className="ct2">
          <path d="M60 195 Q22 196 18 168 Q14 142 42 140 Q54 138 56 153 Q36 155 38 172 Q40 184 60 182 Z"
            fill={bc} stroke={C.paw} strokeWidth="2.2" strokeLinejoin="round"/>
        </g>

        <g className="cb2">
          {/* Body */}
          <ellipse cx="100" cy="172" rx="42" ry="50" fill={bc} stroke={C.paw} strokeWidth="2.2"/>
          {/* Belly patch */}
          <ellipse cx="100" cy="178" rx="26" ry="32" fill="white" opacity="0.45"/>

          {/* ── BODY ACCESSORIES (y≈162-190) ── */}
          {acc["scarf"]    && <text x="100" y="136" fontSize="26" textAnchor="middle">🧣</text>}
          {acc["cape"]     && <text x="100" y="168" fontSize="30" textAnchor="middle">🦸</text>}
          {acc["tuxedo"]   && <text x="100" y="168" fontSize="26" textAnchor="middle">🤵</text>}
          {acc["kimono"]   && <text x="100" y="168" fontSize="28" textAnchor="middle">👘</text>}
          {acc["sweater"]  && <text x="100" y="168" fontSize="26" textAnchor="middle">🧶</text>}
          {acc["ribbon"]   && <text x="100" y="168" fontSize="22" textAnchor="middle">🎗️</text>}
          {acc["diamond"]  && <text x="100" y="170" fontSize="24" textAnchor="middle">💎</text>}

          {/* Hind legs */}
          <ellipse cx="74" cy="218" rx="20" ry="13" fill={bc} stroke={C.paw} strokeWidth="2"/>
          <ellipse cx="126" cy="218" rx="20" ry="13" fill={bc} stroke={C.paw} strokeWidth="2"/>
          {[66,74,82].map(x=><circle key={x} cx={x} cy="223" r="3.5" fill="#FFB3C6"/>)}
          {[118,126,134].map(x=><circle key={x} cx={x} cy="223" r="3.5" fill="#FFB3C6"/>)}

          {/* Neck */}
          <rect x="86" y="118" width="28" height="18" rx="8" fill={bc} stroke={C.paw} strokeWidth="2"/>

          {/* ── EARS (above head, y≈28-54) ── */}
          <path d="M62 52 L50 22 L84 44 Z" fill={bc} stroke={C.paw} strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M66 50 L57 28 L80 44 Z" fill="#FFB3C6" opacity="0.85"/>
          <path d="M138 52 L150 22 L116 44 Z" fill={bc} stroke={C.paw} strokeWidth="2.2" strokeLinejoin="round"/>
          <path d="M134 50 L143 28 L120 44 Z" fill="#FFB3C6" opacity="0.85"/>

          {/* ── HEAD REGION (cx=100 cy=78 r=46) ── */}
          {/* Head base circle — only shown when NO photo */}
          {!photo && <circle cx="100" cy="78" r="46" fill={bc} stroke={C.paw} strokeWidth="2.2"/>}
          {!photo && <ellipse cx="72" cy="90" rx="10" ry="6" fill="#FFB3C6" opacity="0.5"/>}
          {!photo && <ellipse cx="128" cy="90" rx="10" ry="6" fill="#FFB3C6" opacity="0.5"/>}
          {!photo && <>
            {/* Eyes */}
            <g style={{animation:"blink2 4.5s ease-in-out infinite",transformOrigin:"80px 78px"}}>
              <circle cx="80" cy="78" r="10" fill="white"/>
              <circle cx="80" cy="78" r="7" fill="#2D1B00"/>
              <circle cx="77" cy="75" r="2.5" fill="white" opacity="0.95"/>
            </g>
            <g style={{animation:"blink2 4.5s ease-in-out infinite 0.15s",transformOrigin:"120px 78px"}}>
              <circle cx="120" cy="78" r="10" fill="white"/>
              <circle cx="120" cy="78" r="7" fill="#2D1B00"/>
              <circle cx="117" cy="75" r="2.5" fill="white" opacity="0.95"/>
            </g>
            {/* Nose + mouth */}
            <path d="M96 94 L100 98 L104 94 Q100 89 96 94 Z" fill={C.accent}/>
            <path d="M100 98 Q93 105 89 102" fill="none" stroke={C.paw} strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M100 98 Q107 105 111 102" fill="none" stroke={C.paw} strokeWidth="1.8" strokeLinecap="round"/>
            {/* Whiskers */}
            {[[-1,90],[0,96],[1,102]].map(([d,y],i)=><g key={i}>
              <line x1="58" y1={y+d*2} x2="88" y2={y} stroke={C.paw} strokeWidth="1.2" opacity="0.6"/>
              <line x1="112" y1={y} x2="142" y2={y+d*2} stroke={C.paw} strokeWidth="1.2" opacity="0.6"/>
            </g>)}
            {/* Stripes for higher levels */}
            {level>1&&<>
              <path d="M86 44 Q89 37 92 44" fill="none" stroke={C.paw} strokeWidth="1.6" opacity="0.4"/>
              <path d="M100 40 Q100 33 100 40" fill="none" stroke={C.paw} strokeWidth="1.6" opacity="0.4"/>
              <path d="M108 44 Q111 37 114 44" fill="none" stroke={C.paw} strokeWidth="1.6" opacity="0.4"/>
            </>}
          </>}

          {/* Photo head — clipped circle */}
          {photo && <>
            <defs>
              <clipPath id="headClip">
                <circle cx="100" cy="78" r="46"/>
              </clipPath>
            </defs>
            <circle cx="100" cy="78" r="46" fill="white" stroke={C.paw} strokeWidth="2.5"/>
            <image href={photo} x="54" y="32" width="92" height="92" clipPath="url(#headClip)" preserveAspectRatio="xMidYMid slice"/>
          </>}

          {/* ── HEAD ACCESSORIES (above/on head) ── */}
          {acc["bow"]       && <text x="100" y="28"  fontSize="24" textAnchor="middle">🎀</text>}
          {acc["crown"]     && <text x="100" y="22"  fontSize="28" textAnchor="middle">👑</text>}
          {acc["tophat"]    && <text x="100" y="20"  fontSize="26" textAnchor="middle">🎩</text>}
          {acc["beret"]     && <text x="100" y="22"  fontSize="24" textAnchor="middle">🎨</text>}
          {acc["flowerhat"] && <text x="100" y="22"  fontSize="26" textAnchor="middle">💐</text>}
          {acc["witchhat"]  && <text x="100" y="18"  fontSize="28" textAnchor="middle">🧙</text>}
          {acc["halo"]      && <text x="100" y="16"  fontSize="26" textAnchor="middle">😇</text>}
          {acc["horns"]     && <text x="100" y="20"  fontSize="24" textAnchor="middle">😈</text>}

          {/* ── FACE ACCESSORIES (on face, y≈78-100) ── */}
          {acc["shades"]    && <text x="100" y="88"  fontSize="26" textAnchor="middle">🕶️</text>}
          {acc["monocle"]   && <text x="118" y="84"  fontSize="18" textAnchor="middle">🧐</text>}
          {acc["mask"]      && <text x="100" y="88"  fontSize="24" textAnchor="middle">🎭</text>}
          {acc["nerd"]      && <text x="100" y="88"  fontSize="22" textAnchor="middle">🤓</text>}

          {/* ── MAGIC / SIDE ACCESSORIES ── */}
          {acc["wand"]      && <text x="158" y="78"  fontSize="22" textAnchor="middle">⭐</text>}
          {acc["rainbow"]   && <text x="100" y="8"   fontSize="30" textAnchor="middle">🌈</text>}
          {acc["sparkles"]  && <text x="160" y="48"  fontSize="20" textAnchor="middle">✨</text>}
          {acc["moon"]      && <text x="162" y="76"  fontSize="20" textAnchor="middle">🌙</text>}
          {acc["balloon"]   && <text x="160" y="46"  fontSize="22" textAnchor="middle">🎈</text>}
          {acc["flower"]    && <text x="48"  y="50"  fontSize="20" textAnchor="middle">🌸</text>}
          {acc["sunflower"] && <text x="46"  y="48"  fontSize="20" textAnchor="middle">🌻</text>}
          {acc["butterfly"] && <text x="160" y="62"  fontSize="20" textAnchor="middle">🦋</text>}
        </g>
      </svg>
    </div>
  );
}

// Mini cat for tabs
function MiniCat({ size=26 }) {
  return (
    <svg viewBox="0 0 60 55" width={size} height={size}>
      <circle cx="30" cy="27" r="18" fill={C.pawLight} stroke={C.paw} strokeWidth="2"/>
      <path d="M16 17 L9 4 L24 15 Z" fill={C.pawLight} stroke={C.paw} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M44 17 L51 4 L36 15 Z" fill={C.pawLight} stroke={C.paw} strokeWidth="1.5" strokeLinejoin="round"/>
      <circle cx="24" cy="27" r="4" fill="#2D1B00"/>
      <circle cx="36" cy="27" r="4" fill="#2D1B00"/>
      <circle cx="23" cy="25.5" r="1.5" fill="white"/>
      <circle cx="35" cy="25.5" r="1.5" fill="white"/>
      <ellipse cx="21" cy="32" rx="5" ry="3" fill="#FFB3C6" opacity="0.6"/>
      <ellipse cx="39" cy="32" rx="5" ry="3" fill="#FFB3C6" opacity="0.6"/>
      <path d="M27 33 L30 36 L33 33 Q30 30 27 33 Z" fill={C.accent}/>
      <path d="M18 27 L23 28" stroke={C.paw} strokeWidth="1.2" opacity="0.6"/>
      <path d="M42 27 L37 28" stroke={C.paw} strokeWidth="1.2" opacity="0.6"/>
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════
// ── Add Transaction Modal — proper component (no hook-in-nested-function issues) ──
function AddTransactionModal({ form, setForm, calPad, setCalPad, calPickerMon, setCalPickerMon,
  showDatePicker, setShowDatePicker, txns, t, data, onClose, onSubmit }) {

  const pad2 = n => String(n).padStart(2,"0");
  const pickerParts = calPickerMon.split("-");
  const pickerYr = parseInt(pickerParts[0]), pickerMo = parseInt(pickerParts[1])-1;
  const pickerFirst = new Date(pickerYr, pickerMo, 1).getDay();
  const pickerDim   = new Date(pickerYr, pickerMo+1, 0).getDate();
  const pickerCells = [];
  for(let i=0;i<pickerFirst;i++) pickerCells.push(null);
  for(let d=1;d<=pickerDim;d++) pickerCells.push(d);
  const canPickerNext = new Date(pickerYr, pickerMo+1, 1) <= new Date();
  const formDateObj = new Date(form.date+"T00:00:00");
  const formDayName = t.days[formDateObj.getDay()];
  const yesterdayStr = new Date(Date.now()-86400000).toISOString().slice(0,10);

  return (
    <Modal onClose={onClose}>
      <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:11}}>🐾 {t.addEntry}</div>

      {/* Expense / Income toggle */}
      <div style={{display:"flex",background:C.bgSoft,borderRadius:14,padding:3,marginBottom:11}}>
        {[["expense",`🛒 ${t.expense}`],["income",`💛 ${t.income}`]].map(([tp,lb])=>(
          <button key={tp} onClick={()=>{ setForm(f=>({...f,type:tp})); meow("soft"); }} style={{
            flex:1,padding:"9px",borderRadius:11,border:"none",cursor:"pointer",
            background:form.type===tp?(tp==="expense"?`linear-gradient(135deg,${C.accent},${C.red})`:`linear-gradient(135deg,${C.green},#4CAF50)`):"transparent",
            color:form.type===tp?"#fff":C.textMid,fontWeight:700,fontSize:12}}>{lb}</button>
        ))}
      </div>

      {/* Amount display */}
      <div style={{background:C.bgSoft,borderRadius:14,padding:"9px 14px",marginBottom:8,
        border:`1.5px solid ${C.border}`,textAlign:"center"}}>
        <div style={{fontSize:8,color:C.textMid,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:1}}>{t.amount}</div>
        <div style={{fontSize:30,fontWeight:700,color:calPad?C.primary2:C.textLight}}>${calPad||form.amount||"0.00"}</div>
      </div>

      {/* Numpad */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:9}}>
        {[["7","8","9","⌫"],["4","5","6",""],["1","2","3",""],[".",  "0","","✓"]].map((row,ri)=>
          row.map((k,ki)=>{
            if(k==="") return <div key={ri+"-"+ki}/>;
            const isConfirm=k==="✓", isDel=k==="⌫";
            return (
              <button key={k} onClick={()=>{
                meow("soft");
                if(isDel) setCalPad(p=>p.slice(0,-1));
                else if(isConfirm) setForm(f=>({...f,amount:calPad}));
                else { if(k==="."&&calPad.includes(".")) return; setCalPad(p=>p+k); }
              }} style={{padding:"13px 3px",borderRadius:11,border:"none",cursor:"pointer",
                background:isConfirm?`linear-gradient(135deg,${C.primary},${C.accent})`:isDel?C.bgSoft:"#FFFDF5",
                color:isConfirm?C.text:isDel?C.textMid:C.text,
                fontSize:isDel?18:14,fontWeight:isConfirm?700:500,
                border:`1px solid ${C.borderSoft}`,
                boxShadow:`0 1px 3px rgba(212,149,106,0.12)`}}>
                {k}
              </button>
            );
          })
        )}
      </div>

      {/* Date picker */}
      <div style={{marginBottom:9}}>
        <FLabel>📅 {t.date}</FLabel>
        <button onClick={()=>{ setShowDatePicker(v=>!v); meow("soft"); }} style={{
          width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
          padding:"10px 14px",borderRadius:13,cursor:"pointer",
          background:showDatePicker?`linear-gradient(135deg,${C.primary},${C.yellow2})`:C.bgSoft,
          border:`1.5px solid ${showDatePicker?C.primary2:C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>📅</span>
            <div style={{textAlign:"left"}}>
              <div style={{fontSize:11,color:showDatePicker?"rgba(61,43,26,0.65)":C.textLight}}>
                {form.date===todayStr()?"Today 今天":form.date===yesterdayStr?"Yesterday 昨天":""}
              </div>
              <div style={{fontSize:15,fontWeight:700,color:showDatePicker?C.text:C.primary2}}>
                {form.date.slice(5).replace("-","/")} {formDayName}
              </div>
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {form.date!==todayStr()&&(
              <span onClick={e=>{e.stopPropagation();setForm(f=>({...f,date:todayStr()}));meow("soft");}}
                style={{fontSize:10,background:"rgba(61,43,26,0.12)",borderRadius:8,
                  padding:"3px 7px",color:C.textMid,fontWeight:600}}>今天</span>
            )}
            <span style={{fontSize:14,color:showDatePicker?C.text:C.textMid}}>{showDatePicker?"▲":"▼"}</span>
          </div>
        </button>

        {showDatePicker&&(
          <div style={{marginTop:6,background:"#FFFDF5",borderRadius:14,
            border:`1.5px solid ${C.border}`,padding:"12px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <button onClick={()=>{
                const d=new Date(pickerYr,pickerMo-1,1);
                setCalPickerMon(`${d.getFullYear()}-${pad2(d.getMonth()+1)}`);
              }} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:C.textMid,padding:"2px 8px"}}>‹</button>
              <span style={{fontSize:12,fontWeight:700,color:C.textMid}}>{t.months[pickerMo]} {pickerYr}</span>
              <button onClick={()=>{
                const d=new Date(pickerYr,pickerMo+1,1);
                setCalPickerMon(`${d.getFullYear()}-${pad2(d.getMonth()+1)}`);
              }} disabled={!canPickerNext}
                style={{background:"none",border:"none",cursor:canPickerNext?"pointer":"default",
                  fontSize:18,color:canPickerNext?C.textMid:C.textLight,padding:"2px 8px"}}>›</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:1,marginBottom:3}}>
              {t.days.map(d=><div key={d} style={{textAlign:"center",fontSize:8,color:C.textLight,padding:"1px 0"}}>{d}</div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
              {pickerCells.map((d,i)=>{
                if(!d) return <div key={i}/>;
                const key=`${pickerYr}-${pad2(pickerMo+1)}-${pad2(d)}`;
                const isSelected=key===form.date, isToday=key===todayStr(), isFuture=key>todayStr();
                const hasTxn=txns.some(tx=>tx.date===key);
                return (
                  <div key={i} onClick={()=>{ if(isFuture) return; setForm(f=>({...f,date:key})); meow("soft"); setShowDatePicker(false); }}
                    style={{aspectRatio:"1",borderRadius:7,cursor:isFuture?"default":"pointer",
                      background:isSelected?C.primary:isToday?C.yellow1:"#FFFDF5",
                      border:isSelected?`2px solid ${C.primary2}`:isToday?`2px solid ${C.yellow2}`:`1.5px solid ${C.border}`,
                      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
                      opacity:isFuture?0.3:1,position:"relative"}}>
                    <div style={{fontSize:11,fontWeight:isSelected||isToday?700:400,
                      color:isSelected?"#fff":isToday?C.primary2:C.text}}>{d}</div>
                    {hasTxn&&!isSelected&&(
                      <div style={{width:4,height:4,borderRadius:"50%",background:C.accent,position:"absolute",bottom:2}}/>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{marginTop:8,fontSize:9,color:C.textLight,textAlign:"center"}}>
              🐾 Orange dots = days with existing transactions
            </div>
          </div>
        )}
      </div>

      {/* Category */}
      {form.type==="expense"&&(
        <>
          <FLabel>{t.category}</FLabel>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:5,marginBottom:9}}>
            {CATS_EN.filter(c=>c.name!=="Income").map(c=>(
              <button key={c.name} onClick={()=>{ setForm(f=>({...f,cat:c.name})); meow("soft"); }} style={{
                display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                padding:"7px 3px",borderRadius:12,border:"none",cursor:"pointer",background:"transparent",outline:"none"}}>
                <PawIcon icon={c.icon} size={34} bg={form.cat===c.name?c.color+"44":c.color+"22"} pawColor={c.color+(form.cat===c.name?"CC":"66")} active={form.cat===c.name}/>
                <span style={{fontSize:8,color:form.cat===c.name?c.color:C.textLight,fontWeight:form.cat===c.name?700:400}}>
                  {data.lang==="zh"?c.zh:c.name}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Note */}
      <div style={{marginBottom:11}}>
        <FLabel>{t.note}</FLabel>
        <input value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))}
          placeholder="🐾 备注..." style={{...inpS,width:"100%"}}/>
      </div>

      <YBtn wide onClick={onSubmit}>
        {form.type==="expense"?`🐾 ${t.addExpense}`:`💛 ${t.addIncome}`}
      </YBtn>
    </Modal>
  );
}

export default function App() {
  const [data,setData] = useState(loadData);
  const [tab,setTab]   = useState("ledger");
  const [showAdd,   setShowAdd]   = useState(false);
  const [showAP,    setShowAP]    = useState(false);
  const [showSet,   setShowSet]   = useState(false);
  const [showRange, setShowRange] = useState(false);
  const [apToast,   setApToast]   = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calPickerMon, setCalPickerMon] = useState(()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; });
  const [form, setForm] = useState({type:"expense",amount:"",cat:"Food & Drink",note:"",date:todayStr()});
  const [budCat,setBudCat] = useState("Food & Drink");
  const [budAmt,setBudAmt] = useState("");
  const [showGoalForm,setShowGoalForm] = useState(false);
  const [goalForm,setGoalForm] = useState({name:"",target:"",bank:"",startDate:todayStr(),targetDate:"",color:0});
  const [checkinGoal,setCheckinGoal] = useState(null);
  const [checkinAmt,setCheckinAmt]   = useState("");
  const [calPad,setCalPad] = useState("");
  const [shopTab,setShopTab] = useState("food");
  const [showCatEdit,setShowCatEdit] = useState(false);
  const [catNameEdit,setCatNameEdit] = useState("");
  const [preset,    setPreset]    = useState("month");
  const [dateFrom,  setDateFrom]  = useState(()=>getPresetRange("month").from);
  const [dateTo,    setDateTo]    = useState(()=>getPresetRange("month").to);
  const [customFrom,setCustomFrom]= useState(()=>getPresetRange("month").from);
  const [customTo,  setCustomTo]  = useState(()=>getPresetRange("month").to);
  const [toast,setToast] = useState(null);
  const [calViewMon, setCalViewMon] = useState(()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; });
  const [showRecurForm, setShowRecurForm] = useState(false);
  const [recurForm, setRecurForm] = useState({name:"",amount:"",cat:"Bills",freq:"monthly",day:1,color:0});
  const [budgetSubTab, setBudgetSubTab] = useState("budget"); // "budget" | "recurring"

  const fileRef=useRef(), catPhotoRef=useRef();
  const t=T[data.lang||"en"];

  useEffect(()=>{ saveData(data); },[data]);
  const upd=fn=>setData(d=>({...fn(d)}));

  const showToast = useCallback((msg,icon="🐾") => {
    setToast({msg,icon}); setTimeout(()=>setToast(null),2200);
  },[]);

  // Points / level
  const totalPtsEarned = useMemo(()=>calcPoints(data.goals),[data.goals]);
  const ptsSpent  = data.cat.pointsSpent||0;
  const ptsAvail  = totalPtsEarned - ptsSpent;
  const totalSaved= data.goals.reduce((s,g)=>s+g.saved,0);
  const catLevel  = Math.min(6,Math.floor(totalSaved/200));

  // Financial overview calculations
  const monthlyIncome = data.monthlyIncome||0;
  const monthlyFixed  = (data.recurring||[]).filter(b=>b.freq==="monthly").reduce((s,b)=>s+b.amount,0);
  const monthlyBudget = Object.values(budget).reduce((s,v)=>s+v,0);
  const disposable    = monthlyIncome - monthlyFixed - monthlyBudget; // what's "free" each month
  const [showOverview, setShowOverview] = useState(false);
  const [incomeInput, setIncomeInput] = useState("");

  // Filtered
  const {txns,budget,goals}=data;
  const filtered = useMemo(()=>txns.filter(t=>t.date>=dateFrom&&t.date<=dateTo),[txns,dateFrom,dateTo]);
  const income  = filtered.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = filtered.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance = income-expense;
  const days    = daysBetween(dateFrom,dateTo);
  const avgDaily= expense/days;
  const catTotals=useMemo(()=>{ const m={}; filtered.filter(t=>t.type==="expense").forEach(t=>{m[t.cat]=(m[t.cat]||0)+t.amount;}); return m; },[filtered]);
  const dailyTotals=useMemo(()=>{ const m={}; filtered.filter(t=>t.type==="expense").forEach(t=>{m[t.date]=(m[t.date]||0)+t.amount;}); return m; },[filtered]);
  const groups=groupByDate(filtered);

  const presetLabel={today:t.rangeToday,week:t.rangeWeek,month:t.rangeMonth,year:t.rangeYear,all:t.rangeAll,custom:t.rangeCustom}[preset]||t.rangeCustom;
  const rangeLabel=dateFrom===dateTo?dateFrom:`${dateFrom.slice(5).replace("-","/")} – ${dateTo.slice(5).replace("-","/")}`;

  function applyPreset(p) {
    setPreset(p);
    if(p!=="custom"){ const r=getPresetRange(p); setDateFrom(r.from); setDateTo(r.to); setCustomFrom(r.from); setCustomTo(r.to); }
  }
  function applyCustom() {
    if(customFrom>customTo) return;
    setDateFrom(customFrom); setDateTo(customTo); setPreset("custom"); setShowRange(false);
  }
  function shiftPeriod(dir) {
    const pad=n=>String(n).padStart(2,"0"), fmt=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    if(preset==="month"){
      const d=new Date(dateFrom+"T00:00:00"); d.setMonth(d.getMonth()+dir);
      const first=new Date(d.getFullYear(),d.getMonth(),1);
      const last =new Date(d.getFullYear(),d.getMonth()+1,0);
      const isCur=first.getFullYear()===new Date().getFullYear()&&first.getMonth()===new Date().getMonth();
      setDateFrom(fmt(first)); setDateTo(isCur?todayStr():fmt(last));
      setCustomFrom(fmt(first)); setCustomTo(isCur?todayStr():fmt(last));
    } else if(preset==="week"){
      const d=new Date(dateFrom+"T00:00:00"); d.setDate(d.getDate()+dir*7);
      const end=new Date(d); end.setDate(d.getDate()+6);
      const today=new Date();
      setDateFrom(fmt(d)); setDateTo(end>today?fmt(today):fmt(end));
    } else if(preset==="year"){
      const d=new Date(dateFrom+"T00:00:00"); d.setFullYear(d.getFullYear()+dir);
      const first=new Date(d.getFullYear(),0,1), last=new Date(d.getFullYear(),11,31), today=new Date();
      setDateFrom(fmt(first)); setDateTo(last>today?fmt(today):fmt(last));
    }
    meow("soft");
  }
  const canShift=preset==="month"||preset==="week"||preset==="year";

  function addTxn() {
    const amt=parseFloat(form.amount||calPad); if(!amt||isNaN(amt)) return;
    upd(d=>({...d,txns:[{id:Date.now()+Math.random(),type:form.type,amount:amt,
      cat:form.type==="income"?"Income":form.cat,note:form.note,date:form.date,apay:false},...d.txns]}));
    meow("add"); setShowAdd(false); setShowDatePicker(false);
    setForm({type:"expense",amount:"",cat:"Food & Drink",note:"",date:todayStr()}); setCalPad("");
    showToast(form.type==="expense"?"Expense added! 💸":"Income added! 💛","🐾");
  }

  // ── Recurring bills helpers ─────────────────────────────
  function getNextDueDate(bill) {
    const pad=n=>String(n).padStart(2,"0");
    const today=new Date(); today.setHours(0,0,0,0);
    const lastPaid=bill.lastPaid?new Date(bill.lastPaid+"T00:00:00"):null;
    if(bill.freq==="monthly"){
      // Find next occurrence of bill.day in current or future months
      let d=new Date(today.getFullYear(),today.getMonth(),bill.day);
      // If already paid this month, push to next month
      if(lastPaid){
        const lp=new Date(lastPaid.getFullYear(),lastPaid.getMonth(),1);
        const cur=new Date(today.getFullYear(),today.getMonth(),1);
        if(lp>=cur) d.setMonth(d.getMonth()+1);
      }
      if(d<today && !(lastPaid && lastPaid.getMonth()===today.getMonth() && lastPaid.getFullYear()===today.getFullYear())){
        // overdue — due date was this month and not paid
      }
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    if(bill.freq==="weekly"){
      // Next occurrence of bill.day (0=Sun) from today
      const dayOfWeek=bill.day; // 0-6
      let d=new Date(today);
      const diff=(dayOfWeek-d.getDay()+7)%7||7;
      if(lastPaid){
        // If paid this week already, go next week
        const weekStart=new Date(today); weekStart.setDate(today.getDate()-today.getDay());
        if(lastPaid>=weekStart) d.setDate(d.getDate()+(diff===7?7:diff+7));
        else d.setDate(d.getDate()+(diff===7?0:diff));
      } else {
        d.setDate(d.getDate()+(diff===7?0:diff));
      }
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    if(bill.freq==="yearly"){
      // bill.day = MM-DD string like "03-15"
      const [mo,dy]=bill.day.split("-").map(Number);
      let d=new Date(today.getFullYear(),mo-1,dy);
      if(lastPaid){
        const lpYear=lastPaid.getFullYear();
        if(lpYear===today.getFullYear()) d.setFullYear(d.getFullYear()+1);
      } else if(d<today){
        d.setFullYear(d.getFullYear()+1);
      }
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    }
    return todayStr();
  }

  function getBillStatus(bill) {
    const due=getNextDueDate(bill);
    const today=todayStr();
    if(due<today) return "overdue";
    if(due===today) return "due";
    // within 7 days = upcoming
    const diff=Math.round((new Date(due)-new Date(today))/86400000);
    if(diff<=7) return "upcoming";
    return "future";
  }

  function addRecurring() {
    if(!recurForm.name||!recurForm.amount) return;
    const bill={
      id:Date.now(),name:recurForm.name,amount:+recurForm.amount,
      cat:recurForm.cat,freq:recurForm.freq,day:recurForm.day,
      color:GOAL_COLORS[recurForm.color],lastPaid:null,
      created:todayStr(),
    };
    upd(d=>({...d,recurring:[...(d.recurring||[]),bill]}));
    meow("save"); setShowRecurForm(false);
    setRecurForm({name:"",amount:"",cat:"Bills",freq:"monthly",day:1,color:0});
    showToast("Recurring bill added! 📅","🐾");
  }

  function confirmPayBill(bill) {
    const due=getNextDueDate(bill);
    upd(d=>({
      ...d,
      txns:[{id:Date.now()+Math.random(),type:"expense",amount:bill.amount,
        cat:bill.cat,note:bill.name,date:due,apay:false,recurring:true},...d.txns],
      recurring:(d.recurring||[]).map(b=>b.id===bill.id?{...b,lastPaid:due}:b),
    }));
    meow("add"); showToast(`${bill.name} logged! 💸`,"📅");
  }

  function skipBillOnce(bill) {
    const due=getNextDueDate(bill);
    upd(d=>({...d,recurring:(d.recurring||[]).map(b=>b.id===bill.id?{...b,lastPaid:due}:b)}));
    meow("soft"); showToast("Skipped this time~","🐾");
  }

  function simApPay(m) {
    const amt=rand(...m.range);
    upd(d=>({...d,txns:[{id:Date.now()+Math.random(),type:"expense",amount:amt,cat:m.cat,note:m.name,date:todayStr(),apay:true},...d.txns]}));
    meow("happy"); setApToast({merchant:m.name,amount:amt}); setShowAP(false);
    setTimeout(()=>setApToast(null),3500);
  }

  function saveBudget() {
    if(!budAmt||isNaN(+budAmt)) return;
    upd(d=>({...d,budget:{...d.budget,[budCat]:+budAmt}})); setBudAmt("");
    meow("save"); showToast("Budget set! 💝","🐾");
  }

  function addGoal() {
    if(!goalForm.name||!goalForm.target) return;
    upd(d=>({...d,goals:[...d.goals,{id:Date.now(),name:goalForm.name,target:+goalForm.target,
      bank:goalForm.bank||"",startDate:goalForm.startDate||todayStr(),targetDate:goalForm.targetDate||"",
      color:GOAL_COLORS[goalForm.color],saved:0,history:[],created:todayStr()}]}));
    meow("save"); setShowGoalForm(false); setGoalForm({name:"",target:"",bank:"",startDate:todayStr(),targetDate:"",color:0});
    showToast("Savings goal created! 🐷","🐾");
  }

  function checkin(gid) {
    const amt=parseFloat(checkinAmt); if(!amt||isNaN(amt)) return;
    const prev=data.goals.find(g=>g.id===gid);
    const prevLevel=Math.min(6,Math.floor((prev?.saved||0)/200));
    upd(d=>({...d,goals:d.goals.map(g=>g.id===gid?{...g,saved:g.saved+amt,history:[...g.history,{date:todayStr(),amt}]}:g)}));
    const newLevel=Math.min(6,Math.floor(((prev?.saved||0)+amt)/200));
    if(newLevel>prevLevel){ meow("levelup"); showToast(`${t.savingLevel[newLevel]} unlocked! 🎉`,"✨"); }
    else { meow("save"); showToast(`+$${fmt2(amt)} saved! 🐷`,"💛"); }
    setCheckinGoal(null); setCheckinAmt("");
  }

  function buyItem(item) {
    if(ptsAvail<item.cost) return;
    upd(d=>({...d,cat:{...d.cat,pointsSpent:(d.cat.pointsSpent||0)+item.cost,
      owned:[...new Set([...(d.cat.owned||[]),item.id])]}}));
    meow("buy"); showToast(`Got ${item.emoji} ${data.lang==="zh"?item.zh:item.name}!`,"🐾");
  }

  function toggleWear(id) {
    const item=SHOP_ITEMS.find(x=>x.id===id); if(!item||item.cat==="food") return;
    upd(d=>{
      const w=d.cat.wearing||[], on=w.includes(id);
      return {...d,cat:{...d.cat,wearing:on?w.filter(x=>x!==id):[...w,id]}};
    });
    const on=(data.cat.wearing||[]).includes(id);
    meow(on?"soft":"wear");
    showToast(on?"Taken off~":"Looking fabulous! ✨","🐱");
  }

  function uploadCatPhoto(e) {
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{ upd(d=>({...d,cat:{...d.cat,photo:ev.target.result}})); meow("happy"); showToast("Photo uploaded! 📷","🐱"); };
    r.readAsDataURL(file);
  }

  function toggleLang() { upd(d=>({...d,lang:d.lang==="en"?"zh":"en"})); meow("soft"); }

  function importData(e) {
    const file=e.target.files[0]; if(!file) return;
    const r=new FileReader();
    r.onload=ev=>{ try{ upd(()=>JSON.parse(ev.target.result)); meow("happy"); showToast("Data imported!","💛"); }catch{} };
    r.readAsText(file);
  }

  // ── Inline chart components ──────────────────────────────
  function TrendChart() {
    if(!filtered.length) return <div style={{textAlign:"center",color:C.textLight,padding:16,fontSize:12}}>No data yet 🐾</div>;
    const entries=Object.entries(dailyTotals).sort((a,b)=>a[0].localeCompare(b[0]));
    const vals=entries.map(([,v])=>v), maxV=Math.max(...vals,1);
    const W=300,H=65,p=10,step=entries.length>1?(W-2*p)/(entries.length-1):W-2*p;
    const path=entries.map(([,v],i)=>`${i===0?"M":"L"}${p+i*step},${H-p-(v/maxV)*(H-2*p)}`).join(" ");
    return (
      <svg viewBox={`0 0 ${W+p} ${H+p}`} style={{width:"100%",height:72}}>
        <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.primary} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={C.primary} stopOpacity="0"/>
        </linearGradient></defs>
        {entries.length>1&&<path d={path+` V${H} H${p} Z`} fill="url(#tg)"/>}
        {entries.length>1&&<path d={path} fill="none" stroke={C.primary2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>}
        {entries.map(([date,v],i)=><circle key={date} cx={p+i*step} cy={H-p-(v/maxV)*(H-2*p)} r="4" fill={C.primary2}/>)}
      </svg>
    );
  }

  function DonutChart() {
    const entries=Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).slice(0,6);
    const total=entries.reduce((s,[,v])=>s+v,0)||1;
    let offset=0; const r=52,cx=65,cy=65,sw=22,circ=2*Math.PI*r;
    return (
      <div style={{display:"flex",alignItems:"center",gap:12,flexWrap:"wrap"}}>
        <svg viewBox="0 0 130 130" style={{width:110,height:110,flexShrink:0}}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.borderSoft} strokeWidth={sw}/>
          {entries.map(([cat,v])=>{
            const c=CATS_EN.find(x=>x.name===cat)||CATS_EN[CATS_EN.length-2];
            const pct=v/total, dash=pct*circ;
            const seg=<circle key={cat} cx={cx} cy={cy} r={r} fill="none" stroke={c.color}
              strokeWidth={sw} strokeDasharray={`${dash} ${circ}`} strokeDashoffset={-offset}
              transform={`rotate(-90 ${cx} ${cy})`}/>;
            offset+=dash; return seg;
          })}
          <text x={cx} y={cx-4} textAnchor="middle" style={{fontSize:9,fill:C.textLight}}>Total</text>
          <text x={cx} y={cx+10} textAnchor="middle" style={{fontSize:12,fontWeight:"bold",fill:C.text}}>${Math.round(total)}</text>
        </svg>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:5}}>
          {entries.map(([cat,v])=>{
            const c=CATS_EN.find(x=>x.name===cat)||CATS_EN[CATS_EN.length-2];
            return (
              <div key={cat} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:c.color,flexShrink:0}}/>
                <span style={{fontSize:11,color:C.text,flex:1}}>{data.lang==="zh"?c.zh:c.name}</span>
                <span style={{fontSize:11,fontWeight:700,color:C.primary2}}>{fmtMoney(v)}</span>
                <span style={{fontSize:9,color:C.textLight}}>{Math.round(v/total*100)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderCalendar() {
    const [cvyr, cvmo] = calViewMon.split("-").map(Number);
    const mo = cvmo - 1;
    const first=new Date(cvyr,mo,1).getDay(), dim=new Date(cvyr,mo+1,0).getDate();
    const maxV=Math.max(...Object.values(dailyTotals),1);
    const td=todayStr(), pad=n=>String(n).padStart(2,"0");
    const cells=[]; for(let i=0;i<first;i++) cells.push(null); for(let d=1;d<=dim;d++) cells.push(d);

    function shiftCalMon(dir) {
      const d=new Date(cvyr,mo+dir,1);
      setCalViewMon(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);
    }
    const canGoNext = new Date(cvyr,mo+1,1) <= new Date();

    return (
      <div>
        {/* Month nav */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <button onClick={()=>shiftCalMon(-1)} style={{background:"none",border:"none",cursor:"pointer",
            fontSize:18,color:C.textMid,padding:"2px 8px"}}>‹</button>
          <div style={{fontSize:12,fontWeight:700,color:C.textMid}}>{t.months[mo]} {cvyr}</div>
          <button onClick={()=>shiftCalMon(1)} disabled={!canGoNext}
            style={{background:"none",border:"none",cursor:canGoNext?"pointer":"default",
              fontSize:18,color:canGoNext?C.textMid:C.textLight,padding:"2px 8px"}}>›</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:3}}>
          {t.days.map(d=><div key={d} style={{textAlign:"center",fontSize:9,color:C.textLight,padding:"2px 0"}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3}}>
          {cells.map((d,i)=>{
            if(!d) return <div key={i}/>;
            const key=`${cvyr}-${pad(cvmo)}-${pad(d)}`;
            const v=dailyTotals[key]||0, isToday=key===td;
            const isSelected=key===selectedDay;
            const intensity=v>0?Math.max(0.2,v/maxV):0;
            return (
              <div key={i} onClick={()=>{ setSelectedDay(isSelected?null:key); meow("soft"); }}
                style={{aspectRatio:"1",borderRadius:7,cursor:"pointer",
                  background:isSelected?C.primary:v>0?`rgba(245,183,49,${intensity})`:isToday?C.yellow1:C.bgSoft,
                  border:isSelected?`2px solid ${C.primary2}`:isToday?`2px solid ${C.primary}`:`1.5px solid ${C.border}`,
                  display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:1,
                  transition:"all 0.15s",
                  boxShadow:isSelected?`0 2px 8px rgba(245,183,49,0.45)`:"none"}}>
                <div style={{fontSize:9,fontWeight:isSelected||isToday?700:400,
                  color:isSelected?"#fff":isToday?C.primary2:v>0?C.text:C.textLight}}>{d}</div>
                {v>0&&<div style={{fontSize:7,color:isSelected?"rgba(255,255,255,0.9)":C.primary2,fontWeight:600}}>${Math.round(v)}</div>}
              </div>
            );
          })}
        </div>

        {selectedDay && (() => {
          const dayTxns = txns.filter(tx=>tx.date===selectedDay);
          const dayExp  = dayTxns.filter(tx=>tx.type==="expense").reduce((s,tx)=>s+tx.amount,0);
          const dayInc  = dayTxns.filter(tx=>tx.type==="income").reduce((s,tx)=>s+tx.amount,0);
          const dispDate= selectedDay.slice(5).replace("-","/");
          const dObj    = new Date(selectedDay+"T00:00:00");
          const dayName = t.days[dObj.getDay()];
          const dayDetailEl = (
            <div style={{marginTop:10,background:C.bgCard,borderRadius:16,
              border:`2px solid ${C.primary}`,overflow:"hidden"}}>
              <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,
                padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:C.text}}>{dispDate} {dayName}</div>
                  <div style={{fontSize:10,color:"rgba(61,43,26,0.65)",marginTop:1}}>
                    {dayInc>0&&<span style={{marginRight:8}}>+{fmtMoney(dayInc)}</span>}
                    {dayExp>0&&<span>-{fmtMoney(dayExp)}</span>}
                    {dayTxns.length===0&&<span>No transactions</span>}
                  </div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <button onClick={()=>{
                    setForm(f=>({...f,date:selectedDay,amount:"",note:"",type:"expense",cat:"Food & Drink"}));
                    setCalPickerMon(selectedDay.slice(0,7));
                    setCalPad(""); setShowAdd(true); meow("soft");
                  }} style={{background:"rgba(255,255,255,0.4)",border:"1.5px solid rgba(61,43,26,0.2)",
                    borderRadius:10,padding:"5px 10px",fontSize:11,fontWeight:700,color:C.text,cursor:"pointer"}}>
                    + Add
                  </button>
                  <button onClick={()=>setSelectedDay(null)}
                    style={{background:"none",border:"none",fontSize:16,color:"rgba(61,43,26,0.5)",cursor:"pointer"}}>✕</button>
                </div>
              </div>
              {dayTxns.length===0?(
                <div style={{textAlign:"center",padding:"18px 0",color:C.textLight,fontSize:12}}>
                  <div>No transactions on this day~</div>
                  <div style={{fontSize:10,marginTop:4}}>Tap "+ Add" to record one</div>
                </div>
              ):(
                <div>
                  {dayTxns.map((tx,i)=>{
                    const c=CATS_EN.find(x=>x.name===tx.cat)||CATS_EN[CATS_EN.length-2];
                    return (
                      <div key={tx.id} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 14px",
                        borderTop:i===0?"none":`1px solid ${C.borderSoft}`}}>
                        <PawIcon icon={c.icon} size={34} bg={c.color+"33"} pawColor={c.color+"88"}/>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontSize:12,fontWeight:600,color:C.text}}>{data.lang==="zh"?c.zh:c.name}</div>
                          <div style={{fontSize:10,color:C.textLight}}>{tx.note||"—"}</div>
                        </div>
                        <div style={{fontSize:14,fontWeight:700,color:tx.type==="income"?C.green:C.text,whiteSpace:"nowrap"}}>
                          {tx.type==="income"?"+":"-"}{fmtMoney(tx.amount)}
                        </div>
                        <button onClick={()=>{ upd(d=>({...d,txns:d.txns.filter(t=>t.id!==tx.id)})); meow("delete"); showToast("Deleted~","🐾"); }}
                          style={{background:"none",border:"none",fontSize:14,color:C.textLight,cursor:"pointer",padding:"0 2px",flexShrink:0}}>🗑️</button>
                      </div>
                    );
                  })}
                  <div style={{padding:"8px 14px",borderTop:`1.5px solid ${C.border}`,
                    display:"flex",justifyContent:"space-between",fontSize:11,background:C.bgSoft}}>
                    <span style={{color:C.textLight}}>{dayTxns.length} transactions</span>
                    <span style={{fontWeight:700,color:C.text}}>Net: {fmtMoney(dayInc-dayExp)}</span>
                  </div>
                </div>
              )}
            </div>
          );
          return dayDetailEl;
        })()}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════
  return (
    <div style={{maxWidth:480,margin:"0 auto",minHeight:"100vh",
      background:`linear-gradient(170deg,${C.bg} 0%,${C.bgSoft} 50%,${C.bg} 100%)`,
      fontFamily:"-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif",
      display:"flex",flexDirection:"column",position:"relative",overflow:"hidden",
      color:C.text}}>

      <BgDecos/>
      <style>{`
        * { box-sizing:border-box; }
        ::-webkit-scrollbar { width:0; }
        input[type=date]::-webkit-calendar-picker-indicator { opacity:0.4; }
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:`linear-gradient(150deg,${C.primary} 0%,${C.yellow2} 70%,#FFE082 100%)`,
        padding:"44px 16px 14px",borderRadius:"0 0 32px 32px",
        boxShadow:"0 6px 30px rgba(245,183,49,0.4)",flexShrink:0,position:"relative",zIndex:10}}>

        {/* Cat ear tabs */}
        <div style={{position:"absolute",top:0,left:"50%",transform:"translateX(-50%)",display:"flex",gap:72,pointerEvents:"none"}}>
          <div style={{width:28,height:26,background:C.primary2,clipPath:"polygon(50% 0%,0% 100%,100% 100%)",opacity:0.7}}/>
          <div style={{width:28,height:26,background:C.primary2,clipPath:"polygon(50% 0%,0% 100%,100% 100%)",opacity:0.7}}/>
        </div>

        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <MiniCat size={30}/>
            <div>
              <div style={{fontSize:12,color:"rgba(61,43,26,0.75)",fontWeight:700,letterSpacing:"0.04em"}}>{t.title}</div>
              <div style={{fontSize:10,color:"rgba(61,43,26,0.55)"}}>{data.cat.name||"Kitty"} · {t.savingLevel[catLevel]}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>
            <YPill onClick={()=>{ setShowAP(true); meow("soft"); }} label={t.applePayBtn}/>
            <YPill onClick={()=>{ toggleLang(); }} label={data.lang==="en"?"中":"EN"}/>
            <YPill onClick={()=>{ setShowSet(true); meow("soft"); }} label="⚙️"/>
          </div>
        </div>

        {/* Date range bar with arrows */}
        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:11}}>
          {canShift&&<ArrowBtn onClick={()=>shiftPeriod(-1)}>‹</ArrowBtn>}
          <button onClick={()=>{ setShowRange(true); meow("soft"); }} style={{
            flex:1,background:"rgba(255,255,255,0.35)",border:"1.5px solid rgba(255,255,255,0.65)",
            borderRadius:16,padding:"8px 14px",cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <PawDot size={14} color={C.paw} opacity={0.7}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontSize:9,color:"rgba(61,43,26,0.65)",letterSpacing:"0.06em",textTransform:"uppercase"}}>{presetLabel}</div>
                <div style={{fontSize:13,color:C.text,fontWeight:700}}>{rangeLabel}</div>
              </div>
            </div>
            <span style={{fontSize:11,color:"rgba(61,43,26,0.5)"}}>切换</span>
          </button>
          {canShift&&<ArrowBtn onClick={()=>shiftPeriod(1)} disabled={dateTo>=todayStr()}>›</ArrowBtn>}
        </div>

        {/* Stats */}
        <div style={{display:"flex",gap:0,background:"rgba(255,255,255,0.25)",borderRadius:18,padding:"10px 14px"}}>
          <YStat label={t.income}  value={fmtMoney(income)}  color={C.green}/>
          <div style={{width:1,background:"rgba(61,43,26,0.2)",margin:"0 10px"}}/>
          <YStat label={t.expense} value={fmtMoney(expense)} color={C.red}/>
          <div style={{width:1,background:"rgba(61,43,26,0.2)",margin:"0 10px"}}/>
          <YStat label={t.balance} value={fmtMoney(balance)} color={balance>=0?C.text:C.red}/>
          <div style={{width:1,background:"rgba(61,43,26,0.2)",margin:"0 10px"}}/>
          <YStat label="🐾 Pts" value={String(ptsAvail)} color={C.paw}/>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{display:"flex",background:"#FFFDF5",borderBottom:`1.5px solid ${C.border}`,
        flexShrink:0,position:"relative",zIndex:10}}>
        {[["ledger","📋",t.ledger],["analysis","📊",t.analysis],["budget","💛",t.budget],
          ["savings","🐷",t.savings],["wardrobe",null,t.wardrobe]].map(([k,ic,lb])=>(
          <button key={k} onClick={()=>{ setTab(k); meow("soft"); }} style={{
            flex:1,minWidth:55,padding:"10px 3px 8px",background:"none",border:"none",
            color:tab===k?C.primary2:C.textLight,fontSize:9,fontWeight:tab===k?700:400,
            cursor:"pointer",borderBottom:tab===k?`2.5px solid ${C.primary2}`:"2.5px solid transparent",
            display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"color 0.15s"}}>
            <span style={{fontSize:tab===k?16:14,transition:"font-size 0.15s"}}>
              {k==="wardrobe"?<MiniCat size={tab===k?18:16}/>:ic}
            </span>
            <span style={{letterSpacing:"0.02em"}}>{lb}</span>
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div style={{flex:1,overflowY:"auto",paddingBottom:95,position:"relative",zIndex:1}}>

        {/* ═══ LEDGER ═══ */}
        {tab==="ledger"&&(
          <div>
            {/* ── Due Bills Banner ── */}
            {(()=>{
              const dueBills=(data.recurring||[]).filter(b=>{ const s=getBillStatus(b); return s==="overdue"||s==="due"; });
              if(!dueBills.length) return null;
              return (
                <div style={{background:`linear-gradient(135deg,${C.accent},${C.red})`,
                  padding:"10px 14px",borderBottom:`1px solid rgba(255,255,255,0.2)`}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#fff",marginBottom:6,
                    display:"flex",alignItems:"center",gap:5}}>
                    <span>⚠️</span>
                    <span>{dueBills.length} bill{dueBills.length>1?"s":""} need attention!</span>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:5}}>
                    {dueBills.map(bill=>{
                      const status=getBillStatus(bill);
                      return (
                        <div key={bill.id} style={{background:"rgba(255,255,255,0.2)",
                          borderRadius:12,padding:"8px 11px",display:"flex",alignItems:"center",gap:8}}>
                          <PawIcon icon={CATS_EN.find(c=>c.name===bill.cat)?.icon||"📋"} size={32}
                            bg="rgba(255,255,255,0.3)" pawColor="rgba(255,255,255,0.7)"/>
                          <div style={{flex:1}}>
                            <div style={{fontSize:12,fontWeight:700,color:"#fff"}}>{bill.name}</div>
                            <div style={{fontSize:10,color:"rgba(255,255,255,0.8)"}}>
                              {fmtMoney(bill.amount)} · {status==="overdue"?t.recurringOverdue:t.recurringDue}
                            </div>
                          </div>
                          <div style={{display:"flex",gap:5}}>
                            <button onClick={()=>confirmPayBill(bill)} style={{
                              background:"#fff",border:"none",borderRadius:9,
                              padding:"5px 10px",fontSize:11,fontWeight:700,
                              color:C.accent,cursor:"pointer"}}>{t.confirmPay}</button>
                            <button onClick={()=>skipBillOnce(bill)} style={{
                              background:"rgba(255,255,255,0.2)",border:"1.5px solid rgba(255,255,255,0.5)",
                              borderRadius:9,padding:"5px 8px",fontSize:10,
                              color:"#fff",cursor:"pointer"}}>{t.skipBill}</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
            <div style={{background:"#FFFDF5",borderBottom:`1px solid ${C.borderSoft}`,
              padding:"8px 14px",display:"flex",gap:10,alignItems:"center"}}>
              <QStat label={t.txnCount} value={filtered.length}/>
              <QStat label={t.income}   value={fmtMoney(income)}  color={C.green}/>
              <QStat label={t.expense}  value={fmtMoney(expense)} color={C.red}/>
              <QStat label={t.avgDaily} value={fmtMoney(avgDaily)} color={C.paw}/>
            </div>
            {groups.length===0&&(
              <div style={{textAlign:"center",padding:"46px 20px",color:C.textLight}}>
                <CatSVG wearing={data.cat.wearing||[]} level={catLevel} size={130} photo={data.cat.photo}/>
                <div style={{fontSize:14,marginTop:12,lineHeight:1.7,color:C.textMid}}>
                  {t.noTxns.split("\n").map((l,i)=><div key={i}>{l}</div>)}
                </div>
                <div style={{fontSize:10,color:C.textLight,marginTop:8}}>{t.deleteHint}</div>
              </div>
            )}
            {groups.map(([date,dayTxns])=>{
              const dayExp=dayTxns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
              const dayInc=dayTxns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
              const d=new Date(date+"T00:00:00");
              const dayLbl=`${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")} ${t.days[d.getDay()]}`;
              return (
                <div key={date}>
                  <div style={{display:"flex",justifyContent:"space-between",padding:"8px 14px 4px",
                    background:C.bgSoft,borderBottom:`1px solid ${C.borderSoft}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:5}}>
                      <PawDot size={11} color={C.paw} opacity={0.55}/>
                      <span style={{fontSize:11,color:C.textMid,fontWeight:600}}>{dayLbl}</span>
                    </div>
                    <span style={{fontSize:10,color:C.textLight}}>
                      {dayInc>0&&<span style={{color:C.green,marginRight:6}}>+{fmtMoney(dayInc)}</span>}
                      {dayExp>0&&<span style={{color:C.red}}>-{fmtMoney(dayExp)}</span>}
                    </span>
                  </div>
                  <div style={{background:"#FFFDF5",marginBottom:6}}>
                    {dayTxns.map((tx,i)=>{
                      const c=CATS_EN.find(x=>x.name===tx.cat)||CATS_EN[CATS_EN.length-2];
                      return (
                        <div key={tx.id}
                          onDoubleClick={()=>{ upd(d=>({...d,txns:d.txns.filter(t=>t.id!==tx.id)})); meow("delete"); showToast("Deleted~","🐾"); }}
                          style={{display:"flex",alignItems:"center",gap:11,padding:"11px 14px",
                            borderTop:i===0?"none":`1px solid ${C.borderSoft}`,cursor:"default"}}>
                          <PawIcon icon={c.icon} size={42} bg={c.color+"33"} pawColor={c.color+"88"} style={{flexShrink:0}}/>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:13,fontWeight:600,color:C.text}}>{data.lang==="zh"?c.zh:c.name}</div>
                            <div style={{fontSize:10,color:C.textLight,marginTop:1}}>{tx.note||"—"}{tx.apay&&<span style={{marginLeft:5,background:"#000",borderRadius:4,fontSize:7,color:"#fff",padding:"1px 4px",fontWeight:700}}>Pay</span>}</div>
                          </div>
                          <div style={{fontSize:15,fontWeight:700,color:tx.type==="income"?C.green:C.text,whiteSpace:"nowrap"}}>
                            {tx.type==="income"?"+":"-"}{fmtMoney(tx.amount)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ ANALYSIS ═══ */}
        {tab==="analysis"&&(
          <div style={{padding:"12px 13px 0"}}>

            {/* ══ Monthly Overview Card ══ */}
            {(()=>{
              const now=new Date(); const pad=n=>String(n).padStart(2,"0");
              const monFrom=`${now.getFullYear()}-${pad(now.getMonth()+1)}-01`;
              const monTo=`${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(new Date(now.getFullYear(),now.getMonth()+1,0).getDate())}`;
              const monTxns=txns.filter(tx=>tx.date>=monFrom&&tx.date<=monTo);
              const monActualExp=monTxns.filter(tx=>tx.type==="expense").reduce((s,tx)=>s+tx.amount,0);
              // 结余 = 月收入 - 月固定支出 - 本月实际消费
              const monBalance=monthlyIncome - monthlyFixed - monActualExp;
              const hasIncome=monthlyIncome>0;
              const monLabel=`${T[data.lang||"en"].months[now.getMonth()]} ${now.getFullYear()}`;

              return (
                <div style={{borderRadius:24,overflow:"hidden",marginBottom:12,
                  boxShadow:`0 6px 24px rgba(245,183,49,0.28)`}}>
                  {/* Card header */}
                  <div style={{background:`linear-gradient(135deg,${C.primary} 0%,${C.yellow2} 60%,#FFE082 100%)`,
                    padding:"16px 16px 12px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                      <div>
                        <div style={{fontSize:9,color:"rgba(61,43,26,0.6)",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase"}}>
                          📊 {t.overviewTitle}
                        </div>
                        <div style={{fontSize:12,fontWeight:600,color:C.textMid,marginTop:2}}>{monLabel}</div>
                      </div>
                      <button onClick={()=>{ setIncomeInput(String(monthlyIncome||"")); setShowSet(true); meow("soft"); }}
                        style={{fontSize:10,color:C.textMid,background:"rgba(255,255,255,0.45)",
                          border:`1px solid rgba(255,255,255,0.7)`,borderRadius:10,
                          padding:"4px 10px",cursor:"pointer",fontWeight:600}}>
                        ✏️ {data.lang==="zh"?"设月收入":"Set Income"}
                      </button>
                    </div>

                    {/* Big balance number */}
                    <div style={{textAlign:"center",padding:"8px 0 4px"}}>
                      <div style={{fontSize:9,color:"rgba(61,43,26,0.6)",marginBottom:3}}>
                        {data.lang==="zh"?"本月结余":"Monthly Balance"}
                        <span style={{marginLeft:6,fontSize:8,color:"rgba(61,43,26,0.45)"}}>
                          {data.lang==="zh"?"(月收入 - 固定支出 - 实际消费)":"(income − fixed − actual spending)"}
                        </span>
                      </div>
                      {hasIncome?(
                        <div style={{fontSize:36,fontWeight:800,color:monBalance>=0?C.text:C.red,
                          letterSpacing:"-0.02em"}}>
                          {monBalance>=0?"+":""}{fmtMoney(monBalance)}
                        </div>
                      ):(
                        <div>
                          <div style={{fontSize:22,fontWeight:700,color:"rgba(61,43,26,0.35)"}}>— —</div>
                          <div style={{fontSize:10,color:"rgba(61,43,26,0.45)",marginTop:4}}>
                            {data.lang==="zh"?"请先设置月收入":"Set monthly income to see balance"}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card body: breakdown rows */}
                  <div style={{background:"#FFFDF5",padding:"12px 16px"}}>
                    {/* Progress bar */}
                    {hasIncome && (() => {
                      const total=monthlyIncome;
                      const fixedPct=Math.min(monthlyFixed/total,1)*100;
                      const actualPct=Math.min(monActualExp/total,1)*100;
                      const overTotal=monthlyFixed+monActualExp>total;
                      const progressBar = (
                        <div style={{marginBottom:12}}>
                          <div style={{height:8,borderRadius:5,background:C.bgSoft,overflow:"hidden",display:"flex"}}>
                            <div style={{width:`${fixedPct}%`,background:C.red,transition:"width 0.5s"}}/>
                            <div style={{width:`${Math.min(actualPct, 100-fixedPct)}%`,background:C.accent,transition:"width 0.5s"}}/>
                          </div>
                          <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
                            <div style={{display:"flex",gap:10}}>
                              <span style={{fontSize:8,color:C.textLight,display:"flex",alignItems:"center",gap:3}}>
                                <span style={{width:7,height:7,borderRadius:"50%",background:C.red,display:"inline-block"}}/>
                                {t.fixedCosts}
                              </span>
                              <span style={{fontSize:8,color:C.textLight,display:"flex",alignItems:"center",gap:3}}>
                                <span style={{width:7,height:7,borderRadius:"50%",background:C.accent,display:"inline-block"}}/>
                                {data.lang==="zh"?"实际消费":"Actual Spend"}
                              </span>
                            </div>
                            {overTotal&&<span style={{fontSize:8,color:C.red,fontWeight:700}}>⚠️ over</span>}
                          </div>
                        </div>
                      );
                      return progressBar;
                    })()}

                    {/* 3-row breakdown */}
                    {[
                      { icon:"💰", label:t.monthlyIncomeLabel, val:monthlyIncome, color:C.green, sub:data.lang==="zh"?"设定月收入":"set monthly salary", dimIfZero:true },
                      { icon:"🔒", label:t.fixedCosts,         val:monthlyFixed,  color:C.red,   sub:data.lang==="zh"?`${(data.recurring||[]).filter(b=>b.freq==="monthly").length} 项固定账单`:`${(data.recurring||[]).filter(b=>b.freq==="monthly").length} recurring bills` },
                      { icon:"🛒", label:data.lang==="zh"?"本月实际消费":"Actual Spending", val:monActualExp, color:C.accent, sub:data.lang==="zh"?`${monTxns.filter(t=>t.type==="expense").length} 笔支出`:`${monTxns.filter(t=>t.type==="expense").length} transactions` },
                    ].map(({icon,label,val,color,sub,dimIfZero})=>(
                      <div key={label} style={{display:"flex",alignItems:"center",
                        padding:"9px 0",borderBottom:`1px solid ${C.borderSoft}`}}>
                        <div style={{fontSize:20,marginRight:12}}>{icon}</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:12,fontWeight:600,color:dimIfZero&&val===0?C.textLight:C.text}}>{label}</div>
                          <div style={{fontSize:10,color:C.textLight,marginTop:1}}>{sub}</div>
                        </div>
                        <div style={{fontSize:16,fontWeight:700,
                          color:dimIfZero&&val===0?C.textLight:color}}>
                          {dimIfZero&&val===0?t.notSet:fmtMoney(val)}
                        </div>
                      </div>
                    ))}

                    {/* Result row */}
                    <div style={{display:"flex",alignItems:"center",padding:"11px 0 3px"}}>
                      <div style={{fontSize:20,marginRight:12}}>🐾</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:13,fontWeight:700,color:C.text}}>
                          {data.lang==="zh"?"本月结余":"Monthly Balance"}
                        </div>
                        <div style={{fontSize:9,color:C.textLight}}>
                          {data.lang==="zh"?"收入 − 固定 − 实际消费":"income − fixed − actual spending"}
                        </div>
                      </div>
                      <div style={{fontSize:20,fontWeight:800,
                        color:hasIncome?(monBalance>=0?C.green:C.red):C.textLight}}>
                        {hasIncome?(monBalance>=0?"+":"")+fmtMoney(monBalance):"—"}
                      </div>
                    </div>

                    {/* Savings pot bonus row */}
                    {totalSaved>0&&(
                      <div style={{marginTop:8,background:C.yellow1,borderRadius:12,
                        padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:11,fontWeight:600,color:C.textMid}}>🐷 {t.savingsPot}</div>
                          <div style={{fontSize:9,color:C.textLight}}>{data.lang==="zh"?"所有存钱目标合计":"all savings goals combined"}</div>
                        </div>
                        <div style={{fontSize:16,fontWeight:700,color:C.paw}}>{fmtMoney(totalSaved)}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
            <div style={{background:`linear-gradient(135deg,${C.primary},${C.yellow2})`,
              borderRadius:22,padding:"14px",marginBottom:12,boxShadow:`0 4px 20px rgba(245,183,49,0.3)`}}>
              <div style={{fontSize:10,color:"rgba(61,43,26,0.7)",fontWeight:700,letterSpacing:"0.06em",marginBottom:8}}>
                🐾 {t.rangeSummary}: {rangeLabel}
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6}}>
                {[[t.income,fmtMoney(income),C.green],[t.expense,fmtMoney(expense),C.red],
                  [t.balance,fmtMoney(balance),balance>=0?C.text:C.red],[t.avgDaily,fmtMoney(avgDaily),C.paw]].map(([lb,v,col])=>(
                  <div key={lb} style={{textAlign:"center",background:"rgba(255,255,255,0.35)",borderRadius:12,padding:"7px 4px"}}>
                    <div style={{fontSize:8,color:"rgba(61,43,26,0.6)",marginBottom:2}}>{lb}</div>
                    <div style={{fontSize:12,fontWeight:700,color:col}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{marginTop:8,fontSize:9,color:"rgba(61,43,26,0.55)"}}>{filtered.length} {t.txnCount} · {days} days</div>
            </div>

            <YCard title="📈 Trends" mb={11}><TrendChart/></YCard>
            <YCard title="📅 Calendar" mb={11}>
              {renderCalendar()}
              {(()=>{
                const vals=Object.entries(dailyTotals); if(!vals.length) return null;
                const [maxD,maxV]=vals.reduce((a,b)=>b[1]>a[1]?b:a,vals[0]);
                const [minD,minV]=vals.reduce((a,b)=>b[1]<a[1]?b:a,vals[0]);
                return Object.keys(dailyTotals).length>0 ? (
                  <div style={{display:"flex",gap:7,marginTop:8}}>
                    <div style={{flex:1,background:C.bgSoft,borderRadius:10,padding:"7px 10px"}}>
                      <div style={{fontSize:9,color:C.textLight}}>{t.mostSpent}</div>
                      <div style={{fontSize:13,fontWeight:700,color:C.red}}>{fmtMoney(maxV)}</div>
                      <div style={{fontSize:9,color:C.textLight}}>{maxD.slice(5)}</div>
                    </div>
                    <div style={{flex:1,background:C.bgSoft,borderRadius:10,padding:"7px 10px"}}>
                      <div style={{fontSize:9,color:C.textLight}}>{t.leastSpent}</div>
                      <div style={{fontSize:13,fontWeight:700,color:C.green}}>{fmtMoney(minV)}</div>
                      <div style={{fontSize:9,color:C.textLight}}>{minD.slice(5)}</div>
                    </div>
                  </div>
                ) : null;
              })()}
            </YCard>

            <YCard title="🍩 By Category" mb={11}>
              {Object.keys(catTotals).length===0?<div style={{textAlign:"center",color:C.textLight,padding:16,fontSize:12}}>No data 🐾</div>:<DonutChart/>}
            </YCard>

            {Object.entries(catTotals).sort((a,b)=>b[1]-a[1]).map(([cat,amt])=>{
              const c=CATS_EN.find(x=>x.name===cat)||CATS_EN[CATS_EN.length-2];
              const pct=expense>0?amt/expense:0, bgt=budget[cat], over=bgt&&amt>bgt;
              return (
                <div key={cat} style={{background:"#FFFDF5",borderRadius:16,border:`1.5px solid ${C.border}`,
                  padding:"10px 13px",marginBottom:7,boxShadow:`0 2px 6px rgba(212,149,106,0.08)`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,alignItems:"center"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <PawIcon icon={c.icon} size={36} bg={c.color+"33"} pawColor={c.color+"88"}/>
                      <span style={{fontSize:12,fontWeight:600,color:C.text}}>{data.lang==="zh"?c.zh:c.name}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{fontSize:13,fontWeight:700,color:over?C.red:C.text}}>{fmtMoney(amt)}</span>
                      {bgt&&<span style={{fontSize:9,color:C.textLight,marginLeft:4}}>/ {fmtMoney(bgt)}</span>}
                      <span style={{fontSize:9,color:C.textLight,marginLeft:4}}>{Math.round(pct*100)}%</span>
                    </div>
                  </div>
                  <div style={{height:6,borderRadius:4,background:C.borderSoft,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:4,background:c.color,width:`${pct*100}%`,transition:"width 0.5s"}}/>
                  </div>
                </div>
              );
            })}

            {filtered.filter(t=>t.apay).length>0&&(
              <YCard title="🍎 Apple Pay" mb={11}>
                {filtered.filter(t=>t.apay).map((tx,i)=>(
                  <div key={tx.id} style={{display:"flex",justifyContent:"space-between",
                    padding:"6px 0",borderTop:i===0?"none":`1px solid ${C.borderSoft}`,fontSize:11,color:C.text}}>
                    <div><span style={{color:C.textLight,marginRight:5}}>{tx.date.slice(5)}</span>{tx.note}</div>
                    <span style={{fontWeight:700,color:C.red}}>-{fmtMoney(tx.amount)}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",marginTop:7,paddingTop:7,
                  borderTop:`1.5px solid ${C.border}`,fontWeight:700,fontSize:12,color:C.text}}>
                  <span>{t.totalAuto}</span>
                  <span style={{color:C.red}}>-{fmtMoney(filtered.filter(t=>t.apay).reduce((s,t)=>s+t.amount,0))}</span>
                </div>
              </YCard>
            )}
          </div>
        )}

        {/* ═══ BUDGET ═══ */}
        {tab==="budget"&&(
          <div style={{padding:"12px 13px 0"}}>
            {/* Sub-tab: Budget / Recurring */}
            <div style={{display:"flex",background:C.bgSoft,borderRadius:16,padding:3,marginBottom:12,border:`1.5px solid ${C.border}`}}>
              {[["budget",`💛 ${t.budget}`],["recurring",`📅 ${t.recurringTitle}`]].map(([k,lb])=>(
                <button key={k} onClick={()=>{ setBudgetSubTab(k); meow("soft"); }} style={{
                  flex:1,padding:"9px",borderRadius:12,border:"none",cursor:"pointer",
                  background:budgetSubTab===k?`linear-gradient(135deg,${C.primary},${C.accent})`:"transparent",
                  color:budgetSubTab===k?C.text:C.textMid,fontWeight:budgetSubTab===k?700:400,fontSize:12}}>
                  {lb}
                  {k==="recurring" && (data.recurring||[]).filter(b=>{ const s=getBillStatus(b); return s==="overdue"||s==="due"; }).length > 0 && (
                    <span style={{marginLeft:5,background:C.red,color:"#fff",borderRadius:8,fontSize:9,padding:"1px 5px",fontWeight:700}}>
                      {(data.recurring||[]).filter(b=>{ const s=getBillStatus(b); return s==="overdue"||s==="due"; }).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ── BUDGET sub-tab ── */}
            {budgetSubTab==="budget"&&(<>
            <YCard title="🐾 Set Budget" mb={11}>
              <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                <select value={budCat} onChange={e=>setBudCat(e.target.value)} style={{flex:1,minWidth:110,...selS}}>
                  {CATS_EN.filter(c=>c.name!=="Income").map(c=><option key={c.name} value={c.name}>{c.icon} {data.lang==="zh"?c.zh:c.name}</option>)}
                </select>
                <input value={budAmt} onChange={e=>setBudAmt(e.target.value)} placeholder="$0" type="number" style={{width:80,...inpS}}/>
                <YBtn onClick={()=>{ saveBudget(); }}>{t.set}</YBtn>
              </div>
            </YCard>

            {(()=>{
              if(Object.entries(budget).length===0) return null;
              const totalBgt=Object.values(budget).reduce((s,v)=>s+v,0);
              const used=Object.entries(budget).reduce((s,[cat,bgt])=>s+Math.min(catTotals[cat]||0,bgt),0);
              const pct=totalBgt>0?used/totalBgt:0;
              return (
                <div style={{background:`linear-gradient(135deg,${C.primary},${C.yellow2})`,borderRadius:22,
                  padding:"16px",marginBottom:11,boxShadow:`0 4px 18px rgba(245,183,49,0.28)`,position:"relative",overflow:"hidden"}}>
                  <PawDot size={80} color="rgba(255,255,255,0.15)" opacity={1} style={{position:"absolute",right:-8,bottom:-8}}/>
                  <div style={{display:"flex",justifyContent:"space-between",color:C.text,marginBottom:10}}>
                    <div><div style={{fontSize:9,opacity:0.6}}>Total Budget</div><div style={{fontSize:20,fontWeight:700}}>{fmtMoney(totalBgt)}</div></div>
                    <div style={{textAlign:"right"}}><div style={{fontSize:9,opacity:0.6}}>Used ({Math.round(pct*100)}%)</div><div style={{fontSize:20,fontWeight:700}}>{fmtMoney(used)}</div></div>
                  </div>
                  <div style={{height:12,borderRadius:8,background:"rgba(255,255,255,0.3)"}}>
                    <div style={{height:"100%",borderRadius:8,
                      background:pct>0.9?C.red:pct>0.7?C.accent:"rgba(61,43,26,0.5)",
                      width:`${pct*100}%`,transition:"width 0.6s"}}/>
                  </div>
                  <div style={{fontSize:10,color:"rgba(61,43,26,0.6)",marginTop:5}}>
                    {t.budgetLeft}: {fmtMoney(Math.max(0,totalBgt-used))} · based on {rangeLabel}
                  </div>
                </div>
              );
            })()}

            {Object.entries(budget).length===0&&<div style={{textAlign:"center",color:C.textLight,padding:40,fontSize:13}}><PawDot size={50} color={C.pawLight} opacity={0.6}/><div style={{marginTop:10}}>{t.noBudgets}</div></div>}

            {Object.entries(budget).map(([cat,bgt])=>{
              const c=CATS_EN.find(x=>x.name===cat)||CATS_EN[CATS_EN.length-2];
              const spent=catTotals[cat]||0, pct=Math.min(spent/bgt,1), over=spent>bgt;
              return (
                <div key={cat} style={{background:"#FFFDF5",borderRadius:18,
                  border:`1.5px solid ${over?"#FFCACA":C.border}`,padding:"13px",marginBottom:9}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <PawIcon icon={c.icon} size={38} bg={c.color+"33"} pawColor={c.color+"88"}/>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:C.text}}>{data.lang==="zh"?c.zh:c.name}</div>
                        <div style={{fontSize:9,color:C.textLight}}>Budget: {fmtMoney(bgt)}</div>
                      </div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:14,fontWeight:700,color:over?C.red:C.primary2}}>{fmtMoney(spent)}</div>
                      <div style={{fontSize:9,color:over?C.red:C.green}}>{over?`${t.budgetOver} ${fmtMoney(spent-bgt)}`:`${fmtMoney(Math.max(0,bgt-spent))} ${t.budgetLeft}`}</div>
                    </div>
                  </div>
                  <div style={{height:8,borderRadius:5,background:C.borderSoft,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:5,background:over?C.red:c.color,width:`${pct*100}%`,transition:"width 0.5s"}}/>
                  </div>
                  <button onClick={()=>{ upd(d=>{const b={...d.budget};delete b[cat];return{...d,budget:b};}); meow("delete"); }}
                    style={{marginTop:6,fontSize:9,color:C.textLight,background:"none",border:"none",cursor:"pointer"}}>{t.removeBudget}</button>
                </div>
              );
            })}
            </>)}

            {/* ── RECURRING sub-tab ── */}
            {budgetSubTab==="recurring"&&(<>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <span style={{fontSize:13,fontWeight:700,color:C.textMid}}>📅 {t.recurringTitle}</span>
                <button onClick={()=>{ setShowRecurForm(true); meow("soft"); }}
                  style={{fontSize:12,color:C.primary2,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>{t.addRecurring}</button>
              </div>

              {(data.recurring||[]).length===0&&(
                <div style={{textAlign:"center",color:C.textLight,padding:"40px 20px",fontSize:13}}>
                  <div style={{fontSize:40,marginBottom:10}}>📅</div>
                  <div>{t.noRecurring}</div>
                  <div style={{fontSize:11,marginTop:6,color:C.textLight,lineHeight:1.6}}>
                    房租、订阅服务、手机账单…<br/>设置后到期自动提醒！
                  </div>
                </div>
              )}

              {(data.recurring||[]).map(bill=>{
                const status=getBillStatus(bill);
                const nextDue=getNextDueDate(bill);
                const c=CATS_EN.find(x=>x.name===bill.cat)||CATS_EN[CATS_EN.length-2];
                const statusColors={
                  overdue:{bg:"#FFF0F0",border:"#FFD6D6",badge:C.red,text:t.recurringOverdue},
                  due:    {bg:C.yellow1,border:C.yellow2,badge:C.primary2,text:t.recurringDue},
                  upcoming:{bg:"#F0F7FF",border:"#BFD9FF",badge:"#1E88E5",text:t.recurringUpcoming},
                  future: {bg:"#FFFDF5",border:C.border,badge:C.textLight,text:t.nextDue},
                };
                const sc=statusColors[status]||statusColors.future;
                const freqLabel={monthly:t.freqMonthly,weekly:t.freqWeekly,yearly:t.freqYearly}[bill.freq]||bill.freq;
                return (
                  <div key={bill.id} style={{background:sc.bg,borderRadius:20,
                    border:`1.5px solid ${sc.border}`,padding:"13px",marginBottom:10}}>
                    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
                      <PawIcon icon={c.icon} size={40} bg={c.color+"33"} pawColor={c.color+"88"}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <span style={{fontSize:14,fontWeight:700,color:C.text}}>{bill.name}</span>
                          <span style={{background:sc.badge,color:"#fff",borderRadius:6,
                            fontSize:8,padding:"1px 6px",fontWeight:700}}>{sc.text}</span>
                        </div>
                        <div style={{fontSize:11,color:C.textMid,marginTop:2}}>
                          {fmtMoney(bill.amount)} · {freqLabel}
                          {bill.freq==="monthly"&&<span style={{color:C.textLight}}> · {data.lang==="zh"?"每月":"every"} {bill.day}{data.lang==="en"?"th":""}</span>}
                        </div>
                        <div style={{fontSize:10,color:C.textLight,marginTop:1}}>
                          {t.nextDue}: <strong style={{color:sc.badge}}>{nextDue}</strong>
                        </div>
                      </div>
                      <button onClick={()=>{ upd(d=>({...d,recurring:(d.recurring||[]).filter(b=>b.id!==bill.id)})); meow("delete"); }}
                        style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:14,flexShrink:0}}>🗑️</button>
                    </div>
                    {(status==="due"||status==="overdue")&&(
                      <div style={{display:"flex",gap:7}}>
                        <button onClick={()=>confirmPayBill(bill)} style={{
                          flex:2,padding:"9px",borderRadius:12,border:"none",cursor:"pointer",
                          background:`linear-gradient(135deg,${C.primary},${C.accent})`,
                          color:C.text,fontSize:12,fontWeight:700}}>
                          ✓ {t.confirmPay}
                        </button>
                        <button onClick={()=>skipBillOnce(bill)} style={{
                          flex:1,padding:"9px",borderRadius:12,cursor:"pointer",
                          background:"transparent",border:`1.5px solid ${C.border}`,
                          color:C.textMid,fontSize:11}}>
                          {t.skipBill}
                        </button>
                      </div>
                    )}
                    {status==="upcoming"&&(
                      <div style={{fontSize:10,color:"#1E88E5",textAlign:"center",
                        padding:"6px",background:"rgba(30,136,229,0.08)",borderRadius:8}}>
                        ⏰ {data.lang==="zh"?"即将到期，请准备好资金":"Due soon — make sure you have funds ready!"}
                      </div>
                    )}
                  </div>
                );
              })}
            </>)}
          </div>
        )}

        {/* ═══ SAVINGS ═══ */}
        {tab==="savings"&&(
          <div style={{padding:"12px 13px 0"}}>
            <div style={{background:`linear-gradient(135deg,${C.primary},${C.accent})`,borderRadius:20,
              padding:"13px",marginBottom:11,boxShadow:`0 3px 16px rgba(245,183,49,0.25)`}}>
              <div style={{fontSize:10,color:"rgba(61,43,26,0.7)",marginBottom:7,fontWeight:600}}>🐾 {t.points} — {t.pointsHint}</div>
              <div style={{display:"flex",justifyContent:"space-around"}}>
                {[[t.pointsEarned,totalPtsEarned],[t.pointsSpent,ptsSpent],[t.pointsLeft,ptsAvail]].map(([lb,v])=>(
                  <div key={lb} style={{textAlign:"center",background:"rgba(255,255,255,0.28)",borderRadius:12,padding:"7px 10px",minWidth:70}}>
                    <div style={{fontSize:8,color:"rgba(61,43,26,0.6)",marginBottom:2}}>{lb}</div>
                    <div style={{fontSize:18,fontWeight:700,color:lb===t.pointsLeft?C.paw:C.text}}>{v}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Savings goals list */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:700,color:C.textMid}}>{t.savingsGoals}</span>
              <button onClick={()=>{ setShowGoalForm(true); meow("soft"); }}
                style={{fontSize:12,color:C.primary2,background:"none",border:"none",cursor:"pointer",fontWeight:700}}>{t.newGoal}</button>
            </div>

            {goals.length===0&&<div style={{textAlign:"center",color:C.textLight,padding:40,fontSize:13}}><div style={{fontSize:36,marginBottom:8}}>🐷</div>{t.noGoals}</div>}

            {goals.map(g=>{
              const pct=Math.min(g.saved/g.target,1);
              // Countdown
              let countdownEl=null;
              if(g.targetDate){
                const diff=Math.round((new Date(g.targetDate+"T00:00:00")-new Date())/(1000*60*60*24));
                if(diff>0) countdownEl=<span style={{fontSize:10,color:"#1E88E5",fontWeight:700,background:"#E3F2FD",borderRadius:8,padding:"2px 7px"}}>⏰ {diff} {t.daysLeft}</span>;
                else if(diff===0) countdownEl=<span style={{fontSize:10,color:C.accent,fontWeight:700,background:C.yellow1,borderRadius:8,padding:"2px 7px"}}>🎯 {data.lang==="zh"?"今天到期！":"Due today!"}</span>;
                else countdownEl=<span style={{fontSize:10,color:C.red,fontWeight:700,background:"#FFF0F0",borderRadius:8,padding:"2px 7px"}}>⚠️ {Math.abs(diff)} {t.daysOver}</span>;
              }
              return (
                <div key={g.id} style={{background:"#FFFDF5",borderRadius:20,border:`2px solid ${g.color}55`,padding:"13px",marginBottom:10,boxShadow:`0 3px 10px rgba(212,149,106,0.1)`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                    <div style={{display:"flex",gap:9,alignItems:"center",flex:1,minWidth:0}}>
                      <PawIcon icon="🐷" size={40} bg={g.color+"33"} pawColor={g.color+"88"}/>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontSize:14,fontWeight:700,color:C.text}}>{g.name}</div>
                        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",marginTop:2}}>
                          <span style={{fontSize:11,color:g.color,fontWeight:700}}>{fmtMoney(g.target)}</span>
                          {g.bank&&<span style={{fontSize:10,color:C.textMid,background:C.bgSoft,borderRadius:7,padding:"1px 6px"}}>{g.bank}</span>}
                          {countdownEl}
                        </div>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:5,flexShrink:0}}>
                      <button onClick={()=>{ setCheckinGoal(g.id); meow("soft"); }} style={{
                        background:g.color+"22",border:`1.5px solid ${g.color}66`,
                        borderRadius:11,padding:"5px 9px",fontSize:11,fontWeight:700,color:g.color,cursor:"pointer"}}>{t.checkIn}</button>
                      <button onClick={()=>{ upd(d=>({...d,goals:d.goals.filter(x=>x.id!==g.id)})); meow("delete"); }}
                        style={{background:"none",border:"none",fontSize:13,color:C.textLight,cursor:"pointer"}}>✕</button>
                    </div>
                  </div>
                  <div style={{height:11,borderRadius:7,background:C.borderSoft,overflow:"hidden",marginBottom:6}}>
                    <div style={{height:"100%",borderRadius:7,background:g.color,width:`${pct*100}%`,transition:"width 0.5s"}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:checkinGoal===g.id?8:0}}>
                    <span style={{color:C.textLight}}>{t.saved}: <strong style={{color:g.color}}>{fmtMoney(g.saved)}</strong></span>
                    <span style={{color:C.textLight}}>{Math.round(pct*100)}%</span>
                    <span style={{color:C.textLight}}>{t.remaining}: <strong style={{color:C.primary2}}>{fmtMoney(Math.max(0,g.target-g.saved))}</strong></span>
                  </div>
                  {checkinGoal===g.id&&(
                    <div style={{display:"flex",gap:7,alignItems:"center"}}>
                      <input value={checkinAmt} onChange={e=>setCheckinAmt(e.target.value)}
                        placeholder={t.addAmount} type="number" style={{flex:1,...inpS,fontSize:13}}/>
                      <YBtn onClick={()=>checkin(g.id)}>{t.confirmSave} ✓</YBtn>
                      <button onClick={()=>setCheckinGoal(null)} style={{background:"none",border:"none",color:C.textLight,cursor:"pointer",fontSize:15}}>✕</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ═══ WARDROBE ═══ */}
        {tab==="wardrobe"&&(
          <div style={{padding:"12px 13px 0"}}>
            {/* Cat hero */}
            <div style={{background:`linear-gradient(135deg,${C.yellow1},#FFF0E8)`,borderRadius:26,
              padding:"18px",marginBottom:12,border:`1.5px solid ${C.border}`,
              boxShadow:`0 4px 18px rgba(245,183,49,0.18)`,position:"relative",overflow:"hidden"}}>
              <PawDot size={80} color={C.primary} opacity={0.08} style={{position:"absolute",top:-5,right:-5}}/>
              <FishDeco size={60} color={C.border} style={{position:"absolute",bottom:10,left:10,opacity:0.3}}/>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <CatSVG wearing={data.cat.wearing||[]} level={catLevel} size={140} photo={data.cat.photo}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:20,fontWeight:700,color:C.text,marginBottom:4}}>
                    {data.cat.name||"Kitty"}
                    <button onClick={()=>{ setCatNameEdit(data.cat.name||"Kitty"); setShowCatEdit(true); meow("soft"); }}
                      style={{fontSize:12,color:C.primary2,background:"none",border:"none",cursor:"pointer",marginLeft:5}}>✏️</button>
                  </div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:5,
                    background:`linear-gradient(135deg,${C.primary},${C.accent})`,
                    borderRadius:20,padding:"4px 12px",marginBottom:8}}>
                    <span style={{fontSize:10,fontWeight:700,color:C.text}}>Lv.{catLevel+1}</span>
                    <span style={{fontSize:10,color:C.text,opacity:0.75}}>{t.savingLevel[catLevel]}</span>
                  </div>
                  <div style={{background:"rgba(245,183,49,0.15)",borderRadius:12,padding:"8px 11px",marginBottom:7}}>
                    <div style={{fontSize:9,color:C.textMid,fontWeight:600}}>🐾 {t.pointsLeft}</div>
                    <div style={{fontSize:22,fontWeight:700,color:C.primary2}}>{ptsAvail}</div>
                  </div>
                  {(data.cat.wearing||[]).length>0&&(
                    <div style={{display:"flex",flexWrap:"wrap",gap:3,marginBottom:6}}>
                      {(data.cat.wearing||[]).map(id=>{ const item=SHOP_ITEMS.find(x=>x.id===id); return item?<span key={id} style={{fontSize:18}}>{item.emoji}</span>:null; })}
                    </div>
                  )}
                  <button onClick={()=>catPhotoRef.current.click()} style={{
                    fontSize:10,color:C.textMid,background:"rgba(212,149,106,0.12)",
                    border:`1.5px solid ${C.border}`,borderRadius:10,padding:"5px 9px",cursor:"pointer",fontWeight:600}}>
                    📷 {t.uploadPhoto}
                  </button>
                  <input ref={catPhotoRef} type="file" accept="image/*" onChange={uploadCatPhoto} style={{display:"none"}}/>
                </div>
              </div>
              <div style={{marginTop:10}}>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:C.textMid,marginBottom:3}}>
                  <span>{t.catLevel}: {t.savingLevel[catLevel]}</span>
                  <span>${(catLevel*200).toFixed(0)} / ${((catLevel+1)*200).toFixed(0)} saved</span>
                </div>
                <div style={{height:7,borderRadius:5,background:"rgba(212,149,106,0.18)",overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:5,background:`linear-gradient(90deg,${C.primary},${C.accent})`,
                    width:`${Math.min(((totalSaved-(catLevel*200))/200)*100,100)}%`,transition:"width 0.5s"}}/>
                </div>
              </div>
            </div>

            {/* Shop tabs */}
            <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:2}}>
              {SHOP_TABS.map(({key,icon,label,zh})=>(
                <button key={key} onClick={()=>{ setShopTab(key); meow("soft"); }} style={{
                  flexShrink:0,padding:"7px 11px",borderRadius:16,border:"none",cursor:"pointer",
                  background:shopTab===key?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                  color:shopTab===key?C.text:C.textMid,fontSize:11,fontWeight:shopTab===key?700:400,
                  boxShadow:shopTab===key?`0 2px 10px rgba(245,183,49,0.35)`:"none",
                  border:shopTab===key?"none":`1.5px solid ${C.border}`}}>
                  {icon} {data.lang==="zh"?zh:label}
                </button>
              ))}
            </div>

            <div style={{fontSize:10,fontWeight:700,color:C.textMid,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>
              🛍️ {t.shopTitle}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14}}>
              {SHOP_ITEMS.filter(item=>item.cat===shopTab).map(item=>{
                const owned=(data.cat.owned||[]).includes(item.id);
                const wearing=(data.cat.wearing||[]).includes(item.id);
                const canBuy=!owned&&ptsAvail>=item.cost;
                const isFood=item.cat==="food";
                const rar=RARITY_COLORS[item.rarity]||RARITY_COLORS.common;
                return (
                  <div key={item.id} style={{
                    background:owned?rar.bg:"#FFFDF5",
                    borderRadius:20,border:`1.5px solid ${owned?rar.border:C.border}`,
                    padding:"13px 11px",boxShadow:`0 2px 8px rgba(212,149,106,0.1)`,
                    position:"relative",overflow:"hidden"}}>
                    {/* Rarity badge */}
                    <div style={{position:"absolute",top:7,left:7,background:rar.badge,
                      borderRadius:6,fontSize:8,color:"#fff",padding:"1px 5px",fontWeight:700}}>
                      {rar.text}
                    </div>
                    {wearing&&<div style={{position:"absolute",top:7,right:7,background:C.paw,
                      borderRadius:6,fontSize:8,color:"#fff",padding:"1px 5px",fontWeight:700}}>{t.wornTag}</div>}
                    {owned&&!wearing&&!isFood&&<div style={{position:"absolute",top:7,right:7,background:C.green,
                      borderRadius:6,fontSize:8,color:"#fff",padding:"1px 5px",fontWeight:700}}>{t.ownedTag}</div>}

                    <div style={{fontSize:40,textAlign:"center",marginBottom:5,marginTop:8}}>{item.emoji}</div>
                    <div style={{fontSize:12,fontWeight:700,color:C.text,textAlign:"center",marginBottom:1}}>
                      {data.lang==="zh"?item.zh:item.name}
                    </div>
                    <div style={{fontSize:9,color:C.textLight,textAlign:"center",marginBottom:7}}>{item.desc}</div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:7}}>
                      <PawDot size={12} color={C.paw} opacity={0.8}/>
                      <span style={{fontSize:14,fontWeight:700,color:C.primary2}}>{item.cost}</span>
                      <span style={{fontSize:9,color:C.textLight}}>pts</span>
                    </div>

                    {isFood?(
                      <button onClick={()=>{ if(canBuy||owned){ buyItem(item); }}} style={{
                        width:"100%",padding:"7px",borderRadius:11,border:"none",cursor:canBuy?"pointer":"default",
                        background:canBuy?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                        color:canBuy?C.text:C.textLight,fontSize:11,fontWeight:700}}>
                        {canBuy?`${t.buyBtn} 🐾`:"Need more 🐾"}
                      </button>
                    ):owned?(
                      <button onClick={()=>toggleWear(item.id)} style={{
                        width:"100%",padding:"7px",borderRadius:11,border:"none",cursor:"pointer",
                        background:wearing?`linear-gradient(135deg,${C.paw},${C.accent})`:`linear-gradient(135deg,${C.primary},${C.yellow2})`,
                        color:C.text,fontSize:11,fontWeight:700}}>
                        {wearing?`${t.removeBtn} ✓`:t.wearBtn}
                      </button>
                    ):(
                      <button onClick={()=>{ if(canBuy) buyItem(item); }} style={{
                        width:"100%",padding:"7px",borderRadius:11,border:"none",cursor:canBuy?"pointer":"default",
                        background:canBuy?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                        color:canBuy?C.text:C.textLight,fontSize:11,fontWeight:700}}>
                        {canBuy?`${t.buyBtn} 🐾`:"Need more 🐾"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* My closet */}
            {(data.cat.owned||[]).filter(id=>{ const item=SHOP_ITEMS.find(x=>x.id===id); return item&&item.cat!=="food"; }).length>0&&(
              <div style={{marginBottom:14}}>
                <div style={{fontSize:10,fontWeight:700,color:C.textMid,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:7}}>
                  👗 {t.wardrobeCloths}
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {(data.cat.owned||[]).filter(id=>{ const item=SHOP_ITEMS.find(x=>x.id===id); return item&&item.cat!=="food"; }).map(id=>{
                    const item=SHOP_ITEMS.find(x=>x.id===id), on=(data.cat.wearing||[]).includes(id);
                    return (
                      <button key={id} onClick={()=>toggleWear(id)} style={{
                        padding:"7px 12px",borderRadius:14,cursor:"pointer",
                        background:on?`linear-gradient(135deg,${C.paw},${C.accent})`:"#FFFDF5",
                        border:on?"none":`1.5px solid ${C.border}`,
                        color:on?"#fff":C.text,fontSize:12,fontWeight:on?700:400,
                        boxShadow:on?`0 2px 8px rgba(212,149,106,0.3)`:"none"}}>
                        {item.emoji} {data.lang==="zh"?item.zh:item.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PAW BUTTON ── */}
      <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",
        width:"100%",maxWidth:480,background:"#FFFDF5",borderTop:`1.5px solid ${C.border}`,
        display:"flex",alignItems:"center",justifyContent:"center",
        padding:"8px 0 18px",boxShadow:`0 -4px 20px rgba(245,183,49,0.18)`,zIndex:50}}>
        <button onClick={()=>{ setShowAdd(true); meow("soft"); }} style={{
          width:64,height:64,borderRadius:"50%",position:"relative",border:"none",cursor:"pointer",
          background:`linear-gradient(135deg,${C.primary},${C.accent})`,
          boxShadow:`0 5px 22px rgba(245,183,49,0.5)`,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <PawDot size={36} color="rgba(61,43,26,0.65)" opacity={1}/>
        </button>
      </div>

      {/* ══ MODALS ══ */}
      {showRange&&(
        <Modal onClose={()=>setShowRange(false)}>
          <div style={{fontSize:16,fontWeight:700,color:C.text,marginBottom:14}}>🐾 {t.dateRange}</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:14}}>
            {[["today",t.rangeToday,"🌸"],["week",t.rangeWeek,"📆"],["month",t.rangeMonth,"🗓️"],
              ["year",t.rangeYear,"📅"],["all",t.rangeAll,"🌍"],["custom",t.rangeCustom,"✏️"]].map(([p,lb,ic])=>(
              <button key={p} onClick={()=>{ applyPreset(p); meow("soft"); if(p!=="custom") setShowRange(false); }}
                style={{padding:"11px 5px",borderRadius:14,border:"none",cursor:"pointer",
                  background:preset===p?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                  color:preset===p?C.text:C.textMid,
                  border:preset===p?"none":`1.5px solid ${C.border}`,
                  fontWeight:preset===p?700:400,fontSize:12,
                  display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                <span style={{fontSize:18}}>{ic}</span><span>{lb}</span>
              </button>
            ))}
          </div>
          <div style={{background:C.bgSoft,borderRadius:16,padding:"13px",border:`1.5px solid ${C.border}`,marginBottom:12}}>
            <div style={{fontSize:9,fontWeight:700,color:C.textMid,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:9}}>{t.rangeCustom}</div>
            <div style={{display:"flex",gap:9,alignItems:"center"}}>
              <div style={{flex:1}}><div style={{fontSize:9,color:C.textLight,marginBottom:3}}>{t.from}</div><input type="date" value={customFrom} onChange={e=>{setCustomFrom(e.target.value);setPreset("custom");}} style={{...inpS,width:"100%",fontSize:12}}/></div>
              <div style={{color:C.border,fontSize:18,marginTop:11}}>→</div>
              <div style={{flex:1}}><div style={{fontSize:9,color:C.textLight,marginBottom:3}}>{t.to}</div><input type="date" value={customTo} max={todayStr()} onChange={e=>{setCustomTo(e.target.value);setPreset("custom");}} style={{...inpS,width:"100%",fontSize:12}}/></div>
            </div>
          </div>
          <div style={{marginBottom:12}}>
            <div style={{fontSize:9,fontWeight:700,color:C.textMid,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Quick</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
              {[[7,"7d"],[30,"30d"],[90,"90d"],[180,"6mo"]].map(([d,lb])=>(
                <button key={lb} onClick={()=>{
                  const from=new Date(); from.setDate(from.getDate()-d+1);
                  const pad=n=>String(n).padStart(2,"0");
                  const f=`${from.getFullYear()}-${pad(from.getMonth()+1)}-${pad(from.getDate())}`;
                  setCustomFrom(f); setCustomTo(todayStr()); setDateFrom(f); setDateTo(todayStr());
                  setPreset("custom"); setShowRange(false); meow("soft");
                }} style={{padding:"5px 12px",borderRadius:18,background:C.yellow1,border:`1.5px solid ${C.yellow2}`,color:C.textMid,fontSize:12,fontWeight:600,cursor:"pointer"}}>{lb}</button>
              ))}
            </div>
          </div>
          <YBtn wide onClick={applyCustom} disabled={customFrom>customTo}>{t.apply}</YBtn>
        </Modal>
      )}

      {showAdd&&<AddTransactionModal form={form} setForm={setForm} calPad={calPad} setCalPad={setCalPad} calPickerMon={calPickerMon} setCalPickerMon={setCalPickerMon} showDatePicker={showDatePicker} setShowDatePicker={setShowDatePicker} txns={txns} t={t} data={data} onClose={()=>{ setShowAdd(false); setCalPad(""); setShowDatePicker(false); }} onSubmit={addTxn}/>}

      {showAP&&(
        <Modal onClose={()=>setShowAP(false)}>
          <div style={{textAlign:"center",marginBottom:12}}>
            <div style={{width:50,height:50,borderRadius:14,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,margin:"0 auto 7px"}}></div>
            <div style={{fontSize:15,fontWeight:700,color:C.text}}>{t.applePayTitle}</div>
            <div style={{fontSize:11,color:C.textLight,marginTop:2}}>{t.applePayDesc}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {APPLE_MERCHANTS.map(m=>{
              const c=CATS_EN.find(x=>x.name===m.cat)||CATS_EN[0];
              return (
                <button key={m.name} onClick={()=>simApPay(m)} style={{
                  padding:"11px 9px",borderRadius:14,background:`${c.color}18`,
                  border:`1.5px solid ${c.color}44`,cursor:"pointer",textAlign:"left",
                  display:"flex",flexDirection:"column",gap:2}}>
                  <PawIcon icon={c.icon} size={30} bg={c.color+"33"} pawColor={c.color+"88"}/>
                  <span style={{fontSize:12,fontWeight:700,color:C.text,marginTop:2}}>{m.name}</span>
                  <span style={{fontSize:9,color:C.textLight}}>{data.lang==="zh"?c.zh:c.name}</span>
                  <span style={{fontSize:9,color:C.primary2,fontWeight:600}}>~${m.range[0]}–${m.range[1]}</span>
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {showGoalForm&&(
        <Modal onClose={()=>setShowGoalForm(false)}>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:12}}>🐷 {t.newGoal}</div>
          <FLabel>{t.goalName}</FLabel>
          <input value={goalForm.name} onChange={e=>setGoalForm(f=>({...f,name:e.target.value}))}
            placeholder={data.lang==="zh"?"例：出国旅行 🌏":"e.g. Japan Trip 🌏"}
            style={{...inpS,width:"100%",marginBottom:9}}/>
          <FLabel>{t.goalTarget}</FLabel>
          <input value={goalForm.target} onChange={e=>setGoalForm(f=>({...f,target:e.target.value}))}
            placeholder="$0.00" type="number" style={{...inpS,width:"100%",marginBottom:9}}/>
          <FLabel>{t.bankLabel}</FLabel>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:5}}>
            {t.bankPresets.map(b=>(
              <button key={b} onClick={()=>setGoalForm(f=>({...f,bank:b}))} style={{
                padding:"5px 10px",borderRadius:10,border:"none",cursor:"pointer",fontSize:11,
                background:goalForm.bank===b?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                color:goalForm.bank===b?C.text:C.textMid,fontWeight:goalForm.bank===b?700:400,
                border:goalForm.bank===b?"none":`1.5px solid ${C.border}`}}>{b}</button>
            ))}
          </div>
          <input value={goalForm.bank} onChange={e=>setGoalForm(f=>({...f,bank:e.target.value}))}
            placeholder={data.lang==="zh"?"或手动输入…":"or type custom…"}
            style={{...inpS,width:"100%",marginBottom:9,fontSize:12}}/>
          <FLabel>{t.targetDateLabel} ({data.lang==="zh"?"可选，用于倒计时":"optional, for countdown"})</FLabel>
          <input value={goalForm.targetDate} onChange={e=>setGoalForm(f=>({...f,targetDate:e.target.value}))}
            type="date" style={{...inpS,width:"100%",marginBottom:9}}/>
          {goalForm.targetDate && (() => {
            const diff=Math.round((new Date(goalForm.targetDate+"T00:00:00")-new Date())/(1000*60*60*24));
            const previewEl = (
              <div style={{fontSize:11,color:diff>=0?"#1E88E5":C.red,marginBottom:9,textAlign:"center",
                background:diff>=0?"#E3F2FD":"#FFF0F0",borderRadius:9,padding:"5px"}}>
                {diff>=0?`⏰ ${diff} ${t.daysLeft}`:`⚠️ ${Math.abs(diff)} ${t.daysOver}`}
              </div>
            );
            return previewEl;
          })()}
          <FLabel>Color</FLabel>
          <div style={{display:"flex",gap:7,marginBottom:13}}>
            {GOAL_COLORS.map((col,i)=>(
              <div key={i} onClick={()=>setGoalForm(f=>({...f,color:i}))} style={{
                width:26,height:26,borderRadius:"50%",background:col,cursor:"pointer",
                border:goalForm.color===i?`3px solid ${C.paw}`:"3px solid transparent"}}/>
            ))}
          </div>
          <YBtn wide onClick={addGoal}>{t.addGoal}</YBtn>
        </Modal>
      )}

      {showCatEdit&&(
        <Modal onClose={()=>setShowCatEdit(false)}>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:12}}>🐱 {t.catName}</div>
          <input value={catNameEdit} onChange={e=>setCatNameEdit(e.target.value)} placeholder="Kitty" style={{...inpS,width:"100%",marginBottom:12,fontSize:16}}/>
          <YBtn wide onClick={()=>{ upd(d=>({...d,cat:{...d.cat,name:catNameEdit}})); setShowCatEdit(false); meow("happy"); }}>Save 🐾</YBtn>
        </Modal>
      )}

      {showRecurForm&&(
        <Modal onClose={()=>setShowRecurForm(false)}>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:12}}>📅 {t.addRecurring}</div>
          <FLabel>{t.recurringName}</FLabel>
          <input value={recurForm.name} onChange={e=>setRecurForm(f=>({...f,name:e.target.value}))}
            placeholder={data.lang==="zh"?"例：房租、Netflix…":"e.g. Rent, Netflix…"}
            style={{...inpS,width:"100%",marginBottom:9}}/>
          <div style={{display:"flex",gap:7,marginBottom:9}}>
            <div style={{flex:1}}>
              <FLabel>{t.amount}</FLabel>
              <input value={recurForm.amount} onChange={e=>setRecurForm(f=>({...f,amount:e.target.value}))}
                placeholder="$0" type="number" style={{...inpS,width:"100%"}}/>
            </div>
            <div style={{flex:1}}>
              <FLabel>{t.category}</FLabel>
              <select value={recurForm.cat} onChange={e=>setRecurForm(f=>({...f,cat:e.target.value}))}
                style={{...selS,width:"100%"}}>
                {CATS_EN.filter(c=>c.name!=="Income").map(c=><option key={c.name} value={c.name}>{c.icon} {data.lang==="zh"?c.zh:c.name}</option>)}
              </select>
            </div>
          </div>
          <FLabel>{t.recurringFreq}</FLabel>
          <div style={{display:"flex",gap:6,marginBottom:9}}>
            {[["monthly",t.freqMonthly,"📅"],["weekly",t.freqWeekly,"📆"],["yearly",t.freqYearly,"🗓️"]].map(([k,lb,ic])=>(
              <button key={k} onClick={()=>{ setRecurForm(f=>({...f,freq:k,day:k==="monthly"?1:k==="weekly"?1:"01-01"})); meow("soft"); }} style={{
                flex:1,padding:"9px 5px",borderRadius:12,border:"none",cursor:"pointer",
                background:recurForm.freq===k?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                color:recurForm.freq===k?C.text:C.textMid,fontWeight:recurForm.freq===k?700:400,
                fontSize:11,border:recurForm.freq===k?"none":`1.5px solid ${C.border}`,
                display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <span style={{fontSize:16}}>{ic}</span><span>{lb}</span>
              </button>
            ))}
          </div>
          {recurForm.freq==="monthly"&&(
            <>
              <FLabel>{t.recurringDay}</FLabel>
              <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:9}}>
                {Array.from({length:28},(_,i)=>i+1).map(d=>(
                  <button key={d} onClick={()=>setRecurForm(f=>({...f,day:d}))} style={{
                    padding:"6px 2px",borderRadius:8,border:"none",cursor:"pointer",fontSize:11,
                    background:recurForm.day===d?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                    color:recurForm.day===d?C.text:C.textMid,fontWeight:recurForm.day===d?700:400,
                    border:recurForm.day===d?"none":`1px solid ${C.border}`}}>{d}</button>
                ))}
              </div>
            </>
          )}
          {recurForm.freq==="weekly"&&(
            <>
              <FLabel>Day of Week</FLabel>
              <div style={{display:"flex",gap:5,marginBottom:9,flexWrap:"wrap"}}>
                {t.days.map((d,i)=>(
                  <button key={i} onClick={()=>setRecurForm(f=>({...f,day:i}))} style={{
                    flex:1,padding:"8px 3px",borderRadius:10,border:"none",cursor:"pointer",fontSize:11,minWidth:36,
                    background:recurForm.day===i?`linear-gradient(135deg,${C.primary},${C.accent})`:C.bgSoft,
                    color:recurForm.day===i?C.text:C.textMid,fontWeight:recurForm.day===i?700:400,
                    border:recurForm.day===i?"none":`1px solid ${C.border}`}}>{d}</button>
                ))}
              </div>
            </>
          )}
          {recurForm.freq==="yearly"&&(
            <>
              <FLabel>Date (Month / Day)</FLabel>
              <div style={{display:"flex",gap:7,marginBottom:9,alignItems:"center"}}>
                <select value={(recurForm.day||"01-01").split("-")[0]} onChange={e=>{ const parts=(recurForm.day||"01-01").split("-"); setRecurForm(f=>({...f,day:`${e.target.value}-${parts[1]||"01"}`})); }} style={{...selS,flex:1}}>
                  {Array.from({length:12},(_,i)=>i+1).map(m=><option key={m} value={String(m).padStart(2,"0")}>{T[data.lang||"en"].months[m-1]}</option>)}
                </select>
                <select value={(recurForm.day||"01-01").split("-")[1]} onChange={e=>{ const parts=(recurForm.day||"01-01").split("-"); setRecurForm(f=>({...f,day:`${parts[0]||"01"}-${e.target.value}`})); }} style={{...selS,flex:1}}>
                  {Array.from({length:28},(_,i)=>i+1).map(d=><option key={d} value={String(d).padStart(2,"0")}>{d}</option>)}
                </select>
              </div>
            </>
          )}
          <FLabel>Color</FLabel>
          <div style={{display:"flex",gap:7,marginBottom:13}}>
            {GOAL_COLORS.map((col,i)=>(
              <div key={i} onClick={()=>setRecurForm(f=>({...f,color:i}))} style={{
                width:26,height:26,borderRadius:"50%",background:col,cursor:"pointer",
                border:recurForm.color===i?`3px solid ${C.paw}`:"3px solid transparent"}}/>
            ))}
          </div>
          <YBtn wide onClick={addRecurring}>📅 {t.addRecurring}</YBtn>
        </Modal>
      )}

      {showSet&&(
        <Modal onClose={()=>setShowSet(false)}>
          <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:14}}>⚙️ {t.settings}</div>

          {/* Monthly income setting */}
          <div style={{background:C.yellow1,borderRadius:14,padding:"12px",marginBottom:10,border:`1.5px solid ${C.yellow2}`}}>
            <div style={{fontSize:10,fontWeight:700,color:C.textMid,marginBottom:7}}>💰 {t.monthlyIncomeLabel}</div>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <input
                value={incomeInput}
                onChange={e=>setIncomeInput(e.target.value)}
                placeholder={monthlyIncome>0?String(monthlyIncome):"e.g. 5000"}
                type="number"
                style={{...inpS,flex:1,fontSize:16,fontWeight:700}}
              />
              <YBtn onClick={()=>{
                const v=parseFloat(incomeInput);
                if(!isNaN(v)&&v>=0){ upd(d=>({...d,monthlyIncome:v})); meow("save"); showToast("Income updated! 💰","🐾"); }
                setShowSet(false);
              }}>{t.setIncome} ✓</YBtn>
            </div>
            {monthlyIncome>0&&<div style={{fontSize:10,color:C.textMid,marginTop:5}}>
              {data.lang==="zh"?"当前":"Current"}: <strong>{fmtMoney(monthlyIncome)}/mo</strong>
              {monthlyFixed>0&&<span style={{color:C.red}}> · {data.lang==="zh"?"固定":"Fixed"}: -{fmtMoney(monthlyFixed)}</span>}
              {disposable>=0&&monthlyFixed>0&&<span style={{color:C.green}}> · {data.lang==="zh"?"可支配":"Free"}: {fmtMoney(disposable)}</span>}
            </div>}
          </div>

          <div style={{background:C.bgSoft,borderRadius:13,padding:"11px",marginBottom:9,border:`1.5px solid ${C.border}`}}>
            <div style={{fontSize:9,color:C.textMid,fontWeight:700,marginBottom:4,letterSpacing:"0.06em"}}>📱 LOCAL STORAGE</div>
            <div style={{fontSize:11,color:C.textMid,lineHeight:1.6}}>{t.localSave}</div>
            <div style={{fontSize:10,color:C.textLight,marginTop:3,lineHeight:1.5}}>{t.icloudNote}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <button onClick={()=>{ exportJSON(data); meow("soft"); }} style={{...setBtn}}>📤 {t.exportData} (.json)</button>
            <button onClick={()=>fileRef.current.click()} style={{...setBtn}}>📥 {t.importData} (.json)</button>
            <input ref={fileRef} type="file" accept=".json" onChange={importData} style={{display:"none"}}/>
            <button onClick={toggleLang} style={{...setBtn,background:C.yellow1,border:`1.5px solid ${C.yellow2}`,color:C.primary2}}>🌐 {t.switchLang}</button>
            <button onClick={()=>{ if(window.confirm("Clear all data?")){ upd(()=>({txns:[],budget:{},goals:[],recurring:[],monthlyIncome:0,lang:data.lang,cat:{name:"Kitty",photo:null,wearing:[],owned:[],pointsSpent:0}})); setShowSet(false); meow("delete"); }}} style={{...setBtn,background:"#FFF0F0",border:"1.5px solid #FFD6D6",color:C.red}}>🗑️ {t.clearAll}</button>
          </div>
        </Modal>
      )}

      {/* Toast */}
      {(toast||apToast)&&(
        <div style={{position:"fixed",top:56,left:"50%",transform:"translateX(-50%)",zIndex:200,
          background:"#FFFDF5",borderRadius:18,border:`1.5px solid ${C.border}`,
          padding:"11px 16px",boxShadow:`0 8px 28px rgba(245,183,49,0.28)`,
          display:"flex",alignItems:"center",gap:9,maxWidth:320,width:"90%",
          animation:"toastIn 0.3s ease"}}>
          <style>{`@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-12px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}`}</style>
          {apToast?(
            <>
              <div style={{width:34,height:34,borderRadius:10,background:"#000",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}></div>
              <div>
                <div style={{fontSize:12,fontWeight:700,color:C.text}}>{t.autoTracked}!</div>
                <div style={{fontSize:10,color:C.textLight,marginTop:1}}><span style={{color:C.primary2,fontWeight:700}}>{apToast.merchant}</span> · -${fmt2(apToast.amount)}</div>
              </div>
            </>
          ):(
            <>
              <span style={{fontSize:22}}>{toast.icon}</span>
              <span style={{fontSize:13,fontWeight:600,color:C.text}}>{toast.msg}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Shared small components ──────────────────────────────────────────────────
function Modal({children,onClose}) {
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(61,43,26,0.38)",
      backdropFilter:"blur(10px)",display:"flex",alignItems:"flex-end",
      justifyContent:"center",zIndex:100}} onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
      <div style={{width:"100%",maxWidth:480,
        background:`linear-gradient(170deg,${C.bgCard},${C.bg})`,
        borderRadius:"26px 26px 0 0",border:`1.5px solid ${C.border}`,borderBottom:"none",
        padding:"15px 15px 32px",boxShadow:`0 -8px 40px rgba(245,183,49,0.2)`,
        maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{width:32,height:4,borderRadius:4,background:C.border,margin:"0 auto 13px"}}/>
        {children}
      </div>
    </div>
  );
}
function YCard({title,children,mb}) {
  return (
    <div style={{background:"#FFFDF5",borderRadius:20,border:`1.5px solid ${C.border}`,
      padding:"12px",marginBottom:mb||9,boxShadow:`0 2px 8px rgba(212,149,106,0.07)`}}>
      <div style={{fontSize:10,fontWeight:700,color:C.textMid,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:8}}>{title}</div>
      {children}
    </div>
  );
}
function FLabel({children}) {
  return <div style={{fontSize:9,color:C.textMid,marginBottom:4,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700}}>{children}</div>;
}
function YStat({label,value,color=C.text}) {
  return (
    <div style={{flex:1}}>
      <div style={{fontSize:9,color:"rgba(61,43,26,0.6)",marginBottom:2,letterSpacing:"0.04em"}}>{label}</div>
      <div style={{fontSize:14,fontWeight:700,color}}>{value}</div>
    </div>
  );
}
function QStat({label,value,color=C.text}) {
  return (
    <div style={{flex:1,textAlign:"center"}}>
      <div style={{fontSize:8,color:C.textLight,marginBottom:1}}>{label}</div>
      <div style={{fontSize:11,fontWeight:700,color}}>{value}</div>
    </div>
  );
}
function YPill({label,onClick}) {
  return (
    <button onClick={onClick} style={{display:"flex",alignItems:"center",gap:3,
      background:"rgba(255,255,255,0.4)",border:`1.5px solid rgba(61,43,26,0.18)`,
      borderRadius:14,padding:"4px 9px",color:C.text,fontSize:11,fontWeight:700,cursor:"pointer"}}>
      {label}
    </button>
  );
}
function ArrowBtn({children,onClick,disabled}) {
  return (
    <button onClick={disabled?null:onClick} style={{
      background:"rgba(255,255,255,0.35)",border:"1.5px solid rgba(61,43,26,0.2)",
      borderRadius:11,width:32,height:40,color:disabled?"rgba(61,43,26,0.25)":C.text,
      fontSize:17,cursor:disabled?"default":"pointer",
      display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{children}</button>
  );
}
function YBtn({children,onClick,wide,disabled}) {
  return (
    <button onClick={disabled?null:onClick} style={{
      ...(wide?{width:"100%"}:{}),
      padding:"12px 16px",borderRadius:15,border:"none",cursor:disabled?"default":"pointer",
      background:disabled?C.bgSoft:`linear-gradient(135deg,${C.primary},${C.accent})`,
      color:disabled?C.textLight:C.text,fontSize:14,fontWeight:700,
      boxShadow:disabled?"none":`0 4px 16px rgba(245,183,49,0.38)`}}>
      {children}
    </button>
  );
}
const inpS={padding:"9px 11px",borderRadius:12,background:"#FFFDF5",border:`1.5px solid ${C.border}`,color:C.text,fontSize:13,boxSizing:"border-box",outline:"none",fontFamily:"-apple-system,sans-serif"};
const selS={...{padding:"9px 11px",borderRadius:12,background:C.bgSoft,border:`1.5px solid ${C.border}`,color:C.text,fontSize:13}};
const setBtn={width:"100%",padding:"11px 14px",borderRadius:13,border:`1.5px solid ${C.border}`,fontSize:13,fontWeight:600,color:C.text,cursor:"pointer",textAlign:"left",background:"#FFFDF5"};
