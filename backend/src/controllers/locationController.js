const Bus = require('../models/Bus');

// io is passed in so this same function can emit socket events
async function updateBusLocation(io, busId, stopName, source = 'app') {
  const bus = await Bus.findOne({ busId });
  if (!bus) throw new Error(`Bus ${busId} not found`);

  const stopIndex = bus.stops.findIndex(
    (s) => s.toLowerCase() === stopName.toLowerCase()
  );

  bus.currentStop = stopName;
  bus.currentStopIndex = stopIndex !== -1 ? stopIndex : bus.currentStopIndex;
  bus.lastUpdated = new Date();
  bus.updatedVia = source;
  await bus.save();

  // push live update to anyone tracking this bus
  io.to(busId).emit('locationUpdate', {
    busId: bus.busId,
    currentStop: bus.currentStop,
    currentStopIndex: bus.currentStopIndex,
    lastUpdated: bus.lastUpdated,
    updatedVia: bus.updatedVia
  });

  return bus;
}

// Express handler for driver app POST
async function updateLocationFromApp(req, res) {
  try {
    const { busId, stopName } = req.body;
    if (!busId || !stopName) {
      return res.status(400).json({ error: 'busId and stopName required' });
    }
    const io = req.app.get('io');
    const bus = await updateBusLocation(io, busId, stopName, 'app');
    res.json({ success: true, bus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { updateBusLocation, updateLocationFromApp };