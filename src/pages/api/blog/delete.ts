import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';

// Handler function to avoid duplicating code
async function deletePostHandler(request: Request) {
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
    const { id } = await request.json();
    
    if (!id) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Blog post ID is required'
        }),
        { status: 400 }
      );
    }

    // Check if the blog post exists and if user has permission
    const { data: blogPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('id, author_id')
      .eq('id', id)
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

    if (!blogPost) {
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
    const isAuthor = blogPost.author_id === user.id;

    if (!isAdmin && !isAuthor) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Unauthorized to delete this blog post'
        }),
        { status: 403 }
      );
    }

    // Delete the blog post
    const { error: deleteError } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error deleting blog post',
          error: deleteError.message
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Blog post deleted successfully'
      }),
      { status: 200 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Failed to delete blog post',
        error: errorMessage
      }),
      { status: 500 }
    );
  }
}

// Support POST method
export const post: APIRoute = async ({ request }) => {
  return deletePostHandler(request);
};

// Support DELETE method
export const del: APIRoute = async ({ request }) => {
  return deletePostHandler(request);
}; 