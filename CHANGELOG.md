# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

## [3.0.0] - 2024-12-19

### 🚀 Nouvelles fonctionnalités

#### Architecture moderne
- **Migration vers async/await** : Remplacement des callbacks par des promesses modernes
- **fs.promises** : Utilisation de l'API moderne du système de fichiers Node.js
- **Architecture modulaire** : Séparation des responsabilités en modules distincts

#### Système de plugins avancé
- **6 plugins intégrés** : CSS, HTML, JavaScript, SVG, JSON, JPG
- **Configuration flexible** : Options personnalisables pour chaque plugin
- **Classe de base** : `BasePlugin` pour faciliter la création de nouveaux plugins
- **Gestion d'erreurs unifiée** : `PluginError` pour toutes les erreurs de plugins

#### Gestion d'erreurs robuste
- **Classes d'erreurs personnalisées** : `BuildError`, `ValidationError`, `FileSystemError`, `PluginError`
- **Gestionnaire centralisé** : Messages d'erreur clairs avec suggestions d'action
- **Logging structuré** : Informations détaillées en mode développement

#### Cache intelligent
- **CacheManager** : Système de cache pour éviter les retraitements
- **Vérification des modifications** : Hash MD5 pour détecter les changements
- **Statistiques de cache** : Métriques de performance

### 🔧 Améliorations

#### Plugins CSS
- **PostCSS** : Support du nesting CSS, autoprefixer et minification
- **Configuration** : Options `minify`, `autoprefixer`, `nesting`
- **Gestion d'erreurs** : Messages clairs pour les erreurs de syntaxe CSS

#### Plugins HTML
- **html-minifier** : Minification avancée avec options configurables
- **Configuration** : 9 options de minification personnalisables
- **Optimisation** : Suppression des commentaires, compression des espaces

#### Plugins JavaScript
- **Inclusion de fichiers** : Support des modules JavaScript modulaires
- **Configuration** : Options `addDebugComments`, `addSeparators`
- **Validation** : Vérification de l'existence des fichiers

#### Plugins SVG
- **SVGO** : Optimisation automatique des fichiers SVG
- **Configuration** : Options `optimize`, `removeMetadata`, `cleanupNumericValues`
- **Préservation** : Conservation du viewBox par défaut

#### Plugins JSON
- **Validation** : Vérification de la syntaxe JSON
- **Formatage** : Option `prettyPrint` pour l'indentation
- **Gestion d'erreurs** : Messages clairs pour JSON invalide

#### Plugins JPG
- **Conversion base64** : Transformation automatique en chaîne encodée
- **Types MIME** : Support des types MIME personnalisés
- **Intégration** : Injection directe dans le code JavaScript

### 🧪 Tests et qualité

#### Framework de tests
- **Vitest** : Framework de test moderne et rapide
- **86 tests** : Couverture complète de tous les composants
- **Tests unitaires** : fileSystem, cache, fileProcessor, plugins
- **Tests d'intégration** : Processus de build complet
- **Couverture de code** : Configuration avec seuils de qualité

#### Configuration des tests
- **Setup automatique** : Création et nettoyage des répertoires temporaires
- **Mocking** : Isolation des dépendances externes
- **Assertions** : Vérifications robustes des fonctionnalités

### 📚 Documentation

#### Documentation technique
- **README.md** : Guide d'utilisation principal mis à jour
- **API.md** : Documentation complète de l'API
- **PLUGINS.md** : Guide détaillé du système de plugins
- **CHANGELOG.md** : Historique des modifications

#### Exemples pratiques
- **Cas d'usage** : Exemples concrets d'utilisation
- **Configuration** : Guide de personnalisation des options
- **Dépannage** : Solutions aux problèmes courants

### 🔄 Migration depuis la version précédente

#### Changements de configuration
- **Extensions supportées** : Ajout de `js` dans `SUPPORTED_EXTENSIONS`
- **Configuration des plugins** : Nouvelle section `CONFIG.PLUGINS`
- **Options par défaut** : Valeurs optimisées pour chaque plugin

#### Changements d'API
- **FileProcessor** : Nouvelle classe avec méthodes asynchrones
- **CacheManager** : Nouveau système de cache
- **ErrorHandler** : Gestionnaire d'erreurs centralisé
- **ConfigValidator** : Validation robuste de la configuration

### 🐛 Corrections de bugs

#### Gestion des fichiers
- **Fichiers cachés** : Exclusion automatique des fichiers `.DS_Store`
- **Extensions manquantes** : Filtrage des fichiers sans extension
- **Permissions** : Gestion améliorée des erreurs d'accès

#### Traitement des erreurs
- **Messages d'erreur** : Amélioration de la clarté et de l'utilité
- **Stack traces** : Affichage conditionnel en mode développement
- **Contexte** : Informations supplémentaires pour le débogage

### ⚡ Performance

#### Optimisations
- **Traitement asynchrone** : Amélioration des performances I/O
- **Cache intelligent** : Réduction des retraitements inutiles
- **Filtrage précoce** : Exclusion rapide des fichiers non supportés
- **Traitement parallèle** : Fichiers traités simultanément

#### Métriques
- **Temps de traitement** : Réduction significative des temps de build
- **Utilisation mémoire** : Optimisation de la consommation mémoire
- **Statistiques** : Métriques détaillées de performance

### 🔧 Configuration

#### Nouveaux fichiers
- **vitest.config.js** : Configuration des tests
- **tests/setup.js** : Configuration globale des tests
- **src/config/index.js** : Configuration centralisée

#### Scripts npm
- **new** : Création d'un nouveau test depuis le boilerplate
- **build** : Mode build (une seule fois) avec `node ./index.js --build --dir`
- **start** : Mode watch (surveillance continue) avec `nodemon ./index.js --dir`
- **debug** : Mode debug (sans minification) avec `nodemon ./index.js --debug --dir`
- **test** : Exécution des tests
- **test:run** : Exécution des tests sans watch
- **test:coverage** : Tests avec couverture de code
- **test:watch** : Tests en mode surveillance
- **test:ui** : Interface utilisateur des tests

#### Configuration des rapports
- **Dossier de rapport** : `tests-report/` (au lieu de `html/`)
- **Rapport HTML** : `tests-report/index.html`
- **Couverture de code** : `tests-report/coverage/`
- **Git ignore** : Le dossier `tests-report/` est automatiquement ignoré

#### Documentation améliorée
- **Commandes npm** : Toute la documentation utilise maintenant `npm run ...`
- **Scripts validés** : Tous les scripts npm sont testés et fonctionnels
- **Nodemon intégré** : Les scripts `start` et `debug` utilisent nodemon pour le rechargement automatique
- **Exemples pratiques** : Commandes mises à jour dans tous les guides

#### Boilerplate modernisé
- **Contenu générique** : Suppression de toutes les références spécifiques (AB_*)
- **Exemple complet** : Démonstration de tous les types de fichiers supportés
- **Code moderne** : ES6+, async/await, modules JavaScript
- **CSS responsive** : Design moderne avec PostCSS et animations
- **Utilitaires JavaScript** : Fonctions helper pour le développement
- **Configuration JSON** : Structure de données complète
- **Documentation intégrée** : README détaillé dans le boilerplate
- **Git ignore** : Dossier `dist/` automatiquement ignoré

### 📦 Dépendances

#### Nouvelles dépendances
- **vitest** : Framework de test
- **@vitest/coverage-v8** : Couverture de code
- **@vitest/ui** : Interface utilisateur des tests

#### Dépendances existantes améliorées
- **@babel/core** : Transpilation JavaScript
- **uglify-js** : Minification JavaScript
- **chalk** : Coloration des logs
- **chokidar** : Surveillance des fichiers
- **yargs** : Parsing des arguments CLI

### 🎯 Objectifs atteints

#### Modernisation
- ✅ Migration complète vers async/await
- ✅ Utilisation de fs.promises
- ✅ Architecture modulaire et maintenable

#### Robustesse
- ✅ Gestion d'erreurs complète
- ✅ Validation des entrées
- ✅ Tests exhaustifs

#### Flexibilité
- ✅ Système de plugins configurable
- ✅ Options personnalisables
- ✅ Architecture extensible

#### Performance
- ✅ Cache intelligent
- ✅ Traitement optimisé
- ✅ Métriques de performance

### 🔮 Prochaines étapes

#### Améliorations futures
- **Plugins supplémentaires** : Support d'autres types de fichiers
- **Configuration dynamique** : Chargement de configuration depuis des fichiers
- **Plugins tiers** : Support des plugins externes
- **Interface graphique** : Dashboard de monitoring

#### Optimisations
- **Traitement parallèle** : Amélioration du parallélisme
- **Cache distribué** : Support du cache partagé
- **Compression** : Optimisation de la taille des fichiers générés

---

## [2.0.0] - Version précédente
