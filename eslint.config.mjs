import nextConfig from 'eslint-config-next'

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'dist/**', 'build/**'],
  },
  ...nextConfig,
]

export default config
