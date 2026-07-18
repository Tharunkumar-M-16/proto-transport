const express = require('express');
const router = express.Router();
const { updateLocationFromApp } = require('../controllers/locationController');

router.post('/update', updateLocationFromApp);

module.exports = router;