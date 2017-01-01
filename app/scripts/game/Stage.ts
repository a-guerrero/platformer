export class Stage {

    x: number;
    y: number;
    width: number;
    height: number;
    xTranslateStart: number;
    xTranslateEnd: number;

    constructor(public context: CanvasRenderingContext2D) {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.xTranslateStart = 0;
        this.xTranslateEnd = 0;
    }
}
