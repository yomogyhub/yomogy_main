import { FrameTemplate } from "../../components/frame-template";
import Sidebar from "../../components/sidebar";
import { getBasicContent } from "../api/get-posts-category";
import { PostLists } from "../../utils/posts-type";

export async function getStaticProps() {
  const basicContent = await getBasicContent();
  const { newPosts, recommendPosts } = basicContent.props;

  return {
    props: { newPosts, recommendPosts },
  };
}

export default function Privacy({
  newPosts,
  recommendPosts,
}: {
  newPosts: PostLists;
  recommendPosts: PostLists;
}) {
  return (
    <FrameTemplate
      leftComponent={
        <div className="blog_main bg-white dark:bg-gray-900 p-4 lg:p-8 max-w-6xl mx-auto w-full max-w-full">
          <>
            {/* 以下の部分のみ動的に変更すると静的ページテンプレとして使用できる */}
            <div className="text-gray-700 dark:text-gray-300">
              <h1 className="mb-4">プライバシーポリシー</h1>

              <h2 className="mt-4">個人情報の利用目的</h2>
              <p className="mt-2">
                当ブログでは、メールでのお問い合わせやコメントの際に、お名前（ハンドルネーム）・メールアドレス等の個人情報をご登録いただく場合があります。
                これらの個人情報は、質問に対する回答や必要な情報をご連絡するために利用し、それ以外の目的では利用しません。
              </p>

              <h2 className="mt-4">個人情報の第三者への開示</h2>
              <p className="mt-2">
                個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。
                <br />
                ・本人のご了解がある場合
                <br />
                ・法令等への協力のため、開示が必要となる場合
              </p>

              <h2 className="mt-4">
                個人情報の開示・訂正・追加・削除・利用停止
              </h2>
              <p className="mt-2">
                個人情報の開示・訂正・追加・削除・利用停止をご希望の場合には、ご本人であることを確認したうえで、速やかに対応致します。
              </p>

              <h2 className="mt-4">Cookieについて</h2>
              <p className="mt-2">
                当ブログでは、一部のコンテンツにおいてCookieを利用しています。
                Cookieとは、webコンテンツへのアクセスに関する情報であり、お名前・メールアドレス・住所・電話番号は含まれません。
                また、お使いのブラウザ設定からCookieを無効にすることが可能です。
              </p>

              <h2 className="mt-4">著作権について</h2>
              <p className="mt-2">
                当ブログで掲載しているコンテンツは、Cc-by 4.0 (Attribution 4.0
                International)
                に基づくライセンスで提供されています。これに従い、適切な表示を行い、リンクを提供することで、任意の目的のためにコンテンツを複製、再配布、リミックス、変更、および新しいコンテンツをビルドできます。
                さらなる詳細や条件については、
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  公式のCc-by 4.0 ライセンスページ
                </a>
                をご参照ください。
              </p>

              <h2 className="mt-4">免責事項</h2>
              <p className="mt-2">
                当ブログからリンクやバナーなどによって他のサイトに移動した場合、移動先サイトで提供される情報、サービス等について一切の責任を負いません。
                当ブログのコンテンツについて、可能な限り正確な情報を掲載するよう努めていますが、誤情報が入り込んだり、情報が古くなっている場合があります。当ブログに掲載された内容によって生じた損害等の一切の責任を負いかねますのでご了承ください。
              </p>

              <h2 className="mt-4">プライバシーポリシーの変更について</h2>
              <p className="mt-2 mb-8">
                当ブログは、個人情報に関して適用される日本の法令を遵守するとともに、本ポリシーの内容を適宜見直しその改善に努めます。
                <br />
                <br />
                最終更新日 : 2023 / 9 / 1
              </p>
            </div>

            {/* ここまで */}
          </>
        </div>
      }
      rightComponent={
        <>
          <Sidebar title={newPosts.title} relatedPosts={newPosts.posts} />
          <Sidebar
            title={recommendPosts.title}
            relatedPosts={recommendPosts.posts}
          />
        </>
      }
    />
  );
}
