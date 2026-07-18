const parseSms = require('../utils/parseSms');
const { updateBusLocation } = require('./locationController');

// Express handler for the SMS gateway webhook
async function handleSmsWebhook(req, res) {
  try {
    // adjust field name below to match whatever the SMS gateway app sends
    // (commonly "message", "text", or "body")
    const smsText = req.body.message || req.body.text || req.body.body;

    const parsed = parseSms(smsText);
    if (!parsed) {
      return res.status(400).json({ error: 'Could not parse SMS' });
    }

    const io = req.app.get('io');
    const bus = await updateBusLocation(io, parsed.busId, parsed.stopName, 'sms');
    res.json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { handleSmsWebhook };