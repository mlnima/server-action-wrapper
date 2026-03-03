import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'es',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src'
    },
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src'
    }
  ],
  external: ['react', 'next', 'zod'],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
      jsx: 'react-jsx'
    })
  ]
};
