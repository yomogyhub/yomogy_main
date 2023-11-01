import fs from "fs";
import matter from "gray-matter";
import { PrePost } from "./posts-type"; // 適切なパスを指定してください

function validateMDX(filePath: string): void {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    // Using gray-matter to parse front matter
    const frontMatter = matter(fileContent).data as PrePost;

    // Extracting ID from the file name
    const id = filePath.split("/").pop()?.split(".mdx")[0];
    if (!id || !/^[a-zA-Z0-9\-]+$/.test(id)) {
      throw new Error(
        "Invalid ID: ID must only contain alphabets, numbers, and hyphens (no spaces or underscores)."
      );
    }

    // Check if all required fields are present
    const requiredFields = [
      "title",
      "category",
      "publishedAt",
      "updatedAt",
      "author",
      "description",
      "tag",
      "rePost",
      "status",
    ];

    for (const field of requiredFields) {
      if (
        frontMatter[field as keyof PrePost] === undefined ||
        frontMatter[field as keyof PrePost] === null
      ) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    console.log(`File ${filePath} is valid`);
  } catch (error) {
    console.error(
      `Validation failed for file ${filePath}:`,
      (error as Error).message
    );
    process.exit(1);
  }
}

const filePath = process.argv[2];
validateMDX(filePath);
