const express = require('express');
const router = express.Router();

const registerRoutes = (app, controllers) => {
  router.get('/status', controllers.status);
  router.post('/game/new', controllers.newGame);

  app.use('/', router);
};

module.exports = registerRoutes;
