import path from 'node:path'
import * as FileSystemUtils from './fileSystem.js'

/**
 * Gestionnaire de dépendances pour tracker les relations entre fichiers
 */
export class DependencyTracker {
	constructor() {
		this.dependencies = new Map() // Map<jsFile, Set<dependencyFiles>>
		this.reverseDependencies = new Map() // Map<dependencyFile, Set<jsFiles>>
		this.dependencyCache = new Map() // Cache des dépendances analysées
	}

	/**
	 * Analyse les dépendances d'un fichier JS en cherchant les placeholders
	 * @param {string} jsFilePath - Chemin du fichier JS
	 * @param {string} srcDir - Répertoire des fichiers de support
	 * @returns {Promise<Set<string>>} Set des fichiers de dépendance
	 */
	async analyzeDependencies(jsFilePath, srcDir) {
		const cacheKey = `${jsFilePath}:${srcDir}`

		// Vérifier le cache
		if (this.dependencyCache.has(cacheKey)) {
			return this.dependencyCache.get(cacheKey)
		}

		try {
			const content = await FileSystemUtils.readFile(jsFilePath)
			const dependencies = new Set()

			// Regex pour trouver les placeholders {{type/file}}
			const placeholderRegex = /\{\{([^/]+)\/([^}]+)\}\}/g
			let match = placeholderRegex.exec(content)

			while (match !== null) {
				const [, type, fileName] = match

				// Construire le chemin du fichier de dépendance
				const dependencyPath = path.join(srcDir, type, `${fileName}.${type}`)

				// Vérifier si le fichier existe
				try {
					await FileSystemUtils.getStats(dependencyPath)
					dependencies.add(dependencyPath)
				} catch {
					// Fichier n'existe pas, ignorer
					console.warn(`⚠️  Dependency file not found: ${dependencyPath}`)
				}

				match = placeholderRegex.exec(content)
			}

			// Mettre en cache le résultat
			this.dependencyCache.set(cacheKey, dependencies)

			return dependencies
		} catch (error) {
			console.error(`Error analyzing dependencies for ${jsFilePath}:`, error)
			return new Set()
		}
	}

	/**
	 * Enregistre les dépendances d'un fichier JS
	 * @param {string} jsFilePath - Chemin du fichier JS
	 * @param {Set<string>} dependencies - Set des fichiers de dépendance
	 */
	registerDependencies(jsFilePath, dependencies) {
		const resolvedJsPath = path.resolve(jsFilePath)

		// Supprimer les anciennes dépendances
		this.removeDependencies(resolvedJsPath)

		// Enregistrer les nouvelles dépendances
		this.dependencies.set(resolvedJsPath, new Set(dependencies))

		// Mettre à jour les dépendances inverses
		for (const depPath of dependencies) {
			const resolvedDepPath = path.resolve(depPath)

			if (!this.reverseDependencies.has(resolvedDepPath)) {
				this.reverseDependencies.set(resolvedDepPath, new Set())
			}

			this.reverseDependencies.get(resolvedDepPath).add(resolvedJsPath)
		}
	}

	/**
	 * Supprime les dépendances d'un fichier JS
	 * @param {string} jsFilePath - Chemin du fichier JS
	 */
	removeDependencies(jsFilePath) {
		const resolvedJsPath = path.resolve(jsFilePath)

		// Supprimer des dépendances inverses
		if (this.dependencies.has(resolvedJsPath)) {
			for (const depPath of this.dependencies.get(resolvedJsPath)) {
				const resolvedDepPath = path.resolve(depPath)

				if (this.reverseDependencies.has(resolvedDepPath)) {
					this.reverseDependencies.get(resolvedDepPath).delete(resolvedJsPath)

					// Supprimer la clé si le Set est vide
					if (this.reverseDependencies.get(resolvedDepPath).size === 0) {
						this.reverseDependencies.delete(resolvedDepPath)
					}
				}
			}
		}

		// Supprimer les dépendances directes
		this.dependencies.delete(resolvedJsPath)
	}

	/**
	 * Trouve les fichiers JS qui dépendent d'un fichier modifié
	 * @param {string} modifiedFilePath - Chemin du fichier modifié
	 * @returns {Set<string>} Set des fichiers JS à régénérer
	 */
	getAffectedJsFiles(modifiedFilePath) {
		const resolvedModifiedPath = path.resolve(modifiedFilePath)

		if (this.reverseDependencies.has(resolvedModifiedPath)) {
			return new Set(this.reverseDependencies.get(resolvedModifiedPath))
		}

		return new Set()
	}

	/**
	 * Vérifie si un fichier JS doit être régénéré à cause d'une dépendance modifiée
	 * @param {string} jsFilePath - Chemin du fichier JS
	 * @param {string} srcDir - Répertoire des fichiers de support
	 * @returns {Promise<boolean>} True si le fichier doit être régénéré
	 */
	async shouldRegenerateJsFile(jsFilePath, srcDir) {
		const resolvedJsPath = path.resolve(jsFilePath)

		if (!this.dependencies.has(resolvedJsPath)) {
			// Analyser les dépendances si pas encore fait
			const dependencies = await this.analyzeDependencies(jsFilePath, srcDir)
			this.registerDependencies(jsFilePath, dependencies)
		}

		const dependencies = this.dependencies.get(resolvedJsPath)
		if (!dependencies || dependencies.size === 0) {
			return false
		}

		// Vérifier si une des dépendances a été modifiée
		for (const depPath of dependencies) {
			try {
				const stats = await FileSystemUtils.getStats(depPath)
				const cacheKey = `dep:${depPath}`

				// Vérifier si on a déjà vérifié ce fichier
				if (this.dependencyCache.has(cacheKey)) {
					const cachedStats = this.dependencyCache.get(cacheKey)
					if (stats.mtime.getTime() !== cachedStats.mtime.getTime()) {
						this.dependencyCache.set(cacheKey, stats)
						return true
					}
				} else {
					// Premier accès, mettre en cache
					this.dependencyCache.set(cacheKey, stats)
					return true
				}
			} catch {
				// Fichier n'existe plus, régénérer
				return true
			}
		}

		return false
	}

	/**
	 * Invalide le cache des dépendances pour un fichier
	 * @param {string} filePath - Chemin du fichier
	 */
	invalidateDependencyCache(filePath) {
		const resolvedPath = path.resolve(filePath)

		// Supprimer du cache des dépendances analysées
		for (const [key] of this.dependencyCache) {
			if (key.includes(resolvedPath)) {
				this.dependencyCache.delete(key)
			}
		}

		// Supprimer les dépendances si c'est un fichier JS
		this.removeDependencies(resolvedPath)
	}

	/**
	 * Vide tout le cache des dépendances
	 */
	clearCache() {
		this.dependencies.clear()
		this.reverseDependencies.clear()
		this.dependencyCache.clear()
	}

	/**
	 * Obtient les statistiques des dépendances
	 * @returns {Object} Statistiques
	 */
	getStats() {
		return {
			totalJsFiles: this.dependencies.size,
			totalDependencyFiles: this.reverseDependencies.size,
			cacheEntries: this.dependencyCache.size,
			totalDependencies: Array.from(this.dependencies.values()).reduce(
				(sum, deps) => sum + deps.size,
				0
			)
		}
	}
}
