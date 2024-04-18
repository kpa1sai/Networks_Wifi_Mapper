const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const networkRoutes = require('./routes/networkRoutes');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // allow any origin
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// Body parser middleware
app.use(bodyParser.json());

// DB Config and Connection setup
mongoose
  .connect('mongodb://admin:root@0.0.0.0:5050/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Use Routes
app.use('/api/network', networkRoutes);
app.use('/static', cors(), express.static('public'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
