function formatPercent(value) {
  return Number(value).toFixed(1);
}

function renderBar(percent, width = 20) {
  if (percent <= 0) return ".".repeat(width);
  const filled = Math.max(1, Math.round((percent / 100) * width));
  return `${"#".repeat(filled)}${".".repeat(width - filled)}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderStatsSection({ stats, generatedAt, apiUrl }) {
  const ranked = stats.all_types ?? [];
  const topType = ranked[0];
  const nonZeroTypes = ranked.filter((entry) => entry.count > 0);
  const rarestType = nonZeroTypes.length ? nonZeroTypes[nonZeroTypes.length - 1] : null;

  const table = [
    "| # | Type | Count | Share | Bar |",
    "| --- | --- | ---: | ---: | --- |",
    ...ranked.map((entry, index) => [
      `| ${index + 1}`,
      `${entry.code} ${entry.name}`,
      `${entry.count}`,
      `${formatPercent(entry.percent)}%`,
      `\`${renderBar(entry.percent)}\` |`,
    ].join(" | ")),
  ].join("\n");

  return [
    "## Live Quiz Snapshot",
    "",
    `- Total quiz results: **${stats.total}**`,
    topType
      ? `- Top type right now: **${topType.code} ${topType.name}** (${formatPercent(topType.percent)}%)`
      : "- Top type right now: **N/A**",
    rarestType
      ? `- Rarest non-zero type right now: **${rarestType.code} ${rarestType.name}** (${formatPercent(rarestType.percent)}%)`
      : "- Rarest non-zero type right now: **N/A**",
    `- Data source: [\`/api/stats\`](${apiUrl})`,
    `- Last synced: **${generatedAt}**`,
    "",
    table,
  ].join("\n");
}

export function renderPersonaGallery(personas, columns = 3) {
  const cells = personas.map((persona) => [
    `<td align="center" width="${Math.floor(100 / columns)}%">`,
    `  <img src="${escapeHtml(persona.image)}" alt="${escapeHtml(`${persona.code} ${persona.name}`)}" width="100%" />`,
    `  <br /><strong>${escapeHtml(persona.code)}</strong><br />${escapeHtml(persona.name)}`,
    "</td>",
  ].join("\n"));

  const rows = [];
  for (let index = 0; index < cells.length; index += columns) {
    const rowCells = [...cells.slice(index, index + columns)];
    while (rowCells.length < columns) {
      rowCells.push(`<td width="${Math.floor(100 / columns)}%"></td>`);
    }
    rows.push(["<tr>", ...rowCells, "</tr>"].join("\n"));
  }

  return [
    "## Full Persona Gallery",
    "",
    "<table>",
    ...rows,
    "</table>",
  ].join("\n");
}

export function renderReadme({ template, stats, personas, generatedAt, apiUrl }) {
  return template
    .replace("{{STATS_SECTION}}", renderStatsSection({ stats, generatedAt, apiUrl }))
    .replace("{{PERSONA_GALLERY}}", renderPersonaGallery(personas));
}
