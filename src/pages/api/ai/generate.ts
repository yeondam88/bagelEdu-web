import type { APIRoute } from 'astro';
import { openai } from '../../../lib/ai/openai';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get request body
    const body = await request.json();
    const { prompt, type = 'blog' } = body;

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get OpenAI API key
    const apiKey = import.meta.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key is not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Generate content based on type
    let systemPrompt = '';
    let content = '';
    let summary = '';

    switch (type) {
      case 'blog':
        systemPrompt = `You are an expert educational content writer. 
        Create a well-structured, engaging blog post that's optimized for SEO. 
        Include appropriate HTML formatting with headings (h2, h3), paragraphs, lists, and emphasis where needed.
        The content should be informative and valuable to readers interested in education.`;
        
        const blogCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        });
        
        content = blogCompletion.choices[0]?.message?.content || '';
        
        // Generate a summary
        const summaryCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Create a concise 1-2 sentence summary of the following blog post that would work well as a meta description:" },
            { role: "user", content: content }
          ],
          temperature: 0.5,
          max_tokens: 100,
        });
        
        summary = summaryCompletion.choices[0]?.message?.content || '';
        break;
        
      case 'faq':
        systemPrompt = `You are an expert at creating clear, concise FAQ answers.
        Provide a straightforward, helpful answer to the question.
        Keep your response friendly but direct, focused on precisely answering the question.`;
        
        const faqCompletion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        });
        
        content = faqCompletion.choices[0]?.message?.content || '';
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid content type' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Return generated content
    return new Response(
      JSON.stringify({ content, summary }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error generating content:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate content' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 