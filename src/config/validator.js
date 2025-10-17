import fs from 'node:fs'
import path from 'node:path'
import { FileSystemError, ValidationError } from '../errors/CustomError.js'

/**
 * Valide et normalise les arguments de ligne de commande
 * @param {Object} argv - Arguments de yargs
 * @returns {Object} Configuration validée
 */
export function validateArgs(argv) {
	const errors = []
	const config = {}

	// Validation du répertoire de travail
	try {
		config.workingDirectory = validateWorkingDirectory(argv.dir)
	} catch (error) {
		errors.push(error.message)
	}

	// Validation des options booléennes
	config.build = validateBooleanOption(argv.build)
	config.debug = validateBooleanOption(argv.debug)
	config.watch = !config.build // Si build est activé, watch est désactivé

	// Validation des chemins dérivés
	if (config.workingDirectory) {
		try {
			config.paths = validatePaths(config.workingDirectory)
		} catch (error) {
			errors.push(error.message)
		}
	}

	// Si des erreurs existent, les lancer
	if (errors.length > 0) {
		throw new ValidationError(
			`Configuration validation failed:\n${errors.map((e) => `  - ${e}`).join('\n')}`,
			'argv',
			argv
		)
	}

	return config
}

/**
 * Valide le répertoire de travail
 * @param {string} dir - Chemin du répertoire
 * @returns {string} Chemin absolu validé
 */
function validateWorkingDirectory(dir) {
	if (!dir || dir === true) {
		throw new ValidationError(
			'Working directory is required. Please specify a path with --dir',
			'dir',
			dir
		)
	}

	// Convertir en chemin absolu
	const absolutePath = path.resolve(dir)

	// Vérifier que le chemin existe
	if (!fs.existsSync(absolutePath)) {
		throw new FileSystemError(
			`Working directory does not exist: ${absolutePath}`,
			absolutePath,
			'validate'
		)
	}

	// Vérifier que c'est un répertoire
	if (!fs.statSync(absolutePath).isDirectory()) {
		throw new FileSystemError(
			`Path is not a directory: ${absolutePath}`,
			absolutePath,
			'validate'
		)
	}

	// Vérifier les permissions de lecture
	try {
		fs.accessSync(absolutePath, fs.constants.R_OK)
	} catch {
		throw new FileSystemError(
			`No read permission for directory: ${absolutePath}`,
			absolutePath,
			'access'
		)
	}

	return absolutePath
}

/**
 * Valide une option booléenne
 * @param {any} value - Valeur à valider
 * @param {string} name - Nom de l'option
 * @returns {boolean} Valeur booléenne validée
 */
function validateBooleanOption(value) {
	if (value === undefined || value === null) {
		return false
	}

	if (typeof value === 'boolean') {
		return value
	}

	if (typeof value === 'string') {
		const lowerValue = value.toLowerCase()
		if (['true', '1', 'yes', 'on'].includes(lowerValue)) {
			return true
		}
		if (['false', '0', 'no', 'off'].includes(lowerValue)) {
			return false
		}
	}

	// Valeur par défaut si la valeur n'est pas reconnue
	return Boolean(value)
}

/**
 * Valide et crée les chemins nécessaires
 * @param {string} workingDirectory - Répertoire de travail
 * @returns {Object} Objet contenant tous les chemins
 */
function validatePaths(workingDirectory) {
	const paths = {
		source: workingDirectory,
		src: path.resolve(workingDirectory, 'src'),
		dist: path.resolve(workingDirectory, 'dist')
	}

	// Vérifier que le répertoire src existe ou peut être créé
	if (!fs.existsSync(paths.src)) {
		try {
			fs.mkdirSync(paths.src, { recursive: true })
		} catch {
			throw new FileSystemError(
				`Cannot create src directory: ${paths.src}`,
				paths.src,
				'create'
			)
		}
	}

	// Vérifier que le répertoire dist existe ou peut être créé
	if (!fs.existsSync(paths.dist)) {
		try {
			fs.mkdirSync(paths.dist, { recursive: true })
		} catch {
			throw new FileSystemError(
				`Cannot create dist directory: ${paths.dist}`,
				paths.dist,
				'create'
			)
		}
	}

	// Vérifier les permissions d'écriture sur dist
	try {
		fs.accessSync(paths.dist, fs.constants.W_OK)
	} catch {
		throw new FileSystemError(
			`No write permission for dist directory: ${paths.dist}`,
			paths.dist,
			'access'
		)
	}

	return paths
}

/**
 * Valide un fichier source
 * @param {string} filePath - Chemin du fichier
 * @returns {Object} Informations sur le fichier validé
 */
export function validateSourceFile(filePath) {
	if (!fs.existsSync(filePath)) {
		throw new FileSystemError(`Source file does not exist: ${filePath}`, filePath, 'validate')
	}

	const stats = fs.statSync(filePath)

	if (!stats.isFile()) {
		throw new FileSystemError(`Path is not a file: ${filePath}`, filePath, 'validate')
	}

	// Vérifier les permissions de lecture
	try {
		fs.accessSync(filePath, fs.constants.R_OK)
	} catch {
		throw new FileSystemError(`No read permission for file: ${filePath}`, filePath, 'access')
	}

	// Vérifier que c'est un fichier JavaScript
	if (!filePath.endsWith('.js')) {
		throw new ValidationError(
			`File is not a JavaScript file: ${filePath}`,
			'filePath',
			filePath
		)
	}

	return {
		path: filePath,
		size: stats.size,
		modified: stats.mtime,
		name: path.basename(filePath, '.js'),
		extension: '.js'
	}
}

/**
 * Valide un fichier de destination
 * @param {string} filePath - Chemin du fichier de destination
 * @returns {Object} Informations sur le fichier de destination
 */
export function validateDestinationFile(filePath) {
	const dir = path.dirname(filePath)

	// Vérifier que le répertoire parent existe
	if (!fs.existsSync(dir)) {
		throw new FileSystemError(`Destination directory does not exist: ${dir}`, dir, 'validate')
	}

	// Vérifier les permissions d'écriture
	try {
		fs.accessSync(dir, fs.constants.W_OK)
	} catch {
		throw new FileSystemError(
			`No write permission for destination directory: ${dir}`,
			dir,
			'access'
		)
	}

	return {
		path: filePath,
		directory: dir,
		name: path.basename(filePath),
		extension: path.extname(filePath)
	}
}
