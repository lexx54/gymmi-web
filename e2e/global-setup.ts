import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upserts the deterministic e2e admin in the shared API database before Playwright runs.
 */
export default async function globalSetup() {
  const apiRoot = path.resolve(__dirname, '../../gymmi-api');
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
      env: process.env,
    },
  );
}
