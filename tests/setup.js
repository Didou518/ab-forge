import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

// Configuration globale pour les tests
const TEST_DIR = path.join(process.cwd(), 'tests', 'temp')

/**
 * Génère un répertoire unique pour chaque test
 */
export function createUniqueTestDir(testName) {
	const uniqueId = randomUUID().slice(0, 8)
	return path.join(TEST_DIR, `${testName}_${uniqueId}`)
}

/**
 * Setup global pour tous les tests
 */
beforeAll(async () => {
	// Créer le répertoire de test temporaire
	try {
		await fs.mkdir(TEST_DIR, { recursive: true })
	} catch (error) {
		// Le répertoire existe déjà, c'est OK
	}
})

/**
 * Cleanup global après tous les tests
 */
afterAll(async () => {
	// Nettoyer le répertoire de test temporaire
	try {
		await fs.rm(TEST_DIR, { recursive: true, force: true })
	} catch (error) {
		// Ignorer les erreurs de nettoyage
	}
})

/**
 * Setup avant chaque test
 */
beforeEach(() => {
	// Réinitialiser les mocks si nécessaire
	vi.clearAllMocks()
})

/**
 * Cleanup après chaque test
 */
afterEach(() => {
	// Nettoyer les mocks
	vi.restoreAllMocks()
})

// Exporter des utilitaires pour les tests
export { TEST_DIR, createUniqueTestDir }

// Mock des modules externes si nécessaire
vi.mock('chalk', () => ({
	default: {
		red: (text) => text,
		green: (text) => text,
		yellow: (text) => text,
		blue: (text) => text,
		cyan: (text) => text,
		gray: (text) => text,
		bold: (text) => text
	}
}))

// Mock de log-timestamp
vi.mock('log-timestamp', () => ({
	default: vi.fn()
}))
