var express = require('express');
var app = express();
var router = express.Router();

const verificationController = require('./src/verification');
const messageWebhookController = require('./src/messageWebhook');

router.route('/')

  .get(verificationController)

  .post(messageWebhookController)

module.exports = router;