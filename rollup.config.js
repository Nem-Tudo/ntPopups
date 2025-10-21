const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const postcss = require('rollup-plugin-postcss');
const terser = require('@rollup/plugin-terser');
const json = require('@rollup/plugin-json');
const packageJson = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

// Configuração para tratar apenas as peerDependencies como externos
// NOTE: Removido /^@babel\/runtime/ daqui.
const external = [
  ...Object.keys(packageJson.peerDependencies),
  'react/jsx-runtime',
];

module.exports = {
  input: 'src/index.js',
  output: [
    {
      dir: 'dist',
      entryFileNames: 'cjs/index.js',
      format: 'cjs',
      sourcemap: isProduction,
    },
    {
      dir: 'dist',
      entryFileNames: 'esm/index.js',
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
      extract: 'styles.css',
      minimize: isProduction,
    }),
    babel({
      // 🎯 MUDANÇA 1: Usar 'bundled' (ou 'inline') para injetar os helpers.
      // Isso elimina a necessidade de importar de @babel/runtime.
      babelHelpers: 'bundled', 
      exclude: 'node_modules/**',
      presets: ['@babel/preset-env', '@babel/preset-react'],
      // 🎯 MUDANÇA 2: Remover o plugin @babel/plugin-transform-runtime.
      // Ele é o responsável por forçar as importações de @babel/runtime.
      plugins: [
        // '@babel/plugin-transform-runtime', // REMOVIDO
      ],
    }),
    isProduction && terser(),
  ].filter(Boolean),
};