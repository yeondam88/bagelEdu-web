import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';
import type { BlogPost } from '../../../services/BlogService';

export const post: APIRoute = async ({ request }) => {
  try {
    // Check authentication
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Authentication error',
          error: sessionError.message
        }),
        { status: 401 }
      );
    }

    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Authentication required'
        }),
        { status: 401 }
      );
    }

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'User not found',
          error: userError?.message
        }),
        { status: 401 }
      );
    }

    // Parse the request body
    const blogData = await request.json();
    
    // Validate required fields
    if (!blogData.id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Blog post ID is required'
        }),
        { status: 400 }
      );
    }

    if (!blogData.title || !blogData.content) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Title and content are required'
        }),
        { status: 400 }
      );
    }

    // Check if the blog post exists and if user has permission
    const { data: existingPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, author_id, status')
      .eq('id', blogData.id)
      .maybeSingle();

    if (fetchError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error fetching blog post',
          error: fetchError.message
        }),
        { status: 500 }
      );
    }

    if (!existingPost) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Blog post not found'
        }),
        { status: 404 }
      );
    }

    // Check if user is the author or has admin role
    const isAdmin = user.user_metadata?.role === 'admin';
    const isAuthor = existingPost.author_id === user.id;

    if (!isAdmin && !isAuthor) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized to update this blog post'
        }),
        { status: 403 }
      );
    }

    // Format tags if it's a string
    const tags = typeof blogData.tags === 'string' 
      ? blogData.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
      : Array.isArray(blogData.tags) ? blogData.tags : [];

    // Prepare update data
    const updateData: Partial<BlogPost> = {
      title: blogData.title,
      content: blogData.content,
      excerpt: blogData.excerpt,
      featured_image: blogData.featured_image,
      category: blogData.category,
      tags,
      status: blogData.status,
      updated_at: new Date().toISOString(),
    };

    // If status changed to published, update published_at
    if (blogData.status === 'published' && existingPost.status !== 'published') {
      updateData.published_at = new Date().toISOString();
    }

    // Update the blog post
    const { data: updatedPost, error: updateError } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', blogData.id)
      .select()
      .single();

    if (updateError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error updating blog post',
          error: updateError.message
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog post updated successfully',
        data: updatedPost
      }),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to update blog post',
        error: errorMessage
      }),
      { status: 500 }
    );
  }
}; 