#!/bin/bash

# Script de release pour Sterenova Studio Frontend
# Usage: ./release.sh [version] [message]

if [ $# -lt 2 ]; then
    echo "Usage: ./release.sh <version> <message>"
    echo "Example: ./release.sh v1.0.0 'Initial release'"
    exit 1
fi

VERSION=$1
MESSAGE=$2

echo "🚀 Création de la release Sterenova Studio Frontend $VERSION"
echo ""

# Vérifier que nous sommes sur la branche main
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  Vous n'êtes pas sur la branche main (actuellement sur $CURRENT_BRANCH)"
    echo "   Les releases doivent être créées depuis la branche main"
    exit 1
fi

# Vérifier que le working directory est clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Working directory non propre. Committez ou stashez vos changements d'abord."
    git status --short
    exit 1
fi

# Vérifier que le tag n'existe pas déjà
if git tag -l | grep -q "^$VERSION$"; then
    echo "❌ Le tag $VERSION existe déjà"
    exit 1
fi

echo "📋 Création du tag $VERSION avec le message: $MESSAGE"
echo ""

# Créer le tag
git tag -a "$VERSION" -m "$MESSAGE"

if [ $? -eq 0 ]; then
    echo "✅ Tag créé localement"
    
    # Pousser le tag
    echo "🚀 Poussage du tag vers GitHub..."
    git push origin "$VERSION"
    
    if [ $? -eq 0 ]; then
        echo "✅ Tag poussé vers GitHub"
        echo ""
        echo "🎉 Release Sterenova Studio Frontend $VERSION créée avec succès !"
        echo ""
        echo "📋 Prochaines étapes :"
        echo "1. La CI va automatiquement build et push l'image Docker Hub"
        echo "2. Image: sterenova/sterenova-frontend:$VERSION"
        echo "3. Coolify détectera la nouvelle image et redéploiera"
        echo ""
        echo "🔍 Suivez la CI : https://github.com/$(git config --get remote.origin.url | sed 's/.*github.com[:/]\([^/]*\/[^/]*\).*/\1/')/actions"
        echo ""
        echo "💡 N'oubliez pas de créer la même release dans le repo backend !"
    else
        echo "❌ Erreur lors du push du tag"
        exit 1
fi
else
    echo "❌ Erreur lors de la création du tag"
    exit 1
fi 