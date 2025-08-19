'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { DownloadHistory, DownloadHistoryStats } from '@/types/api';
import { apiService } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { 
  Download, 
  FileText, 
  Calendar, 
  Trash2, 
  RefreshCw,
  FileImage,
  Archive
} from 'lucide-react';
import { toast } from 'sonner';

export default function HistoryPage() {
  const { user } = useUser();
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);
  const [stats, setStats] = useState<DownloadHistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [history, historyStats] = await Promise.all([
        apiService.getDownloadHistoryByUser(user.id, 100),
        apiService.getDownloadHistoryStats(user.id)
      ]);
      
      setDownloadHistory(history);
      setStats(historyStats);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'historique:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const handleCleanup = async () => {
    if (!user) return;
    
    try {
      const result = await apiService.cleanupDownloadHistory(90);
      toast.success(`${result.deletedCount} anciens enregistrements supprimés`);
      fetchData(); // Recharger les données
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      toast.error('Erreur lors du nettoyage');
    }
  };

  const getFileIcon = (format: string) => {
    switch (format.toLowerCase()) {
      case 'svg':
        return <FileImage className="w-4 h-4" />;
      case 'zip':
        return <Archive className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getCategoryColor = (category: string) => {
    return category === 'post' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Historique des Téléchargements</h1>
          <p className="text-muted-foreground">
            Suivez tous vos téléchargements de templates et analysez vos statistiques d'utilisation
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Téléchargements</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalDownloads}</div>
                <p className="text-xs text-muted-foreground">
                  Tous les temps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Templates Uniques</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Object.keys(stats.downloadsByTemplate).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Templates différents utilisés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts</CardTitle>
                <div className="w-4 h-4 bg-blue-100 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.downloadsByCategory.post || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Téléchargements de posts
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stories</CardTitle>
                <div className="w-4 h-4 bg-purple-100 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.downloadsByCategory.story || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Téléchargements de stories
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <Button onClick={fetchData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={handleCleanup} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Nettoyer (90j+)
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="recent">Récents</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="stats">Statistiques</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Téléchargements Récents</CardTitle>
                <CardDescription>
                  Vos 100 derniers téléchargements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Chargement de l'historique...</p>
                  </div>
                ) : downloadHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Download className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Aucun téléchargement pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloadHistory.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(item.fileFormat)}
                          <div>
                            <p className="font-medium">{item.templateName}</p>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="secondary" className={getCategoryColor(item.templateCategory)}>
                                {item.templateCategory}
                              </Badge>
                              <span>•</span>
                              <span>{item.fileFormat.toUpperCase()}</span>
                              {item.fileSize && (
                                <>
                                  <span>•</span>
                                  <span>{formatFileSize(item.fileSize)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(item.downloadedAt)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Téléchargements de Posts</CardTitle>
                <CardDescription>
                  Historique des templates de posts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {downloadHistory.filter(item => item.templateCategory === 'post').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun téléchargement de post pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloadHistory
                      .filter(item => item.templateCategory === 'post')
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(item.fileFormat)}
                            <div>
                              <p className="font-medium">{item.templateName}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.fileFormat.toUpperCase()} • {formatDate(item.downloadedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stories" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Téléchargements de Stories</CardTitle>
                <CardDescription>
                  Historique des templates de stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                {downloadHistory.filter(item => item.templateCategory === 'story').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Aucun téléchargement de story pour le moment</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {downloadHistory
                      .filter(item => item.templateCategory === 'story')
                      .map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            {getFileIcon(item.fileFormat)}
                            <div>
                              <p className="font-medium">{item.templateName}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.fileFormat.toUpperCase()} • {formatDate(item.downloadedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Détaillées</CardTitle>
                <CardDescription>
                  Analyse de vos habitudes de téléchargement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats && (
                  <div className="space-y-6">
                    {/* Top Templates */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Templates les Plus Utilisés</h3>
                      <div className="space-y-2">
                        {Object.entries(stats.downloadsByTemplate)
                          .sort(([,a], [,b]) => b - a)
                          .slice(0, 10)
                          .map(([template, count]) => (
                            <div key={template} className="flex items-center justify-between p-2 border rounded">
                              <span className="font-medium">{template}</span>
                              <Badge variant="secondary">{count} téléchargements</Badge>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Category Breakdown */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Répartition par Catégorie</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {stats.downloadsByCategory.post || 0}
                          </div>
                          <p className="text-sm text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {stats.downloadsByCategory.story || 0}
                          </div>
                          <p className="text-sm text-muted-foreground">Stories</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </PageWrapper>
  );
} 