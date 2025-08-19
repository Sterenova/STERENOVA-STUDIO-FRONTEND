import { TemplateInfo, TemplatesListResponse, GenerateTemplateRequest, TemplatePreset, PaletteResponse, GradientCssResponse } from '@/types/api';

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
}

export const apiService = new ApiService(); 