const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User route works",
  });
});

router.get("/profile", (req, res) => {
  res.json({
    success: true,
    message: "User profile route works",
  });
});

module.exports = router;