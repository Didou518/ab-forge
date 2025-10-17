import fs from 'node:fs/promises'
import path from 'node:path'
import { FileSystemError } from '../errors/CustomError.js'

/**
 * Vérifie si un répertoire existe et le crée si nécessaire
 * @param {string} dirPath - Chemin du répertoire
 * @param {boolean} createIfNotExists - Créer le répertoire s'il n'existe pas
 * @returns {Promise<boolean>} True si le répertoire existe ou a été créé
 */
export async function ensureDirectoryExists(dirPath, createIfNotExists = true) {
	try {
		const stats = await fs.stat(dirPath)
		return stats.isDirectory()
	} catch {
		if (createIfNotExists) {
			try {
				await fs.mkdir(dirPath, { recursive: true })
				return true
			} catch {
				throw new FileSystemError(`Cannot create directory: ${dirPath}`, dirPath, 'create')
			}
		}
		throw new FileSystemError(`Directory access error: ${dirPath}`, dirPath, 'access')
	}
}

/**
 * Lit un fichier de manière asynchrone
 * @param {string} filePath - Chemin du fichier
 * @param {string} encoding - Encodage du fichier (défaut: 'utf8')
 * @returns {Promise<string>} Contenu du fichier
 */
export async function readFile(filePath, encoding = 'utf8') {
	try {
		return await fs.readFile(filePath, encoding)
	} catch {
		throw new FileSystemError(`Cannot read file: ${filePath}`, filePath, 'read')
	}
}

/**
 * Écrit un fichier de manière asynchrone
 * @param {string} filePath - Chemin du fichier
 * @param {string} content - Contenu à écrire
 * @param {string} encoding - Encodage du fichier (défaut: 'utf8')
 * @returns {Promise<void>}
 */
export async function writeFile(filePath, content, encoding = 'utf8') {
	try {
		// S'assurer que le répertoire parent existe
		const dir = path.dirname(filePath)
		await ensureDirectoryExists(dir, true)

		await fs.writeFile(filePath, content, encoding)
	} catch {
		throw new FileSystemError(`Cannot write file: ${filePath}`, filePath, 'write')
	}
}

/**
 * Lit le contenu d'un répertoire de manière asynchrone
 * @param {string} dirPath - Chemin du répertoire
 * @returns {Promise<string[]>} Liste des fichiers et répertoires
 */
export async function readDirectory(dirPath) {
	try {
		return await fs.readdir(dirPath)
	} catch {
		throw new FileSystemError(`Cannot read directory: ${dirPath}`, dirPath, 'read')
	}
}

/**
 * Obtient les informations sur un fichier/répertoire
 * @param {string} filePath - Chemin du fichier/répertoire
 * @returns {Promise<import('fs').Stats>} Statistiques du fichier
 */
export async function getStats(filePath) {
	try {
		return await fs.stat(filePath)
	} catch {
		throw new FileSystemError(`Cannot get file stats: ${filePath}`, filePath, 'stat')
	}
}

/**
 * Vérifie si un fichier existe
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<boolean>} True si le fichier existe
 */
export async function fileExists(filePath) {
	try {
		await fs.access(filePath)
		return true
	} catch {
		return false
	}
}

/**
 * Obtient tous les fichiers d'un répertoire de manière récursive
 * @param {string} dirPath - Chemin du répertoire
 * @param {string[]} extensions - Extensions de fichiers à inclure (optionnel)
 * @param {boolean} includeHidden - Inclure les fichiers cachés (défaut: false)
 * @returns {Promise<string[]>} Liste de tous les fichiers trouvés
 */
export async function getAllFilesFromDirectory(dirPath, extensions = [], includeHidden = false) {
	const files = []

	try {
		// Vérifier si le répertoire existe
		if (!(await fileExists(dirPath))) {
			return files
		}

		const stats = await getStats(dirPath)
		if (!stats.isDirectory()) {
			return files
		}

		const entries = await readDirectory(dirPath)

		for (const entry of entries) {
			// Ignorer les fichiers cachés sauf si explicitement demandé
			if (!includeHidden && entry.startsWith('.')) {
				continue
			}

			const fullPath = path.join(dirPath, entry)
			const entryStats = await getStats(fullPath)

			if (entryStats.isDirectory()) {
				// Récursion pour les sous-répertoires
				const subFiles = await getAllFilesFromDirectory(fullPath, extensions, includeHidden)
				files.push(...subFiles)
			} else if (entryStats.isFile()) {
				// Filtrer par extension si spécifié
				if (extensions.length === 0 || extensions.some((ext) => entry.endsWith(ext))) {
					files.push(fullPath)
				}
			}
		}

		return files
	} catch {
		throw new FileSystemError(`Error scanning directory: ${dirPath}`, dirPath, 'scan')
	}
}

/**
 * Copie un fichier de manière asynchrone
 * @param {string} sourcePath - Chemin source
 * @param {string} destPath - Chemin de destination
 * @returns {Promise<void>}
 */
export async function copyFile(sourcePath, destPath) {
	try {
		await fs.copyFile(sourcePath, destPath)
	} catch {
		throw new FileSystemError(
			`Cannot copy file from ${sourcePath} to ${destPath}`,
			sourcePath,
			'copy'
		)
	}
}

/**
 * Supprime un fichier de manière asynchrone
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<void>}
 */
export async function deleteFile(filePath) {
	try {
		await fs.unlink(filePath)
	} catch {
		throw new FileSystemError(`Cannot delete file: ${filePath}`, filePath, 'delete')
	}
}

/**
 * Obtient le hash MD5 d'un fichier (pour le cache)
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<string>} Hash MD5 du fichier
 */
export async function getFileHash(filePath) {
	const crypto = await import('node:crypto')
	const content = await readFile(filePath)
	return crypto.createHash('md5').update(content).digest('hex')
}

/**
 * Obtient les informations de cache d'un fichier
 * @param {string} filePath - Chemin du fichier
 * @returns {Promise<Object>} Informations de cache
 */
export async function getFileCacheInfo(filePath) {
	try {
		const stats = await getStats(filePath)
		const hash = await getFileHash(filePath)

		return {
			path: filePath,
			size: stats.size,
			modified: stats.mtime,
			hash: hash,
			exists: true
		}
	} catch {
		return {
			path: filePath,
			size: 0,
			modified: new Date(0),
			hash: '',
			exists: false
		}
	}
}

/**
 * Vérifie si un fichier a été modifié depuis la dernière fois
 * @param {string} filePath - Chemin du fichier
 * @param {Date} lastCheck - Date de la dernière vérification
 * @returns {Promise<boolean>} True si le fichier a été modifié
 */
export async function hasFileChanged(filePath, lastCheck) {
	try {
		const stats = await getStats(filePath)
		return stats.mtime > lastCheck
	} catch {
		return true // Considérer comme modifié si on ne peut pas vérifier
	}
}
