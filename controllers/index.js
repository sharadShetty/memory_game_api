const createControllers = () => {
  const controllers = {
    status: async (req, res) => {
      try {
        res.send("Welcome to Memory game's API.");
      } catch (err) {
        res.status(400).send({ err });
      }
    },
  };
  return controllers;
};
module.exports = createControllers;
