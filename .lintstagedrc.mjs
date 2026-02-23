/** @type {import('lint-staged').Configuration} */
const config = {
  "*.{md,json,css}": ["prettier --write"],
  "!(*.d).{js,jsx,ts,tsx}": [
    "prettier --write --cache",
    "eslint --fix --max-warnings=0 --no-warn-ignored --cache --cache-location './node_modules/.cache/eslint/.eslintcache'",
  ],
};

export default config;
