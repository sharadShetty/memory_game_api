const express = require('express');
const router = express.Router();

const registerRoutes = (app, controllers) => {
  router.get('/status', controllers.status);

  app.use('/', router);
};

module.exports = registerRoutes;
