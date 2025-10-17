import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import {
	ensureDirectoryExists,
	readFile,
	writeFile,
	readDirectory,
	getStats,
	fileExists,
	getAllFilesFromDirectory,
	getFileHash,
	getFileCacheInfo
} from '../../src/utils/fileSystem.js'
import { FileSystemError } from '../../src/errors/CustomError.js'
import { TEST_DIR } from '../setup.js'

describe('FileSystem Utils', () => {
	const testDir = path.join(TEST_DIR, 'fileSystem')
	const testFile = path.join(testDir, 'test.txt')
	const testContent = 'Hello, World!'

	beforeEach(async () => {
		// Créer le répertoire de test
		await fs.mkdir(testDir, { recursive: true })
	})

	afterEach(async () => {
		// Nettoyer après chaque test
		try {
			await fs.rm(testDir, { recursive: true, force: true })
		} catch {
			// Ignorer les erreurs de nettoyage
		}
	})

	describe('ensureDirectoryExists', () => {
		it('should create directory if it does not exist', async () => {
			const newDir = path.join(testDir, 'newDir')

			const result = await ensureDirectoryExists(newDir, true)

			expect(result).toBe(true)
			const stats = await fs.stat(newDir)
			expect(stats.isDirectory()).toBe(true)
		})

		it('should return true if directory already exists', async () => {
			const result = await ensureDirectoryExists(testDir, true)

			expect(result).toBe(true)
		})

		it('should throw error if directory does not exist and createIfNotExists is false', async () => {
			const nonExistentDir = path.join(testDir, 'nonExistent')

			await expect(ensureDirectoryExists(nonExistentDir, false))
				.rejects.toThrow(FileSystemError)
		})
	})

	describe('readFile', () => {
		beforeEach(async () => {
			await fs.writeFile(testFile, testContent, 'utf8')
		})

		it('should read file content', async () => {
			const content = await readFile(testFile)

			expect(content).toBe(testContent)
		})

		it('should read file with custom encoding', async () => {
			const content = await readFile(testFile, 'utf8')

			expect(content).toBe(testContent)
		})

		it('should throw error if file does not exist', async () => {
			const nonExistentFile = path.join(testDir, 'nonExistent.txt')

			await expect(readFile(nonExistentFile))
				.rejects.toThrow(FileSystemError)
		})
	})

	describe('writeFile', () => {
		it('should write file content', async () => {
			await writeFile(testFile, testContent)

			const content = await fs.readFile(testFile, 'utf8')
			expect(content).toBe(testContent)
		})

		it('should create parent directories if they do not exist', async () => {
			const nestedFile = path.join(testDir, 'nested', 'deep', 'file.txt')

			await writeFile(nestedFile, testContent)

			const content = await fs.readFile(nestedFile, 'utf8')
			expect(content).toBe(testContent)
		})

		it('should throw error if cannot write file', async () => {
			// Utiliser vi.mock pour forcer une erreur sur fs.writeFile
			const originalWriteFile = fs.writeFile

			// Mock fs.writeFile pour qu'il lance une erreur
			fs.writeFile = vi.fn().mockRejectedValue(new Error('Mocked write error'))

			try {
				await expect(writeFile(path.join(testDir, 'test.txt'), testContent))
					.rejects.toThrow(FileSystemError)
			} finally {
				// Restaurer la fonction originale
				fs.writeFile = originalWriteFile
			}
		})
	})

	describe('readDirectory', () => {
		beforeEach(async () => {
			// Créer plusieurs fichiers et répertoires
			await fs.writeFile(path.join(testDir, 'file1.txt'), 'content1')
			await fs.writeFile(path.join(testDir, 'file2.txt'), 'content2')
			await fs.mkdir(path.join(testDir, 'subdir'))
		})

		it('should read directory contents', async () => {
			const contents = await readDirectory(testDir)

			expect(contents).toContain('file1.txt')
			expect(contents).toContain('file2.txt')
			expect(contents).toContain('subdir')
		})

		it('should throw error if directory does not exist', async () => {
			const nonExistentDir = path.join(testDir, 'nonExistent')

			await expect(readDirectory(nonExistentDir))
				.rejects.toThrow(FileSystemError)
		})
	})

	describe('getStats', () => {
		beforeEach(async () => {
			await fs.writeFile(testFile, testContent)
		})

		it('should get file stats', async () => {
			const stats = await getStats(testFile)

			expect(stats.isFile()).toBe(true)
			expect(stats.size).toBe(testContent.length)
		})

		it('should throw error if file does not exist', async () => {
			const nonExistentFile = path.join(testDir, 'nonExistent.txt')

			await expect(getStats(nonExistentFile))
				.rejects.toThrow(FileSystemError)
		})
	})

	describe('fileExists', () => {
		beforeEach(async () => {
			await fs.writeFile(testFile, testContent)
		})

		it('should return true if file exists', async () => {
			const exists = await fileExists(testFile)

			expect(exists).toBe(true)
		})

		it('should return false if file does not exist', async () => {
			const nonExistentFile = path.join(testDir, 'nonExistent.txt')

			const exists = await fileExists(nonExistentFile)

			expect(exists).toBe(false)
		})
	})

	describe('getAllFilesFromDirectory', () => {
		beforeEach(async () => {
			// Créer une structure de répertoires et fichiers
			await fs.writeFile(path.join(testDir, 'file1.txt'), 'content1')
			await fs.writeFile(path.join(testDir, 'file2.js'), 'content2')
			await fs.mkdir(path.join(testDir, 'subdir'))
			await fs.writeFile(path.join(testDir, 'subdir', 'file3.css'), 'content3')
			await fs.writeFile(path.join(testDir, 'subdir', 'file4.html'), 'content4')

			// Créer un fichier caché
			await fs.writeFile(path.join(testDir, '.hidden'), 'hidden content')
		})

		it('should get all files recursively', async () => {
			const files = await getAllFilesFromDirectory(testDir)

			expect(files).toHaveLength(4)
			expect(files).toContain(path.join(testDir, 'file1.txt'))
			expect(files).toContain(path.join(testDir, 'file2.js'))
			expect(files).toContain(path.join(testDir, 'subdir', 'file3.css'))
			expect(files).toContain(path.join(testDir, 'subdir', 'file4.html'))
		})

		it('should filter files by extension', async () => {
			const jsFiles = await getAllFilesFromDirectory(testDir, ['.js'])

			expect(jsFiles).toHaveLength(1)
			expect(jsFiles).toContain(path.join(testDir, 'file2.js'))
		})

		it('should exclude hidden files by default', async () => {
			const files = await getAllFilesFromDirectory(testDir)

			expect(files).not.toContain(path.join(testDir, '.hidden'))
		})

		it('should include hidden files when requested', async () => {
			const files = await getAllFilesFromDirectory(testDir, [], true)

			expect(files).toContain(path.join(testDir, '.hidden'))
		})

		it('should return empty array if directory does not exist', async () => {
			const nonExistentDir = path.join(testDir, 'nonExistent')

			const files = await getAllFilesFromDirectory(nonExistentDir)

			expect(files).toEqual([])
		})
	})

	describe('getFileHash', () => {
		beforeEach(async () => {
			await fs.writeFile(testFile, testContent)
		})

		it('should generate consistent hash for same content', async () => {
			const hash1 = await getFileHash(testFile)
			const hash2 = await getFileHash(testFile)

			expect(hash1).toBe(hash2)
			expect(hash1).toMatch(/^[a-f0-9]{32}$/) // MD5 hash format
		})

		it('should generate different hash for different content', async () => {
			const hash1 = await getFileHash(testFile)

			await fs.writeFile(testFile, 'Different content', 'utf8')
			const hash2 = await getFileHash(testFile)

			expect(hash1).not.toBe(hash2)
		})
	})

	describe('getFileCacheInfo', () => {
		beforeEach(async () => {
			await fs.writeFile(testFile, testContent)
		})

		it('should return cache info for existing file', async () => {
			const cacheInfo = await getFileCacheInfo(testFile)

			expect(cacheInfo.exists).toBe(true)
			expect(cacheInfo.path).toBe(testFile)
			expect(cacheInfo.size).toBe(testContent.length)
			expect(cacheInfo.hash).toMatch(/^[a-f0-9]{32}$/)
			expect(cacheInfo.modified).toBeInstanceOf(Date)
		})

		it('should return default info for non-existent file', async () => {
			const nonExistentFile = path.join(testDir, 'nonExistent.txt')

			const cacheInfo = await getFileCacheInfo(nonExistentFile)

			expect(cacheInfo.exists).toBe(false)
			expect(cacheInfo.path).toBe(nonExistentFile)
			expect(cacheInfo.size).toBe(0)
			expect(cacheInfo.hash).toBe('')
			expect(cacheInfo.modified).toEqual(new Date(0))
		})
	})
})
