import OpenAI from 'openai';

// Create OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.OPENAI_API_KEY,
});

/**
 * Generate content using OpenAI
 */
export async function generateContent(
  prompt: string,
  options?: {
    model?: string | null;
    temperature?: number | null;
    maxTokens?: number | null;
  }
) {
  try {
    const response = await openai.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens || 500,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating content with OpenAI:', error);
    throw error;
  }
}

/**
 * Improve content quality and readability
 */
export async function improveContent(content: string) {
  const prompt = `Improve the following content without changing the meaning. Make it more engaging, clear, and professional: ${content}`;
  return generateContent(prompt);
}

/**
 * Generate SEO suggestions for content
 */
export async function generateSeoSuggestions(content: string, keywords?: string[] | null) {
  let prompt = `Analyze the following content and provide 5 SEO improvement suggestions: ${content}`;
  
  if (keywords && keywords.length > 0) {
    prompt += `\n\nConsider these target keywords: ${keywords.join(', ')}`;
  }
  
  return generateContent(prompt);
}

/**
 * Generate a summary of content
 */
export async function summarizeContent(
  content: string, 
  length: 'short' | 'medium' | 'long' | null | undefined = 'medium'
) {
  const lengthMap = {
    short: '1-2 sentences',
    medium: '3-4 sentences',
    long: 'a paragraph of 5-7 sentences',
  };
  
  // Default to medium if null or undefined
  const selectedLength = length || 'medium';
  
  const prompt = `Summarize the following content in ${lengthMap[selectedLength]}: ${content}`;
  return generateContent(prompt);
}

/**
 * Generate content ideas based on a topic
 */
export async function generateContentIdeas(topic: string, count: number | null | undefined = 5) {
  // Ensure count is a number
  const safeCount = count || 5;
  
  const prompt = `Generate ${safeCount} content ideas related to the following topic: ${topic}. For each idea, provide a title and a brief description.`;
  return generateContent(prompt);
}

/**
 * Translate content to another language
 */
export async function translateContent(content: string, targetLanguage: string) {
  const prompt = `Translate the following content to ${targetLanguage}: ${content}`;
  return generateContent(prompt);
} 