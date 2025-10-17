import fs from 'node:fs/promises'
import { optimize } from 'svgo'
import { CONFIG } from '../../config/index.js'
import replaceContent from '../../replace-content.js'

/**
 * Handles SVG files processing
 *
 * @param {string} data - The source data to process
 * @param {string} file - The absolute path of the file to be processed
 * @param {string} fileName - The fileName of the file to be replaced in source file
 * @param {string} fileExt - The file extension
 * @returns {Promise<string>} Processed content
 */
async function handleSvgFile(data, file, fileName, fileExt) {
	try {
		const response = await getSvgOutput(file)
		return replaceContent(data, fileName, fileExt, response)
	} catch (error) {
		throw new Error(`SVG plugin failed for ${file}: ${error.message}`)
	}
}

/**
 * Optimizes an SVG file content
 *
 * @param {string} filePath - Path to the SVG file
 * @returns {Promise<string>} Optimized SVG content
 */
async function getSvgOutput(filePath) {
	try {
		const svg = await fs.readFile(filePath, 'utf8')

		// Configuration SVGO basée sur CONFIG.PLUGINS.SVG
		const svgoConfig = {
			path: filePath,
			plugins: [
				{
					name: 'preset-default',
					params: {
						overrides: {
							removeMetadata: CONFIG.PLUGINS.SVG.removeMetadata !== false,
							removeViewBox: CONFIG.PLUGINS.SVG.removeViewBox === true,
							cleanupNumericValues: CONFIG.PLUGINS.SVG.cleanupNumericValues !== false
						}
					}
				}
			]
		}

		const result = optimize(svg, svgoConfig)
		return result.data
	} catch (error) {
		throw new Error(`SVG optimization failed for ${filePath}: ${error.message}`)
	}
}

export { handleSvgFile }
