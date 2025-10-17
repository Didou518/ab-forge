import fs from 'node:fs/promises'
import { minify } from 'html-minifier'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'

/**
 * Handles HTML files processing
 *
 * @param {string} data - The source data to process
 * @param {string} file - The absolute path of the file to be processed
 * @param {string} fileName - The fileName of the file to be replaced in source file
 * @param {string} fileExt - The file extension
 * @returns {Promise<string>} Processed content
 */
async function handleHtmlFile(data, file, fileName, fileExt) {
	try {
		const response = await getHtmlOutput(file)
		return replaceContent(data, fileName, fileExt, response)
	} catch (error) {
		throw new Error(`HTML plugin failed for ${file}: ${error.message}`)
	}
}

/**
 * Minifies an HTML file content
 *
 * @param {string} filePath - Path to the HTML file
 * @returns {Promise<string>} Minified HTML content
 */
async function getHtmlOutput(filePath) {
	try {
		const html = await fs.readFile(filePath, 'utf8')

		// Configuration basée sur CONFIG.PLUGINS.HTML
		const minifyOptions = {
			removeAttributeQuotes: CONFIG.PLUGINS.HTML.removeAttributeQuotes !== false,
			collapseWhitespace: CONFIG.PLUGINS.HTML.collapseWhitespace !== false,
			collapseInlineTagWhitespace: CONFIG.PLUGINS.HTML.collapseInlineTagWhitespace !== false,
			removeComments: CONFIG.PLUGINS.HTML.removeComments !== false,
			minifyCSS: CONFIG.PLUGINS.HTML.minifyCSS !== false,
			minifyJS: CONFIG.PLUGINS.HTML.minifyJS !== false,
			removeRedundantAttributes: CONFIG.PLUGINS.HTML.removeRedundantAttributes !== false,
			removeEmptyAttributes: CONFIG.PLUGINS.HTML.removeEmptyAttributes !== false
		}

		return minify(html, minifyOptions)
	} catch (error) {
		throw new Error(`HTML minification failed for ${filePath}: ${error.message}`)
	}
}

export { handleHtmlFile }
