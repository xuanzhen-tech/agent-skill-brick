<!--
文件功能：集中定义 Amazon 市场进入评估的 marketplace comparison 与 evidence ledger 两个标准 CSV sheet。
职责边界：模板只定义表头；物化 CSV 时不写注释，不换算无来源汇率，也不把供应商数据称为 Amazon 官方观测。
关联关系：由 ../../SKILL.md 正式交付阶段使用；逐站证据和跨站比较口径见 ../../references/。
-->

# Amazon 市场进入 Workbook 模板

## Sheet 1：marketplace-comparison.csv

```csv
marketplace,topic,seed_keywords,period,granularity,demand_judgment,demand_basis,trend_judgment,trend_basis,competition_judgment,competition_basis,asin_operating_background,keyword_access,external_readiness_gaps,cross_market_comparability,assessment,next_evidence,owner,notes
```

- 不建立或比较 node ID。
- 趋势与关键词专题优先引用相邻 Skill 正式输出。
- 原始金额保留本地币种；无带日期和来源的汇率时不换算。
- 汇率、税费、合规、物流、文化与本地化、单位经济和团队能力必须逐项写明已确认依据、缺口、责任人和下一步；MCP 市场信号不能替代这些正式依据。

## Sheet 2：evidence-ledger.csv

```csv
marketplace,assessment_dimension,source_file_or_provider,exact_tool_if_mcp,retrieved_at,query_object_period_filters_pagination,raw_value_or_text,reported_estimated_or_forecast,key_parameter_basis,agent_mapping_or_calculation,raw_result_location,coverage_conflict_and_limitations,conclusion_effect
```

- 原始 MCP 填写供应商与精确工具、查询边界、原值和原始结果位置。
- `arguments.country` 等关键参数必须能回到用户或上游依据；缺少依据时不得调用。
- Agent 的站点映射、换算和判断填写处理方法、反证、限制和结论影响。
- 未查询、未返回、解析失败、资料缺失和来源冲突不得补成 0。
