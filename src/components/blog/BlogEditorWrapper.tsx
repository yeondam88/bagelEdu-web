import React from 'react';
import { BlogEditor } from '../admin/BlogEditor';
import type { BlogPost } from '../../services/BlogService';

interface BlogEditorWrapperProps {
  blogPost?: BlogPost;
}

const BlogEditorWrapper: React.FC<BlogEditorWrapperProps> = ({ blogPost }) => {
  return <BlogEditor post={blogPost} />;
};

export default BlogEditorWrapper; 