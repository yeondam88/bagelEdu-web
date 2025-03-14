import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase/client';

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();
  const provider = formData.get('provider')?.toString();
  
  if (!provider) {
    return new Response(
      JSON.stringify({
        error: 'Missing provider'
      }),
      { status: 400 }
    );
  }
  
  // Create auth URL with PKCE
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as 'google',
    options: {
      redirectTo: `${new URL(request.url).origin}/api/auth/callback`,
    },
  });
  
  if (error) {
    return new Response(
      JSON.stringify({
        error: error.message
      }),
      { status: 500 }
    );
  }
  
  return redirect(data.url);
}; 