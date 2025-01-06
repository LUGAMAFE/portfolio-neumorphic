module.exports = {
  '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{html,md,xml,svg,less,postcss,markdown,yml,yaml,json}': ['prettier --write'],
  '*.{css,scss,less}': ['prettier --write', 'stylelint --fix'],
};
