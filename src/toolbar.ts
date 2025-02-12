import {
    SKContainer,
    SKButton,
    Layout,
  } from "simplekit/imperative-mode";
  
  // local imports
  import { Observer } from "./observer";
  import { Model } from "./model";
  
  export class Toolbar extends SKContainer implements Observer {
    //#region observer pattern
  
    update(): void {}
  
    //#endregion

    addGame: SKButton = new SKButton( {text: "Add Game"} );
    deleteGame: SKButton = new SKButton( {text: "Delete Game"} );
    clearGames: SKButton = new SKButton( {text: "Clear Games"} );
  
    constructor(private model: Model) {
      super();
  
      // setup the view
      this.id = "toolbar";
      this.fill = "lightgray";
      this.border = "black";
      this.padding = 10;
      this.height = 50;
      this.fillWidth = 1;
      this.layoutMethod = Layout.makeCentredLayout();


      let temp: SKContainer = new SKContainer();
      temp.height = 28;
      temp.width = 470;

      this.addGame.width = 150;
      this.deleteGame.width = 150;
      this.clearGames.width = 150;

      temp.addChild(this.addGame);
      temp.addChild(this.deleteGame);
      temp.addChild(this.clearGames);
      temp.layoutMethod = Layout.makeFillRowLayout( {gap: 10} );

      this.addChild(temp);


      // this is the Controller
      this.addGame.addEventListener("action", () => {
        model.addGame();
      });

      this.deleteGame.addEventListener("action", () => {
        model.deleteGame(); 
      });

      this.clearGames.addEventListener("action", () => {
        model.clearGames();
      });
  
      // register with the model when we're ready
      this.model.addObserver(this);
    }
  }