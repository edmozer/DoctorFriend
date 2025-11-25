import { supabase } from '../lib/supabase';
import { UserProfile, UserRole } from '../types';

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, fullName: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: data.role as UserRole,
  };
};

export const fetchAllProfiles = async (): Promise<UserProfile[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name');
  
    if (error) {
      console.error('Error fetching all profiles:', error);
      return [];
    }
  
    return data.map((p: any) => ({
      id: p.id,
      email: p.email,
      full_name: p.full_name,
      role: p.role as UserRole
    }));
  };