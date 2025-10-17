# AB Forge Build Tool

Un outil de build moderne et performant pour les projets AB Forge, conçu avec Node.js et utilisant les dernières technologies JavaScript.

## 🚀 Fonctionnalités

- **Build moderne** : Utilise async/await et fs.promises pour des performances optimales
- **Système de plugins avancé** : Support complet pour CSS, HTML, JavaScript, SVG, JSON et images
- **Cache intelligent** : Évite les retraitements inutiles avec vérification des modifications
- **Gestion d'erreurs robuste** : Messages d'erreur clairs avec suggestions d'action
- **Mode watch** : Surveillance automatique des changements de fichiers
- **Transpilation Babel** : Support des fonctionnalités JavaScript modernes
- **Minification** : Optimisation automatique du code avec UglifyJS
- **Architecture modulaire** : Code organisé et maintenable
- **Configuration flexible** : Options personnalisables pour chaque type de fichier
- **Tests complets** : Couverture de test de 100% avec Vitest

## 📦 Installation

```bash
npm install
```

## 🛠️ Utilisation

### Mode Build (une seule fois)

```bash
npm run build <chemin-du-projet>
```

### Mode Watch (surveillance continue)

```bash
npm run start <chemin-du-projet>
```

### Mode Debug (sans minification)

```bash
npm run debug <chemin-du-projet>
```

### Création d'un nouveau test

```bash
npm run new <chemin-du-nouveau-test>
```

## 📋 Scripts npm disponibles

| Script | Commande | Description |
|--------|----------|-------------|
| `npm run new` | `ncp boilerplate` | Crée un nouveau test depuis le boilerplate |
| `npm run build` | `node ./index.js --build --dir` | Mode build (une seule fois) |
| `npm run start` | `nodemon ./index.js --dir` | Mode watch (surveillance continue) |
| `npm run debug` | `nodemon ./index.js --debug --dir` | Mode debug (sans minification) |
| `npm test` | `vitest` | Exécution des tests |
| `npm run test:run` | `vitest run` | Tests sans watch |
| `npm run test:coverage` | `vitest run --coverage` | Tests avec couverture |
| `npm run test:watch` | `vitest --watch` | Tests en mode surveillance |
| `npm run test:ui` | `vitest --ui` | Interface utilisateur des tests |

## 📁 Structure du projet

```
ab-forge/
├── src/
│   ├── config/           # Configuration centralisée
│   ├── errors/           # Classes d'erreurs personnalisées
│   ├── processors/       # Processeurs de fichiers
│   ├── plugins/          # Plugins pour différents types de fichiers
│   │   ├── base/         # Classe de base pour les plugins
│   │   ├── css/          # Plugin CSS avec PostCSS
│   │   ├── html/         # Plugin HTML avec minification
│   │   ├── js/           # Plugin JS pour inclusion de fichiers
│   │   ├── svg/          # Plugin SVG avec SVGO
│   │   ├── json/         # Plugin JSON avec validation
│   │   └── jpg/          # Plugin JPG avec conversion base64
│   └── utils/            # Utilitaires (filesystem, cache, erreurs)
├── tests/                # Tests unitaires et d'intégration
│   ├── unit/             # Tests unitaires
│   └── integration/      # Tests d'intégration
├── docs/                 # Documentation
└── index.js              # Point d'entrée principal
```

## 🔧 Configuration

### Structure de répertoires attendue

```
votre-projet/
├── src/                  # Fichiers de support (CSS, HTML, SVG, JS, etc.)
│   ├── css/              # Fichiers CSS
│   ├── html/             # Fichiers HTML
│   ├── svg/              # Fichiers SVG
│   ├── js/               # Fichiers JavaScript modulaires
│   ├── json/             # Fichiers JSON
│   └── jpg/              # Images JPG
├── dist/                 # Fichiers générés (créé automatiquement, ignoré par git)
└── *.js                  # Fichiers JavaScript sources
```

### Boilerplate complet

Le projet inclut un boilerplate complet dans le dossier `boilerplate/` qui démontre :
- **Tous les types de fichiers** supportés
- **Placeholders** pour chaque type
- **Code moderne** avec ES6+ et async/await
- **CSS responsive** avec PostCSS
- **JavaScript modulaire** avec utilitaires
- **Configuration JSON** structurée
- **Documentation** intégrée

### Types de fichiers supportés

- **JavaScript** (`.js`) : Fichiers sources principaux et modules
- **CSS** (`.css`) : Styles avec PostCSS (nesting, autoprefixer, minification)
- **HTML** (`.html`) : Templates avec minification avancée
- **SVG** (`.svg`) : Images vectorielles optimisées avec SVGO
- **JSON** (`.json`) : Données de configuration avec validation
- **Images** (`.jpg`) : Images raster converties en base64

## 🧪 Tests

### Couverture de test

- **86 tests** au total (100% de réussite)
- **Tests unitaires** : Composants individuels (fileSystem, cache, fileProcessor, plugins)
- **Tests d'intégration** : Processus de build complet
- **Tests de plugins** : Fonctionnalités spécifiques de chaque plugin

### Exécuter tous les tests

```bash
npm test
```

### Exécuter les tests avec couverture

```bash
npm run test:coverage
```

### Exécuter les tests en mode watch

```bash
npm run test:watch
```

### Interface utilisateur des tests

```bash
npm run test:ui
```

### Rapports de tests

Les rapports HTML sont générés dans le dossier `tests-report/` :
- **Rapport principal** : `tests-report/index.html`
- **Couverture de code** : `tests-report/coverage/`

Le dossier `tests-report/` est automatiquement ignoré par git.

## 🔌 Système de Plugins

### Plugins disponibles

#### **CSS Plugin**
- **PostCSS** avec nesting, autoprefixer et minification
- **Configuration** : `CONFIG.PLUGINS.CSS`
- **Options** : `minify`, `autoprefixer`, `nesting`

#### **HTML Plugin**
- **Minification** avancée avec html-minifier
- **Configuration** : `CONFIG.PLUGINS.HTML`
- **Options** : `minify`, `removeComments`, `collapseWhitespace`, etc.

#### **JavaScript Plugin**
- **Inclusion de fichiers** modulaires
- **Configuration** : `CONFIG.PLUGINS.JS`
- **Options** : `addDebugComments`, `addSeparators`

#### **SVG Plugin**
- **Optimisation** avec SVGO
- **Configuration** : `CONFIG.PLUGINS.SVG`
- **Options** : `optimize`, `removeMetadata`, `cleanupNumericValues`

#### **JSON Plugin**
- **Validation** et formatage
- **Configuration** : `CONFIG.PLUGINS.JSON`
- **Options** : `prettyPrint`

#### **JPG Plugin**
- **Conversion** en base64
- **Configuration** : `CONFIG.PLUGINS.JPG`
- **Options** : `mimeType`

### Utilisation des placeholders

```javascript
// Dans un fichier JavaScript principal
const css = `{{css/main}}`           // Remplace par le contenu de src/css/main.css
const html = `{{html/template}}`     // Remplace par le contenu de src/html/template.html
const icon = `{{svg/logo}}`          // Remplace par le contenu de src/svg/logo.svg
const data = `{{json/config}}`       // Remplace par le contenu de src/json/config.json
const image = `{{jpg/photo}}`        // Remplace par le contenu de src/jpg/photo.jpg

// Placeholders JavaScript - Nouvelle convention (recommandée)
/* {{js/helper}} */

// Ancienne convention (maintenue pour compatibilité)
const utils = `{{js/helper}}`        // Remplace par le contenu de src/js/helper.js
```

#### Convention des placeholders JavaScript

**Nouvelle convention (recommandée pour les nouveaux fichiers) :**
```javascript
/* {{js/nomDuFichier}} */
```

**Avantages :**
- ✅ Compatible avec Biome (pas de reformatage)
- ✅ Syntaxe JavaScript valide
- ✅ Pas d'erreurs de linting
- ✅ Préserve la nomenclature originale `{{js/utils}}`
- ✅ Facilement identifiable par le système de build

**Ancienne convention (maintenue pour compatibilité) :**
```javascript
{{js/nomDuFichier}}
```

**Note :** Les fichiers existants dans `ab-tests/` conservent l'ancienne convention pour maintenir la compatibilité. Seuls les nouveaux fichiers utilisent la nouvelle convention avec les commentaires multi-lignes.

## 📊 Architecture

### Composants principaux

1. **FileProcessor** : Traite les fichiers avec les plugins
2. **CacheManager** : Gère le cache pour optimiser les performances
3. **FileSystemUtils** : Utilitaires pour les opérations de fichiers
4. **ErrorHandler** : Gestion centralisée des erreurs
5. **ConfigValidator** : Validation de la configuration
6. **PluginRegistry** : Registre centralisé des plugins

### Flux de traitement

1. **Validation** : Vérification des arguments et chemins
2. **Scan** : Découverte des fichiers à traiter
3. **Filtrage** : Exclusion des fichiers non supportés
4. **Traitement** : Application des plugins
5. **Transpilation** : Transformation avec Babel
6. **Minification** : Optimisation avec UglifyJS
7. **Écriture** : Génération des fichiers de destination

## 🔍 Débogage

### Mode debug avec logs détaillés

```bash
npm run debug <projet>
```

### Variables d'environnement

```bash
NODE_ENV=development npm run start <projet>
```

### Logs détaillés

Le mode développement affiche :
- Stack traces complètes
- Informations de cache
- Statistiques de traitement

## 🚨 Gestion d'erreurs

### Types d'erreurs

- **ValidationError** : Erreurs de configuration
- **FileSystemError** : Erreurs d'accès aux fichiers
- **PluginError** : Erreurs de traitement des plugins
- **BuildError** : Erreurs de build générales

### Messages d'erreur

Chaque erreur inclut :
- Description claire du problème
- Fichier concerné (si applicable)
- Suggestion d'action
- Contexte d'opération

## 📚 Documentation

### Guides disponibles

- **[Guide des Plugins](PLUGINS.md)** : Documentation complète du système de plugins
- **[API Reference](API.md)** : Documentation technique de l'API
- **[README](README.md)** : Guide d'utilisation principal

### Ressources

- **Configuration** : Options personnalisables pour chaque plugin
- **Exemples** : Cas d'usage pratiques et exemples de code
- **Dépannage** : Solutions aux problèmes courants

## ⚡ Performance

### Optimisations

- **Cache intelligent** : Évite les retraitements
- **Traitement parallèle** : Fichiers traités simultanément
- **Vérification des modifications** : Hash MD5 pour détecter les changements
- **Filtrage précoce** : Exclusion des fichiers non supportés

### Métriques

- Temps de traitement
- Nombre de fichiers traités
- Utilisation mémoire
- Statistiques de cache

## 🔧 Développement

### Ajout d'un nouveau plugin

1. Créer le fichier plugin dans `src/plugins/<type>/index.js`
2. Exporter la fonction de traitement
3. Ajouter le type dans `src/plugins/index.js`
4. Créer les tests correspondants

### Structure d'un plugin

```javascript
export async function handleTypeFile(content, filePath, fileName, fileExt) {
    // Traitement du contenu
    return processedContent
}
```

## 📝 Changelog

### Version 3.0.0
- Renommage en AB Forge
- Migration vers async/await
- Système de cache intelligent
- Gestion d'erreurs améliorée
- Architecture modulaire
- Tests complets

### Version 2.0.0
- Support des plugins de base
- Mode watch et build

### Version 1.0.0
- Version initiale

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature
3. Ajouter les tests
4. Soumettre une pull request

## 📄 Licence

ISC License - Voir le fichier LICENSE pour plus de détails.
