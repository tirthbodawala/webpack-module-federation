# @crisil/eslint-config

Shared ESLint, Prettier, and Stylelint configurations for CRISIL projects.

## Installation

```bash
npm install --save-dev @crisil/eslint-config eslint prettier stylelint typescript
```

## Usage

### ESLint

Create `eslint.config.js`:

```javascript
import { eslintConfig } from '@crisil/eslint-config';

export default eslintConfig;
```

Or import directly:

```javascript
import eslintConfig from '@crisil/eslint-config/eslint';

export default eslintConfig;
```

### Prettier

Create `.prettierrc.json`:

```json
"@crisil/eslint-config/prettier"
```

Or in `package.json`:

```json
{
  "prettier": "@crisil/eslint-config/prettier"
}
```

### Stylelint

Create `stylelint.config.js`:

```javascript
import { stylelintConfig } from '@crisil/eslint-config';

export default stylelintConfig;
```

Or import directly:

```javascript
import stylelintConfig from '@crisil/eslint-config/stylelint';

export default stylelintConfig;
```

## Features

- ✅ Strict TypeScript ESLint rules
- ✅ Prettier integration
- ✅ Stylelint with SCSS and Mantine support
- ✅ CSS Modules support
- ✅ PostCSS variables support
