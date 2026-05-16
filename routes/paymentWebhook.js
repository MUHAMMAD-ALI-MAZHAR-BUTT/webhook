const express = require("express");
const webhookService = require("../services/webhookService");

const router = express.Router();

router.post("/", async (req, res) => {
  await webhookService.handlePaymentWebhook(req.body);

  res.status(200).json({
    success: true,
    message: "Payment webhook received",
  });
});

module.exports = router;
