'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ModernSidebar } from '@/components/layout/ModernSidebar';
import { ModernTemplateEditor } from '@/components/editor/ModernTemplateEditor';
import { ModernHeader } from '@/components/layout/ModernHeader';
import { TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { Toaster } from 'sonner';

export default function HomePage() {
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Chargement de Sterenova</h2>
          <p className="text-muted-foreground">Préparation de votre bibliothèque de templates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-4xl">⚠️</div>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Erreur de chargement</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Réessayer
          </button>
        </div>
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
          <ModernSidebar templates={templates} onTemplateSelect={handleTemplateSelect} />
        </div>
        
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="fixed left-0 top-16 h-full w-80 bg-card shadow-xl">
              <ModernSidebar templates={templates} onTemplateSelect={handleTemplateSelect} />
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {selectedTemplate ? (
            <ModernTemplateEditor template={selectedTemplate} />
          ) : (
            <div className="h-full overflow-y-auto scrollbar-thin">
              <div className="flex items-center justify-center min-h-full p-6">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="w-32 h-32 flex items-center justify-center mx-auto mb-8">
                    <Image src="/logo.svg" alt="Sterenova" width={128} height={128} />
                  </div>
                  
                  <h2 className="text-4xl font-bold text-foreground mb-6">
                    Bienvenue sur Sterenova
                  </h2>
                  
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    Créez des templates SVG professionnels en quelques clics.
                    Sélectionnez un template dans la sidebar pour commencer votre création.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-2xl">📱</div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Posts Instagram</h3>
                      <p className="text-muted-foreground text-sm">Templates carrés optimisés pour les réseaux sociaux</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-primary">
                          {templates.filter(t => t.category === 'post').length}
                        </span>
                        <p className="text-sm text-muted-foreground">templates disponibles</p>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
                      <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-2xl">📖</div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Stories</h3>
                      <p className="text-muted-foreground text-sm">Templates verticaux pour les stories et reels</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-secondary">
                          {templates.filter(t => t.category === 'story').length}
                        </span>
                        <p className="text-sm text-muted-foreground">templates disponibles</p>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-card rounded-xl border border-border shadow-sm">
                      <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-2xl">⚡</div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Génération Rapide</h3>
                      <p className="text-muted-foreground text-sm">Interface intuitive et génération en temps réel</p>
                      <div className="mt-3">
                        <span className="text-2xl font-bold text-accent">∞</span>
                        <p className="text-sm text-muted-foreground">possibilités</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">
                      Commencez par explorer notre bibliothèque de templates professionnels
                    </p>
                    <div className="inline-flex items-center space-x-2 text-primary font-medium">
                      <span>Utilisez la sidebar pour naviguer</span>
                      <div className="animate-bounce">👉</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
