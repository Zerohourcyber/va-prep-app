import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  directGetSession, 
  directGetUser, 
  directSignOut, 
  directFetchProfile,
  directLoadUserData,
  directSaveUserData
} from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        // Get session from localStorage
        const session = directGetSession();
        const sessionUser = session?.user;
        
        if (sessionUser) {
          console.log('User found:', sessionUser.email);
          setUser(sessionUser);
          
          // Fetch profile using direct fetch
          const profileData = await directFetchProfile(sessionUser.id);
          console.log('Profile loaded:', profileData);
          setProfile(profileData || { subscription_status: 'free' });
        } else {
          console.log('No session found');
        }
      } catch (e) {
        console.log('Auth init error:', e.message);
      }
      setLoading(false);
    };

    init();
  }, []);

  const signOut = async () => {
    await directSignOut();
    setUser(null);
    setProfile(null);
    return { error: null };
  };

  // Save user data to Supabase
  const saveUserData = async (data) => {
    if (!user) return { error: 'Not authenticated' };
    return directSaveUserData(user.id, data);
  };

  // Load user data from Supabase
  const loadUserData = async () => {
    if (!user) return { data: null, error: 'Not authenticated' };
    return directLoadUserData(user.id);
  };

  const isPremium = profile?.subscription_status === 'premium';
  console.log('isPremium:', isPremium, 'profile:', profile?.subscription_status);

  const value = {
    user,
    profile,
    loading,
    isPremium,
    signOut,
    saveUserData,
    loadUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
