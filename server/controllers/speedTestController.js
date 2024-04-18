const NetworkData = require('../models/NetworkData');

// Fetch Network Data
exports.getNetworkData = async (req, res) => {
  try {
    const data = await NetworkData.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Post Network Data
exports.postNetworkData = async (req, res) => {
  const { location, speed } = req.body;
  try {
    const newData = new NetworkData({ location, speed });
    await newData.save();
    res.status(201).send(newData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
