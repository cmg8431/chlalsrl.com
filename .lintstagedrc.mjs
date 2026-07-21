/** @type {import('lint-staged').Configuration} */
const config = {
  "*.{js,jsx,ts,tsx,json,css,md}": [
    "biome check --write --no-errors-on-unmatched",
  ],
};

export default config;
