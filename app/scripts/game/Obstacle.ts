import { Rect } from '../utils/canvas/Rect';

export class Obstacle extends Rect {

    canKill = false;
    fillStyle: CanvasFillStyle  = 'black';

    constructor(public context: CanvasRenderingContext2D) {
        super(context);
        this.fillStyle = 'black';
    }

    render(): this {

        let { context } = this;

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
