import { build } from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import svgPlugin from 'esbuild-plugin-svg';
import copy from 'copy';

const isDev = process.env.NODE_ENV === 'development';

build({
  entryPoints: ['src/extension.ts'],
  bundle: true,
  platform: 'node',
  external: ['vscode'],
  outfile: 'dist/extension.js',
  minify: !isDev,
  watch: isDev,
}).catch(() => process.exit(1));

build({
  entryPoints: [
    'src/webviews/assets/job-tests.tsx',
    'src/webviews/assets/welcome.tsx',
    'src/webviews/assets/upgrade.tsx',
  ],
  bundle: true,
  platform: 'browser',
  outdir: 'dist/webviews/assets',
  plugins: [sassPlugin(), svgPlugin()],
  minify: !isDev,
  watch: isDev,
}).catch(() => process.exit(1));

copy('src/assets/**/*', 'dist/assets', {}, (err, files) => {
  if (err) {
    console.log('Could not copy extension assets', err);
  }
});

copy('src/webviews/*.html', 'dist/webviews', (err) => {
  if (err) {
    console.log('Could not copy webview assets', err);
  }
});
