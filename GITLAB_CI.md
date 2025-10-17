# GitLab CI Pipeline - AB Forge

## 🎯 Objectif

Cette pipeline GitLab CI s'exécute **uniquement** lorsque des fichiers sont modifiés **hors du dossier `ab-tests/`**, lance les tests et génère des rapports complets.

## 🚀 Déclenchement

### Conditions d'exécution
La pipeline s'exécute dans les cas suivants :

1. **Push sur une branche** : Si des fichiers sont modifiés hors de `ab-tests/`
2. **Merge Request** : Si des fichiers sont modifiés hors de `ab-tests/`
3. **Tags** : Toujours (pour les releases)
4. **Exécution manuelle** : Via l'interface GitLab

### Exclusions
- ❌ Modifications uniquement dans `ab-tests/`
- ❌ Modifications de fichiers de configuration GitLab CI uniquement

## 📋 Stages

### 1. `install` - Installation des dépendances
- **Image** : `node:18.16.0-alpine`
- **Actions** :
  - Installation des dépendances npm
  - Configuration du cache
  - Vérification des versions Node.js/npm
- **Artefacts** : `node_modules/` (cache 1h)

### 2. `test` - Exécution des tests
Deux jobs parallèles :

#### `run_tests` - Tests unitaires et d'intégration
- **Script** : `npm run test:run`
- **Artefacts** :
  - `tests-report/` (rapports HTML)
  - `junit.xml` (rapport JUnit)

#### `run_coverage_tests` - Tests avec couverture
- **Script** : `npm run test:coverage`
- **Artefacts** :
  - `tests-report/coverage/` (rapports de couverture)
  - `cobertura-coverage.xml` (rapport Cobertura)

### 3. `report` - Génération des rapports finaux
- **Job** : `generate_reports`
- **Actions** :
  - Consolidation des rapports
  - Vérification de la génération
  - Logs informatifs
- **Artefacts** : Rapports complets (durée 1 mois)

## 📊 Artefacts Générés

### Rapports de Tests
- **HTML Report** : `tests-report/index.html`
- **JUnit Report** : `tests-report/junit.xml`
- **Coverage Report** : `tests-report/coverage/`

### Formats Supportés
- **HTML** : Interface web interactive
- **JUnit** : Intégration avec GitLab
- **Cobertura** : Métriques de couverture
- **LCOV** : Format standard de couverture

## ⚙️ Configuration

### Variables d'environnement
```yaml
NODE_VERSION: "18.16.0"
NPM_VERSION: "9.5.1"
CACHE_KEY: "ab-forge-$CI_COMMIT_REF_SLUG"
```

### Cache
- **Clé** : Basée sur la branche
- **Dossiers** : `node_modules/`, `.npm/`
- **Durée** : Persistant entre les builds

### Seuils de Couverture
- **Branches** : 80%
- **Fonctions** : 80%
- **Lignes** : 80%
- **Statements** : 80%

## 🔧 Utilisation

### Exécution Automatique
La pipeline s'exécute automatiquement lors de :
```bash
# Merge Request
git push origin feature/new-feature
# Puis création d'une MR via GitLab
```

### Exécution Manuelle
1. Aller dans **CI/CD > Pipelines**
2. Cliquer sur **Run Pipeline**
3. Sélectionner la branche
4. Cliquer sur **Run Pipeline**

### Visualisation des Résultats
1. **Rapports HTML** : Télécharger l'artefact `tests-report/`
2. **Métriques GitLab** : Voir dans l'onglet **Tests** de la pipeline
3. **Couverture** : Voir dans l'onglet **Coverage** de la pipeline

## 📈 Monitoring

### Indicateurs de Succès
- ✅ Tous les tests passent
- ✅ Couverture de code ≥ 80%
- ✅ Rapports générés correctement
- ✅ Artefacts disponibles

### Indicateurs d'Échec
- ❌ Tests en échec
- ❌ Couverture insuffisante
- ❌ Erreurs de build
- ❌ Rapports manquants

## 🛠️ Maintenance

### Mise à jour des dépendances
```bash
npm update
git add package-lock.json
git commit -m "chore: update dependencies"
git push
```

### Modification des seuils
Éditer `vitest.config.js` :
```javascript
thresholds: {
  global: {
    branches: 85,    // Augmenter à 85%
    functions: 85,
    lines: 85,
    statements: 85
  }
}
```

### Ajout de nouveaux tests
1. Créer les fichiers dans `tests/`
2. Suivre la convention `*.test.js`
3. La pipeline les détectera automatiquement

## 🚨 Dépannage

### Pipeline ne s'exécute pas
- Vérifier que des fichiers hors `ab-tests/` sont modifiés
- Vérifier les règles dans `.gitlab-ci.yml`

### Tests en échec
- Consulter les logs de la pipeline
- Vérifier la configuration Vitest
- Tester localement avec `npm run test:run`

### Rapports manquants
- Vérifier que `tests-report/` est généré
- Consulter les artefacts de la pipeline
- Vérifier la configuration des reporters dans `vitest.config.js`
