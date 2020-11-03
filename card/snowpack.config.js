module.exports = {
  mount: {
    public: '/',
    src: '/_dist_',
  },
  plugins: [
    '@snowpack/plugin-typescript',
    '@snowpack/plugin-sass'
  ],
  install: [
    /* ... */
  ],
  installOptions: {
    installTypes: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  proxy: {
    /* ... */
  },
  alias: {
    /* ... */
  },
};
