const express = require("express");

const autoRoutes = require("./auto-routes");
const { attachHelpers, errorMiddleware } = require("resify-express");
app.use(express.json());
app.use(attachHelpers);
app.use(
  errorMiddleware({
    includeStack: process.env.NODE_ENV === "development",
  }),
);
module.exports = {
  autoRoutes,
};
