'use client';

import { useState, useEffect } from 'react';
import AuthForm from './components/AuthForm';
import FanList from './components/FanList';
import { getAccessToken, getDevices, controlDevice } from './lib/api';

export default function Home() {
  const [apiKey, setApiKey] = useState<string>('');
  const [refreshToken, setRefreshToken] = useState<string>('');
  const [accessToken, setAccessToken] = useState<string>('');
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Load saved credentials from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('atomberg_api_key');
    const savedRefreshToken = localStorage.getItem('atomberg_refresh_token');
    const savedAccessToken = localStorage.getItem('atomberg_access_token');
    
    if (savedApiKey && savedRefreshToken) {
      setApiKey(savedApiKey);
      setRefreshToken(savedRefreshToken);
      if (savedAccessToken) {
        setAccessToken(savedAccessToken);
        setIsAuthenticated(true);
        fetchDevices(savedAccessToken);
      }
    }
  }, []);

  const handleAuth = async (key: string, token: string) => {
    setLoading(true);
    setError('');
    
    try {
      const tokenData = await getAccessToken(key, token);
      const newAccessToken = tokenData.access_token;
      
      setApiKey(key);
      setRefreshToken(token);
      setAccessToken(newAccessToken);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('atomberg_api_key', key);
      localStorage.setItem('atomberg_refresh_token', token);
      localStorage.setItem('atomberg_access_token', newAccessToken);
      
      // Fetch devices
      await fetchDevices(newAccessToken);
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchDevices = async (token: string) => {
    setLoading(true);
    setError('');
    
    try {
      const deviceList = await getDevices(token);
      setDevices(deviceList);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch devices.');
      // If token expired, try to refresh
      if (err.status === 401 && refreshToken) {
        try {
          const tokenData = await getAccessToken(apiKey, refreshToken);
          const newAccessToken = tokenData.access_token;
          setAccessToken(newAccessToken);
          localStorage.setItem('atomberg_access_token', newAccessToken);
          const deviceList = await getDevices(newAccessToken);
          setDevices(deviceList);
        } catch (refreshErr: any) {
          setError('Session expired. Please re-authenticate.');
          setIsAuthenticated(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleControl = async (deviceId: string, command: any) => {
    setLoading(true);
    setError('');
    
    try {
      await controlDevice(accessToken, deviceId, command);
      // Refresh device list to get updated status
      await fetchDevices(accessToken);
    } catch (err: any) {
      setError(err.message || 'Failed to control device.');
      if (err.status === 401) {
        // Try to refresh token
        try {
          const tokenData = await getAccessToken(apiKey, refreshToken);
          const newAccessToken = tokenData.access_token;
          setAccessToken(newAccessToken);
          localStorage.setItem('atomberg_access_token', newAccessToken);
          await controlDevice(newAccessToken, deviceId, command);
          await fetchDevices(newAccessToken);
        } catch (refreshErr: any) {
          setError('Session expired. Please re-authenticate.');
          setIsAuthenticated(false);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('atomberg_api_key');
    localStorage.removeItem('atomberg_refresh_token');
    localStorage.removeItem('atomberg_access_token');
    setApiKey('');
    setRefreshToken('');
    setAccessToken('');
    setDevices([]);
    setIsAuthenticated(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Atomberg Smart Fan Controller
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Control your smart fans with ease
          </p>
        </header>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {!isAuthenticated ? (
          <AuthForm onAuth={handleAuth} loading={loading} />
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                Your Fans
              </h2>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
            {loading && devices.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading devices...</p>
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <p className="text-gray-600 dark:text-gray-400">No fans found. Please check your account.</p>
              </div>
            ) : (
              <FanList devices={devices} onControl={handleControl} loading={loading} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
