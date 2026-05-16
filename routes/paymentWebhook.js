const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {

    console.log('========================');
    console.log('Payment Webhook Received');
    console.log('========================');

    const event = req.body.event;

    console.log('Event:', event);

    if (event === 'payment.success') {

        const customer = req.body.customer;
        const amount = req.body.amount;

        console.log(`Payment success from ${customer}`);
        console.log(`Amount: $${amount}`);

        console.log('Unlocking premium features...');
        console.log('Sending invoice...');
    }

    res.status(200).json({
        success: true,
        message: 'Payment webhook received'
    });
});

module.exports = router;
