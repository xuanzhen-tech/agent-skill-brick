/**
 * agent-skill 使用的轻量环境变量解析工具。
 *
 * 这些工具不依赖外部包，保证命令入口和 runtime artifact 启动可预测，
 * 同时让所有配置读取方用一致方式处理空值。
 */

export function firstNonEmpty(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

export function parseList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];
  return value.split(/[;,]/).map((item) => item.trim()).filter(Boolean);
}

export function stringField(value) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
