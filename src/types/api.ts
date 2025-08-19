export interface TemplatePlaceholder {
  key: string;
  description: string;
  example: string;
  required: boolean;
  defaultValue?: string;
}

export interface TemplateMetadata {
  name: string;
  displayName: string;
  description: string;
  category: 'post' | 'story';
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
  placeholders: TemplatePlaceholder[];
}

export interface TemplateInfo {
  key: string;
  name: string;
  displayName: string;
  description: string;
  category: 'post' | 'story';
  tags: string[];
  dimensions: {
    width: number;
    height: number;
  };
  placeholders: TemplatePlaceholder[];
}

export interface TemplatePreset {
  name: string;
  data: Record<string, string>;
}

export interface GenerateTemplateRequest {
  [key: string]: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface TemplatesListResponse {
  templates: TemplateInfo[];
}

export interface SearchResponse {
  templates: TemplateInfo[];
  query: string;
}

export interface CategoryResponse {
  templates: TemplateInfo[];
  category: string;
}

export interface TemplateInfoResponse {
  template: TemplateInfo;
}

export interface PresetsResponse {
  presets: TemplatePreset[];
}

export interface PaletteResponse {
  colors: string[];
}

export interface GradientCssResponse {
  css: string;
}

// New types for download history
export interface DownloadHistory {
  id: string;
  templateName: string;
  templateCategory: 'post' | 'story';
  templateParameters?: Record<string, any>;
  fileName?: string;
  fileFormat: string;
  fileSize?: number;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
  downloadedAt: Date;
}

export interface CreateDownloadHistoryRequest {
  templateName: string;
  templateCategory: 'post' | 'story';
  templateParameters?: Record<string, any>;
  fileName?: string;
  fileFormat?: string;
  fileSize?: number;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export interface DownloadHistoryStats {
  totalDownloads: number;
  downloadsByTemplate: Record<string, number>;
  downloadsByCategory: Record<string, number>;
}

// New types for favorite templates
export interface FavoriteTemplate {
  id: string;
  templateName: string;
  templateCategory: 'post' | 'story';
  defaultParameters?: Record<string, any>;
  notes?: string;
  usageCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFavoriteTemplateRequest {
  templateName: string;
  templateCategory: 'post' | 'story';
  defaultParameters?: Record<string, any>;
  notes?: string;
  userId: string;
}

export interface UpdateFavoriteTemplateRequest {
  defaultParameters?: Record<string, any>;
  notes?: string;
}

// New types for SVG settings
export interface SvgSetting {
  id: string;
  settingKey: string;
  settingName: string;
  description?: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  isGlobal: boolean;
  category?: string;
  priority: number;
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSvgSettingRequest {
  settingKey: string;
  settingName: string;
  description?: string;
  value: any;
  valueType: 'string' | 'number' | 'boolean' | 'object' | 'array';
  isGlobal?: boolean;
  category?: string;
  priority?: number;
  userId?: string;
}

export interface UpdateSvgSettingRequest {
  settingName?: string;
  description?: string;
  value?: any;
  valueType?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  isGlobal?: boolean;
  category?: string;
  priority?: number;
}

// User context types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
} 