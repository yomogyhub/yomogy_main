import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  Post,
  ListCount,
  Category,
  PostID,
  PostLists,
  SidebarPost,
  SidebarPostLists,
  AuthorData,
  AdjacentPosts,
} from "../utils/posts-type";

let postsCache: Record<string, Post> | null = null;
let listCountCache: ListCount | null = null;
let authorsCache: Record<string, AuthorData> | null = null;

function readPostsData(): Record<string, Post> {
  if (postsCache) return postsCache;

  const jsonPath = path.join(process.cwd(), "posts", "all-blog.json");
  const posts = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Record<string, Post>;
  postsCache = posts;
  return posts;
}

function readListCount(): ListCount {
  if (listCountCache) return listCountCache;

  const jsonPath = path.join(process.cwd(), "posts", "all-list-count.json");
  const listCount = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as ListCount;
  listCountCache = listCount;
  return listCount;
}

function readAuthorsData(): Record<string, AuthorData> {
  if (authorsCache) return authorsCache;

  const jsonPath = path.join(process.cwd(), "posts", "all-author.json");
  const authors = JSON.parse(fs.readFileSync(jsonPath, "utf8")) as Record<
    string,
    AuthorData
  >;
  authorsCache = authors;
  return authors;
}

// 全記事を取得
export async function getAllPosts(): Promise<Post[]> {
  // Object.values creates a new array, so callers can safely sort it.
  return Object.values(readPostsData());
}

// IDから記事を取得
export async function getJsonPost(id: string): Promise<Post> {
  return readPostsData()[id];
}

// リストカウント取得
export async function getJsonAllList() {
  return readListCount();
}

// Path用 - Post Path
export async function getPostsPaths() {
  const allPostsArray = await getAllPosts();
  const paths = allPostsArray.map((post) => ({
    params: {
      category: post.category,
      id: post.id,
    },
  }));

  return paths;
}

// Category Path
export async function getCategoriesPaths() {
  const allListCount = await getJsonAllList();
  const categories = Object.keys(allListCount.categories);

  const paths = categories.map((category) => ({
    params: { category },
  }));

  return paths;
}

export async function getCategoriesPagePaths() {
  const allListCount = await getJsonAllList();
  const allCategories = Object.keys(allListCount.categories);

  const paths = [];

  for (const category of allCategories) {
    const postCount = allListCount.categories[category];
    const pageCount = Math.ceil(postCount / 10);

    for (let i = 1; i <= pageCount; i++) {
      paths.push({
        params: {
          category: category,
          number: i.toString(),
        },
      });
    }
  }

  return paths;
}

// Tag Path
export async function getAllCategoryTagsPath() {
  const allPostsArray: Post[] = await getAllPosts();

  const categories = Array.from(
    new Set(allPostsArray.map((post) => post.category))
  );

  const paths = [];

  for (const category of categories) {
    const postsInCategory = allPostsArray.filter(
      (post) => post.category === category
    );

    const uniqueTags = Array.from(
      new Set(postsInCategory.flatMap((post) => post.tag))
    );

    for (const tag of uniqueTags) {
      const postsWithTag = postsInCategory.filter((post) =>
        post.tag.includes(tag)
      );

      const pageCount = Math.ceil(postsWithTag.length / 10);

      for (let i = 1; i <= pageCount; i++) {
        paths.push({
          params: {
            category: category,
            tag: tag,
            number: i.toString(),
          },
        });
      }
    }
  }

  return paths;
}

// Author Path
export async function getAllAuthorPath() {
  const allListCount = readListCount();

  const allAuthors = Object.keys(allListCount.authors);

  const paths = [];

  for (const author of allAuthors) {
    const postCount = allListCount.authors[author];
    const pageCount = Math.ceil(postCount / 10);

    for (let i = 1; i <= pageCount; i++) {
      paths.push({
        params: {
          name: author,
          number: i.toString(),
        },
      });
    }
  }

  return paths;
}

export async function getPostsByCategory(
  category: string,
  tag?: string
): Promise<Post[]> {
  const allPostsData = await getAllPosts();

  const filteredPosts = allPostsData.filter(
    (post) => post.category === category
  );

  if (tag) {
    return filteredPosts
      .filter((post) => post.tag.includes(tag))
      .sort(sortByPublishedDate);
  }

  return filteredPosts;
}

// Category, Tagから記事データを取得する
export async function getListData(
  category: string,
  tag?: string
): Promise<PostLists | { notFound: boolean }> {
  if (!category) return { notFound: true };
  const posts = await getPostsByCategory(category, tag);
  return { title: category, posts: posts.sort(sortByPublishedDate) };
}

// authorごとの記事リストを取得する
export async function getPostsByAuthor(
  author: string
): Promise<PostLists | { notFound: boolean }> {
  const allPostsArray: Post[] = await getAllPosts();

  const filteredPosts = allPostsArray.filter((post) => post.author === author);

  return { title: author, posts: filteredPosts.sort(sortByPublishedDate) };
}

// 新着記事を取得する
export async function getLatestPosts(limit = 5): Promise<Post[]> {
  const allPosts = await getAllPosts();
  return allPosts.sort(sortByPublishedDate).slice(0, limit);
}

// おすすめ記事を取得する
export async function getRecommendPosts(): Promise<Post[]> {
  const allPosts = await getAllPosts();
  const recommendId = [
    "post5",
    "igem-japan-history-2016-2020",
    "biosensor-overview",
    "cell-free-biosensor",
    "igem2022-now-next",
  ];

  const recommendedPosts = allPosts.filter((post) =>
    recommendId.includes(post.id)
  );

  return recommendedPosts;
}

function toSidebarPosts(posts: Post[]): SidebarPost[] {
  return posts.map(({ id, title, category, updatedAt }) => ({
    id,
    title,
    category,
    updatedAt,
  }));
}

/** Returns tag-related posts first, followed by posts in the same category. */
export async function getRelatedSidebarPosts(
  category: string,
  tags: string[],
  currentId: string,
  limit = 5
): Promise<SidebarPost[]> {
  const categoryPosts = (await getPostsByCategory(category))
    .filter((post) => post.id !== currentId)
    .sort(sortByPublishedDate);
  const matchingTags = categoryPosts.filter((post) =>
    post.tag.some((tag) => tags.includes(tag))
  );
  const remainingPosts = categoryPosts.filter(
    (post) => !matchingTags.some((matchingPost) => matchingPost.id === post.id)
  );

  return toSidebarPosts([...matchingTags, ...remainingPosts].slice(0, limit));
}

export async function getBasicContent(): Promise<{
  props: { newPosts: SidebarPostLists; recommendPosts: SidebarPostLists };
}> {
  const newPosts = await getLatestPosts();
  const recommendPosts = await getRecommendPosts();

  return {
    props: {
      newPosts: {
        title: "新着記事",
        posts: toSidebarPosts(newPosts),
      },
      recommendPosts: {
        title: "おすすめ記事",
        posts: toSidebarPosts(recommendPosts),
      },
    },
  };
}

// ファイル名からメタデータを取得する
export async function getData(params: Category & PostID) {
  if (!params.category || !params.id) return { notFound: true };
  const postInfo = await getJsonPost(params.id);

  if (!postInfo) {
    return { notFound: true };
  }

  return {
    category: postInfo.category,
    id: postInfo.id,
    content: '',
    data: postInfo,
    coverImage: postInfo.coverImage,
    path: postInfo.path,
  };
}

import { getPublicPath } from "../utils/getImagePath";

// 著者の詳細を取得する
export function getAuthorDetails(authorName: string): AuthorData {
  const authorDetails = readAuthorsData()[authorName];
  
  if (!authorDetails) return authorDetails;

  const defaultImage = `/authors/${authorName.toLowerCase()}.png`;
  return {
    ...authorDetails,
    image: authorDetails.image ? getPublicPath(authorDetails.image) : defaultImage,
  }
}

// 前後の記事を取得する
export async function getAdjacentPosts(
  currentId: string
): Promise<AdjacentPosts> {
  const postArray: Post[] = await getAllPosts();
  const sortedPosts = postArray.sort(sortByPublishedDate);
  const currentIndex = sortedPosts.findIndex((post) => post.id === currentId);

  return {
    beforeAdjacentPost:
      currentIndex < postArray.length - 1
        ? {
            id: postArray[currentIndex + 1].id,
            title: postArray[currentIndex + 1].title,
            category: postArray[currentIndex + 1].category,
          }
        : null,

    afterAdjacentPost:
      currentIndex > 0
        ? {
            id: postArray[currentIndex - 1].id,
            title: postArray[currentIndex - 1].title,
            category: postArray[currentIndex - 1].category,
          }
        : null,
  };
}

// 記事の並び替え 最新→古い
function sortByPublishedDate(a: any, b: any): number {
  const dateA = new Date(a.publishedAt || a.date || '1970-01-01').getTime();
  const dateB = new Date(b.publishedAt || b.date || '1970-01-01').getTime();
  return dateB - dateA;
}
