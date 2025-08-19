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