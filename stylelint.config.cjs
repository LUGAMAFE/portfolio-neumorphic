const titleCase = (str) => str.replace(/(-|^)([^-]?)/g, (match, _, char) => char.toUpperCase());

const customBemSelector = (component) => {
  const block = titleCase(component);
  const kebabCase = '[a-z][a-zA-Z0-9]*';
  const element = `(?:_${kebabCase})?`;
  const modifier = `(?:___${kebabCase})?`;
  const attribute = '(?:\\[.+\\])?';
  return new RegExp(`^\\.${block}${element}${modifier}${attribute}$`);
};

module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-idiomatic-order'],
  plugins: [
    'stylelint-scss',
    'stylelint-order',
    'stylelint-no-unsupported-browser-features',
    'stylelint-itcss',
    'stylelint-selector-bem-pattern',
  ],
  rules: {
    'plugin/no-unsupported-browser-features': [
      true,
      {
        severity: 'warning',
        ignore: ['css-nesting'],
      },
    ],
    'plugin/selector-bem-pattern': {
      preset: 'bem',
      componentName: '[A-Za-z0-9-]+',
      componentSelectors: {
        initial: customBemSelector,
      },
      ignoreSelectors: ['.*\\.no-BEM-.*'],
      implicitComponents: [
        'src/components/**/*.scss',
        'src/style/sass/5_Objects/**/*.scss',
        'src/style/sass/6_Components**/*.scss',
      ],
    },
    'font-family-no-missing-generic-family-keyword': null,
    'scss/at-rule-no-unknown': true,
    'at-rule-no-unknown': null,
    'selector-class-pattern': null,
  },
};
