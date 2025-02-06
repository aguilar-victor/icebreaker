import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const getRoomSubscription = (roomId: string, callback: (payload: any) => void) => {
  return supabase
    .channel(`room:${roomId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'answers',
        filter: `room_id=eq.${roomId}`,
      },
      callback
    )
    .subscribe();
};

export const createRoom = async (hostId: string, password: string) => {
  // Generate a proper UUID for the host
  const { data: userData, error: userError } = await supabase.auth.signUp({
    email: `${hostId}@temp.com`,
    password: password
  });

  if (userError) throw userError;

  const { data, error } = await supabase
    .from('rooms')
    .insert([
      {
        host_id: userData.user?.id,
        password,
        status: 'waiting',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const joinRoom = async (roomId: string, password: string, guestId: string) => {
  // Generate a proper UUID for the guest
  const { data: userData, error: userError } = await supabase.auth.signUp({
    email: `${guestId}@temp.com`,
    password: password
  });

  if (userError) throw userError;

  const { data: room, error: verifyError } = await supabase
    .rpc('verify_room_password', { room_id: roomId, attempted_password: password });

  if (verifyError || !room) {
    throw new Error('Invalid room password');
  }

  const { error: updateError } = await supabase
    .from('rooms')
    .update({ guest_id: userData.user?.id, status: 'answering' })
    .eq('id', roomId);

  if (updateError) throw updateError;
};