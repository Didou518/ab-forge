import fs from 'node:fs/promises'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'

/**
 * Handles JSON files processing
 *
 * @param {string} data - The source data to process
 * @param {string} file - The absolute path of the file to be processed
 * @param {string} fileName - The fileName of the file to be replaced in source file
 * @param {string} fileExt - The file extension
 * @returns {Promise<string>} Processed content
 */
async function handleJsonFile(data, file, fileName, fileExt) {
	try {
		const response = await getJsonOutput(file)
		return replaceContent(data, fileName, fileExt, response)
	} catch (error) {
		throw new Error(`JSON plugin failed for ${file}: ${error.message}`)
	}
}

/**
 * Process a JSON file
 *
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<string>} Processed JSON content
 */
async function getJsonOutput(filePath) {
	try {
		const jsonContent = await fs.readFile(filePath, 'utf8')

		// Parse and validate JSON
		const parsedJson = JSON.parse(jsonContent)

		// Configuration basée sur CONFIG.PLUGINS.JSON
		const stringifyOptions = {
			space: CONFIG.PLUGINS.JSON.prettyPrint ? 2 : 0
		}

		return JSON.stringify(parsedJson, null, stringifyOptions.space)
	} catch (error) {
		if (error instanceof SyntaxError) {
			throw new Error(`Invalid JSON syntax in ${filePath}: ${error.message}`)
		}
		throw new Error(`JSON processing failed for ${filePath}: ${error.message}`)
	}
}

export { handleJsonFile }
