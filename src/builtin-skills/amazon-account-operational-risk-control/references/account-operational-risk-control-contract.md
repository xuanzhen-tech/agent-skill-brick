<!--
文件功能：定义合法账号治理中的实体关系、授权访问、材料一致性、敏感变更、控制状态和硬拒绝合同。
职责边界：不提供反检测、身份伪造或封禁规避方案，不执行平台、设备或网络变更。
重要关联：由 ../SKILL.md 在账号运营风险评估时读取；正式字段映射到 ../assets/templates/account-operational-risk-control-template.md。
-->

# 账号运营风险控制合同

## 1. 硬拒绝类别

- `anti_detect_browser`
- `fingerprint_spoofing`
- `cookie_or_session_manipulation`
- `residential_or_rotating_proxy`
- `device_identifier_manipulation`
- `identity_or_kyc_evasion`
- `shell_or_borrowed_entity`
- `account_farm_or_account_trade`
- `ban_or_review_evasion`
- `relationship_concealment`
- `risk_algorithm_reverse_engineering`

命中任一项即 `prohibited_evasion_request`。不得输出工具名称、配置参数、采购建议或操作步骤。

## 2. 实体与账号关系

| 字段 | 约束 |
|---|---|
| `relationship_id` | 稳定编号 |
| `from_object/to_object` | entity/beneficial_owner/account/brand/vendor |
| `relationship_type` | ownership/control/authorization/service/brand_use |
| `parent_evidence_ids` | 必填 |
| `status` | verified/reported/unverified/conflicted |
| `effective_dates` | 明确或 unknown |
| `business_reason` | 多实体时必填 |
| `disclosure_or_approval_status` | required/not_required/approved/pending/unknown |
| `owner/limitations` | 必填 |

## 3. 授权访问

- `principal_id_masked`
- `employment_or_contract_relationship`
- `business_duty`
- `required_role/current_role`
- `mfa_status`
- `approved_device_and_remote_access`
- `authorization/review/expiry/revocation dates`
- `approver`
- `evidence_ids`
- `risk_and_action`

不得记录密码、验证码、恢复码、Cookie、session 或 token。

## 4. 材料一致性

- `material_id/category`
- `current_value_masked`
- `source_evidence_id`
- `expected_truth`
- `status=consistent/explained_difference/unexplained_conflict/unknown`
- `effective_date`
- `affected_scope`
- `professional_review_required`
- `owner/action/status`

真实且有证据的业务差异不等于风险规避；不得为了“隔离”制造虚假差异。

## 5. 敏感变更

- `change_id`
- `reason`
- `before/after`
- `evidence_ids`
- `risk_review`
- `policy_or_professional_review`
- `approver`
- `execution_owner/window`
- `validation_evidence`
- `incident_or_rollback_plan`
- `status`

## 6. 控制与状态

控制状态为：

- `proposed`
- `approved`
- `in_progress`
- `user_claimed_completed`
- `verified_completed`
- `blocked`

完成与有效性验证必须分开记录。

## 7. 证据谱系

输入记录 `evidence_id`、`source_path`、`source_type`、`evidence_class`、范围和四轴；Agent 输出记录 `parent_evidence_ids`、推导方法、状态、限制和批准。

## 8. 结论上限

- 不预测 Amazon 内部风控评分；
- 不保证账号不会关联、审核、限制或停用；
- 不把合法控制包装成隐匿关系；
- 平台允许性必须来自带日期依据或适格责任方。

## 9. 来源可用性与业务状态

`source_availability_status` 与运营风险 `result_status/control status` 分列，只允许 `not_returned / not_queried / parse_failed / missing / conflicted / true_zero`。前五项不得写成 0、无账号、无访问、无冲突或无风险；`true_zero` 仅用于范围完整且经核验的登记真实为零。

正例：完整权限登记确认孤儿高权限账号数为 0，可记 `true_zero`。反例：服务商访问尚未核验时记 `not_queried`，不能写“零第三方访问”或“无关联风险”。
