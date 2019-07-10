const express = require('express');
const router = express.Router();
const RoomController = require('../controllers/RoomController');

router.get('/update', RoomController.updateStatus)


module.exports = router
