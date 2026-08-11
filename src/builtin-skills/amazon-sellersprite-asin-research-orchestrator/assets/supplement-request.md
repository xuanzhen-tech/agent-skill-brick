<!--
文件功能：定义专家向总控提出有界补数申请时的最小信息。
职责边界：只批准会改变主张、视觉状态或下一步判断的查询，不用调用次数或页数制造伪精确度。
重要关联：../SKILL.md、expert-task-card.md。
-->

# SellerSprite 有界补数申请

```yaml
request_id: required
case_id: required
requesting_module: required
dataset_version: required
claim_question_or_visual_id: required
missing_data: required
decision_impact: required
minimum_query_scope: required
no_query_downgrade: required
impacted_modules: optional
status: proposed | approved | rejected | completed | blocked
```

仅为“更全面”或“让图更好看”而不能说明判断增益的申请应拒绝。批准后由总控统一升级 dataset version，并通知实际受影响模块。
