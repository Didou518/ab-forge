# Guide des Plugins

Guide complet du système de plugins du AB Forge Build Tool.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Architecture des plugins](#architecture-des-plugins)
- [Plugins disponibles](#plugins-disponibles)
- [Configuration](#configuration)
- [Utilisation des placeholders](#utilisation-des-placeholders)
- [Création de plugins personnalisés](#création-de-plugins-personnalisés)
- [Exemples pratiques](#exemples-pratiques)

## Vue d'ensemble

Le système de plugins permet de traiter différents types de fichiers et d'intégrer leur contenu dans vos fichiers JavaScript principaux. Chaque plugin est spécialisé dans un type de fichier spécifique et peut être configuré individuellement.

### Fonctionnalités principales

- ✅ **6 plugins intégrés** : CSS, HTML, JavaScript, SVG, JSON, JPG
- ✅ **Configuration flexible** : Options personnalisables par plugin
- ✅ **Gestion d'erreurs robuste** : Messages d'erreur clairs et informatifs
- ✅ **Architecture modulaire** : Facilement extensible
- ✅ **Performance optimisée** : Cache intelligent et traitement asynchrone

## Architecture des plugins

### Structure générale

```
src/plugins/
├── index.js              # Registre central des plugins
├── base/
│   └── BasePlugin.js     # Classe de base pour nouveaux plugins
├── css/index.js          # Plugin CSS avec PostCSS
├── html/index.js         # Plugin HTML avec minification
├── js/index.js           # Plugin JavaScript pour inclusion
├── svg/index.js          # Plugin SVG avec SVGO
├── json/index.js         # Plugin JSON avec validation
└── jpg/index.js          # Plugin JPG avec conversion base64
```

### Flux de traitement

1. **Découverte** : Scan des fichiers dans le répertoire `src/`
2. **Filtrage** : Exclusion des fichiers cachés et sans extension
3. **Traitement** : Application du plugin correspondant à l'extension
4. **Remplacement** : Substitution des placeholders par le contenu traité
5. **Intégration** : Injection du contenu dans le fichier principal

## Plugins disponibles

### 🎨 CSS Plugin

**Extension** : `.css`
**Technologie** : PostCSS
**Fichier** : `src/plugins/css/index.js`

#### Fonctionnalités

- **Nesting CSS** : Support de la syntaxe imbriquée
- **Autoprefixer** : Ajout automatique des préfixes navigateurs
- **Minification** : Compression avec cssnano
- **Validation** : Vérification de la syntaxe CSS

#### Configuration

```javascript
CONFIG.PLUGINS.CSS = {
  minify: true,           // Minification CSS
  autoprefixer: true,     // Préfixes navigateurs
  nesting: true          // Support du nesting
}
```

#### Exemple d'utilisation

```javascript
// Dans votre fichier principal
const styles = `{{css/main}}`

// Remplace par le contenu traité de src/css/main.css
```

### 🌐 HTML Plugin

**Extension** : `.html`
**Technologie** : html-minifier
**Fichier** : `src/plugins/html/index.js`

#### Fonctionnalités

- **Minification complète** : Compression HTML optimisée
- **Suppression des commentaires** : Nettoyage automatique
- **Compression des espaces** : Réduction de la taille
- **Minification inline** : CSS et JavaScript inline optimisés

#### Configuration

```javascript
CONFIG.PLUGINS.HTML = {
  minify: true,                    // Minification HTML
  removeComments: true,            // Suppression des commentaires
  removeAttributeQuotes: true,     // Suppression des guillemets
  collapseWhitespace: true,         // Compression des espaces
  collapseInlineTagWhitespace: true,
  minifyCSS: true,                 // Minification CSS inline
  minifyJS: true,                  // Minification JS inline
  removeRedundantAttributes: true,
  removeEmptyAttributes: true
}
```

#### Exemple d'utilisation

```javascript
// Dans votre fichier principal
const template = `{{html/header}}`

// Remplace par le contenu minifié de src/html/header.html
```

### 📜 JavaScript Plugin

**Extension** : `.js`
**Technologie** : fs.promises
**Fichier** : `src/plugins/js/index.js`

#### Fonctionnalités

- **Inclusion de fichiers** : Intégration de modules JavaScript
- **Commentaires de debug** : Ajout optionnel de commentaires
- **Séparateurs** : Ajout de séparateurs entre fichiers
- **Validation** : Vérification de l'existence des fichiers

#### Configuration

```javascript
CONFIG.PLUGINS.JS = {
  addDebugComments: false,  // Commentaires de debug
  addSeparators: false      // Séparateurs entre fichiers
}
```

#### Exemple d'utilisation

```javascript
// Dans votre fichier principal
const utils = `{{js/helper}}`
const api = `{{js/apiClient}}`

// Remplace par le contenu de src/js/helper.js et src/js/apiClient.js
```

### 🎯 SVG Plugin

**Extension** : `.svg`
**Technologie** : SVGO
**Fichier** : `src/plugins/svg/index.js`

#### Fonctionnalités

- **Optimisation automatique** : Réduction de la taille
- **Suppression des métadonnées** : Nettoyage des données inutiles
- **Nettoyage des valeurs** : Optimisation des attributs numériques
- **Conservation du viewBox** : Préservation des dimensions

#### Configuration

```javascript
CONFIG.PLUGINS.SVG = {
  optimize: true,             // Optimisation SVG
  removeMetadata: true,       // Suppression des métadonnées
  removeViewBox: false,       // Conservation du viewBox
  cleanupNumericValues: true  // Nettoyage des valeurs numériques
}
```

#### Exemple d'utilisation

```javascript
// Dans votre fichier principal
const icon = `{{svg/logo}}`

// Remplace par le contenu optimisé de src/svg/logo.svg
```

### 📄 JSON Plugin

**Extension** : `.json`
**Technologie** : JSON.parse/stringify
**Fichier** : `src/plugins/json/index.js`

#### Fonctionnalités

- **Validation de syntaxe** : Vérification du JSON valide
- **Formatage optionnel** : Indentation personnalisable
- **Minification** : Compression par défaut
- **Gestion d'erreurs** : Messages clairs pour JSON invalide

#### Configuration

```javascript
CONFIG.PLUGINS.JSON = {
  prettyPrint: false  // Formatage avec indentation
}
```

#### Exemple d'utilisation

```javascript
// Dans votre fichier principal
const config = `{{json/settings}}`

// Remplace par le contenu validé de src/json/settings.json
```

### 🖼️ JPG Plugin

**Extension** : `.jpg`
**Technologie** : Buffer + base64
**Fichier** : `src/plugins/jpg/index.js`

#### Fonctionnalités

- **Conversion base64** : Transformation en chaîne encodée
- **Types MIME personnalisés** : Support de différents formats
- **Intégration directe** : Injection dans le code JavaScript
- **Optimisation** : Compression automatique

#### Configuration

```javascript
CONFIG.PLUGINS.JPG = {
  mimeType: 'image/jpeg',  // Type MIME
  quality: 'original'      // Qualité (non utilisé actuellement)
}
```

#### Exemple d'utilisation

```javascript
// Dans votre fichier principal
const image = `{{jpg/photo}}`

// Remplace par: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
```

## Configuration

### Configuration globale

Tous les plugins sont configurés dans `src/config/index.js` :

```javascript
export const CONFIG = {
  // Extensions supportées
  SUPPORTED_EXTENSIONS: ['js', 'css', 'html', 'svg', 'json', 'jpg'],

  // Configuration des plugins
  PLUGINS: {
    JS: { /* options JS */ },
    CSS: { /* options CSS */ },
    HTML: { /* options HTML */ },
    SVG: { /* options SVG */ },
    JSON: { /* options JSON */ },
    JPG: { /* options JPG */ }
  }
}
```

### Personnalisation des options

Vous pouvez modifier les options dans le fichier de configuration :

```javascript
// Désactiver la minification CSS
CONFIG.PLUGINS.CSS.minify = false

// Activer le formatage JSON
CONFIG.PLUGINS.JSON.prettyPrint = true

// Ajouter des commentaires de debug JS
CONFIG.PLUGINS.JS.addDebugComments = true
```

## Utilisation des placeholders

### Syntaxe des placeholders

La syntaxe des placeholders suit le pattern : `{{extension/nomFichier}}`

```javascript
// Exemples de placeholders
const css = `{{css/main}}`           // src/css/main.css
const html = `{{html/template}}`     // src/html/template.html
const js = `{{js/utils}}`            // src/js/utils.js
const svg = `{{svg/icon}}`           // src/svg/icon.svg
const json = `{{json/config}}`       // src/json/config.json
const jpg = `{{jpg/image}}`          // src/jpg/image.jpg
```

### Règles importantes

1. **Nom de fichier sans extension** : Utilisez seulement le nom, pas l'extension
2. **Extension en minuscules** : Toujours en minuscules dans le placeholder
3. **Sensibilité à la casse** : Respectez la casse exacte des noms de fichiers
4. **Fichiers obligatoires** : Le fichier doit exister dans le répertoire `src/`

### Exemples d'utilisation

#### Exemple complet du boilerplate
```javascript
// Import de tous les types de fichiers
const styles = `{{css/main}}`
const template = `{{html/component}}`
const config = `{{json/settings}}`
const icon = `{{svg/logo}}`
const image = `{{jpg/hero}}`
{{js/utils}}

// Utilisation des données
const settings = JSON.parse(config)
const container = document.createElement('div')
container.innerHTML = template
container.innerHTML = container.innerHTML
  .replace('{{icon}}', icon)
  .replace('{{image}}', image)
  .replace('{{title}}', settings.title)
  .replace('{{description}}', settings.description)
```

#### Fichier principal (main.js)
```javascript
// Inclusion de styles
const styles = `{{css/main}}`
const styleTag = document.createElement('style')
styleTag.innerHTML = styles
document.head.appendChild(styleTag)

// Inclusion de template HTML
const template = `{{html/header}}`
document.body.insertAdjacentHTML('afterbegin', template)

// Inclusion de modules JavaScript
const utils = `{{js/helper}}`
const api = `{{js/apiClient}}`

// Inclusion d'icônes SVG
const icon = `{{svg/logo}}`
document.querySelector('.logo').innerHTML = icon

// Inclusion de données JSON
const config = `{{json/settings}}`
const settings = JSON.parse(config)

// Inclusion d'images
const image = `{{jpg/photo}}`
document.querySelector('.photo').src = image
```

## Création de plugins personnalisés

### Utilisation de BasePlugin

```javascript
import { BasePlugin } from '../base/BasePlugin.js'

class CustomPlugin extends BasePlugin {
  constructor() {
    super('custom')
  }

  async handle(data, file, fileName, fileExt) {
    return this.execute(async () => {
      // Logique du plugin
      const content = await this.processFile(file)
      return this.replaceContent(data, fileName, fileExt, content)
    }, data, file, fileName, fileExt)
  }

  async processFile(filePath) {
    // Traitement spécifique du fichier
    return processedContent
  }
}
```

### Structure recommandée

```javascript
// src/plugins/custom/index.js
import fs from 'node:fs/promises'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'
import { PluginError } from '../../errors/CustomError.js'

async function handleCustomFile(data, file, fileName, fileExt) {
  try {
    const response = await getCustomOutput(file)
    return replaceContent(data, fileName, fileExt, response)
  } catch (error) {
    throw new PluginError(`Custom plugin failed for ${file}: ${error.message}`, 'custom', file)
  }
}

async function getCustomOutput(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8')

    // Traitement spécifique basé sur CONFIG.PLUGINS.CUSTOM
    let processedContent = content

    if (CONFIG.PLUGINS.CUSTOM.option1) {
      processedContent = processWithOption1(processedContent)
    }

    return processedContent
  } catch (error) {
    throw new Error(`Custom processing failed for ${filePath}: ${error.message}`)
  }
}

export { handleCustomFile }
```

### Enregistrement du plugin

```javascript
// src/plugins/index.js
import { handleCustomFile } from './custom/index.js'

const plugins = {
  // ... autres plugins
  custom: handleCustomFile
}
```

## Exemples pratiques

### Projet A/B Testing

```javascript
// variation1.js
let logoraTemplate = `{{html/logora}}`

// Styles CSS
const css = `{{css/main}}`
const styleTag = document.createElement('style')
styleTag.id = 'AB_style'
styleTag.innerHTML = css
document.querySelector('head').insertAdjacentElement('beforeend', styleTag)

// Modules JavaScript
{{js/getFromDatalayer}}
{{js/computeLogoraData}}
{{js/computeResults}}

// Configuration JSON
const config = `{{json/settings}}`
const settings = JSON.parse(config)

// Icône SVG
const icon = `{{svg/logo}}`

// Image JPG
const image = `{{jpg/photo}}`
```

### Structure de fichiers

```
project/
├── src/
│   ├── css/
│   │   └── main.css          # Styles principaux
│   ├── html/
│   │   └── logora.html       # Template HTML
│   ├── js/
│   │   ├── getFromDatalayer.js
│   │   ├── computeLogoraData.js
│   │   └── computeResults.js
│   ├── svg/
│   │   └── logo.svg          # Icône SVG
│   ├── json/
│   │   └── settings.json     # Configuration
│   └── jpg/
│       └── photo.jpg         # Image
├── variation1.js             # Fichier principal
└── dist/
    └── variation1.js         # Fichier généré
```

### Résultat final

Le fichier `dist/variation1.js` contiendra :

```javascript
let logoraTemplate = `<div class="logora">...</div>`

// Styles CSS traités
const css = `.logora{color:#333;font-size:14px}`
const styleTag = document.createElement('style')
styleTag.id = 'AB_style'
styleTag.innerHTML = css
document.querySelector('head').insertAdjacentElement('beforeend', styleTag)

// Modules JavaScript inclus
function getFromDataLayer(key) { /* ... */ }
function computeLogoraData(data) { /* ... */ }
function computeResults(debate, element) { /* ... */ }

// Configuration JSON parsée
const config = `{"apiUrl":"https://api.example.com","timeout":5000}`
const settings = JSON.parse(config)

// Icône SVG optimisée
const icon = `<svg viewBox="0 0 100 100"><path d="..."/></svg>`

// Image JPG en base64
const image = `data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...`
```

## Dépannage

### Erreurs courantes

#### Plugin non trouvé
```
Error: Plugin js failed for /path/to/file.js: Plugin not found
```
**Solution** : Vérifiez que le plugin est enregistré dans `src/plugins/index.js`

#### Fichier source manquant
```
Error: JS plugin failed for /path/to/file.js: File not found
```
**Solution** : Vérifiez que le fichier existe dans le répertoire `src/js/`

#### Placeholder mal formé
```
Warning: No supported files found in /path/to/src
```
**Solution** : Vérifiez la syntaxe des placeholders : `{{extension/nomFichier}}`

### Debug des plugins

Activez le mode debug pour plus d'informations :

```bash
# Mode debug avec logs détaillés
npm run debug <projet>

# Avec variables d'environnement
NODE_ENV=development npm run start <projet>
```

Cela affichera :
- Les fichiers traités par chaque plugin
- Les erreurs détaillées avec stack traces
- Les statistiques de traitement
