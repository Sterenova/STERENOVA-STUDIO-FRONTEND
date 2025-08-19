'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { SvgSetting } from '@/types/api';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw,
  Palette,
  Type,
  Ruler,
  Globe,
  User,
  Save,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user } = useUser();
  const [userSettings, setUserSettings] = useState<SvgSetting[]>([]);
  const [globalSettings, setGlobalSettings] = useState<SvgSetting[]>([]);
  const [mergedSettings, setMergedSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('user');
  const [editingSetting, setEditingSetting] = useState<SvgSetting | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newSettingData, setNewSettingData] = useState({
    settingKey: '',
    settingName: '',
    description: '',
    value: '',
    valueType: 'string' as 'string' | 'number' | 'boolean' | 'object' | 'array',
    category: '',
    priority: 0
  });

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [userSettingsData, globalSettingsData, mergedSettingsData] = await Promise.all([
        apiService.getSvgSettingsByUser(user.id),
        apiService.getGlobalSvgSettings(),
        apiService.getMergedSvgSettings(user.id)
      ]);
      
      setUserSettings(userSettingsData);
      setGlobalSettings(globalSettingsData);
      setMergedSettings(mergedSettingsData);
    } catch (error) {
      console.error('Erreur lors du chargement des paramètres:', error);
      toast.error('Erreur lors du chargement des paramètres');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSetting = async () => {
    if (!user || !newSettingData.settingKey || !newSettingData.settingName) return;
    
    try {
      // Convertir la valeur selon le type
      let parsedValue: any = newSettingData.value;
      switch (newSettingData.valueType) {
        case 'number':
          parsedValue = parseFloat(newSettingData.value);
          break;
        case 'boolean':
          parsedValue = newSettingData.value === 'true';
          break;
        case 'object':
        case 'array':
          try {
            parsedValue = JSON.parse(newSettingData.value);
          } catch {
            toast.error('Format JSON invalide pour ce type');
            return;
          }
          break;
      }

      const newSetting = await apiService.createSvgSetting({
        ...newSettingData,
        value: parsedValue,
        userId: user.id,
        isGlobal: false
      });
      
      setUserSettings(prev => [newSetting, ...prev]);
      setIsAddDialogOpen(false);
      setNewSettingData({
        settingKey: '',
        settingName: '',
        description: '',
        value: '',
        valueType: 'string',
        category: '',
        priority: 0
      });
      
      // Recharger les paramètres fusionnés
      const newMergedSettings = await apiService.getMergedSvgSettings(user.id);
      setMergedSettings(newMergedSettings);
      
      toast.success('Paramètre créé avec succès');
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast.error('Erreur lors de la création');
    }
  };

  const handleUpdateSetting = async (setting: SvgSetting) => {
    if (!user) return;
    
    try {
      const updatedSetting = await apiService.updateSvgSetting(
        setting.id,
        {
          settingName: setting.settingName,
          description: setting.description,
          value: setting.value,
          valueType: setting.valueType,
          category: setting.category,
          priority: setting.priority
        },
        user.id
      );
      
      setUserSettings(prev => prev.map(s => s.id === setting.id ? updatedSetting : s));
      setEditingSetting(null);
      
      // Recharger les paramètres fusionnés
      const newMergedSettings = await apiService.getMergedSvgSettings(user.id);
      setMergedSettings(newMergedSettings);
      
      toast.success('Paramètre mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleRemoveSetting = async (settingId: string) => {
    if (!user) return;
    
    try {
      await apiService.removeSvgSetting(settingId, user.id);
      setUserSettings(prev => prev.filter(s => s.id !== settingId));
      
      // Recharger les paramètres fusionnés
      const newMergedSettings = await apiService.getMergedSvgSettings(user.id);
      setMergedSettings(newMergedSettings);
      
      toast.success('Paramètre supprimé');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCreateDefaults = async () => {
    if (!user) return;
    
    try {
      await apiService.createDefaultSvgSettings(user.id);
      await fetchData(); // Recharger toutes les données
      toast.success('Paramètres par défaut créés');
    } catch (error) {
      console.error('Erreur lors de la création des paramètres par défaut:', error);
      toast.error('Erreur lors de la création des paramètres par défaut');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dimensions':
        return <Ruler className="w-4 h-4" />;
      case 'typography':
        return <Type className="w-4 h-4" />;
      case 'colors':
        return <Palette className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'dimensions':
        return 'bg-blue-100 text-blue-800';
      case 'typography':
        return 'bg-green-100 text-green-800';
      case 'colors':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (value: any, valueType: string) => {
    switch (valueType) {
      case 'boolean':
        return value ? 'Oui' : 'Non';
      case 'object':
      case 'array':
        return JSON.stringify(value, null, 2);
      default:
        return String(value);
    }
  };

  const renderValueInput = (setting: SvgSetting) => {
    switch (setting.valueType) {
      case 'boolean':
        return (
          <select
            className="w-full p-2 border rounded-md"
            value={setting.value ? 'true' : 'false'}
            onChange={(e) => setEditingSetting(prev => prev ? { ...prev, value: e.target.value === 'true' } : null)}
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        );
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => setEditingSetting(prev => prev ? { ...prev, value: parseFloat(e.target.value) || 0 } : null)}
          />
        );
      case 'object':
      case 'array':
        return (
          <textarea
            className="w-full p-2 border rounded-md font-mono text-sm"
            rows={3}
            value={JSON.stringify(setting.value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                setEditingSetting(prev => prev ? { ...prev, value: parsed } : null);
              } catch {
                // Ignore les erreurs de parsing pendant la saisie
              }
            }}
          />
        );
      default:
        return (
          <Input
            value={setting.value}
            onChange={(e) => setEditingSetting(prev => prev ? { ...prev, value: e.target.value } : null)}
          />
        );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Chargement...</h2>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Paramètres SVG</h1>
          <p className="text-muted-foreground">
            Personnalisez vos paramètres par défaut et gérez la configuration globale des templates
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={handleCreateDefaults} variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Créer les Paramètres par Défaut
            </Button>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Paramètre
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Créer un Nouveau Paramètre</DialogTitle>
                <DialogDescription>
                  Ajoutez un paramètre personnalisé pour vos templates
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Clé du paramètre</Label>
                  <Input
                    placeholder="ex: customWidth"
                    value={newSettingData.settingKey}
                    onChange={(e) => setNewSettingData(prev => ({ ...prev, settingKey: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Nom affiché</Label>
                  <Input
                    placeholder="ex: Largeur personnalisée"
                    value={newSettingData.settingName}
                    onChange={(e) => setNewSettingData(prev => ({ ...prev, settingName: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    placeholder="Description du paramètre..."
                    value={newSettingData.description}
                    onChange={(e) => setNewSettingData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type de valeur</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={newSettingData.valueType}
                      onChange={(e) => setNewSettingData(prev => ({ ...prev, valueType: e.target.value as any }))}
                    >
                      <option value="string">Texte</option>
                      <option value="number">Nombre</option>
                      <option value="boolean">Booléen</option>
                      <option value="object">Objet</option>
                      <option value="array">Tableau</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Catégorie</Label>
                    <Input
                      placeholder="ex: dimensions"
                      value={newSettingData.category}
                      onChange={(e) => setNewSettingData(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Valeur</Label>
                  <Input
                    placeholder="Valeur du paramètre"
                    value={newSettingData.value}
                    onChange={(e) => setNewSettingData(prev => ({ ...prev, value: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleCreateSetting} disabled={!newSettingData.settingKey || !newSettingData.settingName}>
                  Créer
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="user">
              <User className="w-4 h-4 mr-2" />
              Mes Paramètres ({userSettings.length})
            </TabsTrigger>
            <TabsTrigger value="global">
              <Globe className="w-4 h-4 mr-2" />
              Paramètres Globaux ({globalSettings.length})
            </TabsTrigger>
            <TabsTrigger value="merged">
              <Settings className="w-4 h-4 mr-2" />
              Paramètres Fusionnés
            </TabsTrigger>
          </TabsList>

          <TabsContent value="user" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mes Paramètres Personnalisés</CardTitle>
                <CardDescription>
                  Paramètres spécifiques à votre compte qui remplacent les paramètres globaux
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement des paramètres...</p>
                  </div>
                ) : userSettings.length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Aucun paramètre personnalisé</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Créer votre premier paramètre
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userSettings.map((setting) => (
                      <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(setting.category || 'general')}
                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-medium">{setting.settingName}</h3>
                              <Badge variant="secondary" className={getCategoryColor(setting.category || 'general')}>
                                {setting.category || 'général'}
                              </Badge>
                              <Badge variant="outline">{setting.valueType}</Badge>
                            </div>
                            {setting.description && (
                              <p className="text-sm text-muted-foreground">{setting.description}</p>
                            )}
                            <p className="text-sm font-mono bg-muted p-1 rounded mt-1">
                              {formatValue(setting.value, setting.valueType)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSetting(setting)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveSetting(setting.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="global" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Globaux</CardTitle>
                <CardDescription>
                  Paramètres système utilisés par tous les utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement des paramètres globaux...</p>
                  </div>
                ) : globalSettings.length === 0 ? (
                  <div className="text-center py-8">
                    <Globe className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun paramètre global configuré</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {globalSettings.map((setting) => (
                      <div key={setting.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                        {getCategoryIcon(setting.category || 'general')}
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{setting.settingName}</h3>
                            <Badge variant="secondary" className={getCategoryColor(setting.category || 'general')}>
                              {setting.category || 'général'}
                            </Badge>
                            <Badge variant="outline">{setting.valueType}</Badge>
                          </div>
                          {setting.description && (
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          )}
                          <p className="text-sm font-mono bg-muted p-1 rounded mt-1">
                            {formatValue(setting.value, setting.valueType)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="merged" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres Fusionnés</CardTitle>
                <CardDescription>
                  Vue combinée de tous vos paramètres (globaux + personnalisés)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement des paramètres fusionnés...</p>
                  </div>
                ) : Object.keys(mergedSettings).length === 0 ? (
                  <div className="text-center py-8">
                    <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun paramètre disponible</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(mergedSettings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-medium">{key}</h3>
                          <p className="text-sm font-mono bg-muted p-1 rounded mt-1">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Dialog */}
        {editingSetting && (
          <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le Paramètre</DialogTitle>
                <DialogDescription>
                  Modifiez la valeur et les propriétés de votre paramètre
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label>Nom affiché</Label>
                  <Input
                    value={editingSetting.settingName}
                    onChange={(e) => setEditingSetting(prev => prev ? { ...prev, settingName: e.target.value } : null)}
                  />
                </div>
                
                <div>
                  <Label>Description</Label>
                  <Input
                    value={editingSetting.description || ''}
                    onChange={(e) => setEditingSetting(prev => prev ? { ...prev, description: e.target.value } : null)}
                  />
                </div>
                
                <div>
                  <Label>Catégorie</Label>
                  <Input
                    value={editingSetting.category || ''}
                    onChange={(e) => setEditingSetting(prev => prev ? { ...prev, category: e.target.value } : null)}
                  />
                </div>
                
                <div>
                  <Label>Valeur</Label>
                  {renderValueInput(editingSetting)}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingSetting(null)}>
                  <X className="w-4 h-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={() => handleUpdateSetting(editingSetting)}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
        </div>
      </div>
    </PageWrapper>
  );
} 