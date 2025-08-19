export const APP_CONFIG = {
  // Nom de l'application
  name: 'Sterenova Studio',
  shortName: 'Sterenova Studio',
  
  // Version
  version: '1.0.0',
  
  // Description
  description: 'Générateur de Templates SVG Professionnels',
  
  // Métadonnées
  metadata: {
    title: 'Sterenova Studio - Générateur de Templates SVG',
    description: 'Créez des templates SVG professionnels pour vos réseaux sociaux',
    keywords: ['templates', 'svg', 'design', 'social media', 'instagram', 'sterenova'],
    author: 'Sterenova Studio',
    company: 'Sterenova Studio',
    
    // Handles sociaux
    social: {
      instagram: '@sterenova_',
      twitter: '@sterenova_',
      linkedin: 'sterenova_',
    },
    
    // URLs
    urls: {
      website: 'https://sterenova.fr',
      api: 'https://api.studio.sterenova.fr',
      support: 'https://support.sterenova.fr',
    }
  },
  
  // Configuration de l'interface
  ui: {
    brand: {
      logo: '/logo.svg',
      favicon: '/favicon.ico',
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
    },
    
    // Textes de l'interface
    labels: {
      welcome: 'Bienvenue dans Sterenova Studio',
      editor: 'Éditeur Sterenova Studio',
      templates: 'Templates Sterenova Studio',
      favorites: 'Favoris Sterenova Studio',
      history: 'Historique Sterenova Studio',
      settings: 'Paramètres Sterenova Studio',
    }
  }
} as const;

// Export des valeurs individuelles pour faciliter l'utilisation
export const APP_NAME = APP_CONFIG.name;
export const APP_SHORT_NAME = APP_CONFIG.shortName;
export const APP_VERSION = APP_CONFIG.version;
export const APP_DESCRIPTION = APP_CONFIG.description;
export const APP_METADATA = APP_CONFIG.metadata;
export const APP_UI = APP_CONFIG.ui;
export const APP_LABELS = APP_CONFIG.ui.labels;
export const APP_SOCIAL = APP_CONFIG.metadata.social;
export const APP_URLS = APP_CONFIG.metadata.urls; 