import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { config, type DotenvPopulateInput } from 'dotenv';

export function parseEnvironmentVariables(
  projectRoot: string,
  isProd: boolean,
): Record<string, string | number | boolean> {
  // Determine environment
  const nodeEnv = process.env['NODE_ENV'] ?? (isProd ? 'production' : 'development');

  // Extended environment file priority (most specific to least specific)
  const envFiles = [
    // Project-specific environment files
    resolve(projectRoot, `.env.${nodeEnv}.local`), // .env.development.local, .env.staging.local, .env.production.local
    resolve(projectRoot, `.env.${nodeEnv}`), // .env.development, .env.staging, .env.production
    resolve(projectRoot, '.env.local'), // .env.local (loaded for all environments except test)
    resolve(projectRoot, '.env'), // .env (default)

    // Additional common environment file patterns
    resolve(projectRoot, `.env.${nodeEnv}.secrets`), // Secret files
    resolve(projectRoot, '.env.secrets'), // General secrets
  ].filter(Boolean);

  const parsedVars: DotenvPopulateInput = {};

  // Load environment files in priority order (first found takes precedence for each variable)
  for (const envFile of envFiles) {
    // Explicitly check if file exists before attempting to load
    if (!existsSync(envFile)) {
      continue;
    }
    try {
      config({
        path: envFile,
        processEnv: parsedVars,
      });
      // eslint-disable-next-line no-console
      console.info(`Loaded environment file: ${envFile}`);
    } catch {
      // do nothing
    }
  }

  // Create DefinePlugin definitions
  const processEnv: Record<string, string | number | boolean> = {
    'process.env.NODE_ENV': JSON.stringify(nodeEnv),
  };

  // Add all environment variables (not just prefixed ones for maximum flexibility)
  Object.keys(parsedVars).forEach((key) => {
    // Skip variables that might conflict with Node.js internals
    if (!['PATH', 'HOME', 'USER', 'USERNAME', 'USERPROFILE'].includes(key) && parsedVars[key]) {
      if (typeof parsedVars[key] === 'string') {
        processEnv[`process.env.${key}`] = JSON.stringify(parsedVars[key]);
      } else {
        processEnv[`process.env.${key}`] = parsedVars[key];
      }
    }
  });
  return processEnv;
}
