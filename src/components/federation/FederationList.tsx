import React, { useEffect, useState } from 'react';
import { useMatrix } from '../../contexts/MatrixContext';
import matrixApi, { FederationServer } from '../../utils/apiClient';
import { Search, RefreshCw, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

const FederationList: React.FC = () => {
  const { isLoading: contextLoading, error: contextError } = useMatrix();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servers, setServers] = useState<FederationServer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchServers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await matrixApi.getFederationServers();
      setServers(response.servers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch federated servers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlockServer = async (serverName: string, blocked: boolean) => {
    try {
      setIsLoading(true);
      await matrixApi.setServerBlockStatus(serverName, blocked);
      // Refresh the list after changing block status
      await fetchServers();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${blocked ? 'block' : 'unblock'} server`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const filteredServers = servers.filter(server => 
    server.server_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loading = isLoading || contextLoading;
  const errorMessage = error || contextError;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Federation</h2>
        
        <Button 
          onClick={fetchServers}
          className="flex items-center gap-2"
          variant="outline"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search servers..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">
          <p className="font-medium">Error loading federation data</p>
          <p>{errorMessage}</p>
        </div>
      )}

      {loading && servers.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {filteredServers.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No federated servers found.</p>
            </div>
          ) : (
            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Server Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Connection</th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredServers.map((server) => (
                      <tr key={server.server_name} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {server.server_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {server.status === 'online' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Online
                            </span>
                          ) : server.status === 'offline' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              <XCircle className="h-4 w-4 mr-1" />
                              Offline
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <AlertTriangle className="h-4 w-4 mr-1" />
                              Unreachable
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {server.last_successful_connection ? 
                            new Date(server.last_successful_connection).toLocaleString() : 
                            'Never'
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              onClick={() => {/* Open server details */}}
                            >
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-600 text-red-600 hover:bg-red-50"
                              onClick={() => handleBlockServer(server.server_name, true)}
                            >
                              Block
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FederationList;