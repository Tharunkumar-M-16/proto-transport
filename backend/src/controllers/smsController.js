const twilio = require('twilio');
const Bus = require('../models/Bus');
const parseSms = require('../utils/parseSms');
const { updateBusLocation } = require('./locationController');

// Express handler for the Twilio SMS webhook
async function handleSmsWebhook(req, res) {
  try {
    // Twilio sends the message in req.body.Body and the sender in req.body.From
    const smsText = req.body.Body || req.body.message || req.body.text || req.body.body;
    const fromNumber = req.body.From;

    const parsed = parseSms(smsText);
    if (!parsed) {
      return res.status(400).json({ error: 'Could not parse SMS' });
    }

    if (parsed.type === 'status') {
      // Passenger asking for bus status: "STATUS BUS101"
      const bus = await Bus.findOne({ busId: parsed.busId });
      let reply;
      if (!bus) {
        reply = `Bus ${parsed.busId} not found.`;
      } else {
        reply = `Bus ${bus.busId} (${bus.routeName}) — Area: ${bus.area}, Current stop: ${bus.currentStop || 'N/A'}, Last updated: ${bus.lastUpdated ? bus.lastUpdated.toLocaleString() : 'N/A'}`;
      }

      // Send reply SMS via Twilio
      if (fromNumber) {
        const client = twilio(
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN
        );
        await client.messages.create({
          body: reply,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: fromNumber,
        });
      }

      // Respond with TwiML to acknowledge
      res.type('text/xml');
      return res.send(`<?xml version="1.0" encoding="UTF-8"?><Response></Response>`);
    }

    // Driver updating location: "BUS101 Thiruvanmiyur"
    const io = req.app.get('io');
    const bus = await updateBusLocation(io, parsed.busId, parsed.stopName, 'sms');
    res.json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleSmsWebhook };
