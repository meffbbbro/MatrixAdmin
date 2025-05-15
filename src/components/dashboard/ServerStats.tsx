import React, { useEffect } from 'react';
import { useMatrix } from '../../contexts/MatrixContext';
import { BarChart, Activity, Users, Home, Database, Server } from 'lucide-react';
import Card from '../ui/Card';

const ServerStats: React.FC = () => {
  const { fetchServerStats, serverStats, isLoading, error } = useMatrix();

  useEffect(() => {
    fetchServerStats();
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchServerStats();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchServerStats]);

  if (isLoading && !serverStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
        <h3 className="font-medium">Error loading server statistics</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!serverStats) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-yellow-700">
        <h3 className="font-medium">No server statistics available</h3>
        <p>Unable to retrieve server data at this time.</p>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    const units = ['KB', 'MB', 'GB', 'TB'];
    let size = bytes / 1024;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return size.toFixed(2) + ' ' + units[unitIndex];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">CPU Usage</h3>
            <p className="text-2xl font-semibold mt-1">{serverStats.cpu_average.toFixed(1)}%</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Activity className="h-6 w-6 text-blue-500" />
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${serverStats.cpu_average > 80 ? 'bg-red-500' : serverStats.cpu_average > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(serverStats.cpu_average, 100)}%` }}
          ></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Memory Usage</h3>
            <p className="text-2xl font-semibold mt-1">{serverStats.memory_usage.toFixed(1)}%</p>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg">
            <BarChart className="h-6 w-6 text-purple-500" />
          </div>
        </div>
        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full ${serverStats.memory_usage > 80 ? 'bg-red-500' : serverStats.memory_usage > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
            style={{ width: `${Math.min(serverStats.memory_usage, 100)}%` }}
          ></div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Users</h3>
            <p className="text-2xl font-semibold mt-1">{formatNumber(serverStats.total_users)}</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg">
            <Users className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <p className="mt-4 text-gray-600">
          <span className="text-green-500 font-medium">{formatNumber(serverStats.active_users_30days)}</span> active in last 30 days
        </p>
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Rooms</h3>
            <p className="text-2xl font-semibold mt-1">{formatNumber(serverStats.total_rooms)}</p>
          </div>
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Home className="h-6 w-6 text-indigo-500" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Database Size</h3>
            <p className="text-2xl font-semibold mt-1">{formatSize(serverStats.database_size)}</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Database className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-gray-500 text-sm font-medium">Connected Servers</h3>
            <p className="text-2xl font-semibold mt-1">{formatNumber(serverStats.connected_servers)}</p>
          </div>
          <div className="p-2 bg-red-50 rounded-lg">
            <Server className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServerStats;