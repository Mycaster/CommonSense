# 文化常识自救

微信小程序：随机文化常识选择题，答完即时揭晓与解析，并本地统计正确率。

内容风格参考豆瓣小组「[文化常识自救协会](https://www.douban.com/group/725313/)」——历史、文学、地理、国学、神话、艺术、民俗、饮食等应知应会常识。

## 功能

- **随机答题**：从全库随机抽题，避免连续重复
- **分类练习**：按 8 个主题刷题
- **即时反馈**：选项高亮对错，展示简短解析
- **本地成绩**：累计答题数、正确率、分类正确率（可清空）

## 目录结构

```
├── project.config.json      # 微信开发者工具项目配置
├── miniprogram/
│   ├── app.js / app.json / app.wxss
│   ├── data/questions.js    # 题库（62 题）
│   ├── utils/quiz.js        # 抽题 / 判题
│   ├── utils/storage.js     # 本地成绩存储
│   └── pages/
│       ├── index/           # 首页
│       ├── quiz/            # 答题
│       └── stats/           # 成绩
└── README.md
```

## 如何运行

1. 安装并打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 选择「导入项目」，目录指向本仓库根目录
3. AppID 可使用「测试号 / 游客模式」（`project.config.json` 中已设为 `touristappid`）
4. 编译后即可在模拟器中体验

正式发布时，请在开发者工具中替换为你自己的小程序 AppID。

## 题库说明

题目为公知文化常识原创整理，**未爬取豆瓣帖文**。可直接编辑 `miniprogram/data/questions.js` 增删题目，字段如下：

```js
{
  id: 'hist-001',
  category: '历史',
  question: '题干',
  options: ['A', 'B', 'C', 'D'],
  answer: 1,       // 正确选项下标，从 0 开始
  explain: '简短解析'
}
```

## 技术说明

- 原生微信小程序，无云开发、无后端
- 成绩使用 `wx.setStorageSync` 本地持久化
