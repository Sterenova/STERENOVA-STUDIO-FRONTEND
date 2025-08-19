'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Copy, 
  Palette, 
  Settings, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { toast } from 'sonner';

interface TemplateEditorProps {
  template: TemplateInfo;
}

export function TemplateEditor({ template }: TemplateEditorProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedSvg, setGeneratedSvg] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('editor');

  // Initialiser les valeurs par défaut
  useEffect(() => {
    const defaults: Record<string, string> = {};
    template.placeholders.forEach(placeholder => {
      if (placeholder.defaultValue) {
        defaults[placeholder.key] = placeholder.defaultValue;
      }
    });
    setFormData(defaults);
  }, [template]);

  const handleInputChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateSvg = async () => {
    setIsGenerating(true);
    try {
      const svg = await apiService.generateTemplate(
        template.category,
        template.name,
        formData
      );
      setGeneratedSvg(svg);
      toast.success('Template généré avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
      toast.error('Erreur lors de la génération du template');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadSvg = () => {
    if (!generatedSvg) return;
    
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template téléchargé !');
  };

  const copySvgCode = async () => {
    if (!generatedSvg) return;
    
    try {
      await navigator.clipboard.writeText(generatedSvg);
      toast.success('Code SVG copié dans le presse-papiers !');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="container mx-auto p-6">
        {/* En-tête du template */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.displayName}</h1>
              <p className="text-gray-600">{template.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="px-3 py-1">
              {template.category === 'post' ? 'Post' : 'Story'}
            </Badge>
            <Badge variant="secondary" className="px-3 py-1 font-mono">
              {template.dimensions.width}×{template.dimensions.height}
            </Badge>
            <div className="flex space-x-1">
              {template.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panneau d'édition */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <span>Édition du Template</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {template.placeholders.map((placeholder) => (
                  <div key={placeholder.key} className="space-y-2">
                    <Label htmlFor={placeholder.key} className="text-sm font-medium">
                      {placeholder.description}
                      {placeholder.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </Label>
                    <Input
                      id={placeholder.key}
                      placeholder={placeholder.example}
                      value={formData[placeholder.key] || ''}
                      onChange={(e) => handleInputChange(placeholder.key, e.target.value)}
                      className="h-10"
                    />
                    {placeholder.defaultValue && (
                      <p className="text-xs text-gray-500">
                        Valeur par défaut : {placeholder.defaultValue}
                      </p>
                    )}
                  </div>
                ))}
                
                <Button 
                  onClick={generateSvg} 
                  disabled={isGenerating}
                  className="w-full h-11"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Générer le Template
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={downloadSvg} disabled={!generatedSvg}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger SVG
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={copySvgCode} disabled={!generatedSvg}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le Code
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Palette className="h-4 w-4 mr-2" />
                  Personnaliser les Couleurs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Prévisualisation */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Prévisualisation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedSvg ? (
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div 
                        className="mx-auto"
                        style={{
                          width: template.dimensions.width > template.dimensions.height ? '100%' : 'auto',
                          height: template.dimensions.height > template.dimensions.width ? '400px' : 'auto'
                        }}
                        dangerouslySetInnerHTML={{ __html: generatedSvg }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Dimensions : {template.dimensions.width} × {template.dimensions.height}px
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Aucun template généré</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Remplissez les champs et cliquez sur "Générer" pour voir le résultat
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations du template */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Catégorie</span>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tags</span>
                  <div className="flex space-x-1">
                    {template.tags.slice(0, 2).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Placeholders</span>
                  <span className="text-sm font-medium">{template.placeholders.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 