import { handleCssFile } from './css/index.js'
import { handleHtmlFile } from './html/index.js'
import { handleJpgFile } from './jpg/index.js'
import { handleJsFile } from './js/index.js'
import { handleJsonFile } from './json/index.js'
import { handleSvgFile } from './svg/index.js'

/**
 * Plugins registry for file processing
 * Each plugin handles a specific file type and returns processed content
 */
const plugins = {
	css: handleCssFile,
	html: handleHtmlFile,
	js: handleJsFile,
	svg: handleSvgFile,
	json: handleJsonFile,
	jpg: handleJpgFile
}

export default plugins
