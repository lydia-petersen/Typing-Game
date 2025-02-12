import { SKElement, LayoutMethod, Size } from "simplekit/imperative-mode"
import { Settings } from "./settings";

type FillLayoutProps = {
  gap?: number;
};

export function makeFillColLayout(
  props?: FillLayoutProps
): LayoutMethod {
  return (
    boundsWidth: number,
    boundsHeight: number,
    elements: SKElement[]
  ) => {
    return fillColLayout(boundsWidth, boundsHeight, elements, props);
  };
}

function fillColLayout(
  boundsWidth: number,
  boundsHeight: number,
  elements: SKElement[],
  { gap = 0 }: FillLayoutProps = {}
): Size {
  const newBounds: Size = { width: 0, height: 0 };

  // get total "basis" width
  const basisTotal = elements.reduce(
    (acc, el) => acc + el.heightBasis,
    0
  );

  // calculate remaining space to distribute elements
  const available = boundsHeight - (elements.length - 1) * gap;
  const remaining = available - basisTotal;

  if (Settings.debugLayout)
    console.log(
      ` fillColLayout children:${elements.length} basisTotal:${available} remaining:${remaining}`
    );

  if (Settings.layoutWarnings && remaining < 0) {
    console.warn(
      `fillColLayout: not enough space (container:${boundsHeight} < children:${basisTotal}) `
    );
  }

  // get total fill proportion
  const fillTotal = elements.reduce(
    (acc, el) => acc + el.fillHeight,
    0
  );

  // first element starts at top left
  let x = 0;
  let y = 0;
  let colWidth = 0;

  elements.forEach((el) => {
    // set element position
    el.x = x;
    el.y = y;

    // calculate element size
    let h = el.heightBasis;
    // expand or shrink element if fillHeight > 0
    if (fillTotal > 0) {
      h += (el.fillHeight / fillTotal) * remaining;
    }
    // set element size
    el.heightLayout = h;

    // elements can expand vertically too
    if (el.fillWidth > 0) {
      el.widthLayout = boundsWidth;
    }
    // update row height
    colWidth = Math.max(colWidth, el.widthLayout);
    // ready for next x position
    y += h + gap;
  });

  // calculate bounds used for layout
  const lastEl = elements.slice(-1)[0];
  newBounds.width = colWidth;
  newBounds.height = lastEl.y + lastEl.heightLayout;

  if (Settings.debugLayout)
    console.log(
      ` fillColLayout newBounds:${newBounds.width}x${newBounds.height} `
    );

  return newBounds;
}