import fs from 'node:fs/promises'
import autoprefixer from 'autoprefixer'
import chalk from 'chalk'
import cssnano from 'cssnano'
import postcss from 'postcss'
import postcssNested from 'postcss-nested'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'

/**
 * Handles CSS files processing with PostCSS
 *
 * @param {string} data - The source data to process
 * @param {string} file - The absolute path of the file to be processed
 * @param {string} fileName - The fileName of the file to be replaced in source file
 * @param {string} fileExt - The file extension
 * @returns {Promise<string>} Processed content
 */
async function handleCssFile(data, file, fileName, fileExt) {
	try {
		const response = await getCssOutput(file)
		return replaceContent(data, fileName, fileExt, response)
	} catch (error) {
		throw new Error(`CSS plugin failed for ${file}: ${error.message}`)
	}
}

/**
 * Process a CSS file with PostCSS
 *
 * @param {string} filePath - Path to the CSS file
 * @returns {Promise<string>} Processed CSS content
 */
async function getCssOutput(filePath) {
	try {
		const css = await fs.readFile(filePath, 'utf8')

		// Configuration PostCSS basée sur CONFIG.PLUGINS.CSS
		const plugins = []

		if (CONFIG.PLUGINS.CSS.nesting !== false) {
			plugins.push(postcssNested)
		}

		if (CONFIG.PLUGINS.CSS.autoprefixer !== false) {
			plugins.push(autoprefixer)
		}

		if (CONFIG.PLUGINS.CSS.minify !== false) {
			plugins.push(cssnano)
		}

		const result = await postcss(plugins).process(css, {
			from: filePath,
			to: undefined
		})

		return result.css
	} catch (error) {
		console.error(chalk.red(`ERROR plugin:postcss on file ${filePath}:`, error.message))
		throw error
	}
}

export { handleCssFile }
