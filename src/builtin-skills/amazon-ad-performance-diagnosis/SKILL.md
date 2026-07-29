---
name: amazon-ad-performance-diagnosis
description: 对用户或可信上游提供的真实 Amazon 广告报表执行报告生命周期、范围、完整性、粒度、稳定 ID 联接、指标重算和驱动诊断，并可按职责组合 SIF 广告可见流量、SellerSprite PPC/广告排名与 Sorftime 自然排名趋势作外部对照。适用于广告表现复盘、异常定位、预算与搜索词决策前的数据验收；不适用于调用 Ads API、拉取或下载报表、用供应商观察替代曝光点击花费归因数据、自动调账或把外部观察写成因果。
---

<!--
文件功能：定义广告报表的异步生命周期、报告签名、完整性、口径、稳定 ID 联接、指标计算和证据化诊断。
职责边界：只分析合法输入中的一方广告报表，不创建报告请求、不轮询下载、不修改广告；三个 MCP 只可形成彼此独立的供应商观察对象，不得并入一方绩效字段。
重要关联：报告状态、完整性和指标合同见 references/ad-report-and-diagnostic-contract.md；正式交付使用 assets/templates/ad-performance-diagnosis-template.md；预算情景转交 amazon-ad-budget-and-acos-planning。
-->

# Amazon 广告绩效诊断

## 目标与完成定义

在解释“广告为什么变差”之前，先证明报表可用于比较：

1. 报表来自哪个账户、站点、实体、报告类型和时间范围；
2. 报告请求、处理、下载或导出是否真正完成；
3. 时区、币种、归因窗口、粒度和延迟是否一致；
4. 分页、截断、缺列、缺行和覆盖率是否可接受；
5. 实体是否通过稳定 ID 而非名称联接；
6. 变化由曝光、点击、成本、转化、客单或范围差异中的哪些可观察驱动解释；
7. 哪些只是待验证假设。

没有可验收的一方广告数据时，结果是数据就绪清单，不是绩效诊断。

## 使用边界

### 合法输入

- 用户对话及只读 `uploads/` 中的 Amazon Ads 控制台导出、报表文件、账户元数据、报告请求/状态/下载记录；
- 可信上游 `outputs/` 中带来源、版本、稳定 ID 和期间的广告数据；
- 用户提供的指标定义、归因窗口、币种、时区、报告延迟和业务目标；
- 规划包、关键词架构、Listing、库存、促销和第14利润产物，只作为解释上下文。
- 已接入假设下的三个 MCP 外层工具，仅在一方报告已验收后按职责补充外部广告结构、关键词/PPC 或自然排名观察。

任何 MCP 数据都不属于一方广告报表，不能提供用户账户真实曝光、点击、花费、归因订单、归因销售额、预算、竞价或 Search Term Report。

### 外部数据边界

- 新外部市场数据只允许通过 `sif_mcp`、`sellersprite_mcp` 或 `sorftime_mcp` 获取，且每个供应商只能形成独立外部观察；
- SIF 候选路由限于当前目录中的 `ads_get_asin_ad_traffic_trend`、`ads_get_asin_ad_historical_feature_profile` 与 `analyze_traffic_anomaly`；每个工具在本任务首次调用前都必须单独 `describe`，并只信当次机器 `inputSchema`；
- SellerSprite 仅补充 `traffic_keyword`、`traffic_source`、`traffic_keyword_stat` 等关键词/PPC/广告排名外部对照；Sorftime 仅补充 `product_traffic_terms`、`product_ranking_trend_by_keyword`、`competitor_product_keywords` 或 `keyword_trend` 的自然排名、自然竞品词和趋势；
- 不调用 Amazon Ads API、SP-API、报告 API、Web、浏览器或未列明的其他 MCP/API；
- 不读取 LWA/OAuth/广告账户密钥，不启动下载器、轮询器或后台任务；
- 报表缺失时要求用户或可信上游提供，不用市场数据推算广告账户事实。

三个目录均无机器级 `outputSchema`。工具名未知时先用对应外层工具 `search`；已知精确工具名可直接 `describe`。每个任务对每个工具首次调用前必须实时 `describe`，再按实时 `inputSchema` 由同一外层工具 `call`；不得拼 Gateway、HTTP、shell、索取密钥或把供应商格式指令写入诊断。

Sorftime 精确写工具黑名单为 `favorite_keyword | change_favorite_keyword | del_favorite_keyword | shopee_favorite_keyword | shopee_change_favorite_keyword | shopee_del_favorite_keyword | walmart_favorite_keyword | walmart_change_favorite_keyword | walmart_del_favorite_keyword`，一律不得调用。黑名单只按这九个精确名称匹配，不得用名称子串推断其他候选的读写性质；其他候选必须以本任务实时 `describe` 判断副作用，副作用无法确认时失败关闭。

### 工作区

- `uploads/` 只读；
- `temp/advertising/<case-id>/02-performance-diagnosis/` 存放报告清单、标准化、联接、重算和诊断草稿；
- `outputs/advertising/<case-id>/02-performance-diagnosis/` 存放唯一正式诊断；
- 原始文件和原字段值不覆盖，所有转换创建新记录。

### 证据与判断

输入材料记录来源路径、报告 ID/签名、版本、期间、账户/站点范围和限制。每次 MCP 业务调用保留供应商、实际工具、查询范围、参数的直接依据、原始返回值和可复查位置；无法从合法材料构造的参数不调用。

Agent 的标准化、联接、指标重算、变化分解和根因假设必须说明使用了哪些输入字段、单位和公式，以及哪些部分只是推断。供应商观察只能支持假设或替代解释，不能成为一方报表行。

## 启动检查

### 最低输入

至少需要：

1. 业务问题和比较对象；
2. 账户/profile、站点和币种；
3. 报告类型和实体粒度；
4. 开始/结束日期、时区和归因口径；
5. 报表文件或可信上游路径；
6. 稳定实体 ID 或明确无法联接的限制；
7. 报告生命周期与完整性信息。

### 结论表达

先说明当前报表足以支持完整诊断、只能支持带限制的局部诊断，还是暂时无法诊断。报表仍在生成、失败/取消/超时、下载失败、结果截断、范围或归因冲突、对象不可比、联接不稳定或分母为零时，分别写明受影响的指标、不能下的结论和下一步。

异步报表生命周期按每份报表单独记录；指标计算问题和假设支持强弱也在对应判断旁说明，不能用一个总状态掩盖具体原因。

## 报告生命周期

外部系统可能是异步的，但本 Skill 不执行请求或轮询。它只读取已有证据，并说明报告仍在生成、已经完成但尚待下载核验、明确失败/取消、在用户等待边界内超时、下载失败、已读入验收，或因文件问题被拒绝。

仍在生成、超时、失败、取消或下载失败都不能写成空报表；只有文件已读入并通过结构验收，才进入诊断。

## 执行流程

### 三 MCP 外部观察预检

只有一方广告报表已通过生命周期、范围、完整性和稳定 ID 验收，且外部观察能回答明确的替代解释时才调用相应供应商：

1. 确认目标外层 `sif_mcp | sellersprite_mcp | sorftime_mcp` 可见；计划使用多源却缺一方时明确降低覆盖范围，独有单源不可见时只说明该来源不可用且当前没有相应证据；
2. 工具名未知时通过同一外层工具先 `search`；已知精确工具名可直接 `describe`。对本任务首次使用的每个候选工具必须执行实时 `action=describe`、`kind=tool`、精确 `name`；
3. 只按机器 `inputSchema` 组装参数，并用同一外层工具执行 `action=call`、相同 `name` 和 `arguments`；description 与 schema 冲突时失败关闭；
4. 从直接父 Evidence 取得目标站点，并按实时 `inputSchema` 实际暴露的站点字段（如 `country`、`marketplace`、`amz_site`、`keyword_support_site`、`site`）映射；SIF 工具实际暴露 `country` 时显式写入 `arguments.country`。只有 schema 无法控制站点且工具默认/覆盖与目标站点不一致时，才停止该供应商分支；不得默认 `US` 或自造字段、枚举；
5. 保存原始结果和可复查位置，各供应商观察独立登记；
6. 说明流量分数、广告结构画像或异常诊断是供应商直接返回还是供应商估算，不得映射为 impressions、clicks、spend、orders、sales 或一方归因；
7. 供应商未查询、未返回、解析失败、字段缺失或冲突都不能补成零；只有响应明确给出且口径可确认的零才按真实零处理。重叠数据先对齐站点、对象、期间、粒度、币种/单位、流量口径、分页、定义和采集时间，口径一致才比较且不平均，口径不同只作方向印证，冲突逐源分列。计划中的某个数据源缺失时明确降级覆盖范围；独有单源失败时只说明该来源不可用和当前没有相应证据。

### 第一步：建立报告 manifest

每个报告记录报告 ID/类型、账户/profile/站点、请求/完成/下载时间、当前生命周期、文件路径、恢复信息和文件版本。另用账户、站点、报告类型、实体范围、日期、时区、归因窗口、列集和筛选条件描述报告签名，不需要脚本才能完成。

### 第二步：确认终态与恢复信息

对非终态报告：

- 保留最后已知状态和时间；
- 记录上游提供的 report ID、错误和恢复入口；
- 不自行轮询；
- 若已有同签名成功报告，必须确认它是同一请求范围，不能仅凭文件名替代；
- 只在用户提供的超时规则下标 `timeout`。

### 第三步：验收文件结构

检查：

- 编码、表头和列；
- 行数、页数、分页 token/页号；
- 是否存在 truncated、partial、sampled 或 row limit 标志；
- 空文件、只有表头、解析失败和真实零行的区别；
- 总计行、重复行和未知行；
- 原始币种、单位和日期格式。

任何缺失都写入覆盖率，而不是静默删除。

### 第四步：冻结口径

每个数据集记录：

- 账户/profile/站点；
- 币种和时区；
- 报告时段和粒度；
- 归因窗口和归因日期语义；
- 报告生成时间及已知延迟；
- 实体状态/类型范围；
- 是否含无活动、无点击或无销售行；
- 筛选和排除。

两个时段只有口径一致或合法调整后才可比较。

### 第五步：通过稳定 ID 联接

优先联接：

- campaign ID；
- ad group ID；
- target/keyword ID；
- ad/product ID；
- report row ID 或其他真实稳定 ID。

名称只用于显示。缺稳定 ID 时：

- 不自动合并同名实体；
- 建立 unresolved join 表；
- 可在单文件内部分析，但跨表结论受限；
- 人工确认映射后新增证据，不改写原行。

### 第六步：区分零、空、缺失和失败

- 数值 `0`：来源明确报告零；
- `null/missing`：字段或值缺失；
- `empty_result`：已完成且查询范围真实无行；
- `not_requested`：没有报告请求；
- `processing/timeout/failed/cancelled/download_failed`：生命周期状态；
- `not_applicable`：指标不适用于该粒度；
- `not_computable`：分母缺失或为零。

这些状态不得互换。

### 第七步：重算指标

只在字段语义和分母明确时计算：

- CTR = clicks / impressions；
- CPC = spend / clicks；
- CVR = attributed orders / clicks；
- ACoS = spend / attributed sales；
- ROAS = attributed sales / spend。

分母为零或缺失时用 `not_computable`。所有金额保留币种；不得把不同归因窗口的分子分母混用。

### 第八步：验证汇总一致性

检查：

- 行级加总与来源总计；
- 重复页/重复 ID；
- 日粒度与期间总计；
- 实体层级重复归集；
- currency/timezone/attribution 不一致；
- 迟到归因导致的未成熟时段。

差异记录容差来源，不自定万能容差。

### 第九步：分解变化

对可比期间按证据分解：

- 曝光机会；
- 点击率；
- 点击成本；
- 转化率；
- 归因客单；
- 预算受限或状态变化；
- 商品、目标、竞价或范围变化；
- 报告成熟度和覆盖差异。

先报告贡献方向和可观察链，不跳到“算法惩罚”“竞争加剧”等无证结论。

### 第十步：形成诊断假设

每个假设记录：

- 观察；
- 直接证据及其定位；
- 因果链中的已支持与未知环节；
- 替代解释；
- 需要的补充报告或实验；
- 可逆的下一步；
- 该假设是已支持、部分支持、没有支持，还是尚未检验，并说明原因。

观察性报表不能单独证明因果。

## 失败与降级

- 报告仍在生成、失败、取消或超时：保留生命周期和恢复信息，不诊断；
- 下载失败：输出恢复清单，不写空结果；
- 范围或归因冲突：只做单表描述，无法保证一致时阻塞比较；
- 报告截断或仅部分覆盖：明确覆盖和可完成范围，降低结论强度；
- 跨表联接不稳定：不做跨表归因；
- 分母为零：相关指标说明不可计算，不把计算失败写成零；
- 报告过期：只作历史证据；
- 返回列与实时说明不匹配：保留实际列，不猜映射；
- 任一供应商参数错误时由同一外层工具重新 `describe` 并按实时 schema 修正一次；仍失败、无权限、限流、空结果或 schema 漂移时停止该供应商观察分支，不静默换源，不用它改变一方报表的验收状态；
- 对取数、轮询、下载、账户调优执行或因果保证等越界请求，明确拒绝并说明可提供的只读诊断范围。

## 正式交付

至少生成：

1. `ad-performance-diagnosis.md`
2. `ad-report-manifest.csv`
3. `ad-data-quality-and-join-ledger.csv`
4. `ad-diagnostic-hypothesis-ledger.csv`
5. `ad-performance-evidence-ledger.md`

使用 `assets/templates/ad-performance-diagnosis-template.md`。生命周期或完整性不合格时，首页必须显示阻塞，不得仍给绩效结论。

## 质量门

- 按 `references/ad-report-and-diagnostic-contract.md` 检查 `[agent-tool-result-compressed]` 与 `[agent-cli-tool-result-truncated]`；出现任一 marker 时不得声称全量，须缩小范围/按内层分页，仍不完整则标记 provider 覆盖不足并停止受影响诊断。

- 报告生命周期与文件验收分开；
- report ID、签名、恢复信息和来源路径完整；
- 时区、币种、归因、粒度、延迟、分页、截断和覆盖率完整；
- 联接使用稳定 ID；
- 零、缺失、空结果和失败分开；
- 指标分母可追溯，零分母为 `not_computable`；
- SIF、SellerSprite 与 Sorftime 外部观察彼此分列，并与一方广告绩效分层，未冒充账户曝光、点击、花费、订单或归因；
- 诊断假设有替代解释和结论上限；
- 没有 Ads API、轮询、下载或调账执行；
- 每项指标和根因判断均能回到报表字段或供应商观察，并写明公式、推理、限制和下一步。

## 资源读取

- 验收报告、联接、重算指标和建立假设前读取 `references/ad-report-and-diagnostic-contract.md`。
- 写正式诊断前读取或物化 `assets/templates/ad-performance-diagnosis-template.md`。
