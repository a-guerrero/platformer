import { isNumber } from '../guards/isNumber';

export class Point {

    public x: number;
    public y: number;

    constructor(xy: number);
    constructor(x: number, y: number);
    constructor(x?: number, y?: number) {
        this.set(x, y);
    }

    set(xy: number);
    set(x: number, y: number);
    set(x: number, y?: number) {
        this.x = x;
        this.y = isNumber(y) ? y : x;
    }
}
