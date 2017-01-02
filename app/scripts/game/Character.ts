import { Rect } from '../utils/canvas/Rect';

export class Character extends Rect {

    speed: number;
    friction: number;
    velX: number;
    velY: number;
    fillStyle: string;
    isJumping: boolean;
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
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    jump(): this {

        // Abort if alreay jumping (user pressing jump key)
        if (!this.isJumping && this.velY === 0) {
            this.isJumping = true;
            this.velY -= this.speed * 2;
        }

        return this;
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

        // Gravity must always push down
        this.velY += 0.5;

        this.x += this.velX;
        this.y += this.velY;

        return this;
    }

    collisionHandler(side: 'top' | 'right' | 'bottom' | 'left', depth: number) {

        // Stop character horizontal movement
        if (side === 'left' || side === 'right') {
            this.velX = 0;
        }

        switch (side) {
            case 'left':
                this.x += depth;
                break;
            case 'right':
                this.x -= depth;
                break;
            case 'top':
                this.y += depth;
                // Update vertical movement
                this.velY = 0;
                break;
            case 'bottom':
                this.y -= depth;
                // Stop vertical movement if character is moving down
                if (this.velY > 0) {

                    this.velY = 0;
                }
                break;
        }
    }

    render(): this {

        let { context } = this;

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
