import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		// Environnement de test
		environment: 'node',

		// Patterns de fichiers de test
		include: ['tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],

		// Exclusions
		exclude: ['node_modules', 'dist', '.git'],

		// Configuration des reporters
		reporter: ['verbose', 'html'],

		// Configuration du dossier de rapport HTML
		outputFile: {
			html: './tests-report/index.html'
		},

		// Configuration de la couverture de code
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html', 'lcov'],
			reportsDirectory: './tests-report/coverage',
			exclude: [
				'node_modules/**',
				'dist/**',
				'boilerplate/**',
				'customWidgets/**',
				'tests/**',
				'tests-report/**',
				'ab-tests/**',
				'**/*.config.js',
				'**/*.config.mjs'
			],
			thresholds: {
				global: {
					branches: 80,
					functions: 80,
					lines: 80,
					statements: 80
				}
			}
		},

		// Timeout pour les tests
		testTimeout: 10000,

		// Configuration des mocks
		mockReset: true,
		restoreMocks: true,

		// Configuration de la concurrence
		pool: 'forks',
		poolOptions: {
			forks: {
				singleFork: true
			}
		},

		onConsoleLog: (log, type) => {
			return false
		},

		// Configuration des hooks
		setupFiles: ['./tests/setup.js']
	},

	// Configuration des alias pour les imports
	resolve: {
		alias: {
			'@': './src',
			'@tests': './tests'
		}
	}
})
