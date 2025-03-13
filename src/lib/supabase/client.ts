import { createClient } from '@supabase/supabase-js';

// Environment variables will need to be set in .env file
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(
  supabaseUrl as string,
  supabaseAnonKey as string
);

// Helper functions for content operations

/**
 * Fetch all items from a collection with optional filters
 */
export async function getItems<T>(
  table: string,
  options?: {
    filter?: Record<string, any>;
    orderBy?: { column: string; ascending?: boolean };
    limit?: number;
    page?: number;
  }
) {
  let query = supabase.from(table).select('*');

  // Apply filters if provided
  if (options?.filter) {
    Object.entries(options.filter).forEach(([column, value]) => {
      if (value !== undefined && value !== null) {
        query = query.eq(column, value);
      }
    });
  }

  // Apply ordering if provided
  if (options?.orderBy) {
    query = query.order(options.orderBy.column, {
      ascending: options.orderBy.ascending ?? false,
    });
  }

  // Apply pagination if provided
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.page && options?.limit) {
    const offset = (options.page - 1) * options.limit;
    query = query.range(offset, offset + options.limit - 1);
  }

  const { data, error } = await query;

  if (error) {
    console.error(`Error fetching ${table}:`, error);
    throw error;
  }

  return data as T[];
}

/**
 * Fetch a single item by ID
 */
export async function getItemById<T>(table: string, id: string) {
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching ${table} with ID ${id}:`, error);
    throw error;
  }

  return data as T;
}

/**
 * Create a new item
 */
export async function createItem<T>(table: string, item: Record<string, any>) {
  const { data, error } = await supabase
    .from(table)
    .insert([item])
    .select();

  if (error) {
    console.error(`Error creating ${table}:`, error);
    throw error;
  }

  return data?.[0] as T;
}

/**
 * Update an existing item
 */
export async function updateItem<T>(
  table: string,
  id: string,
  updates: Record<string, any>
) {
  const { data, error } = await supabase
    .from(table)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating ${table} with ID ${id}:`, error);
    throw error;
  }

  return data?.[0] as T;
}

/**
 * Delete an item
 */
export async function deleteItem(table: string, id: string) {
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting ${table} with ID ${id}:`, error);
    throw error;
  }

  return true;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
} 