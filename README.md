# Complete Node.js Webhook Project

## Features
- GitHub webhook example
- Payment webhook example
- Express.js server
- Webhook routes
- Testing instructions
- ngrok setup

---

# Install

```bash
npm install
```

---

# Start Server

```bash
npm start
```

Server runs at:

```txt
http://localhost:5000
```

---

# Test GitHub Webhook

POST:

```txt
http://localhost:5000/webhook/github
```

Headers:

```txt
x-github-event: push
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

# Setup GitHub Webhook

## Step 1
Run ngrok:

```bash
ngrok http 5000
```

Copy generated URL.

Example:

```txt
https://abcd1234.ngrok-free.app
```

---

## Step 2

Go to your GitHub repository:

```txt
Settings → Webhooks → Add webhook
```

---

## Step 3

Payload URL:

```txt
https://YOUR_NGROK_URL/webhook/github
```

Content Type:

```txt
application/json
```

Events:

```txt
Just the push event
```

---

# Trigger Webhook

Push code:

```bash
git add .
git commit -m "Webhook test"
git push origin main
```

GitHub automatically sends webhook request.

---

# Webhook Flow

```txt
Push Code
   ↓
GitHub detects event
   ↓
GitHub sends POST request
   ↓
Your Node.js server receives webhook
   ↓
Business logic executes
```
# webhook
