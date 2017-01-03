import { Character } from './Character';

export class Antagonist extends Character {

    canJump = false;
    canShoot = false;
    shootWait = 50;
    jumpWait = 10;

    protected _shootWaitCount = 0;
    protected _jumpWaitCount = 0;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        // Super defaults override
        this.ySpeed = 6;
        this.xSpeed = 0.25;
        this.fillStyle = 'red';
        this.spriteFrames = {
            defaultRight: [28, 0],
            defaultLeft: [28, 16],
            deathRight: [42, 0],
            deathLeft: [42, 16]
        };

        // Defaults
        this.canJump = false;
        this.jumpWait = 25;
        this._jumpWaitCount = 0;
    }

    update(): this {

        // Auto jumping
        if (this.canJump && !this._isJumping) {
            if (this._jumpWaitCount++ === this.jumpWait) {
                this.jump();
                this._jumpWaitCount = 0;
            }
        }

        // Auto shooting
        if (this.canShoot) {
            if (this._shootWaitCount++ === this.shootWait) {
                this.shoot();
                this._shootWaitCount = 0;
            }
        }

        // Update super
        super.update();

        return this;
    }

    collisionHandler(side: xyDirections, depth: number): this {

        super.collisionHandler(side, depth);

        // Keep moving after side collision
        if (!this._isDeath) {
            if (side === 'right') this.move('left');
            if (side === 'left') this.move('right');
        }

        return this;
    }
}
