# AB Forge Boilerplate

This is a complete example template for the AB Forge build system. It demonstrates how to use all supported file types and features.

## 📁 Structure

```
boilerplate/
├── index.js              # Main JavaScript file
├── src/
│   ├── css/
│   │   └── main.css      # Styles with PostCSS support
│   ├── html/
│   │   └── component.html # HTML template
│   ├── js/
│   │   └── utils.js      # JavaScript utilities
│   ├── svg/
│   │   └── logo.svg      # SVG icon
│   ├── json/
│   │   └── settings.json # Configuration data
│   └── jpg/
│       └── hero.jpg      # Image file (converted to base64)
└── README.md             # This file
```

## 🚀 Usage

### Create a new project from this boilerplate

```bash
npm run new my-project
```

### Build the project

```bash
npm run build my-project
```

### Watch for changes during development

```bash
npm run start my-project
```

### Debug mode (no minification)

```bash
npm run debug my-project
```

## 🔧 Features Demonstrated

### File Type Support

- **CSS**: PostCSS processing with nesting, autoprefixer, and minification
- **HTML**: Template with placeholder replacement and minification
- **JavaScript**: Module inclusion and utility functions
- **SVG**: Optimized vector graphics
- **JSON**: Configuration data with validation
- **JPG**: Image conversion to base64

### Placeholders

The boilerplate demonstrates all placeholder types:

```javascript
const styles = `{{css/main}}`           // CSS file
const template = `{{html/component}}`   // HTML template
const config = `{{json/settings}}`      // JSON data
const icon = `{{svg/logo}}`             // SVG icon
const image = `{{jpg/hero}}`            // JPG image (base64)
{{js/utils}}                            // JavaScript module
```

### Modern JavaScript

- ES6+ syntax with async/await
- Module system
- Modern DOM APIs
- Responsive design
- Performance optimizations

### CSS Features

- Modern CSS with nesting
- Responsive design
- CSS Grid and Flexbox
- Smooth animations
- Cross-browser compatibility

## 📝 Customization

### Adding New Files

1. Add files to the appropriate `src/` subdirectory
2. Use placeholders in your main JavaScript file
3. The build system will automatically process them

### Configuration

Modify `src/json/settings.json` to customize:
- Component title and description
- Animation delays
- Feature flags
- Theme settings

### Styling

Update `src/css/main.css` to customize:
- Colors and typography
- Layout and spacing
- Animations and transitions
- Responsive breakpoints

## 🧪 Testing

Run the tests to ensure everything works:

```bash
npm test
```

## 📚 Documentation

- [Complete Documentation](../docs/README.md)
- [Plugin Guide](../docs/PLUGINS.md)
- [API Reference](../docs/API.md)
