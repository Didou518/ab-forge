import fs from 'node:fs/promises'
import path from 'node:path'

/**
 * Utilitaires pour les tests FileSystem
 */

/**
 * Crée une structure de répertoires de test de manière sécurisée
 * @param {string} baseDir - Répertoire de base
 * @param {Object} structure - Structure à créer
 */
export async function createTestStructure(baseDir, structure) {
	await fs.mkdir(baseDir, { recursive: true })

	for (const [name, content] of Object.entries(structure)) {
		const fullPath = path.join(baseDir, name)

		if (typeof content === 'object' && content !== null) {
			// C'est un répertoire
			await createTestStructure(fullPath, content)
		} else {
			// C'est un fichier
			await fs.writeFile(fullPath, content || '')
		}
	}
}

/**
 * Supprime un répertoire de manière sécurisée avec retry
 * @param {string} dirPath - Chemin du répertoire à supprimer
 * @param {number} maxRetries - Nombre maximum de tentatives
 */
export async function safeRemoveDir(dirPath, maxRetries = 3) {
	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			await fs.rm(dirPath, { recursive: true, force: true })
			return
		} catch (error) {
			if (attempt === maxRetries) {
				console.warn(`⚠️  Failed to remove directory after ${maxRetries} attempts: ${dirPath}`)
				throw error
			}
			// Attendre un peu avant de réessayer
			await new Promise(resolve => setTimeout(resolve, 100 * attempt))
		}
	}
}

/**
 * Vérifie qu'un fichier existe de manière sécurisée
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<boolean>}
 */
export async function safeFileExists(filePath) {
	try {
		await fs.access(filePath)
		return true
	} catch {
		return false
	}
}

/**
 * Attend qu'un fichier soit créé avec timeout
 * @param {string} filePath - Chemin du fichier
 * @param {number} timeout - Timeout en ms
 * @returns {Promise<boolean>}
 */
export async function waitForFile(filePath, timeout = 5000) {
	const start = Date.now()

	while (Date.now() - start < timeout) {
		if (await safeFileExists(filePath)) {
			return true
		}
		await new Promise(resolve => setTimeout(resolve, 100))
	}

	return false
}

/**
 * Crée un fichier temporaire avec un nom unique
 * @param {string} dir - Répertoire parent
 * @param {string} prefix - Préfixe du nom
 * @param {string} content - Contenu du fichier
 * @returns {Promise<string>} Chemin du fichier créé
 */
export async function createTempFile(dir, prefix = 'temp', content = '') {
	const timestamp = Date.now()
	const random = Math.random().toString(36).substring(2, 8)
	const fileName = `${prefix}_${timestamp}_${random}.tmp`
	const filePath = path.join(dir, fileName)

	await fs.writeFile(filePath, content)
	return filePath
}

/**
 * Synchronise les opérations FileSystem pour éviter les conditions de course
 * @param {Function} operation - Opération à exécuter
 * @returns {Promise<any>}
 */
export async function syncFileSystemOperation(operation) {
	// Petit délai pour éviter les conditions de course
	await new Promise(resolve => setTimeout(resolve, 10))
	return await operation()
}
