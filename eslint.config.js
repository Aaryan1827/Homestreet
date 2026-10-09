export default [
  {
    files: ["src/**/*.jsx", "src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: "readonly",
        document: "readonly",
        console: "readonly",
        navigator: "readonly",
        sessionStorage: "readonly",
        localStorage: "readonly",
        alert: "readonly",
        Math: "readonly",
        Date: "readonly",
        parseFloat: "readonly",
        clearInterval: "readonly",
        setInterval: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly"
      },
    },
    rules: {
      "no-undef": "error"
    }
  }
];
