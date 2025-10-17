import path from 'node:path'
import babel from '@babel/core'
import chalk from 'chalk'
import UglifyJS from 'uglify-js'
import { CONFIG } from '../config/index.js'
import { BuildError, PluginError } from '../errors/CustomError.js'
import { CacheManager } from '../utils/cache.js'
import { DependencyTracker } from '../utils/dependencyTracker.js'
import { handleError } from '../utils/errorHandler.js'
import * as FileSystemUtils from '../utils/fileSystem.js'

/**
 * Processeur de fichiers moderne avec async/await
 */
export class FileProcessor {
	constructor(plugins, options = {}) {
		this.plugins = plugins
		this.options = options
		this.cache = new CacheManager()
		this.dependencyTracker = new DependencyTracker()
		this.processedFiles = new Set()
	}

	/**
	 * Traite tous les fichiers d'un répertoire
	 * @param {string} sourceDir - Répertoire source
	 * @param {string} distDir - Répertoire de destination
	 * @param {string} srcDir - Répertoire des fichiers de support
	 * @returns {Promise<void>}
	 */
	async processAllFiles(sourceDir, distDir, srcDir) {
		try {
			const files = await FileSystemUtils.readDirectory(sourceDir)
			const jsFiles = files.filter((file) => file.endsWith('.js'))

			if (jsFiles.length === 0) {
				console.log(chalk.yellow('No JavaScript files found to process'))
				return
			}

			console.log(chalk.cyan(`Processing ${jsFiles.length} JavaScript file(s)...`))

			// Traitement parallèle des fichiers
			await Promise.all(
				jsFiles.map((file) => this.processFile(path.join(sourceDir, file), distDir, srcDir))
			)

			console.log(chalk.green(`✅ Successfully processed ${jsFiles.length} file(s)`))
		} catch (error) {
			handleError(error, {
				operation: 'processing all files',
				suggestion: 'Check your source directory and file permissions'
			})
		}
	}

	/**
	 * Traite un fichier individuel
	 * @param {string} sourceFile - Fichier source
	 * @param {string} distDir - Répertoire de destination
	 * @param {string} srcDir - Répertoire des fichiers de support
	 * @returns {Promise<void>}
	 */
	async processFile(sourceFile, distDir, srcDir) {
		try {
			// Vérifier si le fichier a été modifié ou si ses dépendances ont changé
			const fileChanged = await this.cache.hasFileContentChanged(sourceFile)
			const dependenciesChanged = await this.dependencyTracker.shouldRegenerateJsFile(
				sourceFile,
				srcDir
			)

			if (!fileChanged && !dependenciesChanged) {
				console.log(chalk.gray(`⏭️  Skipping unchanged file: ${path.basename(sourceFile)}`))
				return
			}

			if (dependenciesChanged && !fileChanged) {
				console.log(
					chalk.yellow(
						`🔄 Regenerating due to dependency changes: ${path.basename(sourceFile)}`
					)
				)
			}

			// Vérifier si c'est un répertoire
			const stats = await FileSystemUtils.getStats(sourceFile)
			if (stats.isDirectory()) {
				return
			}

			const fileName = path.basename(sourceFile, '.js')
			const distFile = path.join(distDir, `${fileName}.js`)

			console.log(chalk.blue(`🔄 Processing: ${fileName}.js`))

			// Lire le contenu du fichier source
			const sourceData = await FileSystemUtils.readFile(sourceFile)

			// Traiter avec les plugins
			const processedData = await this.processWithPlugins(sourceData, srcDir, sourceFile)

			// Transpiler avec Babel
			const babelResult = await this.transformWithBabel(processedData, sourceFile)

			// Minifier si nécessaire
			const finalCode = this.options.debug
				? babelResult.code
				: await this.minifyCode(babelResult.code, sourceFile)

			// Écrire le fichier de destination
			await FileSystemUtils.writeFile(distFile, finalCode)

			// Mettre en cache le résultat
			await this.cache.setCache(sourceFile, {
				processed: true,
				timestamp: Date.now(),
				size: finalCode.length
			})

			console.log(chalk.green(`✅ Generated: ${path.relative(process.cwd(), distFile)}`))
			this.processedFiles.add(sourceFile)
		} catch (error) {
			handleError(error, {
				operation: 'processing file',
				file: sourceFile,
				suggestion: 'Check file syntax and plugin configuration'
			})
		}
	}

	/**
	 * Traite le contenu avec les plugins
	 * @param {string} content - Contenu à traiter
	 * @param {string} srcDir - Répertoire des fichiers de support
	 * @param {string} sourceFile - Fichier source pour le contexte
	 * @returns {Promise<string>} Contenu traité
	 */
	async processWithPlugins(content, srcDir, sourceFile) {
		try {
			// Obtenir tous les fichiers de support
			const allFiles = await FileSystemUtils.getAllFilesFromDirectory(srcDir)

			// Filtrer les fichiers supportés
			const supportFiles = allFiles.filter((file) => {
				const fileName = path.basename(file)
				const fileExt = path.extname(file).replace('.', '')

				// Ignorer les fichiers cachés (commençant par .)
				if (fileName.startsWith('.')) {
					return false
				}

				// Ignorer les fichiers sans extension
				if (!fileExt) {
					return false
				}

				// Vérifier si l'extension est supportée
				return this.plugins[fileExt] !== undefined
			})

			if (supportFiles.length === 0) {
				console.log(chalk.yellow(`⚠️  No supported files found in ${srcDir}`))
				return content
			}

			let processedContent = content

			// Traiter avec chaque plugin
			for (const file of supportFiles) {
				const fileName = path.basename(file, path.extname(file))
				const fileExt = path.extname(file).replace('.', '')

				try {
					processedContent = await this.plugins[fileExt](
						processedContent,
						file,
						fileName,
						fileExt
					)
				} catch (pluginError) {
					throw new PluginError(
						`Plugin ${fileExt} failed: ${pluginError.message}`,
						fileExt,
						file
					)
				}
			}

			return processedContent
		} catch (error) {
			if (error instanceof PluginError) {
				throw error
			}
			throw new BuildError(`Plugin processing failed: ${error.message}`, sourceFile, error)
		}
	}

	/**
	 * Transpile le code avec Babel
	 * @param {string} code - Code à transpiler
	 * @param {string} sourceFile - Fichier source pour le contexte
	 * @returns {Promise<Object>} Résultat de Babel
	 */
	async transformWithBabel(code, sourceFile) {
		return new Promise((resolve, reject) => {
			babel.transform(
				code,
				{
					...CONFIG.BABEL.options,
					filename: sourceFile
				},
				(err, result) => {
					if (err) {
						reject(
							new BuildError(
								`Babel transformation failed: ${err.message}`,
								sourceFile,
								err
							)
						)
					} else {
						resolve(result)
					}
				}
			)
		})
	}

	/**
	 * Minifie le code avec UglifyJS
	 * @param {string} code - Code à minifier
	 * @param {string} sourceFile - Fichier source pour le contexte
	 * @returns {Promise<string>} Code minifié
	 */
	async minifyCode(code, sourceFile) {
		try {
			const result = UglifyJS.minify(code, CONFIG.UGLIFY.options)

			if (result.error) {
				throw new BuildError(
					`UglifyJS minification failed: ${result.error.message}`,
					sourceFile,
					result.error
				)
			}

			return result.code
		} catch (error) {
			if (error instanceof BuildError) {
				throw error
			}
			throw new BuildError(`Minification failed: ${error.message}`, sourceFile, error)
		}
	}

	/**
	 * Obtient les statistiques de traitement
	 * @returns {Object} Statistiques
	 */
	getStats() {
		return {
			processedFiles: this.processedFiles.size,
			cacheStats: this.cache.getCacheStats(),
			options: this.options
		}
	}

	/**
	 * Traite les changements de fichiers dans le répertoire src/
	 * et régénère uniquement les fichiers JS affectés
	 * @param {string} changedFilePath - Chemin du fichier modifié
	 * @param {string} sourceDir - Répertoire source des fichiers JS
	 * @param {string} distDir - Répertoire de destination
	 * @param {string} srcDir - Répertoire des fichiers de support
	 * @returns {Promise<void>}
	 */
	async processSrcFileChange(changedFilePath, distDir, srcDir) {
		try {
			// Trouver les fichiers JS qui dépendent de ce fichier modifié
			const affectedJsFiles = this.dependencyTracker.getAffectedJsFiles(changedFilePath)

			if (affectedJsFiles.size === 0) {
				console.log(
					chalk.gray(`⏭️  No JS files depend on: ${path.basename(changedFilePath)}`)
				)
				return
			}

			console.log(chalk.cyan(`📁 File changed: ${path.basename(changedFilePath)}`))
			console.log(
				chalk.blue(`🔄 Regenerating ${affectedJsFiles.size} affected JS file(s)...`)
			)

			// Traiter chaque fichier JS affecté
			for (const jsFilePath of affectedJsFiles) {
				await this.processFile(jsFilePath, distDir, srcDir)
			}

			console.log(chalk.green(`✅ Successfully regenerated ${affectedJsFiles.size} file(s)`))
		} catch (error) {
			handleError(error, {
				operation: 'processing src file change',
				file: changedFilePath,
				suggestion: 'Check file permissions and dependency tracking'
			})
		}
	}

	/**
	 * Vide le cache
	 * @returns {void}
	 */
	clearCache() {
		this.cache.clearCache()
		this.dependencyTracker.clearCache()
		this.processedFiles.clear()
	}

	/**
	 * Vérifie si un fichier a été traité
	 * @param {string} filePath - Chemin du fichier
	 * @returns {boolean} True si le fichier a été traité
	 */
	hasBeenProcessed(filePath) {
		return this.processedFiles.has(path.resolve(filePath))
	}
}
