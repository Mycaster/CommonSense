# 文化常识自救

微信小程序：随机文化常识选择题，答完即时揭晓与解析，并本地统计正确率。

支持 **本地种子题库**（开箱即用）与 **微信云开发远程题库 + 同小程序管理端**（方案 A）。

内容风格参考豆瓣小组「[文化常识自救协会](https://www.douban.com/group/725313/)」。

## 功能

- **随机答题 / 分类练习**：抽题避免连续重复
- **即时反馈**：选项高亮对错 + 简短解析
- **本地成绩**：累计正确率、分类正确率
- **远程题库（可选）**：云数据库同步，本地缓存
- **题库管理（方案 A）**：同小程序内管理页，openid 白名单鉴权

## 目录结构

```
├── project.config.json
├── cloudfunctions/
│   ├── getQuestions/       # 拉取已发布题库（支持增量）
│   └── manageQuestions/    # 管理 CRUD + 鉴权 + 种子灌入
├── miniprogram/
│   ├── config.js           # 云环境 ID（留空则纯本地）
│   ├── data/questions.js   # 本地种子题（62 题）
│   ├── services/           # cloud / questionBank / admin
│   ├── utils/quiz.js       # 抽题（读缓存）
│   └── pages/
│       ├── index / quiz / stats
│       └── admin/list · admin/edit
└── README.md
```

## 本地预览（无需云开发）

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入本仓库根目录
3. AppID 可用测试号（`touristappid`）
4. `miniprogram/config.js` 中 `cloudEnvId` 留空 → 使用本地 62 题种子库

## 开通远程题库 + 管理端

### 1. 准备

- 注册正式小程序，替换 `project.config.json` 的 `appid`
- 开发者工具：云开发 → 开通环境，复制环境 ID
- 将环境 ID 填入 [`miniprogram/config.js`](miniprogram/config.js) 的 `cloudEnvId`

### 2. 创建集合

在云开发控制台创建：

| 集合 | 说明 |
|------|------|
| `questions` | 题目文档 |
| `admins`（可选） | `{ openid: "oXXXX" }` 管理员白名单 |

`questions` 字段示例：

```js
{
  id: 'hist-001',
  category: '历史',
  question: '题干',
  options: ['A', 'B', 'C', 'D'],
  answer: 1,
  explain: '解析',
  status: 'published', // published | draft | archived
  createdAt: 1710000000000,
  updatedAt: 1710000000000
}
```

权限建议：所有读写走云函数，集合权限设为「仅管理端可读写」或等价安全规则（客户端不要直连写库）。

### 3. 上传云函数

在开发者工具中分别右键上传并部署：

- `cloudfunctions/getQuestions`
- `cloudfunctions/manageQuestions`

（首次需在云函数目录安装依赖 / 勾选「云端安装依赖」。）

### 4. 配置管理员

任选其一：

1. **环境变量**：云函数 `manageQuestions` → 配置 `ADMIN_OPENIDS=openid1,openid2`
2. **数据库**：在 `admins` 集合插入 `{ "openid": "你的openid" }`

获取 openid：真机打开小程序，**长按首页品牌名「文化常识自救」** → 非管理员会复制 openid 到剪贴板。

### 5. 灌入种子题

管理员进入「题库管理」→ 点「灌入种子」（仅云库为空时可用），会把本地 62 题写入云数据库。

之后在管理页可 **新建 / 编辑 / 下架 / 发布**；答题端启动时自动同步并缓存。

## 管理入口

- 白名单用户：首页显示「题库管理」；或长按品牌名进入
- 非管理员：看不到管理入口；长按品牌名仅复制 openid

## 降级策略

| 情况 | 行为 |
|------|------|
| 未填 `cloudEnvId` | 纯本地种子题 |
| 云函数失败 | 使用上次缓存，无缓存则种子题 |
| 题目下架 | 增量同步后从本地缓存移除 |

## 技术说明

- 成绩仍用 `wx.setStorageSync` 本地持久化
- 不接入登录体系以外的账号系统；管理鉴权依赖云函数拿到的 `OPENID`
