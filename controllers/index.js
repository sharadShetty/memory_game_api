const fs = require('fs');
const distinctColors = require('distinct-colors').default;
const path = require('path');
const { shuffleArray, getNoOfCardsPerSet } = require('../utils/functions');

const fileStructure = require('../utils/file-structure.json');

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
        } else if (
          difficulty !== 'easy' &&
          difficulty !== 'medium' &&
          difficulty !== 'hard'
        ) {
          return res.status(400).send('difficulty must be easy,medium or hard');
        }

        const fileId = Date.now();
        const noOfCardsPerSet = getNoOfCardsPerSet(difficulty);

        const fileContent = { ...fileStructure, file_id: fileId, difficulty };
        //create 1st set of cards
        const set1 = distinctColors({ count: noOfCardsPerSet }).map(
          (rgbValue, index) => ({
            card_id: index + 1,
            hide: false,
            color: `rgb(${rgbValue._rgb[0]},${rgbValue._rgb[1]},${rgbValue._rgb[2]})`,
          })
        );
        //create 2nd set of cards
        const set2 = shuffleArray(set1);

        fileContent.set1 = [...set1];
        fileContent.set2 = [...set2];

        const content = JSON.stringify(fileContent);
        const appDir = path.dirname(require.main.filename).split('/');
        const filePath = `/${appDir[1]}/${appDir[2]}/game-boards`;
        //create directory if it does not exists
        fs.mkdir(filePath, { recursive: true }, (err) => {
          if (err) throw err;
        });
        //write the data to file
        fs.writeFile(`${filePath}/${fileId}.json`, content, (err) => {
          if (err) {
            if (err) throw err;
          }
        });

        res.send({ fileId, noOfCardsPerSet });
      } catch (err) {
        console.log('🚀 ~ file: index.js ~ line 23 ~ newGame: ~ err', err);
        res.status(400).send({ err });
      }
    },
  };
  return controllers;
};
module.exports = createControllers;
