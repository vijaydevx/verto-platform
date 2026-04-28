import { supabase } from './supabase';
import type { ItemInsert, ProfileRow } from '@/types';

export async function fetchItems({ 
  page = 1, 
  location, 
  type, 
  q, 
  category, 
  sort = 'latest',
  includeArchived = false 
}: any) {
  let query = supabase
    .from('items')
    .select('*, profiles(*)', { count: 'exact' });

  if (location && location !== 'all') {
    query = query.ilike('location', `%${location}%`);
  }

  if (type && type !== 'all') {
    query = query.eq('type', type);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`);
  }

  // Note: if category is not a column, we might need to filter by text or add it to the schema.
  // For now, let's assume it's a column or we'll add it.
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (!includeArchived) {
    query = query.eq('is_active', true);
  }

  const from = (page - 1) * 20;
  const to = from + 19;

  query = query.order('created_at', { ascending: sort === 'oldest' });

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;
  
  const total = count || 0;
  return {
    items: data || [],
    page,
    pageSize: 20,
    total,
    hasMore: to < total - 1
  };
}


export async function fetchItemById(id: string) {
  const { data, error } = await supabase
    .from('items')
    .select('*, profiles(*)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchMyItems({ userId, page = 1, location, type, includeArchived = true }: any) {
  let query = supabase
    .from('items')
    .select('*, profiles(*)', { count: 'exact' })
    .eq('user_id', userId);

  if (location && location !== 'all') {
    query = query.eq('location', location);
  }

  if (type && type !== 'all') {
    query = query.eq('type', type);
  }

  if (!includeArchived) {
    query = query.eq('is_active', true);
  }

  const from = (page - 1) * 20;
  const to = from + 19;

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  
  const total = count || 0;
  return {
    items: data || [],
    page,
    pageSize: 20,
    total,
    hasMore: to < total - 1
  };
}

export async function createItem(payload: ItemInsert) {
  const { data: newItem, error } = await supabase
    .from('items')
    .insert(payload)
    .select()
    .single();

  if (error) throw error;

  // --- Auto-Matching Logic ---
  try {
    const oppositeType = newItem.type === 'lost' ? 'found' : 'lost';
    
    // Simple match: Look for items with similar titles in the same campus
    const { data: matches } = await supabase
      .from('items')
      .select('*, profiles(*)')
      .eq('type', oppositeType)
      .eq('is_active', true)
      .ilike('title', `%${newItem.title.split(' ')[0]}%`) // Match first word of title
      .limit(3);

    if (matches && matches.length > 0) {
      // Notify the creator about potential matches
      for (const match of matches) {
        await fetch('/api/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: (payload as any).email, // Assuming we have access to user email here or fetch it
            subject: `Potential Match Found!`,
            body: `<p>We found an item that matches your report: <strong>${match.title}</strong></p><p>Check it out here: <a href="${window.location.origin}/item/${match.id}">View Item</a></p>`
          })
        });
      }
    }
  } catch (e) {
    console.error('Matching logic failed:', e);
  }

  return newItem;
}


export async function archiveItem(id: string) {
  const { data, error } = await supabase
    .from('items')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function restoreItem(id: string) {
  const { data, error } = await supabase
    .from('items')
    .update({ is_active: true })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, fullName: string) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as ProfileRow;
}

export async function claimItem(itemId: string, userId: string, message: string) {
  const { data: claim, error } = await supabase
    .from('claims')
    .insert({
      item_id: itemId,
      claimer_id: userId,
      message,
      status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger notification
  try {
    const { data: item } = await supabase.from('items').select('*, profiles(*)').eq('id', itemId).single();
    if (item && item.profiles) {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: item.profiles.campus_email,
          subject: `New claim on your item: ${item.title}`,
          body: `<p>Someone has claimed your item: <strong>${item.title}</strong></p><p>Message: "${message}"</p>`
        })
      });
    }
  } catch (e) {
    console.error('Notification failed:', e);
  }

  return claim;
}


export async function fetchComments(itemId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('item_id', itemId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createComment(itemId: string, userId: string, content: string) {
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      item_id: itemId,
      user_id: userId,
      content
    })
    .select('*, profiles(*)')
    .single();

  if (error) throw error;

  // Trigger notification
  try {
    const { data: item } = await supabase.from('items').select('*, profiles(*)').eq('id', itemId).single();
    if (item && item.profiles && item.user_id !== userId) {
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: item.profiles.campus_email,
          subject: `New comment on your post: ${item.title}`,
          body: `<p>${comment.profiles?.full_name || 'Someone'} commented on your post: <strong>${item.title}</strong></p><p>"${content}"</p>`
        })
      });
    }
  } catch (e) {
    console.error('Notification failed:', e);
  }

  return comment;
}





