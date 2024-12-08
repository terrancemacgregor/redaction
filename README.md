
# Redaction Project
The application is a redaction engine designed to allow users to upload PDF files, extract and redact sensitive information such as names, and download the redacted document. It provides an interface where users can upload PDFs, view the metadata (like file name, page count, etc.), and adjust the character buffer size for text processing. The redaction process is triggered by a "Redact" button that sends text buffers to a Redaction API, which returns the redacted text and extracted names.
The application continuously processes the PDF content, updating the Inspection Text Area with API outputs (original text, found names, and redacted text) while appending redacted text to the Redacted TextArea. After the redaction is complete, the user can download a text file with the redacted content, named with a timestamp. This process is facilitated through an easy-to-use web app, with a focus on streamlining document handling and redaction workflows.



## Technical Project Overview
This is a React project built with TypeScript and Vite. It is designed for efficient development with fast bundling and minimal configuration.

This project leverages Vite for development, providing a fast and optimized build system, and React with TypeScript for building a modern, maintainable frontend.

### Features

- **React**: The project uses React for building the user interface.
- **TypeScript**: TypeScript is configured for static typing, helping catch potential issues during development.
- **Vite**: Vite is used for fast bundling and serving the development environment.
- **Fast Refresh**: With `@vitejs/plugin-react`, this template supports fast refresh for rapid development feedback.

## Default Template Setup

This template provides a minimal setup to get React working in Vite with Hot Module Replacement (HMR) and includes some ESLint rules for code quality. Two official plugins are available for React Fast Refresh:

- **[@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md)**: Uses Babel for Fast Refresh.
- **[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)**: Uses SWC for Fast Refresh.

## Expanding the ESLint Configuration

If you are developing a production application, it is recommended to update your ESLint configuration to enable type-aware linting rules.

You can configure the top-level `parserOptions` property as follows:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

Additionally, update the ESLint configuration by replacing `tseslint.configs.recommended` with `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`, and optionally add `...tseslint.configs.stylisticTypeChecked`.

To enable React-specific linting, install and configure **eslint-plugin-react**:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

### Directory Structure

- **`src/`**: Contains the source code of the application.
    - **`src/App.tsx`**: The main component for your application.
- **`public/`**: Static assets for the project.
- **`tsconfig.json`**: TypeScript configuration for the project.
- **`package.json`**: Defines the project dependencies and scripts.

## Getting Started

To get started with the project, install the necessary dependencies and run the development server to view the app.

### Project Setup

This project is pre-configured with Vite and TypeScript, ready for further customization and development.

## Contributing

Feel free to fork this project and submit pull requests if you have improvements or fixes. Please follow standard Git conventions and ensure your code adheres to the project's coding style.

## License

This project is licensed under the MIT License.
