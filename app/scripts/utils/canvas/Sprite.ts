import { IS_HIDPI } from '../constants';
import { Point } from './Point';
import { Size } from './Size';

export interface SpriteConfig {
    CTX: CanvasRenderingContext2D;
    IMG: HTMLImageElement;
}

export class Sprite {

    /**
     * Image crop point origin
     */
    public origin: Point;

    /**
     * Image crop area and display size in the given context
     */
    public size: Size;

    /**
     * Sprite position in the given context
     */
    public position: Point;

    /**
     * Interface that renders and updates a single sprite
     */
    constructor(public config: SpriteConfig) {

        this.origin = new Point(0);
        this.size = new Size(0);
        this.position = new Point(0);
    }

    /**
     * Renders the sprite in the given context
     */
    public render(): this {

        let { config, origin, size, position } = this;
        let { CTX, IMG } = this.config

        let sX = IS_HIDPI ? origin.x * 2 : origin.x;
        let sY = IS_HIDPI ? origin.y * 2 : origin.y;
        let sWidth = IS_HIDPI ? size.width * 2 : size.width;
        let sHeight = IS_HIDPI ? size.height * 2 : size.height;

        CTX.drawImage(IMG,
            sX, sY,
            sWidth, sHeight,
            position.x, position.y,
            size.width, size.height);

        return this;
    }
}