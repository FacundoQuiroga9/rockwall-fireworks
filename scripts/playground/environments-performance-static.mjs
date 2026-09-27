// Bundle the local QA harness so catalog sync cannot interrupt a timed run via HMR.
import { build } from 'esbuild';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
mkdirSync('public/artifacts',{recursive:true});
await build({entryPoints:['scripts/playground/environments-performance.js'],bundle:true,format:'iife',outfile:'public/artifacts/environments-performance.js'});
writeFileSync('public/artifacts/environments-performance.html',readFileSync('scripts/playground/environments-performance.html','utf8').replace('type="module" src="./environments-performance.js"','src="./environments-performance.js"'));
console.log('http://localhost:5173/artifacts/environments-performance.html');
