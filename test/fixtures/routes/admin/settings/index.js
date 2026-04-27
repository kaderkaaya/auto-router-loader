const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, message: "Admin settings root works" });
});

router.get("/security", (req, res) => {
  res.json({ success: true, message: "Admin settings security works" });
});

module.exports = router;
