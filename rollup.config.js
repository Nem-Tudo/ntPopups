const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const path = require('path'); // <-- Importe o 'path' do Node
const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

// Configuração para tratar as peerDependencies e @babel/runtime como externos
const external = [
  ...Object.keys(packageJson.peerDependencies),
  'react/jsx-runtime',
  /^@babel\/runtime/,
];
// ... (imports no topo, incluindo 'path')

module.exports = {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist',
      entryFileNames: 'cjs/index.js', // Define o nome do arquivo CJS
      format: 'cjs',
      sourcemap: isProduction,
    },
    {
      dir: 'dist',
      entryFileNames: 'esm/index.js', // Define o nome do arquivo ESM
      format: 'esm',
      sourcemap: isProduction,
    },
  ],
  external,
  plugins: [
    json(),
    resolve(),
    commonjs(),
    postcss({
      modules: true,
      // CORREÇÃO:
      // Agora que usamos 'output.dir = "dist"', 'styles.css'
      // será extraído para 'dist/styles.css'.
      extract: 'styles.css',
      minimize: isProduction,
    }),
    babel({
      babelHelpers: 'runtime',
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-transform-runtime'],
    }),
    isProduction && terser(),
  ].filter(Boolean),
};