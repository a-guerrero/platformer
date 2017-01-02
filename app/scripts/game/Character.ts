import { GRAVITY } from './utils/constants';
import { Rect } from '../utils/canvas/Rect';

export class Character extends Rect {

    speed: number;
    friction: number;
    velX: number;
    velY: number;
    fillStyle: string | CanvasGradient | CanvasPattern;
    isDeath: boolean;
    isJumping: boolean;
    isGrounded: boolean;
    isMovingLeft: boolean;
    isMovingRight: boolean;

    constructor(public context: CanvasRenderingContext2D) {

        super(context);

        this.width = 20;
        this.height = 30;
        this.speed = 4;
        this.friction = 0.75;
        this.velX = 0;
        this.velY = 0;
        this.fillStyle = 'black';
        this.isDeath = false;
        this.isJumping = false;
        this.isMovingLeft = false;
        this.isMovingRight = false;
    }

    kill(): this {

        this.stop(true);
        this.isDeath = true;

        return this;
    }

    stop(xy: boolean): this;
    stop(x: boolean, y: boolean): this;
    stop(x: boolean, y?: boolean): this {

        if (x) {
            this.velX = 0;
            this.isMovingRight = false;
            this.isMovingLeft = false;
        }

        if (y || (typeof y !== 'boolean' && x)) {
            this.velY = 0;
        }

        return this;
    }

    jump(): this {

        // Abort if already jumping (user pressing jump key) or if actually
        // jumping (velY not being 0 means character is moving vertically)
        if (!this.isJumping && this.velY === 0) {
            this.isJumping = true;
            this.velY -= this.speed * 2;
        }

        return this;
    }

    update(): this {

        if (!this.isDeath) {

            if (this.speed === 0.25) {
                // console.log(this.isMovingRight, this.isMovingLeft);
            }

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
            this.velY += GRAVITY;

            // Make speed || friction affect x
            this.x += this.velX;

            // Make gravity affect y
            this.y += this.velY;
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
                    this.velY = 0;
                    break;
                case 'bottom':
                    this.y -= depth;
                    break;
            }

            // Stop character horizontal movement
            if (side === 'left' || side === 'right') {
                this.velX = 0;
                // this.stop(true, false);
            }

            // Stop vertical movement if character is moving down
            if (side === 'bottom' && this.velY > 0) {
                this.stop(false, true);
            }
        }

        return this;
    }

    render(): this {

        let { context } = this;

        context.fillStyle = this.fillStyle;
        super.render();
        context.fill();

        return this;
    }
}
