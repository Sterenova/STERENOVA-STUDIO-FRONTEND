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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Star
} from 'lucide-react';
import { TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface ModernTemplateEditorProps {
  template: TemplateInfo;
}

export function ModernTemplateEditor({ template }: ModernTemplateEditorProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedSvg, setGeneratedSvg] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculer la taille optimale de la prévisualisation
  const getPreviewSize = () => {
    const { width, height } = template.dimensions;
    const maxWidth = 350; // Largeur maximale de la card
    const maxHeight = 350; // Hauteur maximale de la card
    
    // Calculer le ratio pour que l'image tienne dans la card
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    
    return {
      width: Math.floor(width * ratio),
      height: Math.floor(height * ratio),
      ratio
    };
  };

  // Calculer la taille pour la modal (plus grande)
  const getModalSize = () => {
    const { width, height } = template.dimensions;
    const maxWidth = 800; // Largeur maximale de la modal
    const maxHeight = 600; // Hauteur maximale de la modal
    
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    
    return {
      width: Math.floor(width * ratio),
      height: Math.floor(height * ratio),
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
  }, [template]);

  const generateTemplateWithData = async (data: Record<string, string>) => {
    setIsGenerating(true);
    try {
      const svg = await apiService.generateTemplate(template.category, template.name, data);
      setGeneratedSvg(svg);
    } catch (error) {
      console.error('Erreur lors de la génération automatique:', error);
      // Ne pas afficher d'erreur pour la génération automatique
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const generateTemplate = async () => {
    await generateTemplateWithData(formData);
    toast.success('Template généré avec succès !');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedSvg);
      toast.success('SVG copié dans le presse-papiers !');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace('.svg', '')}_generated.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Template téléchargé !');
  };

  const resetForm = () => {
    const defaults: Record<string, string> = {};
    template.placeholders.forEach(placeholder => {
      if (placeholder.defaultValue) {
        defaults[placeholder.key] = placeholder.defaultValue;
      }
    });
    setFormData(defaults);
    setGeneratedSvg('');
    toast.info('Formulaire réinitialisé');
  };

  return (
    <TooltipProvider>
      <div className="flex-1 p-6 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center">
                    <div className="w-12 h-12 bg-gradient-sterenova rounded-xl flex items-center justify-center">
                      {template.category === 'post' ? (
                        <Square className="h-6 w-6 text-white" />
                      ) : template.category === 'story' ? (
                        <Star className="h-6 w-6 text-white" />
                      ) : (
                        <Layers className="h-6 w-6 text-white" />
                      )}
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">{template.displayName}</h1>
                    <p className="text-muted-foreground">{template.description}</p>
                    {isGenerating && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Loader2 className="h-4 w-4 text-primary animate-spin" />
                        <span className="text-sm text-primary font-medium">Génération automatique en cours...</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    {template.category}
                  </Badge>
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-border">
                    {template.dimensions.width}×{template.dimensions.height}
                  </Badge>
                  <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary/20">
                    {template.placeholders.length} placeholders
                  </Badge>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={resetForm}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Réinitialiser
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showPreview ? 'Masquer' : 'Afficher'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Formulaire */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="h-5 w-5" />
                    <span>Configuration du Template</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {template.placeholders.map((placeholder) => (
                    <div key={placeholder.key} className="space-y-2">
                      <Label htmlFor={placeholder.key} className="flex items-center space-x-2">
                        <span className="font-medium">{placeholder.description}</span>
                        {placeholder.required && (
                          <Badge variant="destructive" className="text-xs">Requis</Badge>
                        )}
                      </Label>
                      <Input
                        id={placeholder.key}
                        value={formData[placeholder.key] || ''}
                        onChange={(e) => handleInputChange(placeholder.key, e.target.value)}
                        placeholder={placeholder.example || placeholder.description}
                        className="w-full"
                      />
                      {placeholder.example && (
                        <p className="text-xs text-muted-foreground">
                          Exemple: {placeholder.example}
                        </p>
                      )}
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={generateTemplate} 
                      disabled={isGenerating}
                      className="flex-1"
                    >
                      {isGenerating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Zap className="h-4 w-4 mr-2" />
                      )}
                      {isGenerating ? 'Génération...' : 'Générer le Template'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              {generatedSvg && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileImage className="h-5 w-5" />
                      <span>Actions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" onClick={copyToClipboard} className="w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        Copier SVG
                      </Button>
                      <Button variant="outline" onClick={downloadSvg} className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Prévisualisation */}
            {showPreview && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="h-5 w-5" />
                        <span>Prévisualisation</span>
                      </CardTitle>
                      {generatedSvg && (
                        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Maximize2 className="h-4 w-4 mr-2" />
                              Agrandir
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl w-full h-[80vh]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center space-x-2">
                                <Eye className="h-5 w-5" />
                                <span>Prévisualisation - {template.displayName}</span>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
                              <div
                                className="bg-muted rounded-lg p-6 border-2 border-dashed border-border overflow-hidden"
                                style={{
                                  width: 'fit-content',
                                  height: 'fit-content'
                                }}
                              >
                                <div
                                  style={{
                                    width: `${modalSize.width}px`,
                                    height: `${modalSize.height}px`,
                                    maxWidth: '100%',
                                    maxHeight: '100%'
                                  }}
                                  dangerouslySetInnerHTML={{ 
                                    __html: generatedSvg.replace(
                                      '<svg',
                                      `<svg style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain; transform-origin: center center;" preserveAspectRatio="xMidYMid meet"`
                                    )
                                  }}
                                />
                              </div>
                            </div>
                            <div className="text-center pt-4 border-t border-border">
                              <p className="text-sm text-muted-foreground">
                                Dimensions: {template.dimensions.width}×{template.dimensions.height}
                              </p>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {generatedSvg ? (
                      <div className="space-y-4">
                        <div className="bg-muted rounded-lg p-4 border-2 border-dashed border-border overflow-hidden">
                          <div 
                            className="mx-auto overflow-hidden flex items-center justify-center"
                            style={{ 
                              width: '100%',
                              height: 'auto',
                              minHeight: '200px',
                              maxHeight: '400px'
                            }}
                          >
                            <div
                              className="overflow-hidden w-full h-full flex items-center justify-center"
                              style={{
                                width: '100%',
                                height: '100%'
                              }}
                            >
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{
                                  width: `${previewSize.width}px`,
                                  height: `${previewSize.height}px`,
                                  maxWidth: '100%',
                                  maxHeight: '100%'
                                }}
                                dangerouslySetInnerHTML={{ 
                                  __html: generatedSvg.replace(
                                    '<svg',
                                    `<svg style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; object-fit: contain; transform-origin: center center;" preserveAspectRatio="xMidYMid meet"`
                                  )
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">
                            Dimensions: {template.dimensions.width}×{template.dimensions.height} 
                            (Prévisualisation: {previewSize.width}×{previewSize.height})
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        {isGenerating ? (
                          <>
                            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                            <h3 className="text-lg font-medium text-foreground mb-2">Génération en cours...</h3>
                            <p className="text-muted-foreground">Création de la prévisualisation avec les valeurs par défaut</p>
                          </>
                        ) : (
                          <>
                            <FileImage className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">Aucune prévisualisation</h3>
                            <p className="text-muted-foreground">Configurez le template et cliquez sur "Générer" pour voir le résultat</p>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Informations du Template */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Info className="h-5 w-5" />
                      <span>Informations</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-foreground">Catégorie</p>
                        <p className="text-muted-foreground">{template.category}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Dimensions</p>
                        <p className="text-muted-foreground">{template.dimensions.width}×{template.dimensions.height}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Placeholders</p>
                        <p className="text-muted-foreground">{template.placeholders.length}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Tags</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
} 