const express = require('express');
const router = express.Router();
const {
  getNetworkData,
  postNetworkData,
} = require('../controllers/speedTestController');

router.get('/', getNetworkData);
router.post('/', postNetworkData);

module.exports = router;
