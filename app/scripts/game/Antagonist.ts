import { Character } from './Character';

export class Antagonist extends Character {

    canJump = false;
    jumpWait = 10;
    protected _jumpWaitCount = 0;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        // Super defaults override
        this.ySpeed = 7;
        this.xSpeed = 0.25;
        this.fillStyle = 'red';

        // Defaults
        this.canJump = false;
        this.jumpWait = 25;
        this._jumpWaitCount = 0;
    }

    update(): this {

        if (this.canJump && !this._isJumping) {
            // Wait some frames before jumping
            if (this._jumpWaitCount++ === this.jumpWait) {
                // Jump
                this.jump();
                // Reset jump frame count
                this._jumpWaitCount = 0;
            }
        }

        // Update super
        super.update();

        return this;
    }

    collisionHandler(side: xyDirections, depth: number): this {

        super.collisionHandler(side, depth);

        // Keep moving after side collision
        if (!this._isDeath && (side === 'right' || side === 'left')) {

            this._isMovingLeft = side === 'right';
            this._isMovingRight = side === 'left';
        }

        return this;
    }
}
