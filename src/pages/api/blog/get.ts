import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';

export const get: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const params = url.searchParams;
    
    // Parse query parameters
    const page = parseInt(params.get('page') || '1');
    const limit = parseInt(params.get('limit') || '10');
    const status = params.get('status') || 'published'; // Default to published posts
    const category = params.get('category') || null;
    const tag = params.get('tag') || null;
    const authorId = params.get('authorId') || null;
    const sortBy = params.get('sortBy') || 'published_at';
    const sortOrder = params.get('sortOrder') || 'desc';
    const slug = params.get('slug') || null;
    
    // Calculate pagination
    const offset = (page - 1) * limit;
    
    // Start building the query
    let query = supabase
      .from('blog_posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `);
    
    // If slug is provided, return a single post
    if (slug) {
      const { data: post, error } = await query
        .eq('slug', slug)
        .eq('status', 'published') // Only published posts are publicly accessible by slug
        .single();
      
      if (error) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Blog post not found',
            error: error.message
          }),
          { status: 404 }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          data: post
        }),
        { status: 200 }
      );
    }
    
    // Check authentication for non-published posts
    if (status !== 'published') {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Authentication required to access non-published posts'
          }),
          { status: 401 }
        );
      }
      
      // Get user to check if admin
      const { data: { user } } = await supabase.auth.getUser();
      const isAdmin = user?.user_metadata?.role === 'admin';
      
      // If not admin, only show their own drafts/archived posts
      if (!isAdmin) {
        query = query.eq('author_id', user?.id);
      }
    }
    
    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    
    if (category) {
      query = query.eq('category', category);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    if (authorId) {
      query = query.eq('author_id', authorId);
    }
    
    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('blog_posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', status)
      .eq(category ? 'category' : 'id', category || 'id') // Conditional filter
      .contains(tag ? 'tags' : 'id', tag ? [tag] : 'id') // Conditional filter
      .eq(authorId ? 'author_id' : 'id', authorId || 'id'); // Conditional filter
    
    if (countError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error counting blog posts',
          error: countError.message
        }),
        { status: 500 }
      );
    }
    
    // Apply sorting and pagination
    const { data: posts, error: fetchError } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    if (fetchError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error fetching blog posts',
          error: fetchError.message
        }),
        { status: 500 }
      );
    }
    
    // Calculate pagination metadata
    const totalPages = Math.ceil((count || 0) / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
    
    return new Response(
      JSON.stringify({
        success: true,
        data: posts,
        pagination: {
          page,
          limit,
          totalItems: count,
          totalPages,
          hasNextPage,
          hasPrevPage
        }
      }),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to fetch blog posts',
        error: errorMessage
      }),
      { status: 500 }
    );
  }
}; 