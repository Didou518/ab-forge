import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import { CacheManager } from '../../src/utils/cache.js'
import { TEST_DIR } from '../setup.js'

describe('CacheManager', () => {
	let cacheManager
	const testDir = path.join(TEST_DIR, 'cache')
	const testFile = path.join(testDir, 'test.txt')
	const testContent = 'Hello, World!'

	beforeEach(async () => {
		cacheManager = new CacheManager()
	})

	afterEach(async () => {
		if (cacheManager) {
			cacheManager.clearCache()
		}
		try {
			await fs.rm(testDir, { recursive: true, force: true })
		} catch {
			// Ignorer les erreurs de nettoyage
		}
	})

	describe('generateCacheKey', () => {
		it('should generate consistent cache key', () => {
			const key1 = CacheManager.generateCacheKey('/path/to/file.js', 'operation')
			const key2 = CacheManager.generateCacheKey('/path/to/file.js', 'operation')

			expect(key1).toBe(key2)
			expect(key1).toBe('/path/to/file.js:operation')
		})

		it('should generate different keys for different operations', () => {
			const key1 = CacheManager.generateCacheKey('/path/to/file.js', 'read')
			const key2 = CacheManager.generateCacheKey('/path/to/file.js', 'write')

			expect(key1).not.toBe(key2)
		})

		it('should use default operation if not specified', () => {
			const key = CacheManager.generateCacheKey('/path/to/file.js')

			expect(key).toBe('/path/to/file.js:default')
		})
	})

	describe('isCacheValid', () => {
		beforeEach(async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
		})

		it('should return false for non-cached file', async () => {
			const isValid = await cacheManager.isCacheValid(testFile, 'test')

			expect(isValid).toBe(false)
		})

		it('should return true for valid cached file', async () => {
			// Mettre en cache
			await cacheManager.setCache(testFile, 'test data', 'test')

			const isValid = await cacheManager.isCacheValid(testFile, 'test')

			expect(isValid).toBe(true)
		})

		it('should return false for modified file', async () => {
			// Mettre en cache
			await cacheManager.setCache(testFile, 'test data', 'test')

			// Attendre un peu pour s'assurer que le timestamp change
			await new Promise(resolve => setTimeout(resolve, 10))

			// Modifier le fichier
			await fs.writeFile(testFile, 'Modified content', 'utf8')

			const isValid = await cacheManager.isCacheValid(testFile, 'test')

			expect(isValid).toBe(false)
		})
	})

	describe('setCache and getCache', () => {
		beforeEach(async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
		})

		it('should store and retrieve cache data', async () => {
			const testData = { processed: true, timestamp: Date.now() }

			await cacheManager.setCache(testFile, testData, 'test')
			const retrievedData = cacheManager.getCache(testFile, 'test')

			expect(retrievedData).toEqual(testData)
		})

		it('should return undefined for non-cached data', () => {
			const retrievedData = cacheManager.getCache(testFile, 'test')

			expect(retrievedData).toBeUndefined()
		})

		it('should handle different operations separately', async () => {
			const data1 = { operation: 'read' }
			const data2 = { operation: 'write' }

			await cacheManager.setCache(testFile, data1, 'read')
			await cacheManager.setCache(testFile, data2, 'write')

			expect(cacheManager.getCache(testFile, 'read')).toEqual(data1)
			expect(cacheManager.getCache(testFile, 'write')).toEqual(data2)
		})
	})

	describe('invalidateCache', () => {
		beforeEach(async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
			await cacheManager.setCache(testFile, 'data1', 'op1')
			await cacheManager.setCache(testFile, 'data2', 'op2')
		})

		it('should invalidate specific operation cache', () => {
			cacheManager.invalidateCache(testFile, 'op1')

			expect(cacheManager.getCache(testFile, 'op1')).toBeUndefined()
			expect(cacheManager.getCache(testFile, 'op2')).toBe('data2')
		})

		it('should invalidate all caches for file when operation not specified', () => {
			cacheManager.invalidateCache(testFile)

			expect(cacheManager.getCache(testFile, 'op1')).toBeUndefined()
			expect(cacheManager.getCache(testFile, 'op2')).toBeUndefined()
		})
	})

	describe('clearCache', () => {
		beforeEach(async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
			await cacheManager.setCache(testFile, 'data', 'test')
			cacheManager.setFileHash(testFile, 'hash123')
		})

		it('should clear all caches', () => {
			cacheManager.clearCache()

			expect(cacheManager.getCache(testFile, 'test')).toBeUndefined()
			expect(cacheManager.getFileHash(testFile)).toBeUndefined()
		})
	})

	describe('getCacheStats', () => {
		it('should return initial stats', () => {
			const stats = cacheManager.getCacheStats()

			expect(stats.size).toBe(0)
			expect(stats.timestampEntries).toBe(0)
			expect(stats.hashEntries).toBe(0)
			expect(stats.memoryUsage).toBeDefined()
		})

		it('should return updated stats after caching', async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
			await cacheManager.setCache(testFile, 'data', 'test')
			cacheManager.setFileHash(testFile, 'hash123')

			const stats = cacheManager.getCacheStats()

			expect(stats.size).toBe(1)
			expect(stats.timestampEntries).toBe(1)
			expect(stats.hashEntries).toBe(1)
		})
	})

	describe('file hash management', () => {
		beforeEach(async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
		})

		it('should store and retrieve file hash', () => {
			const hash = 'abc123def456'

			cacheManager.setFileHash(testFile, hash)
			const retrievedHash = cacheManager.getFileHash(testFile)

			expect(retrievedHash).toBe(hash)
		})

		it('should return undefined for non-cached hash', () => {
			const retrievedHash = cacheManager.getFileHash(testFile)

			expect(retrievedHash).toBeUndefined()
		})
	})

	describe('hasFileContentChanged', () => {
		beforeEach(async () => {
			await fs.mkdir(testDir, { recursive: true })
			await fs.writeFile(testFile, testContent, 'utf8')
		})

		it('should return true for first access', async () => {
			const hasChanged = await cacheManager.hasFileContentChanged(testFile)

			expect(hasChanged).toBe(true)
		})

		it('should return false for unchanged file', async () => {
			// Premier accès
			await cacheManager.hasFileContentChanged(testFile)

			// Deuxième accès
			const hasChanged = await cacheManager.hasFileContentChanged(testFile)

			expect(hasChanged).toBe(false)
		})

		it('should return true for changed file', async () => {
			// Premier accès
			await cacheManager.hasFileContentChanged(testFile)

			// Modifier le fichier
			await fs.writeFile(testFile, 'Modified content', 'utf8')

			// Vérifier le changement
			const hasChanged = await cacheManager.hasFileContentChanged(testFile)

			expect(hasChanged).toBe(true)
		})

		it('should return true for non-existent file', async () => {
			const nonExistentFile = path.join(testDir, 'non-existent.txt')

			const hasChanged = await cacheManager.hasFileContentChanged(nonExistentFile)

			expect(hasChanged).toBe(true)
		})
	})
})
