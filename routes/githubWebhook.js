const express = require("express");
const webhookService = require("../services/webhookService");

const router = express.Router();

router.post("/", async (req, res) => {
  const event = req.headers["x-github-event"];

  await webhookService.handleGitHubWebhook({
    event,
    payload: req.body,
  });

  res.status(200).json({
    success: true,
    message: "GitHub webhook received",
  });
});

module.exports = router;
