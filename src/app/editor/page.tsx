'use client';

import { useState, useEffect } from 'react';
import { ModernSidebar } from '@/components/layout/ModernSidebar';
import { ModernTemplateEditor } from '@/components/editor/ModernTemplateEditor';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { Toaster } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, Palette, Sparkles, ArrowRight, RotateCcw, RefreshCw } from 'lucide-react';
import { APP_LABELS } from '@/config/app';

export default function EditorPage() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const response = await apiService.getTemplatesList();
        setTemplates(response.templates);
        

      } catch (err) {
        console.error('Erreur lors du chargement des templates:', err);
        setError('Erreur lors du chargement des templates');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateSelect = (template: TemplateInfo) => {
    setSelectedTemplate(template);
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span>Chargement de {APP_LABELS.welcome.split(' ').slice(-2).join(' ')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Préparation de votre bibliothèque de templates...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <AlertCircle className="w-6 h-6 text-destructive" />
              <span>Erreur de chargement</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-muted-foreground">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Toaster />
      <ModernHeader
        onMenuToggle={handleMobileMenuToggle}
        isMenuOpen={isMobileMenuOpen}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <ModernSidebar 
            templates={templates} 
            selectedTemplate={selectedTemplate}
            onTemplateSelect={handleTemplateSelect} 
          />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-16 h-full w-80 bg-card shadow-xl">
              <ModernSidebar 
                templates={templates} 
                selectedTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect} 
              />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedTemplate ? (
            <ModernTemplateEditor template={selectedTemplate} />
          ) : (
            <div className="h-full overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Card */}
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center space-x-2 text-3xl">
                      <Palette className="w-8 h-8 text-primary" />
                      <span>{APP_LABELS.welcome}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      Choisissez un template dans la sidebar pour commencer votre création.
                      Vous pouvez explorer les différentes catégories et voir des aperçus de chaque design.
                    </p>
                  </CardContent>
                </Card>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="text-center">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center space-x-2">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📱</span>
                        </div>
                        <span>Posts Instagram</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Templates carrés optimisés pour les réseaux sociaux
                      </p>
                      <div className="text-center">
                        <span className="text-4xl font-bold text-primary block">
                          {templates.filter(t => t.category === 'post').length}
                        </span>
                        <p className="text-sm text-muted-foreground">templates disponibles</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="text-center">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center space-x-2">
                        <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                          <span className="text-2xl">📖</span>
                        </div>
                        <span>Stories & Reels</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">
                        Templates verticaux pour les stories et reels
                      </p>
                      <div className="text-center">
                        <span className="text-4xl font-bold text-secondary block">
                          {templates.filter(t => t.category === 'story').length}
                        </span>
                        <p className="text-sm text-muted-foreground">templates disponibles</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Start Card */}
                <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <span>Comment commencer ?</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-background rounded-lg border border-border">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg">1</span>
                        </div>
                        <p className="text-sm font-medium">Sélectionnez un template</p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg border border-border">
                        <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg">2</span>
                        </div>
                        <p className="text-sm font-medium">Personnalisez les paramètres</p>
                      </div>
                      <div className="text-center p-4 bg-background rounded-lg border border-border">
                        <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-lg">3</span>
                        </div>
                        <p className="text-sm font-medium">Générez et téléchargez</p>
                      </div>
                    </div>
                    <div className="text-center pt-4 border-t border-border">
                      <p className="text-muted-foreground mb-4">
                        Utilisez la sidebar pour naviguer entre les templates
                      </p>
                      <div className="inline-flex items-center space-x-2 text-primary font-medium">
                        <span>Cliquez sur un template pour commencer</span>
                        <ArrowRight className="w-4 h-4 animate-pulse" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 