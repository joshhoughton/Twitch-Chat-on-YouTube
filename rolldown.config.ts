import { defineConfig } from 'rolldown';

export default defineConfig([
  {
    input: 'src/background/background.ts',
    output: {
      file: 'dist/background.js',
      format: 'iife',
      codeSplitting: false,
    },
  },
  {
    input: 'src/main.ts',
    output: {
      file: 'dist/main.js',
      format: 'iife',
      codeSplitting: false,
    },
  },
]);
