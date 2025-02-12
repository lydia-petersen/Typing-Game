import { Subject } from "./observer";
import { Game } from "./game";

export class Model extends Subject {
  // model data (i.e. model state)
  private _games: Game [] = [];
  private _nextGameLabel: number = 0;
  private _curGame: number = -1;


  get nextGame() {
    return this._nextGameLabel;
  }

  get gameCount() {
    return this._games.length;
  }

  get games() {
    return this._games;
  }

  get curGame() {
    return this._curGame;
  }

  // model "business logic"
  addGame() {
    if (this._games.length < 4) {
      this._games.push(new Game(this, this._nextGameLabel));
      this._nextGameLabel++;
    }
    // need to notify observers any time the model changes
    this.notifyObservers();
  }

  deleteGame() {
    if (this._games.length < 1) {
      return;
    }
    if (this._curGame === -1) {
      this._curGame = this._games.length - 1;
    }
    let tempBefore: Game [] = this._games.slice(0, this.curGame);
    let tempAfter: Game [] = this._games.slice(this.curGame + 1);
    this._games = tempBefore.concat(tempAfter);
    this._curGame = -1;

    this.notifyObservers();
  }

  clearGames() {
    this._games = [];
    this._curGame = -1;
    this.notifyObservers();
  }

  updateFont(newFontSize: number) {
    if (this._curGame != -1) {
      this.games[this._curGame].updateFont(newFontSize);
    }
    this.notifyObservers();
  }

  addWords(newTotal: number) {
    if (this._curGame != -1) {
      this.games[this._curGame].addWords(newTotal);
    }
    this.notifyObservers();
  }

  checkSpelling(spelling: string): boolean {
    if (this._curGame != -1) {
      let result: boolean = this.games[this._curGame].checkSpelling(spelling);
      this.notifyObservers();
      return result;
    }
    return false;
  }

  resetGame() {
    if (this._curGame != -1) {
      this._games[this._curGame].resetGame();
    }
    this.notifyObservers();
  }

  updateCurWord() {
    this.notifyObservers();
  }

  setCurGame(gameNum: number) {
    if (this._curGame != -1) {
      this.games[this._curGame].gameLabel.border = "black";
    }
    for (let i = 0; i < this._games.length; i++) {
      if (this._games[i].gameNum === gameNum) {
        this._curGame = i;
        break;
      }
    }
    this.notifyObservers();
  }
}
