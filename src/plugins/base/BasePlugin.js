/**
 * Base plugin class for all file processors
 * Provides common functionality and error handling
 */
export class BasePlugin {
	/**
	 * Creates a new plugin instance
	 * @param {string} name - Plugin name
	 * @param {Object} config - Plugin configuration
	 */
	constructor(name) {
		this.name = name
	}

	/**
	 * Main plugin handler method
	 * @param {string} data - Source data to process
	 * @param {string} file - File path
	 * @param {string} fileName - File name
	 * @param {string} fileExt - File extension
	 * @returns {Promise<string>} Processed content
	 */
	async handle(data, file, fileName, fileExt) {
		try {
			const processedContent = await this.process(file)
			return this.replaceContent(data, fileName, fileExt, processedContent)
		} catch (error) {
			throw new Error(`${this.name} plugin failed for ${file}: ${error.message}`)
		}
	}

	/**
	 * Process the file content (to be implemented by subclasses)
	 * @param {string} filePath - Path to the file
	 * @returns {Promise<string>} Processed content
	 */
	async process(filePath) {
		throw new Error('process method must be implemented by subclass')
	}

	/**
	 * Replace content in source data
	 * @param {string} data - Source data
	 * @param {string} fileName - File name
	 * @param {string} fileExt - File extension
	 * @param {string} content - Content to insert
	 * @returns {string} Updated data
	 */
	replaceContent(data, fileName, fileExt, content) {
		return data.replace(new RegExp(`{{${fileExt}/${fileName}}}`, 'g'), content)
	}

	/**
	 * Validate file exists and is readable
	 * @param {string} filePath - Path to validate
	 * @returns {Promise<boolean>} True if valid
	 */
	async validateFile(filePath) {
		try {
			const fs = await import('node:fs/promises')
			const stats = await fs.stat(filePath)
			return stats.isFile()
		} catch {
			return false
		}
	}
}
