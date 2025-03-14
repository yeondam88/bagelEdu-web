/**
 * Blog post type definitions
 */

// Blog post status type
export type BlogPostStatus = 'draft' | 'published' | 'archived';

// Multilingual text type
export interface MultilangText {
  en: string;
  ko?: string;
  [key: string]: string | undefined;
}

// Basic blog post type
export interface BlogPost {
  id: string;
  title: string | MultilangText;
  slug: string;
  content: string;
  excerpt?: string | MultilangText;
  featured_image?: string;
  author_id?: string;
  author?: string;
  authorImage?: string;
  category?: string;
  tags?: string[];
  status: BlogPostStatus;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

// Blog post with author details
export interface BlogPostWithAuthor extends BlogPost {
  author_details?: {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
  };
}

// Blog post input for creating new posts
export interface BlogPostInput {
  title: string | MultilangText;
  slug?: string;
  content: string;
  excerpt?: string | MultilangText;
  featured_image?: string;
  author_id?: string;
  author?: string;
  authorImage?: string;
  category?: string;
  tags?: string[];
  status?: BlogPostStatus;
  published_at?: string | null;
}

// Blog post update input
export interface BlogPostUpdateInput extends Partial<BlogPostInput> {
  id: string;
}

// Blog filters for querying posts
export interface BlogFilters {
  category?: string;
  tag?: string;
  status?: BlogPostStatus;
  search?: string;
  authorId?: string;
  limit?: number;
  offset?: number;
} 