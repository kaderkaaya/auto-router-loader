const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Admin dashboard route works" });
});

module.exports = router;
