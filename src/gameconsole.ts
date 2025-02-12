import {
    SKButton,
    SKContainer,
    Layout,
  } from "simplekit/imperative-mode";
import { MySKLabel } from "./mySKLabel";
import { MySKTextfield } from "./mySKTextfield";
  
  // local imports
  import { Observer } from "./observer";
  import { Model } from "./model";
  import { makeFillColLayout } from "./fillCol";
  
  export class GameConsole extends SKContainer implements Observer {
    //#region observer pattern
  
    update(): void {
      if (this.model.curGame === -1) {
        // textfields disabled when no game is selected
        this.gameProgressChild.text = "Select / Add a game to Start!";
        
        this.textInputChild.enabled = false;
        this.fontSizeInput.enabled = false;
        this.numWordsInput.enabled = false;

        this.fontSizeInput.text = "";
        this.numWordsInput.text = "";

      } else {
        // textfields enabled when game is selected
        this.textInputChild.enabled = true;
        this.fontSizeInput.enabled = true;
        this.numWordsInput.enabled = true;

        // some textfields disabled when game is won
        if (this.model.games[this.model.curGame].gameComplete) {
          this.textInputChild.enabled = false;
          this.fontSizeInput.enabled = false;
        }

        this.gameProgressChild.text = this.model.games[this.model.curGame].progressMsg.text;
        this.fontSizeInput.text = this.model.games[this.model.curGame].fontSize.toString();
        this.numWordsInput.text = this.model.games[this.model.curGame].numWords.toString();
      }
    }
  
    //#endregion
  
    textInput: SKContainer = new SKContainer();
    gamePropertiesInput: SKContainer = new SKContainer();
    resetButton: SKContainer = new SKContainer();
    gameProgress: SKContainer = new SKContainer();

    fontSize: SKContainer = new SKContainer();
    numWords: SKContainer = new SKContainer();

    fontSizeLabel: MySKLabel = new MySKLabel({
        text: "Font Size:",
        align: "centre",
        font: "16px sans-serif",
        width: 80
    });
    numWordsLabel: MySKLabel = new MySKLabel({
        text: "Num Words:",
        align: "centre",
        font: "16px sans-serif",
        width: 80
    }); 
    fontSizeInput: MySKTextfield = new MySKTextfield();
    numWordsInput: MySKTextfield = new MySKTextfield();

    
    textInputChild: MySKTextfield = new MySKTextfield();
    resetButtonChild: SKButton = new SKButton( {text: "Reset Game"} );
    gameProgressChild: MySKLabel = new MySKLabel( {text: "Select / Add a game to Start!"} );


  
    constructor(private model: Model) {
      super();
  
      // setup the view
      this.id = "left";
      this.fill = "white";
      this.border = "black";
      this.padding = 10;
      this.fillWidth = 1;
      this.fillHeight = 1;
      this.layoutMethod = makeFillColLayout( {gap: 5} );

      // four console components: full width & height
      this.textInput.fillHeight = 1;
      this.textInput.fillWidth = 1;
      this.gamePropertiesInput.fillHeight = 1;
      this.gamePropertiesInput.fillWidth = 1;
      this.resetButton.fillHeight = 1;
      this.resetButton.fillWidth = 1;
      this.gameProgress.fillHeight = 1;
      this.gameProgress.fillWidth = 1;

      // labels and text fields  in gamePropertiesInput component
      this.fontSize.fillHeight = 1;
      this.fontSize.fillWidth = 1;
      this.fontSizeInput.fillHeight = 1;
      this.fontSizeInput.fillWidth = 1;

      this.numWords.fillHeight = 1;
      this.numWords.fillWidth = 1;
      this.numWordsInput.fillHeight = 1;
      this.numWordsInput.fillWidth = 1;

      // buttons & textfields for other components
      this.textInputChild.fillHeight = 1;
      this.textInputChild.fillWidth = 1;
      this.resetButtonChild.fillHeight = 1;
      this.resetButtonChild.fillWidth = 1;
      this.gameProgressChild.fillHeight = 1;
      this.gameProgressChild.fillWidth = 1;


      this.fontSizeLabel.padding = 10;
      this.numWordsLabel.padding = 10;


      // TEXT INPUT
      this.textInput.addChild(this.textInputChild);
      this.textInput.layoutMethod = Layout.makeFillRowLayout();

      // GAME PROPERTIES INPUT
      this.fontSize.addChild(this.fontSizeLabel);
      this.fontSize.addChild(this.fontSizeInput);
      this.fontSize.layoutMethod = Layout.makeFillRowLayout( {gap: 5} );

      this.numWords.addChild(this.numWordsLabel);
      this.numWords.addChild(this.numWordsInput);
      this.numWords.layoutMethod = Layout.makeFillRowLayout( {gap: 5} );

      this.gamePropertiesInput.addChild(this.fontSize);
      this.gamePropertiesInput.addChild(this.numWords);
      this.gamePropertiesInput.layoutMethod = Layout.makeFillRowLayout( {gap: 5} );
      
      // RESET BUTTON
      this.resetButton.addChild(this.resetButtonChild);
      this.resetButton.layoutMethod = Layout.makeFillRowLayout();

      // GAME PROGRESS
      this.gameProgress.addChild(this.gameProgressChild);
      this.gameProgress.layoutMethod = Layout.makeFillRowLayout();
      
  
      this.addChild(this.textInput);
      this.addChild(this.gamePropertiesInput);
      this.addChild(this.resetButton);
      this.addChild(this.gameProgress);


      // actions when clicked on
      this.textInputChild.addEventListener(
        "textchanged",
        () => {
            if (this.model.checkSpelling(this.textInputChild.text)) {
              this.textInputChild.text = "";
            }
        },
        false
      )

      this.fontSizeInput.addEventListener(
        "textchanged",
        () => {
            this.fontSizeInput.text = this.fontSizeInput.text.replace(/[^0-9]/g, "");
            this.model.updateFont(parseInt(this.fontSizeInput.text) || 0);
        },
        false
      )

      this.numWordsInput.addEventListener(
        "textchanged",
        () => {
            this.numWordsInput.text = this.numWordsInput.text.replace(/[^0-9]/g, "");
            this.model.addWords(parseInt(this.numWordsInput.text) || 0);
        },
        false
      )
      
      this.resetButtonChild.addEventListener(
        "action",
        () => {
            this.model.resetGame();
        },
        false
      )      
  
      // register with the model when we're ready
      this.model.addObserver(this);
    }
  }
  
  