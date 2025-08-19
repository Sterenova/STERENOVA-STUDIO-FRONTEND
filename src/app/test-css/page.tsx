'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestCSSPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient-sterenova mb-4">
            Test CSS - Sterenova
          </h1>
          <p className="text-muted-foreground text-lg">
            Page de test pour vérifier que le CSS et les composants shadcn fonctionnent
          </p>
        </div>

        {/* Test du dégradé principal */}
        <Card className="bg-gradient-sterenova">
          <CardHeader>
            <CardTitle className="text-white">Dégradé Principal Sterenova</CardTitle>
            <CardDescription className="text-white/80">
              Votre dégradé personnalisé de noir à violet/magenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-white/90">
              Ce dégradé utilise vos couleurs : <code className="bg-white/20 px-2 py-1 rounded">oklch(0.205 0 0)</code> à <code className="bg-white/20 px-2 py-1 rounded">oklch(0.558 0.288 302.321)</code>
            </p>
          </CardContent>
        </Card>

        {/* Test des couleurs CSS variables */}
        <Card>
          <CardHeader>
            <CardTitle>Test des Variables CSS</CardTitle>
            <CardDescription>
              Vérification que les variables CSS de shadcn sont bien appliquées
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-background border border-border p-4 rounded-lg">
                <p className="text-foreground font-medium">Background</p>
                <p className="text-muted-foreground text-sm">bg-background</p>
              </div>
              <div className="bg-card border border-border p-4 rounded-lg">
                <p className="text-card-foreground font-medium">Card</p>
                <p className="text-muted-foreground text-sm">bg-card</p>
              </div>
              <div className="bg-primary p-4 rounded-lg">
                <p className="text-primary-foreground font-medium">Primary</p>
                <p className="text-primary-foreground/80 text-sm">bg-primary</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-secondary-foreground font-medium">Secondary</p>
                <p className="text-secondary-foreground/80 text-sm">bg-secondary</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des composants */}
        <Card>
          <CardHeader>
            <CardTitle>Test des Composants shadcn</CardTitle>
            <CardDescription>
              Vérification que tous les composants UI s&apos;affichent correctement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="test-input">Input de test</Label>
              <Input id="test-input" placeholder="Tapez quelque chose..." />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Bouton Principal</Button>
              <Button variant="secondary">Bouton Secondaire</Button>
              <Button variant="outline">Bouton Contour</Button>
              <Button variant="ghost">Bouton Fantôme</Button>
              <Button variant="destructive">Bouton Destructeur</Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Badge Default</Badge>
              <Badge variant="secondary">Badge Secondary</Badge>
              <Badge variant="outline">Badge Outline</Badge>
              <Badge variant="destructive">Badge Destructive</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test des dégradés */}
        <Card>
          <CardHeader>
            <CardTitle>Test des Dégradés Sterenova</CardTitle>
            <CardDescription>
              Différentes orientations de votre dégradé personnalisé
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-sterenova h-20 rounded-lg flex items-center justify-center">
                <p className="text-white font-medium">Dégradé Horizontal</p>
              </div>
              <div className="bg-gradient-sterenova-vertical h-20 rounded-lg flex items-center justify-center">
                <p className="text-white font-medium">Dégradé Vertical</p>
              </div>
              <div className="bg-gradient-sterenova-diagonal h-20 rounded-lg flex items-center justify-center">
                <p className="text-white font-medium">Dégradé Diagonal</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des couleurs personnalisées */}
        <Card>
          <CardHeader>
            <CardTitle>Test des Couleurs Sterenova</CardTitle>
            <CardDescription>
              Vérification des couleurs personnalisées de votre marque
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-primary p-4 rounded-lg">
                <p className="text-primary-foreground font-medium">Primary</p>
                <p className="text-primary-foreground/80 text-sm">Noir</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg">
                <p className="text-secondary-foreground font-medium">Secondary</p>
                <p className="text-secondary-foreground/80 text-sm">Violet/Magenta</p>
              </div>
              <div className="bg-accent p-4 rounded-lg">
                <p className="text-accent-foreground font-medium">Accent</p>
                <p className="text-accent-foreground/80 text-sm">Violet/Magenta</p>
              </div>
              <div className="bg-muted p-4 rounded-lg border">
                <p className="text-muted-foreground font-medium">Muted</p>
                <p className="text-muted-foreground/80 text-sm">Gris clair</p>
              </div>
              <div className="bg-destructive p-4 rounded-lg">
                <p className="text-white font-medium">Destructive</p>
                <p className="text-white/80 text-sm">Rouge</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test des animations */}
        <Card>
          <CardHeader>
            <CardTitle>Test des Animations</CardTitle>
            <CardDescription>
              Vérification des animations personnalisées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-primary p-4 rounded-lg animate-pulse">
                <p className="text-primary-foreground">Animation Pulse</p>
              </div>
              <div className="bg-secondary p-4 rounded-lg animate-bounce">
                <p className="text-secondary-foreground">Animation Bounce</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 