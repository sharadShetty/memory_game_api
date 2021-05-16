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
};

module.exports = functions;
