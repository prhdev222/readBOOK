'use client';

import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const checkEnvVariables = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/debug-env');
      const data = await response.json();
      setEnvVars(data.data);
    } catch (error) {
      console.error('Error fetching environment variables:', error);
      setEnvVars({ error: 'Failed to fetch environment variables' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkEnvVariables();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Debug Environment Variables</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Environment Variables Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Google OAuth</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">GOOGLE_CLIENT_ID: {envVars.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Not Set'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">GOOGLE_CLIENT_SECRET: {envVars.GOOGLE_CLIENT_SECRET ? '✅ Set' : '❌ Not Set'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Line Login</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">LINE_CHANNEL_ID: {envVars.LINE_CHANNEL_ID ? '✅ Set' : '❌ Not Set'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">LINE_CHANNEL_SECRET: {envVars.LINE_CHANNEL_SECRET ? '✅ Set' : '❌ Not Set'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">LINE_CHANNEL_ACCESS_TOKEN: {envVars.LINE_CHANNEL_ACCESS_TOKEN ? '✅ Set' : '❌ Not Set'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">NextAuth</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">NEXTAUTH_URL: {envVars.NEXTAUTH_URL ? '✅ Set' : '❌ Not Set'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">NEXTAUTH_SECRET: {envVars.NEXTAUTH_SECRET ? '✅ Set' : '❌ Not Set'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Supabase</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_URL: {envVars.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Not Set'}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full mr-2 bg-green-500"></span>
                  <span className="text-sm">NEXT_PUBLIC_SUPABASE_ANON_KEY: {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not Set'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Raw Environment Variables</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(envVars, null, 2)}
          </pre>
        </div>

        <div className="mt-8">
          <button
            onClick={checkEnvVariables}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'กำลังโหลด...' : 'รีเฟรช'}
          </button>
        </div>
      </div>
    </div>
  );
}
