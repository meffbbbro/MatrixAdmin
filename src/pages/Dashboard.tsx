import React, { useEffect } from 'react';
import { useMatrix } from '../contexts/MatrixContext';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/layout/Layout';
import ServerStats from '../components/dashboard/ServerStats';
import { Activity, Users, Home, FileText, Server, BarChart4 } from 'lucide-react';
import Card from '../components/ui/Card';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { fetchServerStats, serverStats, users, rooms, fetchUsers, fetchRooms, isLoading } = useMatrix();
  const { user } = useAuth();

  useEffect(() => {
    // Fetch initial data
    fetchServerStats();
    fetchUsers();
    fetchRooms();
  }, [fetchServerStats, fetchUsers, fetchRooms]);

  const quickLinks = [
    { name: 'User Management', description: 'Create, modify, and deactivate accounts', icon: Users, color: 'bg-blue-500', href: '/users' },
    { name: 'Rooms', description: 'Manage rooms and their settings', icon: Home, color: 'bg-green-500', href: '/rooms' },
    { name: 'Media Content', description: 'Review and moderate media files', icon: FileText, color: 'bg-purple-500', href: '/media' },
    { name: 'Federation', description: 'Manage server-to-server relationships', icon: Server, color: 'bg-red-500', href: '/federation' },
    { name: 'Server Stats', description: 'Monitor server health and performance', icon: Activity, color: 'bg-yellow-500', href: '/stats' },
    { name: 'Reports', description: 'View analytics and user activity', icon: BarChart4, color: 'bg-indigo-500', href: '/reports' },
  ];

  return (
    <Layout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
          
          <div className="mt-2 mb-6">
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, {user?.displayName || user?.username || 'Administrator'}
            </p>
          </div>
          
          {isLoading && !serverStats ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <ServerStats />
          )}
          
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mt-10 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickLinks.map((link) => (
              <Link key={link.name} to={link.href}>
                <Card className="p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer h-full">
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${link.color} text-white`}>
                      <link.icon className="h-6 w-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{link.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{link.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New user registered</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">@alex:matrix.org</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">10 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-500">
                    <Home className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">New room created</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">#project-matrix:matrix.org</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">1 hour ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                    <Server className="h-4 w-4" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Federation error</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">example.org</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">3 hours ago</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Status</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Disk Usage</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">68%</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-500 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">CPU Load</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">42%</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-500 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Memory Usage</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">75%</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Database Connections</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">18/50</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-500 rounded-full" style={{ width: '36%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;