import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs/promises'
import path from 'node:path'
import plugins from '../../src/plugins/index.js'
import { TEST_DIR } from '../setup.js'

describe('Plugins', () => {
	const testDir = path.join(TEST_DIR, 'plugins')
	const sourceDir = path.join(testDir, 'source')
	const srcDir = path.join(testDir, 'src')

	beforeEach(async () => {
		await fs.mkdir(sourceDir, { recursive: true })
		await fs.mkdir(srcDir, { recursive: true })
	})

	afterEach(async () => {
		try {
			await fs.rm(testDir, { recursive: true, force: true })
		} catch {
			// Ignorer les erreurs de nettoyage
		}
	})

	describe('CSS Plugin', () => {
		it('should process CSS files with PostCSS', async () => {
			const cssFile = path.join(srcDir, 'style.css')
			const cssContent = `
				.test {
					color: red;
					&:hover {
						color: blue;
					}
				}
			`
			await fs.writeFile(cssFile, cssContent, 'utf8')

			const sourceData = '{{css/style}}'
			const result = await plugins.css(sourceData, cssFile, 'style', 'css')

			expect(result).toContain('.test')
			expect(result).not.toContain('{{css/style}}')
		})

		it('should handle CSS processing errors', async () => {
			const cssFile = path.join(srcDir, 'invalid.css')
			await fs.writeFile(cssFile, 'invalid css syntax {', 'utf8')

			const sourceData = '{{css/invalid}}'

			await expect(plugins.css(sourceData, cssFile, 'invalid', 'css'))
				.rejects.toThrow('CSS plugin failed')
		})
	})

	describe('HTML Plugin', () => {
		it('should minify HTML files', async () => {
			const htmlFile = path.join(srcDir, 'template.html')
			const htmlContent = `
				<div class="container">
					<h1>Title</h1>
					<p>Content</p>
				</div>
			`
			await fs.writeFile(htmlFile, htmlContent, 'utf8')

			const sourceData = '{{html/template}}'
			const result = await plugins.html(sourceData, htmlFile, 'template', 'html')

			expect(result).toContain('<div class=container>')
			expect(result).not.toContain('{{html/template}}')
			expect(result.length).toBeLessThan(htmlContent.length) // Minified
		})
	})

	describe('SVG Plugin', () => {
		it('should optimize SVG files', async () => {
			// S'assurer que le répertoire existe
			await fs.mkdir(srcDir, { recursive: true })

			const svgFile = path.join(srcDir, 'icon.svg')
			const svgContent = `
				<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
				</svg>
			`
			await fs.writeFile(svgFile, svgContent, 'utf8')

			const sourceData = '{{svg/icon}}'
			const result = await plugins.svg(sourceData, svgFile, 'icon', 'svg')

			expect(result).toContain('<svg')
			expect(result).not.toContain('{{svg/icon}}')
		})
	})

	describe('JSON Plugin', () => {
		it('should process JSON files', async () => {
			const jsonFile = path.join(srcDir, 'data.json')
			const jsonContent = {
				name: 'test',
				value: 123
			}
			await fs.writeFile(jsonFile, JSON.stringify(jsonContent, null, 2), 'utf8')

			const sourceData = '{{json/data}}'
			const result = await plugins.json(sourceData, jsonFile, 'data', 'json')

			expect(result).toContain('"name":"test"')
			expect(result).not.toContain('{{json/data}}')
		})

		it('should handle invalid JSON', async () => {
			const jsonFile = path.join(srcDir, 'invalid.json')
			await fs.writeFile(jsonFile, '{ invalid json }', 'utf8')

			const sourceData = '{{json/invalid}}'

			await expect(plugins.json(sourceData, jsonFile, 'invalid', 'json'))
				.rejects.toThrow('JSON plugin failed')
		})
	})

	describe('JPG Plugin', () => {
		it('should convert JPG to base64', async () => {
			// Créer un fichier JPG minimal (juste des données binaires)
			const jpgFile = path.join(srcDir, 'image.jpg')
			const jpgData = Buffer.from('fake jpg data')
			await fs.writeFile(jpgFile, jpgData)

			const sourceData = '{{jpg/image}}'
			const result = await plugins.jpg(sourceData, jpgFile, 'image', 'jpg')

			expect(result).toContain('data:image/jpeg;base64,')
			expect(result).not.toContain('{{jpg/image}}')
		})
	})

	describe('JS Plugin', () => {
		it('should process JS files with old syntax', async () => {
			const jsFile = path.join(srcDir, 'utils.js')
			const jsContent = `
				function helper() {
					console.log('Helper function');
					return true;
				}
			`
			await fs.writeFile(jsFile, jsContent, 'utf8')

			const sourceData = '{{js/utils}}'
			const result = await plugins.js(sourceData, jsFile, 'utils', 'js')

			expect(result).toContain('function helper()')
			expect(result).not.toContain('{{js/utils}}')
		})

		it('should process JS files with new comment syntax', async () => {
			const jsFile = path.join(srcDir, 'utils.js')
			const jsContent = `
				function helper() {
					console.log('Helper function');
					return true;
				}
			`
			await fs.writeFile(jsFile, jsContent, 'utf8')

			const sourceData = '/* {{js/utils}} */'
			const result = await plugins.js(sourceData, jsFile, 'utils', 'js')

			expect(result).toContain('function helper()')
			expect(result).not.toContain('/* {{js/utils}} */')
		})

		it('should process JS files with new comment syntax and whitespace', async () => {
			const jsFile = path.join(srcDir, 'utils.js')
			const jsContent = `
				function helper() {
					console.log('Helper function');
					return true;
				}
			`
			await fs.writeFile(jsFile, jsContent, 'utf8')

			const sourceData = '/*  {{js/utils}}  */'
			const result = await plugins.js(sourceData, jsFile, 'utils', 'js')

			expect(result).toContain('function helper()')
			expect(result).not.toContain('/*  {{js/utils}}  */')
		})

		it('should prioritize new syntax over old syntax', async () => {
			const jsFile = path.join(srcDir, 'utils.js')
			const jsContent = `
				function helper() {
					console.log('Helper function');
					return true;
				}
			`
			await fs.writeFile(jsFile, jsContent, 'utf8')

			const sourceData = '/* {{js/utils}} */ and {{js/utils}}'
			const result = await plugins.js(sourceData, jsFile, 'utils', 'js')

			expect(result).toContain('function helper()')
			expect(result).not.toContain('/* {{js/utils}} */')
			expect(result).toContain('{{js/utils}}') // Old syntax should remain if new syntax is found
		})

		it('should handle JS file reading errors', async () => {
			const nonExistentFile = path.join(srcDir, 'nonexistent.js')

			const sourceData = '{{js/nonexistent}}'

			await expect(plugins.js(sourceData, nonExistentFile, 'nonexistent', 'js'))
				.rejects.toThrow('JS plugin failed')
		})

		it('should handle JS file reading errors with new syntax', async () => {
			const nonExistentFile = path.join(srcDir, 'nonexistent.js')

			const sourceData = '/* {{js/nonexistent}} */'

			await expect(plugins.js(sourceData, nonExistentFile, 'nonexistent', 'js'))
				.rejects.toThrow('JS plugin failed')
		})
	})

	describe('Plugin Registry', () => {
		it('should have all required plugins', () => {
			expect(plugins).toHaveProperty('js')
			expect(plugins).toHaveProperty('css')
			expect(plugins).toHaveProperty('html')
			expect(plugins).toHaveProperty('svg')
			expect(plugins).toHaveProperty('json')
			expect(plugins).toHaveProperty('jpg')
		})

		it('should have functions for all plugins', () => {
			Object.values(plugins).forEach(plugin => {
				expect(typeof plugin).toBe('function')
			})
		})
	})
})
