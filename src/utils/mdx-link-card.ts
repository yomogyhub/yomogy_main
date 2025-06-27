import { JSDOM, VirtualConsole } from "jsdom";

export interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

export async function fetchPageMetadata(url: string): Promise<Metadata> {
  // Skip external fetching during build to reduce bundle size
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
    return {
      url: url,
      title: url,
      description: null,
      image: null,
    };
  }

  try {
    const response = await fetch(url);

    // HTTPステータスコードが200以外の場合はエラーとして扱う
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
    }

    const html = await response.text();
    
    // Create virtual console to suppress CSS parsing errors
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("error", () => {
      // Suppress CSS parsing errors silently
    });
    
    const dom = new JSDOM(html, {
      virtualConsole,
      resources: "usable",
      runScripts: "outside-only"
    });
    const document = dom.window.document;

    const getTitle = () => {
      const title = document.querySelector("title");
      return title ? title.textContent : null;
    };

    const maxChars = 150; // 例として150文字とします。必要に応じて変更してください。

    const truncateIfLong = (str: string | null): string | null => {
      if (!str) return null;
      if (str.length <= maxChars) return str;
      return str.substring(0, maxChars) + "...";
    };

    const getMetaContent = (name: string) => {
      const meta = document.querySelector(
        `meta[name="${name}"], meta[property="${name}"]`
      );
      const content = meta ? meta.getAttribute("content") : null;
      return name === "og:description" ? truncateIfLong(content) : content;
    };

    return {
      url: url,
      title: getTitle(),
      description: getMetaContent("og:description"),
      image: getMetaContent("og:image"),
    };
  } catch (error) {
    return {
      url: url,
      title: `Not found : ${url}`,
      description: null,
      image: null,
    };
  }
}

/**
 * MDXの内容を処理し、指定されたパターンの文字列を変更します。
 * @param originalContent 元のMDXの内容
 * @return 変更されたMDXの内容
 */
export async function processMDXContent(
  originalContent: string
): Promise<string> {
  // Skip metadata fetching during build to reduce bundle size
  // Link cards will fetch metadata on the client side instead
  return originalContent;
}
