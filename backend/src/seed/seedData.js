const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bus = require('../models/Bus');

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  await Bus.deleteMany({});

  await Bus.create([
    {
      busId: 'BUS101',
      routeName: 'Adyar - T Nagar',
      area: 'Adyar',
      stops: ['Adyar Depot', 'Thiruvanmiyur', 'Kotturpuram', 'T Nagar'],
      currentStop: 'Adyar Depot',
      currentStopIndex: 0
    },
    {
      busId: 'BUS102',
      routeName: 'Tambaram - Guindy',
      area: 'Tambaram',
      stops: ['Tambaram', 'Chromepet', 'Pallavaram', 'Guindy'],
      currentStop: 'Tambaram',
      currentStopIndex: 0
    }
  ]);

  console.log('Seeded buses');
  process.exit();
}

seed();