import type { APIRoute } from 'astro';
import { getItems, createItem } from '../../../lib/supabase/client';

// GET endpoint to fetch content by type
export const GET: APIRoute = async ({ params, request }) => {
  try {
    // Get content type from URL
    const contentType = params.type;
    
    if (!contentType) {
      return new Response(JSON.stringify({ error: 'Content type is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Parse query parameters
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit') as string) : undefined;
    const page = url.searchParams.get('page') ? parseInt(url.searchParams.get('page') as string) : undefined;
    const orderBy = url.searchParams.get('orderBy') || undefined;
    const orderDirection = url.searchParams.get('orderDirection') || undefined;
    
    // Fetch data from Supabase
    const data = await getItems(contentType, {
      limit,
      page,
      orderBy: orderBy ? { 
        column: orderBy, 
        ascending: orderDirection === 'asc' 
      } : undefined
    });
    
    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error in content API:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// POST endpoint to create new content
export const POST: APIRoute = async ({ params, request }) => {
  try {
    // Get content type from URL
    const contentType = params.type;
    
    if (!contentType) {
      return new Response(JSON.stringify({ error: 'Content type is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Get request body
    const body = await request.json();
    
    // Create item in Supabase
    const newItem = await createItem(contentType, {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    
    return new Response(JSON.stringify({ data: newItem }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error in content API:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 