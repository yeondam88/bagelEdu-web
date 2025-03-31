import React from 'react';
import { BlogEditor } from './admin/BlogEditor';

export default function ClientBlogEditor(props) {
  return <BlogEditor post={props.blogPost} />;
}
