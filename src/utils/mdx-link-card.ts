interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

/**
 * External URLからOGPメタデータを取得します。
 * この関数は現在無効化されており、常に基本的なメタデータを返します。
 * @param url メタデータを取得するURL
 * @return メタデータ
 */
export async function fetchPageMetadata(url: string): Promise<Metadata> {
  // この関数は無効化されています
  // OGP取得は /api/fetch-metadata エンドポイントで行われます
  const hostname = new URL(url).hostname;
  
  return {
    url: url,
    title: hostname,
    description: "External link",
    image: null,
  };
}

/**
 * MDXの内容を処理し、LinkCardにOGPメタデータを追加します。
 * @param originalContent 元のMDXの内容
 * @return 変更されたMDXの内容
 */
export async function processMDXContent(
  originalContent: string
): Promise<string> {
  // Disable server-side processing to avoid MDX syntax issues
  // LinkCard components will handle OGP fetching client-side
  return originalContent;
}