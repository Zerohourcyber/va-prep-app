import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const Diagnose = () => {
  const [results, setResults] = useState([]);
  const [running, setRunning] = useState(false);

  const log = (test, status, detail) => {
    setResults(prev => [...prev, { test, status, detail, time: new Date().toLocaleTimeString() }]);
  };

  const runDiagnostics = async () => {
    setResults([]);
    setRunning(true);

    // Test 1: Check env vars
    log('Environment Variables', SUPABASE_URL && SUPABASE_KEY ? '✅' : '❌', 
      `URL: ${SUPABASE_URL || 'NOT SET'}, Key: ${SUPABASE_KEY ? 'SET' : 'NOT SET'}`);

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      setRunning(false);
      return;
    }

    // Test 2: Basic fetch to Supabase health endpoint
    log('Testing connection...', '⏳', 'Fetching Supabase health endpoint');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const healthUrl = `${SUPABASE_URL}/rest/v1/`;
      const response = await fetch(healthUrl, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      
      log('REST API Connection', response.ok ? '✅' : '⚠️', 
        `Status: ${response.status} ${response.statusText}`);
    } catch (e) {
      log('REST API Connection', '❌', `Error: ${e.name} - ${e.message}`);
    }

    // Test 3: Auth endpoint
    log('Testing auth endpoint...', '⏳', 'Checking auth API');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const authUrl = `${SUPABASE_URL}/auth/v1/settings`;
      const response = await fetch(authUrl, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      
      const data = await response.json();
      log('Auth API', response.ok ? '✅' : '⚠️', 
        `Status: ${response.status}, External URL: ${data.external_url || 'N/A'}`);
    } catch (e) {
      log('Auth API', '❌', `Error: ${e.name} - ${e.message}`);
    }

    // Test 4: Try actual sign in
    log('Testing sign in API...', '⏳', 'Calling token endpoint');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const tokenUrl = `${SUPABASE_URL}/auth/v1/token?grant_type=password`;
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'testpassword'
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      
      const data = await response.json();
      // We expect 400 (invalid credentials) - that's actually good, means API is reachable
      log('Sign In API', response.status === 400 ? '✅' : (response.ok ? '✅' : '⚠️'), 
        `Status: ${response.status}, Message: ${data.error_description || data.msg || 'OK'}`);
    } catch (e) {
      log('Sign In API', '❌', `Error: ${e.name} - ${e.message}`);
    }

    // Test 5: Check profiles table
    log('Testing database...', '⏳', 'Querying profiles table');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const dbUrl = `${SUPABASE_URL}/rest/v1/profiles?select=count`;
      const response = await fetch(dbUrl, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer': 'count=exact'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);
      
      log('Database Query', response.ok ? '✅' : '⚠️', 
        `Status: ${response.status}, Content-Range: ${response.headers.get('content-range') || 'N/A'}`);
    } catch (e) {
      log('Database Query', '❌', `Error: ${e.name} - ${e.message}`);
    }

    // Test 6: WebSocket (realtime)
    log('Testing WebSocket...', '⏳', 'Connecting to realtime');
    try {
      const wsUrl = SUPABASE_URL.replace('https://', 'wss://') + '/realtime/v1/websocket?apikey=' + SUPABASE_KEY;
      const ws = new WebSocket(wsUrl);
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          ws.close();
          reject(new Error('WebSocket timeout'));
        }, 5000);
        
        ws.onopen = () => {
          clearTimeout(timeout);
          ws.close();
          resolve();
        };
        ws.onerror = (e) => {
          clearTimeout(timeout);
          reject(new Error('WebSocket error'));
        };
      });
      
      log('WebSocket', '✅', 'Connected successfully');
    } catch (e) {
      log('WebSocket', '⚠️', `${e.message} (not critical)`);
    }

    setRunning(false);
    log('Diagnostics Complete', '🏁', 'Check results above');
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-2xl font-bold mb-2">🔬 Supabase Connection Diagnostics</h1>
      <p className="text-slate-400 mb-6">Tests direct network connectivity to your Supabase project</p>
      
      <div className="flex gap-4 mb-8">
        <button
          onClick={runDiagnostics}
          disabled={running}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 rounded-lg font-bold"
        >
          {running ? '🔄 Running...' : '▶️ Run Diagnostics'}
        </button>
        
        <Link to="/login" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-bold">
          ← Back to Login
        </Link>
      </div>

      <div className="space-y-2">
        {results.map((r, i) => (
          <div key={i} className={`p-3 rounded-lg ${
            r.status === '✅' ? 'bg-emerald-900/30 border border-emerald-500/30' :
            r.status === '❌' ? 'bg-red-900/30 border border-red-500/30' :
            r.status === '⚠️' ? 'bg-yellow-900/30 border border-yellow-500/30' :
            'bg-slate-800/50 border border-slate-700/30'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{r.status}</span>
              <span className="font-semibold">{r.test}</span>
              <span className="text-xs text-slate-500">{r.time}</span>
            </div>
            <p className="text-sm text-slate-400 mt-1 ml-8">{r.detail}</p>
          </div>
        ))}
      </div>

      {results.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <p>Click "Run Diagnostics" to test your Supabase connection</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-slate-800 rounded-lg">
        <h2 className="font-bold text-slate-300 mb-2">Configuration</h2>
        <p className="text-sm font-mono text-slate-400">URL: {SUPABASE_URL || 'NOT SET'}</p>
        <p className="text-sm font-mono text-slate-400">Key: {SUPABASE_KEY ? SUPABASE_KEY.substring(0, 20) + '...' : 'NOT SET'}</p>
      </div>

      <div className="mt-4 p-4 bg-slate-800 rounded-lg">
        <h2 className="font-bold text-slate-300 mb-2">Common Issues</h2>
        <ul className="text-sm text-slate-400 space-y-1">
          <li>• <strong>AbortError</strong>: Request timed out - network/firewall blocking Supabase</li>
          <li>• <strong>TypeError: Failed to fetch</strong>: CORS or network issue</li>
          <li>• <strong>401/403 errors</strong>: API key issue or RLS blocking</li>
          <li>• <strong>VPN/Proxy</strong>: Try disabling VPN or using a different network</li>
          <li>• <strong>Browser extensions</strong>: Ad blockers can block API calls</li>
        </ul>
      </div>
    </div>
  );
};

export default Diagnose;

