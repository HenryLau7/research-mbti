import test from "node:test";
import assert from "node:assert/strict";

import {
  renderPersonaGallery,
  renderReadme,
  renderStatsSection,
} from "../src/readme.js";

const sampleStats = {
  total: 11,
  top_types: [
    { code: "DRUG", name: "瘾君子", count: 4, percent: 36.4 },
    { code: "CHILL", name: "佛系选手", count: 3, percent: 27.3 },
    { code: "QUIT", name: "回家吧孩子", count: 3, percent: 27.3 },
    { code: "TDDL", name: "拖延者", count: 1, percent: 9.1 },
  ],
  all_types: [
    { code: "DRUG", name: "瘾君子", count: 4, percent: 36.4 },
    { code: "CHILL", name: "佛系选手", count: 3, percent: 27.3 },
    { code: "QUIT", name: "回家吧孩子", count: 3, percent: 27.3 },
    { code: "TDDL", name: "拖延者", count: 1, percent: 9.1 },
    { code: "NERD", name: "小呆呆", count: 0, percent: 0 },
  ],
};

const samplePersonas = [
  { code: "DRUG", name: "瘾君子", image: "./assets/posters/drug.png" },
  { code: "CHILL", name: "佛系选手", image: "./assets/posters/chill.png" },
  { code: "QUIT", name: "回家吧孩子", image: "./assets/posters/quit.png" },
];

test("renderStatsSection includes live totals, leaders, and the ranked table", () => {
  const output = renderStatsSection({
    stats: sampleStats,
    generatedAt: "2026-04-11 23:30 UTC+8",
    apiUrl: "https://www.research-mbti.com/api/stats",
  });

  assert.match(output, /Total quiz results:\s+\*\*11\*\*/);
  assert.match(output, /Top type right now:\s+\*\*DRUG 瘾君子\*\* \(36\.4%\)/);
  assert.match(output, /\| 1 \| DRUG 瘾君子 \| 4 \| 36\.4% \| `#{7}\.{13}` \|/);
  assert.match(output, /Data source: \[`\/api\/stats`\]\(https:\/\/www\.research-mbti\.com\/api\/stats\)/);
});

test("renderPersonaGallery lays out personas in a GitHub-friendly HTML table", () => {
  const output = renderPersonaGallery(samplePersonas, 2);

  assert.match(output, /<table>/);
  assert.match(output, /<img src="\.\/assets\/posters\/drug\.png" alt="DRUG 瘾君子"/);
  assert.match(output, /<strong>QUIT<\/strong><br \/>回家吧孩子/);
  assert.match(output, /<td align="center" width="50%">/);
});

test("renderReadme injects generated stats and gallery sections into the template", () => {
  const template = [
    "# Demo",
    "",
    "{{STATS_SECTION}}",
    "",
    "{{PERSONA_GALLERY}}",
  ].join("\n");

  const output = renderReadme({
    template,
    stats: sampleStats,
    personas: samplePersonas,
    generatedAt: "2026-04-11 23:30 UTC+8",
    apiUrl: "https://www.research-mbti.com/api/stats",
  });

  assert.doesNotMatch(output, /\{\{STATS_SECTION\}\}/);
  assert.doesNotMatch(output, /\{\{PERSONA_GALLERY\}\}/);
  assert.match(output, /## Live Quiz Snapshot/);
  assert.match(output, /## Full Persona Gallery/);
});
