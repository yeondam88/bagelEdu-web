import React, { useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';

interface MDXRendererProps {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
}

const MDXRenderer = ({ content, components = {} }: MDXRendererProps) => {
  const [mdxModule, setMdxModule] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderMDX = async () => {
      try {
        // Evaluate the MDX content
        const mdxModule = await evaluate(content, {
          ...runtime,
          development: false,
          baseUrl: import.meta.url
        });
        setMdxModule(mdxModule);
      } catch (err) {
        console.error("Error rendering MDX:", err);
        setError(err instanceof Error ? err.message : "Failed to render MDX content");
      }
    };

    if (content) {
      renderMDX();
    }
  }, [content]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md my-4">
        <h3 className="text-lg font-semibold">Error rendering content</h3>
        <p>{error}</p>
        <pre className="mt-2 p-2 bg-red-100 rounded overflow-auto max-h-[300px] text-sm">
          {content.slice(0, 500)}
          {content.length > 500 ? '...' : ''}
        </pre>
      </div>
    );
  }

  if (!mdxModule) {
    return <div>Loading content...</div>;
  }

  const MDXContent = mdxModule.default;
  return <MDXContent components={components} />;
};

export default MDXRenderer; 