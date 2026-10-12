// ESLint flat config shared by every sscheib repository: the recommended JavaScript rules for
// the config files (.js, .cjs, .mjs) and the recommended JSON rules for .json and .json5. Copied
// verbatim into each repository root; edit this original and copy it out again.
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

// resolve the plugins next to the eslint that runs this config (the prek hook environment, a CI
// install or a local node_modules), not next to this file: a bare import resolves from the
// directory of the config file, where nothing is installed
const require = createRequire(process.argv[1]);
const load = async (name) => (await import(pathToFileURL(require.resolve(name)).href)).default;
const js = await load('@eslint/js');
const json = await load('@eslint/json');
const globals = await load('globals');

export default [
  {
    ignores: ['**/node_modules/**', '**/package-lock.json'],
  },
  {
    files: ['**/*.js', '**/*.cjs'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.json'],
    language: 'json/json',
    plugins: { json },
    ...json.configs.recommended,
  },
  {
    files: ['**/*.json5'],
    language: 'json/json5',
    plugins: { json },
    ...json.configs.recommended,
  },
];
