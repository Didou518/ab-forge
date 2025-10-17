import path from 'node:path'
import * as FileSystemUtils from './fileSystem.js'

/**
 * Système de cache pour optimiser les performances
 */
export class CacheManager {
	constructor() {
		this.cache = new Map()
		this.fileTimestamps = new Map()
		this.fileHashes = new Map()
	}

	/**
	 * Génère une clé de cache pour un fichier
	 * @param {string} filePath - Chemin du fichier
	 * @param {string} operation - Type d'opération
	 * @returns {string} Clé de cache
	 */
	static generateCacheKey(filePath, operation = 'default') {
		return `${path.resolve(filePath)}:${operation}`
	}

	/**
	 * Vérifie si un fichier est en cache et s'il est encore valide
	 * @param {string} filePath - Chemin du fichier
	 * @param {string} operation - Type d'opération
	 * @returns {Promise<boolean>} True si le cache est valide
	 */
	async isCacheValid(filePath, operation = 'default') {
		const cacheKey = CacheManager.generateCacheKey(filePath, operation)

		if (!this.cache.has(cacheKey)) {
			return false
		}

		try {
			const currentStats = await FileSystemUtils.getStats(filePath)
			const cachedTimestamp = this.fileTimestamps.get(cacheKey)

			// Vérifier si le fichier a été modifié
			if (currentStats.mtime.getTime() !== cachedTimestamp) {
				this.invalidateCache(filePath, operation)
				return false
			}

			return true
		} catch {
			// Si on ne peut pas vérifier le fichier, invalider le cache
			this.invalidateCache(filePath, operation)
			return false
		}
	}

	/**
	 * Met en cache le résultat d'une opération
	 * @param {string} filePath - Chemin du fichier
	 * @param {any} result - Résultat à mettre en cache
	 * @param {string} operation - Type d'opération
	 * @returns {Promise<void>}
	 */
	async setCache(filePath, result, operation = 'default') {
		const cacheKey = CacheManager.generateCacheKey(filePath, operation)

		try {
			const stats = await FileSystemUtils.getStats(filePath)
			this.cache.set(cacheKey, result)
			this.fileTimestamps.set(cacheKey, stats.mtime.getTime())
		} catch {
			// Si on ne peut pas obtenir les stats, ne pas mettre en cache
		}
	}

	/**
	 * Récupère un résultat du cache
	 * @param {string} filePath - Chemin du fichier
	 * @param {string} operation - Type d'opération
	 * @returns {any} Résultat en cache ou undefined
	 */
	getCache(filePath, operation = 'default') {
		const cacheKey = CacheManager.generateCacheKey(filePath, operation)
		return this.cache.get(cacheKey)
	}

	/**
	 * Invalide le cache pour un fichier
	 * @param {string} filePath - Chemin du fichier
	 * @param {string} operation - Type d'opération (optionnel)
	 * @returns {void}
	 */
	invalidateCache(filePath, operation = null) {
		if (operation) {
			const cacheKey = CacheManager.generateCacheKey(filePath, operation)
			this.cache.delete(cacheKey)
			this.fileTimestamps.delete(cacheKey)
		} else {
			// Invalider tous les caches pour ce fichier
			const filePathResolved = path.resolve(filePath)
			for (const [key] of this.cache) {
				if (key.startsWith(filePathResolved)) {
					this.cache.delete(key)
					this.fileTimestamps.delete(key)
				}
			}
		}
	}

	/**
	 * Vide tout le cache
	 * @returns {void}
	 */
	clearCache() {
		this.cache.clear()
		this.fileTimestamps.clear()
		this.fileHashes.clear()
	}

	/**
	 * Obtient les statistiques du cache
	 * @returns {Object} Statistiques du cache
	 */
	getCacheStats() {
		return {
			size: this.cache.size,
			timestampEntries: this.fileTimestamps.size,
			hashEntries: this.fileHashes.size,
			memoryUsage: process.memoryUsage()
		}
	}

	/**
	 * Met en cache le hash d'un fichier
	 * @param {string} filePath - Chemin du fichier
	 * @param {string} hash - Hash du fichier
	 * @returns {void}
	 */
	setFileHash(filePath, hash) {
		this.fileHashes.set(path.resolve(filePath), hash)
	}

	/**
	 * Récupère le hash d'un fichier depuis le cache
	 * @param {string} filePath - Chemin du fichier
	 * @returns {string|undefined} Hash du fichier ou undefined
	 */
	getFileHash(filePath) {
		return this.fileHashes.get(path.resolve(filePath))
	}

	/**
	 * Vérifie si le contenu d'un fichier a changé en comparant les hash
	 * @param {string} filePath - Chemin du fichier
	 * @returns {Promise<boolean>} True si le fichier a changé
	 */
	async hasFileContentChanged(filePath) {
		try {
			const currentHash = await FileSystemUtils.getFileHash(filePath)
			const cachedHash = this.getFileHash(filePath)

			if (!cachedHash) {
				this.setFileHash(filePath, currentHash)
				return true // Premier accès, considérer comme changé
			}

			if (currentHash !== cachedHash) {
				this.setFileHash(filePath, currentHash)
				return true
			}

			return false
		} catch {
			return true // En cas d'erreur, considérer comme changé
		}
	}
}
