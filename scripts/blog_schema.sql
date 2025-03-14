-- Create blog_posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title JSONB NOT NULL, -- For multilingual support
    content TEXT NOT NULL,
    excerpt JSONB, -- For multilingual support
    featured_image TEXT,
    author_id UUID REFERENCES auth.users(id),
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create RLS policies for blog_posts

-- Everyone can read published posts
CREATE POLICY "Anyone can read published blog posts"
ON public.blog_posts
FOR SELECT
USING (status = 'published');

-- Only authenticated users can manage blog posts
CREATE POLICY "Authenticated users can insert blog posts"
ON public.blog_posts
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only the author or admin can update or delete
CREATE POLICY "Only author or admin can update blog posts"
ON public.blog_posts
FOR UPDATE
TO authenticated
USING (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
)
WITH CHECK (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
);

CREATE POLICY "Only author or admin can delete blog posts"
ON public.blog_posts
FOR DELETE
TO authenticated
USING (
    author_id = auth.uid() OR 
    EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
);

-- Create index for faster querying
CREATE INDEX blog_posts_slug_idx ON public.blog_posts (slug);
CREATE INDEX blog_posts_status_idx ON public.blog_posts (status);
CREATE INDEX blog_posts_author_id_idx ON public.blog_posts (author_id);
CREATE INDEX blog_posts_published_at_idx ON public.blog_posts (published_at);

-- Enable Row Level Security
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_blog_posts_modtime
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();

-- Add extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 