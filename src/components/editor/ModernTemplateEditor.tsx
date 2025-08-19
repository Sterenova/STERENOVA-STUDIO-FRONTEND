'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

import { Textarea } from '@/components/ui/textarea';
import {
  Download,
  Copy,
  Palette,
  Settings,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  RefreshCw,
  FileImage,
  FileVideo,
  Layers,
  Code,
  Info,
  Zap,
  Maximize2,
  X,
  Square,
  Star,
  Heart,
  Plus
} from 'lucide-react';
import { TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { useUser } from '@/contexts/UserContext';
import { toast } from 'sonner';

interface ModernTemplateEditorProps {
  template: TemplateInfo;
}

export function ModernTemplateEditor({ template }: ModernTemplateEditorProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedSvg, setGeneratedSvg] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAddToFavoritesOpen, setIsAddToFavoritesOpen] = useState(false);
  const [favoriteNotes, setFavoriteNotes] = useState('');

  // Calculer la taille optimale de la prévisualisation
  const getPreviewSize = () => {
    const { width, height } = template.dimensions;
    const maxWidth = 400; // Largeur maximale de la card
    const maxHeight = 400; // Hauteur maximale de la card
    
    // Calculer le ratio pour que l'image tienne dans la card
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    
    // S'assurer que la taille minimale est respectée
    const finalWidth = Math.max(Math.floor(width * ratio), 200);
    const finalHeight = Math.max(Math.floor(height * ratio), 200);
    
    return {
      width: finalWidth,
      height: finalHeight,
      ratio
    };
  };

  // Calculer la taille pour la modal (plus grande)
  const getModalSize = () => {
    const { width, height } = template.dimensions;
    const maxWidth = 800; // Largeur maximale de la modal
    const maxHeight = 600; // Hauteur maximale de la modal
    
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    
    // S'assurer que la taille minimale est respectée
    const finalWidth = Math.max(Math.floor(width * ratio), 300);
    const finalHeight = Math.max(Math.floor(height * ratio), 300);
    
    return {
      width: finalWidth,
      height: finalHeight,
      ratio
    };
  };

  const previewSize = getPreviewSize();
  const modalSize = getModalSize();

  useEffect(() => {
    // Initialiser les valeurs par défaut
    const defaults: Record<string, string> = {};
    template.placeholders.forEach(placeholder => {
      if (placeholder.defaultValue) {
        defaults[placeholder.key] = placeholder.defaultValue;
      }
    });
    setFormData(defaults);
    
    // Générer automatiquement la prévisualisation avec les valeurs par défaut
    if (Object.keys(defaults).length > 0) {
      generateTemplateWithData(defaults);
    }

    // Vérifier si le template est dans les favoris
    if (user) {
      checkIfFavorite();
    }
  }, [template, user]);

  const checkIfFavorite = async () => {
    if (!user) return;
    
    try {
      const result = await apiService.isTemplateFavorite(user.id, template.name);
      setIsFavorite(result.isFavorite);
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter aux favoris');
      return;
    }

    try {
      await apiService.addTemplateToFavorites(
        user.id,
        template.name,
        template.category,
        formData,
        favoriteNotes
      );
      
      setIsFavorite(true);
      setIsAddToFavoritesOpen(false);
      setFavoriteNotes('');
      toast.success('Template ajouté aux favoris');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      toast.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const handleRemoveFromFavorites = async () => {
    if (!user) return;

    try {
      // Récupérer la liste des favoris pour trouver l'ID
      const favorites = await apiService.getFavoriteTemplatesByUser(user.id);
      const favorite = favorites.find(f => f.templateName === template.name);
      
      if (favorite) {
        await apiService.removeTemplateFromFavorites(user.id, favorite.id);
        setIsFavorite(false);
        toast.success('Template retiré des favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error);
      toast.error('Erreur lors de la suppression des favoris');
    }
  };

  const generateTemplateWithData = async (data: Record<string, string>) => {
    setIsGenerating(true);
    try {
      const svg = await apiService.generateTemplate(template.category, template.name, data);
      setGeneratedSvg(svg);
      
      // Sauvegarder l'historique des téléchargements
      if (user) {
        try {
          await apiService.createDownloadHistory({
            templateName: template.name,
            templateCategory: template.category,
            templateParameters: data,
            userId: user.id,
            fileFormat: 'svg'
          });
        } catch (error) {
          console.error('Erreur lors de la sauvegarde de l\'historique:', error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération du template');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    
    // Générer automatiquement la prévisualisation
    if (Object.keys(newData).length === template.placeholders.length) {
      generateTemplateWithData(newData);
    }
  };

  const handleDownload = () => {
    if (!generatedSvg) {
      toast.error('Générez d\'abord le template');
      return;
    }

    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}_${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template téléchargé avec succès');
  };

  const handleDownloadPng = async () => {
    if (!generatedSvg || !formData) {
      toast.error('Générez d\'abord le template');
      return;
    }
    
    try {
      const blob = await apiService.generatePng(template.category, template.name, formData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}_${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Template PNG téléchargé avec succès');
    } catch (error) {
      console.error('Erreur PNG:', error);
      toast.error('Erreur lors du téléchargement PNG');
    }
  };

  const handleDownloadJpeg = async () => {
    if (!generatedSvg || !formData) {
      toast.error('Générez d\'abord le template');
      return;
    }
    
    try {
      const blob = await apiService.generateJpeg(template.category, template.name, formData);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${template.name}_${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Template JPEG téléchargé avec succès');
    } catch (error) {
      console.error('Erreur JPEG:', error);
      toast.error('Erreur lors du téléchargement JPEG');
    }
  };

  const handleCopySvg = async () => {
    if (!generatedSvg) {
      toast.error('Générez d\'abord le template');
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedSvg);
      toast.success('Code SVG copié dans le presse-papiers');
    } catch (error) {
      console.error('Erreur lors de la copie:', error);
      toast.error('Erreur lors de la copie');
    }
  };

  const handleReset = () => {
    const defaults: Record<string, string> = {};
    template.placeholders.forEach(placeholder => {
      if (placeholder.defaultValue) {
        defaults[placeholder.key] = placeholder.defaultValue;
      }
    });
    setFormData(defaults);
    
    if (Object.keys(defaults).length > 0) {
      generateTemplateWithData(defaults);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex-shrink-0 p-4 pb-2">
        <Card>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-sterenova rounded-lg flex items-center justify-center text-white shadow-sm">
                  {template.category === 'post' ? <Square className="h-6 w-6" /> : <Star className="h-6 w-6" />}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{template.displayName}</h1>
                  <p className="text-muted-foreground mt-1">{template.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Bouton Favoris */}
                {isFavorite ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFromFavorites}
                    className="text-red-500 border-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Heart className="w-4 h-4 mr-2 fill-current" />
                    Retirer des Favoris
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddToFavoritesOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter aux Favoris
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                  {showPreview ? 'Masquer' : 'Afficher'}
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 mt-4">
              <Badge variant="outline" className="flex items-center space-x-1">
                {template.category === 'post' ? <Square className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                <span>{template.category}</span>
              </Badge>
              <Badge variant="outline">
                {template.dimensions.width}×{template.dimensions.height}
              </Badge>
              <Badge variant="outline">
                {template.placeholders.length} champs
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Form */}
        <div className="w-96 p-4 overflow-y-auto">
          <div className="space-y-4">
            {/* Paramètres du Template Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Paramètres du Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.placeholders.map((placeholder) => (
                  <div key={placeholder.key} className="space-y-2">
                    <Label htmlFor={placeholder.key} className="flex items-center justify-between">
                      <span>{placeholder.description}</span>
                      {placeholder.required && (
                        <Badge variant="destructive" className="text-xs">Requis</Badge>
                      )}
                    </Label>
                    <Input
                      id={placeholder.key}
                      placeholder={placeholder.example}
                      value={formData[placeholder.key] || ''}
                      onChange={(e) => handleInputChange(placeholder.key, e.target.value)}
                      className={placeholder.required && !formData[placeholder.key] ? 'border-red-500' : ''}
                    />
                    {placeholder.defaultValue && (
                      <p className="text-xs text-muted-foreground">
                        Valeur par défaut: {placeholder.defaultValue}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  onClick={() => generateTemplateWithData(formData)}
                  disabled={isGenerating || Object.keys(formData).length < template.placeholders.length}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Générer le Template
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Panel - Preview */}
        {showPreview && (
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {/* Prévisualisation Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 mr-2" />
                      <span>Prévisualisation</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsModalOpen(true)}
                      >
                        <Maximize2 className="w-4 h-4 mr-2" />
                        Agrandir
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedSvg ? (
                    <div className="flex flex-col items-center space-y-4">
                      <div
                        className="border border-border rounded-lg overflow-hidden bg-white"
                        style={{
                          width: previewSize.width,
                          height: previewSize.height
                        }}
                      >
                        <div
                          dangerouslySetInnerHTML={{ __html: generatedSvg }}
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        />
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center space-x-2">
                          <Button onClick={handleDownload} className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>SVG</span>
                          </Button>
                          <Button onClick={handleDownloadPng} variant="outline" className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>PNG</span>
                          </Button>
                          <Button onClick={handleDownloadJpeg} variant="outline" className="flex items-center space-x-2">
                            <Download className="w-4 h-4" />
                            <span>JPEG</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileImage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Remplissez les paramètres et générez le template pour voir la prévisualisation
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Récapitulatif Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>Récapitulatif</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Informations générales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Informations générales</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nom du template:</span>
                            <span className="font-medium">{template.displayName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Catégorie:</span>
                            <Badge variant="outline" className="flex items-center space-x-1">
                              {template.category === 'post' ? <Square className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                              <span>{template.category}</span>
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Dimensions:</span>
                            <span className="font-medium">{template.dimensions.width} × {template.dimensions.height}px</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Nombre de champs:</span>
                            <span className="font-medium">{template.placeholders.length}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">Description</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
                        
                        {template.tags && template.tags.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-foreground">Tags:</h5>
                            <div className="flex flex-wrap gap-1">
                              {template.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Paramètres actuels */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Paramètres actuels</h4>
                      <div className="bg-muted/50 rounded-lg p-3">
                        {Object.keys(formData).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {Object.entries(formData).map(([key, value]) => (
                              <div key={key} className="flex justify-between text-sm">
                                <span className="text-muted-foreground font-medium">{key}:</span>
                                <span className="font-mono bg-background px-2 py-1 rounded text-xs">{value || 'Non défini'}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground text-center py-2">
                            Aucun paramètre défini
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Statistiques d'utilisation */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-foreground">Statistiques</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="text-2xl font-bold text-primary">
                            {template.placeholders.length}
                          </div>
                          <div className="text-xs text-muted-foreground">Champs requis</div>
                        </div>
                        <div className="text-center p-3 bg-secondary/5 rounded-lg border border-secondary/20">
                          <div className="text-2xl font-bold text-secondary">
                            {template.dimensions.width}×{template.dimensions.height}
                          </div>
                          <div className="text-xs text-muted-foreground">Dimensions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Prévisualisation agrandie avec fond flouté */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Fond flouté */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Contenu centré */}
          <div className="relative z-10 flex flex-col items-center space-y-4">
            {generatedSvg && (
              <div
                className="border border-border rounded-lg overflow-hidden bg-white shadow-2xl"
                style={{
                  width: modalSize.width,
                  height: modalSize.height
                }}
              >
                <div
                  dangerouslySetInnerHTML={{ __html: generatedSvg }}
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                />
              </div>
            )}
            
            {/* Boutons de téléchargement */}
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2">
                <Button onClick={handleDownload} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  SVG
                </Button>
                <Button onClick={handleDownloadPng} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  PNG
                </Button>
                <Button onClick={handleDownloadJpeg} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  JPEG
                </Button>
              </div>
              
              {/* Bouton fermer */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsModalOpen(false)}
                className="mx-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout aux favoris avec fond flouté */}
      {isAddToFavoritesOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setIsAddToFavoritesOpen(false)}
        >
          {/* Fond flouté */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Contenu centré */}
          <div 
            className="relative z-10 bg-background border border-border rounded-lg p-6 w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Ajouter aux Favoris</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsAddToFavoritesOpen(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label htmlFor="favorite-notes">Notes (optionnel)</Label>
                <Textarea
                  id="favorite-notes"
                  placeholder="Ajoutez des notes personnelles sur ce template..."
                  value={favoriteNotes}
                  onChange={(e) => setFavoriteNotes(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Ce template sera ajouté à vos favoris avec les paramètres actuels :</p>
                <div className="mt-2 space-y-1">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span className="font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddToFavoritesOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddToFavorites}>
                <Heart className="w-4 h-4 mr-2" />
                Ajouter aux Favoris
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 