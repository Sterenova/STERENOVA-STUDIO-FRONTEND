'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Palette, 
  Download, 
  Settings, 
  Image as ImageIcon,
  Video,
  Sparkles
} from 'lucide-react';
import { TemplateInfo } from '@/types/api';

interface SidebarProps {
  templates: TemplateInfo[];
  onTemplateSelect: (template: TemplateInfo) => void;
}

export function Sidebar({ templates, onTemplateSelect }: SidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  // Vérification de sécurité pour éviter l'erreur
  if (!templates || templates.length === 0) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500 font-medium">Chargement des templates...</p>
            <p className="text-sm text-gray-400 mt-2">Préparation de votre bibliothèque</p>
          </div>
        </div>
      </div>
    );
  }

  const posts = templates.filter(t => t.category === 'post');
  const stories = templates.filter(t => t.category === 'story');

  const filteredTemplates = templates.filter(template =>
    template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTemplatesForTab = () => {
    switch (selectedTab) {
      case 'posts':
        return posts.filter(template =>
          template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      case 'stories':
        return stories.filter(template =>
          template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      default:
        return filteredTemplates;
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 p-6">
      <div className="space-y-6">
        {/* En-tête de la sidebar */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
          <p className="text-sm text-gray-500">
            {templates.length} templates disponibles
          </p>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher un template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* Onglets de catégories */}
        <div className="flex space-x-1 p-1 bg-gray-100 rounded-lg">
          <Button
            variant={selectedTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('all')}
            className="flex-1 h-8 text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Tous ({templates.length})
          </Button>
          <Button
            variant={selectedTab === 'posts' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('posts')}
            className="flex-1 h-8 text-xs"
          >
            <ImageIcon className="h-3 w-3 mr-1" />
            Posts ({posts.length})
          </Button>
          <Button
            variant={selectedTab === 'stories' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setSelectedTab('stories')}
            className="flex-1 h-8 text-xs"
          >
            <Video className="h-3 w-3 mr-1" />
            Stories ({stories.length})
          </Button>
        </div>

        {/* Liste des templates */}
        <div className="space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
          {getTemplatesForTab().map((template) => (
            <Card
              key={template.name}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-gray-200 hover:border-blue-300 group"
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {template.displayName}
                  </CardTitle>
                  <Badge 
                    variant={template.category === 'post' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {template.category === 'post' ? 'Post' : 'Story'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                  {template.description}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.slice(0, 3).map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs px-2 py-1 bg-gray-50 text-gray-600 border-gray-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-2 py-1 bg-gray-50 text-gray-500 border-gray-200"
                    >
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Footer avec dimensions et actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-mono">
                    {template.dimensions.width}×{template.dimensions.height}
                  </span>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-blue-50">
                      <Palette className="h-3 w-3 text-blue-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-green-50">
                      <Download className="h-3 w-3 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-6 w-6 p-0 hover:bg-gray-50">
                      <Settings className="h-3 w-3 text-gray-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 