import {
  SKContainer,
} from "simplekit/imperative-mode";

// local imports
import { Observer } from "./observer";
import { Model } from "./model";
import { makeFillColLayout } from "./fillCol";

export class ListManager extends SKContainer implements Observer {
  //#region observer pattern

  update(): void {
    this.clearChildren();

    for (let i = 0; i < this.model.games.length; i++) { 
      this.addChild(this.model.games[i].gameLabel);
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
    this.fillHeight = 1;
    this.layoutMethod = makeFillColLayout( {gap: 20} );
    this.id = "manager";
    //this.debug = true;

    // register with the model when we're ready
    this.model.addObserver(this);
  }
}