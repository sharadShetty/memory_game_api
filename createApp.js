const cors = require('cors');
const express = require('express');

module.exports = () => {
  const app = express();
  const corsOptions = {
    origin: ['http://localhost:3000'],
    optionsSuccessStatus: 200,
  };
  app.use(cors(corsOptions));
  app.use(express.json()).use(express.urlencoded({ extended: true }));
  return app;
};
