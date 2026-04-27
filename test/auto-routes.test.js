const path = require("path");
const express = require("express");
const request = require("supertest");
const { ApiError } = require("resify-express");

const autoRoutes = require("../src/auto-routes");

const FIXTURES_DIR = path.join(__dirname, "fixtures");
const ROUTES_DIR = path.join(FIXTURES_DIR, "routes");
const EMPTY_ROUTES_DIR = path.join(FIXTURES_DIR, "empty-routes");
const TS_ROUTES_DIR = path.join(FIXTURES_DIR, "ts-routes");

function createApp(routesPath) {
  const app = express();
  app.use(express.json());
  app.use(autoRoutes(routesPath));
  return app;
}

describe("autoRoutes()", () => {
  describe("input validation", () => {
    test("throws ApiError when the given path does not exist", () => {
      const missingPath = path.join(FIXTURES_DIR, "does-not-exist");

      expect(() => autoRoutes(missingPath)).toThrow(ApiError);
    });

    test("ApiError exposes the correct status, code and description", () => {
      const missingPath = path.join(FIXTURES_DIR, "does-not-exist");

      try {
        autoRoutes(missingPath);
        throw new Error("autoRoutes should have thrown");
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.status).toBe(404);
        expect(err.code).toBe("ROUTES_PATH_NOT_FOUND");
        expect(err.message).toBe("Routes path not found");
        expect(err.description).toContain("does-not-exist");
      }
    });

    test("resolves a relative path against process.cwd()", () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(FIXTURES_DIR);
        expect(() => autoRoutes("routes")).not.toThrow();
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe("router instance", () => {
    test("returns a valid Express router function", () => {
      const router = autoRoutes(ROUTES_DIR);

      expect(typeof router).toBe("function");
      expect(router).toHaveProperty("use");
      expect(router).toHaveProperty("stack");
      expect(Array.isArray(router.stack)).toBe(true);
    });

    test("returns an empty router for an empty directory without throwing", () => {
      const router = autoRoutes(EMPTY_ROUTES_DIR);

      expect(typeof router).toBe("function");
      expect(router.stack.length).toBe(0);
    });
  });

  describe("route mounting", () => {
    let app;

    beforeAll(() => {
      app = createApp(ROUTES_DIR);
    });

    test("mounts the root index.js file at /", async () => {
      const res = await request(app).get("/");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Root index route works",
      });
    });

    test("mounts top-level files at /<filename>", async () => {
      const res = await request(app).get("/health");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Health route works",
      });
    });

    test("mounts a nested directory's index.js under /<dirname>", async () => {
      const res = await request(app).get("/user");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "User index route works",
      });
    });

    test("mounts a nested file under /<dirname>/<filename>", async () => {
      const res = await request(app).post("/user/login");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "User login route works",
      });
    });

    test("preserves nested routes defined inside a router (e.g. /user/profile)", async () => {
      const res = await request(app).get("/user/profile");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "User profile route works",
      });
    });

    test("recursively loads two-level deep directories", async () => {
      const res = await request(app).get("/admin/dashboard");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Admin dashboard route works",
      });
    });

    test("mounts a deeply nested index.js with the correct prefix", async () => {
      const res = await request(app).get("/admin/settings");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Admin settings root works",
      });
    });

    test("serves nested routes from a deeply nested router", async () => {
      const res = await request(app).get("/admin/settings/security");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Admin settings security works",
      });
    });

    test("returns 404 for an unknown path", async () => {
      const res = await request(app).get("/this-does-not-exist");

      expect(res.status).toBe(404);
    });
  });

  describe("file filtering", () => {
    test("ignores files that are not .js or .ts", async () => {
      const app = createApp(ROUTES_DIR);
      const res = await request(app).get("/notes");

      expect(res.status).toBe(404);
    });

    test("loads .ts files (with CommonJS export) as routers", async () => {
      const app = createApp(TS_ROUTES_DIR);
      const res = await request(app).get("/ping");

      expect(res.status).toBe(200);
      expect(res.body).toEqual({ ok: true });
    });

    test("handles directories that only contain dotfiles (e.g. .gitkeep)", () => {
      expect(() => autoRoutes(EMPTY_ROUTES_DIR)).not.toThrow();
    });
  });

  describe("module export", () => {
    test("exports autoRoutes as a function with arity 1", () => {
      expect(typeof autoRoutes).toBe("function");
      expect(autoRoutes.length).toBe(1);
    });
  });
});
