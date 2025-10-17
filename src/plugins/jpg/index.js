import fs from 'node:fs/promises'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'

/**
 * Handles JPG files processing
 *
 * @param {string} data - The source data to process
 * @param {string} file - The absolute path of the file to be processed
 * @param {string} fileName - The fileName of the file to be replaced in source file
 * @param {string} fileExt - The file extension
 * @returns {Promise<string>} Processed content
 */
async function handleJpgFile(data, file, fileName, fileExt) {
	try {
		const response = await getJpgOutput(file)
		return replaceContent(data, fileName, fileExt, response)
	} catch (error) {
		throw new Error(`JPG plugin failed for ${file}: ${error.message}`)
	}
}

/**
 * Reads a JPG file and converts it to base64
 *
 * @param {string} filePath - Path to the JPG file
 * @returns {Promise<string>} Base64 encoded image
 */
async function getJpgOutput(filePath) {
	try {
		const data = await fs.readFile(filePath)

		// Configuration basée sur CONFIG.PLUGINS.JPG
		const mimeType = CONFIG.PLUGINS.JPG.mimeType || 'image/jpeg'

		// Convert binary data to base64 string
		const base64Image = `data:${mimeType};base64,${data.toString('base64')}`
		return base64Image
	} catch (error) {
		throw new Error(`JPG processing failed for ${filePath}: ${error.message}`)
	}
}

export { handleJpgFile }
