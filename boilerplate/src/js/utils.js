/**
 * Utility functions for AB Forge components
 */

// Debounce function for performance optimization
function debounce(func, wait) {
	let timeout
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout)
			func(...args)
		}
		clearTimeout(timeout)
		timeout = setTimeout(later, wait)
	}
}

// Throttle function for scroll events
function throttle(func, limit) {
	let inThrottle
	return function (...args) {
		if (!inThrottle) {
			func.apply(this, args)
			inThrottle = true
			setTimeout(() => {
				inThrottle = false
			}, limit)
		}
	}
}

// Check if element is in viewport
function isInViewport(element) {
	const rect = element.getBoundingClientRect()
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	)
}

// Smooth scroll to element
function smoothScrollTo(element, offset = 0) {
	const targetPosition = element.offsetTop - offset
	window.scrollTo({
		top: targetPosition,
		behavior: 'smooth'
	})
}

// Get query parameter value
function getQueryParam(name) {
	const urlParams = new URLSearchParams(window.location.search)
	return urlParams.get(name)
}

// Set query parameter
function setQueryParam(name, value) {
	const url = new URL(window.location)
	url.searchParams.set(name, value)
	window.history.pushState({}, '', url)
}

// Local storage helpers
const storage = {
	set: (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch {
			console.warn('LocalStorage not available')
		}
	},
	get: (key, defaultValue = null) => {
		try {
			const item = localStorage.getItem(key)
			return item ? JSON.parse(item) : defaultValue
		} catch {
			console.warn('LocalStorage not available')
			return defaultValue
		}
	},
	remove: (key) => {
		try {
			localStorage.removeItem(key)
		} catch {
			console.warn('LocalStorage not available')
		}
	}
}

// Export functions for use in main component
window.ABForgeUtils = {
	debounce,
	throttle,
	isInViewport,
	smoothScrollTo,
	getQueryParam,
	setQueryParam,
	storage
}
