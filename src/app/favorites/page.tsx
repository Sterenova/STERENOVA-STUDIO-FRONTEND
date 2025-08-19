'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { FavoriteTemplate, TemplateInfo } from '@/types/api';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { 
  Heart, 
  Star, 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  FileText,
  Image,
  Settings,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

export default function FavoritesPage() {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<FavoriteTemplate[]>([]);
  const [templates, setTemplates] = useState<TemplateInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [editingFavorite, setEditingFavorite] = useState<FavoriteTemplate | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFavoriteData, setNewFavoriteData] = useState({
    templateName: '',
    templateCategory: 'post' as 'post' | 'story',
    defaultParameters: {},
    notes: ''
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
      const [favoritesData, templatesData] = await Promise.all([
        apiService.getFavoriteTemplatesByUser(user.id),
        apiService.getTemplatesList()
      ]);
      
      setFavorites(favoritesData);
      setTemplates(templatesData.templates);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (!user || !newFavoriteData.templateName) return;
    
    try {
      const newFavorite = await apiService.createFavoriteTemplate({
        ...newFavoriteData,
        userId: user.id
      });
      
      setFavorites(prev => [newFavorite, ...prev]);
      setIsAddDialogOpen(false);
      setNewFavoriteData({
        templateName: '',
        templateCategory: 'post',
        defaultParameters: {},
        notes: ''
      });
      toast.success('Template ajouté aux favoris');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      toast.error('Erreur lors de l\'ajout aux favoris');
    }
  };

  const handleUpdateFavorite = async (favorite: FavoriteTemplate) => {
    if (!user) return;
    
    try {
      const updatedFavorite = await apiService.updateFavoriteTemplate(
        favorite.id,
        {
          defaultParameters: favorite.defaultParameters,
          notes: favorite.notes
        },
        user.id
      );
      
      setFavorites(prev => prev.map(f => f.id === favorite.id ? updatedFavorite : f));
      setEditingFavorite(null);
      toast.success('Favori mis à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (!user) return;
    
    try {
      await apiService.removeFavoriteTemplate(favoriteId, user.id);
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success('Template retiré des favoris');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleIncrementUsage = async (favoriteId: string) => {
    if (!user) return;
    
    try {
      await apiService.incrementFavoriteUsage(favoriteId, user.id);
      setFavorites(prev => prev.map(f => 
        f.id === favoriteId ? { ...f, usageCount: f.usageCount + 1 } : f
      ));
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation:', error);
    }
  };

  const filteredFavorites = favorites.filter(favorite => {
    const matchesSearch = favorite.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         favorite.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || favorite.templateCategory === activeTab;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    return category === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const getCategoryIcon = (category: string) => {
    return category === 'post' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Mes Templates Favoris</h1>
          <p className="text-muted-foreground">
            Accédez rapidement à vos templates préférés et personnalisez vos paramètres par défaut
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Favoris</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favorites.length}</div>
              <p className="text-xs text-muted-foreground">
                Templates favoris
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts</CardTitle>
              <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {favorites.filter(f => f.templateCategory === 'post').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Templates de posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Stories</CardTitle>
              <div className="w-4 h-4 bg-purple-100 rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {favorites.filter(f => f.templateCategory === 'story').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Templates de stories
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter aux Favoris
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un Template aux Favoris</DialogTitle>
                <DialogDescription>
                  Sélectionnez un template et personnalisez vos paramètres par défaut
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={newFavoriteData.templateName}
                    onChange={(e) => setNewFavoriteData(prev => ({ ...prev, templateName: e.target.value }))}
                  >
                    <option value="">Sélectionner un template</option>
                    {templates.map(template => (
                      <option key={template.key} value={template.name}>
                        {template.displayName} ({template.category})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Catégorie</label>
                  <select
                    className="w-full mt-1 p-2 border rounded-md"
                    value={newFavoriteData.templateCategory}
                    onChange={(e) => setNewFavoriteData(prev => ({ ...prev, templateCategory: e.target.value as 'post' | 'story' }))}
                  >
                    <option value="post">Post</option>
                    <option value="story">Story</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Notes (optionnel)</label>
                  <Textarea
                    placeholder="Ajoutez des notes personnelles..."
                    value={newFavoriteData.notes}
                    onChange={(e) => setNewFavoriteData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddToFavorites} disabled={!newFavoriteData.templateName}>
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Tabs */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Rechercher dans vos favoris..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">Tous ({favorites.length})</TabsTrigger>
              <TabsTrigger value="post">Posts ({favorites.filter(f => f.templateCategory === 'post').length})</TabsTrigger>
              <TabsTrigger value="story">Stories ({favorites.filter(f => f.templateCategory === 'story').length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Favorites List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des favoris...</p>
          </div>
        ) : filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucun favori trouvé</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || activeTab !== 'all' 
                  ? 'Aucun favori ne correspond à vos critères'
                  : 'Vous n\'avez pas encore de templates favoris'
                }
              </p>
              {!searchQuery && activeTab === 'all' && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter votre premier favori
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(favorite.templateCategory)}
                      <Badge variant="secondary" className={getCategoryColor(favorite.templateCategory)}>
                        {favorite.templateCategory}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingFavorite(favorite)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFavorite(favorite.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{favorite.templateName}</CardTitle>
                  <CardDescription>
                    Utilisé {favorite.usageCount} fois
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {favorite.notes && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {favorite.notes}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="w-3 h-3" />
                      <span>Favori depuis {new Date(favorite.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleIncrementUsage(favorite.id)}
                    >
                      Utiliser
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        {editingFavorite && (
          <Dialog open={!!editingFavorite} onOpenChange={() => setEditingFavorite(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Modifier le Favori</DialogTitle>
                <DialogDescription>
                  Modifiez les paramètres et notes de votre template favori
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Notes</label>
                  <Textarea
                    placeholder="Ajoutez des notes personnelles..."
                    value={editingFavorite.notes || ''}
                    onChange={(e) => setEditingFavorite(prev => prev ? { ...prev, notes: e.target.value } : null)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingFavorite(null)}>
                  Annuler
                </Button>
                <Button onClick={() => handleUpdateFavorite(editingFavorite)}>
                  Mettre à jour
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