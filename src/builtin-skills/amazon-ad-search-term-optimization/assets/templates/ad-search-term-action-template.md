<!--
文件功能：提供 Search Term 证据、产品锚点、行动、迁移、否定、冲突和人工执行回填模板。
职责边界：模板不执行广告写入；所有动作在人工批准与回填前均为候选。
重要关联：由 ../../SKILL.md 物化；字段和状态遵循 ../../references/ad-search-term-action-contract.md。
-->

# Amazon 广告搜索词行动账本

## A. 元数据

| 字段 | 内容 |
|---|---|
| `case_id` | `<case-id>` |
| `account/profile/marketplace` | `<values>` |
| `period/timezone/attribution` | `<values>` |
| 使用的 Search Term 报表 | `<report id/path/version>` |
| 当前可行动范围 | `<可交人工复核/仅观察/阻塞>` |
| 关键缺口与责任人 | `<缺口、受影响搜索词、下一责任人>` |

## B. 产品锚点

| 商品/变体 | 纳入属性 | 排除属性 | 品牌范围 | 宣称限制 | 直接来源 | 有效日期 |
|---|---|---|---|---|---|---|
| `<product>` | `<attributes>` | `<attributes>` | `<scope>` | `<rules>` | `<source>` | `<date>` |

## C. Search Term 观察

| Search Term 原文 | 报表中的 Target/广告实体 | 商品 | 报表及行定位 | 期间 | 平台类型 |
|---|---|---|---|---|---|
| `<raw>` | `<target/campaign/ad group/ad>` | `<product>` | `<report/row>` | `<window>` | `<reported>` |

## D. 关键词映射

| Search Term | 关键词/词簇依据 | 映射结论与理由 | 用户意图 | 商品相关性 | 纳入/排除规则 | 外部观察日期与来源 |
|---|---|---|---|---|---|---|
| `<term>` | `<keyword/cluster>` | `<direct/manual/unmapped/conflicted + why>` | `<value>` | `<value>` | `<rules>` | `<date/source>` |

## E. 广告证据

| Search Term | Impressions | Clicks | Spend | Orders | Sales | CTR | CPC | CVR | ACoS | 归因成熟度 | 数据限制 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| `<id>` | `<value>` | `<value>` | `<value currency>` | `<value>` | `<value currency>` | `<value/not_computable>` | `<value>` | `<value>` | `<value>` | `<mature/immature/unknown>` | `<reported/missing>` |

## F. 行动账本

| Search Term | 建议动作 | 直接理由 | 冲突/误伤风险 | 适用层级 | 人工复核人 | 执行回填 |
|---|---|---|---|---|---|---|
| `<term>` | `<harvest/migrate/negative/observe/retain/no action>` | `<basis>` | `<risk>` | `<campaign/ad group>` | `<owner>` | `<not executed/result>` |

## G. 迁移计划

| 搜索词/来源 Target | 目标结构 | 抽象 Target 类型 | 人工顺序 | 覆盖风险 | 回滚条件 | 批准人 |
|---|---|---|---|---|---|---|
| `<term/source>` | `<destination/tbd>` | `<type>` | `<steps>` | `<risk>` | `<rule>` | `<owner>` |

## H. 否定复核

| 否定对象 | 适用层级 | 来源 Target | 直接理由 | 误伤风险 | 纳入/排除冲突 | 平台枚举确认 | 批准人 |
|---|---|---|---|---|---|---|---|
| `<text>` | `<level>` | `<targets>` | `<reason>` | `<risk>` | `<conflict>` | `<known/tbd>` | `<owner>` |

## I. 判断依据

| 搜索词与动作 | 来源/实际工具 | 账户、商品与期间 | 直接依据 | 动作理由 | 风险、冲突或缺口 | 原文定位 |
|---|---|---|---|---|---|---|
| `<search term/action>` | `<report/SIF/SellerSprite/Sorftime + tool>` | `<scope>` | `<raw basis>` | `<reason>` | `<limits>` | `<path/row/result locator>` |

自然词、供应商广告可见词与真实 Search Term 分列；只有对象和定义一致时才比较，绝不平均。缺一来源或独有单源失败时明确降低覆盖范围，不据此生成广告动作。

## J. 质量门

- [ ] 仅真实 Search Term 报表产生动作
- [ ] 使用稳定实体 ID
- [ ] 产品锚点和排除属性完整
- [ ] 关键词研究未被重复
- [ ] 归因成熟度和零分母正确
- [ ] 无固定阈值
- [ ] 迁移和否定含误伤/冲突检查
- [ ] 平台枚举未知时保留 TBD
- [ ] 所有动作等待人工执行
- [ ] 正式文件位于 `outputs/`
