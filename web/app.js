/* =========================================================
   KPL BP Studio — application
   Single-page, dependency-free client for the local data server.
   ========================================================= */
(() => {
  'use strict';

  const ALL = 'ALL';
  const SEASONS = ['KPL2026S3', 'KPL2026S2'];
  const VIEWS = new Set(['draft', 'heroes', 'pairs', 'teams', 'source']);
  const APP_VERSION = '1.2.4';
  const GITHUB_OWNER = 'AsuraZr';
  const GITHUB_REPO = 'Honor-of-Kings-KPL-BP-Studio';
  const GITHUB_REPO_URL = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
  const UPDATE_API_URL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/releases/latest`;
  const UPDATE_FALLBACK_URL = 'https://www.bilibili.com/video/BV1bsn26NEDN/?spm_id_from=333.1387.homepage.video_card.click&vd_source=e1276fab5b80acf4751c3ea7650850a1';
  const KPL_LIVE_URL = 'https://kpl.qq.com/';

  const EN_I18N = {
    '制作者：B站@摸鱼の修酱': 'Creator: Bilibili @MoYu XiuJiang',
    '摸鱼の修酱': 'MoYu XiuJiang',
    '已锁定己方历史选用': 'Historical team picks locked',
    '当前手': 'Current turn',
    '搭档': 'Synergy',
    '图谱': 'Map',
    '数据': 'Data',
    '来源': 'Source',
    '战绩': 'Records',
    '战队': 'Team',
    '选手': 'Player',
    'KPL 官方直播': 'KPL Official Live',
    '检查更新': 'Check updates',
    '检查中…': 'Checking…',
    '已是最新': 'Up to date',
    '检查失败': 'Check failed',
    '可更新': 'Update',
    '已是最新版本': 'You are up to date',
    '发现新版本': 'Update available',
    '无法连接 GitHub 检查更新': 'Unable to check for updates',
    '暂无发布版本': 'No releases yet',
    '当前版本': 'Current version',
    '最新版本': 'Latest version',
    '打开 GitHub 仓库': 'Open GitHub repository',
    '下载更新': 'Download update',
    '查看 GitHub 发布页': 'View GitHub release',
    '如无法更新请点击此处': 'If the update fails, click here',
    'BP 工作台': 'BP Workbench',
    '英雄数据': 'Hero Data',
    '搭档图谱': 'Synergy Map',
    '战队战绩': 'Team Records',
    '数据源': 'Data Source',
    '分析赛季': 'Season',
    '2026 年度总决赛': '2026 Grand Finals',
    '2026 KPL 夏季赛': '2026 KPL Summer',
    '两赛季合计': 'Two Seasons Combined',
    '数据在线': 'Live',
    '连接数据中': 'Connecting',
    '同步中': 'Syncing',
    '同步中…': 'Syncing…',
    '数据同步': 'Data sync',
    'BP 演练室': 'BP Draft Room',
    '导入 BP': 'Import BP',
    '复制本局': 'Copy Game',
    '重置本局': 'Reset Game',
    '重置系列赛': 'Reset Series',
    '本局换边': 'Side Swap',
    '进入下一局': 'Next Game',
    '完成系列赛': 'Finish Series',
    '系列赛结束': 'Series Complete',
    '请先选择本局胜方': 'Select a winner first',
    '请选择本局胜方': 'Please select the winner',
    '本局胜方': 'Match Winner',
    '蓝方': 'Blue',
    '红方': 'Red',
    '全局 BP': 'Global BP',
    '巅峰对决': 'Peak Showdown',
    'BP 完成': 'BP Complete',
    '进行中': 'In Progress',
    '未开始': 'Not Started',
    '已完成': 'Complete',
    '本局已确认': 'Game Confirmed',
    'BP 与胜方已锁定 · 只读': 'BP and winner locked · Read-only',
    '解锁本局 BP': 'Unlock BP',
    '只读回看': 'Read-only Review',
    '返回当前': 'Back to Current',
    '回看': 'Review',
    '系列赛': 'Series',
    '小局': 'Game',
    '全部小局': 'All Games',
    '英雄池': 'Hero Pool',
    '搜索英雄…': 'Search heroes…',
    '推荐排序': 'Recommended',
    'BP 热度': 'BP Presence',
    '胜率优先': 'Win Rate',
    'Ban 率优先': 'Ban Rate',
    'Pick 率优先': 'Pick Rate',
    '全部': 'All',
    '对抗路': 'Clash Lane',
    '打野': 'Jungle',
    '中路': 'Mid Lane',
    '发育路': 'Gold Lane',
    '游走': 'Roam',
    '对抗': 'Clash',
    '发育': 'Gold',
    '已 BAN': 'Banned',
    '蓝方已选': 'Picked by Blue',
    '红方已选': 'Picked by Red',
    '己方全局已用': 'Used by your team',
    '己方曾用': 'Previously used',
    '同位置已封锁': 'Same-role locked',
    '本局已确认结束与胜方 · BP 只读': 'Game confirmed · BP read-only',
    '首轮禁用': 'First Ban Phase',
    '首轮选人': 'First Pick Phase',
    '教练席建议': 'Coach Suggestions',
    'BP 位概率': 'BP Slot Probability',
    '本赛季': 'This Season',
    '两赛季合并': 'Two Seasons',
    '同位置封锁': 'Same-role locked',
    '已封锁/已选': 'Locked/Picked',
    '封锁后剩余英雄 BP 率': 'Remaining Hero BP Rate',
    '概率': 'Probability',
    '样本': 'Sample',
    '对位': 'vs',
    '数据来源': 'Data Source',
    '数据管道': 'Data Pipeline',
    '接口与口径': 'API & Methodology',
    '使用说明': 'Usage',
    '官方接口': 'Official API',
    '重新读取快照': 'Reload Snapshot',
    '立即增量同步': 'Sync Now',
    '下载快照': 'Download Snapshot',
    '赛事数据': 'Match Data',
    '系列赛记录': 'Series Records',
    '赛后数据': 'Post-Match Data',
    '选手对位数据': 'Player Matchups',
    '战队详情': 'Team Details',
    '英雄详情': 'Hero Details',
    '最近出场': 'Recent Appearances',
    '常用英雄': 'Common Heroes',
    '常用搭档': 'Common Partners',
    '历史胜率': 'Historical Win Rate',
    '复制 BP': 'Copy BP',
    '载入 BO7 工作台': 'Load BO7 Workbench',
    '关闭': 'Close',
    '取消': 'Cancel',
    '确定': 'Confirm',
    '胜率': 'Win Rate',
    '出场': 'Games',
    '经济': 'Gold',
    '击杀': 'Kills',
    '死亡': 'Deaths',
    '助攻': 'Assists',
    '输出伤害': 'Damage Dealt',
    '承受伤害': 'Damage Taken',
    '参团率': 'Kill Participation',
    '评分': 'Rating',
    '全队': 'Team',
    '总经济': 'Total Gold',
    '比赛时间': 'Duration',
    '本局': 'Game',
    '历史 BP': 'Historical BP',
    '本赛季数据': 'This season',
    '夏季赛': 'Summer Split',
    '年度总决赛': 'Grand Finals',
    '全部英雄': 'All Heroes',
    '英雄名称': 'Hero',
    '战队': 'Team',
    '选手': 'Player',
    '禁用': 'Ban',
    '选人': 'Pick',
    '蓝色方': 'Blue Side',
    '红色方': 'Red Side',
    '胜利': 'Win',
    '失败': 'Loss',
    '暂无数据': 'No data',
    '加载中': 'Loading',
    '加载中…': 'Loading…',
    '读取中…': 'Loading…',
    '正在读取赛后数据…': 'Loading post-match data…',
    '数据加载失败': 'Failed to load data',
    '网络错误': 'Network error',
    '复制成功': 'Copied',
    '复制失败，请手动选择文本': 'Copy failed. Select the text manually.',
    '已复制': 'Copied',
    '请选择': 'Please select',
    '当前': 'Current',
    '最新': 'Latest',
    '版本': 'Version',
    '官方': 'Official',
    '汇总': 'Derived',
    '积分榜': 'Standings',
    '赛程': 'Schedule',
    '擂台赛': 'Arena',
    '突围赛': 'Play-in',
    '淘汰赛': 'Playoffs',
    '总决赛': 'Grand Final',
    '胜者组': 'Winners Bracket',
    '败者组': 'Losers Bracket',
    '冠军': 'Champion',
    '亚军': 'Runner-up',
    '待定': 'TBD',
    '已结束': 'Finished',
    '进行中': 'Live',
    '未开始': 'Upcoming',
    '比赛': 'Match',
    '日期': 'Date',
    '阶段': 'Stage',
    '比分': 'Score',
    '结果': 'Result',
    '排名': 'Rank',
    '战队名': 'Team',
    '胜/负': 'W/L',
    '净胜分': 'Net Wins',
    '积分': 'Points',
    '演练室': 'Draft Room',
    '更新': 'Updated',
    '数据截至': 'Data through',
    '来源': 'Source',
    '战绩': 'Records',
    '英雄': 'Hero',
    '位英雄': 'heroes',
    '位选手': 'players',
    '场系列赛': 'series',
    '个英雄': 'heroes',
    '全部战队': 'All Teams',
    '全部英雄': 'All Heroes',
    '当前版本': 'Current version',
    '最新版本': 'Latest version',
    '版本信息': 'Version',
    '软件版本': 'Version',
    '检查更新失败': 'Update check failed',
    '暂无可用样本': 'No samples',
    '该范围暂无此位置样本': 'No samples for this slot in this range',
    '暂无对位全局 BP 样本': 'No head-to-head Global BP samples',
    '封锁后剩余英雄': 'Remaining heroes',
    '蓝色方禁用': 'Blue Ban',
    '红色方禁用': 'Red Ban',
    '蓝色方选人': 'Blue Pick',
    '红色方选人': 'Red Pick',
    '本局进度': 'Progress',
    '模式': 'Mode',
    '蓝方': 'Blue',
    '红方': 'Red',
    '英雄BP': 'Hero BP',
    '分路': 'Role',
    '打野路': 'Jungle',
    '对抗路': 'Clash Lane',
    '中路': 'Mid Lane',
    '发育路': 'Gold Lane',
    '游走': 'Roam',
    '双方 BP 完成后选择本局胜方': 'Select the match winner after both teams finish BP',
    '全KPL（通用）': 'All KPL (generic)',
    '全局已用': 'Used globally',
    '暂无': 'None',
    '全KPL同边': 'All-KPL same-side',
    '同边全KPL': 'All-KPL same-side',
    '封锁优先级': 'Lock priority',
    '指数': 'Index',
    '阵容平均胜率': 'Lineup average win rate',
    '组合胜率': 'Duo win rate',
    '全 KPL · 所选赛季': 'All KPL · selected season',
    '组 ·': 'pairs ·',
    '本队队史 · 当前赛季': 'Team history · current season',
    '本队队史 · 两赛季': 'Team history · two seasons',
    '尚未选择英雄': 'No hero selected',
    '搭档': 'Synergy',
    '摸鱼の修酱': 'MoYu XiuJiang',
    '已锁定己方历史选用': 'Historical team picks locked',
    '当前手': 'Current turn',
    '淘汰赛赛程': 'Knockout Schedule',
    '本局全局回放': 'Full match replay',
    '晋级下一轮': 'Advance',
    '淘汰': 'Eliminated',
    '官方赛程对阵': 'Official schedule',
    '导出 CSV': 'Export CSV',
    '已登场英雄': 'Heroes Played',
    '至少': 'At least',
    '出场一次': 'one game',
    '最高 Ban 率': 'Highest Ban Rate',
    '最高 Pick 率': 'Highest Pick Rate',
    '最高胜率': 'Highest Win Rate',
    '队员视角': 'Player View',
    '仅看有登场': 'Played only',
    '同队同场': 'Same team & game',
    '条件概率': 'Conditional probability',
    '范围': 'Scope',
    '核心英雄': 'Core Hero',
    '最少同队局数': 'Min shared games',
    '排序': 'Sort',
    '综合 · 场次 + 胜率': 'Overall · games + win rate',
    '本英雄出场': 'This hero games',
    '最佳搭档': 'Best synergy',
    '按同队场次': 'By shared games',
    '组合胜率': 'Duo win rate',
    '参赛战队': 'Teams',
    '有小局记录': 'with game records',
    '记录覆盖': 'Coverage',
    '实时同步': 'Live sync',
    '榜单': 'Standings',
    '含常规赛、季后赛与决赛': 'Includes regular season, playoffs, and finals',
    '完成小局': 'games completed',
    '排行': 'Rankings',
    '支战队': 'teams',
    '场系列赛': 'series',
    '次': 'times',
    '支': 'teams'
  };
  const HERO_EN = {
    "鲁班大师": "Luban Master",
    "盾山": "Dunshan",
    "海月": "Hai Yue",
    "关羽": "Guan Yu",
    "敖隐": "Ao Yin",
    "赵云": "Zhao Yun",
    "沈梦溪": "Shen Mengxi",
    "戈娅": "Ge Ya",
    "苏烈": "Su Lie",
    "狂铁": "Kuang Tie",
    "夏洛特": "Charlotte",
    "大司命": "Da Siming",
    "杨戬": "Yang Jian",
    "武则天": "Wu Zetian",
    "钟馗": "Zhong Kui",
    "小乔": "Xiao Qiao",
    "哪吒": "Nezha",
    "少司缘": "Shao Siyuan",
    "张飞": "Zhang Fei",
    "镜": "Jing",
    "司空震": "Si Kong Zhen",
    "安琪拉": "An Qi La",
    "裴擒虎": "Pei Qin Hu",
    "马超": "Ma Chao",
    "苍": "Cang",
    "不知火舞": "Mai Shiranui",
    "元流之子(辅助)": "Yuan Liu Zhi Zi (Support)",
    "元流之子(坦克)": "Yuan Liu Zhi Zi (Tank)",
    "曹操": "Cao Cao",
    "阿古朵": "A Gu Duo",
    "百里守约": "Bai Li Shou Yue",
    "橘右京": "Ukyo Tachibana",
    "夏侯惇": "Xia Hou Dun",
    "铠": "Kai",
    "艾琳": "Ai Lin",
    "白起": "Bai Qi",
    "蒙恬": "Meng Tian",
    "公孙离": "Gong Sun Li",
    "芈月": "Mi Yue",
    "女娲": "Nuwa",
    "太乙真人": "Taiyi Zhenren",
    "云缨": "Yun Ying",
    "虞姬": "Yu Ji",
    "蚩奼": "Chi Cha",
    "张良": "Zhang Liang",
    "孙权": "Sun Quan",
    "项羽": "Xiang Yu",
    "嬴政": "Ying Zheng",
    "猪八戒": "Zhu Bajie",
    "后羿": "Hou Yi",
    "影": "Ying",
    "墨子": "Mo Zi",
    "狄仁杰": "Di Ren Jie",
    "朵莉亚": "Dolia",
    "梦奇": "Meng Qi",
    "元流之子(射手)": "Yuan Liu Zhi Zi (Marksman)",
    "姜子牙": "Jiang Ziya",
    "空空儿": "Kongkong'er",
    "莱西奥": "Laisio",
    "心魔六耳": "Xinmo Liuer",
    "吕布": "Lv Bu",
    "嫦娥": "Chang'e",
    "王昭君": "Wang Zhao Jun",
    "达摩": "Da Mo",
    "赵怀真": "Zhao Huai Zhen",
    "老夫子": "Lao Fu Zi",
    "暃": "Fei",
    "王维": "Wang Wei",
    "杨玉环": "Yang Yu Huan",
    "海诺": "Heino",
    "卢雅那": "Lu Yana",
    "大禹": "Da Yu",
    "宫本武藏": "Miyamoto Musashi",
    "西施": "Xi Shi",
    "庄周": "Zhuang Zhou",
    "弈星": "Yi Xing",
    "鲁班七号": "Luban No.7",
    "甄姬": "Zhen Ji",
    "廉颇": "Lian Po",
    "孙策": "Sun Ce",
    "牛魔": "Niu Mo",
    "东皇太一": "Donghuang Taiyi",
    "大乔": "Da Qiao",
    "娜可露露": "Nakoruru",
    "孙膑": "Sun Bin",
    "黄忠": "Huang Zhong",
    "刘备": "Liu Bei",
    "钟无艳": "Zhong Wu Yan",
    "元歌": "Yuan Ge",
    "李信": "Li Xin",
    "露娜": "Lu Na",
    "李元芳": "Li Yuan Fang",
    "孙尚香": "Sun Shang Xiang",
    "干将莫邪": "Ganjiang Moye",
    "元流之子(刺客)": "Yuan Liu Zhi Zi (Assassin)",
    "姬小满": "Ji Xiao Man",
    "马可波罗": "Marco Polo",
    "亚连": "Arli",
    "伽罗": "Ga Luo",
    "刘禅": "Liu Chan",
    "曜": "Yao",
    "蒙犽": "Meng Ya",
    "金蝉": "Jin Chan",
    "上官婉儿": "Shang Guan Wan Er",
    "云中君": "Yun Zhong Jun",
    "亚瑟": "Arthur",
    "元流之子(法师)": "Yuan Liu Zhi Zi (Mage)",
    "兰陵王": "Prince of Lanling",
    "典韦": "Dian Wei",
    "刘邦": "Liu Bang",
    "司马懿": "Si Ma Yi",
    "周瑜": "Zhou Yu",
    "妲己": "Da Ji",
    "孙悟空": "Sun Wukong",
    "扁鹊": "Bian Que",
    "明世隐": "Ming Shi Yin",
    "李白": "Li Bai",
    "桑启": "Sang Qi",
    "澜": "Lan",
    "瑶": "Yao",
    "百里玄策": "Bai Li Xuan Ce",
    "盘古": "Pangu",
    "程咬金": "Cheng Yao Jin",
    "米莱狄": "Milady",
    "花木兰": "Hua Mulan",
    "蔡文姬": "Cai Wen Ji",
    "诸葛亮": "Zhu Ge Liang",
    "貂蝉": "Diao Chan",
    "阿轲": "A Ke",
    "雅典娜": "Athena",
    "韩信": "Han Xin",
    "高渐离": "Gao Jian Li",
    "鬼谷子": "Guiguzi",
  };
  const TEAM_EN = {
    "上海EDG.M": "Shanghai EDG.M",
    "上海RNG.M": "Shanghai RNG.M",
    "佛山DRG": "Foshan DRG",
    "北京JDG": "Beijing JDG",
    "北京WB": "Beijing WB",
    "南通Hero久竞": "Nantong Hero",
    "广州TTG": "Guangzhou TTG",
    "成都AG超玩会": "Chengdu AG",
    "杭州LGD.NBW": "Hangzhou LGD.NBW",
    "武汉eStarPro": "Wuhan eStarPro",
    "济南RW侠": "Jinan RW",
    "深圳DYG": "Shenzhen DYG",
    "西安WE": "Xi'an WE",
    "重庆狼队": "Chongqing Wolves",
    "长沙TES.A": "Changsha TES.A",
    "狼队": "Wolves",
    "RW侠": "RW",
    "超玩会": "AG",
    "久竞": "Hero",
  };
  Object.assign(EN_I18N, HERO_EN, TEAM_EN);
  const EN_I18N_ENTRIES = Object.entries(EN_I18N).sort((a, b) => b[0].length - a[0].length);
  const EN_PATTERNS = [
    [/(\d+)\s*\/\s*(\d+)\s*位/g, '$1 / $2'],
    [/(\d+)\s*局系列赛/g, 'Best-of-$1 series'],
    [/第\s*(\d+)\s*\/\s*(\d+)\s*局/g, 'Game $1 / $2'],
    [/第\s*(\d+)\s*局/g, 'Game $1'],
    [/(\d+)\s*局/g, '$1 games'],
    [/载入\s*BO(\d+)\s*工作台/g, 'Load BO$1 Workbench'],
    [/全局\s*P(\d+)/g, 'Global P$1'],
    [/(\d+)\s*场系列赛/g, '$1 series'],
    [/(\d+)\s*场/g, '$1 series'],
    [/(\d+)\s*位英雄/g, '$1 heroes'],
    [/(\d+)\s*位选手/g, '$1 players']
  ];

  function translateEnglishText(value) {
    let text = String(value ?? '');
    if (!text || state.lang !== 'en') return text;
    for (const [zh, en] of EN_I18N_ENTRIES) {
      if (text.includes(zh)) text = text.split(zh).join(en);
    }
    for (const [pattern, replacement] of EN_PATTERNS) text = text.replace(pattern, replacement);
    return text;
  }

  function applyLanguage(root = document.body) {
    if (!root || state.lang !== 'en') return;
    document.documentElement.lang = 'en';
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (parent.closest('script, style, textarea, pre, code')) return NodeFilter.FILTER_REJECT;
        return node.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const translated = translateEnglishText(node.nodeValue);
      if (translated !== node.nodeValue) node.nodeValue = translated;
    }
    if (root.querySelectorAll) {
      root.querySelectorAll('[title], [placeholder], [aria-label]').forEach((element) => {
        for (const attr of ['title', 'placeholder', 'aria-label']) {
          const value = element.getAttribute(attr);
          if (!value) continue;
          const translated = translateEnglishText(value);
          if (translated !== value) element.setAttribute(attr, translated);
        }
      });
    }
  }

  function setLanguage(lang) {
    state.lang = lang === 'en' ? 'en' : 'zh';
    persistPrefs();
    window.location.reload();
  }

  function renderBrand() {
    const strong = document.querySelector('.brand-copy strong');
    const tagline = document.querySelector('.brand-tagline');
    if (state.lang === 'en') {
      if (strong) strong.innerHTML = 'KPL-BP-<em>Studio</em>';
      if (tagline) tagline.textContent = 'Honor of Kings · BP Workbench';
      document.title = 'Honor of Kings KPL-BP-Studio';
    } else {
      if (strong) strong.innerHTML = 'KPL BP <em>决策台</em>';
      if (tagline) tagline.textContent = '峡谷博弈';
      document.title = 'KPL BP 决策台 · 峡谷博弈';
    }
  }

  function renderLanguageToggle() {
    const button = $('#langToggle');
    if (!button) return;
    button.textContent = state.lang === 'en' ? '中文' : 'EN';
    button.title = state.lang === 'en' ? '切换到中文' : 'Switch to English';
    button.setAttribute('aria-label', button.title);
    document.documentElement.lang = state.lang === 'en' ? 'en' : 'zh-CN';
    renderBrand();
  }
  const BO_OPTIONS = [1, 3, 5, 7, 9];
  const ROLE_ORDER = ['对抗路', '打野', '中路', '发育路', '游走'];
  const ROLE_SHORT = { 对抗路: '对抗', 打野: '打野', 中路: '中路', 发育路: '发育', 游走: '游走' };
  const ROLE_CLASS = { 对抗路: 'role-1', 打野: 'role-2', 中路: 'role-3', 发育路: 'role-4', 游走: 'role-5' };
  const STORAGE_KEY = 'kpl-bp-studio-state-v2';

  // Standard KPL 10-ban / 10-pick sequence, matching the official BP order.
  const DRAFT_STEPS = [
    { type: 'ban', side: 'blue' },
    { type: 'ban', side: 'red' },
    { type: 'ban', side: 'blue' },
    { type: 'ban', side: 'red' },
    { type: 'pick', side: 'blue' },
    { type: 'pick', side: 'red' },
    { type: 'pick', side: 'red' },
    { type: 'pick', side: 'blue' },
    { type: 'pick', side: 'blue' },
    { type: 'pick', side: 'red' },
    { type: 'ban', side: 'red' },
    { type: 'ban', side: 'blue' },
    { type: 'ban', side: 'red' },
    { type: 'ban', side: 'blue' },
    { type: 'ban', side: 'red' },
    { type: 'ban', side: 'blue' },
    { type: 'pick', side: 'red' },
    { type: 'pick', side: 'blue' },
    { type: 'pick', side: 'blue' },
    { type: 'pick', side: 'red' }
  ];

  const ICONS = {
    refresh: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 11a8 8 0 1 0-2.3 6.7M20 4v7h-7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 4.5 4.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    undo: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 8 4 12l5 4M4 12h10a6 6 0 0 1 0 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6.5 7l.8 13h9.4l.8-13M10 11v5M14 11v5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" stroke-width="1.7"/></svg>',
    download: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 19h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    upload: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21V9m0 0-4 4m4-4 4 4M4 5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2.5c.8 5.6 3.9 8.7 9.5 9.5-5.6.8-8.7 3.9-9.5 9.5-.8-5.6-3.9-8.7-9.5-9.5 5.6-.8 8.7-3.9 9.5-9.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H4v2a3 3 0 0 0 3 3M16 6h4v2a3 3 0 0 1-3 3M12 13v4M8 20h8M9 17h6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    target: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="8" r="3" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 5.5a3 3 0 0 1 0 5.7M17.5 14.2a5.5 5.5 0 0 1 3 4.8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
    database: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><ellipse cx="12" cy="5.5" rx="7" ry="2.5" stroke="currentColor" stroke-width="1.7"/><path d="M5 5.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6M5 11.5v6c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-6" stroke="currentColor" stroke-width="1.7"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14m0 0-5-5m5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    external: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M19 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 10 4 4 4-4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    swap: '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 8h13m0 0-3-3m3 3-3 3M20 16H7m0 0 3-3m-3 3 3 3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  const state = {
    data: null,
    status: null,
    ready: false,
    loadingData: false,
    view: 'draft',
    lang: 'zh',
    season: SEASONS[0],
    heroMap: new Map(),
    yuanliuIds: new Set(),
    teamMap: new Map(),
    seriesById: new Map(),
    seriesByTeam: new Map(),
    pairCtx: new Map(),
    counterCtx: new Map(),
    teamCounterCtx: new Map(),
    teamMatchupCounterCtx: new Map(),
    teamRoleCounterCtx: new Map(),
    teamSideCtx: new Map(),
    h2hCtx: new Map(),
    heroAppearances: new Map(),
    playerHeroMap: new Map(),
    teamPlayers: new Map(),
    drafts: {},
    pair: { team: ALL, heroId: null, minGames: 1, sort: 'prob', matrixMetric: 'prob' },
    draftFilter: { q: '', role: '全部', sort: 'recommend' },
    heroTableFilter: { q: '', role: '全部', onlyPlayed: false },
    heroTableSort: { scope: 'total', metric: 'banRate', dir: 'desc' },
    heroTableTeam: ALL,
    standingsSeason: SEASONS[0],
    standingsStage: 'lts',
    teamSort: { scope: 'total', type: 'series', dir: 'desc' },
    teamModal: null,
    seriesModal: null,
    heroReturnTo: null,
    teamReturnHero: null,
    seriesReturnTeam: null,
    coachProb: null,
    reviewGameNo: null,
    seriesBattleCache: new Map(),
    heroModal: null,
    refreshing: false,
    refreshPoll: null,
    refreshStartedAt: 0,
    bootPoll: null,
    lastAction: null,
    currentRecs: [],
    lastView: null,
    pendingReload: false,
    lastDataAt: ''
  };

  /* ---------------------------------------------------------
     Generic helpers
     --------------------------------------------------------- */
  const $ = (selector, root = document) => root ? root.querySelector(selector) : null;
  const $$ = (selector, root = document) => root ? Array.from(root.querySelectorAll(selector)) : [];
  const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));

  const ESCAPE_MAP = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
  }
  function safeUrl(value) {
    const text = String(value || '');
    if (/^https?:\/\//i.test(text)) return text;
    if (/^assets\//i.test(text)) return text;
    return '';
  }
  function pct(value, digits = 1, fallback = '—') {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return fallback;
    return `${(Number(value) * 100).toFixed(digits)}%`;
  }
  function num(value, fallback = '0') {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return fallback;
    return Number(value).toLocaleString('zh-CN');
  }
  function signedPct(value, digits = 1) {
    if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
    const n = Number(value) * 100;
    return `${n >= 0 ? '+' : ''}${n.toFixed(digits)}pp`;
  }
  function record(wins, losses) {
    return `${Number(wins) || 0}-${Number(losses) || 0}`;
  }
  function rateClass(value) {
    if (value === null || value === undefined) return 'rate-mid';
    return Number(value) >= 0.5 ? 'rate-good' : 'rate-bad';
  }
  function formatStamp(value) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  function formatDateShort(value) {
    if (!value) return '—';
    return String(value).replace(/^\d{4}-/, '').slice(0, 16);
  }
  function formatDay(value) {
    if (!value) return '—';
    return String(value).slice(5, 10);
  }
  function seasonLabel(key) {
    if (key === ALL) return '两赛季合计';
    const season = state.data?.meta?.seasons?.[key];
    return season?.label || (key === 'KPL2026S3' ? '2026 年度总决赛' : '2026 KPL 夏季赛');
  }
  function seasonShort(key) {
    if (key === ALL) return '合计';
    const season = state.data?.meta?.seasons?.[key];
    return season?.short || seasonLabel(key);
  }

  function currentSeasonKey() {
    const order = state.data?.meta?.seasonOrder?.length
      ? state.data.meta.seasonOrder
      : SEASONS;
    const now = Date.now();
    for (const key of order) {
      const season = state.data?.meta?.seasons?.[key];
      const start = Date.parse(String(season?.startTime || '').replace(' ', 'T'));
      const end = Date.parse(String(season?.endTime || '').replace(' ', 'T'));
      if (Number.isFinite(start) && Number.isFinite(end) && now >= start && now <= end) {
        return key;
      }
    }
    return order[0] || SEASONS[0];
  }

  function isAll(value) {
    return value === ALL || value === 'all' || value === 'ALL';
  }
  function pairKey(a, b) {
    const left = Number(a);
    const right = Number(b);
    return left < right ? `${left}|${right}` : `${right}|${left}`;
  }
  function counterKey(a, b) {
    return `${Number(a)}|${Number(b)}`;
  }
  function roleClass(role) {
    return ROLE_CLASS[role] || '';
  }
  function roleTags(roles, limit = 2) {
    return (roles || []).slice(0, limit).map((role) =>
      `<span class="role-tag ${roleClass(role)}">${esc(role)}</span>`
    ).join('');
  }
  function heroRoles(hero) {
    return Array.isArray(hero?.roles) && hero.roles.length ? hero.roles : ['游走'];
  }

  function isYuanliuId(heroId) {
    return state.yuanliuIds.has(Number(heroId));
  }

  function hasYuanliu(heroIds) {
    return [...(heroIds || [])].some((heroId) => isYuanliuId(heroId));
  }

  function pickSlotGlobalNumber(side, slot) {
    const pickSteps = DRAFT_STEPS.filter((step) => step.type === 'pick');
    let sideSlot = 0;
    for (let index = 0; index < pickSteps.length; index += 1) {
      if (pickSteps[index].side !== side) continue;
      if (sideSlot === slot) return index + 1;
      sideSlot += 1;
    }
    return slot + 1;
  }

  function pairedPickSlots(side, slot) {
    const sidePicks = DRAFT_STEPS
      .map((step, index) => ({ ...step, index }))
      .filter((step) => step.type === 'pick' && step.side === side);
    for (let index = 0; index < sidePicks.length - 1; index += 1) {
      if (sidePicks[index + 1].index === sidePicks[index].index + 1) {
        if (slot === index || slot === index + 1) return [index, index + 1];
      }
    }
    return [slot];
  }

  function pickedRoleLocks(side, type, game) {
    if (!game || game.mode === 'peak') return new Set();
    const picks = type === 'ban'
      ? game[side === 'blue' ? 'red' : 'blue'].picks
      : game[side].picks;
    return commonRoleSet(picks);
  }

  function commonRoleSet(heroIds) {
    const roles = new Set();
    for (const heroId of heroIds || []) {
      const hero = state.heroMap.get(Number(heroId));
      if (hero) roles.add(heroRoles(hero)[0]);
    }
    return roles;
  }

  function heroStat(hero, season = state.season) {
    if (!hero) return null;
    return season === ALL ? hero.total : (hero.seasons?.[season] || null);
  }
  function teamStat(team, season = state.season) {
    if (!team) return null;
    return season === ALL ? team.total : (team.seasons?.[season] || null);
  }

  /* ---------------------------------------------------------
     Images
     --------------------------------------------------------- */
  function heroImage(hero, className = '', alt = null) {
    if (!hero) return '';
    const local = safeUrl(hero.localIcon);
    const remote = safeUrl(hero.remoteIcon);
    const src = local || remote;
    if (!src) return `<span class="${className} hero-img-fallback">${esc((hero.name || '?').slice(0, 1))}</span>`;
    const fallback = remote && remote !== src
      ? ` onerror="this.onerror=null;this.src='${esc(remote)}'"`
      : ' onerror="this.style.opacity=0"';
    return `<img class="${className}" src="${esc(src)}" alt="${esc(alt || hero.name || '')}" loading="lazy" decoding="async" referrerpolicy="no-referrer"${fallback}>`;
  }

  function teamImage(team, className = '', alt = null) {
    if (!team) return '';
    const local = team.id ? `assets/teams/${encodeURIComponent(team.id)}.png` : '';
    const remote = safeUrl(team.logo);
    const src = local || remote;
    if (!src) return `<span class="${className} team-img-fallback">${esc((team.short || team.name || '?').slice(0, 2))}</span>`;
    const fallback = remote && remote !== src
      ? ` onerror="this.onerror=null;this.src='${esc(remote)}'"`
      : ' onerror="this.style.opacity=0"';
    return `<img class="${className}" src="${esc(src)}" alt="${esc(alt || team.name || '')}" loading="lazy" decoding="async" referrerpolicy="no-referrer"${fallback}>`;
  }

  /* ---------------------------------------------------------
     Local persistence
     --------------------------------------------------------- */
  function parseHash() {
    const value = String(window.location.hash || '').replace(/^#\/?/, '').trim();
    return VIEWS.has(value) ? value : '';
  }

  function restorePrefs() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
    } catch (_) {
      saved = {};
    }
    const hashView = parseHash();
    if (hashView) state.view = hashView;
    else if (VIEWS.has(saved.view)) state.view = saved.view;
    if (saved.lang === 'en' || saved.lang === 'zh') state.lang = saved.lang;
    if (saved.season === ALL || SEASONS.includes(saved.season)) state.season = saved.season;
    if (state.season !== ALL) {
      state.standingsSeason = state.season;
      state.standingsStage = state.season === 'KPL2026S3' ? 'lts' : 'cgs';
    }
    if (saved.drafts && typeof saved.drafts === 'object') state.drafts = saved.drafts;
    if (saved.heroTableSort && typeof saved.heroTableSort === 'object') {
      state.heroTableSort = { ...state.heroTableSort, ...saved.heroTableSort };
    }
    if (saved.heroTableTeam) {
      state.heroTableTeam = saved.heroTableTeam;
    }
    if (saved.teamSort && typeof saved.teamSort === 'object') {
      state.teamSort = { ...state.teamSort, ...saved.teamSort };
    }
    if (saved.pair && typeof saved.pair === 'object') {
      state.pair = { ...state.pair, ...saved.pair };
    }
  }

  function persistPrefs() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        view: state.view,
        lang: state.lang,
        season: state.season,
        drafts: state.drafts,
        heroTableSort: state.heroTableSort,
        heroTableTeam: state.heroTableTeam,
        teamSort: state.teamSort,
        pair: { team: state.pair.team, heroId: state.pair.heroId, minGames: state.pair.minGames, sort: state.pair.sort, matrixMetric: state.pair.matrixMetric }
      }));
    } catch (_) {
      // Private mode / storage full: the app still works for this session.
    }
  }

  /* ---------------------------------------------------------
     Data loading + indexing
     --------------------------------------------------------- */
  function emptyCtx() {
    return {
      games: 0,
      heroGames: new Map(),
      heroWins: new Map(),
      pickStats: new Map(),
      banStats: new Map(),
      pairs: new Map()
    };
  }

  function getCtx(season = state.season, teamId = ALL) {
    return state.pairCtx.get(`${season}|${teamId}`) || emptyCtx();
  }

  function bumpMap(map, key, field) {
    const current = map.get(key) || { n: 0, w: 0 };
    current.n += 1;
    if (field === 1) current.w += 1;
    map.set(key, current);
  }

  function ensureCtx(season, teamId) {
    const key = `${season}|${teamId}`;
    let ctx = state.pairCtx.get(key);
    if (!ctx) {
      ctx = emptyCtx();
      state.pairCtx.set(key, ctx);
    }
    return ctx;
  }

  function buildIndexes() {
    const data = state.data;
    state.heroMap = new Map((data.heroes || []).map((hero) => [Number(hero.id), hero]));
    state.yuanliuIds = new Set(
      (data.heroes || [])
        .filter((hero) => String(hero.name || '').startsWith('元流之子'))
        .map((hero) => Number(hero.id))
    );
    state.teamMap = new Map((data.teams || []).map((team) => [String(team.id), team]));
    state.seriesById = new Map();
    state.seriesByTeam = new Map();
    state.pairCtx = new Map();
    state.counterCtx = new Map();
    state.teamCounterCtx = new Map();
    state.teamMatchupCounterCtx = new Map();
    state.teamRoleCounterCtx = new Map();
    state.teamSideCtx = new Map();
    state.h2hCtx = new Map();
    state.heroAppearances = new Map();
    state.playerHeroMap = new Map();
    state.teamPlayers = new Map();

    for (const hero of data.heroes || []) {
      hero.roles = heroRoles(hero);
      state.heroAppearances.set(Number(hero.id), []);
    }
    for (const team of data.teams || []) {
      state.seriesByTeam.set(String(team.id), []);
    }

    for (const series of data.series || []) {
      state.seriesById.set(String(series.id), series);
      for (const teamId of [String(series.t1), String(series.t2)]) {
        const list = state.seriesByTeam.get(teamId);
        if (list) list.push(series);
      }
    }
    for (const list of state.seriesByTeam.values()) {
      list.sort((a, b) => String(b.date).localeCompare(String(a.date)));
    }

    for (const battle of data.battles || []) {
      const season = battle.season;
      for (const sideIndex of [0, 1]) {
        const teamId = String(battle.t[sideIndex]);
        const opponentId = String(battle.t[1 - sideIndex]);
        const picks = battle.p[sideIndex] || [];
        const bans = battle.b[sideIndex] || [];
        const won = battle.w === sideIndex + 1;

        for (const ctxSeason of [season, ALL]) {
          for (const ctxTeam of [teamId, ALL]) {
            const ctx = ensureCtx(ctxSeason, ctxTeam);
            ctx.games += 1;
            for (const heroId of picks) {
              const id = Number(heroId);
              bumpMap(ctx.pickStats, id, won ? 1 : 0);
              ctx.heroGames.set(id, (ctx.heroGames.get(id) || 0) + 1);
              if (won) ctx.heroWins.set(id, (ctx.heroWins.get(id) || 0) + 1);
            }
            for (let i = 0; i < picks.length; i += 1) {
              for (let j = i + 1; j < picks.length; j += 1) {
                bumpMap(ctx.pairs, pairKey(picks[i], picks[j]), won ? 1 : 0);
              }
            }
            for (const heroId of bans) {
              const id = Number(heroId);
              ctx.banStats.set(id, (ctx.banStats.get(id) || 0) + 1);
            }
          }
        }

        const appearance = state.heroAppearances;
        for (const heroId of picks) {
          const id = Number(heroId);
          const list = appearance.get(id);
          if (!list) continue;
          list.push({
            season,
            battleId: battle.id,
            seriesId: battle.mid,
            date: battle.date,
            stage: battle.stage,
            teamId,
            opponentId,
            won,
            side: sideIndex + 1
          });
        }
      }

      const p1 = battle.p[0] || [];
      const p2 = battle.p[1] || [];
      const roleBySide = { 1: new Set(), 2: new Set() };
      for (const entry of battle.pl || []) {
        const sideNumber = Number(entry[0]);
        const role = String(entry[3] || '');
        if (roleBySide[sideNumber] && ROLE_ORDER.includes(role)) {
          roleBySide[sideNumber].add(role);
        }
      }
      const isPeak = !(battle.b?.[0]?.length) && !(battle.b?.[1]?.length);
      // Team-on-side history against all KPL opponents. Coach side
      // preferences use this instead of the narrow head-to-head sample.
      for (const sideIndex of [0, 1]) {
        const teamId = String(battle.t[sideIndex]);
        const sideKey = sideIndex === 0 ? 'blue' : 'red';
        for (const teamSeason of [season, ALL]) {
          const key = `${teamId}|${teamSeason}`;
          let teamSides = state.teamSideCtx.get(key);
          if (!teamSides) {
            const newSide = () => ({
              games: 0,
              globalGames: 0,
              bans: new Map(),
              picks: new Map(),
              banSlots: Array.from({ length: 5 }, () => new Map()),
              pickSlots: Array.from({ length: 5 }, () => new Map())
            });
            teamSides = { blue: newSide(), red: newSide() };
            state.teamSideCtx.set(key, teamSides);
          }
          const sideCtx = teamSides[sideKey];
          sideCtx.games += 1;
          if (!isPeak) sideCtx.globalGames += 1;
          (battle.b[sideIndex] || []).slice(0, 5).forEach((heroId, slot) => {
            const id = Number(heroId);
            if (!id || isPeak) return;
            sideCtx.bans.set(id, (sideCtx.bans.get(id) || 0) + 1);
            sideCtx.banSlots[slot].set(id, (sideCtx.banSlots[slot].get(id) || 0) + 1);
          });
          (battle.p[sideIndex] || []).slice(0, 5).forEach((heroId, slot) => {
            const id = Number(heroId);
            if (!id || isPeak) return;
            sideCtx.picks.set(id, (sideCtx.picks.get(id) || 0) + 1);
            sideCtx.pickSlots[slot].set(id, (sideCtx.pickSlots[slot].get(id) || 0) + 1);
          });
        }
      }

      // Team-scoped counter history, used by the lineup matchup metric.
      for (const sideIndex of [0, 1]) {
        const ownTeamId = String(battle.t[sideIndex]);
        const opponentTeamId = String(battle.t[1 - sideIndex]);
        const ownPicks = sideIndex === 0 ? p1 : p2;
        const enemyPicks = sideIndex === 0 ? p2 : p1;
        const ownWon = battle.w === sideIndex + 1;
        for (const teamSeason of [season, ALL]) {
          const key = `${ownTeamId}|${teamSeason}`;
          let teamCtx = state.teamCounterCtx.get(key);
          if (!teamCtx) {
            teamCtx = { pairs: new Map() };
            state.teamCounterCtx.set(key, teamCtx);
          }
          const matchupKey = `${ownTeamId}|${opponentTeamId}|${teamSeason}`;
          let matchupCtx = state.teamMatchupCounterCtx.get(matchupKey);
          if (!matchupCtx) {
            matchupCtx = { pairs: new Map() };
            state.teamMatchupCounterCtx.set(matchupKey, matchupCtx);
          }
          const roleKey = `${ownTeamId}|${opponentTeamId}|${teamSeason}`;
          let roleCtx = state.teamRoleCounterCtx.get(roleKey);
          if (!roleCtx) {
            roleCtx = { pairs: new Map() };
            state.teamRoleCounterCtx.set(roleKey, roleCtx);
          }
          const enemyRoles = roleBySide[2 - sideIndex];
          for (const ownHero of ownPicks) {
            for (const enemyHero of enemyPicks) {
              bumpMap(teamCtx.pairs, counterKey(ownHero, enemyHero), ownWon ? 1 : 0);
              bumpMap(matchupCtx.pairs, counterKey(ownHero, enemyHero), ownWon ? 1 : 0);
            }
            for (const role of enemyRoles) {
              bumpMap(roleCtx.pairs, `${Number(ownHero)}|${role}`, ownWon ? 1 : 0);
            }
          }
        }
      }
      for (const ctxSeason of [season, ALL]) {
        let ctx = state.counterCtx.get(ctxSeason);
        if (!ctx) {
          ctx = { pairs: new Map() };
          state.counterCtx.set(ctxSeason, ctx);
        }
        for (const a of p1) {
          for (const b of p2) {
            bumpMap(ctx.pairs, counterKey(a, b), battle.w === 1 ? 1 : 0);
            bumpMap(ctx.pairs, counterKey(b, a), battle.w === 2 ? 1 : 0);
          }
        }

        // Head-to-head Ban/Pick behavior for this exact pair of teams.
        const t1 = String(battle.t[0]);
        const t2 = String(battle.t[1]);
        const h2hKeyValue = h2hKey(ctxSeason, t1, t2);
        let h2h = state.h2hCtx.get(h2hKeyValue);
        if (!h2h) {
          h2h = {
            games: 0,
            teams: {},
            // Per-team side splits: the same pair of teams can meet with A on
            // blue in one series and A on red in another. Coach data must not
            // combine those two samples.
            byTeamSide: {}
          };
          state.h2hCtx.set(h2hKeyValue, h2h);
        }
        h2h.games += 1;
        for (const sideIndex of [0, 1]) {
          const sideKey = sideIndex === 0 ? 'blue' : 'red';
          const sideTeamId = String(battle.t[sideIndex]);
          h2h.byTeamSide[sideTeamId] ||= {
            blue: { games: 0, globalGames: 0, teams: {} },
            red: { games: 0, globalGames: 0, teams: {} }
          };
          const sideCtx = h2h.byTeamSide[sideTeamId][sideKey];
          sideCtx.games += 1;
          if (!isPeak) sideCtx.globalGames += 1;
          sideCtx.banSlots ||= {};
          sideCtx.pickSlots ||= {};
          sideCtx.byGame ||= {};
          const gameNo = Math.max(1, Math.min(9, Number(battle.seq) || 0));
          let gameCtx = null;
          if (gameNo) {
            gameCtx = sideCtx.byGame[gameNo] ||= { games: 0, globalGames: 0, banSlots: {}, pickSlots: {} };
            gameCtx.games += 1;
            if (!isPeak) gameCtx.globalGames += 1;
          }

          // Total matchup context: each team contributes its own side once.
          if (!h2h.teams[sideTeamId]) h2h.teams[sideTeamId] = { bans: new Map(), picks: new Map() };
          const totalTeam = h2h.teams[sideTeamId];
          for (const heroId of battle.p[sideIndex] || []) {
            const id = Number(heroId);
            totalTeam.picks.set(id, (totalTeam.picks.get(id) || 0) + 1);
          }
          for (const heroId of battle.b[sideIndex] || []) {
            const id = Number(heroId);
            totalTeam.bans.set(id, (totalTeam.bans.get(id) || 0) + 1);
          }

          // Side context: both teams' BP from games where sideTeamId played
          // this side. This is what the blue/red coach split reads.
          for (const dataSide of [0, 1]) {
            const teamId = String(battle.t[dataSide]);
            if (!sideCtx.teams[teamId]) sideCtx.teams[teamId] = { bans: new Map(), picks: new Map() };
            const teamH2H = sideCtx.teams[teamId];
            if (!isPeak) {
              if (!sideCtx.banSlots[teamId]) sideCtx.banSlots[teamId] = Array.from({ length: 5 }, () => new Map());
              if (!sideCtx.pickSlots[teamId]) sideCtx.pickSlots[teamId] = Array.from({ length: 5 }, () => new Map());
            }
            const banSlots = sideCtx.banSlots[teamId];
            const pickSlots = sideCtx.pickSlots[teamId];
            (battle.p[dataSide] || []).slice(0, 5).forEach((heroId, slot) => {
              const id = Number(heroId);
              if (!isPeak) teamH2H.picks.set(id, (teamH2H.picks.get(id) || 0) + 1);
              if (!isPeak) pickSlots[slot].set(id, (pickSlots[slot].get(id) || 0) + 1);
            });
            (battle.b[dataSide] || []).slice(0, 5).forEach((heroId, slot) => {
              const id = Number(heroId);
              if (!isPeak) teamH2H.bans.set(id, (teamH2H.bans.get(id) || 0) + 1);
              if (!isPeak) banSlots[slot].set(id, (banSlots[slot].get(id) || 0) + 1);
            });
            if (!isPeak && gameCtx) {
              gameCtx.banSlots[teamId] ||= Array.from({ length: 5 }, () => new Map());
              gameCtx.pickSlots[teamId] ||= Array.from({ length: 5 }, () => new Map());
              (battle.p[dataSide] || []).slice(0, 5).forEach((heroId, slot) => {
                const id = Number(heroId);
                if (id) gameCtx.pickSlots[teamId][slot].set(id, (gameCtx.pickSlots[teamId][slot].get(id) || 0) + 1);
              });
              (battle.b[dataSide] || []).slice(0, 5).forEach((heroId, slot) => {
                const id = Number(heroId);
                if (id) gameCtx.banSlots[teamId][slot].set(id, (gameCtx.banSlots[teamId][slot].get(id) || 0) + 1);
              });
            }
          }
        }
      }
    }

    for (const list of state.heroAppearances.values()) {
      list.sort((a, b) => String(b.date).localeCompare(String(a.date)) || String(b.battleId).localeCompare(String(a.battleId)));
    }
    for (const hero of data.heroes || []) {
      if (!hero.seasons) hero.seasons = {};
      for (const season of SEASONS) {
        if (!hero.seasons[season]) {
          hero.seasons[season] = { bans: 0, banRate: 0, picks: 0, pickRate: 0, wins: 0, losses: 0, winRate: null };
        }
      }
    }

    for (const row of data.playerHeroes || []) {
      const teamId = String(row.teamId);
      const heroId = Number(row.heroId);
      const key = `${teamId}|${heroId}`;
      if (!state.playerHeroMap.has(key)) state.playerHeroMap.set(key, []);
      state.playerHeroMap.get(key).push(row);
      if (!state.teamPlayers.has(teamId)) state.teamPlayers.set(teamId, new Map());
      const teamMap = state.teamPlayers.get(teamId);
      if (!teamMap.has(row.playerName)) {
        teamMap.set(row.playerName, { name: row.playerName, position: row.position || '' });
      }
    }
    for (const list of state.playerHeroMap.values()) {
      list.sort((a, b) => (b.total?.games || 0) - (a.total?.games || 0) || a.playerName.localeCompare(b.playerName, 'zh-CN'));
    }
  }

  function playersForHero(teamId, heroId) {
    if (!teamId || teamId === ALL) return [];
    return state.playerHeroMap.get(`${String(teamId)}|${Number(heroId)}`) || [];
  }

  function teamPlayersList(teamId) {
    if (!teamId || teamId === ALL) return [];
    return [...(state.teamPlayers.get(String(teamId))?.values() || [])]
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
  }

  function h2hKey(season, teamA, teamB) {
    const pair = [String(teamA), String(teamB)].sort();
    return `${season}|${pair[0]}|${pair[1]}`;
  }

  function getH2H(season, teamA, teamB) {
    if (!teamA || !teamB || teamA === ALL || teamB === ALL) return null;
    return state.h2hCtx.get(h2hKey(season, teamA, teamB)) || null;
  }

  function getMatchupH2H(season, teamA, teamB, side) {
    const current = getH2H(season, teamA, teamB);
    const currentSide = current?.byTeamSide?.[String(teamA)]?.[side] || null;
    const currentSideGames = currentSide?.games || 0;
    // Compare only the same side of the matchup. If the current season's
    // sample is thin, fall back to the same side across both seasons.
    if (currentSideGames >= 5) {
      return {
        ctx: currentSide,
        scope: season === ALL ? '两赛季' : '本赛季',
        sideGames: currentSideGames
      };
    }
    const combined = getH2H(ALL, teamA, teamB);
    const combinedSide = combined?.byTeamSide?.[String(teamA)]?.[side] || null;
    const combinedSideGames = combinedSide?.games || 0;
    if (combinedSideGames) {
      return { ctx: combinedSide, scope: '两赛季', sideGames: combinedSideGames };
    }
    if (currentSideGames) {
      return {
        ctx: currentSide,
        scope: season === ALL ? '两赛季' : '本赛季',
        sideGames: currentSideGames
      };
    }
    return { ctx: null, scope: '', sideGames: 0 };
  }

  function getTeamSide(season, teamId, side) {
    if (!teamId || teamId === ALL || !['blue', 'red'].includes(side)) return null;
    const scope = season === ALL ? ALL : season;
    return state.teamSideCtx.get(`${String(teamId)}|${scope}`)?.[side] || null;
  }

  function getTeamSideScope(season, teamId, side) {
    const current = getTeamSide(season, teamId, side);
    if (current?.globalGames) {
      return {
        ctx: current,
        scope: season === ALL ? '两赛季' : '本赛季',
        games: current.globalGames
      };
    }
    const combined = getTeamSide(ALL, teamId, side);
    if (combined?.globalGames) {
      return { ctx: combined, scope: '两赛季', games: combined.globalGames };
    }
    return { ctx: null, scope: '', games: 0 };
  }

  function teamSideBehavior(ctx, heroId) {
    if (!ctx?.globalGames) return null;
    return {
      games: ctx.globalGames,
      banRate: (ctx.bans.get(Number(heroId)) || 0) / ctx.globalGames,
      pickRate: (ctx.picks.get(Number(heroId)) || 0) / ctx.globalGames
    };
  }

  function teamSideSlotScore(ctx, type, slotIndex, heroId) {
    const maps = type === 'ban' ? ctx?.banSlots : ctx?.pickSlots;
    const denom = ctx?.globalGames || 0;
    if (!maps || !denom) return null;
    const id = Number(heroId);
    const exact = (maps[slotIndex]?.get(id) || 0) / denom;
    let weighted = 0;
    let weightSum = 0;
    for (let slot = 0; slot < 5; slot += 1) {
      const weight = 1 - slot * 0.15;
      weighted += ((maps[slot]?.get(id) || 0) / denom) * weight;
      weightSum += weight;
    }
    const frequency = exact * 0.65 + (weighted / weightSum) * 0.35;
    return {
      exact,
      frequency,
      slotIndex,
      score: clamp(frequency / 0.30, 0, 1)
    };
  }

  function getH2HSideCtx(season, teamId, opponentId, side) {
    if (!teamId || !opponentId || teamId === ALL || opponentId === ALL) return null;
    const h2h = getH2H(season, teamId, opponentId);
    return h2h?.byTeamSide?.[String(teamId)]?.[side] || null;
  }

  function getH2HGameCtx(season, teamId, opponentId, side, gameNo) {
    const sideCtx = getH2HSideCtx(season, teamId, opponentId, side);
    if (!sideCtx?.byGame) return null;
    return sideCtx.byGame[Number(gameNo)] || null;
  }

  function h2hBehavior(h2h, teamId, heroId) {
    if (!h2h || !h2h.games) return null;
    const row = h2h.teams[String(teamId)];
    if (!row) return null;
    return {
      games: h2h.games,
      banRate: (row.bans.get(Number(heroId)) || 0) / h2h.games,
      pickRate: (row.picks.get(Number(heroId)) || 0) / h2h.games
    };
  }

  function h2hSlotScore(h2h, teamId, type, slotIndex, heroId) {
    const maps = (type === 'ban' ? h2h?.banSlots : h2h?.pickSlots)?.[String(teamId)];
    if (!maps || !h2h?.games) return null;
    const denom = h2h.games;
    const id = Number(heroId);
    const exact = (maps[slotIndex]?.get(id) || 0) / denom;
    let weighted = 0;
    let weightSum = 0;
    for (let slot = 0; slot < 5; slot += 1) {
      // Earlier slots (B1/P1) carry more weight than late flexible slots.
      const weight = 1 - slot * 0.15;
      weighted += ((maps[slot]?.get(id) || 0) / denom) * weight;
      weightSum += weight;
    }
    const frequency = exact * 0.65 + (weighted / weightSum) * 0.35;
    return {
      exact,
      frequency,
      slotIndex,
      score: clamp(frequency / 0.30, 0, 1)
    };
  }

  function getCounter(season, a, b) {
    const ctx = state.counterCtx.get(season === ALL ? ALL : season);
    return ctx?.pairs?.get(counterKey(a, b)) || { n: 0, w: 0 };
  }

  function getTeamCounter(teamId, a, b, season = ALL) {
    if (!teamId || teamId === ALL) return { n: 0, w: 0 };
    const ctx = state.teamCounterCtx.get(`${String(teamId)}|${season === ALL ? ALL : season}`);
    return ctx?.pairs?.get(counterKey(a, b)) || { n: 0, w: 0 };
  }

  function getTeamMatchupCounter(teamId, opponentId, a, b, season = ALL) {
    if (!teamId || teamId === ALL || !opponentId || opponentId === ALL) {
      return { n: 0, w: 0 };
    }
    const scope = season === ALL ? ALL : season;
    const ctx = state.teamMatchupCounterCtx.get(`${String(teamId)}|${String(opponentId)}|${scope}`);
    return ctx?.pairs?.get(counterKey(a, b)) || { n: 0, w: 0 };
  }

  function getTeamRoleCounter(teamId, opponentId, heroId, role, season = ALL) {
    if (!teamId || teamId === ALL || !opponentId || opponentId === ALL) {
      return { n: 0, w: 0 };
    }
    const scope = season === ALL ? ALL : season;
    const ctx = state.teamRoleCounterCtx.get(`${String(teamId)}|${String(opponentId)}|${scope}`);
    return ctx?.pairs?.get(`${Number(heroId)}|${role}`) || { n: 0, w: 0 };
  }

  async function fetchStatus() {
    const response = await fetch('/api/status', { cache: 'no-store' });
    if (!response.ok) throw new Error(`status ${response.status}`);
    return response.json();
  }

  async function loadData(options = {}) {
    if (state.loadingData) return;
    state.loadingData = true;
    const previousAt = state.data?.meta?.generatedAt || '';
    try {
      const response = await fetch('/api/data', { cache: 'no-store' });
      if (response.status === 503) {
        const payload = await response.json().catch(() => ({}));
        state.status = payload.status || state.status;
        state.ready = false;
        renderBoot();
        startBootPoll();
        updateChrome();
        return;
      }
      if (!response.ok) throw new Error(`数据接口 ${response.status}`);
      const payload = await response.json();
      if (!payload || !Array.isArray(payload.heroes) || !payload.meta) {
        throw new Error('数据快照格式异常');
      }
      const changed = Boolean(previousAt && previousAt !== payload.meta.generatedAt);
      state.data = payload;
      state.lastDataAt = payload.meta.generatedAt || '';
      buildIndexes();
      state.ready = true;
      stopBootPoll();
      ensureDrafts();
      ensurePairDefaults();
      updateChrome();
      render();
      if (options.silent && changed) {
        toast(`官方数据已更新 · ${formatStamp(payload.meta.generatedAt)}`, 'success');
      }
    } catch (error) {
      console.error(error);
      if (state.data) {
        toast(`数据刷新失败：${error.message || error}`, 'error', 5000);
      } else {
        renderError(error.message || String(error));
      }
    } finally {
      state.loadingData = false;
    }
  }

  function startBootPoll() {
    if (state.bootPoll) return;
    state.bootPoll = window.setInterval(async () => {
      try {
        const status = await fetchStatus();
        state.status = status;
        updateChrome();
        if (!state.data && status.state === 'error') {
          renderBoot();
          return;
        }
        updateBootUI();
        if (status?.snapshot?.generatedAt) {
          await loadData({ silent: true });
        }
      } catch (_) {
        // Keep the boot screen alive; the user can also retry manually.
      }
    }, 2200);
  }

  function stopBootPoll() {
    if (state.bootPoll) {
      window.clearInterval(state.bootPoll);
      state.bootPoll = null;
    }
  }

  function startBootProgress() {
    const status = state.status;
    if (!status) return;
    const pctWidth = status.total ? Math.min(96, Math.max(8, (Number(status.progress) / Number(status.total)) * 100)) : null;
    const message = status.message || '正在同步官方赛事数据…';
    const messageEl = $('#bootMessage');
    if (messageEl) messageEl.textContent = message;
    const bar = $('#bootProgressBar');
    if (bar && pctWidth !== null) {
      bar.style.animation = 'none';
      bar.style.width = `${pctWidth}%`;
      bar.style.transform = 'none';
    }
  }

  /* ---------------------------------------------------------
     Draft persistence / defaults
     --------------------------------------------------------- */
  function defaultTeamPair(season) {
    const namePair = season === 'KPL2026S3'
      ? ['KSG', '广州TTG']
      : ['广州TTG', '重庆狼队'];
    const find = (name) => (state.data?.teams || []).find((team) => team.name === name);
    const blue = find(namePair[0]) || state.data?.teams?.[0];
    const red = find(namePair[1]) || state.data?.teams?.[1] || blue;
    return {
      blue: String(blue?.id || ALL),
      red: String(red?.id || ALL)
    };
  }

  function isPeakGame(bo, gameNo) {
    return (Number(bo) === 7 || Number(bo) === 9) && Number(gameNo) === Number(bo);
  }

  function createGame(gameNo, bo) {
    return {
      no: Number(gameNo),
      mode: isPeakGame(bo, gameNo) ? 'peak' : 'standard',
      step: 0,
      swapSides: false,
      blue: { bans: Array(5).fill(null), picks: Array(5).fill(null) },
      red: { bans: Array(5).fill(null), picks: Array(5).fill(null) },
      actions: [],
      winner: null,
      complete: false
    };
  }

  function createSeries(season, bo = 7, teams = null) {
    const defaults = teams || defaultTeamPair(season);
    const size = [1, 3, 5, 7, 9].includes(Number(bo)) ? Number(bo) : 7;
    return {
      season,
      bo: size,
      blueTeam: String(defaults.blue),
      redTeam: String(defaults.red),
      currentGame: 1,
      peakActiveSide: 'blue',
      complete: false,
      games: Array.from({ length: size }, (_, index) => createGame(index + 1, size))
    };
  }

  function gameTeamId(series, game, side) {
    if (!game?.swapSides) {
      return side === 'blue' ? String(series.blueTeam) : String(series.redTeam);
    }
    return side === 'blue' ? String(series.redTeam) : String(series.blueTeam);
  }

  function gameTeams(series, game) {
    return {
      blue: gameTeamId(series, game, 'blue'),
      red: gameTeamId(series, game, 'red')
    };
  }

  function seriesScore(series) {
    const score = {};
    score[String(series.blueTeam)] = 0;
    score[String(series.redTeam)] = 0;
    for (const game of series.games) {
      if (!game.winner) continue;
      score[String(game.winner)] = (score[String(game.winner)] || 0) + 1;
    }
    return score;
  }

  function seriesWinner(series) {
    const need = Math.ceil(series.bo / 2);
    const score = seriesScore(series);
    if ((score[String(series.blueTeam)] || 0) >= need) return String(series.blueTeam);
    if ((score[String(series.redTeam)] || 0) >= need) return String(series.redTeam);
    return null;
  }

  function seriesTeamLabel(series, teamId) {
    return String(teamId) === ALL ? '全KPL' : teamName(teamId);
  }

  function normalizeGame(input, gameNo, bo) {
    const game = createGame(gameNo, bo);
    if (!input || typeof input !== 'object') return game;
    game.swapSides = Boolean(input.swapSides);
    game.complete = Boolean(input.complete);
    game.winner = input.winner ? String(input.winner) : null;
    const actions = Array.isArray(input.actions) ? input.actions : [];
    const used = new Set();
    for (const action of actions) {
      if (!action || !['ban', 'pick'].includes(action.type) || !['blue', 'red'].includes(action.side)) break;
      if (game.mode === 'peak' && action.type !== 'pick') break;
      const heroId = Number(action.heroId);
      if (!state.heroMap.has(heroId)) break;
      const side = game[action.side];
      if (game.mode === 'peak') {
        if (side.picks.includes(heroId)) break;
      } else if (used.has(heroId)) {
        break;
      }
      const slots = action.type === 'ban' ? side.bans : side.picks;
      let slot = Number(action.slot);
      if (!Number.isInteger(slot) || slot < 0 || slot > 4 || slots[slot] !== null) {
        slot = slots.findIndex((item) => item === null);
      }
      if (slot < 0) break;
      slots[slot] = heroId;
      if (game.mode !== 'peak') used.add(heroId);
      game.actions.push({ type: action.type, side: action.side, heroId, slot });
    }
    // Peak games can legally contain the same hero on both sides, but each
    // side still needs five distinct heroes.
    game.step = game.mode === 'peak' ? game.actions.length : Math.min(20, game.actions.length);
    return game;
  }

  function normalizeSeries(input, season) {
    if (!input || typeof input !== 'object') return createSeries(season);
    // Migrate a v2 single-game draft if it happens to be present.
    if (!Array.isArray(input.games) && input.blue && input.red) {
      const legacy = createSeries(season, 1, {
        blue: input.blueTeam || defaultTeamPair(season).blue,
        red: input.redTeam || defaultTeamPair(season).red
      });
      legacy.games[0] = normalizeGame(input, 1, 1);
      return legacy;
    }
    const bo = [1, 3, 5, 7, 9].includes(Number(input.bo)) ? Number(input.bo) : 7;
    const series = createSeries(season, bo, {
      blue: input.blueTeam || defaultTeamPair(season).blue,
      red: input.redTeam || defaultTeamPair(season).red
    });
    const validTeam = (id) => id === ALL || state.teamMap.has(String(id));
    if (validTeam(input.blueTeam)) series.blueTeam = String(input.blueTeam);
    if (validTeam(input.redTeam)) series.redTeam = String(input.redTeam);
    series.currentGame = Math.min(bo, Math.max(1, Math.round(Number(input.currentGame) || 1)));
    series.peakActiveSide = input.peakActiveSide === 'red' ? 'red' : 'blue';
    for (let index = 0; index < bo; index += 1) {
      series.games[index] = normalizeGame(input.games?.[index], index + 1, bo);
    }
    series.complete = Boolean(input.complete || seriesWinner(series));
    return series;
  }

  function ensureDrafts() {
    for (const season of [...SEASONS, ALL]) {
      state.drafts[season] = normalizeSeries(state.drafts[season], season);
    }
  }

  function getSeries() {
    const season = state.season;
    if (!state.drafts[season]) state.drafts[season] = createSeries(season);
    return state.drafts[season];
  }

  function getGame() {
    const series = getSeries();
    return series.games[Math.min(Math.max(series.currentGame, 1), series.games.length) - 1];
  }

  function isReviewingDraft() {
    const series = getSeries();
    return Number.isInteger(state.reviewGameNo)
      && state.reviewGameNo !== series.currentGame
      && Boolean(series.games[state.reviewGameNo - 1]);
  }

  function getViewGame() {
    const series = getSeries();
    return isReviewingDraft() ? series.games[state.reviewGameNo - 1] : getGame();
  }

  function canEditCurrentGame() {
    const series = getSeries();
    const game = getGame();
    return !isReviewingDraft() && !series.complete && !game.winner;
  }

  // Compatibility view for the many single-game DOM helpers.
  function getDraft() {
    const series = getSeries();
    const game = getViewGame();
    const draft = {
      ...game,
      season: series.season,
      bo: series.bo,
      blueTeam: series.blueTeam,
      redTeam: series.redTeam,
      currentGame: series.currentGame,
      viewGameNo: game.no,
      reviewing: isReviewingDraft(),
      series,
      game
    };
    Object.defineProperty(draft, 'step', {
      get() { return game.step; },
      set(value) { game.step = Number(value); }
    });
    return draft;
  }

  function gameIsComplete(game) {
    if (!game) return false;
    if (game.mode === 'peak') {
      return game.blue.picks.filter(Boolean).length === 5 && game.red.picks.filter(Boolean).length === 5;
    }
    return game.step >= DRAFT_STEPS.length
      && game.blue.bans.every(Boolean)
      && game.red.bans.every(Boolean)
      && game.blue.picks.every(Boolean)
      && game.red.picks.every(Boolean);
  }

  function currentAction(draft = getDraft()) {
    if (!draft) return null;
    if (draft.mode === 'peak' || draft.game?.mode === 'peak') {
      const series = getSeries();
      const game = getGame();
      if (gameIsComplete(game)) return null;
      return { type: 'pick', side: series.peakActiveSide, peak: true, index: null };
    }
    if (draft.step < 0 || draft.step >= DRAFT_STEPS.length) return null;
    return { ...DRAFT_STEPS[draft.step], index: draft.step };
  }

  function priorPicksForTeam(series, teamId, beforeGameNo) {
    const used = new Set();
    for (const game of series.games) {
      if (game.no >= beforeGameNo) continue;
      for (const side of ['blue', 'red']) {
        if (gameTeamId(series, game, side) !== String(teamId)) continue;
        for (const heroId of game[side].picks || []) {
          if (heroId) used.add(Number(heroId));
        }
      }
    }
    return used;
  }

  function priorPicks(series, side, beforeGameNo) {
    const game = series.games.find((item) => item.no === beforeGameNo) || getGame();
    return priorPicksForTeam(series, gameTeamId(series, game, side), beforeGameNo);
  }

  function seriesHasActions(series = getSeries()) {
    return series.games.some((game) => game.actions.length > 0);
  }

  function seriesCounts(series = getSeries()) {
    const total = series.games.length;
    const complete = series.games.filter((game) => gameIsComplete(game)).length;
    return { total, complete };
  }

  function saveDrafts() {
    persistPrefs();
  }

  /* ---------------------------------------------------------
     Pair defaults + context helpers
     --------------------------------------------------------- */
  function topPresenceHeroes(season = state.season, teamId = ALL, minPicks = 0) {
    return [...(state.data?.heroes || [])]
      .map((hero) => {
        const stats = heroStat(hero, season) || {};
        return { hero, score: (stats.banRate || 0) + (stats.pickRate || 0), picks: stats.picks || 0 };
      })
      .filter((row) => row.picks >= minPicks)
      .sort((a, b) => b.score - a.score || b.picks - a.picks)
      .map((row) => row.hero);
  }

  function ensurePairDefaults() {
    if (!state.data) return;
    if (!['prob', 'win', 'games'].includes(state.pair.matrixMetric)) {
      state.pair.matrixMetric = 'prob';
    }
    const teamsWithData = (state.data.teams || []).filter((team) => {
      const stats = teamStat(team, state.season);
      return stats && stats.games.played > 0;
    }).map((team) => String(team.id));
    if (state.pair.team !== ALL && !teamsWithData.includes(String(state.pair.team))) {
      state.pair.team = ALL;
    }
    const ctx = getCtx(state.season, state.pair.team);
    if (!state.pair.heroId || !state.heroMap.has(Number(state.pair.heroId))) {
      const ranked = [...ctx.heroGames.entries()].sort((a, b) => b[1] - a[1]);
      state.pair.heroId = ranked.length ? Number(ranked[0][0]) : Number(topPresenceHeroes()[0]?.id) || null;
    }
  }

  /* ---------------------------------------------------------
     Status / chrome
     --------------------------------------------------------- */
  function updateSeasonTabs() {
    $$('#seasonTabs button').forEach((button) => {
      const active = button.dataset.season === state.season;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function updateNav() {
    $$('#mainNav .nav-tab').forEach((button) => {
      const active = button.dataset.view === state.view;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }

  function updateChrome() {
    updateNav();
    updateSeasonTabs();
    const meta = state.data?.meta;
    const status = state.status || {};
    const running = state.refreshing || status.syncRunning || status.state === 'running';
    const error = status.state === 'error';
    const statusText = $('#statusText');
    const statusTime = $('#statusTime');
    const dot = $('#statusDot');
    const refreshBtn = $('#refreshBtn');
    const dataThrough = $('#dataThrough');
    const progress = $('#syncProgress');
    const progressBar = $('#syncProgressBar');
    const progressText = $('#syncProgressText');

    if (statusText) {
      if (running) {
        const value = status.state === 'running' && status.total
          ? Math.min(99, Math.round((Number(status.progress || 0) / Number(status.total)) * 100))
          : 0;
        statusText.textContent = `同步中${value ? ` ${value}%` : ''}`;
      } else if (error) {
        statusText.textContent = '同步异常';
      } else if (meta) {
        statusText.textContent = '数据在线';
      } else {
        statusText.textContent = '连接数据中';
      }
    }
    if (statusTime) {
      const stamp = meta?.generatedAt || status.finishedAt;
      statusTime.textContent = stamp ? `更新 ${formatStamp(stamp)}` : '等待同步';
    }
    if (dot) {
      dot.classList.toggle('is-syncing', Boolean(running));
      dot.classList.toggle('is-error', Boolean(error && !running));
    }
    if (refreshBtn) {
      refreshBtn.classList.toggle('is-spinning', Boolean(running));
      refreshBtn.disabled = Boolean(running);
      refreshBtn.setAttribute('aria-label', running ? '正在同步官方数据' : '立即同步官方数据');
    }
    const sourceSyncBtn = $('#sourceSyncBtn');
    if (sourceSyncBtn) {
      sourceSyncBtn.disabled = Boolean(running);
      sourceSyncBtn.innerHTML = running ? `${ICONS.refresh} 同步中…` : `${ICONS.refresh} 立即增量同步`;
    }
    const sourceStatusMsg = $('#sourceStatusMsg');
    if (sourceStatusMsg) {
      const sourceStatusMeta = $('#sourceStatusMeta');
      const sourceStatusOrb = $('#sourceStatusOrb');
      const sourceStatusPanel = $('#sourceStatusPanel');
      const activelyRunning = status.state === 'running';
      const message = running
        ? (activelyRunning ? (status.message || '正在同步官方赛事数据…') : '正在启动增量同步…')
        : error
          ? (status.message || '同步失败')
          : (meta ? '数据已就绪' : '等待同步');
      sourceStatusMsg.textContent = message;
      if (sourceStatusMeta) {
        sourceStatusMeta.textContent = running && activelyRunning && status.total
          ? `进度 ${num(status.progress)} / ${num(status.total)} · 自动同步每 ${num(status.autoSyncSeconds || 180)} 秒`
          : `最后生成 ${formatStamp(meta?.generatedAt)} · 自动同步每 ${num(status.autoSyncSeconds || 180)} 秒`;
      }
      if (sourceStatusOrb) {
        sourceStatusOrb.className = `status-orb ${running ? 'is-syncing' : error ? 'is-error' : ''}`;
        sourceStatusOrb.innerHTML = error ? ICONS.close : running ? ICONS.refresh : ICONS.check;
      }
      if (sourceStatusPanel) {
        sourceStatusPanel.className = `status-big ${running ? 'is-syncing' : error ? 'is-error' : ''}`;
      }
    }
    if (dataThrough) {
      if (meta) {
        dataThrough.textContent = `数据截至 ${formatDateShort(meta.dataThrough)} · ${num(meta.totalSeries)} 场 / ${num(meta.totalBattles)} 局`;
      } else {
        dataThrough.textContent = status.message || '等待官方数据…';
      }
    }
    if (progress && progressBar && progressText) {
      if (running) {
        progress.hidden = false;
        const total = status.state === 'running' ? Number(status.total || 0) : 0;
        const done = status.state === 'running' ? Number(status.progress || 0) : 0;
        const width = total ? clamp(done / total, 0.06, 0.98) * 100 : 28;
        progressBar.style.width = `${width}%`;
        progressText.textContent = total
          ? (status.message || '同步中')
          : '正在启动增量同步…';
      } else {
        progress.hidden = true;
      }
    }
    applyLanguage(document.body);
    renderLanguageToggle();
  }

  /* ---------------------------------------------------------
     Boot / error screens
     --------------------------------------------------------- */
  function renderBoot() {
    const app = $('#app');
    if (!app) return;
    const status = state.status || {};
    const failed = status.state === 'error';
    app.innerHTML = `
      <section class="boot-screen">
        <div class="boot-mark">KPL<span>BP</span></div>
        <div class="boot-loader"><i></i><i></i><i></i></div>
        <h1>${failed ? '数据同步遇到问题' : '正在接入官方赛事数据'}</h1>
        <p id="bootMessage">${esc(status.message || '读取英雄池、战队战绩与 BP 记录…')}</p>
        <div class="boot-progress"><span id="bootProgressBar"></span></div>
        <small>数据来自腾讯王者荣耀官方赛事中台 · 与王者营地赛事数据同源</small>
        ${failed ? '<button class="btn primary" id="retryBoot" type="button" style="margin-top:18px">重新尝试</button>' : ''}
      </section>`;
    const retry = $('#retryBoot');
    if (retry) {
      retry.addEventListener('click', () => {
        startSyncRequest(false).catch(() => null);
      });
    }
    startBootProgress();
  }

  function updateBootUI() {
    const status = state.status || {};
    const message = $('#bootMessage');
    if (message) message.textContent = status.message || '读取英雄池、战队战绩与 BP 记录…';
    startBootProgress();
  }

  function renderError(message) {
    const app = $('#app');
    if (!app) return;
    app.innerHTML = `
      <section class="panel error-panel">
        <div class="eyebrow">CONNECTION ERROR</div>
        <h2>暂时读不到数据</h2>
        <p>${esc(message)}</p>
        <p>请确认本地数据服务仍在运行，或稍后重试。</p>
        <button class="btn primary" id="retryLoad" type="button">重新读取</button>
      </section>`;
    $('#retryLoad')?.addEventListener('click', () => loadData());
  }

  /* ---------------------------------------------------------
     Toast / clipboard
     --------------------------------------------------------- */
  function toast(message, type = 'info', duration = 3200) {
    const stack = $('#toastStack');
    if (!stack) return;
    const node = document.createElement('div');
    node.className = `toast ${type}`;
    node.textContent = translateEnglishText(message);
    stack.appendChild(node);
    requestAnimationFrame(() => node.classList.add('show'));
    window.setTimeout(() => {
      node.classList.remove('show');
      window.setTimeout(() => node.remove(), 260);
    }, duration);
  }

  function announce(message) {
    const live = $('#liveRegion');
    if (live) live.textContent = message;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        const ok = document.execCommand('copy');
        textarea.remove();
        return ok;
      } catch (__) {
        return false;
      }
    }
  }

  /* ---------------------------------------------------------
     Refresh / polling
     --------------------------------------------------------- */
  async function startSyncRequest(force = false) {
    if (state.refreshing) {
      toast('已有同步任务正在进行');
      return;
    }
    const response = await fetch(`/api/refresh${force ? '?full=1' : ''}`, { method: 'POST' });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok || payload.ok === false) {
      toast(payload.message || '无法启动同步', 'error');
      if (payload.status) {
        state.status = payload.status;
        updateChrome();
      }
      return;
    }
    state.status = payload.status || state.status;
    state.refreshing = true;
    state.refreshStartedAt = Date.now();
    updateChrome();
    startRefreshPoll();
    toast('已开始增量同步官方数据', 'success');
  }

  function startRefreshPoll() {
    if (state.refreshPoll) window.clearInterval(state.refreshPoll);
    state.refreshPoll = window.setInterval(async () => {
      try {
        const status = await fetchStatus();
        state.status = status;
        updateChrome();
        if (status.state === 'error') {
          stopRefreshPoll();
          state.refreshing = false;
          updateChrome();
          toast(`同步失败：${status.message || '未知错误'}`, 'error', 5000);
          return;
        }
        const finished = !status.syncRunning && status.state !== 'running';
        if (finished) {
          stopRefreshPoll();
          state.refreshing = false;
          updateChrome();
          await loadData({ silent: true });
          toast('同步完成，数据已刷新', 'success');
        } else if (Date.now() - state.refreshStartedAt > 10 * 60 * 1000) {
          stopRefreshPoll();
          state.refreshing = false;
          updateChrome();
          toast('同步仍在后台运行，可稍后刷新页面查看', 'info', 5000);
        }
      } catch (_) {
        // transient network failure; keep polling
      }
    }, 1000);
  }

  function stopRefreshPoll() {
    if (state.refreshPoll) {
      window.clearInterval(state.refreshPoll);
      state.refreshPoll = null;
    }
  }

  async function checkForUpdates() {
    try {
      const status = await fetchStatus();
      state.status = status;
      updateChrome();
      if (state.refreshing) return;
      const remoteAt = status?.snapshot?.generatedAt;
      if (remoteAt && state.data?.meta?.generatedAt && remoteAt !== state.data.meta.generatedAt) {
        if (state.teamModal || state.heroModal) {
          if (!state.pendingReload) {
            state.pendingReload = true;
            toast('官方数据已更新，关闭当前弹窗后载入最新数据', 'info', 4500);
          }
        } else {
          await loadData({ silent: true });
        }
      }
    } catch (_) {
      // silent background check
    }
  }

  /* ---------------------------------------------------------
     Routing / rendering shell
     --------------------------------------------------------- */
  function setView(view) {
    const next = VIEWS.has(view) ? view : 'draft';
    if (state.view === next) return;
    state.view = next;
    try {
      history.replaceState(null, '', `#${next}`);
    } catch (_) {
      window.location.hash = next;
    }
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setSeason(season) {
    if (season !== ALL && !SEASONS.includes(season)) return;
    state.reviewGameNo = null;
    state.season = season;
    if (season !== ALL) {
      state.standingsSeason = season;
      state.standingsStage = season === 'KPL2026S3' ? 'lts' : 'cgs';
    }
    ensurePairDefaults();
    saveDrafts();
    updateChrome();
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    if (!state.ready || !state.data) {
      renderBoot();
      return;
    }
    updateChrome();
    if (state.lastView !== state.view) {
      state.lastView = state.view;
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    const app = $('#app');
    if (!app) return;
    if (state.view === 'draft') renderDraftPage(app);
    else if (state.view === 'heroes') renderHeroesPage(app);
    else if (state.view === 'pairs') renderPairsPage(app);
    else if (state.view === 'teams') renderTeamsPage(app);
    else renderSourcePage(app);
    applyLanguage(document.body);
    renderLanguageToggle();
  }

  /* ---------------------------------------------------------
     Global bindings / init
     --------------------------------------------------------- */
  function bindGlobalUI() {
    $('#mainNav')?.addEventListener('click', (event) => {
      const button = event.target.closest('.nav-tab');
      if (button?.dataset.view) setView(button.dataset.view);
    });
    $('#seasonTabs')?.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-season]');
      if (button?.dataset.season) setSeason(button.dataset.season);
    });
    $('#refreshBtn')?.addEventListener('click', () => {
      if (state.refreshing) {
        toast('同步正在进行中');
        return;
      }
      startSyncRequest(false).catch((error) => toast(`同步请求失败：${error.message || error}`, 'error'));
    });
    $('#checkUpdateBtn')?.addEventListener('click', () => checkAppUpdate());
    $('#langToggle')?.addEventListener('click', () => setLanguage(state.lang === 'en' ? 'zh' : 'en'));
    window.addEventListener('hashchange', () => {
      const next = parseHash();
      if (next && next !== state.view) {
        state.view = next;
        render();
      }
    });
    window.addEventListener('resize', () => {
      if (state.view === 'draft') syncDraftPoolHeight();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        if (state.teamModal || state.heroModal) {
          closeModal();
          return;
        }
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z' && state.view === 'draft') {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
        event.preventDefault();
        undoDraft();
      }
      if (event.key === '/' && state.view === 'draft') {
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
        event.preventDefault();
        $('#draftSearch')?.focus();
      }
    });
  }

  function init() {
    restorePrefs();
    bindGlobalUI();
    const versionLabel = $('#appVersion');
    if (versionLabel) versionLabel.textContent = `v${APP_VERSION}`;
    $('.live-link')?.setAttribute('href', KPL_LIVE_URL);
    renderLanguageToggle();
    applyLanguage(document.body);
    updateChrome();
    loadData();
    window.setInterval(checkForUpdates, 20000);
    window.setTimeout(() => checkAppUpdate({ silent: true }), 1800);
    window.setInterval(() => checkAppUpdate({ silent: true }), 6 * 60 * 60 * 1000);
  }

  /* ---------------------------------------------------------
     Draft room
     --------------------------------------------------------- */
  function renderDraftPage(app) {
    const draft = getDraft();
    app.innerHTML = `
      <section class="page" id="draftPage">
        <div class="page-head">
          <div>
            <div class="page-kicker"><i></i><span>SERIES DRAFT ROOM · GLOBAL BP</span></div>
            <h1 class="page-title">BP <em>演练室</em></h1>
            <p class="page-sub" id="draftSub"></p>
          </div>
          <div class="head-actions">
            <button class="btn ghost" id="importDraftBtn" type="button">${ICONS.upload} 导入 BP</button>
            <button class="btn ghost" id="copyDraftBtn" type="button">${ICONS.copy} 复制本局</button>
            <button class="btn ghost danger" id="resetDraftBtn" type="button">${ICONS.trash} 重置本局</button>
          </div>
        </div>

        <div id="seriesBar"></div>

        <div class="draft-scoreboard">
          <div id="bluePanel"></div>
          <div id="phasePanel"></div>
          <div id="redPanel"></div>
        </div>

        <div class="draft-main">
          <section class="panel pool-panel" aria-label="英雄池">
            <div class="pool-head">
              <div>
                <div class="pool-title">英雄池 <span class="count" id="poolCount"></span></div>
                <div class="pool-meta" id="poolMeta"></div>
              </div>
              <div class="pool-tools">
                <label class="search-box" aria-label="搜索英雄">
                  ${ICONS.search}
                  <input id="draftSearch" type="search" placeholder="搜索英雄…" autocomplete="off" spellcheck="false" />
                </label>
                <select class="control-select" id="draftSort" aria-label="英雄排序" style="width:auto;min-width:108px">
                  <option value="recommend">推荐排序</option>
                  <option value="presence">BP 热度</option>
                  <option value="win">胜率优先</option>
                  <option value="ban">Ban 率优先</option>
                  <option value="pick">Pick 率优先</option>
                </select>
              </div>
            </div>
            <div class="pool-head" style="margin-top:9px">
              <div class="role-filter" id="draftRoleFilter" role="group" aria-label="按分路筛选">
                ${['全部', ...ROLE_ORDER].map((role) =>
                  `<button type="button" class="filter-chip ${role === state.draftFilter.role ? 'is-active' : ''}" data-role="${role}">${role}</button>`
                ).join('')}
              </div>
            </div>
            <div class="hero-grid" id="heroGrid" aria-label="可选英雄"></div>
          </section>
          <aside class="panel coach-panel" id="coachPanel" aria-label="教练席建议"></aside>
        </div>

        <div class="draft-analysis" id="draftAnalysis"></div>
      </section>`;
    const search = $('#draftSearch');
    if (search) search.value = state.draftFilter.q;
    const sort = $('#draftSort');
    if (sort) sort.value = state.draftFilter.sort;
    bindDraftPageEvents();
    renderDraftDynamic();
  }

  function bindDraftPageEvents() {
    const page = $('#draftPage');
    if (!page) return;

    $('#draftSearch')?.addEventListener('input', (event) => {
      state.draftFilter.q = event.target.value.trim();
      renderDraftGrid();
    });
    $('#draftSort')?.addEventListener('change', (event) => {
      state.draftFilter.sort = event.target.value;
      renderDraftGrid();
    });
    $('#draftRoleFilter')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-role]');
      if (!button) return;
      state.draftFilter.role = button.dataset.role;
      $$('#draftRoleFilter .filter-chip').forEach((chip) => {
        chip.classList.toggle('is-active', chip.dataset.role === state.draftFilter.role);
      });
      renderDraftGrid();
    });
    $('#heroGrid')?.addEventListener('click', (event) => {
      const card = event.target.closest('[data-hero-id]');
      if (!card || card.dataset.unavailable === '1') return;
      if (!canEditCurrentGame() || !currentAction(getDraft())) {
        openHeroModal(Number(card.dataset.heroId));
        return;
      }
      pickHero(Number(card.dataset.heroId));
    });
    $('#coachPanel')?.addEventListener('click', (event) => {
      if (event.target.closest('[data-copy-draft]')) {
        copyDraft();
        return;
      }
      const panel = $('#coachPanel');
      const panelScroll = panel?.scrollTop || 0;
      const gameButton = event.target.closest('[data-coach-game]');
      if (gameButton && state.coachProb) {
        state.coachProb.gameNo = gameButton.dataset.coachGame;
        renderCoachPanel();
        if (panel) panel.scrollTop = panelScroll;
        return;
      }
      const slotButton = event.target.closest('[data-coach-slot-type]');
      if (slotButton && state.coachProb) {
        state.coachProb.type = slotButton.dataset.coachSlotType;
        state.coachProb.slot = Number(slotButton.dataset.coachSlotIndex);
        renderCoachPanel();
        if (panel) panel.scrollTop = panelScroll;
        return;
      }
      const row = event.target.closest('[data-pick-hero]');
      if (row) pickHero(Number(row.dataset.pickHero));
    });
    $('#phasePanel')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-draft-act]');
      const action = button?.dataset.draftAct;
      if (action === 'undo') undoDraft();
      if (action === 'reset') resetDraft();
      if (action === 'unlock') unlockCurrentGame();
      const peakSide = event.target.closest('[data-peak-side]')?.dataset.peakSide;
      if (peakSide && canEditCurrentGame()) {
        const series = getSeries();
        series.peakActiveSide = peakSide;
        saveDrafts();
        renderDraftDynamic();
      }
    });
    $('#draftPage')?.addEventListener('click', (event) => {
      if (event.target.closest('[data-review-current]')) {
        state.reviewGameNo = null;
        renderDraftDynamic();
        return;
      }
      const gameView = event.target.closest('[data-game-view]')?.dataset.gameView;
      if (gameView) {
        const no = Number(gameView);
        const series = getSeries();
        if (Number.isInteger(no) && no >= 1 && no <= series.currentGame) {
          state.reviewGameNo = no === series.currentGame ? null : no;
          renderDraftDynamic();
        }
        return;
      }
      const bo = event.target.closest('[data-bo-option]')?.dataset.boOption;
      if (bo) {
        if (!canEditCurrentGame()) {
          toast('本局已确认或正在回看，不能修改 BO 赛制', 'info');
          return;
        }
        changeSeriesBo(Number(bo));
        return;
      }
      if (event.target.closest('[data-reset-series]')) {
        if (isReviewingDraft()) {
          toast('正在回看历史小局，请先返回当前局再重置系列赛', 'info');
          return;
        }
        resetSeries();
        return;
      }
      if (event.target.closest('[data-next-game]')) {
        if (isReviewingDraft()) {
          toast('正在回看历史小局，请先返回当前局', 'info');
          return;
        }
        advanceGame();
        return;
      }
      const winnerSide = event.target.closest('[data-winner-side]')?.dataset.winnerSide;
      if (winnerSide) {
        if (isReviewingDraft()) {
          toast('回看模式不能修改胜方', 'info');
          return;
        }
        setGameWinner(winnerSide);
        return;
      }
      if (event.target.closest('[data-swap-sides]')) {
        if (!canEditCurrentGame()) {
          toast('本局已确认或正在回看，不能换边', 'info');
          return;
        }
        swapCurrentSides();
        return;
      }
      const heroButton = event.target.closest('[data-inspect-hero]');
      if (heroButton) {
        const side = heroButton.dataset.slotSide || heroButton.closest('[data-side]')?.dataset.side;
        const slotType = heroButton.dataset.slotType;
        const slotIndex = Number(heroButton.dataset.slotIndex);
        if (!canEditCurrentGame()) {
          const series = getSeries();
          const game = getViewGame();
          const teamId = side ? gameTeamId(series, game, side) : null;
          openHeroModal(Number(heroButton.dataset.inspectHero), teamId);
          return;
        }
        if (side && ['ban', 'pick'].includes(slotType) && Number.isInteger(slotIndex) && slotIndex >= 0) {
          openSwapHeroModal(side, slotType, slotIndex);
          return;
        }
        const series = getSeries();
        const game = getGame();
        const teamId = side ? gameTeamId(series, game, side) : null;
        openHeroModal(Number(heroButton.dataset.inspectHero), teamId);
      }
    });
    page.addEventListener('change', (event) => {
      const select = event.target.closest('select[data-team-side]');
      if (!select) return;
      const side = select.dataset.teamSide;
      changeTeam(side, select.value);
    });
    $('#importDraftBtn')?.addEventListener('click', openImportDraftModal);
    $('#copyDraftBtn')?.addEventListener('click', copyDraft);
    $('#resetDraftBtn')?.addEventListener('click', resetDraft);
  }

  function changeTeam(side, teamId) {
    if (isReviewingDraft()) {
      toast('回看模式不能更换战队，请先返回当前局', 'info');
      return;
    }
    if (!canEditCurrentGame()) {
      toast('本局已确认，不能更换战队；请先进入下一局或切换赛季', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    const current = gameTeams(series, game);
    if (String(current[side]) === String(teamId)) return;
    const otherTeam = side === 'blue' ? current.red : current.blue;
    if (String(teamId) !== ALL && String(otherTeam) === String(teamId)) {
      toast('蓝方和红方不能是同一支战队');
      renderDraftDynamic();
      return;
    }
    if (seriesHasActions(series) && !window.confirm('更换战队会重置当前 BO 系列赛的全局 BP 记录，继续吗？')) {
      renderDraftDynamic();
      return;
    }
    if (seriesHasActions(series)) {
      const next = createSeries(series.season, series.bo, {
        blue: side === 'blue' ? teamId : otherTeam,
        red: side === 'red' ? teamId : otherTeam
      });
      state.drafts[series.season] = next;
    } else {
      // Set the base team behind the currently displayed side. This keeps the
      // swap state intact when the user changes teams before the first pick.
      const baseKey = (side === 'blue') !== Boolean(game.swapSides) ? 'blueTeam' : 'redTeam';
      series[baseKey] = teamId;
    }
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
  }

  function swapCurrentSides() {
    if (!canEditCurrentGame()) {
      toast('本局已确认或正在回看，不能换边', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    if (game.actions.length || gameIsComplete(game) || series.complete) {
      toast('本局 BP 已开始或已结束，不能再换边');
      return;
    }
    game.swapSides = !game.swapSides;
    series.peakActiveSide = 'blue';
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    toast(game.swapSides ? '本局已换边：蓝/红方战队互换' : '本局已换回原边', 'success');
  }

  function setGameWinner(side) {
    if (isReviewingDraft()) {
      toast('回看模式不能修改胜方，请先返回当前局', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    if (!gameIsComplete(game)) {
      toast('请先完成本局 BP，再选择胜负');
      return;
    }
    const teamId = gameTeamId(series, game, side);
    game.winner = teamId;
    series.complete = Boolean(seriesWinner(series));
    saveDrafts();
    renderDraftDynamic();
    toast(`${teamName(teamId)} 本局获胜`, 'success');
  }

  function changeSeriesBo(bo) {
    if (!canEditCurrentGame()) {
      toast('本局已确认或正在回看，不能修改 BO 赛制', 'info');
      return;
    }
    const series = getSeries();
    if (!BO_OPTIONS.includes(Number(bo)) || series.bo === Number(bo)) return;
    if (seriesHasActions(series) && !window.confirm('切换 BO 赛制会重置当前系列赛，继续吗？')) return;
    const next = createSeries(series.season, Number(bo), {
      blue: series.blueTeam,
      red: series.redTeam
    });
    state.drafts[series.season] = next;
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    toast(`已切换为 BO${bo} · ${isPeakGame(bo, bo) ? '决胜局为巅峰对决' : '全局 BP'}`, 'success');
  }

  function resetSeries() {
    if (isReviewingDraft()) {
      toast('正在回看历史小局，请先返回当前局再重置系列赛', 'info');
      return;
    }
    const series = getSeries();
    if (!seriesHasActions(series)) return;
    if (!window.confirm(`确定重置 BO${series.bo} 整个系列赛吗？所有局的 BP 都会清空。`)) return;
    const next = createSeries(series.season, series.bo, { blue: series.blueTeam, red: series.redTeam });
    state.drafts[series.season] = next;
    state.reviewGameNo = null;
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    toast('系列赛已重置');
  }

  function advanceGame() {
    if (isReviewingDraft()) {
      toast('正在回看历史小局，请先返回当前局', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    if (!gameIsComplete(game)) {
      toast('当前局 BP 尚未完成');
      return;
    }
    if (!game.winner) {
      toast('请先在本局 BP 结果中选择胜方');
      return;
    }
    game.complete = true;
    const winnerTeam = seriesWinner(series);
    series.complete = Boolean(winnerTeam);
    if (series.complete) {
      saveDrafts();
      renderDraftDynamic();
      toast(`${teamName(winnerTeam)} 赢得 BO${series.bo} 系列赛`, 'success', 4500);
      return;
    }
    if (series.currentGame >= series.games.length) {
      saveDrafts();
      renderDraftDynamic();
      return;
    }
    series.currentGame += 1;
    series.peakActiveSide = 'blue';
    state.reviewGameNo = null;
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    toast(`进入第 ${series.currentGame} 局 · ${getGame().mode === 'peak' ? '巅峰对决' : '全局 BP'}`, 'success');
  }

  function renderDraftHeader() {
    const series = getSeries();
    const game = getViewGame();
    const sub = $('#draftSub');
    if (!sub) return;
    const teams = gameTeams(series, game);
    const blue = teams.blue === ALL ? '全KPL（通用）' : teamName(teams.blue);
    const red = teams.red === ALL ? '全KPL（通用）' : teamName(teams.red);
    const mode = game.mode === 'peak' ? '第 ' + game.no + ' 局 · 巅峰对决' : `第 ${game.no} 局 · 全局 BP`;
    const swap = game.swapSides ? ' · <span style="color:var(--gold-2)">本局换边</span>' : '';
    const review = isReviewingDraft();
    const locked = !canEditCurrentGame();
    const stateLabel = review
      ? ' · <span class="draft-review-tag">只读回看 G' + game.no + '</span>'
      : locked
        ? ' · <span class="draft-lock-tag">本局已确认</span>'
        : '';
    sub.innerHTML = `<b style="color:var(--blue-2)">${esc(blue)}</b> <span style="color:var(--dim)">vs</span> <b style="color:var(--red-2)">${esc(red)}</b> · BO${series.bo} · ${esc(seasonLabel(series.season))} · <span style="color:var(--gold-2)">${esc(mode)}</span>${swap}${stateLabel}`;
  }

  function renderSeriesBar() {
    const series = getSeries();
    const game = getGame();
    const root = $('#seriesBar');
    if (!root) return;
    const score = seriesScore(series);
    const winnerTeam = seriesWinner(series);
    const blueTeam = String(series.blueTeam);
    const redTeam = String(series.redTeam);
    const currentBlue = gameTeamId(series, game, 'blue');
    const currentRed = gameTeamId(series, game, 'red');
    const complete = gameIsComplete(game);
    const reviewing = isReviewingDraft();
    const viewingNo = reviewing ? state.reviewGameNo : series.currentGame;
    const swapDisabled = game.actions.length > 0 || complete || series.complete;
    const winnerFor = (side) => String(game.winner || '') === String(gameTeamId(series, game, side));
    const chips = series.games.map((item) => {
      const isCurrent = item.no === game.no;
      const isViewing = item.no === viewingNo;
      const chipComplete = gameIsComplete(item);
      const isPeak = item.mode === 'peak';
      const classes = ['series-game-chip'];
      if (isCurrent) classes.push('is-current');
      if (isViewing) classes.push('is-viewing');
      if (chipComplete || item.complete) classes.push('is-complete');
      if (isPeak) classes.push('is-peak');
      if (!isCurrent && !chipComplete) classes.push('is-future');
      if (item.winner) classes.push('has-winner');
      const label = isPeak ? '巅峰对决' : '全局 BP';
      const winnerLabel = item.winner ? `${teamName(item.winner)} 胜` : (isCurrent ? (chipComplete ? 'BP 完成' : '进行中') : chipComplete ? '已完成' : '未开始');
      const canView = item.no <= series.currentGame;
      return `<button type="button" class="${classes.join(' ')}" data-game-view="${item.no}" ${canView ? '' : 'disabled'} title="第 ${item.no} 局 · ${label}${canView ? ' · 点击查看' : ''}">
        <span class="game-no">G${String(item.no).padStart(2, '0')}</span>
        <span class="game-label">${label}</span>
        <span class="game-state">${winnerLabel}</span>
      </button>`;
    }).join('');
    const peakText = series.bo === 7 || series.bo === 9
      ? `第 ${series.bo} 局为巅峰对决：无 Ban、双方盲选、解除全局 BP 限制`
      : '全部小局均为全局 BP：己方已选英雄不可再次选择';
    const canPickWinner = complete && !reviewing;
    const resultButtons = `<div class="winner-picker ${complete ? 'is-ready' : ''}" role="group" aria-label="选择本局胜方">
      <span class="winner-title">本局胜方</span>
      <button type="button" class="winner-btn blue ${winnerFor('blue') ? 'is-selected' : ''}" data-winner-side="blue" ${canPickWinner ? '' : 'disabled'} title="${canPickWinner ? '选择蓝方获胜' : reviewing ? '回看模式不可操作' : '本局 BP 完成后可选'}">
        <span class="winner-side">蓝方</span><b>${esc(teamName(currentBlue))}</b>
      </button>
      <button type="button" class="winner-btn red ${winnerFor('red') ? 'is-selected' : ''}" data-winner-side="red" ${canPickWinner ? '' : 'disabled'} title="${canPickWinner ? '选择红方获胜' : reviewing ? '回看模式不可操作' : '本局 BP 完成后可选'}">
        <span class="winner-side">红方</span><b>${esc(teamName(currentRed))}</b>
      </button>
    </div>`;
    const champion = winnerTeam
      ? `<span class="series-champion">${ICONS.trophy} ${esc(teamName(winnerTeam))} 赢得 BO${series.bo}</span>`
      : `<span class="series-result-tip">${complete ? (game.winner ? '已选择胜方，可进入下一局' : '请选择本局胜方') : '双方 BP 完成后选择本局胜方'}</span>`;
    root.innerHTML = `<section class="panel series-bar ${reviewing ? 'is-reviewing' : ''}">
      ${reviewing ? `<div class="draft-review-banner">
        <span>${ICONS.check} 正在回看 G${state.reviewGameNo} · 只读模式，不能修改英雄</span>
        <button class="btn sm ghost" type="button" data-review-current>返回当前 G${series.currentGame} ${ICONS.arrow}</button>
      </div>` : ''}
      <div class="series-top">
        <div class="series-title-wrap">
          <div class="eyebrow">SERIES FORMAT · ${game.mode === 'peak' ? 'PEAK SHOWDOWN' : '全局 BP'}</div>
          <div class="series-title">BO${series.bo} <span>· ${series.complete ? '系列赛结束' : `第 ${series.currentGame} / ${series.bo} 局`}</span></div>
        </div>
        <div class="bo-options" role="group" aria-label="选择 BO 赛制">
          ${BO_OPTIONS.map((bo) => `<button type="button" class="bo-option ${series.bo === bo ? 'is-active' : ''}" data-bo-option="${bo}">BO${bo}</button>`).join('')}
        </div>
        <div class="series-actions">
          <button class="btn sm ${game.swapSides ? 'primary' : 'ghost'}" type="button" data-swap-sides ${swapDisabled ? 'disabled' : ''} title="${swapDisabled ? '本局 BP 已开始或结束，无法换边' : '在 BP 开始前交换蓝/红方战队'}">${ICONS.swap} ${game.swapSides ? '换回原边' : '本局换边'}</button>
          <span class="tag gold">${series.bo === 1 ? '单局' : `${series.bo} 局系列赛`}</span>
          <button class="btn sm ghost" type="button" data-reset-series>${ICONS.trash} 重置系列赛</button>
        </div>
      </div>
      <div class="series-games" aria-label="系列赛小局进度">${chips}</div>
      <div class="series-result-row">
        <div class="series-score" title="系列赛比分">
          <span class="score-team blue">${esc(teamName(blueTeam))}</span>
          <b>${score[blueTeam] || 0}</b><i>:</i><b>${score[redTeam] || 0}</b>
          <span class="score-team red">${esc(teamName(redTeam))}</span>
        </div>
        ${resultButtons}
        ${champion}
      </div>
      <div class="series-hint">${ICONS.spark}<span>${esc(peakText)} · 每局 BP 完成后选择本局胜方，才能进入下一局</span></div>
    </section>`;
  }

  function teamName(teamId) {
    if (!teamId || teamId === ALL) return '全KPL';
    return state.teamMap.get(String(teamId))?.name || String(teamId);
  }

  function teamOptions(selected, season) {
    const options = [`<option value="${ALL}" ${selected === ALL ? 'selected' : ''}>全KPL（通用）</option>`];
    const hasData = (team) => (teamStat(team, season)?.games.played || 0) > 0;
    const teams = [...(state.data?.teams || [])]
      .filter((team) => hasData(team) || String(team.id) === String(selected))
      .sort((a, b) => Number(hasData(b)) - Number(hasData(a)) || a.name.localeCompare(b.name, 'zh-CN'));
    for (const team of teams) {
      const stats = teamStat(team, season);
      const rate = stats?.series?.winRate;
      const suffix = hasData(team) && rate !== null && rate !== undefined
        ? ` · ${pct(rate, 0)}`
        : ' · 无本季数据';
      options.push(`<option value="${esc(team.id)}" ${String(selected) === String(team.id) ? 'selected' : ''}>${esc(team.name)}${suffix}</option>`);
    }
    return options.join('');
  }

  function assignedPickRoles(picks) {
    if (!picks || picks.length !== 5 || picks.some((id) => !id)) return null;
    const heroes = picks.filter(Boolean).map((id) => state.heroMap.get(Number(id))).filter(Boolean);
    const used = new Set();
    const slots = Array(5).fill(null);

    // First fill exact lane slots, preferring heroes whose primary role fits.
    for (let index = 0; index < ROLE_ORDER.length; index += 1) {
      const role = ROLE_ORDER[index];
      const candidates = heroes
        .filter((hero) => !used.has(hero.id) && heroRoles(hero).includes(role))
        .sort((a, b) => {
          const aPrimary = heroRoles(a)[0] === role ? 0 : 1;
          const bPrimary = heroRoles(b)[0] === role ? 0 : 1;
          return aPrimary - bPrimary || heroRoles(a).length - heroRoles(b).length;
        });
      if (candidates.length) {
        used.add(candidates[0].id);
        slots[index] = {
          hero: candidates[0],
          role,
          exact: true,
          pickIndex: picks.findIndex((id) => Number(id) === candidates[0].id)
        };
      }
    }

    // Invalid/off-role compositions: keep all five heroes, but label the
    // unmatched hero with its real primary lane instead of lying about it.
    const leftovers = heroes.filter((hero) => !used.has(hero.id));
    for (let index = 0; index < ROLE_ORDER.length; index += 1) {
      if (slots[index] || !leftovers.length) continue;
      const hero = leftovers.shift();
      slots[index] = {
        hero,
        role: heroRoles(hero)[0],
        exact: false,
        slotRole: ROLE_ORDER[index],
        pickIndex: picks.findIndex((id) => Number(id) === hero.id)
      };
    }
    return slots
      .filter(Boolean)
      .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role));
  }

  function sidePickSlots(picks, isBlue) {
    const complete = picks && picks.length === 5 && picks.every(Boolean);
    if (complete) {
      const assigned = assignedPickRoles(picks) || [];
      const ordered = isBlue ? assigned : [...assigned].reverse();
      return ordered.map(({ hero, role, exact, pickIndex }) => ({
        hero,
        label: ROLE_SHORT[role] || role,
        role,
        exact,
        index: pickIndex
      }));
    }
    const ordered = picks.map((heroId, index) => ({
      hero: heroId ? state.heroMap.get(Number(heroId)) : null,
      label: `P${index + 1}`,
      role: null,
      exact: true,
      index
    }));
    return isBlue ? ordered : [...ordered].reverse();
  }

  function renderSidePanel(side) {
    const draft = getDraft();
    const series = getSeries();
    const game = getViewGame();
    const isBlue = side === 'blue';
    const sideData = draft[side];
    const teamId = gameTeamId(series, game, side);
    const team = teamId === ALL ? null : state.teamMap.get(String(teamId));
    const stats = team ? teamStat(team, series.season) : null;
    const action = currentAction(draft);
    const acting = action?.side === side;
    const recordHtml = team && stats?.series?.played
      ? `<b>${pct(stats.series.winRate, 1)}</b>系列赛 ${record(stats.series.wins, stats.series.losses)}`
      : `<b>${team ? '—' : '通用'}</b>${team ? '暂无系列赛' : '按全 KPL 推荐'}`;
    const teamVisual = team
      ? teamImage(team, 'side-team-logo')
      : `<span class="side-emblem" aria-hidden="true">KPL</span>`;

    // Red-side bans are mirrored: the first ban appears at the far right.
    const banSlots = isBlue ? sideData.bans : [...sideData.bans].reverse();
    const bans = banSlots.map((heroId, index) => {
      const hero = heroId ? state.heroMap.get(Number(heroId)) : null;
      const banNumber = isBlue ? index + 1 : 5 - index;
      const slotIndex = isBlue ? index : sideData.bans.length - 1 - index;
      if (!hero) return `<div class="ban-slot is-empty" title="${isBlue ? '蓝方' : '红方'} Ban ${banNumber}"></div>`;
      return `<button type="button" class="ban-slot" data-inspect-hero="${hero.id}" data-slot-type="ban" data-slot-side="${side}" data-slot-index="${slotIndex}" title="Ban ${banNumber} · ${esc(hero.name)} · 点击更换">
        ${heroImage(hero, '', hero.name)}
        <span class="ban-x">×</span>
        <span class="slot-order">${slotIndex + 1}</span>
      </button>`;
    }).join('');

    const pickSlots = sidePickSlots(sideData.picks, isBlue);
    const picks = pickSlots.map(({ hero, label, role, exact, index }) => {
      if (!hero) {
        return `<div class="pick-slot is-empty" aria-label="${esc(label)}空位"><span class="pick-role ${role ? roleClass(role) : 'is-pending'}">${esc(label)}</span></div>`;
      }
      const just = state.lastAction?.heroId === hero.id && Date.now() - state.lastAction.ts < 1200;
      const slotIndex = Number.isInteger(index) ? index : game[side].picks.indexOf(hero.id);
      return `<button type="button" class="pick-slot is-inspect ${just ? 'is-just' : ''}" data-inspect-hero="${hero.id}" data-slot-type="pick" data-slot-side="${side}" data-slot-index="${slotIndex}" title="${esc(hero.name)} · 点击更换英雄" aria-label="${esc(hero.name)}，${esc(role || label)}">
        ${heroImage(hero, '', hero.name)}
        <span class="pick-shade"></span>
        <span class="pick-role ${role ? roleClass(role) : 'is-pending'} ${exact === false ? 'is-fill' : ''}">${esc(label)}</span>
        <span class="slot-order">${slotIndex + 1}</span>
        <span class="pick-name">${esc(hero.name)}</span>
      </button>`;
    }).join('');

    const prior = [...priorPicksForTeam(series, teamId, game.no)];
    const priorIcons = prior.slice(0, 12).map((heroId) => {
      const hero = state.heroMap.get(heroId);
      return hero ? `<span class="global-used-icon" title="${esc(hero.name)}">${heroImage(hero, '', hero.name)}</span>` : '';
    }).join('');
    const priorMore = prior.length > 12 ? `<span class="global-used-more">+${prior.length - 12}</span>` : '';
    const globalUsed = `<div class="global-used ${game.mode === 'peak' ? 'is-unlocked' : ''}">
      <span class="global-used-label">全局已用 <b>${prior.length}</b></span>
      <div class="global-used-icons">${priorIcons || '<span class="global-used-empty">暂无</span>'}${priorMore}</div>
      ${game.mode === 'peak' ? '<span class="tag green">已解锁</span>' : (prior.length ? '<span class="tag">不可再选</span>' : '')}
    </div>`;

    const banLine = game.mode === 'peak'
      ? `<div class="no-ban-line"><span class="no-ban-mark">NO BAN</span><span>巅峰对决 · 双方盲选</span></div>`
      : `<div class="ban-line"><span class="ban-label">BAN</span><div class="bans">${bans}</div></div>`;

    return `<section class="side-panel side-${side} ${acting ? 'is-acting' : ''} ${game.mode === 'peak' ? 'is-peak-side' : ''}" data-side="${side}">
      <div class="side-top">
        <span class="side-badge">${isBlue ? 'BLUE' : 'RED'}</span>
        <div class="team-picker">
          ${teamVisual}
          <select class="team-select" data-team-side="${side}" aria-label="选择${isBlue ? '蓝方' : '红方'}战队">
            ${teamOptions(teamId, series.season)}
          </select>
        </div>
        <div class="side-record">${recordHtml}</div>
      </div>
      ${banLine}
      <div class="pick-slots">${picks}</div>
      ${globalUsed}
      <div class="side-foot"><span>${game.mode === 'peak' ? '巅峰对决 · 无 Ban' : `BAN <b>${sideData.bans.filter(Boolean).length}</b>/5`} · PICK <b>${sideData.picks.filter(Boolean).length}</b>/5</span><span>BO${series.bo} · G${game.no}</span></div>
    </section>`;
  }

  function phaseLabel(index) {
    if (index >= DRAFT_STEPS.length) return 'BP 完成';
    if (index < 4) return '首轮禁用';
    if (index < 10) return '首轮选人';
    if (index < 16) return '次轮禁用';
    return '次轮选人';
  }

  function renderPhasePanel() {
    const series = getSeries();
    const game = getViewGame();
    const draft = getDraft();
    const action = currentAction(draft);
    const step = game.step;
    const complete = gameIsComplete(game);
    const winnerTeam = seriesWinner(series);
    const canAdvance = Boolean(game.winner) && !winnerTeam;
    const reviewing = isReviewingDraft();
    const nextLabel = winnerTeam
      ? '系列赛结束'
      : !game.winner
        ? '请先选本局胜方'
        : series.currentGame >= series.games.length
          ? '完成系列赛'
          : '进入下一局';

    if (reviewing) {
      return `<section class="phase-panel is-review" aria-label="历史 BP 回看">
        <div class="phase-kicker">HISTORY REVIEW · G${game.no} / BO${series.bo}</div>
        <div class="phase-step">${String(game.step).padStart(2, '0')}<small>/ ${game.mode === 'peak' ? 10 : 20}</small></div>
        <div class="phase-name">G${game.no} 历史 BP</div>
        <div class="phase-action is-done">${ICONS.check} 只读回看 · 不可修改英雄</div>
        <div class="phase-controls"><button class="btn sm ghost" type="button" data-review-current>返回当前 G${series.currentGame} ${ICONS.arrow}</button></div>
      </section>`;
    }
    if (!canEditCurrentGame()) {
      return `<section class="phase-panel is-locked" aria-label="本局已锁定">
        <div class="phase-kicker">CONFIRMED · G${game.no} / BO${series.bo}</div>
        <div class="phase-step">${game.mode === 'peak' ? '10' : '20'}<small>/ ${game.mode === 'peak' ? 10 : 20}</small></div>
        <div class="phase-name">本局已确认</div>
        <div class="phase-action is-done">${ICONS.check} BP 与胜方已锁定 · 只读</div>
        ${game.winner ? '<div class="phase-lock-note">本局已确认，BP 只读；可重置本局、重置系列赛或解锁本局 BP</div>' : ''}
        <div class="phase-controls">
          <button class="btn sm ghost" type="button" data-draft-act="reset">重置本局</button>
          <button class="btn sm ghost" type="button" data-draft-act="unlock">解锁本局 BP</button>
          ${game.winner && !series.complete ? `<button class="btn sm primary" type="button" data-draft-act="next" data-next-game ${canAdvance ? '' : 'disabled'}>${nextLabel} ${ICONS.arrow}</button>` : ''}
        </div>
      </section>`;
    }

    if (game.mode === 'peak') {
      const blueCount = game.blue.picks.filter(Boolean).length;
      const redCount = game.red.picks.filter(Boolean).length;
      return `<section class="phase-panel peak-phase" aria-label="巅峰对决">
        <div class="phase-kicker">PEAK SHOWDOWN · G${game.no}</div>
        <div class="peak-title">巅峰对决</div>
        <div class="peak-rule">无 Ban · 双方盲选 · 解除全局 BP</div>
        <div class="peak-side-switch" role="group" aria-label="选择盲选填写方">
          <button type="button" class="peak-side-btn ${series.peakActiveSide === 'blue' ? 'is-active blue' : ''}" data-peak-side="blue">
            <span>蓝方</span><b>${blueCount}/5</b>
          </button>
          <button type="button" class="peak-side-btn ${series.peakActiveSide === 'red' ? 'is-active red' : ''}" data-peak-side="red">
            <span>红方</span><b>${redCount}/5</b>
          </button>
        </div>
        <div class="phase-action ${complete ? 'is-done' : (series.peakActiveSide === 'blue' ? 'is-blue' : 'is-red')}">
          ${complete ? ICONS.check : '<span class="side-dot"></span>'}
          ${complete ? '巅峰对决 BP 完成' : `${series.peakActiveSide === 'blue' ? '蓝方' : '红方'}盲选 · 点击英雄填入`}
        </div>
        <div class="phase-controls">
          <button class="icon-btn" type="button" data-draft-act="undo" title="撤销上一步（Ctrl+Z）" aria-label="撤销上一步" ${game.actions.length ? '' : 'disabled'}>${ICONS.undo}</button>
          ${complete ? `<button class="btn sm primary" type="button" data-draft-act="next" data-next-game ${canAdvance || winnerTeam ? '' : 'disabled'}>${nextLabel} ${ICONS.arrow}</button>` : `<button class="icon-btn" type="button" data-draft-act="reset" title="重置本局" aria-label="重置本局">${ICONS.trash}</button>`}
        </div>
      </section>`;
    }

    const sideName = action ? (action.side === 'blue' ? '蓝方' : '红方') : '';
    const typeName = action ? (action.type === 'ban' ? '禁用' : '选人') : '';
    const actionLabel = action ? `${sideName} · ${typeName}` : '本局 BP 已完成';
    const actionClass = action ? (action.side === 'blue' ? 'is-blue' : 'is-red') : 'is-done';
    const dots = DRAFT_STEPS.map((_, index) => {
      let cls = '';
      if (index < step) cls = 'done';
      else if (index === step && action) cls = 'current';
      return `<span class="phase-dot ${cls}"></span>`;
    }).join('');
    return `<section class="phase-panel" aria-label="BP 进度">
      <div class="phase-kicker">DRAFT SEQUENCE · G${game.no} / BO${series.bo}</div>
      <div class="phase-step">${action ? String(step + 1).padStart(2, '0') : '20'}<small>/ 20</small></div>
      <div class="phase-name">${phaseLabel(step)}</div>
      <div class="phase-action ${actionClass}">
        ${action ? '<span class="side-dot"></span>' : ICONS.check}
        ${esc(actionLabel)}
      </div>
      <div class="phase-dots" aria-hidden="true">${dots}</div>
      <div class="phase-controls">
        <button class="icon-btn" type="button" data-draft-act="undo" title="撤销上一步（Ctrl+Z）" aria-label="撤销上一步" ${step ? '' : 'disabled'}>${ICONS.undo}</button>
        ${complete
          ? `<button class="btn sm primary" type="button" data-draft-act="next" data-next-game ${canAdvance || winnerTeam ? '' : 'disabled'}>${nextLabel} ${ICONS.arrow}</button>`
          : `<button class="icon-btn" type="button" data-draft-act="reset" title="重置本局" aria-label="重置本局">${ICONS.trash}</button>`}
      </div>
    </section>`;
  }

  function statsPresence(stats) {
    if (!stats) return 0;
    return (stats.banRate || 0) + (stats.pickRate || 0);
  }

  function metaScore(stats) {
    if (!stats) return 0;
    const picks = Number(stats.picks || 0);
    const wins = Number(stats.wins || 0);
    const adjWin = picks ? (wins + 2.5) / (picks + 5) : 0.5;
    const winScore = clamp((adjWin - 0.42) / 0.16, 0, 1);
    const presence = clamp(statsPresence(stats) / 0.95, 0, 1);
    const pickScore = clamp((stats.pickRate || 0) / 0.45, 0, 1);
    return 0.5 * winScore + 0.32 * presence + 0.18 * pickScore;
  }

  function teamPreference(ctx, heroId) {
    if (!ctx.games) return 0;
    const entry = ctx.pickStats.get(Number(heroId));
    return clamp(((entry?.n || 0) / ctx.games) / 0.35, 0, 1);
  }

  function teamBanTendency(ctx, heroId) {
    if (!ctx.games) return 0;
    return clamp(((ctx.banStats.get(Number(heroId)) || 0) / ctx.games) / 0.8, 0, 1);
  }

  function synergyDetail(ctx, allyIds, candidateId) {
    if (!ctx.games || !allyIds.length) return { score: 0, best: null };
    let total = 0;
    let count = 0;
    let best = null;
    const baseRate = (ctx.pickStats.get(Number(candidateId))?.n || 0) / ctx.games;
    for (const allyId of allyIds) {
      const aGames = ctx.heroGames.get(Number(allyId)) || 0;
      if (!aGames) continue;
      const pair = ctx.pairs.get(pairKey(allyId, candidateId));
      const n = pair?.n || 0;
      const wins = pair?.w || 0;
      const raw = n / aGames;
      const adjusted = (n + baseRate * 6) / (aGames + 6);
      const comboWin = (wins + 2) / (n + 4);
      const value = clamp(adjusted / 0.55, 0, 1) * (0.7 + 0.3 * clamp((comboWin - 0.4) / 0.2, 0, 1));
      total += value;
      count += 1;
      if (n > 0 && (!best || raw > best.rate)) {
        best = {
          heroId: Number(allyId),
          rate: raw,
          n,
          wins,
          comboWin,
          name: state.heroMap.get(Number(allyId))?.name || String(allyId)
        };
      }
    }
    return { score: count ? total / count : 0, best };
  }

  function counterDetail(season, candidateId, enemyPicks) {
    if (!enemyPicks.length) return { score: 0.5, best: null };
    let total = 0;
    let count = 0;
    let best = null;
    for (const enemyId of enemyPicks) {
      const row = getCounter(season, candidateId, enemyId);
      if (!row.n) continue;
      const wr = (row.w + 2) / (row.n + 4);
      total += clamp((wr - 0.45) / 0.12, 0, 1);
      count += 1;
      if (!best || wr > best.wr) {
        best = {
          heroId: Number(enemyId),
          wr,
          n: row.n,
          name: state.heroMap.get(Number(enemyId))?.name || String(enemyId)
        };
      }
    }
    return { score: count ? total / count : 0.5, best };
  }

  function getRecommendations(side, type) {
    const series = getSeries();
    const game = getGame();
    const season = series.season;
    const peak = game.mode === 'peak';
    const teams = gameTeams(series, game);
    const ownTeam = teams[side];
    const enemySide = side === 'blue' ? 'red' : 'blue';
    const enemyTeam = teams[enemySide];
    const sideLabel = side === 'blue' ? '蓝方' : '红方';
    const enemySideLabel = enemySide === 'blue' ? '蓝方' : '红方';
    const ownPicks = game[side].picks.filter(Boolean).map(Number);
    const enemyPicks = peak ? [] : game[enemySide].picks.filter(Boolean).map(Number);
    const banned = new Set([
      ...game.blue.bans.filter(Boolean).map(Number),
      ...game.red.bans.filter(Boolean).map(Number)
    ]);
    const pickedByBlue = new Set(game.blue.picks.filter(Boolean).map(Number));
    const pickedByRed = new Set(game.red.picks.filter(Boolean).map(Number));
    const ownPrior = peak ? new Set() : priorPicksForTeam(series, ownTeam, game.no);
    const ownCtx = getCtx(season, ownTeam);
    const enemyCtx = getCtx(season, enemyTeam);
    const ownSideScope = getTeamSideScope(season, ownTeam, side);
    const enemySideScope = getTeamSideScope(season, enemyTeam, enemySide);
    const recommendations = [];
    // Exclude the most-used lane of each relevant picked hero. For a flex
    // hero, only that common lane is filtered; its secondary lanes remain.
    const roleSet = commonRoleSet(type === 'ban' ? enemyPicks : ownPicks);
    const familyPicked = hasYuanliu([...game.blue.picks, ...game.red.picks]);
    const familyLocked = type === 'pick' && (familyPicked || hasYuanliu(ownPrior));
    const actionSlot = Math.min(
      4,
      (type === 'ban' ? game[side].bans : game[side].picks).filter(Boolean).length
    );

    for (const hero of state.data.heroes) {
      if (banned.has(hero.id)) continue;
      if (type === 'pick') {
        if (ownPicks.includes(hero.id)) continue;
        if (peak) {
          // In blind pick only the active side's own picks block a hero.
        } else if (pickedByBlue.has(hero.id) || pickedByRed.has(hero.id) || ownPrior.has(hero.id)) {
          continue;
        }
      } else if (pickedByBlue.has(hero.id) || pickedByRed.has(hero.id)) {
        continue;
      }
      if (familyLocked && isYuanliuId(hero.id)) continue;
      if (roleSet.size && heroRoles(hero).some((role) => roleSet.has(role))) continue;
      const stats = heroStat(hero, season) || {};
      const meta = metaScore(stats);
      const prefValue = type === 'ban' ? teamPreference(enemyCtx, hero.id) : teamPreference(ownCtx, hero.id);
      const rawPref = (type === 'ban' ? enemyCtx : ownCtx).games
        ? ((type === 'ban' ? enemyCtx : ownCtx).pickStats.get(hero.id)?.n || 0) / ((type === 'ban' ? enemyCtx : ownCtx).games)
        : 0;
      const syn = synergyDetail(type === 'ban' ? enemyCtx : ownCtx, type === 'ban' ? enemyPicks : ownPicks, hero.id);
      const counter = type === 'pick' && !peak ? counterDetail(season, hero.id, enemyPicks) : { score: 0.5, best: null };
      const banTendency = type === 'ban' ? teamBanTendency(enemyCtx, hero.id) : 0;

      // Head-to-head Ban/Pick behavior of both teams. When these two teams
      // have met, use their matchup data; otherwise fall back to the
      // opponent's overall season data for the same hero.
      const enemySideBehavior = teamSideBehavior(enemySideScope.ctx, hero.id);
      const ownSideBehavior = teamSideBehavior(ownSideScope.ctx, hero.id);
      const enemyBanRate = enemySideBehavior?.banRate
        ?? (enemyCtx.games ? (enemyCtx.banStats.get(hero.id) || 0) / enemyCtx.games : 0);
      const enemyPickRate = enemySideBehavior?.pickRate
        ?? (enemyCtx.games ? (enemyCtx.pickStats.get(hero.id)?.n || 0) / enemyCtx.games : 0);
      const ownH2HPickRate = ownSideBehavior?.pickRate ?? 0;
      const h2hGames = ownSideScope.games || 0;
      const oppContest = clamp((enemyBanRate * 0.42 + enemyPickRate * 0.58) / 0.42, 0, 1);
      const ownFamiliarity = clamp(ownH2HPickRate / 0.35, 0, 1);
      const h2hPressure = oppContest * 0.72 + ownFamiliarity * 0.28;
      const slot = teamSideSlotScore(ownSideScope.ctx, type, actionSlot, hero.id);
      const slotScore = slot?.score || 0;

      let score;
      if (type === 'ban') {
        score = enemyPicks.length
          ? 0.34 * meta + 0.13 * prefValue + 0.10 * banTendency + 0.12 * syn.score + 0.13 * oppContest + 0.18 * slotScore
          : 0.42 * meta + 0.15 * prefValue + 0.11 * banTendency + 0.14 * oppContest + 0.18 * slotScore;
      } else if (peak) {
        score = 0.32 * meta + 0.24 * syn.score + 0.10 * prefValue + 0.16 * h2hPressure + 0.18 * slotScore;
      } else {
        score = 0.26 * meta + 0.20 * syn.score + 0.10 * prefValue + 0.10 * counter.score + 0.16 * h2hPressure + 0.18 * slotScore;
      }
      score = clamp(score, 0, 1);

      const reasons = [];
      const slotLabel = `${type === 'ban' ? 'B' : 'P'}${actionSlot + 1}`;
      if (slot) {
        const slotRate = slot.exact >= 0.04 ? slot.exact : slot.frequency;
        if (slotRate >= 0.06) {
          reasons.push({ text: `${sideLabel}同边全KPL ${slotLabel} ${pct(slotRate)}`, hot: slotRate >= 0.15 });
        }
      }

      if (type === 'ban') {
        if (stats.banRate >= 0.35) reasons.push({ text: `Ban ${pct(stats.banRate)}`, hot: stats.banRate >= 0.5 });
        if (h2hGames) {
          if (enemyPickRate >= 0.08) reasons.push({ text: `${enemySideLabel}同边全KPL Pick ${pct(enemyPickRate)}`, hot: enemyPickRate >= 0.16 });
          if (enemyBanRate >= 0.12) reasons.push({ text: `${enemySideLabel}同边全KPL Ban ${pct(enemyBanRate)}`, hot: false });
        } else {
          if (rawPref >= 0.08) reasons.push({ text: `对方常用 ${pct(rawPref)}`, hot: rawPref >= 0.16 });
          if (banTendency >= 0.18) reasons.push({ text: '对手常Ban', hot: false });
        }
        if (syn.best) reasons.push({ text: `契合 ${syn.best.name}`, hot: false });
        if (!reasons.length) reasons.push({ text: `胜率 ${pct(stats.winRate)}`, hot: false });
      } else {
        if (syn.best) reasons.push({ text: `搭档 ${syn.best.name} ${pct(syn.best.rate)}`, hot: syn.best.rate >= 0.25 });
        if (rawPref >= 0.06) reasons.push({ text: `战队偏好 ${pct(rawPref)}`, hot: false });
        if (h2hGames) {
          if (enemyBanRate >= 0.08) reasons.push({ text: `${enemySideLabel}同边全KPL 常Ban ${pct(enemyBanRate)}`, hot: enemyBanRate >= 0.25 });
          if (enemyPickRate >= 0.08) reasons.push({ text: `${enemySideLabel}同边全KPL 常用 ${pct(enemyPickRate)}`, hot: false });
          if (ownH2HPickRate >= 0.08) reasons.push({ text: `${sideLabel}同边全KPL 常用 ${pct(ownH2HPickRate)}`, hot: false });
        }
        if (!peak && counter.best && counter.best.n >= 3) reasons.push({ text: `对位 ${counter.best.name} ${pct(counter.best.wr)}`, hot: counter.best.wr >= 0.55 });
        if (peak) reasons.push({ text: '盲选版本位', hot: false });
        if (!reasons.length) reasons.push({ text: `胜率 ${pct(stats.winRate)}`, hot: false });
      }

      recommendations.push({
        hero,
        stats,
        score,
        displayScore: Math.max(1, Math.round(score * 99)),
        reasons: reasons.slice(0, 3),
        rawPref,
        syn,
        counter,
        h2hGames,
        h2hSide: side,
        enemyBanRate,
        enemyPickRate,
        ownH2HPickRate,
        slot,
        slotLabel
      });
    }

    recommendations.sort((a, b) => b.score - a.score || statsPresence(b.stats) - statsPresence(a.stats));
    return recommendations;
  }

  function topSlotHero(maps, slot, games, unavailable) {
    const counts = maps?.[slot];
    if (!counts || !games) return null;
    let best = null;
    for (const [heroId, count] of counts) {
      const id = Number(heroId);
      if (!id || unavailable.has(id)) continue;
      if (!best || count > best.count) best = { id, count, rate: count / games };
    }
    return best;
  }

  function renderCoachSlotProbabilities(series, game, action, teams) {
    const ownTeam = teams[action.side];
    const enemyTeam = teams[action.side === 'blue' ? 'red' : 'blue'];
    if (!ownTeam || !enemyTeam || ownTeam === ALL || enemyTeam === ALL) return '';
    const peak = game.mode === 'peak';
    const selectedSide = action.side;
    const sideName = selectedSide === 'blue' ? '蓝方' : '红方';
    const currentSlot = Math.min(4, (action.type === 'ban' ? game[action.side].bans : game[action.side].picks).filter(Boolean).length);
    const probKey = `${game.no}|${selectedSide}|${action.type}|${currentSlot}`;
    if (!state.coachProb || state.coachProb.key !== probKey) {
      state.coachProb = { key: probKey, gameNo: game.no, type: action.type, slot: currentSlot };
    }
    const selection = state.coachProb;
    const selectedGameNo = selection.gameNo === 'ALL'
      ? 'ALL'
      : Math.min(series.bo, Math.max(1, Number(selection.gameNo) || game.no));
    const selectedType = selection.type === 'ban' && !peak ? 'ban' : 'pick';
    const selectedSlot = Math.min(4, Math.max(0, Number(selection.slot) || 0));
    const pairSlots = selectedType === 'pick' ? pairedPickSlots(selectedSide, selectedSlot) : [selectedSlot];
    const selectedCode = selectedType === 'ban'
      ? `B${selectedSlot + 1}`
      : pairSlots.map((slot) => `P${slot + 1}`).join(' + ');
    const globalPickCode = selectedType === 'pick'
      ? pairSlots.map((slot) => `P${pickSlotGlobalNumber(selectedSide, slot)}`).join(' + ')
      : '';
    const selectedGameLabel = selectedGameNo === 'ALL' ? '全部小局' : `G${selectedGameNo}`;
    const unavailable = new Set([
      ...game.blue.bans.filter(Boolean).map(Number),
      ...game.red.bans.filter(Boolean).map(Number),
      ...game.blue.picks.filter(Boolean).map(Number),
      ...game.red.picks.filter(Boolean).map(Number)
    ]);
    const roleLocks = pickedRoleLocks(selectedSide, selectedType, game);
    const gameButtons = [
      { value: 'ALL', label: '全部' },
      ...Array.from({ length: series.bo }, (_, index) => ({ value: index + 1, label: `G${index + 1}` }))
    ].map((item) => `<button type="button" class="coach-prob-filter ${String(selectedGameNo) === String(item.value) ? 'is-active' : ''}" data-coach-game="${item.value}">${item.label}</button>`).join('');
    const slotButtons = (type) => [0, 1, 2, 3, 4].map((slot) => {
      const disabled = type === 'ban' && peak;
      const active = selectedType === type && (type === 'pick' ? pairSlots.includes(slot) : selectedSlot === slot);
      return `<button type="button" class="coach-prob-filter ${active ? 'is-active' : ''}" data-coach-slot-type="${type}" data-coach-slot-index="${slot}" ${disabled ? 'disabled' : ''}>${type === 'ban' ? 'B' : 'P'}${slot + 1}</button>`;
    }).join('');
    const scopes = series.season === ALL
      ? [{ key: ALL, label: '两赛季合并' }]
      : [{ key: series.season, label: '本赛季' }, { key: ALL, label: '两赛季合并' }];
    const scopeHtml = scopes.map(({ key, label }) => {
      const ctx = selectedGameNo === 'ALL'
        ? getH2HSideCtx(key, ownTeam, enemyTeam, selectedSide)
        : getH2HGameCtx(key, ownTeam, enemyTeam, selectedSide, selectedGameNo);
      const games = ctx?.globalGames || 0;
      const maps = selectedType === 'ban'
        ? ctx?.banSlots?.[String(ownTeam)]
        : ctx?.pickSlots?.[String(ownTeam)];
      const slotColumns = (selectedType === 'pick' ? pairSlots : [selectedSlot]).map((slot) => {
        const counts = maps?.[slot] || new Map();
        const entries = [...counts.entries()]
          .map(([heroId, count]) => ({ heroId: Number(heroId), count: Number(count) }))
          .filter((row) => row.heroId && row.count)
          .sort((a, b) => b.count - a.count || a.heroId - b.heroId);
        const list = entries.length
          ? entries.map(({ heroId, count }) => {
              const hero = state.heroMap.get(heroId);
              const exactLocked = unavailable.has(heroId);
              const roleLocked = !peak && hero && roleLocks.size && heroRoles(hero).some((role) => roleLocks.has(role));
              const locked = exactLocked || roleLocked;
              const lockLabel = exactLocked ? '已封锁/已选' : roleLocked ? '同位置封锁' : '';
              return `<div class="coach-prob-hero ${locked ? 'is-locked' : ''}">
                <span>${esc(hero?.name || '—')}${lockLabel ? `<i>${lockLabel}</i>` : ''}</span>
                <small>${count}/${games}</small>
                <b>${games ? pct(count / games, 1) : '—'}</b>
              </div>`;
            }).join('')
          : '<div class="coach-slot-empty">该范围暂无此位置样本</div>';
        return `<div class="coach-prob-pair-col">
          ${pairSlots.length > 1 ? `<div class="coach-prob-subhead">P${slot + 1} · 全局P${pickSlotGlobalNumber(selectedSide, slot)}</div>` : ''}
          <div class="coach-prob-list">${list}</div>
        </div>`;
      });
      const distribution = pairSlots.length > 1
        ? `<div class="coach-prob-pair">${slotColumns.join('')}</div>`
        : slotColumns.join('');
      const poolCounts = new Map();
      for (const slotMaps of [ctx?.banSlots?.[String(ownTeam)], ctx?.pickSlots?.[String(ownTeam)]]) {
        if (!slotMaps) continue;
        for (const map of slotMaps) {
          for (const [heroId, count] of map) {
            const id = Number(heroId);
            if (!id || unavailable.has(id)) continue;
            poolCounts.set(id, (poolCounts.get(id) || 0) + count);
          }
        }
      }
      const poolRows = [...poolCounts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([id, count]) => `<span class="coach-pool-chip">${esc(state.heroMap.get(id)?.name || '—')} <b>${games ? pct(count / games, 0) : '—'}</b></span>`)
        .join('');
      return `<div class="coach-slot-scope">
        <div class="coach-slot-scope-head"><b>${esc(label)}</b><span>${games} 局 · ${selectedCode}${pairSlots.length > 1 ? `（全局 ${globalPickCode}）` : ''} 概率</span></div>
        ${games ? `${distribution}
        <div class="coach-pool"><span>封锁后剩余英雄 BP 率</span><div>${poolRows || '<i>暂无可用样本</i>'}</div></div>`
          : '<div class="coach-slot-empty">暂无对位全局 BP 样本</div>'}
      </div>`;
    }).join('');
    return `<div class="coach-slot-prob">
      <div class="coach-slot-head">
        <div><b>BP 位概率</b><small>对位 ${esc(teamName(enemyTeam))} · ${selectedGameLabel} · ${sideName}${selectedCode}${pairSlots.length > 1 ? `（全局 ${globalPickCode}）同时 Pick` : ''}</small></div>
        <span class="tag green">LIVE</span>
      </div>
      <div class="coach-prob-games"><span>小局</span>${gameButtons}</div>
      <div class="coach-prob-slot-groups">
        ${peak ? '' : `<div><span>BAN</span>${slotButtons('ban')}</div>`}
        <div><span>PICK</span>${slotButtons('pick')}</div>
      </div>
      ${scopeHtml}
      <div class="coach-prob-note">概率 = 该英雄在此位置的出场次数 / 该范围全局 BP 样本局数。当前已封锁英雄会标记但保留历史概率。</div>
    </div>`;
  }

  function renderCoachPanel() {
    const draft = getDraft();
    const action = currentAction(draft);
    const root = $('#coachPanel');
    if (!root) return;
    if (!action) {
      const game = getGame();
      const series = getSeries();
      const sideSummary = (side) => {
        const picks = game[side].picks.filter(Boolean).map(Number);
        const stats = picks.map((id) => heroStat(state.heroMap.get(id), series.season)).filter(Boolean);
        const avg = stats.length ? stats.reduce((sum, row) => sum + (row.winRate || 0), 0) / stats.length : null;
        return { picks, avg };
      };
      const blue = sideSummary('blue');
      const red = sideSummary('red');
      const teams = gameTeams(series, game);
      const winnerTeam = seriesWinner(series);
      const winnerName = game.winner ? teamName(game.winner) : '';
      root.innerHTML = `
        <div class="coach-head">
          <div>
            <div class="coach-title">${ICONS.spark} 教练席建议</div>
            <div class="panel-sub">第 ${game.no} 局 BP 已结束 · ${game.mode === 'peak' ? '巅峰对决' : '全局 BP'}</div>
          </div>
          <span class="tag ${winnerTeam ? 'gold' : 'green'}">${winnerTeam ? 'SERIES COMPLETE' : 'GAME COMPLETE'}</span>
        </div>
        <div class="coach-complete-grid">
          <div class="coach-complete-row"><span class="coach-side-dot blue"></span><div><b>蓝方 · ${esc(teamName(teams.blue))}</b><small>${blue.picks.length}/5 人 · 平均胜率 ${blue.avg === null ? '—' : pct(blue.avg)}</small></div></div>
          <div class="coach-complete-row"><span class="coach-side-dot red"></span><div><b>红方 · ${esc(teamName(teams.red))}</b><small>${red.picks.length}/5 人 · 平均胜率 ${red.avg === null ? '—' : pct(red.avg)}</small></div></div>
        </div>
        <div class="coach-empty" style="padding-top:6px">
          ${winnerTeam ? `${esc(teamName(winnerTeam))} 已赢得系列赛。` : game.winner ? `本局胜方：${esc(winnerName)}。${series.currentGame >= series.games.length ? '这是系列赛最后一局。' : '可进入下一局。'}` : '本局阵容已锁定。请先在顶部“本局胜方”中选择蓝方或红方获胜。'}
        </div>
        <div style="padding:0 15px 10px;display:flex;gap:7px;flex-wrap:wrap">
          ${winnerTeam
            ? `<span class="tag gold">${ICONS.trophy} ${esc(teamName(winnerTeam))} 获胜</span>`
            : `<button class="btn primary" type="button" data-next-game ${game.winner ? '' : 'disabled'}>${game.winner ? `进入第 ${series.currentGame + 1} 局` : '请先选择本局胜方'} ${ICONS.arrow}</button>`}
          <button class="btn ghost" type="button" data-copy-draft>${ICONS.copy} 复制本局</button>
        </div>
        <div class="coach-foot">建议由版本数据、搭档概率、双方同边全KPL历史 Ban/Pick 与战队偏好综合计算，仅供复盘与训练参考。</div>`;
      return;
    }
    const series = getSeries();
    const game = getGame();
    const peak = game.mode === 'peak';
    const teams = gameTeams(series, game);
    const sideName = action.side === 'blue' ? '蓝方' : '红方';
    const typeName = action.type === 'ban' ? '封锁' : '选取';
    const teamLabel = teamName(teams[action.side]);
    const sideScope = getTeamSideScope(series.season, teams[action.side], action.side);
    const h2hLabel = sideScope.games
      ? `${sideName} · ${sideScope.scope}全KPL同边 ${sideScope.games} 局`
      : `${sideName}暂无同边全KPL样本`;
    const recommendations = state.currentRecs.slice(0, 10);
    const rows = recommendations.map((rec, index) => {
      const reasons = rec.reasons.map((reason) => `<span class="rec-reason ${reason.hot ? 'hot' : ''}">${esc(reason.text)}</span>`).join('');
      return `<button class="rec-card" type="button" data-pick-hero="${rec.hero.id}" title="将 ${esc(rec.hero.name)} 加入当前 BP">
        <span class="rec-rank">${String(index + 1).padStart(2, '0')}</span>
        <span class="rec-portrait">${heroImage(rec.hero, '', rec.hero.name)}</span>
        <span class="rec-body">
          <span class="rec-name">${esc(rec.hero.name)}</span>
          <span class="rec-reasons">${reasons}</span>
        </span>
        <span class="rec-score">${rec.displayScore}<small>指数</small></span>
        <span class="rec-bar"><i style="width:${rec.displayScore}%"></i></span>
      </button>`;
    }).join('');
    root.innerHTML = `
      <div class="coach-head">
        <div>
          <div class="coach-title">${ICONS.spark} 教练席建议</div>
          <div class="panel-sub">${esc(seasonLabel(series.season))} · BO${series.bo} · 第 ${game.no} 局 · ${esc(teamLabel)} · ${esc(h2hLabel)}</div>
        </div>
        <span class="tag ${peak ? 'green' : 'gold'}">${peak ? 'BLIND' : 'DATA MODEL'}</span>
      </div>
      <div class="coach-action ${action.side}">
        <small>${peak ? 'PEAK · 盲选' : `${sideName} ${action.type === 'pick' ? 'PICK' : 'BAN'} · 当前手`}</small>
        <strong><span class="side-dot"></span>${sideName}${peak ? '盲选' : typeName}优先级</strong>
      </div>
      <div class="rec-list">${rows || '<div class="coach-empty">暂无可推荐英雄</div>'}</div>
      ${renderCoachSlotProbabilities(series, game, action, teams)}
      <div class="coach-foot">${peak ? '巅峰对决为双方盲选；建议按当前选边（蓝/红）分别统计同边全KPL历史，参考版本强度、己方搭档、同边 Ban/Pick 位倾向；已排除与己方已选英雄同位置的候选。元流之子任一分路被任一方选中后，双方本局其余分路均锁定。' : '综合版本 Ban/Pick 率、同队搭档率、战队偏好，以及本方与对方各自同边对全KPL战队的历史；B/P 位权重前重后轻；Ban 排除对方已选英雄的常用分路，Pick 排除己方已选英雄的常用分路；多分路英雄的次要分路不排除。元流之子任一分路被选后，己方全局锁定五个分路，对方本局锁定五个分路，并移出己方 Pick 建议。全局 BP 已排除己方历史选用。'} 非官方预测。</div>`;
  }

  function heroAvailability(heroId, side, type, series, game) {
    const id = Number(heroId);
    const isBlueSide = side === 'blue';
    const bluePick = game.blue.picks.includes(id);
    const redPick = game.red.picks.includes(id);
    const banned = game.blue.bans.includes(id) || game.red.bans.includes(id);
    const ownPick = isBlueSide ? bluePick : redPick;
    const otherPick = isBlueSide ? redPick : bluePick;
    const prior = priorPicks(series, side, game.no);
    const labels = [];
    let disabled = false;
    let mainLabel = '';
    const familyPicked = hasYuanliu([...game.blue.picks, ...game.red.picks]);
    const familyPrior = type === 'pick' && hasYuanliu(prior);
    if (type === 'pick' && isYuanliuId(id) && !bluePick && !redPick && (familyPicked || familyPrior)) {
      return {
        disabled: true,
        labels: [familyPrior ? '己方全局已出元流之子' : '元流之子已锁定'],
        mainLabel: familyPrior ? '己方全局已出元流之子' : '元流之子已锁定',
        family: true
      };
    }
    if (game.mode === 'peak') {
      if (bluePick) labels.push('蓝方已选');
      if (redPick) labels.push('红方已选');
      if (ownPick) {
        disabled = true;
        mainLabel = `${isBlueSide ? '蓝方' : '红方'}已选`;
      }
      if (prior.has(id)) labels.push('全局已用');
      return { disabled, labels, mainLabel, peak: true, otherPick };
    }
    if (banned) {
      return { disabled: true, labels: ['已 BAN'], mainLabel: '已 BAN', banned: true };
    }
    if (bluePick || redPick) {
      return { disabled: true, labels: [bluePick ? '蓝方已选' : '红方已选'], mainLabel: bluePick ? '蓝方已选' : '红方已选', picked: true };
    }
    if (type === 'pick' && prior.has(id)) {
      return { disabled: true, labels: ['己方全局已用'], mainLabel: '己方全局已用', prior: true };
    }
    if (prior.has(id)) labels.push('己方曾用');
    return { disabled, labels, mainLabel };
  }

  function completedHeroState(heroId, series, game) {
    const id = Number(heroId);
    if (game.blue.bans.includes(id) || game.red.bans.includes(id)) {
      return { disabled: true, labels: ['已 BAN'], mainLabel: '已 BAN' };
    }
    const labels = [];
    if (game.blue.picks.includes(id)) labels.push('蓝方已选');
    if (game.red.picks.includes(id)) labels.push('红方已选');
    const bluePrior = priorPicks(series, 'blue', game.no);
    const redPrior = priorPicks(series, 'red', game.no);
    if (bluePrior.has(id)) labels.push('蓝方全局已用');
    if (redPrior.has(id)) labels.push('红方全局已用');
    if (isYuanliuId(id) && !game.blue.picks.includes(id) && !game.red.picks.includes(id)) {
      if (hasYuanliu([...game.blue.picks, ...game.red.picks])) labels.push('元流之子已锁定');
      if (hasYuanliu(bluePrior)) labels.push('蓝方全局已出元流之子');
      if (hasYuanliu(redPrior)) labels.push('红方全局已出元流之子');
    }
    return {
      disabled: labels.length > 0,
      labels,
      mainLabel: labels[0] || ''
    };
  }

  function syncDraftPoolHeight() {
    if (state.view !== 'draft') return;
    const pool = $('.pool-panel');
    const coach = $('.coach-panel');
    const grid = $('#heroGrid');
    if (!pool || !coach || !grid) return;
    if (window.innerWidth <= 1120) {
      pool.style.height = '';
      grid.style.height = '';
      return;
    }
    const poolTop = pool.getBoundingClientRect().top;
    const coachBottom = coach.getBoundingClientRect().bottom;
    const height = Math.max(360, Math.round(coachBottom - poolTop));
    pool.style.height = `${height}px`;
    grid.style.height = '';
  }

  function renderDraftGrid() {
    const grid = $('#heroGrid');
    if (!grid) return;
    const series = getSeries();
    const game = getViewGame();
    const editable = canEditCurrentGame();
    const draft = getDraft();
    const action = editable ? currentAction(draft) : null;
    const peak = game.mode === 'peak';
    const recMap = new Map();
    state.currentRecs.forEach((rec, index) => recMap.set(rec.hero.id, { rank: index + 1, score: rec.displayScore }));
    const query = state.draftFilter.q.toLocaleLowerCase('zh-CN');
    const role = state.draftFilter.role;
    const sort = state.draftFilter.sort;

    let heroes = state.data.heroes.filter((hero) => {
      if (role !== '全部' && !heroRoles(hero).includes(role)) return false;
      if (query && !hero.name.toLocaleLowerCase('zh-CN').includes(query)) return false;
      return true;
    });

    const value = (hero) => {
      const stats = heroStat(hero, series.season) || {};
      if (sort === 'recommend' && action) return recMap.get(hero.id)?.score || 0;
      if (sort === 'win') return stats.winRate ?? -1;
      if (sort === 'ban') return stats.banRate || 0;
      if (sort === 'pick') return stats.pickRate || 0;
      return statsPresence(stats);
    };
    heroes = heroes.sort((a, b) => value(b) - value(a) || a.id - b.id);

    const count = $('#poolCount');
    if (count) count.textContent = `${heroes.length} / ${state.data.heroes.length} 位`;
    const meta = $('#poolMeta');
    if (meta) {
      const activeSide = action?.side;
      const sideLabel = activeSide === 'blue' ? '蓝方' : activeSide === 'red' ? '红方' : '';
      if (isReviewingDraft()) {
        meta.textContent = `回看 G${game.no} · 只读 · 点击英雄头像可查看详情`;
      } else if (!editable) {
        meta.textContent = '本局已确认结束与胜方 · BP 只读，点击头像可查看详情';
      } else if (peak) {
        const blueCount = game.blue.picks.filter(Boolean).length;
        const redCount = game.red.picks.filter(Boolean).length;
        meta.textContent = gameIsComplete(game)
          ? '巅峰对决 BP 完成 · 可点击已选头像换英雄'
          : `巅峰对决 · 无 Ban · 双方盲选 · 蓝 ${blueCount}/5 · 红 ${redCount}/5`;
      } else if (action) {
        meta.textContent = `${sideLabel}${action.type === 'ban' ? '禁用' : '选人'} · ${phaseLabel(game.step)} · 全局 BP 已锁定己方历史选用`;
      } else {
        meta.textContent = '本局 BP 已完成 · 可点击已选头像换英雄，或选择胜方';
      }
    }

    if (!heroes.length) {
      grid.innerHTML = '<div class="empty-grid">没有找到符合条件的英雄</div>';
      return;
    }

    grid.innerHTML = heroes.map((hero) => {
      const stats = heroStat(hero, series.season) || {};
      const availability = action
        ? heroAvailability(hero.id, action.side, action.type, series, game)
        : completedHeroState(hero.id, series, game);
      const rec = recMap.get(hero.id);
      const isRec = Boolean(rec && rec.rank <= 8 && !availability.disabled);
      const roleName = heroRoles(hero)[0];
      const miniTags = availability.labels
        .filter((label) => label !== availability.mainLabel)
        .slice(0, 2)
        .map((label) => `<span class="hero-mini-tag">${esc(label)}</span>`)
        .join('');
      return `<button type="button" class="hero-card avatar-card ${isRec ? 'is-rec' : ''} ${availability.disabled ? 'is-used' : ''}" data-hero-id="${hero.id}" ${availability.disabled ? 'data-unavailable="1"' : ''} title="${esc(hero.name)} · ${esc(roleName)} · Ban ${pct(stats.banRate)} · Pick ${pct(stats.pickRate)} · 胜率 ${pct(stats.winRate)}">
        <span class="hero-avatar">
          ${heroImage(hero, '', hero.name)}
          <span class="avatar-role ${roleClass(roleName)}">${esc(roleName)}</span>
          ${isRec ? `<span class="rec-flag">${rec.score}</span>` : ''}
          ${miniTags ? `<span class="hero-mini-tags">${miniTags}</span>` : ''}
          <span class="avatar-shade"></span>
          <span class="avatar-name">${esc(hero.name)}</span>
          ${availability.disabled ? `<span class="used-label">${esc(availability.mainLabel)}</span>` : ''}
        </span>
      </button>`;
    }).join('');
  }

  function pairFor(ctx, a, b) {
    return ctx.pairs.get(pairKey(a, b)) || { n: 0, w: 0 };
  }

  function lineupCounterStats(ownPicks, enemyPicks, season, teamId = null, teamSeason = ALL, opponentId = null) {
    let games = 0;
    let wins = 0;
    let pairs = 0;
    for (const ownId of ownPicks) {
      for (const enemyId of enemyPicks) {
        const row = opponentId
          ? getTeamMatchupCounter(teamId, opponentId, ownId, enemyId, teamSeason)
          : teamId
            ? getTeamCounter(teamId, ownId, enemyId, teamSeason)
            : getCounter(season, ownId, enemyId);
        if (!row?.n) continue;
        games += Number(row.n) || 0;
        wins += Number(row.w) || 0;
        pairs += 1;
      }
    }
    return {
      games,
      wins,
      pairs,
      totalPairs: ownPicks.length * enemyPicks.length,
      winRate: games ? wins / games : null
    };
  }

  function roleLineupCounterStats(ownPicks, teamId, opponentId, season) {
    let games = 0;
    let wins = 0;
    let pairs = 0;
    for (const ownId of ownPicks) {
      for (const role of ROLE_ORDER) {
        const row = getTeamRoleCounter(teamId, opponentId, ownId, role, season);
        if (!row?.n) continue;
        games += Number(row.n) || 0;
        wins += Number(row.w) || 0;
        pairs += 1;
      }
    }
    return {
      games,
      wins,
      pairs,
      totalPairs: ownPicks.length * ROLE_ORDER.length,
      winRate: games ? wins / games : null
    };
  }

  function renderDraftAnalysis() {
    const root = $('#draftAnalysis');
    if (!root) return;
    const series = getSeries();
    const game = getViewGame();
    root.innerHTML = ['blue', 'red'].map((side) => {
      const isBlue = side === 'blue';
      const teamId = gameTeamId(series, game, side);
      const team = teamId === ALL ? null : state.teamMap.get(String(teamId));
      const teamStats = team ? teamStat(team, series.season) : null;
      const picks = game[side].picks.filter(Boolean).map(Number);
      const enemyPicks = game[side === 'blue' ? 'red' : 'blue'].picks.filter(Boolean).map(Number);
      const heroes = picks.map((id) => state.heroMap.get(id)).filter(Boolean);
      const statsList = heroes.map((hero) => heroStat(hero, series.season)).filter(Boolean);
      const avgWin = statsList.length
        ? statsList.reduce((sum, stats) => sum + (stats.winRate || 0), 0) / statsList.length
        : null;
      const currentKey = currentSeasonKey();
      const opponentId = gameTeamId(series, game, side === 'blue' ? 'red' : 'blue');
      const teamScopeReady = teamId !== ALL && opponentId !== ALL;
      const matchupAll = lineupCounterStats(picks, enemyPicks, series.season);
      const matchupTeamCurrent = roleLineupCounterStats(picks, teamId, opponentId, currentKey);
      const matchupTeam = roleLineupCounterStats(picks, teamId, opponentId, ALL);
      const prior = priorPicksForTeam(series, teamId, game.no).size;
      const ctx = getCtx(series.season, teamId);
      let samplePairs = 0;
      let pairWins = 0;
      let pairGames = 0;
      for (let i = 0; i < picks.length; i += 1) {
        for (let j = i + 1; j < picks.length; j += 1) {
          const pair = pairFor(ctx, picks[i], picks[j]);
          if (pair.n) {
            samplePairs += 1;
            pairGames += pair.n;
            pairWins += pair.w;
          }
        }
      }
      const pairWin = pairGames ? pairWins / pairGames : null;
      const lineup = heroes.length
        ? heroes.map((hero) => `<span class="analysis-hero">${heroImage(hero, '', hero.name)}${esc(hero.name)}</span>`).join('')
        : '<span style="color:var(--dim);font-size:9px">尚未选择英雄</span>';
      return `<section class="panel analysis-panel ${side}">
        <div class="analysis-head">
          <div class="analysis-team">
            <span class="mini-side">${isBlue ? 'BLUE' : 'RED'} SIDE</span>
            <span>${esc(team?.name || '全KPL 通用')}</span>
          </div>
          <div class="analysis-score">G${game.no} · ${samplePairs}/10 搭档 · 全局已用 ${prior}</div>
        </div>
        ${game.mode === 'peak' ? '<div class="analysis-peak-note">巅峰对决：全局限制已解除 · 无 Ban</div>' : ''}
        <div class="analysis-metrics">
          <div class="analysis-metric"><span>战队小局胜率</span><b class="${teamStats ? rateClass(teamStats.games.winRate) : ''}">${teamStats ? pct(teamStats.games.winRate) : '—'}</b></div>
          <div class="analysis-metric"><span>阵容平均胜率</span><b class="${rateClass(avgWin)}">${avgWin === null ? '—' : pct(avgWin)}</b></div>
          <div class="analysis-metric"><span>搭档组合胜率</span><b class="${rateClass(pairWin)}">${pairWin === null ? '—' : pct(pairWin)}</b></div>
        </div>
        <div class="analysis-matchups is-three">
          <div class="analysis-matchup" title="所选赛季全 KPL 中，己方每个英雄对位对方每个英雄的历史总胜率；按对位样本局数加权">
            <span>全 KPL · ${series.season === ALL ? '两赛季' : '所选赛季'}</span>
            <b class="${rateClass(matchupAll.winRate)}">${matchupAll.winRate === null ? '—' : pct(matchupAll.winRate)}</b>
            <small>${matchupAll.pairs}/${matchupAll.totalPairs || 0} 组 · ${matchupAll.games} 局</small>
          </div>
          <div class="analysis-matchup is-team" title="仅统计双方战队在${seasonLabel(currentKey)}交手时，己方每个英雄对阵对方对抗路/打野/中路/发育路/游走五个位置英雄的历史胜率；按对位样本局数加权">
            <span>本队队史 · 当前赛季</span>
            <b class="${rateClass(teamScopeReady ? matchupTeamCurrent.winRate : null)}">${!teamScopeReady || matchupTeamCurrent.winRate === null ? '—' : pct(matchupTeamCurrent.winRate)}</b>
            <small>${!teamScopeReady ? '未选择双方战队' : `${matchupTeamCurrent.pairs}/${matchupTeamCurrent.totalPairs || 0} 组 · ${matchupTeamCurrent.games} 局`}</small>
          </div>
          <div class="analysis-matchup is-team" title="仅统计双方战队最近两个赛季（2026 年度总决赛 + 2026 夏季赛）交手时，己方每个英雄对阵对方五个位置英雄的历史胜率；按对位样本局数加权">
            <span>本队队史 · 两赛季</span>
            <b class="${rateClass(teamScopeReady ? matchupTeam.winRate : null)}">${!teamScopeReady || matchupTeam.winRate === null ? '—' : pct(matchupTeam.winRate)}</b>
            <small>${!teamScopeReady ? '未选择双方战队' : `${matchupTeam.pairs}/${matchupTeam.totalPairs || 0} 组 · ${matchupTeam.games} 局`}</small>
          </div>
        </div>
        <div class="analysis-lineup">${lineup}</div>
      </section>`;
    }).join('');
  }

  function renderDraftDynamic() {
    const draft = getDraft();
    const action = canEditCurrentGame() ? currentAction(draft) : null;
    state.currentRecs = action ? getRecommendations(action.side, action.type) : [];
    const blue = $('#bluePanel');
    const red = $('#redPanel');
    const phase = $('#phasePanel');
    if (blue) blue.innerHTML = renderSidePanel('blue');
    if (red) red.innerHTML = renderSidePanel('red');
    if (phase) phase.innerHTML = renderPhasePanel();
    renderSeriesBar();
    renderDraftHeader();
    renderCoachPanel();
    renderDraftGrid();
    renderDraftAnalysis();
    applyLanguage($('#draftPage'));
    window.requestAnimationFrame(syncDraftPoolHeight);
  }

  function choosePickSlot(sideData) {
    return sideData.picks.findIndex((item) => item === null);
  }

  function pickHero(heroId) {
    if (!canEditCurrentGame()) {
      toast('当前 BP 已锁定或正在回看，不能修改英雄', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    let action = currentAction(getDraft());
    if (!action) {
      toast('本局 BP 已完成，可进入下一局或撤销调整');
      return;
    }
    if (game.mode === 'peak') {
      const sidePicks = game[series.peakActiveSide].picks;
      if (sidePicks.filter(Boolean).length >= 5) {
        const other = series.peakActiveSide === 'blue' ? 'red' : 'blue';
        if (game[other].picks.filter(Boolean).length < 5) {
          series.peakActiveSide = other;
          action = currentAction(getDraft());
          saveDrafts();
          toast(`该方已选满，自动切换到${other === 'blue' ? '蓝方' : '红方'}盲选`);
        } else {
          toast('双方盲选已满');
          return;
        }
      }
    }
    const hero = state.heroMap.get(Number(heroId));
    if (!hero) return;
    const availability = heroAvailability(hero.id, action.side, action.type, series, game);
    if (availability.disabled) {
      toast(availability.mainLabel || '该英雄当前不可选');
      return;
    }
    const sideData = game[action.side];
    let slot = -1;
    if (action.type === 'ban') {
      slot = sideData.bans.findIndex((item) => item === null);
      if (slot < 0) {
        toast('当前方 Ban 位已满');
        return;
      }
      sideData.bans[slot] = hero.id;
    } else {
      slot = choosePickSlot(sideData);
      if (slot < 0) {
        toast('当前方 Pick 位已满');
        return;
      }
      sideData.picks[slot] = hero.id;
    }
    const entry = {
      type: action.type,
      side: action.side,
      heroId: hero.id,
      slot,
      gameNo: game.no,
      peak: game.mode === 'peak'
    };
    game.actions.push(entry);
    game.step = game.actions.length;
    if (game.mode === 'peak') {
      const sideCount = game[action.side].picks.filter(Boolean).length;
      const other = action.side === 'blue' ? 'red' : 'blue';
      if (sideCount >= 5 && game[other].picks.filter(Boolean).length < 5) {
        series.peakActiveSide = other;
      }
    }
    state.lastAction = { heroId: hero.id, ts: Date.now() };
    saveDrafts();
    renderDraftDynamic();
    announce(`${action.side === 'blue' ? '蓝方' : '红方'}${action.type === 'ban' ? '禁用' : '选择'}${hero.name}`);
    if (gameIsComplete(game)) {
      toast(game.mode === 'peak' ? '巅峰对决盲选完成' : '本局 BP 完成，可进入下一局', 'success');
    }
  }

  function swapSlotGame(side, type, slot) {
    const game = getGame();
    const clone = {
      ...game,
      blue: {
        ...game.blue,
        bans: [...game.blue.bans],
        picks: [...game.blue.picks]
      },
      red: {
        ...game.red,
        bans: [...game.red.bans],
        picks: [...game.red.picks]
      }
    };
    clone[side][type === 'ban' ? 'bans' : 'picks'][slot] = null;
    return clone;
  }

  function swapDraftHero(side, type, slot, newHeroId) {
    if (!canEditCurrentGame()) {
      toast('当前 BP 已锁定或正在回看，不能修改英雄', 'info');
      return false;
    }
    const series = getSeries();
    const game = getGame();
    const key = type === 'ban' ? 'bans' : 'picks';
    const oldHeroId = Number(game[side][key][slot]);
    const targetHeroId = Number(newHeroId);
    if (!oldHeroId || !state.heroMap.has(targetHeroId)) return false;
    if (oldHeroId === targetHeroId) {
      closeModal();
      return true;
    }
    const oldValue = game[side][key][slot];
    game[side][key][slot] = null;
    const availability = heroAvailability(targetHeroId, side, type, series, game);
    if (availability.disabled) {
      game[side][key][slot] = oldValue;
      const error = $('#swapError');
      if (error) {
        error.hidden = false;
        error.textContent = `不能换成这个英雄：${availability.mainLabel}`;
      } else {
        toast(`不能换成这个英雄：${availability.mainLabel}`, 'error');
      }
      return false;
    }
    game[side][key][slot] = targetHeroId;
    const action = game.actions.find(
      (item) => item.type === type && item.side === side && Number(item.slot) === slot
    ) || game.actions.find(
      (item) => item.type === type && item.side === side && Number(item.heroId) === oldHeroId
    );
    if (action) action.heroId = targetHeroId;
    if (game.winner) {
      game.winner = null;
      toast('阵容已变更，请重新选择本局胜方', 'info', 3500);
    }
    series.complete = Boolean(seriesWinner(series));
    state.lastAction = { heroId: targetHeroId, ts: Date.now() };
    saveDrafts();
    closeModal();
    renderDraftDynamic();
    toast(
      `${type === 'ban' ? 'Ban' : 'Pick'} 位已更换为 ${state.heroMap.get(targetHeroId)?.name || '英雄'}，其他位置未改动`,
      'success',
      3000
    );
    return true;
  }

  function openSwapHeroModal(side, type, slot) {
    if (!canEditCurrentGame()) {
      toast('当前 BP 已锁定或正在回看，不能修改英雄', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    const key = type === 'ban' ? 'bans' : 'picks';
    const heroId = Number(game[side]?.[key]?.[slot]);
    const currentHero = state.heroMap.get(heroId);
    if (!currentHero) return;
    const teamId = gameTeamId(series, game, side);
    const team = teamId === ALL ? null : state.teamMap.get(String(teamId));
    const baseGame = swapSlotGame(side, type, slot);
    const sideLabel = side === 'blue' ? '蓝方' : '红方';
    const typeLabel = type === 'ban' ? 'Ban' : 'Pick';
    showModal(`
      <div class="modal-body swap-modal">
        <div class="import-head">
          <div>
            <div class="eyebrow">EDIT ${type.toUpperCase()} SLOT</div>
            <h2>更换 ${typeLabel} · ${esc(currentHero.name)}</h2>
            <p>${sideLabel} · ${esc(team?.name || '全KPL 通用')} · 只替换这一个位置，不改变其他 Ban/Pick 与当前进度。</p>
          </div>
          <button class="btn ghost" id="swapDetailsBtn" type="button">${ICONS.external} 英雄详情</button>
        </div>
        <div class="swap-toolbar">
          <input id="swapSearch" class="swap-search" type="search" placeholder="搜索英雄名…" autocomplete="off" />
          <span class="swap-hint">灰色为当前不可选</span>
        </div>
        <div class="swap-grid" id="swapGrid"></div>
        <div id="swapError" class="import-error" hidden></div>
      </div>
    `, '更换英雄');

    const grid = $('#swapGrid');
    const search = $('#swapSearch');
    const render = () => {
      if (!grid) return;
      const query = (search?.value || '').trim().toLocaleLowerCase('zh-CN');
      const heroes = state.data.heroes
        .filter((hero) => !query || hero.name.toLocaleLowerCase('zh-CN').includes(query))
        .map((hero) => {
          const availability = heroAvailability(hero.id, side, type, series, baseGame);
          const stats = heroStat(hero, series.season) || {};
          return { hero, availability, presence: statsPresence(stats) || 0 };
        })
        .sort((a, b) => {
          if (a.hero.id === heroId) return -1;
          if (b.hero.id === heroId) return 1;
          if (a.availability.disabled !== b.availability.disabled) {
            return a.availability.disabled ? 1 : -1;
          }
          return b.presence - a.presence || a.hero.id - b.hero.id;
        });
      grid.innerHTML = heroes.map(({ hero, availability }) => {
        const isCurrent = hero.id === heroId;
        const disabled = availability.disabled && !isCurrent;
        return `<button type="button" class="swap-card ${disabled ? 'is-used' : ''} ${isCurrent ? 'is-current' : ''}" data-swap-hero="${hero.id}" ${disabled ? 'disabled' : ''} title="${esc(hero.name)} · ${esc(heroRoles(hero)[0])}${availability.disabled ? ` · ${esc(availability.mainLabel)}` : ''}">
          <span class="swap-avatar">${heroImage(hero, '', hero.name)}</span>
          <span class="swap-name">${esc(hero.name)}</span>
          <span class="swap-role ${roleClass(heroRoles(hero)[0])}">${esc(heroRoles(hero)[0])}</span>
          ${isCurrent ? '<span class="swap-current">当前</span>' : availability.disabled ? `<span class="swap-used">${esc(availability.mainLabel)}</span>` : ''}
        </button>`;
      }).join('') || '<div class="empty-grid">没有找到符合条件的英雄</div>';
    };
    render();
    search?.addEventListener('input', render);
    grid?.addEventListener('click', (event) => {
      const card = event.target.closest('[data-swap-hero]');
      if (!card || card.disabled) return;
      swapDraftHero(side, type, slot, Number(card.dataset.swapHero));
    });
    $('#swapDetailsBtn')?.addEventListener('click', () => {
      openHeroModal(heroId, teamId === ALL ? null : teamId);
    });
  }

  function undoDraft() {
    if (!canEditCurrentGame()) {
      toast('当前 BP 已锁定或正在回看，不能撤销', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    if (!game.actions.length) {
      toast('当前没有可撤销的操作');
      return;
    }
    const action = game.actions.pop();
    if (action) {
      const slots = action.type === 'ban' ? game[action.side].bans : game[action.side].picks;
      if (slots[action.slot] === action.heroId) slots[action.slot] = null;
      if (game.mode === 'peak') series.peakActiveSide = action.side;
    }
    game.step = game.actions.length;
    game.complete = false;
    game.winner = null;
    series.complete = Boolean(seriesWinner(series));
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    announce('已撤销上一步');
  }

  function unlockCurrentGame() {
    if (isReviewingDraft()) {
      toast('正在回看历史小局，请先返回当前局', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    if (!game.winner && !series.complete) {
      toast('本局当前未锁定', 'info');
      return;
    }
    const previousWinner = game.winner;
    game.winner = null;
    const priorWinner = seriesWinner(series);
    if (priorWinner) {
      game.winner = previousWinner;
      series.complete = true;
      toast('该系列赛已由前序小局决出胜负，本局不能解锁', 'error', 4000);
      return;
    }
    game.complete = gameIsComplete(game);
    series.complete = false;
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    toast('本局 BP 已解锁，可继续修改英雄；请重新选择本局胜方', 'success', 4000);
  }

  function resetDraft() {
    if (isReviewingDraft()) {
      toast('正在回看历史小局，请先返回当前局再重置本局', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    if (!game.actions.length) return;
    if (!window.confirm(`确定重置第 ${game.no} 局的 BP 吗？此前的全局 BP 记录会保留。`)) return;
    series.games[game.no - 1] = createGame(game.no, series.bo);
    series.complete = Boolean(seriesWinner(series));
    series.peakActiveSide = 'blue';
    state.reviewGameNo = null;
    state.lastAction = null;
    saveDrafts();
    renderDraftDynamic();
    toast(`第 ${game.no} 局已重置`);
  }

  async function copyDraft() {
    const series = getSeries();
    const game = getGame();
    const teams = gameTeams(series, game);
    const heroName = (id) => state.heroMap.get(Number(id))?.name || '—';
    const banText = (side) => game[side].bans.filter(Boolean).map(heroName).join(' / ') || '—';
    const pickText = (side) => game[side].picks.filter(Boolean).map(heroName).join(' / ') || '—';
    const priorText = (side) => [...priorPicks(series, side, game.no)].map(heroName).join(' / ') || '—';
    const text = [
      '【KPL BP 演练室】',
      `赛季：${seasonLabel(series.season)} · BO${series.bo} · 第 ${game.no} 局`,
      `模式：${game.mode === 'peak' ? '巅峰对决（无 Ban / 双方盲选）' : '全局 BP'}`,
      `蓝方：${teamName(teams.blue)}`,
      game.mode === 'peak' ? 'Ban：无' : `Ban：${banText('blue')}`,
      `Pick：${pickText('blue')}`,
      `全局已用：${priorText('blue')}`,
      `红方：${teamName(teams.red)}`,
      game.mode === 'peak' ? 'Ban：无' : `Ban：${banText('red')}`,
      `Pick：${pickText('red')}`,
      `全局已用：${priorText('red')}`,
      `本局进度：${game.mode === 'peak' ? `${game.blue.picks.filter(Boolean).length + game.red.picks.filter(Boolean).length}/10 盲选` : `${game.step}/20`}`
    ].join('\n');
    const ok = await copyText(text);
    toast(ok ? '本局阵容已复制到剪贴板' : '复制失败，请手动选择文本', ok ? 'success' : 'error');
  }

  function normalizeHeroImportKey(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[\s()（）·._#-]/g, '');
  }

  function buildHeroImportLookup() {
    const lookup = new Map();
    for (const hero of state.data.heroes) {
      lookup.set(normalizeHeroImportKey(hero.name), hero);
      lookup.set(String(hero.id), hero);
    }
    return lookup;
  }

  function parseImportSide(value) {
    const raw = String(value ?? '').trim().toLowerCase();
    if (['blue', 'b', '蓝', '蓝方', '1'].includes(raw)) return 'blue';
    if (['red', 'r', '红', '红方', '2'].includes(raw)) return 'red';
    return null;
  }

  function parseImportType(value) {
    const raw = String(value ?? '').trim().toLowerCase().replace(/\d+$/, '');
    if (['ban', 'b', '禁用', 'ban位', 'ban人'].includes(raw)) return 'ban';
    if (['pick', 'p', '选', '选择', '选取', '选人'].includes(raw)) return 'pick';
    return null;
  }

  function findImportHero(value, lookup) {
    const raw = String(value ?? '').trim();
    if (!raw) return null;
    const direct = lookup.get(raw) || lookup.get(normalizeHeroImportKey(raw));
    if (direct) return direct;
    // Also accept "英雄名 + 分路" annotations.
    const first = raw.split(/\s+/)[0];
    return lookup.get(normalizeHeroImportKey(first)) || null;
  }

  function parseImportActionObject(item, lookup, index) {
    if (!item || typeof item !== 'object') {
      throw new Error(`第 ${index + 1} 条动作格式不正确`);
    }
    const type = parseImportType(item.type ?? item.action ?? item.kind ?? item.op);
    const side = parseImportSide(item.side ?? item.camp ?? item.team ?? item.color);
    const hero = findImportHero(
      item.hero ?? item.heroName ?? item.hero_name ?? item.name ?? item.heroId ?? item.hero_id ?? item.id,
      lookup
    );
    if (!type || !side || !hero) {
      throw new Error(`第 ${index + 1} 条动作缺少类型、方或英雄`);
    }
    return { type, side, heroId: hero.id, hero };
  }

  function parseExportedDraftActions(source) {
    const game = getGame();
    const lookup = buildHeroImportLookup();
    const blocks = {
      blue: { bans: [], picks: [] },
      red: { bans: [], picks: [] }
    };
    let side = null;
    let peak = false;
    let progress = null;
    for (const line of source.split(/\r?\n/)) {
      const text = line.trim();
      if (!text) continue;
      if (/^模式\s*[：:]/.test(text)) {
        peak = text.includes('巅峰');
        continue;
      }
      if (/^蓝方\s*[：:]/.test(text)) {
        side = 'blue';
        continue;
      }
      if (/^红方\s*[：:]/.test(text)) {
        side = 'red';
        continue;
      }
      const progressMatch = text.match(/^本局进度\s*[：:]\s*(\d+)\s*\/\s*(\d+)/);
      if (progressMatch) {
        progress = Number(progressMatch[1]);
        continue;
      }
      if (!side) continue;
      const banMatch = text.match(/^Ban\s*[：:]\s*(.*)$/i);
      const pickMatch = text.match(/^Pick\s*[：:]\s*(.*)$/i);
      const list = banMatch ? blocks[side].bans : pickMatch ? blocks[side].picks : null;
      if (!list) continue;
      const raw = (banMatch ? banMatch[1] : pickMatch[1]).trim();
      if (!raw || raw === '—' || raw === '-' || raw === '无') continue;
      for (const name of raw.split(/\s*\/\s*|\s*、\s*|\s*,\s*/)) {
        const hero = findImportHero(name, lookup);
        if (!hero) throw new Error(`导出的 BP 中找不到英雄：${name}`);
        list.push(hero);
      }
    }
    if (peak !== (game.mode === 'peak')) {
      throw new Error(peak ? '这段 BP 是巅峰对决，当前局不是巅峰对决' : '这段 BP 是全局 BP，当前局不是全局 BP');
    }
    const count = peak
      ? blocks.blue.picks.length + blocks.red.picks.length
      : blocks.blue.bans.length + blocks.red.bans.length + blocks.blue.picks.length + blocks.red.picks.length;
    if (!count) throw new Error('没有从导出文本中识别到 Ban/Pick');
    const target = progress ?? (peak ? count : 20);
    if (!Number.isInteger(target) || target < 1) throw new Error('本局进度格式不正确');
    if (peak && target > 10) throw new Error('巅峰对决最多 10 个 Pick');
    if (!peak && target > 20) throw new Error('标准 BP 最多 20 手');
    const actions = [];
    if (peak) {
      for (const sideKey of ['blue', 'red']) {
        for (const hero of blocks[sideKey].picks) {
          if (actions.length >= target) break;
          actions.push({ type: 'pick', side: sideKey, heroId: hero.id, hero });
        }
      }
      if (actions.length < target) throw new Error(`识别到 ${actions.length} 个 Pick，但进度为 ${target}`);
      return actions;
    }
    for (let step = 0; step < target; step += 1) {
      const expected = DRAFT_STEPS[step];
      if (!expected) throw new Error(`第 ${step + 1} 手超出标准 BP 范围`);
      const list = expected.type === 'ban'
        ? blocks[expected.side].bans
        : blocks[expected.side].picks;
      const hero = list.shift();
      if (!hero) {
        throw new Error(`导出进度为 ${target} 手，但第 ${step + 1} 手缺少 ${expected.side === 'blue' ? '蓝方' : '红方'} ${expected.type === 'ban' ? 'Ban' : 'Pick'}`);
      }
      actions.push({ type: expected.type, side: expected.side, heroId: hero.id, hero });
    }
    return actions;
  }

  function parseImportActions(text) {
    const source = String(text || '').trim();
    if (!source) throw new Error('请先粘贴 BP 或选择文件');
    if (source.includes('【KPL BP 演练室】') || /本局进度\s*[：:]/.test(source)) {
      return parseExportedDraftActions(source);
    }
    const lookup = buildHeroImportLookup();
    if (source.startsWith('[') || source.startsWith('{')) {
      let payload;
      try {
        payload = JSON.parse(source);
      } catch (error) {
        throw new Error(`JSON 解析失败：${error.message}`);
      }
      const list = Array.isArray(payload) ? payload : payload.actions;
      if (!Array.isArray(list) || !list.length) {
        throw new Error('JSON 中没有 actions 数组');
      }
      return list.map((item, index) => parseImportActionObject(item, lookup, index));
    }
    const actions = [];
    const lines = source.split(/\r?\n/);
    lines.forEach((line, lineIndex) => {
      const cleaned = line.split('#')[0].trim();
      if (!cleaned) return;
      const tokens = cleaned
        .replace(/[，,、;；|/]+/g, ' ')
        .replace(/[:：]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');
      let type = parseImportType(tokens[0]);
      let side = parseImportSide(tokens[1]);
      let heroText = tokens.slice(2).join(' ');
      if (!type || !side) {
        side = parseImportSide(tokens[0]);
        type = parseImportType(tokens[1]);
        heroText = tokens.slice(2).join(' ');
      }
      if (!type || !side || !heroText) {
        throw new Error(`第 ${lineIndex + 1} 行格式不正确，示例：B 蓝 关羽`);
      }
      const hero = findImportHero(heroText, lookup);
      if (!hero) throw new Error(`第 ${lineIndex + 1} 行找不到英雄：${heroText}`);
      actions.push({ type, side, heroId: hero.id, hero });
    });
    if (!actions.length) throw new Error('没有识别到有效的 BP 动作');
    return actions;
  }

  function applyImportActions(actions) {
    const series = getSeries();
    const oldGame = getGame();
    if (!actions.length) throw new Error('没有可导入的动作');
    const next = createGame(oldGame.no, series.bo);
    next.swapSides = oldGame.swapSides;
    let step = 0;
    for (const action of actions) {
      if (next.mode === 'peak') {
        if (action.type !== 'pick') {
          throw new Error('巅峰对决不能导入 Ban，只能导入 Pick');
        }
      } else {
        const expected = DRAFT_STEPS[step];
        if (!expected) {
          throw new Error(`标准 BP 最多 20 手，第 ${step + 1} 手超出范围`);
        }
        if (action.type !== expected.type || action.side !== expected.side) {
          const expectedLabel = `${expected.type === 'ban' ? 'Ban' : 'Pick'} ${expected.side === 'blue' ? '蓝方' : '红方'}`;
          throw new Error(`第 ${step + 1} 手应为 ${expectedLabel}，当前导入为 ${action.type} ${action.side === 'blue' ? '蓝方' : '红方'}`);
        }
      }
      const availability = heroAvailability(action.heroId, action.side, action.type, series, next);
      if (availability.disabled) {
        throw new Error(`${action.hero.name} 当前不可导入：${availability.mainLabel}`);
      }
      const slots = action.type === 'ban' ? next[action.side].bans : next[action.side].picks;
      const slot = slots.findIndex((value) => value === null);
      if (slot < 0) throw new Error(`${action.side === 'blue' ? '蓝方' : '红方'}的 ${action.type} 位已满`);
      slots[slot] = action.heroId;
      next.actions.push({
        type: action.type,
        side: action.side,
        heroId: action.heroId,
        slot
      });
      step += 1;
    }
    next.step = actions.length;
    next.complete = gameIsComplete(next);
    if (next.mode === 'peak' && !next.complete) {
      const blueCount = next.blue.picks.filter(Boolean).length;
      const redCount = next.red.picks.filter(Boolean).length;
      series.peakActiveSide = blueCount <= redCount ? 'blue' : 'red';
    }
    series.games[oldGame.no - 1] = next;
    series.complete = Boolean(seriesWinner(series));
    state.lastAction = null;
    saveDrafts();
    closeModal();
    renderDraftDynamic();
    toast(
      `已导入 ${actions.length} 手 BP · 当前进度 ${next.step}/${next.mode === 'peak' ? 10 : 20}`,
      'success',
      4000
    );
  }

  function ocrResultToDraftText(result) {
    const width = Number(result?.width) || 0;
    const lines = Array.isArray(result?.lines) ? result.lines : [];
    const heroes = state.data.heroes
      .map((hero) => ({ hero, key: normalizeHeroImportKey(hero.name) }))
      .filter((item) => item.key.length >= 2)
      .sort((a, b) => b.key.length - a.key.length);
    const matches = [];
    const seen = new Set();
    let banY = null;
    let pickY = null;
    const consumeGroup = (words, side) => {
      if (!words.length) return;
      const text = words.map((word) => word.text || '').join('');
      const key = normalizeHeroImportKey(text);
      const labelText = text.replace(/\s+/g, '');
      const avgX = words.reduce((sum, word) => sum + Number(word.x || 0) + Number(word.width || 0) / 2, 0) / words.length;
      const avgY = words.reduce((sum, word) => sum + Number(word.y || 0) + Number(word.height || 0) / 2, 0) / words.length;
      if (/BAN|禁用/i.test(labelText)) banY = avgY;
      if (/P(?:ICK|[℃C]K)|选择|选人|选取/i.test(labelText)) pickY = avgY;
      for (const { hero, key: heroKey } of heroes) {
        if (seen.has(hero.id) || !key.includes(heroKey)) continue;
        matches.push({ hero, x: avgX, y: avgY, side });
        seen.add(hero.id);
      }
    };
    for (const line of lines) {
      const words = Array.isArray(line.words) ? line.words : [];
      if (!words.length) continue;
      if (width) {
        // Screenshots usually put blue on the left and red on the right.
        const left = words.filter((word) => Number(word.x || 0) + Number(word.width || 0) / 2 < width / 2);
        const right = words.filter((word) => Number(word.x || 0) + Number(word.width || 0) / 2 >= width / 2);
        consumeGroup(left, 'blue');
        consumeGroup(right, 'red');
      } else {
        consumeGroup(words, 'red');
      }
    }
    if (!matches.length) return { text: '', count: 0 };
    const buckets = {
      blue: { bans: [], picks: [] },
      red: { bans: [], picks: [] }
    };
    for (const side of ['blue', 'red']) {
      const sideMatches = matches
        .filter((item) => item.side === side)
        .sort((a, b) => a.y - b.y || a.x - b.x);
      if (banY !== null && pickY !== null) {
        for (const item of sideMatches) {
          const isBan = Math.abs(item.y - banY) < Math.abs(item.y - pickY);
          if (isBan && buckets[side].bans.length < 5) buckets[side].bans.push(item.hero);
          if (!isBan && buckets[side].picks.length < 5) buckets[side].picks.push(item.hero);
        }
      } else {
        // Fallback: many replay screenshots put the BAN row above the PICK row.
        buckets[side].bans = sideMatches.slice(0, 5).map((item) => item.hero);
        buckets[side].picks = sideMatches.slice(5, 10).map((item) => item.hero);
      }
    }
    const banText = (side) => buckets[side].bans.map((hero) => hero.name).join(' / ') || '—';
    const pickText = (side) => buckets[side].picks.map((hero) => hero.name).join(' / ') || '—';
    const total = ['blue', 'red'].reduce((sum, side) => sum + buckets[side].bans.length + buckets[side].picks.length, 0);
    const complete = ['blue', 'red'].every((side) => buckets[side].bans.length === 5 && buckets[side].picks.length === 5);
    const text = [
      '【KPL BP 演练室】',
      '模式：全局 BP',
      '蓝方：截图识别',
      `Ban：${banText('blue')}`,
      `Pick：${pickText('blue')}`,
      '红方：截图识别',
      `Ban：${banText('red')}`,
      `Pick：${pickText('red')}`,
      `本局进度：${complete ? 20 : total}/20`
    ].join('\n');
    return { text, count: total, complete };
  }

  function roleAwareAvatarPicks(slots, bannedIds = new Set()) {
    const choice = new Map();
    const roles = ['对抗路', '打野', '中路', '发育路', '游走'];
    let best = { coverage: -1, score: -Infinity, picks: null };
    const visit = (index, used, picked, covered, score) => {
      if (index >= slots.length) {
        const coverage = roles.filter((role) => covered.has(role)).length;
        if (coverage > best.coverage || (coverage === best.coverage && score > best.score)) {
          best = { coverage, score, picks: [...picked] };
        }
        return;
      }
      const slot = slots[index];
      const candidates = (Array.isArray(slot.candidates) && slot.candidates.length
        ? slot.candidates
        : [{ heroId: slot.heroId, score: slot.score }]
      ).slice(0, 6);
      for (const candidate of candidates) {
        const heroId = Number(candidate.heroId);
        if (!heroId || used.has(heroId) || bannedIds.has(heroId)) continue;
        const hero = state.heroMap.get(heroId);
        if (!hero) continue;
        const role = heroRoles(hero)[0];
        const nextCovered = new Set(covered);
        if (role) nextCovered.add(role);
        used.add(heroId);
        picked.push(heroId);
        visit(index + 1, used, picked, nextCovered, score + (Number(candidate.score) || 0));
        picked.pop();
        used.delete(heroId);
      }
    };
    visit(0, new Set(), [], new Set(), 0);
    if (!best.picks) return choice;
    slots.forEach((slot, index) => choice.set(slot, best.picks[index]));
    return choice;
  }

  function avatarResultToDraftText(result) {
    const slots = Array.isArray(result?.slots) ? result.slots : [];
    if (slots.length) {
      const buckets = {
        blue: { bans: [], picks: [] },
        red: { bans: [], picks: [] }
      };
      const bannedIds = new Set(slots.filter((slot) => slot.type === 'ban').map((slot) => Number(slot.heroId)));
      const pickChoice = new Map();
      for (const side of ['blue', 'red']) {
        const pickSlots = slots.filter((slot) => slot.type === 'pick' && slot.side === side);
        for (const [slot, heroId] of roleAwareAvatarPicks(pickSlots, bannedIds)) {
          pickChoice.set(slot, heroId);
        }
      }
      for (const slot of slots) {
        const heroId = slot.type === 'pick' ? pickChoice.get(slot) || Number(slot.heroId) : Number(slot.heroId);
        const hero = state.heroMap.get(heroId);
        if (!hero) continue;
        const side = slot.side === 'blue' ? 'blue' : 'red';
        const list = slot.type === 'ban' ? buckets[side].bans : buckets[side].picks;
        if (list.length < 5) list.push(hero);
      }
      const banText = (side) => buckets[side].bans.map((hero) => hero.name).join(' / ') || '—';
      const pickText = (side) => buckets[side].picks.map((hero) => hero.name).join(' / ') || '—';
      const total = ['blue', 'red'].reduce((sum, side) => sum + buckets[side].bans.length + buckets[side].picks.length, 0);
      const complete = ['blue', 'red'].every((side) => buckets[side].bans.length === 5 && buckets[side].picks.length === 5);
      return {
        text: [
          '【KPL BP 演练室】',
          '模式：全局 BP',
          '蓝方：头像识别',
          `Ban：${banText('blue')}`,
          `Pick：${pickText('blue')}`,
          '红方：头像识别',
          `Ban：${banText('red')}`,
          `Pick：${pickText('red')}`,
          `本局进度：${complete ? 20 : total}/20`
        ].join('\n'),
        count: total,
        complete
      };
    }
    const detections = Array.isArray(result?.detections) ? result.detections : [];
    const heroes = [];
    const seen = new Set();
    for (const item of detections) {
      const hero = state.heroMap.get(Number(item.heroId));
      if (!hero || seen.has(hero.id)) continue;
      seen.add(hero.id);
      heroes.push({
        hero,
        side: item.side === 'blue' ? 'blue' : 'red',
        x: Number(item.x) || 0,
        y: Number(item.y) || 0
      });
    }
    if (!heroes.length) return { text: '', count: 0 };
    const buckets = {
      blue: { bans: [], picks: [] },
      red: { bans: [], picks: [] }
    };
    for (const side of ['blue', 'red']) {
      const items = heroes
        .filter((item) => item.side === side)
        .sort((a, b) => a.y - b.y || a.x - b.x);
      if (items.length >= 10) {
        buckets[side].bans = items.slice(0, 5).map((item) => item.hero);
        buckets[side].picks = items.slice(5, 10).map((item) => item.hero);
      } else if (items.length >= 5) {
        buckets[side].picks = items.slice(0, 5).map((item) => item.hero);
      }
    }
    const banText = (side) => buckets[side].bans.map((hero) => hero.name).join(' / ') || '—';
    const pickText = (side) => buckets[side].picks.map((hero) => hero.name).join(' / ') || '—';
    const total = ['blue', 'red'].reduce((sum, side) => sum + buckets[side].bans.length + buckets[side].picks.length, 0);
    const complete = ['blue', 'red'].every((side) => buckets[side].bans.length === 5 && buckets[side].picks.length === 5);
    const text = [
      '【KPL BP 演练室】',
      '模式：全局 BP',
      '蓝方：头像识别',
      `Ban：${banText('blue')}`,
      `Pick：${pickText('blue')}`,
      '红方：头像识别',
      `Ban：${banText('red')}`,
      `Pick：${pickText('red')}`,
      `本局进度：${complete ? 20 : total}/20`
    ].join('\n');
    return { text, count: total, complete };
  }

  function openImportDraftModal() {
    if (!canEditCurrentGame()) {
      toast('当前 BP 已锁定或正在回看，不能导入覆盖', 'info');
      return;
    }
    const series = getSeries();
    const game = getGame();
    const sample = [
      'B 蓝 关羽',
      'B 红 盾山',
      'B 蓝 海月',
      'B 红 赵云',
      'P 蓝 曹操',
      'P 红 裴擒虎',
      'P 红 沈梦溪',
      'P 蓝 敖隐',
      'P 蓝 张飞',
      'P 红 公孙离'
    ].join('\n');
    showModal(`
      <div class="modal-body import-draft-modal">
        <div class="import-head">
          <div>
            <div class="eyebrow">IMPORT DRAFT · G${game.no} / BO${series.bo}</div>
            <h2>导入 BP</h2>
            <p>按官方 BP 顺序粘贴动作，支持部分导入；导入后进度、当前手和全局 BP 会立即更新。</p>
          </div>
          <span class="tag gold">PASTE / JSON</span>
        </div>
        <div class="import-grid">
          <label class="import-file">
            <span>选择 .txt / .json 文件</span>
            <input id="importDraftFile" type="file" accept=".txt,.json,application/json,text/plain" />
          </label>
          <textarea id="importDraftText" class="import-textarea" spellcheck="false" placeholder="B 蓝 关羽&#10;B 红 盾山&#10;P 蓝 曹操&#10;..."></textarea>
        </div>
        <div class="import-help">
          <b>格式：</b>每行一手，顺序必须与官方 BP 一致；也可以直接粘贴软件里“复制本局”生成的完整文本。<br>
          示例：<code>B 蓝 关羽</code> / <code>B 红 盾山</code> / <code>P 蓝 曹操</code><br>
          也支持 <code>ban blue 关羽</code>、<code>pick red 曹操</code>；JSON 可用
          <code>[{"type":"ban","side":"blue","hero":"关羽"}]</code>。<br>
          标准局最多 20 手；巅峰对决只导入 Pick。进度会按导入手数自动同步。<br>
          截图识别优先匹配英雄头像；OCR 只作为辅助，识别后仍需核对。
        </div>
        <div class="import-ocr">
          <div class="import-ocr-head">
            <b>王者营地截屏识别</b>
            <span>英雄头像模板匹配 · OCR 辅助 · 识别后请核对</span>
          </div>
          <div class="import-ocr-controls">
            <label class="import-file import-file-inline">
              <span>选择 BP 回放截图</span>
              <input id="importScreenshot" type="file" accept="image/*" />
            </label>
            <button class="btn ghost" id="importAvatarBtn" type="button">${ICONS.spark} 识别头像</button>
            <button class="btn ghost" id="importOcrBtn" type="button">OCR 辅助</button>
            <span id="importOcrStatus" class="import-ocr-status">支持 PNG / JPG / WEBP</span>
          </div>
          <pre id="importOcrRaw" class="import-ocr-raw" hidden></pre>
        </div>
        <div id="importDraftError" class="import-error" hidden></div>
        <div class="modal-actions">
          <button class="btn ghost" id="importDraftSample" type="button">填入示例</button>
          <button class="btn ghost" id="importDraftClear" type="button">清空</button>
          <span class="control-spacer"></span>
          <button class="btn primary" id="importDraftApply" type="button">${ICONS.upload} 导入并更新进度</button>
        </div>
      </div>
    `, '导入 BP');

    const textarea = $('#importDraftText');
    const errorBox = $('#importDraftError');
    const showError = (message) => {
      if (!errorBox) return;
      errorBox.hidden = false;
      errorBox.textContent = message;
    };
    $('#importDraftSample')?.addEventListener('click', () => {
      if (textarea) textarea.value = sample;
      if (errorBox) errorBox.hidden = true;
    });
    $('#importDraftClear')?.addEventListener('click', () => {
      if (textarea) textarea.value = '';
      if (errorBox) errorBox.hidden = true;
    });
    $('#importDraftFile')?.addEventListener('change', async (event) => {
      const file = event.target.files?.[0];
      if (!file || !textarea) return;
      try {
        textarea.value = await file.text();
        if (errorBox) errorBox.hidden = true;
      } catch (error) {
        showError(`读取文件失败：${error.message}`);
      }
    });
    let screenshotFile = null;
    const ocrStatus = $('#importOcrStatus');
    const ocrRaw = $('#importOcrRaw');
    const setOcrStatus = (message) => {
      if (ocrStatus) ocrStatus.textContent = message;
    };
    $('#importScreenshot')?.addEventListener('change', (event) => {
      screenshotFile = event.target.files?.[0] || null;
      if (ocrRaw) ocrRaw.hidden = true;
      setOcrStatus(screenshotFile ? `已选择：${screenshotFile.name}` : '支持 PNG / JPG / WEBP');
    });
    $('#importAvatarBtn')?.addEventListener('click', async () => {
      if (!screenshotFile) {
        showError('请先选择王者营地 BP 回放截图');
        return;
      }
      const button = $('#importAvatarBtn');
      if (button) button.disabled = true;
      setOcrStatus('正在识别英雄头像，请稍候…');
      if (errorBox) errorBox.hidden = true;
      if (ocrRaw) ocrRaw.hidden = true;
      try {
        const response = await fetch('/api/avatar', {
          method: 'POST',
          headers: { 'Content-Type': screenshotFile.type || 'image/png' },
          body: screenshotFile
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || `头像服务返回 ${response.status}`);
        }
        const candidate = avatarResultToDraftText(payload);
        if (!candidate.text) {
          setOcrStatus('没有匹配到英雄头像');
          showError('没有匹配到英雄头像，请换一张更清晰的 BP 截图，或使用 OCR 辅助。');
          return;
        }
        if (textarea) textarea.value = candidate.text;
        setOcrStatus(
          candidate.complete
            ? `识别到 ${candidate.count} 个头像，已生成候选，请核对后导入`
            : `识别到 ${candidate.count} 个头像，进度可能不完整，请核对`
        );
      } catch (error) {
        setOcrStatus('头像识别失败');
        showError(`头像识别失败：${error.message}`);
      } finally {
        if (button) button.disabled = false;
      }
    });
    $('#importOcrBtn')?.addEventListener('click', async () => {
      if (!screenshotFile) {
        showError('请先选择王者营地 BP 回放截图');
        return;
      }
      const button = $('#importOcrBtn');
      if (button) button.disabled = true;
      setOcrStatus('正在识别截图，请稍候…');
      if (errorBox) errorBox.hidden = true;
      if (ocrRaw) ocrRaw.hidden = true;
      try {
        const response = await fetch('/api/ocr', {
          method: 'POST',
          headers: { 'Content-Type': screenshotFile.type || 'image/png' },
          body: screenshotFile
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) {
          throw new Error(payload.error || `OCR 服务返回 ${response.status}`);
        }
        const candidate = ocrResultToDraftText(payload);
        if (!candidate.text) {
          setOcrStatus('没有自动识别出完整英雄，已保留 OCR 原文');
          if (ocrRaw) {
            ocrRaw.hidden = false;
            ocrRaw.textContent = payload.text || 'OCR 未返回文字';
          }
          return;
        }
        if (textarea) textarea.value = candidate.text;
        setOcrStatus(
          candidate.complete
            ? `识别到 ${candidate.count} 个英雄，请核对后导入`
            : `识别到 ${candidate.count} 个英雄，进度可能不完整，请核对`
        );
        if (errorBox) errorBox.hidden = true;
      } catch (error) {
        setOcrStatus('识别失败');
        showError(`截屏识别失败：${error.message}`);
      } finally {
        if (button) button.disabled = false;
      }
    });
    $('#importDraftApply')?.addEventListener('click', () => {
      try {
        const actions = parseImportActions(textarea?.value || '');
        if (game.actions.length && !window.confirm('导入会覆盖当前局的 BP 进度，继续吗？')) return;
        applyImportActions(actions);
      } catch (error) {
        showError(error.message || String(error));
      }
    });
  }

  /* ---------------------------------------------------------
     Hero data page
     --------------------------------------------------------- */
  function metricCell(stats, type) {
    const rate = type === 'ban' ? stats?.banRate : type === 'pick' ? stats?.pickRate : stats?.winRate;
    const count = type === 'ban' ? stats?.bans : type === 'pick' ? stats?.picks : stats?.wins;
    const unit = type === 'win' ? '胜' : '次';
    const width = rate === null || rate === undefined ? 0 : clamp(Number(rate), 0, 1) * 100;
    return `<td>
      <div class="metric-cell ${type}">
        <div class="metric-main">
          <b class="${type === 'win' ? rateClass(rate) : ''}">${pct(rate)}</b>
          <span>${num(count)}${unit}</span>
        </div>
        <div class="metric-bar"><i style="width:${width}%"></i></div>
      </div>
    </td>`;
  }

  function sortIndicator(scope, metric) {
    if (state.heroTableSort.scope !== scope || state.heroTableSort.metric !== metric) return '<span class="sort-indicator">↕</span>';
    return `<span class="sort-indicator">${state.heroTableSort.dir === 'desc' ? '↓' : '↑'}</span>`;
  }

  function heroSortHeader(label, scope, metric) {
    const current = state.heroTableSort.scope === scope && state.heroTableSort.metric === metric;
    return `<th class="sortable ${current ? 'is-sorted' : ''}" data-sort-scope="${scope}" data-sort-metric="${metric}">${label}${sortIndicator(scope, metric)}</th>`;
  }

  function bestHero(metric, minPicks = 0) {
    let best = null;
    for (const hero of state.data.heroes) {
      const stats = heroStat(hero, state.season) || {};
      if (metric === 'winRate' && (stats.picks || 0) < minPicks) continue;
      const value = Number(stats[metric]);
      if (!best || value > best.value) best = { hero, stats, value };
    }
    return best;
  }

  function renderHeroesPage(app) {
    const season = state.season;
    if (state.heroTableTeam !== ALL && !state.teamMap.has(String(state.heroTableTeam))) {
      state.heroTableTeam = ALL;
    }
    const played = state.data.heroes.filter((hero) => (heroStat(hero, season)?.picks || 0) > 0).length;
    const banKing = bestHero('banRate');
    const pickKing = bestHero('pickRate');
    let winKing = bestHero('winRate', 20);
    if (!winKing) winKing = bestHero('winRate', 10);
    if (!winKing) winKing = bestHero('winRate', 5);
    if (!winKing) winKing = bestHero('winRate', 1);
    const scopeLabel = season === ALL ? '两赛季' : seasonShort(season);

    app.innerHTML = `
      <section class="page" id="heroesPage">
        <div class="page-head">
          <div>
            <div class="page-kicker"><i></i><span>HERO INTELLIGENCE · ${esc(scopeLabel)}</span></div>
            <h1 class="page-title">英雄 <em>数据</em></h1>
            <p class="page-sub">Ban 率、Pick 率与胜率全部按官方小局数据统计；两赛季合计按场次重新汇总，不做简单平均。</p>
          </div>
          <div class="head-actions">
            <button class="btn ghost" id="exportHeroCsv" type="button">${ICONS.download} 导出 CSV</button>
          </div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card" style="--kpi-color:var(--blue);--kpi-accent:rgba(78,155,255,.14)">
            <div class="kpi-top"><span class="kpi-label">已登场英雄</span><span class="kpi-icon">${ICONS.users}</span></div>
            <div class="kpi-value">${played}<small>/ ${state.data.heroes.length}</small></div>
            <div class="kpi-note">在 <b>${esc(scopeLabel)}</b> 至少出场一次</div>
          </div>
          <div class="kpi-card" style="--kpi-color:var(--red);--kpi-accent:rgba(255,96,127,.13)">
            <div class="kpi-top"><span class="kpi-label">最高 Ban 率</span><span class="kpi-icon">${ICONS.target}</span></div>
            <div class="kpi-value">${banKing ? pct(banKing.stats.banRate) : '—'}</div>
            <div class="kpi-note"><b>${esc(banKing?.hero.name || '—')}</b> · ${num(banKing?.stats.bans)} 次 Ban</div>
          </div>
          <div class="kpi-card" style="--kpi-color:var(--blue-2);--kpi-accent:rgba(78,155,255,.13)">
            <div class="kpi-top"><span class="kpi-label">最高 Pick 率</span><span class="kpi-icon">${ICONS.target}</span></div>
            <div class="kpi-value">${pickKing ? pct(pickKing.stats.pickRate) : '—'}</div>
            <div class="kpi-note"><b>${esc(pickKing?.hero.name || '—')}</b> · ${num(pickKing?.stats.picks)} 局出场</div>
          </div>
          <div class="kpi-card" style="--kpi-color:var(--green);--kpi-accent:rgba(61,220,151,.12)">
            <div class="kpi-top"><span class="kpi-label">最高胜率 · ≥20 局</span><span class="kpi-icon">${ICONS.trophy}</span></div>
            <div class="kpi-value">${winKing ? pct(winKing.stats.winRate) : '—'}</div>
            <div class="kpi-note"><b>${esc(winKing?.hero.name || '—')}</b> · ${num(winKing?.stats.picks)} 局样本</div>
          </div>
        </div>

        <section class="panel table-panel">
          <div class="table-toolbar">
            <label class="search-box">${ICONS.search}<input id="heroTableSearch" type="search" placeholder="搜索英雄…" autocomplete="off" spellcheck="false" /></label>
            <label class="field" style="min-width:155px"><span>战队队员视角</span>
              <select id="heroTeamView">
                <option value="${ALL}" ${state.heroTableTeam === ALL ? 'selected' : ''}>全 KPL（通用）</option>
                ${[...(state.data.teams || [])].sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')).map((team) => `<option value="${esc(team.id)}" ${String(state.heroTableTeam) === String(team.id) ? 'selected' : ''}>${esc(team.name)}</option>`).join('')}
              </select>
            </label>
            <div class="role-filter" id="heroTableRoles" role="group" aria-label="按分路筛选">
              ${['全部', ...ROLE_ORDER].map((role) => `<button type="button" class="filter-chip ${role === state.heroTableFilter.role ? 'is-active' : ''}" data-role="${role}">${role}</button>`).join('')}
            </div>
            <label class="tag" style="cursor:pointer;gap:6px;padding:6px 8px">
              <input type="checkbox" id="heroOnlyPlayed" ${state.heroTableFilter.onlyPlayed ? 'checked' : ''} /> 仅看有登场
            </label>
            <span class="control-spacer"></span>
            <span class="panel-sub" id="heroTableCount"></span>
          </div>
          <div class="table-scroll">
            <table class="data-table" id="heroDataTable">
              <thead>
                <tr class="group-row">
                  <th class="sticky-col">英雄</th>
                  <th class="group ${season === 'KPL2026S3' ? 'current' : ''}" colspan="3">2026 年度总决赛</th>
                  <th class="group ${season === 'KPL2026S2' ? 'current' : ''}" colspan="3">2026 KPL 夏季赛</th>
                  <th class="group ${season === ALL ? 'current' : 'total'}" colspan="3">两赛季合计</th>
                </tr>
                <tr class="col-row">
                  <th class="sticky-col">分路 / 英雄</th>
                  ${['KPL2026S3', 'KPL2026S2', 'total'].map((scope) => `
                    ${heroSortHeader('Ban 率', scope, 'banRate')}
                    ${heroSortHeader('Pick 率', scope, 'pickRate')}
                    ${heroSortHeader('胜率', scope, 'winRate')}
                  `).join('')}
                </tr>
              </thead>
              <tbody id="heroTableBody"></tbody>
            </table>
          </div>
          <div class="table-note">口径：Ban 率 = 被 Ban 次数 / 总小局；Pick 率 = 出场次数 / 总小局；胜率 = 出场胜局 / 出场次数。选择“战队队员视角”后，点击英雄可查看该战队逐名选手使用该英雄的年度 / 夏季 / 合计历史胜率。官方 BP 记录极少数缺少 Ban 明细时，按可获取记录计入。</div>
        </section>
      </section>`;

    const search = $('#heroTableSearch');
    if (search) search.value = state.heroTableFilter.q;
    bindHeroPageEvents();
    refreshHeroTable();
  }

  function bindHeroPageEvents() {
    $('#heroTableSearch')?.addEventListener('input', (event) => {
      state.heroTableFilter.q = event.target.value.trim();
      refreshHeroTable();
    });
    $('#heroTableRoles')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-role]');
      if (!button) return;
      state.heroTableFilter.role = button.dataset.role;
      $$('#heroTableRoles .filter-chip').forEach((chip) => chip.classList.toggle('is-active', chip.dataset.role === state.heroTableFilter.role));
      refreshHeroTable();
    });
    $('#heroOnlyPlayed')?.addEventListener('change', (event) => {
      state.heroTableFilter.onlyPlayed = event.target.checked;
      refreshHeroTable();
    });
    $('#heroTeamView')?.addEventListener('change', (event) => {
      state.heroTableTeam = event.target.value;
      persistPrefs();
      toast(event.target.value === ALL ? '已切换为全 KPL 视角' : `已选择 ${teamName(event.target.value)}：点击英雄查看该队队员使用数据`, 'info');
    });
    $('#heroTableBody')?.addEventListener('click', (event) => {
      const row = event.target.closest('[data-hero-id]');
      if (row) openHeroModal(Number(row.dataset.heroId), state.heroTableTeam !== ALL ? state.heroTableTeam : null);
    });
    $$('#heroDataTable th[data-sort-scope]').forEach((th) => {
      th.addEventListener('click', () => {
        const scope = th.dataset.sortScope;
        const metric = th.dataset.sortMetric;
        if (state.heroTableSort.scope === scope && state.heroTableSort.metric === metric) {
          state.heroTableSort.dir = state.heroTableSort.dir === 'desc' ? 'asc' : 'desc';
        } else {
          state.heroTableSort = { scope, metric, dir: 'desc' };
        }
        persistPrefs();
        renderHeroesPage($('#app'));
      });
    });
    $('#exportHeroCsv')?.addEventListener('click', exportHeroCsv);
  }

  function filteredHeroRows() {
    const query = state.heroTableFilter.q.toLocaleLowerCase('zh-CN');
    const role = state.heroTableFilter.role;
    let rows = state.data.heroes.filter((hero) => {
      if (role !== '全部' && !heroRoles(hero).includes(role)) return false;
      if (query && !hero.name.toLocaleLowerCase('zh-CN').includes(query)) return false;
      if (state.heroTableFilter.onlyPlayed && (heroStat(hero, state.season)?.picks || 0) === 0) return false;
      return true;
    });
    const { scope, metric, dir } = state.heroTableSort;
    // Metric-specific ranking priorities requested by the analyst:
    // Ban: Ban > Win > Pick; Pick: Pick > Win > Ban; Win: Win > Pick > Ban.
    const tieOrder = metric === 'banRate'
      ? ['banRate', 'winRate', 'pickRate']
      : metric === 'pickRate'
        ? ['pickRate', 'winRate', 'banRate']
        : ['winRate', 'pickRate', 'banRate'];
    const value = (hero, key) => {
      const stats = scope === 'total' ? hero.total : hero.seasons?.[scope];
      const raw = stats?.[key];
      if (raw === null || raw === undefined) return -1;
      return Number(raw);
    };
    rows = rows.sort((a, b) => {
      for (const key of tieOrder) {
        const diff = value(a, key) - value(b, key);
        if (diff) return dir === 'desc' ? -diff : diff;
      }
      return a.name.localeCompare(b.name, 'zh-CN');
    });
    return rows;
  }

  function refreshHeroTable() {
    const tbody = $('#heroTableBody');
    if (!tbody) return;
    const rows = filteredHeroRows();
    const count = $('#heroTableCount');
    if (count) count.textContent = `${rows.length} 位英雄`;
    tbody.innerHTML = rows.map((hero) => {
      const role = heroRoles(hero)[0];
      const cells = [
        metricCell(heroStat(hero, 'KPL2026S3'), 'ban'),
        metricCell(heroStat(hero, 'KPL2026S3'), 'pick'),
        metricCell(heroStat(hero, 'KPL2026S3'), 'win'),
        metricCell(heroStat(hero, 'KPL2026S2'), 'ban'),
        metricCell(heroStat(hero, 'KPL2026S2'), 'pick'),
        metricCell(heroStat(hero, 'KPL2026S2'), 'win'),
        metricCell(hero.total, 'ban'),
        metricCell(hero.total, 'pick'),
        metricCell(hero.total, 'win')
      ].join('');
      return `<tr class="clickable" data-hero-id="${hero.id}">
        <td class="sticky-col">
          <div class="hero-cell">
            <span class="hero-thumb">${heroImage(hero, '', hero.name)}</span>
            <span class="hero-name-cell"><strong>${esc(hero.name)}</strong><small class="${roleClass(role)}" style="color:var(--role)" title="按 2026 两个赛季官方逐局实际分路统计">${esc(role)}</small></span>
          </div>
        </td>
        ${cells}
      </tr>`;
    }).join('') || '<tr><td colspan="10" style="text-align:center;padding:34px;color:var(--dim)">没有符合条件的英雄</td></tr>';
  }

  function exportHeroCsv() {
    const rows = filteredHeroRows();
    const header = [
      '英雄', '分路',
      'S3_Ban率', 'S3_Ban数', 'S3_Pick率', 'S3_Pick数', 'S3_胜率', 'S3_胜局',
      'S2_Ban率', 'S2_Ban数', 'S2_Pick率', 'S2_Pick数', 'S2_胜率', 'S2_胜局',
      '合计_Ban率', '合计_Ban数', '合计_Pick率', '合计_Pick数', '合计_胜率', '合计_胜局'
    ];
    const quote = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const lines = [header.map(quote).join(',')];
    for (const hero of rows) {
      const s3 = hero.seasons.KPL2026S3;
      const s2 = hero.seasons.KPL2026S2;
      const total = hero.total;
      lines.push([
        hero.name, heroRoles(hero)[0],
        pct(s3.banRate), s3.bans, pct(s3.pickRate), s3.picks, pct(s3.winRate), s3.wins,
        pct(s2.banRate), s2.bans, pct(s2.pickRate), s2.picks, pct(s2.winRate), s2.wins,
        pct(total.banRate), total.bans, pct(total.pickRate), total.picks, pct(total.winRate), total.wins
      ].map(quote).join(','));
    }
    const blob = new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KPL英雄数据_${seasonShort(state.season)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(`已导出 ${rows.length} 位英雄`, 'success');
  }

  /* ---------------------------------------------------------
     Pair / synergy page
     --------------------------------------------------------- */
  function pairTeamOptions(selected) {
    const options = [`<option value="${ALL}" ${selected === ALL ? 'selected' : ''}>全 KPL</option>`];
    const teams = (state.data.teams || [])
      .filter((team) => (teamStat(team, state.season)?.games.played || 0) > 0)
      .sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    for (const team of teams) {
      options.push(`<option value="${esc(team.id)}" ${String(selected) === String(team.id) ? 'selected' : ''}>${esc(team.name)}</option>`);
    }
    return options.join('');
  }

  function pairHeroOptions(selected) {
    const ctx = getCtx(state.season, state.pair.team);
    const ranked = [...ctx.heroGames.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => Number(id));
    const rankIndex = new Map(ranked.map((id, index) => [id, index]));
    const heroes = [...state.data.heroes].sort((a, b) => {
      const ra = rankIndex.has(a.id) ? rankIndex.get(a.id) : 999 + a.id;
      const rb = rankIndex.has(b.id) ? rankIndex.get(b.id) : 999 + b.id;
      return ra - rb;
    });
    return heroes.map((hero) => `<option value="${hero.id}" ${Number(selected) === hero.id ? 'selected' : ''}>${esc(hero.name)}${ctx.heroGames.get(hero.id) ? ` · ${ctx.heroGames.get(hero.id)}局` : ''}</option>`).join('');
  }

  function buildPartnerRows(heroId, teamId = state.pair.team, season = state.season) {
    const ctx = getCtx(season, teamId);
    const id = Number(heroId);
    const aGames = ctx.heroGames.get(id) || 0;
    const baselineB = ctx.games || 1;
    const rows = [];
    for (const partner of state.data.heroes) {
      if (partner.id === id) continue;
      const pair = ctx.pairs.get(pairKey(id, partner.id));
      if (!pair?.n) continue;
      const bGames = ctx.heroGames.get(partner.id) || 0;
      const pBA = aGames ? pair.n / aGames : null;
      const pAB = bGames ? pair.n / bGames : null;
      const baseRate = bGames / baselineB;
      rows.push({
        hero: partner,
        n: pair.n,
        wins: pair.w,
        pBA,
        pAB,
        comboWin: pair.w / pair.n,
        baseRate,
        lift: pBA === null ? null : pBA - baseRate
      });
    }
    // Best-partner ranking combines sample size and adjusted combo win rate.
    // The volume term prevents a 1-game 100% pair from outranking a stable
    // 10-game pairing; the Bayesian prior pulls small samples toward 50%.
    const maxGames = Math.max(1, ...rows.map((row) => row.n));
    for (const row of rows) {
      const volume = row.n / maxGames;
      const adjustedWin = (row.wins + 3) / (row.n + 6);
      row.bestScore = 0.5 * volume + 0.5 * adjustedWin;
    }
    rows.sort((a, b) =>
      b.bestScore - a.bestScore
      || b.n - a.n
      || b.comboWin - a.comboWin
      || a.hero.id - b.hero.id
    );
    return { rows, aGames, ctx, maxGames };
  }

  function pairRole(hero) {
    return heroRoles(hero)[0];
  }

  function renderPairPartnerList(rows, aGames) {
    if (!aGames) {
      return `<div class="empty-state"><strong>当前范围没有该英雄的出场样本</strong>换一个战队或赛季看看，或选择其他英雄。</div>`;
    }
    if (!rows.length) {
      return `<div class="empty-state"><strong>暂时没有同队搭档样本</strong>该英雄在当前范围的出场次数较少。</div>`;
    }
    return rows.slice(0, 10).map((row, index) => {
      const role = pairRole(row.hero);
      return `<button class="partner-row" type="button" data-pair-hero="${row.hero.id}">
        <span class="partner-rank">${String(index + 1).padStart(2, '0')}</span>
        <span class="partner-portrait">${heroImage(row.hero, '', row.hero.name)}</span>
        <span class="partner-info"><strong>${esc(row.hero.name)} <span class="role-tag ${roleClass(role)}">${esc(role)}</span></strong><small>同队同场 <b style="color:var(--muted)">${row.n}</b> 局 · 组合 ${row.wins} 胜</small></span>
        <span class="partner-prob"><b>${pct(row.bestScore)}</b><span>综合评分</span><small>同场 ${row.n} 次 · P ${pct(row.pBA)}</small></span>
        <span class="partner-wr"><b class="${rateClass(row.comboWin)}">${pct(row.comboWin)}</b><span>组合胜率</span></span>
      </button>`;
    }).join('');
  }

  function renderMatrix(ctx, selectedHeroId, partnerRows, metric = 'prob') {
    const metricKey = ['prob', 'win', 'games'].includes(metric) ? metric : 'prob';
    const metricLabel = metricKey === 'win' ? '组合胜率' : metricKey === 'games' ? '同队同场局数' : '搭档概率 P(搭档 | 本英雄)';
    const sortedPartners = [...(partnerRows || [])].sort((a, b) => {
      if (metricKey === 'win') return (b.comboWin || 0) - (a.comboWin || 0) || b.n - a.n;
      if (metricKey === 'games') return b.n - a.n || (b.comboWin || 0) - (a.comboWin || 0);
      return (b.pBA || 0) - (a.pBA || 0) || b.n - a.n;
    });
    let top = [Number(selectedHeroId), ...sortedPartners.slice(0, 9).map((row) => Number(row.hero.id))];
    top = [...new Set(top)].filter((id) => state.heroMap.has(id));
    if (top.length < 2) {
      top = [...ctx.heroGames.entries()]
        .filter(([id]) => state.heroMap.has(Number(id)))
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([id]) => Number(id));
      if (selectedHeroId && state.heroMap.has(Number(selectedHeroId)) && !top.includes(Number(selectedHeroId))) {
        if (top.length >= 10) top.pop();
        top.push(Number(selectedHeroId));
      }
    }
    if (top.length < 2) {
      return '<div class="empty-state"><strong>样本不足以绘制矩阵</strong>增加赛季或战队范围后再看。</div>';
    }
    const pairValues = [];
    for (const rowId of top) {
      for (const colId of top) {
        if (rowId === colId) continue;
        const pair = ctx.pairs.get(pairKey(rowId, colId));
        if (pair?.n) pairValues.push(pair.n);
      }
    }
    const maxGames = Math.max(1, ...pairValues);
    const columns = `106px repeat(${top.length}, minmax(34px, 1fr))`;
    const head = `<div class="matrix-corner"></div>` + top.map((id) => {
      const hero = state.heroMap.get(id);
      return `<div class="matrix-head ${Number(selectedHeroId) === id ? 'is-selected' : ''}">${heroImage(hero, '', hero.name)}<span>${esc(hero.name)}</span></div>`;
    }).join('');
    const rows = top.map((rowId) => {
      const rowHero = state.heroMap.get(rowId);
      const rowGames = ctx.heroGames.get(rowId) || 0;
      const cells = top.map((colId) => {
        if (rowId === colId) return '<div class="matrix-cell is-diag">—</div>';
        const pair = ctx.pairs.get(pairKey(rowId, colId));
        const n = pair?.n || 0;
        const pBA = rowGames && n ? n / rowGames : 0;
        const comboWin = n ? pair.w / n : 0;
        const value = metricKey === 'games' ? n : metricKey === 'win' ? comboWin : pBA;
        const maxValue = metricKey === 'games' ? maxGames : 1;
        const alpha = value ? Math.min(0.68, 0.1 + (value / maxValue) * 0.72) : 0.025;
        const text = value
          ? metricKey === 'games' ? String(n) : String(Math.round(value * 100))
          : '·';
        const color = metricKey === 'win' ? '61,220,151' : metricKey === 'games' ? '78,155,255' : '232,185,104';
        return `<div class="matrix-cell ${metricKey === 'win' ? 'is-metric-win' : metricKey === 'games' ? 'is-metric-games' : 'is-metric-prob'} ${Number(selectedHeroId) === rowId || Number(selectedHeroId) === colId ? 'is-selected' : ''}" style="--cell-bg:rgba(${color},${alpha.toFixed(3)})" title="${esc(rowHero.name)} → ${esc(state.heroMap.get(colId)?.name)}：搭档概率 ${pBA ? pct(pBA) : '无'} · 组合胜率 ${n ? pct(comboWin) : '无'} · 同队 ${n} 局">${text}</div>`;
      }).join('');
      return `<div class="matrix-row-head ${Number(selectedHeroId) === rowId ? 'is-selected' : ''}">${heroImage(rowHero, '', rowHero.name)}<span>${esc(rowHero.name)}</span></div>${cells}`;
    }).join('');
    return `<div class="matrix" style="grid-template-columns:${columns}">${head}${rows}</div>
      <div class="matrix-note">当前视图：<b>${metricLabel}</b>。横向 = 搭档英雄，纵向 = 本英雄；颜色越亮表示该项数值越高。鼠标悬停可同时查看搭档概率、组合胜率与同队局数。</div>`;
  }

  function renderPairsPage(app) {
    ensurePairDefaults();
    const ctx = getCtx(state.season, state.pair.team);
    const selectedHero = state.heroMap.get(Number(state.pair.heroId));
    const { rows, aGames } = buildPartnerRows(state.pair.heroId);
    const selectedStats = selectedHero ? heroStat(selectedHero, state.season) : null;
    const topPartner = rows[0];
    const teamLabel = state.pair.team === ALL ? '全 KPL' : teamName(state.pair.team);
    const uniquePartners = new Set(rows.map((row) => row.hero.id)).size;
    const filteredRows = rows.filter((row) => row.n >= Number(state.pair.minGames));
    const minOptions = [1, 2, 3, 5];
    const selectedHERO = selectedHero || state.data.heroes[0];
    const matrixMetric = ['prob', 'win', 'games'].includes(state.pair.matrixMetric) ? state.pair.matrixMetric : 'prob';
    const matrixMetricLabel = matrixMetric === 'win' ? '组合胜率' : matrixMetric === 'games' ? '同队场次' : '搭档概率';
    const matrixTabs = [['prob', '搭档概率'], ['win', '组合胜率'], ['games', '同队场次']]
      .map(([value, label]) => `<button type="button" class="matrix-metric-tab ${matrixMetric === value ? 'is-active' : ''}" data-matrix-metric="${value}">${label}</button>`)
      .join('');

    app.innerHTML = `
      <section class="page" id="pairsPage">
        <div class="page-head">
          <div>
            <div class="page-kicker"><i></i><span>SYNERGY LAB · ${esc(seasonLabel(state.season))}</span></div>
            <h1 class="page-title">搭档 <em>图谱</em></h1>
            <p class="page-sub">看清“谁和谁一起上场”。概率为同队同场条件概率，支持按战队、赛季与英雄下钻。</p>
          </div>
          <div class="head-actions"><span class="tag gold">同队同场 · 条件概率</span></div>
        </div>

        <div class="control-bar">
          <label class="field"><span>战队范围</span><select id="pairTeamSelect">${pairTeamOptions(state.pair.team)}</select></label>
          <label class="field grow"><span>核心英雄</span><select id="pairHeroSelect">${pairHeroOptions(state.pair.heroId)}</select></label>
          <label class="field"><span>最少同队局数</span><select id="pairMinGames">${minOptions.map((n) => `<option value="${n}" ${Number(state.pair.minGames) === n ? 'selected' : ''}>≥ ${n} 局</option>`).join('')}</select></label>
          <div class="field"><span>排序</span><div class="pair-rank-mode">综合 · 场次 + 胜率</div></div>
        </div>

        <div class="pair-hero">
          <div class="pair-hero-art">${heroImage(selectedHERO, '', selectedHERO.name)}</div>
          <div class="pair-hero-info">
            <h2>${esc(selectedHERO.name)} <span>${esc(heroRoles(selectedHERO)[0])} · #${selectedHERO.id}</span></h2>
            <p>${esc(teamLabel)} · ${esc(seasonLabel(state.season))} · 该英雄出场 ${num(aGames)} 局，已形成 ${uniquePartners} 个同队搭档样本</p>
            <div class="hero-banner-tags">${roleTags(heroRoles(selectedHERO))}<span class="tag">${selectedStats ? `Ban ${pct(selectedStats.banRate)}` : '—'}</span><span class="tag">${selectedStats ? `Pick ${pct(selectedStats.pickRate)}` : '—'}</span><span class="tag ${selectedStats?.winRate >= 0.5 ? 'green' : ''}">胜率 ${selectedStats ? pct(selectedStats.winRate) : '—'}</span></div>
          </div>
          <div class="pair-hero-stats">
            <div class="pair-stat"><span>本英雄出场</span><b>${num(aGames)}</b><span>小局</span></div>
            <div class="pair-stat"><span>最佳搭档</span><b>${topPartner ? pct(topPartner.comboWin) : '—'}</b><span>${topPartner ? `${esc(topPartner.hero.name)} · ${topPartner.n} 局` : '暂无'}</span></div>
            <div class="pair-stat"><span>搭档样本</span><b>${uniquePartners}</b><span>位英雄</span></div>
          </div>
        </div>

        <div class="pair-grid">
          <section class="panel">
            <div class="panel-head"><div><div class="panel-title"><span class="dot"></span>最佳搭档</div><div class="panel-sub">按同队场次 × 组合胜率综合排序</div></div><span class="tag">TOP 10</span></div>
            <div class="partner-list">${renderPairPartnerList(rows, aGames)}</div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div><div class="panel-title"><span class="dot"></span>搭档概率矩阵</div><div class="panel-sub">当前英雄 + ${matrixMetricLabel}最高的 9 位搭档 · 实时重算</div></div>
              <div class="matrix-head-actions">
                <div class="matrix-metric-tabs" role="group" aria-label="矩阵指标">${matrixTabs}</div>
                <span class="tag blue">HEATMAP</span>
              </div>
            </div>
            <div class="matrix-wrap">${renderMatrix(ctx, Number(selectedHERO.id), rows, matrixMetric)}</div>
          </section>
        </div>

        <section class="panel table-panel pair-table">
          <div class="panel-head" style="padding-bottom:10px"><div><div class="panel-title"><span class="dot"></span>全部搭档</div><div class="panel-sub">共 ${rows.length} 位有同队记录的英雄 · 显示 ≥${state.pair.minGames} 局</div></div></div>
          <div class="table-scroll" style="max-height:430px">
            <table class="data-table">
              <thead><tr><th>搭档英雄</th><th>综合评分</th><th>同队局数</th><th>P(搭档 | 本英雄)</th><th>P(本英雄 | 搭档)</th><th>组合胜率</th><th>相对基准</th></tr></thead>
              <tbody>
                ${filteredRows.length ? filteredRows.map((row) => `<tr class="clickable" data-pair-hero="${row.hero.id}">
                  <td><div class="hero-cell"><span class="hero-thumb">${heroImage(row.hero, '', row.hero.name)}</span><span class="hero-name-cell"><strong>${esc(row.hero.name)}</strong><small class="${roleClass(pairRole(row.hero))}" style="color:var(--role)">${esc(pairRole(row.hero))}</small></span></div></td>
                  <td><span class="metric-main"><b style="color:var(--gold-2)">${pct(row.bestScore)}</b></span></td>
                  <td><span class="metric-main"><b>${row.n}</b><span>局</span></span></td>
                  <td><span class="metric-main"><b>${pct(row.pBA)}</b></span></td>
                  <td><span class="metric-main"><b>${pct(row.pAB)}</b></span></td>
                  <td><span class="metric-main"><b class="${rateClass(row.comboWin)}">${pct(row.comboWin)}</b></span></td>
                  <td><span class="metric-main"><b class="${row.lift >= 0 ? 'rate-good' : 'rate-bad'}">${signedPct(row.lift)}</b><span>vs base</span></span></td>
                </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;padding:28px;color:var(--dim)">当前条件下没有达到局数门槛的搭档组合</td></tr>'}
              </tbody>
            </table>
          </div>
          <div class="table-note">综合评分 = 50% 同队场次占比 + 50% 平滑后组合胜率；全部搭档按该评分排序。P(搭档 | 本英雄) = 同队同场局数 / 本英雄出场局数。</div>
        </section>
      </section>`;

    $('#pairTeamSelect')?.addEventListener('change', (event) => {
      state.pair.team = event.target.value;
      state.pair.heroId = null;
      ensurePairDefaults();
      persistPrefs();
      renderPairsPage($('#app'));
    });
    $('#pairHeroSelect')?.addEventListener('change', (event) => {
      state.pair.heroId = Number(event.target.value);
      persistPrefs();
      renderPairsPage($('#app'));
    });
    $('#pairMinGames')?.addEventListener('change', (event) => {
      state.pair.minGames = Number(event.target.value);
      persistPrefs();
      renderPairsPage($('#app'));
    });
    $$('#pairsPage [data-matrix-metric]').forEach((button) => {
      button.addEventListener('click', () => {
        state.pair.matrixMetric = button.dataset.matrixMetric;
        persistPrefs();
        renderPairsPage($('#app'));
      });
    });
    $('#pairsPage')?.addEventListener('click', (event) => {
      const target = event.target.closest('[data-pair-hero]');
      if (!target) return;
      state.pair.heroId = Number(target.dataset.pairHero);
      persistPrefs();
      renderPairsPage($('#app'));
    });
  }

  /* ---------------------------------------------------------
     Team records page
     --------------------------------------------------------- */
  function teamSortValue(team, scope, type) {
    const stats = scope === 'total' ? team.total : team.seasons?.[scope];
    const value = stats?.[type]?.winRate;
    return value === null || value === undefined ? -1 : Number(value);
  }

  function teamSortHeader(label, scope, type) {
    const active = state.teamSort.scope === scope && state.teamSort.type === type;
    return `<th class="sortable ${active ? 'is-sorted' : ''}" data-team-scope="${scope}" data-team-type="${type}">${label}${active ? `<span class="sort-indicator">${state.teamSort.dir === 'desc' ? '↓' : '↑'}</span>` : '<span class="sort-indicator">↕</span>'}</th>`;
  }

  function teamRecordCell(stats, type) {
    const data = stats?.[type];
    if (!data || !data.played) {
      return '<td><span style="color:var(--dim);font-size:10px">—</span></td>';
    }
    return `<td><div class="record-cell">
      <div class="record-main"><b>${record(data.wins, data.losses)}</b><span class="${rateClass(data.winRate)}">${pct(data.winRate)}</span></div>
      <div class="record-sub">${type === 'series' ? '系列赛' : '小局'} · ${data.played} 场</div>
    </div></td>`;
  }

  function standingsStatus(groupKey, rank) {
    if (groupKey === 'S') return rank <= 4 ? '淘汰赛' : '突围赛';
    if (groupKey === 'A') return rank === 1 ? '淘汰赛' : rank <= 5 ? '突围赛' : '止步';
    return '';
  }

  function bracketMatchCard(match) {
    const teamRow = (team, score, winner) => {
      const known = team && team.id;
      const teamData = known ? state.teamMap.get(String(team.id)) : null;
      return `<div class="bracket-team ${winner ? 'is-winner' : ''} ${known ? 'clickable' : 'is-tbd'}" ${known ? `data-bracket-team="${esc(team.id)}"` : ''}>
        ${teamData ? teamImage(teamData, 'team-logo', team.name) : '<span class="team-logo team-logo-fallback">?</span>'}
        <span class="bracket-team-name">${esc(team?.name || '待定')}</span>
        <b class="bracket-score">${score === null || score === undefined ? '-' : score}</b>
      </div>`;
    };
    const winner1 = Boolean(match.winnerId && match.winnerId === match.team1?.id);
    const winner2 = Boolean(match.winnerId && match.winnerId === match.team2?.id);
    const status = match.status === 'finished'
      ? '已结束'
      : match.status === 'live'
        ? '进行中'
        : match.status === 'tbd'
          ? '待定'
          : '未开始';
    return `<div class="bracket-match ${match.status === 'tbd' ? 'is-tbd' : ''}">
      <div class="bracket-match-top"><span>${esc(match.date || '时间待定')}</span><em>${status}</em></div>
      ${teamRow(match.team1, match.score1, winner1)}
      ${teamRow(match.team2, match.score2, winner2)}
      <div class="bracket-paths">
        <span>胜 → ${esc(match.winnerTo || '待定')}</span>
        <span>败 → ${esc(match.loserTo || '待定')}</span>
      </div>
    </div>`;
  }

  function renderBracketStage(stage) {
    const sections = [
      ['winners', '胜者组'],
      ['losers', '败者组'],
      ['single', stage.key === 'tts' ? '淘汰赛' : '突围赛'],
      ['final', '总决赛']
    ];
    const html = sections.map(([key, label]) => {
      const rounds = (stage.rounds || []).filter((round) => round.bracket === key);
      if (!rounds.length) return '';
      return `<section class="bracket-section bracket-${key}">
        <div class="bracket-section-head"><b>${label}</b><span>${rounds.length} 轮</span></div>
        <div class="bracket-rounds">
          ${rounds.map((round) => `<div class="bracket-round">
            <div class="bracket-round-title"><b>${esc(round.name)}</b><span>${(round.matches || []).length} 场</span></div>
            ${(round.matches || []).length
              ? round.matches.map(bracketMatchCard).join('')
              : '<div class="bracket-empty">对阵待定</div>'}
          </div>`).join('')}
        </div>
      </section>`;
    }).join('');
    return `<div class="bracket-stage">${html || '<div class="coach-empty">该阶段尚未产生对阵</div>'}</div>`;
  }

  function renderStandingsPanel() {
    const seasons = ['KPL2026S3', 'KPL2026S2'];
    if (!seasons.includes(state.standingsSeason)) state.standingsSeason = seasons[0];
    const table = state.data?.standings?.[state.standingsSeason];
    const seasonTabs = seasons.map((season) => {
      const info = state.data?.standings?.[season];
      return `<button type="button" class="standings-tab ${state.standingsSeason === season ? 'is-active' : ''}" data-standings-season="${season}">
        <b>${esc(seasonLabel(season))}</b>
        <small>${info?.source === 'official' ? '官方积分榜' : '赛程汇总'}</small>
      </button>`;
    }).join('');
    if (!table) {
      return `<section class="panel standings-panel"><div class="standings-toolbar"><div class="panel-title"><span class="dot"></span>积分排行</div><div class="standings-tabs">${seasonTabs}</div></div><div class="coach-empty">积分榜数据同步中，稍后刷新。</div></section>`;
    }
    const stages = Array.isArray(table.stages) && table.stages.length
      ? table.stages
      : [{ ...table, key: 'main', name: table.stage || '总榜' }];
    let stage = stages.find((item) => item.key === state.standingsStage) || stages[0];
    state.standingsStage = stage.key;
    const stageTabs = stages.map((item) => `<button type="button" class="standings-stage-tab ${stage.key === item.key ? 'is-active' : ''}" data-standings-stage="${esc(item.key)}">
      <b>${esc(item.name || item.stage || item.key)}</b>
      <small>${item.source === 'official' ? '官方' : '汇总'}</small>
    </button>`).join('');
    const groups = (stage.groups || []).map((group) => {
      const rowCount = (group.rows || []).length;
      const rows = (group.rows || []).map((row) => {
        const team = state.teamMap.get(String(row.teamId));
        const net = Number(row.netPoints || 0);
        const status = stage.source === 'official' ? standingsStatus(group.key, row.rank) : '';
        const statusClass = status === '淘汰赛' ? 'is-playoff' : status === '突围赛' ? 'is-advance' : status === '止步' ? 'is-out' : '';
        return `<tr class="clickable" data-standings-team="${esc(row.teamId || '')}">
          <td><span class="standings-rank ${row.rank <= 4 ? 'is-top' : ''}">${String(row.rank).padStart(2, '0')}</span></td>
          <td>
            <div class="standings-team">
              ${team ? teamImage(team, 'team-logo', row.teamName) : '<span class="team-logo team-logo-fallback">KPL</span>'}
              <span class="team-name-cell"><strong>${esc(row.teamName)}</strong><small>${esc(row.short || '')}${status ? `<i class="standing-status ${statusClass}">${status}</i>` : ''}</small></span>
            </div>
          </td>
          <td><b>${row.seriesWins}-${row.seriesLosses}</b><small class="standing-small">大场</small></td>
          <td class="${net > 0 ? 'net-plus' : net < 0 ? 'net-minus' : ''}">${net > 0 ? '+' : ''}${net}<small class="standing-small">小局</small></td>
          <td><b class="standing-points">${row.points}</b></td>
          <td>${row.winRate === null || row.winRate === undefined ? '—' : pct(row.winRate, 1)}</td>
        </tr>`;
      }).join('');
      return `<div class="standings-group">
        <div class="standings-group-head"><b>${esc(group.short || group.name)}</b><span>${group.key && group.key !== 'ALL' ? `${esc(group.key)} 组` : `${rowCount} 支战队`}</span></div>
        <div class="table-scroll">
          <table class="data-table standings-table">
            <thead><tr><th>排名</th><th>战队</th><th>胜-负</th><th>净胜分</th><th>积分</th><th>胜率</th></tr></thead>
            <tbody>${rows || '<tr><td colspan="6" class="empty-cell">该阶段暂无比赛记录</td></tr>'}</tbody>
          </table>
        </div>
      </div>`;
    }).join('');
    const sourceText = stage.source === 'official' ? '官方接口实时同步' : '按官方赛程汇总';
    const content = stage.view === 'bracket'
      ? renderBracketStage(stage)
      : `<div class="standings-groups ${groups.length > 1 ? 'is-split' : ''}">${groups}</div>`;
    const extraSeries = state.standingsSeason === 'KPL2026S3' && stage.key === 'lts'
      ? (state.data.series || []).find((row) => row.season === 'KPL2026S3' && /附加赛|加赛/.test(row.stage || ''))
      : null;
    let extraHtml = '';
    if (extraSeries) {
      const extraTeam1 = state.teamMap.get(String(extraSeries.t1));
      const extraTeam2 = state.teamMap.get(String(extraSeries.t2));
      const played1 = extraTeam1?.seasons?.KPL2026S3?.series?.played;
      const played2 = extraTeam2?.seasons?.KPL2026S3?.series?.played;
      const first = extraSeries.w === 2
        ? { team: extraTeam2, score: extraSeries.s2, fallback: extraSeries.t2 }
        : { team: extraTeam1, score: extraSeries.s1, fallback: extraSeries.t1 };
      const second = extraSeries.w === 2
        ? { team: extraTeam1, score: extraSeries.s1, fallback: extraSeries.t1 }
        : { team: extraTeam2, score: extraSeries.s2, fallback: extraSeries.t2 };
      extraHtml = `<div class="standings-extra">
        <div class="standings-extra-copy">
          <span class="tag gold">擂台赛加赛</span>
          <b>${esc(first.team?.name || first.fallback)} ${first.score}:${second.score} ${esc(second.team?.name || second.fallback)}</b>
          <small>${esc(formatDay(extraSeries.date))} · BO${extraSeries.bo} · ${esc(extraSeries.stage || '')} · 已计入战队系列赛战绩</small>
        </div>
        <button class="btn ghost sm" type="button" data-series-detail="${esc(extraSeries.id)}">${ICONS.external} 赛后数据对阵图</button>
      </div>
      <div class="standings-extra-note">官方擂台赛积分榜按 6 场统计，不含本场加赛；加赛结果计入战队系列赛战绩（${esc(extraTeam1?.name || '')} ${played1 ?? '—'} 场 / ${esc(extraTeam2?.name || '')} ${played2 ?? '—'} 场），不改变官方积分。</div>`;
    }
    return `<section class="panel standings-panel">
      <div class="standings-toolbar">
        <div>
          <div class="panel-title"><span class="dot"></span>${stage.view === 'bracket' ? '淘汰关系' : '积分排行'}</div>
          <div class="panel-sub">${esc(table.label)} · ${esc(stage.name || stage.stage)} · ${sourceText} · ${esc(formatStamp(stage.updatedAt))}</div>
        </div>
        <div class="standings-tabs">${seasonTabs}</div>
        <span class="tag ${stage.source === 'official' ? 'green' : 'gold'}">${stage.source === 'official' ? 'LIVE 官方' : 'DERIVED 汇总'}</span>
        ${stage.sourceUrl ? `<a class="standings-source" href="${esc(stage.sourceUrl)}" target="_blank" rel="noopener">${ICONS.external} 官方榜单</a>` : ''}
      </div>
      <div class="standings-stagebar">
        <div class="standings-stage-tabs">${stageTabs}</div>
        <span class="standings-stage-note">${esc(stage.stage || stage.name)} · ${stage.sourceLabel || (stage.source === 'official' ? '官方积分榜' : '官方赛程汇总')}</span>
      </div>
      ${content}
      ${extraHtml}
      <div class="table-note">${esc(stage.note || '')}${stage.view === 'bracket' ? ' 点击战队可查看详情。' : ' 胜-负为大场战绩，净胜分为小局净胜；点击战队可查看详情。'}</div>
    </section>`;
  }

  function renderTeamsPage(app) {
    const season = state.season;
    const meta = season === ALL ? state.data.meta : state.data.meta.seasons[season];
    const teams = state.data.teams.filter((team) => {
      const stats = teamStat(team, season);
      return stats && stats.games.played > 0;
    });
    const sortedTeams = [...teams].sort((a, b) => {
      const diff = teamSortValue(a, state.teamSort.scope, state.teamSort.type) - teamSortValue(b, state.teamSort.scope, state.teamSort.type);
      return state.teamSort.dir === 'desc' ? -diff : diff;
    });
    let best = null;
    for (const team of teams) {
      const stats = teamStat(team, season);
      if (!stats?.series?.played) continue;
      if (!best || stats.series.winRate > best.rate) best = { team, rate: stats.series.winRate, stats };
    }
    const scopeLabel = season === ALL ? '两赛季' : seasonShort(season);
    const totalSeries = season === ALL ? state.data.meta.totalSeries : meta.series;
    const totalGames = season === ALL ? state.data.meta.totalBattles : meta.battles;

    app.innerHTML = `
      <section class="page" id="teamsPage">
        <div class="page-head">
          <div>
            <div class="page-kicker"><i></i><span>TEAM RECORDS · ${esc(scopeLabel)}</span></div>
            <h1 class="page-title">战队 <em>战绩</em></h1>
            <p class="page-sub">系列赛胜率看结果，小局胜率看过程。两赛季合计将场次合并后重新计算，不平均两个百分比。</p>
          </div>
          <div class="head-actions"><span class="tag gold">${teams.length} 支战队 · ${num(totalSeries)} 场系列赛</span></div>
        </div>

        <div class="kpi-grid">
          <div class="kpi-card" style="--kpi-color:var(--gold);--kpi-accent:rgba(232,185,104,.13)">
            <div class="kpi-top"><span class="kpi-label">参赛战队</span><span class="kpi-icon">${ICONS.users}</span></div>
            <div class="kpi-value">${teams.length}<small>支</small></div>
            <div class="kpi-note">在 <b>${esc(scopeLabel)}</b> 有出场记录</div>
          </div>
          <div class="kpi-card" style="--kpi-color:var(--blue);--kpi-accent:rgba(78,155,255,.12)">
            <div class="kpi-top"><span class="kpi-label">完成系列赛</span><span class="kpi-icon">${ICONS.trophy}</span></div>
            <div class="kpi-value">${num(totalSeries)}<small>场</small></div>
            <div class="kpi-note">含常规赛、季后赛与决赛</div>
          </div>
          <div class="kpi-card" style="--kpi-color:var(--green);--kpi-accent:rgba(61,220,151,.12)">
            <div class="kpi-top"><span class="kpi-label">完成小局</span><span class="kpi-icon">${ICONS.target}</span></div>
            <div class="kpi-value">${num(totalGames)}<small>局</small></div>
            <div class="kpi-note">BP 记录覆盖 <b>${num(meta?.battleRecords || totalGames)}</b> 局</div>
          </div>
          <div class="kpi-card" style="--kpi-color:var(--red);--kpi-accent:rgba(255,96,127,.12)">
            <div class="kpi-top"><span class="kpi-label">系列赛胜率最高</span><span class="kpi-icon">${ICONS.trophy}</span></div>
            <div class="kpi-value">${best ? pct(best.rate) : '—'}</div>
            <div class="kpi-note"><b>${esc(best?.team.name || '—')}</b> · ${best ? record(best.stats.series.wins, best.stats.series.losses) : '—'}</div>
          </div>
        </div>

        ${renderStandingsPanel()}

        <section class="panel table-panel">
          <div class="table-toolbar">
            <div class="panel-title" style="padding:2px 0"><span class="dot"></span>战队胜率总表</div>
            <span class="control-spacer"></span>
            <div class="legend-row">
              <span class="legend-item"><i style="background:var(--blue)"></i>年度总决赛</span>
              <span class="legend-item"><i style="background:var(--red)"></i>夏季赛</span>
              <span class="legend-item"><i style="background:var(--gold)"></i>两赛季合计</span>
            </div>
          </div>
          <div class="table-scroll">
            <table class="data-table team-table">
              <thead>
                <tr class="group-row">
                  <th class="sticky-col">战队</th>
                  <th class="group ${season === 'KPL2026S3' ? 'current' : ''}" colspan="2">2026 年度总决赛</th>
                  <th class="group ${season === 'KPL2026S2' ? 'current' : ''}" colspan="2">2026 KPL 夏季赛</th>
                  <th class="group ${season === ALL ? 'current' : 'total'}" colspan="2">两赛季合计</th>
                </tr>
                <tr class="col-row">
                  <th class="sticky-col">名称 / 缩写</th>
                  ${['KPL2026S3', 'KPL2026S2', 'total'].map((scope) => `${teamSortHeader('系列赛', scope, 'series')}${teamSortHeader('小局', scope, 'games')}`).join('')}
                </tr>
              </thead>
              <tbody id="teamTableBody">
                ${sortedTeams.length ? sortedTeams.map((team, index) => `<tr class="clickable" data-team-id="${esc(team.id)}">
                  <td class="sticky-col">
                    <div class="team-cell">
                      <span class="rank">${String(index + 1).padStart(2, '0')}</span>
                      ${teamImage(team, 'team-logo', team.name)}
                      <span class="team-name-cell"><strong>${esc(team.name)}</strong><small>${esc(team.short || '')}</small></span>
                    </div>
                  </td>
                  ${teamRecordCell(team.seasons.KPL2026S3, 'series')}
                  ${teamRecordCell(team.seasons.KPL2026S3, 'games')}
                  ${teamRecordCell(team.seasons.KPL2026S2, 'series')}
                  ${teamRecordCell(team.seasons.KPL2026S2, 'games')}
                  ${teamRecordCell(team.total, 'series')}
                  ${teamRecordCell(team.total, 'games')}
                </tr>`).join('') : '<tr><td colspan="7" style="text-align:center;padding:34px;color:var(--dim)">当前赛季没有战队记录</td></tr>'}
              </tbody>
            </table>
          </div>
          <div class="table-note">系列赛 = 一场 BO 赛的胜负；小局 = 单局比赛。小局胜率来自逐局 BP / 赛果记录；系列赛胜率来自官方赛程赛果。</div>
        </section>
      </section>`;

    $$('#teamsPage th[data-team-scope]').forEach((th) => {
      th.addEventListener('click', () => {
        const scope = th.dataset.teamScope;
        const type = th.dataset.teamType;
        if (state.teamSort.scope === scope && state.teamSort.type === type) {
          state.teamSort.dir = state.teamSort.dir === 'desc' ? 'asc' : 'desc';
        } else {
          state.teamSort = { scope, type, dir: 'desc' };
        }
        persistPrefs();
        renderTeamsPage($('#app'));
      });
    });
    $('#teamTableBody')?.addEventListener('click', (event) => {
      const row = event.target.closest('[data-team-id]');
      if (row) openTeamModal(row.dataset.teamId);
    });
    $$('#teamsPage [data-standings-season]').forEach((button) => {
      button.addEventListener('click', () => {
        state.standingsSeason = button.dataset.standingsSeason;
        state.standingsStage = state.standingsSeason === 'KPL2026S3' ? 'lts' : 'cgs';
        renderTeamsPage($('#app'));
      });
    });
    $$('#teamsPage [data-standings-stage]').forEach((button) => {
      button.addEventListener('click', () => {
        state.standingsStage = button.dataset.standingsStage;
        renderTeamsPage($('#app'));
      });
    });
    $$('#teamsPage [data-standings-team]').forEach((row) => {
      row.addEventListener('click', () => {
        if (row.dataset.standingsTeam) openTeamModal(row.dataset.standingsTeam);
      });
    });
    $$('#teamsPage [data-bracket-team]').forEach((row) => {
      row.addEventListener('click', () => {
        if (row.dataset.bracketTeam) openTeamModal(row.dataset.bracketTeam);
      });
    });
  }

  /* ---------------------------------------------------------
     Source / methodology page
     --------------------------------------------------------- */
  function openLegalNoticeModal() {
    showModal(`<div class="modal-body legal-modal">
      <div class="import-head">
        <div>
          <div class="eyebrow">LEGAL NOTICE · EFFECTIVE 2026-10-22</div>
          <h2>法律声明</h2>
          <p>KPL BP 决策台 · 峡谷博弈 · 权利人：摸鱼の修酱（B站@摸鱼の修酱）</p>
        </div>
        <span class="tag gold">PolyForm NC 1.0.0</span>
      </div>
      <div class="legal-declaration">本软件已开源，永久免费供个人非商业使用。严禁利用本软件及源码进行任何形式的商业盈利活动，违者将依法追究责任。</div>
      <div class="legal-section">
        <h3>一、权利归属与许可性质</h3>
        <p>本软件原创代码、界面、文档的著作权归权利人所有，受《中华人民共和国著作权法》《计算机软件保护条例》《中华人民共和国民法典》等法律保护。原创代码采用 PolyForm Noncommercial License 1.0.0 许可；源代码公开，但禁止商业使用，因此不属于 OSI 定义下的开源许可证。“已开源”仅指源码公开可见。</p>
      </div>
      <div class="legal-section">
        <h3>二、免费范围</h3>
        <p>任何个人为学习、研究、测试、娱乐、业余爱好等非商业目的使用本软件，永久免收许可费用。非商业组织按许可证条款执行。</p>
      </div>
      <div class="legal-section">
        <h3>三、禁止商业使用</h3>
        <p>未经权利人书面许可，不得出售、出租、付费分发、付费会员、广告或流量变现、商业 SaaS/API、企业内部商业部署、商业培训/咨询、商业代做 BP、与商业产品捆绑，或以其他方式直接、间接获取商业利益。商业使用须单独取得书面授权。</p>
      </div>
      <div class="legal-section">
        <h3>四、第三方数据与素材</h3>
        <p>官方赛事数据、英雄头像、战队 Logo、游戏截图等权利归腾讯、王者荣耀、KPL 及相关权利人所有，不属于本软件许可证授权范围。本软件与上述主体无官方隶属、合作或背书关系。</p>
      </div>
      <div class="legal-section">
        <h3>五、无担保与责任限制</h3>
        <p>本软件按“现状”提供，不保证无错误、不中断或数据绝对准确。在法律允许的最大范围内，权利人对使用或无法使用本软件造成的直接、间接及后果性损失不承担责任。使用者应自行备份数据并独立判断 BP 建议与统计结果。</p>
      </div>
      <div class="legal-section">
        <h3>六、违约与争议解决</h3>
        <p>违反许可证或本声明的，权利人有权终止授权，并要求停止使用、删除、下架和销毁副本；有权依法追究民事、行政责任，构成犯罪的依法追究刑事责任。争议适用中华人民共和国法律，由有管辖权的人民法院管辖。</p>
      </div>
      <div class="source-note">完整法律版本已随软件保存于根目录 <code>LEGAL_NOTICE.md</code>、<code>LICENSE</code>，并在数据目录保存 <code>data/LEGAL_NOTICE.md</code>。如本说明与 LICENSE 英文文本冲突，就许可授权范围以 LICENSE 为准。</div>
      <div class="modal-actions"><button class="btn primary" type="button" data-modal-close>我已阅读</button></div>
    </div>`, '法律声明');
  }

  function renderSourcePage(app) {
    const meta = state.data.meta;
    const status = state.status || {};
    const running = state.refreshing || status.syncRunning || status.state === 'running';
    const failed = status.state === 'error';
    const warnings = meta.warnings || [];
    const statusIcon = failed ? ICONS.close : running ? ICONS.refresh : ICONS.check;
    const statusClass = failed ? 'is-error' : running ? 'is-syncing' : '';
    app.innerHTML = `
      <section class="page" id="sourcePage">
        <div class="page-head">
          <div>
            <div class="page-kicker"><i></i><span>DATA PIPELINE · OFFICIAL SOURCE</span></div>
            <h1 class="page-title">数据 <em>来源</em></h1>
            <p class="page-sub">官方赛事数据落地到本地，再由浏览器读取快照。刷新只拉新增对局，不改写已有 BP。</p>
          </div>
          <div class="head-actions">
            <a class="btn ghost" href="${KPL_LIVE_URL}" target="_blank" rel="noopener noreferrer">KPL 官方直播</a>
            <button class="btn ghost" id="sourceUpdateBtn" type="button">v${APP_VERSION} · 检查更新</button>
            <button class="btn primary" id="sourceSyncBtn" type="button" ${running ? 'disabled' : ''}>${ICONS.refresh} ${running ? '同步中…' : '立即增量同步'}</button>
            <a class="btn ghost" href="/api/data" download="kpl-snapshot.json">${ICONS.download} 下载快照</a>
          </div>
        </div>

        <div class="source-grid">
          <section class="panel source-panel">
            <div class="panel-head" style="padding:0"><div><div class="panel-title"><span class="dot"></span>数据管道</div><div class="panel-sub">Incremental sync · 本地缓存 · 原子快照</div></div><span class="tag green">LIVE SOURCE</span></div>
            <div class="pipeline">
              <div class="pipe-step"><small>01 / SOURCE</small><strong>腾讯官方赛事中台</strong><span>赛程、对局、BP、英雄与战队统计</span></div>
              <div class="pipe-step"><small>02 / CACHE</small><strong>本地增量缓存</strong><span>只请求新对局；已完结 BP 不重复拉取</span></div>
              <div class="pipe-step"><small>03 / MODEL</small><strong>口径重算</strong><span>场次合并、概率矩阵、战队胜率</span></div>
              <div class="pipe-step"><small>04 / APP</small><strong>浏览器快照</strong><span>BP 板、英雄表、搭档图谱实时读取</span></div>
            </div>
            <div class="status-big ${statusClass}" id="sourceStatusPanel">
              <div class="status-orb ${statusClass}" id="sourceStatusOrb">${statusIcon}</div>
              <div><strong id="sourceStatusMsg">${esc(status.message || (meta ? '数据已就绪' : '等待同步'))}</strong><small id="sourceStatusMeta">${running && status.total ? `进度 ${num(status.progress)} / ${num(status.total)}` : `最后生成 ${formatStamp(meta.generatedAt)}`} · 自动同步每 ${num(status.autoSyncSeconds || 180)} 秒</small></div>
            </div>
            <div class="source-list">
              <div class="source-line"><span>快照生成</span><b>${esc(formatStamp(meta.generatedAt))}</b></div>
              <div class="source-line"><span>数据覆盖至</span><b>${esc(formatDateShort(meta.dataThrough))}</b></div>
              <div class="source-line"><span>系列赛 / 小局</span><b class="gold">${num(meta.totalSeries)} 场 / ${num(meta.totalBattles)} 局</b></div>
              <div class="source-line"><span>英雄 / 战队</span><b>${num(meta.heroes?.length || state.data.heroes.length)} 位 / ${num(meta.teams?.length || state.data.teams.length)} 支</b></div>
              <div class="source-line"><span>选手英雄记录</span><b>${num(meta.playerHeroRecords || state.data.playerHeroes?.length || 0)} 条 / ${num(meta.players || 0)} 位选手</b></div>
              <div class="source-line"><span>本地文件</span><b>data/snapshot.json</b></div>
              <div class="source-line"><span>软件版本</span><b class="gold">v${APP_VERSION}</b></div>
              <div class="source-line"><span>GitHub</span><b><a href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">AsuraZr/KPL-BP-Studio</a></b></div>
              <div class="source-line"><span>源标识</span><b>${esc(meta.source)}</b></div>
            </div>
            <div class="source-actions">
              <button class="btn" id="sourceReloadBtn" type="button">${ICONS.refresh} 重新读取快照</button>
              <span class="tag">无需账号 · 本地运行</span>
            </div>
          </section>

          <section class="panel source-panel">
            <div class="panel-head" style="padding:0"><div><div class="panel-title"><span class="dot"></span>接口与口径</div><div class="panel-sub">可复现 · 可审计</div></div><span class="tag gold">METHOD</span></div>
            <div class="source-note">${esc(meta.sourceNote)}<br>英雄分路以官方逐局出场记录中的实际分路为准（如杨戬、哪吒、夏侯惇、元流之子坦克按打野，王维按中路），不再直接沿用英雄资料页的静态职业。</div>
            <div class="method-grid">
              <div class="method"><strong>Ban 率</strong><span>被 Ban 次数 ÷ 总小局数。分母按赛季独立计算。</span></div>
              <div class="method"><strong>Pick 率</strong><span>出场次数 ÷ 总小局数。同队同场只计一次。</span></div>
              <div class="method"><strong>英雄胜率</strong><span>出场胜局 ÷ 出场次数，不等于战队胜率。</span></div>
              <div class="method"><strong>两赛季合计</strong><span>合并两季分子与分母后重算，避免百分比平均偏差。</span></div>
              <div class="method"><strong>搭档概率</strong><span>P(B|A) = A、B 同队同场局数 ÷ A 出场局数。</span></div>
              <div class="method"><strong>战队胜率</strong><span>系列赛按 BO 赛果，小局按每局胜方统计。</span></div>
              <div class="method"><strong>积分排行</strong><span>年度总决赛读取 KPL 官方大师组/精英组实时积分榜；夏季赛按官方常规赛赛果汇总，胜场=积分、净胜分=小局净胜。</span></div>
            </div>
            <div style="margin-top:13px">
              <div class="section-label"><h3>官方接口</h3><span>prod.comp.smoba.qq.com</span></div>
              <div class="endpoint"><code>/leaguesite/leagues/open</code><span>赛事索引</span></div>
              <div class="endpoint"><code>/leaguesite/matches/open</code><span>赛程 / 比分</span></div>
              <div class="endpoint"><code>/leaguesite/league/hero/settle_list/open</code><span>英雄汇总</span></div>
              <div class="endpoint"><code>/leaguesite/match/battles/open</code><span>对局列表</span></div>
              <div class="endpoint"><code>/leaguesite/battle/open</code><span>BP / 对局详情</span></div>
            </div>
            ${warnings.length ? `<div class="section-label" style="margin-top:14px"><h3>同步提示</h3><span>${warnings.length} 条</span></div><ul class="warning-list">${warnings.map((warning) => `<li>${esc(warning)}</li>`).join('')}</ul>` : ''}
          </section>
        </div>

        <section class="panel source-panel" style="margin-top:12px">
          <div class="panel-head" style="padding:0"><div><div class="panel-title"><span class="dot"></span>使用说明</div><div class="panel-sub">给教练、分析师和观众的本地工作流</div></div></div>
          <div class="method-grid">
            <div class="method"><strong>BP 演练室</strong><span>支持 BO1/3/5/7/9；普通局全局 BP，BO7/BO9 决胜局为巅峰对决。选择战队后，教练席会结合该队历史偏好给出建议。</span></div>
            <div class="method"><strong>英雄数据</strong><span>同时对照年度总决赛、夏季赛与合计三组 Ban/Pick/胜率，点击任意英雄查看搭档与最近出场。</span></div>
            <div class="method"><strong>搭档图谱</strong><span>选择战队或全 KPL，查看核心英雄的同队搭档条件概率、组合胜率与概率矩阵。</span></div>
            <div class="method"><strong>实时更新</strong><span>页面每 20 秒检查一次新快照；服务端默认每 3 分钟增量拉取。也可点击右上角刷新手动触发。</span></div>
          </div>
          <div class="source-note" style="margin-top:11px">免责声明：本工具是第三方本地分析工具，不是王者荣耀官方客户端。数据来自公开赛事接口；官方数据可能存在延迟、修订或个别对局明细缺失，请以 KPL 官方与王者营地最终展示为准。</div>
        </section>

        <section class="panel source-panel legal-panel" style="margin-top:12px">
          <div class="panel-head" style="padding:0">
            <div><div class="panel-title"><span class="dot"></span>法律声明</div><div class="panel-sub">LEGAL NOTICE · SOURCE-AVAILABLE · NONCOMMERCIAL</div></div>
            <span class="tag gold">PolyForm NC 1.0.0</span>
          </div>
          <div class="legal-declaration">本软件已开源，永久免费供个人非商业使用。严禁利用本软件及源码进行任何形式的商业盈利活动，违者将依法追究责任。</div>
          <div class="legal-points">
            <span>原创代码：非商业许可</span>
            <span>商业使用：须单独书面授权</span>
            <span>第三方数据/素材：权利归原方</span>
            <span>无担保 · 保留追责权利</span>
          </div>
          <div class="source-note">本软件源代码公开，但禁止商业使用，因此不属于 OSI 定义下的开源许可证。完整条款见软件根目录 <code>LEGAL_NOTICE.md</code> 与 <code>LICENSE</code>，数据目录同步保存 <code>data/LEGAL_NOTICE.md</code>。</div>
          <div class="source-actions"><button class="btn ghost sm" id="legalNoticeBtn" type="button">${ICONS.external} 查看完整法律声明</button></div>
        </section>
      </section>`;

    $('#sourceSyncBtn')?.addEventListener('click', () => startSyncRequest(false).catch((error) => toast(`同步请求失败：${error.message || error}`, 'error')));
    $('#sourceReloadBtn')?.addEventListener('click', () => loadData({ silent: true }));
    $('#sourceUpdateBtn')?.addEventListener('click', () => checkAppUpdate());
    $('#legalNoticeBtn')?.addEventListener('click', openLegalNoticeModal);
  }

  /* ---------------------------------------------------------
     Modal infrastructure
     --------------------------------------------------------- */
  function showModal(innerHtml, label) {
    const root = $('#modalRoot');
    if (!root) return;
    state.modalReturnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    root.innerHTML = `<div class="modal-backdrop" data-modal-backdrop>
      <section class="modal" role="dialog" aria-modal="true" aria-label="${esc(label)}">
        <button class="icon-btn modal-close" type="button" data-modal-close aria-label="关闭">${ICONS.close}</button>
        ${innerHtml}
      </section>
    </div>`;
    document.body.style.overflow = 'hidden';
    const backdrop = $('[data-modal-backdrop]', root);
    backdrop?.addEventListener('click', (event) => {
      if (event.target === backdrop) closeModal();
    });
    $$('[data-modal-close]', root).forEach((button) => button.addEventListener('click', closeModal));
    applyLanguage(root);
    window.requestAnimationFrame(() => $('[data-modal-close]', root)?.focus());
  }

  function versionParts(value) {
    return String(value || '').replace(/^v/i, '').split(/[.+-]/).map((part) => Number.parseInt(part, 10) || 0);
  }

  function isNewerVersion(latest, current) {
    const a = versionParts(latest);
    const b = versionParts(current);
    for (let index = 0; index < Math.max(a.length, b.length); index += 1) {
      if ((a[index] || 0) > (b[index] || 0)) return true;
      if ((a[index] || 0) < (b[index] || 0)) return false;
    }
    return false;
  }

  function updateFallbackHtml() {
    return `<div class="update-fallback"><a href="${esc(UPDATE_FALLBACK_URL)}" target="_blank" rel="noopener noreferrer">如无法更新请点击此处</a></div>`;
  }

  function updateBadgeText(status, latest = '') {
    if (status === 'checking') return state.lang === 'en' ? 'Checking…' : '检查中…';
    if (status === 'latest') return state.lang === 'en' ? 'Up to date' : '已是最新';
    if (status === 'update') return state.lang === 'en' ? `Update ${latest}` : `可更新 ${latest}`;
    if (status === 'error') return state.lang === 'en' ? 'Check failed' : '检查失败';
    return state.lang === 'en' ? 'Check updates' : '检查更新';
  }

  function setUpdateBadge(status, latest = '') {
    const label = $('#checkUpdateBtn')?.querySelector('em');
    if (label) label.textContent = updateBadgeText(status, latest);
    const button = $('#checkUpdateBtn');
    if (button) button.dataset.updateStatus = status;
  }

  async function checkAppUpdate({ silent = false } = {}) {
    const button = $('#checkUpdateBtn');
    const label = button?.querySelector('em');
    if (button?.disabled) return;
    if (!silent) {
      if (button) button.disabled = true;
      if (label) label.textContent = updateBadgeText('checking');
    }
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 12000);
    try {
      const response = await fetch(UPDATE_API_URL, {
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github+json' },
        signal: controller.signal
      });
      if (response.status === 404) {
        setUpdateBadge('error');
        if (!silent) {
          showModal(`<div class="modal-body update-modal">
            <div class="import-head"><div><div class="eyebrow">UPDATE CHECK</div><h2>暂无发布版本</h2><p>GitHub 仓库还没有发布 Release，请先访问仓库查看。</p></div></div>
            <div class="update-actions"><a class="btn primary" href="${esc(GITHUB_REPO_URL)}" target="_blank" rel="noopener noreferrer">打开 GitHub 仓库</a></div>
            ${updateFallbackHtml()}
          </div>`, '检查更新');
        }
        return;
      }
      if (!response.ok) throw new Error(`GitHub ${response.status}`);
      const release = await response.json();
      const latest = release.tag_name || release.name || '';
      const assets = Array.isArray(release.assets) ? release.assets : [];
      const exeAsset = assets.find((asset) => /\.exe$/i.test(asset.name || '')) || assets[0];
      const downloadUrl = exeAsset?.browser_download_url || release.html_url || GITHUB_REPO_URL;
      if (latest && isNewerVersion(latest, APP_VERSION)) {
        setUpdateBadge('update', latest);
        if (silent) {
          if (!state.updateNoticeShown) {
            state.updateNoticeShown = true;
            toast(`发现新版本 ${latest}，可点击顶部“检查更新”下载`, 'success', 5000);
          }
        } else {
          showModal(`<div class="modal-body update-modal">
            <div class="import-head"><div><div class="eyebrow">UPDATE AVAILABLE</div><h2>发现新版本 ${esc(latest)}</h2><p>当前版本 v${esc(APP_VERSION)} · 最新版本 ${esc(latest)}</p></div></div>
            <div class="update-notes">${esc((release.body || '包含最新功能与数据修复。').slice(0, 500))}</div>
            <div class="update-actions">
              <a class="btn primary" href="${esc(downloadUrl)}" target="_blank" rel="noopener noreferrer">下载更新</a>
              <a class="btn ghost" href="${esc(release.html_url || GITHUB_REPO_URL)}" target="_blank" rel="noopener noreferrer">查看 GitHub 发布页</a>
            </div>
            ${updateFallbackHtml()}
          </div>`, '检查更新');
        }
      } else {
        setUpdateBadge('latest');
        if (!silent) {
          showModal(`<div class="modal-body update-modal">
            <div class="import-head"><div><div class="eyebrow">UP TO DATE</div><h2>已是最新版本</h2><p>当前 v${esc(APP_VERSION)}${latest ? ` · GitHub 最新 ${esc(latest)}` : ''}</p></div></div>
            <div class="update-actions"><a class="btn ghost" href="${esc(GITHUB_REPO_URL)}" target="_blank" rel="noopener noreferrer">打开 GitHub 仓库</a></div>
            ${updateFallbackHtml()}
          </div>`, '检查更新');
        }
      }
    } catch (error) {
      setUpdateBadge('error');
      if (!silent) {
        showModal(`<div class="modal-body update-modal">
          <div class="import-head"><div><div class="eyebrow">UPDATE CHECK FAILED</div><h2>无法连接 GitHub 检查更新</h2><p>${esc(error?.name === 'AbortError' ? '连接超时。' : '当前网络无法访问 GitHub。')} 你仍可手动打开仓库或使用备用更新说明。</p></div></div>
          <div class="update-actions"><a class="btn ghost" href="${esc(GITHUB_REPO_URL)}" target="_blank" rel="noopener noreferrer">打开 GitHub 仓库</a></div>
          ${updateFallbackHtml()}
        </div>`, '检查更新');
      }
    } finally {
      window.clearTimeout(timer);
      if (!silent && button) button.disabled = false;
    }
  }

  function closeModal() {
    const root = $('#modalRoot');
    if (root) root.innerHTML = '';
    document.body.style.overflow = '';
    const heroReturn = state.heroReturnTo;
    const teamReturn = state.teamReturnHero;
    const seriesReturn = state.seriesReturnTeam;
    state.heroReturnTo = null;
    state.teamReturnHero = null;
    state.seriesReturnTeam = null;
    state.heroModal = null;
    state.teamModal = null;
    state.seriesModal = null;
    if (state.modalReturnFocus instanceof HTMLElement) {
      state.modalReturnFocus.focus();
      state.modalReturnFocus = null;
    }
    if (teamReturn?.heroId) {
      openHeroModal(teamReturn.heroId, teamReturn.teamId);
      state.heroReturnTo = teamReturn.heroReturnTo || null;
      return;
    }
    if (heroReturn?.type === 'series') {
      openSeriesDetailModal(heroReturn.seriesId, heroReturn.gameIndex);
      state.seriesReturnTeam = seriesReturn;
      return;
    }
    if (seriesReturn?.teamId) {
      openTeamModal(seriesReturn.teamId);
      if (state.teamModal) {
        if (seriesReturn.season === ALL || SEASONS.includes(seriesReturn.season)) {
          state.teamModal.season = seriesReturn.season;
        }
        if (seriesReturn.heroId) state.teamModal.heroId = seriesReturn.heroId;
        renderTeamModalBody();
      }
      return;
    }
    if (heroReturn?.type === 'team' && heroReturn.teamId) {
      openTeamModal(heroReturn.teamId);
      if (state.teamModal) {
        if (heroReturn.season === ALL || SEASONS.includes(heroReturn.season)) {
          state.teamModal.season = heroReturn.season;
        }
        if (heroReturn.heroId) state.teamModal.heroId = heroReturn.heroId;
        renderTeamModalBody();
      }
      return;
    }
    if (state.pendingReload) {
      state.pendingReload = false;
      loadData({ silent: true });
    }
  }

  function modalStatCard(label, stats, current) {
    return `<div class="stat-card ${current ? 'is-current' : ''}">
      <h4>${esc(label)} <span>${stats?.picks || 0} 局</span></h4>
      <div class="stat-trio">
        <div><span>BAN</span><b style="color:var(--red-2)">${stats ? pct(stats.banRate) : '—'}</b></div>
        <div><span>PICK</span><b style="color:var(--blue-2)">${stats ? pct(stats.pickRate) : '—'}</b></div>
        <div><span>WIN</span><b class="${rateClass(stats?.winRate)}">${stats ? pct(stats.winRate) : '—'}</b></div>
      </div>
    </div>`;
  }

  function appearanceRow(appearance, heroId = null) {
    const team = state.teamMap.get(String(appearance.teamId));
    const opponent = state.teamMap.get(String(appearance.opponentId));
    const series = state.seriesById.get(String(appearance.seriesId));
    let score = '—';
    if (series) {
      if (String(series.t1) === String(appearance.teamId)) score = `${series.s1}:${series.s2}`;
      else score = `${series.s2}:${series.s1}`;
    }
    return `<button type="button" class="match-row match-row-action" data-team-detail="${esc(appearance.teamId)}" data-team-hero="${heroId ? esc(heroId) : ''}" title="打开${esc(team?.name || '战队')}详情，并查看该英雄的队员历史胜率">
      <span class="match-date">${esc(formatDay(appearance.date))}</span>
      <div class="match-teams">${teamImage(team, 'team-logo', team?.name)}<span>${esc(team?.name || appearance.teamId)}</span><b style="color:var(--dim);font-weight:400">vs</b>${teamImage(opponent, 'team-logo', opponent?.name)}<span>${esc(opponent?.name || appearance.opponentId)}</span></div>
      <span class="match-score">${esc(score)}</span>
      <span class="match-result ${appearance.won ? 'win' : 'loss'}">${appearance.won ? '胜' : '负'}</span>
    </button>`;
  }

  function openHeroModal(heroId, teamId = null) {
    const hero = state.heroMap.get(Number(heroId));
    if (!hero) return;
    state.heroReturnTo = state.seriesModal
      ? {
          type: 'series',
          seriesId: state.seriesModal.seriesId,
          gameIndex: state.seriesModal.gameIndex
        }
      : state.teamModal?.teamId
        ? {
            type: 'team',
            teamId: state.teamModal.teamId,
            season: state.teamModal.season,
            heroId: state.teamModal.heroId
          }
        : null;
    const season = state.season;
    let selectedTeam = teamId && teamId !== ALL && state.teamMap.has(String(teamId))
      ? String(teamId)
      : null;
    if (!selectedTeam) {
      const series = getSeries();
      const candidates = [series.blueTeam, series.redTeam].filter((id) => id && id !== ALL);
      selectedTeam = candidates.find((id) => playersForHero(id, hero.id).length) || candidates[0] || null;
    }
    if (!selectedTeam) {
      selectedTeam = (state.data.teams || []).map((team) => String(team.id)).find((id) => playersForHero(id, hero.id).length) || null;
    }
    state.heroModal = { heroId: hero.id, teamId: selectedTeam };
    const partners = buildPartnerRows(hero.id, ALL, season).rows.slice(0, 5);
    const appearances = (state.heroAppearances.get(hero.id) || []).filter((row) => season === ALL || row.season === season).slice(0, 8);
    const role = heroRoles(hero)[0];
    const statCards = [['KPL2026S3', '2026 年度总决赛'], ['KPL2026S2', '2026 KPL 夏季赛'], [ALL, '两赛季合计']]
      .map(([key, label]) => modalStatCard(label, heroStat(hero, key), season === key))
      .join('');
    const positionRecord = Object.entries(hero.positionStats || {})
      .filter(([key]) => key !== 'total')
      .map(([key, counts]) => `${seasonShort(key)} ${Object.entries(counts).map(([role, n]) => `${role} ${n}`).join(' / ')}`)
      .join(' · ');
    const partnerRows = partners.length
      ? partners.map((row) => `<div class="mini-row">
          ${heroImage(row.hero, 'mini-hero', row.hero.name)}
          <div class="mini-main"><strong>${esc(row.hero.name)} <span class="role-tag ${roleClass(pairRole(row.hero))}">${esc(pairRole(row.hero))}</span></strong><small>同队 ${row.n} 局 · 组合 ${row.wins} 胜</small></div>
          <div class="mini-val">${pct(row.pBA)}<small>P(搭档|本英雄)</small></div>
          <div class="mini-val">${pct(row.comboWin)}<small>组合胜率</small></div>
        </div>`).join('')
      : '<div class="empty-state" style="padding:20px">当前赛季暂无搭档样本</div>';
    const appearanceRows = appearances.length
      ? appearances.map((appearance) => appearanceRow(appearance, hero.id)).join('')
      : '<div class="empty-state" style="padding:20px">当前赛季暂无出场记录</div>';

    const teamOptionsHtml = [...(state.data.teams || [])]
      .sort((a, b) => {
        const ca = playersForHero(a.id, hero.id).length;
        const cb = playersForHero(b.id, hero.id).length;
        return cb - ca || a.name.localeCompare(b.name, 'zh-CN');
      })
      .map((team) => {
        const count = playersForHero(team.id, hero.id).length;
        return `<option value="${esc(team.id)}" ${String(selectedTeam) === String(team.id) ? 'selected' : ''}>${esc(team.name)}${count ? ` · ${count} 人使用` : ' · 无记录'}</option>`;
      }).join('');
    const playerRowsData = playersForHero(selectedTeam, hero.id);
    const playerRows = playerRowsData.length
      ? playerRowsData.map((row) => {
          const initial = (row.playerName || '?').slice(0, 1);
          const split = (stats) => `<div class="player-split"><b class="${rateClass(stats?.winRate)}">${pct(stats?.winRate ?? null)}</b><small>${stats?.games || 0} 局</small></div>`;
          return `<div class="player-stat-row">
            <span class="player-badge">${esc(initial)}</span>
            <div class="player-main"><strong>${esc(row.playerName)}</strong><small>${esc(row.position || '选手')} · 合计 ${row.total?.games || 0} 局 · ${row.total?.wins || 0} 胜</small></div>
            <div class="player-splits">
              <div class="player-split-wrap" title="2026 年度总决赛"><span>年度</span>${split(row.seasons?.KPL2026S3)}</div>
              <div class="player-split-wrap" title="2026 KPL 夏季赛"><span>夏季</span>${split(row.seasons?.KPL2026S2)}</div>
              <div class="player-split-wrap total"><span>合计</span>${split(row.total)}</div>
            </div>
          </div>`;
        }).join('')
      : '<div class="empty-state" style="padding:18px"><strong>该战队没有选手使用记录</strong>可切换其他战队查看；数据仅统计 2026 两个赛季。</div>';

    showModal(`
      <div class="hero-banner">
        <div class="hero-banner-art">${heroImage(hero, '', hero.name)}</div>
        <div class="hero-banner-copy">
          <div class="eyebrow">HERO PROFILE · #${hero.id}</div>
          <h2>${esc(hero.name)} <small>${esc(hero.title || '')}</small></h2>
          <p>${esc(seasonLabel(season))} · 官方赛事汇总 · 分路按逐局实际出场</p>
          <div class="hero-banner-tags">${roleTags(heroRoles(hero))}<span class="tag gold">${esc(role)}</span><span class="tag green">实际分路</span></div>
        </div>
      </div>
      <div class="modal-body">
        <div class="modal-section">
          <div class="section-label"><h3>三窗口数据</h3><span>Ban / Pick / 胜率</span></div>
          <div class="stat-card-grid">${statCards}</div>
          ${positionRecord ? `<div class="position-record"><span>实际分路记录</span>${esc(positionRecord)}</div>` : ''}
        </div>
        <div class="modal-section">
          <div class="section-label">
            <h3>战队队员使用该英雄 · 历史胜率</h3>
            <select class="control-select compact-select" id="heroTeamSelect" aria-label="选择战队查看队员使用情况">${teamOptionsHtml}</select>
          </div>
          <div class="player-stat-list">${playerRows}</div>
          <div class="player-stat-note">仅统计 2026 年度总决赛、2026 KPL 夏季赛及两赛季合计；选手按官方逐局出场记录汇总。</div>
        </div>
        <div class="modal-section">
          <div class="section-label"><h3>最佳搭档</h3><span>全 KPL · ${esc(seasonLabel(season))}</span></div>
          <div class="mini-list">${partnerRows}</div>
        </div>
        <div class="modal-section">
          <div class="section-label"><h3>最近出场</h3><span>最近 ${appearances.length} 局</span></div>
          <div class="match-list">${appearanceRows}</div>
        </div>
      </div>` , `${hero.name} 英雄详情`);

    $('#heroTeamSelect')?.addEventListener('change', (event) => {
      openHeroModal(hero.id, event.target.value);
    });
  }

  function teamSeasonFallback(team) {
    if (team.seasons?.KPL2026S3?.games.played) return 'KPL2026S3';
    if (team.seasons?.KPL2026S2?.games.played) return 'KPL2026S2';
    return ALL;
  }

  function openTeamModal(teamId) {
    const team = state.teamMap.get(String(teamId));
    if (!team) return;
    let season = state.season;
    if (season !== ALL && !(teamStat(team, season)?.games.played)) season = teamSeasonFallback(team);
    const ctx = getCtx(season, team.id);
    const defaultHero = [...ctx.pickStats.entries()].sort((a, b) => b[1].n - a[1].n)[0]?.[0]
      || state.data.heroes.find((hero) => playersForHero(team.id, hero.id).length)?.id;
    state.teamModal = {
      teamId: team.id,
      season,
      heroId: defaultHero ? Number(defaultHero) : null,
      seriesQuery: ''
    };
    const stats = teamStat(team, season);
    showModal(`
      <div class="hero-banner team-banner">
        <div class="hero-banner-art team-banner-logo">${teamImage(team, '', team.name)}</div>
        <div class="hero-banner-copy">
          <div class="eyebrow">TEAM PROFILE · ${esc(team.short || 'KPL')}</div>
          <h2>${esc(team.name)}</h2>
          <p>系列赛与小局双口径 · ${esc(seasonLabel(season))}</p>
          <div class="hero-banner-tags"><span class="tag gold">${num(stats?.series?.played || 0)} 场系列赛</span><span class="tag blue">${num(stats?.games?.played || 0)} 局</span></div>
        </div>
      </div>
      <div class="modal-body" id="teamModalBody"></div>` , `${team.name} 战队详情`);
    renderTeamModalBody();
  }

  function teamSeriesSearchText(row, team) {
    const isTeam1 = String(row.t1) === String(team.id);
    const opponentId = isTeam1 ? row.t2 : row.t1;
    const opponent = state.teamMap.get(String(opponentId));
    const won = (row.w === 1 && isTeam1) || (row.w === 2 && !isTeam1);
    const score = isTeam1 ? `${row.s1}:${row.s2}` : `${row.s2}:${row.s1}`;
    return [
      opponent?.name,
      opponent?.short,
      row.stage,
      row.date,
      formatDay(row.date),
      score,
      won ? '胜' : '负',
      `BO${row.bo}`
    ].filter(Boolean).join(' ').toLocaleLowerCase('zh-CN');
  }

  function teamSeriesRows(team, rows) {
    if (!rows.length) return '<div class="empty-state" style="padding:18px">没有找到匹配的系列赛</div>';
    return rows.map((row) => {
      const isTeam1 = String(row.t1) === String(team.id);
      const opponentId = isTeam1 ? row.t2 : row.t1;
      const opponent = state.teamMap.get(String(opponentId));
      const won = (row.w === 1 && isTeam1) || (row.w === 2 && !isTeam1);
      return `<button type="button" class="match-row match-row-action" data-series-detail="${esc(row.id)}" title="查看赛后数据对阵图">
        <span class="match-date">${esc(formatDay(row.date))}</span>
        <div class="match-teams">${teamImage(opponent, 'team-logo', opponent?.name)}<span>${esc(opponent?.name || opponentId)}</span><b style="color:var(--dim);font-weight:400">·</b><span>${esc(row.stage || '')}</span></div>
        <span class="match-score">${isTeam1 ? `${row.s1}:${row.s2}` : `${row.s2}:${row.s1}`}</span>
        <span class="match-result ${won ? 'win' : 'loss'}">${won ? '胜' : '负'} <i>›</i></span>
      </button>`;
    }).join('');
  }

  function renderTeamModalBody() {
    if (!state.teamModal) return;
    const body = $('#teamModalBody');
    if (!body) return;
    const team = state.teamMap.get(String(state.teamModal.teamId));
    if (!team) return;
    const season = state.teamModal.season;
    const stats = teamStat(team, season);
    const allSeries = (state.seriesByTeam.get(String(team.id)) || [])
      .filter((row) => season === ALL || row.season === season);
    const seriesQuery = String(state.teamModal.seriesQuery || '').trim().toLocaleLowerCase('zh-CN');
    const series = seriesQuery
      ? allSeries.filter((row) => teamSeriesSearchText(row, team).includes(seriesQuery))
      : allSeries;
    const ctx = getCtx(season, team.id);
    const picks = [...ctx.pickStats.entries()]
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 6)
      .map(([heroId, data]) => ({ hero: state.heroMap.get(Number(heroId)), data }));
    const bans = [...ctx.banStats.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([heroId, count]) => ({ hero: state.heroMap.get(Number(heroId)), count }));
    const duos = [...ctx.pairs.entries()]
      .filter(([, data]) => data.n >= 2)
      .sort((a, b) => b[1].n - a[1].n)
      .slice(0, 4)
      .map(([key, data]) => {
        const [a, b] = key.split('|').map(Number);
        return { a: state.heroMap.get(a), b: state.heroMap.get(b), n: data.n, wins: data.w };
      });

    const playerHeroes = state.data.heroes
      .filter((hero) => playersForHero(team.id, hero.id).length)
      .sort((a, b) => {
        const gamesA = playersForHero(team.id, a.id).reduce((sum, row) => sum + (row.total?.games || 0), 0);
        const gamesB = playersForHero(team.id, b.id).reduce((sum, row) => sum + (row.total?.games || 0), 0);
        return gamesB - gamesA || a.name.localeCompare(b.name, 'zh-CN');
      });
    let selectedPlayerHeroId = Number(state.teamModal.heroId);
    if (!playerHeroes.some((hero) => hero.id === selectedPlayerHeroId)) {
      selectedPlayerHeroId = playerHeroes[0]?.id || state.data.heroes[0]?.id;
    }
    state.teamModal.heroId = selectedPlayerHeroId;
    const heroOptions = playerHeroes.length
      ? playerHeroes.map((hero) => `<option value="${hero.id}" ${hero.id === selectedPlayerHeroId ? 'selected' : ''}>${esc(hero.name)}</option>`).join('')
      : '<option value="">暂无使用记录</option>';
    const playerRows = playersForHero(team.id, selectedPlayerHeroId).length
      ? playersForHero(team.id, selectedPlayerHeroId).map((row) => {
          const split = (statsRow) => `<span class="player-split"><b class="${rateClass(statsRow?.winRate)}">${pct(statsRow?.winRate ?? null)}</b><small>${statsRow?.games || 0} 局</small></span>`;
          return `<div class="player-stat-row">
            <span class="player-badge">${esc((row.playerName || '?').slice(0, 1))}</span>
            <div class="player-main"><strong>${esc(row.playerName)}</strong><small>${esc(row.position || '选手')} · 合计 ${row.total?.games || 0} 局</small></div>
            <div class="player-splits">
              <div class="player-split-wrap" title="2026 年度总决赛"><span>年度</span>${split(row.seasons?.KPL2026S3)}</div>
              <div class="player-split-wrap" title="2026 KPL 夏季赛"><span>夏季</span>${split(row.seasons?.KPL2026S2)}</div>
              <div class="player-split-wrap total"><span>合计</span>${split(row.total)}</div>
            </div>
          </div>`;
        }).join('')
      : '<div class="empty-state" style="padding:14px">该战队暂无选手使用该英雄的记录</div>';

    const seriesRows = teamSeriesRows(team, series);
    const pickRows = picks.length ? picks.map(({ hero, data }) => `<div class="mini-row clickable" data-team-hero="${hero.id}" role="button" tabindex="0" title="点击切换该英雄的队员历史胜率">
      ${heroImage(hero, 'mini-hero', hero?.name)}
      <div class="mini-main"><strong>${esc(hero?.name || '')}</strong><small>${data.n} 局出场 · ${data.w} 胜</small></div>
      <div class="mini-val">${pct(data.n ? data.w / data.n : null)}<small>胜率</small></div>
      <div class="mini-val">${num(data.n)}<small>局</small></div>
    </div>`).join('') : '<div class="empty-state" style="padding:16px">暂无</div>';
    const banRows = bans.length ? bans.map(({ hero, count }) => `<div class="mini-row">
      ${heroImage(hero, 'mini-hero', hero?.name)}
      <div class="mini-main"><strong>${esc(hero?.name || '')}</strong><small>本队 Ban 次数</small></div>
      <div class="mini-val">${num(count)}<small>次</small></div>
      <div class="mini-val">—<small>占比</small></div>
    </div>`).join('') : '<div class="empty-state" style="padding:16px">暂无</div>';
    const duoRows = duos.length ? duos.map(({ a, b, n, wins }) => `<div class="mini-row">
      <span style="display:flex;gap:2px">${heroImage(a, 'mini-hero', a?.name)}${heroImage(b, 'mini-hero', b?.name)}</span>
      <div class="mini-main"><strong>${esc(a?.name || '')} + ${esc(b?.name || '')}</strong><small>同队同场 ${n} 局</small></div>
      <div class="mini-val">${pct(n ? wins / n : null)}<small>组合胜率</small></div>
      <div class="mini-val">${num(n)}<small>局</small></div>
    </div>`).join('') : '<div class="empty-state" style="padding:16px">暂无</div>';

    body.innerHTML = `
      <div class="modal-tabs">
        ${['KPL2026S3', 'KPL2026S2', ALL].map((key) => `<button type="button" class="${season === key ? 'is-active' : ''}" data-team-season="${key}">${key === ALL ? '两赛季合计' : seasonShort(key)}</button>`).join('')}
      </div>
      <div class="detail-kpis">
        <div class="detail-kpi"><span>系列赛战绩</span><b>${record(stats?.series?.wins || 0, stats?.series?.losses || 0)}</b><small>${pct(stats?.series?.winRate ?? null)} 胜率</small></div>
        <div class="detail-kpi"><span>小局战绩</span><b>${record(stats?.games?.wins || 0, stats?.games?.losses || 0)}</b><small>${pct(stats?.games?.winRate ?? null)} 胜率</small></div>
        <div class="detail-kpi"><span>系列赛场次</span><b>${num(stats?.series?.played || 0)}</b><small>完成 BO 赛</small></div>
        <div class="detail-kpi"><span>小局场次</span><b>${num(stats?.games?.played || 0)}</b><small>已记录对局</small></div>
      </div>
      <div class="modal-section" style="margin-top:16px">
        <div class="section-label">
          <h3>队员使用英雄 · 历史胜率</h3>
          <select class="control-select compact-select" id="teamHeroSelect" aria-label="选择英雄查看队员历史胜率">${heroOptions}</select>
        </div>
        <div class="player-stat-list">${playerRows}</div>
        <div class="player-stat-note">仅统计 2026 年度总决赛、2026 KPL 夏季赛及两赛季合计；数据随官方快照增量更新。</div>
      </div>
      <div class="modal-section" style="margin-top:16px">
        <div class="section-label team-series-head">
          <h3>系列赛记录</h3>
          <div class="team-series-tools">
            <input id="teamSeriesSearch" class="team-series-search" type="search" value="${esc(state.teamModal.seriesQuery || '')}" placeholder="搜索对手 / 阶段 / 日期…" autocomplete="off" aria-label="搜索该赛季系列赛" />
            <span id="teamSeriesCount">${series.length}/${allSeries.length} 场</span>
          </div>
        </div>
        <div class="match-list" id="teamSeriesList">${seriesRows}</div>
      </div>
      <div class="source-grid" style="gap:10px">
        <div>
          <div class="section-label"><h3>常用英雄</h3><span>按出场</span></div>
          <div class="mini-list">${pickRows}</div>
        </div>
        <div>
          <div class="section-label"><h3>常 Ban 英雄</h3><span>按 Ban 次数</span></div>
          <div class="mini-list">${banRows}</div>
        </div>
      </div>
      <div class="modal-section" style="margin-top:16px">
        <div class="section-label"><h3>常用搭档</h3><span>同队同场 ≥2 局</span></div>
        <div class="mini-list">${duoRows}</div>
      </div>`;
    applyLanguage(body);

    $$('[data-team-hero]', body).forEach((row) => {
      const pickHero = () => {
        state.teamModal.heroId = Number(row.dataset.teamHero);
        renderTeamModalBody();
        window.requestAnimationFrame(() => {
          $('#teamHeroSelect')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      };
      row.addEventListener('click', pickHero);
      row.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          pickHero();
        }
      });
    });
    $('#teamSeriesSearch', body)?.addEventListener('input', (event) => {
      state.teamModal.seriesQuery = event.target.value;
      const query = String(event.target.value || '').trim().toLocaleLowerCase('zh-CN');
      const filtered = query
        ? allSeries.filter((row) => teamSeriesSearchText(row, team).includes(query))
        : allSeries;
      const list = $('#teamSeriesList', body);
      const count = $('#teamSeriesCount', body);
      if (list) list.innerHTML = teamSeriesRows(team, filtered);
      if (count) count.textContent = `${filtered.length}/${allSeries.length} 场`;
    });
    $$('[data-team-season]', body).forEach((button) => {
      button.addEventListener('click', () => {
        state.teamModal.season = button.dataset.teamSeason;
        renderTeamModalBody();
      });
    });
    $('#teamHeroSelect', body)?.addEventListener('change', (event) => {
      state.teamModal.heroId = Number(event.target.value);
      renderTeamModalBody();
    });
  }

  function formatGameDuration(value) {
    const ms = Number(value) || 0;
    const total = Math.max(0, Math.round(ms / 1000));
    return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  function formatGoldValue(value) {
    const gold = Number(value);
    if (!Number.isFinite(gold)) return '—';
    return gold >= 1000 ? `${(gold / 1000).toFixed(1)}k` : String(gold);
  }

  function fallbackSeriesBattleDetail(series, battle) {
    const teamIds = [String(battle.t[0]), String(battle.t[1])];
    const camps = {};
    for (const index of [0, 1]) {
      const team = state.teamMap.get(teamIds[index]);
      camps[`camp${index + 1}`] = {
        team_id: teamIds[index],
        team_name: team?.name || teamIds[index],
        team_icon: team?.logo || '',
        is_win: battle.w === index + 1 ? 1 : 0,
        kill_num: null,
        assist_num: null,
        death_num: null,
        gold: null
      };
    }
    const players = (battle.pl || []).map(([camp, heroId, playerName, positionDesc]) => {
      const hero = state.heroMap.get(Number(heroId));
      return {
        camp: Number(camp),
        teamId: teamIds[Number(camp) - 1],
        heroId,
        heroName: hero?.name || '',
        playerName,
        positionDesc,
        kills: null,
        deaths: null,
        assists: null,
        gold: null,
        equipment: []
      };
    });
    return {
      battleId: battle.id,
      winCamp: battle.w,
      duration: battle.dur,
      camp1: camps.camp1,
      camp2: camps.camp2,
      players
    };
  }

  function renderPostPlayer(player, side) {
    if (!player) return '<div class="post-player is-empty"><span>—</span></div>';
    const hero = state.heroMap.get(Number(player.heroId));
    const initial = String(player.playerName || player.actualPlayerName || '?').slice(0, 1);
    const portrait = player.playerIcon
      ? `<img src="${esc(player.playerIcon)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
      : `<span class="post-initial">${esc(initial)}</span>`;
    const items = (player.equipment || []).slice(0, 6).map((item) =>
      item.icon
        ? `<img src="${esc(item.icon)}" alt="${esc(item.name || '')}" title="${esc(item.name || '')}" loading="lazy" referrerpolicy="no-referrer" />`
        : ''
    ).join('');
    return `<div class="post-player ${player.mvp ? 'is-mvp' : ''}">
      <span class="post-player-avatar">${portrait}</span>
      <button type="button" class="post-player-id" data-open-hero="${player.heroId || ''}" data-hero-team="${esc(player.teamId || '')}" title="查看该选手使用此英雄的历史胜率">
        <b>${esc(player.playerName || player.actualPlayerName || '—')}</b>
        <small>${esc(hero?.name || player.heroName || '—')}</small>
      </button>
      <button type="button" class="post-hero-thumb" data-open-hero="${player.heroId || ''}" data-hero-team="${esc(player.teamId || '')}" title="查看该选手使用此英雄的历史胜率">${hero ? heroImage(hero, '', hero.name) : ''}</button>
      <span class="post-kda" title="击杀 / 死亡 / 助攻">${player.kills ?? '—'}/${player.deaths ?? '—'}/${player.assists ?? '—'}</span>
      <span class="post-gold" title="经济">${formatGoldValue(player.gold)}</span>
      <span class="post-items">${items || '<i class="post-no-item">—</i>'}</span>
    </div>`;
  }

  function battleExportText(series, battle) {
    const team1 = state.teamMap.get(String(battle.t[0]));
    const team2 = state.teamMap.get(String(battle.t[1]));
    const heroName = (id) => state.heroMap.get(Number(id))?.name || '—';
    const listText = (ids) => (ids || []).filter(Boolean).map(heroName).join(' / ') || '—';
    const peak = !(battle.b?.[0]?.length) && !(battle.b?.[1]?.length);
    return [
      '【KPL BP 演练室】',
      `赛季：${seasonLabel(battle.season)} · 第 ${battle.seq} 局`,
      `模式：${peak ? '巅峰对决（无 Ban / 双方盲选）' : '全局 BP'}`,
      `蓝方：${team1?.name || battle.t[0]}`,
      `Ban：${peak ? '无' : listText(battle.b?.[0])}`,
      `Pick：${listText(battle.p?.[0])}`,
      `红方：${team2?.name || battle.t[1]}`,
      `Ban：${peak ? '无' : listText(battle.b?.[1])}`,
      `Pick：${listText(battle.p?.[1])}`,
      `本局进度：${peak ? 10 : 20}/${peak ? 10 : 20}`
    ].join('\n');
  }

  async function copyBattleBP(series, battle) {
    const text = battleExportText(series, battle);
    const ok = await copyText(text);
    if (ok) {
      toast('本局 BP 已复制，可粘贴到导入 BP', 'success');
      return;
    }
    showModal(`<div class="modal-body copy-bp-modal">
      <div class="import-head">
        <div><div class="eyebrow">EXPORT BP TEXT</div><h2>复制本局 BP</h2><p>浏览器未授予剪贴板权限，请手动全选复制下面的文本。</p></div>
      </div>
      <textarea class="import-textarea" readonly>${esc(text)}</textarea>
      <div class="modal-actions"><button class="btn primary" type="button" data-modal-close>关闭</button></div>
    </div>`, '复制 BP 文本');
  }

  function loadBattleIntoDraft(series, battle) {
    const current = getGame();
    const season = battle.season;
    const bo = [1, 3, 5, 7, 9].includes(Number(series.bo)) ? Number(series.bo) : 1;
    const targetHasActions = Boolean(state.drafts?.[season]?.games?.some((game) => game.actions?.length));
    if ((current.actions.length || targetHasActions) && !window.confirm(`载入历史 BP 会新建一场 BO${bo} 并覆盖目标赛季的 BP 草稿，继续吗？`)) return;
    const battles = (state.data.battles || [])
      .filter((row) => String(row.mid) === String(series.id))
      .sort((a, b) => Number(a.seq) - Number(b.seq));
    const selectedSeq = Math.min(bo, Math.max(1, Number(battle.seq) || 1));
    let upto = battles.filter((row) => Number(row.seq) <= selectedSeq);
    if (!upto.length) upto = [battle];
    const next = createSeries(season, bo, {
      blue: String(series.t1),
      red: String(series.t2)
    });
    for (const row of upto) {
      const no = Math.min(bo, Math.max(1, Number(row.seq) || 1));
      const game = next.games[no - 1];
      if (!game) continue;
      const swap = String(row.t[0]) !== String(series.t1);
      const peak = game.mode === 'peak' || (!(row.b?.[0]?.length) && !(row.b?.[1]?.length));
      const blueIndex = swap ? 1 : 0;
      const redIndex = swap ? 0 : 1;
      const blueBans = row.b?.[blueIndex] || [];
      const redBans = row.b?.[redIndex] || [];
      const bluePicks = row.p?.[blueIndex] || [];
      const redPicks = row.p?.[redIndex] || [];
      game.swapSides = swap;
      game.mode = peak ? 'peak' : 'standard';
      const banIndex = { blue: 0, red: 0 };
      const pickIndex = { blue: 0, red: 0 };
      if (peak) {
        for (const side of ['blue', 'red']) {
          const picks = side === 'blue' ? bluePicks : redPicks;
          for (const heroId of picks) {
            const id = Number(heroId);
            if (!id) continue;
            game[side].picks[pickIndex[side]] = id;
            game.actions.push({ type: 'pick', side, heroId: id, slot: pickIndex[side] });
            pickIndex[side] += 1;
          }
        }
      } else {
        for (const step of DRAFT_STEPS) {
          const source = step.type === 'ban' ? { blue: blueBans, red: redBans } : { blue: bluePicks, red: redPicks };
          const index = step.type === 'ban' ? banIndex : pickIndex;
          const heroId = Number(source[step.side]?.[index[step.side]]);
          if (!heroId) break;
          const slots = step.type === 'ban' ? game[step.side].bans : game[step.side].picks;
          const slot = index[step.side];
          slots[slot] = heroId;
          game.actions.push({ type: step.type, side: step.side, heroId, slot });
          index[step.side] += 1;
        }
      }
      game.step = game.actions.length;
      game.complete = gameIsComplete(game);
      // battle.t[0] is the blue-side team in the detail data. When the series
      // side is swapped, gameTeamId maps that blue side back to the correct team.
      const winnerSide = row.w === 1 ? 'blue' : row.w === 2 ? 'red' : null;
      game.winner = winnerSide ? gameTeamId(next, game, winnerSide) : null;
    }
    next.currentGame = selectedSeq;
    next.complete = Boolean(seriesWinner(next));
    state.drafts[season] = next;
    state.season = season;
    state.reviewGameNo = null;
    state.lastAction = null;
    saveDrafts();
    closeModal();
    if (state.view === 'draft') render();
    else setView('draft');
    toast(`已载入 BO${bo} 的前 ${upto.length} 局，当前为 G${selectedSeq}`, 'success', 4500);
  }

  function battleBpOrderMap(battle) {
    const peak = !(battle.b?.[0]?.length) && !(battle.b?.[1]?.length);
    const orderMap = (ids) => {
      const map = new Map();
      (ids || []).forEach((heroId, index) => {
        const id = Number(heroId);
        if (id) map.set(id, index + 1);
      });
      return map;
    };
    return {
      peak,
      orders: {
        blue: {
          bans: orderMap(battle.b?.[0]),
          picks: orderMap(battle.p?.[0])
        },
        red: {
          bans: orderMap(battle.b?.[1]),
          picks: orderMap(battle.p?.[1])
        }
      }
    };
  }

  function renderBattleBP(battle, series) {
    const team1 = state.teamMap.get(String(battle.t[0]));
    const team2 = state.teamMap.get(String(battle.t[1]));
    const { orders, peak } = battleBpOrderMap(battle);
    const heroChip = (heroId, kind, side, teamId) => {
      const hero = state.heroMap.get(Number(heroId));
      if (!hero) return '';
      const order = orders[side][kind === 'ban' ? 'bans' : 'picks'].get(Number(heroId));
      return `<button type="button" class="bp-hero ${kind}" data-open-hero="${hero.id}" data-hero-team="${esc(teamId || '')}" title="${esc(hero.name)}${order ? ` · 第 ${order} 手` : ''}">
        ${heroImage(hero, '', hero.name)}
        ${order ? `<span class="bp-order">${order}</span>` : ''}
      </button>`;
    };
    const column = (team, side, bans, picks) => {
      const teamId = team?.id || battle.t[side === 'blue' ? 0 : 1];
      return `<div class="bp-column ${side}">
        <div class="bp-team">${team ? teamImage(team, 'bp-team-logo', team.name) : ''}<b>${esc(team?.name || '')}</b><em>${side === 'blue' ? '蓝方' : '红方'}</em></div>
        <div class="bp-line"><span>BAN</span><div class="bp-heroes">${peak ? '<i>无 Ban</i>' : bans.map((id) => heroChip(id, 'ban', side, teamId)).join('')}</div></div>
        <div class="bp-line"><span>PICK</span><div class="bp-heroes">${picks.map((id) => heroChip(id, 'pick', side, teamId)).join('')}</div></div>
      </div>`;
    };
    return `<div class="bp-compare">
      ${column(team1, 'blue', battle.b?.[0] || [], battle.p?.[0] || [])}
      <div class="bp-vs">VS</div>
      ${column(team2, 'red', battle.b?.[1] || [], battle.p?.[1] || [])}
    </div>
    <div class="bp-actions">
      <button class="btn ghost sm" type="button" data-copy-bp>${ICONS.copy} 复制 BP</button>
      <button class="btn primary sm" type="button" data-load-bp>${ICONS.upload} 载入 BO${series.bo} 工作台</button>
    </div>`;
  }

  function postTeamRank(players, camp, field, value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return null;
    const values = (players || [])
      .filter((player) => Number(player.camp) === Number(camp))
      .map((player) => Number(player[field]))
      .filter((item) => Number.isFinite(item));
    if (!values.length) return null;
    return 1 + values.filter((item) => item > number).length;
  }

  function renderPostgameComparison(detail, buckets, team1, team2) {
    const players = Array.isArray(detail.players) ? detail.players : [];
    const camp1 = detail.camp1 || {};
    const camp2 = detail.camp2 || {};
    const rankLabel = (rank) => (rank ? `全队NO.${rank}` : '—');
    const damage = (value) => {
      const number = Number(value);
      if (!Number.isFinite(number)) return '—';
      return number >= 1000 ? `${(number / 1000).toFixed(1)}k` : String(number);
    };
    const percent = (value) => {
      const number = Number(value);
      return Number.isFinite(number) ? `${(number * 100).toFixed(2)}%` : '—';
    };
    const participation = (value) => {
      const number = Number(value);
      return Number.isFinite(number) ? `${number.toFixed(0)}%` : '—';
    };
    const person = (player, side) => {
      const team = side === 'blue' ? team1 : team2;
      const hero = state.heroMap.get(Number(player?.heroId));
      const win = Number(side === 'blue' ? camp1.is_win : camp2.is_win) === 1;
      const photo = player?.playerIcon
        ? `<img src="${esc(player.playerIcon)}" alt="" loading="lazy" referrerpolicy="no-referrer" />`
        : `<span>${esc(String(player?.playerName || '?').slice(0, 1))}</span>`;
      return `<div class="post-compare-person ${side}">
        <span class="post-compare-photo">${photo}</span>
        <div class="post-compare-person-copy">
          <b>${esc(player?.playerName || player?.actualPlayerName || '—')}</b>
          <button type="button" class="post-person-hero" data-open-hero="${player?.heroId || ''}" data-hero-team="${esc(player?.teamId || '')}" title="查看该选手使用此英雄的历史胜率">${esc(hero?.name || player?.heroName || '—')}</button>
          ${win ? `<span class="post-compare-win">胜利</span>` : ''}
        </div>
      </div>`;
    };
    const center = `<div class="post-compare-center">
      ${team1 ? teamImage(team1, 'post-compare-teamlogo', team1.name) : ''}
      <span>VS</span>
      ${team2 ? teamImage(team2, 'post-compare-teamlogo', team2.name) : ''}
    </div>`;
    const metric = (label, leftMain, rightMain, leftSub, rightSub, leftBar = null, rightBar = null) => {
      const leftNumber = Number(leftBar) || 0;
      const rightNumber = Number(rightBar) || 0;
      const total = leftNumber + rightNumber;
      const leftWidth = total ? (leftNumber / total) * 100 : 0;
      const rightWidth = total ? (rightNumber / total) * 100 : 0;
      return `<div class="post-compare-metric">
        <div class="post-compare-value blue"><b>${leftMain}</b>${leftSub ? `<small>${leftSub}</small>` : ''}</div>
        <div class="post-compare-label">${label}</div>
        <div class="post-compare-value red"><b>${rightMain}</b>${rightSub ? `<small>${rightSub}</small>` : ''}</div>
        ${leftBar !== null || rightBar !== null ? `<div class="post-compare-bars"><i class="blue" style="width:${leftWidth}%"></i><i class="red" style="width:${rightWidth}%"></i></div>` : ''}
      </div>`;
    };
    const tabs = ROLE_ORDER.map((role, index) => `<button type="button" class="post-compare-tab ${index === 0 ? 'is-active' : ''}" data-post-role="${esc(role)}">${esc(ROLE_SHORT[role] || role)}</button>`).join('');
    const panels = ROLE_ORDER.map((role, index) => {
      const blue = buckets[1].get(role);
      const red = buckets[2].get(role);
      if (!blue && !red) {
        return `<div class="post-compare-panel ${index === 0 ? 'is-active' : ''}" data-post-panel="${esc(role)}"><div class="empty-state" style="padding:24px">该位置暂无对位数据</div></div>`;
      }
      const kda = (player) => `${player?.kills ?? '—'}/${player?.deaths ?? '—'}/${player?.assists ?? '—'}`;
      const score = (player) => (player?.mvpScore === null || player?.mvpScore === undefined ? '—' : Number(player.mvpScore).toFixed(1));
      const rank = (player, field) => rankLabel(postTeamRank(players, player?.camp, field, player?.[field]));
      return `<div class="post-compare-panel ${index === 0 ? 'is-active' : ''}" data-post-panel="${esc(role)}">
        <div class="post-compare-people">${person(blue, 'blue')}${center}${person(red, 'red')}</div>
        ${metric('KDA & 评分', kda(blue), kda(red), `评分 ${score(blue)}`, `评分 ${score(red)}`)}
        ${metric('经济', num(blue?.gold, '—'), num(red?.gold, '—'), rank(blue, 'gold'), rank(red, 'gold'), blue?.gold, red?.gold)}
        ${metric('输出伤害', damage(blue?.hurtTotal), damage(red?.hurtTotal), `${rank(blue, 'hurtTotal')} · ${percent(blue?.hurtRate)}`, `${rank(red, 'hurtTotal')} · ${percent(red?.hurtRate)}`, blue?.hurtTotal, red?.hurtTotal)}
        ${metric('承受伤害', damage(blue?.beHurtTotal), damage(red?.beHurtTotal), `${rank(blue, 'beHurtTotal')} · ${percent(blue?.beHurtRate)}`, `${rank(red, 'beHurtTotal')} · ${percent(red?.beHurtRate)}`, blue?.beHurtTotal, red?.beHurtTotal)}
        ${metric('参团率', participation(blue?.participation), participation(red?.participation), rank(blue, 'participation'), rank(red, 'participation'), blue?.participation, red?.participation)}
      </div>`;
    }).join('');
    return `<div class="post-compare">
      <div class="post-compare-title"><b>选手对位数据</b><span>按位置查看双方选手的赛后表现</span></div>
      <div class="post-compare-tabs">${tabs}</div>
      <div class="post-compare-panels">${panels}</div>
    </div>`;
  }

  function renderSeriesBattle(detail, series, battle) {
    const players = Array.isArray(detail.players) ? detail.players : [];
    const buckets = { 1: new Map(), 2: new Map() };
    for (const player of players) {
      const camp = Number(player.camp);
      if (camp !== 1 && camp !== 2) continue;
      let role = String(player.positionDesc || '');
      if (!ROLE_ORDER.includes(role)) {
        role = heroRoles(state.heroMap.get(Number(player.heroId)))[0];
      }
      if (role && !buckets[camp].has(role)) buckets[camp].set(role, player);
    }
    const camp1 = detail.camp1 || {};
    const camp2 = detail.camp2 || {};
    const team1 = state.teamMap.get(String(camp1.team_id || series.t1));
    const team2 = state.teamMap.get(String(camp2.team_id || series.t2));
    const winner = Number(detail.winCamp);
    const replayUrl = detail.replayUrl ? String(detail.replayUrl) : '';
    const rows = ROLE_ORDER.map((role) => `<div class="postgame-row">
      <div class="post-side blue">${renderPostPlayer(buckets[1].get(role), 'blue')}</div>
      <span class="post-role-label ${roleClass(role)}">${esc(ROLE_SHORT[role] || role)}</span>
      <div class="post-side red">${renderPostPlayer(buckets[2].get(role), 'red')}</div>
    </div>`).join('');
    return `${renderBattleBP(battle, series)}
    <div class="postgame-board">
      <div class="postgame-team-head">
        <div class="post-team ${winner === 1 ? 'is-win' : ''}">
          ${team1 ? teamImage(team1, 'post-team-logo', team1.name) : ''}
          <div><b>${esc(camp1.team_name || team1?.name || '蓝方')}</b><small>${formatGoldValue(camp1.gold)} 经济</small></div>
        </div>
        <div class="postgame-center">
          <b class="postgame-kills">${camp1.kill_num ?? '—'}<i>:</i>${camp2.kill_num ?? '—'}</b>
          <small class="postgame-duration">${formatGameDuration(detail.duration)} · ${winner === 1 ? '蓝方胜' : winner === 2 ? '红方胜' : '赛后数据'}</small>
        </div>
        <div class="post-team red ${winner === 2 ? 'is-win' : ''}">
          <div><b>${esc(camp2.team_name || team2?.name || '红方')}</b><small>${formatGoldValue(camp2.gold)} 经济</small></div>
          ${team2 ? teamImage(team2, 'post-team-logo', team2.name) : ''}
        </div>
      </div>
      ${replayUrl ? `<div class="postgame-replay-row"><a class="postgame-replay" href="${esc(replayUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.external}<span>本局全局回放</span></a></div>` : ''}
      ${renderPostgameComparison(detail, buckets, team1, team2)}
      <div class="postgame-table-head"><span>蓝方选手 / 英雄</span><span>对位</span><span>红方选手 / 英雄</span></div>
      <div class="postgame-rows">${rows}</div>
      <div class="postgame-legend"><span>K/D/A</span><span>经济</span><span>装备</span><span>数据来自官方赛后详情缓存</span></div>
    </div>`;
  }

  async function renderSeriesDetailModal() {
    const modal = state.seriesModal;
    if (!modal) return;
    const series = state.seriesById.get(String(modal.seriesId));
    if (!series) return;
    const battles = (state.data.battles || [])
      .filter((battle) => String(battle.mid) === String(series.id))
      .sort((a, b) => a.seq - b.seq);
    const index = Math.min(Math.max(modal.gameIndex, 0), Math.max(0, battles.length - 1));
    modal.gameIndex = index;
    const battle = battles[index];
    const content = $('#seriesDetailContent');
    if (!battle || !content) return;
    $$('.series-game-tab').forEach((tab) => {
      tab.classList.toggle('is-active', Number(tab.dataset.seriesGame) === index);
    });
    const token = ++modal.token;
    content.innerHTML = '<div class="postgame-loading"><i></i><span>正在读取赛后数据…</span></div>';
    let detail = state.seriesBattleCache.get(battle.id);
    if (!detail) {
      try {
        const response = await fetch(`/api/battle?id=${encodeURIComponent(battle.id)}`);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok || !payload.ok) throw new Error(payload.error || '暂无赛后详情');
        detail = payload;
        state.seriesBattleCache.set(battle.id, detail);
      } catch (error) {
        detail = fallbackSeriesBattleDetail(series, battle);
        state.seriesBattleCache.set(battle.id, detail);
      }
    }
    if (modal.token !== token || !$('#seriesDetailContent')) return;
    content.innerHTML = renderSeriesBattle(detail, series, battle);
    applyLanguage(content);
  }

  function openSeriesDetailModal(seriesId, gameIndex = 0) {
    const series = state.seriesById.get(String(seriesId));
    if (!series) return;
    const battles = (state.data.battles || [])
      .filter((battle) => String(battle.mid) === String(series.id))
      .sort((a, b) => a.seq - b.seq);
    if (!battles.length) {
      toast('该系列赛暂无逐局数据', 'error');
      return;
    }
    state.seriesReturnTeam = state.teamModal?.teamId
      ? {
          teamId: state.teamModal.teamId,
          season: state.teamModal.season,
          heroId: state.teamModal.heroId
        }
      : null;
    state.seriesModal = {
      seriesId: series.id,
      gameIndex: Math.min(Math.max(0, gameIndex), battles.length - 1),
      token: 0
    };
    const team1 = state.teamMap.get(String(series.t1));
    const team2 = state.teamMap.get(String(series.t2));
    const winner = series.w === 1 ? team1 : series.w === 2 ? team2 : null;
    showModal(`<div class="modal-body series-detail-modal">
      <div class="series-detail-head">
        <div>
          <div class="eyebrow">POST-MATCH DATA · ${esc(seasonLabel(series.season))}</div>
          <h2>${esc(team1?.name || series.t1)} <b>${series.s1}:${series.s2}</b> ${esc(team2?.name || series.t2)}</h2>
          <p>${esc(formatDay(series.date))} · ${esc(series.stage || '')} · BO${series.bo} · ${battles.length} 局</p>
        </div>
        <span class="tag gold">${esc(winner?.name || '赛后数据')}</span>
      </div>
      <div class="series-game-tabs" id="seriesGameTabs">
        ${battles.map((battle, index) => {
          const winnerTeam = battle.w === 1
            ? state.teamMap.get(String(battle.t[0]))
            : battle.w === 2
              ? state.teamMap.get(String(battle.t[1]))
              : null;
          const win = winnerTeam?.name || '';
          return `<button type="button" class="series-game-tab ${index === state.seriesModal.gameIndex ? 'is-active' : ''}" data-series-game="${index}">
            <b>G${index + 1}</b><small>${esc(win || '—')} 胜</small>
          </button>`;
        }).join('')}
      </div>
      <div id="seriesDetailContent"></div>
    </div>`, '赛后数据对阵图');
    $('#seriesGameTabs')?.addEventListener('click', (event) => {
      const tab = event.target.closest('[data-series-game]');
      if (!tab) return;
      state.seriesModal.gameIndex = Number(tab.dataset.seriesGame);
      renderSeriesDetailModal();
    });
    $('#seriesDetailContent')?.addEventListener('click', (event) => {
      const roleTab = event.target.closest('[data-post-role]');
      if (roleTab) {
        const root = $('#seriesDetailContent');
        $$('.post-compare-tab', root).forEach((tab) => {
          tab.classList.toggle('is-active', tab.dataset.postRole === roleTab.dataset.postRole);
        });
        $$('.post-compare-panel', root).forEach((panel) => {
          panel.classList.toggle('is-active', panel.dataset.postPanel === roleTab.dataset.postRole);
        });
        return;
      }
      const heroButton = event.target.closest('[data-open-hero]');
      if (heroButton && Number(heroButton.dataset.openHero)) {
        openHeroModal(Number(heroButton.dataset.openHero), heroButton.dataset.heroTeam || null);
        return;
      }
      const copyButton = event.target.closest('[data-copy-bp]');
      const loadButton = event.target.closest('[data-load-bp]');
      if (!copyButton && !loadButton) return;
      const battles = (state.data.battles || [])
        .filter((battle) => String(battle.mid) === String(series.id))
        .sort((a, b) => a.seq - b.seq);
      const battle = battles[state.seriesModal.gameIndex];
      if (!battle) return;
      if (copyButton) copyBattleBP(series, battle);
      else loadBattleIntoDraft(series, battle);
    });
    renderSeriesDetailModal();
  }

  document.addEventListener('click', (event) => {
    const teamTrigger = event.target.closest('[data-team-detail]');
    if (teamTrigger) {
      event.preventDefault();
      const currentHero = state.heroModal;
      state.teamReturnHero = currentHero?.heroId
        ? {
            heroId: currentHero.heroId,
            teamId: currentHero.teamId,
            heroReturnTo: state.heroReturnTo
          }
        : null;
      state.heroReturnTo = null;
      openTeamModal(teamTrigger.dataset.teamDetail);
      const heroId = Number(teamTrigger.dataset.teamHero);
      if (state.teamModal && heroId) {
        state.teamModal.heroId = heroId;
        renderTeamModalBody();
      }
      return;
    }
    const trigger = event.target.closest('[data-series-detail]');
    if (!trigger) return;
    event.preventDefault();
    openSeriesDetailModal(trigger.dataset.seriesDetail);
  });

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  init();
})();
