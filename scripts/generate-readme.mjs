import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";

import { renderReadme } from "../src/readme.js";

const ROOT = new URL("../", import.meta.url);
const DEFAULT_STATS_API_URL = "https://www.research-mbti.com/api/stats";
const TEMPLATE_PATH = new URL("../README.template.md", import.meta.url);
const README_PATH = new URL("../README.md", import.meta.url);
const PERSONAS_PATH = new URL("../data/personas.json", import.meta.url);
const SNAPSHOT_PATH = new URL("../data/stats-snapshot.json", import.meta.url);

function slugForCode(code) {
  const parts = [];
  let chunk = "";

  for (const character of code.toLowerCase()) {
    if ((character >= "a" && character <= "z") || (character >= "0" && character <= "9")) {
      chunk += character;
      continue;
    }

    if (chunk) {
      parts.push(chunk);
      chunk = "";
    }
  }

  if (chunk) {
    parts.push(chunk);
  }

  return parts.join("-");
}

function formatGeneratedAt(date) {
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute} UTC+8`;
}

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function writeJson(path, value) {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function buildGalleryPersonas(personasData) {
  const combined = [
    ...personasData.personas,
    personasData.special.quit,
    personasData.special.fallback,
  ];

  return combined.map((persona) => ({
    code: persona.code,
    name: persona.name,
    image: `./assets/posters/${slugForCode(persona.code)}.png`,
  }));
}

function validateStats(stats) {
  if (!stats || typeof stats !== "object") {
    throw new Error("Stats payload is missing.");
  }

  if (!Number.isFinite(stats.total)) {
    throw new Error("Stats payload is missing a numeric total.");
  }

  if (!Array.isArray(stats.all_types)) {
    throw new Error("Stats payload is missing all_types.");
  }
}

async function fetchLiveStats(apiUrl) {
  const response = await fetch(apiUrl, {
    headers: {
      accept: "application/json",
      "user-agent": "research-mbti-showcase-sync/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Stats request failed with ${response.status}.`);
  }

  const stats = await response.json();
  validateStats(stats);
  return stats;
}

async function loadStatsSnapshot(apiUrl) {
  try {
    const stats = await fetchLiveStats(apiUrl);
    const snapshot = {
      api_url: apiUrl,
      generated_at: formatGeneratedAt(new Date()),
      stats,
    };

    await writeJson(SNAPSHOT_PATH, snapshot);
    return snapshot;
  } catch (error) {
    if (!existsSync(SNAPSHOT_PATH)) {
      throw error;
    }

    console.warn(`Using cached stats snapshot after fetch failure: ${error.message}`);
    return readJson(SNAPSHOT_PATH);
  }
}

async function main() {
  const apiUrl = process.env.STATS_API_URL || DEFAULT_STATS_API_URL;
  const [template, personasData, snapshot] = await Promise.all([
    readFile(TEMPLATE_PATH, "utf8"),
    readJson(PERSONAS_PATH),
    loadStatsSnapshot(apiUrl),
  ]);

  const readme = renderReadme({
    template,
    stats: snapshot.stats,
    personas: buildGalleryPersonas(personasData),
    generatedAt: snapshot.generated_at,
    apiUrl: snapshot.api_url || apiUrl,
  });

  await writeFile(README_PATH, readme, "utf8");

  const relativeReadme = README_PATH.href.replace(ROOT.href, "");
  const relativeSnapshot = SNAPSHOT_PATH.href.replace(ROOT.href, "");
  console.log(`wrote ${relativeReadme}`);
  console.log(`updated ${relativeSnapshot}`);
}

await main();
