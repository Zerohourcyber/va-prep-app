import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using demo mode.');
}

// Create client with specific options
export const supabase = createClient(
  supabaseUrl || 'https://demo.supabase.co',
  supabaseAnonKey || 'demo-key',
  {
    auth: {
      persistSession: true,
      storageKey: `sb-${supabaseUrl?.split('//')[1]?.split('.')[0] || 'demo'}-auth-token`,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'implicit'
    }
  }
);

export const isConfigured = !!(supabaseUrl && supabaseAnonKey);

// Get storage key for this project
const getStorageKey = () => `sb-${supabaseUrl.split('//')[1].split('.')[0]}-auth-token`;

// Direct auth functions that bypass potential client issues
export const directSignIn = async (email, password) => {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    return { data: null, error: { message: data.error_description || data.msg || 'Sign in failed' } };
  }
  
  // Store the session in localStorage
  localStorage.setItem(getStorageKey(), JSON.stringify({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
    token_type: data.token_type,
    user: data.user
  }));
  
  return { data: { session: data, user: data.user }, error: null };
};

export const directSignUp = async (email, password) => {
  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password, data: {} })
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    return { data: null, error: { message: data.error_description || data.msg || 'Sign up failed' } };
  }
  
  return { data: { user: data }, error: null };
};

export const directSignOut = async () => {
  const session = directGetSession();
  
  if (session?.access_token) {
    try {
      await fetch(`${supabaseUrl}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session.access_token}`
        }
      });
    } catch (e) {
      console.log('Logout API error:', e);
    }
  }
  
  localStorage.removeItem(getStorageKey());
  return { error: null };
};

export const directGetSession = () => {
  const session = localStorage.getItem(getStorageKey());
  if (!session) return null;
  
  try {
    const parsed = JSON.parse(session);
    if (parsed.expires_at && parsed.expires_at < Math.floor(Date.now() / 1000)) {
      localStorage.removeItem(getStorageKey());
      return null;
    }
    return parsed;
  } catch (e) {
    return null;
  }
};

export const directGetUser = () => {
  const session = directGetSession();
  return session?.user || null;
};

// Direct database query for profile
export const directFetchProfile = async (userId) => {
  const session = directGetSession();
  if (!session?.access_token) return null;
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/profiles?id=eq.${userId}&select=*`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    );
    
    if (!response.ok) {
      console.log('Profile fetch failed:', response.status);
      return null;
    }
    
    const data = await response.json();
    return data[0] || null;
  } catch (e) {
    console.log('Profile fetch error:', e);
    return null;
  }
};

// Direct database query for user_data
export const directLoadUserData = async (userId) => {
  const session = directGetSession();
  if (!session?.access_token) return { data: null, error: 'Not authenticated' };
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/user_data?user_id=eq.${userId}&select=*`,
      {
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    );
    
    const data = await response.json();
    return { data: data[0] || null, error: null };
  } catch (e) {
    return { data: null, error: e.message };
  }
};

// Direct database upsert for user_data
export const directSaveUserData = async (userId, userData) => {
  const session = directGetSession();
  if (!session?.access_token) return { error: 'Not authenticated' };
  
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/user_data`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseAnonKey,
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          user_id: userId,
          ...userData,
          updated_at: new Date().toISOString()
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      return { error };
    }
    
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
};
