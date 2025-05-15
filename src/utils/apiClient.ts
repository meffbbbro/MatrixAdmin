import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// Define types for Matrix Synapse Admin API responses
export interface MatrixUser {
  name: string;
  is_admin: boolean;
  deactivated: boolean;
  user_type: string | null;
  displayname: string | null;
  avatar_url: string | null;
  creation_ts: number;
}

export interface MatrixRoom {
  room_id: string;
  name: string;
  canonical_alias: string | null;
  joined_members: number;
  joined_local_members: number;
  version: string;
  creator: string;
  encryption: string | null;
  federatable: boolean;
  public: boolean;
  join_rules: string;
  guest_access: string;
  history_visibility: string;
  state_events: number;
}

export interface ServerStats {
  cpu_average: number;
  memory_usage: number;
  uptime: number;
  connected_servers: number;
  total_users: number;
  active_users_30days: number;
  total_rooms: number;
  daily_messages: number;
  database_size: number;
}

export interface MediaItem {
  media_id: string;
  upload_name: string;
  created_ts: number;
  last_access_ts: number;
  media_type: string;
  media_length: number;
  user_id: string;
  safe_from_quarantine: boolean;
}

export interface FederationServer {
  server_name: string;
  status: 'online' | 'offline' | 'unreachable';
  last_successful_connection: number;
}

// Main API Client
class MatrixApiClient {
  private client: AxiosInstance;
  private serverUrl: string;
  private accessToken: string | null = null;

  constructor(serverUrl: string) {
    this.serverUrl = serverUrl;
    this.client = axios.create({
      baseURL: `${serverUrl}/_synapse/admin`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  setAccessToken(token: string) {
    this.accessToken = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Common request method with auth
  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Authentication required');
    }
    const response = await this.client(config);
    return response.data;
  }

  // === User Management ===
  async getUsers(limit = 100, from = 0): Promise<{ users: MatrixUser[] }> {
    return this.request({
      method: 'GET',
      url: `/v2/users?limit=${limit}&from=${from}`,
    });
  }

  async getUser(userId: string): Promise<MatrixUser> {
    return this.request({
      method: 'GET',
      url: `/v2/users/${encodeURIComponent(userId)}`,
    });
  }

  async createUser(username: string, password: string, admin = false): Promise<MatrixUser> {
    return this.request({
      method: 'PUT',
      url: `/v2/users/${encodeURIComponent(`@${username}:${new URL(this.serverUrl).hostname}`)}`,
      data: {
        password,
        admin,
      },
    });
  }

  async deactivateUser(userId: string): Promise<void> {
    return this.request({
      method: 'POST',
      url: `/v2/users/${encodeURIComponent(userId)}/deactivate`,
      data: {
        erase: false,
      },
    });
  }

  // === Room Management ===
  async getRooms(limit = 100, from = 0): Promise<{ rooms: MatrixRoom[] }> {
    return this.request({
      method: 'GET',
      url: `/v1/rooms?limit=${limit}&from=${from}`,
    });
  }

  async getRoom(roomId: string): Promise<MatrixRoom> {
    return this.request({
      method: 'GET',
      url: `/v1/rooms/${encodeURIComponent(roomId)}`,
    });
  }

  async deleteRoom(roomId: string): Promise<void> {
    return this.request({
      method: 'DELETE',
      url: `/v1/rooms/${encodeURIComponent(roomId)}`,
    });
  }

  // === Server Stats ===
  async getServerStats(): Promise<ServerStats> {
    return this.request({
      method: 'GET',
      url: '/v1/statistics',
    });
  }

  // === Media Management ===
  async getMediaList(limit = 100, from = 0): Promise<{ media: MediaItem[] }> {
    return this.request({
      method: 'GET',
      url: `/v1/media?limit=${limit}&from=${from}`,
    });
  }

  async quarantineMedia(mediaId: string): Promise<void> {
    return this.request({
      method: 'POST',
      url: `/v1/media/quarantine/${encodeURIComponent(mediaId)}`,
    });
  }

  // === Federation Management ===
  async getFederationServers(): Promise<{ servers: FederationServer[] }> {
    return this.request({
      method: 'GET',
      url: '/v1/federation/servers',
    });
  }

  async setServerBlockStatus(serverName: string, blocked: boolean): Promise<void> {
    return this.request({
      method: 'PUT',
      url: `/v1/federation/servers/${encodeURIComponent(serverName)}`,
      data: {
        blocked,
      },
    });
  }
}

// Create a singleton instance
const matrixApi = new MatrixApiClient(import.meta.env.VITE_MATRIX_SYNAPSE_URL || '');

export default matrixApi;