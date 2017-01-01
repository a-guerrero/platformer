import { Rect } from '../utils/canvas/Rect';

export class Character extends Rect {

    speed: number;
    friction: number;
    velX: number;
    velY: number;
    fillStyle: string;
    isJumping: boolean;
    isJumpDisabled: boolean;
    isGrounded: boolean;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.width = 20;
        this.height = 30;

        this.speed = 5;
        this.friction = 0.8;
        this.velX = 0;
        this.velY = 0;
        this.fillStyle = 'black';
        this.isJumping = false;
        this.isJumpDisabled = false;
        this.isGrounded = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    jump() {
        if (!this.isJumpDisabled && !this.isJumping) {
            this.isJumpDisabled = true;
            this.isJumping = true;
            this.velY -= this.speed * 2;
        }
    }

    moveHandler(action: 'right' | 'left') {

        this.isMovingRight = action === 'right';
        this.isMovingLeft = action === 'left';
    }

    update(): this {

        // Move right
        if (this.isMovingRight) {
            if (this.velX < this.speed) {
                this.velX++;
            }
        }
        // Move left
        else if (this.isMovingLeft) {
            if (this.velX > -this.speed) {
                this.velX--;
            }
        }
        // Slow down and stop it
        else if (this.velX !== 0) {
            if (Math.abs(this.velX) < 0.05) {
                this.velX = 0;
            }
            else {
                this.velX *= this.friction;
            }
        }

        // Jump
        if (this.isJumping) {
            this.velY += 0.5;
        }

        return this;
    }

    render(): this {

        let { context } = this;

        this.x += this.velX;
        this.y += this.velY;

        if (this.y >= 258) {
            this.y = 258;
            this.velY = 0;
            this.isJumping = false;
        }

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
