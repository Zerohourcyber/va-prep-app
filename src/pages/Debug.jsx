import React, { useEffect, useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { Link } from 'react-router-dom';

const Debug = () => {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cleared, setCleared] = useState(false);
  const [logs, setLogs] = useState([]);

  const log = (msg) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setLoading(true);
    setLogs([]);
    log('Starting auth check...');
    
    // Add timeout
    const timeout = setTimeout(() => {
      log('⚠️ Auth check timed out after 5 seconds');
      setLoading(false);
      setError('Auth check timed out - Supabase may be unreachable');
    }, 5000);

    try {
      log('Calling supabase.auth.getSession()...');
      const { data: { session: s }, error: sessionError } = await supabase.auth.getSession();
      clearTimeout(timeout);
      
      if (sessionError) {
        log(`Session error: ${sessionError.message}`);
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      log(`Session result: ${s ? `User ${s.user.email}` : 'No session'}`);
      setSession(s);
      
      if (s?.user) {
        log('Fetching profile...');
        const { data: p, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', s.user.id)
          .single();
        
        if (profileError) {
          log(`Profile error: ${profileError.message}`);
          setError(profileError.message);
        } else {
          log(`Profile: ${p.email} - ${p.subscription_status}`);
          setProfile(p);
        }
      }
    } catch (e) {
      clearTimeout(timeout);
      log(`Exception: ${e.message}`);
      setError(e.message);
    }
    setLoading(false);
  };

  const clearAllData = async () => {
    log('Clearing all data...');
    // Sign out first
    try {
      await supabase.auth.signOut();
      log('Signed out of Supabase');
    } catch (e) {
      log(`Sign out error: ${e.message}`);
    }
    // Clear ALL localStorage
    localStorage.clear();
    // Clear session storage too
    sessionStorage.clear();
    log('Cleared localStorage and sessionStorage');
    setCleared(true);
    setSession(null);
    setProfile(null);
  };

  const forceSignOut = () => {
    // Just clear storage without calling Supabase
    localStorage.clear();
    sessionStorage.clear();
    setCleared(true);
    setSession(null);
    setProfile(null);
    log('Force cleared all storage (no API call)');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">🔧 Debug Panel</h1>
      
      <div className="space-y-4 mb-8">
        <div className="p-4 bg-slate-800 rounded-lg">
          <h2 className="font-bold text-amber-400 mb-2">Supabase Config</h2>
          <p>Configured: {isConfigured ? '✅ Yes' : '❌ No'}</p>
          <p>URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}</p>
          <p>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ NOT SET'}</p>
        </div>

        <div className="p-4 bg-slate-800 rounded-lg">
          <h2 className="font-bold text-emerald-400 mb-2">Auth Status</h2>
          {loading ? (
            <p className="text-yellow-400">⏳ Checking... (timeout in 5s)</p>
          ) : session ? (
            <div>
              <p>✅ Logged in as: {session.user.email}</p>
              <p>User ID: {session.user.id}</p>
            </div>
          ) : (
            <p>❌ Not logged in</p>
          )}
        </div>

        <div className="p-4 bg-slate-800 rounded-lg">
          <h2 className="font-bold text-purple-400 mb-2">Profile</h2>
          {loading ? (
            <p className="text-yellow-400">⏳ Loading...</p>
          ) : profile ? (
            <div>
              <p>Email: {profile.email}</p>
              <p>Status: <span className={profile.subscription_status === 'premium' ? 'text-amber-400 font-bold' : 'text-slate-400'}>{profile.subscription_status?.toUpperCase()}</span></p>
              <p>Created: {profile.created_at}</p>
            </div>
          ) : (
            <p>No profile found</p>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <h2 className="font-bold text-red-400 mb-2">Error</h2>
            <p>{error}</p>
          </div>
        )}

        {/* Logs */}
        <div className="p-4 bg-slate-800 rounded-lg">
          <h2 className="font-bold text-cyan-400 mb-2">Debug Logs</h2>
          <div className="text-xs font-mono space-y-1 max-h-40 overflow-auto">
            {logs.length === 0 ? (
              <p className="text-slate-500">No logs yet</p>
            ) : (
              logs.map((log, i) => <div key={i} className="text-slate-300">{log}</div>)
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={clearAllData}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg font-bold"
        >
          🗑️ Clear All Data & Sign Out
        </button>

        <button
          onClick={forceSignOut}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg font-bold"
        >
          ⚡ Force Clear (No API)
        </button>
        
        <button
          onClick={checkAuth}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold"
        >
          🔄 Refresh Status
        </button>

        <Link
          to="/login"
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg font-bold"
        >
          → Go to Login
        </Link>

        <Link
          to="/dashboard"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-bold"
        >
          → Try Dashboard
        </Link>
      </div>

      {cleared && (
        <div className="mt-4 p-4 bg-emerald-900/50 border border-emerald-500 rounded-lg">
          ✅ All data cleared! <Link to="/login" className="underline text-amber-400">Click here to login fresh</Link>
        </div>
      )}

      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h2 className="font-bold text-slate-400 mb-2">LocalStorage Keys</h2>
        <pre className="text-xs overflow-auto">
          {Object.keys(localStorage).length === 0 ? (
            <span className="text-slate-500">Empty</span>
          ) : (
            Object.keys(localStorage).map(key => (
              <div key={key}>{key}</div>
            ))
          )}
        </pre>
      </div>
    </div>
  );
};

export default Debug;
