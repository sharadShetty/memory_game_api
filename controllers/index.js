const fs = require('fs');
const distinctColors = require('distinct-colors').default;
const path = require('path');

const createControllers = () => {
  const controllers = {
    status: async (req, res) => {
      try {
        res.send("Welcome to Memory game's API.");
      } catch (err) {
        console.log('🚀 ~ file: index.js ~ line 11 ~ status: ~ err', err);
        res.status(400).send({ err });
      }
    },

    //for initiating new game
    newGame: async (req, res) => {
      try {
        const { difficulty } = req.body;
        if (!difficulty) {
          return res.status(400).send('difficulty is required');
        }
        const palette = distinctColors();
        const objPalette = {
          palette: palette,
        };
        const content = JSON.stringify(objPalette);
        const appDir = path.dirname(require.main.filename).split('/');
        const filePath = `/${appDir[1]}/${appDir[2]}/game-boards`;
        //create directory if it does not exists
        fs.mkdir(filePath, { recursive: true }, (err) => {
          if (err) throw err;
        });
        //write the data to file
        fs.writeFile(`${filePath}/${Date.now()}.json`, content, (err) => {
          if (err) {
            if (err) throw err;
          }
        });

        res.send({ palette });
      } catch (err) {
        console.log('🚀 ~ file: index.js ~ line 23 ~ newGame: ~ err', err);
        res.status(400).send({ err });
      }
    },
  };
  return controllers;
};
module.exports = createControllers;
