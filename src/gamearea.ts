import {
    SKContainer,
    Layout,
  } from "simplekit/imperative-mode";
  
  // local imports
  import { Observer } from "./observer";
  import { Model } from "./model";
  
  export class GameArea extends SKContainer implements Observer {
    //#region observer pattern
  
    update(): void {
      this.clearChildren();

      if (this.model.curGame != -1) {
        if (this.model.games[this.model.curGame].gameComplete) {
          this.fill = "rgb(236, 255, 220)";
        } else {
          this.fill = "white";
        }
        for (let i = 0; i < this.model.games[this.model.curGame].words.length; i++) {
          this.addChild(this.model.games[this.model.curGame].words[i]);
        }
      }
    }
  
    //#endregion
  
    constructor(private model: Model) {
      super();
  
      // setup the view
      this.id = "right";
      this.fill = "white";
      this.border = "black";
      this.padding = 10;
      this.fillWidth = 1;
      this.fillHeight = 2;
      this.layoutMethod = Layout.makeWrapRowLayout({ gap: 10 });
  
      // register with the model when we're ready
      this.model.addObserver(this);
    }
  }
  
  