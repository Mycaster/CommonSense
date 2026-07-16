# 云函数说明

## getQuestions

拉取题库供答题端缓存。

- `since = 0`：全量已发布题
- `since > 0`：返回 `updatedAt > since` 的全部状态变更（含下架）

## manageQuestions

需管理员（环境变量 `ADMIN_OPENIDS` 或集合 `admins`）。

| action | 说明 |
|--------|------|
| checkAdmin | 是否管理员，返回 openid |
| list | 列表（可按 status / category / keyword） |
| get | 单题 |
| create / update | 新建 / 更新 |
| setStatus | published / draft / archived |
| remove | 物理删除 |
| seed | 空库时灌入种子题 |

部署后请在云开发控制台为 `manageQuestions` 配置环境变量或写入 `admins` 集合。
