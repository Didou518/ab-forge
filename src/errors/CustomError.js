/**
 * Classe d'erreur personnalisée pour les erreurs de build
 */
export class BuildError extends Error {
	constructor(message, filePath = null, originalError = null) {
		super(message)
		this.name = 'BuildError'
		this.filePath = filePath
		this.originalError = originalError
		this.timestamp = new Date().toISOString()
	}
}

/**
 * Classe d'erreur pour les erreurs de validation de configuration
 */
export class ValidationError extends Error {
	constructor(message, field = null, value = null) {
		super(message)
		this.name = 'ValidationError'
		this.field = field
		this.value = value
		this.timestamp = new Date().toISOString()
	}
}

/**
 * Classe d'erreur pour les erreurs de système de fichiers
 */
export class FileSystemError extends Error {
	constructor(message, filePath = null, operation = null) {
		super(message)
		this.name = 'FileSystemError'
		this.filePath = filePath
		this.operation = operation
		this.timestamp = new Date().toISOString()
	}
}

/**
 * Classe d'erreur pour les erreurs de plugin
 */
export class PluginError extends Error {
	constructor(message, pluginName = null, filePath = null) {
		super(message)
		this.name = 'PluginError'
		this.pluginName = pluginName
		this.filePath = filePath
		this.timestamp = new Date().toISOString()
	}
}
