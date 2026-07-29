<!--
文件功能：作为 Agent 生成 A+ 内容架构、模块文案和视觉资产 brief 时使用的稳定模板。
职责边界：只约束规划与交接字段，不预填模块、图片、资格、尺寸或平台政策结论。
重要关联：由 ../../SKILL.md 写入 outputs/listing-optimization/<case-id>/04-aplus-content-plan/ 前读取或物化；字段语义见 ../../references/aplus-module-and-visual-brief-contract.md。
-->

# Amazon A+ 内容与视觉 brief

## 任务摘要

- Case ID：
- Amazon 站点：
- 产品与变体：
- 目标类型：`A+ | Premium A+ candidate | unconfirmed`
- 账户资格状态：`verified_by_user | eligibility_unverified`
- 核心沟通目标：
- 内容就绪状态：`ready_for_brief | limited_assets | limited_evidence | conflicted | blocked | out_of_scope`
- 限制/失败状态：`none | missing_product_facts | missing_assets | rights_unknown | eligibility_unverified | conflicted_sources | upstream_contract_mismatch | out_of_scope`

## 输入与资产盘点

| 路径或来源 | 类型 | 版本/期间 | Evidence ID | 权利/使用状态 | 限制 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 事实与内容边界

### 可使用事实

| Fact ID | 事实 | 适用变体 | 来源 | 四轴标签 |
|---|---|---|---|---|
|  |  |  |  |  |

### 禁止或待确认

| 项目 | 状态 | 原因 | 责任方 |
|---|---|---|---|
|  |  |  |  |

## 叙事顺序

| 顺序 | Module ID | 功能角色 | 沟通任务 | 受众问题 | 状态 |
|---:|---|---|---|---|---|
| 1 |  |  |  |  |  |

## 跨模块一致性合同

- Consistency anchor asset ID：
- 锚点来源路径与权利状态：
- 必须保持的产品外观/部件/比例：
- 共享色彩系统：
- 共享字体体系：
- 共享光照方向：
- 共享背景语言：
- 当前运营方待核的模块/尺寸/字号/安全区规则：

## 模块 brief

### MODULE-001

- 功能角色：
- 沟通任务：
- 标题草案：
- 正文草案：
- Fact ID：
- Keyword ID：
- VOC Evidence ID：
- Asset ID：
- Consistency anchor asset ID：
- 继承的共享视觉约束：
- 禁止宣称：
- 后台/政策待核：
- 状态：

按真实需要增加模块，不为凑模块数重复卖点。

## 对比表规划

若证据不满足同口径比较，写“未规划”并说明缺口。

| 比较字段 | 产品/变体 A | 产品/变体 B | 证据 ID | 单位/期间 | 限制 |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

## 视觉资产需求

| Asset ID | Module ID | Anchor Asset ID | 画面目的 | 必备元素 | 禁止元素 | 源资产/权利 | 共享约束 | 单资产与跨模块验收 | Rework scope |
|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |

## 跨模块验收与局部返工

| Module/Asset ID | 产品身份 | 色彩/字体 | 光照/背景 | 变体边界 | 结论 | 仅返工项 | 冻结项 |
|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |

## 责任交接

### 文案负责人

- 

### 视觉负责人

- 

### 运营负责人

- 复核账户资格、实际模块映射、尺寸、字符和提交规则。

### 合规或权利负责人

- 

## 证据谱系账本

输入事实和资产使用 `input_evidence` 并保留原四轴；Agent 模块/资产规划使用 `agent_output` 并通过 Parent Evidence IDs 指回输入。

| Record ID | Record type | Parent Evidence IDs | 来源路径/工具 | 使用字段/期间 | `source_type` | `temporal_scope` | `estimation_status` | `transformation_type` |
|---|---|---|---|---|---|---|---|---|
|  | `input_evidence` 或 `agent_output` |  |  |  |  |  |  |  |

## 能力声明

- 本 brief 不证明账户具备 A+ 或 Premium A+ 资格。
- 本 Skill 未生成、编辑、上传或提交图片。
- 本 Skill 未执行 Seller Central 操作。
- 本 Skill 未直接调用 SIF 或其他外部业务数据源。
- 使用的上游对象保留原始四轴、父证据 ID 与限制：
- 未查询或不可见的内容：
