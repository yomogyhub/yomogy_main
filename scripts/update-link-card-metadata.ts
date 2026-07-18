import fs from "fs";
import path from "path";
import {
  extractLinkCardUrls,
  refreshOGPMetadata,
} from "../src/utils/mdx-link-card";

function findMdxFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findMdxFiles(entryPath);
    return entry.name.endsWith(".mdx") ? [entryPath] : [];
  });
}

async function main() {
  const postsDirectory = path.join(process.cwd(), "posts", "blog");
  const urls = new Set<string>();

  for (const filePath of findMdxFiles(postsDirectory)) {
    const content = fs.readFileSync(filePath, "utf8");
    extractLinkCardUrls(content).forEach((url) => urls.add(url));
  }

  await refreshOGPMetadata(Array.from(urls));
  console.log(`Updated LinkCard metadata for ${urls.size} unique URLs.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
