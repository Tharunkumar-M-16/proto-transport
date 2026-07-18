const Bus = require('../models/Bus');

async function getAreas(req, res) {
  const areas = await Bus.distinct('area');
  res.json(areas);
}

async function getBusesByArea(req, res) {
  const { area } = req.params;
  const buses = await Bus.find({ area });
  res.json(buses);
}

async function getBusById(req, res) {
  const bus = await Bus.findOne({ busId: req.params.busId });
  if (!bus) return res.status(404).json({ error: 'Bus not found' });
  res.json(bus);
}

async function createBus(req, res) {
  const { busId, routeName, area, stops } = req.body;

  if (!busId || !routeName || !area || !Array.isArray(stops) || stops.length === 0) {
    return res.status(400).json({ error: 'All fields are required: busId, routeName, area, and stops (non-empty array)' });
  }

  const existing = await Bus.findOne({ busId });
  if (existing) {
    return res.status(409).json({ error: 'Bus ID already exists' });
  }

  const bus = new Bus({
    busId,
    routeName,
    area,
    stops,
    currentStop: stops[0],
    currentStopIndex: 0,
  });

  await bus.save();
  res.status(201).json(bus);
}

module.exports = { getAreas, getBusesByArea, getBusById, createBus };
