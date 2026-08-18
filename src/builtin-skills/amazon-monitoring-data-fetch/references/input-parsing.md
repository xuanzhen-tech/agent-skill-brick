# 输入解析与站点核验参考

标准 ASIN 为 10 位、以 B 开头的字母数字组合：`B[0-9A-Z]{9}`。统一转大写并去除前后空格和标点。长度不为 10 或不以 B 开头时记录警告；疑似错误时询问用户。

## 角色

- `own`：我方 ASIN、自己 ASIN、我们的 ASIN、我的 ASIN、本产品、我的链接等。
- `competitor`：竞品 ASIN、竞品、竞争对手、对手、竞对、对标、参考产品、competitor、rival、benchmark 等。

判定优先级：ASIN 紧邻角色词 > 同句角色词 > 明确意图 > 上下文。无法判定时必须询问。

## 意图

| 意图 | 信号 | 输出 |
|---|---|---|
| 监控 | 竞品监控、ASIN监控、监控、监测 | 快照与显著变化 |
| 分析 | 竞品分析、分析竞品、分析数据 | 数据及评论关键词对比 |
| 复盘 | 操作分析、还原竞品操作、复刻操作、还原动作 | 数据后可进入复盘 |
| 获取 | 获取数据、拉取数据、查一下、看一下 | CSV 与清单 |

多意图时复盘/分析优先于监控，监控优先于获取。

## 站点输入

用户明确写出的 Amazon 站点名称、域名或英文缩写均为强约束。解析时忽略大小写，移除 `Amazon`、`站`、`站点` 等修饰词后规范化。常见别名如下：

| 规范化站点 | 可识别名称、域名或缩写示例 |
|---|---|
| US | US、USA、United States、美国、amazon.com |
| UK | UK、GB、United Kingdom、英国、amazon.co.uk |
| CA | CA、Canada、加拿大、amazon.ca |
| DE | DE、Germany、德国、amazon.de |
| FR | FR、France、法国、amazon.fr |
| IT | IT、Italy、意大利、amazon.it |
| ES | ES、Spain、西班牙、amazon.es |
| JP | JP、Japan、日本、amazon.co.jp |
| IN | IN、India、印度、amazon.in |
| AU | AU、Australia、澳大利亚、amazon.com.au |
| MX | MX、Mexico、墨西哥、amazon.com.mx |
| BR | BR、Brazil、巴西、amazon.com.br |
| NL | NL、Netherlands、荷兰、amazon.nl |
| SE | SE、Sweden、瑞典、amazon.se |
| PL | PL、Poland、波兰、amazon.pl |
| BE | BE、Belgium、比利时、amazon.com.be |
| TR | TR、Turkey、土耳其、amazon.com.tr |
| AE | AE、United Arab Emirates、阿联酋、amazon.ae |
| SA | SA、Saudi Arabia、沙特、amazon.sa |
| SG | SG、Singapore、新加坡、amazon.sg |

表中仅表示可识别的输入，不承诺 MCP 当前支持所有站点。运行时应以 MCP 发现的站点枚举和参数 schema 为准。对于用户未提供站点的请求，默认 `US`，并在回复和 manifest 中标注该假设。

### ASIN—站点绑定规则

1. ASIN 必须在用户指定的规范化站点中核验；查询参数必须使用该站点。
2. 同一 ASIN 在不同站点的存在性、父子体、品牌、标题、规格、价格、评价和排名均可能不同；不得因一个站点检索成功而推断其他站点存在或一致。
3. 当用户表达“UK 的 B0XXXX”“Amazon UK / UK / 英国站”等，查询 UK；当表达“US 的 B0XXXX”“Amazon.com / 美国站”等，查询 US。
4. 多 ASIN、多个站点时，优先读取 ASIN 相邻或同句中的站点；全局站点只应用于没有局部站点的 ASIN。局部站点与全局站点冲突时，要求澄清。
5. 如果指定站点未找到该 ASIN，记录 `not_found` 并提示用户核对站点/ASIN；绝不能改查 US、其他站点或名称相似商品作为替代。
6. “对应 ASIN”仅指在目标站点内由工具返回并核验通过的目标 ASIN。除非 MCP 明确提供可审计的跨站映射字段，不得自行将某站 ASIN 映射成另一站 ASIN。

常见支持站点可包括 US、JP、UK、DE、FR、ES、IT、IN、CA；其他站点和实际代码以运行时 MCP 能力为准。