<!--
文件功能：提供广告组合、目标、预算护栏、实施批次和判断依据的正式交付模板。
职责边界：模板不执行广告账户操作；所有平台 ID、枚举和启用状态必须由人工从真实账户回填。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ad-portfolio-entity-contract.md。
-->

# Amazon 广告组合规划

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `marketplace_id` | `<value>` |
| `account_scope_id` | `<value/missing>` |
| `profile_id` | `<value/missing>` |
| `currency/timezone` | `<values>` |
| `plan_version` | `<version>` |
| 当前可实施范围 | `<哪些实体可交人工、哪些受限或阻塞>` |
| 关键缺口与责任人 | `<缺口、受影响实体、下一责任人>` |

## B. 目标与成功标准

| 业务问题 | 主指标 | 护栏指标 | 观察窗口/时区 | 所需报表 | 因果限制 | 直接依据 |
|---|---|---|---|---|---|---|
| `<question>` | `<metric>` | `<metrics>` | `<window>` | `<report>` | `<limit>` | `<source>` |

## C. 实体规划

| 层级 | 上层实体 | 人工规划名称 | 现有平台 ID/待回填 | 商品范围 | 服务目标 | 预算/竞价边界 | 设计理由 | 待确认 |
|---|---|---|---|---|---|---|---|---|
| `<portfolio/campaign/ad_group/target/ad>` | `<parent>` | `<name>` | `<platform id/pending>` | `<scope>` | `<objective>` | `<scenario>` | `<reason>` | `<items>` |

## D. Target 映射

| Target/词簇来源 | 纳入 | 排除 | 商品锚点 | 抽象类型 | 平台枚举待确认 | 重叠目的 | 迁移依据 |
|---|---|---|---|---|---|---|---|
| `<source/type>` | `<attributes>` | `<attributes>` | `<products>` | `<type>` | `<value>` | `<purpose>` | `<requirements>` |

## E. 预算与竞价护栏

| 币种 | 总预算边界 | 适用实体 | 竞价边界 | 经济依据 | 批准人 | 停止/复核条件 |
|---|---:|---|---|---|---|---|
| `<currency>` | `<value/tbd>` | `<scope>` | `<range/tbd>` | `<source>` | `<owner>` | `<trigger>` |

## F. 实施批次

| 人工实施批次 | 计划动作 | 前置条件 | 执行人 | 上线后核验 | 回滚/停止条件 |
|---|---|---|---|---|---|
| `<sequence/name>` | `<manual actions>` | `<requirements>` | `<owner>` | `<platform values/report>` | `<rule>` |

## G. 数据缺口

| 缺口 | 影响 | 所需材料/确认 | 负责人 | 截止日期 |
|---|---|---|---|---|
| `<field>` | `<impact>` | `<evidence>` | `<owner>` | `<date/tbd>` |

## H. 判断依据

| 规划判断 | 来源/实际工具 | 账户、商品与期间 | 直接依据 | 设计理由 | 限制、冲突或待确认 | 原文定位 |
|---|---|---|---|---|---|---|
| `<structure/budget/target>` | `<user/upstream/SIF/SellerSprite/Sorftime + tool>` | `<scope>` | `<raw basis>` | `<reason>` | `<limits>` | `<path/row/result locator>` |

供应商信号不能填入用户账户实体字段；三方结果只有对象和定义一致时才比较，绝不平均。覆盖缺口和冲突逐项展示。

## I. 质量门

- [ ] 站点、账户、profile、币种和时区明确
- [ ] 实体父子关系唯一
- [ ] 名称未替代稳定 ID
- [ ] 元数据与绩效分开
- [ ] 关键词仅消费第02专家证据
- [ ] SIF 可见结构/流量观察未冒充用户广告账户数据或已存在实体
- [ ] 无固定预算比例或行业阈值
- [ ] 平台枚举未知时保留 TBD
- [ ] 所有操作为人工实施计划
- [ ] 正式文件位于 `outputs/`
