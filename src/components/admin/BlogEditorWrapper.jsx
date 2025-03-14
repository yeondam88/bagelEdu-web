import React from 'react';
// Use full path based on error message
import { BlogEditor } from '/Users/yeondampark/codes/bageledu/bagelEdu-web/src/components/admin/BlogEditor';

export default function BlogEditorWrapper(props) {
  return <BlogEditor post={props.blogPost} />;
} 