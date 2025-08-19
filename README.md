# Sterenova Studio Frontend

Interface Next.js moderne pour la génération de templates SVG Sterenova Studio.

## 🚀 Démarrage rapide

### Développement local

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# L'interface sera disponible sur http://localhost:3001
```

### Build et production

```bash
# Build de production
npm run build

# Démarrer en mode production
npm run start
```

## 🔄 CI/CD et Docker Hub

### Configuration requise

Dans votre repo GitHub → Settings → Secrets and variables → Actions, ajoutez :

```
DOCKER_USERNAME=votre_username_docker_hub
DOCKER_TOKEN=votre_access_token_docker_hub
```

### Workflow automatique

- **Push sur main/develop** → Build et push automatique sur Docker Hub
- **Tags** → Build et push avec version spécifique
- **Images générées** : `sterenova/sterenova-frontend:latest`

### Créer une release

```bash
# Créer une nouvelle version
./release.sh v1.0.0 "Description de la release"

# La CI fera automatiquement :
# 1. Build de l'image Docker
# 2. Push sur Docker Hub avec le tag v1.0.0
# 3. Coolify détectera et redéploiera
```

## 📦 Images Docker Hub

### Tags disponibles
- `latest` - Dernière version de la branche main
- `v1.0.0` - Version spécifique
- `main-<sha>` - Version de la branche main
- `develop-<sha>` - Version de la branche develop

### Utilisation avec Coolify

Dans Coolify, configurez l'application avec :
- **Image** : `sterenova/sterenova-frontend:latest`
- **Port** : 3001
- **Variables d'environnement** : Voir `env.local`

## 🔧 Configuration

### Variables d'environnement

#### Développement (`env.local`)
```
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

#### Production (Coolify)
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://sterenova-backend.votre-domaine.com/api
```

## 🎨 Interface utilisateur

### Fonctionnalités
- **Éditeur de templates** : Interface moderne et intuitive
- **Prévisualisation** : Aperçu en temps réel des templates
- **Gestion des favoris** : Sauvegarde des templates préférés
- **Historique** : Suivi des générations
- **Responsive** : Compatible mobile et desktop

### Technologies
- **Framework** : Next.js 14 (React)
- **Styling** : Tailwind CSS
- **Composants** : Shadcn/ui
- **État** : React Context + Hooks
- **API** : Fetch avec gestion d'erreurs

## 🔍 Monitoring

### Health Check
```bash
curl http://localhost:3001
# Réponse: Page HTML de l'application
```

### Logs
- **Développement** : Console du navigateur
- **Production** : Coolify logs

## 🚨 Dépannage

### Problèmes courants
1. **Port déjà utilisé** → Vérifiez qu'aucun autre service n'utilise le port 3001
2. **API non accessible** → Vérifiez que le backend fonctionne
3. **Variables d'environnement** → Vérifiez le fichier `env.local`

### Logs détaillés
```bash
# Mode debug
DEBUG=* npm run dev
```

### Vérification de l'API
```bash
# Tester la connexion avec le backend
curl http://localhost:3000/api/health
```

## 🏗️ Architecture

### Structure des composants
```
src/
├── app/           # Pages Next.js (App Router)
├── components/    # Composants React réutilisables
├── contexts/      # Contextes React (User, etc.)
├── hooks/         # Hooks personnalisés
├── lib/           # Utilitaires et configurations
├── services/      # Services API et externes
└── types/         # Types TypeScript
```

### Composants principaux
- **ModernTemplateEditor** : Éditeur principal des templates
- **ModernSidebar** : Navigation et sélection des templates
- **ModernHeader** : En-tête avec navigation
- **DataTable** : Affichage tabulaire des données

---

**🎯 Ce repo Sterenova Studio est configuré pour un déploiement automatique avec Coolify !**
