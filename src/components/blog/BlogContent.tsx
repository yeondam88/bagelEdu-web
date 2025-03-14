import React, { useState } from 'react';
import MDXRenderer from '../mdx/MDXRenderer';

interface BlogContentProps {
  content: string;
  contentType?: 'html' | 'mdx';
  className?: string;
}

const BlogContent: React.FC<BlogContentProps> = ({ 
  content, 
  contentType = 'mdx',
  className = '' 
}) => {
  const [error, setError] = useState<string | null>(null);

  // Determine if content might be MDX by checking for common MDX features
  const detectMDX = (content: string): boolean => {
    // Look for JSX-like syntax, imports, or exports
    return (
      /import\s+.*\s+from\s+/.test(content) || 
      /export\s+/.test(content) || 
      /<[A-Z][A-Za-z0-9]*/.test(content) ||
      contentType === 'mdx'
    );
  };

  const isMDX = detectMDX(content);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <h3 className="text-lg font-medium">Error rendering content</h3>
        <p>{error}</p>
      </div>
    );
  }

  // If it's detected as MDX, use the MDX renderer
  if (isMDX) {
    try {
      return (
        <div className={`mdx-content ${className}`}>
          <MDXRenderer content={content} />
        </div>
      );
    } catch (err) {
      // If MDX rendering fails, fall back to HTML
      console.error("MDX rendering failed, falling back to HTML:", err);
      return (
        <div 
          className={`html-content ${className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
  }

  // Otherwise, render as HTML
  return (
    <div 
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default BlogContent; 