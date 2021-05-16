const functions = {
  shuffleArray: (array) => {
    const arrayCopy = [...array];
    arrayCopy.forEach((item, index) => {
      const randomIndex = Math.floor(Math.random() * arrayCopy.length);
      const temp = arrayCopy[index];
      arrayCopy[index] = arrayCopy[randomIndex];
      arrayCopy[randomIndex] = temp;
    });
    return arrayCopy;
  },

  getNoOfCardsPerSet: (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 5;
      case 'medium':
        return 10;
      case 'hard':
        return 25;
    }
  },

  calculateScore: (startTime, endTime, errorScore) => {
    let timeScore = Math.round((endTime - startTime) / 10000);
    let score = 100 - errorScore - timeScore;
    return score < 0 ? 0 : score;
  },
};

module.exports = functions;
