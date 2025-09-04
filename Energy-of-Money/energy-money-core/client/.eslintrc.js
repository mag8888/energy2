module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    // Отключаем правила, которые могут вызывать проблемы
    'react-hooks/exhaustive-deps': 'warn'
  },
  env: {
    browser: true,
    es6: true,
    node: true
  }
};
