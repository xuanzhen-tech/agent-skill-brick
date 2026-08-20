---
name: "security-precommit-check"
description: "用于跨境电商系统变更提交前的安全把关场景，检查密钥、客户数据、支付配置、Webhook、平台凭据和日志暴露，输出 P0/P1/P2 风险清单与修复动作。"
version: 0.1.0
collection: ecosystem
displayName: "提交前安全检查"
platforms: ["cross-platform"]
sceneTags: ["customer-voice", "brand-compliance", "store-operations", "analytics-automation", "cross-platform"]
searchTags: ["cross-platform", "customer-voice", "brand-compliance", "store-operations", "analytics-automation"]
legacyEcosystemId: "noique-cross-border-ecommerce-skills-security-precommit-check"
originKind: "template"
---

# security-precommit-check

## 适用场景与边界
用于跨境电商代码、配置、数据文件或自动化脚本提交前的安全检查，尤其涉及 Shopify、Amazon、TikTok Shop、支付、物流、邮件营销、CRM 或广告 API 凭据时。

该 skill 不是通用代码审查模板，重点是防止会直接造成账号、客户数据、支付或平台接口风险的提交进入仓库。

## 输入信息清单
- 变更范围：git diff、涉及目录、配置文件、脚本、数据样例和部署环境。
- 敏感资产：API key、secret、token、webhook secret、数据库 URL、支付密钥、店铺域名、客户邮箱/电话/地址。
- 集成对象：平台 API、支付、ERP、3PL、邮件服务、广告账户和 BI 工具。

## 检查流程
1. 扫描密钥：查找 token、secret、password、private key、cookie、session、.env 和导出的配置。
2. 检查样例数据：确认没有真实订单、买家姓名、地址、电话、邮箱、tracking number 或支付片段。
3. 检查 webhook/API：secret 校验、权限最小化、重试幂等、日志脱敏和错误处理。
4. 检查前端暴露：浏览器代码不得包含后端密钥、管理 API token 或内部 endpoint。
5. 给出阻断级别：P0 必须提交前移除，P1 需要修复并补测试，P2 可后续跟进但需记录。

## 关键指标与判断标准
P0 包括真实密钥、私钥、客户 PII、支付敏感信息、生产数据库连接、管理权限 token。发现 P0 时不得继续提交。P1 包括过宽权限、日志泄露、缺少 webhook 校验、可重放请求。P2 包括注释暴露内部流程或测试数据不够脱敏。

## 可执行输出
输出问题清单、文件位置、风险级别、修复建议、是否阻断提交、需要轮换的密钥和复查命令。对已泄露密钥必须建议立即吊销/轮换，而不是只从代码删除。

## 风险与合规
遵守平台 API 条款、PCI、GDPR/CCPA 和公司数据保留规则。不得把真实客户数据放入测试夹具、截图或日志样例。

## 示例
提交中新增 `SHOPIFY_ADMIN_TOKEN=shpat_...`。合格输出应标记 P0，要求删除文件、清理 git 历史或重新提交、立即轮换 token，并检查是否已推送远端。

## 验证方式
运行 secret scan、检查 git diff、抽查日志和测试夹具；确认密钥已从代码与历史中处理，并记录轮换完成时间。没有完成 P0 处理前不能提交。
