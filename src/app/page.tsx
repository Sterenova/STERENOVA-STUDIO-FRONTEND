'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { Toaster } from 'sonner';
import { ArrowRight, Sparkles, Palette, Star } from 'lucide-react';
import { APP_NAME } from '@/config/app';

export default function HomePage() {
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Chargement de {APP_NAME}</h2>
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

  const postTemplates = templates.filter(t => t.category === 'post');
  const storyTemplates = templates.filter(t => t.category === 'story');

  return (
    <div className="min-h-screen bg-background">
      <Toaster />
      
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Image src="/logo.svg" alt={APP_NAME} width={32} height={32} />
              <span className="text-xl font-bold text-foreground">{APP_NAME}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/editor">
                <Button size="sm">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-32 h-32 flex items-center justify-center mx-auto mb-8">
              <Image src="/logo.svg" alt={APP_NAME} width={128} height={128} />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Bienvenue sur <span className="text-primary">{APP_NAME}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Créez des templates SVG professionnels en quelques clics.
              Interface intuitive et génération en temps réel pour vos besoins créatifs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/editor">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Commencer à créer
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <Palette className="w-5 h-5 mr-2" />
                Voir les templates
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir {APP_NAME} ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une solution complète pour tous vos besoins de création graphique
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-background rounded-2xl border border-border shadow-lg">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">📱</div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Posts Instagram</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Templates carrés optimisés pour les réseaux sociaux avec des designs modernes et professionnels
              </p>
              <div className="text-center">
                <span className="text-4xl font-bold text-primary block">
                  {postTemplates.length}
                </span>
                <p className="text-muted-foreground">templates disponibles</p>
              </div>
            </div>
            
            <div className="text-center p-8 bg-background rounded-2xl border border-border shadow-lg">
              <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">📖</div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Stories & Reels</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Templates verticaux parfaits pour les stories, reels et contenus vidéo courts
              </p>
              <div className="text-center">
                <span className="text-4xl font-bold text-secondary block">
                  {storyTemplates.length}
                </span>
                <p className="text-muted-foreground">templates disponibles</p>
              </div>
            </div>
            
            <div className="text-center p-8 bg-background rounded-2xl border border-border shadow-lg">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">⚡</div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4">Génération Rapide</h3>
              <p className="text-muted-foreground text-lg mb-6">
                Interface intuitive et génération en temps réel pour une productivité maximale
              </p>
              <div className="text-center">
                <span className="text-4xl font-bold text-accent block">∞</span>
                <p className="text-muted-foreground">possibilités</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Prêt à créer votre premier template ?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Rejoignez des milliers de créateurs qui utilisent déjà {APP_NAME} pour leurs projets
          </p>
          <Link href="/editor">
            <Button size="lg" className="text-lg px-8 py-4">
              <Star className="w-5 h-5 mr-2" />
              Commencer maintenant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
