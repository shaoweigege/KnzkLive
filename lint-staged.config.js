module.exports = {
  '*.js': ['eslint --fix', 'git add'],
  '*.scss': ['stylelint --fix', 'git add']
};