'use client';

import { useState } from 'react';

interface AuthFormProps {
  onAuth: (apiKey: string, refreshToken: string) => void;
  loading: boolean;
}

export default function AuthForm({ onAuth, loading }: AuthFormProps) {
  const [apiKey, setApiKey] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey && refreshToken) {
      onAuth(apiKey, refreshToken);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Authentication
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="apiKey" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API Key"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Get this from Atomberg Home App → Developer Options
          </p>
        </div>
        
        <div>
          <label 
            htmlFor="refreshToken" 
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Refresh Token
          </label>
          <input
            type="text"
            id="refreshToken"
            value={refreshToken}
            onChange={(e) => setRefreshToken(e.target.value)}
            placeholder="Enter your Refresh Token"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Get this from Atomberg Home App → Developer Options
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !apiKey || !refreshToken}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Authenticating...' : 'Connect'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>How to get your credentials:</strong>
        </p>
        <ol className="mt-2 text-sm text-blue-700 dark:text-blue-300 list-decimal list-inside space-y-1">
          <li>Open the Atomberg Home App</li>
          <li>Go to Settings → Developer Options</li>
          <li>Enable Developer Mode</li>
          <li>Copy your API Key and Refresh Token</li>
        </ol>
      </div>
    </div>
  );
}
