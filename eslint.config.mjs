// ESLint 9 flat config. Replaces the legacy .eslintrc.json, which ESLint 9 no
// longer reads by default, and `next lint`, which was removed in Next.js 16.
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: ['.next/**', 'out/**', 'build/**', 'node_modules/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  ...nextTypeScript,
];

export default config;
