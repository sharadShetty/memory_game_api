const createApp = require('./createApp');
const createRoutes = require('./routes');
const createControllers = require('./controllers');

const { PORT = 3001 } = process.env;

const start = () => {
  const app = createApp();
  createRoutes(app, createControllers());

  app.listen(PORT, () => console.log(`🚀 ~ App listening at port:${PORT}`));
};
start();
