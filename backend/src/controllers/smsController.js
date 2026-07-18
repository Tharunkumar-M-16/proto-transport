const Bus = require('../models/Bus');
const parseSms = require('../utils/parseSms');
const { updateBusLocation } = require('./locationController');

function esc(str) {
  const s = String(str);
  const amp = String.fromCharCode(38) + 'amp;';
  const lt = String.fromCharCode(38) + 'lt;';
  const gt = String.fromCharCode(38) + 'gt;';
  const quot = String.fromCharCode(38) + 'quot;';
  return s.split('&').join(amp).split('<').join(lt).split('>').join(gt).split('"').join(quot);
}

// Express handler for the Twilio SMS webhook
async function handleSmsWebhook(req, res) {
  try {
    // Twilio sends the message in req.body.Body and the sender in req.body.From
    const smsText = req.body.Body || req.body.message || req.body.text || req.body.body;

    const parsed = parseSms(smsText);
    if (!parsed) {
      res.type('text/xml');
      return res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Could not parse your message. Send STATUS BUS101 for bus info or BUS101 StopName to update location.</Message></Response>');
    }

    if (parsed.type === 'status') {
      // Passenger asking for bus status: "STATUS BUS101"
      const bus = await Bus.findOne({ busId: parsed.busId });
      let reply;
      if (!bus) {
        reply = 'Bus ' + parsed.busId + ' not found.';
      } else {
        reply = 'Bus ' + bus.busId + ' (' + bus.routeName + ') - Area: ' + bus.area + ', Current stop: ' + (bus.currentStop || 'N/A') + ', Last updated: ' + (bus.lastUpdated ? bus.lastUpdated.toLocaleString() : 'N/A');
      }

      // Reply via TwiML <Message> — Twilio sends it back to the original sender
      res.type('text/xml');
      return res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>' + esc(reply) + '</Message></Response>');
    }

    // Driver updating location: "BUS101 Thiruvanmiyur"
    const io = req.app.get('io');
    const bus = await updateBusLocation(io, parsed.busId, parsed.stopName, 'sms');
    res.json({ success: true, bus });
  } catch (err) {
    console.error('SMS webhook error:', err);
    res.type('text/xml');
    res.send('<?xml version="1.0" encoding="UTF-8"?><Response><Message>Error: ' + esc(err.message) + '</Message></Response>');
  }
}

module.exports = { handleSmsWebhook };