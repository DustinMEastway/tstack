import sourcemaps from 'rollup-plugin-sourcemaps';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-local-resolve';

const path = require('path');

export default {
	input: './ngc-out/index.js',
	output: {
		format: 'es',
		sourcemap: true
	},
	plugins: [
		resolve(),
		sourcemaps(),
		license({
			sourceMap: true,
			banner: {
				file: path.join(__dirname, 'license-banner.txt'),
				encoding: 'utf-8',
			}
		})
	],
	onwarn: () => { return }
}
