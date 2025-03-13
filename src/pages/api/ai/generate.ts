import type { APIRoute } from 'astro';
import { 
  generateContent, 
  improveContent, 
  generateSeoSuggestions, 
  summarizeContent,
  generateContentIdeas,
  translateContent
} from '../../../lib/ai/openai';

type AIRequestBody = {
  action: string;
  content?: string;
  options?: {
    keywords?: string[];
    length?: 'short' | 'medium' | 'long';
    topic?: string;
    count?: number;
    targetLanguage?: string;
    prompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as AIRequestBody;
    const { action, content, options } = body;
    
    if (!action) {
      return new Response(JSON.stringify({ error: 'Action is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    let result: string;
    
    switch (action) {
      case 'improve':
        if (!content) {
          return new Response(JSON.stringify({ error: 'Content is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        result = await improveContent(content);
        break;
        
      case 'seo':
        if (!content) {
          return new Response(JSON.stringify({ error: 'Content is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        result = await generateSeoSuggestions(content, options?.keywords);
        break;
        
      case 'summarize':
        if (!content) {
          return new Response(JSON.stringify({ error: 'Content is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        result = await summarizeContent(content, options?.length as 'short' | 'medium' | 'long' | undefined);
        break;
        
      case 'ideas':
        if (!options?.topic) {
          return new Response(JSON.stringify({ error: 'Topic is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        result = await generateContentIdeas(options.topic, options?.count);
        break;
        
      case 'translate':
        if (!content || !options?.targetLanguage) {
          return new Response(JSON.stringify({ error: 'Content and target language are required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        result = await translateContent(content, options.targetLanguage);
        break;
        
      case 'custom':
        if (!options?.prompt) {
          return new Response(JSON.stringify({ error: 'Prompt is required' }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
        result = await generateContent(options.prompt, {
          model: options?.model,
          temperature: options?.temperature,
          maxTokens: options?.maxTokens
        });
        break;
        
      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
    }
    
    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error: any) {
    console.error('Error in AI API:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 