const express = require('express');
const router = express.Router();
const { handleSmsWebhook } = require('../controllers/smsController');

router.post('/', handleSmsWebhook);

module.exports = router;