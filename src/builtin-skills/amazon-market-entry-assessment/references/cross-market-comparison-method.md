<!--
文件功能：定义多个 Amazon 站点之间的类目解析、币种、期间、分母和排序可比性方法。
职责边界：只解决 SIF 站内证据的安全比较，不提供实时汇率、不转换税费合规文化数据，也不要求在口径不足时强制排名。
关联关系：由 ../SKILL.md 的跨站比较与验证优先级阶段读取；逐站证据状态见 market-entry-evidence-contract.md，比较表头见 ../assets/templates/market-entry-workbook-template.md。
-->

# 跨 Amazon 站点比较方法

## 比较前提

多站点比较不是把多个 API 结果横向拼接。先证明每个比较单元在市场定义、期间、指标定义、分母和取样范围上足够一致。

## 主题对齐

1. 每站使用同一产品定义和适当本地化种子词建立主题。
2. 保存原始词、本地化说明、规范化动作和选择依据。
3. 搜索意图明显不同的主题写 `not_comparable`，即使字面相似。
4. SIF 当前不能证明完整类目树，不生成或比较 node ID。
5. 主题粒度不同但仍有参考价值时写 `limited` 并说明差异。

## 币种处理

- 所有原始金额保留 `raw_value + local_currency`。
- 无用户或上游汇率时，不转换、不相加、不按金额大小排序。
- 有汇率时必须记录来源、基准币、报价币、日期和公式；转换结果另列为 `source_type=agent`、`transformation_type=calculation`，引用输入 Evidence IDs，原值不覆盖。
- 汇率换算不能补齐税、平台费、付款费、关税或物流成本。
- 价格带比较优先使用当站销量/销额占比、分位或“低/中/高相对位置”，并保留计算方法。

## 期间与季节

- 尽量使用相同日历期间。
- 返回期间不同或月份错位时，先分别解释，不把同比、环比或季节波动混算。
- 目标站点所处季节不同不等于数据错误；没有足够周期时只登记季节性假设。
- 调用时间不能替代数据期间。

## 比率与分母

跨站比较比率前确认：

- 是 `0–1` 还是 `0–100`；
- 分母是商品、品牌、销量、销额、点击还是搜索；
- Top N 的 N 是否一致；
- 父体、子体和变体口径是否一致；
- 两侧 `source_type`、`temporal_scope`、`estimation_status`、`transformation_type`、对象和覆盖是否一致或具有明确的可比转换。

分母不同的百分比不得并排标成同一指标。

## 可比性状态

| 状态 | 条件 | 允许动作 |
|---|---|---|
| `comparable` | 市场定义、期间、指标、分母和样本一致 | 数值并列和差异计算 |
| `limited` | 存在已披露差异，但方向性观察仍有价值 | 并列描述、站内分位或标签 |
| `not_comparable` | 类目、期间、分母或字段语义实质不同 | 分开报告，不排序 |

## 验证优先级

优先级不是最终市场排名。推荐顺序：

1. 排除 `blocked` 和 `out_of_scope`；
2. 保留所有 `advance_for_validation`；
3. 检查哪个站点的下一条证据成本更低、能更快改变决定；
4. 只有用户给出明确权重时，才计算透明加权结果；
5. 缺失维度不得用零分、平均值或其他站点值补齐。

若用户没有权重，使用非补偿式条件矩阵，不生成伪精确总分。

## 外部缺口

比较表必须为以下信息保留独立状态：

- `fx_status`
- `tax_status`
- `compliance_status`
- `logistics_status`
- `culture_localization_status`
- `unit_economics_status`
- `team_readiness_status`

这些字段只有用户或上游提供可追溯证据时才能从 `missing` 变为 `user_confirmed`、`upstream_ready` 或 `professional_confirmed`。SIF 市场数据不能改变这些状态。
