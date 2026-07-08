/**
 * skill_find 远端发现与安装客户端。
 *
 * 本文件把 OpenAI curated skills、skills.sh 和 SkillHub 的搜索/安装细节
 * 收在 AgentSkill 内部。产品仓库仍然只传 skillsPath，模型通过 AgentTool
 * 调 skill_find 时再由这里负责远端候选、临时暂存和安全落盘。
 */

import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { validateSkillPackage } from "./skill-package.mjs";

const DEFAULT_LIMIT = 8;
const MAX_LIMIT = 20;
const DEFAULT_REF = "main";
const PROCESS_TIMEOUT_MS = 300_000;

export function getDefaultSkillFindProviders() {
  return [
    { id: "openai-curated", kind: "github-tree", repo: "openai/skills", repoPath: "skills/.curated", ref: DEFAULT_REF },
    { id: "skills-sh", kind: "skills-cli" },
    { id: "skillhub", kind: "skillhub-cli" }
  ];
}

export function createDefaultSkillFindClient(options = {}) {
  const providers = options.providers ?? getDefaultSkillFindProviders();
  const runProcess = options.runProcess ?? runProcessWithFreshEnv;
  const fetchJson = options.fetchJson ?? fetchGithubJson;

  return {
    async search(input) {
      const source = normalizeSkillFindSource(input.source);
      const selectedProviders = selectProviders(providers, source);
      const diagnostics = [];
      const results = [];

      for (const provider of selectedProviders) {
        try {
          results.push(...await searchProvider(provider, {
            ...input,
            source,
            limit: normalizeSkillFindLimit(input.limit)
          }, { runProcess, fetchJson }));
        } catch (error) {
          diagnostics.push({ source: provider.id, message: formatError(error) });
        }
      }

      return { results: dedupeCandidates(results).slice(0, normalizeSkillFindLimit(input.limit)), diagnostics };
    },

    async install(input) {
      const source = normalizeSkillFindProviderId(input.source);
      const provider = providers.find((candidate) => candidate.id === source);
      if (!provider) throw new Error(`Unsupported skill_find source: ${source}`);
      return await installFromProvider(provider, { ...input, source }, { runProcess });
    }
  };
}

export function normalizeSkillFindLimit(limit) {
  const parsed = Number(limit);
  if (!Number.isFinite(parsed)) return DEFAULT_LIMIT;
  return Math.max(1, Math.min(Math.floor(parsed), MAX_LIMIT));
}

export function normalizeSkillFindSource(source) {
  const normalized = String(source || "all").trim().toLowerCase();
  if (normalized === "clawhub") return "skillhub";
  if (normalized === "local" || normalized === "all" || isSkillFindProviderId(normalized)) return normalized;
  throw new Error(`Unsupported skill_find source: ${source}`);
}

export function normalizeSkillFindProviderId(source) {
  const normalized = normalizeSkillFindSource(source);
  if (normalized === "all") throw new Error("skill_find install must resolve to one provider.");
  if (normalized === "local") throw new Error("skill_find install does not support source=local.");
  return normalized;
}

export function parseSkillsShResults(stdout) {
  const lines = sanitizeProcessOutput(stdout).split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const results = [];
  for (let index = 0; index < lines.length; index += 1) {
    const match = /^([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+@[A-Za-z0-9_.-]+)(?:\s+(.+? installs))?$/.exec(lines[index] ?? "");
    if (!match) continue;
    const packageName = match[1];
    const nextUrl = lines[index + 1]?.match(/https?:\/\/\S+/)?.[0];
    const name = packageName.split("@")[1] ?? packageName;
    results.push({
      id: `skills-sh:${packageName}`,
      source: "skills-sh",
      name,
      package: packageName,
      url: nextUrl?.startsWith("http") ? nextUrl : undefined,
      installs: match[2]
    });
  }
  return results;
}

export function parseSkillHubResults(stdout) {
  const clean = sanitizeProcessOutput(stdout);
  const start = clean.indexOf("[");
  const end = clean.lastIndexOf("]");
  if (start < 0 || end < start) throw new Error("SkillHub did not return JSON results.");
  const data = JSON.parse(clean.slice(start, end + 1));
  if (!Array.isArray(data)) throw new Error("SkillHub JSON result was not an array.");
  return data.map((item) => {
    const record = item && typeof item === "object" ? item : {};
    const slug = String(record.slug ?? record.name ?? "");
    return {
      id: `skillhub:${slug}`,
      source: "skillhub",
      name: String(record.name ?? slug),
      slug,
      description: optionalString(record.description),
      url: optionalString(record.repo_url),
      githubStars: typeof record.github_stars === "number" ? record.github_stars : undefined
    };
  }).filter((candidate) => candidate.slug);
}

async function searchProvider(provider, input, dependencies) {
  if (provider.kind === "github-tree") return await searchGithubTree(provider, input, dependencies.fetchJson);
  if (provider.kind === "skills-cli") return await searchSkillsSh(input, dependencies.runProcess);
  return await searchSkillHub(input, dependencies.runProcess);
}

async function searchGithubTree(provider, input, fetchJson) {
  if (!provider.repo || !provider.repoPath) throw new Error(`Provider ${provider.id} is missing repo configuration.`);
  const ref = provider.ref ?? DEFAULT_REF;
  const data = await fetchJson(`https://api.github.com/repos/${provider.repo}/contents/${provider.repoPath}?ref=${encodeURIComponent(ref)}`);
  if (!Array.isArray(data)) throw new Error("Unexpected GitHub contents response.");
  const terms = normalizeSearchTerms(input.query);
  return data
    .filter((item) => isGithubDirItem(item))
    .filter((item) => matchesTerms(item.name, terms))
    .slice(0, input.limit)
    .map((item) => ({
      id: `${provider.id}:${item.name}`,
      source: provider.id,
      name: item.name,
      repo: provider.repo,
      path: `${provider.repoPath}/${item.name}`,
      url: item.html_url ?? `https://github.com/${provider.repo}/tree/${ref}/${provider.repoPath}/${item.name}`
    }));
}

async function searchSkillsSh(input, runProcess) {
  const result = await runProcess("npx", ["--yes", "skills", "find", input.query]);
  if (result.exitCode !== 0) throw new Error(result.stderr || result.stdout || "skills.sh search failed.");
  return parseSkillsShResults(result.stdout).slice(0, input.limit);
}

async function searchSkillHub(input, runProcess) {
  const result = await runProcess("npx", ["--yes", "@skill-hub/cli", "search", input.query, "--json", "--no-select", "--limit", String(input.limit)]);
  if (result.exitCode !== 0) throw new Error(result.stderr || result.stdout || "SkillHub search failed.");
  return parseSkillHubResults(result.stdout).slice(0, input.limit);
}

async function installFromProvider(provider, input, dependencies) {
  const destinationRoot = await ensureRealDirectory(input.skillRoot);
  const before = await listSkillDirs(destinationRoot);
  const stagingRoot = await fs.mkdtemp(path.join(path.dirname(destinationRoot), ".skill-install-"));
  try {
    const stagedInput = { ...input, skillRoot: stagingRoot };
    if (provider.kind === "github-tree") {
      const source = input.url
        ? parseGithubSkillUrl(input.url)
        : {
            repo: requireProviderRepo(provider),
            ref: provider.ref ?? DEFAULT_REF,
            path: `${provider.repoPath}/${requireInstallName(input.name)}`
          };
      await installGithubSkill({
        repo: source.repo,
        ref: source.ref,
        skillPath: source.path,
        destinationRoot: stagingRoot,
        destinationName: input.name,
        runProcess: dependencies.runProcess
      });
    } else if (provider.kind === "skills-cli") {
      await installSkillsShPackage(stagedInput, dependencies.runProcess);
    } else {
      await installSkillHubPackage(stagedInput, dependencies.runProcess);
    }

    await moveStagedSkillDirs(stagingRoot, destinationRoot);
    const after = await listSkillDirs(destinationRoot);
    return { installed: await describeNewSkills(destinationRoot, provider.id, before, after), diagnostics: [] };
  } finally {
    await fs.rm(stagingRoot, { recursive: true, force: true });
  }
}

async function installGithubSkill(input) {
  validateGithubRepo(input.repo);
  validateRelativePath(input.skillPath);
  const destinationRoot = await ensureRealDirectory(input.destinationRoot);
  const destinationName = input.destinationName?.trim() || path.basename(input.skillPath.replace(/[\\/]+$/, ""));
  validateSkillDirectoryName(destinationName);
  const destination = path.join(destinationRoot, destinationName);
  ensureInside(destination, destinationRoot);
  if (await pathExists(destination)) throw new Error(`Destination already exists: ${destination}`);

  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-github-"));
  try {
    const repoDir = path.join(tempRoot, "repo");
    await runRequired(input.runProcess, "git", [
      "clone",
      "--filter=blob:none",
      "--depth",
      "1",
      "--sparse",
      "--single-branch",
      "--branch",
      input.ref,
      `https://github.com/${input.repo}.git`,
      repoDir
    ]);
    await runRequired(input.runProcess, "git", ["-C", repoDir, "sparse-checkout", "set", input.skillPath]);
    const source = path.join(repoDir, input.skillPath);
    await assertValidSkillDirectory(source);
    await fs.cp(source, destination, { recursive: true, errorOnExist: true });
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function installSkillsShPackage(input, runProcess) {
  const packageName = requireInstallName(input.packageName);
  const destinationRoot = await ensureRealDirectory(input.skillRoot);
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agent-skill-skills-sh-"));
  try {
    const tempHome = path.join(tempRoot, "home");
    const codexHome = path.join(tempHome, ".codex");
    const appData = path.join(tempHome, "AppData", "Roaming");
    const localAppData = path.join(tempHome, "AppData", "Local");
    await fs.mkdir(codexHome, { recursive: true });
    // skills.sh 只被允许写入临时 HOME；随后再由本模块校验并复制到 ~/.agent-cli/skills。
    await runRequired(runProcess, "npx", ["--yes", "skills", "add", packageName, "-g", "-a", "codex", "-y", "--copy"], {
      env: {
        ...buildProcessEnvironment(),
        APPDATA: appData,
        CODEX_HOME: codexHome,
        HOME: tempHome,
        LOCALAPPDATA: localAppData,
        USERPROFILE: tempHome
      }
    });
    await copyInstalledSkillDirs(path.join(tempHome, ".agents", "skills"), destinationRoot);
  } finally {
    await fs.rm(tempRoot, { recursive: true, force: true });
  }
}

async function installSkillHubPackage(input, runProcess) {
  const slug = requireInstallName(input.slug);
  const destinationRoot = await ensureRealDirectory(input.skillRoot);
  await runRequired(runProcess, "npx", ["--yes", "@skill-hub/cli", "install", slug, "--dir", destinationRoot, "-y"]);
}

async function copyInstalledSkillDirs(sourceRoot, destinationRoot) {
  if (!(await pathExists(sourceRoot))) throw new Error("No skills were installed by skills.sh.");
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory());
  if (!dirs.length) throw new Error("No skill directories were installed by skills.sh.");

  for (const dir of dirs) {
    validateSkillDirectoryName(dir.name);
    const source = path.join(sourceRoot, dir.name);
    await assertValidSkillDirectory(source);
    const destination = path.join(destinationRoot, dir.name);
    ensureInside(destination, destinationRoot);
    if (await pathExists(destination)) throw new Error(`Destination already exists: ${destination}`);
    await fs.cp(source, destination, { recursive: true, errorOnExist: true });
  }
}

async function moveStagedSkillDirs(stagingRoot, destinationRoot) {
  const entries = await fs.readdir(stagingRoot, { withFileTypes: true });
  const dirs = entries.filter((entry) => entry.isDirectory());
  if (!dirs.length) throw new Error("No skill directories were staged for install.");

  const moves = [];
  for (const dir of dirs) {
    validateSkillDirectoryName(dir.name);
    const source = path.join(stagingRoot, dir.name);
    await assertValidSkillDirectory(source);
    const destination = path.join(destinationRoot, dir.name);
    ensureInside(destination, destinationRoot);
    if (await pathExists(destination)) throw new Error(`Destination already exists: ${destination}`);
    moves.push({ source, destination });
  }

  const moved = [];
  try {
    for (const move of moves) {
      await fs.rename(move.source, move.destination);
      moved.push(move.destination);
    }
  } catch (error) {
    await Promise.all(moved.map((destination) => fs.rm(destination, { recursive: true, force: true })));
    throw error;
  }
}

async function assertValidSkillDirectory(dir) {
  const validation = await validateSkillPackage(dir);
  if (!validation.valid) throw new Error(`Invalid skill package: ${validation.diagnostics.join("; ")}`);
}

async function runRequired(runProcess, executable, args, options) {
  const result = await runProcess(executable, args, options);
  if (result.exitCode !== 0) throw new Error(formatProcessFailure(executable, result));
}

function runProcessWithFreshEnv(executable, args, options = {}) {
  return new Promise((resolve) => {
    const processSpec = buildSkillFindProcessSpec(executable, args);
    const child = spawn(processSpec.executable, processSpec.args, {
      cwd: options.cwd,
      env: options.env ?? buildProcessEnvironment(),
      windowsHide: true,
      shell: false
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => child.kill(), options.timeoutMs ?? PROCESS_TIMEOUT_MS);
    child.stdout?.on("data", (chunk) => {
      stdout += Buffer.from(chunk).toString("utf8");
    });
    child.stderr?.on("data", (chunk) => {
      stderr += Buffer.from(chunk).toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      resolve({ exitCode: 1, stdout: sanitizeProcessOutput(stdout), stderr: sanitizeProcessOutput(stderr || error.message) });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ exitCode: code ?? 0, stdout: sanitizeProcessOutput(stdout), stderr: sanitizeProcessOutput(stderr) });
    });
  });
}

export function buildSkillFindProcessSpec(executable, args, platform = process.platform) {
  if (platform !== "win32") return { executable, args };
  return {
    executable: "cmd.exe",
    args: ["/d", "/s", "/c", buildWindowsCommandLine([executable, ...args])]
  };
}

function buildWindowsCommandLine(argv) {
  return argv.map(quoteWindowsCommandArg).join(" ");
}

function quoteWindowsCommandArg(value) {
  if (value.length === 0) return "\"\"";
  if (!/[\s"&|<>()^%]/.test(value)) return value;
  return `"${value.replace(/(["^&|<>()%])/g, "^$1")}"`;
}

async function describeNewSkills(skillRoot, source, before, after) {
  const names = [...after].filter((name) => !before.has(name)).sort();
  return names.map((name) => ({ name, path: path.join(skillRoot, name, "SKILL.md"), source }));
}

async function listSkillDirs(skillRoot) {
  await fs.mkdir(skillRoot, { recursive: true });
  const entries = await fs.readdir(skillRoot, { withFileTypes: true });
  return new Set(entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name));
}

async function ensureRealDirectory(dir) {
  await fs.mkdir(dir, { recursive: true });
  return await fs.realpath(dir);
}

function parseGithubSkillUrl(urlValue) {
  let url;
  try {
    url = new URL(urlValue);
  } catch {
    throw new Error("GitHub skill URL must be a valid URL.");
  }
  if (url.hostname !== "github.com") throw new Error("Only github.com skill URLs are supported.");
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length < 2) throw new Error("GitHub skill URL must include owner and repo.");
  const repo = `${parts[0]}/${parts[1]}`;
  let ref = DEFAULT_REF;
  let skillPath = parts.slice(2).join("/");
  if (parts[2] === "tree" || parts[2] === "blob") {
    if (parts.length < 5) throw new Error("GitHub skill URL must include a ref and path.");
    ref = parts[3];
    skillPath = parts.slice(4).join("/");
  }
  validateGithubRepo(repo);
  validateRelativePath(skillPath);
  return { repo, ref, path: skillPath };
}

function selectProviders(providers, source) {
  if (source === "all") return providers;
  return providers.filter((provider) => provider.id === source);
}

function normalizeSearchTerms(query) {
  return String(query || "").toLowerCase().split(/\s+/).map((term) => term.trim()).filter(Boolean);
}

function matchesTerms(value, terms) {
  if (!terms.length) return true;
  const lower = String(value || "").toLowerCase();
  return terms.every((term) => lower.includes(term));
}

function isGithubDirItem(item) {
  return item?.type === "dir" && typeof item.name === "string";
}

function optionalString(value) {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function requireProviderRepo(provider) {
  if (!provider.repo) throw new Error(`Provider ${provider.id} is missing repo configuration.`);
  return provider.repo;
}

function requireInstallName(value) {
  const trimmed = value?.trim();
  if (!trimmed) throw new Error("skill_find install identifier is required.");
  return trimmed;
}

function validateGithubRepo(repo) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo)) throw new Error("GitHub repo must use owner/repo format.");
}

function validateRelativePath(inputPath) {
  const normalized = path.normalize(inputPath);
  if (!inputPath || path.isAbsolute(inputPath) || normalized.startsWith("..")) {
    throw new Error("Skill path must be relative and stay inside the repository.");
  }
}

function validateSkillDirectoryName(name) {
  if (!name || name === "." || name === ".." || name.includes("/") || name.includes("\\") || path.isAbsolute(name)) {
    throw new Error("Skill name must be a single path segment.");
  }
}

function ensureInside(candidatePath, rootPath) {
  const relative = path.relative(rootPath, path.resolve(candidatePath));
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Skill install path escapes the global skills root.");
  }
}

async function pathExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

async function fetchGithubJson(url) {
  const headers = {
    "User-Agent": "xuanzhen-skill-find",
    Accept: "application/vnd.github+json"
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(`GitHub request failed: HTTP ${response.status}`);
  return await response.json();
}

function buildProcessEnvironment() {
  return { ...process.env };
}

function sanitizeProcessOutput(value) {
  return String(value || "").replace(/\u001b\[[0-9;]*m/g, "");
}

function formatProcessFailure(executable, result) {
  const combined = [result.stdout, result.stderr].map((part) => String(part || "").trim()).filter(Boolean).join("\n");
  return combined || `${executable} failed with exit code ${result.exitCode}`;
}

function formatError(error) {
  return error instanceof Error ? error.message : String(error);
}

function isSkillFindProviderId(source) {
  return source === "openai-curated" || source === "skills-sh" || source === "skillhub";
}

function dedupeCandidates(results) {
  const seen = new Set();
  return results.filter((candidate) => {
    const key = `${candidate.source}:${candidate.package ?? candidate.slug ?? candidate.url ?? candidate.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
