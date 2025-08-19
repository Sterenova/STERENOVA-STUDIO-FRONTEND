import { 
  TemplateInfo, 
  TemplatesListResponse, 
  GenerateTemplateRequest, 
  TemplatePreset, 
  PaletteResponse, 
  GradientCssResponse,
  DownloadHistory,
  CreateDownloadHistoryRequest,
  DownloadHistoryStats,
  FavoriteTemplate,
  CreateFavoriteTemplateRequest,
  UpdateFavoriteTemplateRequest,
  SvgSetting,
  CreateSvgSettingRequest,
  UpdateSvgSettingRequest
} from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getTemplatesList(): Promise<TemplatesListResponse> {
    // L'API retourne directement un tableau, on l'encapsule dans la structure attendue
    const templates = await this.request<TemplateInfo[]>('/templates/list');
    return { templates };
  }

  async searchTemplates(query: string): Promise<TemplatesListResponse> {
    const templates = await this.request<TemplateInfo[]>(`/templates/search?q=${encodeURIComponent(query)}`);
    return { templates };
  }

  async getTemplatesByCategory(category: string): Promise<TemplatesListResponse> {
    const templates = await this.request<TemplateInfo[]>(`/templates/category/${category}`);
    return { templates };
  }

  async getTemplateInfo(key: string): Promise<TemplateInfo> {
    return this.request<TemplateInfo>(`/templates/info/${key}`);
  }

  async generateTemplate(category: string, name: string, data?: GenerateTemplateRequest): Promise<string> {
    if (data) {
      // POST request with data
      const response = await fetch(`${API_BASE_URL}/templates/${category}/${name}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.text(); // Return SVG as text
    } else {
      // GET request without data
      const response = await fetch(`${API_BASE_URL}/templates/${category}/${name}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.text(); // Return SVG as text
    }
  }

  async generatePng(
    category: string, 
    name: string, 
    data: GenerateTemplateRequest,
    dimensions?: { width?: number; height?: number }
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (dimensions?.width) queryParams.append('width', dimensions.width.toString());
    if (dimensions?.height) queryParams.append('height', dimensions.height.toString());

    const response = await fetch(`${API_BASE_URL}/templates/${category}/${name}/png?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async generateJpeg(
    category: string, 
    name: string, 
    data: GenerateTemplateRequest,
    dimensions?: { width?: number; height?: number },
    quality: number = 90
  ): Promise<Blob> {
    const queryParams = new URLSearchParams();
    if (dimensions?.width) queryParams.append('width', dimensions.width.toString());
    if (dimensions?.height) queryParams.append('height', dimensions.height.toString());
    queryParams.append('quality', quality.toString());

    const response = await fetch(`${API_BASE_URL}/templates/${category}/${name}/jpeg?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  async getTemplatePresets(): Promise<TemplatePreset[]> {
    return this.request<TemplatePreset[]>('/templates/presets');
  }

  async getTemplatePreset(kind: string, name: string): Promise<TemplatePreset> {
    return this.request<TemplatePreset>(`/templates/presets/${kind}/${name}`);
  }

  async getColorPalette(): Promise<PaletteResponse> {
    return this.request<PaletteResponse>('/templates/config/palette');
  }

  async getGradientCSS(): Promise<GradientCssResponse> {
    return this.request<GradientCssResponse>('/templates/config/gradient.css');
  }

  async downloadArchive(): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/templates/archive/all.zip`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.blob();
  }

  // Download History API methods
  async createDownloadHistory(data: CreateDownloadHistoryRequest): Promise<DownloadHistory> {
    return this.request<DownloadHistory>('/download-history', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDownloadHistoryByUser(userId: string, limit: number = 50): Promise<DownloadHistory[]> {
    return this.request<DownloadHistory[]>(`/download-history/user/${userId}?limit=${limit}`);
  }

  async getDownloadHistoryByTemplate(templateName: string, limit: number = 50): Promise<DownloadHistory[]> {
    return this.request<DownloadHistory[]>(`/download-history/template/${templateName}?limit=${limit}`);
  }

  async getDownloadHistoryStats(userId?: string): Promise<DownloadHistoryStats> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<DownloadHistoryStats>(`/download-history/stats${query}`);
  }

  async cleanupDownloadHistory(days: number = 90): Promise<{ message: string; deletedCount: number }> {
    return this.request<{ message: string; deletedCount: number }>(`/download-history/cleanup?days=${days}`);
  }

  // Favorite Templates API methods
  async createFavoriteTemplate(data: CreateFavoriteTemplateRequest): Promise<FavoriteTemplate> {
    return this.request<FavoriteTemplate>('/favorite-templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getFavoriteTemplatesByUser(userId: string): Promise<FavoriteTemplate[]> {
    return this.request<FavoriteTemplate[]>(`/favorite-templates/user/${userId}`);
  }

  async getFavoriteTemplatesByUserAndCategory(userId: string, category: 'post' | 'story'): Promise<FavoriteTemplate[]> {
    return this.request<FavoriteTemplate[]>(`/favorite-templates/user/${userId}/category/${category}`);
  }

  async getMostUsedFavorites(userId: string, limit: number = 10): Promise<FavoriteTemplate[]> {
    return this.request<FavoriteTemplate[]>(`/favorite-templates/user/${userId}/most-used?limit=${limit}`);
  }

  async isTemplateFavorite(userId: string, templateName: string): Promise<{ isFavorite: boolean }> {
    return this.request<{ isFavorite: boolean }>(`/favorite-templates/user/${userId}/is-favorite/${templateName}`);
  }

  async updateFavoriteTemplate(id: string, data: UpdateFavoriteTemplateRequest, userId: string): Promise<FavoriteTemplate> {
    return this.request<FavoriteTemplate>(`/favorite-templates/${id}?userId=${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeFavoriteTemplate(id: string, userId: string): Promise<void> {
    return this.request<void>(`/favorite-templates/${id}?userId=${userId}`, {
      method: 'DELETE',
    });
  }

  async incrementFavoriteUsage(id: string, userId: string): Promise<void> {
    return this.request<void>(`/favorite-templates/${id}/increment-usage?userId=${userId}`, {
      method: 'POST',
    });
  }

  // SVG Settings API methods
  async createSvgSetting(data: CreateSvgSettingRequest): Promise<SvgSetting> {
    return this.request<SvgSetting>('/svg-settings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSvgSettingsByUser(userId: string): Promise<SvgSetting[]> {
    return this.request<SvgSetting[]>(`/svg-settings/user/${userId}`);
  }

  async getGlobalSvgSettings(): Promise<SvgSetting[]> {
    return this.request<SvgSetting[]>('/svg-settings/global');
  }

  async getMergedSvgSettings(userId: string): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/svg-settings/merged/${userId}`);
  }

  async getSvgSettingsByCategory(category: string, userId?: string): Promise<SvgSetting[]> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<SvgSetting[]>(`/svg-settings/category/${category}${query}`);
  }

  async getSvgSettingByKey(settingKey: string, userId?: string): Promise<SvgSetting | null> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<SvgSetting | null>(`/svg-settings/key/${settingKey}${query}`);
  }

  async updateSvgSetting(id: string, data: UpdateSvgSettingRequest, userId?: string): Promise<SvgSetting> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<SvgSetting>(`/svg-settings/${id}${query}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async removeSvgSetting(id: string, userId?: string): Promise<void> {
    const query = userId ? `?userId=${userId}` : '';
    return this.request<void>(`/svg-settings/${id}${query}`, {
      method: 'DELETE',
    });
  }

  async createDefaultSvgSettings(userId: string): Promise<void> {
    return this.request<void>(`/svg-settings/user/${userId}/defaults`, {
      method: 'POST',
    });
  }

  // User-specific template methods
  async getUserFavorites(userId: string): Promise<FavoriteTemplate[]> {
    return this.request<FavoriteTemplate[]>(`/templates/user/${userId}/favorites`);
  }

  async addTemplateToFavorites(
    userId: string, 
    templateName: string, 
    templateCategory: 'post' | 'story',
    defaultParameters?: Record<string, any>,
    notes?: string
  ): Promise<FavoriteTemplate> {
    return this.request<FavoriteTemplate>(`/templates/user/${userId}/favorites`, {
      method: 'POST',
      body: JSON.stringify({
        templateName,
        templateCategory,
        defaultParameters,
        notes,
      }),
    });
  }

  async removeTemplateFromFavorites(userId: string, favoriteId: string): Promise<void> {
    return this.request<void>(`/templates/user/${userId}/favorites/${favoriteId}`, {
      method: 'DELETE',
    });
  }

  async getUserSettings(userId: string): Promise<Record<string, any>> {
    return this.request<Record<string, any>>(`/templates/user/${userId}/settings`);
  }

  async updateUserSetting(
    userId: string, 
    settingKey: string, 
    value: any, 
    settingName?: string, 
    description?: string
  ): Promise<SvgSetting> {
    return this.request<SvgSetting>(`/templates/user/${userId}/settings/${settingKey}`, {
      method: 'POST',
      body: JSON.stringify({
        value,
        settingName,
        description,
      }),
    });
  }
}

export const apiService = new ApiService(); 