const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");

const githubWebhook = require("./routes/githubWebhook");
const paymentWebhook = require("./routes/paymentWebhook");
const logger = require("./utils/logger");

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use("/webhook/github", githubWebhook);
app.use("/webhook/payment", paymentWebhook);

app.get("/", (req, res) => {
  res.send("Webhook Server Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
