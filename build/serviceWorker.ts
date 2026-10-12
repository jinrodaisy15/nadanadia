import { readFileSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { transformWithOxc, type Plugin } from 'vite';

/** Emit a typed worker and a cache version tied to this build's assets. */
export function serviceWorker(): Plugin {
  return {
    name: 'nadanadia-service-worker',
    apply: 'build',
    async generateBundle(_options, bundle) {
      const source = readFileSync(new URL('../src/sw.ts', import.meta.url), 'utf8');
      const shell = ['index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png'];
      const assets = [...new Set([...shell, ...Object.keys(bundle).filter(name => /\.(js|css)$/.test(name))])].sort();
      const hash = createHash('sha256').update(source + JSON.stringify(assets));
      const publicRoot = new URL('../public/', import.meta.url);
      for (const name of readdirSync(publicRoot, { recursive: true, encoding: 'utf8' }).sort()) {
        if (/\.(json|png|jpg|svg)$/.test(name)) hash.update(readFileSync(new URL(name.replaceAll('\\', '/'), publicRoot)));
      }
      const version = hash.digest('hex').slice(0, 16);
      const configured = source.replaceAll('__BUILD_VERSION__', version)
        .replace('JSON.parse("__PRECACHE_ASSETS__")', JSON.stringify(assets));
      const compiled = await transformWithOxc(configured, 'sw.ts');
      this.emitFile({
        type: 'asset', fileName: 'sw.js',
        source: compiled.code,
      });
    },
  };
}
