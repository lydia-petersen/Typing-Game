import { generateRandomWords } from "./words"
import { Model } from "./model";
import { Layout, SKContainer } from "simplekit/imperative-mode";
import { MySKLabel } from "./mySKLabel";
import { MySKContainer } from "./mySKContainer";

export class Game {

    words: MySKContainer [] = [];
    numComplete: number = 0;    // number of complete words
    curWord: number = -1;   // index of word in focus
    gameComplete: boolean = false;

    gameLabel: SKContainer = new SKContainer();
    pbComplete: SKContainer = new SKContainer();
    pbIncomplete: SKContainer = new SKContainer();


    fontSize: number = 16;
    numWords: number = 20;

    progressMsg: MySKLabel = new MySKLabel({
        text: `${this.numComplete}/${this.numWords} Words Matched!`,
        align: "centre",
        font: "16px sans-serif"
    })

    constructor(
        private model: Model,
        public gameNum: number
    ) {
        
        const list: string [] = generateRandomWords(this.numWords);

        // create list of words
        // Wrap words in SKContainer
        for (let i = 0; i < list.length; i++) {
            let tempContain: MySKContainer = new MySKContainer();
            let newWord: MySKLabel = new MySKLabel({
                text: list[i],
                align: "centre",
                font: `${this.fontSize}px sans-serif`,
            });
            tempContain.height = newWord.height;
            tempContain.width = newWord.width;
            tempContain.fill = "white";
            tempContain.addChild(newWord);

            this.words.push(tempContain);
        }

        // focus first word in list
        if (this.words.length >= 1) {
            this.curWord = 0;
            this.words[this.curWord].fill = "yellow";
        }

        // GAME LABEL & PROGRESS BAR
        
        this.gameLabel.border = "black";
        this.gameLabel.height = 80;
        this.gameLabel.fillWidth = 1;

        const gameID: SKContainer = new SKContainer();
        gameID.padding = 10;
        gameID.width = 80;
        gameID.height = 80;

        const gameIDLabel: MySKLabel = new MySKLabel({
            text: `Game ${this.gameNum}`,
            align: "centre",
            font: "16px sans-serif"
        });
        gameIDLabel.fillHeight = 1;
        gameIDLabel.fillWidth = 1;

        let progressBar: SKContainer = new SKContainer();
        progressBar.height = 80;
        progressBar.fillWidth = 1;

        
        this.pbComplete.fill = "lightgreen";
        this.pbComplete.height = 80;
        this.pbComplete.fillWidth = this.numComplete / this.words.length;

        this.pbIncomplete.fill = "lightgray";
        this.pbIncomplete.height = 80;
        this.pbIncomplete.fillWidth = 1 - (this.numComplete / this.words.length);

        gameID.addChild(gameIDLabel);
        gameID.layoutMethod = Layout.makeFillRowLayout();

        progressBar.addChild(this.pbComplete);
        progressBar.addChild(this.pbIncomplete);
        progressBar.layoutMethod = Layout.makeFillRowLayout();

        this.gameLabel.addChild(gameID);
        this.gameLabel.addChild(progressBar);

        this.gameLabel.layoutMethod = Layout.makeFillRowLayout();


        // actions when clicked on
        this.gameLabel.addEventListener(
            "action",
            () => {
                if (this.model.curGame !== -1) {
                    if (this.model.games[this.model.curGame].gameNum !== this.gameNum) {
                        this.gameLabel.border = "red";
                        this.model.setCurGame(this.gameNum);
                    }
                } else {
                    this.gameLabel.border = "red";
                    this.model.setCurGame(this.gameNum);
                }
            },
            false
        )

        this.wordsListen();
    }

    wordsListen() {
        for (let i = 0; i < this.words.length; i++) {
            this.words[i].addEventListener(
                "action",
                () => {
                    if (this.numComplete != this.numWords) {
                        if (this.words[i].fill === "lightgreen") {
                            this.decrementCompletedWords();
                        }
                        this.words[this.curWord].fill = "white";
                        this.words[this.curWord].border = "";
                        if (this.curWord === i) {
                            for (let j = 0; j < this.words.length; j++) {
                                if (this.words[j].fill === "white") {
                                    this.words[j].fill = "yellow";
                                    this.curWord = j;
                                    break;
                                }
                            }
                        } else {
                            this.words[i].fill = "yellow";
                            this.words[i].border = "red";
                            this.curWord = i;
                        }
                        this.model.updateCurWord();
                    }
                }
            )
        } 
    }

    checkSpelling(spelling: string): boolean {
        if (spelling.toLowerCase() === this.words[this.curWord].children[0].text) {
            this.words[this.curWord].fill = "lightgreen";
            this.words[this.curWord].border = "";
            for (let j = 0; j < this.words.length; j++) {
                if (this.words[j].fill === "white") {
                    this.words[j].fill = "yellow";
                    this.curWord = j;
                    break;
                }
            }
            this.incrementCompletedWords();
            return true;
        }
        return false;
    }

    incrementCompletedWords() {
        this.numComplete++;
        this.pbComplete.fillWidth = this.numComplete / this.words.length;
        this.pbIncomplete.fillWidth = 1 - (this.numComplete / this.words.length);

        if (this.numComplete === this.numWords) {
            this.progressMsg.text = "Game Completed!";
            this.gameComplete = true;
        } else {
            this.progressMsg.text = `${this.numComplete}/${this.numWords} Words Matched!`;
        }
    }

    decrementCompletedWords() {
        this.numComplete--;
        this.pbComplete.fillWidth = this.numComplete / this.words.length;
        this.pbIncomplete.fillWidth = 1 - (this.numComplete / this.words.length);
        this.progressMsg.text = `${this.numComplete}/${this.numWords} Words Matched!`;
    }

    updateFont(newFontSize: number) {
        this.fontSize = newFontSize;
        for (let i = 0; i < this.words.length; i++) {
            this.words[i].children[0].font = `${this.fontSize}px sans-serif`;
            this.words[i].children[0].setMinimalSize();
            this.words[i].height = this.words[i].children[0].height;
            this.words[i].width = this.words[i].children[0].width;
        }
    }

    addWords(newTotal: number) {
        if (newTotal < this.numWords) {
            let count: number = this.words.length;
            while (newTotal < this.words.length) {
                // case: focused word is getting deleted
                if (count === this.curWord) {
                    if (count !== 0) {
                        this.curWord = 0;
                        this.words[this.curWord].fill = "yellow";
                    }
                }
                // case: completed word is getting deleted
                if (this.words[this.words.length - 1].fill === "lightgreen") {
                    this.words.pop();
                    this.decrementCompletedWords();
                } else {
                    this.words.pop();
                }
                count--;
            }
            // case: game is completed after decreases the word count
            if (newTotal === this.numComplete) {
                this.pbComplete.fillWidth = 1;
                this.pbIncomplete.fillWidth = 0;
                this.progressMsg.text = `Game Completed!`;
                this.gameComplete = true;
            } else {
                this.gameComplete = false;
            }
        } else {
            this.gameComplete = false;
            const list: string [] = generateRandomWords(newTotal - this.numWords);
            // create more words and add them to the word array
            for (let i = 0; i < list.length; i++) {
                let tempContain: MySKContainer = new MySKContainer();
                let newWord: MySKLabel = new MySKLabel({
                    text: list[i],
                    align: "centre",
                    font: `${this.fontSize}px sans-serif`,
                });
                tempContain.height = newWord.height;
                tempContain.width = newWord.width;
                tempContain.fill = "white";
                tempContain.addChild(newWord)
    
                this.words.push(tempContain);
            }
            // focus first word
            if (this.words.length >= 1) {
                this.curWord = 0;
                this.words[this.curWord].fill = "yellow";
            }

            this.wordsListen();
        }
        
        this.numWords = newTotal;
        if (!this.gameComplete) {
            this.pbComplete.fillWidth = this.numComplete / this.words.length;
            this.pbIncomplete.fillWidth = 1 - (this.numComplete / this.words.length);
            this.progressMsg.text = `${this.numComplete}/${this.numWords} Words Matched!`;
        }
    }

    resetGame() {
        this.words = [];
        this.numComplete = 0;
        this.curWord = -1;
        this.gameComplete = false;

        const list: string [] = generateRandomWords(this.numWords);
        for (let i = 0; i < list.length; i++) {
            let tempContain: MySKContainer = new MySKContainer();
            let newWord: MySKLabel = new MySKLabel({
                text: list[i],
                align: "centre",
                font: `${this.fontSize}px sans-serif`,
            });
            tempContain.height = newWord.height;
            tempContain.width = newWord.width;
            tempContain.fill = "white";
            tempContain.addChild(newWord)

            this.words.push(tempContain);
        }
        this.wordsListen();

        if (this.words.length >= 1) {
            this.curWord = 0;
            this.words[this.curWord].fill = "yellow";
        }

        this.pbComplete.fillWidth = this.numComplete / this.words.length;
        this.pbIncomplete.fillWidth = 1 - (this.numComplete / this.words.length);
        this.progressMsg.text = `${this.numComplete}/${this.numWords} Words Matched!`;
    }

}