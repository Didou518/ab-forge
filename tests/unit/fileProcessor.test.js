import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import { FileProcessor } from '../../src/processors/fileProcessor.js'
import { BuildError, PluginError } from '../../src/errors/CustomError.js'
import { TEST_DIR, createUniqueTestDir } from '../setup.js'

// Mock des plugins
const mockPlugins = {
	css: vi.fn(async (content, filePath, fileName, fileExt) => {
		return content + '/* processed css */'
	}),
	html: vi.fn(async (content, filePath, fileName, fileExt) => {
		return content + '<!-- processed html -->'
	}),
	js: vi.fn(async (content, filePath, fileName, fileExt) => {
		return content + '// processed js'
	}),
	svg: vi.fn(async (content, filePath, fileName, fileExt) => {
		return content + '<svg><!-- processed svg --></svg>'
	})
}

// Mock de Babel
vi.mock('@babel/core', () => ({
	default: {
		transform: vi.fn((code, options, callback) => {
			// Simuler une transformation réussie
			callback(null, { code: `transformed_${code}` })
		})
	}
}))

// Mock d'UglifyJS
vi.mock('uglify-js', () => ({
	default: {
		minify: vi.fn((code) => ({
			code: `minified_${code}`,
			error: null
		}))
	}
}))

describe('FileProcessor', () => {
	let fileProcessor
	let testDir
	let sourceDir
	let distDir
	let srcDir

	beforeEach(async () => {
		// Créer un répertoire unique pour ce test
		testDir = createUniqueTestDir('fileProcessor')
		sourceDir = path.join(testDir, 'source')
		distDir = path.join(testDir, 'dist')
		srcDir = path.join(testDir, 'src')

		fileProcessor = new FileProcessor(mockPlugins, {
			debug: false,
			minify: true
		})

		// Créer la structure de répertoires
		await fs.mkdir(sourceDir, { recursive: true })
		await fs.mkdir(distDir, { recursive: true })
		await fs.mkdir(srcDir, { recursive: true })

		// Créer des fichiers de test
		await fs.writeFile(path.join(sourceDir, 'test.js'), 'console.log("Hello");')
		await fs.writeFile(path.join(srcDir, 'style.css'), '.test { color: red; }')
		await fs.writeFile(path.join(srcDir, 'template.html'), '<div>Test</div>')
	})

	afterEach(async () => {
		fileProcessor.clearCache()
		try {
			await fs.rm(testDir, { recursive: true, force: true })
		} catch {
			// Ignorer les erreurs de nettoyage
		}
		vi.clearAllMocks()
	})

	describe('constructor', () => {
		it('should initialize with plugins and options', () => {
			expect(fileProcessor.plugins).toBe(mockPlugins)
			expect(fileProcessor.options).toEqual({
				debug: false,
				minify: true
			})
			expect(fileProcessor.cache).toBeDefined()
			expect(fileProcessor.processedFiles).toBeDefined()
		})
	})

	describe('processAllFiles', () => {
		it('should process all JavaScript files', async () => {
			await fileProcessor.processAllFiles(sourceDir, distDir, srcDir)

			// Vérifier que les plugins ont été appelés
			expect(mockPlugins.css).toHaveBeenCalled()
			expect(mockPlugins.html).toHaveBeenCalled()

			// Vérifier que le fichier de destination a été créé
			const distFile = path.join(distDir, 'test.js')
			const exists = await fs.access(distFile).then(() => true).catch(() => false)
			expect(exists).toBe(true)
		})

		it('should handle empty source directory', async () => {
			const emptyDir = path.join(testDir, 'empty')
			await fs.mkdir(emptyDir, { recursive: true })

			await fileProcessor.processAllFiles(emptyDir, distDir, srcDir)

			// Aucun fichier ne devrait être traité
			expect(fileProcessor.processedFiles.size).toBe(0)
		})

		it('should handle non-existent source directory', async () => {
			const nonExistentDir = path.join(testDir, 'non-existent')

			// S'assurer que srcDir existe pour ce test
			await fs.mkdir(srcDir, { recursive: true })

			// Les erreurs sont maintenant gérées et affichées mais ne cassent pas l'exécution
			await fileProcessor.processAllFiles(nonExistentDir, distDir, srcDir)
		})
	})

	describe('processFile', () => {
		let sourceFile

		beforeEach(() => {
			sourceFile = path.join(sourceDir, 'test.js')
		})

		it('should process a single file', async () => {
			await fileProcessor.processFile(sourceFile, distDir, srcDir)

			// Vérifier que le fichier a été traité
			expect(fileProcessor.hasBeenProcessed(sourceFile)).toBe(true)

			// Vérifier que le fichier de destination existe
			const distFile = path.join(distDir, 'test.js')
			const exists = await fs.access(distFile).then(() => true).catch(() => false)
			expect(exists).toBe(true)
		})

		it('should skip unchanged files', async () => {
			// Premier traitement
			await fileProcessor.processFile(sourceFile, distDir, srcDir)

			// Deuxième traitement (fichier inchangé)
			await fileProcessor.processFile(sourceFile, distDir, srcDir)

			// Le fichier devrait être traité une seule fois
			expect(fileProcessor.processedFiles.size).toBe(1)
		})

		it('should handle directory input', async () => {
			const dirPath = path.join(testDir, 'subdir')
			await fs.mkdir(dirPath, { recursive: true })

			await fileProcessor.processFile(dirPath, distDir, srcDir)

			// Aucun fichier ne devrait être traité
			expect(fileProcessor.processedFiles.size).toBe(0)
		})
	})

	describe('processWithPlugins', () => {
		let sourceFile

		beforeEach(() => {
			sourceFile = path.join(sourceDir, 'test.js')
		})

		it('should process content with plugins', async () => {
			// Créer des fichiers de support pour que les plugins soient appelés
			await fs.writeFile(path.join(srcDir, 'style.css'), '.test { color: red; }')
			await fs.writeFile(path.join(srcDir, 'template.html'), '<div>Test</div>')

			const content = 'original content'
			const result = await fileProcessor.processWithPlugins(content, srcDir, sourceFile)

			// Vérifier que les plugins ont été appelés
			expect(mockPlugins.css).toHaveBeenCalled()
			expect(mockPlugins.html).toHaveBeenCalled()

			// Le contenu devrait être traité
			expect(result).toBeDefined()
			expect(result).toContain('original content')
			expect(result).toContain('/* processed css */')
			expect(result).toContain('<!-- processed html -->')
		})

		it('should handle empty src directory', async () => {
			const emptySrcDir = path.join(testDir, 'empty-src')
			await fs.mkdir(emptySrcDir, { recursive: true })

			const content = 'original content'
			const result = await fileProcessor.processWithPlugins(content, emptySrcDir, sourceFile)

			// Le contenu original devrait être retourné
			expect(result).toBe(content)
		})

		it('should filter out unsupported files', async () => {
			// Créer un fichier avec une extension non supportée
			await fs.writeFile(path.join(srcDir, 'unsupported.xyz'), 'unsupported content')
			// Créer aussi un fichier supporté pour que le traitement se fasse
			await fs.writeFile(path.join(srcDir, 'style.css'), '.test { color: red; }')

			const content = 'original content'
			const result = await fileProcessor.processWithPlugins(content, srcDir, sourceFile)

			// Le traitement devrait réussir sans erreur
			expect(result).toBeDefined()
			expect(result).toContain('original content')
		})

		it('should filter out hidden files', async () => {
			// Créer un fichier caché
			await fs.writeFile(path.join(srcDir, '.hidden'), 'hidden content')
			// Créer aussi un fichier supporté pour que le traitement se fasse
			await fs.writeFile(path.join(srcDir, 'style.css'), '.test { color: red; }')

			const content = 'original content'
			const result = await fileProcessor.processWithPlugins(content, srcDir, sourceFile)

			// Le traitement devrait réussir sans erreur
			expect(result).toBeDefined()
			expect(result).toContain('original content')
		})

		it('should throw PluginError when plugin fails', async () => {
			// Mock un plugin qui échoue
			mockPlugins.css.mockRejectedValueOnce(new Error('Plugin failed'))

			const content = 'original content'

			await expect(fileProcessor.processWithPlugins(content, srcDir, sourceFile))
				.rejects.toThrow(PluginError)
		})
	})

	describe('transformWithBabel', () => {
		it('should transform code with Babel', async () => {
			const code = 'const x = 1;'
			const result = await fileProcessor.transformWithBabel(code, 'test.js')

			expect(result.code).toBe(`transformed_${code}`)
		})

		it('should throw BuildError when Babel fails', async () => {
			// Mock Babel pour échouer
			const babel = await import('@babel/core')
			babel.default.transform.mockImplementationOnce((code, options, callback) => {
				callback(new Error('Babel error'), null)
			})

			const code = 'invalid syntax'

			await expect(fileProcessor.transformWithBabel(code, 'test.js'))
				.rejects.toThrow(BuildError)
		})
	})

	describe('minifyCode', () => {
		it('should minify code with UglifyJS', async () => {
			const code = 'const x = 1;'
			const result = await fileProcessor.minifyCode(code, 'test.js')

			expect(result).toBe(`minified_${code}`)
		})

		it('should throw BuildError when UglifyJS fails', async () => {
			// Mock UglifyJS pour échouer
			const UglifyJS = await import('uglify-js')
			UglifyJS.default.minify.mockReturnValueOnce({
				code: '',
				error: new Error('UglifyJS error')
			})

			const code = 'invalid syntax'

			await expect(fileProcessor.minifyCode(code, 'test.js'))
				.rejects.toThrow(BuildError)
		})
	})

	describe('getStats', () => {
		it('should return processing statistics', async () => {
			await fileProcessor.processFile(path.join(sourceDir, 'test.js'), distDir, srcDir)

			const stats = fileProcessor.getStats()

			expect(stats.processedFiles).toBe(1)
			expect(stats.options).toEqual({
				debug: false,
				minify: true
			})
			expect(stats.cacheStats).toBeDefined()
		})
	})

	describe('clearCache', () => {
		it('should clear cache and processed files', async () => {
			await fileProcessor.processFile(path.join(sourceDir, 'test.js'), distDir, srcDir)

			expect(fileProcessor.processedFiles.size).toBe(1)

			fileProcessor.clearCache()

			expect(fileProcessor.processedFiles.size).toBe(0)
		})
	})

	describe('hasBeenProcessed', () => {
		it('should return true for processed file', async () => {
			const sourceFile = path.join(sourceDir, 'test.js')

			await fileProcessor.processFile(sourceFile, distDir, srcDir)

			expect(fileProcessor.hasBeenProcessed(sourceFile)).toBe(true)
		})

		it('should return false for unprocessed file', () => {
			const unprocessedFile = path.join(sourceDir, 'unprocessed.js')

			expect(fileProcessor.hasBeenProcessed(unprocessedFile)).toBe(false)
		})
	})
})
