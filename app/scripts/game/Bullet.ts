import { Rect } from '../utils/canvas/Rect';

export class Bullet extends Rect {

    xSpeed = 12;
    remove = false;
    fillStyle: CanvasFillStyle = 'white';

    protected _isMovingLeft = false;
    protected _isMovingRight = false;
    protected _firstUpdate = true;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.width = 8;
        this.height = 8;
    }

    get isMovingLeft() { return this._isMovingLeft; }
    get isMovingRight() { return this._isMovingRight; }

    move(action: xDirections): this {

        this._isMovingLeft = action === 'left';
        this._isMovingRight = action === 'right';

        return this;
    }

    stopMove(action?: xDirections, sharp = false): this {

        this._isMovingRight = !action || action === 'right' ? false : this._isMovingRight;
        this._isMovingLeft = !action || action === 'left' ? false : this._isMovingLeft;

        return this;
    }

    update(): this {

        if (this._firstUpdate) {
            this._firstUpdate = false;
        }
        else {
            this.x += this._isMovingRight ? this.xSpeed : -this.xSpeed;
        }

        return this;
    }

    collisionHandler(side: xyDirections, depth: number): this {

        if (side === 'left') {
            this.x += depth;
        }
        if (side === 'right') {
            this.x -= depth;
        }

        this.remove = true;
        return this;
    }

    render(): this {

        let { context } = this;

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
