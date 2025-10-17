import fs from 'node:fs/promises'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'

/**
 * Handles JS files processing
 * Reads JavaScript files and replaces placeholders with their content
 *
 * @param {string} data - The source data to process
 * @param {string} file - The absolute path of the file to be processed
 * @param {string} fileName - The fileName of the file to be replaced in source file
 * @param {string} fileExt - The file extension
 * @returns {Promise<string>} Processed content
 */
async function handleJsFile(data, file, fileName, fileExt) {
	try {
		const response = await getJsOutput(file)

		// Gérer la nouvelle syntaxe avec commentaires multi-lignes
		const newSyntaxPattern = new RegExp(`/\\*\\s*{{${fileExt}/${fileName}}}\\s*\\*/`, 'g')
		if (newSyntaxPattern.test(data)) {
			return data.replace(newSyntaxPattern, response)
		}

		// Fallback vers l'ancienne syntaxe pour compatibilité
		return replaceContent(data, fileName, fileExt, response)
	} catch (error) {
		throw new Error(`JS plugin failed for ${file}: ${error.message}`)
	}
}

/**
 * Reads and processes a JavaScript file
 *
 * @param {string} filePath - Path to the JavaScript file
 * @returns {Promise<string>} JavaScript file content
 */
async function getJsOutput(filePath) {
	try {
		const jsContent = await fs.readFile(filePath, 'utf8')

		// Configuration basée sur CONFIG.PLUGINS.JS
		let processedContent = jsContent

		// Option pour ajouter des commentaires de debug
		if (CONFIG.PLUGINS.JS.addDebugComments) {
			const fileName = filePath.split('/').pop()
			processedContent = `// File: ${fileName}\n${processedContent}`
		}

		// Option pour ajouter des commentaires de séparation
		if (CONFIG.PLUGINS.JS.addSeparators) {
			processedContent = `\n// ===== ${filePath.split('/').pop()} =====\n${processedContent}\n`
		}

		return processedContent
	} catch (error) {
		throw new Error(`JS file reading failed for ${filePath}: ${error.message}`)
	}
}

export { handleJsFile }
