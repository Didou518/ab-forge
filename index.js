import chalk from 'chalk'
import chokidar from 'chokidar'
import patch from 'log-timestamp'
import yargs from 'yargs'
import { CONFIG } from './src/config/index.js'
import { validateArgs } from './src/config/validator.js'
import plugins from './src/plugins/index.js'
import { FileProcessor } from './src/processors/fileProcessor.js'
import { handleError } from './src/utils/errorHandler.js'

patch(() => {
	return `[${new Date().toLocaleString()}]`
})

const argv = yargs(process.argv.slice(2)).argv

// Validation et configuration centralisée
let config
try {
	config = validateArgs(argv)
} catch (error) {
	handleError(error, {
		suggestion: 'Use --dir <path> to specify a valid directory path'
	})
	process.exit(1)
}

// Extraction des chemins depuis la configuration validée
const { paths } = config
const pathToSrcFiles = paths.src
const pathToSource = paths.source
const pathToDist = paths.dist

// Créer le processeur de fichiers
const fileProcessor = new FileProcessor(plugins, {
	debug: config.debug,
	minify: !config.debug
})

// Fonction principale async/await
async function main() {
	try {
		if (config.build) {
			// Mode build unique
			console.log(chalk.cyan('🚀 Starting build process...'))
			await fileProcessor.processAllFiles(pathToSource, pathToDist, pathToSrcFiles)
			console.log(chalk.green('✅ Build completed successfully!'))
		} else {
			// Mode watch avec gestion d'erreurs
			console.log(chalk.cyan(`${CONFIG.MESSAGES.SUCCESS.WATCH_STARTED} on ${pathToSource}`))
			const watcher = chokidar.watch(pathToSource, {
				ignored: CONFIG.WATCHER.IGNORED_PATTERNS,
				persistent: CONFIG.WATCHER.PERSISTENT
			})

			watcher
				.on('ready', async () => {
					console.log(chalk.yellow(CONFIG.MESSAGES.INFO.INITIAL_SCAN))
					await fileProcessor.processAllFiles(pathToSource, pathToDist, pathToSrcFiles)

					watcher.on('add', async (filePath) => {
						console.log(
							chalk.yellow(
								CONFIG.MESSAGES.INFO.FILE_ADDED,
								filePath.replace(pathToSource, '')
							)
						)

						// Vérifier si c'est un fichier dans src/ ou un fichier JS à la racine
						if (filePath.includes('/src/')) {
							await fileProcessor.processSrcFileChange(
								filePath,
								pathToDist,
								pathToSrcFiles
							)
						} else {
							await fileProcessor.processAllFiles(
								pathToSource,
								pathToDist,
								pathToSrcFiles
							)
						}
					})
				})
				.on('change', async (filePath) => {
					console.log(
						chalk.yellow(
							CONFIG.MESSAGES.INFO.FILE_CHANGED,
							filePath.replace(pathToSource, '')
						)
					)

					// Vérifier si c'est un fichier dans src/ ou un fichier JS à la racine
					if (filePath.includes('/src/')) {
						await fileProcessor.processSrcFileChange(
							filePath,
							pathToDist,
							pathToSrcFiles
						)
					} else {
						await fileProcessor.processAllFiles(
							pathToSource,
							pathToDist,
							pathToSrcFiles
						)
					}
				})
				.on('unlink', async (filePath) => {
					console.log(
						chalk.yellow(
							CONFIG.MESSAGES.INFO.FILE_REMOVED,
							filePath.replace(pathToSource, '')
						)
					)

					// Vérifier si c'est un fichier dans src/ ou un fichier JS à la racine
					if (filePath.includes('/src/')) {
						await fileProcessor.processSrcFileChange(
							filePath,
							pathToDist,
							pathToSrcFiles
						)
					} else {
						await fileProcessor.processAllFiles(
							pathToSource,
							pathToDist,
							pathToSrcFiles
						)
					}
				})
				.on('error', (error) => {
					handleError(error, {
						operation: 'file watching',
						suggestion: 'Check file permissions and directory access'
					})
				})
		}
	} catch (error) {
		handleError(error, {
			operation: 'main execution',
			suggestion: 'Check your configuration and try again'
		})
		process.exit(1)
	}
}

// Exécuter la fonction principale
main()
