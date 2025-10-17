/**
 * Example AB Forge Component
 * This file demonstrates how to use the AB Forge build system
 * with various file types and placeholders.
 */

// Import CSS styles
const styles = `{{css/main}}`

// Import HTML template
const template = `{{html/component}}`

// Import JSON configuration
const config = `{{json/settings}}`

// Import SVG icon
const icon = `{{svg/logo}}`

// Import image as base64
const image = `{{jpg/hero}}`

// Import JavaScript utility
/* {{js/utils}} */

// Initialize the component
function initializeComponent() {
	// Inject styles into the page
	const styleTag = document.createElement('style')
	styleTag.id = 'ab-forge-styles'
	styleTag.innerHTML = styles
	document.head.appendChild(styleTag)

	// Parse configuration
	const settings = JSON.parse(config)

	// Create component container
	const container = document.createElement('div')
	container.className = 'ab-forge-component'
	container.innerHTML = template

	// Replace placeholders in template
	container.innerHTML = container.innerHTML
		.replace('{{icon}}', icon)
		.replace('{{image}}', image)
		.replace('{{title}}', settings.title)
		.replace('{{description}}', settings.description)

	// Add to page
	document.body.appendChild(container)

	// Initialize interactions
	setupEventListeners(container)

	// Show component after delay
	setTimeout(() => {
		container.classList.add('active')
	}, settings.delay || 1000)
}

// Setup event listeners
function setupEventListeners(container) {
	const closeBtn = container.querySelector('.close-btn')
	const ctaBtn = container.querySelector('.cta-btn')

	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			container.classList.remove('active')
		})
	}

	if (ctaBtn) {
		ctaBtn.addEventListener('click', () => {
			// Handle CTA click
			console.log('CTA clicked')
		})
	}
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeComponent)
} else {
	initializeComponent()
}
