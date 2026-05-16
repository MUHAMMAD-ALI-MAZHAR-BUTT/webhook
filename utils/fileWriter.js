const fs = require("fs");
const path = require("path");

const WEBHOOK_DIR = path.join(__dirname, "../webhook-data");

if (!fs.existsSync(WEBHOOK_DIR)) {
  fs.mkdirSync(WEBHOOK_DIR);
}

const saveWebhookData = async (type, data) => {
  const timestamp = Date.now();

  const fileName = `${type}-${timestamp}.json`;

  const filePath = path.join(WEBHOOK_DIR, fileName);

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  return filePath;
};

module.exports = {
  saveWebhookData,
};
