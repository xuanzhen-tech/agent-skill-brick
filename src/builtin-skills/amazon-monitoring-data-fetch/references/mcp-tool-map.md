# MCP 工具映射、站点与核验

每次执行均以 `sellersprite_mcp`、`sorftime_mcp` 的实际 `help`、`search`、`describe` 结果为准，禁止硬编码工具名、支持站点或参数。

需要发现：支持的 Amazon 站点/枚举、站点参数名称、ASIN/商品身份查询、父子变体、价格趋势、销量/订单估算、BSR、评分/评论、Listing 变更、配额与能力状态。优先 SellerSprite，必要时 Sorftime 降级。

站点参数可能使用 `site`、`marketplace` 或 `amz_site`，必须先读取 schema。对于每个 `(ASIN, 规范化站点)`，先执行详情、检索或身份查询，确认响应属于目标站点且 ASIN 可定位，再获取监控指标。响应中的站点字段、ASIN、标题、父子关系或商品标识可用于核验；没有足够字段时应记为 `verification_unavailable`，不得假设跨站一致。

如果 MCP 报告站点不支持、ASIN 不存在、商品不在该站点、参数无效或站点字段与请求不符，记录结构化错误，不回退到 US 或其他市场。只有用户重新指定站点/ASIN后才可重试。若两源的站点代码不同，须先确认二者是否代表同一市场；不确认则不能混用。

Sorftime 趋势可能返回月度 `key=value` 文本，应按粒度解析并明确标注，不可伪装为日级。评论可能约 100 条且无分页，必须披露样本限制。监控数据可能要求预先订阅，不得为获取历史数据擅自创建可能收费的订阅。

SellerSprite 的 429、quota exceeded、limit reached、no credits 等可表示限流或配额问题；Sorftime 的 insufficient coins、request limit exceeded 或配额为零表示无法降级。每源最多重试一次。将发现结果、站点参数、站点核验结果和查询限制写入 manifest，不要改写已安装 Skill 文件。