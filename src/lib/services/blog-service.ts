import { supabase } from '../supabase/client';
import type { 
  BlogPost, 
  BlogPostInput, 
  BlogPostUpdateInput,
  BlogFilters
} from '../../types/blog';

/**
 * Blog service for Supabase
 * Handles all blog-related operations including multilingual content
 */
export class BlogService {
  /**
   * Get all blog posts with optional filtering
   */
  static async getAllPosts(filters?: BlogFilters): Promise<BlogPost[]> {
    let query = supabase
      .from('blog_posts')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters.tag) {
        query = query.contains('tags', [filters.tag]);
      }
      
      if (filters.authorId) {
        query = query.eq('author_id', filters.authorId);
      }
      
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
      }
      
      // Pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }
    }
    
    // Order by published_at or created_at (with null values last)
    query = query.order('published_at', { ascending: false })
                .order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
    
    return data as BlogPost[];
  }
  
  /**
   * Get a blog post by slug
   */
  static async getPostBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - post not found
        return null;
      }
      console.error('Error fetching blog post:', error);
      throw error;
    }
    
    return data as BlogPost;
  }
  
  /**
   * Get a blog post by ID
   */
  static async getPostById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - post not found
        return null;
      }
      console.error('Error fetching blog post:', error);
      throw error;
    }
    
    return data as BlogPost;
  }
  
  /**
   * Create a new blog post
   */
  static async createPost(post: BlogPostInput): Promise<BlogPost> {
    // Handle multilingual content if necessary
    const preparedPost = this.preparePostData(post);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(preparedPost)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
    
    return data as BlogPost;
  }
  
  /**
   * Update an existing blog post
   */
  static async updatePost(post: BlogPostUpdateInput): Promise<BlogPost> {
    const { id, ...postData } = post;
    
    // Handle multilingual content if necessary
    const preparedPost = this.preparePostData(postData);
    
    const { data, error } = await supabase
      .from('blog_posts')
      .update(preparedPost)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
    
    return data as BlogPost;
  }
  
  /**
   * Delete a blog post
   */
  static async deletePost(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  }
  
  /**
   * Get blog post categories
   */
  static async getCategories(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .not('category', 'is', null);
    
    if (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
    
    // Extract unique categories
    const categories = [...new Set(data.map(post => post.category))];
    return categories as string[];
  }
  
  /**
   * Get blog post tags
   */
  static async getTags(): Promise<string[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('tags');
    
    if (error) {
      console.error('Error fetching blog tags:', error);
      throw error;
    }
    
    // Extract unique tags from the arrays
    const tags = [...new Set(data.flatMap(post => post.tags || []))];
    return tags as string[];
  }
  
  /**
   * Helper method to prepare post data, handling any special cases like multilingual content
   */
  private static preparePostData(post: Partial<BlogPostInput>): Record<string, any> {
    const preparedPost: Record<string, any> = { ...post };
    
    // Handle multilingual title if it's an object
    if (typeof post.title === 'object' && post.title !== null) {
      preparedPost.title = JSON.stringify(post.title);
    }
    
    // Handle multilingual excerpt if it's an object
    if (typeof post.excerpt === 'object' && post.excerpt !== null) {
      preparedPost.excerpt = JSON.stringify(post.excerpt);
    }
    
    // Set published_at if status is published and published_at is not set
    if (post.status === 'published' && !post.published_at) {
      preparedPost.published_at = new Date().toISOString();
    }
    
    return preparedPost;
  }
  
  /**
   * Helper method to parse a post from the database, handling any special cases
   */
  static parsePost(post: BlogPost): BlogPost {
    const parsedPost = { ...post };
    
    // Parse multilingual title if it's a JSON string
    if (typeof post.title === 'string' && post.title.startsWith('{')) {
      try {
        parsedPost.title = JSON.parse(post.title);
      } catch (e) {
        // If parsing fails, keep the original title
      }
    }
    
    // Parse multilingual excerpt if it's a JSON string
    if (typeof post.excerpt === 'string' && post.excerpt?.startsWith('{')) {
      try {
        parsedPost.excerpt = JSON.parse(post.excerpt);
      } catch (e) {
        // If parsing fails, keep the original excerpt
      }
    }
    
    return parsedPost;
  }
} 