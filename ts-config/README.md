# @crisil/ts-config

Shared TypeScript configurations for CRISIL projects.

## Installation

```bash
npm install --save-dev @crisil/ts-config typescript
```

## Usage

### React Projects

Create `tsconfig.json`:

```json
{
  "extends": "@crisil/ts-config/react.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Node Projects

```json
{
  "extends": "@crisil/ts-config/node.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Library Projects

```json
{
  "extends": "@crisil/ts-config/library.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### Base Configuration

For custom projects, extend the base:

```json
{
  "extends": "@crisil/ts-config/base.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext"
  }
}
```

## Available Configurations

- **base.json** - Strict TypeScript base configuration
- **react.json** - React projects with bundler
- **node.json** - Node.js projects
- **library.json** - Library/package development

## Features

- ✅ Strict TypeScript settings
- ✅ Modern ECMAScript targets
- ✅ Optimized for different project types
- ✅ Best practices baked in
