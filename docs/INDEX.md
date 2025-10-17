# Documentation Index

Index complet de la documentation du AB Forge Build Tool.

## 📚 Guides principaux

### [README.md](README.md)
Guide d'utilisation principal avec :
- Installation et configuration
- Utilisation de base et avancée
- Structure du projet
- Gestion d'erreurs
- Performance et optimisation

### [PLUGINS.md](PLUGINS.md)
Guide complet du système de plugins avec :
- Vue d'ensemble de l'architecture
- Documentation détaillée de chaque plugin
- Configuration et personnalisation
- Exemples pratiques d'utilisation
- Création de plugins personnalisés

### [API.md](API.md)
Documentation technique de l'API avec :
- Configuration centralisée
- Classes et méthodes principales
- Système de plugins
- Classes d'erreurs
- Référence complète des APIs

## 📋 Ressources supplémentaires

### [CHANGELOG.md](../CHANGELOG.md)
Historique des modifications avec :
- Nouvelles fonctionnalités
- Améliorations et corrections
- Changements de configuration
- Migration et compatibilité

## 🚀 Démarrage rapide

### Installation
```bash
npm install
```

### Utilisation de base
```bash
# Mode build (une seule fois)
npm run build <projet>

# Mode watch (surveillance continue)
npm run start <projet>

# Mode debug (sans minification)
npm run debug <projet>

# Création d'un nouveau test
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

### Tests
```bash
# Tous les tests
npm test

# Avec couverture
npm run test:coverage

# Interface utilisateur
npm run test:ui
```

## 🔌 Plugins disponibles

| Plugin | Extension | Technologie | Fonctionnalités |
|--------|-----------|-------------|-----------------|
| **CSS** | `.css` | PostCSS | Nesting, autoprefixer, minification |
| **HTML** | `.html` | html-minifier | Minification avancée |
| **JavaScript** | `.js` | fs.promises | Inclusion de fichiers modulaires |
| **SVG** | `.svg` | SVGO | Optimisation automatique |
| **JSON** | `.json` | JSON.parse/stringify | Validation et formatage |
| **JPG** | `.jpg` | Buffer + base64 | Conversion en base64 |

## 📖 Exemples d'utilisation

### Placeholders
```javascript
const css = `{{css/main}}`           // Styles CSS
const html = `{{html/template}}`     // Template HTML
const js = `{{js/utils}}`            // Module JavaScript
const svg = `{{svg/icon}}`           // Icône SVG
const json = `{{json/config}}`       // Configuration JSON
const jpg = `{{jpg/image}}`          // Image JPG
```

### Structure de projet
```
votre-projet/
├── src/
│   ├── css/              # Fichiers CSS
│   ├── html/             # Fichiers HTML
│   ├── js/               # Modules JavaScript
│   ├── svg/              # Images SVG
│   ├── json/             # Données JSON
│   └── jpg/              # Images JPG
├── dist/                 # Fichiers générés
└── *.js                  # Fichiers sources principaux
```

## 🛠️ Configuration

### Options principales
```javascript
CONFIG.PLUGINS = {
  CSS: { minify: true, autoprefixer: true, nesting: true },
  HTML: { minify: true, removeComments: true, /* ... */ },
  JS: { addDebugComments: false, addSeparators: false },
  SVG: { optimize: true, removeMetadata: true, /* ... */ },
  JSON: { prettyPrint: false },
  JPG: { mimeType: 'image/jpeg' }
}
```

## 🧪 Tests

### Couverture
- **86 tests** au total (100% de réussite)
- **Tests unitaires** : Composants individuels
- **Tests d'intégration** : Processus complet
- **Tests de plugins** : Fonctionnalités spécifiques

### Commandes
```bash
npm test              # Tous les tests
npm run test:run      # Tests sans watch
npm run test:coverage # Avec couverture
npm run test:watch    # Mode surveillance
npm run test:ui       # Interface graphique
```

### Rapports
Les rapports de tests sont générés dans `tests-report/` :
- **Rapport HTML** : `tests-report/index.html`
- **Couverture** : `tests-report/coverage/`
- **Ignoré par git** : Le dossier est automatiquement exclu du versioning

## 🚨 Support et dépannage

### Erreurs courantes
- **Plugin non trouvé** : Vérifiez l'enregistrement dans `src/plugins/index.js`
- **Fichier manquant** : Vérifiez l'existence dans le répertoire `src/`
- **Placeholder mal formé** : Utilisez `{{extension/nomFichier}}`

### Debug
```bash
# Mode debug avec logs détaillés
npm run debug <projet>

# Avec variables d'environnement
NODE_ENV=development npm run start <projet>
```

### Logs détaillés
Le mode développement affiche :
- Stack traces complètes
- Informations de cache
- Statistiques de traitement

## 📊 Performance

### Optimisations
- **Cache intelligent** : Évite les retraitements
- **Traitement asynchrone** : Amélioration des performances I/O
- **Filtrage précoce** : Exclusion des fichiers non supportés
- **Traitement parallèle** : Fichiers traités simultanément

### Métriques
- Temps de traitement
- Nombre de fichiers traités
- Utilisation mémoire
- Statistiques de cache

## 🔗 Liens utiles

- **Repository** : [GitHub](https://github.com/your-repo/ab-forge)
- **Issues** : [GitHub Issues](https://github.com/your-repo/ab-forge/issues)
- **Documentation** : [docs/](.)
- **Tests** : [tests/](../tests/)

## 📝 Contribution

### Développement
1. Fork le repository
2. Créer une branche feature
3. Implémenter les changements
4. Ajouter des tests
5. Mettre à jour la documentation
6. Créer une pull request

### Standards
- **Code** : ESLint + Prettier
- **Tests** : Vitest avec couverture
- **Documentation** : Markdown avec exemples
- **Commits** : Messages clairs et descriptifs

---

*Dernière mise à jour : 19 décembre 2024*
