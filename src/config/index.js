/**
 * Configuration centralisée pour l'application
 */
export const CONFIG = {
	// Extensions de fichiers supportées
	SUPPORTED_EXTENSIONS: ['js', 'css', 'html', 'svg', 'json', 'jpg'],

	// Options par défaut
	DEFAULT_OPTIONS: {
		minify: true,
		debug: false,
		watch: true,
		recursive: true
	},

	// Messages d'erreur
	MESSAGES: {
		ERRORS: {
			MISSING_DIR: 'Path is missing. Please specify a path.',
			INVALID_DIR: 'Invalid directory path provided.',
			PERMISSION_DENIED: 'Permission denied for the specified path.',
			FILE_NOT_FOUND: 'File not found.',
			UNSUPPORTED_FILE_TYPE: 'This type of file is not supported yet',
			BUILD_FAILED: 'Build process failed',
			PLUGIN_ERROR: 'Plugin processing failed'
		},
		SUCCESS: {
			FILE_GENERATED: 'File has been generated',
			BUILD_COMPLETED: 'Build completed successfully',
			WATCH_STARTED: 'Watching for file changes'
		},
		INFO: {
			INITIAL_SCAN: 'Initial scan completed',
			FILE_ADDED: 'File has been added',
			FILE_CHANGED: 'File has been changed',
			FILE_REMOVED: 'File has been removed'
		}
	},

	// Configuration des plugins
	PLUGINS: {
		JS: {
			addDebugComments: false,
			addSeparators: false
		},
		CSS: {
			minify: true,
			autoprefixer: true,
			nesting: true
		},
		HTML: {
			minify: true,
			removeComments: true,
			removeAttributeQuotes: true,
			collapseWhitespace: true,
			collapseInlineTagWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
			removeRedundantAttributes: true,
			removeEmptyAttributes: true
		},
		SVG: {
			optimize: true,
			removeMetadata: true,
			removeViewBox: false,
			cleanupNumericValues: true
		},
		JSON: {
			prettyPrint: false
		},
		JPG: {
			mimeType: 'image/jpeg',
			quality: 'original'
		}
	},

	// Configuration du watcher
	WATCHER: {
		IGNORED_PATTERNS: [/\/dist\/.*/, /\/node_modules\/.*/, /\/\.git\/.*/, /\/\.DS_Store/],
		DEBOUNCE_DELAY: 100, // ms
		PERSISTENT: true
	},

	// Configuration Babel
	BABEL: {
		presets: ['@babel/preset-env'],
		options: {
			compact: false,
			sourceMaps: false
		}
	},

	// Configuration UglifyJS
	UGLIFY: {
		options: {
			compress: {
				drop_console: true,
				drop_debugger: true
			},
			mangle: true,
			output: {
				comments: false
			}
		}
	}
}
