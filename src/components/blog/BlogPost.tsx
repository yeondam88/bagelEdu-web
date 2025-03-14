import React, { useState, useEffect } from 'react';
import type { BlogPostWithAuthor } from '../../services/BlogService';
import { BlogService } from '../../services/BlogService';

interface BlogPostProps {
  post?: BlogPostWithAuthor;
  slug?: string;
  preferredLanguage?: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  post: initialPost,
  slug,
  preferredLanguage = 'en'
}) => {
  const [post, setPost] = useState<BlogPostWithAuthor | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost && !!slug);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialPost && slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build the URL with query parameters
      const url = new URL('/api/blog/get', window.location.origin);
      url.searchParams.append('slug', slug as string);

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch blog post');
      }

      setPost(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching blog post:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get localized content
  const getLocalizedContent = (field: any, fallback: string = '') => {
    return BlogService.getLocalizedField(field, preferredLanguage) || fallback;
  };

  // Format date for display
  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Simple function to create paragraphs from text
  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => (
      <p key={index}>{paragraph}</p>
    ));
  };

  if (loading) {
    return (
      <div className="blog-post-loading">
        <div className="spinner"></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-post-error">
        <p>Error: {error}</p>
        <button onClick={fetchPost}>Try Again</button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-post-not-found">
        <h2>Blog Post Not Found</h2>
        <p>The blog post you're looking for doesn't exist or has been removed.</p>
        <a href="/blog" className="back-to-blog">Back to Blog</a>
      </div>
    );
  }

  return (
    <article className="blog-post">
      {post.featured_image && (
        <div className="blog-post-featured-image">
          <img 
            src={post.featured_image} 
            alt={getLocalizedContent(post.title, 'Blog post')} 
          />
        </div>
      )}

      <header className="blog-post-header">
        <h1 className="blog-post-title">
          {getLocalizedContent(post.title, 'Untitled Post')}
        </h1>
        
        <div className="blog-post-meta">
          {post.author && (
            <span className="blog-author">
              By {post.author.email || 'Anonymous'}
            </span>
          )}
          
          {post.published_at && (
            <span className="blog-date">
              {formatDate(post.published_at as string)}
            </span>
          )}
          
          {post.category && (
            <span className="blog-category">
              <a href={`/blog/category/${post.category}`}>{post.category}</a>
            </span>
          )}
        </div>
      </header>

      {post.excerpt && (
        <div className="blog-post-excerpt">
          <p>{getLocalizedContent(post.excerpt, '')}</p>
        </div>
      )}

      <div className="blog-post-content">
        {formatContent(post.content)}
      </div>

      {post.tags && post.tags.length > 0 && (
        <div className="blog-post-tags">
          <h3>Tags:</h3>
          <div className="tags-list">
            {post.tags.map((tag: string) => (
              <a key={tag} href={`/blog/tag/${tag}`} className="tag">
                {tag}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="blog-post-navigation">
        <a href="/blog" className="back-to-blog">
          Back to Blog
        </a>
      </div>
    </article>
  );
};

export default BlogPost; 