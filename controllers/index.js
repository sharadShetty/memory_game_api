const fs = require('fs');
const distinctColors = require('distinct-colors').default;
const path = require('path');
const {
  shuffleArray,
  getNoOfCardsPerSet,
  calculateScore,
} = require('../utils/functions');

const fileStructure = require('../utils/file-structure.json');

const createControllers = () => {
  const controllers = {
    //for checking status of API
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
        const set1 = shuffleArray(
          distinctColors({ count: noOfCardsPerSet })
        ).map((rgbValue, index) => ({
          card_id: index + 1,
          hide: false,
          color: `rgb(${rgbValue._rgb[0]},${rgbValue._rgb[1]},${rgbValue._rgb[2]})`,
        }));
        //create 2nd set of cards
        const set2 = shuffleArray(set1);

        fileContent.set1 = [...set1];
        fileContent.set2 = [...set2];

        const content = JSON.stringify(fileContent);
        const appDir = path.dirname(require.main.filename).split('/');
        const filePath = `/${appDir[1]}/${appDir[2]}/game-boards`;
        //create directory if it does not exists
        fs.mkdir(filePath, { recursive: true }, (err) => {
          if (err) {
            return res.status(400).send({ err });
          }

          //write the data to file
          fs.writeFile(`${filePath}/${fileId}.json`, content, (err) => {
            if (err) {
              return res.status(400).send({ err });
            }
            res.send({ fileId, noOfCardsPerSet });
          });
        });
      } catch (err) {
        console.log('🚀 ~ file: index.js ~ line 67 ~ newGame: ~ err', err);
        res.status(400).send({ err });
      }
    },

    //after a card is chosen
    cardSelection: async (req, res) => {
      try {
        const { set, cardNum, fileId } = req.body;
        if (!set || !cardNum || !fileId) {
          return res.status(400).send('set,cardNum and fileId is required');
        }

        const appDir = path.dirname(require.main.filename).split('/');
        const filePath = `/${appDir[1]}/${appDir[2]}/game-boards`;
        //read fie using file id
        fs.readFile(`${filePath}/${fileId}.json`, 'utf8', function (err, data) {
          if (err) {
            return res.status(400).send({ err });
          }
          const fileContent = { ...JSON.parse(data) };

          if (fileContent.completed_at) {
            return res.status(400).send('Game is already completed');
          }

          //for card selection of first group
          if (set === 1) {
            if (!fileContent.started_at) {
              fileContent.started_at = Date.now();
            }
            fileContent.chosen_card_id = cardNum;

            //write the data back to file
            fs.writeFile(
              `${filePath}/${fileId}.json`,
              JSON.stringify(fileContent),
              (err) => {
                if (err) {
                  return res.status(400).send({ err });
                }
                return res.send({
                  startedAt: fileContent.started_at,
                  color: fileContent.set1[cardNum - 1].color,
                });
              }
            );
          }

          //for card selection of second group
          else {
            //if 2nd card matches the 1st card
            if (
              fileContent.set2[cardNum - 1].card_id ===
              fileContent.chosen_card_id
            ) {
              fileContent.set1[fileContent.chosen_card_id - 1].hide = true;
              fileContent.set2[cardNum - 1].hide = true;
              fileContent.cards_to_hide.set1.push(fileContent.chosen_card_id);
              fileContent.cards_to_hide.set2.push(cardNum);

              //if all cards are matched
              if (
                fileContent.set1.length ===
                fileContent.cards_to_hide.set1.length
              ) {
                fileContent.completed_at = Date.now();
                fileContent.score = calculateScore(
                  fileContent.started_at,
                  fileContent.completed_at,
                  fileContent.error_score
                );
              }
              //write the data back to file
              fs.writeFile(
                `${filePath}/${fileId}.json`,
                JSON.stringify(fileContent),
                (err) => {
                  if (err) {
                    return res.status(400).send({ err });
                  }
                  return res.send({
                    color: fileContent.set2[cardNum - 1].color,
                    cardsToHide: fileContent.cards_to_hide,
                    errorScore: fileContent.error_score,
                    completedAt: fileContent.completed_at,
                    score: fileContent.score,
                  });
                }
              );
            }
            //if the cards dont match
            else {
              fileContent.error_score += 1;
              fileContent.chosen_card_id = null;
              fs.writeFile(
                `${filePath}/${fileId}.json`,
                JSON.stringify(fileContent),
                (err) => {
                  if (err) {
                    return res.status(400).send({ err });
                  }
                  return res.send({
                    color: fileContent.set2[cardNum - 1].color,
                    cardsToHide: fileContent.cards_to_hide,
                    errorScore: fileContent.error_score,
                  });
                }
              );
            }
          }
        });
      } catch (err) {
        console.log(
          '🚀 ~ file: index.js ~ line 78 ~ cardSelection: ~ err',
          err
        );
        res.status(400).send({ err });
      }
    },
  };
  return controllers;
};
module.exports = createControllers;
