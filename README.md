# 🎨 Sterenova Frontend - Interface de Génération de Templates

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+ 
- npm ou yarn
- Backend Sterenova en cours d'exécution sur `http://localhost:3000`

### Installation
```bash
# Installer les dépendances
npm install

# Créer le fichier .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local

# Démarrer le serveur de développement
npm run dev
```

L'application sera accessible sur `http://localhost:3001`

## 🏗️ Architecture

### Structure des Composants
```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          # Sidebar principale (desktop)
│   │   └── MobileSidebar.tsx    # Sidebar mobile responsive
│   └── editor/
│       └── TemplateEditor.tsx   # Éditeur de templates
├── services/
│   └── api.ts                   # Service API pour communiquer avec le backend
├── types/
│   └── api.ts                   # Types TypeScript pour l'API
└── app/
    └── page.tsx                 # Page principale
```

### Composants Principaux

#### **Sidebar** (`Sidebar.tsx`)
- Navigation entre templates (Posts/Stories)
- Recherche de templates par nom ou tags
- Filtrage par catégorie
- Actions rapides (Palette, Téléchargement, Configuration)

#### **TemplateEditor** (`TemplateEditor.tsx`)
- Formulaire dynamique basé sur les placeholders du template
- Aperçu en temps réel du SVG généré
- Gestion des erreurs et validation
- Boutons d'action (Générer, Reset, Télécharger, Copier le code)

#### **MobileSidebar** (`MobileSidebar.tsx`)
- Version mobile de la sidebar utilisant Sheet
- Navigation tactile optimisée
- Fermeture automatique après sélection

## 🎯 Fonctionnalités

### **Gestion des Templates**
- ✅ Liste complète des templates disponibles
- ✅ Filtrage par catégorie (Posts/Stories)
- ✅ Recherche intelligente par nom et tags
- ✅ Métadonnées complètes (dimensions, descriptions, tags)

### **Édition de Templates**
- ✅ Formulaire dynamique basé sur les placeholders
- ✅ Valeurs par défaut automatiques
- ✅ Validation des champs requis
- ✅ Aperçu en temps réel

### **Génération et Export**
- ✅ Génération de SVG personnalisés
- ✅ Téléchargement des fichiers générés
- ✅ Copie du code SVG dans le presse-papiers
- ✅ Gestion des erreurs de génération

### **Interface Responsive**
- ✅ Design adaptatif (desktop, tablette, mobile)
- ✅ Sidebar mobile avec Sheet
- ✅ Layout flexible selon la taille d'écran
- ✅ Navigation tactile optimisée

## 🔧 Configuration

### Variables d'Environnement
Créez un fichier `.env.local` à la racine du projet :

```bash
# URL de l'API backend
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Nom de l'application
NEXT_PUBLIC_APP_NAME=Sterenova

# Version de l'application
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Personnalisation des Thèmes
L'application utilise shadcn/ui avec Tailwind CSS. Modifiez les variables CSS dans `src/app/globals.css` pour personnaliser les couleurs et thèmes.

## 📱 Utilisation

### **1. Sélection d'un Template**
- Parcourez la sidebar pour voir tous les templates disponibles
- Utilisez les onglets pour filtrer par catégorie (Posts/Stories)
- Recherchez un template spécifique avec la barre de recherche
- Cliquez sur un template pour le sélectionner

### **2. Édition du Template**
- Remplissez les champs du formulaire selon vos besoins
- Les champs requis sont marqués avec un badge rouge
- Utilisez les valeurs par défaut ou personnalisez complètement
- Cliquez sur "Générer" pour créer le SVG

### **3. Aperçu et Export**
- Visualisez le résultat dans le panneau de droite
- Utilisez "Copier le code" pour récupérer le SVG
- Cliquez sur "Télécharger" pour sauvegarder le fichier
- Utilisez "Reset" pour revenir aux valeurs par défaut

## 🎨 Personnalisation

### Ajout de Nouveaux Composants
```bash
# Installer un nouveau composant shadcn/ui
npx shadcn@latest add [component-name]

# Exemple
npx shadcn@latest add tooltip
```

### Modification des Styles
- Utilisez les classes Tailwind CSS pour personnaliser l'apparence
- Modifiez les composants dans `src/components/ui/`
- Ajustez les variables CSS dans `src/app/globals.css`

## 🚀 Déploiement

### Build de Production
```bash
# Construire l'application
npm run build

# Démarrer en mode production
npm start
```

### Variables d'Environnement de Production
```bash
# URL de l'API en production
NEXT_PUBLIC_API_URL=https://api.votre-domaine.com/api
```

## 🔍 Dépannage

### Problèmes Courants

#### **L'API ne répond pas**
- Vérifiez que le backend est démarré sur `http://localhost:3000`
- Vérifiez la variable `NEXT_PUBLIC_API_URL` dans `.env.local`
- Consultez la console du navigateur pour les erreurs

#### **Templates non chargés**
- Vérifiez la connexion à l'API
- Vérifiez que le backend a bien démarré
- Consultez les logs du backend

#### **Erreurs de génération**
- Vérifiez que tous les champs requis sont remplis
- Consultez la réponse de l'API dans la console
- Vérifiez les logs du backend

## 📚 Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Documentation shadcn/ui](https://ui.shadcn.com/)
- [Documentation de l'API Backend](../backend/README.md)

## 🤝 Contribution

Pour contribuer au développement :
1. Créez une branche pour votre fonctionnalité
2. Développez et testez localement
3. Soumettez une pull request
4. Assurez-vous que tous les tests passent

---

**Sterenova Frontend** - Interface moderne et responsive pour la génération de templates SVG 🎨
