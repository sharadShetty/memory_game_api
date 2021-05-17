## Memory Game API

### About

#### Beginning of the game: The player receives two sets of identical cards in random order.

#### Game round: Each round the player lifts two cards from the table. If both cards match - the cards disappear from the table. The player continues to guess card matches until the table is clear.

#### End of the game: The player is rated by the time elapsed from the beginning of the game and the error score.

#

### Getting started

#### 1. (Optional) Add the env variables by exporting it from your terminal in project directory (or) install [direnv](https://direnv.net/) or your preferred method for env variable management. Create a `.envrc` file and place the following environment variables (may need to run `direnv allow` after changes).

export PORT="3001"

#### 2. Run `npm install` to install dependencies

#### 3. Run `node index.js` and this will start the server at [http://localhost:3001](http://localhost:3001) in your browser.

**Note: This project requires the [memory_game_ui](https://github.com/sharadShetty/memory_game_ui) for the UI and is not independent.**
