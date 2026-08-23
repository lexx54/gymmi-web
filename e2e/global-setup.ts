import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Prepares the dedicated e2e database (gymmi_e2e) before Playwright runs:
 * runs migrations, truncates mutable tables for a clean run, then upserts the
 * deterministic e2e admin. ENV_FILE=.env.e2e keeps this off the developer
 * database (gymmi). The truncate keeps runs deterministic (e.g. the admin user
 * stays on page 1 of /admin/users instead of accumulating across runs).
 */
export default async function globalSetup() {
  const apiRoot = path.resolve(__dirname, '../../gymmi-api');
  const env = { ...process.env, ENV_FILE: '.env.e2e' };

  execFileSync('npm', ['run', 'migration:run'], {
    cwd: apiRoot,
    stdio: 'inherit',
    shell: true,
    env,
  });

  execFileSync(
    'npx',
    [
      'ts-node',
      '-r',
      'tsconfig-paths/register',
      'test/helpers/reset-e2e-db-cli.ts',
    ],
    {
      cwd: apiRoot,
      stdio: 'inherit',
      shell: true,
      env,
    },
  );

  execFileSync(
    'npx',
    [
      'ts-node',
      '-r',
      'tsconfig-paths/register',
      'test/helpers/ensure-e2e-admin-cli.ts',
    ],
    {
      cwd: apiRoot,
      stdio: 'inherit',
      shell: true,
      env,
    },
  );
}
