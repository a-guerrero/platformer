import { Character } from './Character';

export class Antagonist extends Character {

    canJump: boolean;
    jumpWait: number;
    private jumpFrameCount: number;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        // Super defaults override
        this.ySpeed = 7;
        this.xSpeed = 0.25;
        this.fillStyle = 'red';

        // Defaults
        this.canJump = false;
        this.jumpWait = 25;
        this.jumpFrameCount = 0;
    }

    update(): this {

        if (!this.isJumping) {
            // Wait some frames before jumping
            if (this.jumpFrameCount++ === this.jumpWait) {
                // Jump
                this.jump();
                // Reset jump frame count
                this.jumpFrameCount = 0;
            }
        }

        // Update super
        super.update();

        return this;
    }

    collisionHandler(side: 'top' | 'right' | 'bottom' | 'left', depth: number): this {

        super.collisionHandler(side, depth);

        // Keep moving after side collision
        if (!this.isDeath && (side === 'right' || side === 'left')) {

            this.isMovingLeft = side === 'right';
            this.isMovingRight = side === 'left';
        }

        return this;
    }
}
