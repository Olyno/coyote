import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import killProcess from 'tree-kill';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/interface/index.js',
	output: {
		sourcemap: true,
		format: 'cjs',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			dev: !production,
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		openApp(),
		!production && livereload('public'),
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function openApp() {
	let app;
	return {
		writeBundle() {
			if (app) killProcess(app.pid);
			app = require('child_process').spawn('npm', ['run', 'start'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});
		}
	};
}