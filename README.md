# Complete Node.js Webhook Project (GitHub + Stripe Style Webhooks)

This project teaches:

- What a webhook is
- How webhooks work in real applications
- How to create webhook endpoints in Node.js
- How GitHub webhooks work
- How payment-style webhooks work
- How to test webhooks locally
- How to expose localhost using ngrok
- How to verify webhook signatures
- Best practices
- Common mistakes

---

# Final Architecture

```txt
GitHub Push Event
       ↓
GitHub Webhook
       ↓
POST Request Sent
       ↓
Your Node.js Server
       ↓
Webhook Endpoint
       ↓
Business Logic Executes
```

---

# Technologies Used

- Node.js
- Express.js
- ngrok
- GitHub Webhooks
- dotenv
- crypto

---

# Project Structure

```txt
webhook-project/
│
├── server.js
├── package.json
├── .env
├── README.md
├── routes/
│   ├── githubWebhook.js
│   └── paymentWebhook.js
├── services/
│   └── webhookService.js
├── utils/
│   ├── fileWriter.js
│   └── logger.js
└── webhook-data/
```

---

# Step 1 — Create Project

Open terminal:

```bash
mkdir webhook-project
cd webhook-project
```

Initialize project:

```bash
npm init -y
```

---

# Step 2 — Install Packages

```bash
npm install express dotenv body-parser
```

For signature verification:

```bash
npm install crypto
```

Install ngrok globally:

```bash
npm install -g ngrok
```

---

# Step 3 — Create package.json

Replace scripts section with:

```json
{
  "name": "webhook-project",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "body-parser": "^1.20.2",
    "dotenv": "^16.4.5",
    "express": "^4.19.2"
  }
}
```

---

# Step 4 — Create .env

Create:

```txt
.env
```

Add:

```env
PORT=5000
GITHUB_SECRET=mygithubsecret
```

---

# Step 5 — Create Main Server

Create:

```txt
server.js
```

Add:

```javascript
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
```

---

# Step 6 — Create GitHub Webhook Route

Create:

```txt
routes/githubWebhook.js
```

Add:

```javascript
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
```

---

# Step 7 — Create Payment Webhook Route

Create:

```txt
routes/paymentWebhook.js
```

Add:

```javascript
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
```

---

# Step 8 — Create Service Layer

Create:

```txt
services/webhookService.js
```

Add:

```javascript
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
```

---

# Step 9 — Create File Writer Utility

Create:

```txt
utils/fileWriter.js
```

Add:

```javascript
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
```

---

# Step 10 — Create Logger Utility

Create:

```txt
utils/logger.js
```

Add:

```javascript
const info = (message) => {
  console.log(`[INFO] ${message}`);
};

const error = (message) => {
  console.error(`[ERROR] ${message}`);
};

module.exports = {
  info,
  error,
};
```

---

# Step 11 — Run Server

```bash
npm start
```

You should see:

```txt
Server running on port 5000
```

---

# Step 12 — Test Locally Using Postman

GitHub cannot access localhost directly.

So first test manually.

---

# Test GitHub Webhook Endpoint

POST:

```txt
http://localhost:5000/webhook/github
```

Body:

```json
{
  "repository": {
    "name": "demo-project"
  },
  "pusher": {
    "name": "Ali"
  }
}
```

Headers:

```txt
x-github-event: push
```

You should see logs in terminal.

---

# Test Payment Webhook

POST:

```txt
http://localhost:5000/webhook/payment
```

Body:

```json
{
  "event": "payment.success",
  "customer": "Ali",
  "amount": 100
}
```

---

# Step 13 — Expose Localhost to Internet

GitHub needs public URL.

Use ngrok.

Run:

```bash
ngrok http 5000
```

You will see:

```txt
https://abcd1234.ngrok-free.app
```

This is your public URL.

---

# Step 14 — Configure GitHub Webhook

Open GitHub repository.

Go to:

```txt
Settings → Webhooks → Add webhook
```

---

# Add These Values

## Payload URL

```txt
https://abcd1234.ngrok-free.app/webhook/github
```

---

## Content Type

```txt
application/json
```

---

## Secret

```txt
mygithubsecret
```

Same as `.env`.

---

## Events

Choose:

```txt
Just the push event
```

---

# Step 12 — Trigger Webhook

Push code:

```bash
git add .
git commit -m "Webhook test"
git push origin main
```

GitHub sends webhook automatically.

---

# Expected Console Output

```txt
========================
GitHub Webhook Received
========================
Event: push
Ali pushed code to demo-project
Running deployment logic...
```

---

# How GitHub Actually Calls Your Server

GitHub internally sends:

```http
POST /webhook/github
```

with headers:

```txt
x-github-event: push
```

and JSON body.

---

# Webhook Lifecycle

```txt
Push Code
    ↓
GitHub Detects Event
    ↓
GitHub Sends HTTP Request
    ↓
Your Server Receives Request
    ↓
Business Logic Runs
    ↓
200 OK Returned
```

---

# Why Webhooks Are Better Than Polling

Without webhook:

```txt
Server asks GitHub repeatedly:
"Any updates?"
```

Bad because:

- unnecessary requests
- wasted resources
- delayed updates

With webhook:

```txt
GitHub instantly sends update.
```

Efficient.

---

# Important Webhook Concepts

# 1. Endpoint

URL receiving webhook.

Example:

```txt
/webhook/github
```

---

# 2. Payload

Data sent by sender.

Usually JSON.

---

# 3. Event

What happened.

Examples:

- push
- payment.success
- order.created

---

# 4. Headers

Extra metadata.

Example:

```txt
x-github-event: push
```

---

# 5. Response

Your server should respond quickly:

```http
200 OK
```

---

# Why POST Is Used

Because POST supports:

- JSON body
- large payloads
- structured data
- secure transmission

Most webhooks use POST.

---

# Common Webhook Problems

# Problem 1 — Duplicate Events

GitHub may retry failed requests.

Meaning same webhook may arrive twice.

Solution:

- store event IDs
- make operations idempotent

---

# Problem 2 — Slow Processing

If processing takes too long:

GitHub timeout occurs.

Solution:

```txt
Receive → Queue → Respond → Process Later
```

---

# Problem 3 — Security Risks

Attackers may fake requests.

Solution:

- secret verification
- signature validation
- IP whitelisting

---

# Add Signature Verification

Replace GitHub route with advanced version.

---

# Secure GitHub Webhook Example

```javascript
const express = require("express");
const crypto = require("crypto");

const router = express.Router();

const SECRET = process.env.GITHUB_SECRET;

router.post("/", (req, res) => {
  const signature = req.headers["x-hub-signature-256"];

  const hmac = crypto.createHmac("sha256", SECRET);

  const digest =
    "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex");

  if (signature !== digest) {
    console.log("Invalid signature");

    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  console.log("Valid webhook received");

  res.status(200).json({
    success: true,
  });
});

module.exports = router;
```

---

# Real Companies Using Webhooks

- GitHub
- Stripe
- PayPal
- Shopify
- Slack
- Discord
- Twilio

---

# Real-World Uses

# CI/CD

```txt
Push Code
   ↓
Webhook Triggered
   ↓
Automatic Deployment
```

---

# Payments

```txt
Payment Success
   ↓
Webhook Triggered
   ↓
Unlock Premium Features
```

---

# E-commerce

```txt
Order Created
   ↓
Webhook Triggered
   ↓
Inventory Updated
```

---

# Chat Applications

```txt
New Message
   ↓
Webhook Triggered
   ↓
Bot Responds
```

---

# Important Best Practices

## Always Respond Fast

Return:

```http
200 OK
```

quickly.

---

## Never Trust Incoming Data Directly

Always validate.

---

## Use Logging

Debugging webhooks is hard.

Log everything.

---

## Use Queues

For heavy operations.

---

## Handle Retries

Expect duplicate events.

---

# Production Architecture

```txt
GitHub
   ↓
Load Balancer
   ↓
Webhook API
   ↓
Queue (RabbitMQ/Kafka)
   ↓
Worker Services
   ↓
Database
```

---

# Final Mental Model

Webhook means:

```txt
"Don't ask repeatedly."
```

Instead:

```txt
"I will notify you automatically when event happens."
```

---

# Final One-Line Definition

```txt
Webhook = Automatic HTTP callback triggered by an event.
```
