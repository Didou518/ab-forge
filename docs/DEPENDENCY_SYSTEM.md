# Système de Gestion des Dépendances

## Problème Résolu

Le système de build précédent régénérait tous les fichiers JS à chaque modification d'un fichier dans le répertoire `src/`, même si seul un fichier JS spécifique utilisait ce fichier modifié.

## Solution Implémentée

### 1. DependencyTracker (`src/utils/dependencyTracker.js`)

Un nouveau système de tracking des dépendances qui :

- **Analyse automatiquement** les placeholders `{{type/file}}` dans les fichiers JS
- **Mappe les dépendances** entre fichiers JS et leurs ressources (CSS, HTML, JSON, SVG, etc.)
- **Détecte les changements** dans les fichiers de dépendance
- **Identifie les fichiers JS affectés** par un changement spécifique

### 2. Régénération Sélective (`src/processors/fileProcessor.js`)

Modifications apportées :

- **Nouvelle méthode** `processSrcFileChange()` pour traiter uniquement les fichiers JS affectés
- **Vérification des dépendances** avant de régénérer un fichier JS
- **Messages informatifs** indiquant pourquoi un fichier est régénéré

### 3. Intégration dans le Watcher (`index.js`)

Le système de surveillance des fichiers a été amélioré pour :

- **Détecter le type de fichier modifié** (JS à la racine vs fichier dans `src/`)
- **Appliquer la régénération sélective** pour les fichiers dans `src/`
- **Conserver le comportement complet** pour les fichiers JS à la racine

## Fonctionnement

### Analyse des Dépendances

```javascript
// Exemple dans boilerplate/index.js
const styles = `{{css/main}}`        // → src/css/main.css
const template = `{{html/component}}` // → src/html/component.html
const config = `{{json/settings}}`    // → src/json/settings.json
```

Le système détecte automatiquement ces placeholders et établit les relations de dépendance.

### Régénération Intelligente

1. **Modification d'un fichier CSS** → Seul le fichier JS qui l'utilise est régénéré
2. **Modification d'un fichier HTML** → Seul le fichier JS qui l'utilise est régénéré
3. **Modification d'un fichier JS** → Régénération normale avec vérification des dépendances

### Messages de Log

```
📁 File changed: main.css
🔄 Regenerating 1 affected JS file(s)...
🔄 Regenerating due to dependency changes: index.js
✅ Successfully regenerated 1 file(s)
```

## Avantages

1. **Performance améliorée** : Régénération uniquement des fichiers nécessaires
2. **Feedback clair** : Messages explicites sur les raisons de la régénération
3. **Cache intelligent** : Évite les régénérations inutiles
4. **Extensibilité** : Facilement adaptable à de nouveaux types de fichiers

## Test du Système

Un script de test est disponible pour vérifier le fonctionnement :

```bash
node test-dependency-system.js
```

## Structure des Fichiers

```
src/
├── utils/
│   ├── dependencyTracker.js    # Nouveau : Gestion des dépendances
│   ├── cache.js               # Existant : Système de cache
│   └── fileSystem.js          # Existant : Utilitaires fichiers
├── processors/
│   └── fileProcessor.js       # Modifié : Régénération sélective
└── ...
```

## Configuration

Aucune configuration supplémentaire n'est nécessaire. Le système fonctionne automatiquement avec la structure existante des placeholders `{{type/file}}`.
