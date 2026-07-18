import { ParsedUrlQuery } from "querystring";
import { MDXRemoteSerializeResult } from "next-mdx-remote";

export interface Category extends ParsedUrlQuery {
  category: string;
}

export interface PostID extends ParsedUrlQuery {
  id: string;
}

export interface Tag extends ParsedUrlQuery {
  tag: string;
}

export interface PrePost {
  path: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  author: string;
  description: string;
  tag: string[];
  rePost: string;
  status: string;
}

export interface Post extends PrePost {
  id: string;
  coverImage: string;
  content?: string; // Add content field
}

export interface PostLists {
  title: string;
  posts: Post[];
}

/** Sidebar renders only these fields, so static props must not include full post metadata. */
export interface SidebarPost {
  id: string;
  title: string;
  category: string;
  updatedAt: string;
}

export interface SidebarPostLists {
  title: string;
  posts: SidebarPost[];
}

/** Fields rendered by an article page. Internal generation fields are excluded. */
export interface ArticlePost {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  category: string;
  author: string;
  tag: string[];
  rePost: string | false;
  coverImage: string;
}

export interface ListCount {
  categories: Record<string, number>;
  authors: Record<string, number>;
  categoryTags: Record<string, Record<string, number>>;
}

// Define the type for props
export interface PageNationProps {
  posts: Post[];
  title: string;
  page: number;
  totalPages: number;
}

export interface SidebarProps {
  title: string;
  relatedPosts: SidebarPost[];
}

export interface AdjacentPosts {
  beforeAdjacentPost: { id: string; title: string; category: string } | null;
  afterAdjacentPost: { id: string; title: string; category: string } | null;
}

export interface Metadata {
  url: string;
  title: string | null;
  description: string | null;
  image: string | null;
}

export interface BlogPostProps {
  id: string;
  content: MDXRemoteSerializeResult;
  data: ArticlePost;
  relatedPosts: SidebarPost[];
  author: AuthorData;
  adjacentPosts: AdjacentPosts;
  path: string;
  ogpMetadata: Record<string, Metadata>;
}

export interface BlogPostOnlyProps {
  content: MDXRemoteSerializeResult;
  data: ArticlePost;
  author: AuthorData;
  id: string;
  adjacentPosts: AdjacentPosts;
  path: string;
  ogpMetadata: Record<string, Metadata>;
}

export interface AuthorData {
  name: string;
  description: string;
  twitter: string;
  image: string;
}
