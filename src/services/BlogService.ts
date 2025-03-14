/**
 * Blog Service
 * 
 * Service for handling blog operations with Supabase.
 * Provides methods for creating, reading, updating, and deleting blog posts.
 */

import type { SupabaseClient } from '@supabase/supabase-js';

// Blog post interface
export interface BlogPost {
  id?: string;
  slug: string;
  title: string | Record<string, string>; // Plain text or multilingual
  content: string;
  excerpt?: string | Record<string, string>; // Plain text or multilingual
  featured_image?: string;
  author_id?: string;
  category?: string;
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
  published_at?: Date | string;
  created_at?: Date | string;
  updated_at?: Date | string;
}

export interface BlogPostWithAuthor extends BlogPost {
  author?: {
    id: string;
    email: string;
    name?: string;
  };
}

export class BlogService {
  private supabase: SupabaseClient;

  constructor(supabaseClient: SupabaseClient) {
    this.supabase = supabaseClient;
  }

  /**
   * Get all blog posts with optional filtering
   */
  async getAllBlogPosts(options: {
    status?: 'draft' | 'published' | 'archived' | 'all';
    page?: number;
    pageSize?: number;
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
  } = {}): Promise<{ data: BlogPostWithAuthor[]; count: number; error: any }> {
    try {
      const {
        status = 'published',
        page = 1,
        pageSize = 10,
        orderBy = 'published_at',
        orderDirection = 'desc',
      } = options;

      let query = this.supabase
        .from('blog_posts')
        .select(`
          *,
          author:author_id (
            id,
            email,
            raw_user_meta_data
          )
        `, { count: 'exact' });

      // Apply status filter if not 'all'
      if (status !== 'all') {
        query = query.eq('status', status);
      }

      // Apply pagination
      const start = (page - 1) * pageSize;
      query = query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(start, start + pageSize - 1);

      const { data, count, error } = await query;

      if (error) {
        throw error;
      }

      // Transform author data if needed
      const transformedData = data?.map((post) => {
        const authorData = post.author as any;
        return {
          ...post,
          author: authorData ? {
            id: authorData.id,
            email: authorData.email,
            name: authorData.raw_user_meta_data?.name,
          } : undefined,
        };
      }) || [];

      return { data: transformedData, count: count || 0, error: null };
    } catch (error) {
      console.error('Error getting blog posts:', error);
      return { data: [], count: 0, error };
    }
  }

  /**
   * Get a blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<{ data: BlogPostWithAuthor | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select(`
          *,
          author:author_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return { data: null, error: null };
      }

      // Transform author data
      const authorData = data.author as any;
      const transformedData = {
        ...data,
        author: authorData ? {
          id: authorData.id,
          email: authorData.email,
          name: authorData.raw_user_meta_data?.name,
        } : undefined,
      };

      return { data: transformedData, error: null };
    } catch (error) {
      console.error(`Error getting blog post by slug (${slug}):`, error);
      return { data: null, error };
    }
  }

  /**
   * Get a blog post by ID
   */
  async getBlogPostById(id: string): Promise<{ data: BlogPostWithAuthor | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .select(`
          *,
          author:author_id (
            id,
            email,
            raw_user_meta_data
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return { data: null, error: null };
      }

      // Transform author data
      const authorData = data.author as any;
      const transformedData = {
        ...data,
        author: authorData ? {
          id: authorData.id,
          email: authorData.email,
          name: authorData.raw_user_meta_data?.name,
        } : undefined,
      };

      return { data: transformedData, error: null };
    } catch (error) {
      console.error(`Error getting blog post by ID (${id}):`, error);
      return { data: null, error };
    }
  }

  /**
   * Create a new blog post
   */
  async createBlogPost(post: BlogPost): Promise<{ data: BlogPost | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .insert([post])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error creating blog post:', error);
      return { data: null, error };
    }
  }

  /**
   * Update an existing blog post
   */
  async updateBlogPost(id: string, post: Partial<BlogPost>): Promise<{ data: BlogPost | null; error: any }> {
    try {
      const { data, error } = await this.supabase
        .from('blog_posts')
        .update(post)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error(`Error updating blog post (${id}):`, error);
      return { data: null, error };
    }
  }

  /**
   * Delete a blog post
   */
  async deleteBlogPost(id: string): Promise<{ success: boolean; error: any }> {
    try {
      const { error } = await this.supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true, error: null };
    } catch (error) {
      console.error(`Error deleting blog post (${id}):`, error);
      return { success: false, error };
    }
  }

  /**
   * Get total counts of blog posts by status
   */
  async getBlogPostCounts(): Promise<{ 
    published: number; 
    draft: number; 
    archived: number; 
    total: number;
    error: any; 
  }> {
    try {
      const counts = {
        published: 0,
        draft: 0,
        archived: 0,
        total: 0,
        error: null,
      };

      // Get count of published posts
      const { count: publishedCount, error: publishedError } = await this.supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      if (publishedError) throw publishedError;
      counts.published = publishedCount || 0;

      // Get count of draft posts
      const { count: draftCount, error: draftError } = await this.supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'draft');

      if (draftError) throw draftError;
      counts.draft = draftCount || 0;

      // Get count of archived posts
      const { count: archivedCount, error: archivedError } = await this.supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'archived');

      if (archivedError) throw archivedError;
      counts.archived = archivedCount || 0;

      // Calculate total
      counts.total = counts.published + counts.draft + counts.archived;

      return counts;
    } catch (error) {
      console.error('Error getting blog post counts:', error);
      return {
        published: 0,
        draft: 0,
        archived: 0,
        total: 0,
        error,
      };
    }
  }

  /**
   * Get multilingual field by preferred language
   * Safely handles both string and object formats
   */
  static getLocalizedField(field: string | Record<string, string> | undefined, language: string = 'en'): string {
    if (!field) return '';

    // If it's a string, return as is
    if (typeof field === 'string') return field;

    // If it's an object with the requested language
    if (field[language]) return field[language];

    // Fallback to English
    if (field.en) return field.en;

    // Fallback to the first available language
    const firstKey = Object.keys(field)[0];
    if (firstKey) return field[firstKey];

    // Final fallback
    return '';
  }
} 