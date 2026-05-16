const fileWriter = require("../utils/fileWriter");
const logger = require("../utils/logger");

const handleGitHubWebhook = async ({ event, payload }) => {
  const data = {
    source: "github",
    event,
    receivedAt: new Date().toISOString(),
    payload,
  };

  await fileWriter.saveWebhookData("github", data);

  logger.info("GitHub webhook saved to file");
};

const handlePaymentWebhook = async (payload) => {
  const data = {
    source: "payment",
    event: payload.event,
    receivedAt: new Date().toISOString(),
    payload,
  };

  await fileWriter.saveWebhookData("payment", data);

  logger.info("Payment webhook saved to file");
};

module.exports = {
  handleGitHubWebhook,
  handlePaymentWebhook,
};
