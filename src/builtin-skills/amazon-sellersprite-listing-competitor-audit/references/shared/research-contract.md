---
contract: research-contract
version: 2.0.0
cluster: amazon-asin-research-skill-cluster
applies_to: all modules
replaces: all per-module research-contract copies
---
# 统一研究合同

## 合同目的

本文件是集群唯一研究范围、对象身份、数据版本和交付路径的定义来源。六个 Skill 的 SKILL.md 正文开始前必须显式声明已读取本文件。禁止模块私自修改研究范围、创建独立 case_id 或输出到非标准路径。

## 一、研究范围冻结

每一轮研究启动时，总控生成唯一 case_id，并冻结以下不可变字段。所有模块共享同一份冻结范围。

### 必冻字段

`yaml
research_contract:
  case_id: string  # 格式：{YYYYMMDD}-{marketplace}-{own_asin_count}-{competitor_asin_count}-{sequential}
  created_at: string  # ISO 8601
  marketplace: string  # 如 CA、US
  currency: string  # 如 CAD、USD
  language: string  # 站点主语言，如 en、fr
  timezone: string  # 如 America/Toronto、America/Los_Angeles
  own_asins:
    - asin: string
      role: string  # own_target|own_reference
      parent_asin: string optional
      child_asins: [string] optional
  competitor_asins:
    - asin: string
      role: string  # direct_competitor|adjacent_reference|exploratory
      parent_asin: string optional
      child_asins: [string] optional
      inclusion_reason: string
  parent_child_policy: string  # parent_only|child_only|all|specified
  period:
    start: string  # ISO date
    end: string
    granularity: string  # day|week|month
  research_questions: [string]  # 不超过5个
  enabled_modules: [string]  # 本轮启用的模块名清单
  max_claim_level: string  # 本轮总报告最高允许等级
`

### 变更规则

- case_id、marketplace、own_asins[].asin、competitor_asins[].asin 一旦冻结，本轮不可修改
- period 可在补数轮次中扩展，但不可收缩已分析窗口
- enabled_modules 可在发现阻塞后缩减，不可新增模块（新增需新 case_id）

---

## 二、数据版本控制

### dataset_version 规则

- 初始版本 v1，每次补数查询后递增：v2、v3……
- 补数最多两轮，即最大 v3
- 版本号由总控统一分配，模块不得自增

### 数据包结构

总控维护统一数据包，所有模块读取同版本：

`yaml
dataset:
  version: string
  query_log: string  # 路径
  asin_identity_register: string  # 路径
  snapshot_register: string  # 路径（各 ASIN 当前快照）
  trend_series: string  # 路径（价格/BSR/销量估算/评分/评论历史）
  keyword_observations: string  # 路径
  review_corpus: string  # 路径（如有）
`

模块只读，不得修改数据包。

---

## 三、输出路径契约

### 总控输出

`
outputs/amazon-asin-research/{case_id}/
├── executive-report.md
├── claim-ledger.csv
├── module-status-summary.csv
├── evidence-ledger.csv
└── query-log.md
`

### 模块输出

`
outputs/amazon-asin-research/{case_id}/{module_name}/
├── module-result.yaml
├── {module_specific_artifacts}...
└── evidence-ledger.csv
`

### temp 目录

`
temp/amazon-asin-research/{case_id}/
├── raw-responses/  # SellerSprite 原始响应
├── intermediate/   # 中间计算表
└── drafts/         # 草稿
`

模块不得将正式产物写入 temp/，不得将原始响应写入 outputs/。

---

## 四、研究问题模板

总控根据用户输入标准化为以下问题类别，每类最多分配 2 个具体问题：

1. **市场定位**：自品与竞品的相对位置？差距在哪些维度？
2. **变化归因**：竞品近期发生了什么变化？哪些是较强候选驱动？
3. **流量与广告**：竞品流量来源和关键词结构？自有缺口在哪？
4. **评论与产品**：消费者喜欢/抱怨什么？产品优化优先级？
5. **动作复刻**：哪些竞品动作适合测试？需要什么前提？

---

## 五、禁止行为

- 模块自创 case_id 或输出路径
- 模块修改冻结后的 marketplace、ASIN 清单或 parent_child_policy
- 两个模块使用不同的 dataset_version 却声称在分析同一对象
- 模块将 temp 中的草稿直接作为正式产物交付r
