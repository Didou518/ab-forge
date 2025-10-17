# API Documentation

Documentation complète de l'API du AB Forge Build Tool.

## Table des matières

- [Configuration](#configuration)
- [FileProcessor](#fileprocessor)
- [CacheManager](#cachemanager)
- [FileSystemUtils](#filesystemutils)
- [ErrorHandler](#errorhandler)
- [ConfigValidator](#configvalidator)
- [Système de Plugins](#système-de-plugins)
- [Classes d'erreurs](#classes-derreurs)

## Configuration

### CONFIG

Configuration centralisée de l'application.

```javascript
import { CONFIG } from './src/config/index.js'
```

#### Propriétés

- **SUPPORTED_EXTENSIONS**: `string[]` - Extensions de fichiers supportées (`['js', 'css', 'html', 'svg', 'json', 'jpg']`)
- **DEFAULT_OPTIONS**: `Object` - Options par défaut
- **MESSAGES**: `Object` - Messages d'erreur et d'information
- **PLUGINS**: `Object` - Configuration des plugins (voir section dédiée)
- **WATCHER**: `Object` - Configuration du watcher
- **BABEL**: `Object` - Configuration Babel
- **UGLIFY**: `Object` - Configuration UglifyJS

#### Configuration des Plugins

```javascript
PLUGINS: {
  JS: {
    addDebugComments: false,    // Ajouter des commentaires de debug
    addSeparators: false        // Ajouter des séparateurs entre fichiers
  },
  CSS: {
    minify: true,               // Minification CSS
    autoprefixer: true,         // Ajout des préfixes navigateurs
    nesting: true               // Support du nesting CSS
  },
  HTML: {
    minify: true,               // Minification HTML
    removeComments: true,        // Suppression des commentaires
    removeAttributeQuotes: true, // Suppression des guillemets d'attributs
    collapseWhitespace: true,   // Compression des espaces
    collapseInlineTagWhitespace: true,
    minifyCSS: true,            // Minification du CSS inline
    minifyJS: true,             // Minification du JS inline
    removeRedundantAttributes: true,
    removeEmptyAttributes: true
  },
  SVG: {
    optimize: true,             // Optimisation SVG
    removeMetadata: true,       // Suppression des métadonnées
    removeViewBox: false,       // Conservation du viewBox
    cleanupNumericValues: true // Nettoyage des valeurs numériques
  },
  JSON: {
    prettyPrint: false          // Formatage JSON avec indentation
  },
  JPG: {
    mimeType: 'image/jpeg',     // Type MIME pour la conversion base64
    quality: 'original'         // Qualité de l'image (non utilisé actuellement)
  }
}
```

## FileProcessor

Classe principale pour le traitement des fichiers.

```javascript
import { FileProcessor } from './src/processors/fileProcessor.js'
```

### Constructeur

```javascript
new FileProcessor(plugins, options)
```

**Paramètres:**
- `plugins`: `Object` - Objet contenant les plugins disponibles
- `options`: `Object` - Options de configuration
  - `debug`: `boolean` - Mode debug (défaut: false)
  - `minify`: `boolean` - Activer la minification (défaut: true)

### Méthodes

#### processAllFiles(sourceDir, distDir, srcDir)

Traite tous les fichiers d'un répertoire.

**Paramètres:**
- `sourceDir`: `string` - Répertoire source
- `distDir`: `string` - Répertoire de destination
- `srcDir`: `string` - Répertoire des fichiers de support

**Retourne:** `Promise<void>`

**Exemple:**
```javascript
const processor = new FileProcessor(plugins, { debug: true })
await processor.processAllFiles('./src', './dist', './assets')
```

#### processFile(sourceFile, distDir, srcDir)

Traite un fichier individuel.

**Paramètres:**
- `sourceFile`: `string` - Fichier source
- `distDir`: `string` - Répertoire de destination
- `srcDir`: `string` - Répertoire des fichiers de support

**Retourne:** `Promise<void>`

#### getStats()

Obtient les statistiques de traitement.

**Retourne:** `Object`
- `processedFiles`: `number` - Nombre de fichiers traités
- `cacheStats`: `Object` - Statistiques du cache
- `options`: `Object` - Options utilisées

#### clearCache()

Vide le cache et les fichiers traités.

**Retourne:** `void`

#### hasBeenProcessed(filePath)

Vérifie si un fichier a été traité.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier

**Retourne:** `boolean`

## CacheManager

Gestionnaire de cache pour optimiser les performances.

```javascript
import { CacheManager } from './src/utils/cache.js'
```

### Constructeur

```javascript
new CacheManager()
```

### Méthodes statiques

#### generateCacheKey(filePath, operation)

Génère une clé de cache pour un fichier.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `operation`: `string` - Type d'opération (défaut: 'default')

**Retourne:** `string`

### Méthodes d'instance

#### isCacheValid(filePath, operation)

Vérifie si le cache est valide pour un fichier.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `operation`: `string` - Type d'opération

**Retourne:** `Promise<boolean>`

#### setCache(filePath, result, operation)

Met en cache le résultat d'une opération.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `result`: `any` - Résultat à mettre en cache
- `operation`: `string` - Type d'opération

**Retourne:** `Promise<void>`

#### getCache(filePath, operation)

Récupère un résultat du cache.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `operation`: `string` - Type d'opération

**Retourne:** `any`

#### invalidateCache(filePath, operation)

Invalide le cache pour un fichier.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `operation`: `string` - Type d'opération (optionnel)

**Retourne:** `void`

#### clearCache()

Vide tout le cache.

**Retourne:** `void`

#### getCacheStats()

Obtient les statistiques du cache.

**Retourne:** `Object`
- `size`: `number` - Taille du cache
- `timestampEntries`: `number` - Entrées de timestamp
- `hashEntries`: `number` - Entrées de hash
- `memoryUsage`: `Object` - Utilisation mémoire

## FileSystemUtils

Utilitaires pour les opérations de système de fichiers.

```javascript
import * as FileSystemUtils from './src/utils/fileSystem.js'
```

### Fonctions

#### ensureDirectoryExists(dirPath, createIfNotExists)

Vérifie si un répertoire existe et le crée si nécessaire.

**Paramètres:**
- `dirPath`: `string` - Chemin du répertoire
- `createIfNotExists`: `boolean` - Créer si n'existe pas (défaut: true)

**Retourne:** `Promise<boolean>`

#### readFile(filePath, encoding)

Lit un fichier de manière asynchrone.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `encoding`: `string` - Encodage (défaut: 'utf8')

**Retourne:** `Promise<string>`

#### writeFile(filePath, content, encoding)

Écrit un fichier de manière asynchrone.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier
- `content`: `string` - Contenu à écrire
- `encoding`: `string` - Encodage (défaut: 'utf8')

**Retourne:** `Promise<void>`

#### readDirectory(dirPath)

Lit le contenu d'un répertoire.

**Paramètres:**
- `dirPath`: `string` - Chemin du répertoire

**Retourne:** `Promise<string[]>`

#### getStats(filePath)

Obtient les informations sur un fichier/répertoire.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier/répertoire

**Retourne:** `Promise<import('fs').Stats>`

#### fileExists(filePath)

Vérifie si un fichier existe.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier

**Retourne:** `Promise<boolean>`

#### getAllFilesFromDirectory(dirPath, extensions, includeHidden)

Obtient tous les fichiers d'un répertoire de manière récursive.

**Paramètres:**
- `dirPath`: `string` - Chemin du répertoire
- `extensions`: `string[]` - Extensions à inclure (optionnel)
- `includeHidden`: `boolean` - Inclure les fichiers cachés (défaut: false)

**Retourne:** `Promise<string[]>`

#### getFileHash(filePath)

Obtient le hash MD5 d'un fichier.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier

**Retourne:** `Promise<string>`

## ErrorHandler

Gestionnaire d'erreurs centralisé.

```javascript
import { handleError, logError, logWarning } from './src/utils/errorHandler.js'
```

### Fonctions

#### handleError(error, context)

Gère les erreurs de manière centralisée.

**Paramètres:**
- `error`: `Error` - L'erreur à gérer
- `context`: `Object` - Contexte supplémentaire
  - `operation`: `string` - Type d'opération
  - `file`: `string` - Fichier concerné
  - `suggestion`: `string` - Suggestion d'action

**Retourne:** `void`

#### logError(message, details)

Affiche un message d'erreur avec formatage.

**Paramètres:**
- `message`: `string` - Message d'erreur
- `details`: `Object` - Détails supplémentaires
  - `file`: `string` - Fichier concerné
  - `line`: `number` - Numéro de ligne
  - `suggestion`: `string` - Suggestion d'action

**Retourne:** `void`

#### logWarning(message, details)

Affiche un avertissement avec formatage.

**Paramètres:**
- `message`: `string` - Message d'avertissement
- `details`: `Object` - Détails supplémentaires
  - `file`: `string` - Fichier concerné
  - `suggestion`: `string` - Suggestion d'action

**Retourne:** `void`

## ConfigValidator

Validateur de configuration.

```javascript
import { validateArgs, validateSourceFile, validateDestinationFile } from './src/config/validator.js'
```

### Fonctions

#### validateArgs(argv)

Valide et normalise les arguments de ligne de commande.

**Paramètres:**
- `argv`: `Object` - Arguments de yargs

**Retourne:** `Object`
- `workingDirectory`: `string` - Répertoire de travail validé
- `build`: `boolean` - Mode build
- `debug`: `boolean` - Mode debug
- `watch`: `boolean` - Mode watch
- `paths`: `Object` - Chemins validés

**Lance:** `ValidationError` si la validation échoue

#### validateSourceFile(filePath)

Valide un fichier source.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier

**Retourne:** `Object`
- `path`: `string` - Chemin du fichier
- `size`: `number` - Taille du fichier
- `modified`: `Date` - Date de modification
- `name`: `string` - Nom du fichier
- `extension`: `string` - Extension du fichier

**Lance:** `FileSystemError` ou `ValidationError` si la validation échoue

#### validateDestinationFile(filePath)

Valide un fichier de destination.

**Paramètres:**
- `filePath`: `string` - Chemin du fichier

**Retourne:** `Object`
- `path`: `string` - Chemin du fichier
- `directory`: `string` - Répertoire parent
- `name`: `string` - Nom du fichier
- `extension`: `string` - Extension du fichier

**Lance:** `FileSystemError` si la validation échoue

## Système de Plugins

### PluginRegistry

Registre centralisé des plugins disponibles.

```javascript
import plugins from './src/plugins/index.js'
```

#### Plugins disponibles

- **plugins.css**: Plugin CSS avec PostCSS
- **plugins.html**: Plugin HTML avec minification
- **plugins.js**: Plugin JavaScript pour inclusion de fichiers
- **plugins.svg**: Plugin SVG avec SVGO
- **plugins.json**: Plugin JSON avec validation
- **plugins.jpg**: Plugin JPG avec conversion base64

### Structure d'un Plugin

Chaque plugin suit la même structure :

```javascript
async function handlePluginFile(data, file, fileName, fileExt) {
  try {
    const response = await getPluginOutput(file)
    return replaceContent(data, fileName, fileExt, response)
  } catch (error) {
    throw new PluginError(`Plugin failed for ${file}: ${error.message}`, fileExt, file)
  }
}
```

### CSS Plugin

Traitement des fichiers CSS avec PostCSS.

```javascript
import { handleCssFile } from './src/plugins/css/index.js'
```

**Fonctionnalités:**
- Nesting CSS
- Autoprefixer automatique
- Minification avec cssnano
- Configuration via `CONFIG.PLUGINS.CSS`

### HTML Plugin

Minification avancée des fichiers HTML.

```javascript
import { handleHtmlFile } from './src/plugins/html/index.js'
```

**Fonctionnalités:**
- Minification complète
- Suppression des commentaires
- Compression des espaces
- Minification du CSS/JS inline
- Configuration via `CONFIG.PLUGINS.HTML`

### JavaScript Plugin

Inclusion de fichiers JavaScript modulaires.

```javascript
import { handleJsFile } from './src/plugins/js/index.js'
```

**Fonctionnalités:**
- Lecture et inclusion de fichiers JS
- Support des commentaires de debug
- Séparateurs entre fichiers
- Configuration via `CONFIG.PLUGINS.JS`

### SVG Plugin

Optimisation des fichiers SVG avec SVGO.

```javascript
import { handleSvgFile } from './src/plugins/svg/index.js'
```

**Fonctionnalités:**
- Optimisation automatique
- Suppression des métadonnées
- Nettoyage des valeurs numériques
- Configuration via `CONFIG.PLUGINS.SVG`

### JSON Plugin

Validation et formatage des fichiers JSON.

```javascript
import { handleJsonFile } from './src/plugins/json/index.js'
```

**Fonctionnalités:**
- Validation de la syntaxe JSON
- Formatage avec indentation optionnelle
- Configuration via `CONFIG.PLUGINS.JSON`

### JPG Plugin

Conversion des images JPG en base64.

```javascript
import { handleJpgFile } from './src/plugins/jpg/index.js'
```

**Fonctionnalités:**
- Conversion en base64
- Support des types MIME personnalisés
- Configuration via `CONFIG.PLUGINS.JPG`

### BasePlugin

Classe de base pour créer de nouveaux plugins.

```javascript
import { BasePlugin } from './src/plugins/base/BasePlugin.js'
```

**Méthodes:**
- `constructor(name)`: Initialise le plugin
- `handle(data, file, fileName, fileExt)`: Méthode principale à implémenter
- `execute(pluginLogic, ...args)`: Wrapper pour la gestion d'erreurs

## Classes d'erreurs

### BuildError

Erreur de build générale.

```javascript
import { BuildError } from './src/errors/CustomError.js'
```

**Propriétés:**
- `name`: `string` - 'BuildError'
- `filePath`: `string` - Chemin du fichier concerné
- `originalError`: `Error` - Erreur originale
- `timestamp`: `string` - Timestamp de l'erreur

### ValidationError

Erreur de validation de configuration.

```javascript
import { ValidationError } from './src/errors/CustomError.js'
```

**Propriétés:**
- `name`: `string` - 'ValidationError'
- `field`: `string` - Champ concerné
- `value`: `any` - Valeur invalide
- `timestamp`: `string` - Timestamp de l'erreur

### FileSystemError

Erreur de système de fichiers.

```javascript
import { FileSystemError } from './src/errors/CustomError.js'
```

**Propriétés:**
- `name`: `string` - 'FileSystemError'
- `filePath`: `string` - Chemin du fichier concerné
- `operation`: `string` - Opération qui a échoué
- `timestamp`: `string` - Timestamp de l'erreur

### PluginError

Erreur de plugin.

```javascript
import { PluginError } from './src/errors/CustomError.js'
```

**Propriétés:**
- `name`: `string` - 'PluginError'
- `pluginName`: `string` - Nom du plugin
- `filePath`: `string` - Chemin du fichier concerné
- `timestamp`: `string` - Timestamp de l'erreur

## Exemples d'utilisation

### Traitement de base

```javascript
import { FileProcessor } from './src/processors/fileProcessor.js'
import plugins from './src/plugins/index.js'

const processor = new FileProcessor(plugins, {
    debug: true,
    minify: false
})

await processor.processAllFiles('./src', './dist', './assets')
```

### Gestion d'erreurs

```javascript
import { handleError } from './src/utils/errorHandler.js'

try {
    // Opération risquée
} catch (error) {
    handleError(error, {
        operation: 'file processing',
        suggestion: 'Check file permissions'
    })
}
```

### Validation de configuration

```javascript
import { validateArgs } from './src/config/validator.js'

try {
    const config = validateArgs(argv)
    console.log('Configuration valide:', config)
} catch (error) {
    console.error('Erreur de configuration:', error.message)
}
```

### Utilisation du cache

```javascript
import { CacheManager } from './src/utils/cache.js'

const cache = new CacheManager()

// Vérifier si le cache est valide
if (await cache.isCacheValid(filePath, 'read')) {
    const data = cache.getCache(filePath, 'read')
    return data
}

// Traiter et mettre en cache
const result = await processFile(filePath)
await cache.setCache(filePath, result, 'read')
```
