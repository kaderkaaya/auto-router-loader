<div align="center">
  <h1>🚀 auto-route-loader</h1>
  <p><strong>The ultimate zero-configuration, file-based routing middleware for Express.js APIs.</strong></p>

  [![npm version](https://img.shields.io/npm/v/auto-route-loader.svg?style=flat-square)](https://www.npmjs.com/package/auto-route-loader)
  [![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat-square)](https://opensource.org/licenses/ISC)
  [![Node.js CI](https://img.shields.io/badge/Node.js-%3E%3D%2014.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)
</div>

<br />

Stop manually importing and mounting dozens of route files in your `app.js`. **auto-route-loader** brings the magical developer experience of Next.js and Nuxt.js file-based routing directly to your Express backend.

## ✨ Features

- 🚀 **Zero Configuration**: Just point it to your routes folder and watch the magic happen.
- 📁 **File-based Routing**: Your directory structure automatically dictates your API endpoints.
- 🔄 **Recursive Loading**: Supports infinitely nested directories for complex API architectures.
- ⚡️ **TypeScript Support**: Seamlessly loads both `.js` and `.ts` route files.
- 🛡️ **Smart Error Handling**: Built-in validation using `resify-express` for missing paths.
- 🎯 **Index Resolution**: `index.js` files are automatically mapped to the root of their parent directory.
- 🪶 **Lightweight**: Minimal overhead, maximum productivity.

---

## 📦 Installation

Install the package using your favorite package manager:

```bash
npm install auto-route-loader
# or
yarn add auto-route-loader
# or
pnpm add auto-route-loader
```

---

## 🚀 Quick Start

Here is a minimal example to get you up and running in seconds.

### 1. Create your directory structure

```text
project/
├── app.js
└── routes/
    ├── index.js           → GET /
    ├── health.js          → GET /health
    ├── user/
    │   ├── index.js       → GET /user
    │   └── login.js       → POST /user/login
    └── admin/
        └── dashboard.js   → GET /admin/dashboard
```

### 2. Write your routes

**`routes/user/login.js`**
```javascript
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({ message: "User logged in successfully" });
});

module.exports = router;
```

### 3. Connect it to Express

**`app.js`**
```javascript
const express = require("express");
const { autoRoutes } = require("auto-route-loader");

const app = express();
app.use(express.json());

// 🪄 One line to load them all!
app.use(autoRoutes("routes"));

app.listen(3000, () => console.log("Server running on port 3000 🚀"));
```

---

## 🧠 How it works

The loader follows these intuitive rules to map your files to URLs:

1. **Root Files**: Files in the root directory are mapped to `/<filename>`.
   - `routes/health.js` ➡️ `/health`
2. **Index Files**: Any file named `index.js` or `index.ts` is mapped to the root of its parent directory.
   - `routes/index.js` ➡️ `/`
   - `routes/user/index.js` ➡️ `/user`
3. **Nested Directories**: Directories create nested URL paths automatically.
   - `routes/admin/settings.js` ➡️ `/admin/settings`
4. **Smart Filtering**: Only `.js` and `.ts` files are loaded. Other files (like `.txt`, `.md`, or dotfiles like `.gitkeep`) are safely ignored.

---

## 🛡️ Error Handling

If the provided directory path does not exist, the loader will throw an `ApiError` (powered by `resify-express`) with a `404` status code and a descriptive message. This makes it incredibly easy to catch and debug configuration issues during startup.

```json
{
  "success": false,
  "message": "Routes path not found",
  "error": {
    "code": "ROUTES_PATH_NOT_FOUND",
    "description": "Routes path not found: /Users/yourname/project/routes"
  }
}
```

---

## 🧪 Testing

The package includes a comprehensive, 100% coverage test suite using Jest and Supertest.

```bash
# Run tests
npm run test

# Run tests with coverage report
npm run test:coverage
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the **ISC License**.

---
<div align="center">
  Made with ❤️ for better Developer Experience
</div>
