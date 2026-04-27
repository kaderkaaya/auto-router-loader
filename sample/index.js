const express = require("express");
const autoRoutes = require("../src/auto-routes");
const app = express();

app.use(express.json());
app.use(autoRoutes("sample/routes"));
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
