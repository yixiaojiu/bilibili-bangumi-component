import type { Config } from '@stencil/core'

export const config: Config = {
  namespace: 'bilibili-bangumi-component',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
  sourceMap: false,
}
