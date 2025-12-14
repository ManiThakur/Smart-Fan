'use client';

import { useState } from 'react';

interface Device {
  id: string;
  name: string;
  type?: string;
  status?: {
    power?: boolean;
    speed?: number;
    mode?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface FanCardProps {
  device: Device;
  onControl: (deviceId: string, command: any) => void;
  loading: boolean;
}

export default function FanCard({ device, onControl, loading }: FanCardProps) {
  const [speed, setSpeed] = useState(device.status?.speed || 0);
  const [power, setPower] = useState(device.status?.power || false);
  const [mode, setMode] = useState(device.status?.mode || 'normal');

  const handlePowerToggle = () => {
    const newPower = !power;
    setPower(newPower);
    onControl(device.id, { power: newPower });
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    onControl(device.id, { speed: newSpeed });
  };

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    onControl(device.id, { mode: newMode });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
          {device.name || `Fan ${device.id}`}
        </h3>
        <div className={`w-3 h-3 rounded-full ${power ? 'bg-green-500' : 'bg-gray-400'}`}></div>
      </div>

      <div className="space-y-4">
        {/* Power Toggle */}
        <div>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Power
            </span>
            <button
              onClick={handlePowerToggle}
              disabled={loading}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                power ? 'bg-indigo-600' : 'bg-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  power ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        {/* Speed Control */}
        {power && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speed: {speed}
              </label>
              <input
                type="range"
                min="0"
                max="6"
                value={speed}
                onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
                disabled={loading || !power}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>0</span>
                <span>6</span>
              </div>
            </div>

            {/* Mode Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['normal', 'sleep', 'turbo'].map((m) => (
                  <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    disabled={loading || !power}
                    className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                      mode === m
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    } ${loading || !power ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {!power && (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
            Turn on the fan to adjust settings
          </p>
        )}
      </div>
    </div>
  );
}
