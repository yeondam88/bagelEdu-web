import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';

export const POST: APIRoute = async ({ request, redirect }) => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { status: 500 }
    );
  }
  
  return redirect('/admin');
}; 