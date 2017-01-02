import { GRAVITY } from './utils/constants';
import { Rect } from '../utils/canvas/Rect';

export class Character extends Rect {

    friction: number;
    xSpeed: number;
    ySpeed: number;
    xVel: number;
    yVel: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    isDeath: boolean;
    isJumping: boolean;
    isGrounded: boolean;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    clearWait: number;
    private clearWaitCount: number;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.width = 20;
        this.height = 30;
        this.friction = 0.75;
        this.xSpeed = 4;
        this.ySpeed = 8;
        this.xVel = 0;
        this.yVel = 0;
        this.fillStyle = 'black';
        this.isDeath = false;
        this.isJumping = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
        this.clearWait = 10;
        this.clearWaitCount = 0;
    }

    kill(): this {

        // Ends horizontal moving completly
        this.stopMove();
        this.xVel = 0;

        // Ends vertical moving completly
        this.isJumping = false;
        this.yVel = 0;

        this.isDeath = true;

        return this;
    }

    move(action: 'right' | 'left'): this {

        if (!this.isDeath) {
            this.isMovingLeft = action === 'left';
            this.isMovingRight = action === 'right';
        }

        return this;
    }

    stopMove(action?: 'right' | 'left', sharp = false): this {

        // End horizontal moving smoothly
        this.isMovingRight = !action || action === 'right' ? false : this.isMovingRight;
        this.isMovingLeft = !action || action === 'left' ? false : this.isMovingLeft;

        return this;
    }

    jump(): this {

        // Abort if already jumping
        if (!this.isJumping) {
            this.isJumping = true;
            this.yVel -= this.ySpeed;
        }

        return this;
    }

    update(): this {

        if (!this.isDeath) {

            // Move right
            if (this.isMovingRight) {
                if (this.xVel < this.xSpeed) {
                    this.xVel++;
                }
            }
            // Move left
            else if (this.isMovingLeft) {
                if (this.xVel > -this.xSpeed) {
                    this.xVel--;
                }
            }
            // Slow down and stop it
            else if (this.xVel !== 0) {
                if (Math.abs(this.xVel) < 0.05) {
                    this.xVel = 0;
                }
                else {
                    this.xVel *= this.friction;
                }
            }

            // Gravity must always push down
            this.yVel += GRAVITY;

            // Make speed || friction affect x
            this.x += this.xVel;

            // Make gravity affect y
            this.y += this.yVel;
        }

        return this;
    }

    collisionHandler(side: 'top' | 'right' | 'bottom' | 'left', depth: number): this {

        if (!this.isDeath) {
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
                    this.yVel = 0;
                    break;
                case 'bottom':
                    this.y -= depth;
                    break;
            }

            // Stop character horizontal movement
            if (side === 'left' || side === 'right') {
                this.xVel = 0;
            }

            // Stop vertical movement if character is moving down
            if (side === 'bottom' && this.yVel > 0) {
                this.yVel = 0;

                if (this.isJumping) {
                    this.isJumping = false;
                }
            }
        }

        return this;
    }

    render(): this {

        let { context } = this;

        if (this.isDeath) {
            if (this.clearWaitCount === this.clearWait) {
                // Avoid rendering
                return this;
            }
            this.clearWaitCount++;
        }

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
