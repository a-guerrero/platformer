import { Rect } from '../utils/canvas/Rect';

export class Bullet extends Rect {

    xSpeed: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    private firstUpdate: boolean;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.xSpeed = 12;
        this.width = 8;
        this.height = 8;
        this.fillStyle = 'white';
        this.firstUpdate = true;
    }

    dispose(): this {
        return this;
    }

    move(action: 'right' | 'left'): this {

        this.isMovingLeft = action === 'left';
        this.isMovingRight = action === 'right';

        return this;
    }

    stopMove(action?: 'right' | 'left', sharp = false): this {

        this.isMovingRight = !action || action === 'right' ? false : this.isMovingRight;
        this.isMovingLeft = !action || action === 'left' ? false : this.isMovingLeft;

        return this;
    }

    update(): this {

        if (this.firstUpdate) {
            this.firstUpdate = false;
        }
        else {
            this.x += this.isMovingRight ? this.xSpeed : -this.xSpeed;
        }

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
