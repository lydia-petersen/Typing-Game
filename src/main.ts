import {
  SKContainer,
  startSimpleKit,
  setSKRoot,
  Layout,
} from "simplekit/imperative-mode"

import { makeFillColLayout } from "./fillCol";

//local imports
import { Model } from "./model";
import { ListManager } from "./listmanager";
import { GameArea } from "./gamearea";
import { GameConsole } from "./gameconsole";
import { Toolbar } from "./toolbar";

const model = new Model();


// helper function to make a container
function makeContainer(fill: string): SKContainer {
  const container = new SKContainer();
  container.fill = fill;
  return container;
}

const root = makeContainer("white");

// BODY

const body = makeContainer("lightblue");
body.fillWidth = 1;
body.fillHeight = 1;

// LEFT SIDE

const left = makeContainer("purple");
left.fillWidth = 2;
left.fillHeight = 1;

// nested layout within left
left.addChild(new GameArea(model))
left.addChild(new GameConsole(model))
left.layoutMethod = makeFillColLayout();


// RIGHT SIDE

const right = makeContainer("pink");
right.fillWidth = 1;
right.fillHeight = 1;

right.addChild(new ListManager(model))
right.layoutMethod = makeFillColLayout();


// nested layout within body
body.addChild(left);
body.addChild(right);
body.layoutMethod = Layout.makeFillRowLayout();


root.addChild(new Toolbar(model));
root.addChild(body);


// set layout method
root.layoutMethod = makeFillColLayout();

setSKRoot(root);

startSimpleKit();
