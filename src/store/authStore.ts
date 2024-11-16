import { create } from 'zustand';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase/client';

interface AuthState {
  user: User | null;
  session: any | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  error: null,
  signIn: async (email: string, password: string) => {
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      set({ user: data.user, session: data.session, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Authentication failed' });
      throw error;
    }
  },
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null, error: null });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Sign out failed' });
      throw error;
    }
  },
  initialize: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      set({ 
        user: session?.user ?? null,
        session,
        loading: false,
        error: null
      });
      
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ 
          user: session?.user ?? null,
          session,
          error: null
        });
      });
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to initialize auth'
      });
    }
  },
  clearError: () => set({ error: null })
}));