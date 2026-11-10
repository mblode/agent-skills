//#region src/index.ts
function buildDigest(entries, weekOf) {
	const start = (/* @__PURE__ */ new Date(`${weekOf}T00:00:00Z`)).getTime();
	const end = start + 10080 * 60 * 1e3;
	return {
		weekOf,
		entries: entries.filter((entry) => {
			const at = (/* @__PURE__ */ new Date(`${entry.date}T00:00:00Z`)).getTime();
			return at >= start && at < end;
		}).sort((a, b) => a.date.localeCompare(b.date))
	};
}
function renderDigest(digest) {
	return [`Week of ${digest.weekOf}`, ...digest.entries.map((entry) => `- ${entry.date} ${entry.title}`)].join("\n");
}

//#endregion
export { buildDigest, renderDigest };
