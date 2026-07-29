<!--
文件功能：集中定义 Amazon 市场进入评估的 marketplace comparison 与 evidence ledger 两个标准 CSV sheet。
职责边界：模板只定义表头；物化 CSV 时不写注释，不换算无来源汇率，也不把 SIF 数据称为 Amazon 官方观测。
关联关系：由 ../../SKILL.md 正式交付阶段使用；逐站证据和跨站比较口径见 ../../references/。
-->

# Amazon 市场进入 Workbook 模板

## Sheet 1：marketplace-comparison.csv

```csv
market_unit_id,marketplace,topic_id,seed_keywords,period,granularity,demand_status,demand_evidence_ids,trend_status,trend_evidence_ids,competition_status,competition_evidence_ids,asin_operating_background_status,asin_operating_evidence_ids,keyword_access_status,keyword_evidence_ids,comparability_status,fx_status,tax_status,compliance_status,logistics_status,culture_localization_status,unit_economics_status,team_readiness_status,assessment_status,next_evidence,notes
```

- `market_unit_id` 使用 `marketplace::normalized_topic_id`。
- 不建立或比较 node ID。
- 趋势与关键词专题优先引用相邻 Skill 正式输出。
- 原始金额保留本地币种；无带日期和来源的汇率时不换算。
- 外部经营状态不得由 SIF 信号从 `missing` 自动改为 ready。

## Sheet 2：evidence-ledger.csv

```csv
evidence_id,market_unit_id,source_type,source_provider,source_tool,agent_request_id,tool_call_id,provider_request_id,retrieved_at,marketplace,query_scope,temporal_scope,coverage_or_pagination,estimation_status,transformation_type,raw_result_locator,parent_input_evidence_ids,parent_evidence_ids,source_file,source_evidence_id,upstream_source_type,upstream_temporal_scope,upstream_estimation_status,upstream_transformation_type,field_state,limitations
```

- `source_type` 只使用 `sif_mcp`、`user_input`、`upstream_output`、`agent`。
- `transformation_type` 只使用 `reported`、`normalized`、`calculation`、`coding`、`inference`、`hypothesis`。
- 原始 SIF 使用 `source_provider=sif`、`transformation_type=reported`。
- `agent_request_id` 与 `tool_call_id` 只填写当前 AgentTool 调用上下文暴露的对应真实值；仅当该上下文未暴露对应字段时写 `not_returned`。`provider_request_id` 只填写 SIF 响应明确返回的服务端请求 ID，否则写 `not_returned`；三类 ID 不得互代。
- 任何传入的 `arguments.country` 都必须把其直接父 Evidence ID 写入 `parent_input_evidence_ids`；缺少该证据时不得调用。
- Agent 对象必须填写直接 `parent_evidence_ids`。
- `field_state` 只使用 `not_returned`、`not_queried`、`parse_failed`、`missing`、`conflicted`、`true_zero`。
