const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
// 1. Importas el plugin (usando require por el formato de tu archivo)
const reactCompiler = require('eslint-plugin-react-compiler');
module.exports = defineConfig([
 expoConfig,
 {
 // 2. Registras el plugin
 plugins: {
 'react-compiler': reactCompiler,
 },
 // 3. Activas la regla
 rules: {
 'react-compiler/react-compiler': 'error',
 },
 },
 {
 ignores: ['dist/*'],
 },
]);
