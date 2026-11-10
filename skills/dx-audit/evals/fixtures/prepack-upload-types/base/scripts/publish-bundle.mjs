import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const BUCKET = "https://assets.fathom-tokens.example/production/bundles";

const manifest = JSON.parse(await readFile("package.json", "utf8"));
const files = (await readdir("dist")).filter((name) => name.endsWith(".js"));

for (const name of files) {
  const body = await readFile(join("dist", name));
  const target = `${BUCKET}/${manifest.version}/${name}`;
  const response = await fetch(target, {
    method: "PUT",
    headers: {
      authorization: `Bearer ${process.env.FATHOM_DEPLOY_TOKEN ?? ""}`,
      "content-type": "text/javascript",
    },
    body,
  });
  if (!response.ok) {
    throw new Error(`upload of ${name} failed with ${response.status}`);
  }
  console.log(`uploaded ${target}`);
}

await fetch(`${BUCKET}/latest`, {
  method: "PUT",
  headers: { authorization: `Bearer ${process.env.FATHOM_DEPLOY_TOKEN ?? ""}` },
  body: manifest.version,
});
console.log(`latest now points at ${manifest.version}`);
