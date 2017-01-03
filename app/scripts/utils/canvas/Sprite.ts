import { IS_HIDPI } from '../constants';

export class Sprite {

    img: HTMLImageElement;
    xOrigin = 0;
    yOrigin = 0;
    xPosition = 0;
    yPosition = 0;
    width = 0;
    height = 0;

    /**
     * Interface that renders and updates a single sprite
     */
    constructor(public context: CanvasRenderingContext2D) {
    }

    /**
     * Renders the sprite in the given context
     */
    public render(): this {

        let { xOrigin, yOrigin, xPosition, yPosition, width, height } = this;

        let sX = IS_HIDPI ? xOrigin * 2 : xOrigin;
        let sY = IS_HIDPI ? yOrigin * 2 : yOrigin;
        let sWidth = IS_HIDPI ? width * 2 : width;
        let sHeight = IS_HIDPI ? height * 2 : height;

        this.context.drawImage(this.img,
            sX, sY,
            sWidth, sHeight,
            xPosition, yPosition,
            width, height);

        return this;
    }
}