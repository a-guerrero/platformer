export class Rect {

    x: number;
    y: number;
    width: number;
    height: number;

    constructor(public context: CanvasRenderingContext2D) {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    render() {

        let { context } = this;

        context.beginPath();
        context.rect(
            this.x,
            this.y,
            this.width,
            this.height)

        return this;
    }
}