import { Character } from './Character';

export class Antagonist extends Character {

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.speed = 0.25;
        this.fillStyle = 'red';
    }

    collisionHandler(side: 'top' | 'right' | 'bottom' | 'left', depth: number): this {

        super.collisionHandler(side, depth);

        if (!this.isDeath && (side === 'right' || side === 'left')) {

            this.isMovingLeft = side === 'right';
            this.isMovingRight = side === 'left';
        }

        return this;
    }
}
