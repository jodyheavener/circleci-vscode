// import { sassPlugin } from 'esbuild-sass-plugin';
// import svgPlugin from 'esbuild-plugin-svg';
import copy from 'copy';
import { build, BuildOptions } from 'esbuild';
import { existsSync, rmSync } from 'fs';
import watchGlob from 'watch-glob';

const srcPath = 'src';
const distPath = 'dist';

const args = process.argv.slice(2);
const isProd = process.env.NODE_ENV === 'production';
const watch = args.includes('--watch');

const createWatcher = (name: string): BuildOptions['watch'] => {
  if (!watch) return false;
  return {
    onRebuild(error: Error, result): void {
      if (error) {
        console.error(`[${name}] failed to build:`, error);
      } else {
        console.log(`[${name}] watch build succeeded`);
      }
    },
  };
};

const createCopier = (name: string, from: string, to: string): void => {
  const doCopy = (): void =>
    copy(from, to, {}, (error) => {
      if (error) {
        console.error(`[${name}] failed to copy files:`, error);
      } else {
        console.log(`[${name}] copy files succeeded`);
      }
    });

  doCopy();
  if (watch) {
    watchGlob(from, doCopy);
  }
};

if (existsSync(distPath)) {
  rmSync(distPath, { recursive: true });
}

build({
  entryPoints: [`${srcPath}/extension.ts`],
  bundle: true,
  platform: 'node',
  external: ['vscode'],
  outfile: `${distPath}/extension.js`,
  minify: isProd,
  watch: createWatcher('extension'),
}).catch(() => process.exit(1));

// build({
//   entryPoints: [
//     'src/webviews/assets/job-tests.tsx',
//     'src/webviews/assets/welcome.tsx',
//     'src/webviews/assets/upgrade.tsx',
//   ],
//   bundle: true,
//   platform: 'browser',
//   outdir: 'dist/webviews/assets',
//   plugins: [sassPlugin(), svgPlugin()],
//   minify: isProd,
//   watch,
// }).catch(() => process.exit(1));

createCopier('extension', `${srcPath}/assets/**/*`, `${distPath}/assets`);

// copy('src/webviews/*.html', 'dist/webviews', (err) => {
//   if (err) {
//     console.log('Could not copy webview assets', err);
//   }
// });