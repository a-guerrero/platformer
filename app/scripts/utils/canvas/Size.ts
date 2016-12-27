import { isNumber } from '../guards/isNumber';

export class Size {

    public width: number;
    public height: number;

    constructor(widthHeight: number);
    constructor(width: number, height: number);
    constructor(width?: number, height?: number) {
        this.set(width, height);
    }

    set(widthHeight: number);
    set(width: number, height: number);
    set(width: number, height?: number) {
        this.width = width;
        this.height = isNumber(height) ? height : width;
    }
}
