'use client';

import FanCard from './FanCard';

interface Device {
  id: string;
  name: string;
  type?: string;
  status?: any;
  [key: string]: any;
}

interface FanListProps {
  devices: Device[];
  onControl: (deviceId: string, command: any) => void;
  loading: boolean;
}

export default function FanList({ devices, onControl, loading }: FanListProps) {
  if (devices.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">No fans available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {devices.map((device) => (
        <FanCard
          key={device.id}
          device={device}
          onControl={onControl}
          loading={loading}
        />
      ))}
    </div>
  );
}
