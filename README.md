# AB Forge - ABTest Conception Tool

## Presentation

The purpose of this tool is to ease the creation of A/B tests. This repository is used to keep track of all the tests in prevision of integration to **websites** project.
The concept behind it is to automatize all the file processing necessary for your dependencies (ie : CSS, JS and HTML files).

## 📚 Documentation

**📖 [Complete Documentation](docs/INDEX.md)** - Comprehensive guide with examples, API reference, and troubleshooting.

### Quick Links
- **[User Guide](docs/README.md)** - Installation, usage, and configuration
- **[Plugins Guide](docs/PLUGINS.md)** - Complete plugin system documentation
- **[API Reference](docs/API.md)** - Technical API documentation
- **[Changelog](CHANGELOG.md)** - Version history and updates

## Install

You can install the project after cloning it with a classic install

```bash
npm install
```

## Usage

### Automatic Creation

You can create a new test from the `boilerplate` template.

```bash
npm run new ab-tests/TRIGRAM/JIRA-NUM
```

This duplicates the content of the `boilerplate` template.
If `ab-tests/TRIGRAM` does not exists, you have to create it manually.

### Manual creation

You can ceate a directory manually that will contain your sources. The prerequisites are :

-   a `src` subdirectory to contain your sources
-   all `src/type/name.type` files necessary for your application (example: `src/css/main.css` or `src/html/modal.html`)
-   an empty `dist` subdirectory that will contain your dist version
-   all `*.js` files you need in your directory that will be your source files for the test

## Development

At the moment `css`, `js`, `svg`, `html` and `json` files are processed.
The `*.js` source files at the base of your directory are processed by babel.

### JSON File

To use json data you must use `JSON.parse('{{json/data}}')` to get the content of your json file.

### Placeholders

To use a processed file you have to specify the type and name of the file in the `*.js` source file in your directory with double accolades.
For example : `{{html/modal}}` will inject the minified html from the `src/html/modal.html` file.

### Command

You can watch all changes and automatically build your `dist` file with this command from the root of this project :

```bash
npm run start ab-tests/TRIGRAM/JIRA-NUM
```

The parameter `ab-tests/TRIGRAM/JIRA-NUM` is mandatory.

### Test your code

To test your code, copy/paste the code produced in the `dist` directory to the console of the website page you are testing.

## Production

Development process and production are identical, but the `build` command does not watch changes.

```bash
npm run build ab-tests/TRIGRAM/JIRA-NUM
```

The parameter `ab-tests/TRIGRAM/JIRA-NUM` is mandatory.
