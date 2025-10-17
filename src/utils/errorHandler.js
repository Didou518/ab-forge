import chalk from 'chalk'
import { BuildError, FileSystemError, PluginError, ValidationError } from '../errors/CustomError.js'

/**
 * Gère les erreurs de manière centralisée
 * @param {Error} error - L'erreur à gérer
 * @param {Object} context - Contexte supplémentaire
 */
export function handleError(error, context = {}) {
	const isDevelopment = process.env.NODE_ENV === 'development'

	// Gestion spécifique selon le type d'erreur
	if (error instanceof ValidationError) {
		handleValidationError(error, context)
	} else if (error instanceof FileSystemError) {
		handleFileSystemError(error, context)
	} else if (error instanceof PluginError) {
		handlePluginError(error, context)
	} else if (error instanceof BuildError) {
		handleBuildError(error, context)
	} else {
		handleGenericError(error, context)
	}

	// Afficher la stack trace en mode développement
	if (isDevelopment && error.stack) {
		console.error(chalk.gray('\nStack trace:'))
		console.error(chalk.gray(error.stack))
	}
}

/**
 * Gère les erreurs de validation
 */
function handleValidationError(error, context) {
	console.error(chalk.bold(chalk.red('❌ Validation Error:')))
	console.error(chalk.red(`   ${error.message}`))

	if (error.field) {
		console.error(chalk.yellow(`   Field: ${error.field}`))
	}

	if (error.value !== undefined) {
		console.error(chalk.yellow(`   Value: ${error.value}`))
	}

	if (context.suggestion) {
		console.error(chalk.cyan(`   💡 Suggestion: ${context.suggestion}`))
	}
}

/**
 * Gère les erreurs de système de fichiers
 */
function handleFileSystemError(error, context) {
	console.error(chalk.bold(chalk.red('❌ File System Error:')))
	console.error(chalk.red(`   ${error.message}`))

	if (error.filePath) {
		console.error(chalk.yellow(`   File: ${error.filePath}`))
	}

	if (error.operation) {
		console.error(chalk.yellow(`   Operation: ${error.operation}`))
	}

	if (context.suggestion) {
		console.error(chalk.cyan(`   💡 Suggestion: ${context.suggestion}`))
	}
}

/**
 * Gère les erreurs de plugin
 */
function handlePluginError(error, context) {
	console.error(chalk.bold(chalk.red('❌ Plugin Error:')))
	console.error(chalk.red(`   ${error.message}`))

	if (error.pluginName) {
		console.error(chalk.yellow(`   Plugin: ${error.pluginName}`))
	}

	if (error.filePath) {
		console.error(chalk.yellow(`   File: ${error.filePath}`))
	}

	if (context.suggestion) {
		console.error(chalk.cyan(`   💡 Suggestion: ${context.suggestion}`))
	}
}

/**
 * Gère les erreurs de build
 */
function handleBuildError(error, context) {
	console.error(chalk.bold(chalk.red('❌ Build Error:')))
	console.error(chalk.red(`   ${error.message}`))

	if (error.filePath) {
		console.error(chalk.yellow(`   File: ${error.filePath}`))
	}

	if (context.suggestion) {
		console.error(chalk.cyan(`   💡 Suggestion: ${context.suggestion}`))
	}
}

/**
 * Gère les erreurs génériques
 */
function handleGenericError(error, context) {
	console.error(chalk.bold(chalk.red('❌ Unexpected Error:')))
	console.error(chalk.red(`   ${error.message}`))

	if (context.operation) {
		console.error(chalk.yellow(`   Operation: ${context.operation}`))
	}

	if (context.suggestion) {
		console.error(chalk.cyan(`   💡 Suggestion: ${context.suggestion}`))
	}
}

/**
 * Affiche un message d'erreur avec formatage
 */
export function logError(message, details = {}) {
	console.error(chalk.bold(chalk.red('❌ Error:')))
	console.error(chalk.red(`   ${message}`))

	if (details.file) {
		console.error(chalk.yellow(`   File: ${details.file}`))
	}

	if (details.line) {
		console.error(chalk.yellow(`   Line: ${details.line}`))
	}

	if (details.suggestion) {
		console.error(chalk.cyan(`   💡 Suggestion: ${details.suggestion}`))
	}
}

/**
 * Affiche un avertissement avec formatage
 */
export function logWarning(message, details = {}) {
	console.warn(chalk.bold(chalk.yellow('⚠️  Warning:')))
	console.warn(chalk.yellow(`   ${message}`))

	if (details.file) {
		console.warn(chalk.gray(`   File: ${details.file}`))
	}

	if (details.suggestion) {
		console.warn(chalk.cyan(`   💡 Suggestion: ${details.suggestion}`))
	}
}
