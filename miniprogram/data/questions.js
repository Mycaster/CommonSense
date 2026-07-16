/**
 * 文化常识题库
 * 分类：历史 / 文学 / 地理 / 国学 / 神话 / 艺术 / 民俗 / 饮食
 * 题目为公知常识，风格参考「文化常识自救协会」应知应会题型
 */
const questions = [
  // —— 历史 ——
  {
    id: 'hist-001',
    category: '历史',
    question: '「贞观之治」发生在哪位皇帝在位期间？',
    options: ['汉武帝', '唐太宗', '宋太祖', '明成祖'],
    answer: 1,
    explain: '贞观是唐太宗李世民的年号，贞观之治是唐朝前期的盛世。'
  },
  {
    id: 'hist-002',
    category: '历史',
    question: '中国历史上第一个统一的中央集权王朝是？',
    options: ['夏朝', '商朝', '秦朝', '汉朝'],
    answer: 2,
    explain: '公元前221年，秦始皇统一六国，建立秦朝。'
  },
  {
    id: 'hist-003',
    category: '历史',
    question: '「丝绸之路」开通于哪个朝代？',
    options: ['秦朝', '西汉', '唐朝', '元朝'],
    answer: 1,
    explain: '西汉张骞通西域后，丝绸之路逐渐形成。'
  },
  {
    id: 'hist-004',
    category: '历史',
    question: '「玄武门之变」发生在哪位皇帝登基之前？',
    options: ['李渊', '李世民', '李治', '李隆基'],
    answer: 1,
    explain: '李世民发动玄武门之变，之后成为唐太宗。'
  },
  {
    id: 'hist-005',
    category: '历史',
    question: '「文景之治」是哪个朝代的盛世？',
    options: ['秦朝', '西汉', '东汉', '唐朝'],
    answer: 1,
    explain: '文帝、景帝时期，西汉休养生息，史称文景之治。'
  },
  {
    id: 'hist-006',
    category: '历史',
    question: '明朝的开国皇帝是？',
    options: ['朱元璋', '朱棣', '赵匡胤', '杨坚'],
    answer: 0,
    explain: '朱元璋建立明朝，年号洪武，即明太祖。'
  },
  {
    id: 'hist-007',
    category: '历史',
    question: '「杯酒释兵权」是哪位皇帝的故事？',
    options: ['李世民', '赵匡胤', '朱元璋', '康熙'],
    answer: 1,
    explain: '宋太祖赵匡胤通过杯酒释兵权削弱武将势力。'
  },
  {
    id: 'hist-008',
    category: '历史',
    question: '「安史之乱」发生在哪个朝代？',
    options: ['汉朝', '隋朝', '唐朝', '宋朝'],
    answer: 2,
    explain: '安史之乱是唐朝由盛转衰的转折点。'
  },

  // —— 文学 ——
  {
    id: 'lit-001',
    category: '文学',
    question: '「床前明月光」的下一句是？',
    options: ['疑是地上霜', '举头望明月', '低头思故乡', '春风又绿江南岸'],
    answer: 0,
    explain: '出自李白《静夜思》：床前明月光，疑是地上霜。'
  },
  {
    id: 'lit-002',
    category: '文学',
    question: '《红楼梦》的作者一般认为是？',
    options: ['罗贯中', '曹雪芹', '吴承恩', '施耐庵'],
    answer: 1,
    explain: '《红楼梦》前八十回一般认为是曹雪芹所作。'
  },
  {
    id: 'lit-003',
    category: '文学',
    question: '「唐宋八大家」中，属于唐朝的是？',
    options: ['欧阳修、苏轼', '韩愈、柳宗元', '王安石、曾巩', '苏洵、苏辙'],
    answer: 1,
    explain: '唐宋八大家中，韩愈、柳宗元为唐人，其余六人为宋人。'
  },
  {
    id: 'lit-004',
    category: '文学',
    question: '「三顾茅庐」出自哪部古典小说？',
    options: ['《水浒传》', '《西游记》', '《三国演义》', '《红楼梦》'],
    answer: 2,
    explain: '刘备三顾茅庐请诸葛亮出山，出自《三国演义》。'
  },
  {
    id: 'lit-005',
    category: '文学',
    question: '「海内存知己，天涯若比邻」的作者是？',
    options: ['王勃', '李白', '杜甫', '王维'],
    answer: 0,
    explain: '出自王勃《送杜少府之任蜀州》。'
  },
  {
    id: 'lit-006',
    category: '文学',
    question: '《呐喊》的作者是？',
    options: ['老舍', '鲁迅', '巴金', '茅盾'],
    answer: 1,
    explain: '《呐喊》是鲁迅的短篇小说集，收录《狂人日记》《阿Q正传》等。'
  },
  {
    id: 'lit-007',
    category: '文学',
    question: '「春蚕到死丝方尽」的下一句是？',
    options: ['蜡炬成灰泪始干', '落红不是无情物', '衣带渐宽终不悔', '一枝红杏出墙来'],
    answer: 0,
    explain: '出自李商隐《无题》：春蚕到死丝方尽，蜡炬成灰泪始干。'
  },
  {
    id: 'lit-008',
    category: '文学',
    question: '莎士比亚四大悲剧不包括？',
    options: ['《哈姆雷特》', '《麦克白》', '《李尔王》', '《威尼斯商人》'],
    answer: 3,
    explain: '四大悲剧为《哈姆雷特》《奥赛罗》《李尔王》《麦克白》。《威尼斯商人》是喜剧。'
  },
  {
    id: 'lit-009',
    category: '文学',
    question: '「金陵十二钗」出自哪部作品？',
    options: ['《金瓶梅》', '《红楼梦》', '《牡丹亭》', '《西厢记》'],
    answer: 1,
    explain: '金陵十二钗是《红楼梦》中对主要女性人物的统称。'
  },

  // —— 地理 ——
  {
    id: 'geo-001',
    category: '地理',
    question: '中国面积最大的省级行政区是？',
    options: ['西藏自治区', '内蒙古自治区', '新疆维吾尔自治区', '青海省'],
    answer: 2,
    explain: '新疆是中国面积最大的省级行政区。'
  },
  {
    id: 'geo-002',
    category: '地理',
    question: '长江发源于哪座山脉？',
    options: ['昆仑山', '唐古拉山', '喜马拉雅山', '秦岭'],
    answer: 1,
    explain: '长江源头在青藏高原唐古拉山脉的沱沱河一带。'
  },
  {
    id: 'geo-003',
    category: '地理',
    question: '下列哪座城市是广东省省会？',
    options: ['深圳', '广州', '珠海', '东莞'],
    answer: 1,
    explain: '广州是广东省省会。'
  },
  {
    id: 'geo-004',
    category: '地理',
    question: '中国最长的内流河是？',
    options: ['黄河', '塔里木河', '珠江', '淮河'],
    answer: 1,
    explain: '塔里木河是中国最长的内流河，位于新疆。'
  },
  {
    id: 'geo-005',
    category: '地理',
    question: '「五岳」中位于河南的是？',
    options: ['泰山', '华山', '嵩山', '恒山'],
    answer: 2,
    explain: '五岳：东岳泰山、西岳华山、南岳衡山、北岳恒山、中岳嵩山。嵩山在河南。'
  },
  {
    id: 'geo-006',
    category: '地理',
    question: '世界面积最大的大洋是？',
    options: ['大西洋', '印度洋', '太平洋', '北冰洋'],
    answer: 2,
    explain: '太平洋是世界上面积最大、最深的大洋。'
  },
  {
    id: 'geo-007',
    category: '地理',
    question: '下列哪个不是直辖市？',
    options: ['北京', '天津', '重庆', '南京'],
    answer: 3,
    explain: '中国四个直辖市是北京、天津、上海、重庆。南京是江苏省省会。'
  },
  {
    id: 'geo-008',
    category: '地理',
    question: '「塞上江南」通常指哪个地区？',
    options: ['河套平原', '成都平原', '珠江三角洲', '三江平原'],
    answer: 0,
    explain: '宁夏平原、河套平原因灌溉农业发达，有「塞上江南」之称。'
  },

  // —— 国学 ——
  {
    id: 'cls-001',
    category: '国学',
    question: '「四书」不包括下列哪一部？',
    options: ['《大学》', '《中庸》', '《论语》', '《周易》'],
    answer: 3,
    explain: '四书为《大学》《中庸》《论语》《孟子》。《周易》属五经。'
  },
  {
    id: 'cls-002',
    category: '国学',
    question: '「己所不欲，勿施于人」出自？',
    options: ['《孟子》', '《论语》', '《道德经》', '《庄子》'],
    answer: 1,
    explain: '出自《论语·卫灵公》，是孔子的重要思想。'
  },
  {
    id: 'cls-003',
    category: '国学',
    question: '道家思想的代表人物不包括？',
    options: ['老子', '庄子', '列子', '荀子'],
    answer: 3,
    explain: '荀子是儒家代表人物。老子、庄子、列子属道家。'
  },
  {
    id: 'cls-004',
    category: '国学',
    question: '「五经」中的「春秋」相传为谁所编？',
    options: ['孔子', '孟子', '左丘明', '司马迁'],
    answer: 0,
    explain: '传统说法认为《春秋》由孔子根据鲁国史书修订而成。'
  },
  {
    id: 'cls-005',
    category: '国学',
    question: '「道可道，非常道」出自哪部典籍？',
    options: ['《论语》', '《道德经》', '《周易》', '《尚书》'],
    answer: 1,
    explain: '出自《道德经》开篇，是老子哲学的核心表述。'
  },
  {
    id: 'cls-006',
    category: '国学',
    question: '「三十而立，四十而不惑」出自？',
    options: ['《孟子》', '《论语》', '《大学》', '《中庸》'],
    answer: 1,
    explain: '出自《论语·为政》，孔子自述人生阶段。'
  },
  {
    id: 'cls-007',
    category: '国学',
    question: '「仁义礼智信」合称？',
    options: ['三纲', '五常', '六艺', '八德'],
    answer: 1,
    explain: '仁、义、礼、智、信称为「五常」，是儒家核心德目。'
  },
  {
    id: 'cls-008',
    category: '国学',
    question: '「六艺」中不包括？',
    options: ['礼', '乐', '射', '诗'],
    answer: 3,
    explain: '六艺为礼、乐、射、御、书、数。诗属于《诗经》，不在六艺之列。'
  },

  // —— 神话 ——
  {
    id: 'myth-001',
    category: '神话',
    question: '中国神话中，补天的女神是？',
    options: ['女娲', '西王母', '嫦娥', '精卫'],
    answer: 0,
    explain: '女娲炼五色石以补苍天，是著名的创世神话。'
  },
  {
    id: 'myth-002',
    category: '神话',
    question: '「精卫填海」中的精卫原是谁的女儿？',
    options: ['黄帝', '炎帝', '尧', '舜'],
    answer: 1,
    explain: '精卫本是炎帝之女女娃，溺海后化为精卫鸟填海。'
  },
  {
    id: 'myth-003',
    category: '神话',
    question: '希腊神话中，众神之王是？',
    options: ['阿波罗', '宙斯', '波塞冬', '哈迪斯'],
    answer: 1,
    explain: '宙斯是奥林匹斯十二主神之首，众神之王。'
  },
  {
    id: 'myth-004',
    category: '神话',
    question: '「夸父逐日」的结局是？',
    options: ['追上太阳', '渴死途中', '化为高山', '升天成仙'],
    answer: 1,
    explain: '夸父追日不及，渴死途中，弃杖化为邓林。'
  },
  {
    id: 'myth-005',
    category: '神话',
    question: '特洛伊战争中，木马计的献计者一般认为是？',
    options: ['阿喀琉斯', '奥德修斯', '阿伽门农', '赫克托耳'],
    answer: 1,
    explain: '奥德修斯（尤利西斯）献木马计，使希腊联军攻入特洛伊。'
  },
  {
    id: 'myth-006',
    category: '神话',
    question: '嫦娥奔月的故事中，她服用的是谁的不死药？',
    options: ['玉皇大帝', '西王母', '太上老君', '后羿'],
    answer: 1,
    explain: '后羿从西王母处求得不死药，嫦娥偷服后奔月。'
  },
  {
    id: 'myth-007',
    category: '神话',
    question: '希腊神话中，智慧与战争女神是？',
    options: ['赫拉', '阿芙洛狄忒', '雅典娜', '阿尔忒弥斯'],
    answer: 2,
    explain: '雅典娜是智慧、技艺与战略战争的女神。'
  },

  // —— 艺术 ——
  {
    id: 'art-001',
    category: '艺术',
    question: '「楷书四大家」不包括？',
    options: ['欧阳询', '颜真卿', '柳公权', '王羲之'],
    answer: 3,
    explain: '楷书四大家通常指欧阳询、颜真卿、柳公权、赵孟頫。王羲之以行书著称。'
  },
  {
    id: 'art-002',
    category: '艺术',
    question: '《蒙娜丽莎》的作者是？',
    options: ['米开朗基罗', '达·芬奇', '拉斐尔', '梵高'],
    answer: 1,
    explain: '《蒙娜丽莎》是达·芬奇的代表作，现藏于卢浮宫。'
  },
  {
    id: 'art-003',
    category: '艺术',
    question: '京剧中「生旦净丑」里，花脸通常对应？',
    options: ['生', '旦', '净', '丑'],
    answer: 2,
    explain: '「净」行又称花脸，以面部勾脸谱为特色。'
  },
  {
    id: 'art-004',
    category: '艺术',
    question: '「书圣」指的是哪位书法家？',
    options: ['颜真卿', '王羲之', '柳公权', '张旭'],
    answer: 1,
    explain: '东晋王羲之被后世尊为「书圣」，代表作有《兰亭序》。'
  },
  {
    id: 'art-005',
    category: '艺术',
    question: '《夜宴》是哪位荷兰画家的作品？',
    options: ['梵高', '伦勃朗', '维米尔', '蒙德里安'],
    answer: 1,
    explain: '《夜巡》（亦称《夜宴》）是伦勃朗的著名群像画。'
  },
  {
    id: 'art-006',
    category: '艺术',
    question: '中国古代「文人四艺」通常指？',
    options: ['琴棋书画', '诗词歌赋', '金石篆刻', '吹拉弹唱'],
    answer: 0,
    explain: '琴、棋、书、画并称文人四艺。'
  },
  {
    id: 'art-007',
    category: '艺术',
    question: '敦煌莫高窟以什么艺术闻名于世？',
    options: ['青铜器', '壁画与彩塑', '瓷器', '园林'],
    answer: 1,
    explain: '莫高窟保存了大量精美的佛教壁画与彩塑。'
  },

  // —— 民俗 ——
  {
    id: 'folk-001',
    category: '民俗',
    question: '端午节的传统习俗不包括？',
    options: ['吃粽子', '赛龙舟', '赏月', '挂艾草'],
    answer: 2,
    explain: '赏月是中秋节习俗。端午节有吃粽子、赛龙舟、挂艾草等。'
  },
  {
    id: 'folk-002',
    category: '民俗',
    question: '春节贴春联的习俗，相传与谁驱邪的故事有关？',
    options: ['门神神荼、郁垒', '钟馗', '关羽', '灶王爷'],
    answer: 0,
    explain: '古时以桃符写神荼、郁垒之名辟邪，后演变为春联。'
  },
  {
    id: 'folk-003',
    category: '民俗',
    question: '「元宵」是哪个节日的典型食品？',
    options: ['春节', '元宵节', '中秋节', '清明节'],
    answer: 1,
    explain: '元宵节有吃元宵（汤圆）、赏花灯的习俗。'
  },
  {
    id: 'folk-004',
    category: '民俗',
    question: '二十四节气中，表示冬季开始的是？',
    options: ['立冬', '冬至', '小寒', '大寒'],
    answer: 0,
    explain: '立冬是冬季的第一个节气，标志着冬天开始。'
  },
  {
    id: 'folk-005',
    category: '民俗',
    question: '「七夕」传说中相会的两位人物是？',
    options: ['牛郎与织女', '梁山伯与祝英台', '许仙与白娘子', '董永与七仙女'],
    answer: 0,
    explain: '七夕源于牛郎织女鹊桥相会的传说。'
  },
  {
    id: 'folk-006',
    category: '民俗',
    question: '清明节既是节气也是节日，主要纪念活动是？',
    options: ['祭祖扫墓', '赛龙舟', '赏菊花', '贴窗花'],
    answer: 0,
    explain: '清明有祭祖扫墓、踏青等习俗。'
  },
  {
    id: 'folk-007',
    category: '民俗',
    question: '传统婚礼中，「红盖头」主要出现在哪个仪式环节的意象里？',
    options: ['纳采', '迎亲', '庙见', '归宁'],
    answer: 1,
    explain: '新娘在迎亲、出阁时常戴红盖头，寓意喜庆与遮羞。'
  },

  // —— 饮食 ——
  {
    id: 'food-001',
    category: '饮食',
    question: '中国「八大菜系」不包括？',
    options: ['川菜', '粤菜', '鲁菜', '东北菜'],
    answer: 3,
    explain: '八大菜系一般指鲁、川、粤、苏、闽、浙、湘、徽。东北菜不在其中。'
  },
  {
    id: 'food-002',
    category: '饮食',
    question: '「麻婆豆腐」属于哪一菜系？',
    options: ['粤菜', '川菜', '苏菜', '鲁菜'],
    answer: 1,
    explain: '麻婆豆腐是四川传统名菜，以麻、辣、烫、香著称。'
  },
  {
    id: 'food-003',
    category: '饮食',
    question: '「龙井」主要指哪种饮品相关的物产？',
    options: ['白酒', '绿茶', '黄酒', '普洱'],
    answer: 1,
    explain: '西湖龙井是中国著名绿茶，产于杭州西湖一带。'
  },
  {
    id: 'food-004',
    category: '饮食',
    question: '「佛跳墙」是哪一地方的名菜？',
    options: ['广东', '福建', '江苏', '浙江'],
    answer: 1,
    explain: '佛跳墙是福建福州的传统名菜。'
  },
  {
    id: 'food-005',
    category: '饮食',
    question: '豆腐相传由谁发明？',
    options: ['华佗', '淮南王刘安', '李时珍', '张仲景'],
    answer: 1,
    explain: '传统说法认为西汉淮南王刘安发明了豆腐。'
  },
  {
    id: 'food-006',
    category: '饮食',
    question: '「东坡肉」与哪位文人有关？',
    options: ['李白', '杜甫', '苏轼', '白居易'],
    answer: 2,
    explain: '东坡肉得名于苏轼（苏东坡），是杭州名菜。'
  },
  {
    id: 'food-007',
    category: '饮食',
    question: '五谷中通常不包括？',
    options: ['稻', '麦', '黍', '番茄'],
    answer: 3,
    explain: '五谷说法不一，常见为稻、黍、稷、麦、豆等。番茄是美洲作物，非传统五谷。'
  },
  {
    id: 'food-008',
    category: '饮食',
    question: '「小笼包」最负盛名的发源地之一是？',
    options: ['广州', '上海南翔', '成都', '西安'],
    answer: 1,
    explain: '南翔小笼是上海嘉定南翔古镇的著名点心。'
  }
]

const CATEGORIES = ['历史', '文学', '地理', '国学', '神话', '艺术', '民俗', '饮食']

module.exports = {
  questions,
  CATEGORIES
}
