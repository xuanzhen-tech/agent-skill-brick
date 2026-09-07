# 物流客户拓客证据合同

> 由 `../SKILL.md` 在实体解析、联系方式分级、批次复盘和正式交付前读取。

## 1. 核心对象

不得把下列对象压成一行无来源文本：

| 对象 | 主键 | 作用 |
|---|---|---|
| `service_profile` | `service_profile_id` | 固定物流服务、线路、目标客户和排除条件 |
| `collection_run` | `run_id` | 记录一次平台发现任务的范围、工具、成本和状态 |
| `source_lead` | `source_lead_id` | 保存平台店铺、供应商或网站原始记录 |
| `company_candidate` | `candidate_id` | 保存待确认法定主体及其查询范围 |
| `entity_evidence` | `entity_evidence_id` | 支持或冲突平台记录与主体关系的证据 |
| `company` | `company_id` | 唯一确认或明确保持未确认的企业主体 |
| `contact_evidence` | `contact_evidence_id` | 保存单个联系方式在单个来源中的记录 |
| `sales_lead` | `lead_id` | 给业务使用的企业级销售视图 |
| `manual_review` | `review_id` | 多候选、冲突和异常号码的人工任务 |
| `suppression` | `suppression_id` | 拒绝联系、退订、投诉、无效或禁止用途记录 |

`source_lead`、`company` 与 `contact_evidence` 是多对多证据关系。不得用后续主体结论覆盖原始平台名称，也不得因销售视图只显示一个电话而删除其它来源证据。

## 2. 最低字段

### `service_profile`

- `service_profile_id`
- `version`
- `service_type`
- `origin_scope`
- `destination_scope`
- `transport_modes`
- `supported_goods`
- `restricted_goods`
- `target_company_roles`
- `target_industries_or_products`
- `must_conditions`
- `preferred_conditions`
- `exclusion_conditions`
- `approved_by`
- `approved_at`

### `collection_run`

- `run_id`
- `provider`
- `tool_or_template_id`
- `task_name`
- `query_language`
- `query_terms`
- `exclusion_terms`
- `country_or_site`
- `page_or_record_limit`
- `task_id`
- `lot_no`
- `started_at`
- `completed_at`
- `status`
- `rows_returned`
- `estimated_or_actual_cost`
- `error_code`
- `recovery_action`

### `source_lead`

- `source_lead_id`
- `run_id`
- `source_type`
- `source_record_id`
- `source_name_raw`
- `source_url`
- `country_region_raw`
- `product_or_industry_raw`
- `platform_tenure_raw`
- `platform_verification_raw`
- `revenue_or_scale_signal_raw`
- `captured_at`
- `raw_record_ref`

平台营收、评分、认证和年限都是平台陈述，不得升级为审计后事实或真实运输需求。

### `company` 与 `entity_evidence`

- `company_id`
- `legal_name`
- `english_legal_name`
- `jurisdiction`
- `unified_social_credit_code`
- `registration_status`
- `founded_at`
- `registered_address`
- `industry`
- `official_domain`
- `entity_match_status`
- `entity_confidence`
- `entity_evidence_id`
- `source_lead_id`
- `evidence_type`
- `evidence_url_or_ref`
- `observed_value`
- `relationship_claim`
- `support_or_conflict`
- `observed_at`
- `limitation`

### `contact_evidence`

- `contact_evidence_id`
- `company_id`
- `contact_type`
- `contact_value_raw`
- `contact_value_normalized`
- `contact_role`
- `source_type`
- `source_url_or_ref`
- `source_context`
- `observed_at`
- `confidence`
- `freshness_status`
- `validation_status`
- `priority`
- `suggested_use`
- `exclusion_reason`
- `suppression_status`

### `sales_lead`

- `lead_id`
- `company_id`
- `service_profile_id`
- `profile_fit_status`
- `profile_fit_evidence`
- `preferred_phone`
- `preferred_email`
- `preferred_website_or_channel`
- `contact_confidence`
- `lead_status`
- `owner`
- `next_action`
- `next_action_due_at`
- `last_reviewed_at`
- `notes`

## 3. 实体匹配状态

| 状态 | 条件 | 允许动作 |
|---|---|---|
| `entity_unresolved` | 只有店铺、英文名或品牌，无可靠主体证据 | 继续研究，不查联系方式 |
| `entity_candidate` | 有一个或多个主体候选，但证据不完整 | 补证或转人工 |
| `entity_unique_match` | 唯一候选且关键字段一致 | 可做工商复核 |
| `registration_verified` | 唯一主体已通过登记信息或二要素复核 | 可查企业联系方式 |
| `entity_no_match` | 已记录查询范围但未返回候选 | 保留缺口，不写企业不存在 |
| `entity_multiple_matches` | 返回多个合理候选 | 转人工，不选第一名 |
| `entity_evidence_conflict` | 名称、地址、日期、域名或信用代码实质冲突 | 保持主体拆分并停止 |

唯一匹配不由单一模糊名称相似度决定。至少保存两类相互独立的支持信号，或一个强身份信号：

- 强身份信号：统一社会信用代码、官方中英文对照、权威登记中的官网/地址对应；
- 辅助信号：成立日期、城市、详细地址、官方域名、ICP、品牌、展会目录、认证报告；
- 弱信号：产品相似、名称词根相似、同省份、搜索结果排序。

弱信号不能单独形成 `entity_unique_match`。

## 4. 联系方式分类与优先级

### 高优先级候选

- 官网明确列为 Sales、Business、Wholesale、Dealer、OEM/ODM 或合作入口的企业域名邮箱；
- 官网明确列示的企业座机或 WhatsApp；
- 企业数据源和官网/权威目录一致的企业座机或邮箱；
- 多个独立公开来源在合理时间内一致的公司级联系方式。

### 中优先级候选

- 仅企业数据源收录、未标异常的企业座机；
- 公开企业页面上的通用联系电话；
- 与主体关系清楚、但只有单一来源的企业域名邮箱；
- 页面明确用于业务但最新性未知的联系方式。

### 低优先级或待验证

- 免费邮箱；
- 个人手机号或个人姓名邮箱，且页面没有明确业务语境；
- `support@`、`privacy@`、`legal@` 等非销售角色邮箱；
- 疑似拼写错误、格式异常或来源过旧的值；
- 只有目录转载、无法确认原始页面的值。

### 排除

- 企业数据源标记为疑似代记账、注册代理或无效的号码；
- 已退订、拒绝联系、投诉或进入全局抑制名单的值；
- 泄露、购买或无法说明合法来源的数据；
- 私人账号、身份证件、家庭地址等非必要个人信息；
- Agent 猜测出的邮箱、姓名、职位或电话号码。

优先级不是可达性证明。第一次人工联系后必须追加实际结果，不能回写覆盖历史 Evidence。

## 5. 标准化与去重

- 企业主键优先使用司法辖区加注册号或统一社会信用代码；
- 没有注册号时，法定名称、注册地址和官方域名共同参与去重；
- 电话标准化保留国家码，移除展示空格和连字符，但不修改分机；
- 邮箱域名转小写，本地部分保留原值；
- 域名移除协议、`www.`、路径和末尾斜杠后比较；
- 同一标准化联系值可对应多条来源 Evidence，但销售视图只展示一次；
- 同名不同主体、同域名多品牌和同电话多公司不得自动合并，应记录关系或冲突。

## 6. 销售状态

允许状态：

- `discovered`
- `researching`
- `manual_review`
- `ready_for_human_outreach`
- `contacted`
- `qualified`
- `not_a_fit`
- `invalid_contact`
- `do_not_contact`

本 Skill 只能自动推进到 `ready_for_human_outreach`。`contacted` 及之后必须来自业务人员或已获授权的独立触达系统回执。

## 7. 批次指标

每个比例都写出分子、分母和适用批次：

- `discovery_relevance_rate = profile_fit_source_leads / reviewed_source_leads`
- `unique_entity_match_rate = unique_matched_companies / entity_research_started`
- `business_contact_coverage = companies_with_unsuppressed_business_contact / registration_verified_companies`
- `human_review_rate = records_sent_to_manual_review / records_entering_entity_or_contact_review`
- `excluded_contact_rate = excluded_contact_values / reviewed_contact_values`
- `ready_lead_rate = ready_for_human_outreach_companies / reviewed_source_leads`
- `cost_per_unique_contactable_company = attributable_provider_cost / unique_companies_with_unsuppressed_contact`

目的性样本、便利样本和人工挑选样本必须标记，不能把其成功率外推到总体。分母为零时指标为 `not_computable`，不是 0%。

## 8. Evidence 写法

每个关键判断包含：

1. `claim`：当前主张；
2. `direct_evidence`：来源 URL、文件定位或工具结果引用；
3. `reasoning`：证据为什么支持该主张；
4. `limitations`：证据不能证明什么；
5. `status`：已支持、部分支持、冲突、缺失或待人工；
6. `next_action`：补证、验证、排除或销售交接。

工具结果出现 `[agent-tool-result-compressed]` 或 `[agent-cli-tool-result-truncated]` 时，不得宣称全量。应缩小范围、按原工具分页或记录精确覆盖；仍不完整时，说明不能计算的指标和继续所需条件。

## 9. 失败代码

- `missing_service_profile`
- `missing_collection_scope`
- `provider_unavailable`
- `provider_authorization_failed`
- `provider_rate_limited`
- `provider_schema_changed`
- `provider_task_state_unknown`
- `discovery_result_truncated`
- `entity_no_evidence`
- `entity_no_match`
- `entity_multiple_matches`
- `entity_evidence_conflict`
- `contact_not_found`
- `contact_needs_validation`
- `contact_excluded`
- `suppressed_do_not_contact`

失败记录保存受影响对象、实际工具、时间、已完成范围、不能判断的事项和恢复条件。不得因失败静默换源、扩大权限或重复创建付费任务。
