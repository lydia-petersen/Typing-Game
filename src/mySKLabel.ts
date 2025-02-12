import { SKElementProps, SKLabel, Style } from "simplekit/imperative-mode";

type LabelAlign = "centre" | "left" | "right";

type SKLabelProps = SKElementProps & {
  text?: string;
  align?: LabelAlign;
  font?: string;
};

/**
 * A label with editable font size
 */
export class MySKLabel extends SKLabel {
  // Editable font field
  constructor(props?: SKLabelProps) {
    super(props);
    this.text = props?.text || "";
    this.font = props?.font || Style.font;
    this.setMinimalSize();
  }

  draw(gc: CanvasRenderingContext2D) {
    gc.save();

    const w = this.paddingBox.width;
    const h = this.paddingBox.height;

    gc.translate(this.x, this.y);
    gc.translate(this.margin, this.margin);

    if (this.fill) {
      gc.fillStyle = this.fill;
      gc.fillRect(0, 0, w, h);
    }

    if (this.border) {
      gc.strokeStyle = this.border;
      gc.lineWidth = 1;
      gc.strokeRect(0, 0, w, h);
    }

    // render text
    gc.font = this.font;
    gc.fillStyle = "black";
    gc.textBaseline = "middle";

    switch (this.align) {
      case "left":
        gc.textAlign = "left";
        gc.fillText(this.text, this.padding, h / 2);

        break;
      case "centre":
        gc.textAlign = "center";
        gc.fillText(this.text, w / 2, h / 2);

        break;
      case "right":
        gc.textAlign = "right";
        gc.fillText(this.text, w - this.padding, h / 2);

        break;
    }

    gc.restore();
  }
}
