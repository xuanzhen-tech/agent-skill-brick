# 通道与搜索意图分类

## 通道
- `natural`：自然搜索可见；
- `ads_sp`：SP或ads标签；
- `ads_brand`：SB/品牌广告可见；
- `ads_video`：视频广告可见；
- `recommended`：AC/ER/四星/HR/关联等；
- `unknown_channel`：来源字段不能可靠映射。

## 词簇
- `core_product`：品类核心词；
- `attribute`：规格、接口、功率、尺寸、材质等；
- `use_case`：旅行、办公、家庭等场景；
- `problem_solution`：要解决的问题；
- `audience`：人群；
- `compatibility`：品牌/型号/设备兼容；
- `brand_own | brand_competitor`；
- `alternative | accessory | irrelevant`。

## 运营机制标签
- `discovery`：宽泛/上层主题，用于探索；
- `harvest`：高相关、供应商标记优质/稳定、多个证据支持；
- `defense`：自有品牌/核心品类防守候选；
- `competitor_targeting`：竞品品牌/ASIN意图候选；
- `listing_alignment`：与页面事实和核心需求一致，应交Listing验证；
- `observe_only`：相关性或数据质量不足。

分类是Agent编码，必须保留原词、规则、置信度和反例；不能从词簇直接生成Campaign或否词动作。
