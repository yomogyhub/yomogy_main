import React from "react";

// IframeCardコンポーネントが受け取るpropsの型を定義
interface IframeCardProps {
  /** * 表示するiframeのURL。
   * 通常のURL形式とMarkdownリンク形式("[text](url)")の両方に対応。
   */
  src: string;
  /** iframeのタイトル (アクセシビリティ向上のために重要) */
  title: string;
}

/**
 * 任意のURLソースからiframeを安全に埋め込むための汎用コンポーネント。
 * レスポンシブに対応しており、親要素の幅に合わせて16:9のアスペクト比を保ちます。
 * Markdown形式のリンク文字列が渡された場合も、自動でURLを抽出して表示します。
 */
const IframeCard: React.FC<IframeCardProps> = ({ src, title }) => {
  // --- ▼ここからが修正箇所▼ ---

  /**
   * 渡されたsrc文字列を整形する関数。
   * Markdownリンク形式 "[text](url)" の場合、中のURL部分を抽出する。
   * それ以外の場合は、そのままの文字列を返す。
   * @param inputSrc - コンポーネントに渡されたsrcプロパティ
   * @returns 整形された正規のURL
   */
  const getProperUrl = (inputSrc: string): string => {
    if (!inputSrc) {
      return ""; // srcが空の場合は空文字を返す
    }
    // 正規表現を使って、Markdownリンクの "()" の中身を検索
    const markdownUrlMatch = inputSrc.match(/\(([^)]+)\)/);

    // マッチした場合（Markdown形式だった場合）、括弧の中のURLを返す
    if (markdownUrlMatch && markdownUrlMatch[1]) {
      return markdownUrlMatch[1];
    }

    // マッチしなかった場合（通常のURLだった場合）、元の文字列をそのまま返す
    return inputSrc;
  };

  // 整形済みのURLをiframeのsrcとして使用する
  const finalSrc = getProperUrl(src);

  // --- ▲ここまでが修正箇所▲ ---

  return (
    <>
      {/* SNSCardの構造を参考に、中央配置と最大幅を指定 */}
      <div className="flex justify-center max-w-full my-4">
        {/* レスポンシブなiframeのためのラッパー要素 */}
        <div className="iframe-container">
          <iframe
            src={finalSrc} // 整形後のURLを使用
            title={title}
            frameBorder="0"
            allow="fullscreen; picture-in-picture"
            sandbox="allow-same-origin allow-scripts allow-popups"
          />
        </div>
      </div>

      {/* コンポーネントにスコープされたCSSでスタイリング */}
      <style jsx>{`
        .iframe-container {
          position: relative;
          overflow: hidden;
          width: 100%;
          /* 16:9のアスペクト比を維持するための設定 (9 / 16 = 0.5625) */
          padding-top: 56.25%;
        }

        .iframe-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>
    </>
  );
};

export default IframeCard;
