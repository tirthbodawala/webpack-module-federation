# 🔄 Automated Dependency Updates

This project includes a comprehensive automated dependency update system that keeps your webpack and related dependencies current while ensuring stability through automated testing.

## 🚀 Features

- **Smart Dependency Categorization** - Updates are grouped by functionality (webpack, babel, loaders, plugins, etc.)
- **Safety-First Approach** - All updates are validated with tests and builds before being applied
- **Automatic Rollback** - If tests fail, changes are automatically reverted
- **Bulk Version Fetching** - Optimized to check multiple packages efficiently
- **Comprehensive Logging** - Detailed output showing what was updated and why

## 📋 Available Commands

### Manual Updates
```bash
# Check for outdated dependencies
npm run check-updates

# Run security audit
npm run audit

# Update dependencies with full validation
npm run deps:update

# Run just the update script
npm run update-deps

# Combined check (outdated + security)
npm run deps:check
```

### CI/CD Integration
- **Weekly Automated Updates** - Runs every Monday at 9 AM UTC
- **Security Checks** - Daily vulnerability scanning
- **Pull Request Creation** - Automatic PRs for dependency updates
- **License Validation** - Ensures all dependencies use approved licenses

## 🔧 How It Works

### 1. Dependency Categorization
The update system organizes dependencies into logical groups:

- **Webpack Core** - webpack, webpack-cli, webpack-dev-server
- **Babel Ecosystem** - All @babel packages and plugins
- **Loaders** - css-loader, sass-loader, style-loader, etc.
- **Plugins** - html-webpack-plugin, mini-css-extract-plugin, etc.
- **Styling** - sass, postcss-preset-env, cssnano
- **Other Tools** - @svgr/webpack, react-refresh

### 2. Update Process
1. **Backup Creation** - Creates `package.json.backup`
2. **Version Checking** - Bulk fetches latest versions from npm
3. **Smart Updates** - Preserves version prefixes (^, ~)
4. **Installation** - Runs `npm install` with updated packages
5. **Validation** - Runs full test suite
6. **Build Verification** - Ensures TypeScript compilation succeeds
7. **Rollback if Needed** - Restores backup if any step fails

### 3. Safety Mechanisms
- ✅ **Test-Driven Updates** - No updates applied if tests fail
- ✅ **Build Validation** - Ensures compilation still works
- ✅ **Automatic Rollback** - Restores previous state on failure
- ✅ **Peer Dependency Respect** - Doesn't update peer dependencies
- ✅ **Version Constraint Preservation** - Maintains ^ and ~ prefixes

## 🤖 Automated Workflows

### Weekly Updates (`dependency-update.yml`)
- **Trigger**: Every Monday at 9 AM UTC
- **Actions**:
  1. Runs dependency update script
  2. Creates PR if changes exist
  3. Enables auto-merge if tests pass
  4. Provides detailed change summary

### Security Monitoring (`dependency-check.yml`)
- **Trigger**: Daily + on package.json changes
- **Actions**:
  1. npm security audit
  2. License compliance check
  3. Vulnerability reporting
  4. Outdated package detection

## 📊 Validation & Testing

### Dependency Tests (`tests/dependencies.test.ts`)
- Package.json structure validation
- Required dependency verification
- Version constraint checking
- Security pattern detection
- Dual-package export validation

### Coverage Requirements
- **95%+ Test Coverage** - All updates must maintain high test coverage
- **Build Verification** - TypeScript compilation must succeed
- **Runtime Validation** - All module exports must work correctly

## 🎯 Usage Examples

### Check What Needs Updating
```bash
npm run check-updates
```

### Run Complete Update Process
```bash
npm run deps:update
```

### Manual Security Check
```bash
npm run audit
```

### Force Update (Emergency)
```bash
node scripts/update-dependencies.js
```

## 🔍 Monitoring Updates

### GitHub Actions
- Check the **Actions** tab for automated update status
- Review auto-generated **Pull Requests** for dependency changes
- Monitor **Security** tab for vulnerability alerts

### Local Monitoring
```bash
# Check current status
npm outdated

# Review audit results
npm audit

# See detailed dependency tree
npm ls --depth=0
```

## ⚙️ Configuration

### Update Categories
Edit `scripts/update-dependencies.js` to modify which packages are included in each category.

### CI/CD Timing
Modify `.github/workflows/dependency-update.yml` cron schedule:
```yaml
schedule:
  # Current: Every Monday at 9 AM UTC
  - cron: '0 9 * * 1'

  # Daily: Every day at midnight UTC
  - cron: '0 0 * * *'

  # Weekly Friday: Every Friday at 2 PM UTC
  - cron: '0 14 * * 5'
```

### Coverage Thresholds
Adjust `jest.config.js` coverage requirements:
```javascript
coverageThreshold: {
  global: {
    branches: 93,
    functions: 95,
    lines: 95,
    statements: 95
  }
}
```

## 🚨 Troubleshooting

### Update Failed
1. Check the GitHub Actions logs
2. Review test failures in the CI output
3. Manually run `npm run test` to see specific issues
4. Check if any peer dependencies need updating

### Rollback Needed
```bash
# If backup exists
cp package.json.backup package.json
npm install

# Or git reset
git checkout HEAD -- package.json
npm install
```

### Manual Override
```bash
# Skip tests (use with caution)
npm install <package>@latest

# Then run validation
npm run test
npm run build
```

## 📈 Benefits

- **🔒 Security** - Regular updates patch vulnerabilities
- **🚀 Performance** - Latest versions often include optimizations
- **🔧 Features** - Access to newest webpack and tooling features
- **🧪 Stability** - Automated testing prevents breaking changes
- **⏰ Time Saving** - No manual dependency management needed
- **📊 Visibility** - Clear tracking of what changed and when

## 🎉 Best Practices

1. **Review PRs** - Always review auto-generated dependency update PRs
2. **Monitor Builds** - Watch CI/CD pipelines after merging updates
3. **Test Locally** - Run `npm run deps:update` before important releases
4. **Keep Backups** - The system creates backups, but git history is your friend
5. **Stay Informed** - Subscribe to security advisories for critical packages

---

This automated system ensures your webpack configuration stays current, secure, and stable without manual intervention! 🎯