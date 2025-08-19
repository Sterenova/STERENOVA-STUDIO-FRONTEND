'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  Search,
  Square,
  Star,
  FileText,
} from 'lucide-react';
import { TemplateInfo } from '@/types/api';
import { APP_LABELS } from '@/config/app';

interface ModernSidebarProps {
  templates: TemplateInfo[];
  selectedTemplate: TemplateInfo | null;
  onTemplateSelect: (template: TemplateInfo) => void;
}

export function ModernSidebar({ templates, selectedTemplate, onTemplateSelect }: ModernSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  if (!templates || templates.length === 0) {
    return (
      <div className="w-80 bg-card border-r border-border flex flex-col h-screen">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-medium">Chargement des templates...</p>
            <p className="text-sm text-muted-foreground/70 mt-2">Préparation de votre bibliothèque {APP_LABELS.templates.toLowerCase()}</p>
          </div>
        </div>
      </div>
    );
  }

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = selectedTab === 'all' || template.category === selectedTab;
    return matchesSearch && matchesTab;
  });

  const posts = templates.filter(t => t.category === 'post');
  const stories = templates.filter(t => t.category === 'story');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'post': return <Square className="h-4 w-4" />;
      case 'story': return <Star className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };



  return (
    <TooltipProvider delayDuration={300}>
      <div className="w-80 bg-card border-r border-border flex flex-col h-screen">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 px-6 pt-6 pb-4 border-b border-border/50">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un template..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background border-border focus:border-primary/50 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        {/* Tabs - Fixed */}
        <div className="flex-shrink-0 px-6 py-4">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 border border-border/50">
              <TabsTrigger 
                value="all" 
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Tous ({templates.length})
              </TabsTrigger>
              <TabsTrigger 
                value="post" 
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Posts ({posts.length})
              </TabsTrigger>
              <TabsTrigger 
                value="story" 
                className="text-xs data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
              >
                Stories ({stories.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Templates List - Scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-6 space-y-3">
            {filteredTemplates.map((template) => (
              <Tooltip key={template.key}>
                <TooltipTrigger asChild>
                  <div
                    className={`group relative p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      selectedTemplate?.key === template.key
                        ? 'bg-accent/10 border-accent/50 shadow-md'
                        : 'bg-card border-border hover:bg-accent/10 hover:border-accent/50 hover:shadow-md'
                    }`}
                    onClick={() => onTemplateSelect(template)}
                  >
                    {/* Indicateur de sélection */}
                    <div className={`absolute inset-0 rounded-lg bg-gradient-sterenova transition-opacity duration-200 ${
                      selectedTemplate?.key === template.key ? 'opacity-5' : 'opacity-0 group-hover:opacity-5'
                    }`} />
                    
                    <div className="relative flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-sterenova rounded-lg flex items-center justify-center flex-shrink-0 text-white shadow-sm">
                        {getCategoryIcon(template.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className={`font-semibold truncate transition-colors ${
                            selectedTemplate?.key === template.key
                              ? 'text-primary'
                              : 'text-foreground group-hover:text-primary'
                          }`}>
                            {template.displayName}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className={`text-xs px-2 py-1 transition-colors ${
                              template.category === 'post' 
                                ? 'bg-primary/10 text-primary border-primary/20' 
                                : 'bg-secondary/10 text-secondary border-secondary/20'
                            }`}
                          >
                            {template.category}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {template.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3 text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
                              <span>{template.dimensions.width}×{template.dimensions.height}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />
                              <span>{template.placeholders.length} champs</span>
                            </span>
                          </div>
                          
                          {/* Indicateur de hover */}
                          <div className={`transition-opacity duration-200 ${
                            selectedTemplate?.key === template.key ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}>
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tags en bas */}
                    {template.tags.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="text-xs px-2 py-0.5 bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge 
                              variant="outline" 
                              className="text-xs px-2 py-0.5 text-muted-foreground/70"
                            >
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="right" 
                  className="max-w-xs p-4 bg-popover border border-border shadow-lg"
                  sideOffset={5}
                >
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-sterenova rounded flex items-center justify-center text-white">
                        {getCategoryIcon(template.category)}
                      </div>
                      <h4 className="font-semibold text-popover-foreground">{template.displayName}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span className="font-medium text-popover-foreground">{template.dimensions.width}×{template.dimensions.height}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Champs:</span>
                        <span className="font-medium text-popover-foreground">{template.placeholders.length}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                      {template.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            ))}
            
            {filteredTemplates.length === 0 && (
              <div className="text-center py-12 px-6">
                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">Aucun template trouvé</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Essayez de modifier vos critères de recherche ou de changer d&apos;onglet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 