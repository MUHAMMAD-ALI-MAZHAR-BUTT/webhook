const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {

    console.log('========================');
    console.log('GitHub Webhook Received');
    console.log('========================');

    const event = req.headers['x-github-event'];

    console.log('Event:', event);

    console.log('Payload:');
    console.log(JSON.stringify(req.body, null, 2));

    if (event === 'push') {

        const repository = req.body.repository?.name;
        const pusher = req.body.pusher?.name;

        console.log(`${pusher} pushed code to ${repository}`);

        console.log('Running deployment logic...');
    }

    res.status(200).json({
        success: true,
        message: 'GitHub webhook received'
    });
});

module.exports = router;
