import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';


const isProd = process.env.env === 'production';

const format = process.env.format || 'umd';
const isES = format === 'es';
const file = 'dist/imask' +
  (format !== 'umd' ? '.' + format : '') +
  (isProd ? '.min' : '') +
  '.js';

const input = isES ? 'src/imask.js' : 'src/imask.shim.js';

const babelConf = isES ? {
  externalHelpersWhitelist: [
    'extends',
    'slicedToArray',
    'objectWithoutProperties',
  ],
  presets: [
    ['env', {
      modules: false,
      useBuiltIns: true,
      targets: {
        browsers: [
          'Chrome >= 60',
          'Safari >= 10.1',
          'iOS >= 10.3',
          'Firefox >= 54',
          'Edge >= 15',
        ],
      },
    }],
    'flow',
  ],
  // waiting for https://github.com/rollup/rollup/issues/1613
  plugins: ['transform-object-rest-spread', 'external-helpers']
} : {
  presets: [
    ['env', {
      'modules': false,
      'useBuiltIns': true
    }],
    'flow',
  ],
  exclude: 'node_modules/**',
  plugins: ['transform-object-rest-spread', 'transform-object-assign', 'external-helpers']
};


export default {
  input,
  output: {
    file,
    format,
    name: 'IMask',
    sourcemap: true,
  },
  plugins: [
    eslint({configFile: '../../.eslintrc'}),
    resolve(),
    babel(babelConf),
    !isES && commonjs(),
    isProd && terser()
  ]
}
