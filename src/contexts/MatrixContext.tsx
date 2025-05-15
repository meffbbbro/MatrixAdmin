import React, { createContext, useContext, useState, useEffect } from 'react';
import matrixApi, { MatrixUser, MatrixRoom, ServerStats } from '../utils/apiClient';
import { useAuth } from './AuthContext';

interface MatrixContextType {
  isLoading: boolean;
  error: string | null;
  users: MatrixUser[];
  rooms: MatrixRoom[];
  serverStats: ServerStats | null;
  currentUser: MatrixUser | null;
  currentRoom: MatrixRoom | null;
  
  fetchUsers: () => Promise<void>;
  fetchRooms: () => Promise<void>;
  fetchServerStats: () => Promise<void>;
  fetchUser: (userId: string) => Promise<void>;
  fetchRoom: (roomId: string) => Promise<void>;
  
  createUser: (username: string, password: string, isAdmin: boolean) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  deleteRoom: (roomId: string) => Promise<void>;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

export const MatrixProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<MatrixUser[]>([]);
  const [rooms, setRooms] = useState<MatrixRoom[]>([]);
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [currentUser, setCurrentUser] = useState<MatrixUser | null>(null);
  const [currentRoom, setCurrentRoom] = useState<MatrixRoom | null>(null);

  // Set access token when authenticated
  useEffect(() => {
    if (isAuthenticated && user?.token) {
      matrixApi.setAccessToken(user.token);
    }
  }, [isAuthenticated, user]);

  // Fetch functions
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await matrixApi.getUsers();
      setUsers(response.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await matrixApi.getRooms();
      setRooms(response.rooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServerStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const stats = await matrixApi.getServerStats();
      setServerStats(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch server statistics');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await matrixApi.getUser(userId);
      setCurrentUser(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoom = async (roomId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const room = await matrixApi.getRoom(roomId);
      setCurrentRoom(room);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch room details');
    } finally {
      setIsLoading(false);
    }
  };

  // Mutation functions
  const createUser = async (username: string, password: string, isAdmin: boolean) => {
    try {
      setIsLoading(true);
      setError(null);
      await matrixApi.createUser(username, password, isAdmin);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateUser = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await matrixApi.deactivateUser(userId);
      await fetchUsers(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await matrixApi.deleteRoom(roomId);
      await fetchRooms(); // Refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete room');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    isLoading,
    error,
    users,
    rooms,
    serverStats,
    currentUser,
    currentRoom,
    
    fetchUsers,
    fetchRooms,
    fetchServerStats,
    fetchUser,
    fetchRoom,
    
    createUser,
    deactivateUser,
    deleteRoom,
  };

  return <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>;
};

export const useMatrix = () => {
  const context = useContext(MatrixContext);
  if (context === undefined) {
    throw new Error('useMatrix must be used within a MatrixProvider');
  }
  return context;
};