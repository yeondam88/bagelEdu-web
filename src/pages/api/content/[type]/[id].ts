import type { APIRoute } from 'astro';
import { getItemById, updateItem, deleteItem } from '../../../../lib/supabase/client';

// GET endpoint to fetch a specific content item
export const GET: APIRoute = async ({ params }) => {
  try {
    // Get content type and ID from URL
    const { type, id } = params;
    
    if (!type || !id) {
      return new Response(JSON.stringify({ error: 'Content type and ID are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Fetch data from Supabase
    const data = await getItemById(type, id);
    
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

// PUT endpoint to update a specific content item
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    // Get content type and ID from URL
    const { type, id } = params;
    
    if (!type || !id) {
      return new Response(JSON.stringify({ error: 'Content type and ID are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Get request body
    const body = await request.json();
    
    // Update item in Supabase
    const updatedItem = await updateItem(type, id, body);
    
    return new Response(JSON.stringify({ data: updatedItem }), {
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

// DELETE endpoint to delete a specific content item
export const DELETE: APIRoute = async ({ params }) => {
  try {
    // Get content type and ID from URL
    const { type, id } = params;
    
    if (!type || !id) {
      return new Response(JSON.stringify({ error: 'Content type and ID are required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Delete item from Supabase
    await deleteItem(type, id);
    
    return new Response(JSON.stringify({ success: true }), {
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