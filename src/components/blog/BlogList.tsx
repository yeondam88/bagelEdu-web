import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import type { BlogPostWithAuthor } from '../../services/BlogService';
import { BlogService } from '../../services/BlogService';

interface BlogListProps {
  initialPosts?: BlogPostWithAuthor[];
  category?: string;
  tag?: string;
  limit?: number;
  showPagination?: boolean;
  preferredLanguage?: string;
}

const BlogList: React.FC<BlogListProps> = ({
  initialPosts,
  category,
  tag,
  limit = 10,
  showPagination = true,
  preferredLanguage = 'en'
}) => {
  const [posts, setPosts] = useState<BlogPostWithAuthor[]>(initialPosts || []);
  const [loading, setLoading] = useState(!initialPosts);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build the URL with query parameters
      const url = new URL('/api/blog/get', window.location.origin);
      url.searchParams.append('page', page.toString());
      url.searchParams.append('limit', limit.toString());
      url.searchParams.append('status', 'published');
      
      if (category) {
        url.searchParams.append('category', category);
      }
      
      if (tag) {
        url.searchParams.append('tag', tag);
      }

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch blog posts');
      }

      setPosts(result.data);
      setTotalPages(result.pagination.totalPages);
      setHasNextPage(result.pagination.hasNextPage);
      setHasPrevPage(result.pagination.hasPrevPage);
      console.log('result.data', result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!initialPosts) {
      fetchPosts();
    }
  }, [page, category, tag, limit]);

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setPage(page - 1);
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

  if (loading) {
    return (
      <div className="blog-list-loading">
        <div className="spinner"></div>
        <p>Loading blog posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-list-error">
        <p>Error: {error}</p>
        <button onClick={fetchPosts}>Try Again</button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="blog-list-empty">
        <p>No blog posts found.</p>
      </div>
    );
  }

  console.log('posts', posts)

  console.log('hello post page')

  return (
    <div className="blog-list">
      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.id} className="blog-card">
            {post.featured_image && (
              <div className="blog-card-image">
                <a href={`/blog/${post.slug}`}>
                  <img 
                    src={post.featured_image} 
                    alt={getLocalizedContent(post.title.en.en, 'Blog post')} 
                  />
                </a>
              </div>
            )}
            <div className="blog-card-content">
              <h2 className="blog-card-title">
                <a href={`/blog/${post.slug}`}>
                  {getLocalizedContent(post.title, 'Untitled Post')}
                </a>
              </h2>
              
              <div className="blog-card-meta">
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
              
              {post.excerpt && (
                <div className="blog-card-excerpt">
                  <p>{getLocalizedContent(post.excerpt, '')}</p>
                </div>
              )}
              
              {post.tags && post.tags.length > 0 && (
                <div className="blog-card-tags">
                  {post.tags.map((tag: string) => (
                    <a key={tag} href={`/blog/tag/${tag}`} className="tag">
                      {tag}
                    </a>
                  ))}
                </div>
              )}
              
              <a href={`/blog/${post.slug}`} className="blog-card-read-more">
                Read More
              </a>
            </div>
          </article>
        ))}
      </div>
      
      {showPagination && totalPages > 1 && (
        <div className="blog-pagination">
          <button 
            onClick={handlePrevPage} 
            disabled={!hasPrevPage}
            className="pagination-prev"
          >
            Previous
          </button>
          
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          
          <button 
            onClick={handleNextPage} 
            disabled={!hasNextPage}
            className="pagination-next"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList; 