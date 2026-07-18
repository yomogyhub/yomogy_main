import fs from "fs";
import path from "path";
import { Metadata } from "../src/utils/mdx-link-card";

function findJsonFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) return [];

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findJsonFiles(entryPath);
    return entry.name.endsWith(".json") ? [entryPath] : [];
  });
}

function main() {
  const outputDataDirectory = path.join(process.cwd(), "out", "_next", "data");
  const cachePath = path.join(process.cwd(), "posts", "link-card-metadata.json");
  const cache: Record<string, Metadata> = fs.existsSync(cachePath)
    ? JSON.parse(fs.readFileSync(cachePath, "utf8"))
    : {};
  let recovered = 0;

  for (const filePath of findJsonFiles(outputDataDirectory)) {
    const page = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const metadata = page.pageProps?.ogpMetadata as Record<string, Metadata> | undefined;
    if (!metadata) continue;

    for (const [url, value] of Object.entries(metadata)) {
      if (!cache[url] && value?.title) {
        cache[url] = value;
        recovered++;
      }
    }
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2) + "\n");
  console.log(`Recovered ${recovered} LinkCard metadata entries from static output.`);
}

main();
