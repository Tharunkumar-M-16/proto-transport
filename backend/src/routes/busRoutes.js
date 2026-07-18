const express = require('express');
const router = express.Router();
const { getAreas, getBusesByArea, getBusById, createBus } = require('../controllers/busController');

router.get('/areas', getAreas);
router.get('/area/:area', getBusesByArea);
router.get('/:busId', getBusById);
router.post('/', createBus);

module.exports = router;
