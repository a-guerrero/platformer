export class Stage {

    y = 0;
    outerWidth = 0;
    outerHeight = 0;
    innerWidth = 0;
    innerHeight = 0;
    xTranslateStart = 0;
    xTranslateEnd = 0;

    protected _x = 0;

    constructor(public context: CanvasRenderingContext2D) {}

    set x (val: number) {

        let { xTranslateStart, xTranslateEnd, outerWidth, innerWidth } = this;

        if (val > xTranslateStart) {
            if (val > xTranslateEnd) {
                this._x = outerWidth - innerWidth;
            }
            else {
                this._x = xTranslateStart - val;
            }
        }
        else {
            this._x = 0;
        }
    }

    get x () {
        return this._x;
    }

    render(): this {

        let { context } = this;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(this.x, 0);

        return this;
    }
}
