const express = require('express'),
router = express.Router()

//controllers
const RoomController = require('../controllers/RoomController');


router.get('/', RoomController.updateStatus)


module.exports = router;
