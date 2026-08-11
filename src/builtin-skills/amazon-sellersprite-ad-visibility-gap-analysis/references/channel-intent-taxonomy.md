<!--
文件功能：为供应商返回的通道、关键词和研究意图提供可追溯分类。
职责边界：分类是分析标签，不代表竞品真实账户结构、投放意图或可直接执行的广告动作。
重要关联：../SKILL.md、visibility-calculation-cookbook.md。
-->

# 通道与关键词分类

## 通道

- `natural`：自然搜索可见；
- `ads_sp`：供应商明确标记 SP/PPC；
- `ads_brand`：供应商明确标记品牌广告；
- `ads_video`：供应商明确标记视频广告；
- `recommended`：关联、推荐或其他明确返回来源；
- `unknown_channel`：字段不能可靠映射。

没有实际字段支持时不得从位置、样式或词义猜测通道。

## 词簇

`core_product | attribute | use_case | problem_solution | audience | compatibility | brand_own | brand_competitor | alternative | accessory | irrelevant | unclear`

每个分类保留 `keyword_raw, normalization_rule, classification, confidence, evidence_id, counterexample_or_note`。原词永不覆盖；品牌、型号、容量、接口和电压等有业务意义 token 不删除。

## 研究方向标签

需要组织验证队列时可使用中性标签：

- `coverage_observation`
- `listing_alignment_candidate`
- `brand_or_competitor_query_candidate`
- `needs_first_party_validation`
- `observe_only`

不使用 `harvest`、`defense` 或其他容易被误解为已确认账户动作的标签。研究标签不能直接生成 Campaign、Target、否词、预算或竞价动作。
